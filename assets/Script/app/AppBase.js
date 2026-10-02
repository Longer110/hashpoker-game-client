// let my = require("my");
let AppDelegate = require("AppDelegate");
let AppBridge = require("AppBridge");
// let BridgeManager = require("BridgeManager");
let UIFrame = require("UIFrame");
let UserInfo = require("UserInfo");
let LoadingBlock = require("LoadingBlock");
let LocalStorage = require("LocalStorage");
let UserKey = require("UserKey");

// let App = my.Application.default;

class AppBase extends AppDelegate {
    // BridgeManager = BridgeManager.default;
    _key = "live";
    _skinCurrent = "";
    _isSpecialMode = false;
    _isRoomLocked = false;
    _ingame = false;
    _isAnchor = false;
    _isAdminUser = false;
    _isVipUser = false;
    _compatibleVersion = "";
    _appSkin = "";
    _canShowLoading = true;
    _paused = false;
    _topPanelCount = 0;
    _isClubMttMatch = false;
    isRunOnBackground = false;
    _launchTimestamp = {
        loginAccount: false,
        loginHall: false,
        launchGame: false,
    }

    postMessage = function (msg, data) {
        // let bridge = BridgeManager.default;
        // bridge.postMessage.apply(bridge, arguments);
        app.bridgeController.postMessage(msg, data);
    }

    pauseMusic = function (params) {
        if(!app._paused){
            app._paused = true;

            // app.audio.pauseAll();
            app.audio.stopMusic();
            app.audio.stopAllEffects();
        }
    }

    resumeMusic = function (params) {
        if(app._paused){
            app._paused = false;

            // app.audio.resumeAll();
            app.audio.resumeMusic();
            app.audio.resumeAllEffects();
        }
    }

    _isPlatform = function (platform) {
        let key = app._key || "";
        return key.toLowerCase() == platform.toLowerCase();
    }

    //hellogame App平台
    isHelloGame = function () {
        return this._isPlatform(AppBridge.APPKEY.HELLO_GAME);
    }
    //morewin App平台
    isMoreWin = function (params) {
        return this._isPlatform(AppBridge.APPKEY.MORE_WIN);
    }
    // maya App平台
    isMaYa = function (params) {
        return this._isPlatform(AppBridge.APPKEY.MAYA);
    }

    //CCLIVE App平台
    isCCLive = function () {
        return this._isPlatform(AppBridge.APPKEY.CCLIVE);
    }

    setAppKey = function (key) {
        if(app._key == key){
            return;
        }

        app._key = key;

        //默认可滑动
        app.setAppSlideable(true);
    }

    /**
     * app传进来的皮肤配置
     * @param {*} skin 
     */
    setAppSkin = function (skin) {
        app._appSkin = skin;
    }
    getAppSkin = function () {
        return app._appSkin;
    }

    /**
     * 当h5游戏界面存在ScrollView时，设置原生app界面是否可滑动（切换直播页面）
     * @param {Boolean} enable 
     */
    setAppSlideable = function (enable) {
        if(cc.sys.os==cc.sys.OS_IOS){
            if(app.isMoreWin() || app.isCCLive()){
                //不取消事件的默认动作，用于MoreWin ios平台滑动事件透传。（在build-templates/web-mobile/cocos2d-js-min.js中有处理，项目构建后生效）
                cc.__disablePreventDefault = !!enable;
            }
        }
        else{

        }
        let params = {
            key: AppBridge.ACTION.GAME_ACTION_APP_SLIDEABLE, //app是否可滑动
            value: {
                slideable: enable ? 1 : 0,
            }
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, params);
    }

    // 获取是否主播
    getIsAnchor = function () {
        return app._isAnchor;
    }
    // 设置是否主播(通过app发送SUBGAME_ENTER_START消息并传入anchor字段值来设置)
    setIsAnchor = function (anchor) {
        app._isAnchor = anchor;
    }

    /*
    * 通知app更新牌局信息
    * data = {
    *    gold: 0,                //主播余额
    *    play_serial: "xxx",     //牌局号
    *    table_serial: "xxx",    //牌桌号
    *    content: "xxx",         //展示文字内容 (牌局号xxx 百家乐xxx 主播余额xxx) 注：如果主播余额为-1的时候，表示没有主播，不需要拼接主播余额
    * }
    */
    setPlayInfo = function (data) {
        let params = {
            key: AppBridge.ACTION.GAME_ACTION_PLAY_INFO, //牌局信息
            value: {
                gold: data.gold || 0,                   
                play_serial: data.play_serial || "[null]",        
                table_serial: data.table_serial || "[null]",
                content: data.content || "[null]",   
            }
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, params);
        if(app.UIAppPanel){
            app.UIAppPanel.setPlayInfo(params.value);
        }
    }

    showUIPanel = function (params) {
        if(app.UIAppPanel){
            app.UIAppPanel.showMenu(true);
        }
    }

