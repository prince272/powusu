import axios, { AxiosRequestConfig, AxiosResponse, HttpStatusCode, isAxiosError } from "axios";
import { cloneDeep, merge } from "lodash";
import PQueue from "p-queue";
import { Subject } from "rxjs";

import { User } from "@/types/user";
import { apiConfig } from "@/config/api";

class UserSubject extends Subject<User | null | undefined> {
  constructor(public value?: User | null | undefined) {
    super();
  }

  next(value: User | null | undefined) {
    this.value = cloneDeep(value ? merge(this.value, value) : value);
    super.next(cloneDeep(this.value));
  }
}

const cts = axios.CancelToken.source();
const api = Object.assign({}, axios.create({ ...apiConfig, cancelToken: cts.token }), { user: new UserSubject(), cts });

const apiQueue = new PQueue({ concurrency: 1 });

// Add a request interceptor
api.interceptors.request.use(
  (requestConfig) => {
    const currentUser = api.user.value;
    if (currentUser) {
      requestConfig.headers["Authorization"] = `${currentUser.tokenType} ${currentUser.accessToken}`;
      api.defaults.headers["Authorization"] = `${currentUser.tokenType} ${currentUser.accessToken}`;
    } else {
      delete requestConfig.headers["Authorization"];
      delete api.defaults.headers["Authorization"];
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isAxiosError(error)) return Promise.reject(error);
    if (error.response?.status != HttpStatusCode.Unauthorized) return Promise.reject(error);

    const currentUser = api.user.value;
    if (!currentUser) return Promise.reject(error);

    const requestConfig = error.config as AxiosRequestConfig & { retryCount: number };

    requestConfig.retryCount = (requestConfig.retryCount || 0) + 1;

    if (requestConfig.retryCount > 1) {
      return Promise.reject(error);
    }

    if (apiQueue.size != 0 || apiQueue.pending != 0) {
      return apiQueue.onIdle().then(() => api.request(requestConfig!));
    }

    return apiQueue.add(() => {
      const currentUser = api.user.value;
      if (!currentUser) return Promise.reject(error);
      return api
        .post("/identity/tokens/refresh", { token: currentUser.refreshToken })
        .then((response) => ({ response }))
        .catch((refreshError) => ({ refreshError }))
        .then(({ refreshError, response }: { response?: AxiosResponse<any, any>; refreshError?: any }) => {
          if (response) {
            api.user.next(response.data);
            return api.request(requestConfig!);
          }

          if (refreshError?.response?.status == HttpStatusCode.BadRequest) api.user.next(null);
          return Promise.reject(error);
        });
    });
  }
);

export { api };
