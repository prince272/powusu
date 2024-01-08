"use client";

import * as React from "react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { User } from "@/types/user";

import { ModalRouterProvider } from "./modal-router";
import { UserProvider } from "./user";
import { modals } from "../modals";

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <UserProvider value={{ authenticated: false } as User}>
      <ModalRouterProvider modals={modals}>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NextUIProvider>
      </ModalRouterProvider>
    </UserProvider>
  );
}
