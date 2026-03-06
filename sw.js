const CACHE = 'psicoapp-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Siempre red para HTML y Supabase, cache solo para assets estáticos
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('.html') || url.includes('supabase.co') || url.includes('functions/v1')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return resp;
    }))
  );
});
