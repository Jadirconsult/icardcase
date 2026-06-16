# Icardcase Site

Site institucional da **Icardcase** — boutique de tecnologia em Niterói/RJ.

Stack: **Next.js 14 (App Router)** + **TypeScript** + **Tailwind** + **Supabase** + **Vercel**

---

## 📋 Checklist de setup (na ordem)

### 1. Instalar dependências (no Mac)

```bash
cd icardcase-site
npm install
```

### 2. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) → New Project
2. Nome: `icardcase-prod`, região: `sa-east-1` (São Paulo)
3. Salve a senha do banco em local seguro (1Password/Bitwarden)
4. Anote as três chaves em **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NUNCA exponha no frontend)

### 3. Rodar o schema SQL

No Supabase → **SQL Editor** → New query → cole o conteúdo de `supabase/schema.sql` → Run.

Confirme que rodou:
- 3 tabelas criadas (`leads`, `whatsapp_clicks`, `audit_log`)
- RLS habilitado em todas
- Policies de bloqueio público criadas
- Função `get_leads_stats` disponível

### 4. Criar conta no Upstash (rate limiting grátis)

1. Acesse [upstash.com](https://upstash.com) → cadastro com GitHub
2. Create Database → Redis → região `sa-east-1`
3. Em **REST API**, copie:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 5. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` preenchendo todas as variáveis. **NUNCA commite `.env.local`** (já está no `.gitignore`).

### 6. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 7. Deploy na Vercel

```bash
# Instale a CLI da Vercel (uma vez só)
npm i -g vercel

# Faça login
vercel login

# Deploy de produção
vercel --prod
```

Depois do deploy, vá em **Vercel → Project → Settings → Environment Variables** e cole **todas as variáveis** do `.env.local` lá. Faça redeploy.

### 8. Apontar domínio

No painel da Vercel → **Domains** → adicionar `icardcase.com.br`.

Vercel vai te dar registros DNS. Vá no registro do domínio (Registro.br/GoDaddy/etc) e configure:

```
Tipo  Nome  Valor
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

⚠️ **Mantenha registros MX da hospedagem antiga intactos** — pra e-mails @icardcase.com.br continuarem funcionando.

### 9. Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console)
2. Adicione `icardcase.com.br`
3. Método: tag HTML → copie o código → cole em `app/layout.tsx` na linha:
   ```ts
   verification: { google: 'COLAR-CODIGO-AQUI' },
   ```
4. Redeploy
5. Volte ao Search Console → **Verify**
6. Em **Sitemaps** → adicione: `https://icardcase.com.br/sitemap.xml`

---

## 🏗️ Estrutura do projeto

```
icardcase-site/
├── app/
│   ├── api/
│   │   ├── lead/route.ts              # POST /api/lead (captura com 6 camadas de segurança)
│   │   └── whatsapp-click/route.ts    # POST /api/whatsapp-click (telemetria)
│   ├── abordagem/page.tsx
│   ├── cases/page.tsx
│   ├── contato/page.tsx               # Formulário funcional
│   ├── insights/page.tsx
│   ├── politica-privacidade/page.tsx  # LGPD compliance
│   ├── sobre/page.tsx
│   ├── globals.css
│   ├── layout.tsx                     # Schema.org JSON-LD + SEO metadata
│   ├── page.tsx                       # Home
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── CasesSection.tsx
│   ├── Differentials.tsx
│   ├── FinalCTA.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── InsightsSection.tsx
│   ├── LeadForm.tsx                   # Form com validação, honeypot, UTMs
│   ├── Logo.tsx                       # SVG inline
│   ├── Services.tsx
│   └── WhatsAppButton.tsx             # Tracking de cliques
├── lib/
│   ├── notify.ts                      # Notificação Evolution + N8N
│   ├── rate-limit.ts                  # Upstash Redis
│   ├── supabase.ts                    # Clientes admin/public separados
│   ├── utils.ts
│   └── validation.ts                  # Zod schemas + DOMPurify
├── supabase/
│   └── schema.sql                     # DDL completo com RLS e audit log
├── .env.example
├── .gitignore
├── next.config.ts                     # Security headers + CSP
├── package.json
├── postcss.config.js
├── tailwind.config.ts                 # Cores da identidade Icardcase
└── tsconfig.json
```

---

## 🔒 Segurança aplicada

Este site segue as práticas de segurança da Icardcase:

- ✅ **Headers HTTP**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- ✅ **Rate limiting**: 3 submissões de formulário/hora por IP (Upstash Redis)
- ✅ **Validação dupla**: Zod (estrutura) + regex em CHECK constraints (Postgres)
- ✅ **Sanitização**: DOMPurify em todos os textos antes de gravar
- ✅ **Honeypot anti-bot**: campo invisível detecta crawlers
- ✅ **Row-Level Security**: dados inacessíveis sem service_role
- ✅ **Audit log**: trigger Postgres registra todas as mudanças
- ✅ **LGPD compliance**: consentimento explícito + data + IP gravados
- ✅ **Service role isolada**: usada apenas em routes server-side
- ✅ **Forward de IP**: x-forwarded-for processado corretamente
- ✅ **CSRF**: cookies SameSite + same-origin policy

---

## 📞 Funcionamento da captura de leads

### Fluxo do formulário (`/contato`)

1. Usuário preenche → JS valida no browser (UX)
2. POST `/api/lead`:
   - Rate limit (Upstash) → 429 se exceder
   - Parse + Zod → 400 se inválido
   - Honeypot → 200 fake se preenchido
   - DOMPurify nos textos
   - INSERT no Supabase via service_role
   - Trigger automático → audit_log
3. Resposta 200 ao usuário (mensagem de sucesso)
4. **Async/paralelo** (não bloqueia resposta):
   - Notificação WhatsApp via Evolution API → +55 21 98878-5170
   - Webhook N8N (se configurado)

### Tempo de resposta esperado

- POST /api/lead: ~200ms (rede + insert + 2 notif async)
- Form submit no browser: feedback imediato (loading), success em ~500ms

---

## 🔄 Manutenção

### Adicionar um novo case
1. Crie `app/cases/[slug]/page.tsx`
2. Adicione o slug em `app/sitemap.ts`
3. Adicione no array de `components/CasesSection.tsx`

### Adicionar um novo insight (blog)
1. Crie `app/insights/[slug]/page.tsx` (ou use MDX no futuro)
2. Adicione o slug em `app/sitemap.ts`
3. Adicione no array de `components/InsightsSection.tsx`

### Mudar paleta de cores
Edite `tailwind.config.ts` na seção `colors`. As classes `bg-ink`, `text-accent` etc se ajustam automaticamente.

---

## 📊 Monitoramento (após go-live)

- **Google Search Console**: indexação, queries de busca
- **Google Analytics 4**: tráfego, conversões
- **Supabase Dashboard**: leads no painel `Table Editor → leads`
- **Vercel Analytics**: performance e core web vitals
- **Upstash Console**: rate limits acionados (defesa contra abuso)

---

## 🚨 O que NÃO está no projeto (próximos turnos)

- [ ] Páginas individuais de cases (`/cases/[slug]`) com conteúdo completo
- [ ] Posts de blog em MDX (`/insights/[slug]`)
- [ ] Backoffice admin pra visualizar leads no site
- [ ] Open Graph image dinâmica (`/og-default.png`)
- [ ] Favicon real (substituir o do Next padrão)

Esses ficam pro **Turno 2**.

---

**Construído pela própria Icardcase. Como deveria ser.**
