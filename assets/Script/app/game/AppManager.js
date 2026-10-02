// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let my = require("my");
// let BridgeManager = require("BridgeManager");
let MsgManager = require("MsgManager");
let MSG_LOGIN = require("Msg_login");
// let MSG_NOTIFY = require("Msg_notify");
// let MSG = require("Msg");
let UIFrame = require("UIFrame");
let Utils = require("Utils");
let AppBridge = require("AppBridge");
let AppWebApi = require("AppWebApi");
let LocalStorage = require("LocalStorage");
let UserInfo = require("UserInfo");
let ConfigGame = require("ConfigGame");
let i18n = require("i18n");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;
let UtilManager = require("UtilManager");

let UIDialog = require("UIDialog");
let MSG_FRAMEWORKS = require("Msg");

let FIRST_LAUNCH = true;
let CACHE_ZIP_DATAS = {};
cc.Class({
    extends: cc.Component,

    properties: {
        _inited: false,
        _gamestarted: false,
        _langupdated: false,
        _blockIndex: 0,
        _timeoutid: 0,
        _activeIndex: 0,
        _gameEnvInited: false,
        _events: null,
        _externals: null,
        _handlingGameID: 0, //是否有正在处理进入的游戏 gameid
    },

    // LIFE-CYCLE CALLBACKS:

    register () {
        window.logTimestamp("AppManager.js 'register'");

        app.register("manager", this);

        this._scenes = {};
    
        // MsgManager.on(AppBridge.MESSAGE, this._onMessage, this);
        // MsgManager.on(MSG_LOGIN.NOTIFY.LOGIN_SUCCESS, this._onLoginSuccess, this);
        target.on(event.HALL_LOGIN_FINISH, this._onLoginSuccess, this);
        my.target.on(my.event.SUBGAME_EXIT_FINISH, this._exitSubgame, this);
    },
    unregister(){
        // MsgManager.un(this._onMessage);
        // MsgManager.un(this._onLoginSuccess);
        target.targetOff(this);
        my.target.targetOff(this);
        this._clearTimeout();
    },

    start () {
        // this._initManager();
    },



    // update (dt) {
    //     if(FIRST_LAUNCH && App.isLoaded()){
    //         FIRST_LAUNCH = false;

    //         if (!cc.sys.isNative) {
    //             this._initBundle();
    //         }
    //     }
    //     // BridgeManager.default.update(dt);
    // },

    _clearTimeout(){
        if(this._timeoutid>0){
            clearTimeout(this._timeoutid);
            this._timeoutid = 0;
        }
    },
    
    invoke(onComplete){
        this._initBundle(onComplete);
    },

    _initBundle(onComplete){
        if(this._inited){
            onComplete&&onComplete();
            return;
        };

        this._inited = true;

        window.logTimestamp("AppManager.js 游戏版本号: main = " + app.config.VERSION);

        if(window._chesssetTimeStart){
            let duration = (Date.now()-window._chesssetTimeStart)/1000;
            duration = duration.toFixed(2);
            cc.log("ChessSetTime. game_inited: "+duration+"(s)");
        }
        
        // let options = {
        //     autoStart: false,
        //     autoLoginHall: false,
        // }
        
        this.showBlockText(i18n.t("COMMON.JIA_ZAI_ZHONG"));
        
        let self = this;

        self._initManager(onComplete);
    },

    _initWebBundleConfigs(callback){
        let platform = app.config.PLATFORM;
         //console.log("请求Web Bundle配置", platform);
        my.bundle.requestWebBundleConfigs(platform, callback, true);
    },

    _initManager(onComplete){


        let self = this
        let handlerInit = function () {
            if(app.config.SHOW_TEST_GAME){
                //开发版设置测试游戏列表
                let url_manager = app.url.get("manager");
                let url_gamecode = app.url.get("gamecode");
                let url_depends = app.url.get("depends");
                let url_folder = app.url.get("folder");
                let url_bundlemd5 = app.url.get("bundlemd5");

                if(url_gamecode){
                    let item = {
                        nGameId: url_gamecode,
                        sGamePath: url_gamecode,
                        manager: url_manager,
                        depends: url_depends,
                        folder: url_folder == "0" ? null : url_manager,
                        sMD5FilePath: url_bundlemd5,
                        md5: url_bundlemd5,
                        langs: null,
                    }
                    let config = my.bundle.getWebBundleConfig(url_gamecode);
                    if(config){
                        item.isLive = config.isLive;
                        item.sGamePath = config.sGamePath;
                        item.manager = config.manager;
                        item.depends = config.depends;
                        item.sMD5FilePath = config.sMD5FilePath;
                        item.md5 = config.md5;
                        item.langs = config.langs;
                    }
                    else if(!url_manager && !url_bundlemd5){
                        cc.error("AppManager", "web配置未上传. gamecode=", url_gamecode);
                    }
                    app.config.TEST_GAME_ITEM = [item];
                }                
                if (app.config.TEST_GAME_ITEM instanceof Array) {
                    app.game.setExtendGameList(app.config.TEST_GAME_ITEM);
                }
            }
        
            self._initGame();
            onComplete&&onComplete();
        }


        if(app.config.IS_CLUB_ONLY){
            handlerInit();
        }else{
            this._initWebBundleConfigs((list)=>{
                handlerInit();
            });
        }
    },

    _initGame(){
        if(this.isGameEnvInited()){
            return;
        }
        
        this.setGameEnvInited();
        
        // window.logTimestamp("GAME_INITED => 'to app'");

        // app.postMessage(AppBridge.EVENT.GAME_INITED, {
        //     version: app.config.VERSION,
        // });

        
        if(!app.config.IS_LIVE_ONLY){
            this.hideBlockText();
            this._initGameSet();
            return;
        }
        else{
            this._initGameLive();
        }
    },

    _initGameSet(){
        //构建后由main.js启动
        if(CC_BUILD){
            return;
        }

        app.res.loadLogin();
    },

    _initGameLive(){
        //如果是单机版
        if(app.config.IS_SINGLE){
            let info = UserInfo.getInfo();
            if(info.gameid){
                this._enterSubGame({
                    gameid: info.gameid,
                    tableid: info.tableid,
                })
            }
            return;
        }

        //网页测试版 live=1
        if(app.url.get("live")){
            cc.log("live=====")
            this.hideBlockText();
            
            if(app.url.get("account") || app.url.get("guest")){
                // MsgManager.fire(MSG_LOGIN.NOTIFY.LOGIN_INIT, true);
                target.emit(event.GAME_LAUNCH_SUCCESS);
                return;
            }
            if(app.url.get("viewer")){
                this._loginServerViewer();
                return;
            }
            
            // if(!CC_BUILD){//build版启动场景即是launch，不需要跳转
            //     UIFrame.loadScene("launch");
            // }
            
            QYLogs.warn("AppManager", "webapi:", AppWebApi.host());
            if(UserInfo.getInfo().token){
                this._loginServerToken(UserInfo.getInfo().token);
                return;
            }

            this.getAccountToken(function (error, token) {
                if(error){
                    return;
                }

                MsgManager.fire(MSG_LOGIN.NOTIFY.LOGIN_TOKEN);
            })
        }
        //直播PC版 nomsg=1
        else if(app.url.get("nomsg")){
            this.hideBlockText();
            cc.log("直播PC版")
            if(app.url.get("viewer")){
                this._loginServerViewer();
            }
            else{
                let token = app.url.get("token");
                if(token){
                    this._loginServerToken(token);
                }
                else{
                    QYLogs.error("AppManager", "无效的登录方式")
                }
            }
        }
        else{
            if(cc.sys.isBrowser){
                //开发环境下自动跳转
                // if(CC_DEV || CC_DEBUG){
                //     //uniapp测试demo
                //     if(app.url.get("uni")){

                //     }
                //     else{
                //         let uri = window.location.href;;
                //         let prefix = '?';
                //         let _noCacheRex = /\?/;
                //         if (_noCacheRex.test(uri)){
                //             prefix = '&';
                //         }
                        
                //         uri = uri + prefix + "live=1";
                //         window.location.href = uri;
                //     }
                // }
                //其它版本由消息驱动
            }
            else{
                cc.log("开发环境下自动跳转")
                
                //开发环境下自动跳转
                if(CC_DEV || CC_DEBUG || app.config.IS_APPGAME){
                    this.hideBlockText();
                    my.res.loadLogin(()=>{
                    });
                }
            }
        }
    },
    //浏览环境是否已初始化
    isGameEnvInited(){
        return this._gameEnvInited;
    },
    setGameEnvInited(){
        this._gameEnvInited = true;
    },
    showBlockText(strText){
        this.hideBlockText();

        let dotAnimation = true;
        let callback = null;
        let timeout = 60*10; //10分钟
        this._blockIndex = UIFrame.showBlockText(strText, dotAnimation, callback, timeout);
    },
    hideBlockText(){
        if(this._blockIndex>0){
            UIFrame.hideBlockText(this._blockIndex);
            this._blockIndex = 0;
        }
    },

    _isValid(value){
        let valid = (value!=null && value != undefined && value != '' && value != '0');
        return valid;
    },

    _hasPlayingGame(gameid){
        return this._isValid(gameid);
    },
    _isInSubGame(){
        //当前界面是否还在子游戏中
        let subGameID = app.game.getGameID();
        if (subGameID <= 0) {
            return false;
        }

        return true;
    },
    _showDialog(text, callback, showType = UIDialog.EShowType.OKCANCEL){
        let params = {};
        params.showType = showType;
        params.text = text;
        params.callback = function (isOK) {
            callback&&callback(isOK);
        }.bind(this);
        MsgManager.fire(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, params);
    },

    //登录成功
    _onLoginSuccess(data){
        // 获取新的 web 子包配置
         //console.log("大厅登录成功", JSON.stringify(data));
        this._initWebBundleConfigs(()=>{
            cc.log("Web Bundle配置初始化完成");
            this._handleLoginSuccess(data);
        })
    },

    _handleLoginSuccess(data){     
       

        //在第三方厂商扩展包内，不处理登录事件
        if(app.checkInThirdExternal()){
            return;
        }

        //设置大厅登录状态
        UserInfo.setInfo({
            boolHallLogined: true,
        })
        
        let info = UserInfo.getInfo();
        let gameid = info.gameid;
        let tableid = info.tableid;
        let roomid = -1;
        let subGameID = app.game.getGameID();
            
        let handle = () => {
            if(!this._isValid(gameid) && this._isInSubGame()){
                gameid = subGameID;
            }
            //如果服务器返回正在进行中的游戏数据，优先使用服务器返回的数据，其它设置的gameid相关的参数目前不全
            if(data.tCurrentPlay){
                gameid = data.tCurrentPlay.nGameId || gameid;
                tableid = data.tCurrentPlay.sTableId || tableid;
                roomid = data.tCurrentPlay.nRoomId || roomid;
                // nClubId = data.tCurrentPlay.nClubId;
            }
            if(!this._isValid(gameid)){
                QYLogs.warn("AppManager", "不在游戏中，通知当前场景进入大厅");
                target.emit(event.HALL_ENTER_START);
            }
            else{
                QYLogs.warn("AppManager", "当前子游戏 gameid=", gameid);
    
                //需要先加载扩展包
                this._loadAndEnterSubGame({
                    gameid,
                    tableid,
                    roomid,
                });
            }
        }

        //是否app内的直播
        let isAppLive = false;
        if(app.config.IS_LIVE_ONLY){
            isAppLive = !app.url.get("live") && !app.url.get("nomsg");
        }

        //非app内直播才替换gameid，断线重连直接进服务器返回的游戏
        if(!isAppLive){
            let playingGameData = data.tCurrentPlay || {};
            //如果存在断线重连游戏数据
            if (this._isValid(playingGameData.nGameId)) {
                QYLogs.warn("AppManager", "设置服务器返回的 gameid : ", gameid, playingGameData.nGameId);
                let go_to_old_game = false;
                //同一游戏
                if(gameid == playingGameData.nGameId){
                    go_to_old_game = true;

                    gameid = playingGameData.nGameId;
                    if (this._isValid(playingGameData.sTableId)) {
                        QYLogs.warn("AppManager", "设置服务器返回的 tableid : ", gameid, playingGameData.sTableId);
                        tableid = playingGameData.sTableId;
                    }
                    if(typeof playingGameData.nRoomId == 'number'){
                        roomid = playingGameData.nRoomId;
                        QYLogs.warn("AppManager", "设置服务器返回的 roomid : ", roomid);
                    }   
                }
                //不同游戏，这里可以不处理，在子游戏房间列表（或子游戏登录时）处理
                else{                                 
                }

                cc.log("加载大厅界面")
                handle(); 
            }
        }
        //app 内的直播不要替换 gameid ，由 SubGameBase 发送 app.bridge.errorID(104) 消息
        else{
            //当前存在想要进入的游戏
            if(this._isValid(gameid)){
                let playingGameData = data.tCurrentPlay || {};
                if(playingGameData.sTableId){
                    //当前存在想要进入的牌桌，并且与服务器返回的正在进行中的牌桌不一致
                    if(tableid && tableid != playingGameData.sTableId){
                        app.postMessage(app.bridge.EVENT.GAME_ERROR,{
                            error: app.bridge.errorID(104),
                            value: {
                                gameid: playingGameData.nGameId,
                                tableid: playingGameData.sTableId,
                            }
                        });
                          
                        //设置大厅登录状态
                        UserInfo.setInfo({
                            boolHallLogined: false,
                        })
                        
                        return;
                    }             
                }
            }    
        }
                
        handle();
    },
    _loginServerAccount(){
        //先登录，登录完成再进入游戏
        QYLogs.warn("AppManager", "开始账号模式");
        let data = null;
        let controller = app.getComponent("LoginController");
        if(controller){
            data = controller._loginData;
        }
        MsgManager.fire(MSG_LOGIN.NOTIFY.LOGIN_START, data);
    },
    _loginServerViewer(){
        //先登录，登录完成再进入游戏
        QYLogs.warn("AppManager", "开始登录观众模式");
        MsgManager.fire(MSG_LOGIN.NOTIFY.LOGIN_VIEWER);
    },
    _loginServerToken(token){
        //使用新token
        UserInfo.setInfo({
            token: token,
        })

        //先登录，登录完成再进入游戏
        QYLogs.warn("AppManager", "开始登录token. token=" + token);
        MsgManager.fire(MSG_LOGIN.NOTIFY.LOGIN_TOKEN);
    },
    _loginServer(data){
        let token = data.token || "";
        if(!token && app.url.get("live")){
            token = app.url.get("token") || "";
        }

        let info = UserInfo.getInfo();
        let oldToken = info.token;
        let roomid = info.roomid || -1;
        UserInfo.setInfo({
            // token: token, //先不设置新token，避免新token未被使用时5分钟后失效，断线重连使用时就会无效
            gameid: data.gameid ? (data.gameid+"") : "",
            tableid: data.tableid || "",
        })

        cc.log('_loginServer',JSON.stringify(data), app.config.IS_SINGLE, app.config.FIRST_ENTER_SUBGAME)
        let handled = false;
        //单机版或者优先加载场景，都可以直接进游戏
        if(app.config.IS_SINGLE || app.config.FIRST_ENTER_SUBGAME){
            handled = true;
            this._enterSubGame(data);
        }

        //如果已登录，直接进入游戏
        if(UserInfo.isLogin()){
            //是否重新登录
            let relogin = false;
            //token存在且不一致时，重新登录
            if((oldToken || data.token) && (oldToken != data.token)){
                relogin = true;
            }
            //app切换登录方式
            if(relogin || !!data.loginType && data.loginType != UserInfo.getLoginType()){
                QYLogs.warn("AppManager", "用户已登录，但登录方式不一致：", relogin, UserInfo.getLoginType(), data.loginType);

                //断开旧连接，重新登录
                app.net.release();
                QYLogs.warn("AppManager", "断开旧连接，重连时会重新登录");
            }
            else{
                QYLogs.warn("AppManager", "用户已登录。token="+oldToken);
                cc.log('handled===',handled)
                if(!handled){
                    this._enterSubGame(data);
                }
                return;
            }
        }
        
        if(data.loginType==UserInfo.ELoginType.ACCOUNT 
            || data.loginType==UserInfo.ELoginType.PHONE || data.loginType==UserInfo.ELoginType.MAILBOX){
            this._loginServerAccount();
        }
        else if(data.loginType==UserInfo.ELoginType.VIEWER || data.loginType==UserInfo.ELoginType.GUEST ){
            this._loginServerViewer();
        }
        else{
            this._loginServerToken(token);
        }
    },


    // //检测版本
    // checkVersion(data){
    //     this._enterSubGame(data);
    // },

    _loadAndEnterSubGame(data){
        let item = my.bundle.getWebBundleConfig(data.gameid);
        if(!item){
            item = app.game.getGameItem(data.gameid);
        }

        if(!item){
            App.postMessage(AppBridge.EVENT.GAME_ERROR, {
                error: AppBridge.errorID(201)
            });
            QYLogs.error("AppManager", "未配置的游戏 gameid="+data.gameid);
            return;
        }

        //需要先加载扩展包
        app.bridgeController.loadExternal(item, null, (error)=>{
            if(error){
                QYLogs.error("AppManager", "加载子游戏主入口失败，通知当前场景进入大厅");
                target.emit(event.HALL_ENTER_START);
                return;
            }

            QYLogs.warn("AppManager", "加载扩展包主入口完成");

            // 进入游戏
            this._enterSubGame(data)
        });
    },

    /**
     * 
     * @param {Object} data {
     *  gameid,
     *  roomid,
     *  tableid,
     * }
     * @returns 
     */
    _enterSubGame(data){
        QYLogs.warn("AppManager", "_enterSubGame:", data);
        if(!data.gameid || data.gameid==""){
            return;
        }

        let item = my.bundle.getWebBundleConfig(data.gameid);
        if(!item){
            item = app.game.getGameItem(data.gameid);
        }

        if(!item){
            App.postMessage(AppBridge.EVENT.GAME_ERROR, {
                error: AppBridge.errorID(201)
            });
            QYLogs.error("AppManager", "未配置的游戏 gameid="+data.gameid);
            return;
        }

        if(data.tableid){
            data.tableid = data.tableid.replace(new RegExp("%23", 'g'), "#");
        }
        // else if(app.config.IS_LIVE_ONLY && item.isLive){
        //     App.postMessage(AppBridge.EVENT.GAME_ERROR, {
        //         error: AppBridge.errorID(201)
        //     });
        //     QYLogs.error("AppManager", "未配置的游戏牌桌 gameid="+data.gameid);
        //     return;
        // }

        let config = {
            nGameId: data.gameid,
            nRoomId: data.roomid,
            sGamePath: item.sGamePath,
            sTableId: data.tableid,
            isLive: item.isLive,
            nPass: data.nPass || "",
        }
        if(typeof config.nRoomId != 'number'){
            config.nRoomId = -1;
        }
        
        let self = this;
        let _onLaunched = function (isAlreadyLoaded) {
            self.clearHandlingGameID();
            self.hideBlockText();
            app.hideLoading();

            if(isAlreadyLoaded){
                QYLogs.log("AppManager", "场景已加载，不发消息进入完成消息。gameid=" + data.gameid);
                return;
            }

            window.logTimestamp("SUBGAME_ENTER_FINISH => 'to app'");

            if(window.arrayTimestamp){
                let msg = window.arrayTimestamp.join("\r\n");
                cc.log("\r\n===============================================");
                // cc.log(msg);
                QYLogs.log("AppManager", "加载时间汇总 " + app.config.PLATFORM + " ：\r\n" + msg);
                cc.log("===================================================\r\n");
                // app.arrayTimestamp = window.arrayTimestamp;
                window.arrayTimestamp = [];
                app.stopTimestamp({
                    launchGame: true
                })
            }

            let width = 750;
            let height = 445;
            let isPortrait = 0;
            let subgame = app.game.getGame();
            if(subgame){
                width = subgame.getIngameWidth();
                height = subgame.getIngameHeight();
                isPortrait = subgame.isLandscape() ? 0 : 1;
            }
            
            app.postMessage(app.bridge.EVENT.SUBGAME_ENTER_FINISH, {
                gameid: data.gameid,
                width: width,
                height: height,
                isPortrait: isPortrait,
                error: app.bridge.errorID(0)
            });
            return;
        }

        let subGameID = app.game.getGameID();
        
        //设置当前子游戏数据
        app.game.setData(config);

        //不同子游戏
        if(config.nGameId != subGameID && self._handlingGameID != config.nGameId){
            self._handlingGameID = config.nGameId;
            QYLogs.warn("AppManager", `通知进入不同子游戏: gameid=${config.nGameId}, oldGameid=${subGameID}`);
            app.target.emit(app.event.SUBGAME_RESTART, config, _onLaunched);
        }
        //原来已经在相同子游戏中
        else{
            if(self._handlingGameID != 0){
                QYLogs.warn("AppManager", `正在进入相同子游戏，无需重复处理: gameid=${config.nGameId}`);
                let subgame = app.game.getGame();
                //触发检测是否在其它游戏中
                if(subgame){
                    subgame.toggleChecking();
                }
                else{
                    QYLogs.warn("AppManager", `subgame 对象不存在: gameid=${config.nGameId}`);
                }
                return;
            }

            self._handlingGameID = config.nGameId;
            QYLogs.warn("AppManager", `重新进入相同子游戏，通知场景还原: gameid=${config.nGameId}`);
            app.target.emit(app.event.SUBGAME_START, config, _onLaunched);
        }
    },
    _exitSubgame(data){
        app.postMessage(app.bridge.EVENT.SUBGAME_EXIT_FINISH, {
            gameid: data.gameid,
            error: app.bridge.errorID(0)
        });
    },
    
    //callback(error, token);
    getAccountToken(callback, force){
        let self = this;
        let handler = function (error, account) {
            if(error){
                 //console.error("创建用户失败：", error);
                callback(error);
                return;
            }

            AppWebApi.getToken(account, function (error, response) {
                if(error){
                     //console.error("getToken Error:", error);
                    callback(error);
                    return;
                }
                let res = JSON.parse(response);
                if(res.status==0){//success
                    // let match = "token="
                    // let pos = res.url.indexOf(match);
                    // let token = "";
                    // if(pos>=0){
                    //     token = res.url.substr(pos+match.length);
                    // }

                    let token = app.url.parse(res.url, "token") || "";

                    let uri = window.location.href;;
                    if(token){
                        let prefix = '?';
                        let _noCacheRex = /\?/;
                        if (_noCacheRex.test(uri)){
                            prefix = '&';
                        }
                        
                        uri = uri + prefix + "token=" + token;
                    }
                    
                     //console.warn("getToken success: token=" + token);
                    // window.location.href = uri;
                    UserInfo.setInfo({
                        token: token,
                    })
                    // MsgManager.fire(MSG_LOGIN.NOTIFY.LOGIN_TOKEN);
                    callback(null, token);
                    return;
                }
                
                if(res.status==10004){
                     //console.error("getToken Error status:", res);
                    LocalStorage.setAppUserID("");
                    // window.location.reload(true);
                    if(!force){
                        self.getAccountToken(callback, true);
                    }
                }
                else{
                     //console.error("getToken Error status:", res);
                }
                callback(new Error("getToken Error status:"));
            });
        }
        let userid = LocalStorage.getAppUserID();
        if(!userid || userid=="VIEWER"){
            userid = "Web"+Utils.createUUID(6, 10);
            AppWebApi.createAccount(userid, userid, function (error, response) {
                if(error){
                     //console.error("createAccount Error:", error);
                    handler(error);
                    return;
                }
                else{
                    let res = JSON.parse(response);
                    if(res.status==0 || res.status==10003){//success
                        LocalStorage.setAppUserID(userid);
                        handler(null, userid);
                        
                        let date = new Date();
                        let OrderNumber = date.getTime();
                        AppWebApi.changeGold(userid,OrderNumber,200000,function(){});
                    }
                    else{
                         //console.error("createAccount Error status:", res);
                        handler(res);
                    }
                }
            }.bind(this));
        }
        else{
            handler(null, userid);
        }
    },
    
    clearHandlingGameID(){
        this._handlingGameID = 0;
    }
});
