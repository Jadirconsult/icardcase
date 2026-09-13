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

        // Borda de campo de formulário. hairline (1.6:1) some sobre surface-1;
        // WCAG 1.4.11 pede 3:1 para o limite de um controle. #64748B dá
        // 3.36:1 no surface-1 e 4.0:1 no canvas — é o cinza da identidade.
        'hairline-input': '#64748B',

        // ─── Texto ────────────────────────────────────────────────────────
        ink: {
          DEFAULT: '#F8FAFC',        // body principal
          muted: '#D6DDE8',          // secundário
          subtle: '#AAB4C4',         // terciário (contraste AA reforçado)
          tertiary: '#8D99AB',       // quaternário (contraste AA reforçado)
        },

        // ─── Accent (uso escasso) ─────────────────────────────────────────
        accent: {
          DEFAULT: '#2563EB',        // CTA primary
          hover: '#3B82F6',          // hover (mais claro)
          focus: '#1D4FD8',          // focus ring
          // Para TEXTO. 7.55:1 no canvas, 6.29 no surface-1, 5.65 no
          // surface-2 — passa nas tres. Use accent para preenchimento,
          // accent-text para tipografia e icone sobre fundo escuro.
          text: '#60A5FA',
        },

        // ─── Feedback semântico ───────────────────────────────────────────
        // Mesmo contrato do accent: DEFAULT para preenchimento/borda (use com
        // alpha: bg-danger/10, border-danger/40), `text` para tipografia e
        // ícone. Os `text` passam AA no canvas e no surface-1
        // (danger 5.8:1, warning 9.6:1, success 8.1:1 no surface-1).
        danger: { DEFAULT: '#EF4444', text: '#F87171' },
        warning: { DEFAULT: '#F59E0B', text: '#FBBF24' },
        success: { DEFAULT: '#10B981', text: '#34D399' },

        // Tokens backward-compat (surface.DEFAULT claro, muted, brand.*,
        // ink.100/400/900/50) removidos em 09/2026: zero uso em app/,
        // components/ e lib/ — e `bg-surface` gerava um fundo #F8FAFC que
        // parecia fazer parte da escada navy.
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
        'body-lg': ['1.125rem', { lineHeight: '1.50', letterSpacing: '-0.004em', fontWeight: '400' }],
        // subhead, eyebrow, hero e h2 removidos em 09/2026: sem uso (hero/h2
        // eram cópias antigas de display-xl/display-lg).
      },
      keyframes: {
        // Entrada do Hero. Roda só em CSS, com fill-mode `both`: o elemento
        // fica no estado 0% durante o delay (sem flash) e o texto existe no
        // HTML mesmo sem JS. O reset de reduced-motion no globals.css zera
        // duração e delay.
        enter: {
          '0%': { opacity: '0', transform: 'translateY(0.75rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        enter: 'enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // fade-up, fade-in, float e gradient-shift removidos: sem uso.
      },
    },
  },
  plugins: [],
}

export default config
