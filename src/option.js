import { settings, getSetting, setSetting, removeSetting } from './settings.js';
import { showTimerEndNotification } from './notification.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 各設定項目を読み込んでUIに反映
    for (const [key, { elType }] of Object.entries(settings)) {
        const value = await getSetting(key);
        const elements = document.getElementsByName(key);
        if (elements.length === 0) continue;

        switch(elType){
            case 'checkbox' :
                elements[0].checked = value;
                break;
            case 'textbox' :
                elements[0].value = value;
                break;
            case 'file' :
                elements[0].value = value?.name ?? "";
                break;
            case 'radio' :
                const valueStr = typeof value === "boolean" ? value.toString() : value; // boolean型の場合は文字列に変換
                const index = [...elements].findIndex(e => e.value == valueStr);
                if(index !== -1) elements[index].checked = true;
                break;
            case 'select' :
                elements[0].value = value;
                break;
            default :
                break;
        }
        console.log("[setting loaded] key:", key, " | value:", value, " | type:", typeof value);
        
        // 設定値読み込みにより、disabledにする要素を更新する
        if (["opt_win_autoDetectGameFrame", "opt_win_specifyShiroproWindowSize", "opt_win_specifyShiroproWindowPos"].includes(key)) {
            handleSettingChange(key, value);
        }
    }

    // イベントリスナー設定（保存用）
    for (const [key, { elType }] of Object.entries(settings)) {
        const elements = document.getElementsByName(key);
        if (elements.length === 0) continue;

        for(const el of elements){
            el.addEventListener('change', async () => {
                let value;

                switch(elType){
                    case 'checkbox' :
                        value = el.checked;
                        break;
                    case 'textbox' :
                        value = el.value;
                        break;
                    case 'radio' :
                        const selected = [...elements].find(e => e.checked);
                        value = selected.value;
                        value = value === "true" ? true : value === "false" ? false : value; // 'true','false'の場合はboolean型に変換
                        break;
                    case 'select' :
                        value = el.value;
                        break;
                    default :
                        break;
                }

                await setSetting(key, value);
                console.log(`[setting saved] key: ${key} | value: ${value}`);
                handleSettingChange(key, value);
            });
        }
    }

    // ボタンイベント
    initButtonEvents();

    // version info
    const elVerInfo = document.getElementsByName("verInfo");
    elVerInfo[0].innerText = "ver " + chrome.runtime.getManifest().version;
});


// 各設定変更時の処理
function handleSettingChange(key, value) {
    switch (key) {
        case 'opt_win_autoDetectGameFrame':
            document.getElementsByName("opt_win_scrollValueX")[0].disabled = value;
            document.getElementsByName("opt_win_scrollValueY")[0].disabled = value;
            document.getElementsByName("opt_win_enableScaling")[0].disabled = !value;
            break;
        case 'opt_win_specifyShiroproWindowSize':
            document.getElementsByName("opt_win_ShiroproWindowSize")[0].disabled = !value;
            break;
        case 'opt_win_specifyShiroproWindowPos':
            document.getElementsByName("opt_win_ShiroproWindowPosX")[0].disabled = !value;
            document.getElementsByName("opt_win_ShiroproWindowPosY")[0].disabled = !value;
            break;
        default:
            break;
    }
}


// ボタンイベント初期化
function initButtonEvents(){
    
    // タイマー詳細設定
    document.getElementsByName("timer_advancedSetting")[0].onclick = function(){
        chrome.tabs.create({url:"option_ad.html"}, function(){});
    }

    // 通知メッセージ初期化
    const suffixes = ["t", "s", "c", "r", "h"];
    document.getElementsByName("timer_messageSetting_init")[0].onclick = async function(){
        if(window.confirm("すべての通知メッセージ設定を初期状態に戻します。よろしいですか？")){
            const keys = [
                "opt_timer_notificationTitle",
                ...suffixes.map(suffix => `opt_timer_message_${suffix}`),
            ]
            for (const key of keys){
                const elements = document.getElementsByName(key);
                elements[0].value = settings[key].defaultValue;
                await removeSetting(key);
            }
            console.log("[setting removed] keys:", keys);
        }
    }
    
    // 通知のテスト
    for(const suffix of suffixes){
        document.getElementsByName(`timer_notificationTest_${suffix}`)[0].onclick = async function(){
            await showTimerEndNotification(suffix, 1);
        }
    }


}
