// js/map.js — Leaflet map initialization and rendering
'use strict';

let map, mg;

function initMap() {
  map = L.map('map-container', { zoomControl: false }).setView([-3.745, -38.52], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: '© CartoDB' }).addTo(map);
  L.control.zoom({ position: 'topright' }).addTo(map);
  mg = L.layerGroup().addTo(map);
}

function mkIcon(d) {
  const COR = CFG.cores;
  let c = COR[d.tipo];
  if (d.estagio === 'EM EXECUÇÃO') c = '#7c3aed';
  if (d.estagio === 'A INICIAR') c = '#64748b';
  const o = d.estagio !== 'FINALIZADO' ? .65 : 1;
  return L.divIcon({
    className: 'oae-pin',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${c};border:2.5px solid rgba(255,255,255,.88);box-shadow:0 2px 8px rgba(0,0,0,.25);opacity:${o}"></div>`,
    iconSize: [16, 16], iconAnchor: [8, 8]
  });
}

function renderMapa(f = 'todos') {
  mg.clearLayers();
  OBRAS.forEach(d => {
    if (f !== 'todos' && d.tipo !== f) return;
    L.marker([d.lat, d.lng], { icon: mkIcon(d) })
      .on('click', () => { abrirPainel(d); map.setView([d.lat, d.lng], 15, { animate: true }); })
      .addTo(mg);
  });
}
