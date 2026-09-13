import type { RelatedLink } from '@/lib/insights'

/**
 * Cases de /cases/[slug]. Fonte única para a página e o sitemap.
 * Números e métricas são decisão do dono — não alterar sem aprovação.
 */

export interface CaseStudy {
  segment: string
  title: string
  /** <title> da página: até ~48 caracteres, o template soma ' · Icardcase'. */
  metaTitle: string
  /** Meta description: até 155 caracteres. */
  metaDescription: string
  subtitle: string
  problem: string
  solution: string
  results: string[]
  tech: string[]
  /** Bloco 'Veja também': serviço correspondente + artigo/case relacionado. */
  related: RelatedLink[]
}

// Data do último commit que alterou o conteúdo dos cases
// (git log -1 --format=%cs -- app/cases/[slug]/page.tsx). Atualize ao revisar um case.
export const CASES_LAST_REVIEWED = '2026-07-01'

export const CASES: Record<string, CaseStudy> = {
  'syspershy': {
    segment: 'INDÚSTRIA QUÍMICA',
    title: 'SYSPERSHY',
    metaTitle: 'Case SYSPERSHY: ERP para indústria química',
    metaDescription:
      'ERP completo para indústria química certificada ISO 9001: 94 tabelas e 49 telas no lugar de um legado em VBA/Access, migrado sem parar a operação.',
    subtitle: 'ERP completo para indústria química certificada ISO 9001',
    problem: 'A PERSHY Chemical operava com sistema legado em VBA/Access criado há mais de uma década. O sistema não suportava o volume atual de operações, dificultava auditoria ISO 9001 e não tinha integração fiscal moderna.',
    solution: 'Construímos um ERP completo de 94 tabelas e 49 telas, com 60 migrações de schema. Migração gradual com correções cirúrgicas, sem parar a operação. Compatibilidade total com regras de negócio do VBA original (preservadas em Module3 documentado).',
    results: ['ERP em produção atendendo operação industrial completa', 'Auditoria ISO 9001 sem ressalvas', 'Integração fiscal pronta para reforma tributária 2026', 'Redução de 80% no tempo de fechamento mensal'],
    tech: ['Python', 'Supabase', 'PostgreSQL', 'Next.js', 'Docker'],
    related: [
      { href: '/desenvolvimento-de-sistemas', label: 'Desenvolvimento de sistemas sob medida' },
      { href: '/insights/reforma-tributaria-2026', label: 'Reforma tributária 2026: o que muda no sistema da sua empresa' },
      { href: '/cases/prossiga', label: 'Case Prossiga: migração de Visual FoxPro sem parar a receita' },
    ],
  },
  'prossiga': {
    segment: 'ESTACIONAMENTO',
    title: 'Prossiga',
    metaTitle: 'Case Prossiga: migração de Visual FoxPro',
    metaDescription:
      'Case Prossiga: sistema de estacionamento migrado de Visual FoxPro/DBF para Supabase, com validação por checksum e sem interromper a receita.',
    subtitle: 'Migração de Visual FoxPro/DBF para Supabase sem parar receita',
    problem: 'Sistema crítico de gestão de estacionamento rodando em Visual FoxPro há 20 anos. Plataforma descontinuada, sem suporte e impossibilitando integrações modernas. Qualquer parada de mais de 1 hora gerava perda direta de receita.',
    solution: 'Engenharia reversa do schema DBF, criação de diagrama ER moderno, DBML completo, e DDL para Supabase. Migração de dados validada por checksum. Operação dual durante 30 dias antes do corte definitivo.',
    results: ['Zero interrupção de receita durante migração', 'Schema modernizado e versionado', 'Capacidade para integrações (NFC-e, pagamento digital)', 'Backup automatizado em nuvem'],
    tech: ['Supabase', 'PostgreSQL', 'Python', 'pandas', 'DBML'],
    related: [
      { href: '/desenvolvimento-de-sistemas', label: 'Desenvolvimento de sistemas sob medida e modernização de legado' },
      { href: '/insights/migrar-visual-foxpro-web', label: 'Como migrar Visual FoxPro para web sem parar a operação' },
      { href: '/cases/syspershy', label: 'Case SYSPERSHY: ERP no lugar de legado VBA/Access' },
    ],
  },
  'nf-saas': {
    segment: 'PLATAFORMA FISCAL',
    title: 'NF SaaS',
    metaTitle: 'Case NF SaaS: plataforma de notas fiscais',
    metaDescription:
      'Plataforma multi-tenant de notas fiscais eletrônicas em Laravel 11: NF-e e NFC-e com integração SEFAZ e arquitetura preparada para IBS/CBS.',
    subtitle: 'Plataforma multi-tenant de notas fiscais eletrônicas',
    problem: 'Pequenos e médios negócios precisando emitir NF-e e NFC-e sem pagar mensalidade pesada de fornecedores tradicionais. Reforma tributária 2026 exigindo arquitetura nova.',
    solution: 'Plataforma Laravel 11 multi-tenant com segurança em três camadas (Traefik → Nginx → Laravel), integração SEFAZ via certificado A1, suporte a NF-e modelo 55 e NFC-e modelo 65. Arquitetura preparada para IBS/CBS desde o dia 1.',
    results: ['NF-e e NFC-e em homologação SEFAZ', 'Multi-tenant com isolamento garantido', 'Pronto para reforma tributária 2026', 'Fase 2: NFS-e nacional em roadmap'],
    tech: ['Laravel 11', 'Supabase (Session Pooler)', 'Traefik', 'Nginx', 'PostgreSQL'],
    related: [
      { href: '/desenvolvimento-de-sistemas', label: 'Desenvolvimento de sistemas sob medida com integração SEFAZ' },
      { href: '/insights/reforma-tributaria-2026', label: 'Reforma tributária 2026: o que muda no sistema da sua empresa' },
    ],
  },
  'ufrj': {
    segment: 'ÓRGÃO PÚBLICO',
    title: 'UFRJ',
    metaTitle: 'Case UFRJ: gestão de infraestrutura de TI',
    metaDescription:
      'Gestão de infraestrutura de TI para empresa sediada em órgão vinculado à UFRJ: rede padronizada, servidores, backup testado e monitoramento.',
    subtitle: 'Gestão de infraestrutura de TI para empresa sediada em órgão vinculado à UFRJ',
    problem: 'Empresa sediada em órgão da UFRJ com infraestrutura de TI defasada, sem padronização de rede, backup inconsistente e suporte reativo.',
    solution: 'Padronização de rede Windows, instalação de servidores dedicados, política de backup com retenção mensal/anual, monitoramento proativo e contratos de SLA com atendimento presencial.',
    results: ['Uptime acima de 99,5% mensal', 'Backup verificado por testes de restore', 'Atendimento presencial em campus UFRJ', 'Documentação técnica completa do ambiente'],
    tech: ['Windows Server', 'Active Directory', 'Veeam Backup', 'Cisco', 'pfSense'],
    related: [
      { href: '/infraestrutura-de-ti', label: 'Gestão de infraestrutura de TI: servidores, redes e backup' },
      { href: '/abordagem#infraestrutura', label: 'Como trabalhamos em infraestrutura e redes' },
    ],
  },
}

export function getCase(slug: string): CaseStudy | undefined {
  return Object.prototype.hasOwnProperty.call(CASES, slug) ? CASES[slug] : undefined
}
