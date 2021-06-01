var CACHE_NAME = 'my-site-cache-v1';

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache open!');
        return cache.addAll([
          '/index.html',
          '/manifest.webManifest',
          '/service-worker.js',
          '/js/index.js',
          '/images/icon.ico',
          '/images/icon.png',
          '/css/bootstrap.css'
        ]);
      })
  );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
     // remove old caches
          event.waitUntil(
    caches.keys().then(keys => Promise.all(
              keys.map(key => {
       if (key != CACHE_NAME) {
                    return caches.delete(key);
    }
         })
       )).then(() => {
         console.log('Now ready to handle fetches!');
       })
     );
 });
