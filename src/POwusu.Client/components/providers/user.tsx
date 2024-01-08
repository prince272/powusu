"use client";

import { createContext, FC, ReactNode, useCallback, useContext, useState } from "react";
import { User } from "@/types/user";
import { merge } from "lodash";

export interface UserContextType extends User {
  set: (user: User) => void;
  update: (user: User) => void;
  clear: () => void;
}

export const UserContext = createContext<UserContextType>(undefined!);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

export const UserProvider: FC<{ children: ReactNode; value: User }> = ({ children, value }) => {
  const [user, setUser] = useState<User>(value);

  const updateUser = useCallback(
    () => (user: User) => {
      setUser((prevUser) => merge(user, [prevUser]));
    },
    [setUser]
  );

  const clearUser = useCallback(
    () => () => {
      setUser({ authenticated: false } as User);
    },
    [setUser]
  );

  return <UserContext.Provider value={{ ...user, set: setUser, update: updateUser, clear: clearUser }}>{children}</UserContext.Provider>;
};
