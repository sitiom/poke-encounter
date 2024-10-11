import tailwindPresetMantine from 'tailwind-preset-mantine'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [
    tailwindPresetMantine
  ],
}

