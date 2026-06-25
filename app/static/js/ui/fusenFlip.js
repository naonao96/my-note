"use strict"

export function init() {
  const fusenList = document.querySelectorAll('.fusen, .fusen-edit') 
  fusenList.forEach( fusenClick => {
    fusenClick.addEventListener("click", fusenToggleChange);
  })
};

// 付箋裏表変更
function fusenToggleChange(clickEvent){
  clickEvent.currentTarget.classList.toggle('isFusenClick');
};