/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        'card-alt': 'var(--color-card-alt)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover: 'var(--color-brand-hover)',
          soft: 'var(--color-brand-soft)',
        },
        teal: {
          DEFAULT: 'var(--color-teal)',
        },
        status: {
          pending: 'var(--status-pending)',
          'pending-soft': 'var(--status-pending-soft)',
          assigned: 'var(--status-assigned)',
          'assigned-soft': 'var(--status-assigned-soft)',
          progress: 'var(--status-progress)',
          'progress-soft': 'var(--status-progress-soft)',
          completed: 'var(--status-completed)',
          'completed-soft': 'var(--status-completed-soft)',
          closed: 'var(--status-closed)',
          'closed-soft': 'var(--status-closed-soft)',
          critical: 'var(--status-critical)',
          'critical-soft': 'var(--status-critical-soft)',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};
