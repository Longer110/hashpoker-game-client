let GoogleAdCache = cc.Class({
    extends: Object,

    properties: {
        _isLoadRewardAd:false,
        _canPlayRewardAd:false,
        _autoPlayRewardAd:false,

        _isLoadInterdAd:false,
        _canPlayInterdAd:false,
        _autoPlayInterdAd:false,

        _isShowBannerAd:false,
    },
    
    ctor(){
        
    },

    //设置是否正在下载激励广告
    setIsLoadRewardAd(state){
        this._isLoadRewardAd = state;
    },

    //获取是否正在下载激励广告
    getIsLoadRewardAd(state){
        return this._isLoadRewardAd;
    },

    //设置是否可以播放下载激励广告
    setCanPlayRewardAd(state){
        this._canPlayRewardAd = state;
    },

    //获取是否可以播放下载激励广告
    getCanPlayRewardAd(state){
        return this._canPlayRewardAd;
    },

    //设置是否下载激励广告后自动播放
    setAutoPlayRewardAd(state){
        this._autoPlayRewardAd = state;
    },

    //获取是否下载激励广告后自动播放
    getAutoPlayRewardAd(state){
        return this._autoPlayRewardAd;
    },


    //设置是否正在下载插页广告
    setIsLoadInterAd(state){
        this._isLoadInterdAd = state;
    },

    //获取是否正在下载插页广告
    getIsLoadInterAd(state){
        return this._isLoadInterdAd;
    },

    //设置是否可以播放下载插页广告
    setCanPlayInterAd(state){
        this._canPlayInterdAd = state;
    },

    //获取是否可以播放下载插页广告
    getCanPlayInterAd(state){
        return this._canPlayInterdAd;
    },

    //设置是否下载插页广告后自动播放
    setAutoPlayInterAd(state){
        this._autoPlayInterdAd = state;
    },

    //获取是否下载插页广告后自动播放
    getAutoPlayInterAd(state){
        return this._autoPlayInterdAd;
    },

    //设置是否已经打开横幅广告了
    setIsShowBannerAd(state){
        this._isShowBannerAd = state;
    },

    //获取是否已经打开横幅广告了
    getIsShowBannerAd(){
        return this._isShowBannerAd
    },
});

let object = new GoogleAdCache();
module.exports = object;
