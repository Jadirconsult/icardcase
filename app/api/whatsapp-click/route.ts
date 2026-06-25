/**
 * POST /api/whatsapp-click — telemetria de cliques no WhatsApp
 */
import { NextResponse, type NextRequest } from 'next/server'
import { whatsappClickSchema } from '@/lib/validation'
import { whatsappClickRateLimit, checkRateLimit, getClientIp, maskIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

// Origens permitidas — só aceita POST vindo dos próprios domínios.
const ALLOWED_ORIGINS = new Set([
  'https://icardcase.com.br',
  'https://www.icardcase.com.br',
  'https://icardcase.vercel.app',
])

function isAllowedOrigin(request: NextRequest): boolean {
  // Em dev (localhost), aceitar sempre.
  if (process.env.NODE_ENV !== 'production') return true
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  if (origin && ALLOWED_ORIGINS.has(origin)) return true
  if (referer) {
    try {
      const url = new URL(referer)
      const base = `${url.protocol}//${url.host}`
      if (ALLOWED_ORIGINS.has(base)) return true
    } catch {
      // referer mal formado — ignora
    }
  }
  return false
}

export async function POST(request: NextRequest) {
  // 1. ORIGIN — filtra ruído trivial de botnet com Origin/Referer alheios
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 })
  }

  // 2. RATE LIMIT
  const ip = getClientIp(request)
  const rateCheck = await checkRateLimit(whatsappClickRateLimit, ip)
  if (!rateCheck.allowed) return NextResponse.json({ ok: false }, { status: 429 })

  // 3. PARSE + VALIDATE
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const parsed = whatsappClickSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

  // 4. INSERT (silencioso se Supabase não estiver configurado em dev)
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const supabase = getSupabaseAdmin()
    supabase
      .from('whatsapp_clicks')
      .insert({
        origem: parsed.data.origem,
        utm_source: parsed.data.utm_source,
        utm_campaign: parsed.data.utm_campaign,
        ip_address: ip !== 'unknown' ? ip : null,
        user_agent: request.headers.get('user-agent')?.substring(0, 500) ?? null,
        referrer: request.headers.get('referer')?.substring(0, 500) ?? null,
      })
      .then(({ error }) => {
        if (error) console.error('[WA Click]', { ip: maskIp(ip), code: error.code ?? 'unknown' })
      })
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[WA Click] Telemetria desligada (Supabase não configurado)')
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
