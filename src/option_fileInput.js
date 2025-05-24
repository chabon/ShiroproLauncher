import { settings, getSetting, setSetting, removeSetting } from './settings.js';

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

function errorHandler(e) {
    let msg = '';
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            window.location.reload();
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }
    console.log('Error: ' + msg);
}

function requestQuotaAndFS(callback) {
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, (bytes) => {
        window.requestFileSystem(window.PERSISTENT, bytes, (fs) => {
            callback(fs);
        }, errorHandler);
    });
}

// save
async function saveFileToSandbox(kind, suffix, file) {
    requestQuotaAndFS(async (fs) => {
        const settingKey = `opt_timer_${kind}File_${suffix}`;
        const prevFile = await getSetting(settingKey);
        const prevFileName = prevFile?.name || "tmp";

        fs.root.getFile(`${kind}_${suffix}_${prevFileName}`, { create: true }, (fileEntry) => {
            fileEntry.remove(() => {
                fs.root.getFile(`${kind}_${suffix}_${file.name}`, { create: true }, (newFileEntry) => {
                    newFileEntry.createWriter(async (fileWriter) => {
                        fileWriter.write(file);
                        // console.log(newFileEntry);
                        const val = { name: file.name, url: newFileEntry.toURL() };
                        await setSetting(settingKey, val);
                        document.getElementsByName(settingKey)[0].value = file.name;
                        console.log("[setting saved] key: ", settingKey," | value ", val);
                    }, errorHandler);
                }, errorHandler);
            }, errorHandler);
        }, errorHandler);
    });
}

// delete
async function deleteFileFromSandbox(kind, suffix) {
    requestQuotaAndFS(async (fs) => {
        const settingKey = `opt_timer_${kind}File_${suffix}`;
        const delFile = await getSetting(settingKey);
        const delFileName = delFile?.name || "tmp";

        fs.root.getFile(`${kind}_${suffix}_${delFileName}`, { create: true }, (fileEntry) => {
            fileEntry.remove(async () => {
                await removeSetting(settingKey);
                document.getElementsByName(settingKey)[0].value = "";
                window.location.reload();
                console.log("[setting removed] key: ", settingKey);
            }, errorHandler);
        }, errorHandler);
    });
}

function setupFileInputEvents(kind, suffix) {
    document.getElementsByName(`opt_timer_${kind}FileRelease_${suffix}`)[0].onclick = () => {
        deleteFileFromSandbox(kind, suffix);
    };

    document.getElementsByName(`opt_timer_${kind}FileSelect_${suffix}`)[0].onchange = function () {
        const file = this.files[0];
        if (file) saveFileToSandbox(kind, suffix, file);
    };

    document.getElementsByName(`opt_timer_${kind}FileSelectBtn_${suffix}`)[0].onclick = () => {
        document.getElementsByName(`opt_timer_${kind}FileSelect_${suffix}`)[0].click();
    };
}

// 通知音声の指定（5種）
["t", "s", "c", "r", "h"].forEach(suffix => setupFileInputEvents("sound", suffix));

// 通知アイコン画像の指定（1種）
setupFileInputEvents("image", "all");


