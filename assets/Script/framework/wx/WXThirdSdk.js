let WXThirdSdk = function(){
    this._banner = null;
    this._video = null;
    this._callback = null;
};

WXThirdSdk.prototype.canShowAD = function () {
    let show = true;
    return show;
}

WXThirdSdk.prototype.handleNavigateToMiniProgram = function (adConfig, callback) {
    let wx = window["wx"];
    if(!wx) return;

    //https://developers.weixin.qq.com/minigame/dev/api/wx.navigateToMiniProgram.html
    wx.navigateToMiniProgram({
        appId: adConfig.appId,
        path: adConfig.path,
        extraData: adConfig.extraData,
        envVersion: adConfig.envVersion,
        success: function(res) {
            if(callback){
                callback(true, res);
            }
        },
        fail: function(res){
            if(callback){
                callback(false, res);
            }
        },
    })
}

WXThirdSdk.prototype.handleShowBanner = function (args) {
    let wx = window["wx"];
    if(!wx) return;
    if(!this.canShowAD()){
        return;
    } 
    
    this.handleHideBanner();

    let size = cc.view.getFrameSize();
    let width = 300;
    // if(size.height/size.width>2 || size.width/size.height>2){
    //     width = 250;
    // }

    // let sizeDesign = cc.view.getDesignResolutionSize();
    // let winSize = cc.winSize;
    // let scaleX = winSize.width/sizeDesign.width;
    // let scaleY = winSize.height/sizeDesign.height;
    // let scale = Math.min(scaleX, scaleY);
    // if(scale<1){
    //     width = width*scale;
    // }
    // if(width<250){
    //     width = 250;
    // }
    // console.debug("banner width:", width, scale);

    let left = size.width/2 - width/2;
    let top = size.height - 100;
    let bannerAd = wx.createBannerAd({
        adUnitId: args.adUnitId,
        style: {
            left: 0,
            top: 0,
            width: width
        }
    })
    bannerAd.onLoad(function (res) {
        console.log("[banner] onLoad", res);
    })
	bannerAd.onResize(function(res) {
        console.log("[banner] onResize", res);
		bannerAd.style.left = size.width/2 - bannerAd.style.realWidth / 2;
        bannerAd.style.top = size.height - bannerAd.style.realHeight + 0.1;
        bannerAd.show();
    })
    bannerAd.onError(function (res) {
        console.log("[banner] onError", res);
    })
    this._banner = bannerAd;
}

WXThirdSdk.prototype.handleHideBanner = function () {
    let wx = window["wx"];
    if(!wx) return;

    if(this._banner){
        this._banner.destroy();
    }
    this._banner = null;
}

WXThirdSdk.prototype.handleShowRewardedVideo = function (args) {
    let wx = window["wx"];
    if(!wx) return;
    if(!this.canShowAD()){
        if(args.error){
            args.error({});
        }
        return;
    } 

    // this._callback = callback;
    this.handleHideRewardedVideo();

    let videoAd = wx.createRewardedVideoAd({
        adUnitId: args.adUnitId,
    })
    
    videoAd.load()
    .then(() => videoAd.show())
    .catch(err => console.log(err.errMsg))

    let self = this;

    self._onLoad = function (res) {
        console.log("[video] onLoad", res);
    }
    self._onError = function (res) {
        console.log("[video] onError", res);
        if(args.error){
            args.error(res);
        }
    }
    self._onClose = function (res) {
        console.log("[video] onClose", res);

		//isEnded: false:未看完视频就点击关闭  true:已看完视频就点击关闭
        if(res.isEnded){
            if(args.success){
                args.success(res);
            }
        }
        else{
            if(args.fail){
                args.fail(res);
            }
        }
        videoAd.load();
        // videoAd.offLoad(self._onLoad);
        // videoAd.offError(self._onError);
        // videoAd.offClose(self._onClose);
    }
    videoAd.onLoad(self._onLoad);
    videoAd.onError(self._onError);
    videoAd.onClose(self._onClose);

    this._video = videoAd;
}
WXThirdSdk.prototype.handleHideRewardedVideo = function () {
    let wx = window["wx"];
    if(!wx) return;

    let self = this;
    if(this._video){
        if(self._onLoad){
            this._video.offLoad(self._onLoad);
        }
        if(self._onError){
            this._video.offError(self._onError);
        }
        if(self._onClose){
            this._video.offClose(self._onClose);
        }
    }
    this._video = null;
    this._onLoad = null;
    this._onError = null;
    this._onClose = null;
}

let object = new WXThirdSdk();
module.exports = object;