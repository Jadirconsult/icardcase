'use client'

import { useEffect, useRef, useState } from 'react'
import { buildWhatsAppUrl } from '@/lib/constants'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const node = heroRef.current
    if (!node) return
    // Respeita prefers-reduced-motion: sem parallax pra quem pediu menos movimento.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // rAF-throttle: agenda setState em até 1 frame (~16ms a 60fps), evita
    // re-render a cada mousemove (que dispara 100-1000x/seg em telas 4K).
    let rafId = 0
    let latest = { x: 0, y: 0 }
    const handleMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect()
      latest.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      latest.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        setParallax({ x: latest.x, y: latest.y })
        rafId = 0
      })
    }
    node.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      node.removeEventListener('mousemove', handleMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden bg-canvas pt-24 pb-28 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44"
    >
      {/* Aurora glow — 2 luzes accent driftando lentas atrás de tudo */}
      <div className="aurora" aria-hidden="true" />

      {/* gradient mesh com parallax sutil */}
      <div
        className="bg-mesh absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
        aria-hidden="true"
        style={{ transform: `translate3d(${parallax.x * 18}px, ${parallax.y * 12}px, 0)` }}
      />

      {/* grid pattern fino que fade pra fora */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] transition-transform duration-500 ease-out"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 70%)',
          transform: `translate3d(${-parallax.x * 8}px, ${-parallax.y * 6}px, 0)`,
        }}
      />

      {/* constellation animada — 9 nodes + lines, lateral direita
          opacidade reduzida (auditoria A3: hero estava competindo por retina) */}
      <div
        className="absolute -right-12 top-1/2 -translate-y-1/2 h-[120%] w-[55%] pointer-events-none mix-blend-screen hidden md:block transition-transform duration-500 ease-out opacity-60"
        aria-hidden="true"
        style={{ transform: `translate3d(${parallax.x * -24}px, ${parallax.y * -12 - 50}%, 0)` }}
      >
        <svg className="h-full w-full" viewBox="0 0 600 600" fill="none">
          <defs>
            <radialGradient id="constellation-glow" cx="50%" cy="50%" r="45%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#040E24" stopOpacity="0" />
            </radialGradient>
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="300" cy="300" r="260" fill="url(#constellation-glow)" />

          {/* Lines com stroke-dasharray pra parecer "trazendo dados" */}
          <g stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.35" fill="none">
            <path d="M200 150 L320 100 L450 180 L480 320 L380 450 L220 400 Z" />
            <path d="M200 150 L350 280 M320 100 L350 280 M450 180 L350 280 M480 320 L350 280 M380 450 L350 280 M220 400 L350 280" />
            <path d="M320 100 L280 220 M200 150 L280 220 M350 280 L280 220" />
            <path d="M450 180 L420 380 M480 320 L420 380 M350 280 L420 380" />
          </g>

          {/* Animated traveling dot ao longo de uma linha */}
          <circle r="2" fill="#FFFFFF" opacity="0.9">
            <animateMotion dur="6s" repeatCount="indefinite" path="M200 150 L320 100 L450 180 L480 320 L380 450 L220 400 Z" />
          </circle>
          <circle r="1.5" fill="#2563EB" opacity="0.7">
            <animateMotion dur="8s" repeatCount="indefinite" path="M350 280 L450 180 L480 320 L350 280 Z" />
          </circle>

          {/* Nodes — pulsando suavemente */}
          {[
            { cx: 200, cy: 150, r: 5, d: '3.4s' },
            { cx: 320, cy: 100, r: 4.5, d: '4.1s' },
            { cx: 450, cy: 180, r: 6, d: '2.8s' },
            { cx: 480, cy: 320, r: 5, d: '3.6s' },
            { cx: 380, cy: 450, r: 5.5, d: '4.5s' },
            { cx: 220, cy: 400, r: 4, d: '3.9s' },
            { cx: 350, cy: 280, r: 7, d: '2.4s' },
            { cx: 280, cy: 220, r: 4.5, d: '3.1s' },
            { cx: 420, cy: 380, r: 5, d: '2.7s' },
          ].map((n, i) => (
            <g key={i} filter="url(#node-glow)">
              <circle cx={n.cx} cy={n.cy} r={n.r} fill="#2563EB" opacity="0.6">
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur={n.d} repeatCount="indefinite" />
              </circle>
              <circle cx={n.cx} cy={n.cy} r={n.r * 0.4} fill="#FFFFFF" />
            </g>
          ))}
        </svg>
      </div>

      {/* grain */}
      <div className="grain-overlay" aria-hidden="true" />

      <div className="container-content relative z-10">
        {/* Eyebrow técnico — fade-in primeiro */}
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <span className="eyebrow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Boutique de Tecnologia · Atendimento nacional · Est. 2011
          </span>
        </div>

        {/* Headline display-xl — entra com stagger, tracking negativo agressivo.
            Auditoria A3: gradient removido do 'conecta.' (competia com o accent
            do CTA e parecia link). Cursor pulsante no fim da frase mantido. */}
        <h1 aria-label="Tecnologia que conecta. Soluções que transformam." className="mt-8 max-w-[18ch] text-display-xl text-ink">
          <span
            className={`block transition-all duration-500 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '60ms' }}
          >
            Tecnologia que
          </span>
          <span
            className={`block transition-all duration-500 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '120ms' }}
          >
            conecta.
          </span>
          <span
            className={`block text-ink transition-all duration-500 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '180ms' }}
          >
            Soluções que transformam.
            <span className="ml-1 inline-block h-[0.8em] w-[3px] translate-y-[2px] bg-accent animate-pulse" aria-hidden="true" />
          </span>
        </h1>

        {/* Subhead — auditoria A3: cortado pela metade (Linear/Vercel usam
            15-25 palavras). Tom institucional 'nós' em vez do 'eu' pra manter
            coerência com o resto do site. */}
        <p
          className={`mt-8 max-w-[52ch] text-lg leading-[1.5] text-ink-subtle sm:text-xl transition-all duration-500 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: '240ms' }}
        >
          Sistemas sob medida, infraestrutura confiável e segurança aplicada — atendimento direto, sem call center, sem terceirizações.
        </p>

        {/* CTAs Linear-spec */}
        <div
          className={`mt-10 flex flex-col sm:flex-row gap-3 transition-all duration-500 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary group">
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
          </a>
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
        <div
          className={`mt-24 pt-10 border-t border-hairline transition-all duration-500 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '380ms' }}
        >
          <div className="grid grid-cols-2 gap-y-10 gap-x-12 sm:grid-cols-4">
            {[
              { to: 14, decimals: 0, suffix: '', unit: 'anos', label: 'no mercado de TI brasileiro' },
              { to: 5, decimals: 0, suffix: '', unit: 'frentes', label: 'sistemas, infra, suporte, segurança, consultoria' },
              { to: 99.5, decimals: 1, suffix: '%', unit: 'uptime', label: 'em infraestrutura crítica' },
              { to: 6, decimals: 0, suffix: '', unit: 'camadas', label: 'de segurança aplicadas' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`group transition-all duration-400 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{ transitionDelay: `${440 + i * 60}ms` }}
              >
                <div className="flex items-baseline gap-1.5">
                  <AnimatedCounter
                    to={stat.to}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    className="text-display-md text-ink transition-colors duration-300 group-hover:text-accent"
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-hover">
            Modelo boutique · Portfólio curado
          </span>
          <span className="text-ink-muted">
            Aceitamos até 4 novos clientes por trimestre. Parceria de longo prazo, atendimento direto com o CEO.
          </span>
        </div>
      </div>
    </section>
  )
}
