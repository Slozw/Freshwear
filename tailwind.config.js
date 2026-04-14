/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        void: '#080808',
        ash: '#111111',
        carbon: '#1a1a1a',
        zinc: '#2a2a2a',
        mist: '#888888',
        silver: '#c8c8c8',
        snow: '#f5f5f5',
        acid: '#d4f500',
        neon: '#00ff88',
        plasma: '#ff3c5a',
      },
      animation: {
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'ticker': 'ticker 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        glow: {
          from: { textShadow: '0 0 20px rgba(212,245,0,0.3)' },
          to: { textShadow: '0 0 40px rgba(212,245,0,0.8), 0 0 80px rgba(212,245,0,0.2)' },
        },
      },
    },
  },
  plugins: [],
}
