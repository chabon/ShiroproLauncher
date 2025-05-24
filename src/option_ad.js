// タイマー詳細設定

import { settings, getSetting, setSetting, removeSettingsByRegex} from './settings.js';

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
                if(Array.isArray(value)) {
                    for(let i=0; i < value.length && i < elements.length; i++){
                        elements[i].value = value[i];
                    }
                }
                else{ 
                    elements[0].value = value;
                }
                break;
            case 'color' :
                elements[0].value = value;
                break;
            default :
                break;
        }
        console.log("[setting loaded] key:", key, " | value:", value, " | type:", typeof value);
    }

    // イベントリスナー設定（保存用）
    for (const [key, { elType }] of Object.entries(settings)) {
        const elements = document.getElementsByName(key);
        if (elements.length === 0) continue;

        elements.forEach((el, index) => {
            el.addEventListener('change', async () => {
                let value;

                switch(elType){
                    case 'checkbox' :
                        value = el.checked;
                        break;
                    case 'textbox' :
                        if(elements.length > 1){
                            if(/^opt_timerAd_label/.test(key)){
                                value = [...elements].map(e => e.value); // opt_timerAd_label_* は配列で保存
                            }
                        }
                        else{
                            value = el.value;
                        }
                        break;
                    case 'color' :
                        value = el.value;
                        break;
                    default :
                        break;
                }

                await setSetting(key, value);
                console.log(`[setting saved] key: ${key} | value: ${value}`);
                updateTimerVisualBySetting(key);
            });
        });
    }
    
    // 背景色の設定 初期化ボタン
    document.getElementsByName("opt_timerAd_backColorInit")[0].onclick = async () => {
        if(!window.confirm("すべての背景色の設定を初期状態に戻します。よろしいですか？")) return;
        const removedKeys = await removeSettingsByRegex(/^opt_timerAd_backColor_/);
        console.log("[setting removed] keys:", removedKeys);
        removedKeys.forEach( key => document.getElementsByName(key)[0].value = settings[key].defaultValue );
        updateTimerVisualBySetting(removedKeys[0]);
    };

    // 文字色の設定 初期化ボタン
    document.getElementsByName("opt_timerAd_textColorInit")[0].onclick = async () => {
        if(!window.confirm("すべての文字色の設定を初期状態に戻します。よろしいですか？")) return;
        const removedKeys = await removeSettingsByRegex(/^opt_timerAd_textColor_/);
        console.log("[setting removed] keys:", removedKeys);
        removedKeys.forEach( key => document.getElementsByName(key)[0].value = settings[key].defaultValue );
        updateTimerVisualBySetting(removedKeys[0]);
    };

    // end of document.addEventListener
});

// 変更した設定によって、タイマーの表示設定を反映させる
function updateTimerVisualBySetting(key){
    let target;
    if(/^opt_timerAd_backColor/.test(key)) target = "backgroundColor";  // 背景色
    if(/^opt_timerAd_textColor/.test(key)) target = "textColor";        // 文字色
    if(/^opt_timerAd_label/.test(key))     target = "label";            // ラベル名
    if(/^opt_timerAd_caption/.test(key))   target = "caption";          // キャプション

    chrome.runtime.sendMessage({name: "TimerVisualUpdate", target: target});
}




