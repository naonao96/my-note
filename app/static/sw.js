"use strict";

const CACHE_NAME = "chocotto-memo-v1";
const CACHE_FILES = [
    "/static/css/style.css",
    "/static/manifest.json"
]

self.addEventListener("install", (event) => {
    console.log("ServiceWorker: install");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CACHE_FILES);
            })
    )
});

self.addEventListener("activate", (event) => {
    console.log("ServiceWorker: activate");
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME )
                    .map((cacheName) => caches.delete(cacheName))
                )
            })
    )
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(event.request.url)

    if (request.method !== "GET" || 
        url.origin !== self.location.origin || 
        !url.pathname.startsWith("/static/")
    ){
        return;
    }
    console.log("ServiceWorker: fetch", url);

    // staticファイルはCache Firstで返し、未キャッシュ時のみネットワークから取得する
    event.respondWith(
        caches.match(request).then(async (cachedRespond) => {
                if (cachedRespond){
                    return cachedRespond;
                }

                const networkResponse = await fetch(request);
                if (networkResponse.ok){
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            }
        )
    )
});

self.addEventListener("push", (event) => {
    console.log("ServiceWorker: push");

    event.waitUntil(
        self.registration.showNotification("ちょこっとメモ", {
            body: "プッシュ通知テスト"
        })
    );
});