"use strict"

import { isLoggedIn } from "../common/eventUtil.js";

export function updateAuthButton(){
    const loginButton = document.getElementById("login-open-button");
    const userButton = document.getElementById("user-info-button");

    const loggedIn = isLoggedIn();

    loginButton.classList.toggle("hidden", loggedIn);
    userButton.classList.toggle("hidden", !loggedIn);
}