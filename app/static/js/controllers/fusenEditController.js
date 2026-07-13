"use strict"

import { upsertFusen, readFusen } from "../service/fusenService.js";
import { getFusenData, handleColorSelect, syncSelectedColor, updatePreview } from "../ui/fusenEdit.js";
import { setupFusenFlip } from "../ui/fusenFlip.js"
import { setCreateModal, setEditModal } from "../view/modalView.js";
import { openModal, setupModal } from "./modalController.js";
import { messages } from "../common/messages.js";
import { assert } from "../common/eventUtil.js";

export function init(){
    const elems = getElements();

    setupFlatpickr();
    setupColorSelectedButtons(elems.color);
    realtimePreview(elems.preview);
    handleFusenSubmit(elems);
    setupFusenFlip(elems.modal.modal);
    setupCreateModalOpen(elems);
    setupEditModalOpen(elems);
}

function getElements() {
    return {
        form: document.getElementById("fusen-form"),

        modal: {
            overlay: document.getElementById("edit-modal-overlay"),
            modal: document.getElementById("edit-modal")
        },

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
        },

        createButton: document.getElementById("create-open-button"),
    };
}

function setupCreateModalOpen(elems) {
    setupModal(
        "#create-open-button",
        "edit-modal-overlay",
        "edit-modal",
        () => {
            setCreateModal(elems.form);
            syncSelectedColor(elems.color);
            updatePreview(elems.preview);
        }
    );
}

function setupEditModalOpen(elems) {
    document.addEventListener("click", async (e) => {
        const editButton = e.target.closest(".edit-button");

        if (!editButton) return;

        e.preventDefault();

        const result = await readFusen(editButton);

        assert(result?.fusenData, messages.CONDITIONS_UNDIFINED_ERROR);

        setEditModal(elems.form, result.fusenData);
        syncSelectedColor(elems.color);
        updatePreview(elems.preview);
        openModal(elems.modal);
    });
}

// 期限日の設定
function setupFlatpickr() {
    flatpickr("#datepicker", {
        enableTime: false,
        dateFormat: "Y-m-d",
    });
}

// 付箋カラー選択（自動・手動）
function setupColorSelectedButtons(elems){
    syncSelectedColor(elems);
    elems.colorButtons.forEach(button => {
        button.addEventListener("click", () => {
            handleColorSelect(button, elems)
        });
    });
}

// 内容・期限をリアルタイムに変更する
function realtimePreview(elems) {
    elems.contentData.addEventListener("input", () => {
        updatePreview(elems);
    });
    elems.expiresAtData.addEventListener("input", () => {
        updatePreview(elems);
    });
};

function handleFusenSubmit(elems){
    elems.form.addEventListener("submit", async (e) => {
        e.preventDefault(); // 通常のform送信は停止する

        await upsertFusen({
            form: elems.form,
            fusenData: getFusenData(elems)
        });

        window.location.assign("/note_list/");
    })
}