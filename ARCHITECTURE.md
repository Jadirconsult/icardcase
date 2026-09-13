# Arquitetura · Icardcase Site

## Visão geral

Site institucional B2B renderizado com **Next.js 16 (App Router)** e hospedado na **Vercel**. A maioria das páginas é estática/SSG (conteúdo institucional e SEO); a parte dinâmica são três **route handlers** server-side que capturam leads, registram telemetria de cliques e mantêm o banco Supabase acordado. Persistência em **Supabase (Postgres + RLS)**, rate-limit em **Upstash Redis**, notificação por **SMTP (Nodemailer)**.

```
[Navegador]
    │  GET páginas (SSG/SSR)          POST /api/lead, /api/whatsapp-click
    ▼
[Next.js 16 @ Vercel] ──────────────────────────────────────────────┐
    │  service_role (server-only)          waitUntil() (background)  │
    ▼                                              ▼                 │
[Supabase Postgres + RLS]                    [SMTP cPanel]           │
    ▲                                                                │
    │  GET /api/cron/keep-alive (Bearer CRON_SECRET)                 │
[Vercel Cron — diário] ─────────────────────────────────────────────┘
    rate-limit: [Upstash Redis]   ·   telemetria: [Vercel Analytics + Speed Insights]
```

## Stack

| Camada | Tecnologia | Versão | Por quê |
|---|---|---|---|
| Front | Next.js App Router + React | 16.3.5 / 19.2.7 | SSG pra SEO, RSC pra bundle enxuto, hospedagem nativa Vercel |
| Linguagem | TypeScript strict | 5.6.3 | Segurança de tipos ponta a ponta |
| Estilo | Tailwind CSS + classes utilitárias custom | 3.4.13 | Design system via tokens, zero CSS solto |
| Banco | Supabase (Postgres + RLS) | 2.45 | Postgres gerenciado, RLS, RPC, região sa-east-1 |
| Rate limit | Upstash Redis | 2.0 | Sliding window serverless, sem infra própria |
| E-mail | Nodemailer + SMTP | 9.1 | Caixa do próprio domínio (cPanel/Hostinger) |
| Validação | Zod | 3.23 | Schema único, deriva tipos |
| Lint | ESLint 9 (flat config) + eslint-config-next | 16.3.5 | `next lint` saiu no Next 16 → `eslint .` com `eslint.config.mjs` |
| Infra | Vercel (host, Cron, Analytics, Speed Insights) | — | Deploy automático via GitHub, edge network |

## Organização das pastas

```
app/           # App Router: cada subpasta é uma rota (page.tsx). layout.tsx = shell global.
  api/         # route handlers (runtime nodejs). NÃO mora aqui lógica de UI.
    lead/                # POST — captura de lead
    whatsapp-click/      # POST — telemetria de clique
    cron/keep-alive/     # GET  — anti-pause Supabase (chamado pelo Vercel Cron)
components/    # componentes React (UI + seções). NÃO fala com banco direto.
lib/           # lógica sem JSX: supabase, validation, notify, rate-limit, origin, constants, utils.
supabase/      # DDL e scripts SQL. Rodados À MÃO no SQL Editor — não há migração automática.
public/        # assets estáticos (icardinho.png, favicons, og).
docs/          # documentação operacional/campanha (parte gitignored).
```

O que **não** mora onde: componente nunca importa `getSupabaseAdmin` (isso é server-only, vive nos route handlers); route handler nunca renderiza JSX; segredo nunca mora no código (só env var na Vercel).

## Fluxo completo: envio do formulário de lead

