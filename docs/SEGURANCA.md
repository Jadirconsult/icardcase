# Documento de Segurança — Icardcase Site

Este documento detalha as camadas de segurança aplicadas no site.

## Modelo de ameaças

Atacantes que esperamos:
1. **Scrapers/bots** tentando coletar e-mails (honeypot + rate limit)
2. **Spammers** enviando formulários em massa (rate limit Upstash)
3. **Injeção SQL** via inputs do form (Supabase usa parametrização + CHECKs)
4. **XSS persistido** via mensagens do lead (DOMPurify sanitiza)
5. **CSRF** em endpoints (Next API + SameSite cookies)
6. **Clickjacking** (X-Frame-Options: DENY + CSP frame-ancestors none)
7. **Vazamento de service_role** (variável só existe server-side)

## Camadas defensivas

### Network / Edge (Vercel)
- TLS 1.3 obrigatório
- HTTP/2
- DDoS protection (Vercel)
- HSTS com preload

### HTTP Headers (next.config.ts)
- `Content-Security-Policy` restritiva
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` desabilita câmera/mic/geolocation

### Rate Limiting (Upstash Redis)
- POST /api/lead → 3 / hora por IP
- POST /api/whatsapp-click → 10 / minuto por IP

### Application Layer
- Zod valida estrutura de todo input
- Regex valida formatos (email, WhatsApp, nome)
- DOMPurify sanitiza HTML malicioso
- Honeypot detecta bots

### Database (Supabase Postgres)
- Row-Level Security em todas as tabelas
- CHECK constraints em todos os campos
- Triggers de audit log
- Função set_updated_at automática
- Service role isolada (apenas API routes)

### LGPD Compliance
- Consentimento explícito armazenado com data + IP
- Direitos do titular documentados
- Política de privacidade em `/politica-privacidade`
- Retenção de dados definida (24 meses leads não convertidos)

## Como testar a segurança

```bash
# 1. Rate limit
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/lead -H "Content-Type: application/json" -d '{}'
done
# Espera-se 429 a partir da 4ª chamada

# 2. Honeypot
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"website":"https://spam.com",...}'
# Espera-se 200 fake (id="honeypot")

# 3. Validação
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"nome":""}'
# Espera-se 400 com issues

# 4. Headers
curl -I https://icardcase.com.br
# Verifique CSP, HSTS, X-Frame-Options presentes

# 5. CSP
# Abra https://csp-evaluator.withgoogle.com e cole o CSP
```

## Próximas melhorias (roadmap)

- [ ] WAF Cloudflare na frente da Vercel
- [ ] Captcha invisível (Cloudflare Turnstile) no formulário
- [ ] Email verification antes de enviar proposta
- [ ] Backoffice com SSO Google + MFA
- [ ] Pentest formal antes de divulgar publicamente
