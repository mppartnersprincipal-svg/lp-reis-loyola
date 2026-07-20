# Landing Page — Reis & Loyola

Página única de conversão para campanhas de Google Ads (golpes bancários / dívidas por fraude).
HTML + CSS + JavaScript puros, sem dependências. Tema e tokens vêm do design system do escritório.

## Logo escolhida

- **Header e rodapé: `Logos/OPÇÃO 1.png`** — é a única versão dourada com fundo transparente, o que garante contraste e legibilidade sobre o fundo escuro (`#0B0B0C`) do design system em qualquer tamanho. No header ela aparece como símbolo + wordmark em texto; no rodapé, o lockup completo.
- **Favicon e imagem de compartilhamento (OG): `Logos/OPÇÃO 6.png`** — o selo circular continua legível em 16–32px.
- As opções 2 e 3 (branca/preta) não funcionam sobre o tema escuro, e as 4 e 5 são mockups com fundo fotográfico embutido.

## Fotos escolhidas

- **Dr. Daniel Reis:** `Daniel/Foto LP.jpeg` — em pé junto à janela, gravata listrada, olhar direto (trocada em 10/07/2026).
- **Dr. Tiago Loyola:** `Thiago/Fotos Novas/WhatsApp Image 2026-07-08 at 09.58.17.jpeg` — em pé, gravata, cortina ao fundo (trocada em 09/07/2026). (A pasta de origem e os arquivos `thiago-*` mantêm a grafia antiga com "h"; o nome correto é **Tiago**, sem H.)
- As pastas de origem `Fotos dos Advogados/{Daniel,Thiago}` já estão com os nomes corretos (foram fisicamente renomeadas em 03/07/2026).
- Ambas cortadas em 4:5 e exportadas em WebP responsivo (480px e 768px) + JPEG de fallback, com `?v=3` de cache-busting nas URLs.

## Imagens ilustrativas das seções

Três fotos do **Unsplash** (licença Unsplash: uso comercial livre, sem atribuição obrigatória), otimizadas em WebP responsivo + JPEG de fallback e sem metadados:

- `situacao-*` — mãos digitando num celular no escuro (seção "Você reconhece a sua situação?") — `photo-1423784346385-c1d4dac9893a`
- `justica-*` — estátua de Têmis com a balança (seção "O que a lei diz") — `photo-1589829545856-d10d557cf95f`, escurecida para o tema dark
- `tempo-*` — ampulheta em tons dourados (seção "Por que não deixar pra depois") — `photo-1728677742573-a1295084f955`

Todas carregam com `loading="lazy"` e não afetam o carregamento inicial da página.

## Onde editar os dados do escritório (placeholders)

**Tudo fica em [`config.js`](config.js)** — o único arquivo que precisa ser editado. Valores entre
`[colchetes]` são placeholders: enquanto começarem com `[`, o recurso correspondente fica inativo.

| Campo | O que é |
|---|---|
| `whatsapp.number` | Número do WhatsApp, só dígitos, com país e DDD (ex.: `5581999998888`) |
| `whatsapp.message` | Mensagem pré-preenchida do click-to-chat (já tem um texto padrão editável) |
| `gtmId` | ID do Google Tag Manager (`GTM-XXXXXXX`) — tem prioridade sobre o GA4 |
| `ga4Id` | ID do GA4 (`G-XXXXXXXXXX`) — usado se não houver GTM |
| `adsConversionId` / `adsConversionLabel` | Conversão do Google Ads (`AW-…` + label) |
| `formEndpoint` | URL que recebe o POST JSON do formulário (ex.: Formspree). Vazio = envio simulado |
| `privacyPolicyUrl` | Link da Política de Privacidade (LGPD) — **já preenchido**: aponta para a página própria [`privacidade.html`](privacidade.html) |
| `instagramUrl` | Link do Instagram do escritório (rodapé) — já preenchido |
| `address` / `contact` | Endereço e contato do rodapé |
| `practiceArea` / `coverage` | Área de atuação e cobertura de atendimento (seção Sobre) — **já preenchidos**: direito bancário · presencial em Goiânia (GO) e online em todo o Brasil |
| `lawyers.daniel` / `lawyers.thiago` | OAB e nome de cada sócio (já preenchidos: Dr. Daniel Reis e Dr. Tiago Loyola) |

Fora do `config.js`, só resta um texto com colchetes no próprio `index.html`:
a resposta da FAQ sobre **honorários** (ajustar conforme a política do escritório).
O `canonical`, o `og:url` e o `og:image` já apontam para `https://reiseloyola.com.br`
(domínio escolhido em 10/07/2026) — se o domínio final mudar, atualize essas três URLs
no `<head>` do `index.html` e o `canonical` do `privacidade.html`.

## Política de Privacidade

A página [`privacidade.html`](privacidade.html) cobre a LGPD e os requisitos de destino do
Google Ads: identifica o escritório como controlador, lista os dados coletados (formulário,
WhatsApp e cookies de medição do Google), finalidades e bases legais, links de desativação
das ferramentas do Google, prazo de retenção, direitos do titular (art. 18) e canal de
contato. **Recomenda-se que os advogados revisem o texto antes de subir as campanhas** e
atualizem a data de "Última atualização" se fizerem ajustes.

