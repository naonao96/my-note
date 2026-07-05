"use strict"
import { assert, getFusenId } from "../common/eventUtil.js"
import { messages } from "../common/messages.js";
import { init as initEditModal } from "./fusenEditController.js"
import { fetchReadDataApi } from "../repository/apiFusenRepository.js"
import { renderFusenEdit } from "../ui/fusenEdit.js";

export function init(){
    modalAddEventListner("#login-open-button", "login-modal-overlay", "login-modal")
    modalAddEventListner("#create-open-button", "edit-modal-overlay", "edit-modal")
    editModalAddEventListner("edit-modal-overlay", "edit-modal")
    initEditModal();
}

//引数(イベント発火元Elem,　オーバレイElem, Modal本体Elem)
//openButtonはclassとidどちらからも取得可能となるようquerySelectorを使用
//モーダルOpen, closeのイベント登録
function modalAddEventListner(openButton, overlay, modal){
    const modalElems =  {
        openButton: document.querySelector(openButton),
        overlay: document.getElementById(overlay),
        modal: document.getElementById(modal)
    }
    modalhandler(modalElems);
}

//引数(オーバレイElem, Modal本体Elem)
//編集ボタンは複数存在するため特注関数作成
function editModalAddEventListner(overlay, modal){
    const modalElems = {
        overlay: document.getElementById(overlay),
        modal: document.getElementById(modal)
    };

    document.addEventListener("click", async (e) => {
        const editButton = e.target.closest(".edit-button");

        if (!editButton) return;

        await editFusen(editButton);
        openModal(modalElems);
    });

    modalElems.overlay.addEventListener("click", () => {
        closeModal(modalElems);
    });
}

function modalhandler(elems){
    assert(elems, messages.CONDITIONS_UNDIFINED_ERROR)
    elems.openButton.addEventListener("click", () => {
        openModal(elems);
    });

    elems.overlay.addEventListener("click", () => {
        closeModal(elems);
    });
}

export function openModal(elems){
    elems.overlay.classList.remove("hidden");
    elems.modal.classList.remove("hidden");
}

export function closeModal(elems){
    elems.overlay.classList.add("hidden");
    elems.modal.classList.add("hidden");
}

async function editFusen(button){
    form.dataset.fusenMode = "edit";
    form.dataset.fusenId = getFusenId(button);
    const result = await fetchReadDataApi(getFusenId(button));
    assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
    renderFusenEdit(result.fusenData)
};