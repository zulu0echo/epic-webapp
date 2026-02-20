import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        epic: {
          // Institutional palette: deep navy, slate, muted blue
          navy: "#0f172a",
          "navy-light": "#1e293b",
          "navy-muted": "#334155",
          charcoal: "#1e293b",
          slate: "#475569",
          "slate-muted": "#64748b",
          "slate-subtle": "#94a3b8",
          surface: "#f8fafc",
          "surface-elevated": "#ffffff",
          border: "#e2e8f0",
          "border-subtle": "#f1f5f9",
          muted: "#64748b",
          ink: "#0f172a",
          paper: "#fafafa",
          "blue-muted": "#475569",
          "accent": "#334155",
          "accent-hover": "#1e293b",
        },
      },
      fontFamily: {
        serif: ["var(--font-source-serif)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-source-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        epic: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "epic-md": "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        "epic-lg": "0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)",
      },
      borderRadius: {
        epic: "0.375rem",
        "epic-lg": "0.5rem",
      },
      spacing: {
        "section": "4rem",
        "section-sm": "3rem",
      },
    },
  },
  plugins: [],
};

export default config;
