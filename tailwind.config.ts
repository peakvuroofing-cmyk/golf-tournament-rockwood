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
        // NorTex Gold - exact hex from logo
        primary: {
          50:  '#f9f7f2',
          100: '#f0ebe1',
          200: '#e2dccf',
          300: '#d4cdbd',
          400: '#c6bfab',
          500: '#c3a96a',
          600: '#b39556',
          700: '#a38042',
          800: '#936b2e',
          900: '#7a541b',
        },
        // NorTex Dark (logo background black)
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
        'gold-gradient': 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 60%, #1e1500 100%)',
        'hero-pattern': 'radial-gradient(circle at 20% 50%, rgba(195,169,106,0.12) 0%, rgba(13,13,13,0.05) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
