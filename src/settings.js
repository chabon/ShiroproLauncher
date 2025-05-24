// 設定
// 値のタイプは、object, boolean, string のいずれか(数値型は無し)
// この連想配列のkeyは、StrageAPIで利用するkeyとoption.html内要素の各nameと共通
export const settings = {
    /* ---------------------------------------------------- */
    //      Background
    /* ---------------------------------------------------- */
    bg_shiroproWindow     : { elType: null      , defaultValue: null      },
    bg_shiroproWindowPos  : { elType: null      , defaultValue: {left:null, top:null} },
    bg_shiroproClientSize : { elType: null      , defaultValue: null      },
    bg_timerWindow        : { elType: null      , defaultValue: null      },
    bg_timerWindowRect    : { elType: null      , defaultValue: {left:null, top:null, width:207, height:275}  },

    /* ---------------------------------------------------- */
    //      Timer
    /* ---------------------------------------------------- */
    timer_prevTime_t_1   : { elType: null, defaultValue: null     }, // 前回設定した時間 探索 Array[3]
    timer_prevTime_t_2   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_t_3   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_s_1   : { elType: null, defaultValue: null     }, // " 修繕
    timer_prevTime_s_2   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_s_3   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_s_4   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_c_1   : { elType: null, defaultValue: null     }, // " 築城
    timer_prevTime_c_2   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_c_3   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_c_4   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_h_1   : { elType: null, defaultValue: null     }, // " 汎用
    timer_prevTime_h_2   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_h_3   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_h_4   : { elType: null, defaultValue: null     }, // "
    timer_prevTime_r_1   : { elType: null, defaultValue: null     }, // " 霊力
    timer_re_maxReiryoku : { elType: null, defaultValue: null     }, // " 霊力最大値

    /* ---------------------------------------------------- */
    //      option
    /* ---------------------------------------------------- */
    // Window
    opt_win_autoDetectGameFrame       : { elType: "radio",    defaultValue: true     }, // ゲーム画面の自動検出
    opt_win_enableScaling             : { elType: "checkbox", defaultValue: true     }, // ウインドウリサイズ時の拡大縮小を有効にする
    opt_win_scrollValueX              : { elType: "textbox",  defaultValue: "0"      }, // 右方向スクロール値
    opt_win_scrollValueY              : { elType: "textbox",  defaultValue: "64"     }, // 下方向スクロール値
    opt_win_saveShiroproWindowPos     : { elType: "checkbox", defaultValue: true     }, // ウインドウの位置を記憶する
    opt_win_saveShiroproClientSize    : { elType: "checkbox", defaultValue: true     }, // ウインドウサイズを記憶する
    opt_win_specifyShiroproWindowPos  : { elType: "checkbox", defaultValue: false    }, // 起動時のウインドウ位置を指定する
    opt_win_ShiroproWindowPosX        : { elType: "textbox",  defaultValue: "100"    }, // ウインドウ座標X (右方向)
    opt_win_ShiroproWindowPosY        : { elType: "textbox",  defaultValue: "100"    }, // ウインドウ座標Y (下方向)
    opt_win_specifyShiroproWindowSize : { elType: "checkbox", defaultValue: false    }, // 起動時のウインドウサイズを指定する
    opt_win_ShiroproWindowSize        : { elType: "textbox",  defaultValue: "100"    }, // ウインドウサイズ (%指定)
    opt_win_gameCenteringDisabled     : { elType: "checkbox", defaultValue: false    }, // ウインドウリサイズ時、縦方向へのゲーム画面中央化を行わない
    opt_win_showExitConfirmation      : { elType: "checkbox", defaultValue: false    }, // 終了時、確認ダイアログを表示する

    // ScreenShot
    opt_ss_resizeBeforeCapture  : { elType: "checkbox", defaultValue: true      }, // 撮る前に表示領域のサイズをデフォルトの800x480にリサイズする
    opt_ss_format               : { elType: "radio",    defaultValue: "png"     }, // 保存形式
    opt_ss_jpgQuality           : { elType: "textbox",  defaultValue: "95"      }, // JPEGの品質
    opt_ss_folderName           : { elType: "textbox",  defaultValue: "御城プロジェクト_SS" }, // 保存するフォルダ名
    
    // Timer
    opt_timer_numofTansaku         : { elType: "select",   defaultValue: "2"      }, // 表示するタイマーの数
    opt_timer_numofSyuuzen         : { elType: "select",   defaultValue: "2"      }, // "
    opt_timer_numofChikujo         : { elType: "select",   defaultValue: "2"      }, // "
    opt_timer_numofReiryoku        : { elType: "select",   defaultValue: "1"      }, // "
    opt_timer_numofHanyou          : { elType: "select",   defaultValue: "0"      }, // "
    opt_timer_savePos              : { elType: "checkbox", defaultValue: true     }, // タイマーの位置を記憶する(サイズに関しては必ず復元する)
    opt_timer_launchSameTime       : { elType: "checkbox", defaultValue: false    }, // 城プロウインドウ作成時にタイマーも同時に起動する
    opt_timer_showExitConfirmation : { elType: "checkbox", defaultValue: false    }, // 終了時、確認ダイアログを表示する
    
    // Timer Notification Setting
    opt_timer_enableNotificaton_t   : { elType: "checkbox", defaultValue: true      }, // 通知の有無
    opt_timer_enableNotificaton_s   : { elType: "checkbox", defaultValue: true      }, // "
    opt_timer_enableNotificaton_c   : { elType: "checkbox", defaultValue: true      }, // "
    opt_timer_enableNotificaton_r   : { elType: "checkbox", defaultValue: true      }, // "
    opt_timer_enableNotificaton_h   : { elType: "checkbox", defaultValue: true      }, // "
    opt_timer_enableSound_t         : { elType: "checkbox", defaultValue: false     }, // 通知時に音声ファイルも鳴らす
    opt_timer_enableSound_s         : { elType: "checkbox", defaultValue: false     }, // "
    opt_timer_enableSound_c         : { elType: "checkbox", defaultValue: false     }, // "
    opt_timer_enableSound_r         : { elType: "checkbox", defaultValue: false     }, // "
    opt_timer_enableSound_h         : { elType: "checkbox", defaultValue: false     }, // "
    opt_timer_soundVolume           : { elType: "select",   defaultValue: "50"      }, // 音量
    opt_timer_notificationTitle     : { elType: "textbox",  defaultValue: "御城プロジェクト 通知" }, // 通知メッセージ
    opt_timer_message_t             : { elType: "textbox",  defaultValue: "探索が完了しました！ (第$number$部隊)" },
    opt_timer_message_s             : { elType: "textbox",  defaultValue: "修繕が完了しました！ (修繕場$number$)" },
    opt_timer_message_c             : { elType: "textbox",  defaultValue: "築城が完了しました！ (縄張場$number$)" },
    opt_timer_message_r             : { elType: "textbox",  defaultValue: "霊力が回復しました！" },
    opt_timer_message_h             : { elType: "textbox",  defaultValue: "カウントダウン終了 (汎用タイマー$number$)" },
    
    // Files for timer notification
    opt_timer_soundFile_t      : { elType: "file", defaultValue: null     }, // 音声ファイルの指定 { name: url: }
    opt_timer_soundFile_s      : { elType: "file", defaultValue: null     }, // "
    opt_timer_soundFile_c      : { elType: "file", defaultValue: null     }, // "
    opt_timer_soundFile_r      : { elType: "file", defaultValue: null     }, // "
    opt_timer_soundFile_h      : { elType: "file", defaultValue: null     }, // "
    opt_timer_imageFile_all    : { elType: "file", defaultValue: null     }, // 通知アイコンの画像指定

    /* ---------------------------------------------------- */
    //      Timer Advanced Setting
    /* ---------------------------------------------------- */
    opt_timerAd_backColor_t        : { elType: "color",    defaultValue: "#383C3C"    }, // 背景色の設定
    opt_timerAd_backColor_s        : { elType: "color",    defaultValue: "#2D3446"    }, // "
    opt_timerAd_backColor_c        : { elType: "color",    defaultValue: "#492741"    }, // "
    opt_timerAd_backColor_r        : { elType: "color",    defaultValue: "#2D3446"    }, // "
    opt_timerAd_backColor_h        : { elType: "color",    defaultValue: "#000b00"    }, // "
    opt_timerAd_backColor_ctrl     : { elType: "color",    defaultValue: "#555555"    }, // "
    opt_timerAd_textColor_def      : { elType: "color",    defaultValue: "#ffffff"    }, // 文字色の設定
    opt_timerAd_textColor_sel      : { elType: "color",    defaultValue: "#00ffff"    }, // "
    opt_timerAd_textColor_stop     : { elType: "color",    defaultValue: "#888888"    }, // "
    opt_timerAd_textColor_end      : { elType: "color",    defaultValue: "#5F7058"    }, // "
    opt_timerAd_label_t            : { elType: "textbox",  defaultValue: ["探索2", "探索3", "探索4"] }, // タイマーのラベル名設定
    opt_timerAd_label_s            : { elType: "textbox",  defaultValue: ["修繕1", "修繕2", "修繕3", "修繕4"] }, // "
    opt_timerAd_label_c            : { elType: "textbox",  defaultValue: ["築城1", "築城2", "築城3", "築城4"] }, // "
    opt_timerAd_label_h            : { elType: "textbox",  defaultValue: ["汎用1", "汎用2", "汎用3", "汎用4"] }, // "
    opt_timerAd_re_clickIncValue   : { elType: "textbox",  defaultValue: "10"         }, // 霊力タイマー クリック時の増分値
    opt_timerAd_re_recoverTime_m   : { elType: "textbox",  defaultValue: "5"          }, // 霊力が1回復するまでの時間設定(分)
    opt_timerAd_re_recoverTime_s   : { elType: "textbox",  defaultValue: "0"          }, // 霊力が1回復するまでの時間設定(秒)
    opt_timerAd_autoSet_t          : { elType: "checkbox", defaultValue: true         }, // 探索タイマーの時間表示部分をクリックした時は、「20分→3時間→6時間」とセットする
    opt_timerAd_increaseMinuteOnly : { elType: "checkbox", defaultValue: false        }, // クリックでの増分は「分」単位だけにする
    opt_timerAd_enableFocusOnClick : { elType: "checkbox", defaultValue: false        }, // ラベル表示欄（「探索２」など）を左クリックで、城プロウインドウにフォーカスする
    opt_timerAd_caption            : { elType: "textbox",  defaultValue: "timer"      }, // タイマーのキャプション
};


