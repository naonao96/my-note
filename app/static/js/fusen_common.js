/*On click from fusen card*/
document.addEventListener("DOMContentLoaded", function() {
  const fusenList = document.querySelectorAll('.fusen, .fusen-edit') 
  fusenList.forEach( fusenClick => {
    fusenClick.onclick = () => {
      fusenClick.classList.toggle('isFusenClick');
    }
  }
)
});




