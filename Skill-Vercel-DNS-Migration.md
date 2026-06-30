---
name: vercel-dns-migration
description: Migrar o site de um domínio para a Vercel preservando o e-mail e demais serviços que ficam na hospedagem (cPanel ou outro provedor de DNS). Cobre blindar o MX antes de mexer na raiz, ler os valores de DNS exatos no painel da Vercel, adicionar o domínio ao projeto, editar A/CNAME, validar tudo (DNS, redirect, SSL, e-mail) e, opcionalmente, verificar o domínio no Google Search Console e enviar o sitemap. Use SEMPRE que o usuário falar em "apontar domínio pra Vercel", "migrar site pra Vercel", "trocar o A/CNAME pra Vercel", "configurar DNS no cPanel pra Vercel", "domínio dá Invalid Configuration na Vercel", "mudar o site sem derrubar o e-mail", "verificar domínio no Search Console" ou "enviar sitemap" — mesmo que não cite explicitamente "DNS".
---

# Migração de DNS de um domínio para a Vercel (sem derrubar o e-mail)

Este skill guia a troca do site de um domínio para a **Vercel**, mantendo intactos os serviços que continuam na hospedagem original — principalmente **e-mail** (MX/SMTP/IMAP), além de FTP, webmail e subdomínios de painel.

O princípio central: **o DNS continua sendo administrado onde estão os nameservers** (normalmente o cPanel da hospedagem, *não* a Vercel). A Vercel só passa a receber o tráfego do site porque os registros A/CNAME apontam para ela. Por isso, qualquer registro novo (verificação, e-mail, etc.) é criado **no provedor de DNS**, não na Vercel — a menos que o usuário delegue os nameservers para a Vercel (caso mais raro; ver Fase 6).

## Princípios que evitam quebrar coisas

1. **Ordem importa: blinde o e-mail ANTES de mexer na raiz.** Trocar o A da raiz pode quebrar o MX se ele depender da raiz. Resolva isso primeiro.
2. **Nunca assuma os IPs/CNAMEs da Vercel de memória.** A Vercel mudou de faixa de IP e usa alvos de CNAME por-domínio. **Leia os valores exatos no painel do projeto** a cada migração.
3. **Confirme a zona real antes de excluir/editar.** Planos prontos costumam assumir registros que talvez não existam. Sempre liste a zona primeiro.
4. **O domínio precisa estar adicionado ao projeto na Vercel.** Só apontar o DNS não basta — sem o domínio cadastrado, a Vercel mostra "Invalid Configuration".
5. **Cache de DNS local engana.** Depois da troca, o navegador local pode continuar mostrando o site antigo por horas (TTL). Valide pela origem (DNS público) e teste em aba anônima/outra rede.

---

## Fase 0 — Levantamento (sempre faça antes)

Reúna e confirme com o usuário:

- Domínio (ex.: `exemplo.com.br`) e se quer **apex**, **www**, ou ambos servindo o site.
- Onde está o **DNS autoritativo** (veja os nameservers; em cPanel aparecem como "Configured nameservers for this zone").
- Onde está o **e-mail** (geralmente a hospedagem) e o **IP** do servidor de e-mail.
- Acesso ao **painel de DNS** (cPanel → "Editor de Zona de DNS", ou o painel do provedor) e ao **projeto na Vercel**.

**Liste a zona atual** e registre o estado dos registros: A da raiz, MX, CNAME `www`, qualquer `mail`/`webmail`, TXT (SPF/DKIM/DMARC) e subdomínios de serviço. Use isso como linha de base.

---

## Fase 1 — Blindar o e-mail antes da troca

Objetivo: desacoplar o e-mail do registro A da raiz, para que a mudança da raiz para a Vercel não afete o correio.

1. **Garanta um host de e-mail dedicado e fixo.** Verifique se existe `mail.<domínio>` apontando para o IP do servidor de e-mail.
   - Se **não existir**, crie um registro **A**: `mail` → `<IP do servidor de e-mail>`.
   - Se existir como **CNAME para a raiz**, troque por um **A** direto no IP (senão ele segue a raiz e quebra junto).
2. **Aponte o MX para esse host dedicado.** Edite o(s) registro(s) **MX** para `mail.<domínio>` (mantendo a prioridade). Assim o MX deixa de depender da raiz.
3. **Não toque** em SPF (`v=spf1`), DKIM (`default._domainkey`), DMARC (`_dmarc`) nem nos A de `webmail`, `ftp`, `cpanel`, `webdisk`, `whm`, etc.

> Dica de SPF: se o SPF usar o mecanismo `+a`, lembre que após a troca ele passará a resolver para o IP da Vercel. Costuma ser inofensivo se o servidor real estiver listado via `ip4:` e/ou `+mx`. Opcionalmente, ajuste depois.

---

## Fase 2 — Ler os valores de DNS exigidos pela Vercel

No painel da Vercel: **Project → Settings → Domains**.

