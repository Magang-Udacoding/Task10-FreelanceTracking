/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Monochrome / Black & White Retro Facebook Palette
        brand: {
          dark: '#111111',       // Black box / dark mode cards
          darker: '#000000',     // Pure black background
          light: '#f0f2f5',      // Classic retro Facebook grayish page background
          sidebar: '#ffffff',    // White retro sidebar
          active: '#e4e6eb',     // Active selection gray
          gold: '#000000',       // Monochrome primary accent (Pure Black)
          goldHover: '#262626',  // Charcoal hover
          teal: '#262626',       // Deep gray
          tealHover: '#404040',
          blue: '#111111',       // Classic black header bar
          blueHover: '#333333',
        },
        primary: {
          DEFAULT: '#000000',
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#0a0a0a',
        },
        fb: {
          header: '#000000',      // Solid black retro header
          headerBorder: '#222222',
          cardBorder: '#ccd0d5',  // Classic Facebook border
          darkBorder: '#333333',
          bg: '#f0f2f5',
          darkBg: '#050505',
          hover: '#e4e6eb',
          link: '#111111',
          text: '#050505',
          subtext: '#65676b',
        },
        success: '#111111',
        warning: '#555555',
        danger: '#000000',
        info: '#333333',
        neutral: {
          dark: '#111111',
          light: '#f0f2f5',
          gray: '#65676b',
          border: '#ccd0d5',
        }
      },
      fontFamily: {
        sans: ['Tahoma', 'Lucida Grande', 'Verdana', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'fb': '0 1px 2px rgba(0, 0, 0, 0.2)',
        'fb-btn': '0 1px 0 rgba(0, 0, 0, 0.4)',
        'retro': '1px 1px 0px #000000',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
