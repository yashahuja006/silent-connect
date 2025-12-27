/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0a',
        'cyber-darker': '#050505',
        'cyber-cyan': '#00ffff',
        'cyber-teal': '#008080',
        'cyber-blue': '#0080ff',
        'cyber-green': '#00ff80',
        'cyber-gray': '#1a1a1a',
        'cyber-light': '#2a2a2a'
      },
      fontFamily: {
        'cyber': ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'subtitle': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'gesture': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }]
      },
      animation: {
        'pulse-cyber': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff' },
          '100%': { boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff' }
        }
      }
    },
  },
  plugins: [],
}