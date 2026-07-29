"use strict"

import { EDIT_MODE } from "../common/consts.js";
import { assert } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";

// ---indexedDB定数---
export const DB_NAME = "fusen";
export const DB_VERSION = 1;
export const STORE_NAME = "Fusen";
export const READ_WRITE = "readwrite";
export const READ_ONLY = "readonly";

function openDB(){
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error);
        };
        request.onupgradeneeded = () => {
            initDB(request.result);
        };
    });
}

function initDB(db){
    assert(db, messages.CONDITIONS_UNDEFINED_ERROR);
    if (!db.objectStoreNames.contains(STORE_NAME)){
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    }
}

export async function upsertLocalFusenData(requestData){
    let db;
    try{
        assert(requestData, messages.CONDITIONS_UNDEFINED_ERROR);
        db = await openDB();
        const mode = requestData.form.dataset.fusenMode;
        const fusenData = { ...requestData.fusenData };
        if (mode === EDIT_MODE){
            const fusenId = Number(requestData.form.dataset.fusenId);
            assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
            fusenData.id = fusenId;
        }
        const request = setStore(db, READ_WRITE).put(fusenData);
        const id = await requestToPromise(request);
        return { id };
    }
    finally{
        db?.close();
    }

}

export async function readLocalFusenData(fusenId){
    let db;
    try{
        assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
        db = await openDB();
        const request = setStore(db, READ_ONLY).get(fusenId);
        const fusenData = await requestToPromise(request);
        return { fusenData };
    }
    finally {
        db?.close();
    }

}

export async function readAllLocalFusenData(){
    let db;
    try{
        db = await openDB();
        const request = setStore(db, READ_ONLY).getAll();
        const fusenList = await requestToPromise(request);
        return { fusenList };
    }
    finally{
        db?.close();
    }

}

export async function deleteLocalFusenData(fusenId){
    let db;
    try{
        assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
        db = await openDB();
        const request = setStore(db, READ_WRITE).delete(fusenId);
        await requestToPromise(request);
    }
    finally{
        db?.close();
    }
}

//---共通関数---
function setStore(db, transactionMode){
    assert(db, messages.CONDITIONS_UNDEFINED_ERROR);
    assert(transactionMode, messages.CONDITIONS_UNDEFINED_ERROR);
    const transaction = db.transaction(STORE_NAME, transactionMode);
    const store = transaction.objectStore(STORE_NAME);
    return store;
}

function requestToPromise(request){
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
