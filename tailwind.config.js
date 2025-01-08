/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: true,
  daisyui: {
    themes: ["luxury", "dark", "light", "dim"],
  },
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
}

