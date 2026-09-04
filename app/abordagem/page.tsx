import type { Metadata } from 'next'
import Link from 'next/link'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Como trabalhamos',
  description: 'A metodologia da Icardcase para desenvolvimento de sistemas, gestão de infraestrutura e suporte técnico. Engenharia, não suporte.',
  alternates: { canonical: '/abordagem' },
}

export default function AbordagemPage() {
  return (
    <>
      <section className="section-y pb-0">
        <div className="container-content max-w-prose-wide">
          <p className="section-kicker">COMO TRABALHAMOS</p>
          <h1 className="mt-2 text-display-lg text-ink">
            Engenharia, não suporte.
          </h1>
          <p className="mt-6 text-body-lg leading-[1.55] text-ink-muted">
            Cada uma das nossas cinco frentes segue um método. Aqui você entende como.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-content max-w-prose-wide">
          <div className="prose-icardcase">
            <h2 id="desenvolvimento">Desenvolvimento de sistemas</h2>
            <p>
              Cada projeto começa com diagnóstico técnico documentado. A escolha da stack vem do problema,
              não da moda. Código revisado por humano antes de cada deploy, testes automatizados,
              ambientes separados (dev/staging/prod) e versionamento Git desde o primeiro commit.
            </p>
            <p>
              <strong>Stack padrão:</strong> Python/FastAPI, Next.js, Supabase, Laravel (quando o cliente já usa PHP),
              Docker + Traefik. Quando faz sentido, mobile com React Native/Expo.
            </p>

            <h2 id="infraestrutura">Infraestrutura e redes</h2>
            <p>
              Documentação técnica completa antes de qualquer alteração. Política de backup com restore
              testado mensalmente (backup que não foi restaurado não existe). Monitoramento contínuo
              com alertas via WhatsApp. Padronização de redes Windows/Linux e segregação por VLAN.
            </p>

            <h2 id="suporte">Suporte técnico</h2>
            <p>
              SLA escrito em contrato (não em e-mail). Sem chamado aberto sem solução documentada.
              Portal próprio com histórico de atendimentos. Atendimento presencial dentro do nosso
              raio geográfico (Niterói, RJ capital, São Gonçalo, Maricá e Baixada Fluminense).
            </p>

            <h2 id="seguranca">Segurança e backup</h2>
            <p>
              LGPD aplicada do código ao processo. Headers de segurança em todos os sistemas web.
              Criptografia em trânsito (TLS 1.3) e em repouso. Audit log de mudanças sensíveis.
              Backups com retenção mensal e anual, testados por restore automático.
            </p>

            <h2 id="consultoria">Consultoria em TI</h2>
            <p>
              Avaliação técnica de sistemas existentes com relatório formal por escrito.
              Recomendações priorizadas por impacto e custo. <strong>Sem viés de fornecedor</strong> —
              escolhemos a tecnologia que serve ao seu negócio, mesmo que isso signifique recomendar
              produtos que a gente não revende.
            </p>
          </div>

          <div className="surface-card mt-12 flex flex-col gap-4 p-7 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-medium text-ink">Tem um projeto em mente?</p>
              <p className="mt-1 text-sm text-ink-subtle">Conversamos sobre como aplicar essa abordagem.</p>
            </div>
            <WhatsAppButton origem="abordagem_cta" variant="primary">
              Falar conosco
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  )
}
