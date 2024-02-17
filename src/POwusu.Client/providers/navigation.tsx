"use client";

import { usePathname, useSearchParams, useRouter as useNextRouter } from 'next/navigation';
import { createContext, useContext, useState, useCallback, Suspense, useEffect, forwardRef } from 'react';
import NextLink from 'next/link';


/** Types */
type RouteChangeContextProps = {
  routeChangeStartCallbacks: Function[];
  routeChangeCompleteCallbacks: Function[];
  onRouteChangeStart: () => void;
  onRouteChangeComplete: () => void;
};

type RouteChangeProviderProps = {
  children: React.ReactNode
};

/** Logic */

const RouteChangeContext = createContext<RouteChangeContextProps>(
  {} as RouteChangeContextProps
);

export const useRouteChangeContext = () => useContext(RouteChangeContext);

function RouteChangeComplete() {
  const { onRouteChangeComplete } = useRouteChangeContext();
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => onRouteChangeComplete(), [pathname, searchParams]);

  return null;
}

export const RouteChangeProvider: React.FC<RouteChangeProviderProps> = ({ children }: RouteChangeProviderProps) => {
  const [routeChangeStartCallbacks, setRouteChangeStartCallbacks] = useState<Function[]>([]);
  const [routeChangeCompleteCallbacks, setRouteChangeCompleteCallbacks] = useState<Function[]>([]);
  
  const onRouteChangeStart = useCallback(() => {
    routeChangeStartCallbacks.forEach((callback) => callback());
  }, [routeChangeStartCallbacks]);

  const onRouteChangeComplete = useCallback(() => {
    routeChangeCompleteCallbacks.forEach((callback) => callback());
  }, [routeChangeCompleteCallbacks]);
  
  return (
    <RouteChangeContext.Provider
      value={{
        routeChangeStartCallbacks,
        routeChangeCompleteCallbacks,
        onRouteChangeStart,
        onRouteChangeComplete
      }}
    >
      {children}
      <Suspense>
        <RouteChangeComplete />
      </Suspense>
    </RouteChangeContext.Provider>
  );
};


type CallbackOptions = {
  onRouteChangeStart?: Function;
  onRouteChangeComplete?: Function;
}

const useRouteChange = (options: CallbackOptions) => {
  const { routeChangeStartCallbacks, routeChangeCompleteCallbacks } = useRouteChangeContext();
  
  useEffect(() => {
    // add callback to the list of callbacks and persist it
    if (options.onRouteChangeStart) {
      routeChangeStartCallbacks.push(options.onRouteChangeStart);
    }
    if (options.onRouteChangeComplete) {
      routeChangeCompleteCallbacks.push(options.onRouteChangeComplete);
    }

    return () => {
      // Find the callback in the array and remove it.
      if (options.onRouteChangeStart) {
        const index = routeChangeStartCallbacks.indexOf(options.onRouteChangeStart);
        if (index > -1) {
          routeChangeStartCallbacks.splice(index, 1);
        }
      }
      if (options.onRouteChangeComplete) {
        const index = routeChangeCompleteCallbacks.indexOf(options.onRouteChangeComplete);
        if (index > -1) {
          routeChangeCompleteCallbacks.splice(index, 1);
        }
      }
    };
  }, [options, routeChangeStartCallbacks, routeChangeCompleteCallbacks]);
};

const useRouter = () => {
  const router = useNextRouter();
  const { onRouteChangeStart } = useRouteChangeContext();

  const { push } = router;

  router.push = (href, options) => {
    onRouteChangeStart();
    push(href, options);
  };

  return router;
};

export { useRouteChange, useRouter };

// https://github.com/vercel/next.js/blob/400ccf7b1c802c94127d8d8e0d5e9bdf9aab270c/packages/next/src/client/link.tsx#L169
function isModifiedEvent(event: React.MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
  const target = eventTarget.getAttribute("target");
  return (
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.button === 2)
  );
}

const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(function Component(
  { href, onClick, ...rest },
  ref,
) {
  const useLink = href && href.startsWith("/");
  if (!useLink) return <a href={href} onClick={onClick} {...rest} />;

  const { onRouteChangeStart } = useRouteChangeContext();

  return (
    <NextLink
      href={href}
      onClick={(event) => {
        if (!isModifiedEvent(event)) {
          const { pathname, search, hash } = window.location;
          const hrefCurrent = `${pathname}${search}${hash}`;
          const hrefTarget = href as string;
          if (hrefTarget !== hrefCurrent) {
            onRouteChangeStart();
          }
        }
        if (onClick) onClick(event);
      }}
      {...rest}
      ref={ref}
    />
  );
});

export { Link };