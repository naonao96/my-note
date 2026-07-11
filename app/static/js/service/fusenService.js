"use strict"

import { assert, getFusenId } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";
import { fetchUpsertApi, fetchDeleteApi, fetchReadDataApi, fetchReadDataListApi } from "../repository/apiFusenRepository.js";

export async function upsertFusen(elems){
    const result = await fetchUpsertApi(form)
    assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
}

export async function readFusenList(){
    const result = await fetchReadDataListApi();
    assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
    return result;
}

export async function deleteFusen(button){
    const result = await fetchDeleteApi(getFusenId(button))
    assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
};

export async function readFusen(button){
    const result = await fetchReadDataApi(getFusenId(button));
    assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
    return result;
};