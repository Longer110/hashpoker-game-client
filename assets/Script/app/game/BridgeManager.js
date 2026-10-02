// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: H5与APP消息桥接管理
// ]]

require("my");
let AppBridge = require("AppBridge");
let BridgeBase = require("BridgeBase");
// let MsgManager = require("MsgManager");
// let MSG_NOTIFY = require("Msg_notify");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let ConfigGame = require("ConfigGame");
let LocalStorage = require("LocalStorage");
let UserInfo = require("UserInfo");
let i18n = require("i18n");
    
// let AppExternal = require("AppExternalManager");

class BridgeManager extends BridgeBase{
    // _external = null; //当前扩展包项目
    // _mapExternal = new Map();
    // _mapEvents = new Map();

    constructor(ctrl){
        super(ctrl);
        this.name = this.constructor.name;

        // 在 AppManager 中完成初始化后调用
        // this.load();
    }

    // _onMessage (event) {
    //     super._onMessage(event);
    // }

    onMessage (event) {
        if(event && typeof event=='object'){
            if(typeof event.msg == 'undefined'){
                cc.warn("BridgeManager. error event=", event);
                return;
            }
        }

        // if(!app.manager || !app.manager.isGameEnvInited()){
        //     cc.warn("[ERROR] BridgeManager", "游戏脚本环境尚未初始化完成", event);
        //     app.postMessage(AppBridge.EVENT.GAME_ERROR, {
        //         error: AppBridge.errorID(100)
        //     });
        //     return;
        // }

        let data = event.data || {};
        let center = true;
        let skin_in = data.skin || "";
        let gameid = data.gameid || "";

        if(event.msg==AppBridge.EVENT.SUBGAME_ENTER_START){
            App.resumeMusic();
        }

        if(data.tableid){
            data.tableid = data.tableid.replace(new RegExp("%23", 'g'), "#");
        }

         //console.log("BridgeManager.onMessage", event.msg, data);
        switch (event.msg) {
            case AppBridge.EVENT.CACHE_START:
                window.logTimestamp("BridgeManager.js handle 'CACHE_START'");

                this._onCacheStart(data);
                //指定皮肤
                if(typeof skin_in == 'string' && skin_in != ""){
                    skin_in = Utils.getSubgameValidSkin(gameid, skin_in);
                    if(ConfigGame.SKIN!=skin_in){
                        ConfigGame.SKIN = skin_in;
                    }
                    //保存skin，避免被账号登录时服务器返回的skin覆盖
                    app.setAppSkin(skin_in);
                }
                // center = App.getLoadingCenter(ConfigGame.SKIN, data.gameid);
                // App.setLoadingCenter(center);
                    
                break;
            case AppBridge.EVENT.SUBGAME_ENTER_START:
                window.logTimestamp("BridgeManager.js handle 'SUBGAME_ENTER_START'");
                
                if(data.from == "hall"){
                    app.config.FROM = data.from;
                }
                else{
                    app.config.FROM = app.config.FROM_DEFAULT;
                }

                //单机版禁用服务器
                if(data.single == "1"){
                    app.config.IS_SINGLE = true;
                    config.NEED_WAIT_FOR_CHECKED = false;
                    //禁用游戏服网络连接
                    app.net.setEnabled(false);
                    if(!data.tableid){
                        data.tableid = "single";
                    }
                }
                //指定为机器人模式（表示该合集游戏进入的都是只有机器人的房间）
                if(data.robot == "1"){
                    config.IS_ROBOT = true;
                }
                
                app.showLoading();
                
                this._gamestarted = true;
                let isAnchor = Number(data.anchor)==1 ? true : false;
                App.setIsAnchor(isAnchor);
                let isAdminUser = Number(data.adminuser) == 1 ? true : false;
                App.setIsAdminUser(isAdminUser);
                let isVipUser = Number(data.vipuser) == 1 ? true : false;

                //是否俱乐部mtt比赛
                if(data.isClubMttMatch){
                    App.setIsClubMttMatch(true);
                }else{
                    App.setIsClubMttMatch(false);
                }

                if(data.tableswitch != null){
                    let isTableSwitch = Number(data.tableswitch) == 1 ? true : false;
                    if(isTableSwitch){
                        app.config.SELECT_TABLE_SWITCH = true
                        app.config.VIDEO_BTN_SWITCH = true
                    }else{
                        app.config.SELECT_TABLE_SWITCH = false
                        app.config.VIDEO_BTN_SWITCH = false
                    }
                }else{
                    app.config.SELECT_TABLE_SWITCH = true
                    app.config.VIDEO_BTN_SWITCH = true
                }
                
                
                App.setIsVipUser(isVipUser);
                if(data.compatibleVersion){
                    app.setCompatibleVersion(data.compatibleVersion); //app兼容版本号
                }

                if(typeof data.console != 'undefined'){
                    let num_console = Number(data.console);
                    if(num_console===1){
                        cc.debug.setDisplayStats(true);
                    }
                    else if(num_console===0){
                        cc.debug.setDisplayStats(false);
                    }
                }
                //指定服务器区域
                if(typeof data.area == 'string'){
                    if(app.config.AREA != data.area){
                        if(app.login){
                            app.config.AREA = data.area;
                            app.login.updateGameServerByArea(app.config.AREA);
                        }
                    }
                }
                
                //指定皮肤
                if(typeof skin_in == 'string' && skin_in != ""){
                    skin_in = Utils.getSubgameValidSkin(gameid, skin_in);
                    if(ConfigGame.SKIN!=skin_in){
                        ConfigGame.SKIN = skin_in;
                    }
                    //保存skin，避免被账号登录时服务器返回的skin覆盖
                    app.setAppSkin(skin_in);
                }
                center = App.getLoadingCenter(ConfigGame.SKIN, data.gameid);
                App.setLoadingCenter(center);

                //指定密码房
                if(data.passwordroom && Number(data.passwordroom)==1){
                    ConfigGame.PASSWORDROOM = Number(data.passwordroom);
                }
                
                //指定gameid
                if(typeof data.gameid == 'string'){
                    data.gameid = Number(data.gameid);
                }

                //指定token
                if(data.token){
                    data.loginType = UserInfo.ELoginType.TOKEN;
                    // UserInfo.setInfo({
                    //     loginType: UserInfo.ELoginType.TOKEN,
                    // })

                    if(data.viewer && Number(data.viewer)==1){
                        QYLogs.error("BridgeManager", "不需要同时指定token和viewer参数！");
                    }
                }
                //指定viewer
                else if(data.viewer && Number(data.viewer)==1){
                    data.loginType = UserInfo.ELoginType.VIEWER;
                    // UserInfo.setInfo({
                    //     loginType: UserInfo.ELoginType.VIEWER,
                    // })
                }
                else if(data.loginType == UserInfo.ELoginType.ACCOUNT){
                }else if(data.loginType == UserInfo.ELoginType.PHONE){
                }else if(data.loginType == UserInfo.ELoginType.MAILBOX){
                }else{
                    if(data.loginType == UserInfo.ELoginType.GUEST){

                    }
                    else{
                        data.loginType = UserInfo.ELoginType.GUEST;
                        cc.warn("BridgeManager", "未指定登录模式，默认为游客登录");
                    }
                    // UserInfo.setInfo({
                    //     loginType: UserInfo.ELoginType.GUEST,
                    // })
                }
                if(data.viewinfo){
                    app.game.setViewInfo(data.viewinfo);
                }
                this._activeIndex++;
                let curIndex = this._activeIndex;

                this._langupdated = false;
                
                //别名转换
                data.lang = Utils.converLanguage(data.lang, app.config.LANGALL);
                //子游戏多语言有效性判断
                data.lang = Utils.getSubgameValidLang(gameid, data.lang);
                //更新公共包多语言
                this.updateLanguage(data.lang, function (success) {
                    if(curIndex!=this._activeIndex){//表示有多次加载了
                        //忽略本次，避免多次回调
                        return;
                    }

                    if(!success){
                        App.postMessage(AppBridge.EVENT.GAME_ERROR, {
                            error: AppBridge.errorID(109)
                        });
                        return;
                    }

                    this._langupdated = true;
                    // App.AppManager._loginServer(data);
                    // // MsgManager.fire(MSG_NOTIFY.LOGICAL.SUBGAME_ENTER_START);
                    this._onSubgameEnterStart(data);
                }.bind(this));
                break;
            case AppBridge.EVENT.SUBGAME_EXIT_START:
                this._onExitSubgame(data);
                break;
            case AppBridge.EVENT.ROOM_CLOSE:
                this._onLiveRoomClose(data);
                break;
            case AppBridge.EVENT.APP_ACTION:
                //直播间上锁/开锁
                if(data.key==AppBridge.ACTION.APP_ACTION_ROOM_LOCK){
                    let locked = data.value=="on" ? true : false;
                    App.setRoomLocked(locked);
                }else if(data.key==AppBridge.ACTION.APP_ACTION_TOGGLE_FULLSCREEN){ //app全屏时切换h5特殊玩法
                    let value = data.value=="on" ? true : false;
                    App.setSpecialMode(value);
                }
                else if(data.key==AppBridge.ACTION.APP_ACTION_ENTER_FOREGROUND){
                    cc.log("APP_ACTION_ENTER_FOREGROUND")
                    cc.game.emit(cc.game.EVENT_SHOW);
                }
                else if(data.key==AppBridge.ACTION.APP_ACTION_ENTER_BACKGROUND){
                    cc.log("APP_ACTION_ENTER_BACKGROUND")
                    cc.game.emit(cc.game.EVENT_HIDE);
                }
                else if(data.key==AppBridge.ACTION.APP_ACTION_GAME_SHOW){
                    cc.log("APP_ACTION_GAME_SHOW")
                    app.isRunOnBackground = false;
                    if(cc.sys.os==cc.sys.OS_IOS){
                        app.audio.resumeContent();
                    }
                    app.resumeMusic();
                    app.appShowOrHideGame(true);
                }
                else if(data.key==AppBridge.ACTION.APP_ACTION_GAME_HIDE){
                    cc.log("APP_ACTION_GAME_HIDE")
                    app.isRunOnBackground = true;
                    app.pauseMusic();
                    app.appShowOrHideGame(false);
                }
                else{
                    app.native.emit(data.key, data.value);
                }
                break;
            case AppBridge.EVENT.GAME_ACTION:
                if(app.url.get("live")){
                    //视频触发全屏消息测试
                    if(data.key==AppBridge.ACTION.GAME_ACTION_TOGGLE_VIDEO){
                        let value = data.value=="on" ? false : true;
                        App.setSpecialMode(value);
                    }
                }
                break;
            default:
                if(!app.url.get("live") && !app.url.get("nomsg")){
                    cc.warn("BridgeManager", "unhandle event: ", event.msg, event);
                }
                break;
        }
    }

