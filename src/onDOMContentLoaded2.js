    
// ゲームエリアを自動検出しない設定時のスクリプト



    // Bodyオブジェクトのマージンを0にしておく(初期値は (0,12) )
    // document.body.style.margin = "0px";

    // スタイル指定
    document.body.style.position    = "fixed";
    document.body.style.overflow    = "hidden";

    // 位置調整
    document.body.style.left        = "-" + scrollValue.x +"px";
    document.body.style.top         = "-" + scrollValue.y +"px";
    


    var cnt_c = 0;
    
    var findShiroproAndSetBeforeunloadEvent = function(){
        var elGameFrame = document.getElementById("game_frame");

        if (elGameFrame == null) {       
            if(cnt_c < 10){  // 城プロのゲームフレームが見つかるまで、5秒まで待つ
                setTimeout(findShiroproAndSetBeforeunloadEvent, 500);
                cnt_c += 1;
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
    }


    findShiroproAndSetBeforeunloadEvent();
