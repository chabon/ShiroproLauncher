
//option


//-----------------------------
// スクリーンショット
//-----------------------------

//撮る前に表示領域のサイズをデフォルトの800x480にリサイズする
var checkBox_ss_resize = document.getElementsByName("ss_resizeBeforeCapture");
checkBox_ss_resize[0].onclick = function(){
    localStorage.setItem("opt_ss_resizeBeforeCapture", JSON.stringify(checkBox_ss_resize[0].checked));
}
//保存形式
var radio_ss_fomat = document.getElementsByName("ss_format");
radio_ss_fomat[0].onclick = function(){
    if(radio_ss_fomat[0].checked){localStorage.setItem("opt_ss_format", "png");}
}
radio_ss_fomat[1].onclick = function(){
    if(radio_ss_fomat[1].checked){localStorage.setItem("opt_ss_format", "jpeg");}
}
//JPEGの品質
var input_ss_jpgQuality = document.getElementsByName("ss_jpgQuality");
input_ss_jpgQuality[0].onchange = function(){
    if(0 < Number(input_ss_jpgQuality[0].value) && Number(input_ss_jpgQuality[0].value) <= 100){
    }else{input_ss_jpgQuality[0].value = "95";}
    localStorage.setItem("opt_ss_jpgQuality", input_ss_jpgQuality[0].value);
}
//保存するフォルダ名
var input_ss_folderName = document.getElementsByName("ss_folderName");
input_ss_folderName[0].onchange = function(){
    if(!input_ss_folderName[0].value){input_ss_folderName[0].value = "御城プロジェクト_SS";}
    localStorage.setItem("opt_ss_folderName", input_ss_folderName[0].value);
}


//-----------------------------
// タイマー
//-----------------------------

//表示するタイマーの数
var select_timer_num_r = document.getElementsByName("timer_numofReiryoku");
select_timer_num_r[0].onchange = function(){
    localStorage.setItem("opt_timer_numofReiryoku", select_timer_num_r[0].selectedIndex);
}
var select_timer_num_t = document.getElementsByName("timer_numofTansaku");
select_timer_num_t[0].onchange = function(){
    localStorage.setItem("opt_timer_numofTansaku", select_timer_num_t[0].selectedIndex);
}
var select_timer_num_s = document.getElementsByName("timer_numofSyuuzen");
    select_timer_num_s[0].onchange = function(){
        localStorage.setItem("opt_timer_numofSyuuzen", select_timer_num_s[0].selectedIndex);
}
var select_timer_num_c = document.getElementsByName("timer_numofChikujo");
    select_timer_num_c[0].onchange = function(){
        localStorage.setItem("opt_timer_numofChikujo", select_timer_num_c[0].selectedIndex);
}
var select_timer_num_h = document.getElementsByName("timer_numofHanyou");
    select_timer_num_h[0].onchange = function(){
        localStorage.setItem("opt_timer_numofHanyou", select_timer_num_h[0].selectedIndex);
}



//終了時、タイマーの位置を記憶する
var checkBox_timer_savePos = document.getElementsByName("timer_savePos");
checkBox_timer_savePos[0].onclick = function(){
    localStorage.setItem("opt_timer_savePos", JSON.stringify(checkBox_timer_savePos[0].checked));
}
//城プロウインドウ作成時にタイマーも同時に起動する
var checkBox_timer_launchSameTime = document.getElementsByName("timer_launchSameTime");
checkBox_timer_launchSameTime[0].onclick = function(){
    localStorage.setItem("opt_timer_launchSameTime", JSON.stringify(checkBox_timer_launchSameTime[0].checked));
}
//詳細設定
document.getElementsByName("timer_advancedSetting")[0].onclick = function(){
    chrome.tabs.create({url:"option_ad.html"}, function(){});
}

//-----------------------------
// 通知設定
//-----------------------------


