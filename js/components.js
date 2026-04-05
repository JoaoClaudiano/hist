/**
 * Fortaleza Sub & Via — Componentes Compartilhados
 * Injeta nav, footer, botão voltar ao topo, hamburguer e tema escuro.
 */
(function () {
  'use strict';

  /* ── Detectar se estamos em subdiretório (personalidades/) ── */
  const path = window.location.pathname;
  const isSubdir = /\/personalidades\//.test(path);
  const root = isSubdir ? '../' : '';

  /* ── Página atual (para marcar link ativo) ── */
  const currentFile = path.split('/').pop() || 'index.html';

  function navLink(href, label) {
    const isActive = currentFile === href;
    return `<a href="${root}${href}"${isActive ? ' class="ativo" aria-current="page"' : ''}>${label}</a>`;
  }

  /* ── Detectar tema atual ── */
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /* ── Injetar nav ── */
  const navEl = document.querySelector('nav.site-nav');
  if (navEl) {
    navEl.setAttribute('aria-label', 'Navegação principal');
    navEl.innerHTML = `
      <a class="nav-brand" href="${root}index.html" aria-label="Fortaleza Sub &amp; Via — página inicial">
        <div class="nav-mark" aria-hidden="true">F|V</div>
        <span class="nav-title">Memorial Urbano · Fortaleza</span>
      </a>
      <div class="nav-links" role="list">
        ${navLink('index.html', 'Mapa')}
        ${navLink('panorama.html', 'Panorama')}
        ${navLink('personalidades.html', 'Personalidades')}
      </div>
      <div style="display:flex;align-items:center;gap:.35rem">
        <button class="theme-toggle" id="theme-toggle-btn"
          aria-label="${isDark() ? 'Mudar para tema claro' : 'Mudar para tema escuro'}"
          title="${isDark() ? 'Tema claro' : 'Tema escuro'}">
          <span class="theme-icon" aria-hidden="true">${isDark() ? '☀️' : '🌙'}</span>
        </button>
        <button class="nav-hamburger" id="nav-hamburger"
          aria-label="Abrir menu de navegação"
          aria-expanded="false"
          aria-controls="nav-mobile-menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
      </div>
    `;

    /* ── Mobile menu (injected right after nav) ── */
    const mobileMenu = document.createElement('nav');
    mobileMenu.id = 'nav-mobile-menu';
    mobileMenu.className = 'nav-mobile-menu';
    mobileMenu.setAttribute('aria-label', 'Menu móvel');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.innerHTML = `
      ${navLink('index.html', 'Mapa')}
      ${navLink('panorama.html', 'Panorama')}
      ${navLink('personalidades.html', 'Personalidades')}
    `;
    navEl.insertAdjacentElement('afterend', mobileMenu);

    /* Hamburger toggle */
    const hamburger = document.getElementById('nav-hamburger');
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      hamburger.innerHTML = isOpen
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
    });
    /* Close mobile menu on outside click */
    document.addEventListener('click', function (e) {
      if (!navEl.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
      }
    });

    /* Theme toggle */
    const themeBtn = document.getElementById('theme-toggle-btn');
    themeBtn.addEventListener('click', function () {
      if (window.FSVTheme) window.FSVTheme.toggle();
    });
  }

  /* ── Injetar footer ── */
  const footerEl = document.querySelector('footer.site-footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <strong>Fortaleza Sub &amp; Via — Memorial Urbano</strong><br>
      Coordenadas: MAPP-FOR · Dados: Seinfra-CE · SOP-CE · SEINF · Diário do Nordeste · O Povo
      <nav class="footer-nav" aria-label="Links institucionais">
        <a href="${root}sobre.html">Sobre o Projeto</a>
        <a href="${root}personalidades.html">Personalidades</a>
        <a href="${root}panorama.html">Panorama</a>
        <a href="${root}metodologia.html">Metodologia</a>
        <a href="${root}apoio.html">Apoie</a>
        <a href="${root}contato.html">Contato</a>
        <a href="${root}licenca.html">Licença CC</a>
        <a href="${root}privacidade.html">Privacidade</a>
        <a href="${root}termos.html">Termos de Uso</a>
      </nav>
      CO₂e: ICE v3 (Univ. Bath) + SIDERC / IPCC AR6 · Custos: SEINFRA-CE tab.27 · SINAPI 2024<br>
      Estimativas paramétricas ±20–30%. Não substitui ACV auditada. Última revisão: Abril 2026.
    `;
  }

  /* ── Botão Voltar ao Topo ── */
  const btnTop = document.getElementById('back-to-top');
  if (btnTop) {
    window.addEventListener('scroll', function () {
      btnTop.classList.toggle('visible', window.scrollY > 300);
    });
    btnTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Register Service Worker ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(root + 'sw.js').catch(function () {/* silently fail */});
    });
  }
})();
