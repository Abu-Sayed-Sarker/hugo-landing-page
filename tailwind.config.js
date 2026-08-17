/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        title: ["DM Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#002B5B",
        base: "#F2F2F2",
        grey: "#6B7280",
        light: "#707070",
        red: "#DC2626",
        blue: "#0047E9",
        green: "#16A34A",
        sky: "#BFDBFE",
        dark: "#111827"
      }
    },
  },
  plugins: [],
};