// 1個取得する
export async function getSetting(key) {
    if (!settings[key]) {
        throw new Error(`設定ID '${key}' が settings に存在しません`);
    }
    const { defaultValue } = settings[key];
    const result = await chrome.storage.local.get(key);
    return result[key] !== undefined ? result[key] : defaultValue;
}

// 複数取得する
export async function getSettings(keys) {
    for (const key of keys) {
        if (!settings[key]) {
            throw new Error(`設定ID '${id}' が settings に存在しません`);
        }
    }
    const results = await chrome.storage.local.get(keys);
    const output = {};

    for (const key of keys) {
        const { defaultValue } = settings[key];
        output[key] = results[key] !== undefined ? results[key] : defaultValue;
    }

    return output; // { key1: value1, key2: value2, ... }
}

// 1個デフォルト値を取得する
export function getDefaultValue(key) {
    if (!settings[key]) {
        throw new Error(`設定ID '${key}' が settings に存在しません`);
    }
    const { defaultValue } = settings[key];
    return defaultValue;
}

// 1個保存する
export async function setSetting(key, value) {
    if (!settings[key]) {
        throw new Error(`設定ID '${key}' が settings に存在しません`);
    }
    await chrome.storage.local.set({ [key]: value });
}

// 1個削除する
export async function removeSetting(key) {
    if (!settings[key]) {
        throw new Error(`設定ID '${key}' が settings に存在しません`);
    }
    await chrome.storage.local.remove(key);
}

// 正規表現で指定されたものを削除する
export async function removeSettingsByRegex(pattern) {
    const keys = Object.keys(settings).filter( key => pattern.test(key));
    if (keys.length === 0) {
        throw new Error(`settings に、パターン ${pattern} とマッチする key はありません`);
    }
    for(const key of keys) await chrome.storage.local.remove(key);
    return keys;
}

// すべての設定をデフォルト値に初期化する
export async function resetSettings() {
    const resetData = {};
    for (const { key, defaultValue } of Object.values(settings)) {
        resetData[key] = defaultValue;
    }
    await chrome.storage.local.set(resetData);
}