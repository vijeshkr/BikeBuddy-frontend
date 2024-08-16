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
        'h-calc-notification': 'calc(100vh - 86px)',
      },
      boxShadow: {
        'custom': '0px 0px 5px 0px rgba(0,0,0,0.1)',
        'sidebar': '200px 61px 176px 200px rgba(0,0,0,0.66)',
        'notificationBar': '1px 8px 25px -15px rgba(0,0,0,0.75)',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
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
        '.child-nav': {
          '@apply bg-primaryColor p-2 rounded-sm text-white': {},
        },
        // Sweet alert styles
        '.swal-title': {
          '@apply text-xl font-semibold text-black': {} /* Tailwind utility for text size and weight */
        },
        '.swal-text': {
          '@apply text-sm': {} /* Tailwind utility for text size and weight */
        },
        '.swal-button--confirm': {
          '@apply text-sm bg-red-500 font-semibold': {} /* Tailwind utility for text size and weight */
        },

      });
    },
  ],
}