    /*
    * h5切换牌桌，通知app切换主播源
    * data = {
    *    liveid: "xxx",     //app直播间id
    *    anchorid: "xxx",   //app主播id
    *    tableid: "xxx",    //牌桌id
    * }
    */
    changeTable = function (data) {
        cc.log("changeTable",data)
        let params = {
            key: AppBridge.ACTION.GAME_ACTION_CHANGE_TABLE, 
            value: {
                liveid: data.liveid || 0,
                anchorid: data.anchorid || 0,
                tableid: data.tableid,    
            }
        }
        app.postMessage(AppBridge.EVENT.GAME_ACTION, params);
    }


    //通过app消息设置房间上锁/开锁状态
    setRoomLocked = function (locked) {
        app._isRoomLocked = !!locked;
        // QYLogs.warn("App", "直播间上锁状态：locked="+app._isRoomLocked);
        app.native.emit(app.bridge.ACTION.APP_ACTION_ROOM_LOCK, app._isRoomLocked);
    }

    //获取房间是否已上锁
    getRoomLocked = function () {
        return app._isRoomLocked;
    }

    // 获取是否俱乐部mtt比赛
    getIsClubMttMatch = function () {
        return app._isClubMttMatch;
    }
    // 设置是否俱乐部mtt比赛
    setIsClubMttMatch = function (isMttMatch) {
        app._isClubMttMatch = isMttMatch;
    }

    //通过app消息设置特殊玩法/普通玩法
    setSpecialMode = function (special) {
        if (window.innerHeight < document.documentElement.clientHeight - 100) {
             //console.warn('Keyboard active, skip special mode resize');
            return;
        }
        special = !!special;
        if(app._isSpecialMode==special){
            return;
        }

        app._isSpecialMode = special;
        let width = 750;
        let height = 934;
        let height_special = 1334;
        if(special){
            height = height_special;
        }
        //键盘弹窗会导致重新绘制界面，直接去除
        
        // cc.view.setDesignResolutionSize(width, height, cc.view.getResolutionPolicy());
        // cc.view._resizeEvent(true);
        // // setTimeout(() => {
        //     window.dispatchEvent(new Event("resize"));
        //     // QYLogs.warn("App", "是否特殊玩法：special="+app._isSpecialMode);
        //     app.native.emit(app.bridge.ACTION.APP_ACTION_TOGGLE_FULLSCREEN, app._isSpecialMode);

            // cc._widgetManager.onResized();
        //     // cc.view._resizeEvent(true);
        //     //主动触发一次，避免延迟
        //     my.target.emit(my.event.RESIZE);
        // // }, 100);

    }

    //检查是否账号/token登录
    checkAccount = function () {
        let valid = UserInfo.isLogin();
        valid = valid && !UserInfo.isViewer();

        if(!valid){
            UIFrame.showLoginAccount();
        }
        return valid;
    }

    //设置loading面板位置
    setLoadingCenter = function(center){
        let position = center ? LoadingBlock.EPosition.CENTER : LoadingBlock.EPosition.BOTTOM;
        LoadingBlock.setContentPosition(position);
        LocalStorage.setItem(UserKey.LOADING_POSITION, position);
    }

    getLoadingCenter = function (skin, gameid) {
        let center = true;

        if(skin || gameid){
            center = app._getLoadingCenterBySkin(skin, gameid)
        }
        else{
            //获取loading面板位置
            let pos = LocalStorage.getItem(UserKey.LOADING_POSITION);
            if(!pos){
                pos = LoadingBlock.EPosition.CENTER;
            }
            center = Number(pos)==LoadingBlock.EPosition.BOTTOM ? false : true;
        }
        
        return center;
    }

    _getLoadingCenterBySkin = function (skin, gameid) {
        let center = true;
        //飞行棋
        if(gameid==133){
            center = true;
        }
        else{
            if(skin!="b"){
                center = false;
            }
        }
        return center;
    }

    //获取当前是否特殊玩法
    getSpecialMode = function () {
        return app._isSpecialMode;
    }

    setCacheSkin = function (skin) {
        app._skinCurrent = skin;
    }
    getCacheSkin = function () {
        let skin = !!app._skinCurrent ? app._skinCurrent : ""
        return skin;
    }
    setInGame = function (ingame) {
        app._ingame = !!ingame;
    }
    getInGame = function (params) {
        return !!app._ingame;
    }

    //获取是否管理员
    getIsAdminUser = function () {
        return app._isAdminUser;
    }

    //设置是否管理员
    setIsAdminUser = function (adminUser) {
        app._isAdminUser = adminUser;
    }

    //获取是否vip
    getIsVipUser = function () {
        return app._isAdminUser;
    }

    //设置是否vip
    setIsVipUser = function (vipUser) {
        app._isVipUser = vipUser;
    }

