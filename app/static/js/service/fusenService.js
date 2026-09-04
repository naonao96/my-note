"use strict"

import { assert, getFusenId, isLoggedIn } from "../common/eventUtil.js";

import { messages } from "../common/messages.js";

import { fetchUpsertApi, fetchDeleteApi, fetchReadDataApi, fetchReadDataListApi } from "../repository/apiFusenRepository.js";

import { upsertLocalFusenData, deleteLocalFusenData, readAllLocalFusenData, readLocalFusenData } from "../repository/indexedDBRepository.js";

/**
 * 付箋情報を保存する。
 *
 * ログイン状態に応じて保存先を切り替える。
 * ログイン済みの場合はAPIへ保存し、
 * 未ログインの場合はIndexedDBへ保存する。
 *
 * @param {Object} requestData 保存対象の付箋情報とフォーム情報
 * @returns {Promise<Object>} 保存処理の結果
 */
export async function upsertFusen(requestData){

    assert(requestData, messages.CONDITIONS_UNDEFINED_ERROR)

    if (isLoggedIn()){

        const result = await fetchUpsertApi(requestData);

        return result

    }

    else {

        const result = await upsertLocalFusenData(requestData);

        return result

    }

}

/**
 * 付箋一覧を取得する。
 *
 * ログイン状態に応じて取得元を切り替える。
 * ログイン済みの場合はAPIから取得し、
 * 未ログインの場合はIndexedDBから取得する。
 *
 * @returns {Promise<Object>} 取得した付箋一覧情報
 */
export async function readFusenList(){

    if (isLoggedIn()){

        const result = await fetchReadDataListApi();

        return result;

    }

    else {

        const result = await readAllLocalFusenData();

        return result;

    }

}

/**
 * 指定された付箋を削除する。
 *
 * 削除確認ダイアログを表示し、
 * ユーザーが削除を承認した場合のみ削除処理を実行する。
 *
 * ログイン済みの場合はAPIから削除し、
 * 未ログインの場合はIndexedDBから削除する。
 *
 * 戻り値は一覧画面から付箋DOMを削除するかどうかの
 * 判定に使用する。
 *
 * @param {HTMLElement} button 削除対象の付箋に属するボタン
 * @returns {Promise<boolean>} 削除した場合true、キャンセルした場合false
 */
export async function deleteFusen(button){

    assert(button, messages.CONDITIONS_UNDEFINED_ERROR)

    if (!confirm("この付箋を削除しますか？")){

        return false;

    }

    if (isLoggedIn()){

        await fetchDeleteApi(getFusenId(button));

        return true;

    }

    else {

        await deleteLocalFusenData(getFusenId(button));

        return true;

    }

}

/**
 * 指定された付箋情報を取得する。
 *
 * ボタンが属する付箋から付箋IDを取得し、
 * ログイン状態に応じて取得元を切り替える。
 *
 * ログイン済みの場合はAPIから取得し、
 * 未ログインの場合はIndexedDBから取得する。
 *
 * @param {HTMLElement} button 取得対象の付箋に属するボタン
 * @returns {Promise<Object>} 取得した付箋情報
 */
export async function readFusen(button){

    assert(button, messages.CONDITIONS_UNDEFINED_ERROR)

    if (isLoggedIn()){

        const result = await fetchReadDataApi(getFusenId(button));

        return result;

    }

    else {

        const result = await readLocalFusenData(getFusenId(button));

        return result;

    }

}