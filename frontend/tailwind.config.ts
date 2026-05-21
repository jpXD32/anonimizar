import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5ff',
          300: '#a4b5ff',
          400: '#7c8dff',
          500: '#4f5fd9',
          600: '#3b47d5',
          700: '#2d35b7',
          800: '#1e2399',
          900: '#0f172a',
        },
        accent: {
          50: '#f3e8ff',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(79, 95, 217, 0.15)',
        'glow-lg': '0 0 50px rgba(79, 95, 217, 0.25)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0F172A 0%, #3B82F6 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(79, 95, 217, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}

export default config