    //获取App兼容版本号
    getCompatibleVersion = function () {
        return app._compatibleVersion;
    }

    //设置App兼容版本号
    setCompatibleVersion = function (version) {
        app._compatibleVersion = version;
    }

    /**
     * 兼容版本对比
     * @param {string} compareVersion 需要作对比的版本
     * @returns {boolean} true: 兼容，false：不兼容
     * @description 与APP传入的 compatibleVersion 版本比较，返回boolean表示是否兼容
     * @description app兼容版本(compatibleVersion) 大于 实参(compareVersion) 时，返回true表示兼容
     */
    compareCompatibleVersion = function (compareVersion) {
        compareVersion = compareVersion || "1.0.0.0";

        //app版本
        let version = this.getCompatibleVersion();
        if(!version){
            return false;
        }
        
        let verArray = version.split(".");
        //对比版本
        let compareArray = compareVersion.split(".");
        let result = 0;
        let length = Math.min(verArray.length, compareArray.length)
        for (let i = 0; i < length; i++) {
            //app版本
            let v1 = Number(verArray[i]);
            //对比版本
            let v2 = Number(compareArray[i]);
            if (v1 > v2){
                result = 1;
                break;
            }
            else if(v1 < v2){
                result = -1;
                break;
            }
        }
        if(result==0 && verArray.length != compareArray.length){
            result = verArray.length < compareArray.length ? -1 : 1;
        }
        return result>0 ? true : false;
    }

    //通知app游戏内打开了顶层界面
    openTopPanel = function(){
        let handle = (app.config.SKIN == "default") ? true : false;

        cc.log("openTopPanel：handle = ", handle)
        if(!handle){
            return;
        }

        app._topPanelCount++;
        if(app._topPanelCount>1){//已打开过
            return;
        }

        if (app._hideGame && app._hideGame == 1){
            return;
        }
        
        app.native.openGameTopPanel();
    }
    //通知app游戏内关闭了顶层界面
    closeTopPanel = function () {
        let handle = (app.config.SKIN == "default") ? true : false;

        cc.log("closeTopPanel：handle = ", handle)
        if(!handle){
            return;
        }
        
        app._topPanelCount--;
        if(app._topPanelCount<0){//已清理过
            app._topPanelCount = 0;
            return;
        }

        if (app._hideGame && app._hideGame == 1){
            return;
        }

        if(app._topPanelCount==0){
            app.native.closeGameTopPanel();
        }   
    }
    //清除全部顶层界面计数
    clearTopPanel = function () {
        let handle = (app.config.SKIN == "default") ? true : false;

        // cc.log("clearTopPanel：handle = ", handle)
        if(!handle){
            return;
        }
        if(app._topPanelCount>0){
            app._topPanelCount = 1;
            app.closeTopPanel();
        }
        app._topPanelCount = 0;
    }

    //app隐藏或者显示游戏
    appShowOrHideGame(isShow){
        if (isShow){
            //显示游戏
            app._hideGame = 0;
        }else{
            //隐藏游戏
            app._hideGame = 1;
        }

        if (isShow){
            if (app._topPanelCount >= 1){
                app.native.openGameTopPanel()
            }
        }else{
            if (app._topPanelCount >= 1){
                app.native.closeGameTopPanel()
            }
        }
    }

    getCanShowLoading(){
        return this._canShowLoading;
    }
    setCanShowLoading(value){
        this._canShowLoading = !!value;
    }
    stopTimestamp(options){
        this._launchTimestamp.loginAccount = this._launchTimestamp.loginAccount || options.loginAccount;
        this._launchTimestamp.loginHall = this._launchTimestamp.loginHall || options.loginHall;
        this._launchTimestamp.launchGame = this._launchTimestamp.launchGame || options.launchGame;

        if(this._launchTimestamp.loginAccount && this._launchTimestamp.loginHall && this._launchTimestamp.launchGame){
            window.arrayTimestamp = null;
        }
    }
    /**
     * 
     * @param {String} func_name 要调用的函数名
     * @param  {...any} args 函数参数，支持多个
     * @returns 
     * result={
     *  success: boolean,   //函数存在则为 true
     *  data: any           //函数返回值
     * }
     */
    invokeFunction(func_name, ...args){
        let result = {
            success: true,
            data: null,
        }

        let func = this[func_name];

        if(typeof func == 'function'){
            result.data = func.apply(this, args);
            if(typeof result.data == 'undefined'){
                result.data = null;
            }
        }
        else{
            result.success = false;
             //console.warn(`[ERROR] 主包方法 "${func_name}" 不存在 `);
            if(app.config.POST_INVOKE_FUNC_ERROR){
                app.postMessage(AppBridge.EVENT.GAME_ERROR, {
                    error: AppBridge.errorID(203)
                });
            }
        }

        return result;
    }
}

module.exports = AppBase;