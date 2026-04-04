/**
 * Fortaleza Sub & Via — Componentes Compartilhados
 * Injeta nav e footer, detecta página ativa, botão voltar ao topo.
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
    return `<a href="${root}${href}"${isActive ? ' class="ativo"' : ''}>${label}</a>`;
  }

  /* ── Injetar nav ── */
  const navEl = document.querySelector('nav.site-nav');
  if (navEl) {
    navEl.innerHTML = `
      <a class="nav-brand" href="${root}index.html">
        <div class="nav-mark">F|V</div>
        <span class="nav-title">Memorial Urbano · Fortaleza</span>
      </a>
      <div class="nav-links">
        ${navLink('index.html', 'Mapa')}
        ${navLink('sobre.html', 'Projeto')}
        ${navLink('personalidades.html', 'Personalidades')}
        ${navLink('apoio.html', 'Apoie')}
        ${navLink('contato.html', 'Contato')}
      </div>
    `;
  }

  /* ── Injetar footer ── */
  const footerEl = document.querySelector('footer.site-footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <strong>Fortaleza Sub & Via — Memorial Urbano</strong><br>
      Coordenadas: MAPP-FOR · Dados: Seinfra-CE · SOP-CE · SEINF · Diário do Nordeste · O Povo
      <nav class="footer-nav" aria-label="Páginas institucionais">
        <a href="${root}sobre.html">Sobre o Projeto</a>
        <a href="${root}personalidades.html">Personalidades</a>
        <a href="${root}apoio.html">Apoie</a>
        <a href="${root}contato.html">Contato</a>
        <a href="${root}licenca.html">Licença CC</a>
        <a href="${root}privacidade.html">Privacidade</a>
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
})();
