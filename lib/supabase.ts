/**
 * Cliente Supabase — Icardcase
 *
 * Lazy init: NÃO faz throw no import. As verificações de env vars rodam
 * SÓ quando um cliente é solicitado em runtime. Isso permite o build
 * passar mesmo sem variáveis (ex.: primeiro deploy Vercel) e quebra
 * apenas se a rota realmente for chamada sem configuração.
 *
 * - getSupabasePublic(): usa ANON_KEY (respeita RLS), pode ir pro browser
 * - getSupabaseAdmin(): usa SERVICE_ROLE_KEY (bypassa RLS), APENAS server-side
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function readEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

let _publicClient: SupabaseClient | null = null

export function getSupabasePublic(): SupabaseClient {
  if (_publicClient) return _publicClient
  const { url, anonKey } = readEnv()
  if (!url || !anonKey) {
    throw new Error(
      'Supabase public client não configurado — defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY',
    )
  }
  _publicClient = createClient(url, anonKey, { auth: { persistSession: false } })
  return _publicClient
}

let _adminClient: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient
  const { url, serviceKey } = readEnv()
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin client não configurado — defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY',
    )
  }
  _adminClient = createClient(url, serviceKey, { auth: { persistSession: false } })
  return _adminClient
}

/**
 * @deprecated Use getSupabasePublic() — mantido pra compat com código que
 * possa estar importando este símbolo. Em runtime, dispara a mesma checagem.
 */
export const supabasePublic = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabasePublic()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop as string]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
