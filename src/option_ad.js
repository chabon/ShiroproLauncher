// タイマー詳細設定


// 背景色の指定
for(var i=0, keySuffix = new Array("t", "s", "c", "r", "h", "ctrl"); i < keySuffix.length; i++){
    var eventListenerRegist = function(_keySuffix){
        return function(){
            localStorage.setItem("opt_timerAd_backColor_" + _keySuffix, this.value);
            chrome.runtime.sendMessage({name: "ShiroproLauncher_TimerUpdate", target:"backgroundColor"}, function(response) {});
        }
    }
    document.getElementsByName("timerAd_backColor")[i].onchange = eventListenerRegist(keySuffix[i]);
}
//初期化
document.getElementsByName("timerAd_backColorInit")[0].onclick = function(){
    if(window.confirm("すべての背景色の設定を初期状態に戻します。よろしいですか？")){
        for(var i=0, keySuffix = new Array("t", "s", "c", "r", "h", "ctrl"), colorList = new Array("#383C3C", "#2D3446", "#492741", "#000b00", "#2D3446", "#555555"); i<keySuffix.length; i++){
            document.getElementsByName("timerAd_backColor")[i].value = colorList[i];
            localStorage.removeItem("opt_timerAd_backColor_" + keySuffix[i]);
        }
        chrome.runtime.sendMessage({name: "ShiroproLauncher_TimerUpdate", target:"backgroundColor"}, function(response) {});
    }
}


// 文字色の指定
for(var i=0, keySuffix = new Array("def", "sel", "stop", "end"); i < keySuffix.length; i++){
    var eventListenerRegist = function(_keySuffix){
        return function(){
            localStorage.setItem("opt_timerAd_textColor_" + _keySuffix, this.value);
            chrome.runtime.sendMessage({name: "ShiroproLauncher_TimerUpdate", target:"textColor"}, function(response) {});
        }
    }
    document.getElementsByName("timerAd_textColor")[i].onchange = eventListenerRegist(keySuffix[i]);
}
//初期化
document.getElementsByName("timerAd_textColorInit")[0].onclick = function(){
    if(window.confirm("すべての文字色の設定を初期状態に戻します。よろしいですか？")){
        for(var i=0, keySuffix = new Array("def", "sel", "stop", "end"), colorList = new Array("#ffffff", "#00ffff", "#888888", "#5F7058"); i<keySuffix.length; i++){
            document.getElementsByName("timerAd_textColor")[i].value = colorList[i];
            localStorage.removeItem("opt_timerAd_textColor_" + keySuffix[i]);
        }
        chrome.runtime.sendMessage({name: "ShiroproLauncher_TimerUpdate", target:"textColor"}, function(response) {});
    }
}


//タイマーのラベル名設定
var eventListenerRegist_timerAd_label = function(_keySuffix){
    return function(){
        elements = document.getElementsByName("timerAd_label_" + _keySuffix)
        var val = new Array();
        for(var k=0;k < elements.length; k++){
            val.push(elements[k].value);
        }
        localStorage.setItem("opt_timerAd_label_" + _keySuffix, JSON.stringify(val));
        chrome.runtime.sendMessage({name: "ShiroproLauncher_TimerUpdate", target:"label"}, function(response) {});
    }
}
for(var j=0, keySuffix = new Array("t", "s", "c", "h");j < keySuffix.length;j++){
    for(var i=0;i < document.getElementsByName("timerAd_label_" + keySuffix[j]).length;i++){
        document.getElementsByName("timerAd_label_"+ keySuffix[j])[i].onchange = eventListenerRegist_timerAd_label(keySuffix[j]);
    }
}



//霊力タイマー

//クリック時の増分値
document.getElementsByName("timerAd_re_clickIncValue")[0].onchange = function(){
    localStorage.setItem("opt_timerAd_re_clickIncValue", document.getElementsByName("timerAd_re_clickIncValue")[0].value);
}
//霊力が1回復するまでの時間設定
document.getElementsByName("timerAd_re_rcvTime_m")[0].onchange = function(){
    localStorage.setItem("opt_timerAd_re_rcvTime_m", document.getElementsByName("timerAd_re_rcvTime_m")[0].value);
}
document.getElementsByName("timerAd_re_rcvTime_s")[0].onchange = function(){
    localStorage.setItem("opt_timerAd_re_rcvTime_s", document.getElementsByName("timerAd_re_rcvTime_s")[0].value);
}



//その他

