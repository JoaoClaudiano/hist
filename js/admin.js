// js/admin.js — Admin interface logic
'use strict';

const FORTALEZA_BBOX = { latMin: -3.9, latMax: -3.6, lngMin: -38.7, lngMax: -38.4 };

let obras = [];
let cfg = {};
let adminMap, adminMarkerLayer, posMarker;
let editingId = null;

async function adminBoot() {
  try {
    const [cfgRes, obrasRes] = await Promise.all([
      fetch('data/config.json'),
      fetch('data/obras.json')
    ]);
    cfg = await cfgRes.json();
    obras = await obrasRes.json();
    initAdminMap();
    renderObrasTable();
    renderMapPins();
  } catch (e) {
    document.getElementById('boot-error').textContent =
      '⚠️ Erro ao carregar dados: ' + e.message + '. Certifique-se de servir via servidor local (ex: python -m http.server).';
    document.getElementById('boot-error').style.display = 'block';
  }
}

function initAdminMap() {
  adminMap = L.map('admin-map', { zoomControl: true }).setView([-3.745, -38.52], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: '© CartoDB' }).addTo(adminMap);
  adminMarkerLayer = L.layerGroup().addTo(adminMap);

  adminMap.on('click', function (e) {
    const lat = e.latlng.lat.toFixed(7);
    const lng = e.latlng.lng.toFixed(7);
    document.getElementById('f-lat').value = lat;
    document.getElementById('f-lng').value = lng;
    validateCoords();
    if (posMarker) adminMap.removeLayer(posMarker);
    posMarker = L.marker([lat, lng], {
      icon: L.divIcon({ className: '', html: '<div style="width:14px;height:14px;border-radius:50%;background:#7c3aed;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>', iconSize: [14, 14], iconAnchor: [7, 7] })
    }).addTo(adminMap);
    document.getElementById('coord-status').textContent = '📍 Posição selecionada: ' + lat + ', ' + lng;
  });
}

function renderMapPins() {
  adminMarkerLayer.clearLayers();
  const COR = { tunel: '#1d4ed8', viaduto: '#b45309', ponte: '#166534' };
  obras.forEach(d => {
    if (!d.lat || !d.lng) return;
    L.marker([d.lat, d.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="width:12px;height:12px;border-radius:50%;background:${COR[d.tipo] || '#64748b'};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>`,
        iconSize: [12, 12], iconAnchor: [6, 6]
      })
    }).bindTooltip(d.nome, { permanent: false, direction: 'top' })
      .on('click', () => fillForm(d))
      .addTo(adminMarkerLayer);
  });
}

