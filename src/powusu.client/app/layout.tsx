import "@/styles/globals.css";

import { ReactNode } from "react";
import { Metadata } from "next";
import { Providers } from "@/providers";
import { getUser } from "@/providers/user/server";
import { cn } from "@/utils";

import { siteConfig } from "@/config/site";
import { fontHeading, fontSans } from "@/components/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  const currentUser = getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontHeading.variable)}>
        <Providers initialUser={currentUser}>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
