/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3faf6',
          100: '#e6f6ee',
          200: '#c3ecd7',
          300: '#8fddb7',
          400: '#5dcb97',
          500: '#3bb273',
          600: '#2e8c59',
          700: '#256b45',
          800: '#1b4b31',
          900: '#13341f',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 
