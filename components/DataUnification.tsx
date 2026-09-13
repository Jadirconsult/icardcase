import { Reveal } from '@/components/Reveal'

const risks = [
  {
    title: 'Superfície de ataque LGPD',
    desc: 'Dados de cliente em Drive/pastas compartilhadas + planilhas com links abertos = incidente esperando pra acontecer. ANPD já multou empresas por menos.',
  },
  {
    title: 'Divergência entre versões',
    desc: 'Múltiplas cópias do mesmo dado em lugares diferentes. Decisão executiva é tomada com valor errado. Retrabalho vira custo mensal invisível.',
  },
  {
    title: 'Auditoria sem log',
    desc: 'Sem registro de quem acessou o quê e quando. Impossível responder a ANPD, sócio ou cliente que pediu prova de tratamento adequado.',
  },
]

export function DataUnification() {
  return (
    <section className="relative overflow-hidden bg-canvas section-y border-t border-hairline">
      <div className="bg-mesh absolute inset-0 pointer-events-none opacity-50" aria-hidden="true" />

      <div className="container-content relative">
        <Reveal className="max-w-3xl mb-16 lg:mb-20">
          <p className="section-kicker">Superfície oculta de risco</p>
          <h2
            aria-label="Dados fragmentados não são só desorganização. São exposição."
            className="mt-5 text-display-lg text-ink"
          >
            Dados fragmentados
            <span className="block text-ink-muted">não são desorganização.</span>
            <span className="block">São exposição.</span>
          </h2>
          <p className="mt-8 text-lg leading-[1.55] text-ink-muted max-w-[58ch]">
            Planilhas em Drive, pastas com nomes parecidos, links de compartilhamento
            esquecidos, PDFs baixados fora do sistema. Cada arquivo espalhado é ponto
            de falha em três dimensões que sua auditoria não perdoa.
          </p>
        </Reveal>

        <ul className="grid grid-cols-1 gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-3 mb-16">
          {risks.map((r, i) => (
            <Reveal key={r.title} as="li" variant="rise" delay={200 + i * 120} className="bg-canvas">
              <div className="group relative card-glow h-full bg-canvas p-7 transition-colors duration-500 hover:bg-surface-1">
                {/* linha de destaque no topo, revela no hover (mesmo motif dos cards de Serviços) */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <h3 className="text-card-title text-ink leading-snug mb-3 transition-colors duration-300 group-hover:text-accent-text">
                  {r.title}
                </h3>
                <p className="text-sm leading-[1.55] text-ink-subtle">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={560} className="max-w-[58ch]">
          <p className="text-lg leading-[1.55] text-ink-muted">
            A saída não é &apos;mais treinamento de equipe&apos; nem &apos;nova pasta organizada&apos;. É
            infraestrutura: sistema único com <strong className="text-ink font-medium">RLS no banco</strong>,
            <strong className="text-ink font-medium"> audit log imutável</strong>,
            <strong className="text-ink font-medium"> controle de acesso por papel</strong> e
            <strong className="text-ink font-medium"> criptografia em repouso</strong> — o
            que a LGPD exige e o auditor pede por escrito.
          </p>

          <div className="mt-10">
            <a href="#diagnostico" className="btn-primary group">
              Medir minha exposição agora
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
