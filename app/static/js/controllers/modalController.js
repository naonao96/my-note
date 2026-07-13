"use strict"
import { assert } from "../common/eventUtil.js"
import { messages } from "../common/messages.js";

export function setupModal(openButtonSelector, overlayId, modalId, beforeOpen) {
    const elems = {
        openButton: document.querySelector(openButtonSelector),
        overlay: document.getElementById(overlayId),
        modal: document.getElementById(modalId)
    };
    assert(elems.openButton, messages.CONDITIONS_UNDIFINED_ERROR);
    assert(elems.overlay, messages.CONDITIONS_UNDIFINED_ERROR);
    assert(elems.modal, messages.CONDITIONS_UNDIFINED_ERROR);

    elems.openButton.addEventListener("click", () => {
        beforeOpen?.();
        openModal(elems);
    });

    elems.overlay.addEventListener("click", () => {
        closeModal(elems);
    });
}

export function openModal(elems) {
    elems.overlay.classList.remove("hidden");
    elems.modal.classList.remove("hidden");
}

export function closeModal(elems) {
    elems.overlay.classList.add("hidden");
    elems.modal.classList.add("hidden");
}