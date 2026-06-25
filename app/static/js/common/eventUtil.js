'use strict'

// 対象のイベント伝播停止
export function stopPropagation(event){
    event.stopPropagation();
    console.log("押下", event);
};