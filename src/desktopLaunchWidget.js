



window.onload = function() {
    chrome.runtime.sendMessage({
        name: "ShiroproLauncher_Command",
        command:"navigateToGamePageFromDesktopShortcutWidget"
    }, function(response) {
       if(response.isOpenFromOptionPage){
           // オプションページから開かれたなら、Bodyタグ内を表示
           window.document.body.style.display = "block";   
       }
       else{
            // window.location.href = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=777106/';  
       }
    });
};
