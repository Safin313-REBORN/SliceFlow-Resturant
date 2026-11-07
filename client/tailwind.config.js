/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark Mode Surface Palette
        dark: {
          bg: '#0E1612',       // Deep obsidian canvas
          surface: '#15221B',  // Raised section surface
          card: '#1A2920',     // Elevated food card
          border: '#283D31',   // Border delimiter
          text: '#FAF6EF',     // Crisp Ivory text
          muted: '#9CB0A4',    // Secondary muted text
        },
        // Ember & Basil Palette
        primary: {
          DEFAULT: '#D95732', // Burnt Orange
          hover: '#B84322',
          light: '#FBF0EC',
          dark: '#9E3416',
        },
        forest: {
          DEFAULT: '#263E32', // Deep Forest Green
          hover: '#1B2E24',
          light: '#EBF2EE',
          dark: '#14221A',
        },
        honey: {
          DEFAULT: '#E5B75C', // Golden Honey Accent
          hover: '#D4A345',
          light: '#FBF6EA',
        },
        ivory: {
          DEFAULT: '#FAF6EF', // Warm Ivory Background
          soft: '#F1E9DE',    // Soft Surface
          border: '#E8DFC8',
        },
        espresso: {
          DEFAULT: '#29221E', // Main Text
          muted: '#83766D',   // Secondary Text
          subtle: '#B5A9A0',
        },
        status: {
          success: '#327A50',
          error: '#CB4438',
          warning: '#D97706',
          info: '#2563EB',
        },
        // Backward compatibility mappings for existing component styles
        brand: {
          red: '#D95732',
          'red-hover': '#B84322',
          'red-light': '#FBF0EC',
          cream: '#FAF6EF',
          'cream-dark': '#F1E9DE',
          charcoal: '#29221E',
          'charcoal-light': '#4A3F39',
          yellow: '#E5B75C',
          'yellow-light': '#FBF6EA',
          grey: '#83766D',
          'grey-light': '#F1E9DE',
          'grey-border': '#E8DFC8',
          forest: '#263E32',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"DM Serif Display"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        subtle: '0 2px 8px -2px rgba(41, 34, 30, 0.05), 0 1px 4px -1px rgba(41, 34, 30, 0.03)',
        card: '0 4px 20px -2px rgba(41, 34, 30, 0.06)',
        hover: '0 16px 36px -4px rgba(217, 87, 50, 0.22)',
        modal: '0 24px 48px -12px rgba(41, 34, 30, 0.3)',
        glow: '0 0 24px -2px rgba(217, 87, 50, 0.4)',
        'glow-green': '0 0 24px -2px rgba(38, 62, 50, 0.4)',
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 40s linear infinite',
        'float-gentle': 'floatGentle 4.5s ease-in-out infinite',
        'float-reverse': 'floatReverse 5.5s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'heart-beat': 'heartBeat 0.4s ease-in-out',
        'badge-pop': 'badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
