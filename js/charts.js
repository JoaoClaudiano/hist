// js/charts.js — Chart.js wrappers (global analysis + side panel benchmark)
'use strict';

const CH_DEFAULTS = {
  responsive: false,
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(24,20,12,.88)',
      titleFont: { family: 'DM Sans', size: 11, weight: '700' },
      bodyFont: { family: 'DM Sans', size: 11 },
      padding: 10, cornerRadius: 8
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 9 }, color: '#9e9078' } },
    y: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { font: { family: 'DM Sans', size: 9 }, color: '#9e9078' } }
  }
};

function makeGlobalCharts() {
  const COR = CFG.cores;
  const allC = OBRAS.map(d => calcCO2(d));
  const names = OBRAS.map(d => d.nome.replace(/Túnel |Viaduto |Ponte /, '').substring(0, 14));
  const tipC = OBRAS.map(d => COR[d.tipo] + 'cc');

  const W = document.querySelector('.canvas-wrap').clientWidth || 500;
  const H = 240;

  function setSize(id) {
    const c = document.getElementById(id);
    c.width = W; c.height = H;
    c.style.width = W + 'px'; c.style.height = H + 'px';
  }
  ['ch-co2', 'ch-cost', 'ch-tipo', 'ch-conc'].forEach(setSize);

  const BASE_OPT = { ...CH_DEFAULTS, plugins: { ...CH_DEFAULTS.plugins, legend: { display: false } } };

  new Chart(document.getElementById('ch-co2'), {
    type: 'bar',
    data: { labels: names, datasets: [{ data: allC.map(c => +(c.tot / 1000).toFixed(1)), backgroundColor: tipC, borderRadius: 4 }] },
    options: { ...BASE_OPT, plugins: { ...BASE_OPT.plugins, tooltip: { ...CH_DEFAULTS.plugins.tooltip, callbacks: { label: c => ' ' + c.raw + ' ktCO₂e' } } }, scales: { ...CH_DEFAULTS.scales, y: { ...CH_DEFAULTS.scales.y, ticks: { ...CH_DEFAULTS.scales.y.ticks, callback: v => v + 'k t' } } } }
  });

  const cdata = OBRAS.map(d => { const cm = custoM(d); return { v: +(cm.v / 1000).toFixed(1), real: cm.real }; });
  new Chart(document.getElementById('ch-cost'), {
    type: 'bar',
    data: {
      labels: names, datasets: [
        { label: 'Real', data: cdata.map(c => c.real ? c.v : null), backgroundColor: 'rgba(24,20,12,.8)', borderRadius: 4 },
        { label: 'Est. ★', data: cdata.map(c => !c.real ? c.v : null), backgroundColor: 'rgba(158,144,120,.45)', borderRadius: 4 }
      ]
    },
    options: { ...BASE_OPT, plugins: { ...BASE_OPT.plugins, legend: { display: true, labels: { font: { family: 'DM Sans', size: 9 }, color: '#9e9078', boxWidth: 10 } }, tooltip: { ...CH_DEFAULTS.plugins.tooltip, callbacks: { label: c => ' R$ ' + c.raw + 'k/m' } } }, scales: { ...CH_DEFAULTS.scales, y: { ...CH_DEFAULTS.scales.y, ticks: { ...CH_DEFAULTS.scales.y.ticks, callback: v => 'R$' + v + 'k' } } } }
  });

  const tipos = ['tunel', 'viaduto', 'ponte'];
  const medT = tipos.map(t => { const a = OBRAS.filter(d => d.tipo === t).map(d => calcCO2(d).tot / 1000); return a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : 0; });
  new Chart(document.getElementById('ch-tipo'), {
    type: 'doughnut',
    data: { labels: ['Túnel', 'Viaduto', 'Ponte'], datasets: [{ data: medT, backgroundColor: [COR.tunel + 'cc', COR.viaduto + 'cc', COR.ponte + 'cc'], borderWidth: 0, hoverOffset: 8 }] },
    options: { responsive: false, animation: false, plugins: { legend: { display: true, position: 'bottom', labels: { font: { family: 'DM Sans', size: 10 }, color: '#5a4e38', padding: 10 } }, tooltip: { ...CH_DEFAULTS.plugins.tooltip, callbacks: { label: c => ' ' + c.raw + ' ktCO₂e (média)' } } } }
  });

  new Chart(document.getElementById('ch-conc'), {
    type: 'bar',
    data: { labels: names, datasets: [{ data: allC.map(c => +c.cv.toFixed(0)), backgroundColor: tipC, borderRadius: 4 }] },
    options: { ...BASE_OPT, plugins: { ...BASE_OPT.plugins, tooltip: { ...CH_DEFAULTS.plugins.tooltip, callbacks: { label: c => ' ' + c.raw.toLocaleString('pt-BR') + ' m³' } } }, scales: { ...CH_DEFAULTS.scales, y: { ...CH_DEFAULTS.scales.y, ticks: { ...CH_DEFAULTS.scales.y.ticks, callback: v => v.toLocaleString('pt-BR') } } } }
  });

  const totCO2 = allC.reduce((s, c) => s + c.tot, 0);
  const totConc = allC.reduce((s, c) => s + c.cv, 0);
  const totAco = allC.reduce((s, c) => s + c.am, 0) / 1000;
  const comC = OBRAS.filter(d => d.custoRaw);
  const medCm = comC.length ? comC.reduce((s, d) => s + d.custoRaw / d.extensaoNum, 0) / comC.length : 0;
  const totExt = OBRAS.reduce((s, d) => s + (d.extensaoNum || 0), 0) / 1000;
  document.getElementById('analise-kpis').innerHTML = `
    <div class="kpi-s"><span class="lbl">CO₂e Total Est.</span><span class="num">${(totCO2 / 1000).toFixed(0)}<span class="unit"> ktCO₂e</span></span></div>
    <div class="kpi-s"><span class="lbl">Concreto C35 Est.</span><span class="num">${(totConc / 1000).toFixed(0)}<span class="unit"> mil m³</span></span></div>
    <div class="kpi-s"><span class="lbl">Aço CA-50 Est.</span><span class="num">${totAco.toFixed(0)}<span class="unit"> ton</span></span></div>
    <div class="kpi-s"><span class="lbl">Custo Médio/m (real)</span><span class="num">${medCm ? 'R$ ' + (medCm / 1000).toFixed(0) + 'k' : 'N/D'}<span class="unit">/m</span></span></div>
    <div class="kpi-s"><span class="lbl">Obras com custo real</span><span class="num">${comC.length}<span class="unit"> / ${OBRAS.length}</span></span></div>
    <div class="kpi-s"><span class="lbl">Extensão total catálogo</span><span class="num">${totExt.toFixed(2)}<span class="unit"> km</span></span></div>`;
  document.getElementById('analise-nota').textContent = `Análise de ${OBRAS.length} obras (${totExt.toFixed(2)} km). CO₂e: ICE v3 + SIDERC (±20–30%). ${comC.length} obras com custo real isolado; demais com média SEINFRA-CE (★). Tipos: ${OBRAS.filter(d => d.tipo === 'tunel').length} túneis · ${OBRAS.filter(d => d.tipo === 'viaduto').length} viadutos · ${OBRAS.filter(d => d.tipo === 'ponte').length} pontes.`;
}

