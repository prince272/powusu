import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export const useEffectAfterMount = (cb: EffectCallback, dependencies: DependencyList | undefined) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return cb();
    }
    mounted.current = true;
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};
