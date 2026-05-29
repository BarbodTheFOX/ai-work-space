import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eventum: {
          bg: "#0F0F0F",
          surface: "#171717",
          elevated: "#1F1F1F",
          soft: "#262626",
          border: "rgba(255,255,255,0.08)",
          borderStrong: "rgba(255,255,255,0.12)",
          text: "#F5F5F5",
          muted: "#A3A3A3",
          dim: "#737373",
          purple: "#8B5CF6",
          lime: "#A3E635",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#38BDF8",
        },
      },
      boxShadow: {
        panel: "0 1px 0 rgba(255,255,255,0.03)",
        subtle: "0 8px 20px rgba(0,0,0,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
