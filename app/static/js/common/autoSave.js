"use strict";

/**
 * 自動保存処理を生成する。
 *
 * 保存要求から700ms後に保存を実行する。
 * 保存処理は順番に実行し、複数の保存処理が
 * 同時に実行されないよう制御する。
 *
 * @param {Object} options
 * @param {() => Promise<*>} options.save
 *        実際の保存処理
 * @param {() => boolean} options.canSave
 *        保存可能か判定する処理
 * @returns {{
 *   requestAutoSave: () => void,
 *   flushAutoSave: () => Promise<void>
 * }}
 * 自動保存を要求する関数と、
 * 保留中の保存を即時実行して完了まで待機する関数
 */
export function createAutoSave({ save, canSave }) {
    let saveTimer;
    let saveQueue = Promise.resolve();
    let hasPendingSave = false;

    const executeSave = async () => {
        hasPendingSave = false;
        // 前回の保存処理が完了するまで待機
        await saveQueue;
        // 今回の保存処理を実行
        const currentSave = save();
        
        // 保存失敗後も次の保存を実行できるよう、
        // キュー自体は正常終了するPromiseにする
        saveQueue = currentSave.catch(() => undefined);

        return currentSave;
    };

    const requestAutoSave = () => {
        clearTimeout(saveTimer);

        if (!canSave()) {
            hasPendingSave = false;
            return;
        }

        hasPendingSave = true;

        saveTimer = setTimeout(() => {
            executeSave().catch(error => {
                console.error(error);
            });
        }, 700);
    };

    const flushAutoSave = async () => {
        clearTimeout(saveTimer);

        if (hasPendingSave) {
            await executeSave();
        } else {
            await saveQueue;
        }
    };

    return {
        requestAutoSave,
        flushAutoSave
    };
}