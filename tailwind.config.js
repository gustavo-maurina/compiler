/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      borderWidth: {
        '1': '1px'
      },
      colors: {
        'green': {
          '925': 'rgb(12, 53, 29)'
        }
      }
    },
  },
  plugins: [],
}

