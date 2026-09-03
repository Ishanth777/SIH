/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0E2150',
          light: '#1A3470',
          dark: '#081435',
        },
        brand: {
          green: {
            DEFAULT: '#059669',
            dark: '#047857',
            light: '#D1FAE5',
          },
        },
        surface: {
          DEFAULT: '#F8FAFC',
          shell: '#F1F5F9',
        },
        ink: {
          primary: '#0D1829',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        border: {
          subtle: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(14,33,80,0.08)',
        'navy-btn': '0 4px 14px rgba(14,33,80,0.25)',
        'green-btn': '0 4px 14px rgba(5,150,105,0.30)',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
    },
  },
  plugins: [],
};
