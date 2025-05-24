import { getSetting, getSettings, setSetting } from './settings.js';
import { ScreenShot } from './screenshot.js';

const ShiroproLauncher = {
    isInitialized: false,
    window : null,
    timerWindow : null,
    gameSize : { width:1275, height:720 },
    gameUrl : "https://play.games.dmm.com/game/oshirore",
    urlFilters : ["osapi.dmm.com", "777106"], // onDOMContentLoadedイベントのURLフィルター(or条件)
};


ShiroproLauncher.initEvents = function(){
    // インストール時(拡張機能の更新時、再読み込み時にも呼ばれる)
    chrome.runtime.onInstalled.addListener(async(details) => {
        await ShiroproLauncher.initExtension();
    });

    // 拡張機能アイコンクリック時
    chrome.action.onClicked.addListener(async function(tab) {
        await ShiroproLauncher.initExtension();
        await ShiroproLauncher.createWindow();
    });
  
    // on webNavigation Completed
    chrome.webNavigation.onDOMContentLoaded.addListener(async function(details) {
        await ShiroproLauncher.initExtension();
        if (ShiroproLauncher.window?.tabs[0].id == details.tabId) {
            // ゲームフレームの位置を調整するスクリプトを実行する
            const tabId = ShiroproLauncher.window.tabs[0].id;
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ["adjustGameFramePos.js"]
            });
        }
    }, 
    {
        url: ShiroproLauncher.urlFilters.map(filter => ({ urlContains: filter })) //URL filter
    });

    // on window removed
    chrome.windows.onRemoved.addListener( async function(windowId){
        await ShiroproLauncher.initExtension();
        // shiropro window
        if(ShiroproLauncher.window?.id == windowId){
            ShiroproLauncher.window = null;
            await setSetting("bg_shiroproWindow", null);
            chrome.action.setPopup({popup:""});
        }
        // timer window
        if(ShiroproLauncher.timerWindow?.id == windowId){
            ShiroproLauncher.timerWindow = null;
            await setSetting("bg_timerWindow", null);
        }
    });
    
    // on Command (キーボードショートカット)
    chrome.commands.onCommand.addListener(async function(command) {
        console.log("[command executed] command name:", command);
        await ShiroproLauncher.initExtension();
        switch (command){
        case "ScreenShot":
            ScreenShot.capture(ShiroproLauncher.window?.id, ShiroproLauncher.gameSize);
            break;
        case "OpenTimer":
            ShiroproLauncher.createTimerWindow();
            break;
        case "ToggleFullScreen":
            ShiroproLauncher.toggleFullscreen();
            break;
        case "ToggleSoundMute":
            ShiroproLauncher.toggleSoundMute();
            break;
        default:
            break;
        }
    });
    
    //on notifications clicked
    chrome.notifications.onClicked.addListener(async function(){
        await ShiroproLauncher.initExtension();
        ShiroproLauncher.focusOrCreateWindow();
    });

    //on contextMenus clicked
    chrome.contextMenus.onClicked.addListener(async (info, tab) => {
        await ShiroproLauncher.initExtension();
        if (info.menuItemId === "openTimer") {
            await ShiroproLauncher.createTimerWindow();
        }
    });

    // ポップアップメニュー、タイマー、scriptとの通信
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { // chrome.runtime.onMessage.addListenerにasync関数は仕様上避けるべき。then構文はok
        // console.log("[message recieved] ", request);
        (async () => {
            await ShiroproLauncher.initExtension(); // 初期化
            const response = await ShiroproLauncher.handleCommandOnMessage(request, sender);
            sendResponse(response);
            // console.log("[message responsed] ", response);
        })();

        return true; // 非同期レスポンスを返すために必要
    });
    
    // ウインドウ位置とサイズ変更時
    chrome.windows.onBoundsChanged.addListener(this.onBoundsChangedListener);
    console.log("[(+)add listener] chrome.windows.onBoundsChanged")

    // end of initEvents
}


