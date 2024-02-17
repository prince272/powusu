"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useHashState } from "@/hooks";
import { NextUIProvider } from "@nextui-org/system";
import { setCookie } from "cookies-next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import TopLoadingBar, { LoadingBarRef } from "react-top-loading-bar";

import { Loader } from "@/components/ui/loader";
import { ConfirmAccountModal } from "@/components/identity/confirm-account-modal";
import { ResetPasswordModal } from "@/components/identity/reset-password-modal";
import { SettingsModal } from "@/components/identity/settings-modal";
import { SignInModal } from "@/components/identity/sign-in-modal";
import { SignOutModal } from "@/components/identity/sign-out-modal";
import { SignUpModal } from "@/components/identity/sign-up-modal";

import { ModalRouterProvider } from "../components/ui/modal-router";
import { Toaster } from "../components/ui/toaster";
import { useRouteChange } from "./navigation";
import { Authorize, UserProvider, UserProviderProps } from "./user/client";

export const modals = {
  "sign-in": SignInModal,
  "sign-up": SignUpModal,
  "sign-out": SignOutModal,
  "confirm-account": ConfirmAccountModal,
  "reset-password": ResetPasswordModal,
  settings: SettingsModal
};

export interface ProvidersProps {
  children: ReactNode;
  initialUser?: UserProviderProps["initialUser"];
}

export function AppProviders({ children, initialUser }: ProvidersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topLoadingBarRef = useRef<LoadingBarRef>(null);

  useEffect(() => {
    topLoadingBarRef.current?.continuousStart();
  }, []);
  
  useRouteChange({
    onRouteChangeStart: () => {
      topLoadingBarRef.current?.continuousStart();
    },
    onRouteChangeComplete: () => {
      topLoadingBarRef.current?.complete();
    }
  });

  return (
    <>
      <UserProvider initialUser={initialUser}>
        <ModalRouterProvider modals={modals}>
          <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...{ attribute: "class", defaultTheme: "dark" }}>
              <Authorize patterns={["/portal/*"]} modals={["settings", "sign-out"]}>
                {children}
              </Authorize>
              <Toaster />
              <TopLoadingBar ref={topLoadingBarRef} color="hsl(var(--nextui-primary) / var(--nextui-primary-opacity, var(--tw-bg-opacity)))" height={4} />
            </NextThemesProvider>
          </NextUIProvider>
        </ModalRouterProvider>
      </UserProvider>
      <Script id="external-window" strategy="beforeInteractive">{`
        if (window.opener && window.opener["external-window"]) {
          // Close the external window
          window.opener["external-window"].close();
        }
      `}</Script>
      {searchParams.has("external-window") && <Loader />}
    </>
  );
}