1. [components/LeadForm.tsx](components/LeadForm.tsx) — `'use client'`. Valida no browser (UX: `validateField` no `onBlur`), captura UTMs de `useSearchParams`, `POST /api/lead` com JSON (fetch same-origin). O chat de [components/ShadowITChat.tsx](components/ShadowITChat.tsx) usa o mesmo endpoint.
2. [app/api/lead/route.ts](app/api/lead/route.ts) — pipeline server-side, em ordem:
   - **Origin/Referer** (`isAllowedOrigin` de [lib/origin.ts](lib/origin.ts)) → 403 genérico se ausente/estranho em produção.
   - **Content-Type** precisa ser `application/json` → 415 caso contrário (fecha CSRF via `<form>` HTML).
   - **Rate limit** (`checkRateLimit(leadFormRateLimit, ip)`) → 429 se exceder (3/hora por IP).
   - **Parse + Zod** (`leadSchema.safeParse`) → 400 com `issues` se inválido.
   - **Honeypot**: se `website` preenchido, retorna 200 com UUID **falso** (não grava) — bot pensa que funcionou.
   - **Sanitize** (`sanitizeText`) nos campos de texto.
   - **Insert** no Supabase via `getSupabaseAdmin()` (service_role, bypassa RLS) → 500 genérico se falhar (código do erro só no log).
   - **Notificação** por e-mail dentro de `waitUntil(notifyLeadViaEmail(...))` — não bloqueia a resposta.
   - Retorna 200 com o `id` real.
3. [lib/notify.ts](lib/notify.ts) — monta e-mail HTML+texto, `subject` passado por `sanitizeHeader` (anti CR/LF), envia via SMTP. **Falha silenciosa**: se o SMTP cair, o lead já está gravado; loga `[Lead] Falha SMTP` e segue.

## Front-end

- **Renderização:** institucional é SSG (`○ Static`) e SSG com `generateStaticParams` (`● SSG`) para `cases/[slug]` e `insights/[slug]`. Os `api/*` são dinâmicos (`ƒ`).
- **Estado:** só local (`useState`), nos poucos client components (`Header`, `LeadForm`, `Services`, `AnimatedCounter`, `ClientSectors`). Não há store global.
- **Roteamento:** App Router baseado em pastas. `layout.tsx` injeta Header/Footer/WhatsApp float via `ConditionalChrome` (que os oculta em landings de `CHROMELESS_PREFIXES`).
- **Compartilhado:** UI em `components/`, lógica em `lib/`, constantes de marca em [lib/constants.ts](lib/constants.ts) (`SITE`, `COMPANY`, `buildWhatsAppUrl`).
- **Terceiros no browser:** só a tag do Google Ads ([components/GoogleTag.tsx](components/GoogleTag.tsx)), que só renderiza com `NEXT_PUBLIC_GOOGLE_ADS_ID`. O front **não** fala com Supabase nem com Google Analytics.

## Back-end

Três route handlers, todos `runtime = 'nodejs'`:

| Método | Caminho | O que faz | Quem pode chamar |
|---|---|---|---|
| POST | `/api/lead` | Captura de lead (origin → content-type → rate-limit → Zod → honeypot → sanitize → insert → e-mail) | Público, valida Origin/Referer + exige JSON + rate-limit 3/h |
| POST | `/api/whatsapp-click` | Telemetria de clique no WhatsApp (insert em `waitUntil`) | Público, valida Origin/Referer + rate-limit 10/min |
| GET | `/api/cron/keep-alive` | Incrementa `no_pause` pra Supabase não pausar | Só Vercel Cron (Bearer `CRON_SECRET`) |

- **Validação de entrada:** Zod (`leadSchema`, `whatsappClickSchema`) em [lib/validation.ts](lib/validation.ts).
- **O que vaza na resposta:** só mensagens genéricas. `error.code` do Postgres e stack ficam no `console.error`. IP em log é mascarado (`maskIp`).

## Fluxo de autenticação

**Não há autenticação de usuário** — o site é público e não tem área logada. As rotas se protegem por outros meios:
- `/api/lead` e `/api/whatsapp-click`: validação de Origin/Referer contra os domínios do site ([lib/origin.ts](lib/origin.ts) — lista fixa + `VERCEL_URL`/`VERCEL_BRANCH_URL` do próprio deploy; em dev aceita localhost e ausência dos headers) + rate-limit por IP. `/api/lead` ainda exige `Content-Type: application/json` e tem honeypot.
- `/api/cron/keep-alive`: **Bearer token** — compara `Authorization` com `CRON_SECRET` (que a Vercel injeta no cron) em tempo constante (`timingSafeEqual` sobre SHA-256). **Fail-closed**: sem `CRON_SECRET` definido, retorna 503; o alerta por e-mail desse caso sai no máximo 1×/hora (trava `SET NX EX` no Upstash via `claimOncePerWindow`) e, sem Redis, não é enviado (só log).
- Acesso ao banco: só via `service_role` (server-side, em `getSupabaseAdmin`). O RLS das tabelas é deny-all para `anon`/`authenticated`. Não existe cliente Supabase público no código.

