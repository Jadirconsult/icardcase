/**
 * Cliente Supabase — Icardcase
 * - supabasePublic: usa ANON_KEY (respeita RLS), pode ir pro browser
 * - getSupabaseAdmin(): usa SERVICE_ROLE_KEY (bypassa RLS), APENAS server-side
 *
 * Em desenvolvimento sem variáveis configuradas, retornamos clients "no-op"
 * que falham silenciosamente — assim a home roda sem precisar de Supabase.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isConfigured && process.env.NODE_ENV === 'production') {
  // Em produção, exigir configuração (não deixa subir quebrado)
  throw new Error(
    'Faltam variáveis NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY em produção',
  )
}

if (!isConfigured) {
  console.warn(
    '[supabase] Variáveis não configuradas em dev — chamadas a banco serão no-op.',
  )
}

export const supabasePublic: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, { auth: { persistSession: false } })
  : null

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseServiceKey || !supabaseUrl) {
    throw new Error('Supabase admin não configurado (faltam SUPABASE_SERVICE_ROLE_KEY ou URL)')
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
}
