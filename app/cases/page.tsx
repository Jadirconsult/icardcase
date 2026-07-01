import type { Metadata } from 'next'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'Cases: sistemas sob medida em produção',
  description: 'Cases reais da Icardcase: ERP industrial, migração de legado, SaaS fiscal e infraestrutura crítica para empresas de todo o Brasil.',
  alternates: { canonical: '/cases' },
}

const allCases = [
  { slug: 'syspershy', segment: 'INDÚSTRIA QUÍMICA', title: 'SYSPERSHY — ERP completo', description: '94 tabelas, 49 telas, 60 migrações.' },
  { slug: 'prossiga', segment: 'ESTACIONAMENTO', title: 'Prossiga — migração FoxPro', description: 'Migração Visual FoxPro para Supabase sem parar receita.' },
  { slug: 'nf-saas', segment: 'PLATAFORMA FISCAL', title: 'NF SaaS — multi-tenant', description: 'NF-e/NFC-e/NFS-e com integração SEFAZ.' },
  { slug: 'ufrj', segment: 'ÓRGÃO PÚBLICO', title: 'UFRJ — infraestrutura', description: 'Gestão de TI para órgão vinculado à UFRJ.' },
]

export default function CasesPage() {
  return (
    <>
      <section className="section-y">
        <div className="container-content">
          <p className="section-kicker">PORTFÓLIO</p>
          <h1 className="mt-2 text-display-lg text-ink max-w-2xl">
            Sistemas em produção.
            <span className="block text-ink-muted">Clientes em operação.</span>
          </h1>
          <p className="mt-6 max-w-xl text-body-lg text-ink-subtle">
            Cada projeto que mostramos aqui tem autorização do cliente. Não somos uma agência de logos: somos engenheiros de sistemas críticos.
          </p>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {allCases.map((c) => (
              <Link
                key={c.slug}
                href={`/cases/${c.slug}`}
                className="group surface-card card-glow relative overflow-hidden p-7 lg:p-8 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="edge-highlight absolute inset-0 rounded-xl" aria-hidden="true" />
                <div className="relative flex items-start justify-between mb-6">
                  <span className="font-mono text-[0.7rem] tracking-[0.12em] text-ink-tertiary transition-colors duration-300 group-hover:text-accent">
                    {c.segment}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="flex-shrink-0 text-ink-tertiary transition-all duration-500 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="relative text-headline text-ink mb-3 transition-colors duration-300 group-hover:text-accent">
                  {c.title}
                </h2>
                <p className="relative text-sm leading-relaxed text-ink-subtle">
                  {c.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
