import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kids: {
          pink: "#FFB6C1",
          blue: "#87CEEB",
          yellow: "#FFD700",
          green: "#98FB98",
          lavender: "#E6E6FA",
          peach: "#FFDAB9",
          orange: "#FFA07A",
        },
      },
      fontFamily: {
        heading: ["Baloo 2", "cursive"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        bounce_slow: "bounce 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
