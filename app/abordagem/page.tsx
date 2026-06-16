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
    <div className="bg-white">
      <section className="bg-ink text-white py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-wide-2 uppercase text-accent mb-3">Como trabalhamos</p>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-4 max-w-3xl">
            Engenharia, não suporte.
          </h1>
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
            Cada uma das nossas cinco frentes segue um método. Aqui você entende como.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

          <div className="mt-12 p-6 bg-surface-alt rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-medium text-ink mb-1">Tem um projeto em mente?</p>
              <p className="text-sm text-muted">Conversamos sobre como aplicar essa abordagem.</p>
            </div>
            <WhatsAppButton origem="abordagem_cta" variant="primary">
              Falar conosco
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </div>
  )
}
