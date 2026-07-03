import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Página não encontrada',
  description: 'A página que você procura não existe ou mudou de endereço.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-canvas">
      <div className="aurora" aria-hidden="true" />
      <div className="container-content relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <Image
          src="/icardinho.png"
          alt="Icardinho, o mascote da Icardcase, segurando um celular"
          width={220}
          height={203}
          priority
          className="mb-8 drop-shadow-[0_12px_32px_rgba(37,99,235,0.25)]"
        />
        <p className="section-kicker">Erro 404 · Página não encontrada</p>
        <h1 className="mt-4 max-w-[24ch] text-display-lg text-ink">
          O Icardinho procurou em todos os nós da rede.
          <span className="block text-ink-muted">Essa página não está aqui.</span>
        </h1>
        <p className="mt-6 max-w-[48ch] leading-relaxed text-ink-subtle">
          O endereço pode ter mudado ou nunca existiu. Nada se perdeu do seu
          lado — os caminhos abaixo levam de volta.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Voltar para a página inicial
          </Link>
          <Link href="/contato" className="btn-secondary">
            Falar com a gente
          </Link>
        </div>
      </div>
    </section>
  )
}
