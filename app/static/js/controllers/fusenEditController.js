"use strict"

import { upsertFusen, readFusen } from "../service/fusenService.js";
import { getFusenData, handleColorSelect, syncSelectedColor } from "../ui/fusenEdit.js";
import { setCreateModal, setEditModal } from "../view/modalView.js";
import { openModal, setupModal } from "./modalController.js";
import { messages } from "../common/messages.js";
import { assert } from "../common/eventUtil.js";
import { getElements } from "../element/fusenEditElements.js";
import { EDIT_MODE } from "../common/consts.js";
import { reflectFusen } from "../ui/fusenList.js";

/**
 * 付箋編集画面で使用するイベントや入力処理を初期化する。
 *
 * 期限入力、カラー選択、本文入力制御、自動保存、
 * 新規作成モーダル、編集モーダルの設定を行う。
 *
 * @returns {void}
 */
export function init(){
    const elems = getElements();
    setupFlatpickr();
    setupColorSelectedButtons(elems.color);
    setupContentInput(elems.fusen.fusenContent);
    handleFusenSubmit(elems);
    const flushAutoSave = setupAutoSave(elems);
    setupCreateModalOpen(elems, flushAutoSave);
    setupEditModalOpen(elems);
}

/**
 * 新規登録用モーダルを設定する。
 *
 * モーダルを開く際に新規登録用の初期値を設定し、
 * モーダルを閉じる際には保留中の自動保存を完了してから
 * 一覧画面へ最新の付箋情報を反映する。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @param {() => Promise<void>} flushAutoSave
 *        保留中の自動保存を即時実行・完了する関数
 * @returns {void}
 */
