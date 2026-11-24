'use strict';

// Service worker do FORJA: deixa o app abrir sem internet.
// Páginas: rede primeiro (para receber atualizações), com cópia em cache como reserva.
// Arquivos estáticos: resposta do cache na hora e atualização em segundo plano.
const VERSION = 'forja-v8'
const ASSETS = [
  './', 'index.html', 'privacidade.html', 'style.css', 'storage.js', 'app.js', 'experience.js', 'firebase.js',
  'data/taco.js', 'js/hooks.js', 'js/treino-ao-vivo.js', 'js/animacoes.js', 'js/habitos.js', 'js/alimentacao.js', 'js/privacidade.js', 'js/onboarding.js',
  'manifest.webmanifest', 'img/hero-forja.webp', 'img/equipe-forja.webp', 'img/icon-192.png', 'img/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()))
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request)
      .then((response) => {
        const copy = response.clone()
        caches.open(VERSION).then((cache) => cache.put(request, copy))
        return response
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('index.html'))))
    return
  }

  event.respondWith(caches.match(request, { ignoreSearch: true }).then((cached) => {
    const network = fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        caches.open(VERSION).then((cache) => cache.put(request, copy))
      }
      return response
    }).catch(() => cached)
    return cached || network
  }))
})
