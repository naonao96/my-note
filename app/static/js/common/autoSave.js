"use strict";

/**
 * 自動保存処理を生成する。
 *
 * 保存要求時点のデータをスナップショットとして保持し、
 * 700ms後に保存する。
 *
 * 保存処理はキューによって直列化し、
 * 同時に複数の保存処理が実行されないよう制御する。
 *
 * @param {Object} options
 * @param {(snapshot: *) => Promise<*>} options.save
 *        スナップショットを保存する処理
 * @param {() => *} options.createSnapshot
 *        現在の入力状態からスナップショットを生成する処理
 * @param {(snapshot: *) => boolean} options.canSave
 *        スナップショットが保存可能か判定する処理
 * @param {(error: Error) => void} options.onError
 *        保存失敗時の処理
 * @returns {{
 *   requestAutoSave: () => void,
 *   flushAutoSave: () => Promise<void>
 * }}
 */
export function createAutoSave({
    save,
    createSnapshot,
    canSave,
    onError
 }) {
    let saveTimer;
    let saveQueue = Promise.resolve();
    let pendingSnapshot = null;

    /**
     * スナップショットを保存キューへ追加する。
     *
     * @param {*} snapshot
     * @returns {Promise<void>}
     */
    const enqueueSave = (snapshot) => {
        const currentSave = saveQueue.then(
            () => save(snapshot)
        );

        // 保存失敗後も後続処理を実行できるようにする
        saveQueue = currentSave.catch(() => undefined);

        return currentSave;
    };

    /**
     * 保留中のスナップショットを保存する。
     *
     * @returns {Promise<void>}
     */
    const executePendingSave = async () => {
        if (pendingSnapshot === null) {
            await saveQueue;
            return;
        }

        const snapshot = pendingSnapshot;
        pendingSnapshot = null;

        await enqueueSave(snapshot);
    };

    /**
     * 自動保存を要求する。
     *
     * 現在の入力状態からスナップショットを生成し、
     * 保存可能な場合は保留中のスナップショットとして保持する。
     * 連続して要求された場合は最新のスナップショットへ置き換え、
     * 最後の要求から700ms後に保存を実行する。
     *
     * @returns {void}
     */
    const requestAutoSave = () => {
        clearTimeout(saveTimer);

        const snapshot = createSnapshot();

        if (!canSave(snapshot)) {
            pendingSnapshot = null;
            return;
        }

        // 常に最新の保存要求へ置き換える
        pendingSnapshot = snapshot;

        saveTimer = setTimeout(() => {
            executePendingSave().catch(error => {
                console.error(error);
                onError?.(error);
            });
        }, 700);
    };

    /**
     * 保留中の自動保存を即時実行する。
     *
     * 自動保存タイマーを解除し、
     * 保留中のスナップショットが存在する場合は即時保存する。
     * すでに実行中の保存処理がある場合は、その完了まで待機する。
     *
     * @returns {Promise<void>}
     */
    const flushAutoSave = async () => {
        clearTimeout(saveTimer);
        await executePendingSave();
    };

    return {
        requestAutoSave,
        flushAutoSave
    };
}