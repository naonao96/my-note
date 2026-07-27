"use strict"

/**
 * 共通で使用するDOM要素を取得します。
 * @returns {{ csrfToken: string | undefined }}
 */
export function getCsrfToken() {
    return document.querySelector('meta[name="csrf_token"]')?.content;
}