"use strict"
import { EDIT_MODE } from "../common/consts.js";
import { assert } from "../common/eventUtil.js"
import { messages } from "../common/messages.js";
import { getCsrfToken } from "../element/commonElements.js";

export async function fetchUpsertApi(requestData){
    assert(requestData, messages.CONDITIONS_UNDEFINED_ERROR);
    const mode = requestData.form.dataset.fusenMode;
    const fusenId = Number(requestData.form.dataset.fusenId);
    if (mode === EDIT_MODE){
        assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
    }
    const url = mode === EDIT_MODE
    ? `/note_list/api/notes/${fusenId}`
    : "/note_list/api/notes";
    const method = mode === EDIT_MODE ? "PUT" : "POST";
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type" : "application/json",
            ...getCsrfHeaders()
        },
        body: JSON.stringify(requestData.fusenData) 
    });
    assert(response.ok, `${messages.DATA_SAVE_ERROR} status=${response.status}`);
}

export async function fetchReadDataListApi(){
    const response = await fetch("/note_list/api/notes");
    assert(response.ok, `${messages.DATA_READ_ERROR} status=${response.status}`);
    return await response.json()
}

export async function fetchReadDataApi(fusenId){
    assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
    const response = await fetch(`/note_list/api/notes/${fusenId}`);
    assert(response.ok, `${messages.DATA_READ_ERROR} status=${response.status}`);
    return await response.json();
}

export async function fetchDeleteApi(fusenId){
    assert(Number.isInteger(fusenId) && fusenId > 0, messages.FUSEN_ID_EXIST_ERROR);
    const response = await fetch(`/note_list/api/notes/${fusenId}`, { 
        method: "DELETE",
        headers: getCsrfHeaders()
     });
    assert(response.ok, `${messages.DATA_DELETE_ERROR} status=${response.status}`);
}

//---共通関数---
/**
 * CSRFトークンの取得を行います。
 * 
 * @returns {object}
 */
function getCsrfHeaders(){
    const csrfToken = getCsrfToken();
    assert(typeof csrfToken === "string" && csrfToken.length > 0, messages.CONDITIONS_UNDEFINED_ERROR);
    return {
        "X-CSRFToken": csrfToken
    }
}