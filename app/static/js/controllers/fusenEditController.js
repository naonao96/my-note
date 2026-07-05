"use strict"
import { fetchCreateApi } from "../repository/apiFusenRepository.js"
import { setupFusenFlip } from "../ui/fusenFlip.js"

export function init(){
    const elems = getElements();
    setupFlatpickr();
    colorSelect(elems);
    realtimePreview(elems);
    createFusen(elems);
    setupFusenFlip(elems.editModal);
}

function getElements(){
    return {
        colorButtons: document.querySelectorAll(".color-option"),
        selectedColor: document.getElementById("selected-color"),
        contentData: document.getElementById("content"),
        fusenContent: document.getElementById("fusen-content"),
        expiresAtData: document.getElementById("datepicker"),
        fusenExpiresAt: document.getElementById("fusen-expires-at"),
        createFusenForm: document.getElementById("fusen-form"),
        editModal: document.getElementById("edit-modal")
    }
}

// 期限日の設定
function setupFlatpickr() {
    flatpickr("#datepicker", {
        enableTime: false,
        dateFormat: "Y-m-d",
    });
}

// 付箋カラー選択（自動・手動）
function colorSelect(elems){
    removeAllSelected(elems.colorButtons);
    elems.colorButtons.forEach(button => {
        initSelectedColor(button, elems.selectedColor);
        const handler = () => {
            handleColorSelect(button, elems.selectedColor, elems.colorButtons, elems.editModal)
        }
        button.addEventListener("click", handler);
    });
}

// 内容・期限をリアルタイムに変更する
function realtimePreview(elems) {
    const preview = () => {
        updatePreview(elems.contentData, elems.fusenContent, elems.expiresAtData, elems.fusenExpiresAt);
    }
    preview();
    elems.contentData.addEventListener("input", preview);
    elems.expiresAtData.addEventListener("input", preview);
};

// 付箋情報を保存
function createFusen(elems){
    elems.createFusenForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // 通常のform送信は停止する
        await fetchCreateApi(form)
    })
}

//　初回の付箋色の選択（編集モードなら一覧から引き継ぎ）
function initSelectedColor(button, selectedColor){
    if (button.dataset.color === selectedColor.value ){
        addSelected(button);
    }
}

// 初回以降（手動で選択で表示切替）
function handleColorSelect(button, selectedColor, colorButtons, editModal){
    selectedColor.value = button.dataset.color;
    removeAllSelected(colorButtons);
    addSelected(button);
    reflectFusenColor(editModal, button.dataset.color);
}

// 付箋プレビューの色も付箋色選択パレットと同期する
function reflectFusenColor(editModal, color){
    editModal.querySelectorAll(".fusen-front, .fusen-back").forEach(fusen => {
        fusen.style.setProperty("--fusen-color", color)
    });
}

// 付箋プレビューへ期限日を同期
function updatePreview(contentData, fusenContent, expiresAtData, fusenExpiresAt){
    fusenContent.textContent = contentData.value;
    if (expiresAtData.value){
        fusenExpiresAt.textContent =  `期限日：${expiresAtData.value} `;
    }
    else{
        fusenExpiresAt.textContent = "期限日なし";
    }  
}

// 付箋色選択パレットの選択状態をリセット
function removeAllSelected(colorButtons){
    colorButtons.forEach(colorButton => {
        colorButton.classList.remove("selected");
    });
}

// 付箋色選択パレットでユーザが選択した色を有効化
function addSelected(button){
    button.classList.add("selected");
}