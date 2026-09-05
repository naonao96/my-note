// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { setupModal } from "../../app/static/js/controllers/modalController.js";

describe("modalController", () => {

    it("beforeCloseが完了するまでモーダルは閉じない", async () => {
        const openButton = document.createElement("button");
        const overlay = document.createElement("div");
        const modal = document.createElement("div");

        const modalElems = {
            openButton,
            overlay,
            modal
        };

        let resolveBeforeClose;

        const beforeClose = vi.fn(() => (
            new Promise(resolve => {
                resolveBeforeClose = resolve;
            })
        ));

        setupModal(
            modalElems,
            undefined,
            beforeClose
        );

        overlay.classList.remove("hidden");
        modal.classList.remove("hidden");

        overlay.click();

        // beforeCloseは呼ばれる
        expect(beforeClose).toHaveBeenCalledTimes(1);

        // まだbeforeCloseが終わっていないので閉じない
        expect(overlay.classList.contains("hidden")).toBe(false);
        expect(modal.classList.contains("hidden")).toBe(false);

        // beforeCloseを完了させる
        resolveBeforeClose();

        // asyncイベント処理の完了を待つ
        await Promise.resolve();
        await Promise.resolve();

        // ここで初めて閉じる
        expect(overlay.classList.contains("hidden")).toBe(true);
        expect(modal.classList.contains("hidden")).toBe(true);
    });

});

it("beforeCloseが失敗した場合はモーダルを閉じない", async () => {
    const openButton = document.createElement("button");
    const overlay = document.createElement("div");
    const modal = document.createElement("div");

    const modalElems = {
        openButton,
        overlay,
        modal
    };

    const beforeClose = vi.fn(() =>
        Promise.reject(new Error("保存失敗"))
    );

    setupModal(
        modalElems,
        undefined,
        beforeClose
    );

    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");

    // rejectされるので、unhandled rejectionにならないよう待つ
    overlay.click();

    await Promise.resolve();
    await Promise.resolve();

    expect(beforeClose).toHaveBeenCalledTimes(1);

    // beforeCloseが失敗したので閉じない
    expect(overlay.classList.contains("hidden")).toBe(false);
    expect(modal.classList.contains("hidden")).toBe(false);
});