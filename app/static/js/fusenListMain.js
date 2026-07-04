'use strict'
import {init as initListWindow} from "./controllers/fusenListController.js"
import { initLoginModal } from "./controllers/loginModalController.js";

document.addEventListener("DOMContentLoaded", initLoginModal);
document.addEventListener('DOMContentLoaded', initListWindow);