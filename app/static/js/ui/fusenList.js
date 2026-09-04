'use strict'

import { assert } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";

/**
 * 付箋一覧を画面へ描画する。
 *
 * 取得した付箋情報を1件ずつreflectFusenへ渡し、
 * 既存付箋の更新または新規付箋の追加を行う。
 *
 * @param {Array} fusenList 描画対象の付箋情報一覧
 * @returns {void}
 */
export function renderFusenList(fusenList){
    assert(fusenList, messages.CONDITIONS_UNDEFINED_ERROR);

    fusenList.forEach((fusen) => {
        reflectFusen(fusen);
    });
}

/**
 * 指定された付箋を一覧画面から削除する。
 *
 * 削除ボタンから親要素の付箋を取得し、
 * 対象の付箋DOMを画面上から削除する。
 *
 * @param {HTMLElement} button 削除対象の付箋に属するボタン
 * @returns {void}
 */
export function removeFusen(button){
    button.closest(".fusen").remove();
}

/**
 * 付箋情報を一覧画面へ反映する。
 *
 * 同一IDの付箋が既に存在する場合は内容を更新し、
 * 存在しない場合は新しい付箋として一覧へ追加する。
 *
 * @param {Object} fusenData 画面へ反映する付箋情報
 * @returns {void}
 */
export function reflectFusen(fusenData) {
    const existingFusen = document.querySelector(
        `.fusen[data-fusen-id="${fusenData.id}"]`
    );

    if (existingFusen) {
        updateFusenElement(existingFusen, fusenData);
        return;
    }

    addFusenElement(fusenData);
}

/**
 * 新しい付箋を一覧画面へ追加する。
 *
 * 付箋テンプレートを複製して付箋情報を設定し、
 * 付箋一覧の先頭へ追加する。
 *
 * @param {Object} fusenData 追加する付箋情報
 * @returns {void}
 */
function addFusenElement(fusenData) {
    const container = document.querySelector(".fusen-container");
    const template = document.querySelector("#fusen-template");
    const clone = template.content.cloneNode(true);
    const fusenElement = clone.querySelector(".fusen");

    updateFusenElement(fusenElement, fusenData);

    container.prepend(clone);
}

/**
 * 指定された付箋DOMへ付箋情報を設定する。
 *
 * 付箋ID、本文、期限日、カラーをDOMへ反映する。
 * 期限日が設定されていない場合は「期限日なし」と表示する。
 *
 * @param {HTMLElement} fusenElement 更新対象の付箋DOM
 * @param {Object} fusenData 反映する付箋情報
 * @returns {void}
 */
function updateFusenElement(fusenElement, fusenData) {
    fusenElement.dataset.fusenId = fusenData.id;

    fusenElement
        .querySelector(".fusen-content")
        .textContent = fusenData.content;

    fusenElement
        .querySelector(".fusen-expires-at")
        .textContent = fusenData.expires_at
            ? `期限日：${fusenData.expires_at}`
            : "期限日なし";

    fusenElement.style.setProperty(
        "--fusen-color",
        fusenData.color
    );
}