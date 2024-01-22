"use client";

import { createContext, FC, ReactNode, useCallback, useContext, useState } from "react";
import { merge } from "lodash";

import { User } from "@/types/user";

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
  onSetUser?: UserContextType["setUser"];
  onUpdateUser?: UserContextType["updateUser"];
  onRemoveUser?: UserContextType["removeUser"];
}

export const UserProvider: FC<UserProviderProps> = ({ children, initialUser, onSetUser, onUpdateUser, onRemoveUser }) => {
  const [user, _setUser] = useState<User | null | undefined>(initialUser);

  const setUser = useCallback((user: User) => {
     _setUser(user);
    onSetUser?.(user);
  }, [_setUser]);

  const updateUser = useCallback((user: User) => {
     _setUser((prevUser) => merge(user, [prevUser]));
    onUpdateUser?.(user);
  }, [_setUser]);

  const removeUser = useCallback(() => {
     _setUser(null);
    onRemoveUser?.();
  }, [_setUser]);

  return <UserContext.Provider value={{ user, setUser, updateUser, removeUser }}>{children}</UserContext.Provider>;
};
