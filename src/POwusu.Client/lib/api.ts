import axios, { AxiosRequestConfig, HttpStatusCode, isAxiosError } from "axios";
import PQueue from "p-queue";
import { BehaviorSubject } from "rxjs";

import { User } from "@/types/user";
import { apiConfig } from "@/config/api";

const apiUser = new BehaviorSubject<User | null | undefined>(undefined);
const apiInstance = axios.create(apiConfig);
const apiQueue = new PQueue({ concurrency: 1 });

// Add a request interceptor
apiInstance.interceptors.request.use(
  (requestConfig) => {
    const currentUser = apiUser.getValue();
    if (currentUser) {
      requestConfig.headers.setAuthorization(`${currentUser.tokenType} ${currentUser.accessToken}`);
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isAxiosError(error)) return Promise.reject(error);
    if (error.response?.status != HttpStatusCode.Unauthorized) return Promise.reject(error);

    const currentUser = apiUser.getValue();
    if (!currentUser) return Promise.reject(error);

    const requestConfig = error.config as AxiosRequestConfig & { retryCount: number };

    requestConfig.retryCount = (requestConfig.retryCount || 0) + 1;

    if (requestConfig.retryCount > 1) {
      return Promise.reject(error);
    }

    if (apiQueue.size != 0 || apiQueue.pending != 0) {
      return apiQueue.onIdle().then(() => apiInstance.request(requestConfig!));
    }

    return apiQueue.add(() =>
      apiInstance
        .post("/identity/tokens/refresh", { token: currentUser.refreshToken })
        .then((response) => {
          apiUser.next(response.data);
          return apiInstance.request(requestConfig!);
        })
        .catch((refreshError) => {
          if (isAxiosError(refreshError)) {
            if (refreshError.response?.status == HttpStatusCode.BadRequest) {
              apiUser.next(null);
            }
          }
          apiUser.next(null);
          return Promise.reject(error);
        })
    );
  }
);

const api = Object.assign({}, apiInstance, { user: apiUser });
export { api };
