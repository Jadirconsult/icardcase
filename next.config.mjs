/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production'

/**
 * CSP por ambiente:
 * - dev: precisa 'unsafe-eval' (HMR/React DevTools) e 'unsafe-inline' (fast refresh)
 * - prod: sem 'unsafe-eval'. 'unsafe-inline' ainda em script-src pelo
 *   inline JSON-LD do layout.tsx (Schema.org) — migrar pra nonces depois.
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
].join(' ')

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

// CORS estrito para /api/* — só aceita requests vindas dos próprios domínios.
const allowedOrigins = [
  'https://icardcase.com.br',
  'https://www.icardcase.com.br',
  'https://icardcase.vercel.app',
]
const apiCorsHeaders = [
  { key: 'Access-Control-Allow-Origin', value: allowedOrigins.join(', ') },
  { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
  { key: 'Access-Control-Max-Age', value: '86400' },
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

// Assets versionados (favicon, og, manifest) — cache longo
const staticAssetCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=86400, s-maxage=604800, immutable',
  },
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/api/:path*', headers: apiCorsHeaders },
      { source: '/api/:path*', headers: apiNoCacheHeaders },
      // Páginas públicas (home, sobre, cases, insights, contato) — cache CDN agressivo
      { source: '/((?!api|_next).*)', headers: publicCacheHeaders },
      // Assets estáticos (favicon, ícones, OG) — cache muito longo
      { source: '/(favicon|icon|apple-touch|android-chrome|og-default|logo-mark).:ext*', headers: staticAssetCacheHeaders },
      { source: '/site.webmanifest', headers: staticAssetCacheHeaders },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.icardcase.com.br' }],
        destination: 'https://icardcase.com.br/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
