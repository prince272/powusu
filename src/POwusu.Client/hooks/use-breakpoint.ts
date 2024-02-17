// source: https://github.com/react-restart/hooks/blob/master/src/useBreakpoint.ts

import { useMemo } from "react";

import useMediaQuery from "./use-media-query";

export type BreakpointDirection = "up" | "down" | true;

export type BreakpointMap<TKey extends string> = Partial<Record<TKey, BreakpointDirection>>;

/**
 * Create a responsive hook we a set of breakpoint names and widths.
 * You can use any valid css units as well as a numbers (for pixels).
 *
 * **NOTE:** The object key order is important! it's assumed to be in order from smallest to largest
 *
 * ```ts
 * const useBreakpoint = createBreakpointHook({
 *  xs: 0,
 *  sm: 576,
 *  md: 768,
 *  lg: 992,
 *  xl: 1200,
 * })
 * ```
 *
 * **Watch out!** using string values will sometimes construct media queries using css `calc()` which
 * is NOT supported in media queries by all browsers at the moment. use numbers for
 * the widest range of browser support.
 *
 * @param breakpointValues A object hash of names to breakpoint dimensions
 */
export function createBreakpointHook<TKey extends string>(breakpointValues: Record<TKey, string | number>) {
  const names = Object.keys(breakpointValues) as TKey[];

  function and(query: string, next: string) {
    if (query === next) {
      return next;
    }
    return query ? `${query} and ${next}` : next;
  }

  function getNext(breakpoint: TKey) {
    return names[Math.min(names.indexOf(breakpoint) + 1, names.length - 1)];
  }

  function getMaxQuery(breakpoint: TKey) {
    const next = getNext(breakpoint);
    let value = breakpointValues[next];

    if (typeof value === "number") value = `${value - 0.2}px`;
    else value = `calc(${value} - 0.2px)`;

    return `(max-width: ${value})`;
  }

  function getMinQuery(breakpoint: TKey) {
    let value = breakpointValues[breakpoint];
    if (typeof value === "number") {
      value = `${value}px`;
    }
    return `(min-width: ${value})`;
  }

  /**
   * Match a set of breakpoints
   *
   * ```tsx
   * const MidSizeOnly = () => {
   *   const isMid = useBreakpoint({ lg: 'down', sm: 'up' });
   *
   *   if (isMid) return <div>On a Reasonable sized Screen!</div>
   *   return null;
   * }
   * ```
   * @param breakpointMap An object map of breakpoints and directions, queries are constructed using "and" to join
   * breakpoints together
   * @param window Optionally specify the target window to match against (useful when rendering into iframes)
   */
  function useBreakpoint(breakpointMap: BreakpointMap<TKey>, window?: Window): boolean;
  /**
   * Match a single breakpoint exactly, up, or down.
   *
   * ```tsx
   * const PhoneOnly = () => {
   *   const isSmall = useBreakpoint('sm', 'down');
   *
   *   if (isSmall) return <div>On a Small Screen!</div>
   *   return null;
   * }
   * ```
   *
   * @param breakpoint The breakpoint key
   * @param direction A direction 'up' for a max, 'down' for min, true to match only the breakpoint
   * @param window Optionally specify the target window to match against (useful when rendering into iframes)
   */
  function useBreakpoint(breakpoint: TKey, direction?: BreakpointDirection, window?: Window): boolean;
  function useBreakpoint(breakpointOrMap: TKey | BreakpointMap<TKey>, direction?: BreakpointDirection | Window, window?: Window): boolean {
    let breakpointMap: BreakpointMap<TKey>;

    if (typeof breakpointOrMap === "object") {
      breakpointMap = breakpointOrMap;
      window = direction as Window;
      direction = true;
    } else {
      direction = direction || true;
      breakpointMap = { [breakpointOrMap]: direction } as Record<TKey, BreakpointDirection>;
    }

    const breakpointMapString = JSON.stringify(breakpointMap);

    let query = useMemo(
      () =>
        Object.entries(JSON.parse(breakpointMapString)).reduce((query, [key, direction]) => {
          if (direction === "up" || direction === true) {
            query = and(query, getMinQuery(key as TKey));
          }
          if (direction === "down" || direction === true) {
            query = and(query, getMaxQuery(key as TKey));
          }

          return query;
        }, ""),
      [breakpointMapString]
    );

    return useMediaQuery(query, window);
  }

  return useBreakpoint;
}

export type DefaultBreakpoints = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type DefaultBreakpointMap = BreakpointMap<DefaultBreakpoints>;

export const useBreakpoint = createBreakpointHook<DefaultBreakpoints>({
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
});
