# Design System · Icardcase Site

> Fonte de verdade dos tokens: [tailwind.config.ts](tailwind.config.ts) (cores, tipografia, animação) e [app/globals.css](app/globals.css) (classes utilitárias, `.btn-*`, `.field-input`, `.surface-card`, `.reveal`).
> Mudou um token? Mude lá, não aqui — e atualize este documento.

Estética: **dark navy, Linear-style**. Fundo profundo, superfícies em escada de navy, texto quase branco, accent azul usado com **parcimônia**. `color-scheme: dark` global.

## Cores

### Superfícies (escada navy)
| Token | Valor | Uso |
|---|---|---|
| `canvas` | `#040E24` | Fundo mais profundo (âncora da página) |
| `surface-1` | `#081F4D` | Navy oficial — cards, inputs |
| `surface-2` | `#0D2858` | 1 degrau acima (hover de card) |
| `surface-3` | `#123165` | 2 degraus |
| `surface-4` | `#163972` | 3 degraus (hover forte, `<option>` selecionada) |

### Bordas (hairlines)
| Token | Valor | Uso |
|---|---|---|
| `hairline` | `#1E3168` | Borda 1px padrão (decorativa — 1.6:1, não serve para limite de controle) |
| `hairline-strong` | `#2A3F75` | Borda em hover |
| `hairline-tertiary` | `#34487F` | Borda terciária |
| `hairline-input` | `#64748B` | Borda de campo de formulário — 3.36:1 no `surface-1` (WCAG 1.4.11 pede 3:1) |

### Texto (ink)
| Token | Valor | Uso | Contraste no `canvas` |
|---|---|---|---|
| `ink` (DEFAULT) | `#F8FAFC` | Corpo principal, headings | AAA |
| `ink-muted` | `#D6DDE8` | Texto secundário | AA+ |
| `ink-subtle` | `#AAB4C4` | Terciário (calibrado p/ AA) | AA |
| `ink-tertiary` | `#8D99AB` | Quaternário, labels mono (calibrado p/ AA) | AA |

### Accent (uso escasso — CTA, foco, link)
| Token | Valor | Uso | Como texto |
|---|---|---|---|
| `accent` (DEFAULT) | `#2563EB` | **Preenchimento**: `bg-accent` do CTA, bordas, `bg-accent/10` de badge, linhas decorativas | **Não use como texto** — 3.1:1 no canvas, reprova AA |
| `accent-hover` | `#3B82F6` | Hover de fundo do `.btn-primary`; texto do `.section-kicker` | 5.2:1 no canvas, **4.3:1 no surface-1** (reprova em card) |
| `accent-focus` | `#1D4FD8` | Reservado | — |
| `accent-text` | `#60A5FA` | **Toda tipografia e ícone azul**: links, hover de título, números mono, ícones lucide | 7.55:1 canvas · 6.29 surface-1 · 5.65 surface-2 |

**Regra:** `accent` pinta, `accent-text` escreve. Hover de título em card (`group-hover:text-accent-text`), link inline, número de passo, ícone — sempre `accent-text`. Dentro de card (`surface-1`/`surface-2`), troque o `.section-kicker` por `section-kicker text-accent-text`.

### Feedback semântico
Mesmo contrato do accent: `DEFAULT` para preenchimento/borda (com alpha), `text` para tipografia/ícone.

| Token | DEFAULT | `text` | Uso |
|---|---|---|---|
| `danger` | `#EF4444` | `#F87171` | Erro de formulário (`text-danger-text`, `border-danger/40 bg-danger/10`), risco alto |
| `warning` | `#F59E0B` | `#FBBF24` | Alerta, risco médio |
| `success` | `#10B981` | `#34D399` | Sucesso, status "integrado" |

Exemplo: `<span className="rounded-md bg-success/10 px-3 py-1 text-xs text-success-text">Integrado</span>`. **Não use `red-*`/`amber-*`/`emerald-*` crus.**

