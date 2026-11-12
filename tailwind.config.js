/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FDFBF7',   // Warm Ivory Light
          100: '#FAF6EE',  // Warm Cream
          200: '#F2ECE1',  // Soft Warm Linen
          300: '#E5DCCE',  // Warm Sand / Beige
          400: '#C8BEAF',  // Muted Khaki
          500: '#A39684',  // Warm Muted Gray
          600: '#7D705F',  // Warm Cocoa Gray
          700: '#5A4F42',  // Soft Roast Brown
          800: '#3D342B',  // Deep Espresso
          900: '#251F19',  // Dark Warm Charcoal
          950: '#17130F',  // Obsidian Warmth
        },
        terracotta: {
          50: '#FCF5F3',
          100: '#F9E9E4',
          200: '#F3D2C8',
          300: '#E9B1A0',
          400: '#DC8871',
          500: '#C86D51',  // Primary Brand Accent
          600: '#B2563B',
          700: '#92422C',
          800: '#763625',
          900: '#612F21',
          950: '#37170E',
        },
        coral: {
          50: '#FEF5F2',
          100: '#FDEAE3',
          200: '#FBD4C7',
          300: '#F7B49F',
          400: '#F18C6F',
          500: '#E27D60',  // Muted Coral Highlight
          600: '#CE5E3F',
          700: '#AC4A30',
          800: '#8C3D2B',
          900: '#733527',
        },
        amberwarm: {
          50: '#FEF9EE',
          100: '#FDF0D5',
          200: '#F9DEAA',
          300: '#F4C573',
          400: '#EEA73D',
          500: '#D9822B',  // Warm Amber
          600: '#BF6620',
          700: '#9A4C1C',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE6',
          200: '#CEDBCE',
          300: '#AFC3B0',
          400: '#89A68B',
          500: '#5C8271',  // Muted Organic Green
          600: '#486859',
          700: '#3A5247',
        }
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glass-sm': '0 2px 8px -1px rgba(61, 52, 43, 0.05), 0 1px 3px 0 rgba(61, 52, 43, 0.02)',
        'glass-md': '0 8px 24px -4px rgba(61, 52, 43, 0.07), 0 2px 6px -1px rgba(61, 52, 43, 0.03)',
        'glass-lg': '0 16px 36px -6px rgba(61, 52, 43, 0.09), 0 4px 12px -2px rgba(61, 52, 43, 0.04)',
        'glass-hover': '0 20px 40px -8px rgba(61, 52, 43, 0.12), 0 6px 16px -3px rgba(61, 52, 43, 0.05)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.75)',
        'glass-dark-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'terracotta-glow': '0 10px 25px -5px rgba(200, 109, 81, 0.25)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      transitionTimingFunction: {
        'warm-spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    },
  },
  plugins: [],
}