//通知の有無
var checkBox_timer_alert_t = document.getElementsByName("timer_alertSettingTansaku");
checkBox_timer_alert_t[0].onclick = function(){
    localStorage.setItem("opt_timer_alertSettingTansaku", JSON.stringify(checkBox_timer_alert_t[0].checked));
}
var checkBox_timer_alert_s = document.getElementsByName("timer_alertSettingSyuuzen");
checkBox_timer_alert_s[0].onclick = function(){
    localStorage.setItem("opt_timer_alertSettingSyuuzen", JSON.stringify(checkBox_timer_alert_s[0].checked));
}
var checkBox_timer_alert_c = document.getElementsByName("timer_alertSettingChikujo");
checkBox_timer_alert_c[0].onclick = function(){
    localStorage.setItem("opt_timer_alertSettingChikujo", JSON.stringify(checkBox_timer_alert_c[0].checked));
}
var checkBox_timer_alert_r = document.getElementsByName("timer_alertSettingReiryoku");
checkBox_timer_alert_r[0].onclick = function(){
    localStorage.setItem("opt_timer_alertSettingReiryoku", JSON.stringify(checkBox_timer_alert_r[0].checked));
}
var checkBox_timer_alert_h = document.getElementsByName("timer_alertSettingHanyou");
checkBox_timer_alert_h[0].onclick = function(){
    localStorage.setItem("opt_timer_alertSettingHanyou", JSON.stringify(checkBox_timer_alert_h[0].checked));
}

//音も鳴らす
/*
var checkBox_timer_soundEnable = document.getElementsByName("timer_soundEnable");
checkBox_timer_soundEnable[0].onclick = function(){
    localStorage.setItem("opt_timer_soundEnable", JSON.stringify(checkBox_timer_soundEnable[0].checked));
}
*/
var checkBox_timer_soundEnable_t = document.getElementsByName("timer_soundEnable_t");
checkBox_timer_soundEnable_t[0].onclick = function(){
    localStorage.setItem("opt_timer_soundEnable_t", JSON.stringify(checkBox_timer_soundEnable_t[0].checked));
}
var checkBox_timer_soundEnable_s = document.getElementsByName("timer_soundEnable_s");
checkBox_timer_soundEnable_s[0].onclick = function(){
    localStorage.setItem("opt_timer_soundEnable_s", JSON.stringify(checkBox_timer_soundEnable_s[0].checked));
}
var checkBox_timer_soundEnable_c = document.getElementsByName("timer_soundEnable_c");
checkBox_timer_soundEnable_c[0].onclick = function(){
    localStorage.setItem("opt_timer_soundEnable_c", JSON.stringify(checkBox_timer_soundEnable_c[0].checked));
}
var checkBox_timer_soundEnable_r = document.getElementsByName("timer_soundEnable_r");
checkBox_timer_soundEnable_r[0].onclick = function(){
    localStorage.setItem("opt_timer_soundEnable_r", JSON.stringify(checkBox_timer_soundEnable_r[0].checked));
}
var checkBox_timer_soundEnable_h = document.getElementsByName("timer_soundEnable_h");
checkBox_timer_soundEnable_h[0].onclick = function(){
    localStorage.setItem("opt_timer_soundEnable_h", JSON.stringify(checkBox_timer_soundEnable_h[0].checked));
}
//音量
var select_timer_soundVol = document.getElementsByName("timer_soundVolume");
select_timer_soundVol[0].onchange = function(){
    localStorage.setItem("opt_timer_soundVolume", select_timer_soundVol[0].selectedIndex);
}

