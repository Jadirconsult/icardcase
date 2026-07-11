# Design System · Icardcase Site

> Fonte de verdade dos tokens: [tailwind.config.ts](tailwind.config.ts) (cores, tipografia, animação) e [app/globals.css](app/globals.css) (classes utilitárias, `.btn-*`, `.surface-card`).
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
| `hairline` | `#1E3168` | Borda 1px padrão |
| `hairline-strong` | `#2A3F75` | Borda em hover |
| `hairline-tertiary` | `#34487F` | Borda terciária |

### Texto (ink)
| Token | Valor | Uso | Contraste no `canvas` |
|---|---|---|---|
| `ink` (DEFAULT) | `#F8FAFC` | Corpo principal, headings | AAA |
| `ink-muted` | `#D6DDE8` | Texto secundário | AA+ |
| `ink-subtle` | `#AAB4C4` | Terciário (calibrado p/ AA) | AA |
| `ink-tertiary` | `#8D99AB` | Quaternário, labels mono (calibrado p/ AA) | AA |

### Accent (uso escasso — só CTA, foco, link)
| Token | Valor | Uso |
|---|---|---|
| `accent` (DEFAULT) | `#2563EB` | CTA primário, foco |
| `accent-hover` | `#3B82F6` | Hover (mais claro), kickers |
| `accent-focus` | `#1D4FD8` | Focus ring |

> Existem tokens `brand.*`, `surface.DEFAULT`, `ink.400/900` de **backward-compat** — não use em código novo; prefira a escada acima.
> **Regra de contraste:** pares texto/fundo já foram calibrados pra WCAG AA (4.5:1). Não use `ink-subtle`/`ink-tertiary` sobre `surface-3`/`surface-4` sem checar.

## Tipografia

Famílias (via `next/font`, self-hosted): **Inter** (`--font-inter`, sans + display) e **JetBrains Mono** (`--font-mono`). Headings são Inter 600 com tracking negativo agressivo (Linear-style, definido em `globals.css`).

| Papel | Classe | Tamanho | Peso | Line-height |
|---|---|---|---|---|
| Display XL (hero) | `text-display-xl` | `clamp(2.5rem, 6.5vw, 5rem)` | 600 | 1.05 |
| Display LG (h1) | `text-display-lg` | `clamp(2rem, 4.5vw, 3.5rem)` | 600 | 1.10 |
| Display MD (h2) | `text-display-md` | `clamp(1.75rem, 3.2vw, 2.5rem)` | 600 | 1.15 |
| Headline | `text-headline` | `clamp(1.5rem, 2.2vw, 1.75rem)` | 600 | 1.20 |
| Card title | `text-card-title` | `1.375rem` | 500 | 1.25 |
| Body LG | `text-body-lg` | `1.125rem` | 400 | 1.50 |
| Eyebrow | `text-eyebrow` / `.eyebrow` | `0.8125rem` | 500 | tracking +0.05em |

- **Kicker/eyebrow:** mono, uppercase, `tracking-[0.12em]`. Classes prontas: `.eyebrow` (traço antes, texto `ink-subtle`) e `.section-kicker` (texto `accent-hover`).
- **Artigos** (cases/insights): use a classe `.prose-icardcase` (estiliza h2/h3/p/ul/a/blockquote/code no tom do site).

## Espaçamentos

Escala Tailwind padrão (4px base): `1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px, 10=40px, 12=48px, 16=64px…`. **Só use valores da escala.** Ritmo vertical de seção: classe `.section-y` (`py-24 sm:py-32 lg:py-40`).

## Border radius

| Valor | Onde |
|---|---|
| `rounded-md` (6px) | Botões (`.btn-*`) — sem pill, spec Linear |
| `rounded-lg` (8px) | Cards de conteúdo em landing |
| `rounded-xl` (12px) | `.surface-card` |
| `rounded-full` | Badges de ícone, `pulse-ring` |

## Sombras / elevação

O sistema é **flat** (Linear-spec): elevação vem de **borda 1px + mudança de superfície**, não de sombra. Exceções: `box-shadow` interno sutil no `.btn-primary` (highlight de topo) e glow no hover (`0 4px 24px -8px rgba(37,99,235,.5)`). Não introduza `shadow-lg` genérico em card.

## Grid e breakpoints

Breakpoints Tailwind: `sm 640` · `md 768` · `lg 1024` · `xl 1280`. **Mobile-first.**

