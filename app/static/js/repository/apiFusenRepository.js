"use strict"
import { EDIT_MODE } from "../common/consts.js";
import { assert } from "../common/eventUtil.js"
import { messages } from "../common/messages.js";

export async function fetchUpsertApi(elems){
    const mode = elems.form.dataset.fusenMode
    const fusenId = elems.form.dataset.fusenId

    const url = mode === EDIT_MODE
    ? `/note_list/api/notes/${fusenId}`
    : "/note_list/api/notes"
    const method = mode === EDIT_MODE ? "PUT" : "POST" 

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(elems.fusenData) 
    });
    assert(response.ok, messages.DATA_SAVE_ERROR)
}

export async function fetchReadDataListApi(){
    const response = await fetch("/note_list/api/notes", {
        method: "GET"
    })
    assert(response.ok, messages.DATA_READ_ERROR)
    return await response.json()
}

export async function fetchReadDataApi(fusenId){
    const response = await fetch(`/note_list/api/notes/${fusenId}`, {
        method: "GET"
    })
    assert(response.ok, messages.DATA_READ_ERROR)
    return await response.json()
}

export async function fetchDeleteApi(fusenId){
    const response = await fetch(`/note_list/api/notes/${fusenId}`, {
        method: "DELETE"
    })
    assert(response.ok, messages.DATA_DELETE_ERROR)
}

