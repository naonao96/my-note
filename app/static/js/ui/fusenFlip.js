"use strict"

export function init() {
  document.addEventListener("click", (e) => {
    const fusen = e.target.closest(".fusen")
    if (!fusen)
      return;
    fusenToggleChange(fusen);
  })
};

// 付箋裏表変更
function fusenToggleChange(fusen){
  fusen.classList.toggle('isFusenClick');
};