> Tokens backward-compat (`surface.DEFAULT` claro, `muted`, `brand.*`, `ink.100/400/900/50`) e fontSize `hero`/`h2`/`subhead`/`eyebrow` foram **removidos** em 09/2026 (zero uso). `bg-surface` não existe mais — use a escada `surface-1…4`.
> **Regra de contraste:** pares texto/fundo calibrados pra WCAG AA (4.5:1). Não use `ink-subtle`/`ink-tertiary` sobre `surface-3`/`surface-4` sem checar.
> Exceção deliberada: o verde do WhatsApp (`#25D366`) no botão flutuante é decisão de marca, fora dos tokens.

## Tipografia

Famílias (via `next/font`, self-hosted): **Inter** (`--font-inter`, sans + display) e **JetBrains Mono** (`--font-mono`). Headings são Inter 600 com tracking negativo agressivo (Linear-style).

| Papel | Classe | Tamanho | Peso | Line-height | Tracking |
|---|---|---|---|---|---|
| Display XL (hero h1) | `text-display-xl` | `clamp(3.25rem, 9vw, 6.5rem)` | 600 | 1.0 | -0.045em |
| Display LG (h2 de seção) | `text-display-lg` | `clamp(2.25rem, 5vw, 4.25rem)` | 600 | 1.05 | -0.038em |
| Display MD | `text-display-md` | `clamp(1.875rem, 3.4vw, 2.75rem)` | 600 | 1.12 | -0.03em |
| Headline | `text-headline` | `clamp(1.5rem, 2.4vw, 1.875rem)` | 600 | 1.18 | -0.024em |
| Card title | `text-card-title` | `1.375rem` | 500 | 1.25 | -0.015em |
| Body LG | `text-body-lg` | `1.125rem` | 400 | 1.50 | -0.004em |

As quatro classes display/headline têm `overflow-wrap: break-word` em `globals.css` (palavras longas do pt-BR não estouram 320px).

- **Kicker/eyebrow:** mono, uppercase, `0.75rem`, `tracking-[0.12em]`. `.eyebrow` (traço decorativo antes, texto `ink-subtle`) e `.section-kicker` (texto `accent-hover` — sobre card use `text-accent-text` junto).
- **Artigos** (cases/insights): `.prose-icardcase` (h2/h3/p/ul/a/blockquote/code; links em `accent-text`).

## Espaçamentos

Escala Tailwind padrão (4px base): `1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px, 10=40px, 12=48px, 16=64px…`. **Só use valores da escala.** Ritmo vertical de seção: `.section-y` (`py-24 sm:py-32 lg:py-40`).

## Border radius

| Valor | Onde |
|---|---|
| `rounded-md` (6px) | Botões (`.btn-*`), inputs (`.field-input`), chips, badges de status — sem pill, spec Linear |
| `rounded-lg` (8px) | Cards de conteúdo em landing, quadrados de ícone |
| `rounded-xl` (12px) | `.surface-card` (já embutido — não sobrescreva com `2xl`/`3xl`) |
| `rounded-full` | Badge circular de ícone, `pulse-ring`, botão flutuante |
| `rounded-2xl` | Só balão de mensagem do `ShadowITChat` (idioma de chat) |

## Sombras / elevação

O sistema é **flat** (Linear-spec): elevação vem de **borda 1px + mudança de superfície**, não de sombra. Exceções: `box-shadow` interno sutil no `.btn-primary` (highlight de topo) e glow no hover (`0 4px 24px -8px rgba(37,99,235,.5)`). Não introduza `shadow-lg` genérico em card.

## Grid e breakpoints

Breakpoints Tailwind: `sm 640` · `md 768` · `lg 1024` · `xl 1280`. **Mobile-first.**

| Nome | Largura | Container |
|---|---|---|
| mobile | < 640px | `px-5` |
| tablet | 640–1024px | `px-8` |
| desktop | > 1024px | `px-12`, `max-w-content` (1280px) |

