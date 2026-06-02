/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5F12B1',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"HK Grotesk Wide"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