let spChartInst = null;

function buildSpChart(d) {
  if (spChartInst) { spChartInst.destroy(); spChartInst = null; }
  const cv = document.getElementById('sp-chart');
  const ref = CFG.bench[d.tipo], cm = custoM(d);
  const COR = CFG.cores;
  const labels = ['Mínimo', 'Esta Obra', 'Média', 'Máximo'];
  const vals = [ref.min / 1000, cm.v / 1000, ref.med / 1000, ref.max / 1000];
  const bgs = ['rgba(158,144,120,.25)', cm.real ? COR[d.tipo] + 'dd' : 'rgba(158,144,120,.55)', 'rgba(158,144,120,.25)', 'rgba(158,144,120,.25)'];
  spChartInst = new Chart(cv, {
    type: 'bar',
    data: { labels, datasets: [{ data: vals, backgroundColor: bgs, borderRadius: 5, borderWidth: 0 }] },
    options: {
      responsive: false, animation: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(24,20,12,.88)', titleFont: { family: 'DM Sans', size: 11, weight: '700' }, bodyFont: { family: 'DM Sans', size: 11 }, padding: 10, cornerRadius: 8, callbacks: { label: c => ' R$ ' + c.raw + 'k/m' } } },
      scales: { x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 9 }, color: '#9e9078' } }, y: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { font: { family: 'DM Sans', size: 9 }, color: '#9e9078', callback: v => 'R$' + v + 'k' } } }
    }
  });
}
