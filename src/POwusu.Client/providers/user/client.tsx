"use client";

import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback, usePreviousValue, useStateAsync } from "@/hooks";
import { buildCallbackUrl } from "@/utils";
import { matchPath, PathPattern } from "@/utils/matchPath";
import { merge } from "lodash";
import queryString from "query-string";

import { User } from "@/types/user";
import { useRouter } from "@/hooks/use-router";

export type UserContextType = { user: User | null | undefined; setUser: (user: User) => void; updateUser: (user: User) => void; removeUser: () => void };

export const UserContext = createContext<UserContextType>(undefined!);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

export interface UserProviderProps {
  children: ReactNode;
  initialUser?: UserContextType["user"];
  onSetUser?: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onRemoveUser?: () => void;
}

export const UserProvider: FC<UserProviderProps> = ({ children, initialUser, onSetUser, onUpdateUser, onRemoveUser }) => {
  const [user, _setUser] = useStateAsync(useState<User | null | undefined>(initialUser));

  const setUser = useCallback(
    (user: User) => {
      _setUser(user);
      onSetUser?.(user);
    },
    [_setUser]
  );

  const updateUser = useCallback(
    (user: User) => {
      _setUser((prevUser) => merge(user, [prevUser]));
      onUpdateUser?.(user);
    },
    [_setUser]
  );

  const removeUser = useCallback(() => {
    _setUser(null);
    onRemoveUser?.();
  }, [_setUser]);

  return <UserContext.Provider value={{ user, setUser, updateUser, removeUser }}>{children}</UserContext.Provider>;
};

export const Authorize: FC<{ patterns: (PathPattern<string> | string)[]; children: ReactNode }> = ({ patterns, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = queryString.stringifyUrl({ url: pathname, query: Object.fromEntries(searchParams) });
  const previousUrl = usePreviousValue(currentUrl);
  const matches = patterns.map((pattern) => matchPath(pattern, currentUrl));
  const currentMatch = matches.find((match) => match);

  const { user: currentUser } = useUser();

  useEffect(() => {

    if (currentMatch && !currentUser) {
      const refererUrl = !matches.some((match) => previousUrl?.startsWith(match?.pathnameBase || "")) ? previousUrl : "/";
      const callbackUrl = buildCallbackUrl({ modal: "sign-in" }, currentUrl, refererUrl);
      router.replace(callbackUrl);
    }
    
  }, [!!currentUser, !!currentMatch]);
  return <>{children}</>;
};
