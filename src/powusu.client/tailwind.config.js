/** @type {import('tailwindcss').Config} */

import { nextui } from "@nextui-org/theme";

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./assets/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    fontFamily: {
      sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono],
      heading: ["var(--font-heading)", ...defaultTheme.fontFamily.sans]
    }
  },
  darkMode: "class",
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), nextui()]
};