ShiroproLauncher.handleCommandOnMessage = async function (request, sender){
    switch(request.command){
    case "screenShot":
        ScreenShot.capture(ShiroproLauncher.window?.id, ShiroproLauncher.gameSize);
        break;
    case "focus":
        if(ShiroproLauncher.window) chrome.windows.update(ShiroproLauncher.window.id, {focused:true});
        break;
    case "focusOrCreateWindow":
        ShiroproLauncher.focusOrCreateWindow();
        break;
    case "timer":
        await ShiroproLauncher.createTimerWindow();
        break;
    case "resizeByScaleFactor":
        ShiroproLauncher.resizeByScaleFactor( parseFloat(request.scaleFactor) );
        break;
    case "minorResize":
        ShiroproLauncher.minorResize(request.updown);
        break;
    case "fullScreen":
        ShiroproLauncher.toggleFullscreen();
        break;
    case "getInjectedScriptSettings":
        const keys = ["opt_win_autoDetectGameFrame", "opt_win_enableScaling", "opt_win_gameCenteringDisabled",
            "opt_win_scrollValueX", "opt_win_scrollValueY", "opt_win_showExitConfirmation"];
        return await getSettings(keys);
    case "getWindowSize":
        const win = await chrome.windows.get(ShiroproLauncher.window.id, {populate:true});
        return { width: win.tabs[0].width, height: win.tabs[0].height};
    case "getWindowId":
        return { windowId : ShiroproLauncher.window?.id };
    case "getGameSize":
        return { gameWidth: ShiroproLauncher.gameSize.width, gameHeight: ShiroproLauncher.gameSize.height};
    case "setZoom":
        ShiroproLauncher.setZoom( parseFloat(request.scaleFactor) );
        break;
    case "sound_mute":
        ShiroproLauncher.toggleSoundMute();
        break;
    default:
        break;
    }
    return null;
}


ShiroproLauncher.onBoundsChangedListener = async function (win){
    await ShiroproLauncher.initExtension();
    // shiropro window
    if(win.id === ShiroproLauncher.window?.id){
        const tab = ( await chrome.windows.get(win.id, {populate:true}) ).tabs[0];
        await setSetting("bg_shiroproWindowPos", { left:win.left, top:win.top });
        await setSetting("bg_shiroproClientSize", { width:tab.width, height:tab.height });
    }
    // timer
    else if(win.id === ShiroproLauncher.timerWindow?.id){
        await setSetting("bg_timerWindowRect", {left:win.left, top:win.top, width:win.width, height:win.height});
    }
}


ShiroproLauncher.initExtension = async function () {
    if(!this.isInitialized){
        this.isInitialized = true;
        await this.loadWindowObjects();
        await this.initContextMenu();
        // 管理しているウインドウが無いときは、onBoundsChanged イベントリスナーを削除(不要なServiceWorkerの起動を抑えるため)
        if(this.window === null && this.timerWindow === null){
            chrome.windows.onBoundsChanged.removeListener(this.onBoundsChangedListener);
            console.log("[(-)remove listener] chrome.windows.onBoundsChanged")
        }

        console.log("[notification] extension initialized");
    }
}


ShiroproLauncher.loadWindowObjects = async function(){
    this.window      = await getSetting("bg_shiroproWindow");
    this.timerWindow = await getSetting("bg_timerWindow");
}


ShiroproLauncher.initContextMenu = function(){
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        title : "タイマーの起動",
        type : "normal",
        id : "openTimer",
        parentId: null,
        contexts : ["action"]
    });
}


