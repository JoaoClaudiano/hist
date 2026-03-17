// Estado global
let mapa;
let tuneis = [];
let viadutos = [];
let detalhesTuneis = {};
let detalhesViadutos = {};

// Ícones
const iconeTunel = L.divIcon({
    className: 'custom-div-icon',
    html: '<div style="background: #0066cc; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20], iconAnchor: [10, 10]
});

const iconeViaduto = L.divIcon({
    className: 'custom-div-icon',
    html: '<div style="background: #cc3300; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20], iconAnchor: [10, 10]
});

// Inicialização
async function init() {
    await carregarDados();
    initMap();
    adicionarMarcadores();
}

async function carregarDados() {
    try {
        // Carrega listas básicas
        const [tuneisRes, viadutosRes, detalhesTuneisRes, detalhesViadutosRes] = await Promise.all([
            fetch('dados/tuneis.json'),
            fetch('dados/viadutos.json'),
            fetch('dados/sobre-tuneis.json'),
            fetch('dados/sobre-viadutos.json')
        ]);

        tuneis = await tuneisRes.json();
        viadutos = await viadutosRes.json();
        detalhesTuneis = await detalhesTuneisRes.json();
        detalhesViadutos = await detalhesViadutosRes.json();

        // Atualiza estatísticas no painel
        document.querySelector('.painel-stats').innerHTML = `
            <p><i class="fas fa-database"></i> ${tuneis.length} túneis · ${viadutos.length} viadutos · projetos 2026</p>
            <p style="margin-top: 8px;"><i class="fas fa-quote-right"></i> "Quem não conhece a história, vive como se fosse um forasteiro na própria cidade."</p>
        `;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        document.querySelector('.painel-stats').innerHTML = '<p>Erro ao carregar dados. Tente novamente.</p>';
    }
}

function initMap() {
    mapa = L.map('map').setView([-3.750, -38.540], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    mapa.on('click', mostrarPainelInicial);
}

function adicionarMarcadores() {
    // Adiciona túneis
    tuneis.forEach(item => {
        const marcador = L.marker(item.coordenadas, { icon: iconeTunel }).addTo(mapa);
        const detalhe = detalhesTuneis[item.id] || {};
        const descricaoCurta = detalhe.descricao ? detalhe.descricao.substring(0, 70) + '…' : 'Detalhes em breve.';
        
        const popupContent = `
            <div class="custom-popup">
                <div class="popup-titulo">${item.nome}</div>
                <span class="popup-tipo">Túnel · ${item.ano}</span>
                <p style="margin: 6px 0; font-size: 0.85rem;">${descricaoCurta}</p>
                <button class="popup-botao" onclick="window.abrirDetalhes('tunel', ${item.id})">
                    <i class="fas fa-book-open"></i> Ler história completa
                </button>
            </div>
        `;
        marcador.bindPopup(popupContent, { className: 'custom-popup', minWidth: 220 });
        marcador.bindTooltip(item.nome, { direction: 'top' });
    });

    // Adiciona viadutos
    viadutos.forEach(item => {
        const marcador = L.marker(item.coordenadas, { icon: iconeViaduto }).addTo(mapa);
        const detalhe = detalhesViadutos[item.id] || {};
        const descricaoCurta = detalhe.descricao ? detalhe.descricao.substring(0, 70) + '…' : 'Detalhes em breve.';
        
        const popupContent = `
            <div class="custom-popup">
                <div class="popup-titulo">${item.nome}</div>
                <span class="popup-tipo">Viaduto · ${item.ano}</span>
                <p style="margin: 6px 0; font-size: 0.85rem;">${descricaoCurta}</p>
                <button class="popup-botao" onclick="window.abrirDetalhes('viaduto', ${item.id})">
                    <i class="fas fa-book-open"></i> Ler história completa
                </button>
            </div>
        `;
        marcador.bindPopup(popupContent, { className: 'custom-popup', minWidth: 220 });
        marcador.bindTooltip(item.nome, { direction: 'top' });
    });
}

// Função global para o botão do popup
window.abrirDetalhes = function(tipo, id) {
    let item, detalhe;
    if (tipo === 'tunel') {
        item = tuneis.find(t => t.id === id);
        detalhe = detalhesTuneis[id];
    } else {
        item = viadutos.find(v => v.id === id);
        detalhe = detalhesViadutos[id];
    }

    if (!item || !detalhe) return;

    const cor = tipo === 'tunel' ? '#0066cc' : '#cc3300';
    const icone = tipo === 'tunel' ? 'fa-tunnel' : 'fa-bridge';

    let html = `
        <div class="painel-header" style="border-bottom-color: ${cor};">
            <i class="fas ${icone}" style="background: ${cor}20; color: ${cor};"></i>
            <h2>${item.nome}</h2>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 0.8rem;">
            <span class="tag-local"><i class="fas fa-tag" style="color: ${cor};"></i> ${tipo === 'tunel' ? 'Túnel' : 'Viaduto'}</span>
            <span class="tag-local"><i class="fas fa-calendar"></i> ${item.ano}</span>
        </div>
        <p><strong><i class="fas fa-map-pin"></i> Localização:</strong> ${item.localizacao}</p>
        <div style="background: #f0f7ff; padding: 0.8rem; border-radius: 16px; margin: 1rem 0;">
            <i class="fas fa-hard-hat"></i> ${detalhe.descricao || 'Descrição não disponível.'}
        </div>
    `;

    if (detalhe.personalidade) {
        html += `
            <div class="homenagem-card">
                <div class="homenagem-nome"><i class="fas fa-star"></i> ${detalhe.personalidade.nome || 'Homenagem'}</div>
                <div class="homenagem-bio">${detalhe.personalidade.biografia || ''}</div>
        `;
        if (detalhe.personalidade.curiosidades) {
            html += `<div class="curiosidade"><i class="fas fa-lightbulb"></i> ${detalhe.personalidade.curiosidades}</div>`;
        }
        html += `</div>`;
    }

    html += `<div class="fonte-badge"><i class="fas fa-book"></i> ${detalhe.fonte || 'Fonte não informada'}</div>`;

    document.getElementById('painel').innerHTML = html;
    mapa.closePopup();
};

function mostrarPainelInicial() {
    document.getElementById('painel').innerHTML = `
        <div class="painel-header"><i class="fas fa-hand-pointer"></i><h2>Memória das obras</h2></div>
        <div class="painel-intro">
            <p><i class="fas fa-info-circle" style="color:#1a4b6d;"></i> Clique nos <strong>círculos coloridos</strong> do mapa: <span class="tunel-destaque">azul (túnel)</span> ou <span class="viaduto-destaque">vermelho (viaduto)</span>. Um popup aparecerá com um resumo; para ver a história completa, clique em "Ler história completa".</p>
        </div>
        <div class="painel-stats">
            <p><i class="fas fa-database"></i> ${tuneis.length} túneis · ${viadutos.length} viadutos · projetos 2026</p>
            <p style="margin-top: 8px;"><i class="fas fa-quote-right"></i> "Quem não conhece a história, vive como se fosse um forasteiro na própria cidade."</p>
        </div>
    `;
}

// Inicia quando a página carregar
document.addEventListener('DOMContentLoaded', init);
