-- ============================================================================
-- Icardcase Site — Hardening das funções RPC
-- ============================================================================
-- Rodar no SQL Editor do Supabase (produção). Idempotente: pode rodar 2x.
--
-- PROBLEMA
-- --------
-- No Postgres, EXECUTE em função é concedido a PUBLIC por padrão. O PostgREST
-- do Supabase expõe as funções do schema `public` em /rest/v1/rpc/<nome>,
-- alcançáveis com a ANON_KEY — que é pública por natureza (vai no bundle do
-- browser).
--
-- Como get_leads_stats() e increment_no_pause() são SECURITY DEFINER, elas
-- rodam com os privilégios do dono e IGNORAM o RLS deny-all das tabelas.
-- Resultado: o RLS que protege `leads` não protege a função que lê `leads`.
--
-- Na prática, sem este arquivo, qualquer um com a anon key poderia:
--   POST /rest/v1/rpc/get_leads_stats    → total de leads, convertidos, taxa
--   POST /rest/v1/rpc/increment_no_pause → mexer no contador anti-pause
--
-- SOLUÇÃO
-- -------
-- Revogar EXECUTE de PUBLIC/anon/authenticated. O `service_role` (usado pelas
-- API routes via getSupabaseAdmin) continua funcionando normalmente — ele
-- bypassa essas restrições.
-- ============================================================================

-- =========================
-- get_leads_stats(integer)
-- =========================
revoke all on function public.get_leads_stats(integer) from public;
revoke all on function public.get_leads_stats(integer) from anon;
revoke all on function public.get_leads_stats(integer) from authenticated;

grant execute on function public.get_leads_stats(integer) to service_role;

-- =========================
-- increment_no_pause()
-- =========================
revoke all on function public.increment_no_pause() from public;
revoke all on function public.increment_no_pause() from anon;
revoke all on function public.increment_no_pause() from authenticated;

grant execute on function public.increment_no_pause() to service_role;

-- ============================================================================
-- PREVENÇÃO: novas funções não nascem abertas
-- ============================================================================
-- Sem isto, a PRÓXIMA função criada no schema public volta a ser executável
-- por anon por padrão, e o problema se repete silenciosamente.
alter default privileges in schema public
  revoke execute on functions from public, anon, authenticated;

-- ============================================================================
-- VERIFICAÇÃO — rode e confira o resultado
-- ============================================================================
-- Deve listar as duas funções SEM anon/authenticated na coluna de ACL.
--
-- select
--   p.proname,
--   p.prosecdef as security_definer,
--   coalesce(array_to_string(p.proacl, e'\n'), '(padrao: PUBLIC pode executar)') as acl
-- from pg_proc p
-- join pg_namespace n on n.oid = p.pronamespace
-- where n.nspname = 'public'
--   and p.proname in ('get_leads_stats', 'increment_no_pause');
--
-- Teste de fora (deve dar 401/403 depois do revoke):
--
--   curl -X POST "https://<SEU-PROJETO>.supabase.co/rest/v1/rpc/get_leads_stats" \
--     -H "apikey: <ANON_KEY>" \
--     -H "Content-Type: application/json" \
--     -d '{"days_back": 30}'
--
-- ANTES do revoke: provavelmente 200 com suas métricas de negócio.
-- DEPOIS: erro de permissão. É esse o objetivo.
-- ============================================================================
