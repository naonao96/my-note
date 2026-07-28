"use strict";

const CACHE_PREFIX = "chocotto-memo-"
const CACHE_NAME = `${CACHE_PREFIX}v1`
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
                    .filter((cacheName) => 
                        cacheName.startsWith(CACHE_PREFIX) && 
                        cacheName !== CACHE_NAME
                    )
                    .map((cacheName) => caches.delete(cacheName))
                )
            })
    )
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(event.request.url)

    if (request.method !== "GET" || 
        url.origin !== self.location.origin
    ){
        return;
    }
    
    // HTML（画面遷移）
    if (event.request.mode === "navigate"){
        event.respondWith(networkFirst(request))
    }

    // Javascript・CSS
    if (event.request.destination === "script" ||
        event.request.destination === "style"
    ){
        event.respondWith(networkFirst(request));
    }

    if (event.request.destination === "font" ||
        event.request.destination === "image" ||
        event.request.destination === "manifest"
    ){
        event.respondWith(cacheFirst(request));
    }
});

self.addEventListener("push", (event) => {
    console.log("ServiceWorker: push");

    event.waitUntil(
        self.registration.showNotification("ちょこっとメモ", {
            body: "プッシュ通知テスト"
        })
    );
});


//---共通関数---
/**
 * キャッシュから取得したデータを優先的に返します。優先度：キャッシュ ＞ ネットワーク
 * @param {Request} request 
 * @return {Promise<Response>}
 */
async function cacheFirst(request){
    const cachedRespond = await caches.match(request);
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

/**
 * ネットワークから取得したデータを優先的に返します。優先度：キャッシュ ＜ ネットワーク
 * @param {Request} request 
 * @return {Promise<Response>}
 */
async function networkFirst(request){
    try{
        const networkResponse = await fetch(request);
        if (networkResponse.ok){
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }
    catch(error){
        const cachedRespond = await caches.match(request);
        if (cachedRespond){
            return cachedRespond;
        }
        throw error;
    }    
}