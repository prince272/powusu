import { Fira_Sans as FontHeading, Fira_Code as FontMono, Open_Sans as FontSans } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "700"
});
