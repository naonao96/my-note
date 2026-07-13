'use strict'

import { messages } from "../common/messages.js";

// 対象のイベント伝播停止
export function stopPropagation(event){
    event.stopPropagation();
    console.log("押下", event);
};

export function storageModeCheck(){
    const mode = getStorageMode()
    if (mode === "login") {
        // API経由PostgresSQLと通信
        return true
    } else {
        // ローカルのIndexedDBと通信
        return false
    }
}

function isApiMode() {
    return storageModeCheck(document.body.dataset.storageMode);
}

// アサーション用ヘルパー関数
export function assert(condition, message){
    if (!condition){
        throw new Error(message);
    }
}

export function getFusenId(elem) {
  const fusenId = elem.closest(".fusen")?.dataset.fusenId;
  assert(fusenId, messages.FUSEN_ID_EXIST_ERROR);
  return fusenId;
}

function getStorageMode() {
    return document.body.dataset.storageMode;
}