let GameAdmob = require("GameAdmob");
let GoogleAdCache = require("GoogleAdCache");

let GoogleAdController = cc.Class({
    extends: Object,

    properties: {

    },

    ctor() {

    },

    //下载插页广告
    loadInterAd() {
        let adID = "";
        GameAdmob.requestInterstitial(adID);
    },

    //显示插页广告
    showInterAd() {
        if (GoogleAdCache.getCanPlayInterAd()) {
            //插页广告已下载好了
            GameAdmob.openInterstitial();
        } else if (GoogleAdCache.getIsLoadInterAd()) {
            //插页广告正在下载
            GoogleAdCache.setAutoPlayInterAd(true);
        } else if (!GoogleAdCache.getIsLoadInterAd()) {
            //没有插页广告在下载
            GoogleAdCache.setAutoPlayInterAd(true);
            this.loadInterAd();
        }
    },

    //概率显示插页广告
    showInterAdByPercent() {
        //百分之40概率出现插页广告
        let rate = Math.random();
        if (rate <= 0.4) {
            this.showInterAd();
        }
    },

    //下载激励广告
    loadRewardAd() {
        let adID = "";
        GameAdmob.openRewardeAd(adID);
    },

    //显示激励广告
    showRewardeAd() {
        if (GoogleAdCache.getCanPlayRewardAd()) {
            //激励广告已下载好了
            GameAdmob.showRewardedAd();
        } else if (GoogleAdCache.getIsLoadRewardAd()) {
            //激励广告正在下载
            GoogleAdCache.setAutoPlayRewardAd(true);
        } else if (!GoogleAdCache.getIsLoadRewardAd()) {
            //没有激励广告在下载
            GoogleAdCache.setAutoPlayRewardAd(true);
            this.loadRewardAd();
        }
    },

    //下载横幅广告
    showBannerAd() {
        if (GoogleAdCache.getIsShowBannerAd()) {
            return
        }

        GoogleAdCache.setIsShowBannerAd(true);
        let adID = "";
        GameAdmob.openBannerView(null, null, adID);
        // GameAdmob.openBannerView();
    },

    //隐藏横幅广告
    hideBannerAd() {
        GameAdmob.hideBannerView();
        GoogleAdCache.setIsShowBannerAd(false);
    }
});

let object = new GoogleAdController();
module.exports = object;
