"use strict"

import { getModalElements } from "./modalElements.js"

/**
 * 付箋一覧画面で使用するDOM要素。
 *
 * @typedef {Object} FusenListElements
 * @property {HTMLElement} fusenListWindow
 * @property {import("./modalElements").ModalElements} loginModal
 * @property {import("./modalElements").ModalElements} userInfoModal
 */

/**
 * 付箋一覧画面で使用するDOM要素を取得します。
 *
 * @returns {FusenListElements}
 */
export function getElements(){
    
    return {
        fusenListWindow: document.getElementById("fusen-list"),
        loginModal: getModalElements("login-open-button", "login-modal-overlay", "login-modal"),
        userInfoModal: getModalElements("user-info-button", "user-modal-overlay", "user-modal")
    }
}