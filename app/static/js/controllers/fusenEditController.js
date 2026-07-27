"use strict"

import { upsertFusen, readFusen } from "../service/fusenService.js";
import { getFusenData, handleColorSelect, syncSelectedColor, updatePreview } from "../ui/fusenEdit.js";
import { setupFusenFlip } from "../ui/fusenFlip.js"
import { setCreateModal, setEditModal } from "../view/modalView.js";
import { openModal, setupModal } from "./modalController.js";
import { messages } from "../common/messages.js";
import { assert } from "../common/eventUtil.js";
import { getElements } from "../element/fusenEditElements.js";

export function init(){
    const elems = getElements();
    setupFlatpickr();
    setupColorSelectedButtons(elems.color);
    realtimePreview(elems.preview);
    handleFusenSubmit(elems);
    setupFusenFlip(elems.editModal.modal);
    setupCreateModalOpen(elems);
    setupEditModalOpen(elems);
}

/**
 * 新規登録用モーダルの設定を行います。
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems 
 * @returns {void}
 */
function setupCreateModalOpen(elems) {
    setupModal(
        elems.editModal,
        () => {
            setCreateModal(elems.form);
            syncSelectedColor(elems.color);
            updatePreview(elems.preview);
        }
    );
}

/**
 * 更新登録用モーダルの設定を行います。
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems 
 * @returns {void}
 */
function setupEditModalOpen(elems) {
    document.addEventListener("click", async (e) => {
        const editButton = e.target.closest(".edit-button");

        if (!editButton) return;

        e.preventDefault();
        try{
            const result = await readFusen(editButton);
            assert(result?.fusenData, messages.CONDITIONS_UNDIFINED_ERROR);
            setEditModal(elems.form, result.fusenData);
            syncSelectedColor(elems.color);
            updatePreview(elems.preview);
            openModal(elems.editModal);
        }
        catch(error){
            console.error(messages.DATA_READ_ERROR, error);
        }
    });
}

/**
 * 期限日の設定
 */
function setupFlatpickr() {
    flatpickr("#datepicker", {
        enableTime: false,
        dateFormat: "Y-m-d",
        disableMobile: true
    });
}

/**
 * 付箋カラー選択（自動・手動）
 * @param {import("../element/fusenEditElements.js").ColorElements} colorElems
 * @returns {void}
 *  */ 
function setupColorSelectedButtons(colorElems){
    syncSelectedColor(colorElems);
    colorElems.colorButtons.forEach(button => {
        button.addEventListener("click", () => {
            handleColorSelect(button, colorElems)
        });
    });
}

/**
 * 内容・期限をリアルタイムに変更する。
 * @param {import("../element/fusenEditElements.js").PreviewElements} previewElems 
 * @returns {void}
 *  */ 
function realtimePreview(previewElems) {
    previewElems.contentData.addEventListener("input", () => {
        updatePreview(previewElems);
    });
    previewElems.expiresAtData.addEventListener("input", () => {
        updatePreview(previewElems);
    });
};

/**
 * 内容・期限をリアルタイムに変更する。
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems 
 * @returns {void}
 *  */ 
function handleFusenSubmit(elems){
    elems.form.addEventListener("submit", async (e) => {
        e.preventDefault(); // 通常のform送信は停止する
        try{
            await upsertFusen({
                form: elems.form,
                fusenData: getFusenData(elems)
            });
            window.location.assign("/note_list/");
        }
        catch(error){
            console.error(messages.DATA_SAVE_ERROR, error);
        }
    })
}