    postMessage (msg, data) {
        if(msg==AppBridge.EVENT.GAME_HIDE){
            if(!app.url.get("live") && !app.url.get("nomsg") && msg==AppBridge.EVENT.GAME_HIDE){
                let man = App.AppManager;
                if(man && (!man._langupdated || !man._gamestarted)){
                    cc.log("App", "未收到 SUBGAME_ENTER_START 消息或更新语言包失败", man._langupdated, man._gamestarted);
                }
            }
            App.pauseMusic();
        }
        else if(msg==AppBridge.EVENT.SUBGAME_ENTER_FINISH){
            let game = app.game.getGame();
            if(game){
                app.user.setInfo({
                    gameid: game.getSubGameID(),
                });
            }
            if(data && typeof data.error!='undefined'){
                if(data.error==AppBridge.errorID(0)){
                    UIFrame.clearAllBlock();
                }
            }
        }
        else if(msg==AppBridge.EVENT.SUBGAME_EXIT_FINISH){
            app.game.clearData();
            app.game.setRoomList([]);
            app.user.clearGame();
            UIFrame.clearAllBlock();
            
            app.setRoomLocked(false);

            if(app.config.IS_LIVE_ONLY){
                if(!app.config.IS_CLUB_ONLY){
                    //非网页版，退出游戏后断开连接，避免重连
                    if (!app.url.get("live") && !app.url.get("nomsg")) {
                        app.net.release();
                    }
                    app.pauseMusic();
                }
            }

            if(this._ctrl){
                this._ctrl.exit();
            }
        }
        else if(msg==AppBridge.EVENT.GAME_ERROR){
            if(app.config.IS_LIVE_ONLY){
                if(data&&(data.error==AppBridge.errorID(102))){
                    UIFrame.showBlockText(i18n.t("COMMON.JIA_ZAI_ZHONG"));
                    cc.error(i18n.t("COMMON.JIA_ZAI_ZHONG"));
                }
                if(data&&(data.error==AppBridge.errorID(104))){
                    UIFrame.showBlockText(i18n.t("COMMON.FAN_HUI_PAI_JU_1"));
                    cc.error(i18n.t("COMMON.FAN_HUI_PAI_JU_1"));
                }
            }
        }
        
        if(this._mwgame){
        }
        else if(my.url.get(this.UNI_FLAG)==1 && this._uni){
        }
        else{
            if(my.url.get("live")){
                if(msg==AppBridge.EVENT.GAME_ACTION){
                    //视频触发全屏消息测试
                    if(data.key==AppBridge.ACTION.GAME_ACTION_TOGGLE_VIDEO){
                        this.onMessage(
                            {
                                msg: msg,
                                data: data,
                                key: AppBridge.CLIENT_KEY,
                            } 
                        );
                    }
                }     
            }
        }

        super.postMessage(msg, data);
    }

