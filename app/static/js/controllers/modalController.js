"use strict"
import { assert } from "../common/eventUtil.js"
import { messages } from "../common/messages.js";

/**
 * モーダルのイベントを設定します。
 *
 * @param {import("../element/modalElements.js").ModalElements} modalElems モーダル専用DOM
 * @param {() => void} [beforeOpen] モーダルを開く前に実行する処理
 * @returns {void}
 */
export function setupModal(modalElems, beforeOpen) {
    assert(modalElems.openButton, messages.CONDITIONS_UNDEFINED_ERROR);
    assert(modalElems.overlay, messages.CONDITIONS_UNDEFINED_ERROR);
    assert(modalElems.modal, messages.CONDITIONS_UNDEFINED_ERROR);

    modalElems.openButton.addEventListener("click", () => {
        beforeOpen?.();
        openModal(modalElems);
    });

    modalElems.overlay.addEventListener("click", () => {
        closeModal(modalElems);
    });
}

/**
 * モーダル画面を表示します。
 * ※基本はsetupModalより呼び出しを行う。
 * @param {import("../element/modalElements.js").ModalElements} modalElems モーダル専用DOM
 * @returns {void}
 */
export function openModal(modalElems) {
    modalElems.overlay.classList.remove("hidden");
    modalElems.modal.classList.remove("hidden");
}

/**
 * モーダル画面を終了します。
 * ※基本はsetupModalより呼び出しを行う。
 * @param {import("../element/modalElements.js").ModalElements} modalElems モーダル専用DOM
 * @returns {void}
 */
export function closeModal(modalElems) {
    modalElems.overlay.classList.add("hidden");
    modalElems.modal.classList.add("hidden");
}