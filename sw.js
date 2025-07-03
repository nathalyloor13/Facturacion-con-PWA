const CACHE_NAME = 'facturacion-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/javascript/navegacion.js',
  '/javascript/main/clientesMain.js',
  '/javascript/main/productosMain.js',
  '/javascript/main/facturasMain.js',
  '/javascript/modulos/clientes.js',
  '/javascript/modulos/productos.js',
  '/javascript/modulos/facturas.js',
  '/manifest.json',
  '/offline/offline.html'
];

// Cachear durante la instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Limpiar versiones antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Si es navegación, devolver el offline.html
          if (event.request.mode === 'navigate') {
            return caches.match('/offline/offline.html');
          }

          // Para JS/CSS/etc no disponibles en caché, devuelve un Response vacío seguro
          return new Response('Archivo no disponible offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});
