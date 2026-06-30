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
    <section className="section-y">
      <div className="container-content">
        <div className="max-w-prose-wide">
          <p className="section-kicker">CONTATO</p>
          <h1 className="mt-2 text-display-md text-ink">Vamos conversar.</h1>
          <p className="mt-5 text-body-lg text-ink-muted">
            Conte sobre seu projeto pelo formulário abaixo — respondemos em até 4 horas úteis.
            Se for urgente, fale direto no WhatsApp.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          <div>
            <h2 className="text-headline text-ink mb-7">Conte sobre seu projeto</h2>
            <Suspense fallback={<div className="h-96 animate-pulse rounded-xl border border-hairline bg-surface-1" aria-label="Carregando formulário" />}>
              <LeadForm />
            </Suspense>
          </div>

          <aside className="space-y-8">
            <div className="surface-card p-6">
              <h3 className="eyebrow">PREFERE CONVERSA DIRETA?</h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                Atendimento de segunda a sexta, 9h às 18h.
              </p>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 btn-primary w-full"
              >
                WhatsApp ({COMPANY.contact.phone})
              </a>
              <p className="mt-4 text-sm text-ink-subtle">
                Ou e-mail:{' '}
                <a
                  href={`mailto:${COMPANY.contact.email}`}
                  className="text-accent hover:text-accent-hover break-all link-underline"
                >
                  {COMPANY.contact.email}
                </a>
              </p>
            </div>

            <div>
              <h3 className="eyebrow">ONDE ESTAMOS</h3>
              <address className="mt-3 not-italic text-sm text-ink-muted leading-relaxed">
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
