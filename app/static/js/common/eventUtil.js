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

// アサーション用ヘルパー関数
export function assert(condition, message){
    if (!condition){
        throw new Error(message);
    }
}