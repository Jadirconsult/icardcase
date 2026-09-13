'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

/* Nós da constelação — posição, raio e ritmo do pulso. */
const NODES = [
  { cx: 200, cy: 150, r: 5, d: '3.4s' },
  { cx: 320, cy: 100, r: 4.5, d: '4.1s' },
  { cx: 450, cy: 180, r: 6, d: '2.8s' },
  { cx: 480, cy: 320, r: 5, d: '3.6s' },
  { cx: 380, cy: 450, r: 5.5, d: '4.5s' },
  { cx: 220, cy: 400, r: 4, d: '3.9s' },
  { cx: 350, cy: 280, r: 7, d: '2.4s' },
  { cx: 280, cy: 220, r: 4.5, d: '3.1s' },
  { cx: 420, cy: 380, r: 5, d: '2.7s' },
]

const PERIMETRO = 'M200 150 L320 100 L450 180 L480 320 L380 450 L220 400 Z'

/**
 * Fundo decorativo do Hero: mesh, grid e constelação com parallax de mouse.
 *
 * Isolado do Hero para que o texto (h1, subtítulo, CTAs) seja Server Component
 * e chegue no HTML sem depender de hidratação.
 *
 * Parallax sem re-render: o mousemove escreve --px/--py direto no style do
 * wrapper (rAF-throttle); as camadas leem as variáveis via calc(). React não
 * re-renderiza a cada movimento.
 *
 * SMIL (<animate>/<animateMotion>) ignora o reset de prefers-reduced-motion do
 * globals.css, então só é montado depois de confirmar que o usuário NÃO pediu
 * menos movimento. No SSR a constelação sai estática.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null)
  const [animar, setAnimar] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setAnimar(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const node = ref.current
    const area = node?.parentElement
    if (!node || !area || !animar) return

    let rafId = 0
    const latest = { x: 0, y: 0 }
    const handleMove = (e: MouseEvent) => {
      const rect = area.getBoundingClientRect()
      latest.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      latest.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        node.style.setProperty('--px', latest.x.toFixed(3))
        node.style.setProperty('--py', latest.y.toFixed(3))
        rafId = 0
      })
    }
    area.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      area.removeEventListener('mousemove', handleMove)
      if (rafId) cancelAnimationFrame(rafId)
      node.style.removeProperty('--px')
      node.style.removeProperty('--py')
    }
  }, [animar])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ '--px': 0, '--py': 0 } as CSSProperties}>
      {/* gradient mesh com parallax sutil */}
      <div
        className="bg-mesh absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: 'translate3d(calc(var(--px) * 18px), calc(var(--py) * 12px), 0)' }}
      />

      {/* grid fino que fade pra fora — quieto (registro premium: o fundo é
          textura, não competidor da manchete) */}
      <div
        className="hero-grid absolute inset-0 opacity-[0.07] transition-transform duration-500 ease-out"
        style={{ transform: 'translate3d(calc(var(--px) * -8px), calc(var(--py) * -6px), 0)' }}
      />

      {/* constelação — 9 nodes + lines, lateral direita.
          Opacidade reduzida (auditoria A3: hero estava competindo por retina) */}
      <div
        className="absolute -right-12 top-1/2 hidden h-[120%] w-[55%] text-accent opacity-[0.3] mix-blend-screen transition-transform duration-500 ease-out md:block"
        style={{ transform: 'translate3d(calc(var(--px) * -24px), calc(var(--py) * -12px - 50%), 0)' }}
      >
        <svg className="h-full w-full" viewBox="0 0 600 600" fill="none">
          <defs>
            <radialGradient id="constellation-glow" cx="50%" cy="50%" r="45%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
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

          {/* Linhas da malha */}
          <g stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35" fill="none">
            <path d={PERIMETRO} />
            <path d="M200 150 L350 280 M320 100 L350 280 M450 180 L350 280 M480 320 L350 280 M380 450 L350 280 M220 400 L350 280" />
            <path d="M320 100 L280 220 M200 150 L280 220 M350 280 L280 220" />
            <path d="M450 180 L420 380 M480 320 L420 380 M350 280 L420 380" />
          </g>

          {/* Pontos viajando pela malha — só com movimento liberado */}
          {animar && (
            <>
              <circle r="2" className="fill-ink" opacity="0.9">
                <animateMotion dur="6s" repeatCount="indefinite" path={PERIMETRO} />
              </circle>
              <circle r="1.5" fill="currentColor" opacity="0.7">
                <animateMotion dur="8s" repeatCount="indefinite" path="M350 280 L450 180 L480 320 L350 280 Z" />
              </circle>
            </>
          )}

          {/* Nodes — pulsam suavemente quando há movimento */}
          {NODES.map((n) => (
            <g key={`${n.cx}-${n.cy}`} filter="url(#node-glow)">
              <circle cx={n.cx} cy={n.cy} r={n.r} fill="currentColor" opacity="0.6">
                {animar && (
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur={n.d} repeatCount="indefinite" />
                )}
              </circle>
              <circle cx={n.cx} cy={n.cy} r={n.r * 0.4} className="fill-ink" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
