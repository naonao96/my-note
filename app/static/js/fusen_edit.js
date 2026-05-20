"use strict"
/*HTML読み込み完了後に*/
document.addEventListener('DOMContentLoaded', function() {
    /* 期限日の設定時 */
    flatpickr("#datepicker", {
        enableTime: false,
        dateFormat: "Y-m-d",
    });

    /* 付箋カラーの選択時 */
    const colorButtons = document.querySelectorAll(".color-option");
    
    colorButtons.forEach( button => {
        button.addEventListener("click", () => {
            // hidden inputに色を保存
            document.getElementById("selected-color").value = button.dataset.color;

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

    /*formへ入力した値をリアルタイムで反映する*/
    const contentData = document.getElementById("content");
    const fusenContent = document.getElementById("fusen-content");
    const expiresAtData = document.getElementById("datepicker");
    const fusenExpiresAt = document.getElementById("fusen-expires-at");

    function updatePreview(){
        fusenContent.innerHTML = contentData.value.replace(/\n/g, "<br>");
        
        if (expiresAtData.value){
            fusenExpiresAt.textContent =  `期限日：${expiresAtData.value} `;
        }
        else
           fusenExpiresAt.textContent = "期限日なし";
    }

    contentData.addEventListener("input", updatePreview);
    expiresAtData.addEventListener("input", updatePreview);
});


