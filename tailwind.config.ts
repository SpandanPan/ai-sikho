import type { Config } from "tailwindcss";

// Same token values as the design-system artifact ("The Model Desk"),
// so the real app and the mockup stay visually identical.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // rgb(var(--x) / <alpha-value>) keeps opacity modifiers (bg-accent2/15)
        // working while letting the .dark class (see globals.css) repaint
        // every existing utility with no per-component dark: variants needed.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--color-ink-soft) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        "paper-raised": "rgb(var(--color-paper-raised) / <alpha-value>)",
        "paper-line": "rgb(var(--color-paper-line) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-ink": "rgb(var(--color-accent-ink) / <alpha-value>)",
        accent2: "rgb(var(--color-accent2) / <alpha-value>)",
        rust: "rgb(var(--color-rust) / <alpha-value>)",
        spark: "rgb(var(--color-spark) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["'Source Sans 3'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