Container: `.container-content` (`mx-auto w-full max-w-content px-5 sm:px-8 lg:px-12`).

## Componentes visuais

### Botões
Não há componente React `<Button>` — botões são **classes** aplicadas a `<a>`/`<Link>`/`<button>`. CTA de WhatsApp com telemetria: `WhatsAppButton` (usa as mesmas classes).

| Classe | Fundo | Texto | Borda | Quando usar |
|---|---|---|---|---|
| `.btn-primary` | `accent` → `accent-hover` | branco | — | Ação principal — uma por tela |
| `.btn-secondary` | `surface-1` → `surface-2` | `ink` | `hairline` | Ação alternativa |
| `.btn-ghost-dark` | transparente | `ink` | `hairline` | Terciária sobre fundo escuro |
| `.btn-ghost-light` | transparente | branco | branco/20 | Sobre imagem/fundo claro |

**Modificadores** (combinam com qualquer `.btn-*`):

| Classe | Efeito |
|---|---|
| `.btn-lg` | `min-h-[52px] px-8 py-3.5 text-base` — CTA final de landing, submit de formulário |
| `.btn-block` | `w-full` — botões de chat, menu mobile. Utilitário vence: `btn-block sm:w-auto` |

Base: `min-h-[44px]`, `rounded-md`, `text-sm font-medium`, `gap-2`.

```tsx
<a href="#como-funciona" className="btn-secondary">Ver o que está incluído</a>
<button type="submit" aria-disabled={enviando} className="btn-primary btn-lg btn-block sm:w-auto">Enviar</button>
<WhatsAppButton origem="raiox_final" message={TEXTO}>Agendar meu Raio-X</WhatsAppButton>
```

**Disabled:** `:disabled` e `[aria-disabled='true']` estão estilizados — `.btn-primary` vira `surface-2` + `ink-subtle` sem glow; os demais ficam `opacity-60`; hover anulado, `cursor-not-allowed`. Prefira **`aria-disabled`** em botão que já tem foco (ex.: submit durante o envio) e bloqueie no handler — `disabled` tira o elemento da tabulação e o foco cai no `body`. Não desabilite submit para "forçar" preenchimento: valide ao enviar e explique (ver `LeadForm` + LGPD).

### Inputs
Classe **`.field-input`** em `input`, `select` e `textarea`:
- `bg-surface-1`, borda `hairline-input` (3.36:1), `rounded-md`, `min-h-[44px]`, placeholder `ink-tertiary`; hover clareia a borda.
- **focus-visible:** borda + outline 2px `accent-text`, offset 2px. Nunca adicione `focus:outline-none`.
- **`aria-invalid="true"`:** borda `danger-text`.
- **disabled:** `opacity-60`, `cursor-not-allowed`.
- Sobre fundo `surface-1` (ex.: chat), adicione `bg-canvas` para destacar o campo.

Mensagem de erro: `<p id="campo-error" className="field-error">` ligada ao campo por `aria-describedby` + `aria-invalid`. **Todo input tem `<label htmlFor>`** — placeholder não é label. `<select>` nativo tem regra global para `<option>` (tokens `surface-1`/`surface-4`).

```tsx
<input id="email" className="field-input" aria-invalid={!!erro} aria-describedby={erro ? 'email-error' : undefined} />
{erro && <p id="email-error" className="field-error">{erro}</p>}
```

### Cards
`.surface-card` (`rounded-xl border border-hairline bg-surface-1`, hover sobe pra `surface-2`/`hairline-strong`). `.card-glow` adiciona borda-gradiente + spot no hover (efeito Linear). Ex.: `CasesSection`, cards de risco em `/shadow-it`.

### Logo
`public/logo-icardcase-mark.png` — **PNG transparente 50×72** (2x do exibido a 25×36, `h-9`). Servido `unoptimized` e sem `priority` (não é LCP). A versão quadrada com fundo creme (`logo-icardcase.png`) fica para ícones/JSON-LD. Texto "icardcase" em `text-ink` (variant `dark`) ou `text-surface-1` (`light`).

