import localFont from "next/font/local";

export const fontSans = localFont({
  src: [
    { path: "../assets/fonts/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/Inter-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-body",
  display: "swap"
});

export const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-display-face",
  display: "swap"
});

export const fontMono = { variable: "--font-code" };
