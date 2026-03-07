import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        panel: "var(--color-panel)",
        panel2: "var(--color-panel-2)",
        line: "var(--color-line)",
        "line-strong": "var(--color-line-strong)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        positive: "var(--color-positive)",
        risk: "var(--color-risk)"
      },
      fontFamily: {
        sans: ["Rajdhani", "Space Grotesk", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      borderRadius: {
        sm: "calc(var(--radius) - 8px)",
        DEFAULT: "calc(var(--radius) - 4px)",
        md: "var(--radius)",
        lg: "calc(var(--radius) + 4px)",
        xl: "calc(var(--radius) + 8px)"
      },
      boxShadow: {
        threshold: "0 0 0 1px rgba(255,255,255,0.12), 0 12px 38px rgba(0,0,0,0.44)"
      },
      keyframes: {
        "gradient-breathe": {
          "0%, 100%": {
            opacity: "0.42",
            transform: "scale(1) translate3d(0, 0, 0)"
          },
          "50%": {
            opacity: "0.72",
            transform: "scale(1.12) translate3d(0, -2%, 0)"
          }
        }
      },
      animation: {
        "gradient-breathe": "gradient-breathe 12s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
