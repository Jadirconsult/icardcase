/**
 * POST /api/lead
 *
 * Captura de lead com camadas de segurança:
 * 1. Rate limiting (3/hora por IP)
 * 2. Honeypot anti-bot
 * 3. Validação Zod
 * 4. Sanitização DOMPurify
 * 5. Audit log automático (trigger Postgres)
 * 6. Notificação WhatsApp via Evolution
 */
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { leadSchema, sanitizeText } from '@/lib/validation'
import { leadFormRateLimit, checkRateLimit, getClientIp, maskIp } from '@/lib/rate-limit'
import { notifyLeadViaWhatsApp, notifyLeadViaN8N } from '@/lib/notify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // 1. RATE LIMIT
  const rateCheck = await checkRateLimit(leadFormRateLimit, ip)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Muitas tentativas. Tente novamente em alguns minutos.', retryAfter: rateCheck.reset },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rateCheck.reset - Date.now()) / 1000)) } }
    )
  }

  // 2. PARSE + VALIDATE
  let body: unknown
  try { body = await request.json() }
  catch { return NextResponse.json({ ok: false, error: 'Payload inválido' }, { status: 400 }) }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dados inválidos', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const data = parsed.data

  // 3. HONEYPOT — não devolver string fixa 'honeypot' (entrega detecção pro bot).
  // Retornar um UUID realista pra simular insert OK, mas sem gravar nada.
  if (data.website && data.website.length > 0) {
    console.warn('[Lead] Honeypot:', { ip: maskIp(ip), website: data.website.substring(0, 50) })
    return NextResponse.json(
      { ok: true, id: crypto.randomUUID(), message: 'Recebemos seu contato.' },
      { status: 200 },
    )
  }

  // 4. SANITIZE
  const sanitized = {
    nome: sanitizeText(data.nome),
    email: data.email,
    whatsapp: data.whatsapp,
    empresa: sanitizeText(data.empresa),
    segmento: data.segmento,
    mensagem: sanitizeText(data.mensagem),
    origem: data.origem ? sanitizeText(data.origem) : null,
    utm_source: data.utm_source ? sanitizeText(data.utm_source) : null,
    utm_medium: data.utm_medium ? sanitizeText(data.utm_medium) : null,
    utm_campaign: data.utm_campaign ? sanitizeText(data.utm_campaign) : null,
  }

  // 5. INSERT
  const supabase = getSupabaseAdmin()
  const userAgent = request.headers.get('user-agent')?.substring(0, 500) ?? null
  const referrer = request.headers.get('referer')?.substring(0, 500) ?? null

  const { data: inserted, error } = await supabase
    .from('leads')
    .insert({
      ...sanitized,
      referrer,
      ip_address: ip !== 'unknown' ? ip : null,
      user_agent: userAgent,
      consentimento_lgpd: data.consentimentoLgpd,
      consentimento_data: new Date().toISOString(),
      consentimento_ip: ip !== 'unknown' ? ip : null,
      status: 'novo',
    })
    .select('id')
    .single()

  if (error || !inserted) {
    // Log com IP mascarado e código do erro Postgres (sem expor schema).
    console.error('[Lead] Erro insert:', { ip: maskIp(ip), code: error?.code ?? 'unknown' })
    return NextResponse.json(
      { ok: false, error: 'Erro ao registrar. Tente o WhatsApp direto.' },
      { status: 500 }
    )
  }

  // 6. NOTIFICAÇÕES (async)
  const notif = {
    nome: sanitized.nome, empresa: sanitized.empresa, segmento: sanitized.segmento,
    whatsapp: sanitized.whatsapp, email: sanitized.email, mensagem: sanitized.mensagem,
    origem: sanitized.origem || undefined,
  }
  Promise.allSettled([
    notifyLeadViaWhatsApp(notif),
    notifyLeadViaN8N(notif),
  ]).catch(err => console.error('[Lead] Notif:', err))

  return NextResponse.json(
    { ok: true, id: inserted.id, message: 'Recebemos seu contato. Retornaremos via WhatsApp em até 4 horas úteis.' },
    { status: 200 }
  )
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed' }, { status: 405 })
}
