import { buildWhatsAppUrl } from '@/lib/constants'

const risks = [
  {
    title: 'Perda',
    desc: 'Um arquivo é apagado ou some, e a informação se perde de vez.',
  },
  {
    title: 'Exposição',
    desc: 'Dados pessoais e financeiros ficam acessíveis a qualquer um, sem proteção, e podem vazar.',
  },
  {
    title: 'Confusão',
    desc: 'Versões diferentes do mesmo documento geram erro, retrabalho e decisões tomadas com a informação errada.',
  },
]

export function DataUnification() {
  return (
    <section className="relative overflow-hidden bg-canvas section-y border-t border-hairline">
      <div className="bg-mesh absolute inset-0 pointer-events-none opacity-50" aria-hidden="true" />

      <div className="container-content relative">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <p className="section-kicker">O problema invisível</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Seus dados não podem
            <span className="block text-ink-muted">viver espalhados.</span>
          </h2>
          <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[58ch]">
            Talvez hoje você controle tudo no Google Drive: dezenas de planilhas,
            pastas com nomes parecidos, PDFs baixados e documentos que alguém
            compartilhou e você nem lembra mais com quem. Funciona — até o dia em
            que alguém edita a planilha errada, um link fica aberto para qualquer
            pessoa, ou você perde uma tarde inteira procurando um dado de um cliente.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-3 mb-14">
          {risks.map((r) => (
            <li key={r.title} className="bg-canvas p-7">
              <h3 className="text-card-title text-ink leading-snug mb-3">{r.title}</h3>
              <p className="text-sm leading-[1.55] text-ink-subtle">{r.desc}</p>
            </li>
          ))}
        </ul>

        <p className="text-lg leading-[1.55] text-ink-subtle max-w-[58ch]">
          Se você lida com dados de clientes — nome, CPF, valores, contratos — a
          LGPD exige que você saiba onde esses dados estão, quem acessa e como são
          protegidos. Com tudo espalhado em planilhas, isso é quase impossível. Com
          um sistema único, você passa a ter controle de acesso, registro de quem
          viu o quê e dados rastreáveis: muito mais perto de estar em conformidade,
          sem precisar virar especialista no assunto.
        </p>

        <blockquote className="mt-12 max-w-[52ch] text-display-md text-ink">
          Eu reúno tudo em um único sistema, organizado e protegido — onde cada
          informação do cliente fica no lugar certo, conversa entre si e só é vista
          por quem deve ver.
        </blockquote>

        <div className="mt-10">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Conversar sobre seu projeto
          </a>
        </div>
      </div>
    </section>
  )
}
