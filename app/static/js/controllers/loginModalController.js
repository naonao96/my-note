"use strict"

export function initLoginModal(){
    const openButton = document.getElementById("login-open-button");
    const overlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("login-modal");

    openButton.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        modal.classList.remove("hidden");
    });

    overlay.addEventListener("click", () => {
        overlay.classList.add("hidden");
        modal.classList.add("hidden");
    });
}