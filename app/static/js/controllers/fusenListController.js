"use strict"
import { stopPropagation, storageModeCheck, assert } from "../common/eventUtil.js"
import { renderFusenList } from "../ui/fusenList.js";
import { renderFusenEdit } from "../ui/fusenEdit.js"
import { fetchDeleteApi, fetchReadDataApi, fetchReadDataListApi } from "../repository/apiFusenRepository.js"
import { init as setupFlip } from "../ui/fusenFlip.js"
import { messages as msg } from "../common/messages.js";
import { modalhandler } from "./modal/modalController.js";
import {init as initEditModal} from "./fusenEditController.js"

export async function init(){
    if (storageModeCheck(document.body.dataset.storageMode)){
        const result = await fetchReadDataListApi();
        assert(result.success, msg.FUSEN_DATA_FETCH_ERROR);

        renderFusenList(result.fusenList);
        setupFlip();
    }
    //ログインモーダルの初期化・イベント登録
    modalAddEventListner("login-open-button", "login-modal-overlay", "login-modal")
    //編集モーダルの初期化・イベント登録
    modalAddEventListner("edit-open-button", "edit-modal-overlay", "edit-modal")
    setupFusenListEvents();
    initEditModal();
}

function setupFusenListEvents(){
    document.addEventListener("click", async (e) => {
        const menuButton = e.target.closest(".fusen-menu-button");
        const editButton = e.target.closest(".edit-button");
        const deleteButton = e.target.closest(".delete-button");
        const loginButton = e.target.closest(".login-button");

        stopPropagation(e);

        if (menuButton){
            toggleMenu(menuButton);
            return;
        }
        if (editButton){
            await editFusen(editButton);
            return;
        }
        if (deleteButton){
            await deleteFusen(deleteButton);
            return;
        }
        if (loginButton){
            
        }

        // それ以外クリック時
        closeAllMenus();
    })
}

function toggleMenu(button){
    const currentMenu = button.closest(".fusen-menu");
    const isOpen = currentMenu.classList.contains("is-open");
    closeAllMenus();
    if (!isOpen){
        currentMenu.classList.add("is-open");
    }
}

async function deleteFusen(button){
    const result = await fetchDeleteApi(getFusenId(button))
    assert(result.success, msg.FUSEN_DATA_FETCH_ERROR);
    button.closest(".fusen").remove();
};

async function editFusen(button){
    const result = await fetchReadDataApi(getFusenId(button));
    assert(result.success, msg.FUSEN_DATA_FETCH_ERROR);
    renderFusenEdit(result.fusenData)
};


function getFusenId(element) {
  const fusenId = element.closest(".fusen")?.dataset.fusenId;
  assert(fusenId, msg.FUSEN_ID_EXIST_ERROR);
  return fusenId;
}

function closeAllMenus(){
    document.querySelectorAll(".fusen-menu.is-open").forEach(menu => {
        menu.classList.remove("is-open");
    });
}

//引数(イベント発火元Elem,　オーバレイElem, Modal本体Elem)
//モーダルOpen, closeのイベント登録
function modalAddEventListner(openButton, overlay, modal){
    const modalElems =  {
        openButton: document.getElementById(openButton),
        overlay: document.getElementById(overlay),
        modal: document.getElementById(modal)
    }
    modalhandler(modalElems);
}