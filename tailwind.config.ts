import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables so a page can recolor itself (see src/lib/theme.ts).
        ash: 'rgb(var(--color-ash) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        accent: '#FF3300'
      },
      typography: {
        site: {
          css: {
            '--tw-prose-body': 'rgb(var(--color-ash) / 0.82)',
            '--tw-prose-headings': 'rgb(var(--color-ash))',
            '--tw-prose-lead': 'rgb(var(--color-ash) / 0.72)',
            '--tw-prose-links': 'rgb(var(--color-ash))',
            '--tw-prose-bold': 'rgb(var(--color-ash))',
            '--tw-prose-counters': 'rgb(var(--color-ash) / 0.5)',
            '--tw-prose-bullets': 'rgb(var(--color-ash) / 0.5)',
            '--tw-prose-hr': 'rgb(var(--color-line) / 0.35)',
            '--tw-prose-quotes': 'rgb(var(--color-ash))',
            '--tw-prose-quote-borders': 'rgb(var(--color-line) / 0.35)',
            '--tw-prose-captions': 'rgb(var(--color-ash) / 0.5)',
            '--tw-prose-code': 'rgb(var(--color-ash))',
            '--tw-prose-pre-code': 'rgb(var(--color-ash))',
            '--tw-prose-pre-bg': 'rgb(var(--color-ash) / 0.06)',
            '--tw-prose-th-borders': 'rgb(var(--color-line) / 0.35)',
            '--tw-prose-td-borders': 'rgb(var(--color-line) / 0.2)'
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)'],
        mono: ['var(--font-roboto-mono)']
      }
    }
  },
  plugins: [typography]
};

export default config;
