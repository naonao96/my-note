"use strict"

import { upsertFusen, readFusen } from "../service/fusenService.js";
import { getFusenData, handleColorSelect, syncSelectedColor } from "../ui/fusenEdit.js";
import { setCreateModal, setEditModal } from "../view/modalView.js";
import { openModal, setupModal } from "./modalController.js";
import { messages } from "../common/messages.js";
import { assert } from "../common/eventUtil.js";
import { getElements } from "../element/fusenEditElements.js";
import { showToast } from "../common/toast.js";
import { EDIT_MODE, MESSAGE_TYPE } from "../common/consts.js";
import { reflectFusen } from "../ui/fusenList.js";
import { createAutoSave } from "../common/autoSave.js";
import { setupContentInput } from "../ui/fusenContentInput.js";

/**
 * 付箋編集画面を初期化する。
 *
 * 自動保存処理を生成し、
 * カラー・期限日・本文入力のイベント、
 * 新規作成・編集モーダルの設定を行う。
 *
 * @returns {void}
 */
export function init(){
    const elems = getElements();

    setupFlatpickr();

    const { requestAutoSave, flushAutoSave } = createAutoSave({
        save: (snapshot) => saveFusen(elems, snapshot),
        createSnapshot: () => (getFusenData(elems)),
        canSave: (snapshot) => (snapshot.content.trim() !== ""),
        onError: () => {
            showToast(
                messages.DATA_SAVE_ERROR,
                MESSAGE_TYPE.ERROR
            );
        }
    });

    setupColorSelectedButtons(
        elems.color,
        requestAutoSave
    );

    setupExpiresAtAutoSave(
        elems.fusen.expiresAtData,
        requestAutoSave
    );

    const syncContentInputState = setupContentInput(
        elems.fusen.fusenContent,
        requestAutoSave
    );

    setupCreateModal(
        elems,
        flushAutoSave,
        syncContentInputState
    );

    setupEditModalOpen(
        elems,
        syncContentInputState
    );
}

/**
 * 新規登録用モーダルを設定する。
 *
 * モーダルを開く際に新規登録用の初期値を設定し、
 * カラーと本文入力状態を同期する。
 * モーダルを閉じる際は保留中の自動保存を完了し、
 * 最新の付箋情報を一覧へ反映する。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @param {() => Promise<void>} flushAutoSave
 *        保留中の自動保存を即時実行し、完了まで待機する関数
 * @param {() => void} syncContentInputState
 *        現在の本文入力状態を同期する関数
 * @returns {void}
 */
function setupCreateModal(elems, flushAutoSave, syncContentInputState) {
    setupModal(
        elems.editModal,
        () => {
            setCreateModal(elems.form);
            syncSelectedColor(elems.color);
            syncContentInputState();
        },
        async () => {
            await flushAutoSave();
            reflectEditedFusen(elems);
        }
    );
}

/**
 * 既存付箋の編集モーダルを開くイベントを設定する。
 *
 * 編集ボタン押下時に付箋情報を取得し、
 * モーダルへ編集内容を設定する。
 * カラーと本文入力状態を同期した後、モーダルを表示する。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @param {() => void} syncContentInputState
 *        現在の本文入力状態を同期する関数
 * @returns {void}
 */
function setupEditModalOpen(elems, syncContentInputState) {
    document.addEventListener("pointerdown", async (e) => {
        const editButton = e.target.closest(".edit-button");

        if (!editButton) return;

        e.preventDefault();
        try{
            const result = await readFusen(editButton);
            assert(result?.fusenData, messages.CONDITIONS_UNDEFINED_ERROR);
            setEditModal(elems.form, result.fusenData);
            syncSelectedColor(elems.color);
            syncContentInputState();
            openModal(elems.editModal);
        }
        catch(error){
            console.error(messages.DATA_READ_ERROR, error);
        }
    });
}

/**
 * 期限日入力用のflatpickrを設定する。
 *
 * flatpickrが読み込まれていない場合は設定を行わず、
 * 標準の日付入力をそのまま使用する。
 *
 * @returns {void}
 */
function setupFlatpickr() {
    if (typeof flatpickr === "undefined") {
        console.warn("flatpickrが読み込まれていないため、標準の日付入力を使用します。");
        return;
    }

    flatpickr("#datepicker", {
        locale: "ja",
        enableTime: false,
        dateFormat: "Y-m-d",
        disableMobile: true
    });
}

/**
 * 付箋カラー選択用ボタンのイベントを設定する。
 *
 * 初期表示時に現在の選択カラーを同期する。
 * カラーボタン押下時は選択色とプレビューを更新し、
 * 自動保存を要求する。
 *
 * @param {import("../element/fusenEditElements.js").ColorElements} colorElems
 *        カラー選択で使用するDOM要素
 * @param {() => void} requestAutoSave
 *        自動保存を要求する関数
 * @returns {void}
 */
function setupColorSelectedButtons(colorElems, requestAutoSave){
    syncSelectedColor(colorElems);

    colorElems.colorButtons.forEach(button => {
        button.addEventListener("pointerdown", () => {
            handleColorSelect(button, colorElems);
            requestAutoSave();
        });
    });
}

/**
 * 期限日の変更時に自動保存を要求するイベントを設定する。
 *
 * @param {HTMLInputElement} expiresAtData
 *        期限日入力欄
 * @param {() => void} requestAutoSave
 *        自動保存を要求する関数
 * @returns {void}
 */
function setupExpiresAtAutoSave(expiresAtData, requestAutoSave) {
    expiresAtData.addEventListener("change", requestAutoSave);
}

/**
 * 現在のフォーム内容を保存する。
 *
 * 新規登録時に保存結果としてIDが返却された場合は、
 * フォームへ付箋IDを設定し、以降の保存を更新モードへ切り替える。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @returns {Promise<*>} 保存処理の結果
 */
async function saveFusen(elems, fusenData) {
    const result = await upsertFusen({
        form: elems.form,
        fusenData
    });

    if (result?.id) {
        elems.form.dataset.fusenId = result.id;
        elems.form.dataset.fusenMode = EDIT_MODE;
    }

    return result;
}

/**
 * モーダル内の最新の付箋情報を一覧画面へ反映する。
 *
 * 本文が空、または有効な付箋IDが存在しない場合は反映しない。
 * 有効な付箋情報の場合は一覧表示を最新状態へ更新する。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @returns {void}
 */
function reflectEditedFusen(elems) {
    const fusenData = getFusenData(elems);
    const fusenId = Number(elems.form.dataset.fusenId);

    // 本文が空の場合は保存・画面反映を行わない
    if (fusenData.content.trim() === "") {
        return;
    }

    if (!Number.isInteger(fusenId) || fusenId <= 0) {
        return;
    }

    reflectFusen({
        id: fusenId,
        ...getFusenData(elems)
    });
}