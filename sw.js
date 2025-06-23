const CACHE_VERSION = 'v2';
const STATIC_CACHE = `mctech-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `mctech-dynamic-${CACHE_VERSION}`;
const IMMUTABLE_CACHE = `mctech-immutable-${CACHE_VERSION}`;

// Recursos estáticos essenciais para o funcionamento offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/main.min.css',
  '/assets/js/main.min.js'
];

// Recursos que raramente mudam
const IMMUTABLE_ASSETS = [
  '/assets/images/logo.webp',
  '/assets/images/logo.jpg',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png'
];

// Estratégia de cache por tipo de recurso
const cacheStrategies = {
  // Cache-first para recursos estáticos (CSS, JS, imagens)
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    
    try {
      const networkResponse = await fetch(request);
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      // Fallback para recursos que não podem ser buscados
      return new Response('Recurso não disponível offline', { status: 408 });
    }
  },
  
  // Network-first para conteúdo dinâmico (API, dados)
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request);
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      return cachedResponse || new Response('Recurso não disponível offline', { status: 408 });
    }
  },
  
  // Stale-while-revalidate para recursos que podem ser atualizados em segundo plano
  staleWhileRevalidate: async (request) => {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request)
      .then(networkResponse => {
        const responseToCache = networkResponse.clone();
        caches.open(DYNAMIC_CACHE)
          .then(cache => cache.put(request, responseToCache));
        return networkResponse;
      });
    
    return cachedResponse || fetchPromise;
  }
};

// Determina qual estratégia usar com base no URL
const getStrategy = (url) => {
  const requestURL = new URL(url);
  
  // Recursos estáticos usam cache-first
  if (requestURL.pathname.match(/\.(css|js|webp|jpg|png|svg|ico)$/)) {
    return cacheStrategies.cacheFirst;
  }
  
  // HTML usa stale-while-revalidate para manter atualizado
  if (requestURL.pathname.endsWith('/') || requestURL.pathname.endsWith('.html')) {
    return cacheStrategies.staleWhileRevalidate;
  }
  
  // API e outros recursos dinâmicos usam network-first
  if (requestURL.pathname.includes('/api/')) {
    return cacheStrategies.networkFirst;
  }
  
  // Default para outros recursos
  return cacheStrategies.cacheFirst;
};

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(STATIC_ASSETS)),
      
      // Cache imutável
      caches.open(IMMUTABLE_CACHE)
        .then(cache => cache.addAll(IMMUTABLE_ASSETS))
    ])
    .then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMMUTABLE_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      })
      .then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar requisições para outros domínios
  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== location.origin) return;
  
  // Aplicar estratégia apropriada
  const strategy = getStrategy(event.request.url);
  event.respondWith(strategy(event.request));
});
