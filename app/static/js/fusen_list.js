"use strict"

"付箋一覧に関する処理を追記します。"
document.addEventListener("DOMContentLoaded", () => {
    const menuButtons = document.querySelectorAll(".fusen-menu-button");

    menuButtons.forEach((button) =>{
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("メニュー押下！！", e);
        })
    })
})