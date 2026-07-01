'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const risks = [
  {
    title: 'Superfície de ataque LGPD',
    desc: 'Dados de cliente em Drive/pastas compartilhadas + planilhas com links abertos = incidente esperando pra acontecer. ANPD já multou empresas por menos.',
  },
  {
    title: 'Divergência entre versões',
    desc: 'Múltiplas cópias do mesmo dado em lugares diferentes. Decisão executiva é tomada com valor errado. Retrabalho vira custo mensal invisível.',
  },
  {
    title: 'Auditoria sem log',
    desc: 'Sem registro de quem acessou o quê e quando. Impossível responder a ANPD, sócio ou cliente que pediu prova de tratamento adequado.',
  },
]

export function DataUnification() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-canvas section-y border-t border-hairline"
    >
      <div className="bg-mesh absolute inset-0 pointer-events-none opacity-50" aria-hidden="true" />

      <div className="container-content relative">
        <div
          className={`max-w-3xl mb-16 lg:mb-20 transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="section-kicker">Superfície oculta de risco</p>
          <h2
            aria-label="Dados fragmentados não são só desorganização. São exposição."
            className="mt-5 text-display-lg text-ink"
          >
            Dados fragmentados
            <span className="block text-ink-muted">não são desorganização.</span>
            <span className="block">São exposição.</span>
          </h2>
          <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[58ch]">
            Planilhas em Drive, pastas com nomes parecidos, links de compartilhamento
            esquecidos, PDFs baixados fora do sistema. Cada arquivo espalhado é ponto
            de falha em três dimensões que sua auditoria não perdoa.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-3 mb-16">
          {risks.map((r, i) => (
            <li
              key={r.title}
              className={`bg-canvas p-7 transition-all duration-700 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <h3 className="text-card-title text-ink leading-snug mb-3">{r.title}</h3>
              <p className="text-sm leading-[1.55] text-ink-subtle">{r.desc}</p>
            </li>
          ))}
        </ul>

        <div
          className={`max-w-[58ch] transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '560ms' }}
        >
          <p className="text-lg leading-[1.55] text-ink-subtle">
            A saída não é 'mais treinamento de equipe' nem 'nova pasta organizada'. É
            infraestrutura: sistema único com <strong className="text-ink font-medium">RLS no banco</strong>,
            <strong className="text-ink font-medium"> audit log imutável</strong>,
            <strong className="text-ink font-medium"> controle de acesso por papel</strong> e
            <strong className="text-ink font-medium"> criptografia em repouso</strong> — o
            que a LGPD exige e o auditor pede por escrito.
          </p>

          <div className="mt-10">
            <Link href="/seguranca-lgpd" className="btn-primary group">
              Ver como aplicamos isso
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
        </div>
      </div>
    </section>
  )
}
