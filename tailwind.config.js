// module.exports = {
//   // content: ['./client/**/*.{js,jsx,ts,tsx}'],
//   content: [
//     './client/**/*.{js,jsx,ts,tsx}',
//     './pages/**/*.{js,jsx,ts,tsx}',
//     './components/**/*.{js,jsx,ts,tsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
