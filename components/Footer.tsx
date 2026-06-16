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
              <li><Link href="/" className="text-ink-muted hover:text-ink transition-colors">Início</Link></li>
              <li><Link href="/cases" className="text-ink-muted hover:text-ink transition-colors">Cases</Link></li>
              <li><Link href="/insights" className="text-ink-muted hover:text-ink transition-colors">Insights</Link></li>
              <li><Link href="/sobre" className="text-ink-muted hover:text-ink transition-colors">Sobre</Link></li>
              <li><Link href="/contato" className="text-ink-muted hover:text-ink transition-colors">Contato</Link></li>
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
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Operacional
            </div>
            <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
              Niterói · RJ · Brasil
            </p>
          </div>
        </div>

        {/* Tagline gigante editorial — Linear-style */}
        <div className="pt-10 border-t border-hairline">
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
