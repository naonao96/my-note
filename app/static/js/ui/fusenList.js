'use strict'

export function renderFusenList(fusenList){
    const container = document.querySelector(".fusen-container");
    const template = document.querySelector("#fusen-template");

    fusenList.forEach((fusen) => {
        const clone = template.content.cloneNode(true);

        const fusenElement = clone.querySelector(".fusen");
        const front = clone.querySelector(".fusen-front");
        const back = clone.querySelector(".fusen-back");

        fusenElement.dataset.fusenId = fusen.id;
        fusenElement.style.setProperty("--fusen-color", fusen.color)
        
        front.textContent = fusen.content
        back.textContent = fusen.expires_at
            ? `期限日：${fusen.expires_at}`
            : "期限日なし" ;
        
        container.appendChild(clone);
    });
}

        