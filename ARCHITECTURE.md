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
[Vercel Cron — semanal] ────────────────────────────────────────────┘
    rate-limit: [Upstash Redis]   ·   telemetria: [Vercel Analytics + Speed Insights]
```

## Stack

| Camada | Tecnologia | Versão | Por quê |
|---|---|---|---|
| Front | Next.js App Router + React | 16.2.9 / 19.2.7 | SSG pra SEO, RSC pra bundle enxuto, hospedagem nativa Vercel |
| Linguagem | TypeScript strict | 5.6.3 | Segurança de tipos ponta a ponta |
| Estilo | Tailwind CSS + classes utilitárias custom | 3.4.13 | Design system via tokens, zero CSS solto |
| Banco | Supabase (Postgres + RLS) | 2.45 | Postgres gerenciado, RLS, RPC, região sa-east-1 |
| Rate limit | Upstash Redis | 2.0 | Sliding window serverless, sem infra própria |
| E-mail | Nodemailer + SMTP | 9.0 | Caixa do próprio domínio (cPanel/Hostinger) |
| Validação | Zod | 3.23 | Schema único, deriva tipos |
| Infra | Vercel (host, Cron, Analytics, Speed Insights) | — | Deploy automático via GitHub, edge network |

## Organização das pastas

```
app/           # App Router: cada subpasta é uma rota (page.tsx). layout.tsx = shell global.
  api/         # route handlers (runtime nodejs). NÃO mora aqui lógica de UI.
    lead/                # POST — captura de lead
    whatsapp-click/      # POST — telemetria de clique
    cron/keep-alive/     # GET  — anti-pause Supabase (chamado pelo Vercel Cron)
