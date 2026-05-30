"use strict"

"付箋一覧に関する処理を追記します。"
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".fusen-menu-button").forEach((button) =>{
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const currentMenu = button.closest(".fusen-menu");
            // 自分以外で開いているメニューを閉じる
            document.querySelectorAll(".fusen-menu.is-open").forEach((menu) =>{
                if (menu !== currentMenu){
                    menu.classList.remove("is-open")
                }
            })
            currentMenu.classList.toggle("is-open");
        })
    })

    

    document.addEventListener("click", (e) => {
        document.querySelectorAll(".fusen-menu.is-open").forEach((menu) =>{
            if (!menu.contains(e.target)){
                menu.classList.remove("is-open")
            }
        })
    })

    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId;
            
            if (confirm("この付箋を削除しますか？")){
                //下記はfetch(URL, {設定(オブジェクト：HTTPメソッド)})
                //.then() は fetch の完了後に実行される処理
                //.then() を使わない場合、
                //削除リクエストの完了を待たずに
                //後続処理が実行される可能性がある
                
                fetch(`/note_list/delete_note/${fusenId}`, {
                    method: "DELETE"
                }).then(() => {
                    location.reload();
                });
            };
        })
    })

    document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            stopPropagation(e);
            const fusenId = e.target.closest(".fusen").dataset.fusenId

            location.href = `/note_list/edit_note/${fusenId}`
        })
        
    })
})


function stopPropagation(event){
    event.stopPropagation();
    console.log("押下", event);
}