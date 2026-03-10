/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f2f5f9',
          100: '#e1e9f2',
          200: '#c8d7e7',
          300: '#a1bbd6',
          400: '#7398c0',
          500: '#537aa8',
          600: '#41618d',
          700: '#364f73',
          800: '#2f4360',
          900: '#1e3a5f',
          950: '#1a2a44',
        },
      },
    },
  },
  plugins: [],
}
