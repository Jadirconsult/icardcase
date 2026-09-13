/**
 * Validação de Origin/Referer para os POST públicos (/api/lead, /api/whatsapp-click).
 *
 * A API é same-origin e não concede CORS a ninguém (ver next.config.mjs). Isso
 * impede o NAVEGADOR de ler a resposta cross-site, mas não impede o POST de
 * chegar — um <form> ou fetch no-cors de outro site ainda dispara a rota. Aqui
 * a rota recusa quem não vem dos próprios domínios.
 *
 * Não é autenticação: cliente fora do navegador (curl, bot) forja os headers.
 * O objetivo é cortar ruído trivial e CSRF; o rate-limit segue sendo a defesa
 * contra abuso.
 *
 * FAIL-CLOSED em produção: Origin/Referer ausente ou fora da lista → false.
 * Navegador moderno sempre envia Origin em POST, inclusive same-origin, então
 * o fluxo legítimo (LeadForm, ShadowITChat, WhatsAppButton) não é afetado.
 */

const STATIC_ALLOWED_ORIGINS = [
  'https://icardcase.com.br',
  'https://www.icardcase.com.br',
  'https://icardcase.vercel.app',
]

/**
 * Hosts que a própria Vercel injeta no deploy (preview e produção). São a
 * origem do PRÓPRIO site naquele deploy — sem eles o formulário quebraria em
 * URL de preview (`icardcase-git-<branch>.vercel.app`), que roda com
 * NODE_ENV=production.
 */
function deploymentOrigins(): string[] {
  const out: string[] = []
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (host) out.push(`https://${host}`)
  }
  return out
}

function allowedOrigins(): Set<string> {
  return new Set([...STATIC_ALLOWED_ORIGINS, ...deploymentOrigins()])
}

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]'])

/** Extrai `protocolo://host` de uma URL. Mal formada → null. */
function toOrigin(value: string): string | null {
  try {
    const url = new URL(value)
    return `${url.protocol}//${url.host}`
  } catch {
    return null
  }
}

function isLocalOrigin(origin: string): boolean {
  try {
    return LOCAL_HOSTNAMES.has(new URL(origin).hostname)
  } catch {
    return false
  }
}

/**
 * Origin tem precedência; Referer é fallback (alguns contextos de privacidade
 * removem o Origin, mas mantêm o Referer com a origem).
 *
 * Em dev (NODE_ENV !== 'production'): aceita localhost e também a ausência dos
 * dois headers — o `curl` de teste local não os envia. Origem estranha continua
 * recusada mesmo em dev.
 */
export function isAllowedOrigin(request: Request): boolean {
  const isProd = process.env.NODE_ENV === 'production'
  const allowed = allowedOrigins()

  const originHeader = request.headers.get('origin')
  const refererHeader = request.headers.get('referer')

  // `Origin: null` (iframe sandbox, redirect cross-site) é tratado como estranho.
  const candidate = originHeader
    ? originHeader
    : refererHeader
      ? toOrigin(refererHeader)
      : null

  if (!candidate) return !isProd
  if (allowed.has(candidate)) return true
  if (!isProd && isLocalOrigin(candidate)) return true
  return false
}
