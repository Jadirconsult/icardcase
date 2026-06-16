import type { Metadata } from 'next'
import { COMPANY, buildWhatsAppUrl } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contato',
  description: `Entre em contato com a ${COMPANY.name}. WhatsApp direto, sem formulário, sem espera.`,
}

export default function ContatoPage() {
  return (
    <section className="section-y bg-white">
      <div className="container-content max-w-prose-wide">
        <p className="section-kicker">CONTATO</p>
        <h1 className="mt-2 text-h1 font-semibold text-brand-navy">Vamos conversar.</h1>
        <p className="mt-4 text-base text-brand-gray">
          A forma mais rápida de falar com a gente é direto pelo WhatsApp. Atendimento de segunda a sexta, 9h às 18h.
        </p>

        <div className="mt-10 space-y-4">
          <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-6 py-4">
            Conversar no WhatsApp ({COMPANY.contact.phone})
          </a>
          <p className="text-sm text-brand-gray">
            Prefere e-mail? <a href={`mailto:${COMPANY.contact.email}`} className="text-brand-blue hover:underline">{COMPANY.contact.email}</a>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-navy/10">
          <h2 className="text-h3 font-semibold text-brand-navy">Onde estamos</h2>
          <address className="mt-3 not-italic text-base text-brand-gray">
            {COMPANY.address.street}<br />
            {COMPANY.address.neighborhood}, {COMPANY.address.city} / {COMPANY.address.state}<br />
            Brasil
          </address>
        </div>
      </div>
    </section>
  )
}