### Não há Modais nem Tabelas de dados no projeto (site institucional).

## Estados (todo elemento interativo)

| Estado | Tratamento |
|---|---|
| hover | Sobe uma superfície (`surface-1→2`) ou clareia accent; transições 200–500ms |
| active | Herda do hover |
| focus-visible | Global `*:focus-visible`: **outline 2px sólido `#7CA8FF`, offset 3px** (7.4:1 no canvas). `.btn-primary`: outline **branco** 2px offset 2px (vale sobre o próprio azul). `.field-input`: outline `accent-text` offset 2px. Chips do chat: `ring-2 ring-accent-text`. **Nunca remover sem substituir.** |
| disabled | `.btn-*:disabled` / `[aria-disabled=true]`; `.field-input:disabled`; `<option value="" disabled>` |
| invalid | `.field-input[aria-invalid=true]` + `.field-error` via `aria-describedby`; foco vai ao primeiro campo inválido |
| loading | `aria-disabled` no botão + `<Loader2>` girando; `aria-busy` no form |

## Ícones

Biblioteca: **lucide-react** (`import { Code2 } from 'lucide-react'`). Tamanho padrão `h-4 w-4`/`h-5 w-5`, `strokeWidth={1.6}` nos ícones de serviço. Cor via token: `text-ink-subtle` em repouso, **`text-accent-text`** para ícone azul (nunca `text-accent`). Ícone decorativo → `aria-hidden`; ícone sozinho com significado → `aria-label`. SVG inline usa `stroke="currentColor"` + classe de token, nunca hex.

## Animação

Keyframes no `tailwind.config.ts`: `enter` (entrada do Hero) e `pulse-ring`. Classe `animate-enter` = `enter 0.6s … both`; atraso com `[animation-delay:120ms]`.

- **Nada de conteúdo escondido no HTML do servidor.** Conteúdo acima da dobra (h1, subtítulo) não anima. Entradas do Hero são **CSS puro** com `fill-mode: both` — rodam sem JS.
- **Entrada ao rolar:** componente `Reveal` (ver COMPONENTS.md) + classes `.reveal` / `.reveal-rise` em `globals.css`. Estado base visível; só esconde (`data-reveal="pending"`) o que está abaixo da dobra depois de hidratar. **Não recrie hooks de IntersectionObserver por seção.**
- `.aurora`: dois glows em radial-gradient **sem `filter: blur`** (custo de rasterização); drift só a partir de `md`.
- Outros efeitos em `globals.css`: `.card-glow`, `.grain-overlay`, `.link-underline`, `.edge-highlight`, `.hero-grid`.
- **`prefers-reduced-motion`** é respeitado globalmente: duração **e delay** de animação/transição zerados. Exceções que precisam checar a media query no JS: count-up (`AnimatedCounter`), `Reveal`, parallax e **SMIL** (`<animate>`/`<animateMotion>` ignoram CSS — o `HeroBackdrop` só os monta sem reduced-motion), pausas de digitação do `ShadowITChat`.

## Responsividade

- **Mobile-first**, sempre. Estilo base pra mobile, sobe com `sm:`/`lg:`.
- Área de toque mínima **44×44px** (`.btn-*`, `.nav-link`, `.field-input` garantem; botão de ícone usa `h-11 w-11`).
- Imagens com `max-width:100%` implícito via `next/image` + `width`/`height`.

## Criando um componente novo

1. Existe algo parecido? Veja [COMPONENTS.md](COMPONENTS.md).
2. Use os tokens acima — **nenhum valor hardcoded** (nem hex, nem px fora da escala).
3. Cubra os estados: default, hover, `focus-visible`, disabled, loading.
4. Teste em mobile (< 640px) e sem JS (o conteúdo aparece?).
5. Cheque contraste (AA) — texto azul é `accent-text`.
6. Documente aqui (se for visual reutilizável) e em COMPONENTS.md.
