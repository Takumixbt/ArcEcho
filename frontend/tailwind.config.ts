import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        background: "#050505",
        foreground: "#f5f5f5",
        muted: {
          DEFAULT: "rgba(245,245,245,0.55)",
          dim: "rgba(245,245,245,0.32)",
        },
        border: {
          DEFAULT: "rgba(245,245,245,0.1)",
          strong: "rgba(245,245,245,0.2)",
        },
      },
      maxWidth: {
        site: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
