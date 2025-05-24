
let settings;


// backgroundと通信して各設定値を取得
async function getScriptSettings(){
    const response = await chrome.runtime.sendMessage({ command: "getInjectedScriptSettings" });
    // {
    //     "opt_win_autoDetectGameFrame": true,
    //     "opt_win_enableScaling": true,
    //     "opt_win_gameCenteringDisabled": false,
    //     "opt_win_scrollValueX": "6",
    //     "opt_win_scrollValueY": "61",
    //     "opt_win_showExitConfirmation": false
    // }
    return response;
}


// backgroundと通信してウインドウサイズ(クライアント領域)を取得
async function getWindowSize(){
    const response = await chrome.runtime.sendMessage({ command: "getWindowSize" });
    // { "width": 1279, "height": 728 }
    return response;
}


// backgroundと通信してゲームサイズを取得
async function getGameSize(){
    const response = await chrome.runtime.sendMessage({ command: "getGameSize" });
    // { "width": 1275, "height": 720 }
    return response;
}

// 指定回数まで特定の要素が現れるのを待つ関数
async function waitForElement(id, interval = 500, maxTries = 10) {
    for (let i = 0; i < maxTries; i++) {
        const el = document.getElementById(id);
        if (el !== null) return el;
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    return null;
}


// ゲームエリアをウインドウにフィットさせる
async function fitGameAreaToWindow(){
    // ウインドウサイズを取得
    const windowSize = await getWindowSize();
    let clientAspectRaito = windowSize.height / windowSize.width;
    
    // ゲームサイズを取得
    const { gameWidth, gameHeight } = await getGameSize();
    const gameAspectRatio = gameHeight / gameWidth;

    // 拡大率
    let scaleFactor = 1;

    // ウインドウのアス比によって決まる、ゲームフレームの原点座標(ページ内座標ではなく、ウインドウ上の座標)
    let gamePosX = 0;
    let gamePosY = 0;

    if(clientAspectRaito < gameAspectRatio){   //ウインドウサイズが横に長い時
        scaleFactor = windowSize.height / gameHeight;
        gamePosX = (windowSize.width - gameWidth * scaleFactor) / 2;
        gamePosX =  Math.round( gamePosX / scaleFactor );
        gamePosY = 0;
    }
    else if(clientAspectRaito > gameAspectRatio){ //ウインドウサイズが縦に長い時
        scaleFactor = windowSize.width / gameWidth;
        gamePosX = 0;
        gamePosY = (windowSize.height - gameHeight * scaleFactor) / 2;
        gamePosY =  Math.round(gamePosY / scaleFactor);
    }
    else{   //比が同じ
        scaleFactor = windowSize.width / gameWidth;
        gamePosX = 0;
        gamePosY = 0;
    }

    // 「ウインドウリサイズ時、縦方向へのゲーム画面中央化を行わない」設定
    if(settings.opt_win_gameCenteringDisabled) gamePosY = 0;

    // 拡大縮小(background にメッセージを送る)
    await chrome.runtime.sendMessage({
        command:"setZoom",
        scaleFactor:scaleFactor.toString()
    });

    // ページの位置補正開始
    const elGameFrame = document.getElementById("game_frame");
    if(!elGameFrame) return;

    // スタイル指定
    document.body.style.position = "fixed";
    document.body.style.overflow = "hidden";

    // Bodyオブジェクトのマージンを0にしておく(初期値は (0,12) )
    document.body.style.margin = "0px";

    // ゲームフレーム原点の現在のオフセット値を取得
    const bounds = elGameFrame.getBoundingClientRect();
    let offsetX = Math.round(bounds.left);
    let offsetY = Math.round(bounds.top) 

    // body要素の矩形情報を取得
    const bodyRect = document.body.getBoundingClientRect();

    // 全体のオフセット値の決定
    const destinationX = bodyRect.left - offsetX + gamePosX;
    const destinationY = bodyRect.top  - offsetY + gamePosY;

    // Body要素の移動
    document.body.style.left = "" + destinationX +"px";
    document.body.style.top  = "" + destinationY +"px"; 
}


async function main(){
    // 設定値取得
    settings = await getScriptSettings();

    // body要素が見つかるまで5秒まで待つ
    for (let i = 0; i < 10; i++) {
        if( document.body != null ) break;
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // ゲームフレームが見つかるまで5秒待つ
    const elGameFrame = await waitForElement("game_frame");
    if (!elGameFrame) {
        console.error("[Shiropro Launcher] game_frame が見つかりませんでした");
        return;
    }

    // 終了時のイベントで確認ダイアログを表示
    if(settings.opt_win_showExitConfirmation){
        window.addEventListener('beforeunload', function(e) {
            e.returnValue = '終了確認';
        }, false);
    }
    
    // ウインドウリサイズ時のイベント(ゲームエリア自動検出・拡大縮小有効設定の時のみ)
    if(settings.opt_win_autoDetectGameFrame && settings.opt_win_enableScaling){
        let timeoutId = null;
        window.addEventListener('resize', () => {
            // 一定時間待ってから fitGameAreaToWindow() を実行する、デバウンス処理 
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (document.body) fitGameAreaToWindow();
            }, 100);
        });
    }

    // ゲームエリアの調整
    if(settings.opt_win_autoDetectGameFrame){
        // ゲームエリアを自動検出してウインドウにフィットさせる
        fitGameAreaToWindow();
    } else{
        // スクロール値を指定して調整(拡大縮小は無効)
        document.body.style.position    = "fixed";
        document.body.style.overflow    = "hidden";
        document.body.style.left        = "-" + settings.opt_win_scrollValueX +"px";
        document.body.style.top         = "-" + settings.opt_win_scrollValueY +"px";
    }
}
    

main();
