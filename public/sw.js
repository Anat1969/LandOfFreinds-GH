// שירות רשת: שומר את מעטפת האפליקציה והנכסים במטמון, כדי שתיפתח גם בלי רשת.
const CACHE = 'mamlechet-hapnim-v3';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // דף: תמיד מהרשת, כדי שלא תוצג גרסה ישנה. המטמון רק כשאין רשת.
      if (request.mode === 'navigate') {
        try {
          const response = await fetch(request);
          if (response.ok) cache.put('/index.html', response.clone());
          return response;
        } catch {
          return (await cache.match(request)) || (await cache.match('/index.html'));
        }
      }
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => null);

      return cached || (await network) || new Response('', { status: 504 });
    })
  );
});
