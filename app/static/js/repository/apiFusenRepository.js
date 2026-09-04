"use strict"

import { EDIT_MODE } from "../common/consts.js";
import { assert } from "../common/eventUtil.js"
import { messages } from "../common/messages.js";
import { getCsrfToken } from "../element/commonElements.js";

/**
 * 付箋情報をAPIへ保存する。
 *
 * フォームのモードに応じて新規登録または更新を判定し、
 * CREATE時はPOST、EDIT時はPUTでAPIへリクエストを送信する。
 *
 * EDIT時は付箋IDが有効な整数であることを確認する。
 * 保存成功後はAPIから返却されたJSONを返す。
 *
 * @param {Object} requestData 保存処理に使用するリクエスト情報
 * @returns {Promise<Object>} APIから返却された保存結果
 */
export async function fetchUpsertApi(requestData){
    assert(requestData, messages.CONDITIONS_UNDEFINED_ERROR);
    const mode = requestData.form.dataset.fusenMode;
    const fusenId = Number(requestData.form.dataset.fusenId);
    if (mode === EDIT_MODE){
        assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
    }
    const url = mode === EDIT_MODE
    ? `/note_list/api/notes/${fusenId}`
    : "/note_list/api/notes";
    const method = mode === EDIT_MODE ? "PUT" : "POST";
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type" : "application/json",
            ...getCsrfHeaders()
        },
        body: JSON.stringify(requestData.fusenData) 
    });
    checkResponse(response, messages.DATA_SAVE_ERROR);
    return await response.json();
}

/**
 * 付箋一覧をAPIから取得する。
 *
 * 付箋一覧取得APIへGETリクエストを送信し、
 * 正常終了した場合はレスポンスのJSONを返す。
 *
 * @returns {Promise<Object>} APIから返却された付箋一覧情報
 */
export async function fetchReadDataListApi(){
    const response = await fetch("/note_list/api/notes");
    checkResponse(response, messages.DATA_READ_ERROR);
    return await response.json()
}

/**
 * 指定された付箋情報をAPIから取得する。
 *
 * 付箋IDが有効な整数であることを確認した後、
 * 対象付箋の取得APIへGETリクエストを送信する。
 *
 * @param {number} fusenId 取得対象の付箋ID
 * @returns {Promise<Object>} APIから返却された付箋情報
 */
export async function fetchReadDataApi(fusenId){
    assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
    const response = await fetch(`/note_list/api/notes/${fusenId}`);
    checkResponse(response, messages.DATA_READ_ERROR);
    return await response.json();
}

/**
 * 指定された付箋をAPIから削除する。
 *
 * 付箋IDが有効な整数であることを確認した後、
 * 対象付箋の削除APIへDELETEリクエストを送信する。
 * CSRF対策としてリクエストヘッダーへCSRFトークンを設定する。
 *
 * @param {number} fusenId 削除対象の付箋ID
 * @returns {Promise<void>}
 */
export async function fetchDeleteApi(fusenId){
    assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
    const response = await fetch(`/note_list/api/notes/${fusenId}`, { 
        method: "DELETE",
        headers: getCsrfHeaders()
     });
    checkResponse(response, messages.DATA_DELETE_ERROR);
}

//---共通関数---

/**
 * APIリクエストで使用するCSRFヘッダーを生成する。
 *
 * 画面からCSRFトークンを取得し、
 * 有効な文字列であることを確認してから
 * X-CSRFTokenヘッダーとして返す。
 *
 * @returns {Object} CSRFトークンを含むリクエストヘッダー
 */
function getCsrfHeaders(){
    const csrfToken = getCsrfToken();
    assert(typeof csrfToken === "string" && csrfToken.length > 0, messages.CONDITIONS_UNDEFINED_ERROR);
    return {
        "X-CSRFToken": csrfToken
    }
}

/**
 * APIレスポンスが正常であることを確認する。
 *
 * HTTPステータスが401の場合はセッション切れとして
 * Googleログイン画面へ遷移する。
 *
 * その他のエラーレスポンスの場合は、
 * 指定されたエラーメッセージとHTTPステータスを使用して
 * エラーを発生させる。
 *
 * @param {Response} response fetchで取得したHTTPレスポンス
 * @param {string} errorMessage エラー発生時に使用するメッセージ
 * @returns {void}
 */
function checkResponse(response, errorMessage) {
    if (response.status === 401) {
        window.location.href = "/auth/google/login";
        throw new Error("Session expired");
    }

    assert(response.ok, `${errorMessage} status=${response.status}`);
}