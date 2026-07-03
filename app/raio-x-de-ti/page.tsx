import type { Metadata } from 'next'
import { Logo } from '@/components/Logo'
import { buildWhatsAppUrl, COMPANY, SITE } from '@/lib/constants'

const PAGE_URL = `${SITE.url}/raio-x-de-ti`

/**
 * PREÇO DA OFERTA — constante única, fácil de ajustar.
 * Faixa aprovada com o Walter em 03/07/2026: R$ 297–497.
 * Começamos no piso da faixa para a primeira campanha; subir depois
 * de validar conversão é uma linha de código.
 */
const PRECO_RAIOX = 297
const VAGAS_MES = 4

const WHATSAPP_TEXT =
  'Olá! Quero agendar o Raio-X de TI do meu escritório contábil.'

export const metadata: Metadata = {
  title: 'Raio-X de Infraestrutura e Riscos de TI para Contabilidades',
  description:
    'Análise técnica da infraestrutura do seu escritório contábil: backup, certificado digital, servidor e acessos. Relatório com matriz de risco + reunião com especialista. Valor abatido se contratar plano mensal.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Raio-X de TI para Contabilidades · Icardcase',
    description:
      'Descubra hoje os riscos que podem custar o prazo do SPED amanhã. Relatório técnico com matriz de risco, direto ao sócio.',
    url: PAGE_URL,
    type: 'website',
  },
}

const dores = [
  {
    titulo: 'Seu backup roda todo dia. Alguém já testou restaurar?',
    texto:
      'Backup que nunca passou por um teste de restore não é backup — é esperança. Escritório contábil que perde a base do sistema fiscal a dias do prazo do SPED não perde só dados: perde clientes que não perdoam multa.',
  },
  {
    titulo: 'Certificado digital e sistema fiscal num computador só.',
    texto:
      'A1 instalado numa máquina sem redundância, sistema contábil num servidor que ninguém monitora, senha do e-CAC anotada onde não devia. Um HD que falha na semana do e-Social e a operação inteira para.',
  },
  {
    titulo: 'A Receita não pergunta se o seu sistema caiu.',
    texto:
      'SPED, e-Social, DCTFWeb, folha — prazo é prazo. Cada hora de sistema fora do ar em semana de fechamento é retrabalho da equipe, cliente ligando e risco de multa que sai do seu bolso ou da sua reputação.',
  },
]

const entregaveis = [
  {
    titulo: 'Relatório com matriz de risco',
    texto:
      'Documento objetivo com classificação vermelho / amarelo / verde: backup testado, firewall, licenciamento 365, certificado digital, pontos únicos de falha e exposição LGPD. Feito para o sócio ler — não para técnico arquivar.',
  },
  {
    titulo: 'Análise técnica da infraestrutura',
    texto:
      'Servidores, estações, rede, acessos, rotina de backup e o caminho do dado fiscal dentro do escritório. Sem interromper a operação da equipe.',
  },
  {
    titulo: 'Reunião de 30 minutos com quem analisou',
    texto:
      'Quem apresenta o relatório é quem fez a análise — não um vendedor. Você sai da reunião sabendo exatamente o que é urgente, o que pode esperar e quanto custa resolver.',
  },
]

