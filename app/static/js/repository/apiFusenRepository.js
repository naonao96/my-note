"use strict"

export async function fetchCreateApi(form){
    const mode = form.dataset.fusenMode
    const fusenId = form.dataset.fusenId

    const url = mode === "edit"
    ? `/note_list/api/notes/${fusenId}`
    : "/note_list/api/notes"
    const method = mode === "edit" ? "PUT" : "POST" 

    const body = {
            content: document.querySelector("#content").value,
            color: document.querySelector("#selected-color").value,
            expires_at: document.querySelector("#datepicker").value
        }
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(body) 
    });

    if (!response.ok){
        alert("保存に失敗しました。")
        return;
    }
    console.log("redirect start")
    window.location.assign("/note_list/")
    console.log("redirect end")
}

export async function fetchReadDataListApi(){
    const response = await fetch("/note_list/api/notes", {
        method: "GET"
    })
    if (!response.ok){
        alert("付箋情報の取得に失敗しました。")
        return;
    }
    return await response.json()
}

export async function fetchReadDataApi(fusenId){
    const response = await fetch(`/note_list/api/notes/${fusenId}`, {
        method: "GET"
    })
    if (!response.ok){
        alert("付箋情報の取得に失敗しました。")
        return;
    }
    return await response.json()
}

export function fetchDeleteApi(fusenId){
    if (confirm("この付箋を削除しますか？")){            
        fetch(`/note_list/api/notes/${fusenId}`, {
            method: "DELETE"
        }).then(() => {
            location.reload();
        });
    }
}

