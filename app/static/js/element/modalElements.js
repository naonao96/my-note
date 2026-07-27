"use strict";

/**
 * @typedef {Object} ModalElements
 * @property {HTMLElement} openButton
 * @property {HTMLElement} overlay
 * @property {HTMLElement} modal
 */

/**
 * モーダルで使用するDOM要素を取得します。
 *
 * @param {string} openButtonId
 * @param {string} overlayId
 * @param {string} modalId
 * @returns {ModalElements}
 */
export function getModalElements(openButtonId, overlayId, modalId) {
    return {
        openButton: document.getElementById(openButtonId),
        overlay: document.getElementById(overlayId),
        modal: document.getElementById(modalId)
    };
}