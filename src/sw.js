const CACHE_ID = "v1";
const cachedFiles = ["/gallery/404.png"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_ID).then(function (cache) {
      cache.addAll(cachedFiles);
      console.log("cache Installed");
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response) {
        console.log("returning response", reponse);
        return response;
      } else {
        return fetch(event.request)
          .then(function (response) {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            console.log("new fetch response");
            let responseClone = response.clone();

            caches.open(CACHE_ID).then(function (cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function () {
            console.log("error");
            // put another image here if we fail to find anything
            return caches.match("/gallery/404.png");
          });
      }
    })
  );
});
