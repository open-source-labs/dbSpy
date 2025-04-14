module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#000000', // will be used for dark mode background
        buttons: '#1d293d', // will be used for accents or buttons
        accent: '#3b82f6', // will be used for bright accent
        accentText: '#fdc700', // will be used for bright YELLOW accent - to go w/ logo
        containers: '#030712', // will be used for dark mode containers
        containers2: '#f7f5f4', // will be used for light mode containers
        background: '#e5e5e4', // will be used for light mode background
      },
    },
  },
  plugins: [],
};