| Nome | Largura | Container |
|---|---|---|
| mobile | < 640px | `px-5` |
| tablet | 640–1024px | `px-8` |
| desktop | > 1024px | `px-12`, `max-w-content` (1280px) |

Container: classe `.container-content` (`mx-auto w-full max-w-content px-5 sm:px-8 lg:px-12`).

## Componentes visuais

### Botões
Não há componente React `<Button>` — botões são **classes utilitárias** aplicadas a `<a>`/`<Link>`/`<button>`.

| Classe | Fundo | Texto | Borda | Quando usar |
|---|---|---|---|---|
| `.btn-primary` | `accent` | branco | — | Ação principal — uma por tela |
| `.btn-secondary` | `surface-1` | `ink` | `hairline` | Ação alternativa |
| `.btn-ghost-dark` | transparente | `ink` | `hairline` | Terciária sobre fundo escuro |
| `.btn-ghost-light` | transparente | branco | branco/20 | Sobre imagem/fundo claro |

Todas têm `min-h-[44px]` (área de toque). Exemplo real:
```tsx
<a href={buildWhatsAppUrl()} className="btn-primary">Conversar</a>
<a href="#como-funciona" className="btn-secondary">Ver o que está incluído</a>
```

### Inputs
Estilizados inline no [components/LeadForm.tsx](components/LeadForm.tsx) com tokens dark: `bg-surface-1 border border-hairline text-ink placeholder:text-ink-tertiary`. Estados: default, focus (`focus-visible` global), error (`role="alert"` + `aria-live`). **Todo input tem `<label htmlFor>`** — placeholder não é label. `<select>` nativo tem regra global pra `<option>` (fundo `#081F4D`) em `globals.css`.

### Cards
Classe base `.surface-card` (`rounded-xl border border-hairline bg-surface-1`, hover sobe pra `surface-2`/`hairline-strong`). Adicione `.card-glow` para a borda-gradiente + spot no hover (efeito Linear). Ex.: `CasesSection`, cards de dores em `/raio-x-de-ti`.

### Não há Modais nem Tabelas de dados no projeto (site institucional).

## Estados (todo elemento interativo)

| Estado | Tratamento |
|---|---|
| hover | Sobe uma superfície (`surface-1→2`) ou clareia accent; transições 200–500ms |
| active | Herda do hover |
| focus-visible | Outline accent global (`*:focus-visible` no `globals.css`) — **nunca remover sem substituir** |
| disabled | `<option value="" disabled>`; botões via `aria-disabled` + opacidade |
| loading | `LeadForm` troca ícone por `<Loader2>` girando e bloqueia re-submit |

## Ícones

Biblioteca: **lucide-react** (`import { Code2 } from 'lucide-react'`). Tamanho padrão `h-4 w-4`/`h-5 w-5`, `strokeWidth={1.6}` nos ícones de serviço. Cor via token (`text-ink-subtle`, `text-accent`). Ícone decorativo → `aria-hidden`; ícone sozinho com significado → `aria-label`. O `Logo` é SVG inline próprio ([components/Logo.tsx](components/Logo.tsx)).

## Animação

Keyframes no `tailwind.config.ts`: `fade-up`, `fade-in`, `float`, `pulse-ring`, `gradient-shift`. Efeitos custom no `globals.css`: `.aurora` (glows accent driftando no Hero), `.card-glow`, `.grain-overlay`, `.link-underline`, `.edge-highlight`. **`prefers-reduced-motion` é respeitado globalmente** — animação nova não precisa reimplementar isso, mas count-ups via JS (`AnimatedCounter`) checam a media query manualmente.

## Responsividade

- **Mobile-first**, sempre. Escreva o estilo base pra mobile e suba com `sm:`/`lg:`.
- Área de toque mínima **44×44px** (as classes `.btn-*`/`.nav-link` garantem).
- Imagens com `max-width:100%` implícito via `next/image` + `width`/`height`.

## Criando um componente novo

1. Existe algo parecido? Veja [COMPONENTS.md](COMPONENTS.md).
2. Use os tokens acima — **nenhum valor hardcoded** (nem hex, nem px fora da escala).
3. Cubra os estados: default, hover, `focus-visible`, disabled, loading.
4. Teste em mobile (< 640px).
5. Cheque contraste (AA).
6. Documente aqui (se for visual reutilizável) e em COMPONENTS.md.