//探索タイマーの時間表示部分をクリックした時は、「20分→3時間→6時間」とセットする
document.getElementsByName("timerAd_autoSet_t")[0].onclick = function(){
    localStorage.setItem("opt_timerAd_autoSet_t", JSON.stringify(document.getElementsByName("timerAd_autoSet_t")[0].checked));
}
//クリックでの増分は「分」単位だけにする
document.getElementsByName("timerAd_increaseMinuteOnly")[0].onclick = function(){
    localStorage.setItem("opt_timerAd_increaseMinuteOnly", JSON.stringify(document.getElementsByName("timerAd_increaseMinuteOnly")[0].checked));
}
//ラベル表示欄（「探索２」など）を左クリックで、城プロウインドウにフォーカスする
document.getElementsByName("timerAd_enableFocusOnClick")[0].onclick = function(){
    localStorage.setItem("opt_timerAd_enableFocusOnClick", JSON.stringify(document.getElementsByName("timerAd_enableFocusOnClick")[0].checked));
}
//タイマーのキャプション
document.getElementsByName("timerAd_caption")[0].onchange = function(){
    localStorage.setItem("opt_timerAd_caption", document.getElementsByName("timerAd_caption")[0].value );
    chrome.runtime.sendMessage({name: "ShiroproLauncher_TimerUpdate", target:"caption"}, function(response) {});
}


//-----------------------------
// 設定値のロード
//-----------------------------
document.body.onload = function(){

    // 背景色の指定
    for(var i=0, keySuffix = new Array("t", "s", "c", "h", "ctrl"); i < keySuffix.length; i++){
        if(localStorage.getItem("opt_timerAd_backColor_" + keySuffix[i])){
            document.getElementsByName("timerAd_backColor")[i].value = localStorage.getItem("opt_timerAd_backColor_" + keySuffix[i]);
        }
    }
    
    // 文字色の指定
    for(var i=0, keySuffix = new Array("def", "sel", "stop", "end"); i < keySuffix.length; i++){
        if(localStorage.getItem("opt_timerAd_textColor_" + keySuffix[i])){
            document.getElementsByName("timerAd_textColor")[i].value = localStorage.getItem("opt_timerAd_textColor_" + keySuffix[i]);
        }
    }
    
    //タイマーのラベル名設定
    for(var i=0, keySuffix = new Array("t", "s", "c", "h"); i < keySuffix.length; i++){
        if(localStorage.getItem("opt_timerAd_label_" + keySuffix[i])){
            var loadedVal = JSON.parse( localStorage.getItem("opt_timerAd_label_" + keySuffix[i]) );
            elements = document.getElementsByName("timerAd_label_" + keySuffix[i]);
            for(k=0; k < elements.length; k++){
                elements[k].value = loadedVal[k];
            }
        }
    }
    
    //霊力タイマー
    if(localStorage.getItem("opt_timerAd_re_clickIncValue")){
        document.getElementsByName("timerAd_re_clickIncValue")[0].value = localStorage.getItem("opt_timerAd_re_clickIncValue");
    }
    if(localStorage.getItem("opt_timerAd_re_rcvTime_m")){
        document.getElementsByName("timerAd_re_rcvTime_m")[0].value = localStorage.getItem("opt_timerAd_re_rcvTime_m");
    }
    if(localStorage.getItem("opt_timerAd_re_rcvTime_s")){
        document.getElementsByName("timerAd_re_rcvTime_s")[0].value = localStorage.getItem("opt_timerAd_re_rcvTime_s");
    }
    
    
    //その他

    //探索タイマーの時間表示部分をクリックした時は、「20分→3時間→6時間」とセットする
    if(localStorage.getItem("opt_timerAd_autoSet_t") ){
        document.getElementsByName("timerAd_autoSet_t")[0].checked = JSON.parse( localStorage.getItem("opt_timerAd_autoSet_t") );
    }
    //クリックでの増分は「分」単位だけにする
    if(localStorage.getItem("opt_timerAd_increaseMinuteOnly") ){
        document.getElementsByName("timerAd_increaseMinuteOnly")[0].checked = JSON.parse( localStorage.getItem("opt_timerAd_increaseMinuteOnly") );
    }
    //ラベル表示欄（「探索２」など）を左クリックで、城プロウインドウにフォーカスする
    if(localStorage.getItem("opt_timerAd_enableFocusOnClick") ){
        document.getElementsByName("timerAd_enableFocusOnClick")[0].checked = JSON.parse( localStorage.getItem("opt_timerAd_enableFocusOnClick") );
    }
    //タイマーのキャプション
    if(localStorage.getItem("opt_timerAd_caption") ){
        document.getElementsByName("timerAd_caption")[0].value = localStorage.getItem("opt_timerAd_caption");
    }
    
}


