import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade da Icardcase, em conformidade com a LGPD (Lei 13.709/2018).',
  alternates: { canonical: '/politica-privacidade' },
}

export default function PoliticaPrivacidadePage() {
  const updatedAt = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium tracking-wide-2 uppercase text-accent mb-3">Documento legal</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink leading-tight mb-3">Política de Privacidade</h1>
        <p className="text-muted mb-12">Última atualização: {updatedAt}</p>

        <div className="prose-icardcase">
          <p>
            Esta Política de Privacidade descreve como a <strong>Icardcase</strong> (nome fantasia de
            <strong> J Oliver Serviços de Informática TI Ltda</strong>, CNPJ 13.437.391/0001-58,
            com sede na Rua Bahia, 43, Badu, Niterói/RJ) coleta, usa, armazena e protege seus dados
            pessoais, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>.
          </p>

          <h2>1. Dados que coletamos</h2>
          <p>Quando você preenche nosso formulário de contato ou interage com este site, podemos coletar:</p>
          <ul>
            <li><strong>Dados de identificação:</strong> nome completo, e-mail, telefone/WhatsApp, empresa</li>
            <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas</li>
            <li><strong>Origem do contato:</strong> UTMs de campanhas, página de origem (referrer)</li>
            <li><strong>Conteúdo da mensagem:</strong> textos enviados livremente por você no formulário</li>
          </ul>

          <h2>2. Para que usamos seus dados</h2>
          <ul>
            <li>Responder ao seu contato e atender solicitações comerciais</li>
            <li>Enviar propostas, orçamentos e materiais técnicos relacionados</li>
            <li>Cumprir obrigações legais e contratuais</li>
            <li>Melhorar nosso site e nossa comunicação (analytics agregado)</li>
            <li>Prevenir fraudes e abusos (rate limiting, audit log)</li>
          </ul>
          <p><strong>Não vendemos seus dados. Não compartilhamos com terceiros para fins de marketing.</strong></p>

          <h2>3. Base legal (LGPD)</h2>
          <p>O tratamento dos seus dados se baseia em:</p>
          <ul>
            <li><strong>Consentimento:</strong> ao marcar a caixa de aceite no formulário</li>
            <li><strong>Execução de contrato:</strong> quando você se torna cliente</li>
            <li><strong>Legítimo interesse:</strong> para melhorias do site e prevenção de fraudes</li>
            <li><strong>Obrigação legal:</strong> manutenção de registros fiscais e contratuais</li>
          </ul>

          <h2>4. Por quanto tempo guardamos seus dados</h2>
          <ul>
            <li><strong>Leads que não viram clientes:</strong> até 24 meses</li>
            <li><strong>Clientes ativos:</strong> durante o relacionamento + 5 anos (obrigação fiscal)</li>
            <li><strong>Logs de navegação:</strong> até 6 meses</li>
            <li><strong>Audit log de mudanças:</strong> até 12 meses</li>
          </ul>

          <h2>5. Como protegemos seus dados</h2>
          <ul>
            <li>Criptografia em trânsito (HTTPS/TLS 1.3) e em repouso</li>
            <li>Cabeçalhos de segurança HTTP (CSP, HSTS, X-Frame-Options)</li>
            <li>Rate limiting contra abuso (Upstash Redis)</li>
            <li>Validação e sanitização de inputs (Zod + DOMPurify)</li>
            <li>Row-Level Security no banco de dados (Supabase Postgres)</li>
            <li>Audit log de todas as mudanças em dados pessoais</li>
            <li>Acesso restrito por princípio do menor privilégio</li>
          </ul>

          <h2>6. Seus direitos como titular</h2>
          <p>Pela LGPD, você pode a qualquer momento solicitar:</p>
          <ul>
            <li>Confirmação de que tratamos seus dados</li>
            <li>Acesso aos dados que temos sobre você</li>
            <li>Correção de dados incompletos ou desatualizados</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
            <li>Portabilidade dos dados a outro fornecedor</li>
            <li>Revogação do consentimento</li>
            <li>Informações sobre uso compartilhado dos dados</li>
          </ul>
          <p>
            Para exercer qualquer desses direitos, envie e-mail para{' '}
            <a href="mailto:contatos@icardcase.com.br">contatos@icardcase.com.br</a> com o assunto
            <strong> &ldquo;LGPD — exercício de direitos&rdquo;</strong>. Respondemos em até 15 dias.
          </p>

          <h2>7. Cookies</h2>
          <p>
            Usamos cookies estritamente necessários para o funcionamento do site e cookies de
            análise (Google Analytics, com IP anonimizado). Você pode desabilitar cookies nas
            configurações do seu navegador, mas algumas funcionalidades podem ser afetadas.
          </p>

          <h2>8. Encarregado de Dados (DPO)</h2>
          <p>
            <strong>Jadir Luiz de Oliveira Junior</strong><br />
            E-mail: <a href="mailto:contatos@icardcase.com.br">contatos@icardcase.com.br</a><br />
            Endereço: Rua Bahia, 43 — Badu, Niterói/RJ
          </p>

          <h2>9. Atualizações desta política</h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças legais ou operacionais.
            Sempre que houver alteração relevante, comunicaremos por e-mail aos titulares
            cadastrados. A versão vigente é sempre a publicada nesta página.
          </p>

          <h2>10. Reclamações à ANPD</h2>
          <p>
            Se você entender que seus direitos não foram atendidos, pode apresentar reclamação à
            <strong> Autoridade Nacional de Proteção de Dados (ANPD)</strong>{' '}
            em <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">gov.br/anpd</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
