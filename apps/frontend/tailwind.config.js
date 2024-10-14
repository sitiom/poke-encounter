import pluginMantine from "@devoss/tailwind-plugin-mantine";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "tackle-left": {
          "0%, 100%": {
            transform: "translateX(0)"
          },
          "50%": {
            transform: "translateX(-50px)"
          }
        },
        "tackle-right": {
          "0%, 100%": {
            transform: "translateX(0)"
          },
          "50%": {
            transform: "translateX(50px)"
          }
        },
        damaged: {
          "0%, 100%": {
            filter: "brightness(1)"
          },
          "50%": {
            filter: "grayscale(100%) brightness(50%) sepia(100%) hue-rotate(0deg) saturate(300%)"
          }
        },
      },
      animation: {
        "tackle-left": "tackle-left 0.3s ease-in-out",
        "tackle-right": "tackle-right 0.3s ease-in-out",
        damaged: "damaged 0.3s ease-in-out"
      }
    },
  },
  plugins: [pluginMantine()],
}

