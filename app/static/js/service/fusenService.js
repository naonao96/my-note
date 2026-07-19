"use strict"

import { assert, getFusenId, storageModeCheck } from "../common/eventUtil.js";
import { messages } from "../common/messages.js";
import { fetchUpsertApi, fetchDeleteApi, fetchReadDataApi, fetchReadDataListApi } from "../repository/apiFusenRepository.js";
import { upsertLocalFusenData, deleteLocalFusenData, readAllLocalFusenData, readLocalFusenData } from "../repository/indexedDBRepository.js";

export async function upsertFusen(requestData){
    assert(requestData, messages.CONDITIONS_UNDIFINED_ERROR)
    if (storageModeCheck()){
        await fetchUpsertApi(requestData);
    }
    else {
        await upsertLocalFusenData(requestData);
    }
}

export async function readFusenList(){
    if (storageModeCheck()){
        const result = await fetchReadDataListApi();
        assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
        return result;
    }
    else {
        const result = await readAllLocalFusenData();
        assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
        return result;
    }
}

export async function deleteFusen(button){
    assert(button, messages.CONDITIONS_UNDIFINED_ERROR)
    if (!confirm("この付箋を削除しますか？")){
        return false;   
    }
    if (storageModeCheck()){
        await fetchDeleteApi(getFusenId(button));
        return true;
    }
    else {
        await deleteLocalFusenData(getFusenId(button));
        return true;
    }
}

export async function readFusen(button){
    assert(button, messages.CONDITIONS_UNDIFINED_ERROR)
    if (storageModeCheck()){
        const result = await fetchReadDataApi(getFusenId(button));
        assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
        return result;
    }
    else {
        const result = await readLocalFusenData(getFusenId(button));
        assert(result.success, messages.FUSEN_DATA_FETCH_ERROR);
        return result;
    }
}