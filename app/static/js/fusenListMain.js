'use strict'
import { init as initListWindow} from "./controllers/fusenListController.js"
import { init as initEditModal} from "./controllers/fusenEditController.js"
import { setupModal } from "./controllers/modalController.js";

document.addEventListener("DOMContentLoaded", () => {
    setupModal(
        "#login-open-button",
        "login-modal-overlay",
        "login-modal"
    );
    initListWindow();
    initEditModal();
});