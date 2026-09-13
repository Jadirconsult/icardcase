import { yearsInBusiness } from '@/lib/constants'
import { Reveal } from '@/components/Reveal'

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
  return (
    <section
      aria-labelledby="setores-title"
      className="relative bg-canvas py-14 border-t border-hairline"
    >
      <div className="container-content">
        <p
          id="setores-title"
          className="section-kicker"
        >
          Setores em produção · {yearsInBusiness()} anos
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
          {sectors.map((sector, i) => (
            <Reveal key={sector} delay={80 + i * 60} className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">
                {sector}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
