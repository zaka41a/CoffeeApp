/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coffee-themed color palette
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        espresso: {
          50: '#faf7f5',
          100: '#f5ede8',
          200: '#e7d4c8',
          300: '#d9baa8',
          400: '#c59b7f',
          500: '#b07d5d',
          600: '#9a6347',
          700: '#7d5038',
          800: '#5f3d2c',
          900: '#3e2617',
        },
        cream: {
          50: '#fefdfb',
          100: '#fef9f3',
          200: '#fdf3e7',
          300: '#fcecd9',
          400: '#fbe3c7',
          500: '#f9d5a8',
          600: '#f7c27f',
          700: '#f4a855',
          800: '#f18e2c',
          900: '#c66d14',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'coffee': '0 4px 14px 0 rgba(67, 48, 43, 0.1)',
        'coffee-lg': '0 10px 40px 0 rgba(67, 48, 43, 0.15)',
        'espresso': '0 8px 30px 0 rgba(62, 38, 23, 0.2)',
      },
      backgroundImage: {
        'coffee-gradient': 'linear-gradient(135deg, #43302b 0%, #7d5038 100%)',
        'cream-gradient': 'linear-gradient(135deg, #fef9f3 0%, #fcecd9 100%)',
      },
    },
  },
  plugins: [],
}
