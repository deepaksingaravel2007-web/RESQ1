// RESQ Emergency Platform Service Worker
const CACHE_NAME = 'resq-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let browser handle network requests with stale-while-revalidate where appropriate
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
