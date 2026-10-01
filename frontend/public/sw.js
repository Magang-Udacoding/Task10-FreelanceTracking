const CACHE_NAME = 'omset-tracker-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Bypass service worker for API calls and non-GET requests
  if (e.request.url.includes('/api/') || e.request.method !== 'GET') {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then(response => {
        if (response) {
          return response;
        }
        // Return a generic offline error if not in cache
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
