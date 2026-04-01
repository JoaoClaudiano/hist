// Estado global
let mapa;
let tuneis = [];
let viadutos = [];
let detalhesTuneis = {};
let detalhesViadutos = {};

// ==================== MODO VERIFICAÇÃO ====================
let modoVerificacao = false;
let pendingLatlng = null;
let sugestoes = JSON.parse(localStorage.getItem('sugestoes-estruturas') || '[]');
let marcadoresSugestao = [];

function gerarId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(texto));
    return div.innerHTML;
}

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

const iconeSugestao = L.divIcon({
    className: 'custom-div-icon',
    html: '<div style="background: #e8a000; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:13px; line-height:1;">?</div>',
    iconSize: [22, 22], iconAnchor: [11, 11]
});

// Inicialização
async function init() {
    await carregarDados();
    initMap();
    adicionarMarcadores();
    carregarSugestoesDoStorage();
    initBackToTop();
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

    mapa.on('click', function(e) {
        if (modoVerificacao) {
            abrirFormularioVerificacao(e.latlng);
        } else {
            mostrarPainelInicial();
        }
    });
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

// ==================== FUNÇÕES DE VERIFICAÇÃO ====================

window.toggleModoVerificacao = function() {
    modoVerificacao = !modoVerificacao;
    const btn = document.getElementById('btn-verificar');
    if (modoVerificacao) {
        btn.classList.add('ativo');
        btn.innerHTML = '<i class="fas fa-times"></i> Cancelar';
        mapa.getContainer().style.cursor = 'crosshair';
    } else {
        btn.classList.remove('ativo');
        btn.innerHTML = '<i class="fas fa-map-pin"></i> Indicar estrutura';
        mapa.getContainer().style.cursor = '';
        mapa.closePopup();
    }
};

function abrirFormularioVerificacao(latlng) {
    pendingLatlng = latlng;
    const osmUrl = `https://www.openstreetmap.org/#map=18/${latlng.lat.toFixed(5)}/${latlng.lng.toFixed(5)}`;
    const content = `
        <div class="verificacao-form">
            <div class="verificacao-titulo"><i class="fas fa-map-pin"></i> Indicar estrutura</div>
            <label>Nome da estrutura*</label>
            <input type="text" id="verif-nome" placeholder="Ex: Viaduto Castelo Branco" maxlength="100">
            <label>Tipo*</label>
            <select id="verif-tipo">
                <option value="viaduto">Viaduto</option>
                <option value="tunel">Túnel</option>
            </select>
            <label>Observação (opcional)</label>
            <input type="text" id="verif-nota" placeholder="Ex: estrutura demolida, incompleta..." maxlength="200">
            <a class="link-osm" href="${osmUrl}" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt"></i> Verificar localização no OpenStreetMap
            </a>
            <div class="verificacao-acoes">
                <button class="btn-salvar-verif" onclick="window.salvarSugestao()">
                    <i class="fas fa-check"></i> Salvar
                </button>
                <button class="btn-cancelar-verif" onclick="window.fecharVerificacao()">Cancelar</button>
            </div>
        </div>
    `;
    L.popup({ className: 'popup-verificacao', minWidth: 260, maxWidth: 300 })
        .setLatLng(latlng)
        .setContent(content)
        .openOn(mapa);
}

window.fecharVerificacao = function() {
    mapa.closePopup();
};

window.salvarSugestao = function() {
    if (!pendingLatlng) return;
    const nomeInput = document.getElementById('verif-nome');
    const nome = nomeInput ? nomeInput.value.trim() : '';
    const tipo = document.getElementById('verif-tipo') ? document.getElementById('verif-tipo').value : 'viaduto';
    const nota = document.getElementById('verif-nota') ? document.getElementById('verif-nota').value.trim() : '';

    if (!nome) {
        if (nomeInput) nomeInput.style.border = '2px solid #cc2200';
        return;
    }

    const sugestao = {
        id: gerarId(),
        nome,
        tipo,
        nota,
        lat: pendingLatlng.lat,
        lng: pendingLatlng.lng,
        data: new Date().toLocaleDateString('pt-BR')
    };
    pendingLatlng = null;

    sugestoes.push(sugestao);
    localStorage.setItem('sugestoes-estruturas', JSON.stringify(sugestoes));
    adicionarMarcadorSugestao(sugestao);
    mapa.closePopup();

    modoVerificacao = false;
    const btn = document.getElementById('btn-verificar');
    btn.classList.remove('ativo');
    btn.innerHTML = '<i class="fas fa-map-pin"></i> Indicar estrutura';
    mapa.getContainer().style.cursor = '';

    mostrarSugestoes();
};

function adicionarMarcadorSugestao(sugestao) {
    const osmUrl = `https://www.openstreetmap.org/#map=18/${sugestao.lat.toFixed(5)}/${sugestao.lng.toFixed(5)}`;
    const nomeSeguro = escapeHtml(sugestao.nome);
    const notaSegura = escapeHtml(sugestao.nota || '');
    const tipoLabel = sugestao.tipo === 'viaduto' ? 'Viaduto' : 'Túnel';

    const marcador = L.marker([sugestao.lat, sugestao.lng], { icon: iconeSugestao }).addTo(mapa);
    marcador.bindTooltip(`${nomeSeguro} (indicação)`, { direction: 'top' });
    marcador.bindPopup(`
        <div class="custom-popup">
            <div class="popup-titulo">${nomeSeguro}</div>
            <span class="popup-tipo">Indicação · ${tipoLabel}</span>
            ${notaSegura ? `<p style="margin: 6px 0; font-size: 0.85rem;">${notaSegura}</p>` : ''}
            <p style="font-size: 0.75rem; color: #666; margin-top: 6px;">Indicado em ${escapeHtml(sugestao.data)}</p>
            <a class="link-osm" href="${osmUrl}" target="_blank" rel="noopener" style="display:block; margin: 6px 0;">
                <i class="fas fa-external-link-alt"></i> Ver no OpenStreetMap
            </a>
            <button class="popup-botao" style="background:#cc4400;" onclick="window.removerSugestao('${sugestao.id}')">
                <i class="fas fa-trash"></i> Remover indicação
            </button>
        </div>
    `, { className: 'custom-popup', minWidth: 220 });
    marcadoresSugestao.push({ id: sugestao.id, marcador });
}

window.removerSugestao = function(id) {
    sugestoes = sugestoes.filter(s => s.id !== id);
    localStorage.setItem('sugestoes-estruturas', JSON.stringify(sugestoes));

    const idx = marcadoresSugestao.findIndex(m => m.id === id);
    if (idx !== -1) {
        mapa.removeLayer(marcadoresSugestao[idx].marcador);
        marcadoresSugestao.splice(idx, 1);
    }
    mapa.closePopup();
    mostrarSugestoes();
};

window.irParaMarcador = function(lat, lng) {
    mapa.setView([lat, lng], 17);
};

window.mostrarSugestoes = mostrarSugestoes;

function mostrarSugestoes() {
    const painel = document.getElementById('painel');
    if (sugestoes.length === 0) {
        mostrarPainelInicial();
        return;
    }

    let html = `
        <div class="painel-header">
            <i class="fas fa-map-pin" style="color:#e8a000; background:#fff8e8;"></i>
            <h2>Minhas indicações</h2>
        </div>
        <p style="font-size:0.85rem; color:#555; margin-bottom:1rem;">
            <i class="fas fa-info-circle"></i> Estruturas indicadas por você. Salvas localmente no navegador.
        </p>
    `;

    sugestoes.forEach(s => {
        const nomeSeguro = escapeHtml(s.nome);
        const notaSegura = escapeHtml(s.nota || '');
        const tipoLabel = s.tipo === 'viaduto' ? 'Viaduto' : 'Túnel';
        const osmUrl = `https://www.openstreetmap.org/#map=18/${s.lat.toFixed(5)}/${s.lng.toFixed(5)}`;
        const idSeguro = escapeHtml(String(s.id));

        html += `
            <div class="sugestao-card">
                <div class="sugestao-nome">${nomeSeguro}</div>
                <div class="sugestao-meta">
                    <span>🟡 ${tipoLabel}</span>
                    <span>${escapeHtml(s.data)}</span>
                </div>
                ${notaSegura ? `<div class="sugestao-nota">${notaSegura}</div>` : ''}
                <a class="link-osm" href="${osmUrl}" target="_blank" rel="noopener" style="display:inline-flex; margin-top:6px;">
                    <i class="fas fa-external-link-alt"></i> Verificar no OpenStreetMap
                </a>
                <div style="display:flex; gap:8px; margin-top:8px;">
                    <button class="btn-ir-marcador" data-lat="${s.lat}" data-lng="${s.lng}">
                        <i class="fas fa-location-dot"></i> Ver no mapa
                    </button>
                    <button class="btn-remover-sugestao" data-id="${idSeguro}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    painel.innerHTML = html;

    painel.querySelectorAll('.btn-ir-marcador').forEach(btn => {
        btn.addEventListener('click', function() {
            window.irParaMarcador(parseFloat(this.dataset.lat), parseFloat(this.dataset.lng));
        });
    });
    painel.querySelectorAll('.btn-remover-sugestao').forEach(btn => {
        btn.addEventListener('click', function() {
            window.removerSugestao(this.dataset.id);
        });
    });
}

function carregarSugestoesDoStorage() {
    sugestoes.forEach(s => adicionarMarcadorSugestao(s));
    if (sugestoes.length > 0) {
        const btn = document.getElementById('btn-verificar');
        if (btn) {
            btn.title = `${sugestoes.length} indicação(ões) salva(s)`;
        }
    }
}

// Botão Voltar ao Topo
function initBackToTop() {
    const btnTop = document.getElementById('back-to-top');
    const painel = document.getElementById('painel');
    if (!btnTop || !painel) return;

    painel.addEventListener('scroll', function () {
        if (painel.scrollTop > 300) {
            btnTop.classList.add('visible');
        } else {
            btnTop.classList.remove('visible');
        }
    });

    btnTop.addEventListener('click', function () {
        painel.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
