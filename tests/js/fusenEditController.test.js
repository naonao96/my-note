// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { EDIT_MODE } from "../../app/static/js/common/consts.js";

const mocks = vi.hoisted(() => ({
    autoSaveOptions: null,
    upsertFusen: vi.fn(),
    form: document.createElement("form")
}));

vi.mock("../../app/static/js/service/fusenService.js", () => ({
    upsertFusen: mocks.upsertFusen,
    readFusen: vi.fn()
}));

vi.mock("../../app/static/js/common/autoSave.js", () => ({
    createAutoSave: vi.fn((options) => {
        mocks.autoSaveOptions = options;

        return {
            requestAutoSave: vi.fn(),
            flushAutoSave: vi.fn()
        };
    })
}));

vi.mock("../../app/static/js/element/fusenEditElements.js", () => ({
    getElements: vi.fn(() => ({
        form: mocks.form,

        color: {
            colorButtons: []
        },

        fusen: {
            expiresAtData: document.createElement("input"),
            fusenContent: document.createElement("textarea")
        },

        editModal: {}
    }))
}));

vi.mock("../../app/static/js/ui/fusenContentInput.js", () => ({
    setupContentInput: vi.fn(() => vi.fn())
}));

vi.mock("../../app/static/js/view/modalView.js", () => ({
    setCreateModal: vi.fn(),
    setEditModal: vi.fn()
}));

vi.mock("../../app/static/js/controllers/modalController.js", () => ({
    setupModal: vi.fn(),
    openModal: vi.fn()
}));

vi.mock("../../app/static/js/ui/fusenEdit.js", () => ({
    getFusenData: vi.fn(() => ({
        content: "テスト",
        color: "#ffffff",
        expiresAt: null
    })),
    handleColorSelect: vi.fn(),
    syncSelectedColor: vi.fn()
}));

vi.mock("../../app/static/js/ui/fusenList.js", () => ({
    reflectFusen: vi.fn()
}));

import { init } from "../../app/static/js/controllers/fusenEditController.js";

describe("fusenEditController", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        mocks.form.dataset.fusenId = "";
        mocks.form.dataset.fusenMode = "CREATE";
        mocks.autoSaveOptions = null;
    });

    it("新規保存成功後に付箋IDを設定しEDIT_MODEへ切り替わる", async () => {
        mocks.upsertFusen.mockResolvedValue({
            id: 123
        });

        init();

        const snapshot = {
            content: "テスト",
            color: "#ffffff",
            expiresAt: null
        };

        await mocks.autoSaveOptions.save(snapshot);

        expect(mocks.form.dataset.fusenId).toBe("123");
        expect(mocks.form.dataset.fusenMode).toBe(EDIT_MODE);
    });

});