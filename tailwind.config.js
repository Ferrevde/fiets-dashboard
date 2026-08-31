/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black backgrounds
        'bg-main': '#09090B',      // zinc-950
        'bg-sidebar': '#0D0D0F',   // slightly lighter
        'bg-card': '#18181B',      // zinc-900
        'bg-card-hover': '#1F1F23', // slightly lighter for hover
        
        // Borders
        'border-subtle': '#27272A', // zinc-800
        'border-muted': '#3F3F46',  // zinc-700
        
        // Text
        'text-primary': '#FAFAFA',  // zinc-50
        'text-secondary': '#A1A1AA', // zinc-400
        'text-muted': '#71717A',    // zinc-500
        
        // Accent colors
        'accent-green': '#22C55E',   // green-500
        'accent-green-muted': '#166534', // green-900
        'accent-red': '#EF4444',     // red-500
        'accent-red-muted': '#7F1D1D',   // red-900
        'accent-orange': '#F59E0B',  // amber-500
        'accent-orange-muted': '#78350F', // amber-900
        'accent-blue': '#3B82F6',    // blue-500
        'accent-blue-muted': '#1E3A5F',  // blue-900
      },
      borderRadius: {
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px
        '3xl': '2rem',     // 32px
      },
      spacing: {
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'heading-3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'heading-4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}