    /**
     * 更新语言包配置
     *
     * @param {Object} data(lang, list)
     */
    updateLanguage(value, onComplete){
        if(!value){
            onComplete(true);
            return;
        }

        // value = Utils.converLanguage(value, app.config.LANGALL);
        if(value==LocalStorage.getSysLanguage()){
            onComplete(true);
            return;
        }
        //更新多语言文字
        i18n.init(value);

        //先更新环境变量，框架加载语言配置文件需要用到
        let env_lang = my.env.get("lang");
        if(env_lang!=value){
            my.env.set({
                lang: value,
            });
        }

        cc.warn(`BridgeManager._updateLanguage: newLang=${value}, oldLang=${app.config.LANG}, oldEnvLang=${env_lang}`);
        my.res.loadCommonBundleLang(function (e) {
            if(e){
                var msg = "获取游戏语言资源出错";
                cc.warn("BridgeManager", msg);
                onComplete(false);
                return;
            }
            else{
                app.config.LANG = value;
                LocalStorage.setSysLanguage(value);
                onComplete(true);
            }
        })
    }

    /**
     * 开始缓存资源
     *
     * @param {Object} data(lang, list)
     */
    _onCacheStart (data) {
        let list = data.list;
        if(!(list instanceof Array)){
            cc.error("BridgeManager", "data.list must be an Array");
            return;
        }
        
        let count = 0;
        let result = [];
        let callback = function (object, gameid) {
            if(object){
                result.push(gameid);
            }
            count++;
            if(count==list.length){
                if(window._chesssetTimeStart){
                    let duration = (Date.now()-window._chesssetTimeStart)/1000;
                    duration = duration.toFixed(2);

                    cc.log("ChessSetTime. cache_finished: "+duration+"(s)");
                }
                
                window.logTimestamp("CACHE_FINISH => 'to app'");

                App.postMessage(AppBridge.EVENT.CACHE_FINISH, {
                    list: result,
                });
            }
        }.bind(this);
        for (let index = 0; index < list.length; index++) {
            const gameid = list[index];
            this._preloadSubGame({gameid: gameid}, function (object) {
                callback(object, gameid);
            })
        }
    }

