# CLAUDE.md — LP Reis & Loyola

Memória do projeto. Leia antes de qualquer alteração. Atualize este arquivo sempre que algo relevante for feito ou decidido.

## O que é este projeto

Landing page de conversão para o escritório **Reis & Loyola** (advocacia — direito do consumidor/bancário), destino de campanhas de **Google Ads (rede de pesquisa)** sobre:
1. **Recuperação de valores** perdidos em golpes bancários (Pix, transferências, cartão).
2. **Anulação de dívidas** contraídas por golpe (empréstimo/financiamento em nome da vítima).

**Objetivo único da página:** contato com o escritório. CTA primário = WhatsApp click-to-chat; CTA secundário = formulário. Uma meta de conversão, sem distração. Público em estado emocional frágil → tom **sóbrio, empático e confiável**, nunca sensacionalista.

## Estrutura de pastas

```
LP - Reis e Loyola/
├── CLAUDE.md                          ← este arquivo
├── site/                              ← A LANDING PAGE (produto final, autocontida)
│   ├── index.html                     # página única: copy, SEO/OG, seções
│   ├── config.js                      # TODOS os placeholders (único arquivo que o escritório edita)
│   ├── README.md                      # guia de edição/publicação para o escritório
│   ├── css/tokens.css                 # tokens do design system (copiados) + base/reset
│   ├── css/styles.css                 # componentes mobile-first
│   ├── js/main.js                     # injeção GTM/gtag, WhatsApp, acordeão, form, reveal, track()
│   └── assets/{img,favicon}/          # imagens otimizadas (WebP/PNG/JPEG)
├── Design system para advocacia-handoff/design-system-para-advocacia/project/
│   ├── tokens/*.css                   # FONTE DA VERDADE visual (cores, tipografia, espaçamento, animações)
│   ├── ui_kits/site-institucional/index.html  # protótipo React de referência visual (NÃO copiar conteúdo — ver Compliance)
│   └── assets/logo-{full,symbol}.png  # PNGs dourados transparentes
├── Fotos dos Advogados/{Daniel,Thiago}/   # ~156 fotos brutas 6000×4000 JPEG (10–17MB cada). Nomes CORRETOS desde 03/07/2026 (pastas fisicamente renomeadas a pedido do cliente): pasta Daniel = Dr. Daniel Reis (gravata listrada, paisagem) · pasta Thiago = Dr. Thiago Loyola (terno azul sem gravata, retrato c/ rotação EXIF). Subpasta `Thiago/Fotos Novas/`: 5 fotos WhatsApp 1200×1600 (09/07/2026, terno azul COM gravata) — fonte da foto atual do Thiago na LP
└── Logos/OPÇÃO 1..6.png               # 6 opções de logo (atenção: "OPCÃO 4.png" sem cedilha)
```

**Regra:** as pastas de origem (design system, fotos, logos) são somente leitura. Todo output vai para `site/`.

## Decisões tomadas (não rediscutir sem motivo)

