const cacheConst = {
  CACHE_ID: "v1",
  CACHED_FILES: ["/gallery/404.png"],
};

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheConst.CACHE_ID).then(function (cache) {
      cache.addAll(cacheConst.CACHED_FILES);
      console.log("cache Installed for ID: ", cacheConst.CACHE_ID);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
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

            caches.open(cacheConst.CACHE_ID).then(function (cache) {
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
