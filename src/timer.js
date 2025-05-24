import { settings, getSetting, setSetting } from './settings.js';
import { showTimerEndNotification } from './notification.js';

var fontColor_ready = "#00ffff"
var fontColor_run   = "#ffffff"
var fontColor_stop  = "#888888"
var fontColor_end   = "#5F7058"

//var taikoSound = new Audio("taiko02.mp3");

function Ctimer(_category, _num){

    //member
    this.category           = _category;
    this.num                = _num;
    this.state              = "stop";   //"stop" "ready" "run" "end"
    this.readyCnt           = 0;
    this.td_clickCnt        = 0;
    this.time               = new Array(0, 0, 0); //[0]:hour,[1]:minute,[2]:second
    this.endtime            = null
    this.timeElements       = document.getElementsByName(_category + _num + "_time"); //[0]:hour,[1]:minute,[2]:second
    this.colonElements      = document.getElementsByName(_category + _num + "_colon");
    this.resetButtonElement = document.getElementsByName(_category + _num + "_button");
    this.tdElement          = document.getElementsByName(_category + _num + "_td");
    this.notificationId     = _category;
    
    //method
    Ctimer.prototype.drawTimeText = function(){
        for(var i=0;i<3;i++){
            this.timeElements[i].innerText = this.time[i]<10 ? "0"+this.time[i] : this.time[i];
        }
    }
    
    Ctimer.prototype.ready = function(){
        this.state = "ready";
        this.tdElement[0].style.color = fontColor_ready;
        this.readyCnt = 0;
        if(!hSetInterval){
            hSetInterval = setInterval(countDownAll, 1000);
        }
    }
    
    Ctimer.prototype.countDown = function(currentTime){
        switch(this.state){
        case "stop":
            break;
        case "ready":
            this.readyCnt += 1;
            if(this.readyCnt >= 3){
                const key = "timer_prevTime_" + this.category.charAt(0) + "_" + this.num; 
                const value = [this.time[0], this.time[1], this.time[2]];
                setSetting(key, value);
                this.tdElement[0].style.color = fontColor_run;
                this.state = "run";
                this.readyCnt = 0;
                this.td_clickCnt = 0;
                var dt = new Date();
                dt.setHours(dt.getHours() + this.time[0]);
                dt.setMinutes(dt.getMinutes() + this.time[1]);
                dt.setSeconds(dt.getSeconds() + this.time[2]);
                this.endtime = dt.getTime();
            }
            break;
        case "run":
            var timeLeft = Math.round( (this.endtime - currentTime) / 1000 ) // millisecond to second
            if(timeLeft <= 0){
                this.time = [0, 0, 0];
                this.tdElement[0].style.color = fontColor_end;
                this.state = "end";
            }
            else{
                this.time[0] = Math.floor( timeLeft / 3600 );
                this.time[1] = Math.floor( (timeLeft % 3600) / 60 );
                this.time[2] = timeLeft % 60;
            }

            //draw
            this.drawTimeText();
            break;
        case "end":
            this.state = "stop";
            //通知      
            this.notice();
            tryToClearInterval();
            break;
        default:
            break;
        }
    }
    
    Ctimer.prototype.updateTextColor = function(){
        switch(this.state){
        case "ready":
            this.tdElement[0].style.color = fontColor_ready;
            break;
        case "run":
            this.tdElement[0].style.color = fontColor_run;
            break;
        case "stop":
            this.tdElement[0].style.color = fontColor_stop;
            break;
        case "end":
            this.tdElement[0].style.color = fontColor_end;
            break;
        default:
            break;
        }
    }
    
    Ctimer.prototype.notice = async function(){
        const keySuffix = this.category.charAt(0);
        const isEnabled = await getSetting(`opt_timer_enableNotificaton_${keySuffix}`);
        const number = this.category == "tansaku" ? this.num + 1 : this.num;
        if(isEnabled) await showTimerEndNotification(keySuffix, number);
        return;
    }
    
    Ctimer.prototype.stop = function(){
        for(var i=0;i<3;i++){
            this.time[i]=0;
            this.timeElements[i].innerText = "--";  
        }
        this.tdElement[0].style.color = fontColor_stop;
        this.state = "stop";
        this.td_clickCnt = 0;
        tryToClearInterval();
    }
    
    //event handler register
    Ctimer.prototype.mouseWheelEventListenerRegist = function(i){
        var timer = this;
        return function(e){
            if(timer.state == "run"){return;}
            if(e.wheelDelta > 0){timer.time[i] +=1;};
            if(e.wheelDelta < 0){timer.time[i] -=1;};
            if(i==0){
                if(timer.time[i]>99){timer.time[i] = 0;} //「時」は99が最大
                else if(timer.time[i]<0){timer.time[i] = 99;}
            }else{
                if(timer.time[i] > 59){timer.time[i] = 0;} //「分」と「秒」は59が最大
                else if(timer.time[i] < 0){timer.time[i] = 59;}
            }
            
            timer.drawTimeText();
            if(timer.time[0]!=0 || timer.time[1]!=0 || timer.time[2]!=0){
                timer.ready();
            }
            else{
                timer.stop();
            }
        }
    }
    
    Ctimer.prototype.buttonClickEventRegist = function(){
        var timer = this;
        return async function(){
            if (timer.state == "stop"){
                let prev = await getSetting("timer_prevTime_" + timer.category.charAt(0) + "_" + timer.num);
                if(prev != null){
                    timer.time[0] = prev[0];
                    timer.time[1] = prev[1];
                    timer.time[2] = prev[2];
                    timer.drawTimeText();
                    timer.ready();
                }
                else {
                    timer.stop();
                }
                return;
            }
            timer.stop();
        }
    }
    
    Ctimer.prototype.tdClickEventRegist = function(){
        var timer = this;
        return async function(event){
            if(timer.state == "run"){
                timer.tdElement[0].style.color = fontColor_ready;
                timer.state = "ready";
                return;
            }
            switch(timer.category){
            case "tansaku":
                if(await getSetting("opt_timerAd_autoSet_t")){
                    switch(timer.td_clickCnt){
                    case 0:
                        timer.time[0]=0;timer.time[1]=20;timer.time[2]=0;
                        timer.td_clickCnt += 1;
                        break;
                    case 1:
                        timer.time[0]=3;timer.time[1]=0;timer.time[2]=0;
                        timer.td_clickCnt += 1;
                        break;
                    case 2:
                        timer.time[0]=6;timer.time[1]=0;timer.time[2]=0;
                        timer.td_clickCnt += 1;
                        break;
                    case 3:
                    default:
                        timer.time[0]=0;timer.time[1]=0;timer.time[2]=0;
                        timer.td_clickCnt = 0;
                        break;
                    }
                    break;
                }
            case "syuuzen":
            case "chikujo":
            case "hanyou":
                if(await getSetting("opt_timerAd_increaseMinuteOnly")){
                    timer.time[1] += 10;
                    if(timer.time[1]>59){timer.time[1] = 0;}
                }
                else{
                    const clickPos_x = event.offsetX;
                    const el = timer.colonElements;
                    const leftColonMiddle = Math.floor( el[0].offsetLeft + el[0].offsetWidth/2 ) -1;
                    const rightColonMiddle = Math.floor( el[1].offsetLeft + el[1].offsetWidth/2 ) -1;
                    if(clickPos_x < leftColonMiddle){
                        timer.time[0] += 1;
                        if(timer.time[0]>99){timer.time[0] = 0;}                    
                    }else if(clickPos_x < rightColonMiddle){
                        timer.time[1] += 10;
                        if(timer.time[1]>59){timer.time[1] = 0;}
                    }else{
                        timer.time[2] += 10;
                        if(timer.time[2]>59){timer.time[2] = 0;}
                    }
                }
                break;
            default:
                break;
            }
            timer.drawTimeText();
            if(timer.time[0]!=0 || timer.time[1]!=0 || timer.time[2]!=0){
                timer.ready();
            }
            else{
                timer.stop();
            }
        }
    }
    
    //init event listener
    //mouseWheel event
    for(var i=0;i<3;i++){
        this.timeElements[i].addEventListener("wheel", this.mouseWheelEventListenerRegist(i) );
    }
    this.tdElement[0].addEventListener("wheel", () => { } );

    //button click event
    this.resetButtonElement[0].addEventListener("click", this.buttonClickEventRegist());
    //table data click event
    this.tdElement[0].addEventListener("click", this.tdClickEventRegist());
    
};




