import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { SITE } from '@/lib/constants'

const CASES: Record<string, { segment: string; title: string; subtitle: string; problem: string; solution: string; results: string[]; tech: string[] }> = {
  'syspershy': {
    segment: 'INDÚSTRIA QUÍMICA',
    title: 'SYSPERSHY',
    subtitle: 'ERP completo para indústria química certificada ISO 9001',
    problem: 'A PERSHY Chemical operava com sistema legado em VBA/Access criado há mais de uma década. O sistema não suportava o volume atual de operações, dificultava auditoria ISO 9001 e não tinha integração fiscal moderna.',
    solution: 'Construímos um ERP completo de 94 tabelas e 49 telas, com 60 migrações de schema. Migração gradual com correções cirúrgicas, sem parar a operação. Compatibilidade total com regras de negócio do VBA original (preservadas em Module3 documentado).',
    results: ['ERP em produção atendendo operação industrial completa', 'Auditoria ISO 9001 sem ressalvas', 'Integração fiscal pronta para reforma tributária 2026', 'Redução de 80% no tempo de fechamento mensal'],
    tech: ['Python', 'Supabase', 'PostgreSQL', 'Next.js', 'Docker'],
  },
  'prossiga': {
    segment: 'ESTACIONAMENTO',
    title: 'Prossiga',
    subtitle: 'Migração de Visual FoxPro/DBF para Supabase sem parar receita',
    problem: 'Sistema crítico de gestão de estacionamento rodando em Visual FoxPro há 20 anos. Plataforma descontinuada, sem suporte e impossibilitando integrações modernas. Qualquer parada de mais de 1 hora gerava perda direta de receita.',
    solution: 'Engenharia reversa do schema DBF, criação de diagrama ER moderno, DBML completo, e DDL para Supabase. Migração de dados validada por checksum. Operação dual durante 30 dias antes do corte definitivo.',
    results: ['Zero interrupção de receita durante migração', 'Schema modernizado e versionado', 'Capacidade para integrações (NFC-e, pagamento digital)', 'Backup automatizado em nuvem'],
    tech: ['Supabase', 'PostgreSQL', 'Python', 'pandas', 'DBML'],
  },
  'nf-saas': {
    segment: 'PLATAFORMA FISCAL',
    title: 'NF SaaS',
    subtitle: 'Plataforma multi-tenant de notas fiscais eletrônicas',
    problem: 'Pequenos e médios negócios precisando emitir NF-e e NFC-e sem pagar mensalidade pesada de fornecedores tradicionais. Reforma tributária 2026 exigindo arquitetura nova.',
    solution: 'Plataforma Laravel 11 multi-tenant com segurança em três camadas (Traefik → Nginx → Laravel), integração SEFAZ via certificado A1, suporte a NF-e modelo 55 e NFC-e modelo 65. Arquitetura preparada para IBS/CBS desde o dia 1.',
    results: ['NF-e e NFC-e em homologação SEFAZ', 'Multi-tenant com isolamento garantido', 'Pronto para reforma tributária 2026', 'Fase 2: NFS-e nacional em roadmap'],
    tech: ['Laravel 11', 'Supabase (Session Pooler)', 'Traefik', 'Nginx', 'PostgreSQL'],
  },
  'ufrj': {
    segment: 'ÓRGÃO PÚBLICO',
    title: 'UFRJ',
    subtitle: 'Gestão de infraestrutura de TI para empresa sediada em órgão vinculado à UFRJ',
    problem: 'Empresa sediada em órgão da UFRJ com infraestrutura de TI defasada, sem padronização de rede, backup inconsistente e suporte reativo.',
    solution: 'Padronização de rede Windows, instalação de servidores dedicados, política de backup com retenção mensal/anual, monitoramento proativo e contratos de SLA com atendimento presencial.',
    results: ['Uptime acima de 99,5% mensal', 'Backup verificado por testes de restore', 'Atendimento presencial em campus UFRJ', 'Documentação técnica completa do ambiente'],
    tech: ['Windows Server', 'Active Directory', 'Veeam Backup', 'Cisco', 'pfSense'],
  },
}

export function generateStaticParams() {
  return Object.keys(CASES).map((slug) => ({ slug }))
}

// Next 15+/16: params virou Promise — sempre await antes de usar
type CasePageParams = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: CasePageParams }): Promise<Metadata> {
  const { slug } = await params
  const c = CASES[slug]
  if (!c) return { title: 'Não encontrado' }
  return {
    title: c.title,
    description: c.subtitle,
    alternates: { canonical: `/cases/${slug}` },
  }
}

export default async function CasePage({ params }: { params: CasePageParams }) {
  const { slug } = await params
  const c = CASES[slug]
  if (!c) notFound()

  const url = `${SITE.url}/cases/${slug}`

  // Schema.org CreativeWork — descreve o case como obra de engenharia
  const caseSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: c.title,
    headline: `${c.title} — ${c.subtitle}`,
    description: c.subtitle,
    abstract: c.problem,
    keywords: c.tech.join(', '),
    inLanguage: 'pt-BR',
    creator: {
      '@type': 'Organization',
      name: 'Icardcase',
      url: SITE.url,
    },
    about: c.segment,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Cases', item: `${SITE.url}/cases` },
      { '@type': 'ListItem', position: 3, name: c.title, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="section-y">
        <div className="container-content max-w-prose-wide">
          <Link
            href="/cases"
            className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-[0.12em] text-accent-hover hover:text-accent link-underline"
          >
            ← Todos os cases
          </Link>
          <p className="mt-8 section-kicker">{c.segment}</p>
          <h1 className="mt-2 text-display-lg text-ink">{c.title}</h1>
          <p className="mt-4 text-body-lg text-ink-muted">{c.subtitle}</p>

          <div className="mt-12 space-y-10">
            <section>
              <h2 className="text-headline text-ink">Desafio</h2>
              <p className="mt-4 text-base leading-[1.65] text-ink-muted">{c.problem}</p>
            </section>
            <section>
              <h2 className="text-headline text-ink">Solução</h2>
              <p className="mt-4 text-base leading-[1.65] text-ink-muted">{c.solution}</p>
            </section>
            <section>
              <h2 className="text-headline text-ink">Resultados</h2>
              <ul className="mt-4 space-y-3">
                {c.results.map((r) => (
                  <li key={r} className="flex gap-3 items-start text-base text-ink-muted leading-[1.6]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" className="flex-shrink-0 mt-1" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-headline text-ink">Stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-md border border-hairline bg-surface-1 px-3 py-1.5 font-mono text-xs text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
      <FinalCTA />
    </>
  )
}