## Fluxo de dados

- **Tabelas** (ver `supabase/schema.sql`): `leads`, `whatsapp_clicks`, `audit_log`. RLS habilitado, policies de bloqueio público em todas.
- **RPCs**: `get_leads_stats(integer)` e `increment_no_pause()` — ambas `SECURITY DEFINER`.
- **Quem lê/escreve:** só o `service_role` (bypassa RLS). `anon`/`authenticated` não têm acesso às tabelas. **Atenção:** funções `SECURITY DEFINER` furam o RLS — o `EXECUTE` delas precisa ser revogado de `anon` (ver `supabase/hardening-rpc.sql`, § Decisões).
- **IP cheio gravado:** `leads.ip_address`/`consentimento_ip` e `whatsapp_clicks.ip_address` guardam o IP completo (tipo `inet`). Nos logs ele sai sempre mascarado.
- **Anti-pause:** tabela singleton `no_pause` com contador 1..100. O Vercel Cron bate em `/api/cron/keep-alive` **diariamente** (`0 12 * * *` no `vercel.json`) → RPC `increment_no_pause()` → atividade de escrita mantém o projeto Supabase acordado (o `pg_cron` interno NÃO conta como atividade externa). Era semanal; com o Free pausando após 7 dias, semanal tinha margem zero.

## Comunicação entre módulos

- `page.tsx`/componentes → `lib/constants`, `lib/utils`, `components/*`. **Nunca** → banco.
- `app/api/*/route.ts` → `lib/validation`, `lib/rate-limit`, `lib/origin`, `lib/supabase` (admin), `lib/notify`.
- `lib/notify` → `lib/validation` (`sanitizeHeader`).
- Regra dura: **UI nunca fala com o banco direto**; passa por um route handler.

## Como adicionar uma página nova

1. Crie `app/<rota>/page.tsx` (Server Component por padrão).
2. `export const metadata` com `title`, `description` e `alternates: { canonical: '/<rota>' }`.
3. Um `<h1>`, headings em ordem. Use as classes de seção (`.section-y`, `.container-content`, `.section-kicker`).
4. Se for indexável, adicione o slug em [app/sitemap.ts](app/sitemap.ts).
5. Se for landing paga sem menu, adicione o prefixo em `CHROMELESS_PREFIXES` de [components/ConditionalChrome.tsx](components/ConditionalChrome.tsx).

## Como adicionar uma funcionalidade nova (ex.: novo endpoint)

1. Crie `app/api/<nome>/route.ts` com `export const runtime = 'nodejs'`.
2. Defina o schema Zod em `lib/validation.ts`.
3. No handler: origin (`isAllowedOrigin`, se for POST público) → rate-limit → validação → sanitize → ação → resposta genérica em erro.
4. Se gravar no banco, use `getSupabaseAdmin()`; trabalho que roda depois da resposta vai em `waitUntil()`. Se ler estatística sensível via RPC, garanta que o `EXECUTE` está revogado de `anon`.
5. Se o front precisar de um host externo novo, libere o host **exato** no CSP de `next.config.mjs`.
6. `type-check` + `lint` + `build`. Teste com `curl` real contra o endpoint.

## Como evitar dependências desnecessárias

Antes de instalar um pacote: (1) dá pra fazer com o que já existe? (2) é mantido e quantos KB entram no bundle? (3) puxa quantas transitivas? (4) registre a decisão aqui. Precedente real: `isomorphic-dompurify` foi **removido** porque puxava `jsdom` (ESM-only) e quebrava o build no runtime da Vercel — a sanitização virou regex simples em `lib/validation.ts`.

