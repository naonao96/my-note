"use strict";

/**
 * 付箋本文入力欄の入力制御を設定する。
 *
 * textareaの表示可能な縦幅を超える入力を検出した場合、
 * 直前の入力内容とカーソル位置へ戻す。
 *
 * 日本語入力などのIME変換中は通常のinput判定を行わず、
 * compositionend後に入力内容を判定する。
 * 正常な入力が確定した場合は自動保存を要求する。
 *
 * @param {HTMLTextAreaElement} contentInput
 *        付箋本文入力欄
 * @param {() => void} requestAutoSave
 *        自動保存を要求する関数
 * @returns {() => void}
 *          現在の入力内容とカーソル位置を同期する関数
 */
export function setupContentInput(contentInput, requestAutoSave) {
    let previousValue = contentInput.value;
    let previousSelectionStart = contentInput.selectionStart;
    let previousSelectionEnd = contentInput.selectionEnd;
    let isComposing = false;

    const saveCurrentState = () => {
        previousValue = contentInput.value;
        previousSelectionStart = contentInput.selectionStart;
        previousSelectionEnd = contentInput.selectionEnd;
    };

    const restorePreviousState = () => {
        contentInput.value = previousValue;

        contentInput.setSelectionRange(
            previousSelectionStart,
            previousSelectionEnd
        );
    };

    contentInput.addEventListener("focus", saveCurrentState);
    contentInput.addEventListener("compositionstart", () => {
        isComposing = true;
    });
    contentInput.addEventListener("compositionend", () => {
        isComposing = false;
        if (isContentOverflowing(contentInput)) {
            restorePreviousState();
            return;
        }
        saveCurrentState();
        requestAutoSave();
    });

    contentInput.addEventListener("input", () => {
        if (isComposing) {
            return;
        }

        if (isContentOverflowing(contentInput)) {
            restorePreviousState();
            return;
        }

        saveCurrentState();
        requestAutoSave();
    });

    return saveCurrentState;
}

/**
 * 付箋本文がtextareaの表示領域を縦方向に超えているか判定する。
 *
 * @param {HTMLTextAreaElement} contentInput
 *        付箋本文入力欄
 * @returns {boolean}
 *          表示領域を超えている場合true
 */
function isContentOverflowing(contentInput) {
    return contentInput.scrollHeight > contentInput.clientHeight;
}