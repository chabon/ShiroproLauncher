
var fontColor_ready = "#00ffff"
var fontColor_run   = "#ffffff"
var fontColor_stop  = "#888888"
var fontColor_end   = "#5F7058"

//var taikoSound = new Audio("taiko02.mp3");



function CReiryokuTimer(_category, _num){


    /* =================================================================== */
    //      member 
    /* =================================================================== */
    this.category           = _category;
    this.num                = _num;
    this.state              = "stop";   //"stop" "ready" "run" "end"
    this.readyCnt           = 0;
    this.td_clickCnt        = 0;

    this.reiryoku           = new Array(40, 40); // ---/--- 
    this.time               = new Array(0, 0);   // --:-- 
    this.endTime            = null;
    this.refillInterval     = new Array(5, 0);   // 霊力が1回復する時間 [0]:Minute, [1]:second

    this.bShowTimeLeftForComplete = false;  // 完全回復までの残り時間を表示するかどうか
    this.timeDisplayType    = 1;            // 1:回復までを表示  2:全快までを表示
    
    // elements
    this.reiryokuElemants   = document.getElementsByName("reiryoku_val"); 
    this.reiryokuRemainStr  = document.getElementsByName("reiryoku_remain_str");
    this.timeElements       = document.getElementsByName("reiryoku_time");
    this.slashElement       = document.getElementsByName("reiryoku_slash");
    this.resetButtonElement = document.getElementsByName("reiryoku_button");
    this.tdElement          = document.getElementsByName("reiryoku_td");
    
    // notification
    this.notificationId     = _category;
    


    /* =================================================================== */
    //      method 
    /* =================================================================== */

    CReiryokuTimer.prototype.getClickIncValue = function(){
        var value = 10;
        if(localStorage.getItem("opt_timerAd_re_clickIncValue")){
            value = localStorage.getItem("opt_timerAd_re_clickIncValue");
        }
        return Number(value);
    }

    CReiryokuTimer.prototype.loadRefillInterval = function(){
        if(localStorage.getItem("opt_timerAd_re_rcvTime_m")){
            this.refillInterval[0] = Number( localStorage.getItem("opt_timerAd_re_rcvTime_m") );
        }
        if(localStorage.getItem("opt_timerAd_re_rcvTime_s")){
            this.refillInterval[1] = Number( localStorage.getItem("opt_timerAd_re_rcvTime_s") );
        }
    }

    CReiryokuTimer.prototype.resetRefillTime = function(){
        this.loadRefillInterval();
        this.time[0] = this.refillInterval[0];
        this.time[1] = this.refillInterval[1];
    }

    /* ---------------------------------------------------- */
    //      描画
    /* ---------------------------------------------------- */
    CReiryokuTimer.prototype.drawReiryoku = function(){
        for (var i = 0; i < this.reiryoku.length; ++i) {
            this.reiryokuElemants[i].innerText = this.reiryoku[i];
        }
    }
    
    
    CReiryokuTimer.prototype.drawTimeText = function(){
        if(this.timeDisplayType == 1){
            // 回復までを表示
            this.reiryokuRemainStr[0].innerText = "回復まで ";
            for(var i=0;i<2;i++){
                if(this.state == "stop"){
                    this.timeElements[i].innerText = "--";   
                }
                else{
                    this.timeElements[i].innerText = this.time[i]<10 ? "0"+this.time[i] : this.time[i];
                }
            }
        }
        else{
            // 全快までを表示
            this.reiryokuRemainStr[0].innerText = "全快まで "; 
            for(var i=0;i<2;i++){
                if(this.state == "stop"){
                    this.timeElements[i].innerText = "--";   
                }
                else{
                    var reiryokuToFull = this.reiryoku[1] - this.reiryoku[0] - 1;
                    var totalSec = reiryokuToFull * this.refillInterval[0] * 60 + reiryokuToFull * this.refillInterval[1];
                    totalSec += this.time[0] * 60 + this.time[1];
                    var hour = Math.floor( totalSec / 3600 );
                    var min  = Math.floor( (totalSec % 3600) / 60);
                    if(totalSec <= 0){
                        this.timeElements[0].innerText = "00";
                        this.timeElements[1].innerText = "00";
                    }
                    else{
                        this.timeElements[0].innerText = hour<10 ? "0"+hour : hour;
                        this.timeElements[1].innerText = min<10 ? "0"+min : min;
                    }
                }
            }
        }
    }
    
    /* ---------------------------------------------------- */
    //      カウントダウン処理
    /* ---------------------------------------------------- */
    CReiryokuTimer.prototype.ready = function(){
        this.state = "ready";
        this.updateTextColor();
        this.readyCnt = 0;
        this.drawReiryoku();
        this.drawTimeText();
        if(!hSetInterval){
            hSetInterval = setInterval(countDownAll, 1000);
        }
    }
    
    CReiryokuTimer.prototype.countDown = function(currentTime){
        switch(this.state){
        case "stop":
            break;
        case "ready":
            this.readyCnt += 1;
            if(this.readyCnt >= 3){
                if(this.reiryoku[0] >= this.reiryoku[1]){ 
                    this.stop(); 
                    break;
                }
                
                // prepare
                saveTimerPos();
                this.state = "run";
                this.updateTextColor();
                this.readyCnt = 0;
                this.td_clickCnt = 0;
                localStorage.setItem("timer_re_prevReiryokuBeforeCount", this.reiryoku[0]);
                localStorage.setItem("timer_re_maxReiryoku", this.reiryoku[1]);
                this.loadRefillInterval();

                // set endTime
                var refillInterval_sec = this.refillInterval[0] * 60 + this.refillInterval[1];
                var timeRequired = (this.reiryoku[1] - this.reiryoku[0] -1) * refillInterval_sec
                                 + this.time[0] * 60 + this.time[1];  
                var dt = new Date();
                dt.setSeconds(dt.getSeconds() + timeRequired);
                this.endtime = dt.getTime();
                this.drawReiryoku();
            }
            break;
        case "run":
            var timeLeft = Math.round( (this.endtime - currentTime) / 1000 ) // millisecond to second
            if(timeLeft <= 0){
                this.time = [0, 0];
                this.reiryoku[0] = this.reiryoku[1];
                this.state = "end"; 
                this.updateTextColor();
            }
            else{
                var refillInterval_sec = this.refillInterval[0] * 60 + this.refillInterval[1];
                var reiryokuLeft = Math.ceil( timeLeft / refillInterval_sec );
                this.reiryoku[0] = this.reiryoku[1] - reiryokuLeft;
                this.time[0] = Math.floor( (timeLeft % refillInterval_sec) / 60 );
                this.time[1] = timeLeft % refillInterval_sec % 60;
            }

            //draw
            this.drawTimeText();
            this.drawReiryoku();
            break;
        case "end":
            this.state = "stop";
            // this.stop();
            //通知      
            this.notice();
            tryToClearInterval();
            break;
        default:
            break;
        }
    }
    
    CReiryokuTimer.prototype.stop = function(){
        for(var i=0;i<2;i++){
            this.time[i]=0;
        }
        this.state = "stop";
        this.updateTextColor();
        this.drawTimeText();
        this.drawReiryoku();
        this.td_clickCnt = 0;
        tryToClearInterval();
    }


    /* ---------------------------------------------------- */
    //      各種更新
    /* ---------------------------------------------------- */
    CReiryokuTimer.prototype.updateTextColor = function(){
        switch(this.state){
        case "ready":
            this.tdElement[0].style.color = fontColor_ready;
            this.tdElement[1].style.color = fontColor_ready;
            this.reiryokuRemainStr[0].style.color = fontColor_ready; 
            break;
        case "run":
            this.tdElement[0].style.color = fontColor_run;
            this.tdElement[1].style.color = fontColor_run;
            this.reiryokuRemainStr[0].style.color = fontColor_run; 
            break;
        case "stop":
            this.tdElement[0].style.color = fontColor_stop;
            this.tdElement[1].style.color = fontColor_stop;
            this.reiryokuRemainStr[0].style.color = fontColor_stop; 
            break;
        case "end":
            this.tdElement[0].style.color = fontColor_end;
            this.tdElement[1].style.color = fontColor_end;
            this.reiryokuRemainStr[0].style.color = fontColor_end; 
            break;
        default:
            break;
        }
    }
    

    /* ---------------------------------------------------- */
    //      通知
    /* ---------------------------------------------------- */
    CReiryokuTimer.prototype.notice = function(){
        var opt = {
            type: 'basic',
            priority: 0
        };
        var mes = "";
        var soundEnable = false;
        var soundUrl = "";
        //通知の有無、message, sound
        if(localStorage.getItem("opt_timer_alertSettingReiryoku")? JSON.parse(localStorage.getItem("opt_timer_alertSettingReiryoku")):true)
        {
            opt.message = localStorage.getItem("opt_timer_message_r")?localStorage.getItem("opt_timer_message_r"):"霊力が回復しました！";
            soundEnable = localStorage.getItem("opt_timer_soundEnable_r")? JSON.parse(localStorage.getItem("opt_timer_soundEnable_r")):true;
            soundUrl = localStorage.getItem("opt_timer_soundFile_r")?JSON.parse(localStorage.getItem("opt_timer_soundFile_r") ).url:"taiko02.mp3";
        }
        else{return;}

        //icon
        if(localStorage.getItem("opt_timer_imageFile_all")){
            opt.iconUrl = JSON.parse(localStorage.getItem("opt_timer_imageFile_all")).url;
        }else{
            opt.iconUrl = "../images/ShiroproLauncher_48.png";
        }
        //title
        opt.title = localStorage.getItem("opt_timer_notificationTitle")?localStorage.getItem("opt_timer_notificationTitle"):"御城プロジェクト 通知";
    
        //notification
        chrome.notifications.clear(this.notificationId, function(id){});
        chrome.notifications.create(this.notificationId, opt, function(id) {});
            
        //sound
        if(soundEnable){
            var notificationSound = new Audio(soundUrl);
            //volume
            var vol = localStorage.getItem("opt_timer_soundVolume") ? 
            Number(localStorage.getItem("opt_timer_soundVolume")) : 5;
            //play
            notificationSound.volume = vol / 10;
            notificationSound.play();
        }
    }
    
    
    /* ---------------------------------------------------- */
    //      マウスホイールイベント
    /* ---------------------------------------------------- */
    CReiryokuTimer.prototype.mouseWheelEventListenerRegist_time = function(i){
        var timer = this;
        return function(e){
            if(timer.timeDisplayType == 2){ return; }
            if(timer.state != "ready"){ return; }

            // 霊力１の回復時間の取得
            timer.loadRefillInterval();

            if(e.wheelDelta > 0){
                if(timer.time[0] == timer.refillInterval[0] && timer.time[1] == timer.refillInterval[1]){
                    // ピッタリ5:00でホイールアップした時は、０に
                    timer.time[0] = timer.time[1] = 0;
                    timer.time[1] = 0;
                }
                else {timer.time[i] +=1;}
            }
            if(e.wheelDelta < 0){timer.time[i] -=1;};

            if(i==0){
                // 分表示部分
                if(timer.time[i] > timer.refillInterval[0]){
                    timer.time[0] = timer.refillInterval[0];
                    timer.time[1] = timer.refillInterval[1];
                }
                else if(timer.time[i] == timer.refillInterval[0]){
                    if(timer.time[1] >= timer.refillInterval[1]){
                        timer.time[0] = timer.refillInterval[0];
                        timer.time[1] = timer.refillInterval[1];
                    }
                }
                else if(timer.time[i] < 0){ 
                    timer.time[0] = timer.refillInterval[0]; 
                    timer.time[1] = timer.refillInterval[1];
                }
            }else{
                // 秒表示部分
                if(timer.time[i] > 59){
                    // timer.time[0] += 1;
                    timer.time[i] = 0;
                }
                else if(timer.time[i] < 0){
                    if(timer.time[0] == timer.refillInterval[0]){timer.time[0] -= 1;}
                    if(timer.time[0] < 0){
                        timer.time[0] = timer.refillInterval[0];   
                        timer.time[1] = timer.refillInterval[1];   
                    }
                    else{timer.time[i] = 59;}
                }
            }
            timer.ready();
        }
    }

    CReiryokuTimer.prototype.mouseWheelEventListenerRegist_reiryoku = function(){
        var timer = this;
        return function(e){
            if(timer.state == "run"){return;}

            // クリックしたX座標を取得して、reiryoku[0], reiryoku[1]の判断
            var clickPos_x = event.offsetX;
            el = timer.slashElement;
            var slashPosxMiddle = Math.floor( el[0].offsetLeft + el[0].offsetWidth/2 ) -1;
            if(clickPos_x < slashPosxMiddle){
                // 霊力現在値をマウスホイール
                if(e.wheelDelta > 0){timer.reiryoku[0] +=1;};
                if(e.wheelDelta < 0){timer.reiryoku[0] -=1;};

                if(timer.reiryoku[0] > timer.reiryoku[1]){ 
                    timer.reiryoku[0] = 0;
                }
                if(timer.reiryoku[0] < 0){ 
                    timer.reiryoku[0] = timer.reiryoku[1];
                }
            }else{
                // 霊力最大値をマウスホイール
                if(e.wheelDelta > 0){timer.reiryoku[1] +=1;};
                if(e.wheelDelta < 0){timer.reiryoku[1] -=1;};

                if(timer.reiryoku[1] > 9999){ 
                    timer.reiryoku[1] = 9999;
                }
                if(timer.reiryoku[1] < timer.reiryoku[0]){ 
                    timer.reiryoku[1] = timer.reiryoku[0];
                }

            }
            // リカバリータイムをリセット
            timer.resetRefillTime();

            // カウントダウン準備
            if(timer.state == "ready"){
                timer.ready();
            }
            else if(timer.reiryoku[0] < timer.reiryoku[1] && clickPos_x < slashPosxMiddle){
                // stop状態の時
                timer.resetRefillTime();
                timer.ready();
            }
            else{
                // stop状態で、最大値を変更してる時
                timer.stop();
            }

        }
    }
    
    /* ---------------------------------------------------- */
    //      リセットボタンクリックイベント
    /* ---------------------------------------------------- */
    CReiryokuTimer.prototype.buttonClickEventRegist = function(){
        var timer = this;
        return function(){
            timer.stop();
        }
    }
    
    /* ---------------------------------------------------- */
    //      タイマークリックイベント
    /* ---------------------------------------------------- */
    CReiryokuTimer.prototype.tdClickEventRegist_time = function(){
        var timer = this;
        return function(){
            switch (timer.state) {
            case "stop":

                break;
            case "ready":
                timer.ready();
                break;
            case "run":

                break;
            case "end":
                
                break;
            }
        }
    }

    CReiryokuTimer.prototype.tdClickEventRegist_remainStr = function(){
        var timer = this;
        return function(){
            if(timer.timeDisplayType == 1){ timer.timeDisplayType = 2; }
            else{ timer.timeDisplayType = 1; }
            timer.drawTimeText();
        }
    }

    CReiryokuTimer.prototype.tdClickEventRegist_reiryoku = function(){
        var timer = this;
        return function(){
            switch (timer.state) {
            case "stop":
                if(localStorage.getItem("timer_re_prevReiryokuBeforeCount")){
                    timer.reiryoku[0] = Number( localStorage.getItem("timer_re_prevReiryokuBeforeCount") );
                    if(timer.reiryoku[0] > timer.reiryoku[1]){ 
                        timer.reiryoku[0] = timer.reiryoku[1];
                    }
                }
                timer.resetRefillTime();
                timer.ready();
                break;
            case "ready":
                // クリックしたX座標を取得して、reiryoku[0], reiryoku[1]の判断
                var clickPos_x = event.offsetX;
                el = timer.slashElement;
                var slashPosxMiddle = Math.floor( el[0].offsetLeft + el[0].offsetWidth/2 ) -1;
                if(clickPos_x < slashPosxMiddle){
                    // 霊力現在値をクリック
                    if(timer.reiryoku[0] == timer.reiryoku[1]){
                        timer.reiryoku[0] += timer.getClickIncValue();
                        if(timer.reiryoku[0] > timer.reiryoku[1]){
                            timer.reiryoku[0] = 0;
                        }
                    }
                    else { 
                        timer.reiryoku[0] += timer.getClickIncValue();
                        if(timer.reiryoku[0] > timer.reiryoku[1]){
                            timer.reiryoku[0] = timer.reiryoku[1];
                        }
                    }
                    
                    if(timer.reiryoku[0] < 0){ 
                        timer.reiryoku[0] = timer.reiryoku[1];
                    }
                }else{
                    // 霊力最大値をクリック
                    timer.reiryoku[1] += timer.getClickIncValue();
                    if(timer.reiryoku[1] > 9999){ 
                        timer.reiryoku[1] = 9999;
                    }
                    if(timer.reiryoku[1] < timer.reiryoku[0]){ 
                        timer.reiryoku[1] = timer.reiryoku[0];
                    }

                }
                timer.resetRefillTime();
                timer.ready();
                break;
            case "run":
                timer.ready();
                // timer.state = "ready";
                break;
            case "end":
                
                break;
            }
        }
    }
    /* ---------------------------------------------------- */
    //      イベントリスナーの登録
    /* ---------------------------------------------------- */
    //mouseWheel event(reiryoku)
    this.tdElement[0].addEventListener("wheel", this.mouseWheelEventListenerRegist_reiryoku() );

    //mouseWheel event(time)
    for(var i=0; i<this.timeElements.length ;i++){
        this.timeElements[i].addEventListener("wheel", this.mouseWheelEventListenerRegist_time(i) );
    }
    this.tdElement[1].addEventListener("wheel", () => { } );

    //button click event
    this.resetButtonElement[0].addEventListener("click", this.buttonClickEventRegist());

    //table data click event
    this.tdElement[0].addEventListener("click", this.tdClickEventRegist_reiryoku());
    this.tdElement[1].addEventListener("click", this.tdClickEventRegist_time());
    this.reiryokuRemainStr[0].addEventListener("click", this.tdClickEventRegist_remainStr());
    
};




