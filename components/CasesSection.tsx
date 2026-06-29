'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const cases = [
  {
    num: '01',
    segment: 'Indústria Química',
    title: 'SYSPERSHY — ERP completo',
    description: '94 tabelas, 49 telas, 60 migrações. Substituindo sistema legado com 20 anos de uso.',
    metrics: [{ k: 'Tabelas', v: '94' }, { k: 'Telas', v: '49' }, { k: 'Redução de retrabalho', v: '60%' }],
    href: '/cases/syspershy',
  },
  {
    num: '02',
    segment: 'Estacionamento',
    title: 'Prossiga — migração FoxPro',
    description: 'Migração de Visual FoxPro pra Supabase sem interromper operação de receita.',
    metrics: [{ k: 'Idade do sistema', v: '20 anos' }, { k: 'Downtime', v: 'Zero' }, { k: 'Stack', v: 'Supabase' }],
    href: '/cases/prossiga',
  },
  {
    num: '03',
    segment: 'Plataforma Fiscal',
    title: 'NF SaaS — multi-tenant',
    description: 'NF-e, NFC-e, NFS-e com integração SEFAZ. Pronto pra reforma tributária 2026.',
    metrics: [{ k: 'Tenants', v: 'Multi' }, { k: 'SEFAZ', v: 'Nativo' }, { k: 'LGPD', v: 'Ativa' }],
    href: '/cases/nf-saas',
  },
  {
    num: '04',
    segment: 'Órgão Público',
    title: 'UFRJ — infraestrutura',
    description: 'Gestão de TI para empresas sediadas em órgão vinculado à UFRJ.',
    metrics: [{ k: 'Uptime', v: '99.5%+' }, { k: 'Suporte', v: '24/7' }, { k: 'Setor', v: 'Federal' }],
    href: '/cases/ufrj',
  },
]

export function CasesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-canvas section-y border-t border-hairline">
      <div className="container-content">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="section-kicker">Trabalhos recentes</p>
            <h2 aria-label="Sistemas em produção, clientes em operação." className="mt-5 text-display-lg text-ink">
              Sistemas em produção,
              <span className="block text-ink-muted">clientes em operação.</span>
            </h2>
          </div>
          <Link
            href="/cases"
            className="link-underline group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.12em] text-accent-hover self-start lg:self-end"
          >
            Ver todos os cases
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Cards 2x2 — Linear-style: rounded-xl + hairline + surface-1 */}
        <div className="grid gap-5 md:grid-cols-2">
          {cases.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group surface-card relative overflow-hidden p-7 lg:p-8 transition-all duration-500 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              } hover:-translate-y-1`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* edge highlight */}
              <div className="edge-highlight absolute inset-0 rounded-xl" aria-hidden="true" />

              {/* glow border top on hover */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between mb-6">
                <span className="font-mono text-[0.7rem] tracking-[0.12em] text-ink-tertiary transition-colors duration-300 group-hover:text-accent">
                  {c.num} · {c.segment.toUpperCase()}
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

              <h3 className="relative text-headline text-ink mb-3 transition-colors duration-300 group-hover:text-accent">
                {c.title}
              </h3>
              <p className="relative text-base leading-relaxed text-ink-subtle mb-7 max-w-[52ch]">
                {c.description}
              </p>

              {/* Métricas — hairline divider entre */}
              <div className="relative grid grid-cols-3 gap-4 pt-6 border-t border-hairline">
                {c.metrics.map((m) => (
                  <div key={m.k}>
                    <div className="font-mono text-xs uppercase tracking-[0.1em] text-ink-tertiary mb-1.5">
                      {m.k}
                    </div>
                    <div className="text-base font-semibold text-ink-muted">{m.v}</div>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
