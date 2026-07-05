"use strict"
import { assert } from "../../common/eventUtil.js"
import { messages as msg } from "../../common/messages.js";

export function modalhandler(elems){
    assert(elems, msg.CONDITIONS_UNDIFINED_ERROR)
    elems.openButton.addEventListener("click", () => {
        openModal(elems);
    });

    elems.overlay.addEventListener("click", () => {
        closeModal(elems);
    });
}

export function openModal(elems){
    elems.overlay.classList.remove("hidden");
    elems.modal.classList.remove("hidden");
}

export function closeModal(elems){
    elems.overlay.classList.add("hidden");
    elems.modal.classList.add("hidden");
}