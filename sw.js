const CACHE_NAME = 'escaner-inventario-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://unpkg.com/html5-qrcode'
];

// Instalar el Service Worker y guardar en caché los archivos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar el Service Worker y limpiar cachés antiguas si las hay
self.addEventListener('activate', (event) => {
  event.waitUntil(
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
  self.clients.claim();
});

// Interceptación de peticiones para servir desde el caché si no hay internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Devuelve el archivo en caché, o va a la red si no está guardado
      return cachedResponse || fetch(event.request);
    })
  );
});