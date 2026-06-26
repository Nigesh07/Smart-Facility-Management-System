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
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
      },
      borderRadius: {
        DEFAULT: '12px',
        btn: '10px',
        card: '16px',
        xl2: '16px', // Keep for backward compatibility if used directly
      },
    },
  },
  plugins: [],
};
