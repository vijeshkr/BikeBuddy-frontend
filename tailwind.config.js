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
      },
      height: {
        'h-calc': 'calc(100vh - 56px)',
      },
      boxShadow: {
        'custom': '0px 0px 5px 0px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.active': {
          '@apply text-black bg-white': {},
        },
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',  // for Internet Explorer and Edge
          'scrollbar-width': 'none',     // for Firefox
        },
        '.scrollbar-none::-webkit-scrollbar': {
          'display': 'none',             // for Chrome, Safari, and Opera
        },
      });
    },
  ],
}