"use strict"

export function fetchCreateApi(form){
    const mode = form.dataset.mode
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
    const response = fetch(url, {
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
    window.location.href = "/note_list/"
}

export  function fetchReadDataApi(fusenId){
    fetch(`/note_list/api/notes/${fusenId}`, {
        method: "GET"
    }).then(() => {
        location.reload();
    });
}

export function fetchDeleteApi(e, fusenId){
    if (confirm("この付箋を削除しますか？")){            
        fetch(`/note_list/api/notes/${fusenId}`, {
            method: "DELETE"
        }).then(() => {
            location.reload();
        });
    }
}

