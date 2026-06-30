import type { Metadata } from 'next'
import { Suspense } from 'react'
import { COMPANY, buildWhatsAppUrl } from '@/lib/constants'
import { LeadForm } from '@/components/LeadForm'

export const metadata: Metadata = {
  title: 'Contato — vamos conversar sobre seu projeto',
  description: `Fale com a ${COMPANY.name} sobre seu projeto de software, infraestrutura ou consultoria de TI. Atendimento nacional, base no Rio de Janeiro.`,
  alternates: { canonical: '/contato' },
}

export default function ContatoPage() {
  return (
    <section className="section-y bg-white">
      <div className="container-content">
        <div className="max-w-prose-wide">
          <p className="section-kicker">CONTATO</p>
          <h1 className="mt-2 text-h1 font-semibold text-brand-navy">Vamos conversar.</h1>
          <p className="mt-4 text-base text-brand-gray">
            Conte sobre seu projeto pelo formulário abaixo — respondemos em até 4 horas úteis.
            Se for urgente, fale direto no WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <div>
            <h2 className="text-h3 font-semibold text-brand-navy mb-6">Conte sobre seu projeto</h2>
            <Suspense fallback={<div className="h-96 animate-pulse bg-surface-alt rounded-lg" aria-label="Carregando formulário" />}>
              <LeadForm />
            </Suspense>
          </div>

          <aside className="space-y-8">
            <div className="bg-surface-alt rounded-lg p-6 border border-brand-navy/10">
              <h3 className="text-sm font-semibold text-brand-navy uppercase tracking-wide">
                Prefere conversa direta?
              </h3>
              <p className="mt-2 text-sm text-brand-gray leading-relaxed">
                Atendimento de segunda a sexta, 9h às 18h.
              </p>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 btn-primary text-sm w-full inline-flex items-center justify-center"
              >
                WhatsApp ({COMPANY.contact.phone})
              </a>
              <p className="mt-4 text-sm text-brand-gray">
                Ou e-mail:{' '}
                <a
                  href={`mailto:${COMPANY.contact.email}`}
                  className="text-brand-blue hover:underline break-all"
                >
                  {COMPANY.contact.email}
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-brand-navy uppercase tracking-wide">
                Onde estamos
              </h3>
              <address className="mt-3 not-italic text-sm text-brand-gray leading-relaxed">
                {COMPANY.address.street}<br />
                {COMPANY.address.neighborhood}, {COMPANY.address.city} / {COMPANY.address.state}<br />
                Brasil
              </address>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
