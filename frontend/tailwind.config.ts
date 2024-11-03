import type { Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "540px",
      },
      backgroundImage: {
        "hero-section-title":
          "linear-gradient(91deg, #FFF 32.88%, rgba(255, 255, 255, 0.40) 99.12%)",
        "hero-section-centered-navbar":
          "linear-gradient(137deg, #F4F4F5 34.15%, #F8E5EC 46.96%, #FDD0DF 63.99%, #E4D4F4 75.82%, #A9EAF0 98.9%)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
