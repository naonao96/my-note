"use strict"

/**
 * トーストで使用するDOM要素を取得します。
 * 
 * @typedef {Object} ToastElements
 * @property {HTMLElement} toast
 * @property {HTMLElement} toastIcon
 * @property {HTMLElement} toastMessage
 * @returns {ToastElements}
 */
export function getToastElements() {
    return {
        toast: document.querySelector(".toast"),
        toastIcon: document.querySelector(".toast-icon"),
        toastMessage: document.querySelector(".toast-message"),
    };
}