// js/calc.js — Calculation functions (depends on config loaded globally as window.CFG)
'use strict';

function calcCO2(d) {
  const ICE = CFG.ice, MAT = CFG.mat;
  const L = d.extensaoNum || 100, m = MAT[d.tipo] || MAT.viaduto;
  const cv = m.cm * L, cm = cv * 2400, am = m.am * L;
  const cc = cm * ICE.conc, ca = am * ICE.aco, cp = L * 1.2 * 0.08 * 2400 * ICE.bet;
  const cx = (cc + ca + cp) * 0.12, tot = (cc + ca + cp + cx) / 1000;
  let cls = 'A', css = 'g', clt = 'Baixo';
  if (tot > 15000) { cls = 'C'; css = 'r'; clt = 'Alto'; }
  else if (tot > 4000) { cls = 'B'; css = 'o'; clt = 'Médio'; }
  return { tot, cv, am, cc: cc / 1000, ca: ca / 1000, cp: cp / 1000, cx: cx / 1000, cls, css, clt, cm3pm: m.cm, akgpm: m.am };
}

function custoM(d) {
  const BENCH = CFG.bench;
  if (d.custoRaw && d.extensaoNum) return { v: Math.round(d.custoRaw / d.extensaoNum), real: true };
  return { v: BENCH[d.tipo]?.med || 95000, real: false };
}
