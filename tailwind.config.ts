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
        // Medida de leitura para conteúdo long-form (artigos, cases, headers
        // editoriais). ~72ch no corpo de 18px — dentro do piso 65–75ch.
        // Antes indefinida: o texto renderizava a 1280px (~130ch, ilegível).
        'prose-wide': '42rem',
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
        // Piso subido de 2.75rem para 3.25rem: o termo fluido 7.5vw so alcancava
        // o piso antigo a 587px, entao TODO telefone renderizava a 44px e o
        // upgrade display de 6.5rem era ganho exclusivo de desktop. A 375px a
        // hierarquia h1/h2 era 1.22x contra 1.53x no desktop — comprimida
        // justamente onde tudo esta empilhado e so ela orienta a leitura.
        // 9vw (nao 12vw) para nao transformar o desktop de tabela junto.
        'display-xl': ['clamp(3.25rem, 9vw, 6.5rem)', { lineHeight: '1.0', letterSpacing: '-0.045em', fontWeight: '600' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4.25rem)', { lineHeight: '1.05', letterSpacing: '-0.038em', fontWeight: '600' }],
        'display-md': ['clamp(1.875rem, 3.4vw, 2.75rem)', { lineHeight: '1.12', letterSpacing: '-0.03em', fontWeight: '600' }],
        'headline': ['clamp(1.5rem, 2.4vw, 1.875rem)', { lineHeight: '1.18', letterSpacing: '-0.024em', fontWeight: '600' }],
        'card-title': ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
        'subhead': ['1.25rem', { lineHeight: '1.40', letterSpacing: '-0.008em', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.50', letterSpacing: '-0.004em', fontWeight: '400' }],
        'eyebrow': ['0.8125rem', { lineHeight: '1.30', letterSpacing: '0.05em', fontWeight: '500' }],
        hero: ['clamp(2.75rem, 7.5vw, 6.5rem)', { lineHeight: '1.0', letterSpacing: '-0.045em', fontWeight: '600' }],
        h2: ['clamp(2.25rem, 5vw, 4.25rem)', { lineHeight: '1.05', letterSpacing: '-0.038em', fontWeight: '600' }],
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
