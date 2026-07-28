"use strict"

export const CREATE_MODE = "CREATE";
export const EDIT_MODE = "EDIT";
export const DEFAULT_COLOR = "#A9CEEC";
/**
 * トーストの種類
 * @readonly
 * @property {string} SUCCESS 成功
 * @property {string} INFO 情報
 * @property {string} ERROR エラー
 */
export const MESSAGE_TYPE = Object.freeze({
    SUCCESS: "SUCCESS",
    INFO: "INFO",
    ERROR: "ERROR"
});
/**
 * トーストのアイコン
 * @readonly
 * @property {string} SUCCESS 成功アイコン
 * @property {string} INFO 情報アイコン
 * @property {string} ERROR エラーアイコン
 */
export const TOAST_ICONS = Object.freeze({
    SUCCESS: "/static/images/check-circle.svg",
    INFO: "/static/images/info.svg",
    ERROR: "/static/images/error.svg"
});