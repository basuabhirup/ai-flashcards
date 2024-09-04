// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      perspective: {
        1000: "1000px",
      },
    },
  },
  variants: {},
  darkMode: "class",
  plugins: [
    nextui(),
    function ({ addUtilities }) {
      const newUtilities = {
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".transform-style-3d": {
          "transform-style": "preserve-3d",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
