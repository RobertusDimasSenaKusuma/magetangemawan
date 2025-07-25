const { orange } = require('@mui/material/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      t: "0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      orange: "0px 20px 20px -15px rgba(245,56,56,0.81) ",
      "green-md": "0px 20px 40px -15px rgba(245,56,56,0.81) ",
      "green-md" : "0px 20px 40px -15px rgba(13, 183, 96, 0.81)",
      none: "none",
    },
    colors: {
      transparent: "transparent",
      black: {
        900 : "#000000",
        500: "#4F5665",
        600: "#0B132A",
      },
      orange: {
        100: "#FFECEC",
        500: "#F53855",
        300: "#FF0000",
        200: "#FF5B09"
      },blue: {
        500: "#3B5998",
      },
      pink: {
        500: "#C13584",
        
      },
      green: {
        500: "#2FAB73",
        main : "#0DB760"
      },
       green1: {
        500: "#718a40",
        main : "#718a40"
      },
      green1: {
        500: "#059669",
        main : "#059669"
      },
      white: {
        300: "#F8F8F8",
        500: "#ffffff",
      },
      gray: {
        100: "#EEEFF2",
        400: "#AFB5C0",
        500: "#DDDDDD",
      },
    },
    extend: {},
  },
  variants: {
    extend: {
      boxShadow: ["active", "hover"],
    },
  },
  plugins: [],
}
