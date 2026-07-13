"use strict"
import { stopPropagation, storageModeCheck, assert, getFusenId } from "../common/eventUtil.js"
import { renderFusenList } from "../ui/fusenList.js";
import { removefusen } from "../ui/fusenList.js"
import { setupFusenFlip } from "../ui/fusenFlip.js"
import { messages, messages as msg } from "../common/messages.js";
import { deleteFusen, readFusenList } from "../service/fusenService.js";


export async function init(){
    const elems = getElements();
    const result = await readFusenList();
    assert(result, messages.CONDITIONS_UNDIFINED_ERROR);
    
    if (result.fusenList){
        renderFusenList(result.fusenList);
        setupFusenFlip(elems.fusenListWindow);
        setupFusenListEvents(elems);
    }
}

function getElements(){
    return {
        fusenListWindow: document.getElementById("fusen-list")
    }
}

function setupFusenListEvents(){
    document.addEventListener("click", async (e) => {
        //　ログイン・作成・編集ボタンに関してはモーダル起動のためModalController.jsにて管理
        const menuButton = e.target.closest(".fusen-menu-button");
        const deleteButton = e.target.closest(".delete-button");
        
        if (menuButton){
            stopPropagation(e);
            toggleMenu(menuButton);
            return;
        }
        if (deleteButton){
            stopPropagation(e);
            if(await deleteFusen(deleteButton)){
                removefusen(deleteButton)
            }
            return;
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