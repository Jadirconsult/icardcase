import type { Metadata } from 'next'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'Cases',
  description: 'Sistemas e projetos entregues pela Icardcase para clientes em contabilidade, indústria, estacionamento e órgãos públicos.',
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
      <section className="section-y bg-white">
        <div className="container-content">
          <p className="section-kicker">PORTFÓLIO</p>
          <h1 className="mt-2 text-h1 font-semibold text-brand-navy max-w-2xl">
            Sistemas em produção. Clientes em operação.
          </h1>
          <p className="mt-4 max-w-xl text-base text-brand-gray">
            Cada projeto que mostramos aqui tem autorização do cliente. Não somos uma agência de logos: somos engenheiros de sistemas críticos.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {allCases.map((c) => (
              <Link key={c.slug} href={`/cases/${c.slug}`} className="group block rounded-xl bg-brand-gray-bg p-6 border-l-[3px] border-brand-blue transition-all hover:bg-brand-blue-light/30 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gray">{c.segment}</p>
                <h2 className="mt-1 text-lg font-semibold text-brand-navy group-hover:text-brand-blue">{c.title}</h2>
                <p className="mt-2 text-sm text-brand-gray">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
