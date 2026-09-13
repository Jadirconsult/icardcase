/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production'

/**
 * CSP por ambiente:
 * - dev: precisa 'unsafe-eval' (HMR/React DevTools) e 'unsafe-inline' (fast refresh)
 * - prod: sem 'unsafe-eval'. 'unsafe-inline' ainda em script-src pelo
 *   inline JSON-LD do layout.tsx (Schema.org) — migrar pra nonces depois.
 *
 * Terceiros: só a tag do Google Ads (components/GoogleTag.tsx), com hosts
 * EXATOS. Nunca `https:` genérico nem `*.google.com` — isso liberaria script
 * de qualquer serviço hospedado no domínio. Não há Google Analytics instalado
 * e o Supabase é só server-side (route handlers), então nenhum dos dois entra.
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  'https://www.googletagmanager.com',
  'https://www.googleadservices.com',
  'https://googleads.g.doubleclick.net',
].join(' ')

// Beacons de conversão do Ads (gtag faz fetch/sendBeacon pra estes hosts).
const connectSrc = [
  "'self'",
  'https://www.google.com',
  'https://www.googleadservices.com',
  'https://ad.doubleclick.net',
  'https://googleads.g.doubleclick.net',
].join(' ')

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Isola o browsing context: página aberta via window.open por outro site não
  // ganha referência a esta (anti tabnabbing / XS-Leaks). Links wa.me abertos
  // daqui continuam funcionando — só perdem window.opener, que não usamos.
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

/**
 * CORS para /api/*.
 *
 * ATENÇÃO — NÃO devolva `Access-Control-Allow-Origin` com uma lista separada
 * por vírgula (era `allowedOrigins.join(', ')`). A spec aceita UMA origem ou
 * `*`; uma lista é inválida e o navegador simplesmente rejeita. Funcionava só
 * por acidente (falhava fechado) e convidava alguém a "consertar" trocando por
 * `*` — o que abriria a API pra qualquer site da internet.
 *
 * A API é same-origin: site e rotas moram no mesmo domínio, então não é preciso
 * conceder CORS a ninguém. Ficam só os headers que NÃO concedem acesso.
 * A allowlist de verdade é validada em runtime dentro das rotas POST — ver
 * isAllowedOrigin() em lib/origin.ts.
 */
const apiCorsHeaders = [
  { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
  { key: 'Vary', value: 'Origin' },
]

/**
 * Cache estratégico para conteúdo público estático/SSG:
 * - s-maxage=3600 → CDN serve do cache por 1h sem revalidar
 * - stale-while-revalidate=86400 → mais 24h servindo stale enquanto revalida em background
 * - max-age=0 no browser → usuário sempre pega resposta fresca do CDN (não cacheia local)
 * Resultado: TTFB cai pra ~50-150ms (CDN edge), conteúdo atualiza em ~1h em ondas.
 */
const publicCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
  },
]

// API routes nunca cacheiam — sempre fresh
const apiNoCacheHeaders = [
  { key: 'Cache-Control', value: 'no-store, max-age=0' },
]

/**
 * Assets de public/ (ícones, logos, OG, manifest) — cache de 1 dia, SEM
 * `immutable`. Nenhum deles tem hash no nome: foram todos regenerados no mesmo
 * nome (commits 45ff848 e c2c0799). Com `immutable` + max-age longo, quem já
 * visitou ficaria com o ícone/logo antigo no browser sem revalidar.
 */
const staticAssetCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=86400, s-maxage=86400',
  },
]

/**
 * Lista explícita de arquivos (path-to-regexp: `/:param(regex)`, com `\\.`
 * para o ponto literal). O padrão antigo `/(favicon|...).:ext*` não casava com
 * nomes que têm hífen depois do prefixo (apple-touch-icon.png,
 * android-chrome-512x512.png) nem com logo-icardcase*.png / icardinho.png.
 * Arquivo novo em public/ que deva ter esse cache: adicionar aqui.
 */
const STATIC_ASSET_FILES = [
  'favicon\\.ico',
  'favicon-16x16\\.png',
  'favicon-32x32\\.png',
  'apple-touch-icon\\.png',
  'android-chrome-192x192\\.png',
  'android-chrome-512x512\\.png',
  'og-default\\.png',
  'og-default\\.svg',
  'og-icardcase\\.png',
  'logo-icardcase\\.png',
  'logo-icardcase-mark\\.png',
  'icardinho\\.png',
  'site\\.webmanifest',
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // Sem remotePatterns: toda imagem é local (public/). Liberar host remoto
    // no otimizador só amplia superfície (proxy de imagem de terceiro).
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/api/:path*', headers: apiCorsHeaders },
      { source: '/api/:path*', headers: apiNoCacheHeaders },
      // Páginas públicas (home, sobre, cases, insights, contato) — cache CDN agressivo
      { source: '/((?!api|_next).*)', headers: publicCacheHeaders },
      // Assets de public/ — DEPOIS da regra de páginas: no Next, com a mesma
      // chave de header, a última regra que casa vence.
      { source: `/:file(${STATIC_ASSET_FILES.join('|')})`, headers: staticAssetCacheHeaders },
    ]
  },
  // www → apex agora é responsabilidade do painel Vercel (Domains → Redirect to).
  // Manter o redirect aqui causaria loop com o redirect do Vercel.
}

export default nextConfig
