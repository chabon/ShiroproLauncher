import { getSetting } from './settings.js';

export const ScreenShot = {};

ScreenShot.capture = async function(windowId, gameSize){
	const { width : gameWidth, height : gameHeight } = gameSize;

	if(!windowId) {
		console.warn("[warning] screenshot failed. shiropro window not found.");
		return;
	}
	
	// 城プロにフォーカス
	await chrome.windows.update(windowId, {focused:true});

	// 撮る前にウインドウサイズをデフォルトサイズにする
	if(await getSetting("opt_ss_resizeBeforeCapture")){
		const win = await chrome.windows.get(windowId, {populate:true});
		const tab = win.tabs[0];
		if(tab.width != gameWidth || tab.height != gameHeight){
			await chrome.windows.update(win.id,{
				width  : gameWidth  + (win.width  - tab.width),
				height : gameHeight + (win.height - tab.height)
			});
			// 600ms待機
			await new Promise(resolve => setTimeout(resolve, 600));
		}
	}
	
	// キャプチャ設定取得
	const format 	 = await getSetting("opt_ss_format");
	const quality    = await getSetting("opt_ss_jpgQuality");
	const folderName = await getSetting("opt_ss_folderName");
	
	// キャプチャ
	const base64DataUrl = await chrome.tabs.captureVisibleTab(windowId, {
		format : format,
		quality : Number(quality)
	});

	// 保存
	const filename = folderName + "\\" + ScreenShot.getFileName() + "." + format.replace("jpeg","jpg");
	const downloadId = await chrome.downloads.download({
      url: base64DataUrl,
      filename: filename,
      saveAs: false
    });
	console.log(`[notification] screenshot downloaded. ID: ${downloadId} | filename: ${filename}`);
}


ScreenShot.getFileName = function(){
	let d = new Date();
	let yyyy = d.getYear();
	let MM = d.getMonth() + 1;
	let dd = d.getDate();
	let hh = d.getHours();
	let mm = d.getMinutes();
	let ss = d.getSeconds();
	if (yyyy < 2000) { yyyy += 1900; }
	if (MM < 10) { MM = "0" + MM; }
	if (dd < 10) { dd = "0" + dd; }
	if (hh < 10) { hh = "0" + hh; }
	if (mm < 10) { mm = "0" + mm; }
	if (ss < 10) { ss = "0" + ss; }
    return `${yyyy}_${MM}${dd}_${hh}${mm}_${ss}`;
}
