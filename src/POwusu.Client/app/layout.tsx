import "@/styles/globals.css";

import { ReactNode } from "react";
import { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { AppProviders } from "@/providers";
import { getUser } from "@/providers/user/server";
import { cn } from "@/utils";
import { GoogleAnalytics } from "@next/third-parties/google";

import { siteConfig } from "@/config/site";
import { api } from "@/lib/api";
import { RouteChangeProvider } from "@/components/ui/navigation";
import { fontHeading, fontSans } from "@/components/fonts";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate
  },
  description: siteConfig.description,
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
    title: siteConfig.title
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/favicon-256x256.png",
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
    images: "/favicon-256x256.png",
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

  return (
    <html lang="en" suppressHydrationWarning className={cn("bg-background font-sans text-foreground antialiased", fontSans.variable, fontHeading.variable)}>
      <head />
      <body>
        <RouteChangeProvider>
          <AppProviders initialUser={currentUser}>{children}</AppProviders>
        </RouteChangeProvider>
      </body>
      <GoogleAnalytics gaId="G-TM5XSPVR00" />
    </html>
  );
};

export default RootLayout;
