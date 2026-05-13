"use static"
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
        button.onclick = () => {
            // hidden inputに色を保存
            document.getElementById("selected-color").value = button.dataset.color;

            //いったん全部の選択状態を解除する
            colorButtons.forEach(btn => {
                btn.classList.remove("selected");
            });

            //押したボタンだけ選択状態にする
            button.classList.add("selected");
        };
    });
});


