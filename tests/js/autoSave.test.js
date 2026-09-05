import { describe, it, expect, vi } from "vitest";
import { createAutoSave } from "../../app/static/js/common/autoSave.js";

describe("autoSave", () => {

    it("700ms経過前は保存されない", () => {
        // 本物の時間ではなく、テスト用の時間を使う
        vi.useFakeTimers();

        // save()の代わりになる偽物の関数
        const save = vi.fn();

        const autoSave = createAutoSave({
            save,
            createSnapshot: () => ({ content: "テスト" }),
            canSave: () => true
        });

        // 自動保存を要求
        autoSave.requestAutoSave();

        // 699ms進める
        vi.advanceTimersByTime(699);

        // saveはまだ一度も呼ばれていないはず
        expect(save).not.toHaveBeenCalled();

        vi.useRealTimers();
    });

});

it("700ms経過すると保存される", async () => {
    vi.useFakeTimers();

    const save = vi.fn(() => Promise.resolve());

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content: "テスト" }),
        canSave: () => true
    });

    autoSave.requestAutoSave();

    await vi.advanceTimersByTimeAsync(700);

    expect(save).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
});

it("連続した保存要求では最新のスナップショットだけ保存される", async () => {
    vi.useFakeTimers();

    const save = vi.fn(() => Promise.resolve());

    let content = "1回目";

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content }),
        canSave: () => true
    });

    autoSave.requestAutoSave();

    // 300ms後に内容を変更
    await vi.advanceTimersByTimeAsync(300);

    content = "2回目";
    autoSave.requestAutoSave();

    // さらに699ms進めても、まだ保存されない
    await vi.advanceTimersByTimeAsync(699);

    expect(save).not.toHaveBeenCalled();

    // 最後の保存要求から700ms到達
    await vi.advanceTimersByTimeAsync(1);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({
        content: "2回目"
    });

    vi.useRealTimers();
});

it("保存不可の場合は保存されない", async () => {
    vi.useFakeTimers();

    const save = vi.fn(() => Promise.resolve());

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content: "" }),
        canSave: () => false
    });

    autoSave.requestAutoSave();

    await vi.advanceTimersByTimeAsync(700);

    expect(save).not.toHaveBeenCalled();

    vi.useRealTimers();
});

it("flushAutoSaveを実行すると700ms待たずに保存される", async () => {
    vi.useFakeTimers();

    const save = vi.fn(() => Promise.resolve());

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content: "テスト" }),
        canSave: () => true
    });

    autoSave.requestAutoSave();

    // まだ700ms経っていない
    await vi.advanceTimersByTimeAsync(300);

    expect(save).not.toHaveBeenCalled();

    // 保留中の保存を即時実行
    await autoSave.flushAutoSave();

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({
        content: "テスト"
    });

    vi.useRealTimers();
});

it("保存中に新しい保存要求が来ても失われない", async () => {
    vi.useFakeTimers();

    let resolveFirstSave;

    const save = vi
        .fn()
        .mockImplementationOnce(() => (
            new Promise(resolve => {
                resolveFirstSave = resolve;
            })
        ))
        .mockImplementationOnce(() => Promise.resolve());

    let content = "1回目";

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content }),
        canSave: () => true
    });

    // 1回目の保存要求
    autoSave.requestAutoSave();

    // 700ms経過 → 1回目の保存開始
    await vi.advanceTimersByTimeAsync(700);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenNthCalledWith(1, {
        content: "1回目"
    });

    // 1回目がまだ保存中の状態で2回目を要求
    content = "2回目";
    autoSave.requestAutoSave();

    // 2回目のdebounce時間を経過
    await vi.advanceTimersByTimeAsync(700);

    // まだ1回目が終わっていないので、
    // 2回目のsaveは開始されない
    expect(save).toHaveBeenCalledTimes(1);

    // 現在キューに入っている保存処理の完了を待つ
    const flushPromise = autoSave.flushAutoSave();

    // 1回目の保存を完了させる
    resolveFirstSave();

    // 2回目の保存まで完了するのを待つ
    await flushPromise;

    // キューが進み、2回目も保存される
    expect(save).toHaveBeenCalledTimes(2);
    expect(save).toHaveBeenNthCalledWith(2, {
        content: "2回目"
    });
});

