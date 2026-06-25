'use strict'
import {init as initEditWindow} from "./controllers/fusenEditController"

/*HTML読み込み完了後に*/
document.addEventListener('DOMContentLoaded', initEditWindow);