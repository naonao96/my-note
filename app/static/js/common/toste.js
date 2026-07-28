"use strict"

import { getToastElements } from "../element/toastElement.js";
import { TOAST_ICONS } from "./consts.js"
import { assert } from "./eventUtil.js";
import { messages } from "./messages.js";

let toastTimerId = null;

/**
 * トースト画面を表示します。
 * @param {String} message 
 * @param {String} type 
 */
export function showToast(message, type){
    assert(message, messages.CONDITIONS_UNDEFINED_ERROR);
    assert(type, messages.CONDITIONS_UNDEFINED_ERROR);
    const toastElement = getToastElements();
    toastElement.toastIcon.src = TOAST_ICONS[type];
    toastElement.toastMessage.textContent = message;
    toastElement.toast.classList.remove("hidden");
    startToastTimer();
}

function hideToast(){
    getToastElements().toast.classList.add("hidden");
}

function startToastTimer(){
    clearTimeout(toastTimerId);
    toastTimerId = setTimeout(hideToast, 3000);
}