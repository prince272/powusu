import { Fira_Code as FontMono, Open_Sans as FontSans } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading"
});