components/    # componentes React (UI + seções). NÃO fala com banco direto.
lib/           # lógica sem JSX: supabase, validation, notify, rate-limit, constants, utils.
supabase/      # DDL e scripts SQL. Rodados À MÃO no SQL Editor — não há migração automática.
public/        # assets estáticos (icardinho.png, favicons, og).
docs/          # documentação operacional/campanha (parte gitignored).
```

O que **não** mora onde: componente nunca importa `getSupabaseAdmin` (isso é server-only, vive nos route handlers); route handler nunca renderiza JSX; segredo nunca mora no código (só env var na Vercel).

## Fluxo completo: envio do formulário de lead

1. [components/LeadForm.tsx](components/LeadForm.tsx) — `'use client'`. Valida no browser (UX: `validateField` no `onBlur`), captura UTMs de `useSearchParams`, `POST /api/lead` com JSON.
2. [app/api/lead/route.ts](app/api/lead/route.ts) — pipeline server-side, em ordem:
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

## Back-end

Três route handlers, todos `runtime = 'nodejs'`:

| Método | Caminho | O que faz | Quem pode chamar |
|---|---|---|---|
| POST | `/api/lead` | Captura de lead (rate-limit → honeypot → Zod → sanitize → insert → e-mail) | Público (same-origin, rate-limited) |
| POST | `/api/whatsapp-click` | Telemetria de clique no WhatsApp | Público, valida Origin/Referer + rate-limit 10/min |
| GET | `/api/cron/keep-alive` | Incrementa `no_pause` pra Supabase não pausar | Só Vercel Cron (Bearer `CRON_SECRET`) |

- **Validação de entrada:** Zod (`leadSchema`, `whatsappClickSchema`) em [lib/validation.ts](lib/validation.ts).
- **O que vaza na resposta:** só mensagens genéricas. `error.code` do Postgres e stack ficam no `console.error`. IP em log é mascarado (`maskIp`).

## Fluxo de autenticação

**Não há autenticação de usuário** — o site é público e não tem área logada. As rotas se protegem por outros meios:
- `/api/lead` e `/api/whatsapp-click`: rate-limit por IP + honeypot + validação de Origin/Referer (whatsapp-click).
- `/api/cron/keep-alive`: **Bearer token** — compara `Authorization` com `CRON_SECRET` (que a Vercel injeta no cron). **Fail-closed**: sem `CRON_SECRET` definido, retorna 503.
- Acesso ao banco: só via `service_role` (server-side, em `getSupabaseAdmin`). O RLS das tabelas é deny-all para `anon`/`authenticated`.

## Fluxo de dados

- **Tabelas** (ver `supabase/schema.sql`): `leads`, `whatsapp_clicks`, `audit_log`. RLS habilitado, policies de bloqueio público em todas.
- **RPCs**: `get_leads_stats(integer)` e `increment_no_pause()` — ambas `SECURITY DEFINER`.
- **Quem lê/escreve:** só o `service_role` (bypassa RLS). `anon`/`authenticated` não têm acesso às tabelas. **Atenção:** funções `SECURITY DEFINER` furam o RLS — o `EXECUTE` delas precisa ser revogado de `anon` (ver `supabase/hardening-rpc.sql`, § Decisões).
- **Anti-pause:** tabela singleton `no_pause` com contador 1..100. O Vercel Cron bate em `/api/cron/keep-alive` semanalmente (`0 12 * * 1` no `vercel.json`) → RPC `increment_no_pause()` → atividade de escrita mantém o projeto Supabase acordado (o `pg_cron` interno NÃO conta como atividade externa).

## Comunicação entre módulos

- `page.tsx`/componentes → `lib/constants`, `lib/utils`, `components/*`. **Nunca** → banco.
- `app/api/*/route.ts` → `lib/validation`, `lib/rate-limit`, `lib/supabase` (admin), `lib/notify`.
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
3. No handler: rate-limit → validação → sanitize → ação → resposta genérica em erro.
4. Se gravar no banco, use `getSupabaseAdmin()`; se ler estatística sensível via RPC, garanta que o `EXECUTE` está revogado de `anon`.
5. `type-check` + `build`. Teste com `curl` real contra o endpoint.

## Como evitar dependências desnecessárias

Antes de instalar um pacote: (1) dá pra fazer com o que já existe? (2) é mantido e quantos KB entram no bundle? (3) puxa quantas transitivas? (4) registre a decisão aqui. Precedente real: `isomorphic-dompurify` foi **removido** porque puxava `jsdom` (ESM-only) e quebrava o build no runtime da Vercel — a sanitização virou regex simples em `lib/validation.ts`.

## Decisões e dívidas conhecidas

| Decisão | Motivo | Consequência |
|---|---|---|
| Sem DOMPurify; sanitização por regex | `jsdom` (ESM) quebrava o build na Vercel | Texto é gravado como plain no Postgres, nunca renderizado como HTML — regex basta |
| Notificação via SMTP em `waitUntil()` | Fire-and-forget solto era congelado pela serverless antes do envio | E-mail chega de forma confiável sem atrasar a resposta |
| Rate-limit e cron **fail-closed** em produção | Sem config, negar é mais seguro que liberar | Se Upstash/`CRON_SECRET` sumir, a rota bloqueia (429/503) — intencional |
| CORS sem `Access-Control-Allow-Origin` em `/api/*` | Lista por vírgula é inválida na spec; `*` abriria a API | API é same-origin; allowlist real validada em runtime no whatsapp-click |
| Anti-pause via Vercel Cron externo | `pg_cron` interno não conta como atividade pro Supabase | Precisa de um HTTP request de fora, semanal |
| SQL rodado à mão no SQL Editor | Projeto pequeno, sem pipeline de migração | Scripts em `supabase/*.sql` precisam ser aplicados manualmente — **`hardening-rpc.sql` ainda pendente** |
| Landings pagas sem chrome | Reduzir rota de fuga no funil pago | `/raio-x-de-ti` renderiza sem menu; novas landings entram em `CHROMELESS_PREFIXES` |
| `unsafe-inline` no CSP script-src (produção) | JSON-LD inline no `layout.tsx` | Dívida aceita; migrar pra nonce via middleware depois |
| Upgrade do Next 16 → linha nova pendente | 4 vulns moderadas em dev deps | Merece commit isolado e testado; não bloqueia produção |
