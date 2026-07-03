"use strict"

export function init() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".fusen-menu"))
      return;

    const fusen = e.target.closest(".fusen")
    if (!fusen)
      return;

    fusen.classList.toggle('isFusenClick');
  })
};