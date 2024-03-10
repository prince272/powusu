"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback, usePreviousValue, useStateAsync } from "@/hooks";
import { matchPath, PathPattern } from "@/utils/match-path";
import { deleteCookie, setCookie } from "cookies-next";
import queryString from "query-string";

import { User } from "@/types/user";
import { api } from "@/lib/api";

export type UserContextType = { user: User | null | undefined; setUser: (user: User | null | undefined) => void };

export const UserContext = createContext<UserContextType>(undefined!);

export const useUser = () => {
  const context = useContext(UserContext);
  return context.user;
};

export interface UserProviderProps {
  children: ReactNode;
  initialUser?: UserContextType["user"];
}

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, _setUser] = useStateAsync(
    useState<User | null | undefined>(() => {
      api.user.next(initialUser);
      return initialUser;
    })
  );

  const setUser = useCallback(
    (user: User | null | undefined) => {
      _setUser(user);
      if (user) setCookie("Identity", user);
      else deleteCookie("Identity");
    },
    [_setUser]
  );

  useEffect(() => {
    const subscription = api.user.subscribe({
      next: (nextUser) => {
        setUser(nextUser);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

interface AuthorizeProps {
  patterns: (PathPattern<string> | string)[];
  modals: string[];
  children: ReactNode;
}

export const Authorize = ({ patterns, modals, children }: AuthorizeProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });

  const matches = patterns.map((pattern) => matchPath(pattern, currentUrl)).filter((_) => _);
  const currentMatch = matches.find((match) => match);
  const currentUser = useUser();
  const currentModal = modals.find((modal) => modal == searchParams.get("modal"));

  const unauthorize = useDebouncedCallback(
    () => {
      if ((currentMatch || currentModal) && !currentUser) {
        const returnUrl = queryString.stringifyUrl({
          url: "/",
          query: {
            modal: "sign-in",
            callback: searchParams.get("callback") || pathname
          }
        });

        router.replace(returnUrl);
      } else if (currentUser) {
      }
    },
    [!!currentUser, !!currentMatch, !!currentModal],
    500
  );

  useEffect(() => {
    unauthorize();
  }, [!!currentUser, !!currentMatch, !!currentModal]);

  return <>{children}</>;
};