## Rastreamento de conversão

Os eventos são disparados sempre, mesmo sem IDs configurados (dá para testar no console via `window.dataLayer`):

- **`whatsapp_click`** (com `cta_location`: `header` | `hero` | `cta_final` | `form_success` | `fab`) — em todo clique de WhatsApp.
- **`form_submit`** — no envio validado do formulário.

Duas formas de ativar:

1. **Via GTM (recomendado — JÁ ATIVO):** o container **`GTM-K5WRPXNB`** está preenchido no `config.js` e o `<noscript>` do GTM já está ativo no `index.html` e na `privacidade.html`. O que falta é configurar DENTRO do Tag Manager: gatilhos de evento personalizado para `whatsapp_click` e `form_submit` apontando para as tags de conversão do Google Ads e/ou GA4 (passo a passo abaixo).
2. **Direto (sem GTM):** preencha `ga4Id` e/ou `adsConversionId` + `adsConversionLabel`. O site injeta o gtag e dispara a conversão (`send_to: ID/LABEL`) nos dois eventos automaticamente. *(Com o GTM ativo, deixe esses campos como placeholders — senão a conversão dispara em duplicidade.)*

### Configuração dentro do Tag Manager (fazer uma vez, em tagmanager.google.com)

No container `GTM-K5WRPXNB`:

1. **Variável** (Variáveis → Nova → Variável da camada de dados): nome `cta_location`, nome da variável na camada de dados `cta_location`. Identifica qual botão de WhatsApp foi clicado (`header`, `hero`, `cta_final`, `form_success`, `fab`).
2. **Acionadores** (Acionadores → Novo → Evento personalizado):
   - `Evento — whatsapp_click`, nome do evento `whatsapp_click`
   - `Evento — form_submit`, nome do evento `form_submit`
3. **Tags:**
   - **Tag do Google (GA4):** com o ID de métricas `G-XXXXXXXXXX` da propriedade GA4, acionador *All Pages / Inicialização*. Depois, duas tags "Evento do GA4" (nomes `whatsapp_click` e `form_submit`, com o parâmetro `cta_location` = `{{cta_location}}` na primeira), cada uma com seu acionador do passo 2.
   - **Google Ads — Vinculador de conversões (Conversion Linker):** acionador *All Pages*. Obrigatória para a conversão do Ads funcionar.
   - **Google Ads — Acompanhamento de conversões:** crie no Google Ads duas ações de conversão ("Contato via WhatsApp" e "Envio de formulário", categoria Lead), copie ID (`AW-…`) e rótulo de cada uma, e crie duas tags no GTM, cada uma com o acionador correspondente do passo 2. A de WhatsApp costuma ser a conversão principal da campanha; a de formulário pode ficar como secundária.
4. **Testar** com *Visualizar* (Preview/Tag Assistant): clicar num CTA de WhatsApp e enviar o formulário → conferir se os eventos aparecem e as tags disparam.
5. **Publicar** o container (botão *Enviar*). Sem publicar, nada dispara para visitantes reais.

## Formulário

Campos: nome*, telefone*, e-mail (opcional), descrição do caso* e consentimento LGPD*, com validação em português e estado de sucesso. Com `formEndpoint` vazio o envio é simulado (útil em teste). Para receber leads de verdade, aponte para um endpoint que aceite POST JSON — ex.: [Formspree](https://formspree.io) (grátis), Google Apps Script, ou o CRM do escritório.

## Como rodar localmente

```bash
cd site
python -m http.server 8080    # ou: npx serve .
# abra http://localhost:8080
```

## Como publicar

A pasta `site/` é 100% estática e autocontida — funciona em qualquer hospedagem:

- **Netlify / Vercel / Cloudflare Pages:** arraste a pasta `site/` (ou aponte o deploy para ela). HTTPS e CDN automáticos.
- **Hospedagem tradicional (cPanel etc.):** envie o conteúdo de `site/` para a raiz pública (`public_html`).

Checklist pós-publicação: preencher os IDs de tracking e o `formEndpoint` no `config.js` → conferir se o domínio final é mesmo `reiseloyola.com.br` (canonical/OG já apontam para ele) → testar o botão de WhatsApp num celular → abrir `privacidade.html` no domínio final → conferir a conversão no Google Ads (modo de pré-visualização do GTM ajuda).

## Performance e acessibilidade (medidos via Lighthouse local)

Acessibilidade 100 · Best Practices 100 · SEO 100 · Performance 90 no ambiente local
(o TTFB do servidor de teste local penaliza o LCP; em hospedagem com CDN o resultado sobe).
Fontes com `font-display: swap` e fallbacks com `size-adjust` (CLS 0.02), imagens WebP com
lazy-load e dimensões explícitas, zero bibliotecas externas.

> **Compliance OAB (Provimento 205/2021):** a página usa apenas linguagem de possibilidade,
> sem promessa de resultado, valores, depoimentos ou urgência artificial. O aviso legal do
> rodapé não deve ser removido nem editado.
