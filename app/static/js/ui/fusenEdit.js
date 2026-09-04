"use strict"

/**
 * 現在選択されている付箋カラーをUIへ反映する。
 *
 * カラーパレットの選択状態を一度リセットした後、
 * selectedColorに設定されている色と一致するボタンを選択状態にする。
 *
 * 編集モードの場合は既存付箋の色を引き継ぎ、
 * 新規登録の場合は初期設定された色を反映する。
 * あわせてモーダル内の付箋カラーも同期する。
 *
 * @param {import("../element/fusenEditElements.js").ColorElements} elems
 *        カラー選択で使用するDOM要素
 * @returns {void}
 */
export function syncSelectedColor(elems) {
    removeAllSelected(elems);
    const selectedButton = [...elems.colorButtons].find(
        (button) => button.dataset.color === elems.selectedColor.value
    )

    if (!selectedButton) return;

    addSelected(selectedButton);
    updateColorPreview(elems.editModal, selectedButton.dataset.color);
}

/**
 * ユーザーが選択した付箋カラーを反映する。
 *
 * 選択されたカラーボタンの色をselectedColorへ設定し、
 * カラーパレットの選択状態とモーダル内の付箋カラーを更新する。
 *
 * @param {HTMLElement} button ユーザーが選択したカラーボタン
 * @param {import("../element/fusenEditElements.js").ColorElements} elems
 *        カラー選択で使用するDOM要素
 * @returns {void}
 */
export function handleColorSelect(button, elems){
    elems.selectedColor.value = button.dataset.color;
    syncSelectedColor(elems);
}

/**
 * 付箋カラーパレットの選択状態をすべて解除する。
 *
 * 各カラーボタンからselectedクラスを削除し、
 * 選択状態をリセットする。
 *
 * @param {import("../element/fusenEditElements.js").ColorElements} elems
 *        カラー選択で使用するDOM要素
 * @returns {void}
 */
export function removeAllSelected(elems){
    elems.colorButtons.forEach(colorButton => {
        colorButton.classList.remove("selected");
    });
}

/**
 * 付箋編集画面に入力されている付箋情報を取得する。
 *
 * 本文、選択色、期限日を取得し、
 * 保存処理で使用する付箋データとして返す。
 *
 * @param {import("../element/fusenEditElements.js").FusenEditElements} elems
 *        付箋編集画面で使用するDOM要素
 * @returns {{content: string, color: string, expires_at: string}}
 *          現在入力されている付箋情報
 */
export function getFusenData(elems){
     return {
        content: elems.fusen.fusenContent.value,
        color: elems.color.selectedColor.value,
        expires_at: elems.fusen.expiresAtData.value
     }
}

/**
 * 指定されたカラーボタンを選択状態にする。
 *
 * 対象ボタンへselectedクラスを追加し、
 * カラーパレット上で選択中の色として表示する。
 *
 * @param {HTMLElement} button 選択状態にするカラーボタン
 * @returns {void}
 */
function addSelected(button){
    button.classList.add("selected");
}

/**
 * モーダル内の付箋カラーを指定された色へ更新する。
 *
 * モーダル内の付箋表面・裏面にCSSカスタムプロパティ
 * --fusen-colorを設定し、選択した色をプレビューへ反映する。
 *
 * @param {HTMLElement} editModal 付箋編集モーダル
 * @param {string} color 反映する付箋カラー
 * @returns {void}
 */
function updateColorPreview(editModal, color){
    editModal.querySelectorAll(".fusen-front, .fusen-back").forEach(fusen => {
        fusen.style.setProperty("--fusen-color", color)
    });
}