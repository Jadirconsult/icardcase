import { Suspense } from 'react'
import Link from 'next/link'
import { ShadowITChat } from '@/components/ShadowITChat'

/**
 * Entra logo depois de DataUnification, de propósito.
 *
 * Aquela seção constrói a ansiedade mais concreta do site (multa da ANPD,
 * auditoria sem log, decisão tomada com número errado) e terminava num botão
 * para /seguranca-lgpd — ou seja, abria a ferida e entregava leitura. Aqui ela
 * passa a desaguar num diagnóstico que o visitante faz na hora, sem formulário
 * e sem falar com vendedor.
 */
export function DiagnosticoSection() {
  return (
    <section id="diagnostico" className="section-y scroll-mt-20 border-t border-hairline">
      <div className="container-content">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="section-kicker">DIAGNÓSTICO</p>

            <h2 className="mt-3 text-display-md text-ink">
              Descubra o tamanho da sua exposição em um minuto.
            </h2>

            <p className="mt-6 text-body-lg leading-[1.55] text-ink-muted">
              Planilha no drive pessoal, processo controlado por WhatsApp, formulário de cliente
              em ferramenta gratuita. Isso tem nome —{' '}
              <Link href="/shadow-it" className="text-accent-text underline underline-offset-4 hover:text-ink">
                Shadow IT
              </Link>{' '}
              — e é o que transforma dado da sua empresa em dado fora do seu controle.
            </p>

            <p className="mt-5 text-ink-subtle">
              Responda três perguntas e o diagnóstico sai na hora, calculado a partir do que você
              descrever. Sem cadastro para começar: você só deixa contato se quiser o mapeamento
              completo.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-ink-subtle">
              {[
                'Nenhum campo obrigatório antes do resultado',
                'Quem lê e responde é o engenheiro, não um vendedor',
                'Resposta em até 4 horas úteis',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-[0.45rem] h-1 w-4 flex-none border-t border-accent-text"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <Suspense
              fallback={<div className="surface-card h-[34rem] rounded-xl" aria-hidden="true" />}
            >
              <ShadowITChat />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
