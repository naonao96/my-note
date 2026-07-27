"use strict"

import { getModalElements } from "./modalElements.js";

/**
 * @typedef {Object} ColorElements
 * @property {NodeListOf<HTMLElement>} colorButtons
 * @property {HTMLInputElement} selectedColor
 */

/**
 * @typedef {Object} PreviewElements
 * @property {HTMLTextAreaElement} contentInput
 * @property {HTMLElement} content
 * @property {HTMLInputElement} expiresAtInput
 * @property {HTMLElement} expiresAt
 */

/**
 * 付箋編集モーダルで使用するDOM要素。
 *
 * @typedef {Object} FusenEditElements
 * @property {HTMLFormElement} form
 * @property {import("./modalElements").ModalElements} editModal
 * @property {ColorElements} color
 * @property {PreviewElements} preview
 */

/**
 * 付箋編集（新規・修正）モーダルで使用するDOM要素を取得します。
 *
 * @returns {FusenEditElements}
 */
export function getElements() {
    
    return {
        form: document.getElementById("fusen-form"),
        
        editModal: getModalElements("create-open-button", "edit-modal-overlay", "edit-modal"),

        color: {
            colorButtons: document.querySelectorAll(".color-option"),
            selectedColor: document.getElementById("selected-color"),
            editModal: document.getElementById("edit-modal")
        },

        preview: {
            contentData: document.getElementById("content"),
            fusenContent: document.getElementById("fusen-content"),
            expiresAtData: document.getElementById("datepicker"),
            fusenExpiresAt: document.getElementById("fusen-expires-at")
        }
    };
}