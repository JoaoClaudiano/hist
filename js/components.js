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
      <div class="nav-links" role="list"></div>
      <div style="display:flex;align-items:center;gap:.35rem">
        <button class="theme-toggle" id="theme-toggle-btn"
          aria-label="${isDark() ? 'Mudar para tema claro' : 'Mudar para tema escuro'}"
          title="${isDark() ? 'Tema claro' : 'Tema escuro'}">
          <span class="theme-icon" aria-hidden="true">${isDark() ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'}</span>
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
    mobileMenu.innerHTML = '';
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
  /* ── Reading Progress Bar ── */
  const _pb = document.createElement('div');
  _pb.id = 'reading-progress';
  _pb.setAttribute('role', 'progressbar');
  _pb.setAttribute('aria-valuenow', '0');
  _pb.setAttribute('aria-valuemin', '0');
  _pb.setAttribute('aria-valuemax', '100');
  _pb.setAttribute('aria-label', 'Progresso de leitura');
  document.body.appendChild(_pb);
  window.addEventListener('scroll', function () {
    var _st = window.scrollY;
    var _dh = document.documentElement.scrollHeight - window.innerHeight;
    var _pct = _dh > 0 ? Math.round((_st / _dh) * 100) : 0;
    _pb.style.width = _pct + '%';
    _pb.setAttribute('aria-valuenow', _pct);
  }, { passive: true });
})();
