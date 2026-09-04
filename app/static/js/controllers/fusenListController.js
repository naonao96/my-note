"use strict"

import { stopPropagation, assert, isLoggedIn } from "../common/eventUtil.js"
import { renderFusenList, removeFusen } from "../ui/fusenList.js";
import { setupFusenFlip } from "../ui/fusenFlip.js"
import { messages } from "../common/messages.js";
import { deleteFusen, readFusenList } from "../service/fusenService.js";
import { getElements } from "../element/fusenListElements.js";
import { setupModal } from "./modalController.js";
import { showToast } from "../common/toast.js";
import { MESSAGE_TYPE } from "../common/consts.js";

/**
 * 付箋リスト画面を初期化する。
 *
 * 付箋一覧のイベント、アカウントモーダルを設定した後、
 * 保存済みの付箋情報を取得して画面へ描画する。
 *
 * @returns {Promise<void>}
 */
export async function init(){
    const elems = getElements();

    setupFusenListEvents();
    setupAccountModal(elems);

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

/**
 * 付箋一覧で使用する操作イベントを設定する。
 *
 * メニューボタン押下時はメニューを開閉し、
 * 削除ボタン押下時は対象の付箋を削除する。
 * その他の場所を押下した場合は開いているメニューを閉じる。
 *
 * @returns {void}
 */
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
                    showToast(
                        messages.DATA_DELETE_SUCCESS,
                        MESSAGE_TYPE.SUCCESS
                    );
                }
                return;
            }
            catch(error){
                console.error(messages.DATA_DELETE_ERROR, error);
            }
        }

        closeAllMenus();
    });
}

/**
 * 指定された付箋メニューの表示状態を切り替える。
 *
 * 他に開いているメニューをすべて閉じた後、
 * 対象メニューが閉じていた場合のみ表示する。
 *
 * @param {HTMLElement} button 付箋メニューボタン
 * @returns {void}
 */
function toggleMenu(button){
    const currentMenu = button.closest(".fusen-menu");
    const isOpen = currentMenu.classList.contains("is-open");

    closeAllMenus();

    if (!isOpen){
        currentMenu.classList.add("is-open");
    }
}

/**
 * 現在開いているすべての付箋メニューを閉じる。
 *
 * @returns {void}
 */
function closeAllMenus(){
    document.querySelectorAll(".fusen-menu.is-open").forEach(menu => {
        menu.classList.remove("is-open");
    });
}

/**
 * ログイン状態に応じてアカウント関連モーダルを設定する。
 *
 * ログイン済みの場合はユーザー情報モーダル、
 * 未ログインの場合はログインモーダルを設定する。
 *
 * @param {import("../element/fusenListElements.js").FusenListElements} elems
 * @returns {void}
 */
function setupAccountModal(elems){
    if (isLoggedIn()){
        setupModal(elems.userInfoModal);
    }
    else {
        setupModal(elems.loginModal);
    }
}