// 初期位置・クライアントサイズの決定
ShiroproLauncher.getInitialPosAndClientSize = async function(){
    // デフォルト値を代入
    let windowPos  = { left: null, top: null };
    let clientSize = { width: this.gameSize.width, height: this.gameSize.height }

    // ウインドウの位置を記憶する設定の場合
    if(await getSetting("opt_win_saveShiroproWindowPos")){
        const prevPos = await getSetting("bg_shiroproWindowPos");
        windowPos.left = prevPos.left;
        windowPos.top  = prevPos.top;
    }

    // ウインドウサイズを記憶する設定の場合
    const prevSize = await getSetting("bg_shiroproClientSize");
    if( prevSize && (await getSetting("opt_win_saveShiroproClientSize")) ){
        clientSize.width  = prevSize.width;
        clientSize.height = prevSize.height;
    }

    // ウインドウ位置を明示的に指定
    if(await getSetting("opt_win_specifyShiroproWindowPos")){
        windowPos.left = Number( await getSetting("opt_win_ShiroproWindowPosX") );
        windowPos.top  = Number( await getSetting("opt_win_ShiroproWindowPosY") );
    }

    // ウインドウサイズを明示的に指定
    if(await getSetting("opt_win_specifyShiroproWindowSize")){
            let percentatage = Number( await getSetting("opt_win_ShiroproWindowSize") );
            if(percentatage <= 0){percentatage = 100};
            clientSize.width =  percentatage / 100 * this.gameSize.width;
            clientSize.height = percentatage / 100 * this.gameSize.height;
    }

    //ウインドウサイズの小数点以下を丸める
    clientSize.width  = Math.round(clientSize.width);
    clientSize.height = Math.round(clientSize.height);
    
    return { windowPos, clientSize };
}


ShiroproLauncher.createWindow = async function(){
    // 重複チェック
    const windowList = await chrome.windows.getAll({ populate: true });
    for (const win of windowList) {
        // 城プロランチャーのウインドウがすでに存在しているかチェック
        if (this.window?.id === win.id) {
            await chrome.windows.update(win.id, { focused: true });
            await chrome.action.setPopup({popup:"popup.html"});
            console.warn("[warning] createWindow() prevented. shiropro window is already exist");
            return; // 二重起動防止
        }

        // 他のタブで城プロが開かれていないかチェック
        for (const tabItem of win.tabs) {
            if (tabItem.url.match(this.gameUrl)) {
                // 開かれていた場合はそれをフォーカス
                await chrome.windows.update(tabItem.windowId, { focused: true });
                await chrome.tabs.update(tabItem.id, { highlighted: true });
                console.warn("[warning] createWindow() prevented. shiropro tab is already exist");
                return;
            }
        }
    }

    // 初期ウインドウサイズ・位置
    const { windowPos, clientSize } = await this.getInitialPosAndClientSize();
    
    // 作成
    this.window = null;
    const opt = {
        url     : this.gameUrl,
        focused : true,
        type    : 'popup',
        left    : windowPos.left,
        top     : windowPos.top,
        width   : clientSize.width, // 正確ではないがとりあえず指定。resizeWindow()で正しく初期化される
        height  : clientSize.height // "
    }
    const newWindow = await chrome.windows.create(opt);

    // 城プロのウインドウオブジェクトをキープ
    this.window = newWindow;
    setSetting("bg_shiroproWindow", newWindow);

    // クライアントサイズ初期化
    this.resizeWindow(clientSize.width, clientSize.height);

    // ポップアップメニュー
    await chrome.action.setPopup({popup:"popup.html"});

    // ウインドウ位置とサイズ変更時、その値を保存する
    chrome.windows.onBoundsChanged.addListener(this.onBoundsChangedListener);
    console.log("[(+)add listener] chrome.windows.onBoundsChanged")

    // 設定によりタイマーも同時起動
    if(await getSetting("opt_timer_launchSameTime")){
       this.createTimerWindow();
    }
};


ShiroproLauncher.createTimerWindow = async function(){
    // 重複チェック
    const windowList = await chrome.windows.getAll({ populate: true });
    for (const win of windowList) {
        if (this.timerWindow?.id === win.id) {
            await chrome.windows.update(ShiroproLauncher.timerWindow.id, {focused:true});
            return; // 二重起動防止
        }
    }

    // パラメータ
    const prevRect  = await getSetting("bg_timerWindowRect");
    const opt = {
        url     : "timer.html",
        focused : false,
        type    : 'popup',
        width   : prevRect.width,
        height  : prevRect.height
    }
    if(await getSetting("opt_timer_savePos")){
        opt.left   = prevRect.left;
        opt.top    = prevRect.top;
    }

    // 作成
    const newTimerWindow = await chrome.windows.create(opt);
    this.timerWindow = newTimerWindow;
    await setSetting("bg_timerWindow", newTimerWindow);
    await chrome.windows.update(newTimerWindow.id, {focused:true});

    // ウインドウ位置とサイズ変更時、その値を保存する
    chrome.windows.onBoundsChanged.addListener(this.onBoundsChangedListener);
    console.log("[(+)add listener] chrome.windows.onBoundsChanged")
}