## Decisões e dívidas conhecidas

| Decisão | Motivo | Consequência |
|---|---|---|
| Sem DOMPurify; sanitização por regex | `jsdom` (ESM) quebrava o build na Vercel | Texto é gravado como plain no Postgres, nunca renderizado como HTML — regex basta |
| Notificação SMTP e insert de telemetria em `waitUntil()` | Fire-and-forget solto era congelado pela serverless antes de terminar | E-mail e clique gravam de forma confiável sem atrasar a resposta |
| Rate-limit e cron **fail-closed** em produção | Sem config, negar é mais seguro que liberar | Se Upstash/`CRON_SECRET` sumir, a rota bloqueia (429/503) — intencional |
| Upstash Ratelimit com `analytics: false` | Com `true` o Upstash guarda o identificador (IP cheio) por request | Sem dashboard de analytics no Upstash; LGPD agradece |
| CORS sem `Access-Control-Allow-Origin` em `/api/*` | Lista por vírgula é inválida na spec; `*` abriria a API | API é same-origin; allowlist real validada em runtime por [lib/origin.ts](lib/origin.ts) nas duas rotas POST |
| Origin/Referer **fail-closed** + JSON obrigatório no `/api/lead` | Corta CSRF e ruído de bot com Origin alheio | Origem ausente/estranha em produção → 403; `Content-Type` ≠ JSON → 415. Não é autenticação (curl forja headers) — o rate-limit segue sendo a defesa de abuso |
| Alerta de `CRON_SECRET` ausente limitado a 1×/hora | É o único alerta disparável sem autenticação | Sem Redis o alerta não sai (só log `[KeepAlive]`) — preferível a inundar a caixa |
| CSP com hosts **exatos** do Google Ads | Tag de conversão precisa de `googleadservices`/`doubleclick`/`google.com` | `script-src` + `www.googletagmanager.com`, `www.googleadservices.com`, `googleads.g.doubleclick.net`; `connect-src` + `www.google.com`, `www.googleadservices.com`, `ad.doubleclick.net`, `googleads.g.doubleclick.net`. Nunca `https:` genérico, `*.google.com` ou `unsafe-eval` em prod. GA e `*.supabase.co` saíram (não usados no front) |
| `Cross-Origin-Opener-Policy: same-origin` | Isola o browsing context (tabnabbing / XS-Leaks) | Página não mantém `window.opener` cruzado; links wa.me em nova aba seguem funcionando |
| Sem `images.remotePatterns` | Toda imagem é local (`public/`) | Otimizador de imagem não faz proxy de host remoto; imagem remota nova exige liberar o host exato |
| Cache de assets de `public/` por lista explícita, sem `immutable` | Arquivos não têm hash no nome e já foram regenerados no mesmo nome | `public, max-age=86400, s-maxage=86400`; arquivo novo que precise desse cache entra em `STATIC_ASSET_FILES` |
| Anti-pause via Vercel Cron externo, diário | `pg_cron` interno não conta como atividade pro Supabase; semanal tinha margem zero | Precisa de um HTTP request de fora; cron Hobby é best-effort, diário dá 7 chances por janela |
| SQL rodado à mão no SQL Editor | Projeto pequeno, sem pipeline de migração | Scripts em `supabase/*.sql` precisam ser aplicados manualmente — **`hardening-rpc.sql` e `hardening-2026-09.sql` ainda pendentes** |
| Landings pagas sem chrome | Reduzir rota de fuga no funil pago | `/raio-x-de-ti` renderiza sem menu; novas landings entram em `CHROMELESS_PREFIXES` |
| `unsafe-inline` no CSP script-src (produção) | JSON-LD inline no `layout.tsx` e init inline do gtag | Dívida aceita; migrar pra nonce via middleware depois |
| Dependências | Next 16.3.5, eslint-config-next 16.3.5, nodemailer 9.1.1 | `npm audit`: 0 vulnerabilidades (set/2026) |
