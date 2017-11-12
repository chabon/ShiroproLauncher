
var bFocused = false;

//×ボタン
document.getElementsByName("close")[0].onclick = function(){
    window.close();
    
    if(bFocused){
        chrome.runtime.sendMessage({
            name: "ShiroproLauncher_Command",
            command:"focus"
        }, function(response) {});
    }
}

//スクショ撮る
document.getElementsByName("screenShot")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"focus"
    }, function(response) {});
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"screenShot"
    }, function(response) {});
    bFocused = true;
}


//手動タイマー
document.getElementsByName("timer")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"timer"
    }, function(response) {});
}


//城プロにフォーカス
document.getElementsByName("focus")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"focus"
    }, function(response) {});
    bFocused = true;
}


//設定
document.getElementsByName("setting")[0].onclick = function(){
    var optionsUrl = chrome.extension.getURL("option.html"); 
    chrome.tabs.create({url:optionsUrl },function(tab){});
}



//ウインドウサイズ
//標準
document.getElementsByName("size_normal")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"resize",
    scaleFactor:"1"
    }, function(response) {});
    bFocused = true;
}
//大きく
document.getElementsByName("size_up")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"minorResize",
    updown:"up"
    }, function(response) {});
    bFocused = true;
}
//小さく
document.getElementsByName("size_down")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"minorResize",
    updown:"down"
    }, function(response) {});
    bFocused = true;
}
//半分
document.getElementsByName("size_half")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"resize",
    scaleFactor:"0.5"   
    }, function(response) {});
    bFocused = true;
}
//75%
document.getElementsByName("size_75")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"resize",
    scaleFactor:"0.75"  
    }, function(response) {});
    bFocused = true;
}
//150%
document.getElementsByName("size_150")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"resize",
    scaleFactor:"1.5"   
    }, function(response) {});
    bFocused = true;
}
//全画面
document.getElementsByName("size_full")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"fullScreen"
    }, function(response) {});
}


// 音量
// ミュート
document.getElementsByName("sound_mute")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"sound_mute"
    }, function(response) {});
}
