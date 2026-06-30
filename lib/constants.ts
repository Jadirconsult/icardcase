export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.icardcase.com.br',
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
  social: {
    linkedin: 'https://linkedin.com/company/icardcase',
    instagram: 'https://www.instagram.com/icardcase/',
  },
} as const

export function buildWhatsAppUrl(text?: string): string {
  const defaultText =
    'Olá! Vim pelo site da Icardcase. Gostaria de conversar sobre um projeto.'
  const message = encodeURIComponent(text ?? defaultText)
  return `https://wa.me/${COMPANY.contact.whatsapp}?text=${message}`
}
