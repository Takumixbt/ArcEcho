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
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        arc: {
          bg: "#0a0a0f",
          surface: "#111118",
          border: "#1e1e2e",
          accent: "#00ff41",
          cyan: "#00d4ff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
