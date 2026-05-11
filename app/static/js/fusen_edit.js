document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#datepicker", {
        enableTime: false,
        dateFormat: "Y-m-d",
    });

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


