/** @type {import('tailwindcss').Config} */

const systemFonts = [
  'sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Open Sans',
  'Helvetica Neue'
];

module.exports = {
  content: ['./src/**/**/*.{js,jsx,ts,tsx}', './public/*.html'],
  theme: {
    extend: {
      colors: {
        shark: '#1b1c1e',
        zircon: '#f1f6ff',
        woodsmoke: '#17181a',
        'oslo-gray': '#7e8791',
        'swan-white': '#fcfcfc',
        'zircon-shade-1': '#f6f9fe',
        'lightning-yellow': {
          50: '#fffbeb',
          100: '#fef4c7',
          200: '#fde88a',
          300: '#fcd64d',
          400: '#fbc324',
          500: '#f5a20b',
          600: '#d97b06',
          700: '#b45609',
          800: '#92420e',
          900: '#78370f',
          950: '#451b03'
        }
      },
      borderRadius: { half: '50%' },
      fontFamily: { inter: ['Inter', ...systemFonts], ubuntu: ['Ubuntu', ...systemFonts] },
      screens: {
        'small-phones': { max: '340px' },
        phones: { max: '600px' },
        tablets: { max: '768px' },
        laptops: { max: '992px' },
        large: { max: '1200px' },
        'x-large': { max: '1440px' }
      },
      keyframes: {
        'rotate-right': {
          from: { transform: 'rotate(0)' },
          to: { transform: 'rotate(360deg)' }
        },
        'rotate-left': {
          from: { transform: 'rotate(0)' },
          to: { transform: 'rotate(-360deg)' }
        }
      }
    }
  },
  plugins: []
};
