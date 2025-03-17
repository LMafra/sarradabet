module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#000000',
        yellow: {
          400: '#FACC15',
        },
        purple: {
          500: '#9333EA',
          900: '#4C1D95',
        },
        gray: {
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}
