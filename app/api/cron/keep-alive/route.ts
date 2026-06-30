/**
 * GET /api/cron/keep-alive
 *
 * Vercel Cron Job — disparado toda segunda às 12h UTC (vercel.json).
 *
 * Incrementa public.no_pause.contador via RPC (1..100, wrap-around). O HTTP
 * request gerado conta como atividade pro Supabase Free e impede que o projeto
 * seja pausado por inatividade após 7 dias.
 *
 * Proteção: Authorization Bearer com CRON_SECRET — Vercel envia esse header
 * automaticamente em todas as chamadas de cron. Sem o header válido, retorna
 * 401 (impede scraper ou ataque externo de bater a rota).
 */
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Vercel Cron envia Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 },
    )
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.rpc('increment_no_pause')

    if (error) {
      console.error('[KeepAlive] Erro Supabase:', error.code, error.message)
      return NextResponse.json(
        { ok: false, error: 'Database error', code: error.code },
        { status: 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      contador: data,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[KeepAlive] Falha:', err)
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    )
  }
}
