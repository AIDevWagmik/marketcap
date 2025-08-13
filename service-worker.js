const CACHE = "mcap-buy-v4"; // bump to refresh all static assets

const ASSETS = [
  "./manifest.json",

  // Icons
  "./icons/icon-192.png",
  "./icons/icon-512.png",

  // Banners
  "./banner-bottom-dark-mobile.png",
  "./banner-bottom-dark.png",
  "./banner-bottom-light-mobile.png",
  "./banner-bottom-light.png",
  "./banner-top-dark-mobile.png",
  "./banner-top-dark.png",
  "./banner-top-light-mobile.png",
  "./banner-top-light.png",

  // Images
  "./buy.png",
  "./hat.png",
  "./hat1.png",
  "./hat2.png",
  "./hat3.png",
  "./hat4.png",
  "./hat5.png",
  "./hat6.png",
  "./hat7.png",
  "./hat8.png",
  "./hat9.png",
  "./hat10.png",
  "./jupiter.png",
  "./marketcap-banner.png",
  "./mcap.png",
  "./meme1.png",
  "./meme2.png",
  "./meme3.png",
  "./meme4.png",
  "./meme5.png",
  "./meme6.png",
  "./meme7.png",
  "./meme8.png",
  "./meme9.png",
  "./telegram.png",
  "./x_image.png",
  "./placeholder.png",

  // Video
  "./mcap.MP4"
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
  const req = e.request;

  // Network-first for HTML pages
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for all other assets
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