//通知メッセージ
var textBox_timer_notificationTitle = document.getElementsByName("timer_notificationTitle");
textBox_timer_notificationTitle[0].onchange = function(){
    localStorage.setItem("opt_timer_notificationTitle", textBox_timer_notificationTitle[0].value);
}
var textBox_timer_message_t = document.getElementsByName("timer_message_t");
textBox_timer_message_t[0].onchange = function(){
    localStorage.setItem("opt_timer_message_t", textBox_timer_message_t[0].value);
}
var textBox_timer_message_s = document.getElementsByName("timer_message_s");
textBox_timer_message_s[0].onchange = function(){
    localStorage.setItem("opt_timer_message_s", textBox_timer_message_s[0].value);
}
var textBox_timer_message_c = document.getElementsByName("timer_message_c");
textBox_timer_message_c[0].onchange = function(){
    localStorage.setItem("opt_timer_message_c", textBox_timer_message_c[0].value);
}
var textBox_timer_message_r = document.getElementsByName("timer_message_r");
textBox_timer_message_r[0].onchange = function(){
    localStorage.setItem("opt_timer_message_r", textBox_timer_message_r[0].value);
}
var textBox_timer_message_h = document.getElementsByName("timer_message_h");
textBox_timer_message_h[0].onchange = function(){
    localStorage.setItem("opt_timer_message_h", textBox_timer_message_h[0].value);
}
//すべて初期化
document.getElementsByName("timer_messageSetting_init")[0].onclick = function(){
    if(window.confirm("すべての通知メッセージ設定を初期状態に戻します。よろしいですか？")){
        textBox_timer_notificationTitle[0].value = "御城プロジェクト 通知"; 
        textBox_timer_message_t[0].value = "探索が完了しました！ (第$number$部隊)";
        textBox_timer_message_s[0].value = "修繕が完了しました！ (修繕場$number$)";
        textBox_timer_message_c[0].value = "築城が完了しました！ (縄張場$number$)";
        textBox_timer_message_r[0].value = "霊力が回復しました！";
        textBox_timer_message_h[0].value = "カウントダウン終了 (汎用タイマー$number$)";
        localStorage.removeItem("opt_timer_notificationTitle");
        localStorage.removeItem("opt_timer_message_t");
        localStorage.removeItem("opt_timer_message_s");
        localStorage.removeItem("opt_timer_message_c");
        localStorage.removeItem("opt_timer_message_r");
        localStorage.removeItem("opt_timer_message_h");     
    }
}
//通知のテスト
var notificationTest = function(keySuffix){
    var opt = {
        type: 'basic',
        priority: 0
    };
    //icon
    if(localStorage.getItem("opt_timer_imageFile_all")){
        opt.iconUrl = JSON.parse(localStorage.getItem("opt_timer_imageFile_all")).url;
    }else{
        opt.iconUrl = "../images/ShiroproLauncher_48.png";
    }
    //title
    opt.title = localStorage.getItem("opt_timer_notificationTitle")?localStorage.getItem("opt_timer_notificationTitle"):"御城プロジェクト 通知";
    //message
    switch(keySuffix){
    case "t":
        opt.message = localStorage.getItem("opt_timer_message_t")?localStorage.getItem("opt_timer_message_t"):"探索が完了しました！ (第$number$部隊)";
        break;
    case "s":
        opt.message = localStorage.getItem("opt_timer_message_s")?localStorage.getItem("opt_timer_message_s"):"修繕が完了しました！ (修繕場$number$)";
        break;
    case "c":
        opt.message = localStorage.getItem("opt_timer_message_c")?localStorage.getItem("opt_timer_message_c"):"築城が完了しました！ (縄張場$number$)";
        break;
    case "r":
        opt.message = localStorage.getItem("opt_timer_message_r")?localStorage.getItem("opt_timer_message_r"):"霊力が回復しました！";
        break;
    case "h":
        opt.message = localStorage.getItem("opt_timer_message_h")?localStorage.getItem("opt_timer_message_h"):"カウントダウン終了 (汎用タイマー$number$)";
        break;
    default:
        opt.message = "error";
        break;
    }
    if(keySuffix == "t"){
        opt.message = opt.message.replace("\$number\$", "2");
    }else{
        opt.message = opt.message.replace("\$number\$", "1");
    }
    //notification
    chrome.notifications.clear("notificationTest", function(){});
    chrome.notifications.create("notificationTest", opt, function(id) {});      
    
    //sound
    if(localStorage.getItem("opt_timer_soundEnable_" + keySuffix)?
    JSON.parse(localStorage.getItem("opt_timer_soundEnable_" + keySuffix) ):true){
        var soundUrl;
        if(localStorage.getItem("opt_timer_soundFile_"+ keySuffix)){
            soundUrl = JSON.parse(localStorage.getItem("opt_timer_soundFile_"+ keySuffix) ).url;
        }else{
            soundUrl = "taiko02.mp3";
        }
        var notificationTestSound = new Audio(soundUrl);
        var vol = localStorage.getItem("opt_timer_soundVolume") ? Number(localStorage.getItem("opt_timer_soundVolume")) : 5;
        notificationTestSound.volume = vol / 10;
        notificationTestSound.play();
    }
}
document.getElementsByName("timer_notificationTest_t")[0].onclick = function(){
    notificationTest("t");
}
document.getElementsByName("timer_notificationTest_s")[0].onclick = function(){
    notificationTest("s");
}
document.getElementsByName("timer_notificationTest_c")[0].onclick = function(){
    notificationTest("c");
}
document.getElementsByName("timer_notificationTest_r")[0].onclick = function(){
    notificationTest("r");
}
document.getElementsByName("timer_notificationTest_h")[0].onclick = function(){
    notificationTest("h");
}


