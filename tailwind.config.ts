import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf9f6',
          100: '#f3ede7',
          200: '#e8dcc9',
          300: '#d4b896',
          400: '#c9a876',
          500: '#b8935f',
          600: '#a07d42',
          700: '#8b6834',
          800: '#6b5228',
          900: '#4a381a',
        },
        secondary: {
          50: '#f0fdf7',
          100: '#dffdf3',
          200: '#b8f3e0',
          300: '#7ee8c9',
          400: '#3fd9aa',
          500: '#1e7c5f',
          600: '#155e47',
          700: '#134a39',
          800: '#0f3a2d',
          900: '#0a2620',
        },
        accent: {
          50: '#fef3c7',
          100: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        navy: '#1a3a4a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      backgroundImage: {
        'golf-gradient': 'linear-gradient(135deg, #1a3a4a 0%, #1e7c5f 50%, #b8935f 100%)',
        'hero-pattern': 'radial-gradient(circle at 20% 50%, rgba(184, 147, 95, 0.2) 0%, rgba(30, 124, 95, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}
export default config