'use strict'

import { messages } from "../common/messages.js";

export function stopPropagation(event){
    event.stopPropagation();
    console.log("押下", event);
};

export function isLoggedIn(){
    return getStorageMode() === "login"
}

export function assert(condition, message){
    if (!condition){
        throw new Error(message);
    }
}

// 付箋IDは複数回取得するので共通化（型配慮IDはINTで統一）
export function getFusenId(elem) {
  const fusenId = Number(elem.closest(".fusen")?.dataset.fusenId);
  assert(Number.isInteger(fusenId), messages.FUSEN_ID_EXIST_ERROR);
  return fusenId;
}

function getStorageMode() {
    return document.body.dataset.storageMode;
}