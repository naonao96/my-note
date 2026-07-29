"use strict";

const OFFLINE_FILE = "/note_list/offline";
const CSS_BASE_PATH = "/static/css";
const CSS_FILES = [
    "style.css",
    "variable.css",
    "base.css",
    "common.css",
    "button.css",
    "fusen/fusen.css",
    "fusen/fusen_menu.css",
    "splash.css",
    "fusen_list.css",
    "fusen_edit.css",
    "offline.css",
    "modal.css",
    "toast.css"
].map(filename => `${CSS_BASE_PATH}/${filename}`);

const CACHE_PREFIX = "chocotto-memo-"
const CACHE_NAME = `${CACHE_PREFIX}v1`
const CACHE_FILES = [
    OFFLINE_FILE,
    ...CSS_FILES,
    "/static/manifest.json",
    "/static/images/wifi-off.svg",
    "/static/js/controllers/offlineController.js"
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
        caches.keys().then((cacheNames) => {
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

    // APIは自動的にネットワークより取得
    if (url.pathname.startsWith("/note_list/api/notes")){
        return;
    }
    
    // HTML（画面遷移）
    if (event.request.mode === "navigate"){
        event.respondWith(networkFirst(request))
        return;
    }

    // Javascript・CSS
    if (event.request.destination === "script" ||
        event.request.destination === "style"
    ){
        event.respondWith(networkFirst(request));
        return;
    }

    if (event.request.destination === "font" ||
        event.request.destination === "image" ||
        event.request.destination === "manifest"
    ){
        event.respondWith(cacheFirst(request));
        return;
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
    const cachedResponse = await caches.match(request);
    if (cachedResponse){
        return cachedResponse;
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
        const cachedResponse = await caches.match(request);
        if (cachedResponse){
            return cachedResponse;
        }

        //ネットワークにもキャッシュにも存在しない場合オフライン専用画面へ遷移
        if (request.mode === "navigate"){
            const offlineResponse = await caches.match(OFFLINE_FILE);
            if (offlineResponse){
                return offlineResponse;
            }
        }

        throw error;
    }
}