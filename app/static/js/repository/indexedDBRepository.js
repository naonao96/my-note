"use strict"

const DB_NAME = "fusen";
const DB_VERSION = 1;
const STORE_NAME = "Fusen";

function withDB(callback){
    debugger;
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
        console.error(request.error);
    };
    request.onsuccess = () => {
        let db = request.result;
        console.log("DB接続成功");
        console.log("ObjectStore一覧:", [...db.objectStoreNames]);
        callback(db);
    };
    request.onupgradeneeded = () => {
         initdb(request.result) 
    };
}

function initdb(db){
    if (!db.objectStoreNames.contains(STORE_NAME)){
        db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true
        });
    }
}

export function createLocalFusenData(requestData){
    return new Promise((resolve, reject) => {
        withDB((db) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(requestData.fusenData)

            request.onsuccess = () => {
                console.log("付箋保存", request.result);
                resolve({
                    success: true,
                    id: request.result,
                });
            };

            request.onerror = () => {
                console.error("保存失敗", request.error);
                reject(request.error);
            };
        })
    })
}

export function updateLocalFusenData(){

}

export function readLocalFusenData(){

}

export function readAllLocalFusenData(){
    return new Promise((resolve, reject) => {
        withDB((db) => {
            const transaction = db.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                console.log("データ取得成功", request.result);
                resolve({
                    success: true,
                    fusenList: request.result,
                })
            }
            request.onerror = () => {
                console.error("データ取得失敗", request.error);
                reject(request.error);
            }
        }) 
    })
}

export function deleteLocalFusenData(){

}