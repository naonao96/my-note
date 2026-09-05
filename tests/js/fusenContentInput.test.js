// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { setupContentInput } from "../../app/static/js/ui/fusenContentInput.js";

describe("fusenContentInput", () => {

    it("通常入力すると自動保存が要求される", () => {
        const contentInput = document.createElement("textarea");
        const requestAutoSave = vi.fn();

        setupContentInput(contentInput, requestAutoSave);

        contentInput.value = "テスト";
        contentInput.dispatchEvent(new Event("input"));

        expect(requestAutoSave).toHaveBeenCalledTimes(1);
    });

});

it("100文字までは入力でき自動保存が要求される", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    contentInput.value = "a".repeat(100);
    contentInput.dispatchEvent(new Event("input"));

    expect(contentInput.value).toBe("a".repeat(100));
    expect(requestAutoSave).toHaveBeenCalledTimes(1);
});

it("101文字以上は入力できず直前の内容に戻る", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    // まず正常な100文字を入力して状態を保存する
    const previousValue = "a".repeat(100);
    contentInput.value = previousValue;
    contentInput.dispatchEvent(new Event("input"));

    expect(requestAutoSave).toHaveBeenCalledTimes(1);

    // 101文字目を入力
    contentInput.value = "a".repeat(101);
    contentInput.dispatchEvent(new Event("input"));

    // 101文字は無効なので100文字の状態へ戻る
    expect(contentInput.value).toBe(previousValue);

    // 無効な入力では新たな自動保存は要求されない
    expect(requestAutoSave).toHaveBeenCalledTimes(1);
});

it("表示領域を超えた場合は直前の内容に戻る", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    // 最初は正常な状態
    contentInput.value = "正常な内容";

    Object.defineProperty(contentInput, "scrollHeight", {
        configurable: true,
        value: 100
    });

    Object.defineProperty(contentInput, "clientHeight", {
        configurable: true,
        value: 100
    });

    contentInput.dispatchEvent(new Event("input"));

    expect(requestAutoSave).toHaveBeenCalledTimes(1);

    // 次の入力で表示領域を超えたことにする
    contentInput.value = "高さを超えた内容";

    Object.defineProperty(contentInput, "scrollHeight", {
        configurable: true,
        value: 101
    });

    contentInput.dispatchEvent(new Event("input"));

    // 直前の正常な内容へ戻る
    expect(contentInput.value).toBe("正常な内容");

    // 無効入力なので保存要求は増えない
    expect(requestAutoSave).toHaveBeenCalledTimes(1);
});

it("無効な入力ではカーソル位置も直前の位置に戻る", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    // 正常な状態を作る
    contentInput.value = "abcdef";
    contentInput.setSelectionRange(3, 3);
    contentInput.dispatchEvent(new Event("input"));

    // 無効な入力に変更
    contentInput.value = "a".repeat(101);
    contentInput.setSelectionRange(101, 101);
    contentInput.dispatchEvent(new Event("input"));

    // 内容が戻る
    expect(contentInput.value).toBe("abcdef");

    // カーソル位置も戻る
    expect(contentInput.selectionStart).toBe(3);
    expect(contentInput.selectionEnd).toBe(3);

    // 無効入力では保存要求は増えない
    expect(requestAutoSave).toHaveBeenCalledTimes(1);
});

it("101文字を貼り付けた場合は直前の内容に戻る", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    // 貼り付け前の正常な状態
    contentInput.value = "貼り付け前";
    contentInput.dispatchEvent(new Event("input"));

    expect(requestAutoSave).toHaveBeenCalledTimes(1);

    // 101文字を貼り付けた状態を再現
    contentInput.value = "a".repeat(101);
    contentInput.dispatchEvent(new Event("input"));

    // 無効なので元に戻る
    expect(contentInput.value).toBe("貼り付け前");

    // 無効入力では保存要求は増えない
    expect(requestAutoSave).toHaveBeenCalledTimes(1);
});

it("100文字以内でも貼り付けで表示領域を超えた場合は直前の内容に戻る", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    // 貼り付け前の正常状態
    contentInput.value = "貼り付け前";

    Object.defineProperty(contentInput, "scrollHeight", {
        configurable: true,
        value: 100
    });

    Object.defineProperty(contentInput, "clientHeight", {
        configurable: true,
        value: 100
    });

    contentInput.dispatchEvent(new Event("input"));

    expect(requestAutoSave).toHaveBeenCalledTimes(1);

    // 100文字以内だが、高さだけ超えた状態を再現
    contentInput.value = "貼り付けた内容";

    Object.defineProperty(contentInput, "scrollHeight", {
        configurable: true,
        value: 101
    });

    contentInput.dispatchEvent(new Event("input"));

    // 高さ超過なので直前の内容へ戻る
    expect(contentInput.value).toBe("貼り付け前");

    // 無効入力なので保存要求は増えない
    expect(requestAutoSave).toHaveBeenCalledTimes(1);
});

it("IME変換中はinputイベントが発生しても自動保存されない", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    // IME変換開始
    contentInput.dispatchEvent(new CompositionEvent("compositionstart"));

    // 変換中の入力を再現
    contentInput.value = "てすと";
    contentInput.dispatchEvent(new Event("input"));

    expect(requestAutoSave).not.toHaveBeenCalled();
});

it("IME変換確定後は自動保存が要求される", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    // IME変換開始
    contentInput.dispatchEvent(new CompositionEvent("compositionstart"));

    // 変換中
    contentInput.value = "てすと";
    contentInput.dispatchEvent(new Event("input"));

    expect(requestAutoSave).not.toHaveBeenCalled();

    // 変換確定
    contentInput.value = "テスト";
    contentInput.dispatchEvent(new CompositionEvent("compositionend"));

    expect(requestAutoSave).toHaveBeenCalledTimes(1);
});

it("IME変換確定時に101文字を超えた場合は直前の内容に戻る", () => {
    const contentInput = document.createElement("textarea");
    const requestAutoSave = vi.fn();

    setupContentInput(contentInput, requestAutoSave);

    // 正常な状態を作る
    contentInput.value = "変換前";
    contentInput.dispatchEvent(new Event("input"));

    expect(requestAutoSave).toHaveBeenCalledTimes(1);

    // IME変換開始
    contentInput.dispatchEvent(
        new CompositionEvent("compositionstart")
    );

    // 変換中に101文字になった状態を再現
    contentInput.value = "あ".repeat(101);
    contentInput.dispatchEvent(new Event("input"));

    // 変換中なので、この時点では戻さない
    expect(contentInput.value).toBe("あ".repeat(101));
    expect(requestAutoSave).toHaveBeenCalledTimes(1);

    // IME変換確定
    contentInput.dispatchEvent(
        new CompositionEvent("compositionend")
    );

    // 無効な入力なので直前の正常値へ戻る
    expect(contentInput.value).toBe("変換前");

    // 無効な内容では保存要求されない
    expect(requestAutoSave).toHaveBeenCalledTimes(1);
});