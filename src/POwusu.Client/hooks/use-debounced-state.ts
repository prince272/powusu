// source: https://github.com/react-restart/hooks/blob/master/src/useDebouncedState.ts

import { Dispatch, SetStateAction, useState } from "react";

import { useDebouncedCallback } from "./use-debounced-callback";

/**
 * Similar to `useState`, except the setter function is debounced by
 * the specified delay.
 *
 * ```ts
 * const [value, setValue] = useDebouncedState('test', 500)
 *
 * setValue('test2')
 * ```
 *
 * @param initialState initial state value
 * @param delay The milliseconds delay before a new value is set
 */
export function useDebouncedState<T>(initialState: T, delay: number): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(initialState);
  const debouncedSetState = useDebouncedCallback<Dispatch<SetStateAction<T>>>(setState, [], delay);
  return [state, debouncedSetState];
}