ShiroproLauncher.resizeWindow = async function(width, height){ // widthとheightはクライアント領域のサイズ(枠含めない)
    if(!this.window) return;
    let win = await chrome.windows.get(this.window.id, {populate:true});
    await chrome.windows.update(win.id,{
        width   : Math.floor(width)  + (win.width  - win.tabs[0].width),
        height  : Math.floor(height) + (win.height - win.tabs[0].height),
        focused : true
    });
}


ShiroproLauncher.resizeByScaleFactor = async function(scaleFactor){
    const width  = this.gameSize.width  * scaleFactor;
    const height = this.gameSize.height * scaleFactor;
    await this.resizeWindow(width, height);
}


ShiroproLauncher.minorResize = async function(updown){
    // ウインドウ情報を取得（タブ情報も含める）
    if(!this.window) return;
    const win = await chrome.windows.get(this.window.id, { populate: true });
    const tab = win.tabs[0];

    // ゲームと現在のクライアントウインドウのアスペクト比を取得
    const gameAspectRatio   = this.gameSize.height / this.gameSize.width;
    const clientAspectRatio = tab.height / tab.width;

    // リサイズの最小単位（ゲームサイズの10分の1）
    const unitWidth  = this.gameSize.width  / 10;
    const unitHeight = this.gameSize.height / 10;

    // up/down の判定
    const isUp = updown === "up";

    let width, height;
    if (clientAspectRatio > gameAspectRatio) { //ウインドウサイズが横に長い時
        // 横を基準に調整する
        const baseWidth = Math.ceil(tab.width / unitWidth) * unitWidth;
        width = baseWidth + (isUp ? unitWidth : -unitWidth);
        height = width * gameAspectRatio;
    } else { // ウインドウサイズが横に長い時
        // 縦を基準に調整する
        const baseHeight = Math.ceil(tab.height / unitHeight) * unitHeight;
        height = baseHeight + (isUp ? unitHeight : -unitHeight);
        width = height / gameAspectRatio;
    }

    // 無効なサイズは無視
    if (width <= 0 || height <= 0) return;

    // ウインドウサイズを更新
    this.resizeWindow(width, height);
}


ShiroproLauncher.setZoom = async function(scaleFactor){
    const win = await chrome.windows.get(ShiroproLauncher.window.id, { populate: true });
    const tabId = win.tabs[0].id;
    const prevScaleFactor = await chrome.tabs.getZoom(tabId);

    // 変更前後の拡大率が同じなら処理しない
    if (scaleFactor === prevScaleFactor) {
        return;
    }
    // 拡大率の更新
    await chrome.tabs.setZoom(tabId, scaleFactor);
}


ShiroproLauncher.toggleFullscreen = async function(){
    if(!this.window) return;
    const win = await chrome.windows.get(this.window.id, {populate:false});
    if(win.state != "fullscreen"){
        await chrome.windows.update(this.window.id, { state: "fullscreen", focused:true});
    }
    else{
        await chrome.windows.update(this.window.id, { state: "normal", focused:true });
    }
}


ShiroproLauncher.toggleSoundMute = async function(){
    if(!this.window) return;
    const tab = await chrome.tabs.get(this.window.tabs[0].id);
    if(tab.mutedInfo.muted){
        await chrome.tabs.update(tab.id, {muted:false});
    }
    else{
        await chrome.tabs.update(tab.id, {muted:true});
    }
}


ShiroproLauncher.focusOrCreateWindow = async function(){
    if(this.window){
        await chrome.windows.update(this.window.id, {focused:true});
    }else{
        await ShiroproLauncher.createWindow();
    }
}



ShiroproLauncher.initEvents();