const faq = [
  {
    q: 'Isso é uma visita de vendas disfarçada?',
    a: `Não. É um serviço técnico pago (R$ ${PRECO_RAIOX}) com entregável concreto: o relatório de riscos é seu, independente de contratar qualquer coisa depois. A mecânica é transparente: se você optar por um plano mensal de gestão em até 7 dias, o valor pago é abatido integralmente da primeira mensalidade. Se não optar, ficou com o diagnóstico mais barato que um escritório pode comprar.`,
  },
  {
    q: 'Preciso parar o escritório durante a análise?',
    a: 'Não. A análise é feita sem interromper a operação — boa parte remotamente, e a parte presencial (região de Niterói e Rio de Janeiro) é agendada para não atrapalhar a equipe.',
  },
  {
    q: 'Por que focado em contabilidades?',
    a: 'Porque o risco de TI de um escritório contábil é específico: certificado digital, sistema fiscal, prazos SPED/e-Social e LGPD sobre dados financeiros de terceiros. Atendemos escritórios contábeis em produção há anos e construímos sistemas com integração SEFAZ — conhecemos o dado fiscal por dentro, não só o cabo de rede.',
  },
  {
    q: 'O que acontece depois da reunião do relatório?',
    a: 'Você decide. Quem quiser resolver os pontos vermelhos com a gente recebe proposta com dois planos de gestão mensal — essencial e completo — na própria reunião. Quem preferir resolver internamente ou com outro fornecedor fica com o relatório como mapa. Sem follow-up insistente.',
  },
  {
    q: `Por que só ${VAGAS_MES} Raio-X por mês?`,
    a: 'Porque quem executa a análise e apresenta o relatório é o mesmo profissional que atende os contratos ativos — e qualidade de análise não escala com pressa. Agenda real, não gatilho de marketing.',
  },
]

