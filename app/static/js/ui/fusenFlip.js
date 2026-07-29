"use strict"

import { assert } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";

export function setupFusenFlip(elem) {
  assert(elem, messages.CONDITIONS_UNDEFINED_ERROR);
  elem.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".fusen-menu"))
      return;

    const fusen = e.target.closest(".fusen")
    if (!fusen)
      return;

    fusen.classList.toggle('isFusenClick');
  })
};