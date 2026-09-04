'use client'

import { usePathname } from 'next/navigation'

/**
 * Esconde o chrome do site (Header/Footer/WhatsApp float) em rotas de
 * landing page de tráfego pago. Landing sem menu = lead sem rota de fuga:
 * ou converte, ou sai — nada de "vou dar uma olhada nos cases" no meio
 * do funil pago.
 *
 * Para criar nova landing isolada, basta adicionar o prefixo aqui.
 */
const CHROMELESS_PREFIXES = ['/raio-x-de-ti', '/shadow-it']

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const chromeless = CHROMELESS_PREFIXES.some((p) => pathname?.startsWith(p))
  if (chromeless) return null
  return <>{children}</>
}
