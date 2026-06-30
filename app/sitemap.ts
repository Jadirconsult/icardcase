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
  { url: '/politica-de-privacidade', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/termos-de-uso', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/lgpd', priority: 0.3, changeFrequency: 'yearly' as const },
]

const blogPosts = [
  'reforma-tributaria-2026',
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