// デスクトップショートカットの追加
document.getElementsByName("desktopLaunchWidgetLink")[0].onclick = function(){
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"setParam_isWidgetOpenFromOptionPage"
    }, function(response) {
        window.open("desktopLaunchWidget.html");
    });
    return false;
}

//-----------------------------
// その他
//-----------------------------

//ゲーム画面の位置調整
var radio_other_autoPos = document.getElementsByName("other_autoPos");
radio_other_autoPos[0].onclick = function(){
    if(radio_other_autoPos[0].checked){
        localStorage.setItem("opt_other_autoPos",  JSON.stringify(true));
        document.getElementsByName("other_enableScaling")[0].disabled = false;
        document.getElementsByName("other_scrollValueX")[0].disabled = true;
        document.getElementsByName("other_scrollValueY")[0].disabled = true;
    }
}
radio_other_autoPos[1].onclick = function(){
    if(radio_other_autoPos[1].checked){
        localStorage.setItem("opt_other_autoPos",  JSON.stringify(false));
        document.getElementsByName("other_enableScaling")[0].disabled = true;
        document.getElementsByName("other_scrollValueX")[0].disabled = false;
        document.getElementsByName("other_scrollValueY")[0].disabled = false;
    }
}
//ウインドウリサイズ時の拡大縮小を有効にする
var checkBox_other_enableScaling = document.getElementsByName("other_enableScaling");
checkBox_other_enableScaling[0].onclick = function(){
    localStorage.setItem("opt_other_enableScaling", JSON.stringify(checkBox_other_enableScaling[0].checked));
}
//右方向
var input_other_scrollValueX = document.getElementsByName("other_scrollValueX");
input_other_scrollValueX[0].onchange = function(){
    if(0 <= Number(input_other_scrollValueX[0].value) && Number(input_other_scrollValueX[0].value) <= 10000){
    }else{input_other_scrollValueX[0].value = "6";}
    localStorage.setItem("opt_other_scrollValueX", input_other_scrollValueX[0].value);
}
//下方向
var input_other_scrollValueY = document.getElementsByName("other_scrollValueY");
input_other_scrollValueY[0].onchange = function(){
    if(0 <= Number(input_other_scrollValueY[0].value) && Number(input_other_scrollValueY[0].value) <= 10000){
    }else{input_other_scrollValueY[0].value = "61";}
    localStorage.setItem("opt_other_scrollValueY", input_other_scrollValueY[0].value);
}
//ウインドウリサイズ時、縦方向へのゲーム画面中央化を行わない
var checkBox_other_gameCenteringDisabled = document.getElementsByName("other_gameCenteringDisabled");
checkBox_other_gameCenteringDisabled[0].onclick = function(){
    localStorage.setItem("opt_other_gameCenteringDisabled", JSON.stringify(checkBox_other_gameCenteringDisabled[0].checked) );
}
//起動時のウインドウサイズを指定する
var checkBox_other_specifyShiroproWindowSize = document.getElementsByName("other_specifyShiroproWindowSize");
checkBox_other_specifyShiroproWindowSize[0].onclick = function(){
        var b = checkBox_other_specifyShiroproWindowSize[0].checked;
        document.getElementsByName("other_ShiroproWindowSize")[0].disabled = !b;
        localStorage.setItem("opt_other_specifyShiroproWindowSize", JSON.stringify(b));
}
//%
var input_other_ShiroproWindowSize = document.getElementsByName("other_ShiroproWindowSize");
input_other_ShiroproWindowSize[0].onchange = function(){
    localStorage.setItem("opt_other_ShiroproWindowSize", input_other_ShiroproWindowSize[0].value);
}
//起動時のウインドウ位置を指定する
var checkBox_other_specifyShiroproWindowPos = document.getElementsByName("other_specifyShiroproWindowPos");
checkBox_other_specifyShiroproWindowPos[0].onclick = function(){
        var b = checkBox_other_specifyShiroproWindowPos[0].checked;
        document.getElementsByName("other_ShiroproWindowPosX")[0].disabled = !b;
        document.getElementsByName("other_ShiroproWindowPosY")[0].disabled = !b;
        localStorage.setItem("opt_other_specifyShiroproWindowPos", JSON.stringify(b));
}
//X
var input_other_ShiroproWindowPosX = document.getElementsByName("other_ShiroproWindowPosX");
input_other_ShiroproWindowPosX[0].onchange = function(){
    localStorage.setItem("opt_other_ShiroproWindowPosX", input_other_ShiroproWindowPosX[0].value);
}
//Y
var input_other_ShiroproWindowPosY = document.getElementsByName("other_ShiroproWindowPosY");
input_other_ShiroproWindowPosY[0].onchange = function(){
    localStorage.setItem("opt_other_ShiroproWindowPosY", input_other_ShiroproWindowPosY[0].value);
}

