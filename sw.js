const CACHE_NAME = 'clockview-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});