    /**
     * 
     *
     * @param {*} data
     * @param {*} onComplete
     * @param {*} onProgress
     * @returns
     */
    _preloadSubGame (data, onComplete, onProgress) {
        let self = this;
        let TAG = "BridgeManager";

        let item = my.bundle.getWebBundleConfig(data.gameid);
        if(!item){
            item = app.game.getGameItem(data.gameid);
        }
        if(!item){
            App.postMessage(AppBridge.EVENT.GAME_ERROR, {
                error: AppBridge.errorID(201)
            });
            cc.error(TAG, "未配置的游戏 gameid="+data.gameid);
            return;
        }

        let sceneName = item.sGamePath;
        
        this._loadZipData(sceneName, function (object) {
            if(onComplete){
                onComplete(object);
            }
            else{
                cc.warn(TAG, "下载完成 sceneName="+sceneName);
            }
        }, 
        function (evt) {
            if(onProgress){
                onProgress(evt);
            }
            else{
                if (evt.lengthComputable && evt.total>0) {
                    var percentComplete = evt.loaded / evt.total;
                    cc.warn(TAG, "下载资源包进度:" + sceneName, percentComplete);
                }
            }
        });
    }

    _loadZipData (name, onComplete) {
        //TODO
        onComplete&&onComplete({name});
    }

    _onSubgameEnterStart (data) {
        //先登录，登录成功后再进入游戏
        app.manager._loginServer(data);
    }

    _onExitSubgame (data) {
        let scene = cc.director.getScene();
        if(!scene || scene.name=="[EMPTY]"){
            App.postMessage(AppBridge.EVENT.SUBGAME_EXIT_FINISH, {});
        }
        else{
            app.native.emit(app.bridge.EVENT.SUBGAME_EXIT_START, {
                gameid: (data && data.gameid) || 0
            });
        }
    }

    _onLiveRoomClose (data) {
        let scene = cc.director.getScene();
        if(!scene || scene.name=="[EMPTY]"){
            UIFrame.showBlockText(i18n.t("COMMON.YOU_XI_CLOSE"), function () {
                // UIFrame.loadScene("hall");
            });
        }
        else{
            app.native.emit(app.bridge.EVENT.ROOM_CLOSE);
        }
    }

    // _isExternal(item){
    //     let isExternal = (item && item.ExternalKey && item.ExternalKey!="") ? true : false;
    //     return isExternal;
    // }
}

// BridgeManager.default = new BridgeManager(null);
module.exports = BridgeManager;