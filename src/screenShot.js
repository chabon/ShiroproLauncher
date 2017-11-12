

ShiroproLauncher.ScreenShot = {};


ShiroproLauncher.ScreenShot.take = function(){
	//リサイズ設定のチェック
	var b;
	if(localStorage.getItem("opt_ss_resizeBeforeCapture")){
		b = JSON.parse(localStorage.getItem("opt_ss_resizeBeforeCapture") );
	}else{b = true;}
	if(b == false){ShiroproLauncher.ScreenShot.capture();return;}
	//ウインドウサイズの調整をしてから撮る
	chrome.windows.get(ShiroproLauncher.window.id, {populate:true}, function(win){
		if(win.tabs[0].width != ShiroproLauncher.gameSize.width || win.tabs[0].height != ShiroproLauncher.gameSize.height){
			chrome.windows.update(win.id,{
				width : ShiroproLauncher.gameSize.width + (win.width - win.tabs[0].width),
				height : ShiroproLauncher.gameSize.height + (win.height - win.tabs[0].height)
			},function(w){
				if(localStorage.getItem("opt_other_enableScaling")?JSON.parse(localStorage.getItem("opt_other_enableScaling") ):true){
					ShiroproLauncher.ScreenShot.delayedCapture(600);
				}
				else{ShiroproLauncher.ScreenShot.delayedCapture(300);}
			});
		}
		else{ShiroproLauncher.ScreenShot.capture();}
	});
}


ShiroproLauncher.ScreenShot.capture = function(){
	
	var _format 	= localStorage.getItem("opt_ss_format")? localStorage.getItem("opt_ss_format") : "png";
	var _quality 	= localStorage.getItem("opt_ss_jpgQuality")? localStorage.getItem("opt_ss_jpgQuality") : "95"
	var _folderName = localStorage.getItem("opt_ss_folderName")? localStorage.getItem("opt_ss_folderName") : "御城プロジェクト_SS";
	
	chrome.tabs.captureVisibleTab(ShiroproLauncher.window.id, {
		format : _format,
		quality : Number(_quality)
	}, function(data) {
		chrome.downloads.download({
			url:data, 
			filename:_folderName + "\\" + ShiroproLauncher.ScreenShot.getFileName() + "." + _format.replace("jpeg","jpg"),
			saveAs:false
		},function(downloadId){
			//alert("saved");
		});
	});
}


ShiroproLauncher.ScreenShot.delayedCapture = function(delay){
	setTimeout(ShiroproLauncher.ScreenShot.capture, delay);
}


ShiroproLauncher.ScreenShot.getFileName = function(){
	var d = new Date();
	var yyyy = d.getYear();
	var MM = d.getMonth() + 1;
	var dd = d.getDate();
	var hh = d.getHours();
	var mm = d.getMinutes();
	var ss = d.getSeconds();
	if (yyyy < 2000) { yyyy += 1900; }
	if (MM < 10) { MM = "0" + MM; }
	if (dd < 10) { dd = "0" + dd; }
	if (hh < 10) { hh = "0" + hh; }
	if (mm < 10) { mm = "0" + mm; }
	if (ss < 10) { ss = "0" + ss; }
	return '' + yyyy + '_' + MM + dd + '_' + hh + mm + '_' + ss;
}