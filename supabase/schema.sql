-- ============================================================================
-- Icardcase Site — Schema Supabase v1.0
-- ============================================================================
-- Rodar este SQL no SQL Editor do projeto Supabase de produção.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================
-- TABELA: leads
-- =========================
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null check (char_length(nome) between 2 and 100),
  email           text not null check (
                    email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
                    and char_length(email) <= 200
                  ),
  whatsapp        text not null check (whatsapp ~ '^[0-9]{10,15}$'),
  empresa         text not null check (char_length(empresa) between 2 and 200),
  segmento        text not null check (segmento in (
                    'contabilidade', 'financeira', 'industria', 'outro'
                  )),
  mensagem        text not null check (char_length(mensagem) between 20 and 2000),
  origem          text check (char_length(origem) <= 100),
  utm_source      text check (char_length(utm_source) <= 100),
  utm_medium      text check (char_length(utm_medium) <= 100),
  utm_campaign    text check (char_length(utm_campaign) <= 100),
  referrer        text check (char_length(referrer) <= 500),
  ip_address      inet,
  user_agent      text check (char_length(user_agent) <= 500),
  consentimento_lgpd     boolean not null default false,
  consentimento_data     timestamptz,
  consentimento_ip       inet,
  status          text not null default 'novo' check (status in (
                    'novo', 'contatado', 'qualificado',
                    'proposta_enviada', 'convertido', 'descartado'
                  )),
  notes           text check (char_length(notes) <= 5000),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  contacted_at    timestamptz,
  constraint leads_consentimento_check check (
    (consentimento_lgpd = true and consentimento_data is not null)
    or consentimento_lgpd = false
  )
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status     on public.leads (status);
create index if not exists idx_leads_email      on public.leads (email);
create index if not exists idx_leads_whatsapp   on public.leads (whatsapp);

-- =========================
-- TABELA: whatsapp_clicks
-- =========================
create table if not exists public.whatsapp_clicks (
  id            uuid primary key default gen_random_uuid(),
  origem        text not null check (char_length(origem) <= 100),
  utm_source    text check (char_length(utm_source) <= 100),
  utm_campaign  text check (char_length(utm_campaign) <= 100),
  ip_address    inet,
  user_agent    text check (char_length(user_agent) <= 500),
  referrer      text check (char_length(referrer) <= 500),
  created_at    timestamptz not null default now()
);

create index if not exists idx_wa_clicks_created_at on public.whatsapp_clicks (created_at desc);
create index if not exists idx_wa_clicks_origem     on public.whatsapp_clicks (origem);

-- =========================
-- TABELA: audit_log
-- =========================
create table if not exists public.audit_log (
  id            uuid primary key default gen_random_uuid(),
  table_name    text not null,
  record_id     uuid,
  action        text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data      jsonb,
  new_data      jsonb,
  changed_by    uuid references auth.users(id) on delete set null,
  ip_address    inet,
  created_at    timestamptz not null default now()
);

create index if not exists idx_audit_table_record on public.audit_log (table_name, record_id);
create index if not exists idx_audit_created_at   on public.audit_log (created_at desc);

-- =========================
-- TRIGGERS
-- =========================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create or replace function public.log_lead_changes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_log (table_name, record_id, action, old_data, new_data)
  values (
    'leads',
    coalesce(new.id, old.id),
    tg_op,
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end; $$;

drop trigger if exists trg_leads_audit on public.leads;
create trigger trg_leads_audit
  after insert or update or delete on public.leads
  for each row execute function public.log_lead_changes();

-- =========================
-- ROW LEVEL SECURITY
-- =========================
alter table public.leads            enable row level security;
alter table public.whatsapp_clicks  enable row level security;
alter table public.audit_log        enable row level security;

drop policy if exists "leads_no_public_access"      on public.leads;
drop policy if exists "wa_clicks_no_public_access"  on public.whatsapp_clicks;
drop policy if exists "audit_no_public_access"      on public.audit_log;

create policy "leads_no_public_access"
  on public.leads for all to anon, authenticated
  using (false) with check (false);

create policy "wa_clicks_no_public_access"
  on public.whatsapp_clicks for all to anon, authenticated
  using (false) with check (false);

create policy "audit_no_public_access"
  on public.audit_log for all to anon, authenticated
  using (false) with check (false);

-- =========================
-- Função helper de stats
-- =========================
create or replace function public.get_leads_stats(days_back integer default 30)
returns table (
  total bigint, novos bigint, qualificados bigint,
  convertidos bigint, taxa_conversao numeric
)
language sql security definer set search_path = public as $$
  select
    count(*)::bigint,
    count(*) filter (where status = 'novo')::bigint,
    count(*) filter (where status = 'qualificado')::bigint,
    count(*) filter (where status = 'convertido')::bigint,
    case when count(*) > 0
      then round((count(*) filter (where status = 'convertido')::numeric / count(*)::numeric) * 100, 2)
      else 0 end
  from public.leads
  where created_at >= now() - (days_back || ' days')::interval;
$$;

comment on table public.leads is 'Leads capturados via site icardcase.com.br';
comment on table public.whatsapp_clicks is 'Telemetria de cliques em CTAs WhatsApp';
comment on table public.audit_log is 'Audit log de mudanças em leads';
