/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#475569',
        secondary: 'hsl(215.4 16.3% 46.9%)',
        border: 'hsl(214.3 31.8% 91.4%)'
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
      xs: '480px',
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
