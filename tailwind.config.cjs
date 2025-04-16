module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#000000', // will be used for dark mode background
        background: '#e5e5e4', // will be used for light mode background
        buttons: '#1d293d', // will be used for accents or buttons
        accent: '#7597c5', // will be used for blue accent (Ex-navBar)
        accentText: '#fdc700', // will be used for bright YELLOW accent - to go w/ logo
        containers: '#1d293d', // will be used for dark mode containers
        containers2: '#f7f5f4', // will be used for light mode containers
      },
    },
  },
  plugins: [],
};
