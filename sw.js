const CACHE_NAME = 'clockview-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/alarm.mp3',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-144.png',
  '/screenshot1.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://apis.google.com/js/platform.js',
  'https://flagcdn.com/w40/'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
        .map(key => {
          console.log('Removendo cache antigo:', key);
          return caches.delete(key);
        })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const requestUrl = new URL(e.request.url);
  
  // Cache-first para recursos estáticos
  if (ASSETS.some(asset => requestUrl.pathname.includes(asset))) {
    e.respondWith(
      caches.match(e.request)
        .then(response => response || fetch(e.request))
    );
    return;
  }

  // Network-first para requisições de API
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match('/'))
  );
});
