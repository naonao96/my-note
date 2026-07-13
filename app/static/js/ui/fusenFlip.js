"use strict"

import { assert } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";

export function setupFusenFlip(elem) {
  assert(elem, messages.CONDITIONS_UNDIFINED_ERROR);
  elem.addEventListener("click", (e) => {
    if (e.target.closest(".fusen-menu"))
      return;

    const fusen = e.target.closest(".fusen")
    if (!fusen)
      return;

    fusen.classList.toggle('isFusenClick');
  })
};