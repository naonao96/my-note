"use strict"

const retryButton = document.querySelector(".retry-button");

window.addEventListener("online", () => {
    location.assign("/");
})

retryButton.addEventListener("pointerdown", () => {
    location.assign("/");
})