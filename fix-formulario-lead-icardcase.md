# Fix do formulário de contato (/api/lead) — Icardcase

**Sintoma:** todo envio do formulário retorna **HTTP 500** em produção. O lead **não é gravado**.

**Diagnóstico (confirmado no log de runtime da Vercel):**
```
POST 500 /api/lead — Error: Failed to load external module jsdom: ERR_REQUIRE_ESM: require() of ES Module
```
Há **dois** problemas independentes que precisam ser resolvidos para o formulário funcionar.

---

## Onde o lead deveria cair (referência)

`components/LeadForm.tsx` → POST `/api/lead` (`app/api/lead/route.ts`), que:
1. grava na tabela **`leads`** do Supabase (service_role);
2. notifica no **WhatsApp** via Evolution API (`lib/notify.ts`);
3. dispara webhook **N8N**.

---

## Problema 1 — CÓDIGO: jsdom/DOMPurify quebra no Next 16 (causa do 500)

`lib/validation.ts:6` importa `isomorphic-dompurify`, que no servidor carrega o **jsdom** (ESM-only). Sob o Next 16, o bundle usa `require()` e o jsdom lança `ERR_REQUIRE_ESM` → a rota `/api/lead` nem inicializa. (Surgiu no upgrade Next 14→16.)

A `sanitizeText` só faz strip de HTML (`ALLOWED_TAGS: []`), então **não precisa de jsdom/DOMPurify**.

**Correção recomendada — `lib/validation.ts`:**

```diff
- import DOMPurify from 'isomorphic-dompurify'
  import { z } from 'zod'

  // ...

  export function sanitizeText(input: string): string {
-   return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
+   // Zod já valida a estrutura; aqui só neutralizamos HTML (vira texto puro).
+   return input.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()
  }
```

E remover a dependência:
```bash
npm remove isomorphic-dompurify
```

> Alternativa (se quiser manter o DOMPurify): adicionar `serverExternalPackages: ['jsdom']` no `next.config.mjs`. Mas remover a dependência é mais robusto e leve, já que aqui o uso é só strip de HTML.

---

## Problema 2 — CONFIG: faltam env vars na Vercel

Na Vercel só estão as **3 do Supabase**. Sem o resto, mesmo corrigindo o Problema 1 o form **não funciona** (o rate-limit é *fail-closed* em produção — `lib/rate-limit.ts:46`: sem Upstash, **bloqueia todos os envios**).

Adicionar em **Vercel → Settings → Environment Variables** (Production + Preview), depois **Redeploy**:

### 🔴 Obrigatórias (sem elas o form é bloqueado)
| Variável | Para quê | Onde obter |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Rate-limit do formulário | Conta grátis em upstash.com → criar Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Rate-limit do formulário | idem (painel do Redis) |

### 🟡 Recomendadas (lead salva, mas sem notificação)
| Variável | Para quê |
|---|---|
| `EVOLUTION_API_URL` | Notificação no WhatsApp |
| `EVOLUTION_API_KEY` | idem |
| `EVOLUTION_INSTANCE` | idem |
| `WHATSAPP_NOTIFICATION_NUMBER` | Número que recebe o alerta |
| `N8N_WEBHOOK_URL` | Automação N8N (opcional) |
| `N8N_WEBHOOK_SECRET` | idem |

> `NEXT_PUBLIC_SITE_URL` **não precisa** — o fallback no código já usa `https://www.icardcase.com.br`.

---

## Problema 3 — VERIFICAR: tabela `leads` existe?

Não deu pra validar (a rota trava antes do insert). Confirmar no Supabase → Table Editor que a tabela **`leads`** existe com as colunas que o insert usa (`app/api/lead/route.ts:78-89`): `nome, email, whatsapp, empresa, segmento, mensagem, origem, utm_source, utm_medium, utm_campaign, referrer, ip_address, user_agent, consentimento_lgpd, consentimento_data, consentimento_ip, status`.

---

## Ordem de execução

1. Corrigir `lib/validation.ts` (Problema 1) + `npm remove isomorphic-dompurify` → commit + deploy.
2. Adicionar as env vars de Upstash (Problema 2) → Redeploy.
3. Conferir a tabela `leads` (Problema 3).
4. Testar um envio real do formulário → deve retornar sucesso e gravar na tabela.

> Observação: as 3 keys do Supabase já estão corretas (o bundle não tem mais placeholder e o erro 500 é anterior ao Supabase). Não é preciso mexer nelas.
