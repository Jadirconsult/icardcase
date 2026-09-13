# Documento de Segurança — Icardcase Site

Este documento detalha as camadas de segurança aplicadas no site. Decisões e motivos: ver [ARCHITECTURE.md](../ARCHITECTURE.md) § Decisões.

## Modelo de ameaças

Atacantes que esperamos:
1. **Scrapers/bots** tentando coletar e-mails (honeypot + rate limit)
2. **Spammers** enviando formulários em massa (rate limit Upstash)
3. **Injeção SQL** via inputs do form (Supabase usa parametrização + CHECKs)
4. **XSS persistido** via mensagens do lead (regex em `sanitizeText` remove tags; o texto é gravado como plain e o e-mail de notificação passa por `escapeHtml`)
5. **CSRF** em endpoints (não há sessão/cookie de usuário; `/api/lead` e `/api/whatsapp-click` validam Origin/Referer e `/api/lead` exige `Content-Type: application/json`)
6. **Clickjacking** (X-Frame-Options: DENY + CSP frame-ancestors none)
7. **Vazamento de service_role** (variável só existe server-side)

## Camadas defensivas

### Network / Edge (Vercel)
- TLS 1.3 obrigatório
- HTTP/2
- DDoS protection (Vercel)
- HSTS com preload

### HTTP Headers (next.config.mjs)
- `Content-Security-Policy` restritiva — terceiros só os hosts exatos da tag do Google Ads; sem `unsafe-eval` em produção
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` desabilita câmera/mic/geolocation
- `Cross-Origin-Opener-Policy: same-origin`
- `/api/*`: sem `Access-Control-Allow-Origin` (API same-origin) e `Cache-Control: no-store`

### Rate Limiting (Upstash Redis)
- POST /api/lead → 3 / hora por IP
- POST /api/whatsapp-click → 10 / minuto por IP
- Fail-closed em produção (sem Upstash → 429)
- `analytics: false` (IP não fica guardado no Upstash)

### Application Layer
- Origin/Referer validado contra os domínios do site (`lib/origin.ts`) — 403 em produção se ausente/estranho
- `/api/lead` só aceita `Content-Type: application/json` (415)
- Zod valida estrutura de todo input
- Regex valida formatos (email, WhatsApp, nome)
- `sanitizeText` (regex) remove tags HTML; `sanitizeHeader` remove CR/LF do subject do e-mail
- Honeypot detecta bots
- `/api/cron/keep-alive`: Bearer `CRON_SECRET` comparado em tempo constante; fail-closed (503) sem secret

### Database (Supabase Postgres)
- Row-Level Security em todas as tabelas
- CHECK constraints em todos os campos
- Triggers de audit log
- Função set_updated_at automática (`search_path` fixado por `supabase/hardening-2026-09.sql`)
- Service role isolada (apenas API routes)
- EXECUTE das RPCs `SECURITY DEFINER` revogado de `anon` (`supabase/hardening-rpc.sql`)

> **Pendente em produção:** rodar `supabase/hardening-rpc.sql` e `supabase/hardening-2026-09.sql` no SQL Editor.

### LGPD Compliance
- Consentimento explícito armazenado com data + IP
- IP sempre mascarado em log (`maskIp`)
- Direitos do titular documentados
- Política de privacidade em `/politica-privacidade`
- Retenção de dados definida (24 meses leads não convertidos)

## Como testar a segurança

```bash
# 1. Rate limit
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/lead -H "Content-Type: application/json" -d '{}'
done
# Espera-se 429 a partir da 4ª chamada (com Upstash configurado)

# 2. Honeypot
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"website":"https://spam.com",...}'
# Espera-se 200 com um UUID falso (nada é gravado)

# 3. Validação
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"nome":""}'
# Espera-se 400 com issues

# 4. Content-Type
curl -X POST http://localhost:3000/api/lead -H "Content-Type: text/plain" -d '{}'
# Espera-se 415

# 5. Origem (em produção)
curl -X POST https://www.icardcase.com.br/api/lead \
  -H "Origin: https://evil.example" -H "Content-Type: application/json" -d '{}'
# Espera-se 403

# 6. Headers
curl -I https://www.icardcase.com.br
# Verifique CSP, HSTS, X-Frame-Options, COOP presentes

# 7. CSP
# Abra https://csp-evaluator.withgoogle.com e cole o CSP
```

## Próximas melhorias (roadmap)

- [ ] WAF Cloudflare na frente da Vercel
- [ ] Captcha invisível (Cloudflare Turnstile) no formulário
- [ ] Email verification antes de enviar proposta
- [ ] Backoffice com SSO Google + MFA
- [ ] Pentest formal antes de divulgar publicamente
- [ ] CSP com nonce (remover `unsafe-inline` de script-src)
