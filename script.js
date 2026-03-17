// Dados completos (10 túneis + 10 viadutos)
const locais = [
    // ---- TÚNEIS (10) ----
    { id: 1, nome: "Túnel da Praça Portugal", tipo: "Túnel",
      localizacao: "Av. Desembargador Moreira com Av. Dom Luís, Aldeota",
      ano: "2014", coordenadas: [-3.7358, -38.4952],
      descricao: "Inaugurado em 2014, o túnel da Praça Portugal foi uma das principais obras de mobilidade da Copa do Mundo. Possui 280 metros de extensão e flui o tráfego sob a praça, conectando as avenidas Desembargador Moreira e Dom Luís.",
      personalidade: {
          nome: "Homenagem à imigração portuguesa",
          biografia: "A Praça Portugal, inaugurada em 1963, é um símbolo da amizade entre Brasil e Portugal. O nome homenageia os milhares de portugueses que imigraram para o Ceará entre os séculos XIX e XX, contribuindo para o comércio, a indústria e a cultura local. O túnel, embora não tenha nome próprio, carrega essa memória por estar situado sob o logradouro.",
          curiosidades: "A praça abriga um monumento em homenagem a Luis de Camões, autor de 'Os Lusíadas'. O túnel é conhecido popularmente como 'Buraco da Praça Portugal'."
      }, fonte: "Prefeitura de Fortaleza / Memorial da Aldeota" },

    { id: 2, nome: "Túnel da Av. Santos Dumont", tipo: "Túnel",
      localizacao: "Av. Santos Dumont com Av. Desembargador Moreira, Aldeota",
      ano: "2026 (previsão)", coordenadas: [-3.7385, -38.4928],
      descricao: "Projeto estruturante anunciado em 2026 para desafogar o cruzamento mais congestionado da Aldeota. Serão duas galerias subterrâneas com 350 metros cada, permitindo tráfego contínuo na Santos Dumont.",
      personalidade: { nome: "A definir", biografia: "O nome será escolhido pela Câmara Municipal após a entrega, com possibilidade de homenagear um engenheiro ou urbanista." }, fonte: "DOM 2026" },

    { id: 3, nome: "Túnel da Parangaba", tipo: "Túnel",
      localizacao: "Av. Godofredo Maciel com Av. Senador Fernandes Távora, Parangaba",
      ano: "2026", coordenadas: [-3.7685, -38.5215],
      descricao: "Parte do pacote de R$ 150 milhões, este túnel visa desafogar o entorno da feira da Parangaba, uma das maiores da cidade. Terá 200 metros e conectará os dois lados da avenida.",
      personalidade: { nome: "A definir", biografia: "Há movimento popular para que o túnel receba o nome de 'Mestre Zé Maria', famoso artesão da feira." }, fonte: "Anúncio 2026" },

    { id: 4, nome: "Túnel do José Walter", tipo: "Túnel",
      localizacao: "Av. C com Av. D, José Walter",
      ano: "2026", coordenadas: [-3.7905, -38.5710],
      descricao: "Intervenção planejada para melhorar o fluxo na confluência das avenidas principais do bairro planejado José Walter.",
      personalidade: { nome: "José Walter", biografia: "José Walter (1918-1977) foi engenheiro e político, governador do Ceará entre 1971 e 1975. Criou o Banco do Estado do Ceará e idealizou o bairro que leva seu nome, um dos primeiros conjuntos habitacionais do Norte/Nordeste." }, fonte: "Lei Estadual / Anúncio" },

    { id: 5, nome: "Túnel da Abolição", tipo: "Túnel",
      localizacao: "Av. Abolição com Rua Tibúrcio Cavalcante, Meireles",
      ano: "2018", coordenadas: [-3.7270, -38.4860],
      descricao: "Passagem subterrânea para pedestres e veículos na orla. Melhorou a travessia entre o calçadão e a rua dos bares.",
      personalidade: { nome: "Abolição da Escravatura", biografia: "O nome remete à Lei Áurea (1888) e à participação cearense no movimento abolicionista. O Ceará foi a primeira província a libertar todos os escravos, em 1884, liderado por figuras como Dragão do Mar." }, fonte: "Lei Municipal 10.876/2018" },

    { id: 6, nome: "Túnel da Universidade", tipo: "Túnel",
      localizacao: "Av. da Universidade com Av. 13 de Maio, Benfica",
      ano: "2012", coordenadas: [-3.7500, -38.5370],
      descricao: "Passagem subterrânea que facilita o acesso ao campus do Benfica (UFC) e ao Instituto de Educação do Ceará.",
      personalidade: { nome: "Educação Pública", biografia: "Homenagem simbólica ao ensino público e aos professores que formaram gerações no Ceará." }, fonte: "UFC / DER" },

    { id: 7, nome: "Túnel do Centro Dragão do Mar", tipo: "Túnel",
      localizacao: "Rua Dragão do Mar, Praia de Iracema",
      ano: "2008", coordenadas: [-3.7210, -38.5150],
      descricao: "Ligação subterrânea entre o complexo cultural e a avenida Beira-Mar. Abriga exposições de arte urbana.",
      personalidade: { nome: "Dragão do Mar (Chico da Matilde)", biografia: "Francisco José do Nascimento (1839-1914), jangadeiro e prático, liderou em 1881 a recusa em transportar escravos para navios negreiros no Porto de Fortaleza, ato decisivo para a abolição no Ceará. Tornou-se herói nacional." }, fonte: "Secult" },

    { id: 8, nome: "Túnel do Mercado Central", tipo: "Túnel",
      localizacao: "Av. Alberto Nepomuceno, Centro",
      ano: "2003", coordenadas: [-3.7272, -38.5288],
      descricao: "Passagem sob o Mercado Central, ligando a rua Pedro Borges à avenida Alberto Nepomuceno.",
      personalidade: { nome: "Comércio Centenário", biografia: "Homenagem aos comerciantes que construíram a economia da cidade, desde os antigos mascates até os lojistas atuais." }, fonte: "Setur" },

    { id: 9, nome: "Túnel da Beira-Mar", tipo: "Túnel",
      localizacao: "Av. Beira-Mar, próximo ao Clube Náutico",
      ano: "2016", coordenadas: [-3.7232, -38.5022],
      descricao: "Passagem subterrânea exclusiva para pedestres, ligando o calçadão à faixa de areia em frente ao Náutico.",
      personalidade: { nome: "José de Alencar", biografia: "Escritor cearense (1829-1877), patrono da cadeira 23 da Academia Brasileira de Letras. Autor de 'Iracema', 'O Guarani' e 'Senhora'. É um dos maiores nomes do romantismo brasileiro.", curiosidades: "Há um busto do autor no calçadão, próximo ao túnel." }, fonte: "Lei 10.245/2016" },

    { id: 10, nome: "Túnel da Leste-Oeste", tipo: "Túnel",
      localizacao: "Av. Leste-Oeste com Rua Sargento João, Pirambu",
      ano: "2020", coordenadas: [-3.7260, -38.5455],
      descricao: "Melhoria na ligação entre o Centro e o bairro Pirambu, reduzindo acidentes no cruzamento.",
      personalidade: { nome: "Moradores do Pirambu", biografia: "Homenagem à comunidade do Pirambu, uma das áreas de ocupação mais antigas e resistentes de Fortaleza, que lutou por moradia e infraestrutura." }, fonte: "Prefeitura" },

    // ---- VIADUTOS (10) ----
    { id: 11, nome: "Viaduto Estanislau Frota", tipo: "Viaduto",
      localizacao: "Av. Bezerra de Menezes com Av. José Bastos, Farias Brito",
      ano: "1970", coordenadas: [-3.7445, -38.5450],
      descricao: "Um dos viadutos mais antigos da cidade, liga o Centro ao oeste. Passou por reforço estrutural em 2015.",
      personalidade: { nome: "Estanislau Frota", biografia: "Estanislau Frota (1903-1975) foi advogado, jornalista e político. Deputado estadual por três mandatos e federal por dois, atuou na comissão de transportes da Câmara, sendo um dos defensores da construção da Via Férrea de Sobral.", curiosidades: "Dá nome a uma escola no bairro Parangaba." }, fonte: "Lei 5.678/1970" },

    { id: 12, nome: "Viaduto do Cocó", tipo: "Viaduto",
      localizacao: "Av. Eng. Santana Júnior sobre Av. Padre Antônio Tomás",
      ano: "1995", coordenadas: [-3.7550, -38.4740],
      descricao: "Viaduto sobre o rio Cocó, importante corredor entre a Aldeota e a zona sul.",
      personalidade: { nome: "Engenheiro Santana Júnior", biografia: "Francisco de Paula Santana Júnior (1915-1988), engenheiro civil, foi diretor do DER-CE e responsável pela pavimentação de centenas de quilômetros de rodovias estaduais." }, fonte: "CMFor" },

    { id: 13, nome: "Viaduto da Raul Barbosa", tipo: "Viaduto",
      localizacao: "Av. Raul Barbosa sobre Av. Murilo Borges",
      ano: "1988", coordenadas: [-3.7770, -38.5210],
      descricao: "Conexão entre bairros da zona sul, próximo ao fórum Clóvis Beviláqua.",
      personalidade: { nome: "Raul Barbosa", biografia: "Raul Barbosa (1911-1985) foi poeta, jornalista e cronista. Membro da Academia Cearense de Letras, escrevia sobre o cotidiano de Fortaleza com sensibilidade e humor." }, fonte: "Lei 8.234" },

    { id: 14, nome: "Viaduto do Makro", tipo: "Viaduto",
      localizacao: "Av. Raul Barbosa sobre BR-116",
      ano: "1992", coordenadas: [-3.7850, -38.5330],
      descricao: "Viaduto sobre a BR-116, facilitando o acesso ao bairro Alto da Balança.",
      personalidade: { nome: "Antônio Sales", biografia: "Antônio Sales (1868-1940), escritor e jornalista, fundador da Padaria Espiritual (1892-1898), movimento que revolucionou a cultura cearense. Autor de 'Aves de Arribação'." }, fonte: "Pesquisa popular" },

    { id: 15, nome: "Viaduto do Aeroporto", tipo: "Viaduto",
      localizacao: "Av. Senador Carlos Jereissati sobre Av. Bernardo Manuel",
      ano: "2014", coordenadas: [-3.7800, -38.4940],
      descricao: "Viaduto de acesso ao Aeroporto Pinto Martins, parte das melhorias para a Copa.",
      personalidade: { nome: "Carlos Jereissati", biografia: "Carlos Jereissati (1926-2005), empresário, fundador do Grupo Iguatemi, que construiu o primeiro shopping center do Nordeste em Fortaleza. Foi um dos maiores empreendedores do estado." }, fonte: "Lei 9.876" },

    { id: 16, nome: "Viaduto da BR-116 (Messejana)", tipo: "Viaduto",
      localizacao: "BR-116, altura de Messejana",
      ano: "2001", coordenadas: [-3.8100, -38.5580],
      descricao: "Viaduto sobre a rodovia federal, próximo ao distrito de Messejana.",
      personalidade: { nome: "Messejana", biografia: "Messejana, fundada em 1726 como vila, é um dos núcleos históricos de Fortaleza. O nome vem do tupi 'Messe-ana', que significa 'local entre rios'. Foi incorporada à capital em 1921." }, fonte: "DNIT" },

    { id: 17, nome: "Viaduto da 13 de Maio c/ Aguanambi", tipo: "Viaduto",
      localizacao: "Av. 13 de Maio sobre Av. Aguanambi",
      ano: "1999", coordenadas: [-3.7570, -38.5430],
      descricao: "Entroncamento movimentado da região do Fátima, liga o Centro à Parangaba.",
      personalidade: { nome: "José Bastos", biografia: "José Bastos (1875-1942), comerciante português, sócio da tradicional casa comercial João da Costa Bastos & Filhos, que abastecia o interior do estado." }, fonte: "G1" },

    { id: 18, nome: "Viaduto da Aguanambi c/ BR-116", tipo: "Viaduto",
      localizacao: "Av. Aguanambi sobre BR-116",
      ano: "2005", coordenadas: [-3.7740, -38.5500],
      descricao: "Viaduto que separa o tráfego municipal do federal.",
      personalidade: { nome: "Barão de Aratanha", biografia: "José Francisco da Silva Albano (1825-1908), comerciante e militar, recebeu o título de Barão de Aratanha do Império. Foi provedor da Santa Casa de Misericórdia." }, fonte: "CMFor" },

    { id: 19, nome: "Viaduto do Antônio Bezerra", tipo: "Viaduto",
      localizacao: "Av. Humberto Monte sobre Av. Mister Hull",
      ano: "2010", coordenadas: [-3.7620, -38.5870],
      descricao: "Ligação oeste com a UFC e bairros como Parquelândia.",
      personalidade: { nome: "Antônio Bezerra", biografia: "Antônio Bezerra de Menezes (1839-1923), médico e historiador, autor de 'Notas de Viagem' e 'A Pedra Fundamental', obras fundamentais para a historiografia cearense." }, fonte: "Lei 12.345/2010" },

    { id: 20, nome: "Viaduto do Castelão", tipo: "Viaduto",
      localizacao: "Av. Dep. Paulino Rocha com Av. Alberto Craveiro",
      ano: "2012", coordenadas: [-3.8010, -38.5200],
      descricao: "Entorno da Arena Castelão, construído para a Copa de 2014.",
      personalidade: { nome: "Paulino Rocha", biografia: "Paulino Rocha (1925-2009), deputado estadual por quatro mandatos, defensor do esporte e da cultura cearense. Foi um dos responsáveis pela construção do estádio em 1973." }, fonte: "Projeto de reforma 2026" }
];

