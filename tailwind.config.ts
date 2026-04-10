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
        // NorTex Gold
        primary: {
          50:  '#fdf9ed',
          100: '#faf0cc',
          200: '#f4dc90',
          300: '#ecc84e',
          400: '#e5b825',
          500: '#c99a10',
          600: '#a67c0c',
          700: '#7d5d0a',
          800: '#523d07',
          900: '#2e2204',
        },
        // NorTex Dark (near-black)
        secondary: {
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#2d2d2d',
          800: '#1a1a1a',
          900: '#0d0d0d',
        },
        navy: '#0d0d0d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 60%, #2d2004 100%)',
        'hero-pattern': 'radial-gradient(circle at 20% 50%, rgba(201,154,16,0.15) 0%, rgba(13,13,13,0.1) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
