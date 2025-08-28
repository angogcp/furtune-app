/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure this line is here
  ],
  theme: {
    extend: {
      // 移动端优化的断点
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // 移动端友好的间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // 触摸友好的最小尺寸
      minHeight: {
        '12': '3rem',  // 触摸友好的最小按钮高度
        '14': '3.5rem',
        'touch': '44px', // iOS推荐的最小触摸区域
      },
      minWidth: {
        '12': '3rem',
        '14': '3.5rem', 
        'touch': '44px',
      },
      // 移动端优化的字体大小
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      // 移动端优化的色彩
      colors: {
        primary: {
          50: '#f3f4ff',
          100: '#e8eaff',
          200: '#d5d9ff',
          300: '#b7beff',
          400: '#9599ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1572',
        },
      },
    },
  },
  plugins: [],
}