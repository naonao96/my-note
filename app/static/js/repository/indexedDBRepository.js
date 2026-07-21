"use strict"

import { EDIT_MODE } from "../common/consts.js";
import { assert } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";

const DB_NAME = "fusen";
const DB_VERSION = 1;
const STORE_NAME = "Fusen";
const READ_WRITE = "readwrite";
const READ_ONLY = "readonly";

function withDB(onSuccess, onError){
    assert(onSuccess, messages.CONDITIONS_UNDIFINED_ERROR);
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
        console.error("DB接続失敗", request.error);
        onError?.(request.error);
    };
    request.onsuccess = () => {
        const db = request.result;
        console.log("DB接続成功");
        console.log("ObjectStore一覧:", [...db.objectStoreNames]);
        onSuccess(db);
    };
    request.onupgradeneeded = () => {
         initdb(request.result);
    };
}

function initdb(db){
    assert(db, messages.CONDITIONS_UNDIFINED_ERROR);
    if (!db.objectStoreNames.contains(STORE_NAME)){
        db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true
        });
    }
}

export function upsertLocalFusenData(requestData){
    assert(requestData, messages.CONDITIONS_UNDIFINED_ERROR);
    return new Promise((resolve, reject) => {
        withDB((db) => {
            const mode = requestData.form.dataset.fusenMode
            const fusenData = {
                ...requestData.fusenData
            }
            if (mode === EDIT_MODE){
                const fusenId = Number(requestData.form.dataset.fusenId);
                assert(Number.isInteger(fusenId), messages.FUSEN_ID_EXIST_ERROR);
                fusenData.id = fusenId;
            }
            const request = setStore(db, READ_WRITE).put(fusenData)
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
        }, reject)
    })
}

export function readLocalFusenData(fusenId){
    assert(Number.isInteger(fusenId), messages.FUSEN_ID_EXIST_ERROR);
    return new Promise((resolve, reject) => {
        withDB((db) => {
            const request = setStore(db, READ_ONLY).get(fusenId);
            request.onsuccess = () =>{
                console.log("データ取得成功", request.result);
                resolve({
                    success: true,
                    fusenData: request.result
                });
            };
            request.onerror = () => {
                console.log("データ取得失敗", request.error);
                reject(request.error);
            };
        }, reject)
    })
}

export function readAllLocalFusenData(){
    return new Promise((resolve, reject) => {
        withDB((db) => {
            const request = setStore(db, READ_ONLY).getAll();
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
        }, reject) 
    })
}

export function deleteLocalFusenData(fusenId){
    assert(Number.isInteger(fusenId), messages.FUSEN_ID_EXIST_ERROR);
    return new Promise((resolve, reject) => {
        withDB((db) => {
            const request = setStore(db, READ_WRITE).delete(fusenId);

            request.onsuccess = () => {
                console.log("データ削除成功", request.result);
                resolve({
                    success: true
                })
            }
            request.onerror = () => {
                console.log("データ削除失敗", request.error);
                reject(request.error);
            };
        }, reject)
    })
}

//---共通関数---
function setStore(db, tranMode){
    assert(db, messages.CONDITIONS_UNDIFINED_ERROR);
    assert(tranMode, messages.CONDITIONS_UNDIFINED_ERROR);
    const transaction = db.transaction(STORE_NAME, tranMode);
    const store = transaction.objectStore(STORE_NAME);
    assert(store, messages.CONDITIONS_UNDIFINED_ERROR);
    return store;
}