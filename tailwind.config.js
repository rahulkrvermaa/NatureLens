/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nature: {
          dark: 'rgb(var(--nl-canvas) / <alpha-value>)',
          surface: 'rgb(var(--nl-surface) / <alpha-value>)',
          moss: 'rgb(var(--nl-surface-alt) / <alpha-value>)',
          elevated: 'rgb(var(--nl-elevated) / <alpha-value>)',
          border: 'rgb(var(--nl-border) / <alpha-value>)',
          borderSubtle: 'rgb(var(--nl-border-subtle) / <alpha-value>)',
          accent: 'rgb(var(--nl-accent) / <alpha-value>)',
          accentHover: 'rgb(var(--nl-accent-hover) / <alpha-value>)',
          accentMuted: 'rgb(var(--nl-accent-muted) / <alpha-value>)',
          emerald: 'rgb(var(--nl-emerald) / <alpha-value>)',
          parchment: 'rgb(var(--nl-text-primary) / <alpha-value>)',
          textMuted: 'rgb(var(--nl-text-muted) / <alpha-value>)',
          textSubtle: 'rgb(var(--nl-text-subtle) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        editorial: '0 16px 40px -12px rgba(0, 0, 0, 0.08)',
        'card-glow': '0 0 24px rgba(217, 119, 6, 0.14)',
      },
    },
  },
  plugins: [],
};
