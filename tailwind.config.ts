import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      border: {
        "border-05": "border-width: 0.5px;",
        "border-1": "border-width: 1px;",
      },
      invert: {
        40: ".4",
        60: ".6",
      },
      height: {
        frame: "calc(100vh - 2.5rem)",
        "frame-lg": "calc(100vh - 5rem)",
        "50vh": "50vh",
      },
    },
  },
  plugins: [require("@codaworks/react-glow/tailwind")],
};
export default config;
