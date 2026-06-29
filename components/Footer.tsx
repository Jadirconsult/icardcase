import Link from 'next/link'
import { Logo } from './Logo'
import { COMPANY, buildWhatsAppUrl } from '@/lib/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-canvas border-t border-hairline">
      <div className="container-content py-16 lg:py-20">
        {/* Top: logo + tagline */}
        <div className="grid gap-14 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-5">
            <Logo variant="dark" />
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
              {COMPANY.description}
            </p>
            <div className="mt-8 flex flex-col gap-1 font-mono text-xs text-ink-tertiary">
              <span className="uppercase tracking-[0.12em]">CNPJ {COMPANY.cnpj}</span>
              <span>{COMPANY.legalName}</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary mb-5">
              Navegação
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="footer-link">Início</Link></li>
              <li><Link href="/cases" className="footer-link">Cases</Link></li>
              <li><Link href="/insights" className="footer-link">Insights</Link></li>
              <li><Link href="/sobre" className="footer-link">Sobre</Link></li>
              <li><Link href="/contato" className="footer-link">Contato</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary mb-5">
              Contato
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink-muted hover:text-ink transition-colors"
                >
                  WhatsApp · {COMPANY.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.contact.email}`}
                  className="link-underline text-ink-muted hover:text-ink transition-colors break-all"
                >
                  {COMPANY.contact.email}
                </a>
              </li>
              <li className="text-ink-subtle leading-relaxed">
                {COMPANY.address.street}<br />
                {COMPANY.address.neighborhood}, {COMPANY.address.city}/{COMPANY.address.state}
              </li>
              <li>
                <a
                  href={COMPANY.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink-muted hover:text-ink transition-colors"
                >
                  Instagram · @icardcase
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink-muted hover:text-ink transition-colors"
                >
                  LinkedIn · /icardcase
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary mb-5">
              Status
            </h3>
            <div
              className="flex items-center gap-2 text-sm text-ink-muted"
              role="status"
              aria-label="Sistemas operacionais. Tudo funcionando normalmente."
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {/* Ícone redundante pra não depender só de cor (a11y / daltonismo) */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-emerald-400"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Operacional
            </div>
            <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
              Niterói · RJ · Brasil
            </p>
          </div>
        </div>

        {/* Tagline gigante editorial — Linear-style.
            Marcada como decorativa: o efeito 'fantasma' (opacity 40%) tem contraste
            visualmente baixo de propósito. A tagline real já é indexada pelo
            Schema.org no <head> + aparece no copyright abaixo. */}
        <div className="pt-10 border-t border-hairline" aria-hidden="true">
          <p className="text-display-md text-ink-subtle/40 select-none">
            Tecnologia que conecta. Soluções que transformam.
          </p>
        </div>

        {/* Bottom rule */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
            © {year} {COMPANY.name} · Todos os direitos reservados
          </p>
          <ul className="flex gap-6 text-xs">
            <li><Link href="/politica-privacidade" className="text-ink-tertiary hover:text-ink-muted transition-colors">Política de Privacidade</Link></li>
            <li><Link href="/politica-privacidade" className="text-ink-tertiary hover:text-ink-muted transition-colors">LGPD</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
