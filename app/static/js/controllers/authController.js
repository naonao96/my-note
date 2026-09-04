"use strict"

import { isLoggedIn } from "../common/eventUtil.js";

export function updateAuthButton(){
    const loginButton = document.getElementById("login-open-button");
    const userButton = document.getElementById("user-info-button");

    const loggedIn = isLoggedIn();

    loginButton.classList.toggle("hidden", loggedIn);
    userButton.classList.toggle("hidden", !loggedIn);
}

export function setupAccountDelete(){
    const accountDeleteButton = document.getElementById("account-delete-button");
    const accountDeleteForm = document.getElementById("account-delete-form");

    accountDeleteButton.addEventListener("click", () => {
        const confirmed = window.confirm(
            "アカウントを削除しますか？\nこの操作は取り消せません。"
        );

        if (!confirmed) {
            return;
        }

        accountDeleteForm.requestSubmit();
    });
}

export function setupGoogleLogin() {
    const googleLoginButton = document.getElementById("google-login-button");

    googleLoginButton.addEventListener("click", () => {
        window.location.href = googleLoginButton.dataset.loginUrl;
    });
}