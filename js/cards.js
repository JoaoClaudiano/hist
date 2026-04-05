// js/cards.js — Cards grid rendering
'use strict';

function renderCards(f = 'todos') {
  const TL = CFG.tipoLabels, SC = CFG.estagioClasses, SL = CFG.estagioLabels;
  const g = document.getElementById('cards-grid');
  g.innerHTML = '';
  OBRAS.filter(d => f === 'todos' || d.tipo === f).forEach(d => {
    const c2 = calcCO2(d);
    const fim = d.inauguracao.length > 16 ? d.inauguracao.substring(0, 10) + '…' : d.inauguracao;
    const el = document.createElement('div');
    el.className = `card ${d.tipo}`;
    el.innerHTML = `
      <div class="card-badges"><span class="badge ${d.tipo}">${TL[d.tipo]}</span><span class="badge ${SC[d.estagio] || 's-pend'}">${SL[d.estagio] || d.estagio}</span></div>
      <h3>${d.nome}</h3><p class="card-vulgo">${d.vulgo}</p>
      <div class="card-meta">
        <div class="meta-item"><span class="lbl">Extensão</span><span class="val">${d.extensao.split('(')[0].trim()}</span></div>
        <div class="meta-item"><span class="lbl">Inauguração</span><span class="val">${fim}</span></div>
      </div>
      <div class="card-co2"><span style="font-size:11px">🌿</span><span class="co2v">~${c2.tot < 1000 ? c2.tot.toFixed(0) : (c2.tot / 1000).toFixed(1) + 'k'} tCO₂e</span><span class="co2c cls${c2.cls}">${c2.cls} — ${c2.clt}</span></div>
      <div class="card-arrow">→</div>`;
    el.addEventListener('click', () => {
      abrirPainel(d);
      document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => map.setView([d.lat, d.lng], 15, { animate: true }), 350);
    });
    g.appendChild(el);
  });
}
