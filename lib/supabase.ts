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

let _publicClient: SupabaseClient | null = null

export function getSupabasePublic(): SupabaseClient {
  if (_publicClient) return _publicClient
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
