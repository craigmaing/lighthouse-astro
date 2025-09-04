/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Professional navy blue for trust
        navy: {
          50: '#e8f0f9',
          100: '#d1e1f3',
          200: '#a3c3e7',
          300: '#75a5db',
          400: '#4787cf',
          500: '#1e3a5f', // Main brand color
          600: '#18304f',
          700: '#12263f',
          800: '#0c1c2f',
          900: '#06121f',
        },
        // Teal for lighthouse/guidance theme
        teal: {
          50: '#e6f9fa',
          100: '#ccf3f5',
          200: '#99e7eb',
          300: '#66dbe1',
          400: '#33cfd7',
          500: '#00a8b5', // Accent color
          600: '#008691',
          700: '#00656d',
          800: '#004349',
          900: '#002224',
        },
        // Warm coral for CTAs
        coral: {
          50: '#ffe8e8',
          100: '#ffd1d1',
          200: '#ffa3a3',
          300: '#ff7575',
          400: '#ff4747',
          500: '#ff6b6b', // CTA color
          600: '#d94444',
          700: '#b31d1d',
          800: '#8c0000',
          900: '#660000',
        },
        // Success green
        success: {
          50: '#e6f7e6',
          100: '#cceecc',
          200: '#99dd99',
          300: '#66cc66',
          400: '#33bb33',
          500: '#00a854',
          600: '#008643',
          700: '#006532',
          800: '#004321',
          900: '#002210',
        },
        // Neutral grays
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #1e3a5f 0%, #00a8b5 100%)',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'xl': '0 20px 48px rgba(0, 0, 0, 0.18)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}