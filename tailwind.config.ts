import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0908",
        soot: "#12100d",
        bone: "#e8e0cf",
        parchment: "#d9cfb8",
        amber: "#c9a227",
        ember: "#b4532a",
        moss: "#6b7d5a",
        blood: "#7a2e2e",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Spectral", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "Courier New", "monospace"],
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "8%": { opacity: "0.82" },
          "9%": { opacity: "1" },
          "38%": { opacity: "0.94" },
          "39%": { opacity: "1" },
          "71%": { opacity: "0.88" },
          "72%": { opacity: "1" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-8px,0)" },
        },
        swim: {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(-2deg)" },
          "50%": { transform: "translate3d(10px,-6px,0) rotate(2deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(5px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(3px)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        flicker: "flicker 7s infinite",
        drift: "drift 9s ease-in-out infinite",
        swim: "swim 7s ease-in-out infinite",
        shake: "shake 0.45s ease-in-out",
        rise: "rise 0.8s ease-out both",
        pulseGlow: "pulseGlow 3.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
