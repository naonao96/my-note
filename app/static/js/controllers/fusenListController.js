"use strict"
import { stopPropagation, storageModeCheck, assert } from "../common/eventUtil.js"
import { renderFusenList } from "../ui/fusenList.js";
import { renderFusenEdit } from "../ui/fusenEdit.js"
import { fetchDeleteApi, fetchReadDataApi, fetchReadDataListApi } from "../repository/apiFusenRepository.js"
import { init as setupFlip } from "../ui/fusenFlip.js"

const FUSEN_ID_EXIST_ERROR = "付箋IDの取得に失敗しました。"
const FUSEN_DATA_FETCH_ERROR = "付箋情報の取得に失敗しました。"

export async function init(){
    if (storageModeCheck(document.body.dataset.storageMode)){
        const result = await fetchReadDataListApi();
        assert(result.success, FUSEN_DATA_FETCH_ERROR);
        renderFusenList(result.fusenList);
        setupFlip();
    }

    const fusenMenuButton = document.querySelectorAll(".fusen-menu-button");
    setupMenu(fusenMenuButton);
    setupCloseMenuOnDocumentClick();
    setupDeleteButtons();
    setupEditButtons();
}

// 付箋一覧画面で発生するイベント処理
function setupMenu(fusenMenuButton){
    fusenMenuButton.forEach( button =>{
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const currentMenu = button.closest(".fusen-menu");
            // 自分以外で開いているメニューを閉じる
            document.querySelectorAll(".fusen-menu.is-open").forEach( menu =>{
                if (menu !== currentMenu){
                    menu.classList.remove("is-open")
                }
            })
            currentMenu.classList.toggle("is-open");
        })
    })
}

// メニューボタン押下イベントハンドラ（編集・削除ボタン外を押下時に編集・削除ボタンを非表示とする）
function setupCloseMenuOnDocumentClick(){
    document.addEventListener("click", (e) => {
        document.querySelectorAll(".fusen-menu.is-open").forEach( menu =>{
            if (!menu.contains(e.target)){
                menu.classList.remove("is-open")
            }
        })
    })
};

// 削除ボタン押下イベントハンドラ（ログイン者のみ使用可能なAPI経由の削除処理）
function setupDeleteButtons(){
    document.querySelectorAll(".delete-button").forEach( button => {
        button.addEventListener("click", async (e) => {
            stopPropagation(e);
            let fusenId = e.target.closest(".fusen").dataset.fusenId;
            assert(fusenId, FUSEN_ID_EXIST_ERROR)
            await fetchDeleteApi(fusenId)
        })
    })
};

//編集ボタン押下イベントハンドラ
function setupEditButtons(){
    document.querySelectorAll(".edit-button").forEach( button => {
        button.addEventListener("click", async (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId
            assert(fusenId, FUSEN_ID_EXIST_ERROR)
            //TODO:将来モーダル化予定
            //openEditModal(result.fusenData);
            const result = await fetchReadDataApi(fusenId);
            assert(result.success, FUSEN_DATA_FETCH_ERROR);
            renderFusenEdit(result.fusenData)
        })
    })
};