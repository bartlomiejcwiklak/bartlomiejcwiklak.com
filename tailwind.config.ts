import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ash: '#F3F1E8',
        ink: '#0B0B0B',
        line: '#D8D2C4',
        accent: '#FF3300'
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)'],
        mono: ['var(--font-roboto-mono)']
      }
    }
  },
  plugins: []
};

export default config;