function setupCreateModalOpen(elems, flushAutoSave) {
    setupModal(
        elems.editModal,
        () => {
            setCreateModal(elems.form);
            syncSelectedColor(elems.color);
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
 * 編集ボタンが押下された付箋情報を取得し、
 * 取得した内容をモーダルへ設定して編集画面を表示する。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @returns {void}
 */
function setupEditModalOpen(elems) {
    document.addEventListener("pointerdown", async (e) => {
        const editButton = e.target.closest(".edit-button");

        if (!editButton) return;

        e.preventDefault();
        try{
            const result = await readFusen(editButton);
            assert(result?.fusenData, messages.CONDITIONS_UNDEFINED_ERROR);
            setEditModal(elems.form, result.fusenData);
            syncSelectedColor(elems.color);
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
 * 初期表示時に現在選択されているカラーを同期し、
 * カラーボタン押下時に選択色とプレビュー表示を更新する。
 *
 * @param {import("../element/fusenEditElements.js").ColorElements} colorElems
 *        カラー選択で使用するDOM要素
 * @returns {void}
 */
function setupColorSelectedButtons(colorElems){
    syncSelectedColor(colorElems);

    colorElems.colorButtons.forEach(button => {
        button.addEventListener("pointerdown", () => {
            handleColorSelect(button, colorElems)
        });
    });
}

/**
 * 付箋フォームのsubmitイベントを設定する。
 *
 * 標準のフォーム送信を停止し、付箋情報を保存した後、
 * 付箋一覧画面へ遷移する。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @returns {void}
 */
function handleFusenSubmit(elems){
    elems.form.addEventListener("submit", async (e) => {
        e.preventDefault(); // 通常のform送信は停止する

        try{
            await saveFusen(elems);
            window.location.assign("/note_list/");
        }
        catch(error){
            console.error(messages.DATA_SAVE_ERROR, error);
        }
    })
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
async function saveFusen(elems) {
    const result = await upsertFusen({
        form: elems.form,
        fusenData: getFusenData(elems)
    });

    if (result?.id) {
        elems.form.dataset.fusenId = result.id;
        elems.form.dataset.fusenMode = EDIT_MODE;
    }

    return result;
}

/**
 * 付箋情報の自動保存イベントを設定する。
 *
 * 本文、カラー、期限日の変更後700ms経過すると保存を実行する。
 * 保存処理はPromiseキューによって順番に実行し、
 * 複数の保存処理が同時に実行されることを防ぐ。
 *
 * 戻り値の関数を呼び出すことで、
 * 保留中の自動保存を即時実行して完了まで待機できる。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @returns {() => Promise<void>}
 *          保留中の自動保存を即時実行・完了する関数
 */
function setupAutoSave(elems) {
    let saveTimer;
    let saveQueue = Promise.resolve();
    let hasPendingSave = false;

    const executeSave = () => {
        hasPendingSave = false;

        saveQueue = saveQueue
            .then(() => saveFusen(elems))
            .catch(error => {
                console.error(messages.DATA_SAVE_ERROR, error);
            });

        return saveQueue;
    };

    const requestAutoSave = () => {
        clearTimeout(saveTimer);

        // 本文が空の場合は保存しない
        if (elems.fusen.fusenContent.value.trim() === "") {
            return;
        }

        hasPendingSave = true;

        saveTimer = setTimeout(() => {
            executeSave();
        }, 700);
    };

    // 内容
    elems.fusen.fusenContent.addEventListener("input", requestAutoSave);

    // 色
    elems.color.colorButtons.forEach(button => {
        button.addEventListener("pointerdown", requestAutoSave);
    });

    // 期限
    elems.fusen.expiresAtData.addEventListener("change", requestAutoSave);

    return async () => {
        clearTimeout(saveTimer);

        if (hasPendingSave) {
            await executeSave();
        } else {
            await saveQueue;
        }
    };
}

/**
 * 付箋本文入力欄の入力制御を設定する。
 *
 * textareaの表示可能な縦幅を超える入力を検出した場合、
 * 直前の入力内容とカーソル位置へ戻す。
 *
 * 日本語入力などのIME変換中は通常のinput判定を行わず、
 * compositionend後に入力内容を判定する。
 *
 * @param {HTMLTextAreaElement} contentInput 付箋本文入力欄
 * @returns {void}
 */
function setupContentInput(contentInput) {
    let previousValue = contentInput.value;
    let previousSelectionStart = contentInput.selectionStart;
    let previousSelectionEnd = contentInput.selectionEnd;
    let isComposing = false;

    const saveCurrentState = () => {
        previousValue = contentInput.value;
        previousSelectionStart = contentInput.selectionStart;
        previousSelectionEnd = contentInput.selectionEnd;
    };

    const restorePreviousState = () => {
        contentInput.value = previousValue;
        contentInput.setSelectionRange(
            previousSelectionStart,
            previousSelectionEnd
        );
    };

    contentInput.addEventListener("focus", () => {
        saveCurrentState();
    });

    contentInput.addEventListener("compositionstart", () => {
        isComposing = true;
    });

    contentInput.addEventListener("compositionend", () => {
        isComposing = false;

        if (isContentOverflowing(contentInput)) {
            restorePreviousState();
            return;
        }

        saveCurrentState();
    });

    contentInput.addEventListener("input", () => {
        if (isComposing) {
            return;
        }

        if (isContentOverflowing(contentInput)) {
            restorePreviousState();
            return;
        }

        saveCurrentState();
    });
}

/**
 * 付箋本文がtextareaの表示可能な縦幅を超えているか判定する。
 *
 * @param {HTMLTextAreaElement} contentInput 付箋本文入力欄
 * @returns {boolean} 縦幅を超えている場合true
 */
function isContentOverflowing(contentInput) {
    return contentInput.scrollHeight > contentInput.clientHeight;
}

/**
 * モーダル内の最新の付箋情報を一覧画面へ反映する。
 *
 * 有効な付箋IDが設定されていない場合は反映を行わない。
 * 既存付箋の場合は一覧DOMを更新し、
 * 新規付箋の場合は一覧DOMへ追加する。
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