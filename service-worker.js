self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('bodger-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/images/icon-192x192.png',
        '/images/icon-512x512.png'
        // Add any other JS or data files used
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Optional: return a fallback page or message
    })
  );
});