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