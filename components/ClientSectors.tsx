'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Faixa de setores atendidos — padrão Vercel/Stripe quando não se tem
 * licença dos logos dos clientes. Prova social sem logo, mas com peso.
 *
 * Tipografia mono uppercase reforça 'engenharia sênior' (não é
 * 'agência de logos'). Usa tokens do design system.
 */
const sectors = [
  'Indústria Química',
  'Estacionamento',
  'Plataforma Fiscal',
  'Órgão Público',
  'Contabilidade',
  'Financeiras',
] as const

export function ClientSectors() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      aria-labelledby="setores-title"
      className="relative bg-canvas py-14 border-t border-hairline"
    >
      <div className="container-content">
        <p
          id="setores-title"
          className="section-kicker"
        >
          Setores em produção · 14 anos
        </p>

        <div
          className={`mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {sectors.map((sector, i) => (
            <div
              key={sector}
              className={`inline-flex items-center gap-2 transition-all duration-500 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: `${80 + i * 60}ms` }}
            >
              <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">
                {sector}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
