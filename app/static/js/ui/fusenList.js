'use strict'

import { assert } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";

export function renderFusenList(fusenList){
    assert(fusenList, messages.CONDITIONS_UNDIFINED_ERROR)
    const container = document.querySelector(".fusen-container");
    const template = document.querySelector("#fusen-template");

    fusenList.forEach((fusen) => {
        const clone = template.content.cloneNode(true);

        const fusenElement = clone.querySelector(".fusen");
        const front = clone.querySelector(".fusen-content");
        const back = clone.querySelector(".fusen-expires-at");

        fusenElement.dataset.fusenId = fusen.id;
        fusenElement.style.setProperty("--fusen-color", fusen.color)
        
        front.textContent = fusen.content
        back.textContent = fusen.expires_at
            ? `期限日：${fusen.expires_at}`
            : "期限日なし" ;
        
        container.appendChild(clone);
    });
}

// UIから付箋UIを削除する
export function removeFusen(button){
    button.closest(".fusen").remove();
}

        