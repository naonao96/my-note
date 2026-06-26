"use strict"
import { stopPropagation } from "../common/eventUtil.js"
import { fetchDeleteApi, fetchCreateApi, fetchReadDataApi } from "../repository/apiFusenRepository.js"

export function init(){
    const fusenMenuButton = document.querySelectorAll(".fusen-menu-button")
    const storageMode = document.body.dataset.storageMode
    debugger;
    if (storageMode === "login") {
    // fetch("/note_list/api/read_list")
    } else {
        // IndexedDBから読む
    }

    setupMenu(fusenMenuButton);
    setupCloseMenuOnDocumentClick();
    setupDeleteButtons();
    setupEditButtons();
}

// 付箋一覧画面で発生するイベント処理
function setupMenu(fusenMenuButton){
    fusenMenuButton.forEach((button) =>{
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const currentMenu = button.closest(".fusen-menu");
            // 自分以外で開いているメニューを閉じる
            document.querySelectorAll(".fusen-menu.is-open").forEach((menu) =>{
                if (menu !== currentMenu){
                    menu.classList.remove("is-open")
                }
            })
            currentMenu.classList.toggle("is-open");
        })
    })
}

// メニューボタン（編集・削除）外を押下時にボタン非表示とする
function setupCloseMenuOnDocumentClick(){
    document.addEventListener("click", (e) => {
        document.querySelectorAll(".fusen-menu.is-open").forEach((menu) =>{
            if (!menu.contains(e.target)){
                menu.classList.remove("is-open")
            }
        })
    })
};

// ログイン者のみ使用可能なAPI経由の削除処理
function setupDeleteButtons(){
    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId;
            fetchDeleteApi(fusenId)
        })
    })
};

function setupEditButtons(){
    document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId
            //TODO:下記はFlask Routingのままとなっているため修正
            //例：
            //const result = await fetchReadDataApi(fusenId);
            //openEditModal(result.fusenData);
            window.location.href = `/note_list/edit_note/${fusenId}`
        })  
    })
};

function setupCreateButtons(){
    const form = document.querySelector("#fusen-form");
    form.addEventListener("submit", async (e) => {
        await fetchCreateApi(form)
    })
}