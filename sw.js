const VERSION = "V0.1"

const CACHE_NAME = `timely-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/timely.json"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open("cacheName_identifier");
            cache.addAll(APP_STATIC_RESOURCES);
        })(),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                    return undefined;
                }),
            );
            await clients.claim();
        })(),
    );
});

self.addEventListener("fetch", (event) => {
    //for single page PWAs only (redirects all navigation events back to index)
    /*
    if (event.request.mode === "navigate") {
        event.respondWith(caches.match("/"));
        return;
    }
    */

    //for all other request we want to interigate the cache first and the network second
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request.url);
            if (cachedResponse) { return cachedResponse;}

            return new Response(null, {status : 404});
        })(),
    );
});

