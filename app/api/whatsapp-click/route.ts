/**
 * POST /api/whatsapp-click — telemetria de cliques no WhatsApp
 */
import { NextResponse, type NextRequest } from 'next/server'
import { waitUntil } from '@vercel/functions'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseAdmin } from '@/lib/supabase'
import { whatsappClickSchema, sanitizeText } from '@/lib/validation'
import { whatsappClickRateLimit, checkRateLimit, getClientIp, maskIp } from '@/lib/rate-limit'
import { isAllowedOrigin } from '@/lib/origin'

export const runtime = 'nodejs'

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
  let supabase: SupabaseClient
  try {
    supabase = getSupabaseAdmin()
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[WA Click] Telemetria desligada (Supabase não configurado)')
    } else {
      console.error('[WA Click] Supabase não configurado em produção')
    }
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // waitUntil: a gravação era disparada solta (sem await). A Vercel congela a
  // function assim que a resposta sai, então o insert podia morrer no meio —
  // mesmo problema que já derrubava o e-mail do /api/lead.
  const row = {
    // Mesmo tratamento de texto que o /api/lead aplica nos campos dele.
    origem: sanitizeText(parsed.data.origem),
    utm_source: parsed.data.utm_source ? sanitizeText(parsed.data.utm_source) : null,
    utm_campaign: parsed.data.utm_campaign ? sanitizeText(parsed.data.utm_campaign) : null,
    ip_address: ip !== 'unknown' ? ip : null,
    user_agent: request.headers.get('user-agent')?.substring(0, 500) ?? null,
    referrer: request.headers.get('referer')?.substring(0, 500) ?? null,
  }

  const recordClick = async (): Promise<void> => {
    try {
      const { error } = await supabase.from('whatsapp_clicks').insert(row)
      if (error) console.error('[WA Click]', { ip: maskIp(ip), code: error.code ?? 'unknown' })
    } catch (err) {
      console.error('[WA Click] Falha insert:', {
        ip: maskIp(ip),
        err: err instanceof Error ? err.message : 'unknown',
      })
    }
  }

  waitUntil(recordClick())

  return NextResponse.json({ ok: true }, { status: 200 })
}
