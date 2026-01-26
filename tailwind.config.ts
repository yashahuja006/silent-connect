import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // High-End Futuristic Midnight Theme
        'midnight': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617', // Primary midnight navy background
        },
        'electric': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee', // Electric Cyan primary
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        'neon': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#8b5cf6', // Neon Violet accent
        },
        'glass': {
          panel: 'rgba(15, 23, 42, 0.6)', // Surface glass color
          border: 'rgba(255, 255, 255, 0.08)',
          highlight: 'rgba(255, 255, 255, 0.12)',
          shadow: 'rgba(0, 0, 0, 0.1)',
        },
        // Shadcn/UI color system
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        // Typography System
        sans: ['Inter', 'system-ui', 'sans-serif'], // Default body font
        heading: ['Rajdhani', 'Space Grotesk', 'system-ui', 'sans-serif'], // Sci-fi headings
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'], // Code font
        display: ['Space Grotesk', 'Inter', 'sans-serif'], // Display font
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      keyframes: {
        // Shadcn/UI animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Custom Futuristic Animations
        "blob": {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "0.4",
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(34, 211, 238, 0.7)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
            boxShadow: "0 0 0 10px rgba(34, 211, 238, 0)",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(34, 211, 238, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "scan": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        // Shadcn/UI animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Custom Futuristic Animations
        "blob": "blob 7s infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "scan": "scan 2s linear infinite",
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      backgroundImage: {
        'midnight-gradient': 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)',
        'electric-gradient': 'linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'neural-mesh': `
          radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
        `,
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.15)',
        'electric': '0 0 20px rgba(34, 211, 238, 0.3)',
        'neon': '0 0 20px rgba(139, 92, 246, 0.3)',
        'cyber': '0 0 30px rgba(34, 211, 238, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)',
        'inner-glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom Cyber-Glass Design System Plugin
    function({ addUtilities, addComponents, theme }: { addUtilities: any, addComponents: any, theme: any }) {
      // Glass Morphism Utilities
      const glassUtilities = {
        '.glass-panel': {
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          borderRadius: '1rem',
        },
        '.glass-card': {
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
          borderRadius: '1.5rem',
        },
        '.glass-button': {
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(34, 211, 238, 0.1)',
            borderColor: 'rgba(34, 211, 238, 0.3)',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)',
            transform: 'translateY(-1px)',
          },
        },
        '.glass-input': {
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          '&:focus': {
            borderColor: 'rgba(34, 211, 238, 0.5)',
            boxShadow: '0 0 0 3px rgba(34, 211, 238, 0.1)',
          },
        },
      }

      // Electric Gradient Utilities
      const electricUtilities = {
        '.text-electric': {
          background: 'linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.border-electric': {
          borderImage: 'linear-gradient(135deg, #22d3ee, #8b5cf6) 1',
        },
        '.bg-electric': {
          background: 'linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)',
        },
        '.glow-electric': {
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
        },
        '.text-glow': {
          textShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
        },
      }

      // Status Indicator Utilities
      const statusUtilities = {
        '.status-active': {
          background: 'rgba(34, 211, 238, 0.2)',
          border: '1px solid rgba(34, 211, 238, 0.4)',
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)',
          animation: 'pulse-slow 3s ease-in-out infinite',
        },
        '.status-inactive': {
          background: 'rgba(100, 116, 139, 0.2)',
          border: '1px solid rgba(100, 116, 139, 0.3)',
        },
        '.status-error': {
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
        },
        '.status-success': {
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)',
        },
      }

      // Futuristic Layout Utilities
      const layoutUtilities = {
        '.cyber-grid': {
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        },
        '.neural-bg': {
          background: `
            radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
            #020617
          `,
        },
        '.scan-line': {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.8), transparent)',
            animation: 'scan 2s linear infinite',
          },
        },
      }

      addUtilities({
        ...glassUtilities,
        ...electricUtilities,
        ...statusUtilities,
        ...layoutUtilities,
      })

      // Component Classes
      const components = {
        '.card-futuristic': {
          '@apply glass-card p-6 hover:glow-electric transition-all duration-300': {},
        },
        '.btn-futuristic': {
          '@apply glass-button px-6 py-3 text-electric font-medium hover:text-white': {},
        },
        '.heading-futuristic': {
          '@apply font-heading text-electric text-glow': {},
        },
        '.input-futuristic': {
          '@apply glass-input px-4 py-3 text-white placeholder-gray-400': {},
        },
      }

      addComponents(components)
    }
  ],
} satisfies Config

export default config