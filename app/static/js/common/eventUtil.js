'use strict'

// 対象のイベント伝播停止
export function stopPropagation(event){
    event.stopPropagation();
    console.log("押下", event);
};

export function storageModeCheck(mode){
    if (mode === "login") {
        // API経由PostgresSQLと通信
        return true
    } else {
        // ローカルのIndexedDBと通信
        return false
    }
}

export function apiResultCheck(success){
    if (!success) {
        console.error("付箋情報の取得に失敗しました。");
        return false;
    }
    return true
}