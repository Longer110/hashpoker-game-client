
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let AudioPool = require("AudioPool");
let GoogleAdCache = require("GoogleAdCache");

let GameAdmob = {

};
//*************************横幅广告 */
GameAdmob.openBannerView = function (width,height,adID) {//开启横幅广告
     //console.log("GameAd","openBannerView");
    adID = "ca-app-pub-3420456566691309/5178236761";
    if(cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS){
         //console.log("GameAd jsb,jsb.reflection:",jsb,jsb.reflection);
        if(jsb && jsb.reflection){
            let ret = jsb.reflection.callStaticMethod("GameAd",
                                         "openBannerView:height:adID:",
                                         width,height,adID);
             //console.log("GameAd","openBannerView ok "+ret);
        }
    }       
}
GameAdmob.hideBannerView = function () {//关闭横屏广告
     //console.log("GameAd","hideBannerView");
    if(cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS){
         //console.log("GameAd jsb,jsb.reflection:",jsb,jsb.reflection);
        if(jsb && jsb.reflection){
            let ret = jsb.reflection.callStaticMethod("GameAd",
                                         "hideBannerView",
                                         );
             //console.log("GameAd","hideBannerView ok "+ret);
        }
    }       
}
//*************************激励广告 */
GameAdmob.openRewardeAd = function (adID) {
    if(GoogleAdCache.getIsLoadRewardAd()){
        return
    }
    adID = "ca-app-pub-3420456566691309/9986860259"
     //console.log("GameAd","openRewardeAd");
    if(cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS){
        if(jsb && jsb.reflection){
             //console.log("GameAd jsb && jsb.reflection");
            GoogleAdCache.setIsLoadRewardAd(true);
            let ret = jsb.reflection.callStaticMethod("GameAd",
                                         "openRewardeAd:",
                                         adID);
             //console.log("GameAd","openRewardeAd ok "+ret);
        }
    }       
}

//激励广告数据请求回调
GameAdmob.downRewardedAdCallback = function(result){
     //console.log("GameAd","downRewardedAdCallback："+result);
    GoogleAdCache.setIsLoadRewardAd(false);
    if(result == "success"){
        // GameAdmob.showRewardedAd();
        GoogleAdCache.setCanPlayRewardAd(true);
        if(GoogleAdCache.getAutoPlayRewardAd()){
            this.showRewardedAd();
        }
    }else{
        //激励广告下载失败
        MsgManager.fire(MSG.NOTIFY.GOOGLE_AD.VIDEO_FAILED,result);
    }
}

//显示激励广告
GameAdmob.showRewardedAd = function(){
    if(cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS){
        if(jsb && jsb.reflection){
             //console.log("GameAd jsb && jsb.reflection");
            let ret = jsb.reflection.callStaticMethod("GameAd",
                                         "showRewardAd");
             //console.log("GameAd","showRewardAd ok "+ret);
        }
    }
}

GameAdmob.openRewardeAdCallback = function (result) {
     //console.log("GameAd","openRewardeAdCallback "+result);
    GoogleAdCache.setCanPlayRewardAd(false);
    GoogleAdCache.setAutoPlayRewardAd(false);
    if(result == "success"){//激励广告收看完成，给与奖励
        
    }else if(result == "show"){//广告已显示
        AudioPool.pauseMusic();
    }else if(result == "failed"){//显示失败

    }else if(result == "dismissed"){//广告消失取消
        AudioPool.resumeMusic();
    }
    MsgManager.fire(MSG.NOTIFY.GOOGLE_AD.VIDEO,result);
}
/**************************** 插页广告**********************
插页式广告应在应用流程的自然停顿期间进行展示，例如游戏的不同关卡之间或
用户完成一项任务之后，都是非常不错的展示时机
GADInterstitial 是一次性对象。也就是说，在一个插页式广告完成展示后，
hasBeenUsed 会返回 true，这样就无法再使用该插页式广告对象加载其他广告了。
如果要再请求一个插页式广告，您需要创建一个新的 GADInterstitial 对象。如果
您尝试重复使用插页式广告对象，则会收到如下错误响应：“Request Error: Will
 not send request because interstitial object has been used”。

如果要再分配一个插页式广告，最好是在 GADInterstitialDelegate 的 
interstitialDidDismissScreen 方法中进行分配，这样，当上一个插页式广告关闭后
，就可以立即开始加载下一个插页式广告。您甚至可以考虑将插页式广告的初始化过程细分到
其自身的辅助方法中
*/
//先请求插页广告
GameAdmob.requestInterstitial = function (adID) {
    if(GoogleAdCache.getIsLoadInterAd()){
        return
    }
    adID = "ca-app-pub-3420456566691309/1108974480"
     //console.log("GameAd","requestInterstitial");
    if(cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS){
        if(jsb && jsb.reflection){
            GoogleAdCache.setIsLoadInterAd(true);
            let ret = jsb.reflection.callStaticMethod("GameAd",
                                         "requestInterstitial:",
                                         adID);
             //console.log("GameAd","requestInterstitial ok "+ret);
        }
    }       
}
//显示插页式广告
GameAdmob.openInterstitial = function () {
     //console.log("GameAd","openInterstitial");
    if(cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS){
        if(jsb && jsb.reflection){
            AudioPool.pauseMusic();
            GoogleAdCache.getCanPlayInterAd(false);
            GoogleAdCache.setAutoPlayInterAd(false);
            let ret = jsb.reflection.callStaticMethod("GameAd",
                                         "openInterstitial",
                                         );
             //console.log("GameAd","openInterstitial ok "+ret);
        }
    }       
}
GameAdmob.openInterstitialCallback = function (result) {
     //console.log("GameAd","openInterstitialCallback "+result);

    GoogleAdCache.setIsLoadInterAd(false);

    if(result == "failed"){//
        
    }else if(result == "WillPresentScreen"){//

    }else if(result == "WillDismissScreen"){

    }else if(result == "DismissScreen"){//广告消失取消,有暂停音乐播放的和在这里恢复
        AudioPool.resumeMusic();
    }else if(result == "requestOk"){//可在这暂停游戏音乐 显示插页式广告
        GoogleAdCache.getCanPlayInterAd(true);
        if(GoogleAdCache.getAutoPlayInterAd()){
            this.openInterstitial();
        }
        
    }
}
module.exports = GameAdmob;
cc.GameAdmob = GameAdmob;