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
        // Remap the built-in slate scale to the report's indigo/periwinkle ramp
        // so existing `slate-*` utilities across the app pick up the new design.
        slate: {
          50: "#f4f6fd",
          100: "#e9ecf9",
          200: "#dde2f6",
          300: "#ccd3f4",
          400: "#aab2e6",
          500: "#8590d9",
          600: "#5b68c7",
          700: "#4a55b0",
          800: "#3f4aa0",
          900: "#2a3170",
          950: "#101349",
        },
        epic: {
          // Report palette: deep indigo cover, pale yellow accent, periwinkle interior
          navy: "#101349",
          "navy-light": "#1a1e5c",
          "navy-muted": "#3f4aa0",
          charcoal: "#1a1e5c",
          slate: "#5b68c7",
          "slate-muted": "#8590d9",
          "slate-subtle": "#aab2e6",
          surface: "#e9ecf9",
          "surface-elevated": "#ffffff",
          border: "#ccd3f4",
          "border-subtle": "#dde2f6",
          muted: "#8590d9",
          ink: "#3f4aa0",
          paper: "#e2e6f7",
          "blue-muted": "#5b68c7",
          accent: "#3f4aa0",
          "accent-hover": "#101349",
          yellow: "#f2e96b",
          "yellow-soft": "#f6efa0",
        },
      },
      fontFamily: {
        serif: ["var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display": ["2.75rem", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "display-sm": ["2.1rem", { lineHeight: "1.15", letterSpacing: "-0.03em" }],
      },
      boxShadow: {
        epic: "none",
        "epic-md": "none",
        "epic-lg": "none",
      },
      borderRadius: {
        epic: "0.625rem",
        "epic-lg": "1.125rem",
      },
      spacing: {
        "section": "4.5rem",
        "section-sm": "3rem",
      },
      backgroundImage: {
        "epic-grid":
          "linear-gradient(rgba(91,104,199,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(91,104,199,0.10) 1px, transparent 1px)",
        "epic-grid-dark":
          "linear-gradient(rgba(242,233,107,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(242,233,107,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
    },
  },
  plugins: [],
};

export default config;
