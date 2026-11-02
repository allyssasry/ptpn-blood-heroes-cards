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
        ptpn: {
          maroon: "#6B0F1A",
          maroonDark: "#4A0810",
          blood: "#B31312",
          crimson: "#DC2626",
          roseSoft: "#FFF1F2",
          pinkSoft: "#FCE7EC",
          gold: "#C59B27",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        sans: ["var(--font-poppins)", "sans-serif"],
        serif: ["var(--font-montserrat)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 20px 40px -15px rgba(107, 15, 26, 0.2)",
        glow: "0 0 35px -5px rgba(179, 19, 18, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;

