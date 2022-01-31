/*jshint esversion: 6 */

const cacheName = "Jet-player";
const assets = [
  "/",
  "index.html",
  "favicon.svg",
  "img/icon.svg",
  "style.css",
  "script.js",
  "css/roboto/style.css",
  "css/fontawesome-all.min.css",
  "js/jquery.min.js",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});