| Tema | Decisão | Por quê |
|---|---|---|
| Stack | HTML + CSS + JS puros, zero libs | Design system não impõe stack; performance é crítica (Quality Score do Ads) |
| Logo header/rodapé | **OPÇÃO 1** (lockup dourado) | Única versão dourada com alpha real (rgba) — funciona sobre o fundo escuro. Header usa símbolo (`logo-symbol-96.png`) + wordmark em texto Cinzel; rodapé usa o lockup completo |
| Favicon/OG | **OPÇÃO 6** (selo circular, fundo preto embutido, rgb24) | Legível em 16–32px |
| Fotos escolhidas | **Dr. Daniel Reis `DSC01506.JPG`** (pasta `Daniel/`) · **Dr. Thiago Loyola: trocada em 09/07/2026** para `Thiago/Fotos Novas/WhatsApp Image 2026-07-08 at 09.58.17.jpeg` (em pé, gravata, cortina ao fundo; antes era `DSC01617.JPG`) | Cliente pediu troca por qualquer foto da pasta "Fotos Novas"; escolhida a de olhar direto e expressão sóbria/confiante (mesmo critério da seleção original). Fonte 1200×1600 → crop 4:5 `crop=1200:1500:0:100` → mesmos outputs do pipeline (480/768 WebP q82 + 768 JPEG q4). URLs do Thiago no `index.html` bumpadas para `?v=3` (cache-busting; Daniel segue `?v=2`). Backups do Daniel avaliados: 01505/01507 |
| Identidade dos advogados | Cliente corrigiu em 03/07/2026: as pastas de fotos estavam com nomes trocados. Assets `site/assets/img/{daniel,thiago}-*` foram renomeados às 14:18 e correspondem à pessoa certa (**Dr. Daniel Reis = gravata listrada · Dr. Thiago Loyola = terno azul sem gravata**). Depois, a pedido do cliente, as pastas de origem foram **fisicamente renomeadas** (invertidas) — os nomes das pastas agora batem com as pessoas. Também foi adicionado `?v=2` nas 6 URLs das fotos dos advogados no `index.html`: um print do cliente pós-correção mostrava o Daniel nos DOIS cards porque o navegador ainda servia o `thiago-*.webp` antigo do cache | Correção fornecida pelo cliente; cache-busting evita que navegadores com a imagem antiga mostrem a pessoa errada |
| Tema | Dark (`--ink-950 #0B0B0C`) + dourado (`--gold-400 #C6A15B`) | Padrão do design system |
| Fontes | Google Fonts assíncrono (preload + `media=print onload`), pesos enxutos: Cinzel 600, Cormorant Garamond 600, Manrope 400/600/700 | CSS de fontes bloqueava render (906ms). Fallbacks com `size-adjust` medidos empiricamente: Georgia p/ Cormorant 88.9%, Georgia p/ Cinzel 124.8%, Arial p/ Manrope 100.7% → CLS caiu de 0.095 para 0.02 |
| Breakpoints | base mobile → 480 → 768 → 1024 (min-width), container 1200px | Design system não tem breakpoints (protótipo é desktop-fixo) |
| Tracking | Injeção condicional em `main.js` (defer): GTM se `gtmId` real, senão gtag (GA4/Ads). Eventos `whatsapp_click` (+`cta_location`) e `form_submit` sempre no dataLayer. Guard universal: valor começando com `[` = placeholder inativo | Escritório cola IDs no config.js e funciona sem tocar em markup. Scripts com defer (config.js bloqueante custava 330ms) |
| Formulário | nome*, telefone*, e-mail opcional, mensagem*, LGPD*; validação pt-BR; `formEndpoint` vazio = sucesso simulado | Espec do cliente; endpoint fica a cargo do escritório (Formspree etc.) |
| FAQ | Acordeão `<h3><button aria-expanded>` + painel `<section>` animado via `grid-template-rows: 0fr→1fr` | Acessível e sem hack de max-height |
| Reveal on scroll | Classe `.reveal` só ativa com `html.js` (script inline adiciona a classe) | Sem JS o conteúdo nunca fica invisível |
| CTA overlap do protótipo (`translateY(50%)`) | Descartado | Frágil no mobile |
| Registro OAB do escritório no rodapé (`oabFirm`) | **Removido** a pedido do cliente (03/07/2026) — rodapé exibe só "Reis & Loyola". Campo retirado do config.js/HTML/README | Cliente pediu remoção; não recolocar sem novo pedido |
| Imagens ilustrativas de seção (03/07/2026) | 3 fotos **Unsplash**: `situacao-*` (mãos/celular no escuro, banner 21:9 em #situacao), `justica-*` (Têmis com balança, banner 2:1 em #direitos, escurecida p/ tema dark), `tempo-*` (ampulheta dourada, split 4:5 em #por-que-agir). Componentes CSS `.section-visual` e `.split`; tudo `loading="lazy"` + `aspect-ratio` no CSS (sem CLS/LCP impact). Hero ficou sem foto de propósito | Higgsfield estava sem créditos p/ gerar; foto real transmite mais confiança que IA em advocacia; licença Unsplash = uso comercial livre sem atribuição. Hero sem imagem para não arriscar o LCP (Quality Score) |
| Bio dos advogados (`lawyers.*.bio`) | **Removida** a pedido do cliente (03/07/2026) — cards exibem só foto, nome e OAB. `<p class="lawyer__bio">` retirado do HTML, campo `bio` do config.js e regra `.lawyer__bio` do CSS | Cliente pediu remoção do placeholder "[1 linha de atuação/qualificação]"; não recolocar sem novo pedido |
| Instagram no rodapé (03/07/2026) | Link texto "Instagram" na linha `.footer__contact` (entre contato e Política de Privacidade) → `https://www.instagram.com/reiseloyolaadvogados/`. Campo `instagramUrl` no config.js + `data-cfg-href` no HTML, com a URL real também no `href` estático (funciona sem JS) | Pedido do cliente; segue o padrão config.js/data-cfg do restante do rodapé. Verificado: html-validate OK, link renderiza com `target=_blank rel=noopener`, zero erros de console, layout mobile OK |
| Headline/sub com filtro de valor (09/07/2026) | H1: "Perdeu mais de R$ 10.000 em um golpe bancário? A lei pode estar do seu lado." · lead: "Análise jurídica para casos com prejuízo acima de R$ 10 mil: buscamos a reparação de valores perdidos em Pix, transferência ou cartão e a anulação de dívidas…". Valor usa `R$&nbsp;10.000` (nbsp evita quebra). Hardcoded no hero do `index.html`; para mudar o corte, editar H1 + lead. `<title>`/OG **não** mencionam o valor de propósito | Pedido do cliente (09/07/2026): qualificar o lead vindo do Google Ads, filtrando casos abaixo de R$ 10 mil. Compliance OAB mantido: o valor é qualificador do prejuízo do lead (não promessa/divulgação de resultado); verbo "buscar" preservado. html-validate OK |

## ⚠️ Compliance OAB (Provimento 205/2021) — INEGOCIÁVEL

- ❌ NUNCA prometer/garantir resultado; usar sempre linguagem de possibilidade ("pode", "é possível", "a depender do caso").
- ❌ NUNCA divulgar valores recuperados, casos de sucesso com números, depoimentos, prints.
- ❌ NUNCA usar urgência falsa (contador, "últimas vagas"), preço como chamariz, comparação com outros escritórios.
- ❌ O protótipo do design system contém stats ("R$ 4,2mi", "98%"), depoimento e estrelas — **NÃO-conformes; nunca reaproveitar esse conteúdo**, só a linguagem visual.
- ✅ A copy do `index.html` foi fornecida pelo cliente e deve permanecer **verbatim**. O texto legal do rodapé não pode ser alterado nem removido.
- Teste mental para qualquer texto novo: "eu mostraria isso num telão do Tribunal de Ética da OAB sem receio?"

## Pipeline de imagens (ffmpeg — sem ImageMagick/cwebp na máquina)

- Sempre `-map_metadata -1` (as fotos têm EXIF/GPS) e `flags=lanczos`.
- **Fotos do Dr. Thiago Loyola (hoje pasta `Thiago/`) têm rotação EXIF** (retrato 4000×6000 após correção); o ffmpeg 8 aplica a rotação automaticamente no decode. As do Dr. Daniel Reis (hoje pasta `Daniel/`) são paisagem normal.
- Crops usados: fotos do Thiago `crop=4000:5000:0:0` (sobre o frame já rotacionado) · fotos do Daniel `crop=3200:4000:1280:0`. Saídas: WebP 480×600 e 768×960 (`-c:v libwebp -quality 82`) + JPEG 768 (`-q:v 4`).
- WebP com alpha: `-pix_fmt yuva420p -c:v libwebp`.
- Bbox de alpha de PNG: o `cropdetect` ERRA (subestimou o wordmark) — usar dump raw RGBA + script Node de varredura (feito no scratchpad). Bbox da OPÇÃO 1: `x:149..951 y:212..813`; crop com margem usado: `crop=830:630:136:198`.
- Seleção entre muitas fotos: contact sheets 5×4 (`scale=320:214` + `concat` + `tile=5x4`) + mapa .txt índice→arquivo, revisados por subagentes.
- **Banco de imagens (03/07/2026):** APIs do Unsplash/Pexels bloqueiam curl e o browser headless (401/403); o que funciona é **WebFetch nas páginas de busca do Unsplash** (`unsplash.com/s/photos/<termo>`) para extrair IDs, e o CDN `images.unsplash.com/<id>?w=&q=&fm=jpg&fit=max` baixa via curl sem bloqueio. Masters salvos no scratchpad da sessão.
- Tratamento dark da `justica-*` (fundo claro → tema escuro): `eq=brightness=-0.26:contrast=1.22:saturation=0.85,colorbalance=rs=0.05:bs=-0.07:rm=0.04:bm=-0.06,vignette=PI/2.8`. Crops: justica `crop=2400:1200:0:220` · situacao `crop=2400:1029:0:420` (+vinheta leve) · tempo `crop=1600:2000:0:380` (`eq=saturation=0.94`).
- `drawtext` do ffmpeg no Windows precisa de `fontfile='C\:/Windows/Fonts/arialbd.ttf'` (Fontconfig quebrado) e `setsar=1` antes de `concat` de imagens heterogêneas.

## QA já executado (03/07/2026)

- **Lighthouse (local, mobile throttled):** Performance 90 · Acessibilidade 100 · Best Practices 100 · SEO 100 · LCP 2.7s (TTFB 453ms do http.server local infla; em CDN ≈2s) · CLS 0.02 · TBT 0ms.
- **Funcional:** acordeão OK, validação + sucesso do form OK, eventos no dataLayer OK (`whatsapp_click` com `cta_location`, `form_submit`), header `.is-scrolled` OK, FAB visível só <1024px, `npx html-validate` sem erros, zero erros de console, 5 CTAs WhatsApp conectados.
- **A11y:** heading order h1→h2→h3, skip-link, `:focus-visible` dourado, `aria-describedby`/`aria-live` nos erros, `prefers-reduced-motion` respeitado, alt em imagens, contraste AA.
- **Imagens de seção (03/07/2026, gstack browse):** as 3 novas imagens renderizam (`currentSrc` = WebP correto por viewport), zero erros de console, `html-validate` OK, layout conferido em 1280px e 375px (banners 16:10 no mobile via `aspect-ratio` + `object-position`; split empilha imagem acima das razões).

## Como rodar / publicar

```bash
cd site && python -m http.server 8080   # ou npx serve .
```
Publicação: a pasta `site/` funciona em qualquer host estático (Netlify/Vercel/Cloudflare Pages ou public_html). Checklist pós-publicação no `site/README.md`.

**Git/Deploy (03/07/2026):** repositório **público** em `https://github.com/mppartnersprincipal-svg/lp-reis-loyola` (branch `main`), deploy previsto na **Vercel**. O `vercel.json` na raiz aponta `outputDirectory: "site"` — importar o repo na Vercel funciona sem configuração extra (alternativa: Root Directory = `site` no dashboard). O `.gitignore` exclui de propósito (repo público + tamanho): `Fotos dos Advogados/` (~2GB de fotos brutas dos advogados), `Design system para advocacia-handoff/` (material de terceiros) e `Logos/` — esses insumos existem só nesta máquina; tudo que a LP usa já está otimizado em `site/assets/`. Não commitar essas pastas.

## PENDENTE — aguardando dados do escritório

Preenchidos em 03/07/2026 (fonte: print do rodapé do site institucional atual, enviado pelo cliente): `whatsapp.number` = 5562998335893, `address` (Av. Portugal 1148, Quadra L29, Lote 1E, Sala C2501, Setor Marista, Goiânia/GO, CEP 74150-030) e `contact` (telefone · contato@reiseloyola.adv.br · Seg–Sex 8h–18h). Verificado via gstack browse: injeção no rodapé OK, `wa.me` ativo nos CTAs, zero erros de console.

Ainda pendente em `site/config.js` (valores `[entre colchetes]`):
1. IDs de tracking: `gtmId`, `ga4Id`, `adsConversionId` + `adsConversionLabel`
2. `formEndpoint` (Formspree/CRM) — vazio = envio simulado
3. `privacyPolicyUrl` (LGPD)
4. `practiceArea` e `coverage` (seção Sobre — o endereço confirma Goiânia, mas aguardar redação do cliente)

(Nomes e OAB dos advogados já preenchidos em 03/07/2026: **Dr. Daniel Reis — OAB/GO 67.135** · **Dr. Thiago Loyola — OAB/GO 68.323**. A bio foi removida a pedido do cliente — ver Decisões.)

Fora do config.js (editar direto no `index.html`):
5. Resposta da FAQ sobre **honorários** — "[Ajustar conforme a política do escritório.]"
6. `<link rel="canonical">` (comentado no `<head>`) — preencher com a URL final
7. `og:image` → trocar para URL absoluta após publicar

## Backlog / ideias futuras (não iniciadas)

- Página `privacidade.html` própria (hoje só há link placeholder).
- Self-host das fontes Google (nota no README) se o Lighthouse de produção pedir.
- Teste A/B de headline via Google Ads (a estrutura de tracking já suporta).
- `favicon.ico` real (ffmpeg não gera .ico; usar `npx png-to-ico` se necessário).

## Ambiente da máquina (verificado)

Windows 11 · ffmpeg 8.1.1 com libwebp (WinGet) · Node v22 + npx · Python 3.12 · **sem** ImageMagick/cwebp · Chromium do Playwright em `%LOCALAPPDATA%\ms-playwright\chromium-1223` (usado como `CHROME_PATH` do Lighthouse) · gstack browse disponível para QA headless.
