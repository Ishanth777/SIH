/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coop: {
          50: '#e6fbf5',
          100: '#c0f7e4',
          500: '#00c996',
          600: '#00b386',
          700: '#008c69',
          900: '#062d23',
        },
      },
    },
  },
  plugins: [],
};
