
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;


function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      window.location.reload();
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('Error: ' + msg);
}


//save
var saveFileToSundBox = function(kind, suffix, file){
    navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes){
        window.requestFileSystem(window.PERSISTENT,bytes, function(fs) {
            //先に以前のファイルを削除
            var prevFileName = localStorage.getItem("opt_timer_"+ kind +"File_"+ suffix)?
            JSON.parse(localStorage.getItem("opt_timer_"+ kind +"File_"+ suffix)).name:"tmp";
            fs.root.getFile(kind + "_" + suffix + "_" + prevFileName, {create: true}, function(fileEntry) {
                fileEntry.remove(function(){
                    //console.log("file removed.");
                    //save
                    fs.root.getFile(kind + "_" + suffix + "_" + file.name, {create: true}, function(fileEntry){
                        fileEntry.createWriter(function(fileWriter){
                            fileWriter.write(file);
                            //console.log(fileEntry);
                            var val = {};
                            val.name = file.name;
                            val.url = fileEntry.toURL();
                            localStorage.setItem("opt_timer_"+ kind +"File_"+ suffix,JSON.stringify(val));
                            //display
                            document.getElementsByName("timer_"+ kind +"FileName_" + suffix)[0].value = file.name;
                        }, errorHandler);
                    }, errorHandler);
                }, errorHandler);
            }, errorHandler);
        }, errorHandler);
    });
}

//delete
var deleteFileFromSundBox = function(kind, suffix){
    navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes){
        window.requestFileSystem(window.PERSISTENT,bytes, function(fs) {
            var delFileName = localStorage.getItem("opt_timer_"+ kind +"File_"+ suffix)?
            JSON.parse(localStorage.getItem("opt_timer_"+ kind +"File_"+ suffix)).name:"tmp";
            fs.root.getFile(kind + "_" + suffix +"_" + delFileName, {create: true}, function(fileEntry) {
                fileEntry.remove(function(){
                    localStorage.removeItem("opt_timer_"+ kind +"File_" + suffix);
                    //display
                    document.getElementsByName("timer_"+ kind +"FileName_" + suffix)[0].value = "";
                    window.location.reload();
                }, errorHandler);
            }, errorHandler);
        }, errorHandler);
    });
}



//elements

//通知音声の指定
//探索
document.getElementsByName('timer_soundFileRelease_t')[0].onclick = function(){
    deleteFileFromSundBox("sound","t");
}
document.getElementsByName('timer_soundFileSelect_t')[0].onchange = function(){
    var file = this.files[0];
    if(file){saveFileToSundBox("sound", "t", file);}
}
document.getElementsByName("timer_soundFileSelectBtn_t")[0].onclick = function(){
    document.getElementsByName('timer_soundFileSelect_t')[0].click();
}


//修繕
document.getElementsByName('timer_soundFileRelease_s')[0].onclick = function(){
    deleteFileFromSundBox("sound","s");
}
document.getElementsByName('timer_soundFileSelect_s')[0].onchange = function(){
    var file = this.files[0];   
    if(file){saveFileToSundBox("sound", "s", file);}
}
document.getElementsByName("timer_soundFileSelectBtn_s")[0].onclick = function(){
    document.getElementsByName('timer_soundFileSelect_s')[0].click();
}


//築城
document.getElementsByName('timer_soundFileRelease_c')[0].onclick = function(){
    deleteFileFromSundBox("sound","c");
}
document.getElementsByName('timer_soundFileSelect_c')[0].onchange = function(){
    var file = this.files[0];   
    if(file){saveFileToSundBox("sound", "c", file);}
}
document.getElementsByName("timer_soundFileSelectBtn_c")[0].onclick = function(){
    document.getElementsByName('timer_soundFileSelect_c')[0].click();
}

//霊力
document.getElementsByName('timer_soundFileRelease_r')[0].onclick = function(){
    deleteFileFromSundBox("sound","r");
}
document.getElementsByName('timer_soundFileSelect_r')[0].onchange = function(){
    var file = this.files[0];   
    if(file){saveFileToSundBox("sound", "r", file);}
}
document.getElementsByName("timer_soundFileSelectBtn_r")[0].onclick = function(){
    document.getElementsByName('timer_soundFileSelect_r')[0].click();
}

//汎用
document.getElementsByName('timer_soundFileRelease_h')[0].onclick = function(){
    deleteFileFromSundBox("sound","h");
}
document.getElementsByName('timer_soundFileSelect_h')[0].onchange = function(){
    var file = this.files[0];   
    if(file){saveFileToSundBox("sound", "h", file);}
}
document.getElementsByName("timer_soundFileSelectBtn_h")[0].onclick = function(){
    document.getElementsByName('timer_soundFileSelect_h')[0].click();
}



//通知アイコン画像の指定
document.getElementsByName('timer_imageFileRelease_all')[0].onclick = function(){
    deleteFileFromSundBox("image","all");
}
document.getElementsByName('timer_imageFileSelect_all')[0].onchange = function(){
    var file = this.files[0];   
    if(file){saveFileToSundBox("image", "all", file);}
}
document.getElementsByName("timer_imageFileSelectBtn_all")[0].onclick = function(){
    document.getElementsByName('timer_imageFileSelect_all')[0].click();
}

