# CLAUDE.md · Icardcase Site

Contexto para agentes de IA trabalhando neste repositório.
Documentação completa: [RULES.md](RULES.md) · [ARCHITECTURE.md](ARCHITECTURE.md) · [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) · [COMPONENTS.md](COMPONENTS.md)

## Objetivo do projeto

Site institucional B2B da **Icardcase** (J Oliver Serviços de Informática TI Ltda, CNPJ 13.437.391/0001-58, Niterói/RJ, desde 2011). Boutique de tecnologia que vende desenvolvimento de sistemas, infraestrutura, suporte, segurança/LGPD e consultoria — atendimento nacional. O objetivo do site é **capturar leads** (formulário em `/contato` + landing paga `/raio-x-de-ti`) e ranquear em SEO. Visual dark navy, estética Linear-style. Público: sócios de escritórios contábeis, financeiras e indústria.

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.9 |
| UI | React | 19.2.7 |
| Linguagem | TypeScript (strict) | 5.6.3 |
| Estilo | Tailwind CSS | 3.4.13 |
| Banco | Supabase (Postgres + RLS) | @supabase/supabase-js 2.45 |
| Rate limit | Upstash Redis | @upstash/ratelimit 2.0 |
| E-mail | Nodemailer (SMTP cPanel/Hostinger) | 9.0 |
| Validação | Zod | 3.23 |
| Ícones | lucide-react | 0.451 |
| Fontes | Inter + JetBrains Mono (next/font) | — |
| Infra | Vercel (host + Cron + Analytics + Speed Insights) | — |

Comandos:
```bash
npm run dev          # desenvolvimento (next dev)
npm run build        # build de produção (next build)
npm run type-check   # tsc --noEmit
npm run lint         # next lint
```

## Estrutura de pastas

```
app/           # rotas (App Router): páginas, layout, api/, sitemap, robots
  api/         # route handlers (runtime nodejs) — lead, whatsapp-click, cron/keep-alive
components/    # componentes React de UI e seção (PascalCase.tsx)
lib/           # lógica compartilhada SEM JSX: supabase, validation, notify, rate-limit, constants, utils
supabase/      # DDL e scripts SQL (schema.sql, no-pause.sql, hardening-rpc.sql) — rodados à mão no SQL Editor
public/        # assets estáticos (icardinho.png, favicons, og)
docs/          # documentação operacional e de campanha (parte é gitignored)
```

**Onde colocar um arquivo novo:** componente visual → `components/`; lógica sem JSX (helper, cliente de serviço, schema) → `lib/`; página → `app/<rota>/page.tsx`; endpoint → `app/api/<nome>/route.ts`; DDL/migração → `supabase/*.sql`.

## Convenções de código (essencial — detalhe em RULES.md)

- TypeScript **strict**, sem `any`. Alias de import `@/*` aponta pra raiz (`@/lib/...`, `@/components/...`).
- Componentes em **PascalCase.tsx**, exportados como **named export** (`export function Header()`), um por arquivo.
- Server Component é o padrão. Só marque `'use client'` quando há estado/efeito/evento (ex.: `Header`, `LeadForm`, `Services`).
- Classes de UI vêm dos **tokens do Tailwind** e das classes utilitárias de `app/globals.css` (`.btn-primary`, `.surface-card`, `.section-kicker`, `.container-content`). **Zero cor hardcoded** em componente.
- Junte classes condicionais com `cn()` de [lib/utils.ts](lib/utils.ts).
- Toda entrada de usuário é validada com **Zod** no servidor (`lib/validation.ts`) — nunca confie no cliente.
- Commits em **Conventional Commits** com escopo: `feat(nav): ...`, `fix(seg): ...`.

## Como criar uma funcionalidade nova

1. Leia [ARCHITECTURE.md](ARCHITECTURE.md) → "Como adicionar uma página / funcionalidade".
2. Cheque [COMPONENTS.md](COMPONENTS.md) antes de criar qualquer componente — ele provavelmente já existe.
3. Valide toda entrada com um schema Zod em `lib/validation.ts`.
4. `npm run type-check` **e** `npm run build` antes de dizer que terminou. O build é a prova de integridade (arquivo truncado não builda).

## Como escrever componentes

- Cheque COMPONENTS.md primeiro.
- Use tokens do DESIGN-SYSTEM.md; nada hardcoded.
- Props tipadas, sem `any`.
- Cubra: default, hover, `focus-visible`, disabled, loading.
- Respeite `prefers-reduced-motion` (o `globals.css` já neutraliza animações globalmente, mas animação nova via JS deve checar).
- Documente no COMPONENTS.md **no mesmo commit**.

## Como lidar com bugs

1. Reproduza antes de consertar. Não reproduziu = não entendeu.
2. Ache a causa raiz — não trate o sintoma. (Ex.: o e-mail de lead não chegava não era SMTP, era a serverless congelando antes do envio → `waitUntil`.)
3. Corrija o menor escopo possível.
4. Verifique de verdade (execução real / curl no endpoint), não "deve funcionar".

## Como criar commits

```
tipo(escopo): descrição no imperativo
```
Tipos em uso: `feat`, `fix`, `chore`, `perf`, `seo`, `docs`, `refactor`. Escopos reais: `lead`, `seg`, `nav`, `ui/ux`, `visual`, `supabase`, `form`, `contato`, `mascote`, `next.config`. Rodapé: `Co-Authored-By: Claude ...`. **Nunca** `--no-verify`.

## Quando faltar contexto

**Pergunte. Não preencha a lacuna com um palpite.** Um palpite entregue com confiança custa mais caro que uma pergunta. Quando precisar seguir mesmo assim, **declare a suposição em voz alta** no output.

- Env var: não presuma que existe. As secrets moram **só na Vercel** (Supabase URL/keys, SMTP, Upstash, CRON_SECRET). O `.env.local` local só tem as vars do Google Ads. O build passa sem elas (init lazy em `lib/supabase.ts`).
- Credenciais: **nunca** aceite FTP/senha/service key/token colados no chat. Oriente uso de gerenciador externo.

## Boas práticas obrigatórias

- Valide toda entrada no servidor (Zod).
- Segredo em env var, sempre.
- **Falhe fechado**: em erro/config ausente, negue, não libere. Padrão do projeto (rate-limit e cron são fail-closed em produção).
- IP em log sempre mascarado (`maskIp`) — LGPD.
- Trate erro; não engula exceção em silêncio (mas notificação de lead é falha silenciosa **deliberada** — o lead já foi gravado).
- Sem `console.log` de depuração em produção. Logs intencionais usam prefixo `[Lead]`, `[KeepAlive]`, `[CRÍTICO]`.
- Acessibilidade não é opcional: label associado, contraste AA, teclado, `focus-visible`, área de toque 44px.

## O que NUNCA fazer

- Nunca commitar `.env*` ou segredo (o `.gitignore` cobre `.env*` e `*.env`).
- Nunca usar `any` pra calar o TypeScript.
- Nunca criar componente sem checar COMPONENTS.md.
- Nunca confiar só na validação do cliente.
- Nunca dizer que terminou sem ter rodado `type-check` **e** `build`.
- Nunca reintroduzir `fail-open` em rate-limit ou cron, nem CORS `*` em `/api/*` (decisões de segurança deliberadas — ver ARCHITECTURE.md § Decisões).
- Nunca inventar API, prop ou função que você não verificou que existe.
- Nunca sugerir hospedagem PHP/FTP: o site é Next.js SSR, deploy só em Vercel.
