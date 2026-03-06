const CACHE = 'psicoapp-v1';
const ASSETS = [
  '/psicoapp-index.html',
  '/psicoapp-agenda.html',
  '/psicoapp-pacientes.html',
  '/psicoapp-pagos.html',
  '/psicoapp-pericias.html',
  '/psicoapp-whatsapp.html',
  '/psicoapp-perfil.html',
  '/login.html',
  '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // para requests a Supabase siempre ir a la red
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