//ポップアップメニューを表示する
var checkBox_other_usePopupMenu = document.getElementsByName("other_usePopupMenu");
checkBox_other_usePopupMenu[0].onclick = function(){
    localStorage.setItem("opt_other_usePopupMenu", JSON.stringify(checkBox_other_usePopupMenu[0].checked));
}

//終了時、確認ダイアログを表示する
var checkBox_other_showExitConfirmation = document.getElementsByName("other_showExitConfirmation");
checkBox_other_showExitConfirmation[0].onclick = function(){
    localStorage.setItem("opt_other_showExitConfirmation", JSON.stringify(checkBox_other_showExitConfirmation[0].checked));
}

//-----------------------------
// バージョン情報
//-----------------------------

var vInfo = document.getElementsByName("verInfo");


    


//オプションページ読み込み時、設定値をロード
document.body.onload = function(){
    //-----------------------------
    // スクリーンショット
    //-----------------------------
    
    //撮る前に表示領域のサイズをデフォルトの800x480にリサイズする
    switch(JSON.parse(localStorage.getItem("opt_ss_resizeBeforeCapture") )){
    case true:
        checkBox_ss_resize[0].checked = true;   
        break;
    case false:
        checkBox_ss_resize[0].checked = false;
        break;
    default: //null
        checkBox_ss_resize[0].checked = true;
        break;
    }
    //保存形式
    switch(localStorage.getItem("opt_ss_format") ){
    case "png":
        radio_ss_fomat[0].checked = true; radio_ss_fomat[1].checked = false;
        break;
    case "jpeg":
        radio_ss_fomat[0].checked = false; radio_ss_fomat[1].checked = true;
        break;
    default:
        radio_ss_fomat[0].checked = true; radio_ss_fomat[1].checked = false;
        break;
    }
    //JPEGの品質
    if(localStorage.getItem("opt_ss_jpgQuality")){
        input_ss_jpgQuality[0].value = localStorage.getItem("opt_ss_jpgQuality");
    }else{
        input_ss_jpgQuality[0].value = "95";
    }
    //保存するフォルダ名
    if(localStorage.getItem("opt_ss_folderName")){
        input_ss_folderName[0].value = localStorage.getItem("opt_ss_folderName");
    }else{
        input_ss_folderName[0].value = "御城プロジェクト_SS";
    }
    
    //-----------------------------
    // タイマー
    //-----------------------------
    
    //表示するタイマーの数
    if(localStorage.getItem("opt_timer_numofTansaku")){
        select_timer_num_t[0].selectedIndex = localStorage.getItem("opt_timer_numofTansaku");
    }
    if(localStorage.getItem("opt_timer_numofSyuuzen")){
        select_timer_num_s[0].selectedIndex = localStorage.getItem("opt_timer_numofSyuuzen");
    }
    if(localStorage.getItem("opt_timer_numofChikujo")){
        select_timer_num_c[0].selectedIndex = localStorage.getItem("opt_timer_numofChikujo");
    }
    if(localStorage.getItem("opt_timer_numofReiryoku")){
        select_timer_num_r[0].selectedIndex = localStorage.getItem("opt_timer_numofReiryoku");
    }
    if(localStorage.getItem("opt_timer_numofHanyou")){
        select_timer_num_h[0].selectedIndex = localStorage.getItem("opt_timer_numofHanyou");
    }
    
    
    //タイマーの位置を記憶する
    switch(JSON.parse(localStorage.getItem("opt_timer_savePos") )){
    case true:
        checkBox_timer_savePos[0].checked = true;   
        break;
    case false:
        checkBox_timer_savePos[0].checked = false;
        break;
    default:
        checkBox_timer_savePos[0].checked = true;
        break;
    }
    //城プロウインドウ作成時にタイマーも同時に起動する
    switch(JSON.parse(localStorage.getItem("opt_timer_launchSameTime") )){
    case true:
        checkBox_timer_launchSameTime[0].checked = true;    
        break;
    case false:
        checkBox_timer_launchSameTime[0].checked = false;
        break;
    default:
        checkBox_timer_launchSameTime[0].checked = false;
        break;
    }
    
    
    //-----------------------------
    // 通知設定
    //-----------------------------
    
    //通知の有無
    switch(JSON.parse(localStorage.getItem("opt_timer_alertSettingTansaku") )){
    case true:
        checkBox_timer_alert_t[0].checked = true;   
        break;
    case false:
        checkBox_timer_alert_t[0].checked = false;
        break;
    default:
        checkBox_timer_alert_t[0].checked = true;
        break;
    }
    switch(JSON.parse(localStorage.getItem("opt_timer_alertSettingSyuuzen") )){
    case true:
        checkBox_timer_alert_s[0].checked = true;   
        break;
    case false:
        checkBox_timer_alert_s[0].checked = false;
        break;
    default:
        checkBox_timer_alert_s[0].checked = true;
        break;
    }
    switch(JSON.parse(localStorage.getItem("opt_timer_alertSettingChikujo") )){
    case true:
        checkBox_timer_alert_c[0].checked = true;   
        break;
    case false:
        checkBox_timer_alert_c[0].checked = false;
        break;
    default:
        checkBox_timer_alert_c[0].checked = true;
        break;
    }
    switch(JSON.parse(localStorage.getItem("opt_timer_alertSettingReiryoku") )){
    case true:
        checkBox_timer_alert_r[0].checked = true;   
        break;
    case false:
        checkBox_timer_alert_r[0].checked = false;
        break;
    default:
        checkBox_timer_alert_r[0].checked = true;
        break;
    }
    switch(JSON.parse(localStorage.getItem("opt_timer_alertSettingHanyou") )){
    case true:
        checkBox_timer_alert_h[0].checked = true;   
        break;
    case false:
        checkBox_timer_alert_h[0].checked = false;
        break;
    default:
        checkBox_timer_alert_h[0].checked = true;
        break;
    }
    
    //音もならす
    /*
    switch(JSON.parse(localStorage.getItem("opt_timer_soundEnable") )){
    case true:
        checkBox_timer_soundEnable[0].checked = true;   
        break;
    case false:
        checkBox_timer_soundEnable[0].checked = false;
        break;
    default:
        checkBox_timer_soundEnable[0].checked = true;
        break;
    }
    */
    if(localStorage.getItem("opt_timer_soundEnable_t")){
        checkBox_timer_soundEnable_t[0].checked = JSON.parse(localStorage.getItem("opt_timer_soundEnable_t") );
    }
    if(localStorage.getItem("opt_timer_soundEnable_s")){
        checkBox_timer_soundEnable_s[0].checked = JSON.parse(localStorage.getItem("opt_timer_soundEnable_s") );
    }
    if(localStorage.getItem("opt_timer_soundEnable_c")){
        checkBox_timer_soundEnable_c[0].checked = JSON.parse(localStorage.getItem("opt_timer_soundEnable_c") );
    }
    if(localStorage.getItem("opt_timer_soundEnable_r")){
        checkBox_timer_soundEnable_r[0].checked = JSON.parse(localStorage.getItem("opt_timer_soundEnable_r") );
    }
    if(localStorage.getItem("opt_timer_soundEnable_h")){
        checkBox_timer_soundEnable_h[0].checked = JSON.parse(localStorage.getItem("opt_timer_soundEnable_h") );
    }
    //音量
    if(localStorage.getItem("opt_timer_soundVolume")){
        select_timer_soundVol[0].selectedIndex = localStorage.getItem("opt_timer_soundVolume");
    }
    //通知音声の指定
    if(localStorage.getItem("opt_timer_soundFile_t")){
        document.getElementsByName("timer_soundFileName_t")[0].value =  JSON.parse(localStorage.getItem("opt_timer_soundFile_t") ).name;    
    }
    if(localStorage.getItem("opt_timer_soundFile_s")){
        document.getElementsByName("timer_soundFileName_s")[0].value =  JSON.parse(localStorage.getItem("opt_timer_soundFile_s") ).name;    
    }
    if(localStorage.getItem("opt_timer_soundFile_c")){
        document.getElementsByName("timer_soundFileName_c")[0].value =  JSON.parse(localStorage.getItem("opt_timer_soundFile_c") ).name;    
    }
    if(localStorage.getItem("opt_timer_soundFile_r")){
        document.getElementsByName("timer_soundFileName_r")[0].value =  JSON.parse(localStorage.getItem("opt_timer_soundFile_r") ).name;    
    }
    if(localStorage.getItem("opt_timer_soundFile_h")){
        document.getElementsByName("timer_soundFileName_h")[0].value =  JSON.parse(localStorage.getItem("opt_timer_soundFile_h") ).name;    
    }
    //通知アイコンの指定
    if(localStorage.getItem("opt_timer_imageFile_all")){
        document.getElementsByName("timer_imageFileName_all")[0].value =  JSON.parse(localStorage.getItem("opt_timer_imageFile_all") ).name;    
    }
    //通知メッセージ
    if(localStorage.getItem("opt_timer_notificationTitle")){
        textBox_timer_notificationTitle[0].value = localStorage.getItem("opt_timer_notificationTitle");
    }
    if(localStorage.getItem("opt_timer_message_t")){
        textBox_timer_message_t[0].value = localStorage.getItem("opt_timer_message_t");
    }
    if(localStorage.getItem("opt_timer_message_s")){
        textBox_timer_message_s[0].value = localStorage.getItem("opt_timer_message_s");
    }
    if(localStorage.getItem("opt_timer_message_c")){
        textBox_timer_message_c[0].value = localStorage.getItem("opt_timer_message_c");
    }
    if(localStorage.getItem("opt_timer_message_r")){
        textBox_timer_message_r[0].value = localStorage.getItem("opt_timer_message_r");
    }
    if(localStorage.getItem("opt_timer_message_h")){
        textBox_timer_message_h[0].value = localStorage.getItem("opt_timer_message_h");
    }
    
    //-----------------------------
    // その他
    //-----------------------------
    
    //ゲーム画面の位置調整
    if(localStorage.getItem("opt_other_autoPos")?JSON.parse(localStorage.getItem("opt_other_autoPos") ):true){
        radio_other_autoPos[0].checked = true;
        radio_other_autoPos[1].checked = false;
        document.getElementsByName("other_enableScaling")[0].disabled = false;      
        document.getElementsByName("other_scrollValueX")[0].disabled = true;
        document.getElementsByName("other_scrollValueY")[0].disabled = true;
    }else{
        radio_other_autoPos[0].checked = false;
        radio_other_autoPos[1].checked = true;
        document.getElementsByName("other_enableScaling")[0].disabled = true;       
        document.getElementsByName("other_scrollValueX")[0].disabled = false;
        document.getElementsByName("other_scrollValueY")[0].disabled = false;
    }
    //ウインドウリサイズ時の拡大縮小を有効にする
    if(localStorage.getItem("opt_other_enableScaling") ){
        checkBox_other_enableScaling[0].checked = JSON.parse(localStorage.getItem("opt_other_enableScaling") );
    }
    //右方向
    if(localStorage.getItem("opt_other_scrollValueX")){
        input_other_scrollValueX[0].value = localStorage.getItem("opt_other_scrollValueX");
    }
    //左方向
    if(localStorage.getItem("opt_other_scrollValueY")){
        input_other_scrollValueY[0].value = localStorage.getItem("opt_other_scrollValueY");
    }
    //ウインドウリサイズ時、縦方向へのゲーム画面中央化を行わない
    if(localStorage. getItem("opt_other_gameCenteringDisabled")){
        checkBox_other_gameCenteringDisabled[0].checked = JSON.parse(localStorage.getItem("opt_other_gameCenteringDisabled") ); 
    }
    //起動時のウインドウサイズを指定する
    if(localStorage.getItem("opt_other_specifyShiroproWindowSize")){
        var b = JSON.parse(localStorage.getItem("opt_other_specifyShiroproWindowSize") );
        checkBox_other_specifyShiroproWindowSize[0].checked = b;
        input_other_ShiroproWindowSize[0].disabled = !b;
    }
    //横幅
    if(localStorage.getItem("opt_other_ShiroproWindowSize")){
        input_other_ShiroproWindowSize[0].value = localStorage.getItem("opt_other_ShiroproWindowSize");
        
    }
    //起動時のウインドウ位置を指定する
    if(localStorage.getItem("opt_other_specifyShiroproWindowPos")){
        var b = JSON.parse(localStorage.getItem("opt_other_specifyShiroproWindowPos") );
        checkBox_other_specifyShiroproWindowPos[0].checked = b;
        input_other_ShiroproWindowPosX[0].disabled = !b;
        input_other_ShiroproWindowPosY[0].disabled = !b;
    }
    //X
    if(localStorage.getItem("opt_other_ShiroproWindowPosX")){
        input_other_ShiroproWindowPosX[0].value = localStorage.getItem("opt_other_ShiroproWindowPosX");
    }
    //Y
    if(localStorage.getItem("opt_other_ShiroproWindowPosY")){
        input_other_ShiroproWindowPosY[0].value = localStorage.getItem("opt_other_ShiroproWindowPosY");
    }
    //ポップアップメニューを表示する
    switch(JSON.parse(localStorage.getItem("opt_other_usePopupMenu") )){
    case true:
        checkBox_other_usePopupMenu[0].checked = true;  
        break;
    case false:
        checkBox_other_usePopupMenu[0].checked = false;
        break;
    default:
        checkBox_other_usePopupMenu[0].checked = true;
        break;
    }
    
    //終了時、確認ダイアログを表示する
    switch(JSON.parse(localStorage.getItem("opt_other_showExitConfirmation") )){
    case true:
        checkBox_other_showExitConfirmation[0].checked = true;  
        break;
    case false:
        checkBox_other_showExitConfirmation[0].checked = false;
        break;
    default:
        checkBox_other_showExitConfirmation[0].checked = false;
        break;
    }
    //-----------------------------
    // バージョン情報
    //-----------------------------
    
    vInfo[0].innerText = "ver " + chrome.runtime.getManifest().version;
    
}






