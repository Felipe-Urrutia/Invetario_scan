// Nombre del caché. Cambia el 'v1' por 'v2', 'v3', etc., si en el futuro haces modificaciones a tu app para forzar la actualización.
const CACHE_NAME = 'inventario-offline-v1';

// Lista exacta de TODOS los archivos que el celular debe guardar en su memoria interna.
const ARCHIVOS_LOCALES = [
  './',
  './index.html',
  './manifest.json',
  './html5-qrcode.min.js' // Librería local del lector de códigos de barra
];

// FASE 1: INSTALACIÓN
// El celular descarga los archivos de la lista y los guarda en su disco duro.
self.addEventListener('install', event => {
  self.skipWaiting(); // Obliga a instalar la nueva versión de inmediato si hay cambios
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados exitosamente para uso offline');
        return cache.addAll(ARCHIVOS_LOCALES);
      })
  );
});

// FASE 2: ACTIVACIÓN
// Limpia rastros de versiones antiguas del caché para no saturar la memoria del celular.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(nombresDeCache => {
      return Promise.all(
        nombresDeCache.map(nombre => {
          if (nombre !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', nombre);
            return caches.delete(nombre);
          }
        })
      );
    })
  );
});

// FASE 3: INTERCEPTOR (Estrategia "Cache First" / Primero el Caché)
// Cada vez que la app necesita un archivo, lo saca del celular. Ni siquiera intenta usar internet.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(respuestaCache => {
        // Si el archivo está en la memoria, lo entrega al instante.
        if (respuestaCache) {
          return respuestaCache;
        }
        // Si por alguna razón no está, intenta buscarlo en internet como plan B.
        return fetch(event.request);
      })
  );
});