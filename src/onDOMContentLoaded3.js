//onDOMContentLoaded3
// ゲームエリア自動検出。かつ拡大縮小有効設定の時のexecuteScripts()で使用


//↓「ウインドウリサイズ時、縦方向へのゲーム画面中央化を行わない」設定用の変数(一つ上のexecuteScriptsで実行された変数)
// var gameCenteringDisabled = true or false 


var GAME_WIDTH = 1275;
var GAME_HEIGHT = 720;
var GAME_ASPECTRAITO = GAME_HEIGHT / GAME_WIDTH;

//城プロを探す
// var elGameFrame = document.getElementById("game_frame");

// if(elGameFrame){
    // var bounds = elGameFrame.getBoundingClientRect();
    // //ページの位置補正（一回のみ）
    // if(bounds.left != 0 && bounds.top != 0){
        // document.body.style.position = "fixed";
        // document.body.style.overflow = "hidden";
        // document.body.style.left = "-"+ String(bounds.left) +"px";
        // document.body.style.top = "-"+ String(bounds.top) +"px";
    // }
// }

// debug
// console.log("executeScript");
// console.log(elGameFrame);
// console.log(document.body);
// var bodyRect = document.body.getBoundingClientRect();
// console.log(bodyRect);
// console.log(window.onresize);



// カウント変数
var cnt_a = 0;

// resizeイベントのSetTimeOut用
var timeoutId = 0;

// イベント初期化
var initEvent =function()
{

    // bodyオブジェクトを探す
    if (document.body == null || window.outerWidth < 1) {       
        if(cnt_a < 10){  // bodyオブジェクト見つかるまで、5秒まで待つ
            setTimeout(initEvent, 500);
            cnt_a += 1;
            // debug
            console.log(cnt_a);
        }
        return;
    }

    // インラインフレームを探す
    var elGameFrame = document.getElementById("game_frame");
    if (elGameFrame == null) {       
        if(cnt_a < 10){  // ゲームフレームが見つかるまで、5秒まで待つ
            setTimeout(initEvent, 500);
            cnt_a += 1;
        }
        return;
    }

    
    // 終了時の確認
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"localStorage_GetItem",
        key:"opt_other_showExitConfirmation"
    }, function(response) {
        var b;
        if(response.result){ b = JSON.parse(response.value); }
        else{ b = false;}
        if(b){
            window.addEventListener('beforeunload', function(e) {
                e.returnValue = '終了確認';
            }, false);
        }
    });

    // if(localStorage.getItem("opt_other_showExitConfirmation")? JSON.parse(localStorage.getItem("opt_other_showExitConfirmation") ): true){
        // window.addEventListener('beforeunload', function(e) {
            // e.returnValue = '終了確認';
        // }, false);
    // }

    // 既にリサイズイベント登録済みならリターン
    if(window.onresize != null){
         return;
    }
    
    // debug
    // console.log("regist onresize");


    // ウインドウリサイズ時のイベント
    // window.onresize = function() {
        // if(document.body){
            // fitGameAreaToWindow();
        // }
    // }
    // @see http://stackoverflow.com/questions/13141072/how-to-get-notified-on-window-resize-in-chrome-browser
    window.addEventListener('resize', function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function() {
            if(document.body){
                fitGameAreaToWindow();
            }
            timeoutId = 0;
        }, 100);
        // console.log("regist onresize");
    }, false);
    
}

initEvent();


