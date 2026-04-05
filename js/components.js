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
  const isIndex = currentFile === 'index.html' || currentFile === '';

  function navLink(href, label) {
    const isActive = currentFile === href;
    return `<a href="${root}${href}"${isActive ? ' class="ativo" aria-current="page"' : ''}>${label}</a>`;
  }

  /* ── Links de navegação por contexto ── */
  function buildNavLinks() {
    if (isIndex) {
      return `<a href="#mapa">Mapa</a><a href="#acervo">Acervo</a><a href="#analise">Análise</a>`;
    }
    return [
      navLink('panorama.html', 'Panorama'),
      navLink('metodologia.html', 'Metodologia'),
      navLink('personalidades.html', 'Personalidades'),
      navLink('sobre.html', 'Sobre'),
    ].join('');
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
      <div class="nav-links" role="list">${buildNavLinks()}</div>
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
    mobileMenu.innerHTML = buildNavLinks();
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
    /* Share bar — injected just before footer */
    const shareBar = document.createElement('div');
    shareBar.className = 'share-bar';
    shareBar.setAttribute('aria-label', 'Compartilhar esta página');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    shareBar.innerHTML = `
      <span class="share-label">Compartilhar:</span>
      <a class="share-btn share-fb" href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        <span>Facebook</span>
      </a>
      <a class="share-btn share-wa" href="https://wa.me/?text=${pageTitle}%20${pageUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span>WhatsApp</span>
      </a>
      <a class="share-btn share-tw" href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no X (Twitter)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4l16 16M4 20 20 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M2 4l7 9-7 9h2.5l5.5-7 5.5 7H20l-7-9 7-9h-2.5L12 11 6.5 4z"/></svg>
        <span>X</span>
      </a>
    `;
    footerEl.insertAdjacentElement('beforebegin', shareBar);

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
  let btnTop = document.getElementById('back-to-top');
  if (!btnTop) {
    btnTop = document.createElement('button');
    btnTop.id = 'back-to-top';
    btnTop.title = 'Voltar ao topo';
    btnTop.setAttribute('aria-label', 'Voltar ao topo');
    btnTop.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btnTop);
  }
  if (!btnTop.dataset.wired) {
    btnTop.dataset.wired = '1';
    window.addEventListener('scroll', function () {
      btnTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
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
