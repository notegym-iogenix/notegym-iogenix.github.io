/* Libreta iO.GENIX · service worker (funciona sin conexión).
 * Al publicar cambios, sube CACHE para que los móviles cojan la versión nueva. */
const CACHE = 'libreta-iogenix-v1.0.0';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'css/app.css?v=1.0.0',
  'js/data.js?v=1.0.0', 'js/core.js?v=1.0.0', 'js/advice.js?v=1.0.0', 'js/share.js?v=1.0.0', 'js/timer.js?v=1.0.0', 'js/app.js?v=1.0.0',
  'fonts/montserrat-latin-400-normal.woff2', 'fonts/montserrat-latin-600-normal.woff2', 'fonts/montserrat-latin-700-normal.woff2', 'fonts/montserrat-latin-800-normal.woff2',
  'fonts/barlow-condensed-latin-700-normal.woff2', 'fonts/barlow-condensed-latin-700-italic.woff2',
  'img/logo.svg', 'img/icon-192.png', 'img/icon-512.png', 'img/favicon.png', 'img/apple-touch-icon.png',
  'img/whey.webp', 'img/isoluxe.webp', 'img/vegan.webp', 'img/casein.webp', 'img/crealuxe.webp', 'img/arroz.webp',
  'img/oat.webp', 'img/hydra.webp', 'img/intra.webp', 'img/mag3.webp', 'img/vitc.webp',
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  // navegación: red primero (para coger versiones nuevas), caché si no hay conexión
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('index.html', cp)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; })));
});
