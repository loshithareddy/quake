
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1A1F2C", // Dark purple
          light: "#2D3748", // Slightly lighter dark color
        },
        mint: {
          DEFAULT: "#A3BFFA", // Light indigo as accent
        },
        divine: {
          DEFAULT: "#4C51BF", // Another indigo variant
        }
      },
      fontFamily: {
        sans: ["Inter var", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
