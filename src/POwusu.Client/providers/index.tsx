"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useHashState } from "@/hooks";
import { HeroUIProvider } from "@heroui/system";
import { setCookie } from "cookies-next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import TopLoadingBar, { LoadingBarRef } from "react-top-loading-bar";

import { api } from "@/lib/api";
import { AutoPushNotificationModal } from "@/components/ui/auto-push-notification-modal";
import { PageLoader } from "@/components/ui/page-loader";
import { ConfirmAccountModal } from "@/components/portal/identity/confirm-account-modal";
import { ResetPasswordModal } from "@/components/portal/identity/reset-password-modal";
import { SettingsModal } from "@/components/portal/identity/settings-modal";
import { SignInModal } from "@/components/portal/identity/sign-in-modal";
import { SignUpModal } from "@/components/portal/identity/sign-up-modal";

import { useRouteChange } from "../components/ui/navigation";
import { Toaster } from "../components/ui/toaster";
import { ModalRouterProvider } from "./modal-router";
import { Authorize, UserProvider, UserProviderProps } from "./user/client";

export const modals = {
  "sign-in": SignInModal,
  "sign-up": SignUpModal,
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
          <HeroUIProvider navigate={router.push}>
            <NextThemesProvider {...{ attribute: "class", defaultTheme: "dark" }}>
              <Authorize patterns={["/portal/*"]} modals={["settings", "sign-out"]}>
                {children}
              </Authorize>
              <Toaster />
              <TopLoadingBar ref={topLoadingBarRef} color="hsl(var(--heroui-primary) / var(--heroui-primary-opacity, var(--tw-bg-opacity)))" height={4} />
              <AutoPushNotificationModal />
            </NextThemesProvider>
          </HeroUIProvider>
        </ModalRouterProvider>
      </UserProvider>
      <Script id="external-window" strategy="beforeInteractive">{`
        if (window.opener && window.opener["external-window"]) {
          // Close the external window
          window.opener["external-window"].close();
        }
      `}</Script>
      {searchParams.has("external-window") && <PageLoader />}
    </>
  );
}
