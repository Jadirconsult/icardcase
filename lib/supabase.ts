/**
 * Cliente Supabase — Icardcase
 *
 * Lazy init: NÃO faz throw no import. As verificações de env vars rodam
 * SÓ quando um cliente é solicitado em runtime. Isso permite o build
 * passar mesmo sem variáveis (ex.: primeiro deploy Vercel) e quebra
 * apenas se a rota realmente for chamada sem configuração.
 *
 * - getSupabaseAdmin(): usa SERVICE_ROLE_KEY (bypassa RLS), APENAS server-side
 *
 * Não existe cliente público (anon): o front nunca fala com o Supabase, tudo
 * passa por route handler. O antigo getSupabasePublic() não tinha uso e foi
 * removido — não recrie sem necessidade real.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _adminClient: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin client não configurado — defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY',
    )
  }
  _adminClient = createClient(url, serviceKey, { auth: { persistSession: false } })
  return _adminClient
}
