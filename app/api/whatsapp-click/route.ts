/**
 * POST /api/whatsapp-click — telemetria de cliques no WhatsApp
 */
import { NextResponse, type NextRequest } from 'next/server'
import { whatsappClickSchema } from '@/lib/validation'
import { whatsappClickRateLimit, checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rateCheck = await checkRateLimit(whatsappClickRateLimit, ip)
  if (!rateCheck.allowed) return NextResponse.json({ ok: false }, { status: 429 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const parsed = whatsappClickSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

  // Em dev sem Supabase, no-op silencioso
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
        if (error) console.error('[WA Click]', error)
      })
  } catch (err) {
    // Sem Supabase configurado — telemetria desligada mas resposta 200
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[WA Click] Telemetria desligada (Supabase não configurado)')
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
