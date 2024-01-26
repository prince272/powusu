import { AxiosResponse, isAxiosError } from "axios";
import { isIdempotentRequestError, isNetworkError } from "axios-retry";

export const getErrorMessage = (error: any) => {
  let message = "";

  if (isAxiosError(error)) {
    if (error.response) {
      const errors = Object.entries<string[]>(error.response?.data?.errors || {});
      message = (errors.length == 1 && errors[0][1][0]) || error.response.data?.title;
    } else if (isNetworkError(error)) {
      message = "Check your internet connection.";
    } else if (isIdempotentRequestError(error)) {
      message = "Something went wrong, Please try again.";
    }
  } else if (typeof error === "object" && error !== null) {
    message = error.title;
  } else {
    return (message = error);
  }

  message = message ? message : "Something went wrong.\nPlease try again later.";
  return message;
};

export type ApiError = {
  title: string;
  message?: string;
  name?: string;
  stack?: string;
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

    const getError = (error: unknown) => {
      if (error instanceof Error) {
        // If it's a standard JavaScript Error object
        return {
          title: getErrorMessage(error),
          message: error.message,
          name: error.name,
          stack: error.stack
          // Add any other properties you want to include
        };
      } else if (typeof error === "string") {
        // If it's a string error message
        return {
          title: getErrorMessage(error),
          message: error
        };
      } else {
        // For other cases, convert to a generic message
        return {
          title: getErrorMessage(error),
          message: "An unknown error occurred."
        };
      }
    };

    return {
      error: getError(error)
    };
  }
};
