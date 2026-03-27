import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        proof: {
          bg: '#06060f',
          card: 'rgba(255,255,255,0.04)',
          purple: '#7c3aed',
          indigo: '#4f46e5',
          cyan: '#22d3ee',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
