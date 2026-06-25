"use strict"

export function init(){
    const colorButtons = document.querySelectorAll(".color-option");
    const selectedColor = document.getElementById("selected-color");
    const contentData = document.getElementById("content");
    const fusenContent = document.getElementById("fusen-content");
    const expiresAtData = document.getElementById("datepicker");
    const fusenExpiresAt = document.getElementById("fusen-expires-at");

    initExpiresAt();
    setupColorSelect(colorButtons, selectedColor);
    setupRealtimePreview(contentData, fusenContent, expiresAtData, fusenExpiresAt);
}

// 期限日の設定
function initExpiresAt() {
    flatpickr("#datepicker", {
        enableTime: false,
        dateFormat: "Y-m-d",
    });
}

// 付箋カラー選択（自動・手動）
function setupColorSelect(colorButtons, selectedColor){
    colorButtons.forEach((button) => {
        // 初回カラー選択処理
        if (button.dataset.color === selectedColor.value ){
            button.classList.add("selected");
        }
        else {
            button.classList.remove("selected");
        }
        //　初回以降選択処理
        button.addEventListener("click", () => {
            // hidden inputに色を保存
            selectedColor.value = button.dataset.color;

            //いったん全部の選択状態を解除する
            colorButtons.forEach(btn => {
                btn.classList.remove("selected");
            });

            //押したボタンだけ選択状態にする
            button.classList.add("selected");

            //プレビュー用の付箋へ色をリアルタイムで反映する
            document.querySelectorAll(".fusen-front, .fusen-back").forEach(fusen => {
                fusen.style.setProperty("--fusen-color", button.dataset.color)
            });
        });
    });
}

function setupRealtimePreview(contentData, fusenContent, expiresAtData, fusenExpiresAt) {
    /*formへ入力した値をリアルタイムで反映する*/
    function updatePreview(){
        fusenContent.textContent = contentData.value;
        if (expiresAtData.value){
            fusenExpiresAt.textContent =  `期限日：${expiresAtData.value} `;
        }
        else
           fusenExpiresAt.textContent = "期限日なし";
    }
    //初回起動時に実行
    updatePreview()
    contentData.addEventListener("input", updatePreview);
    expiresAtData.addEventListener("input", updatePreview);
};