"use strict"

import { CREATE_MODE, DEFAULT_COLOR, EDIT_MODE } from "../common/consts.js";

/**
 * モーダルを新規登録用の状態に設定する。
 *
 * 本文と期限日を空にし、付箋カラーにはデフォルトカラーを設定する。
 * また、保存処理で新規登録と判定できるように
 * フォームのモードをCREATE_MODEへ設定し、付箋IDを初期化する。
 *
 * @param {HTMLFormElement} form 付箋編集フォーム
 * @returns {void}
 */
export function setCreateModal(form){

    setModalCommonValues({
        content: "",
        date: "",
        color: DEFAULT_COLOR
    })

    // 保存判定で使用
    form.dataset.fusenMode = CREATE_MODE;

    form.dataset.fusenId = "";

}

/**
 * モーダルを既存付箋の編集用状態に設定する。
 *
 * 指定された付箋情報から本文、期限日、カラーを
 * モーダルの初期値として設定する。
 *
 * また、保存処理で更新と判定できるように
 * フォームのモードをEDIT_MODEへ設定し、
 * 編集対象の付箋IDをフォームへ保持する。
 *
 * @param {HTMLFormElement} form 付箋編集フォーム
 * @param {{id: number, content: string, expires_at: string, color: string}} fusenData
 *        編集対象の付箋情報
 * @returns {void}
 */
export function setEditModal(form, fusenData){

    setModalCommonValues({
        content: fusenData.content,
        date: fusenData.expires_at,
        color: fusenData.color
    })

    // 保存判定で使用
    form.dataset.fusenMode = EDIT_MODE;

    form.dataset.fusenId = fusenData.id;

}

/**
 * 新規登録・編集モーダルで共通して使用する初期値を設定する。
 *
 * 期限日、選択カラー、付箋本文を各入力要素へ設定し、
 * モーダル内の付箋へ指定されたカラーを反映する。
 *
 * @param {Object} values モーダルへ設定する初期値
 * @param {string} values.content 付箋本文
 * @param {string} values.date 期限日
 * @param {string} values.color 付箋カラー
 * @returns {void}
 */
function setModalCommonValues({ content, date, color }) {

    // モーダル内の初期値セット
    document.getElementById("datepicker").value = date;

    document.getElementById("selected-color").value = color;

    document.getElementById("fusen-content").value = content;

    document
        .querySelector("#edit-modal .fusen")
        .style
        .setProperty("--fusen-color", color);

}