import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { fontHeading, fontMono, fontSans } from "@/components/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://princeowusu.dev"),
  applicationName: siteConfig.name,
  title: { default: siteConfig.title, template: siteConfig.titleTemplate },
  description: siteConfig.description,
  keywords: ["Prince Owusu", "Software Engineer", ".NET", "Next.js", "Ghana"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/assets/profile/1.png", alt: "Prince Owusu" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#f8f6f2",
  colorScheme: "light dark"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fontVariables = [fontSans.variable, fontHeading.variable, fontMono.variable].join(" ");

  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
