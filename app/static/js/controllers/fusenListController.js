"use strict"
import { stopPropagation, storageModeCheck, apiResultCheck } from "../common/eventUtil.js"
import { renderFusenList } from "../ui/fusenList.js";
import { fetchDeleteApi, fetchReadDataApi, fetchReadDataListApi } from "../repository/apiFusenRepository.js"

export async function init(){
    if (storageModeCheck(document.body.dataset.storageMode)){
        const result = await fetchReadDataListApi();
        if (apiResultCheck(result.success)){
            renderFusenList(result.fusenList)
        }   
    }

    const fusenMenuButton = document.querySelectorAll(".fusen-menu-button");
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
        button.addEventListener("click", async (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId;
            await fetchDeleteApi(fusenId)
        })
    })
};

function setupEditButtons(){
    document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", async (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId
            //TODO:将来モーダル化予定
            //openEditModal(result.fusenData);
            const result = await fetchReadDataApi(fusenId);
            console.log(result)
        })  
    })
};