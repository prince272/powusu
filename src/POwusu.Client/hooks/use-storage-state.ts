// Purpose: A hook to use local storage or session storage as state.
// https://github.com/SukkaW/foxact/tree/master/src/use-local-storage
import { useCallback, useMemo, useSyncExternalStore } from "react";

import { useIsomorphicEffect } from "./use-isomorphic-effect";

const stlProp = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
const hasSTL = stlProp?.writable && typeof stlProp.value === "number";

/** @private */
const noSSRError = (errorMessage?: string | undefined, nextjsDigest = "BAILOUT_TO_CLIENT_SIDE_RENDERING") => {
  const originalStackTraceLimit = Error.stackTraceLimit;

  /**
   * This is *only* safe to do when we know that nothing at any point in the
   * stack relies on the `Error.stack` property of the noSSRError. By removing
   * the strack trace of the error, we can improve the performance of object
   * creation by a lot.
   */
  if (hasSTL) {
    Error.stackTraceLimit = 0;
  }

  const error = new Error(errorMessage);

  /**
   * Restore the stack trace limit to its original value after the error has
   * been created.
   */
  if (hasSTL) {
    Error.stackTraceLimit = originalStackTraceLimit;
  }

  // Next.js marks errors with `NEXT_DYNAMIC_NO_SSR_CODE` digest as recoverable:
  // https://github.com/vercel/next.js/blob/bef716ad031591bdf94058aaf4b8d842e75900b5/packages/next/src/shared/lib/lazy-dynamic/bailout-to-csr.ts#L2
  (error as any).digest = nextjsDigest;

  (error as any).recoverableError = "NO_SSR";

  return error;
};

interface Noop {
  (...args: any[]): any;
}

/** @see https://foxact.skk.moe/noop */
const noop: Noop = () => {
  /* noop */
};

type StorageType = "localStorage" | "sessionStorage";
type NotUndefined<T> = T extends undefined ? never : T;

// StorageEvent is deliberately not fired on the same document, we do not want to change that
type CustomStorageEvent = CustomEvent<string>;
declare global {
  interface WindowEventMap {
    "foxact-use-local-storage": CustomStorageEvent;
    "foxact-use-session-storage": CustomStorageEvent;
  }
}

export type Serializer<T> = (value: T) => string;
export type Deserializer<T> = (value: string) => T;

// This type utility is only used for workaround https://github.com/microsoft/TypeScript/issues/37663
// eslint-disable-next-line @typescript-eslint/ban-types -- workaround TypeScript bug
const isFunction = (x: unknown): x is Function => typeof x === "function";

const identity = (x: any) => x;

export interface UseStorageRawOption {
  raw: true;
}

export interface UseStorageParserOption<T> {
  raw?: false;
  serializer: Serializer<T>;
  deserializer: Deserializer<T>;
}

const getServerSnapshotWithoutServerValue = () => {
  throw noSSRError("useLocalStorage cannot be used on the server without a serverValue");
};

export function createStorage(type: StorageType) {
  const FOXACT_LOCAL_STORAGE_EVENT_KEY = type === "localStorage" ? "foxact-use-local-storage" : "foxact-use-session-storage";

  const foxactHookName = type === "localStorage" ? "foxact/use-local-storage" : "foxact/use-session-storage";

  const dispatchStorageEvent =
    typeof window !== "undefined"
      ? (key: string) => {
          window.dispatchEvent(new CustomEvent<string>(FOXACT_LOCAL_STORAGE_EVENT_KEY, { detail: key }));
        }
      : noop;

  const setStorageItem =
    typeof window !== "undefined"
      ? (key: string, value: string) => {
          try {
            window[type].setItem(key, value);
          } catch {
            console.warn(`[${foxactHookName}] Failed to set value to ${type}, it might be blocked`);
          } finally {
            dispatchStorageEvent(key);
          }
        }
      : noop;

  const removeStorageItem =
    typeof window !== "undefined"
      ? (key: string) => {
          try {
            window[type].removeItem(key);
          } catch {
            console.warn(`[${foxactHookName}] Failed to remove value from ${type}, it might be blocked`);
          } finally {
            dispatchStorageEvent(key);
          }
        }
      : noop;

  const getStorageItem = (key: string) => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      return window[type].getItem(key);
    } catch {
      console.warn(`[${foxactHookName}] Failed to get value from ${type}, it might be blocked`);
      return null;
    }
  };

  const useSetStorage = <T>(key: string, serializer: Serializer<T>) =>
    useCallback(
      (v: T | null) => {
        try {
          if (v === null) {
            removeStorageItem(key);
          } else {
            setStorageItem(key, serializer(v));
          }
        } catch (e) {
          console.warn(e);
        }
      },
      [key, serializer]
    );

  function useStorage<T>(
    key: string,
    serverValue: NotUndefined<T>,
    options: UseStorageRawOption | UseStorageParserOption<T> = {
      serializer: JSON.stringify,
      deserializer: JSON.parse
    }
  ) {
    const subscribeToSpecificKeyOfLocalStorage = useCallback(
      (callback: () => void) => {
        if (typeof window === "undefined") {
          return noop;
        }

        const handleStorageEvent = (e: StorageEvent) => {
          if (
            !("key" in e) || // Some browsers' strange quirk where StorageEvent is missing key
            e.key === key
          ) {
            callback();
          }
        };
        const handleCustomStorageEvent = (e: CustomStorageEvent) => {
          if (e.detail === key) {
            callback();
          }
        };

        window.addEventListener("storage", handleStorageEvent);
        window.addEventListener(FOXACT_LOCAL_STORAGE_EVENT_KEY, handleCustomStorageEvent);
        return () => {
          window.removeEventListener("storage", handleStorageEvent);
          window.removeEventListener(FOXACT_LOCAL_STORAGE_EVENT_KEY, handleCustomStorageEvent);
        };
      },
      [key]
    );

    const serializer: Serializer<T> = options.raw ? identity : options.serializer;
    const deserializer: Deserializer<T> = options.raw ? identity : options.deserializer;

    const getClientSnapshot = () => getStorageItem(key);

    // If the serverValue is provided, we pass it to useSES' getServerSnapshot, which will be used during SSR
    // If the serverValue is not provided, we don't pass it to useSES, which will cause useSES to opt-in client-side rendering
    const getServerSnapshot = serverValue !== undefined ? () => serializer(serverValue) : getServerSnapshotWithoutServerValue;

    const store = useSyncExternalStore(subscribeToSpecificKeyOfLocalStorage, getClientSnapshot, getServerSnapshot);

    const deserializedValue = useMemo(() => (store === null ? null : deserializer(store)), [store, deserializer]);

    const setState = useCallback<React.Dispatch<React.SetStateAction<T | null>>>(
      (v) => {
        try {
          const nextState = isFunction(v) ? v(deserializedValue ?? null) : v;

          if (nextState === null) {
            removeStorageItem(key);
          } else {
            setStorageItem(key, serializer(nextState));
          }
        } catch (e) {
          console.warn(e);
        }
      },
      [key, serializer, deserializedValue]
    );

    useIsomorphicEffect(() => {
      if (getStorageItem(key) === null && serverValue !== undefined) {
        setStorageItem(key, serializer(serverValue));
      }
    }, [deserializer, key, serializer, serverValue]);

    return [deserializedValue ?? serverValue, setState] as const;
  }

  return {
    useStorage,
    useSetStorage
  };
}

const { useStorage: useLocalState } = createStorage("localStorage");
const { useStorage: useSessionState } = createStorage("sessionStorage");

export { useLocalState, useSessionState };
