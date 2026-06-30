import type { Metadata } from 'next'
import { COMPANY } from '@/lib/constants'
import { FinalCTA } from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'Quem somos — tecnologia sob medida desde 2011',
  description: `Há 14 anos a ${COMPANY.name} constrói sistemas críticos sob medida para empresas de todo o Brasil. Conheça nosso time, a história e a forma de trabalhar. Base no Rio de Janeiro.`,
  alternates: { canonical: '/sobre' },
}

export default function SobrePage() {
  return (
    <>
      <section className="section-y bg-white">
        <div className="container-content max-w-prose-wide">
          <p className="section-kicker">SOBRE</p>
          <h1 className="mt-2 text-h1 font-semibold text-brand-navy">
            Tecnologia construída por quem entende sistemas críticos.
          </h1>

          <div className="mt-8 prose-content space-y-5 text-base leading-relaxed text-brand-gray">
            <p>
              A Icardcase é uma boutique de tecnologia fundada em 2011 em Niterói, no Rio de Janeiro. Atendemos escritórios contábeis, empresas financeiras e organizações que tratam tecnologia como vantagem competitiva — não como custo.
            </p>
            <p>
              Sou Jadir Luiz de Oliveira Junior, CEO e fundador. Antes da Icardcase, passei 15 anos em infraestrutura pesada: ferrovias (Carajás, EFVM), mineração, pavimentação. Trabalhei em projetos da Vale, Camargo Corrêa, Mendes Júnior e Siemens.
            </p>
            <p>
              Esse repertório me ensinou o que é sistema crítico, prazo apertado, zero tolerância a erro. Hoje aplicamos esse rigor à tecnologia. Não vendemos software de terceiros com markup. Construímos. Não terceirizamos atendimento. Eu mesmo estou no projeto.
            </p>
            <p>
              Trabalhamos com poucos clientes por ano porque acreditamos em parceria de longo prazo. Se você é sócio de escritório contábil ou diretor financeiro pensando em tecnologia estratégica, vamos conversar.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-brand-navy/10 pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wider text-brand-gray">Fundação</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-navy">2011</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-brand-gray">Anos no RJ</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-navy">14+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-brand-gray">Sistemas em produção</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-navy">12+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-brand-gray">Equipe</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-navy">Boutique</dd>
            </div>
          </dl>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
