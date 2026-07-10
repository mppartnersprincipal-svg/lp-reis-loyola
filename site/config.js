/* ============================================================
   Reis & Loyola — CONFIGURAÇÃO DA LANDING PAGE
   ------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para colocar
   a página no ar. Substitua os valores entre [colchetes] pelo
   dado real, MANTENDO as aspas (ex.: "5581999998888").
   Enquanto um valor começar com "[", ele é tratado como
   placeholder e o recurso correspondente fica inativo.
   ============================================================ */
window.RL_CONFIG = {

  /* --- WhatsApp (CTA principal) --------------------------- */
  whatsapp: {
    // Só dígitos: código do país + DDD + número. Ex.: "5581999998888"
    number: "5562998335893",
    // Mensagem pré-preenchida que o visitante envia:
    message: "Olá! Vim pelo site. Fui vítima de um golpe bancário e gostaria de uma análise do meu caso.",
  },

  /* --- Rastreamento (Google) ------------------------------ */
  gtmId: "[GTM_ID]",                          // ex.: "GTM-XXXXXXX" (prioridade sobre GA4)
  ga4Id: "[GA4_ID]",                          // ex.: "G-XXXXXXXXXX"
  adsConversionId: "[GADS_CONVERSION_ID]",    // ex.: "AW-123456789"
  adsConversionLabel: "[GADS_CONVERSION_LABEL]",

  /* --- Formulário ------------------------------------------ */
  // URL que recebe POST JSON {nome, telefone, email, mensagem}.
  // Ex.: Formspree "https://formspree.io/f/xxxxxxx".
  // Vazio = o envio é simulado (útil para testes; configure antes de publicar).
  formEndpoint: "",

  /* --- Dados do escritório --------------------------------- */
  privacyPolicyUrl: "privacidade.html",   // página própria incluída no site
  instagramUrl: "https://www.instagram.com/reiseloyolaadvogados/",
  address: "Av. Portugal, 1148, Quadra L29, Lote 1E, Sala C2501 — Setor Marista, Goiânia/GO — CEP 74150-030",
  contact: "(62) 99833-5893 · contato@reiseloyola.adv.br · Seg. a Sex., das 8h às 18h",
  practiceArea: "[direito do consumidor / bancário]",
  coverage: "[presencial em [cidade] e online em todo o Brasil]",

  lawyers: {
    daniel: {
      name: "Dr. Daniel Reis",
      oab: "OAB/GO 67.135",
    },
    thiago: {
      name: "Dr. Thiago Loyola",
      oab: "OAB/GO 68.323",
    },
  },
};
