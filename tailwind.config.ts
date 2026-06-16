import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Surface ladder Linear-style (navy Icardcase) ──────────────────
        canvas: '#040E24',           // mais profundo (anchor)
        'surface-1': '#081F4D',      // navy oficial
        'surface-2': '#0D2858',      // 1 step
        'surface-3': '#123165',      // 2 steps
        'surface-4': '#163972',      // 3 steps (hover)
        hairline: '#1E3168',         // border 1px
        'hairline-strong': '#2A3F75',
        'hairline-tertiary': '#34487F',

        // ─── Texto ────────────────────────────────────────────────────────
        ink: {
          DEFAULT: '#F8FAFC',        // body principal
          muted: '#D6DDE8',          // secundário
          subtle: '#AAB4C4',         // terciário (contraste AA reforçado)
          tertiary: '#8D99AB',       // quaternário (contraste AA reforçado)
          100: '#EAF1FF',            // light surface (light mode raro)
          400: '#64748B',            // backward-compat
          900: '#081F4D',            // backward-compat
          50: '#F8FAFC',
        },

        // ─── Accent (uso escasso) ─────────────────────────────────────────
        accent: {
          DEFAULT: '#2563EB',        // CTA primary
          hover: '#3B82F6',          // hover (mais claro)
          focus: '#1D4FD8',          // focus ring
        },

        // ─── Backward-compat tokens (usados pelos componentes existentes) ─
        surface: { DEFAULT: '#F8FAFC', alt: '#EAF1FF' },
        muted: '#64748B',
        brand: {
          navy: '#081F4D',
          blue: { DEFAULT: '#2563EB', light: '#EAF1FF' },
          gray: { DEFAULT: '#64748B', bg: '#F8FAFC' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SF Mono', 'monospace'],
      },
      maxWidth: {
        content: '1280px',
      },
      letterSpacing: {
        'tracking-display-xl': '-0.04em',
        'tracking-display-lg': '-0.032em',
        'tracking-display-md': '-0.025em',
        'tracking-headline': '-0.022em',
        'wide-2': '0.1em',
        'eyebrow': '0.05em',
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6.5vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.10', letterSpacing: '-0.032em', fontWeight: '600' }],
        'display-md': ['clamp(1.75rem, 3.2vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '600' }],
        'headline': ['clamp(1.5rem, 2.2vw, 1.75rem)', { lineHeight: '1.20', letterSpacing: '-0.022em', fontWeight: '600' }],
        'card-title': ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
        'subhead': ['1.25rem', { lineHeight: '1.40', letterSpacing: '-0.008em', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.50', letterSpacing: '-0.004em', fontWeight: '400' }],
        'eyebrow': ['0.8125rem', { lineHeight: '1.30', letterSpacing: '0.05em', fontWeight: '500' }],
        hero: ['clamp(2.5rem, 6.5vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '600' }],
        h2: ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.10', letterSpacing: '-0.032em', fontWeight: '600' }],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        float: 'float 3.5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