1. **Adicione o domínio ao projeto** se ainda não estiver lá (`Add` / `Add Existing`). Para o apex, a Vercel costuma oferecer **"Redirect apex domains to www (recommended)"** — uma escolha boa quando o `www` é o canônico. Confirme a preferência de canônico com o usuário (apex direto vs. redirect para www).
2. Em cada domínio, abra a aba **DNS Records** e **copie os valores exatos** que a Vercel pede. Tipicamente:
   - **Apex** → registro **A** com um IP (ex.: faixa nova `216.198.79.x`; a antiga `76.76.21.21` ainda funciona, mas prefira o que o painel mostrar).
   - **www** → registro **CNAME** para um alvo **por-domínio** (ex.: `xxxxxxxx.vercel-dns-0NN.com`; o genérico antigo `cname.vercel-dns.com` ainda funciona, mas prefira o do painel).

**Sempre use o que o painel exibe**, não valores decorados. Confirme cada valor (copie/cole; cuidado com truncamento visual em campos estreitos).

---

## Fase 3 — Editar o DNS no provedor (cPanel ou outro)

No Editor de Zona de DNS:

1. **Apex**: edite o registro **A** de `<domínio>` para o IP da Vercel. Altere **apenas** o valor; não mexa em Nome/TTL/Tipo.
2. **www**: edite o **CNAME** de `www` para o alvo da Vercel. (Se o `www` for um CNAME para a raiz, basta trocar o destino.)
3. **Salve cada registro.** Em cPanel, o "Salvar Registro" por linha já persiste; o botão "Salvar Todos" só é necessário para edições em lote pendentes.

**Não toque** nos registros de e-mail/serviço listados na Fase 1.

---

## Fase 4 — Validar (não confie só no navegador local)

1. **DNS pela origem/propagação** — consulte um resolver público. Se não houver acesso a `dig`/porta 53, use **DNS-over-HTTPS** (ex.: `https://dns.google/resolve?name=<domínio>&type=A`). Confira:
   - A da raiz = IP da Vercel; `www` = CNAME da Vercel.
   - **MX** e **`mail` A** **inalterados** (apontando para o servidor de e-mail).
   - Se o registro recém-criado não aparecer, pode ser **cache** do resolver — use `&cd=1` no Google DoH ou consulte o autoritativo para ver o estado real.
2. **Site/SSL** — acesse o domínio; confirme que carrega o app da Vercel com HTTPS válido. Teste o redirect apex→www (ou vice-versa) conforme configurado.
3. **Status na Vercel** — em Settings → Domains, os domínios devem ficar **"Valid Configuration"** e o SSL ser emitido (pode levar de minutos a algumas horas).
4. **E-mail (peça ao usuário testar de verdade):** enviar de uma conta `@<domínio>` para um e-mail externo e responder de volta. Confirmar ida e volta.

> Se o site novo não aparecer no navegador do usuário mas o DNS público estiver certo e a Vercel estiver "Valid", é **cache de DNS local**: testar em aba anônima, outra rede ou após limpar o cache de DNS do sistema.

---

## Fase 5 — (Opcional) Google Search Console

A verificação e o sitemap são feitos **onde está o DNS** e na conta do usuário no Search Console.

1. **Verificação por DNS (TXT):** o Search Console dá um valor `google-site-verification=…`. Crie um registro **TXT** novo na **raiz** do domínio (coexiste com o SPF — não substitua o SPF). Aguarde propagar (confirme via DoH) e clique em "Verificar". Use propriedade de **domínio** (`sc-domain:`) para cobrir apex e www.
2. **Sitemap:** descubra o sitemap (cheque `/<domínio>/robots.txt`, que costuma declarar `Sitemap:`). Em **Search Console → Sitemaps**, envie a URL que retorna **200 direto** (evite uma que faça redirect). Confirme o status "Processado".
3. **Não remova** o TXT depois — remover perde a verificação.

---

## Fase 6 — (Caso alternativo) Delegar o DNS para a Vercel

Se o usuário **trocar os nameservers** do registrador para os da Vercel, aí sim a **Vercel passa a administrar o DNS**. Nesse caso:

- Todos os registros (incluindo **e-mail**: MX, SPF, DKIM, DMARC, `mail`) precisam ser **recriados dentro da Vercel**, senão o e-mail quebra.
- É um modelo mais centralizado, porém exige migrar a zona inteira com cuidado. Só faça se o usuário pedir explicitamente e depois de exportar/replicar todos os registros atuais.

Para a maioria dos casos, **mantenha os nameservers na hospedagem** e apenas aponte A/CNAME (Fases 1–4).

---

## Checklist final

- [ ] Zona atual listada e linha de base registrada
- [ ] `mail` A fixo no IP do servidor de e-mail + MX apontando para `mail`
- [ ] Valores de DNS da Vercel lidos no painel (não assumidos)
- [ ] Domínio(s) adicionados ao projeto na Vercel
- [ ] A da raiz e CNAME `www` atualizados no provedor
- [ ] DNS validado via resolver público (site novo + e-mail intacto)
- [ ] Site carrega com SSL; redirect funcionando; Vercel "Valid Configuration"
- [ ] E-mail testado (ida e volta) pelo usuário
- [ ] (Opcional) TXT do Search Console + sitemap enviados
- [ ] Nada de e-mail/serviço/nameserver foi alterado por engano
