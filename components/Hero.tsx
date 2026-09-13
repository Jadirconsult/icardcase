import { AnimatedCounter } from '@/components/AnimatedCounter'
import { yearsInBusiness } from '@/lib/constants'
import { HeroBackdrop } from '@/components/HeroBackdrop'
import { WhatsAppButton } from '@/components/WhatsAppButton'

const stats = [
  { to: yearsInBusiness(), decimals: 0, suffix: '', unit: 'anos', label: 'no mercado de TI brasileiro' },
  { to: 5, decimals: 0, suffix: '', unit: 'frentes', label: 'sistemas, infra, suporte, segurança, consultoria' },
  { to: 99.5, decimals: 1, suffix: '%', unit: 'uptime', label: 'em infraestrutura crítica' },
  { to: 6, decimals: 0, suffix: '', unit: 'camadas', label: 'de segurança aplicadas' },
]

/**
 * Hero da home — Server Component.
 *
 * h1 e subtítulo saem VISÍVEIS no HTML (são o LCP): antes esperavam a
 * hidratação (`mounted`) para sair de opacity-0. Eyebrow, CTAs e stats ainda
 * entram com fade, mas só via keyframes CSS (`animate-enter`), que rodam sem
 * JS. O parallax e a constelação animada vivem no HeroBackdrop (client).
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-canvas pt-24 pb-28 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44">
      {/* Aurora glow — 2 luzes accent driftando lentas atrás de tudo */}
      <div className="aurora" aria-hidden="true" />

      {/* mesh + grid + constelação, com parallax de mouse */}
      <HeroBackdrop />

      {/* grain */}
      <div className="grain-overlay" aria-hidden="true" />

      <div className="container-content relative z-10">
        {/* Eyebrow técnico — fade-in primeiro */}
        <div className="animate-enter">
          <span className="eyebrow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Boutique de Tecnologia · Atendimento nacional · Est. 2011
          </span>
        </div>

        {/* Headline display-xl, tracking negativo agressivo. Sem animação de
            entrada: é o maior elemento da dobra e precisa pintar no 1º frame.
            Auditoria A3: gradient removido do 'conecta.' (competia com o accent
            do CTA e parecia link). Cursor pulsante no fim da frase mantido. */}
        <h1 aria-label="Tecnologia que conecta. Soluções que transformam." className="mt-8 max-w-[18ch] text-display-xl text-ink">
          <span className="block">Tecnologia que</span>
          <span className="block">conecta.</span>
          <span className="block text-ink">
            Soluções que transformam.
            <span className="ml-1 inline-block h-[0.8em] w-[3px] translate-y-[2px] bg-accent animate-pulse" aria-hidden="true" />
          </span>
        </h1>

        {/* Subhead — auditoria A3: cortado pela metade (Linear/Vercel usam
            15-25 palavras). Tom institucional 'nós' em vez do 'eu' pra manter
            coerência com o resto do site. */}
        <p className="mt-10 max-w-[46ch] text-xl leading-[1.5] text-ink-muted sm:text-2xl">
          Sistemas sob medida, infraestrutura confiável e segurança aplicada — atendimento direto, sem call center, sem terceirizações.
        </p>

        {/* CTAs Linear-spec */}
        <div className="mt-10 flex flex-col gap-3 animate-enter [animation-delay:120ms] sm:flex-row">
          <WhatsAppButton origem="home_hero" variant="primary" className="group">
            Conversar sobre seu projeto
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
          </WhatsAppButton>
          <a href="#solucoes" className="btn-secondary group">
            Ver nossa abordagem
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Stats bar — Linear-style com hairline + mono labels */}
        <div className="mt-24 border-t border-hairline pt-10 animate-enter [animation-delay:220ms]">
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="group">
                <div className="flex items-baseline gap-1.5">
                  <AnimatedCounter
                    to={stat.to}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    className="text-display-md text-ink transition-colors duration-300 group-hover:text-accent-text"
                  />
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-subtle">
                    {stat.unit}
                  </span>
                </div>
                <p className="mt-2 max-w-[22ch] text-[0.875rem] leading-snug text-ink-subtle">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Faixa de posicionamento — auditoria B4: substitui 'Vagas limitadas 2026'
          (sem número, parecia técnica de vendedor) por posicionamento concreto:
          modelo boutique + volume real. */}
      <div className="edge-highlight relative mt-24 sm:mt-32 border-y border-hairline bg-surface-1/40 backdrop-blur-sm">
        <div className="container-content flex flex-wrap items-center gap-3 py-5 text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-text" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-hover">
            Modelo boutique · Portfólio curado
          </span>
          {/* Auditoria 07/2026: removido o número fixo "4 novos clientes por
              trimestre" — colidia com a escassez da oferta Raio-X ("4
              diagnósticos/mês") e travava a campanha de captação. Escassez
              qualitativa mantém o posicionamento boutique sem contradição. */}
          <span className="text-ink-muted">
            Carteira limitada de clientes ativos. Parceria de longo prazo, atendimento direto com o CEO.
          </span>
        </div>
      </div>
    </section>
  )
}
