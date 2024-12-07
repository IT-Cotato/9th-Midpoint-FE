/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        suit: 'SUIT',
        pre: 'Pretendard',
      },
      fontSize: {
        xs: ['0.875rem', '1.125rem'], //14px
        sm: ['1rem', '1.125rem'], //16px
        base: ['1.125rem', '1.5rem'], //18px
        lg: ['1.25rem', '1.5rem'], //20px
        menu: ['1.375rem', '1.5rem'], // 22px
        xl: ['1.5rem', '1.75rem'], //24px
        title: ['1.625rem', '1.75rem'], //26px
        '2xl': ['1.875rem', '2.25rem'], // 30px
        '3xl': ['2rem', '2.5rem'], // 32px
        '4xl': ['2.25rem', '2.5rem'], // 36px
        '5xl': ['3rem', '1'], // 48px
      },
      colors: {
        primary: {
          100: '#EEF3FF',
          200: '#BCD7FF',
          base: '#5786FF',
          400: '#377BFF',
          500: '#2F5FDD',
          600: '#253E7F',
          700: '#15254D',
          hover: '#60A5FA',
          grayLight: '#F8F8FB',
          grayNormal: '#B7BDCC',
          grayDark: '#5E6D93',
          redLight: '#F9C4D4',
          redNormal: '#EA3B70',
        },
      },
      boxShadow: {
        base: '0px 0px 20px 0px rgba(47, 95, 221, 0.50)',
        focus: '0 0 0 2px rgba(235, 248, 255, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addBase, addComponents, theme }) {
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
          backgroundColor: theme('colors.primary.base'),
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#60A5FA',
          },
          transitionProperty: 'colors',
        },
        '.add-btn': {
          backgroundColor: '#ECECF3',
          color: theme('colors.primary.grayNormal'),
          '&:hover': {
            backgroundColor: theme('colors.primary.grayLight'),
          },
          transitionProperty: 'colors',
        },
      });
    },
  ],
};
