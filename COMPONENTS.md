# Evite criar componentes repetidos

> Antes de criar QUALQUER componente, procure aqui (Ctrl+F).
> Encontrou algo parecido? Estenda com uma prop nova em vez de duplicar.

Todos ficam em `components/`, em **PascalCase.tsx**, **named export**, um por arquivo. A maioria é auto-contida (sem props) — são **seções** montadas na home. Botões NÃO são componentes: são as classes `.btn-*` do [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

## Índice
| Componente | Categoria | Uma linha | Client? |
|---|---|---|---|
| `Logo` | UI | Logo SVG inline (ícone + "icardcase") | não |
| `AnimatedCounter` | UI | Número que conta até o valor ao entrar na viewport | sim |
| `WhatsAppButton` | UI | Botão/float de WhatsApp com telemetria de clique | sim |
| `ConditionalChrome` | Layout | Oculta Header/Footer em landings pagas | sim |
| `Header` | Layout | Barra de navegação sticky | sim |
| `Footer` | Layout | Rodapé institucional | não |
| `LeadForm` | Feature | Formulário de captação de lead | sim |
| `GoogleTag` | Feature | Injeta Google Ads tag (se env configurada) | sim |
| `Hero` | Seção | Hero da home (aurora + stats) | — |
| `Services` | Seção | Grid das 5 frentes de serviço | sim |
| `CasesSection` | Seção | Grade de cases na home | — |
| `InsightsSection` | Seção | Lista de insights na home | — |
| `Differentials` | Seção | Diferenciais da Icardcase | — |
| `DataUnification` | Seção | Bloco temático de unificação de dados | — |
| `ClientSectors` | Seção | Setores atendidos | sim |
| `FinalCTA` | Seção | Chamada final pra conversão | — |

## Padrões de nomenclatura
- Nome = o que o componente **É**, não onde aparece. `CasesSection` ✅ · `HomeCases` ❌.
- Categorias: **UI** (burro, reutilizável) · **Layout** (estrutura de página) · **Feature** (tem regra de negócio) · **Seção** (bloco de conteúdo da home, auto-contido).
- Um componente por arquivo; nome do arquivo = nome do componente.

---

## Logo
**Objetivo:** marca da Icardcase — SVG inline (o "i" estilizado + circuito de 3 nós) com texto opcional.
**Arquivo:** [components/Logo.tsx](components/Logo.tsx)
**Quando utilizar:** header, footer, topo de landing, 404.
**Quando NÃO utilizar:** como favicon (use os assets de `public/`).
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `variant` | `'light' \| 'dark'` | não | `'light'` | Cor do texto/ícone. Use `'dark'` sobre o fundo navy do site |
| `showText` | `boolean` | não | `true` | Mostra a palavra "icardcase" ao lado do ícone |
| `className` | `string` | não | — | Classes extras no wrapper |
```tsx
<Logo variant="dark" />
```

## AnimatedCounter
**Objetivo:** conta de 0 até `to` quando entra na viewport (IntersectionObserver + rAF, easeOutCubic, dispara uma vez).
**Arquivo:** [components/AnimatedCounter.tsx](components/AnimatedCounter.tsx)
**Quando utilizar:** estatísticas de impacto (ex.: stats do Hero).
**Quando NÃO utilizar:** número que muda em tempo real (ele anima uma vez só). Respeita `prefers-reduced-motion` (mostra o valor final direto).
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `to` | `number` | **sim** | — | Valor final |
| `duration` | `number` | não | `1400` | Duração em ms |
| `decimals` | `number` | não | `0` | Casas decimais |
| `suffix` | `string` | não | `''` | Ex.: `'+'`, `'%'` |
| `prefix` | `string` | não | `''` | Ex.: `'R$ '` |
```tsx
<AnimatedCounter to={14} suffix="+" />
```

## WhatsAppButton
**Objetivo:** CTA de WhatsApp que registra o clique em `/api/whatsapp-click` antes de abrir a conversa.
**Arquivo:** [components/WhatsAppButton.tsx](components/WhatsAppButton.tsx)
**Quando utilizar:** qualquer CTA que leve ao WhatsApp e que você queira medir. O `variant="float"` é o botão flutuante global (já montado no `layout.tsx`).
**Quando NÃO utilizar:** link de WhatsApp sem necessidade de telemetria → use `buildWhatsAppUrl()` de `lib/constants` num `<a>` simples.
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `origem` | `string` | **sim** | — | Identificador da origem do clique (telemetria) |
| `variant` | `'float' \| 'primary' \| 'ghost-dark'` | não | `'primary'` | Estilo. `float` = botão fixo |
| `message` | `string` | não | — | Texto pré-preenchido no WhatsApp |
| `className` | `string` | não | — | Classes extras |
| `children` | `ReactNode` | não | — | Conteúdo do botão |
```tsx
<WhatsAppButton origem="hero_cta" variant="primary">Conversar</WhatsAppButton>
```

## ConditionalChrome
**Objetivo:** oculta o "chrome" do site (Header/Footer/float) em rotas de landing paga, para não dar rota de fuga no funil.
**Arquivo:** [components/ConditionalChrome.tsx](components/ConditionalChrome.tsx)
**Quando utilizar:** já está no `layout.tsx` envolvendo Header/Footer/WhatsAppButton. Para isolar uma landing nova, **adicione o prefixo em `CHROMELESS_PREFIXES`** (não crie outro componente).
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `children` | `React.ReactNode` | **sim** | — | O que renderizar quando a rota **tem** chrome |
```tsx
<ConditionalChrome><Header /></ConditionalChrome>
```

## LeadForm
**Objetivo:** formulário de captação — validação client + honeypot + UTMs, `POST /api/lead`, card de sucesso com o Icardinho.
**Arquivo:** [components/LeadForm.tsx](components/LeadForm.tsx)
**Quando utilizar:** dentro de `<Suspense>` (usa `useSearchParams`). Hoje vive em `/contato`.
**Quando NÃO utilizar:** captação simples via WhatsApp → `WhatsAppButton`.
**Props:** nenhuma (auto-contido). Requer boundary de Suspense no pai.
```tsx
<Suspense fallback={...}><LeadForm /></Suspense>
```

## Header
**Objetivo:** navegação sticky com blur ao rolar; menu desktop + drawer mobile.
**Arquivo:** [components/Header.tsx](components/Header.tsx)
**Quando utilizar:** só via `layout.tsx` (não instanciar em página). Itens do menu no array `nav` no topo do arquivo.
**Props:** nenhuma.

## Footer
**Objetivo:** rodapé institucional (links, contato, social).
**Arquivo:** [components/Footer.tsx](components/Footer.tsx) · **Props:** nenhuma. Só via `layout.tsx`.

## GoogleTag
**Objetivo:** injeta o script do Google Ads (gtag) e conversão de clique de WhatsApp. Só renderiza se `NEXT_PUBLIC_GOOGLE_ADS_ID`/`_WHATSAPP_LABEL` existirem.
**Arquivo:** [components/GoogleTag.tsx](components/GoogleTag.tsx) · **Props:** nenhuma. Já montado no `layout.tsx`.

## Seções da home (auto-contidas, sem props)
`Hero`, `Services`, `CasesSection`, `InsightsSection`, `Differentials`, `DataUnification`, `ClientSectors`, `FinalCTA`.
São blocos montados em [app/page.tsx](app/page.tsx). Cada um traz seu próprio conteúdo (arrays no topo do arquivo) e usa as classes de seção (`.section-y`, `.container-content`, `.section-kicker`). Para editar textos/itens, mexa no array dentro do próprio componente.
- `Services`: os 5 serviços e seus `href` estão no array `services` — é aqui que se liga cada card à página de serviço.
- `CasesSection` / `InsightsSection`: arrays de cases/posts. Ao adicionar item, atualize também o `app/sitemap.ts` e a rota `[slug]` correspondente.

---

## Antes de criar um componente novo
1. Ctrl+F neste arquivo.
2. Achou parecido? Adicione uma variante/prop — **não duplique** (ex.: precisa de outro botão? Use as classes `.btn-*` ou uma nova `variant` no `WhatsAppButton`).
3. Não achou? Crie e **documente aqui no mesmo commit**.
4. Use os tokens do [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) — nada hardcoded.
5. Cubra os estados: default, hover, `focus-visible`, disabled, loading.
