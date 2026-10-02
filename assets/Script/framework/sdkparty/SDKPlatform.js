
let SDKPlatform = {
};

//复制
SDKPlatform.copyToClipboard = function (txt) {
    if(qygameengine.PlatformCommon.copyToClipboard){
        qygameengine.PlatformCommon.copyToClipboard(txt)
    }
}

//系统版本
SDKPlatform.getSystemVersion = function () {

    if(qygameengine.PlatformCommon.getSystemVersion){
        return qygameengine.PlatformCommon.getSystemVersion()
    }

    return "[unknown]";
}


SDKPlatform.getDeviceModel = function () {

    if(qygameengine.PlatformCommon.getDeviceModel){
        return qygameengine.PlatformCommon.getDeviceModel()
    }

    return "[unknown]";

}


//设备ID
SDKPlatform.getDevicesId = function () {
  
    if(qygameengine.PlatformCommon.getDevicesId){
        return qygameengine.PlatformCommon.getDevicesId()
    }
    return "";
}

//获取APP版本号
SDKPlatform.getAppVersion = function () {
    if(qygameengine.PlatformCommon.getAppVersion){
        return qygameengine.PlatformCommon.getAppVersion()
    }
    return "1.0.0";
}

//判断APP是debug还是release
SDKPlatform.isDebug = function () {

    QYLogs.warn("SDKPlatform isDebug")
    if(qygameengine.GameEngine.getAppDebug){
        return qygameengine.GameEngine.getAppDebug()
    }

    if(cc.sys.isNative){
        let fileName = "chessSetVersion/info.json"
        let data = jsb.fileUtils.getStringFromFile(fileName);
        if (data && data.length > 8) {
            let obj = JSON.parse(data);
            if(obj.debug == 1){
                return true
            }else{
                return false
            }
        }
    }
    
    return true

}

//判断APP是debug还是release
SDKPlatform.getPlatform = function () {

    QYLogs.warn("SDKPlatform getPlatform")
    if(cc.sys.isNative){
        let fileName = "chessSetVersion/info.json"
        let data = jsb.fileUtils.getStringFromFile(fileName);
        if (data && data.length > 8) {
            let obj = JSON.parse(data);
            if(obj.platform){
                return obj.platform
            }
        }
    }
    return "cclivelib"
    
}

//获取APP启动url
SDKPlatform.getAppStartUrl = function () {
    if(cc.sys.isNative){
        if(qygameengine.PlatformCommon.getAppStartUrl){
            return qygameengine.PlatformCommon.getAppStartUrl()
        }
    }

    return "";
}

//字符串加密
SDKPlatform.encrypt = function (str, key) {
    QYLogs.warn("SDKPlatform encrypt")
    if(qygameengine.GameEngine.encrypt){
        return qygameengine.GameEngine.encrypt(str, key)
    }

   return str;

},

SDKPlatform.shareText = function(text, appPackIndex){
    if (!cc.sys.isNative){
        return;
    }
    if (cc.sys.os==cc.sys.OS_ANDROID){
        let packNameArray = {
            0: "com.whatsapp",
            1: "org.telegram.messenger.web",
            2: "com.facebook.orca",
            3: "com.instagram.android",
            4: "jp.naver.line.android",
            5: "com.zing.zalo",
            6: "com.tencent.mobileqq",
            7: "com.tencent.mm",
            8: "com.ss.android.ugc.aweme",
            9: "com.twitter.android",
            10: "com.google.android.youtube"
        }
        var className = 'com/quanyu/qygameengine/ShareApp';
        var methodName = 'ShareText';
        var methodSignature = '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V'; // 函数参数与返回值
        if(jsb && jsb.reflection){
            let ret = jsb.reflection.callStaticMethod(className, methodName, methodSignature, "", text, packNameArray[appPackIndex]);
            console.log("ShareApp android","shareText ok "+ret);
        }
    }else if (cc.sys.os==cc.sys.OS_IOS){
        let packNameArray = {
            0: "whatsapp://send?text=",
            1: "tg://msg?text=",
            2: "fb://messaging?link=",
            3: "instagram://app?text=",
            4: "https://line.me/R/share?text=",
            5: "zalo://share?params=",
            6: "mqqapi://share/to_fri?file_type=news&src_type=web&version=1&thirdAppDsplayName=BTTPOKER&callback_type=scheme&cflag=0&shareType=0&file_type=news&share_id=",
            7: "weixin://dl/moments?text=",
            8: "snssdk141://share/item?text=",
            9: "twitter://post?message=",
            10: "https://plus.google.com/share?text="
        }
        if(jsb && jsb.reflection){
            let str = packNameArray[appPackIndex] + text;
            if (appPackIndex == 4){
                str = packNameArray[appPackIndex] + "{" + text +"}";
            }else if (appPackIndex == 5 || appPackIndex == 6){
                str = packNameArray[appPackIndex] + JSON.stringify({message: text, link: text});
            }else if(appPackIndex == 8 || appPackIndex == 9 || appPackIndex == 10){
                str = packNameArray[appPackIndex] + text + "&url=" + text;
            }
            let ret = jsb.reflection.callStaticMethod("ShareApp",
                                         "shareText:text:",
                                         "",str);
            console.log("ShareApp ios","shareText ok "+ret);
        }
    }
}


module.exports = SDKPlatform;


