/* Reis & Loyola — comportamento da landing page (sem dependências) */
(function () {
  "use strict";

  var cfg = window.RL_CONFIG || {};

  /* Valores que começam com "[" são placeholders ainda não preenchidos. */
  function isPlaceholder(v) {
    return !v || String(v).trim().charAt(0) === "[";
  }

  /* ---- Injeção de GTM / gtag ------------------------------------------ */
  /* Injeta GTM (prioridade) ou gtag/GA4/Ads somente quando os IDs em
     config.js forem reais. Placeholders (começando com "[") = inativo. */
  (function (c) {
    window.dataLayer = window.dataLayer || [];
    function ph(v) { return !v || String(v).trim().charAt(0) === "["; }
    if (!c) { return; }
    if (!ph(c.gtmId)) {
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(c.gtmId);
      document.head.appendChild(s);
      return;
    }
    var first = !ph(c.ga4Id) ? c.ga4Id : (!ph(c.adsConversionId) ? c.adsConversionId : null);
    if (first) {
      var g = document.createElement("script");
      g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(first);
      document.head.appendChild(g);
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      if (!ph(c.ga4Id)) { window.gtag("config", c.ga4Id); }
      if (!ph(c.adsConversionId)) { window.gtag("config", c.adsConversionId); }
    }
  })(cfg);

  /* ---- Rastreamento -------------------------------------------------- */
  /* Sempre empurra o evento para o dataLayer (GTM cria os gatilhos lá).
     Se gtag estiver carregado e os IDs do Google Ads forem reais,
     dispara também a conversão diretamente. */
  function track(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: eventName };
    for (var k in params) { payload[k] = params[k]; }
    window.dataLayer.push(payload);

    if (
      typeof window.gtag === "function" &&
      !isPlaceholder(cfg.adsConversionId) &&
      !isPlaceholder(cfg.adsConversionLabel)
    ) {
      window.gtag("event", "conversion", {
        send_to: cfg.adsConversionId + "/" + cfg.adsConversionLabel,
      });
    }
  }

  /* ---- WhatsApp ------------------------------------------------------ */
  function buildWaUrl() {
    var wa = cfg.whatsapp || {};
    var digits = String(wa.number || "").replace(/\D/g, "");
    var url = "https://wa.me/" + digits;
    if (wa.message) { url += "?text=" + encodeURIComponent(wa.message); }
    return url;
  }

  function initWhatsAppLinks() {
    var url = buildWaUrl();
    var links = document.querySelectorAll("[data-wa-link]");
    for (var i = 0; i < links.length; i++) {
      (function (a) {
        a.href = url;
        a.addEventListener("click", function () {
          track("whatsapp_click", { cta_location: a.getAttribute("data-wa-location") || "" });
        });
      })(links[i]);
    }
  }

  /* ---- Textos vindos da configuração --------------------------------- */
  function initConfigText() {
    var nodes = document.querySelectorAll("[data-cfg]");
    for (var i = 0; i < nodes.length; i++) {
      var path = nodes[i].getAttribute("data-cfg").split(".");
      var v = cfg;
      for (var j = 0; j < path.length && v != null; j++) { v = v[path[j]]; }
      if (typeof v === "string" && v) { nodes[i].textContent = v; }
    }
    var links = document.querySelectorAll("[data-cfg-href]");
    for (var k = 0; k < links.length; k++) {
      var val = cfg[links[k].getAttribute("data-cfg-href")];
      if (!isPlaceholder(val)) { links[k].href = val; }
    }
  }

  /* ---- Header com fundo após rolagem ---------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) { return; }
    var update = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---- Acordeão do FAQ (um aberto por vez) ---------------------------- */
  function initAccordion() {
    var buttons = document.querySelectorAll(".faq__question");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var expanded = this.getAttribute("aria-expanded") === "true";
        for (var j = 0; j < buttons.length; j++) {
          buttons[j].setAttribute("aria-expanded", "false");
          buttons[j].closest(".faq__item").classList.remove("is-open");
        }
        if (!expanded) {
          this.setAttribute("aria-expanded", "true");
          this.closest(".faq__item").classList.add("is-open");
        }
      });
    }
  }

  /* ---- Revelação ao rolar --------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) { items[i].classList.add("is-visible"); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    for (var k = 0; k < items.length; k++) {
      var delay = items[k].getAttribute("data-delay");
      if (delay) { items[k].style.transitionDelay = delay + "ms"; }
      io.observe(items[k]);
    }
  }

  /* ---- Formulário ------------------------------------------------------ */
  function setError(field, message) {
    var el = document.getElementById(field.getAttribute("aria-describedby"));
    field.classList.toggle("has-error", !!message);
    if (el) { el.textContent = message || ""; }
  }

  function initForm() {
    var form = document.getElementById("form-caso");
    if (!form) { return; }

    var nome = form.querySelector("#campo-nome");
    var telefone = form.querySelector("#campo-telefone");
    var email = form.querySelector("#campo-email");
    var mensagem = form.querySelector("#campo-mensagem");
    var lgpd = form.querySelector("#campo-lgpd");

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var firstInvalid = null;

      function check(field, valid, message) {
        setError(field, valid ? "" : message);
        if (!valid && !firstInvalid) { firstInvalid = field; }
      }

      var telDigits = telefone.value.replace(/\D/g, "");
      check(nome, nome.value.trim().length >= 2, "Informe o seu nome.");
      check(telefone, telDigits.length >= 10 && telDigits.length <= 13, "Informe um telefone válido com DDD.");
      check(email, email.value.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), "Informe um e-mail válido ou deixe em branco.");
      check(mensagem, mensagem.value.trim().length >= 10, "Descreva brevemente o que aconteceu.");
      check(lgpd, lgpd.checked, "É necessário autorizar o contato para enviar.");

      if (firstInvalid) { firstInvalid.focus(); return; }

      var data = {
        nome: nome.value.trim(),
        telefone: telefone.value.trim(),
        email: email.value.trim(),
        mensagem: mensagem.value.trim(),
      };

      var button = form.querySelector("button[type='submit']");
      button.disabled = true;
      button.textContent = "Enviando…";

      function showSuccess() {
        track("form_submit", {});
        var success = document.getElementById("form-sucesso");
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }

      function showFailure() {
        button.disabled = false;
        button.textContent = "Enviar detalhes do caso";
        setError(mensagem, "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.");
      }

      if (cfg.formEndpoint && !isPlaceholder(cfg.formEndpoint)) {
        fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        })
          .then(function (res) { res.ok ? showSuccess() : showFailure(); })
          .catch(showFailure);
      } else {
        /* Sem endpoint configurado: confirma localmente (modo de teste). */
        window.setTimeout(showSuccess, 500);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initConfigText();
    initWhatsAppLinks();
    initHeader();
    initAccordion();
    initReveal();
    initForm();
  });
})();
