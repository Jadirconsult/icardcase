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
      <section className="section-y">
        <div className="container-content max-w-prose-wide">
          <p className="section-kicker">SOBRE</p>
          <h1 className="mt-2 text-display-lg text-ink">
            Tecnologia construída por quem entende sistemas críticos.
          </h1>

          <div className="mt-10 space-y-5 text-body-lg leading-[1.55] text-ink-muted">
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

          <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-hairline pt-10">
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-subtle">Fundação</dt>
              <dd className="mt-2 text-display-md text-ink">2011</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-subtle">Anos no RJ</dt>
              <dd className="mt-2 text-display-md text-ink">14+</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-subtle">Sistemas em produção</dt>
              <dd className="mt-2 text-display-md text-ink">12+</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-subtle">Equipe</dt>
              <dd className="mt-2 text-display-md text-ink">Boutique</dd>
            </div>
          </dl>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
