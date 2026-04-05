// js/panel.js — Side panel open/close/populate logic
'use strict';

let currentData = null;

window.abrirPainel = function (d) {
  currentData = d;
  const TL = CFG.tipoLabels, SC = CFG.estagioClasses, SL = CFG.estagioLabels, FUND_C = CFG.fundacaoCores, MAT = CFG.mat;
  const c2 = calcCO2(d), e = d.eng;

  document.getElementById('sp-badges').innerHTML = `<span class="badge ${d.tipo}">${TL[d.tipo]}</span><span class="badge ${SC[d.estagio] || 's-pend'}">${SL[d.estagio] || d.estagio}</span>`;
  document.getElementById('sp-name').textContent = d.nome;
  document.getElementById('sp-vulgo').textContent = d.vulgo ? 'Conhecido como: ' + d.vulgo : '—';
  document.getElementById('sp-dates').innerHTML = `<div class="date-pill"><span class="lbl">Início das obras</span><span class="val">${d.inicio}</span></div><div class="date-pill"><span class="lbl">Inauguração / Conclusão</span><span class="val">${d.inauguracao}</span></div>`;
  document.getElementById('sp-metodo').textContent = d.metodo;
  document.getElementById('sp-ext').textContent = d.extensao;
  document.getElementById('sp-const').textContent = d.construtora;
  document.getElementById('sp-custo').textContent = d.custoTexto;
  document.getElementById('sp-bairro').textContent = d.bairro;
  document.getElementById('sp-mappid').textContent = d.id;
  document.getElementById('sp-homen').textContent = d.homenageado;
  document.getElementById('sp-fonte').innerHTML = '<strong>Fonte:</strong> ' + d.fonte;

  document.getElementById('eg-gab').textContent = e.gabarito;
  document.getElementById('eg-fxt').textContent = e.fps > 0 ? e.fps + ' por sentido' : 'Pedonal';
  document.getElementById('eg-ftot').textContent = e.fps > 0 ? (e.fps * 2) + ' faixas totais' : '—';
  document.getElementById('eg-ciclo').textContent = e.ciclo;
  const fv = document.getElementById('eg-fxv');
  fv.innerHTML = '';
  if (e.fps > 0) {
    for (let i = 0; i < e.fps; i++) { const s = document.createElement('div'); s.className = 'fx veh'; fv.appendChild(s); }
    const sp = document.createElement('div'); sp.className = 'fx sep'; fv.appendChild(sp);
    for (let i = 0; i < e.fps; i++) { const s = document.createElement('div'); s.className = 'fx veh'; fv.appendChild(s); }
  }
  document.getElementById('eg-drt').textContent = e.drenTipo;
  document.getElementById('eg-drs').textContent = e.drenSis;
  document.getElementById('eg-drsp').textContent = e.drenSpec;
  document.getElementById('eg-fund-title').textContent = e.isTunel ? 'Contenção do Terreno' : 'Tipo de Fundação';
  document.getElementById('eg-fp').textContent = e.fundProf;
  document.getElementById('eg-fo').textContent = e.fundObs;
  const fc = FUND_C[e.fundTipo] || '#f8fafc:#64748b';
  const [fbg, fcol] = fc.split(':');
  document.getElementById('eg-fund-tag').innerHTML = `<span class="fund-tag" style="background:${fbg};color:${fcol};border-color:${fcol}22">${e.fundTipo}</span>`;

  const hc = c2.css === 'g' ? 'low' : c2.css === 'o' ? 'med' : 'high';
  document.getElementById('co2-hero-wrap').innerHTML = `<div class="co2-hero-box ${hc}"><div><span class="co2-num ${c2.css}">${c2.tot < 1000 ? c2.tot.toFixed(0) : (c2.tot / 1000).toFixed(1) + 'k'}</span><div class="co2-sub">tCO₂e — Classe ${c2.cls} (${c2.clt})</div></div><div style="font-size:1.8rem">🌿</div></div>`;
  document.getElementById('co2-bk').innerHTML = `
    <div class="co2-item"><span class="ico">🏗️</span><span class="lbl">Concreto</span><span class="val">${c2.cc.toFixed(0)} t</span></div>
    <div class="co2-item"><span class="ico">⚙️</span><span class="lbl">Aço CA-50</span><span class="val">${c2.ca.toFixed(0)} t</span></div>
    <div class="co2-item"><span class="ico">🛣️</span><span class="lbl">Pavimento</span><span class="val">${c2.cp.toFixed(0)} t</span></div>
    <div class="co2-item"><span class="ico">🔧</span><span class="lbl">Construção</span><span class="val">${c2.cx.toFixed(0)} t</span></div>
    <div class="co2-item"><span class="ico">📐</span><span class="lbl">CO₂e/metro</span><span class="val">${(c2.tot * 1000 / d.extensaoNum).toFixed(0)} kg</span></div>
    <div class="co2-item"><span class="ico">🏭</span><span class="lbl">Concreto tot.</span><span class="val">${c2.cv.toFixed(0)} m³</span></div>`;
  document.getElementById('co2-cv').textContent = c2.cv.toLocaleString('pt-BR') + ' m³';
  document.getElementById('co2-am').textContent = (c2.am / 1000).toFixed(1) + ' ton';
  document.getElementById('co2-coef').textContent = c2.cm3pm + ' m³/m (' + TL[d.tipo] + ')';
  document.getElementById('co2-ext').textContent = d.extensaoNum + ' m';
  const tk = c2.tot * 1000;
  document.getElementById('co2-equiv').innerHTML = `
    <div class="equiv-item"><span class="ico">✈️</span>${Math.round(tk / 255).toLocaleString('pt-BR')} voos Fortaleza–São Paulo (ida)</div>
    <div class="equiv-item"><span class="ico">🚗</span>${Math.round(tk / 0.21 / 1000).toLocaleString('pt-BR')} mil km de carro a gasolina</div>
    <div class="equiv-item"><span class="ico">🌳</span>${Math.round(tk / 22).toLocaleString('pt-BR')} árvores durante 1 ano para compensar</div>
    <div class="equiv-item"><span class="ico">🏠</span>${Math.round(tk / 1500)} residências brasileiras / ano</div>`;

  const cm = custoM(d), ref = CFG.bench[d.tipo];
  document.getElementById('bench-kpis').innerHTML = `
    <div class="bkpi ${cm.real ? 'hl' : ''}"><span class="lbl">Custo/m ${cm.real ? '(real)' : '(estimado)'}</span><span class="val">R$ ${(cm.v / 1000).toFixed(0)}k</span><span class="unit">/metro linear</span></div>
    <div class="bkpi"><span class="lbl">Média do segmento</span><span class="val">R$ ${(ref.med / 1000).toFixed(0)}k</span><span class="unit">/metro linear</span></div>
    <div class="bkpi"><span class="lbl">Faixa de mercado</span><span class="val">R$ ${(ref.min / 1000).toFixed(0)}–${(ref.max / 1000).toFixed(0)}k</span><span class="unit">/m</span></div>`;
  document.getElementById('bench-note').textContent = cm.real
    ? 'Valor calculado com custo real ÷ extensão catalogada.'
    : '⚠️ Custo real não disponível — exibida a média SEINFRA-CE / SINAPI 2024 como estimativa.';

  const maxConc = MAT.tunel.cm * d.extensaoNum, maxAco = MAT.tunel.am * d.extensaoNum;
  document.getElementById('mat-grid').innerHTML = `
    <div class="mat-box"><span class="lbl">Concreto C35 (est.)</span><span class="val">${c2.cv.toLocaleString('pt-BR')} <span class="unit">m³</span></span><div class="mat-bar"><div class="mat-fill" style="width:${Math.min(100, c2.cv / maxConc * 100).toFixed(0)}%;background:#1d4ed8"></div></div></div>
    <div class="mat-box"><span class="lbl">Aço CA-50 (est.)</span><span class="val">${(c2.am / 1000).toFixed(1)} <span class="unit">ton</span></span><div class="mat-bar"><div class="mat-fill" style="width:${Math.min(100, c2.am / maxAco * 100).toFixed(0)}%;background:#b45309"></div></div></div>
    <div class="mat-box"><span class="lbl">Coef. concreto</span><span class="val">${c2.cm3pm} <span class="unit">m³/m</span></span></div>
    <div class="mat-box"><span class="lbl">Coef. aço</span><span class="val">${c2.akgpm} <span class="unit">kg/m</span></span></div>`;

  switchTab('ficha');
  document.getElementById('side-panel').classList.add('open');
  document.getElementById('overlay').classList.add('visible');
};

window.fecharPainel = function () {
  document.getElementById('side-panel').classList.remove('open');
  document.getElementById('overlay').classList.remove('visible');
};

function switchTab(n) {
  document.querySelectorAll('.sp-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === n));
  document.querySelectorAll('.sp-pane').forEach(p => p.classList.toggle('active', p.id === 'pane-' + n));
  if (n === 'bench' && currentData) buildSpChart(currentData);
}

document.querySelectorAll('.sp-tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharPainel(); });
