import "@/styles/globals.css";

import { ReactNode } from "react";
import { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { AppProviders } from "@/providers";
import { getUser } from "@/providers/user/server";
import { cn } from "@/utils";

import { siteConfig } from "@/config/site";
import { api } from "@/lib/api";
import { RouteChangeProvider } from "@/components/ui/navigation";
import { fontHeading, fontSans } from "@/components/fonts";

const APP_NAME = "Prince App";
const APP_DEFAULT_TITLE = "Prince Owusu";
const APP_TITLE_TEMPLATE = "%s - Prince Owusu";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  other: {
    "apple-mobile-web-app-title": "Prince",
    "application-name": "Prince",
    "msapplication-TileColor": "#ffffff",
    "msapplication-config": "/browserconfig.xml"
  },
  icons: {
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180"
    },
    icon: [
      {
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32"
      },
      {
        url: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16"
      }
    ],
    shortcut: {
      url: "/favicon.ico"
    },
    other: [
      {
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5"
      }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ]
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  const currentUser = getUser(cookies);
  api.user.next(currentUser);

  _api.setFetch(fetch);

  return (
    <html lang="en" suppressHydrationWarning className={cn("bg-background font-sans text-foreground antialiased", fontSans.variable, fontHeading.variable)}>
      <head />
      <body>
        <RouteChangeProvider>
          <AppProviders initialUser={currentUser}>{children}</AppProviders>
        </RouteChangeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
