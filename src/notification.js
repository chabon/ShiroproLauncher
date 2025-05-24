import { getSetting } from './settings.js';

// 最後に通知を行った日時
let lastNotifiedAt;

export async function showTimerEndNotification(keySuffix, number){
    // 最後に通知を行った時間から、1秒以上待機させる
    while(true){
        if(!lastNotifiedAt || Date.now() - lastNotifiedAt > 1000) break;
        await new Promise(resolve => setTimeout(resolve, 200)); // 0.2秒待機
    }
    lastNotifiedAt = Date.now();

    // notification
    const opt = {
        type: 'basic',
        priority: 0
    };
    opt.title   = await getSetting("opt_timer_notificationTitle");
    opt.message = (await getSetting(`opt_timer_message_${keySuffix}`)).replace("\$number\$", number);
    const imageFile = await getSetting("opt_timer_imageFile_all");
    opt.iconUrl  = imageFile != null ?  imageFile.url : "../images/ShiroproLauncher_48.png";
    await chrome.notifications.clear("notification");
    await chrome.notifications.create("notification", opt);

    // sound
    if(await getSetting(`opt_timer_enableSound_${keySuffix}`)){
        const soundFile = await getSetting(`opt_timer_soundFile_${keySuffix}`);
        const soundURL  = soundFile != null ?  soundFile.url : "taiko02.mp3";
        const notificationSound = new Audio(soundURL);
        const volume = await getSetting("opt_timer_soundVolume");
        notificationSound.volume = Number(volume) / 100;
        notificationSound.play();
    }
}