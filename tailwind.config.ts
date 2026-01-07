// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your Brand Color: Royal Indigo (#4b0082)
        primary: {
          DEFAULT: '#4b0082', // The main class (bg-primary, text-primary)
          50: '#f5f3ff',      // Very light background shade
          100: '#ede9fe',     // Light shade
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4b0082',     // Darkest shade (matches your main brand color)
          950: '#2e1065',
        },
      },
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)'],
      },
      // ✅ NEW: Animations for Ramadan Hub (Moon Float & Glow)
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' },
          'to': { filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' },
        },
      },
    },
  },
  plugins: [],
};
export default config;