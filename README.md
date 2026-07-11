# Icardcase Site

Site institucional B2B da **Icardcase** (J Oliver Serviços de Informática TI Ltda) — captação de leads + SEO. Visual dark navy, estética Linear-style. Atendimento nacional, base em Niterói/RJ.

**Stack:** Next.js 16.2.9 (App Router) · React 19.2.7 · TypeScript 5.6 (strict) · Tailwind 3.4 · Supabase · Upstash Redis · Nodemailer (SMTP) · Vercel

---

## 📚 Documentação

Este README é a porta de entrada (setup e deploy). O detalhe vive em 4 documentos + o guia pra agentes de IA:

| Documento | Responde |
|---|---|
| [CLAUDE.md](CLAUDE.md) | O que uma IA precisa saber antes de tocar no código |
| [RULES.md](RULES.md) | Como se escreve código aqui (convenções, checklist) |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Como as peças se encaixam (fluxos, endpoints, decisões) |
| [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) | Tokens de cor/tipografia e componentes visuais |
| [COMPONENTS.md](COMPONENTS.md) | Catálogo de componentes (não recrie o que já existe) |

---

## 🚀 Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha as variáveis (ver abaixo)
npm run dev                  # http://localhost:3000
```

Scripts:
```bash
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run type-check   # tsc --noEmit
npm run lint         # next lint
```

> O build passa **mesmo sem** as variáveis de ambiente (os clientes Supabase têm init lazy). As rotas que dependem delas só quebram se forem chamadas sem config.

---

## 🔑 Variáveis de ambiente

Todas as chaves de produção moram **só na Vercel** (Project → Settings → Environment Variables) — nunca no código. O arquivo de referência é [.env.example](.env.example). Grupos:

| Grupo | Variáveis | Para quê |
|---|---|---|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Persistência de leads (a `service_role` é server-only) |
| Upstash | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate-limit. **Sem elas, `/api/lead` bloqueia em produção** (fail-closed) |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `LEAD_NOTIFICATION_FROM`, `LEAD_NOTIFICATION_EMAIL` | Notificação de lead por e-mail (cPanel/Hostinger) |
| Cron | `CRON_SECRET` | Protege `/api/cron/keep-alive`. **Sem ela, o cron retorna 503** (fail-closed). Gere com `openssl rand -base64 32` |
| Site | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_EMAIL` | Config de marca |
| Google Ads (opcional) | `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL` | Tag de conversão (só renderiza se presentes) |

> ⚠️ **Nunca** commite `.env.local` nem cole credencial no chat/PR. O `.gitignore` cobre `.env*` e `*.env`.

---

## 📁 Estrutura

```
app/           # rotas (App Router): páginas, layout, sitemap, robots
  api/         # route handlers server-side
    lead/                # POST — captura de lead (rate-limit → honeypot → Zod → insert → e-mail)
    whatsapp-click/      # POST — telemetria de clique
    cron/keep-alive/     # GET  — anti-pause (chamado pelo Vercel Cron)
components/    # componentes React (ver COMPONENTS.md)
lib/           # lógica sem JSX: supabase, validation, notify, rate-limit, constants, utils
supabase/      # DDL e scripts SQL (rodados à mão no SQL Editor)
public/        # assets estáticos
docs/          # documentação operacional/campanha (parte gitignored)
```

Detalhe de cada camada e o fluxo completo: [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 📞 Captura de lead (resumo)

1. Usuário preenche o form em `/contato` → validação no browser (UX).
2. `POST /api/lead`: rate-limit (Upstash) → honeypot → Zod → sanitize → insert no Supabase (service_role).
3. Resposta 200 imediata; a notificação por **e-mail (SMTP)** roda em `waitUntil()` — não bloqueia a resposta e não é congelada pela serverless.
4. Falha de e-mail é silenciosa: o lead já está gravado no Supabase.

Endpoints e regras de segurança em detalhe: [ARCHITECTURE.md](ARCHITECTURE.md) · [RULES.md](RULES.md).

---

## 🔒 Segurança (resumo)

- Headers HTTP: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy (`next.config.mjs`).
- **Fail-closed** em produção: rate-limit e cron negam quando a config falta.
- Validação com **Zod** no servidor + sanitização por regex (`lib/validation.ts`). IP mascarado em log (LGPD).
- Honeypot anti-bot; Row-Level Security nas tabelas; `service_role` só server-side.
- Postura completa e dívidas conhecidas: [ARCHITECTURE.md](ARCHITECTURE.md) § Decisões.

---

## 🚢 Deploy

Deploy automático: **push na `main` → Vercel builda e publica** em ~30s (integração GitHub↔Vercel ativa). Não precisa de deploy manual.

```bash
git add -A
git commit -m "tipo(escopo): descrição"   # Conventional Commits — ver RULES.md
git push origin main
```

Domínio, DNS e verificação do Search Console: ver `docs/` e o painel da Vercel.

---

**Construído pela própria Icardcase. Como deveria ser.**
