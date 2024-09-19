/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bb-theme-50': '#f0f3fe',
        'bb-theme-100': '#dee4fb',
        'bb-theme-200': '#c4d1f9',
        'bb-theme-300': '#9bb3f5',
        'bb-theme-400': '#6c8bee',
        'bb-theme-500': '#405de6',
        'bb-theme-600': '#3547db',
        'bb-theme-700': '#2c35c9',
        'bb-theme-800': '#292da4',
        'bb-theme-900': '#272c81',
        'bb-theme-950': '#1c1e4f',
        'text-soft' : '#525252',
        'text-extra-soft' : '#b7bac1',
        'bg-color': '#f9f9f9'
      },
      screens: {
        'xs': '475px',
      },
      height: {
        'h-calc': 'calc(100vh - 56px)',
        'h-calc-notification': 'calc(100vh - 86px)',
        'h-calc-popup': 'calc(100vh - 150px)',
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
          '@apply text-bb-theme-500 bg-bb-theme-100 border-r-4 border-bb-theme-500': {},
        },
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',  // for Internet Explorer and Edge
          'scrollbar-width': 'none',     // for Firefox
        },
        '.scrollbar-none::-webkit-scrollbar': {
          'display': 'none',             // for Chrome, Safari, and Opera
        },
        '.child-nav': {
          '@apply bg-bb-theme-500 text-white px-2 py-1 rounded-md border': {},
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

// 'royal-blue': {
//         '50': '#f0f3fe',
//         '100': '#dee4fb',
//         '200': '#c4d1f9',
//         '300': '#9bb3f5',
//         '400': '#6c8bee',
//         '500': '#405de6',
//         '600': '#3547db',
//         '700': '#2c35c9',
//         '800': '#292da4',
//         '900': '#272c81',
//         '950': '#1c1e4f',
//     },