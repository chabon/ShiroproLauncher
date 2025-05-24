
// ×ボタン
document.getElementsByName("close")[0].onclick = function(){
    window.close();
    
    // ×ボタンを押したことによりChromeがアクティブとなり、城プロが隠れてしまうことを防止
    chrome.runtime.sendMessage({ command:"focus" });
}


// スクショ撮る
document.getElementsByName("screenShot")[0].onclick = function(){
    chrome.runtime.sendMessage({ command:"screenShot" });
}


// 手動タイマー
document.getElementsByName("timer")[0].onclick = function(){
    chrome.runtime.sendMessage({ command:"timer" });
}


// 城プロにフォーカス
document.getElementsByName("focus")[0].onclick = function(){
    chrome.runtime.sendMessage({ command:"focus" });
}


// 設定
document.getElementsByName("setting")[0].onclick = function(){
    const optionsUrl = chrome.runtime.getURL("option.html"); 
    chrome.tabs.create({url:optionsUrl });
}


// ウインドウサイズ
// 標準
document.getElementsByName("size_normal")[0].onclick = function(){
    chrome.runtime.sendMessage({
        command:"resizeByScaleFactor",
        scaleFactor:"1"
    });
}
// 大きく
document.getElementsByName("size_up")[0].onclick = function(){
    chrome.runtime.sendMessage({
        command:"minorResize",
        updown:"up"
    });
}
// 小さく
document.getElementsByName("size_down")[0].onclick = function(){
    chrome.runtime.sendMessage({
        command:"minorResize",
        updown:"down"
    });
}
// 半分
document.getElementsByName("size_half")[0].onclick = function(){
    chrome.runtime.sendMessage({
        command:"resizeByScaleFactor",
        scaleFactor:"0.5"   
    });
}
// 75%
document.getElementsByName("size_75")[0].onclick = function(){
    chrome.runtime.sendMessage({
        command:"resizeByScaleFactor",
        scaleFactor:"0.75"  
    });
}
// 150%
document.getElementsByName("size_150")[0].onclick = function(){
    chrome.runtime.sendMessage({
        command:"resizeByScaleFactor",
        scaleFactor:"1.5"   
    });
}
// 全画面
document.getElementsByName("size_full")[0].onclick = function(){
    chrome.runtime.sendMessage({ command:"fullScreen" });
}


// 音量
// ミュート
document.getElementsByName("sound_mute")[0].onclick = function(){
    chrome.runtime.sendMessage({ command:"sound_mute" });
}
