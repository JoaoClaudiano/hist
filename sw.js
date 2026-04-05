/* Fortaleza Sub & Via — Service Worker
   BUILD_ID é substituído automaticamente pelo GitHub Actions em cada push.
   Para atualizar manualmente, altere BUILD_ID abaixo. */

const BUILD_ID = 'fsv-build-5152c42';
const CACHE_NAME = `fsv-${BUILD_ID}`;

// Assets to precache (adjust if paths differ)
const PRECACHE = [
  './',
  './index.html',
  './sobre.html',
  './personalidades.html',
  './apoio.html',
  './contato.html',
  './licenca.html',
  './privacidade.html',
  './termos.html',
  './metodologia.html',
  './panorama.html',
  './css/shared.css',
  './css/index.css',
  './css/responsive.css',
  './css/fonts.css',
  './css/vendor/leaflet.css',
  './js/components.js',
  './js/theme.js',
  './js/ui.js',
  './js/calc.js',
  './js/charts.js',
  './js/map.js',
  './js/cards.js',
  './js/panel.js',
  './js/app.js',
  './js/vendor/chart.umd.min.js',
  './js/vendor/leaflet.js',
  './fonts/dm-sans-300.woff2',
  './fonts/dm-sans-400.woff2',
  './fonts/dm-sans-400-italic.woff2',
  './fonts/dm-sans-500.woff2',
  './fonts/dm-sans-600.woff2',
  './fonts/dm-sans-700.woff2',
  './fonts/dm-serif-display-400.woff2',
  './fonts/dm-serif-display-400-italic.woff2',
  './css/images/marker-icon.png',
  './css/images/marker-icon-2x.png',
  './css/images/marker-shadow.png',
  './css/images/layers.png',
  './css/images/layers-2x.png',
  './data/config.json',
  './data/tuneis.json',
  './data/viadutos.json',
  './data/pontes.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests for same-origin resources
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Network-first for data/ and APIs; cache-first for static assets
  const isData = url.pathname.startsWith('/data/');

  if (isData) {
    event.respondWith(
      fetch(event.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return res;
      }).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (res.ok && url.origin === self.location.origin) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        });
      })
    );
  }
});
