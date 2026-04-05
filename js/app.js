// js/app.js — Main initialization: loads config + obras, then boots the app
'use strict';

async function boot() {
  // Load config and obras in parallel
  const [cfgRes, obrasRes] = await Promise.all([
    fetch('data/config.json'),
    fetch('data/obras.json')
  ]);
  window.CFG   = await cfgRes.json();
  window.OBRAS = await obrasRes.json();

  // Populate hero counters
  document.getElementById('count-t').textContent = OBRAS.filter(d => d.tipo === 'tunel').length;
  document.getElementById('count-v').textContent = OBRAS.filter(d => d.tipo === 'viaduto').length;
  document.getElementById('count-p').textContent = OBRAS.filter(d => d.tipo === 'ponte').length;

  // Init map
  initMap();

  // Filter buttons
  document.querySelectorAll('.btn-filtro').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMapa(btn.dataset.filtro);
    renderCards(btn.dataset.filtro);
  }));

  // Initial render
  renderMapa();
  renderCards();
  requestAnimationFrame(() => requestAnimationFrame(makeGlobalCharts));

  console.log(`✅ Fortaleza Sub & Via v6 — ${OBRAS.filter(d=>d.tipo==='tunel').length}T · ${OBRAS.filter(d=>d.tipo==='viaduto').length}V · ${OBRAS.filter(d=>d.tipo==='ponte').length}P`);
}

boot().catch(err => console.error('Boot failed:', err));