/* ================================================================================================= */




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

    CReiryokuTimer.prototype.getClickIncValue = async function(){
        const value = await getSetting("opt_timerAd_re_clickIncValue");
        return Number(value);
    }

    CReiryokuTimer.prototype.loadRefillInterval = async function(){
        this.refillInterval[0] = Number( await getSetting("opt_timerAd_re_recoverTime_m") );
        this.refillInterval[1] = Number( await getSetting("opt_timerAd_re_recoverTime_s") );
    }

    CReiryokuTimer.prototype.resetRefillTime = async function(){
        await this.loadRefillInterval();
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
    
    CReiryokuTimer.prototype.countDown = async function(currentTime){
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
                this.state = "run";
                this.updateTextColor();
                this.readyCnt = 0;
                this.td_clickCnt = 0;
                await setSetting("timer_prevTime_r_1", this.reiryoku[0]);
                await setSetting("timer_re_maxReiryoku", this.reiryoku[1]);
                await this.loadRefillInterval();

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
    CReiryokuTimer.prototype.notice = async function(){
        const isEnabled = await getSetting(`opt_timer_enableNotificaton_r`);
        if(isEnabled) await showTimerEndNotification('r', 1);
        return;
    }
    
    
    /* ---------------------------------------------------- */
    //      マウスホイールイベント
    /* ---------------------------------------------------- */
    CReiryokuTimer.prototype.mouseWheelEventListenerRegist_time = function(i){
        var timer = this;
        return async function(e){
            if(timer.timeDisplayType == 2){ return; }
            if(timer.state != "ready"){ return; }

            // 霊力１の回復時間の取得
            await timer.loadRefillInterval();

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
        return async function(e){
            if(timer.state == "run"){return;}

            // クリックしたX座標を取得して、reiryoku[0], reiryoku[1]の判断
            const clickPos_x = e.offsetX;
            const el = timer.slashElement;
            const slashPosxMiddle = Math.floor( el[0].offsetLeft + el[0].offsetWidth/2 ) -1;
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
            await timer.resetRefillTime();

            // カウントダウン準備
            if(timer.state == "ready"){
                timer.ready();
            }
            else if(timer.reiryoku[0] < timer.reiryoku[1] && clickPos_x < slashPosxMiddle){
                // stop状態の時
                await timer.resetRefillTime();
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
        return async function(){
            if(timer.state == "stop"){
                timer.reiryoku[0] = Number( await getSetting("timer_prevTime_r_1") );
                if(timer.reiryoku[0] > timer.reiryoku[1]){ 
                    timer.reiryoku[0] = timer.reiryoku[1];
                }
                await timer.resetRefillTime();
                timer.ready();
            }
            else{
                timer.stop();
            }
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
        return async function(event){
            switch (timer.state) {
            case "stop":
                await timer.resetRefillTime();
                timer.ready();
                break;
            case "ready":
                // クリックしたX座標を取得して、reiryoku[0], reiryoku[1]の判断
                const clickPos_x = event.offsetX;
                const el = timer.slashElement;
                const slashPosxMiddle = Math.floor( el[0].offsetLeft + el[0].offsetWidth/2 ) -1;
                if(clickPos_x < slashPosxMiddle){
                    // 霊力現在値をクリック
                    if(timer.reiryoku[0] == timer.reiryoku[1]){
                        timer.reiryoku[0] += await timer.getClickIncValue();
                        if(timer.reiryoku[0] > timer.reiryoku[1]){
                            timer.reiryoku[0] = 0;
                        }
                    }
                    else { 
                        timer.reiryoku[0] += await timer.getClickIncValue();
                        if(timer.reiryoku[0] > timer.reiryoku[1]){
                            timer.reiryoku[0] = timer.reiryoku[1];
                        }
                    }
                    
                    if(timer.reiryoku[0] < 0){ 
                        timer.reiryoku[0] = timer.reiryoku[1];
                    }
                }else{
                    // 霊力最大値をクリック
                    timer.reiryoku[1] += await timer.getClickIncValue();
                    if(timer.reiryoku[1] > 9999){ 
                        timer.reiryoku[1] = 9999;
                    }
                    if(timer.reiryoku[1] < timer.reiryoku[0]){ 
                        timer.reiryoku[1] = timer.reiryoku[0];
                    }

                }
                await timer.resetRefillTime();
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




/* ================================================================================================= */

// global
var tansakuTimer;
var syuuzenTimer;
var chikujoTimer;
var hanyouTimer;
var reiryokuTimer;

var hSetInterval = 0;

// ページ読み込み時
document.body.onload = async function(){
    // 設定されているタイマーの数を取得
    const numofTansakuTimer  = Number(await getSetting("opt_timer_numofTansaku"));
    const numofSyuuzenTimer  = Number(await getSetting("opt_timer_numofSyuuzen"));
    const numofChikujoTimer  = Number(await getSetting("opt_timer_numofChikujo"));
    const numofHanyouTimer   = Number(await getSetting("opt_timer_numofHanyou"));
    const numofReiryokuTimer = Number(await getSetting("opt_timer_numofReiryoku"));
    if( !(0 <= numofTansakuTimer && numofTansakuTimer <=3) ) numofTansakuTimer = 2;
    if( !(0 <= numofSyuuzenTimer && numofSyuuzenTimer <=4) ) numofSyuuzenTimer = 2;
    if( !(0 <= numofChikujoTimer && numofChikujoTimer <=4) ) numofChikujoTimer = 2;
    if( !(0 <= numofHanyouTimer  && numofHanyouTimer  <=4) ) numofChikujoTimer = 0;

    // 探索タイマー作成
    tansakuTimer = new Array();
    for(var i=0;i<numofTansakuTimer;i++){
        var num = i+1;
        tansakuTimer[i] = new Ctimer("tansaku", num);
    }

    // 修繕タイマー作成
    syuuzenTimer = new Array();
    for(var i=0;i<numofSyuuzenTimer;i++){
        var num = i+1;
        syuuzenTimer[i] = new Ctimer("syuuzen", num);
    }

    // 築城タイマー作成
    chikujoTimer = new Array();
    for(var i=0;i<numofChikujoTimer;i++){
        var num = i+1;
        chikujoTimer[i] = new Ctimer("chikujo", num);
    }

    // 汎用タイマー作成
    hanyouTimer = new Array();
    for(var i=0;i<numofHanyouTimer;i++){
        var num = i+1;
        hanyouTimer[i] = new Ctimer("hanyou", num);
    }

    // 霊力タイマー作成
    reiryokuTimer = new Array();
    if(numofReiryokuTimer > 0){
        reiryokuTimer[0] = new CReiryokuTimer("reiryoku", 1);
        const maxReiryoku = await getSetting("timer_re_maxReiryoku");
        if(maxReiryoku){
            reiryokuTimer[0].reiryoku[1] = Number(maxReiryoku);   
            reiryokuTimer[0].reiryoku[0] = reiryokuTimer[0].reiryoku[1];
        }
        reiryokuTimer[0].drawReiryoku();
    }

    updateBackgroundColor();
    updateTextColor();
    updateLabal();
    updateCaption();
    
    // 行の削除
    var table = document.getElementById("timerTable");

    // 探索
    var numofDel_t = 3 - numofTansakuTimer;
    for(var i=0;i<numofDel_t;i++){
        table.deleteRow(3 - 1 - i);
    }

    // 修繕
    var numofDel_s = 4 - numofSyuuzenTimer;
    for(var i=0;i<numofDel_s;i++){
        table.deleteRow(numofTansakuTimer + 4 - 1 - i);
    }

    // 築城
    var numofDel_c = 4 - numofChikujoTimer;
    for(var i=0;i<numofDel_c;i++){
        table.deleteRow(numofTansakuTimer + numofSyuuzenTimer + 4 - 1 -i);
    }
    
    // 霊力
    if(numofReiryokuTimer < 1){
        table.deleteRow(numofTansakuTimer + numofSyuuzenTimer + numofChikujoTimer + 1 - 1);
        table.deleteRow(numofTansakuTimer + numofSyuuzenTimer + numofChikujoTimer + 2 - 2);
    }
    
    // 汎用
    var numofDel_h = 4 - numofHanyouTimer;
    for(var i=0;i<numofDel_h;i++){
        table.deleteRow(numofTansakuTimer + numofSyuuzenTimer + numofChikujoTimer + (numofReiryokuTimer * 2) + 4  - 1 -i);  
    }
    
    //ラベル欄クリックでのイベント
    for(var j=0; j < document.getElementsByClassName("label").length; j++){
        document.getElementsByClassName("label")[j].onclick = async function(){
            if(await getSetting("opt_timerAd_enableFocusOnClick")){
                await chrome.runtime.sendMessage({command:"focus"});
            }
        }
    }

    // 終了時のイベントで確認ダイアログを表示
    if(await getSetting("opt_timer_showExitConfirmation")){
        window.addEventListener('beforeunload', function(e) {
            e.returnValue = '終了確認';
        }, false);
    }
}


/* ==================================== */
// カウントダウン
var countDownAll = function(){
    var currentTime = Date.now();
    for(var i=0;i<tansakuTimer.length;i++){
        tansakuTimer[i].countDown(currentTime);
    }
    for(var i=0;i<syuuzenTimer.length;i++){
        syuuzenTimer[i].countDown(currentTime);
    }
    for(var i=0;i<chikujoTimer.length;i++){
        chikujoTimer[i].countDown(currentTime);
    }
    for(var i=0;i<hanyouTimer.length;i++){
        hanyouTimer[i].countDown(currentTime);
    }
    for(var i=0;i<reiryokuTimer.length;i++){
        reiryokuTimer[i].countDown(currentTime);
    }
}

var tryToClearInterval = function(){
    for(var i=0;i<tansakuTimer.length;i++){
        if(tansakuTimer[i].state != "stop"){return;}
    }
    for(var i=0;i<syuuzenTimer.length;i++){
        if(syuuzenTimer[i].state != "stop"){return;}
    }
    for(var i=0;i<chikujoTimer.length;i++){
        if(chikujoTimer[i].state != "stop"){return;}
    }
    for(var i=0;i<hanyouTimer.length;i++){
        if(hanyouTimer[i].state != "stop"){return;}
    }
    for(var i=0;i<reiryokuTimer.length;i++){
        if(reiryokuTimer[i].state != "stop"){return;}
    }
    //alert("clearInterval");
    clearInterval(hSetInterval);
    hSetInterval = 0;
}


/* ==================================== */

// 背景色の更新
var updateBackgroundColor = async function(){
    //timer
    for(var j=0, className = new Array("tansaku", "syuuzen", "chikujo", "reiryoku", "hanyou"), 
        keySuffix = new Array("t","s","c","r","h"); j < keySuffix.length; j++)
    {
        const color = await getSetting("opt_timerAd_backColor_" + keySuffix[j]);
        const elements1 = document.getElementsByClassName(className[j]);
        for(let i=0;i < elements1.length; i++){
            elements1[i].style.backgroundColor = color;
        }
        const elements2 = document.getElementsByClassName(className[j] + "_time");
        for(let i=0;i < elements2.length; i++){
            elements2[i].style.backgroundColor = color;
        }
    }
    //control
    const ctrlBackColor = await getSetting("opt_timerAd_backColor_ctrl");
    const elements3 = document.getElementsByClassName("TrControl");
    for(let i=0;i < elements3.length; i++){
        elements3[i].style.backgroundColor = ctrlBackColor;
    }
}


// 文字色の更新
var updateTextColor = async function(){
    // 基本色
    fontColor_run = await getSetting("opt_timerAd_textColor_def");
    document.body.style.color = fontColor_run;
    fontColor_ready = await getSetting("opt_timerAd_textColor_sel");
    fontColor_stop  = await getSetting("opt_timerAd_textColor_stop");
    fontColor_end   = await getSetting("opt_timerAd_textColor_end");

    // update
    for(var i=0;i<tansakuTimer.length;i++){
        tansakuTimer[i].updateTextColor();
    }
    for(var i=0;i<syuuzenTimer.length;i++){
        syuuzenTimer[i].updateTextColor();
    }
    for(var i=0;i<chikujoTimer.length;i++){
        chikujoTimer[i].updateTextColor();
    }
    for(var i=0;i<hanyouTimer.length;i++){
        hanyouTimer[i].updateTextColor();
    }
    for(var i=0;i<reiryokuTimer.length;i++){
        reiryokuTimer[i].updateTextColor();
    }
}


// ラベルの更新
var updateLabal = async function(){
    for(let j=0, suffix = new Array("t","s","c","h"); j < suffix.length; j++){
        const elements = document.getElementsByName("label_" + suffix[j]);
        const labelNames = await getSetting("opt_timerAd_label_" + suffix[j]);
        for(var i=0; i < elements.length; i++){
                elements[i].innerText = labelNames[i];
        }
    }
}


// キャプションの更新
var updateCaption = async function(){
    document.title = await getSetting("opt_timerAd_caption");
}



// オプションページとの通信
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name === "TimerVisualUpdate") {
        switch(request.target){
        case "backgroundColor":
            updateBackgroundColor();
            break;
        case "textColor":
            updateTextColor();
            break;
        case "label":
            updateLabal();
            break;
        case "caption":
            updateCaption();
            break;
        default:
            break;
        }
    }
});



/* ==================================== */
// コントロール部
document.getElementsByName("ctrl_opt")[0].onclick = function(){
    var optionsUrl = chrome.runtime.getURL("option.html"); 
    chrome.tabs.create({url:optionsUrl },function(tab){
        chrome.windows.update(tab.windowId,{focused:true}, function(){});
    });
}
document.getElementsByName("ctrl_ss")[0].onclick = async function(){
    await chrome.runtime.sendMessage({command:"focus"});
    await chrome.runtime.sendMessage({command:"screenShot"});
}
document.getElementsByName("ctrl_focus")[0].onclick = function(){
    chrome.runtime.sendMessage({command:"focusOrCreateWindow"}, function(response) {});
}
//
document.getElementsByName("ctrl_def")[0].onclick = function(){
    chrome.runtime.sendMessage({command:"resizeByScaleFactor",scaleFactor:"1"}, function(response) {});
}
document.getElementsByName("ctrl_sizeup")[0].onclick = function(){
    chrome.runtime.sendMessage({command:"minorResize",updown:"up"}, function(response) {});
}
document.getElementsByName("ctrl_sizedown")[0].onclick = function(){
    chrome.runtime.sendMessage({command:"minorResize", updown:"down"}, function(response) {});
}
//
document.getElementsByName("ctrl_size50")[0].onclick = function(){
    chrome.runtime.sendMessage({command:"resizeByScaleFactor", scaleFactor:"0.5"}, function(response) {});
}
document.getElementsByName("ctrl_size75")[0].onclick = function(){
    chrome.runtime.sendMessage({command:"resizeByScaleFactor", scaleFactor:"0.75"}, function(response) {});
}
document.getElementsByName("ctrl_mute")[0].onclick = function(){
    chrome.runtime.sendMessage({command:"sound_mute"}, function(response) {});
}
document.getElementsByName("ctrl_fullsc")[0].onclick = function(){
    chrome.runtime.sendMessage({command:"fullScreen"}, function(response) {});
}



