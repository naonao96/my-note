"use strict"
import { stopPropagation } from "../common/eventUtil.js"

export function init(){
    const fusenMenuButton = document.querySelectorAll(".fusen-menu-button")
    const storageMode = document.body.dataset.storageMode

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

function setupCloseMenuOnDocumentClick(){
    document.addEventListener("click", (e) => {
        document.querySelectorAll(".fusen-menu.is-open").forEach((menu) =>{
            if (!menu.contains(e.target)){
                menu.classList.remove("is-open")
            }
        })
    })
};

function setupDeleteButtons(){
    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId;
            
            if (confirm("この付箋を削除しますか？")){
                //下記はfetch(URL, {設定(オブジェクト：HTTPメソッド)})
                //.then() は fetch の完了後に実行される処理
                //.then() を使わない場合、
                //削除リクエストの完了を待たずに
                //後続処理が実行される可能性がある
                
                fetch(`/note_list/delete_note/${fusenId}`, {
                    method: "DELETE"
                }).then(() => {
                    location.reload();
                });
            };
        })
    })
};

function setupEditButtons(){
    document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId
            window.location.href = `/note_list/edit_note/${fusenId}`
        })  
    })
};