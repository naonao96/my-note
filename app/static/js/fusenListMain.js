'use strict'
import { init as initListWindow} from "./controllers/fusenListController.js"
import { init as initModal } from "./controllers/modalController.js"

document.addEventListener('DOMContentLoaded', () => {
    initListWindow();
    initModal();
});