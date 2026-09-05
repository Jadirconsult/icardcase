/**
 * GET /api/cron/keep-alive
 *
 * Vercel Cron Job — disparado TODO DIA às 12h UTC (vercel.json).
 *
 * Era semanal (`0 12 * * 1`). O Supabase Free pausa após 7 dias de
 * inatividade, então um disparo a cada 7 dias exatos tinha margem ZERO: um
 * único atraso ou pulo — e cron do plano Hobby é best-effort, não garantido —
 * já cruzava o limite e o projeto pausava. Diário dá 7 chances por janela.
 *
 * Incrementa public.no_pause.contador via RPC (1..100, wrap-around). O HTTP
 * request gerado conta como atividade pro Supabase Free e impede que o projeto
 * seja pausado por inatividade após 7 dias.
 *
 * Proteção: Authorization Bearer com CRON_SECRET — Vercel envia esse header
 * automaticamente em todas as chamadas de cron. Sem o header válido, retorna
 * 401 (impede scraper ou ataque externo de bater a rota).
 *
 * FAIL-CLOSED: se CRON_SECRET não estiver definido, a rota recusa TUDO (503).
 * Antes a checagem era `if (cronSecret && ...)`, que simplesmente sumia quando
 * a env var faltava — deixando uma rota com service_role (que bypassa RLS)
 * aberta pra qualquer um. Na dúvida, negar.
 *
 * ALERTA: todo caminho de falha manda e-mail (notifyOpsAlert). Antes a rota
 * logava no console da Vercel e devolvia 500 para um cron que ninguém lê — o
 * projeto pausava dias depois e a primeira evidência era lead deixando de
 * chegar. Falha de infraestrutura silenciosa é a pior categoria de falha.
 */
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { notifyOpsAlert } from '@/lib/notify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const IMPACTO = `Enquanto o projeto Supabase estiver pausado ou inacessível, POST /api/lead
responde 500 e todo lead enviado pelo site — formulário e chat — se perde sem
deixar rastro.`

export async function GET(request: NextRequest) {
  // Vercel Cron envia Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // Sem secret configurado, a rota não tem como se defender: recusa.
  if (!cronSecret) {
    console.error('[KeepAlive] CRÍTICO: CRON_SECRET ausente — rota bloqueada')
    await notifyOpsAlert(
      'Keep-alive do Supabase bloqueado',
      `A rota /api/cron/keep-alive recusou a execução porque CRON_SECRET não
está definido na Vercel.

Consequência: o Supabase deixa de receber atividade e será PAUSADO em até
7 dias.

${IMPACTO}

Correção: definir CRON_SECRET em Vercel > Settings > Environment Variables
e refazer o deploy.`,
    )
    return NextResponse.json(
      { ok: false, error: 'Service unavailable' },
      { status: 503 },
    )
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 },
    )
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.rpc('increment_no_pause')

    if (error) {
      // Código do erro fica só no log do servidor — não devolver no corpo da
      // resposta (evita entregar detalhe do schema Postgres pra fora).
      console.error('[KeepAlive] Erro Supabase:', error.code, error.message)
      await notifyOpsAlert(
        'Keep-alive do Supabase falhou',
        `A chamada de increment_no_pause() retornou erro.

Código: ${error.code}
Mensagem: ${error.message}

Causas comuns: projeto já pausado; limite de projetos free da conta excedido
(nesse caso o Resume fica bloqueado até liberar uma vaga); service_role key
rotacionada sem atualizar a Vercel; ou a função increment_no_pause ausente —
rodar supabase/no-pause.sql no SQL Editor.

${IMPACTO}`,
      )
      return NextResponse.json(
        { ok: false, error: 'Database error' },
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
    await notifyOpsAlert(
      'Keep-alive do Supabase lançou exceção',
      `Falha não prevista em /api/cron/keep-alive.

${err instanceof Error ? err.message : String(err)}

${IMPACTO}`,
    )
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    )
  }
}