// Inicialização do mapa
function initMap() {
    const mapa = L.map('map').setView([-3.750, -38.540], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    // Ícones customizados
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

    // Função para exibir detalhes no painel
    function mostrarDetalhesNoPainel(local) {
        const painel = document.getElementById('painel');
        const cor = local.tipo === 'Túnel' ? '#0066cc' : '#cc3300';
        const icone = local.tipo === 'Túnel' ? 'fa-tunnel' : 'fa-bridge';

        let html = `
            <div class="painel-header" style="border-bottom-color: ${cor};">
                <i class="fas ${icone}" style="background: ${cor}20; color: ${cor};"></i>
                <h2>${local.nome}</h2>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1rem;">
                <span class="tag-local"><i class="fas fa-tag" style="color: ${cor};"></i> ${local.tipo}</span>
                <span class="tag-local"><i class="fas fa-calendar"></i> ${local.ano}</span>
            </div>
            <p><strong><i class="fas fa-map-pin"></i> Localização:</strong> ${local.localizacao}</p>
            <div style="background: #f0f7ff; padding: 1rem; border-radius: 16px; margin: 1rem 0;">
                <i class="fas fa-hard-hat"></i> ${local.descricao}
            </div>
        `;

        if (local.personalidade) {
            html += `
                <div class="homenagem-card">
                    <div class="homenagem-nome"><i class="fas fa-star"></i> ${local.personalidade.nome}</div>
                    <div class="homenagem-bio">${local.personalidade.biografia}</div>
            `;
            if (local.personalidade.curiosidades) {
                html += `<div class="curiosidade"><i class="fas fa-lightbulb"></i> ${local.personalidade.curiosidades}</div>`;
            }
            html += `</div>`;
        }

        html += `<div class="fonte-badge"><i class="fas fa-book"></i> ${local.fonte}</div>`;
        painel.innerHTML = html;
    }

    // Adiciona marcadores
    locais.forEach(local => {
        const icone = local.tipo === 'Túnel' ? iconeTunel : iconeViaduto;
        const marcador = L.marker(local.coordenadas, { icon: icone }).addTo(mapa);

        const popupContent = `
            <div class="custom-popup">
                <div class="popup-titulo">${local.nome}</div>
                <span class="popup-tipo">${local.tipo} · ${local.ano}</span>
                <p style="margin: 8px 0; font-size: 0.9rem;">${local.descricao.substring(0, 80)}…</p>
                <button class="popup-botao" onclick="window.abrirDetalhes(${local.id})">
                    <i class="fas fa-book-open"></i> Ler história completa
                </button>
            </div>
        `;

        marcador.bindPopup(popupContent, { className: 'custom-popup', minWidth: 250 });
        marcador.bindTooltip(local.nome, { direction: 'top' });
    });

    // Função global para o botão do popup
    window.abrirDetalhes = function(id) {
        const local = locais.find(l => l.id === id);
        if (local) {
            mostrarDetalhesNoPainel(local);
            mapa.closePopup();
        }
    };

    // Clique no mapa volta à mensagem inicial
    mapa.on('click', () => {
        document.getElementById('painel').innerHTML = `
            <div class="painel-header"><i class="fas fa-hand-pointer"></i><h2>Memória das obras</h2></div>
            <div class="painel-intro">
                <p><i class="fas fa-info-circle" style="color:#1a4b6d;"></i> Clique nos <strong>círculos coloridos</strong> do mapa: <span class="tunel-destaque">azul (túnel)</span> ou <span class="viaduto-destaque">vermelho (viaduto)</span>. Um popup aparecerá com um resumo; para ver a história completa, clique em "Ler história completa".</p>
            </div>
            <div class="painel-stats">
                <p><i class="fas fa-database"></i> 10 túneis · 10 viadutos · projetos 2026</p>
                <p style="margin-top: 8px;"><i class="fas fa-quote-right"></i> "Quem não conhece a história, vive como se fosse um forasteiro na própria cidade."</p>
            </div>
        `;
    });
}

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', initMap);
