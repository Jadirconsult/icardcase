'use client'

import { useEffect, useRef, useState } from 'react'

const points = [
  {
    num: '01',
    title: 'Engenharia, não suporte',
    detail:
      'Construímos sistemas — não somos assistência técnica de gravata. Arquitetura pensada, código revisado, segurança aplicada desde o primeiro commit.',
  },
  {
    num: '02',
    title: 'CEO no projeto',
    detail:
      'Quem fecha contigo executa. Sem terceirização pra freelancer desconhecido, sem trainee aprendendo no seu sistema. Atenção real, do briefing à entrega.',
  },
  {
    num: '03',
    title: '15 anos em infra crítica',
    detail:
      'Antes da Icardcase, foram 15 anos em projetos pesados de ferrovia, mineração e construção. Vale, Carajás, EFVM, Camargo Corrêa. Esse repertório define rigor.',
  },
  {
    num: '04',
    title: 'Segurança e LGPD desde o dia 1',
    detail:
      'Validação de input, rate limiting, isolamento multi-tenant, audit log, headers de segurança. Não é discurso — é como construímos este próprio site.',
  },
]

export function Differentials() {
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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-canvas section-y border-t border-hairline"
    >
      <div className="container-content relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Coluna texto — 5/12 */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <p className="section-kicker">Por que somos diferentes</p>
            <h2 className="mt-5 text-display-lg text-ink">
              Engenharia de verdade,
              <span className="block text-ink-muted">não suporte de gravata.</span>
            </h2>
            <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[42ch]">
              Quem assina o contrato é quem executa. Sem terceirização, sem júnior aprendendo no seu cliente. CEO no projeto, 14 anos no mercado.
            </p>
            <p className="mt-5 text-base leading-relaxed text-ink-subtle max-w-[42ch]">
              Antes disso, 15 anos em infraestrutura pesada: ferrovia Carajás, EFVM, mineração, projetos da Vale e Camargo Corrêa. Esse repertório ensina o que é sistema crítico — e a gente aplica esse rigor à tecnologia.
            </p>
          </div>

          {/* Coluna pontos — 7/12 */}
          <ul className="lg:col-span-7 space-y-px border-t border-hairline">
            {points.map((p, i) => (
              <li
                key={p.title}
                className={`group relative transition-all duration-700 ease-out ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="flex gap-6 py-8 border-b border-hairline transition-colors duration-300 group-hover:border-hairline-strong">
                  {/* Número editorial mono */}
                  <span className="flex-shrink-0 font-mono text-xs tracking-[0.1em] text-ink-tertiary pt-2 transition-colors duration-300 group-hover:text-accent">
                    {p.num}
                  </span>

                  <div className="flex-1">
                    <h3 className="text-headline text-ink transition-colors duration-300 group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-subtle max-w-[58ch]">
                      {p.detail}
                    </p>
                  </div>

                  {/* Indicador hover lateral */}
                  <span
                    className="flex-shrink-0 self-center text-ink-tertiary opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent"
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
