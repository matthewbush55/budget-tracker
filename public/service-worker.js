// testing service worker installation
console.log("Hello from service worker!");

//after a service worker is installed, and the user navigates to a different page or refreshes, the service worker will begin to receive fetch events.
//variable to store an array of strings that represents what static files we want to cache for our application
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "css/styles.css",
  "js/index.js",
  "js/idb.js",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

//variables to store the names of our cache
const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
// console.log(self);

// *********************** INSTALL EVENT ***********************
//in this event we can determine what files we want to cache, inside of our install callback we take a few steps.  1. Open a cache  2. Cache our files  3. Confirm whether all the required assets are cached or not. when the install event fires, trigger the callback function
self.addEventListener("install", function (evt) {
  //the evt.waitUntill method takes a promise and uses it to know long installation takes and whether it was succesfful .  if all files cached, the service worker will be installed, if not the install fails
  evt.waitUntil(
    //call caches.open passing in the name of your cache
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Your files were pre-cached successfully!");
      //addAll method
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  //typically used in the install event of service worker, service worker will skip the waiting phase and becomes activated
  self.skipWaiting();
});

// *********************** ACTIVATION STEP ***********************
//managing old caches, after activating the service worker will control all the pages that fall under its scope
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    //returns a promise that resolves to an array of cache keys, returned in the same order that they were inserted
    caches.keys().then((keyList) => {
      return Promise.all(
        //mapping over the array of cache keys, if the key is not equal to the cache_name and the key is not equal to the data_cache_name, we remove the old cache for that key
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  //when a service worker is initially registered, pages wont use it until the next load event. the claim method causes the pages to be controlled immediately
  self.clients.claim();
});

// *********************** FETCH STEP ***********************
// service workers can listen for fetch requests, we are going to handle the requests that deal with api data differently than the requests that dont contain /api.  if api is in the url.
self.addEventListener("fetch", function (evt) {
  // cache successful requests to the API
  //if the event request url includes /api/ enter this code block
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      //we open our cache, run a fetch based on whatever request comes in. attempts to fetch the resource.
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return (
            fetch(evt.request)
              .then((response) => {
                //we end up in .then if its able to fetch the resource.
                // If the response was good, clone it and store it in the cache.
                if (response.status === 200) {
                  //takes the data and puts it in this data cache, store a copy of that data, necessary so later on if we are offline we can still access
                  cache.put(evt.request.url, response.clone());
                }
                //return the response, outputs the response.  what if we are offline?
                return response;
              })
              //if we are offline, we end up in the .catch. do we already have this resource in the cache?
              .catch((err) => {
                // Network request failed, try to get it from the cache.
                return cache.match(evt.request);
              })
          );
        })
        .catch((err) => console.log(err))
    );
    return;
  }
  //everything else besides /api is going to static cache. we only go to this code if the request that came in did not include /api. requesting a static file.
  evt.respondWith(
    //open our cache
    caches.open(CACHE_NAME).then((cache) => {
      //is there a matching file in our cache? if we have the resource it will output the copy from cache. if there is not a copy in cache, call fetch. attempts to find on the server. offline first approach.  html,images,css resources.  first looks to cache even if we are online, will only try to load from server as a last resort.  will speed things up for us
      return cache.match(evt.request).then((response) => {
        return response || fetch(evt.request);
      });
    })
  );
});
