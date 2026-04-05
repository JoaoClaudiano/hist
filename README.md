# Fortaleza Sub & Via — Memorial Urbano

**Catálogo interativo de Obras de Arte Especiais (OAEs) de Fortaleza/CE** — túneis, viadutos e pontes — com fichas técnicas completas, mapa interativo, análise de carbono incorporado e perfis históricos das personalidades homenageadas.

🌐 **Site:** [joaoclaudiano.github.io/hist](https://joaoclaudiano.github.io/hist)

---

## Funcionalidades

- 🗺️ **Mapa interativo** (Leaflet.js) com filtros por tipo e estágio da obra
- 📋 **Fichas técnicas** detalhadas: fundações, drenagem, método construtivo, gabarito
- 🌿 **Cálculo de carbono incorporado** (CO₂e) com classificação A/B/C por obra
- 💰 **Estimativa de custo por metro** com benchmark SEINFRA-CE/SINAPI 2024
- 👤 **Perfis de personalidades** homenageadas (19 páginas individuais)
- 📊 **Panorama analítico** com gráficos Chart.js agregados
- 🌙 **Tema claro/escuro** sem FOUC (Flash of Unstyled Content)
- 📱 **PWA** (Progressive Web App) com suporte offline via Service Worker

---

## Estrutura do Repositório

```
hist/
├── index.html              # Aplicação principal (mapa + cards + painel)
├── panorama.html           # Análise quantitativa com gráficos
├── personalidades.html     # Galeria de personalidades
├── sobre.html              # Sobre o projeto
├── metodologia.html        # Metodologia de cálculo e referências
├── apoio.html              # Como apoiar o projeto
├── contato.html            # Contato e redes sociais
├── licenca.html            # Licença Creative Commons BY-NC-SA 4.0
├── privacidade.html        # Política de privacidade
├── termos.html             # Termos de uso
├── 404.html                # Página de erro 404
├── admin.html              # Interface de administração local
├── sitemap.xml             # Sitemap para indexação
├── manifest.json           # Web App Manifest (PWA)
├── sw.js                   # Service Worker (cache offline)
│
├── css/
│   ├── shared.css          # Design system: tokens, nav, footer, componentes
│   └── index.css           # Estilos específicos da página principal
│
├── js/
│   ├── theme.js            # Tema claro/escuro (carregado no <head>)
│   ├── components.js       # Injeta nav e footer nas páginas institucionais
│   ├── calc.js             # Cálculos: CO₂e e custo por metro
│   ├── charts.js           # Gráficos Chart.js (globais e painel lateral)
│   ├── map.js              # Mapa Leaflet: inicialização e renderização
│   ├── cards.js            # Grid de cards das obras
│   ├── panel.js            # Painel lateral com ficha técnica completa
│   ├── app.js              # Boot: carrega dados e inicializa módulos
│   └── admin.js            # Lógica da interface de administração
│
├── data/
│   ├── config.json         # Configuração: ICE, benchmarks, cores, labels
│   ├── tuneis.json         # Dados dos túneis
│   ├── viadutos.json       # Dados dos viadutos
│   ├── pontes.json         # Dados das pontes
│   └── obras.schema.json   # JSON Schema para validação dos dados
│
├── personalidades/         # Páginas individuais de personalidades (19 arquivos)
├── icons/                  # Ícones PWA
│
└── .github/
    └── workflows/
        ├── bump-sw-version.yml  # Auto-bump do BUILD_ID do SW em cada push
        └── validate.yml         # Validação de JSON e estrutura HTML
```

---

## Rodando Localmente

O projeto é um site estático puro (HTML + CSS + JavaScript). **Não há build step.**

Você precisa apenas de um servidor HTTP local (o `fetch()` não funciona com `file://`):

```bash
# Opção 1: Python (disponível na maioria dos sistemas)
python3 -m http.server 8000
# Acesse: http://localhost:8000

# Opção 2: Node.js
npx serve .
# Acesse: http://localhost:3000

# Opção 3: VS Code
# Instale a extensão "Live Server" e clique em "Go Live"
```

---

## Adicionando ou Editando Obras

### Via Interface Admin (recomendado)

1. Suba o servidor local (ver acima)
2. Acesse `http://localhost:8000/admin.html`
3. Edite ou adicione obras pelo formulário
4. Clique em **Exportar** — isso gera `tuneis.json`, `viadutos.json` e `pontes.json`
5. Substitua os arquivos em `data/` e faça commit

### Manualmente

Edite diretamente os arquivos JSON em `data/`:
- `data/tuneis.json` — túneis
- `data/viadutos.json` — viadutos
- `data/pontes.json` — pontes

O schema em `data/obras.schema.json` documenta os campos obrigatórios e seus tipos. O CI valida automaticamente qualquer push.

---

## Validação de Dados

```bash
pip install jsonschema
python3 -c "
import json, jsonschema
schema = json.load(open('data/obras.schema.json'))
for f in ['data/tuneis.json', 'data/viadutos.json', 'data/pontes.json']:
    data = json.load(open(f))
    jsonschema.validate(instance=data, schema=schema)
    print(f'✅ {f} OK ({len(data)} obras)')
"
```

---

## Ordem de carregamento dos scripts

A página principal (`index.html`) requer esta ordem específica de scripts:

```
calc.js → charts.js → map.js → cards.js → panel.js → app.js
```

`theme.js` é carregado no `<head>` (sem defer) para evitar FOUC.

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 + CSS puro | Interface completa |
| JavaScript vanilla | Toda a lógica da aplicação |
| [Leaflet.js 1.9.4](https://leafletjs.com/) | Mapa interativo |
| [Chart.js 4.4](https://www.chartjs.org/) | Gráficos de análise |
| [CartoDB Basemaps](https://carto.com/basemaps/) | Tiles do mapa |
| [DM Sans + DM Serif Display](https://fonts.google.com/) | Tipografia |
| Service Worker | Cache offline (PWA) |
| GitHub Actions | CI/CD automático |
| GitHub Pages | Hospedagem |

---

## Licença

**[Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt)**

Dados de uso livre para fins não-comerciais com atribuição. Veja [licenca.html](licenca.html) para detalhes.

---

## Fontes de Dados

- **MAPP-FOR** — Mapeamento de obras públicas de Fortaleza
- **Seinfra-CE / SOP-CE / SEINF** — Secretarias de infraestrutura estadual e municipal
- **Diário do Nordeste / O Povo** — Jornalismo de dados
- **ICE v3** (University of Bath) + **SIDERC / IPCC AR6** — Coeficientes de CO₂e
- **SINAPI 2024 / SEINFRA-CE tab. 27** — Benchmarks de custo

> ⚠️ Estimativas paramétricas ±20–30%. Não substitui ACV auditada.
