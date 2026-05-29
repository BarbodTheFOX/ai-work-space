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
          bg: "#F7F3EA",
          page: "#FBF8F1",
          surface: "#FFFDF7",
          elevated: "#FFFFFF",
          soft: "#F2EDE4",
          border: "#E6DED2",
          borderStrong: "#D8CDBD",
          text: "#1F1F1F",
          muted: "#5F5A52",
          dim: "#8A8378",
          purple: "#8B5CF6",
          lime: "#A3E635",
          clay: "#884039",
          mocha: "#4C3535",
          cinnabar: "#DF4436",
          tangerine: "#FF783E",
          grapefruit: "#FF7070",
          tagBlue: "#DDEAF2",
          tagGreen: "#DDEDD8",
          tagYellow: "#F4E7B8",
          tagPink: "#F5D9D7",
          tagPurple: "#E7DDF5",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#38BDF8",
        },
      },
      boxShadow: {
        panel: "0 1px 2px rgba(76,53,53,0.05)",
        subtle: "0 10px 30px rgba(76,53,53,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
