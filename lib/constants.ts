export const SITE = {
  // `||` e não `??`: env definida como string vazia na Vercel também cai no default
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.icardcase.com.br',
  name: 'Icardcase',
  locale: 'pt_BR',
} as const

export const COMPANY = {
  name: 'Icardcase',
  legalName: 'J Oliver Serviços de Informática TI Ltda',
  cnpj: '13.437.391/0001-58',
  founded: '2011',
  description:
    'Parceiro estratégico de tecnologia para empresas de todo o Brasil. Soluções web e mobile sob medida, infraestrutura, segurança e consultoria — atendimento remoto nacional, base no Rio de Janeiro, desde 2011. Sem terceirizações.',
  tagline: 'Tecnologia que conecta. Soluções que transformam.',
  contact: {
    phone: '+55 (21) 98878-5170',
    // Formato E.164 para dados estruturados (schema.org telephone)
    phoneE164: '+5521988785170',
    whatsapp: '5521988785170',
    email: 'contatos@icardcase.com.br',
  },
  address: {
    street: 'Rua Bahia, 43',
    neighborhood: 'Badu',
    city: 'Niterói',
    state: 'RJ',
    zip: '24330-440',
    country: 'BR',
  },
  // Horário publicado em /contato: segunda a sexta, 9h às 18h
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  social: {
    linkedin: 'https://linkedin.com/company/icardcase',
    instagram: 'https://www.instagram.com/icardcase/',
  },
} as const

/**
 * Anos de empresa, calculados a partir do ano de fundação — substitui o
 * "14 anos" que ficava fixo no texto e envelhecia a cada virada de ano.
 * Atenção: nas páginas estáticas (SSG) o valor é o do momento do build.
 */
export function yearsInBusiness(now: Date = new Date()): number {
  return now.getFullYear() - Number(COMPANY.founded)
}

export function buildWhatsAppUrl(text?: string): string {
  const defaultText =
    'Olá! Vim pelo site da Icardcase. Gostaria de conversar sobre um projeto.'
  const message = encodeURIComponent(text ?? defaultText)
  return `https://wa.me/${COMPANY.contact.whatsapp}?text=${message}`
}
