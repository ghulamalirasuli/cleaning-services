/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#F7F4EF', dark: '#EDE8DF' },
        charcoal: { DEFAULT: '#1C1C1C', light: '#2D2D2D' },
        sage: { DEFAULT: '#8FA689', light: '#A8C4A0', dark: '#6B8B65' },
        gold: { DEFAULT: '#C9A84C', light: '#E2D5A8', dark: '#A88B3A' },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
