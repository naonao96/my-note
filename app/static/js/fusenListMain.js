'use strict'
import {init as fusenFlip} from "./ui/fusenFlip.js"
import {init as initListWindow} from "./controllers/fusenListController.js"
    
/*HTML読み込み完了後に*/
document.addEventListener('DOMContentLoaded', fusenFlip)
document.addEventListener('DOMContentLoaded', initListWindow);