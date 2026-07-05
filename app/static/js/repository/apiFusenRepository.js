"use strict"
import { assert } from "../common/eventUtil.js"
import { messages as msg } from "../common/messages.js";

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
    assert(response.ok, msg.DATA_SAVE_ERROR)
    window.location.assign("/note_list/")
}

export async function fetchReadDataListApi(){
    const response = await fetch("/note_list/api/notes", {
        method: "GET"
    })
    assert(response.ok, msg.DATA_READ_ERROR)

    return await response.json()
}

export async function fetchReadDataApi(fusenId){
    const response = await fetch(`/note_list/api/notes/${fusenId}`, {
        method: "GET"
    })
    assert(response.ok, msg.DATA_READ_ERROR)

    return await response.json()
}

export async function fetchDeleteApi(fusenId){
    if (!confirm("この付箋を削除しますか？")){
        return {
            success: false
        };          
    }
    const response = await fetch(`/note_list/api/notes/${fusenId}`, {
        method: "DELETE"
    })
    assert(response.ok, msg.DATA_DELETE_ERROR)

    return await response.json()
}

