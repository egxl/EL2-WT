import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        carbon: {
          950: "#0B0F17", // Canvas background
          900: "#0F1522", // Recessed well
          850: "#131A26", // Card plate surface
          800: "#192233", // Elevated hover surface
          700: "#222F46", // Border / highlight ring
          600: "#334460",
        },
        volt: {
          300: "#EEFF85",
          400: "#E2FE55",
          500: "#D4F63D", // High-visibility athletic volt
          600: "#B8DC1E",
          700: "#96B80E",
        },
        cobalt: {
          400: "#60A5FA",
          500: "#38BDF8", // Dynamic track blue
          600: "#2563EB",
        },
        // Backwards-compatible aliases
        midnight: {
          950: "#0B0F17",
          900: "#0F1522",
          850: "#131A26",
          800: "#182232",
          700: "#222F46",
          600: "#334460",
        },
        brand: {
          50: "#F7FEE7",
          100: "#ECFCCB",
          200: "#D9F99D",
          300: "#BEF264",
          400: "#E2FE55",
          500: "#D4F63D",
          600: "#B8DC1E",
          700: "#96B80E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top, 0px)",
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
      },
      boxShadow: {
        "plate": "0 1px 1px rgba(0, 0, 0, 0.4), 0 8px 24px -6px rgba(0, 0, 0, 0.6)",
        "plate-inset": "inset 0 1px 2px rgba(0, 0, 0, 0.6)",
        "volt-glow": "0 0 24px -4px rgba(212, 246, 61, 0.35)",
        "cobalt-glow": "0 0 24px -4px rgba(56, 189, 248, 0.35)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shake: "shake 0.35s cubic-bezier(.36,.07,.19,.97) both",
      },
      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
