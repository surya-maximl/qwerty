/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'rgb(230, 232, 235)',
        primary: '#475569',
        secondary: '#E2E8F0',
        borderColor: '#CBD5E1'
      }
    },
    screens: {
      // max-width
      'max-2xl': { max: '1367px' },
      'max-xl': { max: '1280px' },
      'max-lg': { max: '1024px' },
      'max-md': { max: '768px' },
      'max-sm': { max: '640px' },

      //min-width
      sm: '641px',
      md: '769px',
      lg: '1025px',
      xl: '1281px',
      '2xl': '1537px'
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
};
