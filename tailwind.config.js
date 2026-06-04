/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // РЦТО brand azure
        brand: {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#c0d6ff',
          300: '#97baff',
          400: '#6892ff',
          500: '#3f67ff',
          600: '#1f47f5',
          700: '#1736e1',
          800: '#192fb6',
          900: '#1a2e8f',
        },
        ink: {
          900: '#0d1326',
          700: '#2a3145',
          500: '#5b6479',
          400: '#838ca0',
          300: '#aab2c4',
        },
        canvas: '#f5f7fb',
        surface: '#ffffff',
      },
      boxShadow: {
        // soft, diffused ambient shadows — no harsh dark drops
        soft: '0 1px 2px rgba(16,28,64,0.04), 0 8px 24px -12px rgba(16,28,64,0.12)',
        lift: '0 2px 4px rgba(16,28,64,0.05), 0 18px 40px -16px rgba(16,28,64,0.22)',
        glow: '0 10px 40px -12px rgba(31,71,245,0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.32,0.72,0,1) both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.32,0.72,0,1) both',
        'slide-in': 'slide-in 0.45s cubic-bezier(0.32,0.72,0,1) both',
      },
    },
  },
  plugins: [],
}
