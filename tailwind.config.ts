import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: '#16a34a',
          leaf: '#22c55e',
          mint: '#dcfce7',
          ink: '#0f172a',
          sand: '#f6f4ee',
          ember: '#f97316',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(15, 23, 42, 0.05), 0 18px 40px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}

export default config
