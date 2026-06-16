'use client'

import { useEffect, useRef, useState } from 'react'
import { buildWhatsAppUrl, COMPANY } from '@/lib/constants'

export function FinalCTA() {
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
      { threshold: 0.2 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-canvas section-y border-t border-hairline">
      <div className="container-content">
        {/* CTA banner Linear-style: surface-1 lift, rounded-xl, padding generoso */}
        <div className="surface-card relative overflow-hidden edge-highlight">
          {/* mesh subtil */}
          <div className="bg-mesh absolute inset-0 pointer-events-none opacity-60" aria-hidden="true" />

          {/* glow border top */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            aria-hidden="true"
          />

          <div className="relative grid gap-12 p-10 sm:p-14 lg:grid-cols-12 lg:gap-16 lg:p-20">
            {/* Coluna esquerda — copy editorial */}
            <div
              className={`lg:col-span-7 transition-all duration-1000 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="section-kicker">Próximo passo</p>
              <h2 aria-label="Se faz sentido pra você, faz sentido pra gente." className="mt-5 text-display-lg text-ink">
                Se faz sentido pra você,
                <span className="block text-ink-muted">faz sentido pra gente.</span>
              </h2>
              <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[48ch]">
                Manda mensagem direto no WhatsApp. Em até <span className="text-ink-muted">4 horas úteis</span>, o próprio Jadir Luiz responde — sem bot, sem call center, sem trainee terceirizado.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Conversar no WhatsApp
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href={`tel:+${COMPANY.contact.whatsapp}`} className="btn-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {COMPANY.contact.phone}
                </a>
              </div>
            </div>

            {/* Coluna direita — meta info técnica em mono */}
            <div
              className={`lg:col-span-5 lg:border-l lg:border-hairline lg:pl-16 transition-all duration-1000 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '180ms' }}
            >
              <p className="section-kicker">Como acontece</p>
              <ul className="mt-6 space-y-5">
                {[
                  { step: '01', label: 'Você manda mensagem no WhatsApp ou preenche o form' },
                  { step: '02', label: 'CEO responde em até 4h úteis (sem bot, sem fila)' },
                  { step: '03', label: 'Reunião de 30min — sem custo, sem compromisso' },
                  { step: '04', label: 'Se fizer sentido, proposta detalhada em 5 dias' },
                ].map((s) => (
                  <li key={s.step} className="flex items-start gap-4">
                    <span className="font-mono text-[0.7rem] tracking-[0.12em] text-accent-hover pt-1">
                      {s.step}
                    </span>
                    <span className="text-sm text-ink-muted leading-relaxed">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
