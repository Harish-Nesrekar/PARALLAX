import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        twilight: "#272036",
        mauve: "#54415E",
        plum: "#8C6680",
        rose: "#C39AA1",
        ivory: "#F0E4DD"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      },
      boxShadow: {
        glow: "0 20px 80px rgba(195,154,161,.12)"
      }
    }
  },
  plugins: []
};
export default config;
