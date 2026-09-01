"use strict"
import { stopPropagation, assert, isLoggedIn } from "../common/eventUtil.js"
import { renderFusenList } from "../ui/fusenList.js";
import { removeFusen } from "../ui/fusenList.js"
import { setupFusenFlip } from "../ui/fusenFlip.js"
import { messages } from "../common/messages.js";
import { deleteFusen, readFusenList } from "../service/fusenService.js";
import { getElements } from "../element/fusenListElements.js";
import { setupModal } from "./modalController.js";
import { showToast } from "../common/toast.js";
import { MESSAGE_TYPE } from "../common/consts.js";

/**
 * 付箋リスト画面の初期化を行います。
 * 
 * @returns {Promise<void>}
 */
export async function init(){
    const elems = getElements();

    setupFusenListEvents();
    /* TODO:ログイン機能は完成後リリース */
    //setupAccountModal(elems);

    try{
        const result = await readFusenList();
        assert(result, messages.CONDITIONS_UNDEFINED_ERROR);
        if (result.fusenList){
            renderFusenList(result.fusenList);
            setupFusenFlip(elems.fusenListWindow);
        }
    }
    catch(error){
        console.error(messages.DATA_READ_ERROR, error);
    }
}

function setupFusenListEvents(){
    document.addEventListener("pointerdown", async (e) => {
        const menuButton = e.target.closest(".fusen-menu-button");
        const deleteButton = e.target.closest(".delete-button");
        
        if (menuButton){
            stopPropagation(e);
            toggleMenu(menuButton);
            return;
        }
        if (deleteButton){
            stopPropagation(e);
            try{
                if(await deleteFusen(deleteButton)) {
                    removeFusen(deleteButton);
                    showToast(messages.DATA_DELETE_SUCCESS, MESSAGE_TYPE.SUCCESS);
                }
                return;
            }
            catch(error){
                console.error(messages.DATA_DELETE_ERROR, error);
            }
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

function closeAllMenus(){
    document.querySelectorAll(".fusen-menu.is-open").forEach(menu => {
        menu.classList.remove("is-open");
    });
}

/**
 * ログイン状態に応じたアカウント用モーダルを設定します。
 * @param {import("../element/fusenListElements.js").FusenListElements} elems 
 */
function setupAccountModal(elems){
    if (isLoggedIn()){
        setupModal(elems.userInfoModal)
    }
    else {
        setupModal(elems.loginModal)
    }
}