/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#611F69',
      },
      screens: {
        'xs': '475px',
      }
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.active': {
          '@apply text-black bg-white': {},
        },
      });
    },
  ],
}