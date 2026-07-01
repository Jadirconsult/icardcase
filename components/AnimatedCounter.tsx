'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  to: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
}

/**
 * Count-up animado quando entra na viewport (IntersectionObserver + rAF).
 * Respeita prefers-reduced-motion — usuário que pediu menos movimento
 * vê o número final direto, sem animação.
 *
 * Fires uma vez só (started ref). Easing: easeOutCubic — sensação de
 * 'freada suave' no final, típica de UI Linear/Vercel/Apple.
 */
export function AnimatedCounter({
  to,
  duration = 1400,
  decimals = 0,
  suffix = '',
  prefix = '',
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCurrent(to)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const startTime = performance.now()

        const tick = (now: number) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCurrent(to * eased)
          if (progress < 1) requestAnimationFrame(tick)
          else setCurrent(to)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [to, duration])

  const formatted =
    decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toString()

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
