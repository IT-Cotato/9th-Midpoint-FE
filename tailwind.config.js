/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        suit: 'SUIT',
        pre: 'Pretendard',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addBase, addComponents }) {
      addBase({
        body: {
          overflowX: 'hidden',
        },
        html: {
          fontFamily: "'SUIT', 'Pretendard', sans-serif",
        },
      });

      addComponents({
        '.primary-btn': {
          width: '100%',
          backgroundColor: '#5786FF',
          color: '#ffffff',
          fontWeight: '500',
          borderRadius: '0.5rem',
          textAlign: 'center',
          '&:hover': {
            backgroundColor: '#60A5FA',
          },
          transitionProperty: 'colors',
        },
      });
    },
  ],
};
