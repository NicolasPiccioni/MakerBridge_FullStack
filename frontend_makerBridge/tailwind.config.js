import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#e06d53',
          primaryHover: '#cc593f',
          lightBg: '#fef5f2',
          borderTone: '#f3c4ba',
          dark: '#1e2432',
          graySub: '#5f6980',
          accentYellow: '#f59e0b',
          accentBlue: '#4a8ec9',
        },
        surface: {
          base: '#fbf9f8',
          card: '#ffffff',
          cardMuted: '#f5f3f0',
          border: '#eae6e2',
        },
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(224, 109, 83, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.05)',
        'warm-md': '0 8px 24px -4px rgba(224, 109, 83, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'warm-lg': '0 16px 36px -6px rgba(224, 109, 83, 0.16), 0 6px 14px -3px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [forms, containerQueries],
}
