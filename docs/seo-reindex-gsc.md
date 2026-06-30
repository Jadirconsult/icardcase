# Reindexação no Google Search Console — icardcase.com.br

> Material de acompanhamento. As ações abaixo são **manuais, no painel do GSC** — feitas pelo usuário.
> Host canônico do site: **https://www.icardcase.com.br** (o apex faz 308 → www).

## Qual propriedade usar no GSC

Use a propriedade do **host canônico**:

- **Propriedade de domínio** `icardcase.com.br` (cobre apex + www + http/https), **ou**
- **Propriedade de prefixo de URL** `https://www.icardcase.com.br`.

Se inspecionar uma URL, sempre use a versão **com www** (ex.: `https://www.icardcase.com.br/sobre`), que é a que serve 200.

---

## Passo 1 — Reenviar o sitemap

GSC → **Sitemaps** → enviar/reprocessar:

```
https://www.icardcase.com.br/sitemap.xml
```

Confirme o status **"Processado"** e o número de páginas descobertas.

> ⚠️ **Antes de confiar 100% no sitemap, veja a seção "Pendências no sitemap" no fim deste doc** — hoje ele inclui 3 URLs que retornam 404 e deixa 2 páginas reais de fora. Isso não impede a reindexação das páginas válidas, mas gera erros no relatório do GSC.

---

## Passo 2 — Inspeção de URL → "Solicitar indexação"

Cota do GSC: **~10 URLs/dia**. Faça por prioridade. Para cada URL: GSC → **Inspeção de URL** → colar a URL → **Solicitar indexação**.

A coluna **"Canônico do Google = o esperado?"** você preenche depois de inspecionar: o GSC mostra o "Canônico selecionado pelo Google" — confirme que bate com a própria URL (em www).

### Dia 1 (10 URLs — prioridade máxima/alta)

| # | URL | Prioridade | Data solicitada | Status no GSC | Canônico do Google = o esperado? |
|---|-----|------------|------------------|----------------|-----------------------------------|
| 1 | https://www.icardcase.com.br/ | Máxima | | | |
| 2 | https://www.icardcase.com.br/sobre | Alta | | | |
| 3 | https://www.icardcase.com.br/cases | Alta | | | |
| 4 | https://www.icardcase.com.br/insights | Alta | | | |
| 5 | https://www.icardcase.com.br/contato | Alta | | | |
| 6 | https://www.icardcase.com.br/desenvolvimento-de-sistemas | Alta (serviço) | | | |
| 7 | https://www.icardcase.com.br/desenvolvimento-mobile | Alta (serviço) | | | |
| 8 | https://www.icardcase.com.br/infraestrutura-de-ti | Alta (serviço) | | | |
| 9 | https://www.icardcase.com.br/seguranca-lgpd | Alta (serviço) | | | |
| 10 | https://www.icardcase.com.br/consultoria-ti | Alta (serviço) | | | |

### Dia 2 (próximas 10 — posts, cases, institucionais e política)

| # | URL | Prioridade | Data solicitada | Status no GSC | Canônico do Google = o esperado? |
|---|-----|------------|------------------|----------------|-----------------------------------|
| 11 | https://www.icardcase.com.br/insights/reforma-tributaria-2026 | Média (post) | | | |
| 12 | https://www.icardcase.com.br/insights/migrar-visual-foxpro-web | Média (post) | | | |
| 13 | https://www.icardcase.com.br/insights/whatsapp-business-api-empresarial | Média (post) | | | |
| 14 | https://www.icardcase.com.br/insights/dctfweb-automacao | Média (post) | | | |
| 15 | https://www.icardcase.com.br/insights/lgpd-escritorio-contabil | Média (post) | | | |
| 16 | https://www.icardcase.com.br/cases/syspershy | Média (case) | | | |
| 17 | https://www.icardcase.com.br/cases/prossiga | Média (case) | | | |
| 18 | https://www.icardcase.com.br/cases/nf-saas | Média (case) | | | |
| 19 | https://www.icardcase.com.br/cases/ufrj | Média (case) | | | |
| 20 | https://www.icardcase.com.br/abordagem | Média (institucional) | | | |

### Dia 3 (resto)

| # | URL | Prioridade | Data solicitada | Status no GSC | Canônico do Google = o esperado? |
|---|-----|------------|------------------|----------------|-----------------------------------|
| 21 | https://www.icardcase.com.br/politica-privacidade | Baixa (política) | | | |

> Total: **21 páginas públicas reais** (extraídas de `app/` + `app/sitemap.ts`).

---

## O que observar (acompanhamento — prazo 1 a 3 semanas)

- **GSC → Indexação → Páginas:** acompanhe o número de páginas **Indexadas** subindo e o de **Não indexadas** caindo.
- **"Duplicada, o Google escolheu um canônico diferente do usuário":** esse status deve **desaparecer** à medida que o novo canonical (por página, em www) propaga. Era o sintoma do bug antigo (todas as páginas apontavam pra home). Se persistir após ~2 semanas, investigar.
- **Convergência de canônico:** na Inspeção de URL, o "Canônico declarado pelo usuário" e o "Canônico selecionado pelo Google" devem **coincidir** (ambos na própria URL, em www).
- **Cobertura do sitemap:** confirme que o GSC não acusa "URL enviada não encontrada (404)" — se acusar, é por causa das pendências abaixo.
- **Prazo realista:** reindexação e convergência de canônico levam de **alguns dias a ~3 semanas**. Solicitar indexação acelera, mas não é instantâneo.

---

## Pendências no sitemap (corrigir no código — fora do escopo deste doc)

> Detectado na auditoria de `app/sitemap.ts`. **Não corrigido aqui** (este doc é só acompanhamento); listado para o dev ajustar.

1. **3 URLs no sitemap que retornam 404** (não existe rota nem redirect):
   - `/politica-de-privacidade` (a rota real é `/politica-privacidade`, sem o "de")
   - `/termos-de-uso`
   - `/lgpd`
2. **2 páginas reais ausentes do sitemap:**
   - `/politica-privacidade` (a que existe de fato)
   - `/abordagem`

Enquanto o sitemap não for corrigido, o GSC vai reportar erros de "URL não encontrada" para os 3 itens acima, e as 2 páginas reais ausentes só serão descobertas por links internos (não pelo sitemap).
