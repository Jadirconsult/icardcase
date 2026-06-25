/**
 * Rate Limiting — Icardcase
 * - Lead form: 3 submissões / hora por IP
 * - WhatsApp click: 10 / minuto por IP
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const hasUpstash = !!(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

export const leadFormRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'rl:lead',
    })
  : null

export const whatsappClickRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'rl:wa',
    })
  : null

export async function checkRateLimit(
  ratelimiter: Ratelimit | null,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  if (!ratelimiter) {
    // Em produção: fail-closed (bloqueia). Sem rate-limit funcional, melhor
    // recusar a request do que permitir abuso ilimitado (flood do form,
    // poluição da tabela de clicks, gasto desnecessário em tier Supabase).
    if (process.env.NODE_ENV === 'production') {
      console.error('[CRÍTICO] Rate limit não configurado em produção — bloqueando request')
      return { allowed: false, remaining: 0, reset: Date.now() + 60_000 }
    }
    // Em dev: fail-open (permite) — produtividade local sem precisar de Upstash.
    return { allowed: true, remaining: 999, reset: 0 }
  }
  const { success, remaining, reset } = await ratelimiter.limit(identifier)
  return { allowed: success, remaining, reset }
}

/**
 * Mascara o IP pra logs/telemetria (LGPD-friendly).
 * IPv4: zera o último octeto (`203.0.113.42` → `203.0.113.0`).
 * IPv6: mantém os 4 primeiros grupos (`2001:db8:abcd:1234::` formato).
 */
export function maskIp(ip: string): string {
  if (!ip || ip === 'unknown') return 'unknown'
  if (ip.includes('.')) {
    const parts = ip.split('.')
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`
  }
  if (ip.includes(':')) {
    const groups = ip.split(':').slice(0, 4)
    return groups.join(':') + '::'
  }
  return 'masked'
}

/**
 * Extrai o IP real do cliente a partir dos headers de proxy.
 *
 * IMPORTANTE: confia que o host (Vercel) sobrescreve `x-forwarded-for` com o
 * IP real e ignora valores spoofados pelo cliente. Se migrar a infra para
 * host sem essa garantia (VPS própria sem nginx/Cloudflare na frente),
 * o atacante pode burlar rate-limit setando o header. Validar antes de mudar
 * de host.
 *
 * Formato `x-forwarded-for`: `<client>, <proxy1>, <proxy2>` — o primeiro item
 * é o cliente original. Validamos que parece um IP antes de usar.
 */
const IP_REGEX = /^([0-9.]{7,15}|[0-9a-f:]{2,39})$/i

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first && IP_REGEX.test(first)) return first
  }
  const real = request.headers.get('x-real-ip')?.trim()
  if (real && IP_REGEX.test(real)) return real
  return 'unknown'
}
