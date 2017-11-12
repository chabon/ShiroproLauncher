
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
    
    Ctimer.prototype.countDown = function(){
        switch(this.state){
        case "stop":
            break;
        case "ready":
            this.readyCnt += 1;
            if(this.readyCnt >= 3){
                saveTimerPos();
                this.tdElement[0].style.color = fontColor_run;
                this.state = "run";
                this.readyCnt = 0;
                this.td_clickCnt = 0;
            }
            break;
        case "run":
            this.time[2] -= 1;
            if(this.time[2]<0){
                if(this.time[1] <= 0 && this.time[0] <= 0){ //end
                    this.time[2] = 0;
                    this.tdElement[0].style.color = fontColor_end;
                    this.state = "end";
                }
                else{
                    this.time[2] = 59;
                    this.time[1] -= 1;
                    if(this.time[1]<0){
                        this.time[1] = 59;
                        this.time[0] -= 1;
                    }
                }
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
    
    Ctimer.prototype.notice = function(){
        var opt = {
            type: 'basic',
            priority: 0
        };
        var mes = "";
        var soundEnable = false;
        var soundUrl = "";
        //通知の有無、message, sound
        switch(this.category){
        case "tansaku":
            if(localStorage.getItem("opt_timer_alertSettingTansaku")? 
            JSON.parse(localStorage.getItem("opt_timer_alertSettingTansaku")):true){
                opt.message = localStorage.getItem("opt_timer_message_t")?localStorage.getItem("opt_timer_message_t"):"探索が完了しました！ (第$number$部隊)";
                soundEnable = localStorage.getItem("opt_timer_soundEnable_t")? JSON.parse(localStorage.getItem("opt_timer_soundEnable_t")):true;
                soundUrl = localStorage.getItem("opt_timer_soundFile_t")?JSON.parse(localStorage.getItem("opt_timer_soundFile_t") ).url:"taiko02.mp3";
            }
            else{return;}
            break;
        case "syuuzen":
            if(localStorage.getItem("opt_timer_alertSettingSyuuzen")? 
            JSON.parse(localStorage.getItem("opt_timer_alertSettingSyuuzen")):true){
                opt.message = localStorage.getItem("opt_timer_message_s")?localStorage.getItem("opt_timer_message_s"):"修繕が完了しました！ (修繕場$number$)";
                soundEnable = localStorage.getItem("opt_timer_soundEnable_s")? JSON.parse(localStorage.getItem("opt_timer_soundEnable_s")):true;
                soundUrl = localStorage.getItem("opt_timer_soundFile_s")?JSON.parse(localStorage.getItem("opt_timer_soundFile_s") ).url:"taiko02.mp3";
            }
            else{return;}
            break;
        case "chikujo":
            if(localStorage.getItem("opt_timer_alertSettingChikujo")? 
            JSON.parse(localStorage.getItem("opt_timer_alertSettingChikujo")):true){
                opt.message = localStorage.getItem("opt_timer_message_c")?localStorage.getItem("opt_timer_message_c"):"築城が完了しました！ (縄張場$number$)";
                soundEnable = localStorage.getItem("opt_timer_soundEnable_c")? JSON.parse(localStorage.getItem("opt_timer_soundEnable_c")):true;
                soundUrl = localStorage.getItem("opt_timer_soundFile_c")?JSON.parse(localStorage.getItem("opt_timer_soundFile_c") ).url:"taiko02.mp3";
            }
            else{return;}
            break;
        case "hanyou":
            if(localStorage.getItem("opt_timer_alertSettingHanyou")? 
            JSON.parse(localStorage.getItem("opt_timer_alertSettingHanyou")):true){
                opt.message = localStorage.getItem("opt_timer_message_h")?localStorage.getItem("opt_timer_message_h"):"カウントダウン終了 (汎用タイマー$number$)";
                soundEnable = localStorage.getItem("opt_timer_soundEnable_h")? JSON.parse(localStorage.getItem("opt_timer_soundEnable_h")):true;
                soundUrl = localStorage.getItem("opt_timer_soundFile_h")?JSON.parse(localStorage.getItem("opt_timer_soundFile_h") ).url:"taiko02.mp3";
            }
            else{return;}
            break;
        default:
            mes = "";
            return;
            break;
        }
        if(this.category == "tansaku"){
            opt.message = opt.message.replace("\$number\$", this.num + 1);
        }else{
            opt.message = opt.message.replace("\$number\$", this.num);
        }
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
        return function(){
            timer.stop();
        }
    }
    
    Ctimer.prototype.tdClickEventRegist = function(){
        var timer = this;
        return function(){
            if(timer.state == "run"){
                timer.tdElement[0].style.color = fontColor_ready;
                timer.state = "ready";
                return;
            }
            switch(timer.category){
            case "tansaku":
                if(localStorage.getItem("opt_timerAd_autoSet_t")?
                JSON.parse( localStorage.getItem("opt_timerAd_autoSet_t") ): true){
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
                if(localStorage.getItem("opt_timerAd_increaseMinuteOnly")?
                JSON.parse( localStorage.getItem("opt_timerAd_increaseMinuteOnly") ):false){
                    timer.time[1] += 10;
                    if(timer.time[1]>59){timer.time[1] = 0;}
                }
                else{
                    var clickPos_x = event.offsetX;
                    el = timer.colonElements;
                    var leftColonMiddle = Math.floor( el[0].offsetLeft + el[0].offsetWidth/2 ) -1;
                    var rightColonMiddle = Math.floor( el[1].offsetLeft + el[1].offsetWidth/2 ) -1;
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
        this.timeElements[i].addEventListener("mousewheel", this.mouseWheelEventListenerRegist(i) );
    }
    //button click event
    this.resetButtonElement[0].addEventListener("click", this.buttonClickEventRegist());
    //table data click event
    this.tdElement[0].addEventListener("click", this.tdClickEventRegist());
    
};




/* =================================================================== */
//       
/* =================================================================== */


//! 設定されているタイマーの数を取得

// 霊力
var numofReiryokuTimer = localStorage.getItem("opt_timer_numofReiryoku") ? Number(localStorage.getItem("opt_timer_numofReiryoku")) : 1;

// 他
var numofTansakuTimer = localStorage.getItem("opt_timer_numofTansaku") ? Number(localStorage.getItem("opt_timer_numofTansaku")) : 2;
var numofSyuuzenTimer = localStorage.getItem("opt_timer_numofSyuuzen") ? Number(localStorage.getItem("opt_timer_numofSyuuzen")) : 2;
var numofChikujoTimer = localStorage.getItem("opt_timer_numofChikujo") ? Number(localStorage.getItem("opt_timer_numofChikujo")) : 2;
var numofHanyouTimer = localStorage.getItem("opt_timer_numofHanyou") ? Number(localStorage.getItem("opt_timer_numofHanyou")) : 0;
if((0 <= numofTansakuTimer && numofTansakuTimer <=3) == false){numofTansakuTimer = 2;}
if((0 <= numofSyuuzenTimer && numofSyuuzenTimer <=4) == false){numofSyuuzenTimer = 2;}
if((0 <= numofChikujoTimer && numofChikujoTimer <=4) == false){numofChikujoTimer = 2;}
if((0 <= numofHanyouTimer && numofHanyouTimer <=4) == false){numofChikujoTimer = 0;}


//! 探索タイマー作成
var tansakuTimer = new Array();
for(var i=0;i<numofTansakuTimer;i++){
    var num = i+1;
    tansakuTimer[i] = new Ctimer("tansaku", num);
}

//! 修繕タイマー作成
var syuuzenTimer = new Array();
for(var i=0;i<numofSyuuzenTimer;i++){
    var num = i+1;
    syuuzenTimer[i] = new Ctimer("syuuzen", num);
}

//! 築城タイマー作成
var chikujoTimer = new Array();
for(var i=0;i<numofChikujoTimer;i++){
    var num = i+1;
    chikujoTimer[i] = new Ctimer("chikujo", num);
}

//! 汎用タイマー作成
var hanyouTimer = new Array();
for(var i=0;i<numofHanyouTimer;i++){
    var num = i+1;
    hanyouTimer[i] = new Ctimer("hanyou", num);
}

//! 霊力タイマー作成
if(numofReiryokuTimer > 0){
    var reiryokuTimer = new Array();
    reiryokuTimer[0] = new CReiryokuTimer("reiryoku", 1);
    if(localStorage.getItem("timer_re_maxReiryoku")){
        reiryokuTimer[0].reiryoku[1] = Number( localStorage.getItem("timer_re_maxReiryoku") );   
        reiryokuTimer[0].reiryoku[0] = reiryokuTimer[0].reiryoku[1];
    }
    reiryokuTimer[0].drawReiryoku();
}



//! function about set interval
var hSetInterval = 0;

var countDownAll = function(){
    for(var i=0;i<numofTansakuTimer;i++){
        tansakuTimer[i].countDown();
    }
    for(var i=0;i<numofSyuuzenTimer;i++){
        syuuzenTimer[i].countDown();
    }
    for(var i=0;i<numofChikujoTimer;i++){
        chikujoTimer[i].countDown();
    }
    for(var i=0;i<numofHanyouTimer;i++){
        hanyouTimer[i].countDown();
    }
    for(var i=0;i<numofReiryokuTimer;i++){
        reiryokuTimer[i].countDown();
    }
}

var tryToClearInterval = function(){
    for(var i=0;i<numofTansakuTimer;i++){
        if(tansakuTimer[i].state != "stop"){return;}
    }
    for(var i=0;i<numofSyuuzenTimer;i++){
        if(syuuzenTimer[i].state != "stop"){return;}
    }
    for(var i=0;i<numofChikujoTimer;i++){
        if(chikujoTimer[i].state != "stop"){return;}
    }
    for(var i=0;i<numofHanyouTimer;i++){
        if(hanyouTimer[i].state != "stop"){return;}
    }
    for(var i=0;i<numofReiryokuTimer;i++){
        if(reiryokuTimer[i].state != "stop"){return;}
    }
    //alert("clearInterval");
    clearInterval(hSetInterval);
    hSetInterval = 0;
}


//! 位置とサイズを保存
var saveTimerPos = function(){
    chrome.runtime.sendMessage({
    name: "ShiroproLauncher_Command",
    command:"saveTimerPos"
    }, function(response) {});
}

//! 背景色の更新
var updateBackgroundColor = function(){
    //timer
    for(var j=0, className = new Array("tansaku", "syuuzen", "chikujo", "reiryoku", "hanyou"), 
    keySuffix = new Array("t","s","c","r","h"),
    defColorList = new Array("#383C3C", "#2D3446", "#492741", "#2D3446", "#000b00"); j < keySuffix.length; j++){
        var color = localStorage.getItem("opt_timerAd_backColor_" + keySuffix[j]);
        if(!color){
            color = defColorList[j];
        }
        var elements1 = document.getElementsByClassName(className[j]);
        for(i=0;i < elements1.length; i++){
            elements1[i].style.backgroundColor = color;
        }
        var elements2 = document.getElementsByClassName(className[j] + "_time");
        for(i=0;i < elements2.length; i++){
            elements2[i].style.backgroundColor = color;
        }
    }
    //control
    var ctrlBackColor = localStorage.getItem("opt_timerAd_backColor_ctrl");
    if(!ctrlBackColor){ctrlBackColor = "#555555";}
    var elements3 = document.getElementsByClassName("TrControl");
    for(i=0;i < elements3.length; i++){
        elements3[i].style.backgroundColor = ctrlBackColor;
    }
}


//! 文字色の更新
var updateTextColor = function(){
    //基本色
    var defaultColor;
    if(localStorage.getItem("opt_timerAd_textColor_def")){
        defaultColor = localStorage.getItem("opt_timerAd_textColor_def");
    }else{ defaultColor = "#ffffff"; }
    document.body.style.color = defaultColor;
    fontColor_run = defaultColor;
    //
    if(localStorage.getItem("opt_timerAd_textColor_sel")){
        fontColor_ready = localStorage.getItem("opt_timerAd_textColor_sel");
    }else{ fontColor_ready = "#00ffff";}
    if(localStorage.getItem("opt_timerAd_textColor_stop")){
        fontColor_stop = localStorage.getItem("opt_timerAd_textColor_stop");
    }else{ fontColor_stop = "#888888";}
    if(localStorage.getItem("opt_timerAd_textColor_end")){
        fontColor_end = localStorage.getItem("opt_timerAd_textColor_end");
    }else{ fontColor_end = "#5F7058";}
    //update
    for(var i=0;i<numofTansakuTimer;i++){
        tansakuTimer[i].updateTextColor();
    }
    for(var i=0;i<numofSyuuzenTimer;i++){
        syuuzenTimer[i].updateTextColor();
    }
    for(var i=0;i<numofChikujoTimer;i++){
        chikujoTimer[i].updateTextColor();
    }
    for(var i=0;i<numofHanyouTimer;i++){
        hanyouTimer[i].updateTextColor();
    }
    for(var i=0;i<numofReiryokuTimer;i++){
        reiryokuTimer[i].updateTextColor();
    }
}


//! ラベルの更新
var updateLabal = function(){
    for(j=0, suffix = new Array("t","s","c","h"); j < suffix.length; j++){
        elements = document.getElementsByName("label_" + suffix[j]);
        if(localStorage.getItem("opt_timerAd_label_" + suffix[j])){
            labelNames = JSON.parse(localStorage.getItem("opt_timerAd_label_" + suffix[j]) );
            for(var i=0; i < elements.length; i++){
                    elements[i].innerText = labelNames[i];
            }
        }
    }
}


//! キャプションの更新
var updateCaption = function(){
    if(localStorage.getItem("opt_timerAd_caption") ){
        document.title = localStorage.getItem("opt_timerAd_caption");
    }
}



//! オプションページとの通信
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name === "ShiroproLauncher_TimerUpdate") {
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





//! ページ読み込み時
document.body.onload = function(){
    updateBackgroundColor();
    updateTextColor();
    updateLabal();
    updateCaption();
    
    //! 行の削除
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
        document.getElementsByClassName("label")[j].onclick = function(){
            if(localStorage.getItem("opt_timerAd_enableFocusOnClick")?
            JSON.parse( localStorage.getItem("opt_timerAd_enableFocusOnClick") ): false){
                chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"focus"}, function(response) {});
            }
        }
    }

}


//! コントロール部
document.getElementsByName("ctrl_opt")[0].onclick = function(){
    var optionsUrl = chrome.extension.getURL("option.html"); 
    chrome.tabs.create({url:optionsUrl },function(tab){
        chrome.windows.update(tab.windowId,{focused:true}, function(){});
    });
}
document.getElementsByName("ctrl_ss")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"focus"}, function(response) {});
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"screenShot"}, function(response) {});
}
document.getElementsByName("ctrl_focus")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"focusOrOpen"}, function(response) {});
}
//
document.getElementsByName("ctrl_def")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"resize",scaleFactor:"1"}, function(response) {});
}
document.getElementsByName("ctrl_sizeup")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"minorResize",updown:"up"}, function(response) {});
}
document.getElementsByName("ctrl_sizedown")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"minorResize", updown:"down"}, function(response) {});
}
//
document.getElementsByName("ctrl_size50")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"resize", scaleFactor:"0.5"}, function(response) {});
}
document.getElementsByName("ctrl_size75")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"resize", scaleFactor:"0.75"}, function(response) {});
}
document.getElementsByName("ctrl_mute")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"sound_mute"}, function(response) {});
}
document.getElementsByName("ctrl_fullsc")[0].onclick = function(){
    chrome.runtime.sendMessage({name: "ShiroproLauncher_Command",command:"fullScreen"}, function(response) {});
}







