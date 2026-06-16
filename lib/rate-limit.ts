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
    if (process.env.NODE_ENV === 'production') {
      console.error('[CRÍTICO] Rate limit não configurado em produção!')
    }
    return { allowed: true, remaining: 999, reset: 0 }
  }
  const { success, remaining, reset } = await ratelimiter.limit(identifier)
  return { allowed: success, remaining, reset }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}
