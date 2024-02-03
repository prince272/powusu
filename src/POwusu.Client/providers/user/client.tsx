"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePreviousValue, useStateAsync } from "@/hooks";
import { buildCallbackUrl } from "@/utils";
import { matchPath, PathPattern } from "@/utils/matchPath";
import { deleteCookie, setCookie } from "cookies-next";
import { merge } from "lodash";
import queryString from "query-string";

import { User } from "@/types/user";
import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";

export type UserContextType = { user: User | null | undefined; setUser: (user: User) => void };

export const UserContext = createContext<User | null | undefined>(undefined!);

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};

export interface UserProviderProps {
  children: ReactNode;
  initialUser?: UserContextType["user"];
}

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, _setUser] = useStateAsync(useState<User | null | undefined>(initialUser));

  const setUser = useCallback(
    (user: User | null | undefined) => {
      _setUser(user);
      if (user) setCookie("Identity", user);
      else deleteCookie("Identity");
    },
    [_setUser]
  );

  useEffect(() => {
    api.user.next(initialUser);

    const subscribition = api.user.subscribe({
      next: (nextUser) => {
        setUser(nextUser);
      }
    });

    return () => subscribition.unsubscribe();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

interface AuthorizeProps {
  patterns: (PathPattern<string> | string)[];
  children: ReactNode;
}

export const Authorize = ({ patterns, children }: AuthorizeProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });
  const previousUrl = usePreviousValue(currentUrl);
  const matches = patterns.map((pattern) => matchPath(pattern, currentUrl));
  const currentMatch = matches.find((match) => match);

  const currentUser = useUser();

  useEffect(() => {
    if (currentMatch && !currentUser) {
      const refererUrl = !matches.some((match) => previousUrl?.startsWith(match?.pathnameBase || "")) ? previousUrl : "/";
      const callbackUrl = buildCallbackUrl({ modal: "sign-in" }, currentUrl, refererUrl);
      router.replace(callbackUrl);
    }
  }, [!!currentUser, !!currentMatch]);
  return <>{children}</>;
};
