import { AxiosResponse, isAxiosError } from "axios";
import { isIdempotentRequestError, isNetworkError } from "axios-retry";

export const getErrorTitle = (error: any, unknownTitle?: string) => {
  let title = "";

  if (isAxiosError(error)) {
    if (error.response) {
      const errors = Object.entries<string[]>(error.response?.data?.errors || {});
      title = (errors.length == 1 && errors[0][1][0]) || error.response.data?.title;
    } else if (isNetworkError(error)) {
      title = "Check your internet connection.";
    } else if (isIdempotentRequestError(error)) {
      title = "Something went wrong, Please try again.";
    }
  }

  title = title || unknownTitle || "Something went wrong.\nPlease try again later.";
  return title;
};

export const getError = (error: unknown) => {
  if (error instanceof Error) {
    // If it's a standard JavaScript Error object

    const response = isAxiosError(error) ? error?.response : null;

    return {
      data: response?.data,
      status: response?.status,
      title: getErrorTitle(error),
      detail: response?.data?.detail || "",
      fields: Object.entries<string[]>(response?.data?.errors || {})
      // Add any other properties you want to include
    } as ApiError;
  } else if (typeof error === "string") {
    // If it's a string error message
    return {
      title: getErrorTitle(error),
      detail: "An unexpected issue for which the specific cause is presently unidentified.",
      fields: []
    } as ApiError;
  } else {
    // For other cases, convert to a generic message
    return {
      title: getErrorTitle(error),
      detail: "An unexpected issue for which the specific cause is presently unidentified.",
      fields: []
    } as ApiError;
  }
};

export type ApiError = {
  data?: any;
  title: string;
  fields: [string, string[]][];
  status?: number;
};

export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};

export const getApiResponse = async <T = any>(response: Promise<AxiosResponse<T, any>>): Promise<ApiResponse<T>> => {
  try {
    const axiosResponse = await response;
    return {
      data: axiosResponse.data as T
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      error: getError(error)
    };
  }
};
