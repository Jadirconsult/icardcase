import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { SITE } from '@/lib/constants'

// Posts hardcoded por enquanto - quando voce quiser MDX, a gente migra.
const POSTS: Record<string, { title: string; date: string; readTime: string; category: string; description: string; content: string }> = {
  'reforma-tributaria-2026': {
    title: 'Reforma tributária 2026: o que muda no sistema do seu escritório contábil',
    date: '2026-05-23',
    readTime: '8 min de leitura',
    category: 'Reforma tributária',
    description: 'A transição IBS/CBS começa em 2026. O que precisa estar pronto no seu sistema, em ordem de prioridade.',
    content: `
## O cronograma que importa (não o do marketing)

A reforma tributária aprovada pela EC 132/2023 começa de fato em janeiro de 2026, com um período de teste com alíquota reduzida (0,9% CBS e 0,1% IBS). Não é só uma "atualização de imposto" — é uma reconstrução do sistema de cálculo, da emissão de nota e do reporting fiscal.

Em 2027, a CBS substitui PIS e COFINS para a maioria das empresas (Simples Nacional tem prazo estendido até 2027). Em 2029, IBS começa a substituir ICMS e ISS de forma gradual.

## Os 4 campos novos que toda nota fiscal precisa ter

A partir de 2026, as notas precisam comportar:

1. **CST/CSOSN dos novos tributos** — novos códigos de situação tributária
2. **Base de cálculo IBS** e **alíquota IBS** (por município)
3. **Base de cálculo CBS** e **alíquota CBS** (federal)
4. **Valor do imposto seletivo** quando aplicável (cigarro, bebida açucarada, etc.)

Se o sistema do seu cliente não tem espaço pra isso, **vai parar de emitir nota em janeiro**.

## Simples Nacional: você tem até 2027, mas...

Empresas do Simples têm transição até 2027 — mas só faz sentido continuar no Simples se ele continuar vantajoso. Em muitos casos, com IBS/CBS, o Simples perde atratividade frente ao regime regular. **Cada cliente precisa ser recalculado.**

## Integração SEFAZ — o que vai quebrar

Os webservices das SEFAZ estaduais e a NFe 4.0 vão receber novos schemas XML. Todo sistema que faz integração direta precisa atualizar parser, validação e geração. Quem usa middleware (TecnoSpeed, Sieg, etc.) depende do fornecedor atualizar — verifique antes.

## Checklist técnico (12 itens)

1. ✅ Schema do banco preparado para novos campos
2. ✅ Tabela de alíquotas IBS por município (5.570 municípios)
3. ✅ Tabela de NCM com classificação seletiva
4. ✅ Cálculo paralelo (ICMS+PIS+COFINS vs IBS+CBS) durante transição
5. ✅ Geração de XML NFe 4.0 com novos grupos
6. ✅ Validação SEFAZ atualizada
7. ✅ Dashboard fiscal mostrando impacto do novo regime
8. ✅ Relatório de simulação por cliente
9. ✅ Importação massiva de cadastros (mudança de regime)
10. ✅ Logs auditáveis para fiscalização
11. ✅ Backup e versionamento do sistema antigo (5 anos)
12. ✅ Treinamento da equipe contábil

## Próximos passos

Se você é sócio de escritório contábil, agende uma conversa de 30 minutos pra avaliarmos onde seu sistema está. Não é venda — é diagnóstico técnico honesto.
`,
  },
  'dctfweb-automacao': {
    title: 'DCTFWeb sem erro: automação real para escritórios contábeis',
    date: '2026-05-23',
    readTime: '6 min de leitura',
    category: 'Automação fiscal',
    description: 'Por que a maioria das automações DCTFWeb feitas hoje são frágeis, e como construir algo que não falha em fim de mês.',
    content: `
## A DCTFWeb veio para ficar

Substituindo gradualmente a DCTF antiga, a DCTFWeb consolida débitos previdenciários e de retenções IR. Para escritórios contábeis, isso significa: novos prazos, novo formato e — principalmente — nova superfície de erro.

## Por que a maioria das automações falha

A automação típica que vemos por aí faz três coisas erradas:

1. **Scraping frágil** — depende de XPath específico que quebra a cada atualização
2. **Sem retry** — se a conexão cair no meio, perde o processamento
3. **Sem audit log** — quando dá problema, ninguém sabe o que aconteceu

## A abordagem correta

Automação fiscal de produção precisa de:

- **API oficial ou e-CAC integrado**, não scraping de tela
- **Fila de jobs** com retry exponencial
- **Audit log imutável** por contribuinte
- **Notificação proativa** quando algo trava
- **Modo dry-run** pra testar antes de enviar

## Resultado

Escritórios que rodam nessa arquitetura processam DCTFWeb de centenas de clientes em horas, com zero retrabalho manual.

Se você quer entender como aplicar isso no seu escritório, vamos conversar.
`,
  },
  'lgpd-escritorio-contabil': {
    title: 'LGPD no escritório contábil: checklist de 23 itens auditados',
    date: '2026-05-23',
    readTime: '10 min de leitura',
    category: 'LGPD',
    description: 'Escritórios contábeis tratam dados sensíveis em volume industrial. Aqui está o checklist que aplicamos em auditorias reais.',
    content: `
## Por que escritório contábil é alvo prioritário da ANPD

Escritórios contábeis tratam:

- CPF/CNPJ de milhares de pessoas
- Folha de pagamento (dado sensível por revelar relação trabalhista)
- Movimentação financeira
- Documentos pessoais (RG, CNH, comprovantes)
- Dados de saúde (atestados médicos para folha)

Tudo isso em volume industrial. Por isso, escritórios contábeis estão no radar de qualquer auditoria ANPD.

## O checklist (23 itens)

### Governança (5 itens)
1. DPO nomeado por escrito
2. RIPD documentado por finalidade de tratamento
3. Política de privacidade pública e acessível
4. Termo de consentimento específico para cada finalidade
5. Mapeamento de dados (data mapping)

### Tecnologia (8 itens)
6. Criptografia em trânsito (HTTPS obrigatório)
7. Criptografia em repouso para dados sensíveis
8. Controle de acesso por papel (RBAC)
9. Audit log imutável
10. Backup criptografado com retenção definida
11. Rate limiting em endpoints públicos
12. Segregação de ambientes (dev/staging/prod)
13. Patch management documentado

### Processos (6 itens)
14. Treinamento LGPD anual da equipe
15. Termo de confidencialidade com colaboradores
16. Procedimento de exclusão a pedido (direito do titular)
17. Procedimento de incidente de segurança (72h ANPD)
18. Contrato com fornecedores incluindo cláusulas LGPD
19. Revisão anual da política

### Compliance (4 itens)
20. Registros de atendimento a direitos de titulares
21. Documentação de impacto (DPIA) para operações de risco
22. Avaliação de adequação de transferência internacional
23. Plano de resposta a incidentes testado

## A multa pode ser pesada

Multa por violação LGPD vai até 2% do faturamento, limitado a R$ 50 milhões por infração. Para um escritório médio, pode significar fechar as portas.

Mas o pior não é a multa. É a perda de cliente. Cliente B2B premium não fecha contrato com fornecedor sem certificação de privacidade.

## Como começamos uma auditoria

1. Mapeamento de dados (3 a 5 dias)
2. Gap analysis contra LGPD (1 semana)
3. Plano de adequação priorizado (1 semana)
4. Implementação acompanhada (4 a 8 semanas)
5. Treinamento e governança (contínuo)

Se você quer iniciar essa conversa, vamos marcar.
`,
  },
}

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = POSTS[params.slug]
  if (!post) return { title: 'Não encontrado' }
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export default function PostPage({ params }: PageProps) {
  const post = POSTS[params.slug]
  if (!post) notFound()

  const url = `${SITE.url}/insights/${params.slug}`

  // Schema.org Article — rich snippet no Google (autor, data, headline)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Jadir Luiz de Oliveira Junior',
      jobTitle: 'CEO & Founder',
      worksFor: { '@type': 'Organization', name: 'Icardcase', url: SITE.url },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Icardcase',
      url: SITE.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category,
    inLanguage: 'pt-BR',
  }

  // Schema.org BreadcrumbList — hierarquia navegável pro Google
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE.url}/insights` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="section-y bg-white">
        <div className="container-content max-w-prose-wide">
          <Link href="/insights" className="text-sm font-semibold text-brand-blue hover:underline inline-flex items-center gap-1">
            ← Todos os insights
          </Link>
          <p className="mt-6 section-kicker">{post.category} · {post.readTime}</p>
          <h1 className="mt-2 text-h1 font-semibold text-brand-navy">{post.title}</h1>

          <div className="mt-10 prose-content text-base leading-relaxed text-brand-gray whitespace-pre-line">
            {post.content}
          </div>

          <div className="mt-12 pt-8 border-t border-brand-navy/10 text-sm text-brand-gray">
            Por <strong className="text-brand-navy">Jadir Luiz de Oliveira Junior</strong> · CEO Icardcase
          </div>
        </div>
      </article>
      <FinalCTA />
    </>
  )
}
