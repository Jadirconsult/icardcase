-- ============================================================================
-- Icardcase Site — Anti-pause Supabase
-- ============================================================================
-- Problema: Supabase Free pausa o projeto após 7 dias sem atividade HTTP.
-- Solução: tabela singleton 'no_pause' com contador 1..100, incrementado por
--   um Vercel Cron toda segunda-feira. O HTTP request mantém o projeto ativo.
--
-- Como rodar: cola este arquivo no SQL Editor do Supabase e clica em RUN.
-- ============================================================================

-- =========================
-- TABELA: no_pause (singleton)
-- =========================
create table if not exists public.no_pause (
  id           integer primary key check (id = 1),
  contador     integer not null default 1 check (contador between 1 and 100),
  updated_at   timestamptz not null default now()
);

-- Garante que sempre exista a linha id=1 (idempotente — pode rodar 2x)
insert into public.no_pause (id, contador)
values (1, 1)
on conflict (id) do nothing;

comment on table public.no_pause is 'Singleton anti-pause: incrementado semanalmente pelo Vercel Cron pra evitar que o projeto Supabase Free seja pausado por inatividade';

-- =========================
-- FUNÇÃO: increment_no_pause()
-- =========================
-- Incrementa o contador. Em 100 → volta pra 1 (wrap-around).
-- Roda como SECURITY DEFINER pra ignorar RLS quando chamada via rpc().
create or replace function public.increment_no_pause()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_valor integer;
begin
  update public.no_pause
  set
    contador = case when contador >= 100 then 1 else contador + 1 end,
    updated_at = now()
  where id = 1
  returning contador into novo_valor;

  return novo_valor;
end;
$$;

comment on function public.increment_no_pause is 'Incrementa contador anti-pause; 100→1 wrap';

-- =========================
-- ROW LEVEL SECURITY
-- =========================
alter table public.no_pause enable row level security;

drop policy if exists "no_pause_no_public_access" on public.no_pause;
create policy "no_pause_no_public_access"
  on public.no_pause for all to anon, authenticated
  using (false) with check (false);
-- service_role bypassa RLS automaticamente, então a rota /api/cron funciona.

-- =========================
-- VERIFICAÇÃO (rode pra confirmar)
-- =========================
-- select * from public.no_pause;
-- select public.increment_no_pause();  -- deve retornar 2 (de 1 → 2)
