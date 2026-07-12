"use strict"

import { assert, getFusenId } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";
import { fetchUpsertApi, fetchDeleteApi, fetchReadDataApi, fetchReadDataListApi } from "../repository/apiFusenRepository.js";

export async function upsertFusen(form){
    assert(form, messages.CONDITIONS_UNDIFINED_ERROR)
    await fetchUpsertApi(form)
}

export async function readFusenList(){
    const result = await fetchReadDataListApi();
    assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
    return result;
}

export async function deleteFusen(button){
    assert(button, messages.CONDITIONS_UNDIFINED_ERROR)
    const result = await fetchDeleteApi(getFusenId(button))
    assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
};

export async function readFusen(button){
    assert(button, messages.CONDITIONS_UNDIFINED_ERROR)
    const result = await fetchReadDataApi(getFusenId(button));
    assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
    return result;
};