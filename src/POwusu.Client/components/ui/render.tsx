"use client";

import {
  Children,
  ComponentProps,
  ComponentPropsWithRef,
  ComponentType,
  ElementType,
  forwardRef,
  Fragment,
  isValidElement,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  useEffect,
  useState
} from "react";
import { Merge } from "type-fest";

export interface SwitchProps {
  children?: ReactNode;
  switch?: Key[] | Key | null | ((value: Key | null) => boolean);
}

const Switch = polly<ComponentType, SwitchProps>(function Switch({ as: Component = Fragment, children: unknownChildren, switch: condition, ...rest }, ref?) {

  const children = (() => {
    let cases: ReactNode[] = [];
    let defaults: ReactNode[] = [];

    Children.forEach(Array.isArray(unknownChildren) ? unknownChildren : [unknownChildren], (child) => {
      if (isValidElement(child)) {
        switch (child.key != null ? "case" : "default") {
          case "case":
            if (typeof condition === "function") {
              if (condition(child.key)) {
                cases.push(child);
              }
            } else {
              const conditionKeys = Array.isArray(condition)
                ? condition
                : condition
                    ?.toString()
                    .split("|")
                    .map((key) => key as Key) || [];
              const childKeys =
                child.key
                  ?.toString()
                  .split("|")
                  .map((key) => key as Key) || [];

              if (conditionKeys.some((conditionKey) => childKeys.some((childKey) => childKey == conditionKey))) cases.push(child);
            }
            break;
          case "default":
            defaults.push(child);
            break;
        }
      } else {
        defaults.push(child);
      }
    });

    if (cases.length > 0) {
      return cases;
    }

    return defaults;
  })();

  return (
    <Component {...rest} ref={ref}>
      {children}
    </Component>
  );
});

const Mount = ({ children, clientOnly, interval } : { children: () => ReactNode, clientOnly?: boolean, interval?: number }) => {
  const [key, setKey] = useState<number | null>();
  const [isClient, setIsClient] = useState(!clientOnly);

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (interval) {
      intervalId = setInterval(() => {
        // Generate a new key to trigger re-render
        setKey((prevKey) => (prevKey || 0) + 1);
      }, interval);
    }

    return () => {
      // Clear interval on component unmount
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [interval]);

  return <Fragment key={key}>{isClient ? children() : null}</Fragment>;
};

export { Switch, Mount };



// React Polly
// source: https://github.com/dgca/react-polly
/**
 * @desc Utility type for getting props type of React component.
 * It takes `defaultProps` into an account - making props with defaults optional.
 * @see {@link https://github.com/sindresorhus/type-fest/blob/79f6b6239b270abc1c1cd20812a00baeb7f9fb57/source/merge.d.ts}
 */
type PropsOf<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = JSX.LibraryManagedAttributes<T, ComponentProps<T>>;

type RefTypeOf<T extends ElementType> = ComponentPropsWithRef<T>["ref"];

type PolymorphicProps<C extends ElementType, Props = {}> = Merge<PropsOf<C>, Props> & {
  as?: C;
  ref?: RefTypeOf<C>;
};

interface PollyComponentWithRef<DefaultType extends ElementType, Props = {}> {
  <C extends ElementType = DefaultType>(props: PolymorphicProps<C, Props>, ref: RefTypeOf<C>): ReactElement | null;
  displayName?: string | undefined;
}

export function polly<DefaultType extends ElementType, Props = {}>(baseComponent: PollyComponentWithRef<DefaultType, Props>) {
  // @ts-ignore: Unfortunately, we can't derive the right ref type to pass
  // to forwardRef at this time, so we'll ignore this warning and force the
  // type of `WrappedComponent`.
  const WrappedComponent: typeof baseComponent = forwardRef(baseComponent);

  WrappedComponent.displayName = baseComponent.name || "Polly";

  return WrappedComponent;
}
