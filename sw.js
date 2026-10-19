const CACHE = 'kravmaga-v2';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Video: lasciali gestire al browser (range requests), mai dalla cache del SW
  if (url.pathname.endsWith('.mp4')) return;

  // Pagina e manifest dei video: prima la rete (sempre aggiornati), cache solo offline
  const fresh = req.mode === 'navigate' || url.pathname.endsWith('.html') ||
                url.pathname.endsWith('/video/index.json') || url.pathname.endsWith('/');
  if (fresh) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  e.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});