function renderObrasTable() {
  const tbody = document.getElementById('obras-tbody');
  tbody.innerHTML = '';
  obras.forEach((d, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code style="font-size:10px">${d.id}</code></td>
      <td><span class="adm-badge adm-${d.tipo}">${d.tipo}</span></td>
      <td style="font-size:12px;max-width:200px">${d.nome}</td>
      <td><span class="adm-badge adm-estagio">${d.estagio}</span></td>
      <td style="font-size:11px">${d.extensao}</td>
      <td>
        <button class="adm-btn adm-btn-edit" onclick="fillForm(obras[${i}])">Editar</button>
        <button class="adm-btn adm-btn-del" onclick="deleteObra('${d.id}')">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function fillForm(d) {
  editingId = d.id;
  document.getElementById('edit-indicator').textContent = 'Editando: ' + d.nome;
  document.getElementById('f-id').value = d.id || '';
  document.getElementById('f-tipo').value = d.tipo || 'viaduto';
  document.getElementById('f-estagio').value = d.estagio || 'FINALIZADO';
  document.getElementById('f-nome').value = d.nome || '';
  document.getElementById('f-vulgo').value = d.vulgo || '';
  document.getElementById('f-lat').value = d.lat || '';
  document.getElementById('f-lng').value = d.lng || '';
  document.getElementById('f-extensaoNum').value = d.extensaoNum || '';
  document.getElementById('f-extensao').value = d.extensao || '';
  document.getElementById('f-custoRaw').value = d.custoRaw != null ? d.custoRaw : '';
  document.getElementById('f-custoTexto').value = d.custoTexto || '';
  document.getElementById('f-construtora').value = d.construtora || '';
  document.getElementById('f-inicio').value = d.inicio || '';
  document.getElementById('f-inauguracao').value = d.inauguracao || '';
  document.getElementById('f-bairro').value = d.bairro || '';
  document.getElementById('f-metodo').value = d.metodo || '';
  document.getElementById('f-homenageado').value = d.homenageado || '';
  document.getElementById('f-fonte').value = d.fonte || '';
  // eng
  const e = d.eng || {};
  document.getElementById('f-gabarito').value = e.gabarito || '';
  document.getElementById('f-fps').value = e.fps != null ? e.fps : '';
  document.getElementById('f-ciclo').value = e.ciclo || '';
  document.getElementById('f-drenTipo').value = e.drenTipo || '';
  document.getElementById('f-drenSis').value = e.drenSis || '';
  document.getElementById('f-drenSpec').value = e.drenSpec || '';
  document.getElementById('f-fundTipo').value = e.fundTipo || '';
  document.getElementById('f-fundProf').value = e.fundProf || '';
  document.getElementById('f-fundObs').value = e.fundObs || '';
  document.getElementById('f-isTunel').checked = !!e.isTunel;

  if (d.lat && d.lng) {
    adminMap.setView([d.lat, d.lng], 15);
    if (posMarker) adminMap.removeLayer(posMarker);
    posMarker = L.marker([d.lat, d.lng], {
      icon: L.divIcon({ className: '', html: '<div style="width:14px;height:14px;border-radius:50%;background:#7c3aed;border:2px solid #fff"></div>', iconSize: [14, 14], iconAnchor: [7, 7] })
    }).addTo(adminMap);
    document.getElementById('coord-status').textContent = '📍 ' + d.lat + ', ' + d.lng;
  }
  document.getElementById('obra-form').scrollIntoView({ behavior: 'smooth' });
}

function clearForm() {
  editingId = null;
  document.getElementById('edit-indicator').textContent = 'Nova obra';
  document.getElementById('obra-form').reset();
  document.getElementById('coord-status').textContent = '';
  document.getElementById('coord-error').textContent = '';
  if (posMarker) { adminMap.removeLayer(posMarker); posMarker = null; }
}

function validateCoords() {
  const lat = parseFloat(document.getElementById('f-lat').value);
  const lng = parseFloat(document.getElementById('f-lng').value);
  const errEl = document.getElementById('coord-error');
  if (isNaN(lat) || isNaN(lng)) { errEl.textContent = ''; return true; }
  const ok = lat >= FORTALEZA_BBOX.latMin && lat <= FORTALEZA_BBOX.latMax &&
             lng >= FORTALEZA_BBOX.lngMin && lng <= FORTALEZA_BBOX.lngMax;
  errEl.textContent = ok ? '' : `⚠️ Coordenadas fora de Fortaleza (lat ${FORTALEZA_BBOX.latMin}–${FORTALEZA_BBOX.latMax}, lng ${FORTALEZA_BBOX.lngMin}–${FORTALEZA_BBOX.lngMax})`;
  return ok;
}

function saveObra(e) {
  e.preventDefault();
  if (!validateCoords()) return;

  const nova = {
    id: document.getElementById('f-id').value.trim(),
    tipo: document.getElementById('f-tipo').value,
    estagio: document.getElementById('f-estagio').value,
    nome: document.getElementById('f-nome').value.trim(),
    vulgo: document.getElementById('f-vulgo').value.trim(),
    lat: parseFloat(document.getElementById('f-lat').value),
    lng: parseFloat(document.getElementById('f-lng').value),
    extensaoNum: parseFloat(document.getElementById('f-extensaoNum').value) || null,
    extensao: document.getElementById('f-extensao').value.trim(),
    custoRaw: document.getElementById('f-custoRaw').value !== '' ? parseFloat(document.getElementById('f-custoRaw').value) : null,
    custoTexto: document.getElementById('f-custoTexto').value.trim(),
    construtora: document.getElementById('f-construtora').value.trim(),
    inicio: document.getElementById('f-inicio').value.trim(),
    inauguracao: document.getElementById('f-inauguracao').value.trim(),
    bairro: document.getElementById('f-bairro').value.trim(),
    metodo: document.getElementById('f-metodo').value.trim(),
    homenageado: document.getElementById('f-homenageado').value.trim(),
    fonte: document.getElementById('f-fonte').value.trim(),
    eng: {
      gabarito: document.getElementById('f-gabarito').value.trim(),
      fps: parseInt(document.getElementById('f-fps').value) || 0,
      ciclo: document.getElementById('f-ciclo').value.trim(),
      drenTipo: document.getElementById('f-drenTipo').value.trim(),
      drenSis: document.getElementById('f-drenSis').value.trim(),
      drenSpec: document.getElementById('f-drenSpec').value.trim(),
      fundTipo: document.getElementById('f-fundTipo').value.trim(),
      fundProf: document.getElementById('f-fundProf').value.trim(),
      fundObs: document.getElementById('f-fundObs').value.trim(),
      isTunel: document.getElementById('f-isTunel').checked
    }
  };

  const idx = obras.findIndex(o => o.id === editingId);
  if (idx >= 0) {
    obras[idx] = nova;
    document.getElementById('save-status').textContent = '✅ Obra atualizada: ' + nova.nome;
  } else {
    obras.push(nova);
    document.getElementById('save-status').textContent = '✅ Obra adicionada: ' + nova.nome;
  }
  renderObrasTable();
  renderMapPins();
  clearForm();
}

function deleteObra(id) {
  if (!confirm('Confirmar exclusão de: ' + id + '?')) return;
  obras = obras.filter(o => o.id !== id);
  renderObrasTable();
  renderMapPins();
  document.getElementById('save-status').textContent = '🗑️ Obra removida: ' + id;
}

function exportObras() {
  const json = JSON.stringify(obras, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'obras.json';
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  adminBoot();
  document.getElementById('obra-form').addEventListener('submit', saveObra);
  document.getElementById('btn-nova').addEventListener('click', clearForm);
  document.getElementById('btn-export').addEventListener('click', exportObras);
  document.getElementById('f-lat').addEventListener('input', validateCoords);
  document.getElementById('f-lng').addEventListener('input', validateCoords);
});
