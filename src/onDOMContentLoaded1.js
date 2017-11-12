	
    // ゲームエリアを自動検出。かつ拡大縮小を無効設定時のスクリプト


    // カウント変数
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


        //ページの位置補正（一回のみ）
        var bodyRect = document.body.getBoundingClientRect();
        if(bodyRect.left == 0 || bodyRect.top == 0)
        {
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
           offsetX = offsetX + 6;
           
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
           var destinationX = bodyRect.left - offsetX;
           var destinationY = bodyRect.top - offsetY;
           
           // Bodyオブジェクトの移動
           document.body.style.left = "" + destinationX +"px";
           document.body.style.top = "" + destinationY +"px"; 

        }


    }

    findShiroproAndFitToWindow();

	
	
