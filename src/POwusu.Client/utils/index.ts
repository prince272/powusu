import { ClassValue, clsx } from "clsx";
import queryString, { StringifiableRecord } from "query-string";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const forwardPropsToChildren = (children: React.ReactNode, props: any) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });
};
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseJSON(text: string | null | undefined): any | null {
  if (text === undefined || text === null) {
    return text;
  }
  try {
    return JSON.parse(text!);
  } catch (error) {
    console.warn("Parsing JSON:", error);
    return null;
  }
}

export function stringifyJSON(value: any): string | null {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn("Stringifying JSON:", error);
    return null;
  }
}

export function compareSearchParams(params1: URLSearchParams, params2: URLSearchParams): boolean {
  // Get an array of key-value pairs for each set of search parameters
  const entries1 = Array.from(params1.entries());
  const entries2 = Array.from(params2.entries());

  // Check if the number of key-value pairs is the same
  if (entries1.length !== entries2.length) {
    return false;
  }

  // Check if each key-value pair in the first set is present in the second set
  for (const [key, value] of entries1) {
    if (!entries2.some(([otherKey, otherValue]) => key === otherKey && value === otherValue)) {
      return false;
    }
  }

  // Check if each key-value pair in the second set is present in the first set
  for (const [key, value] of entries2) {
    if (!entries1.some(([otherKey, otherValue]) => key === otherKey && value === otherValue)) {
      return false;
    }
  }

  // If all checks pass, the search parameters are equal
  return true;
}

export function removeBaseUrl(url: string) {
  /*
   * Replace base URL in given string, if it exists, and return the result.
   *
   * e.g. "http://localhost:8000/api/v1/blah/" becomes "/api/v1/blah/"
   *      "/api/v1/blah/" stays "/api/v1/blah/"
   */
  var baseUrlPattern = /^https?:\/\/[a-z\:0-9.]+/;
  var result = "";

  var match = baseUrlPattern.exec(url);
  if (match != null) {
    result = match[0];
  }

  if (result.length > 0) {
    url = url.replace(result, "");
  }

  return url;
}