it("保存処理は同時に実行されず直列に実行される", async () => {
    vi.useFakeTimers();

    let resolveFirstSave;

    const save = vi
        .fn()
        .mockImplementationOnce(() => (
            new Promise(resolve => {
                resolveFirstSave = resolve;
            })
        ))
        .mockImplementationOnce(() => Promise.resolve());

    let content = "1回目";

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content }),
        canSave: () => true
    });

    // 1回目
    autoSave.requestAutoSave();
    await vi.advanceTimersByTimeAsync(700);

    expect(save).toHaveBeenCalledTimes(1);

    // 1回目がまだ終わっていない状態で2回目
    content = "2回目";
    autoSave.requestAutoSave();

    await vi.advanceTimersByTimeAsync(700);

    // 1回目が終わっていないので2回目はまだ開始されない
    expect(save).toHaveBeenCalledTimes(1);

    // 1回目完了
    const flushPromise = autoSave.flushAutoSave();

    resolveFirstSave();

    await flushPromise;

    // ここで初めて2回目が実行される
    expect(save).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
});

it("保存に失敗しても次の保存処理は実行される", async () => {
    vi.useFakeTimers();

    const save = vi
        .fn()
        .mockImplementationOnce(() => Promise.reject(new Error("保存失敗")))
        .mockImplementationOnce(() => Promise.resolve());

    let content = "1回目";

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content }),
        canSave: () => true
    });

    // 1回目：失敗する
    autoSave.requestAutoSave();
    await vi.advanceTimersByTimeAsync(700);

    expect(save).toHaveBeenCalledTimes(1);

    // 2回目：成功する
    content = "2回目";
    autoSave.requestAutoSave();

    await vi.advanceTimersByTimeAsync(700);

    const flushPromise = autoSave.flushAutoSave();

    await flushPromise;

    expect(save).toHaveBeenCalledTimes(2);
    expect(save).toHaveBeenNthCalledWith(2, {
        content: "2回目"
    });

    vi.useRealTimers();
});

it("保存要求後に元データが変わっても要求時点のスナップショットが保存される", async () => {
    vi.useFakeTimers();

    const save = vi.fn(() => Promise.resolve());

    let content = "保存要求時";

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content }),
        canSave: () => true
    });

    // この時点の内容でSnapshotを作る
    autoSave.requestAutoSave();

    // 保存実行前に元データを変更
    content = "変更後";

    await vi.advanceTimersByTimeAsync(700);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({
        content: "保存要求時"
    });

    vi.useRealTimers();
});

it("保存処理中にflushAutoSaveを実行すると保存完了まで待機する", async () => {
    vi.useFakeTimers();

    let resolveSave;
    let flushCompleted = false;

    const save = vi.fn(() => (
        new Promise(resolve => {
            resolveSave = resolve;
        })
    ));

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content: "テスト" }),
        canSave: () => true
    });

    autoSave.requestAutoSave();

    // 700ms経過して保存開始
    await vi.advanceTimersByTimeAsync(700);

    expect(save).toHaveBeenCalledTimes(1);

    // 保存中にflush
    const flushPromise = autoSave.flushAutoSave().then(() => {
        flushCompleted = true;
    });

    // まだ保存は終わっていないのでflushも完了しない
    expect(flushCompleted).toBe(false);

    // 保存完了
    resolveSave();

    await flushPromise;

    expect(flushCompleted).toBe(true);

    vi.useRealTimers();
});

it("保存に失敗した場合はonErrorが呼ばれる", async () => {
    vi.useFakeTimers();

    const error = new Error("保存失敗");

    const save = vi.fn(() => Promise.reject(error));
    const onError = vi.fn();

    const autoSave = createAutoSave({
        save,
        createSnapshot: () => ({ content: "テスト" }),
        canSave: () => true,
        onError
    });

    autoSave.requestAutoSave();

    await vi.advanceTimersByTimeAsync(700);

    expect(save).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(error);

    vi.useRealTimers();
});