"use strict"

if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("/sw.js")
    .then((success) => {
        console.log("サービスワーカの登録成功", success);
    })
    .catch((error) => {
        console.error("サービスワーカの登録失敗", error);
    });
};

Notification.requestPermission()
    .then((permission) => {
        console.log("通知権限:", permission);
    });