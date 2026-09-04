'use strict'
import { init as initListWindow} from "./controllers/fusenListController.js"
import { init as initEditModal} from "./controllers/fusenEditController.js"
import { updateAuthButton, setupAccountDelete, setupGoogleLogin } from "./controllers/authController.js";

document.addEventListener("DOMContentLoaded", () => {
    updateAuthButton();
    setupAccountDelete();
    setupGoogleLogin();
    initListWindow();
    initEditModal();
});