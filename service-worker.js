const CACHE = "mcap-buy-v1";
const ASSETS = [
  "./",               // covers index.html when served as a directory index
  "./index.html",
  "./manifest.json",
  "./buy.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Cache-first for app shell and listed assets
  if (e.request.mode === "navigate" || ASSETS.includes("." + url.pathname.split(location.pathname.replace(/[^/]+$/, "")).pop())) {
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
  }
});
