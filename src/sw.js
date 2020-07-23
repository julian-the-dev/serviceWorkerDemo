const CACHE_ID = 'v1';

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_ID).then(function (cache) {
      console.log("cache opened!");
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("fetch listener");
  event.respondWith(
    caches.match(event.request).then(function (response) {
        console.log("DO i pass here ?");
      // caches.match() always resolves
      // but in case of success response will have value
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (response) {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            let responseClone = response.clone();

            caches.open(CACHE_ID).then(function (cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function () {
              // put another image here if we fail to find anything
            return caches.match("/sw-test/gallery/myLittleVader.jpg");
          });
      }
    })
  );
});
