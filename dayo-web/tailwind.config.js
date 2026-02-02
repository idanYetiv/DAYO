/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        // DAYO custom colors
        dayo: {
          purple: {
            DEFAULT: '#8B5CF6',
            light: '#A78BFA',
            dark: '#7C3AED',
          },
          pink: {
            DEFAULT: '#EC4899',
            light: '#F472B6',
            dark: '#DB2777',
          },
          orange: {
            DEFAULT: '#F97316',
            light: '#FB923C',
            dark: '#EA580C',
          },
          gray: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          },
        },
        // Kids mode colors - bright and playful
        'dayo-kids': {
          yellow: {
            DEFAULT: '#FCD34D',
            light: '#FDE68A',
            dark: '#F59E0B',
          },
          blue: {
            DEFAULT: '#60A5FA',
            light: '#93C5FD',
            dark: '#3B82F6',
          },
          green: {
            DEFAULT: '#34D399',
            light: '#6EE7B7',
            dark: '#10B981',
          },
          pink: {
            DEFAULT: '#F472B6',
            light: '#F9A8D4',
            dark: '#EC4899',
          },
          orange: {
            DEFAULT: '#FB923C',
            light: '#FDBA74',
            dark: '#F97316',
          },
          purple: {
            DEFAULT: '#A78BFA',
            light: '#C4B5FD',
            dark: '#8B5CF6',
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'dayo-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'dayo-gradient-light': 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
        // Kids mode gradients
        'kids-gradient': 'linear-gradient(135deg, #FCD34D 0%, #FB923C 50%, #F472B6 100%)',
        'kids-rainbow': 'linear-gradient(90deg, #FCD34D 0%, #34D399 25%, #60A5FA 50%, #A78BFA 75%, #F472B6 100%)',
        'kids-sunset': 'linear-gradient(135deg, #FB923C 0%, #F472B6 100%)',
      },
      boxShadow: {
        'dayo': '0 4px 20px -2px rgba(139, 92, 246, 0.15)',
        'dayo-lg': '0 10px 40px -10px rgba(139, 92, 246, 0.2)',
        // Kids mode shadows
        'kids': '0 4px 0 #FB923C, 0 8px 20px -4px rgba(251, 146, 60, 0.3)',
        'kids-lg': '0 6px 0 #FB923C, 0 12px 30px -6px rgba(251, 146, 60, 0.4)',
      },
      // Kids mode animations
      animation: {
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pop': 'pop 0.3s ease-out',
        'breathe': 'breathe 4s ease-in-out infinite',
        'slide-up': 'slide-up 300ms ease forwards',
        'fade-in-out': 'fade-in-out 2s ease-in-out',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'breathe': {
          '0%, 100%': { opacity: '0.25', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.015)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in-out': {
          '0%': { opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
