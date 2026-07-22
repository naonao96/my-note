"use strict"

//　初回の付箋色の選択（編集モードなら一覧から引き継ぎ）
export function syncSelectedColor(elems) {
    removeAllSelected(elems);
    const selectedButton = [...elems.colorButtons].find(
        (button) => button.dataset.color === elems.selectedColor.value
    )

    if (!selectedButton) return;

    addSelected(selectedButton);
    updateColorPreview(elems.editModal, selectedButton.dataset.color);
}

// 初回以降（手動で選択で表示切替）
export function handleColorSelect(button, elems){
    elems.selectedColor.value = button.dataset.color;
    syncSelectedColor(elems);
}

// 付箋プレビューへ期限日を同期
export function updatePreview(elems){
    elems.fusenContent.textContent = elems.contentData.value;
    elems.fusenExpiresAt.textContent = elems.expiresAtData.value 
        ? `期限日：${elems.expiresAtData.value} ` 
        : "期限日なし";
}

// 付箋色選択パレットの選択状態をリセット
export function removeAllSelected(elems){
    elems.colorButtons.forEach(colorButton => {
        colorButton.classList.remove("selected");
    });
}

export function getFusenData(elems){
     return {
        content: elems.preview.contentData.value,
        color: elems.color.selectedColor.value,
        expires_at: elems.preview.expiresAtData.value
     }
}

// 付箋色選択パレットでユーザが選択した色を有効化
function addSelected(button){
    button.classList.add("selected");
}

// 付箋プレビューの色も付箋色選択パレットと同期する
function updateColorPreview(editModal, color){
    editModal.querySelectorAll(".fusen-front, .fusen-back").forEach(fusen => {
        fusen.style.setProperty("--fusen-color", color)
    });
}