/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        smokey: {
          50: "#f5f5f5",
          100: "#e8e8e8",
          200: "#d1d1d1",
          300: "#b3b3b3",
          400: "#9a9a9a",
          500: "#808080",
          600: "#6b6b6b",
          700: "#5a5a5a",
          800: "#4a4a4a",
          900: "#3d3d3d",
          950: "#2a2a2a",
        },
        cream: {
          50: "#fefdfb",
          100: "#fdf9f3",
          200: "#faf2e6",
          300: "#f5e6d0",
          400: "#eed4b3",
          500: "#e4be8e",
          600: "#d9a668",
          700: "#c88d4a",
          800: "#a9733d",
          900: "#8a5f35",
          950: "#4a3019",
        },
      },

      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
