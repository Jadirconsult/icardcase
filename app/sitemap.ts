import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

const routes = [
  { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { url: '/sobre', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/cases', priority: 0.9, changeFrequency: 'weekly' as const },
  { url: '/insights', priority: 0.9, changeFrequency: 'weekly' as const },
  { url: '/contato', priority: 0.7, changeFrequency: 'monthly' as const },
  // Páginas de serviço — SEO orgânico nacional
  { url: '/desenvolvimento-de-sistemas', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/desenvolvimento-mobile', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/infraestrutura-de-ti', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/seguranca-lgpd', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/consultoria-ti', priority: 0.9, changeFrequency: 'monthly' as const },
  // Landing de oferta — campanha de captação (contabilidades)
  { url: '/raio-x-de-ti', priority: 0.8, changeFrequency: 'monthly' as const },
  // Landing de topo de funil — busca orgânica por "Shadow IT", com o
  // diagnóstico por conversa no lugar do formulário.
  { url: '/shadow-it', priority: 0.9, changeFrequency: 'monthly' as const },
  // Auditoria 09/2026: as três entradas legais aqui apontavam para 404.
  // A rota real é /politica-privacidade (sem o "de"); /termos-de-uso e /lgpd
  // nunca existiram em app/. Declarar 404 no sitemap gasta orçamento de
  // rastreio e deixava a política real fora do índice.
  { url: '/politica-privacidade', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/abordagem', priority: 0.6, changeFrequency: 'monthly' as const },
]

const blogPosts = [
  'reforma-tributaria-2026',
  'migrar-visual-foxpro-web',
  'whatsapp-business-api-empresarial',
  'dctfweb-automacao',
  'lgpd-escritorio-contabil',
]

const cases = [
  'syspershy',
  'prossiga',
  'nf-saas',
  'ufrj',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const main = routes.map((r) => ({
    url: `${SITE.url}${r.url}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const posts = blogPosts.map((slug) => ({
    url: `${SITE.url}/insights/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const caseUrls = cases.map((slug) => ({
    url: `${SITE.url}/cases/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...main, ...posts, ...caseUrls]
}
