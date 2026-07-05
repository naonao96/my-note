"use strict"

export function renderFusenEdit(fusenData){
    const form = document.getElementById("fusen-form");
    const content = document.getElementById("content");
    const expiresAt = document.getElementById("datepicker")
    const color = document.getElementById("selected-color")

    form.dataset.fusenId = fusenData.fusenId;
    content.value = fusenData.content ?? "";
    expiresAt.value = fusenData.expires_at ?? "";
    color.value = fusenData.color ?? "#A9CEEC";
}

//TODO:フォームを開くときは一度初期化を行うよう修正
function resetFusenForm(){
    document.getElementById("content").value = "";
    document.getElementById("datepicker").value = "";
    document.getElementById("selected-color").value = "#A9CEEC";

    document.getElementById("fusen-content").textContent = "";
    document.getElementById("fusen-expires-at").textContent = "";
    
    const fusen = document.querySelector("#edit-modal .fusen");
    fusen.style.setProperty("--fusen-color", "#A9CEEC");
}