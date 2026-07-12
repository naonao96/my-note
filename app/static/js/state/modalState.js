"use strict"

import { CREATE_MODE, DEFAULT_COLOR, EDIT_MODE } from "../common/consts.js";
import { syncSelectedColor } from "../ui/fusenEdit.js";

export function setCreateModal(form){
    setModalCommonValues({
        content: "",
        date: "",
        color: DEFAULT_COLOR
    })
    // 保存判定で使用
    form.dataset.fusenMode = CREATE_MODE;
    form.dataset.fusenId = "";
}

export function setEditModal(form, fusenData){
    setModalCommonValues({
        content: fusenData.content,
        date: fusenData.expires_at,
        color: fusenData.color
    })
    // 保存判定で使用
    form.dataset.fusenMode = EDIT_MODE;
    form.dataset.fusenId = fusenData.id;
}

function setModalCommonValues({ content, date, color }) {
    // form入力へ初期値セット
    document.getElementById("content").value = content;
    document.getElementById("datepicker").value = date;
    document.getElementById("selected-color").value = color;
    // 付箋プレビュー（表・裏）と背景色の初期値セット
    document.getElementById("fusen-content").textContent = content;
    document.getElementById("fusen-expires-at").textContent = date ? `期限日：${date}` : "期限日なし";
    document
        .querySelector("#edit-modal .fusen")
        .style
        .setProperty("--fusen-color", color);
}