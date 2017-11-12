
var ShiroproLauncher = {
    window : null,
    timerWindow : null,
    gameSize : {width:1275, height:720},
    firstWindowSize : {width:1275, height:720},
    gameUrl : "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=777106/",
    urlFilters : new Array("app_id=777106", "osapi.dmm.com"),

    isWidgetOpenFromOptionPage : 0, // ウィジェット(desktopLaunchWidget.html)がオプションページから呼ばれたのかどうか
    widgetWindowId : null
};


ShiroproLauncher.init = function(){
    this.loadParameter();
    this.initEvents();
    this.initContextmenu();
    this.initMessage();
};


ShiroproLauncher.loadParameter = function(){
    this.window = JSON.parse(localStorage.getItem("WindowObj"));
    this.timerWindow = JSON.parse(localStorage.getItem("TimerWindowObj"));
}


ShiroproLauncher.initEvents = function(){
    // browserAction onClicked
    chrome.browserAction.onClicked.addListener(function(tab){
        chrome.windows.getAll({populate:true}, function(windowList){
            for(var i=0; i<windowList.length; i++){
                //is ShiroproWindow exist?
                if(ShiroproLauncher.window){
                    if(ShiroproLauncher.window.id == windowList[i].id){ //exist
                        chrome.windows.update(ShiroproLauncher.window.id, {focused:true}, function(win) {});
                        return; //for prevent double launch
                    }
                }
                //他のタブで城プロが開かれていないかチェック
                for(var j=0;j<windowList[i].tabs.length; j++){
                    if(windowList[i].tabs[j].url.match(ShiroproLauncher.gameUrl)){ 
                        chrome.tabs.update(windowList[i].tabs[j].id, {highlighted:true}, function(tab){
                            chrome.windows.update(tab.windowId,{focused:true}, function(){});
                        });
                        return;                     
                    }
                }
            }
            //not exist
            
            ShiroproLauncher.window = null; 
            ShiroproLauncher.createWindow();
        });
    });
    

  
    // on webNavigation Completed
    chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
        if (ShiroproLauncher.window && details.tabId == ShiroproLauncher.window.tabs[0].id) {
            ShiroproLauncher.executeScript();
        }
    }, { url: [
        {urlContains: ShiroproLauncher.urlFilters[0]},
        {urlContains: ShiroproLauncher.urlFilters[1]}
    ]}); //URL filter
    
    // on window removed
    chrome.windows.onRemoved.addListener(function(windowId){
        //main window
        if(ShiroproLauncher.window && ShiroproLauncher.window.id == windowId){
            ShiroproLauncher.window = null;
            localStorage.removeItem("WindowObj"); //今のところ保存しておく理由がないので
            chrome.browserAction.setPopup({popup:""});
        }
        //timer window
        if(ShiroproLauncher.timerWindow && ShiroproLauncher.timerWindow.id == windowId){
            ShiroproLauncher.timerWindow = null;
            localStorage.removeItem("TimerWindowObj"); //同じく保存しておく理由がない
        }
    });
    
    //on Command
    chrome.commands.onCommand.addListener(function(command) {
        switch (command){
        case "ScreenShot":
            chrome.windows.get(ShiroproLauncher.window.id, {populate:false}, function(win){
                if(!win.focused){return;} //ShiroproWindow is not active
                ShiroproLauncher.ScreenShot.take();
            });
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
    chrome.notifications.onClicked.addListener(function(){
        ShiroproLauncher.focusOrOpen();
    });
    //on contextMenus clicked
    function getClickHandler() {
        return function(info, tab) {
            if(info.menuItemId == "openTimer"){ShiroproLauncher.createTimerWindow();}
        };
    };
    chrome.contextMenus.onClicked.addListener(getClickHandler());

};


ShiroproLauncher.initContextmenu = function(){
    //remove
    chrome.contextMenus.removeAll(function(){});
    //create
    //EventPageではonclickプロパティでのコールバック関数指定はできない(代わりにchrome.contextMenus.onClicked.addListener)
    chrome.contextMenus.create({
        title : "タイマーの起動",
        type : "normal",
        id : "openTimer",
        parentId: null,
        contexts : ["browser_action"]
    });
}


ShiroproLauncher.toggleFullscreen = function(){
    if(!ShiroproLauncher.window){return;}
    chrome.windows.get(ShiroproLauncher.window.id, {populate:false}, function(win){
        if(win.state != "fullscreen"){
            chrome.windows.update(ShiroproLauncher.window.id, { state: "fullscreen", focused:true});
        }
        else{
            chrome.windows.update(ShiroproLauncher.window.id, { state: "normal", focused:true });
        }
    });
}

ShiroproLauncher.toggleSoundMute = function(){
    if(!ShiroproLauncher.window){return;}
    chrome.tabs.get(ShiroproLauncher.window.tabs[0].id, function(tab){
        if(tab.mutedInfo.muted){
            chrome.tabs.update(ShiroproLauncher.window.tabs[0].id, {muted:false}, function(){});
        }
        else{
            chrome.tabs.update(ShiroproLauncher.window.tabs[0].id, {muted:true}, function(){});
        }
    });
}

ShiroproLauncher.focusOrOpen = function(){
    if(ShiroproLauncher.window){
        chrome.windows.update(ShiroproLauncher.window.id, {focused:true}, function(win) {});
    }else{
        chrome.windows.getAll({populate:true}, function(windowList){
            for(var i=0; i<windowList.length; i++){
                for(var j=0;j<windowList[i].tabs.length; j++){
                    if(windowList[i].tabs[j].url.match(ShiroproLauncher.gameUrl)){ //既に他のタブで起動している
                        chrome.tabs.update(windowList[i].tabs[j].id, {highlighted:true}, function(tab){
                            chrome.windows.update(tab.windowId,{focused:true}, function(){});
                        });
                        return;                     
                    }
                }
            }
            ShiroproLauncher.createWindow();
        });
    }
}


ShiroproLauncher.executeScript = function(){
    //! 自動検出する 
    if(localStorage.getItem("opt_other_autoPos")?JSON.parse(localStorage.getItem("opt_other_autoPos") ):true){
        //! ウインドウリサイズ時の拡大縮小を有効にする
        if(localStorage.getItem("opt_other_enableScaling")?JSON.parse(localStorage.getItem("opt_other_enableScaling") ):true){
            //ウインドウリサイズ時、縦方向への中央化を行うかどうか
            var additionalCode = "var gameCenteringDisabled = false";
            if(localStorage.getItem("opt_other_gameCenteringDisabled")?JSON.parse(localStorage.getItem("opt_other_gameCenteringDisabled") ):false){
                var additionalCode = "var gameCenteringDisabled = true";
            }
            //additional code
            chrome.tabs.executeScript(ShiroproLauncher.window.tabs[0].id, {
                code: additionalCode
            }, function(){
                //main script
                chrome.tabs.executeScript(ShiroproLauncher.window.tabs[0].id, {
                    file: "onDOMContentLoaded3.js"
                }, function(){});
            });
        }
        //! 拡大縮小は無効
        else{
            chrome.tabs.executeScript(ShiroproLauncher.window.tabs[0].id, {
                file: "onDOMContentLoaded1.js"
            }, function(){});
        }
    //! スクロール値を指定して調整する (拡大縮小は無効)
    }else{
        var scroll_X = localStorage.getItem("opt_other_scrollValueX")?(localStorage.getItem("opt_other_scrollValueX") ):6;
        var scroll_Y = localStorage.getItem("opt_other_scrollValueY")?(localStorage.getItem("opt_other_scrollValueY") ):61;
        chrome.tabs.executeScript(ShiroproLauncher.window.tabs[0].id, {code: "var scrollValue = {x:" +scroll_X+", y:"+scroll_Y+"};"},function(){
            chrome.tabs.executeScript(ShiroproLauncher.window.tabs[0].id, {file: "onDOMContentLoaded2.js"});                
        });                             
    }
}


ShiroproLauncher.getWindowRectSetting = function(){
    var rect = {
        left  : null,
        top   : null,
        width : null,
        height: null
    }
    //ウインドウサイズ、位置、設定読み込み
    if(localStorage.getItem("opt_other_specifyShiroproWindowPos")?
        JSON.parse(localStorage.getItem("opt_other_specifyShiroproWindowPos") ):false){
        if(localStorage.getItem("opt_other_ShiroproWindowPosX")){
            rect.left = Number(localStorage.getItem("opt_other_ShiroproWindowPosX") );
        }
        else{rect.left = 100;}
        if(localStorage.getItem("opt_other_ShiroproWindowPosY")){
            rect.top = Number(localStorage.getItem("opt_other_ShiroproWindowPosY") );
        }
        else{rect.top = 100;}
    }
    if(localStorage.getItem("opt_other_specifyShiroproWindowSize")?
        JSON.parse(localStorage.getItem("opt_other_specifyShiroproWindowSize") ):false){
            var percentatage = localStorage.getItem("opt_other_ShiroproWindowSize") ? 
                Number(localStorage.getItem("opt_other_ShiroproWindowSize") ) : 100;
            if(percentatage <= 0){percentatage = 100};
            this.firstWindowSize.width =  percentatage / 100 * this.gameSize.width;
            this.firstWindowSize.height = percentatage / 100 * this.gameSize.height;
    }else{
        this.firstWindowSize.width = this.gameSize.width;
        this.firstWindowSize.height = this.gameSize.height;
    }
    //ウインドウサイズの小数点以下四捨五入
    this.firstWindowSize.width = Math.round(this.firstWindowSize.width);
    this.firstWindowSize.height = Math.round(this.firstWindowSize.height);
    rect.width = this.firstWindowSize.width;
    rect.height = this.firstWindowSize.height;

    return rect;
}


ShiroproLauncher.createWindow = function(){
    var opt = {
        url : ShiroproLauncher.gameUrl,
        focused : true,
        type : 'popup'
    }
    var rect = ShiroproLauncher.getWindowRectSetting();
    opt.left = rect.left;
    opt.top = rect.top;
    opt.width = rect.width;
    opt.height = rect.height;
    
    chrome.windows.create(opt, function(newWindow){
        //keep window obj
        ShiroproLauncher.window = newWindow;
        localStorage.setItem("WindowObj", JSON.stringify(newWindow));
        //init window size (opt.widthの値は枠を含めてるのでズレる)
        ShiroproLauncher.resizeMainWindow(ShiroproLauncher.firstWindowSize.width, ShiroproLauncher.firstWindowSize.height);
        //pop up menu
        if(localStorage.getItem("opt_other_usePopupMenu")?
        JSON.parse(localStorage.getItem("opt_other_usePopupMenu") ):true){
           chrome.browserAction.setPopup({popup:"popup.html"});                            
        }
        //デスクトップショートカットからの起動だったら、ウィジェット(desktopLaunchWidget.html)を閉じる
        if(ShiroproLauncher.widgetWindowId){
            // 消す前に移動(次回デスクトップから起動した時のウィジェットの位置と大きさを、
            // 城プロウインドウの位置と大きさにするため)
            var updateInfo = {
                left:newWindow.left,
                top:newWindow.top,
                width:newWindow.width,
                height:newWindow.height
            }
            chrome.windows.update(ShiroproLauncher.widgetWindowId, updateInfo, function(){
                chrome.windows.remove(ShiroproLauncher.widgetWindowId, function(){
                    ShiroproLauncher.widgetWindowId = null;
                });
            });
        }
    });

    //設定によりタイマーも同時起動
    if(localStorage.getItem("opt_timer_launchSameTime")? 
    JSON.parse(localStorage.getItem("opt_timer_launchSameTime")):false){
       this.createTimerWindow();
    }

};


ShiroproLauncher.createTimerWindow = function(){
    var createTimer =function(){
        var timerRect = localStorage.getItem("TimerRect")?
        JSON.parse(localStorage.getItem("TimerRect")) :{left:0, top:0, width:173, height:273};
        var opt = {
            url : "timer.html",
            focused : false,
            type : 'popup',
            width : timerRect.width,
            height : timerRect.height
        }
        if(localStorage.getItem("opt_timer_savePos")?
        JSON.parse(localStorage.getItem("opt_timer_savePos")) :true ){
            if(localStorage.getItem("TimerRect")){
                opt.left = timerRect.left;
                opt.top = timerRect.top;
            }
        }
        chrome.windows.create(opt,function(newWindow){
            ShiroproLauncher.timerWindow = newWindow;
            localStorage.setItem("TimerWindowObj", JSON.stringify(newWindow));
        });
    }
    //タイマーの起動(二重起動は防止)
    if(ShiroproLauncher.timerWindow){
        chrome.windows.getAll({populate:false}, function(windowList){
            for(var i=0; i<windowList.length; i++){
                if(ShiroproLauncher.timerWindow.id == windowList[i].id){ //exist
                    chrome.windows.update(ShiroproLauncher.timerWindow.id, {focused:true}, function(win) {});
                    return; //for prevent double launch
                }
            }
            //not exist
            ShiroproLauncher.timerWindow = null; 
            createTimer();
        });
    }
    else{ createTimer();} //not exist
}


ShiroproLauncher.resizeMainWindow = function(_width, _height){
    if(!ShiroproLauncher.window){return;}
    chrome.windows.get(ShiroproLauncher.window.id, {populate:true}, function(win){
        chrome.windows.update(win.id,{
            width : Math.floor( _width) + (win.width - win.tabs[0].width),
            height : Math.floor( _height) + (win.height - win.tabs[0].height),
            focused : true
        },function(w){});
    });
}


//ポップアップメニュー、タイマー、content scriptとの通信
ShiroproLauncher.initMessage = function(){
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.name === "ShiroproLauncher_Command") {
            switch(request.command){
            case "test":
                alert("request recieved");
                break;
            case "screenShot":
                ShiroproLauncher.ScreenShot.take();
                break;
            case "focus":
                chrome.windows.update(ShiroproLauncher.window.id, {focused:true}, function(win) {});
                break;
            case "focusOrOpen":
                ShiroproLauncher.focusOrOpen();
                break;
            case "timer":
                ShiroproLauncher.createTimerWindow();
                break;
            case "saveTimerPos":
                if(ShiroproLauncher.timerWindow){
                    chrome.windows.get(ShiroproLauncher.timerWindow.id, {populate:false},function(win){
                        var timerRect = {left:win.left, top:win.top, width:win.width, height:win.height};
                        localStorage.setItem("TimerRect", JSON.stringify(timerRect));
                    });
                }
                break;
            case "resize":
                if(!ShiroproLauncher.window){break;}
                scaleFactor = parseFloat( request.scaleFactor );
                var width = ShiroproLauncher.gameSize.width * scaleFactor;
                var height = ShiroproLauncher.gameSize.height * scaleFactor;
                ShiroproLauncher.resizeMainWindow(width, height);
                break;
            case "minorResize":
                if(!ShiroproLauncher.window){break;}
                chrome.windows.get(ShiroproLauncher.window.id, {populate:true}, function(win){
                    var gameAspectRaito = ShiroproLauncher.gameSize.height / ShiroproLauncher.gameSize.width;
                    var clientAspectRaito = win.tabs[0].height /win.tabs[0].width;
                    var unitWidth =  ShiroproLauncher.gameSize.width / 10;
                    var unitHeight = ShiroproLauncher.gameSize.height / 10;
                    var width, height;
                    var incParam;
                    
                    if(clientAspectRaito > gameAspectRaito){
                        if(request.updown == "up"){incParam = unitWidth;}
                        else {incParam = - unitWidth}
                        width = Math.ceil( win.tabs[0].width / unitWidth ) * unitWidth + incParam;
                        height = width * gameAspectRaito;
                    }else{
                        if(request.updown == "up"){incParam = unitHeight;}
                        else {incParam = - unitHeight}
                        height = Math.ceil( win.tabs[0].height / unitHeight ) * unitHeight + incParam;
                        width = height / gameAspectRaito;
                    }
                    if(width <= 0 || height <= 0){return;}
                    ShiroproLauncher.resizeMainWindow(width, height);
                });
                break;
            case "fullScreen":
                ShiroproLauncher.toggleFullscreen();
                break;
            case "getWindowSize":
                chrome.windows.get(ShiroproLauncher.window.id, {populate:true},function(win){
                    sendResponse({ width: win.tabs[0].width, height: win.tabs[0].height});
                });
                return true;
            case "resizeForKeepAspectRato":
                break;
            case "setZoom":
                chrome.windows.get(ShiroproLauncher.window.id, {populate:true},function(win){
                    scaleFactor = parseFloat( request.scaleFactor );
                    chrome.tabs.getZoom(win.tabs[0].id, function(zoomFactor){
                        // 変更前後の拡大率が同じなら処理しない
                        if (scaleFactor == zoomFactor) {
                            sendResponse();
                            return true;
                        }
                        // 拡大率の更新
                        chrome.tabs.setZoom(win.tabs[0].id , scaleFactor, function(){ 
                            sendResponse();
                        });
                    });
                    
                });
                return true;
            case "fireResizeEvent":
                // リサイズイベントを意図的に発生させる(setTimeoutで遅延実行。未使用)
                setTimeout(function(){
                    ShiroproLauncher.resizeMainWindow(ShiroproLauncher.window.width-1, ShiroproLauncher.window.height-1);
                    ShiroproLauncher.resizeMainWindow(ShiroproLauncher.window.width, ShiroproLauncher.window.height);
                },1000); 
                return true;
            case "localStorage_GetItem":
                var key = request.key;
                var _value = true;
                var _result = "";
                if(localStorage.getItem(key)){
                     _value = localStorage.getItem(key);
                     _result = true;
                }
                else{
                    _result = false;
                }
                sendResponse({ value:_value, result:_result});
                break;
            case "navigateToGamePageFromDesktopShortcutWidget":
                // オプションページから呼ばれたのかチェック
                if(ShiroproLauncher.isWidgetOpenFromOptionPage){ 
                    ShiroproLauncher.isWidgetOpenFromOptionPage = 0; // 初期化
                    sendResponse({isOpenFromOptionPage:1});
                    break; 
                }

                // alert("オプション以外から開かれた");
                
                // urlがウィジェットのものであるか一応チェック
                chrome.windows.getCurrent({populate:true}, function(win){
                    // 移動前チェック 
                    chrome.windows.getAll({populate:true}, function(windowList){
                        for(var i=0; i<windowList.length; i++){
                            //is ShiroproWindow exist?
                            if(ShiroproLauncher.window){
                                if(ShiroproLauncher.window.id == windowList[i].id){ //exist
                                    chrome.windows.update(ShiroproLauncher.window.id, {focused:true}, function(win) {});
                                    chrome.windows.remove(win.id, function(){}); // 城プロが既に存在していたのでウィジェットを閉じる
                                    return; //for prevent double launch
                                }
                            }
                            //他のタブで城プロが開かれていないかチェック
                            for(var j=0;j<windowList[i].tabs.length; j++){
                                if(windowList[i].tabs[j].url.match(ShiroproLauncher.gameUrl)){ 
                                    chrome.tabs.update(windowList[i].tabs[j].id, {highlighted:true}, function(tab){
                                        chrome.windows.update(tab.windowId,{focused:true}, function(){});
                                    });
                                    chrome.windows.remove(win.id, function(){});
                                    return;                     
                                }
                            }
                        }
                        //not exist
                        ShiroproLauncher.window = null; 
                        ShiroproLauncher.widgetWindowId = win.id;

                        // 結局URL遷移後のアドレスバーを消す方法がなかったので、新しくウインドウを作成
                        ShiroproLauncher.createWindow();
                    });
                    
                });
                
                break;
            case "setParam_isWidgetOpenFromOptionPage":
                ShiroproLauncher.isWidgetOpenFromOptionPage = 1;
                sendResponse();
                 break;
            case "sound_mute":
                ShiroproLauncher.toggleSoundMute();
                break;
            default:
                break;
            }
        }
    });
}



chrome.runtime.onInstalled.addListener(function(){
    //ver1.6.0→ver1.6.1
    if(localStorage.getItem("opt_timer_soundEnable")){
        if(JSON.parse(localStorage.getItem("opt_timer_soundEnable") )){
            localStorage.setItem("opt_timer_soundEnable_t", JSON.stringify(true));
            localStorage.setItem("opt_timer_soundEnable_s", JSON.stringify(true));
            localStorage.setItem("opt_timer_soundEnable_c", JSON.stringify(true));
            localStorage.setItem("opt_timer_soundEnable_h", JSON.stringify(true));
        }
        else{
            localStorage.setItem("opt_timer_soundEnable_t", JSON.stringify(false));
            localStorage.setItem("opt_timer_soundEnable_s", JSON.stringify(false));
            localStorage.setItem("opt_timer_soundEnable_c", JSON.stringify(false));
            localStorage.setItem("opt_timer_soundEnable_h", JSON.stringify(false));
        }
        localStorage.removeItem("opt_timer_soundEnable");
    }
    // remove window object of localStorage
    localStorage.removeItem("WindowObj");
    localStorage.removeItem("TimerWindowObj");
});



ShiroproLauncher.init();



