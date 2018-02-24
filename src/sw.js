const currentCacheName = new Date().toISOString();

self.addEventListener("install", event => {
  const { assets } = global.serviceWorkerOption;

  event.waitUntil(
    // cache responses of provided urls
    cacheAssets(currentCacheName, assets)
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(removeOldCaches(currentCacheName));
});

self.addEventListener("fetch", event => {
  if (event.request.url.startsWith("chrome-extension://")) {
    return;
  }
  if (event.request.url.includes("sockjs")) {
    return;
  }
  event.respondWith(
    readFromCache(currentCacheName, event.request).then(
      response => response || fetchAndCache(currentCacheName, event.request)
    )
  );
});

function removeOldCaches(newestCacheName) {
  return caches
    .keys()
    .then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== newestCacheName)
          .map(cacheName => caches.delete(cacheName))
      )
    );
}

function readFromCache(cacheName, request) {
  return caches.open(cacheName).then(cache => cache.match(request));
}

function fetchAndCache(cacheName, request) {
  return fetch(request).then(response =>
    caches.open(cacheName).then(cache => {
      cache.put(request, response.clone());
      return response;
    })
  );
}

// all urls will be added to cache
function cacheAssets(cacheName, assets) {
  return caches.open(cacheName).then(function(cache) {
    return cache.addAll([...assets, "/"]);
  });
}