// ゲームエリアをウインドウに合わせる
var fitGameAreaToWindow = function()
{
    // debug
    // console.log("onresizeEvent");

    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"getWindowSize"
    }, function(response) {
        
        //拡大率
        var scaleFactor = 1;
        //
        var gamePosX = 0;
        var gamePosY = 0;
        //
        var clientAspectRaito = response.height / response.width;
        
        if(clientAspectRaito < GAME_ASPECTRAITO){   //ウインドウサイズが横に長い時
            scaleFactor = response.height / GAME_HEIGHT;
            gamePosX = (response.width - GAME_WIDTH * scaleFactor) / 2;
            gamePosX =  Math.round( gamePosX / scaleFactor );
            gamePosY = 0;
        }
        else if(clientAspectRaito > GAME_ASPECTRAITO){ //ウインドウサイズが縦に長い時
            scaleFactor = response.width / GAME_WIDTH;
            gamePosX = 0;
            gamePosY = (response.height - GAME_HEIGHT * scaleFactor) / 2;
            gamePosY =  Math.round(gamePosY / scaleFactor);
        }
        else{   //比が同じ
            scaleFactor = response.width / GAME_WIDTH;
            gamePosX = 0;
            gamePosY = 0;
        }
        
        //微調整(かなり適当)
        //console.log("scaleFactor :" + scaleFactor);
        // if(scaleFactor == 1.5){
            // scaleFactor += 0.001;
            // //console.log("correctedScaleFactor :" + scaleFactor);
        // }

        //ウインドウリサイズ時、縦方向へのゲーム画面中央化を行わない 設定
        if(gameCenteringDisabled){gamePosY = 0;}
        
        //console.log("gameposX:" + gamePosX);
        //console.log("gameposY:" + gamePosY);
        //console.log("response.width:" + response.width);
        //console.log("response.height:" + response.height);
        

        //拡大縮小(RE以降、background.js にメッセージを送る方法に変更した)
        chrome.runtime.sendMessage({
            name: "ShiroproLauncher_Command",
            command:"setZoom",
            scaleFactor:scaleFactor.toString()
        }, function(response) {
            // ページの位置補正
            var elGameFrame = document.getElementById("game_frame");
            if(elGameFrame){
                // スタイル指定
                document.body.style.position = "fixed";
                document.body.style.overflow = "hidden";

                // Bodyオブジェクトのマージンを0にしておく(初期値は (0,12) )
                document.body.style.margin = "0px";

                // ゲームフレーム原点の現在のオフセット値を取得
                var bounds = elGameFrame.getBoundingClientRect();
                var offsetX = Math.round(bounds.left);
                var offsetY = Math.round(bounds.top) 

                // 微調整(REからゲームフレームの原点付近内部に少し余白が入っている為)
                offsetX = offsetX + 5;

                // 現在のページ座標(Bodyオブジェクトの座標であって、スクロール値ではないので注意)
                // var currentBodyLeft = parseInt(document.body.style.left, 10);
                // var currentBodyTop = parseInt(document.body.style.top, 10);


                // bodyオブジェクトの矩形取得(REになって、document.body.style.leftで取得出来なくなったので)
                var bodyRect = document.body.getBoundingClientRect();

                // debug
                // console.log(elGameFrame);
                // console.log(document.body);
                // console.log("body left:" + bodyRect.left);
                // console.log("body top:" + bodyRect.top);
                // console.log("offsetX:" + offsetX);
                // console.log("offsetY:" + offsetY);
                // console.log(bodyRect);
                // console.log(window.onresize);

                // 全体のオフセット値の決定
                var destinationX = bodyRect.left - offsetX + gamePosX;
                var destinationY = bodyRect.top - offsetY + gamePosY;

                // Bodyオブジェクトの移動
                document.body.style.left = "" + destinationX +"px";
                document.body.style.top = "" + destinationY +"px"; 
            }
        
        });


    });
}




// カウント変数 その2
var cnt_b = 0;

// 城プロを見つけて、位置調整する
var findShiroproAndFitToWindow =function()
{
    var elGameFrame = document.getElementById("game_frame");

    if (elGameFrame == null) {       
        if(cnt_b < 10){  // 城プロのゲームフレームが見つかるまで、5秒まで待つ
            setTimeout(findShiroproAndFitToWindow, 500);
            cnt_b += 1;
            // debug
            // console.log(cnt_b);
        }
        return;
    }

    //ページの位置補正（一回のみ）
    var bodyRect = document.body.getBoundingClientRect();
    if(bodyRect.left == 0 || bodyRect.top == 0){
        fitGameAreaToWindow();
    }
    // debug
    // console.log(bounds);
}

findShiroproAndFitToWindow();


// var elGameFrame = document.getElementById("game_frame");

// if(elGameFrame){
    // var bounds = elGameFrame.getBoundingClientRect();
    // //ページの位置補正（一回のみ）
    // if(bounds.left != 0 && bounds.top != 0){
        // document.body.style.position = "fixed";
        // document.body.style.overflow = "hidden";
        // document.body.style.left = "-"+ String(bounds.left) +"px";
        // document.body.style.top = "-"+ String(bounds.top) +"px";
    // }
// }



