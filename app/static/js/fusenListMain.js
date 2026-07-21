'use strict'
import { init as initListWindow} from "./controllers/fusenListController.js"
import { init as initEditModal} from "./controllers/fusenEditController.js"
import { setupModal } from "./controllers/modalController.js";
import { updateAuthButton } from "./controllers/authController.js";

document.addEventListener("DOMContentLoaded", () => {
    updateAuthButton();

    setupModal(
        "#login-open-button",
        "login-modal-overlay",
        "login-modal"
    );
    initListWindow();
    initEditModal();
});