export default function RaioXPage() {
  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_TEXT)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Diagnóstico de infraestrutura e riscos de TI para escritórios contábeis',
    name: 'Raio-X de Infraestrutura e Riscos de TI',
    provider: {
      '@type': 'Organization',
      name: 'Icardcase',
      url: SITE.url,
      telephone: '+55-21-98878-5170',
    },
    areaServed: { '@type': 'City', name: 'Niterói' },
    offers: {
      '@type': 'Offer',
      price: String(PRECO_RAIOX),
      priceCurrency: 'BRL',
    },
    description:
      'Análise técnica de backup, certificado digital, servidores, rede e acessos, com relatório de matriz de risco e reunião de apresentação.',
    url: PAGE_URL,
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Topo mínimo: só logo, sem navegação — landing isolada */}
      <header className="border-b border-hairline bg-canvas">
        <div className="container-content flex items-center justify-between py-5">
          <Logo variant="dark" />
          <span className="hidden sm:block font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-subtle">
            TI para contabilidades · Niterói e RJ
          </span>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-canvas pt-20 pb-24 sm:pt-28">
        <div className="aurora" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
        <div className="container-content relative z-10">
          <span className="eyebrow">
            Raio-X de Infraestrutura e Riscos · Escritórios contábeis
          </span>
          <h1 className="mt-8 max-w-[22ch] text-display-xl text-ink">
            Seu escritório roda em cima de um risco que ninguém mediu.
          </h1>
          <p className="mt-8 max-w-[56ch] text-lg leading-[1.5] text-ink-subtle sm:text-xl">
            Analisamos backup, certificado digital, servidor, rede e acessos do
            seu escritório contábil — e entregamos um relatório com matriz de
            risco que você apresenta aos sócios. Antes que o prazo do SPED
            descubra o problema por você.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Agendar meu Raio-X de TI
            </a>
            <a href="#como-funciona" className="btn-secondary">
              Ver o que está incluído
            </a>
          </div>
          <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-subtle">
            {VAGAS_MES} análises por mês · agenda real · resposta em até 4h úteis
          </p>
        </div>
      </section>

      {/* DORES */}
      <section className="border-t border-hairline bg-surface-1/40 py-20 sm:py-28">
        <div className="container-content">
          <h2 className="max-w-[24ch] text-display-md text-ink">
            Três perguntas que todo sócio deveria saber responder.
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {dores.map((d, i) => (
              <div key={d.titulo} className="card-glow rounded-lg border border-hairline bg-canvas p-8">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-hover">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-ink">{d.titulo}</h3>
                <p className="mt-4 leading-relaxed text-ink-subtle">{d.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTREGÁVEL */}
      <section id="como-funciona" className="py-20 sm:py-28">
        <div className="container-content">
          <span className="eyebrow">O que você recebe</span>
          <h2 className="mt-6 max-w-[26ch] text-display-md text-ink">
            Não é uma visita técnica. É um documento que fica com você.
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {entregaveis.map((e) => (
              <div key={e.titulo}>
                <h3 className="text-xl font-semibold text-ink">{e.titulo}</h3>
                <p className="mt-4 leading-relaxed text-ink-subtle">{e.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇO + MECÂNICA */}
      <section className="border-y border-hairline bg-surface-1/40 py-20 sm:py-28">
        <div className="container-content grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Investimento</span>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-display-xl text-ink">R$ {PRECO_RAIOX}</span>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-subtle">
                valor único
              </span>
            </div>
            <p className="mt-6 max-w-[48ch] leading-relaxed text-ink-subtle">
              Se em até 7 dias após a reunião do relatório você optar por um
              plano mensal de gestão de TI, o valor do Raio-X é{' '}
              <strong className="text-ink">abatido integralmente da primeira mensalidade</strong>.
              Na prática, o diagnóstico sai de graça para quem decide resolver.
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-canvas p-8">
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
              Como acontece
            </h3>
            <ol className="mt-6 space-y-4 text-ink-subtle">
              <li className="flex gap-4">
                <span className="font-mono text-accent-hover">01</span>
                Você chama no WhatsApp e agendamos a análise para a mesma semana.
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-accent-hover">02</span>
                Análise técnica sem parar a operação do escritório.
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-accent-hover">03</span>
                Reunião de 30 min: relatório com matriz de risco, na mão do sócio.
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-accent-hover">04</span>
                Decisão sua: resolver com a gente (valor abatido) ou seguir com o mapa.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* QUEM ANALISA */}
      <section className="py-20 sm:py-28">
        <div className="container-content max-w-3xl">
          <span className="eyebrow">Quem faz a análise</span>
          <h2 className="mt-6 text-display-md text-ink">
            14 anos de TI. Nenhum estagiário no seu servidor.
          </h2>
          <p className="mt-6 leading-relaxed text-ink-subtle">
            Sou Jadir Luiz de Oliveira Junior, fundador da Icardcase. Atendo
            escritórios contábeis e empresas financeiras desde 2011, com
            sistemas de integração fiscal (NF-e, SEFAZ) em produção. Antes
            disso, 15 anos em infraestrutura crítica — ferrovia, mineração,
            projetos da Vale. Quem analisa a sua infraestrutura e apresenta o
            relatório sou eu. Sem terceirização, sem call center.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-hairline bg-surface-1/40 py-20 sm:py-28">
        <div className="container-content max-w-3xl">
          <h2 className="text-display-md text-ink">Perguntas diretas, respostas diretas.</h2>
          <div className="mt-12 space-y-10">
            {faq.map((i) => (
              <div key={i.q}>
                <h3 className="text-lg font-semibold text-ink">{i.q}</h3>
                <p className="mt-3 leading-relaxed text-ink-subtle">{i.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 sm:py-28">
        <div className="container-content text-center">
          <h2 className="mx-auto max-w-[24ch] text-display-md text-ink">
            {VAGAS_MES} análises por mês. As deste mês começam por ordem de agendamento.
          </h2>
          <div className="mt-10 flex justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Agendar meu Raio-X de TI
            </a>
          </div>
          <p className="mt-6 text-sm text-ink-subtle">
            Resposta em até 4 horas úteis, direto com quem analisa.
          </p>
        </div>
      </section>

      {/* Rodapé mínimo — obrigatório para confiança e política do Google Ads */}
      <footer className="border-t border-hairline py-10">
        <div className="container-content flex flex-col gap-2 text-center text-sm text-ink-subtle sm:flex-row sm:justify-between sm:text-left">
          <p>
            {COMPANY.legalName} · CNPJ {COMPANY.cnpj}
            <br />
            {COMPANY.address.street}, {COMPANY.address.neighborhood},{' '}
            {COMPANY.address.city}/{COMPANY.address.state}
          </p>
          <p>
            <a href="/politica-privacidade" className="link-underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
