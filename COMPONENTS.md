# Evite criar componentes repetidos

> Antes de criar QUALQUER componente, procure aqui (Ctrl+F).
> Encontrou algo parecido? Estenda com uma prop nova em vez de duplicar.

Todos ficam em `components/`, em **PascalCase.tsx**, **named export**, um por arquivo. A maioria é auto-contida (sem props) — são **seções** montadas na home. Botões NÃO são componentes: são as classes `.btn-*` do [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

**Client?** = o arquivo tem `'use client'`. Server Component é o padrão: seção só vira client se tiver estado/efeito/evento próprio. Animação de entrada NÃO é motivo — use `Reveal` em volta do trecho.

## Índice
| Componente | Categoria | Uma linha | Client? |
|---|---|---|---|
| `Logo` | UI | Logo oficial em PNG transparente + "icardcase" | não |
| `AnimatedCounter` | UI | Número que conta até o valor ao entrar na viewport | sim |
| `Reveal` | UI | Wrapper de animação de entrada ao rolar, sem esconder conteúdo no SSR | sim |
| `WhatsAppButton` | UI | CTA/float de WhatsApp com telemetria de clique | sim |
| `ConditionalChrome` | Layout | Oculta Header/Footer/float em landings pagas | sim |
| `Header` | Layout | Barra de navegação sticky + menu mobile | sim |
| `Footer` | Layout | Rodapé institucional | não |
| `MarkdownContent` | UI | Renderiza markdown dos artigos como React escapado | não |
| `RelatedLinks` | UI | Bloco "Veja também" com links internos | não |
| `LeadForm` | Feature | Formulário de captação de lead | sim |
| `ShadowITChat` | Feature | Diagnóstico de Shadow IT por conversa roteirizada (gera lead) | sim |
| `LazyShadowITChat` | Feature | `ShadowITChat` carregado sob demanda perto da viewport | sim |
| `GoogleTag` | Feature | Google Ads tag (lazy) + conversão de clique no WhatsApp | sim |
| `Hero` | Seção | Hero da home (h1, CTAs, stats) | não |
| `HeroBackdrop` | Seção (parte) | Fundo do Hero: mesh, grid e constelação com parallax | sim |
| `ClientSectors` | Seção | Faixa de setores atendidos | não |
| `Services` | Seção | Grid das 5 frentes de serviço | não |
| `DataUnification` | Seção | Bloco temático de dados fragmentados / exposição | não |
| `DiagnosticoSection` | Seção | Texto + chat de diagnóstico de Shadow IT na home | não |
| `Differentials` | Seção | Diferenciais da Icardcase | não |
| `CasesSection` | Seção | Grade de cases na home | não |
| `InsightsSection` | Seção | Lista de insights na home | não |
| `FinalCTA` | Seção | Chamada final pra conversão (home e páginas de serviço) | não |

## Padrões de nomenclatura
- Nome = o que o componente **É**, não onde aparece. `CasesSection` ✅ · `HomeCases` ❌.
- Categorias: **UI** (burro, reutilizável) · **Layout** (estrutura de página) · **Feature** (tem regra de negócio) · **Seção** (bloco de conteúdo da home, auto-contido).
- Um componente por arquivo; nome do arquivo = nome do componente.

---

## Logo
**Objetivo:** marca da Icardcase — logo oficial (o "i" azul + circuito de nós) em `public/logo-icardcase-mark.png` (PNG transparente 50×72, exibido a 25×36), com texto opcional. A versão quadrada com fundo creme fica em `public/logo-icardcase.png` (ícones, JSON-LD).
**Arquivo:** [components/Logo.tsx](components/Logo.tsx)
**Quando utilizar:** header, footer, topo de landing, 404.
**Quando NÃO utilizar:** como favicon (use os assets de `public/`).
**Acessibilidade:** com `showText`, a imagem é decorativa (`alt=""` + `aria-hidden`) — o nome vem do texto. Com `showText={false}`, `alt="Icardcase"`. Link em volta: `aria-label` deve **começar pelo texto visível** (ex.: `"icardcase — página inicial"`).
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `variant` | `'light' \| 'dark'` | não | `'light'` | Cor do texto: `dark` = `text-ink` (sobre o navy do site), `light` = `text-surface-1`. O ícone é sempre o azul oficial |
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
| `className` | `string` | não | — | Classes do `<span>` |
```tsx
<AnimatedCounter to={14} suffix="+" />
```

## Reveal
**Objetivo:** animação de entrada ao rolar (fade + subida) que **nunca esconde conteúdo no HTML do servidor**. Estado inicial visível; após hidratar, só o que está abaixo da dobra ganha `data-reveal="pending"` e reaparece ao entrar na viewport. Sem JS, sem IntersectionObserver ou com `prefers-reduced-motion`, fica visível direto. Estilos em `.reveal`/`.reveal-rise` (`globals.css`).
**Arquivo:** [components/Reveal.tsx](components/Reveal.tsx)
**Quando utilizar:** entrada de blocos/cards abaixo da dobra. Os filhos podem ser Server Components — a seção continua server. Substitui o hook de IntersectionObserver que era copiado em cada seção.
**Quando NÃO utilizar:** conteúdo acima da dobra/LCP (h1 do Hero) — lá, sem animação ou `animate-enter` (CSS). Não ponha hover com `transform`/`transition` no próprio `Reveal`: envolva o card (o `Reveal` controla opacity/transform de entrada).
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `children` | `ReactNode` | **sim** | — | Conteúdo |
| `as` | `'div' \| 'li' \| 'section' \| 'article'` | não | `'div'` | Elemento renderizado (use `li` dentro de `<ul>`) |
| `variant` | `'fade-up' \| 'rise'` | não | `'fade-up'` | `fade-up` sobe 1rem; `rise` sobe 2.5rem com scale .97 (cards) |
| `delay` | `number` | não | `0` | Atraso em ms (stagger) |
| `className` | `string` | não | — | Classes do elemento |
```tsx
{items.map((item, i) => (
  <Reveal key={item.id} as="li" variant="rise" delay={i * 90} className="bg-canvas">…</Reveal>
))}
```

## WhatsAppButton
**Objetivo:** CTA de WhatsApp que registra o clique em `/api/whatsapp-click` antes de abrir a conversa (a conversão do Ads sai pelo listener do `GoogleTag`).
**Arquivo:** [components/WhatsAppButton.tsx](components/WhatsAppButton.tsx)
**Quando utilizar:** qualquer CTA que leve ao WhatsApp e que você queira medir — obrigatório nas landings pagas, com `origem` específica (em uso: `home_hero`, `final_cta`, `raiox_hero`, `raiox_final`, `shadowit_contato`, `shadowit_final`, `abordagem_cta`, `float_button`). O `variant="float"` é o botão flutuante global (já montado no `layout.tsx`).
**Quando NÃO utilizar:** link de WhatsApp sem necessidade de telemetria → use `buildWhatsAppUrl()` de `lib/constants` num `<a>` simples.
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `origem` | `string` | **sim** | — | Identificador da origem do clique (telemetria) |
| `variant` | `'float' \| 'primary' \| 'ghost-dark' \| 'unstyled'` | não | `'primary'` | `primary`/`ghost-dark` = `.btn-*`; `float` = botão fixo; `unstyled` = sem classe base (layout próprio via `className`, ex.: card de contato) |
| `message` | `string` | não | — | Texto pré-preenchido no WhatsApp |
| `className` | `string` | não | — | Classes extras (ex.: `btn-lg`, `group`) |
| `children` | `ReactNode` | não | — | Conteúdo do botão |
```tsx
<WhatsAppButton origem="raiox_final" message="Olá! Quero agendar o Raio-X.">Agendar meu Raio-X de TI</WhatsAppButton>
```

## ConditionalChrome
**Objetivo:** oculta o "chrome" do site (Header/Footer/float) em rotas de landing paga, para não dar rota de fuga no funil.
**Arquivo:** [components/ConditionalChrome.tsx](components/ConditionalChrome.tsx)
**Quando utilizar:** já está no `layout.tsx` envolvendo Header/Footer/WhatsAppButton. Landings sem chrome hoje: **`/raio-x-de-ti` e `/shadow-it`** (cada uma traz topo e rodapé mínimos próprios). Para isolar uma landing nova, **adicione o prefixo em `CHROMELESS_PREFIXES`** (não crie outro componente).
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `children` | `React.ReactNode` | **sim** | — | O que renderizar quando a rota **tem** chrome |
```tsx
<ConditionalChrome><Header /></ConditionalChrome>
```

## LeadForm
**Objetivo:** formulário de captação — validação inline no blur + honeypot + UTMs, `POST /api/lead`, card de sucesso com o Icardinho. Campos em `.field-input`; todos os erros do servidor (inclusive `segmento` e `consentimentoLgpd`) aparecem ligados por `aria-describedby` + `aria-invalid`, e o foco vai ao primeiro campo inválido. O botão fica **habilitado** (só `aria-disabled` durante o envio): sem aceite LGPD, o envio é barrado com mensagem e foco no checkbox. Sucesso → `trackLeadConversion`; erro → `trackLeadError` ([lib/analytics.ts](lib/analytics.ts)).
**Arquivo:** [components/LeadForm.tsx](components/LeadForm.tsx)
**Quando utilizar:** dentro de `<Suspense>` (usa `useSearchParams`). Hoje vive em `/contato`.
**Quando NÃO utilizar:** captação simples via WhatsApp → `WhatsAppButton`; diagnóstico conversacional → `ShadowITChat`.
**Props:** nenhuma (auto-contido). Requer boundary de Suspense no pai.
```tsx
<Suspense fallback={...}><LeadForm /></Suspense>
```

## ShadowITChat
**Objetivo:** diagnóstico de Shadow IT por conversa roteirizada (sem IA): setor → sintomas → saída de colaborador → nível de exposição → nome/empresa → contato → consentimento → `POST /api/lead` (mesmo pipeline do `LeadForm`, `origem` padrão `chat_shadow_it`). O transcript vira a `mensagem` do lead. Dispara `trackLeadConversion`/`trackLeadError`.
**Arquivo:** [components/ShadowITChat.tsx](components/ShadowITChat.tsx)
**Acessibilidade:** log com `role="log"`; a cada passo o foco vai para o primeiro controle novo quando o bot termina de "digitar"; erros de nome/empresa/e-mail/WhatsApp com mensagem visível + `aria-invalid`/`aria-describedby`; pausas zeradas com reduced-motion; timers limpos no unmount.
**Quando utilizar:** acima da dobra (hero de `/shadow-it`) — importe direto, dentro de `<Suspense>` (usa `useSearchParams`). Abaixo da dobra → `LazyShadowITChat`.
**Quando NÃO utilizar:** formulário genérico de contato → `LeadForm`.
**Props:** nenhuma.
```tsx
<Suspense fallback={<div className="surface-card h-[32rem]" aria-hidden="true" />}><ShadowITChat /></Suspense>
```

## LazyShadowITChat
**Objetivo:** `ShadowITChat` via `next/dynamic` (`ssr: false`), montado só quando o bloco chega a ~600px da viewport — tira o JS do chat do chunk inicial da home. Placeholder `surface-card h-[34rem]` evita layout shift. Sem custo de SEO: o chat já não entrava no HTML estático (bailout do `useSearchParams`).
**Arquivo:** [components/LazyShadowITChat.tsx](components/LazyShadowITChat.tsx)
**Quando utilizar:** chat abaixo da dobra (hoje: `DiagnosticoSection` na home).
**Quando NÃO utilizar:** chat acima da dobra (`/shadow-it`) — lá o atraso atrapalharia.
**Props:** nenhuma. Não precisa de Suspense no pai.

## Header
**Objetivo:** navegação sticky com blur ao rolar; menu desktop + menu mobile (botão 44×44 com `aria-expanded`/`aria-controls`; Esc fecha e devolve o foco ao botão).
**Arquivo:** [components/Header.tsx](components/Header.tsx)
**Quando utilizar:** só via `layout.tsx` (não instanciar em página). Itens do menu no array `nav` no topo do arquivo.
**Props:** nenhuma.

## Footer
**Objetivo:** rodapé institucional (navegação, serviços, contato, social). Os links ficam nos arrays `navigation` e `services` no topo do arquivo; rótulos de coluna são `h2` (não pular nível de heading).
**Arquivo:** [components/Footer.tsx](components/Footer.tsx) · **Props:** nenhuma. Só via `layout.tsx`.

## MarkdownContent
**Objetivo:** renderiza o markdown dos artigos (`##`/`###`, parágrafos, `**negrito**`, listas `- `/`1. `, links `[texto](url)`) como elementos React — texto escapado, sem `dangerouslySetInnerHTML`. Link interno vira `next/link`; externo abre em nova aba; esquema inseguro (`javascript:`) vira texto. O parser mora em [lib/markdown.ts](lib/markdown.ts).
**Arquivo:** [components/MarkdownContent.tsx](components/MarkdownContent.tsx)
**Quando utilizar:** conteúdo de `/insights/[slug]` (fonte em `lib/insights.ts`).
**Quando NÃO utilizar:** markdown fora do subconjunto acima (tabela, código, imagem) — estenda o parser antes.
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `source` | `string` | **sim** | — | Texto markdown |
| `className` | `string` | não | — | Classes do container (ex.: `prose-icardcase`, que estiliza os elementos) |
```tsx
<MarkdownContent source={post.content} className="prose-icardcase mt-12" />
```

## RelatedLinks
**Objetivo:** bloco "Veja também" no fim de artigos e cases, com links internos definidos por dados (campo `related` em `lib/insights.ts` e `lib/cases.ts`). Não renderiza nada com lista vazia.
**Arquivo:** [components/RelatedLinks.tsx](components/RelatedLinks.tsx)
**Props:**
| Prop | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `links` | `RelatedLink[]` (`{ href, label }`) | **sim** | — | Links relacionados (2–3) |
| `title` | `string` | não | `'Veja também'` | Rótulo do bloco |
```tsx
<RelatedLinks links={post.related} />
```

## GoogleTag
**Objetivo:** Google Ads (gtag) + conversão de clique no WhatsApp. Stub inline (`dataLayer`/`gtag`/`config`) cedo; `gtag/js` em `strategy="lazyOnload"` (processa a fila quando chega). Só renderiza com `NEXT_PUBLIC_GOOGLE_ADS_ID`; a conversão de WhatsApp exige também `_WHATSAPP_LABEL`. A conversão de **lead** sai de `trackLeadConversion` em [lib/analytics.ts](lib/analytics.ts) (exige `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`).
**Arquivo:** [components/GoogleTag.tsx](components/GoogleTag.tsx) · **Props:** nenhuma. Já montado no `layout.tsx`.

## HeroBackdrop
**Objetivo:** camada decorativa do `Hero` — mesh, grid (`.hero-grid`) e constelação SVG, com parallax de mouse via CSS vars (sem re-render). SMIL (`<animate>`/`<animateMotion>`) só é montado quando **não** há `prefers-reduced-motion`; no SSR a constelação sai estática.
**Arquivo:** [components/HeroBackdrop.tsx](components/HeroBackdrop.tsx)
**Quando utilizar:** só dentro do `Hero` (usa o elemento pai como área do mousemove). Existe para o texto do Hero ser Server Component.
**Props:** nenhuma.

## Seções da home (auto-contidas, sem props)
`Hero`, `ClientSectors`, `Services`, `DataUnification`, `DiagnosticoSection`, `Differentials`, `CasesSection`, `InsightsSection`, `FinalCTA` — todas **Server Components**.
São blocos montados em [app/page.tsx](app/page.tsx) (o `FinalCTA` também fecha as páginas de serviço). Cada um traz seu próprio conteúdo (arrays no topo do arquivo) e usa as classes de seção (`.section-y`, `.container-content`, `.section-kicker`). Entrada ao rolar via `Reveal`; o Hero usa `animate-enter` (CSS) e deixa h1/subtítulo sem animação. Para editar textos/itens, mexa no array dentro do próprio componente.
- `Services`: os 5 serviços e seus `href` estão no array `services` — é aqui que se liga cada card à página de serviço.
- `CasesSection` / `InsightsSection`: arrays de cases/posts. Ao adicionar item, atualize também o `app/sitemap.ts` e a rota `[slug]` correspondente.
- `DiagnosticoSection`: âncora `#diagnostico` (alvo do CTA do `DataUnification`); o chat entra via `LazyShadowITChat`.

---

## Antes de criar um componente novo
1. Ctrl+F neste arquivo.
2. Achou parecido? Adicione uma variante/prop — **não duplique** (ex.: precisa de outro botão? Use as classes `.btn-*` ou uma nova `variant` no `WhatsAppButton`).
3. Não achou? Crie e **documente aqui no mesmo commit**.
4. Use os tokens do [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) — nada hardcoded.
5. Cubra os estados: default, hover, `focus-visible`, disabled, loading.
