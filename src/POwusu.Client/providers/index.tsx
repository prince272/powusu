"use client";

import * as React from "react";
import { ReactNode, useEffect } from "react";
import { parseJSON } from "@/utils";
import { NextUIProvider } from "@nextui-org/system";
import { setCookie } from "cookies-next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

import { ExternalWindow } from "@/lib/external-window";
import { useRouter } from "@/hooks/use-router";
import { ConfirmAccountModal } from "@/components/identity/confirm-account-modal";
import { ResetPasswordModal } from "@/components/identity/reset-password";
import { SignInModal } from "@/components/identity/sign-in-modal";
import { SignUpModal } from "@/components/identity/sign-up-modal";

import { Toaster } from "../components/ui/toaster";
import { ModalRouterProvider } from "../components/ui/modal-router";
import { UserProvider, UserProviderProps } from "./user/client";

export const modals = {
  "sign-in": SignInModal,
  "sign-up": SignUpModal,
  "confirm-account": ConfirmAccountModal,
  "reset-password": ResetPasswordModal
};

export interface ProvidersProps extends UserProviderProps {
  children: ReactNode;
}

export function Providers({ children, initialUser }: ProvidersProps) {
  const router = useRouter();

  return (
    <UserProvider
      initialUser={initialUser}
      onSetUser={(user) => setCookie("currentUser", user)}
      onUpdateUser={(user) => setCookie("currentUser", user)}
      onRemoveUser={() => setCookie("currentUser", null)}
    >
      <ModalRouterProvider modals={modals}>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider {...{ attribute: "class", defaultTheme: "dark" }}>
            {children}
            <Toaster />
            <NextTopLoader color="hsl(var(--nextui-primary) / var(--nextui-primary-opacity, var(--tw-bg-opacity)))" showSpinner={false} />
          </NextThemesProvider>
        </NextUIProvider>
      </ModalRouterProvider>
    </UserProvider>
  );
}
