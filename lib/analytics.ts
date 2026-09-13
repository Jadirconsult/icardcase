/**
 * Instrumentação de front — Google Ads (gtag) + Vercel Analytics.
 *
 * Só roda no browser (chamado a partir de client components). O stub
 * `window.gtag` é criado cedo pelo components/GoogleTag.tsx; o gtag.js real
 * carrega em `lazyOnload` e processa a fila do dataLayer quando chegar — então
 * um evento disparado antes do script existir não se perde.
 *
 * Env vars (Vercel → Settings → Environment Variables):
 *   NEXT_PUBLIC_GOOGLE_ADS_ID          = AW-XXXXXXXXXX
 *   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL  = rótulo da ação de conversão "Lead enviado"
 * Sem as duas, a conversão do Ads simplesmente não dispara (o evento da Vercel sim).
 */
import { track } from '@vercel/analytics'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

// Acesso literal: o Next só substitui NEXT_PUBLIC_* escritos por extenso.
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL

export function sendGtagEvent(event: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}

interface LeadConversion {
  /** id devolvido pelo POST /api/lead — vira transaction_id (deduplica no Ads). */
  id?: string
  /** origem do lead (formulario_contato, chat_shadow_it, …). */
  origem: string
}

export function trackLeadConversion({ id, origem }: LeadConversion) {
  if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
    sendGtagEvent('conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      ...(id ? { transaction_id: id } : {}),
    })
  }
  track('lead_submit', { origem })
}

/** status HTTP da falha, ou 'rede' quando o fetch nem completou. */
export function trackLeadError(status: number | 'rede', origem?: string) {
  track('lead_error', { status: String(status), origem: origem ?? null })
}
