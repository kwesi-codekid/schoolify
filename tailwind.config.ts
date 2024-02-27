import { nextui } from "@nextui-org/react";

import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
