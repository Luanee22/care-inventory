import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans KR'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        border: "var(--border)",
        ink: "var(--ink)",
        muted: "var(--ink-muted)",
        faint: "var(--ink-faint)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        accent2: "var(--accent-2)",
        "accent2-soft": "var(--accent-2-soft)",
        warn: "var(--warn)",
        "warn-soft": "var(--warn-soft)",
        critical: "var(--critical)",
        "critical-soft": "var(--critical-soft)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,16,32,0.04), 0 10px 30px -14px rgba(10,16,32,0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
