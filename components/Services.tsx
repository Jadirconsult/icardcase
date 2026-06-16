'use client'

import { useEffect, useRef, useState } from 'react'
import { Code2, Network, Headphones, ShieldCheck, Lightbulb } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/constants'

const services = [
  {
    icon: Code2,
    num: '01',
    title: 'Desenvolvimento de Sistemas',
    description: 'Sistemas web e mobile sob medida. Integração SEFAZ, multi-tenant, dashboards executivos.',
  },
  {
    icon: Network,
    num: '02',
    title: 'Infraestrutura e Redes',
    description: 'Servidores Windows e Linux, redes corporativas, virtualização e cloud híbrida.',
  },
  {
    icon: Headphones,
    num: '03',
    title: 'Suporte Técnico',
    description: 'SLA definido, atendimento humano, sem call center. Contrato mensal ou pacote de horas. Suporte presencial na região do Rio de Janeiro; remoto para todo o Brasil.',
  },
  {
    icon: ShieldCheck,
    num: '04',
    title: 'Segurança e Backup',
    description: 'LGPD aplicada, política de backup testada, auditoria e headers de segurança.',
  },
  {
    icon: Lightbulb,
    num: '05',
    title: 'Consultoria em TI',
    description: 'Avaliação técnica, escolha de stack, modernização de legado e due diligence.',
  },
]

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="solucoes"
      className="relative overflow-hidden bg-canvas section-y border-t border-hairline"
    >
      {/* subtle mesh */}
      <div className="bg-mesh absolute inset-0 pointer-events-none opacity-50" aria-hidden="true" />

      <div className="container-content relative">
        {/* Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <p className="section-kicker">Cinco frentes · Um único parceiro</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Não é uma agência.
            <span className="block text-ink-muted">É um time embedded.</span>
          </h2>
          <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[58ch]">
            Você não precisa coordenar três fornecedores diferentes. A Icardcase entrega tecnologia ponta a ponta — do código ao cabo de rede — com a mesma engenharia, o mesmo padrão de qualidade, o mesmo time.
          </p>
        </div>

        {/* Cards */}
        <ul className="grid grid-cols-1 gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service, index) => (
            <li
              key={service.title}
              className={`relative group bg-canvas transition-all duration-700 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 110}ms` }}
            >
              <a
                href={buildWhatsAppUrl(
                  `Olá! Vim pelo site da Icardcase e quero conversar sobre ${service.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block h-full p-7 transition-colors duration-500 hover:bg-surface-1"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[0.7rem] tracking-[0.12em] text-ink-tertiary transition-colors duration-300 group-hover:text-accent">
                    {service.num}
                  </span>
                  <span className="relative inline-flex">
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full border border-accent/40 opacity-0 group-hover:animate-pulse-ring"
                      aria-hidden="true"
                    />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-hairline-strong bg-canvas transition-all duration-500 group-hover:border-accent group-hover:bg-accent/10">
                      <service.icon
                        className="h-4 w-4 text-ink-subtle transition-all duration-500 group-hover:text-accent group-hover:scale-110"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </div>

                <h3 className="text-card-title text-ink leading-snug mb-3 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm leading-[1.55] text-ink-subtle">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center gap-1 text-xs font-mono uppercase tracking-[0.1em] text-ink-tertiary opacity-0 -translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-accent">
                  <span>Conversar</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform duration-500 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
