// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 游戏消息通知处理
// ]]

let my = require("my");
let NotifyBase = require("NotifyBase");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

// let EventManager = require("EventManager");
// let Target = EventManager.Target;
// let Event = EventManager.Event;

let UIDialog = require("UIDialog");
let i18n = require("i18n");
let AppBridge = require("AppBridge");
let UIFrame = require("UIFrame");
let AppWebApi = require("AppWebApi");
let HotUpgrade = require("HotUpgrade");
let UINoticeData = require("UINoticeData");
let MsgManager = require("MsgManager");
let MSG_FRAMEWORKS = require("Msg");
let MSG = require("Msg_login");
let wrappers = require("WrapperManager").default;
let SUBBUNDLE_PLAY_INFO = "SUBBUNDLE_PLAY_INFO";
let UserInfo = require("UserInfo");

let LocalStorage = require("LocalStorage");

let LOGIN_HANDLED = false;
let PRELOAD_HANDLED = false;

class NotifyHandler extends NotifyBase {
    name = "NotifyHandler";
    _handler = null;
    _blockIndex = 0;


    constructor(options) {
        super();
    }
    register(){
        for (const key in event) {
            let value = event[key];
            target.on(value, this._onNotify.bind(this, value), this);
        }
    }
    unregister(){
        target.targetOff(this);
    }
    setHandler(handler){
        cc.log(this.name, "setHandler", handler&&handler.name);
        this._handler = handler;
    }
    _onNotify(msg, ...data){
        cc.log("NotifyHandler._onNotify", msg);
        
        let splits = msg.split("_");
        let func_key = "_on";
        for (let index = 0; index < splits.length; index++) {
            let key = splits[index];
            func_key += key.substr(0, 1).toUpperCase() + key.substr(1).toLowerCase();
        }

        if(cc.isValid(this._handler)){
            let handler = this._handler;
            if(handler[func_key]){
                handler[func_key](...data);
                // if(handle_result){
                //     return;
                // }
                return
            }
        }
        else{
            if(this._handler!=null){
                cc.error(this.name, "无效的 handler ", this._handler);
            }
            // return;
        }
        
        if(this[msg]){
            this[msg](...data);
            return;
        }
        
         //console.warn(this.name, "未处理的消息：msg="+msg, "func="+func_key);
    }

    _showBlockText(strText, dotAnimation, callback, timeout){
        this._hideBlockText();
        this._blockIndex = app.ui.showBlockText(strText, dotAnimation, callback, timeout);
    }

    _hideBlockText(){
        if(this._blockIndex){
            app.ui.hideBlockText(this._blockIndex);
        }
        this._blockIndex = 0;
    }

    //加载子游戏统一入口
    _loadGame(options){
        let self = this;
        let item = my.bundle.getWebBundleConfig(options.nGameId);
        if(!item){
            item = app.game.getGameItem(options.nGameId);
        }
        if(!item){
            let text = i18n.t("COMMON.GAME_NOT_CONFIGURED") + options.nGameId;
            cc.error(text);
            // item = Object.assign({}, options);
            this._showBlockText(text);
            return;
        }
        item = Object.assign({}, item);
        item = Object.assign(item, options);
        // if(typeof item.sGamePath=='string'){
        //     let paths = item.sGamePath.split('/');
        //     item.sGamePath = paths[paths.length-1];
        // }

        let bundleName = options.bundleName || app.util.getBundleNameByGamePath(item.sGamePath, item.isLive) || "";
        let sceneName = options.sceneName || my.util.getSceneNameByGamePath(item.sGamePath);
        options.bundleName = bundleName;
        options.sceneName = sceneName;
        options.isLive = item.isLive;

        options.md5 = item.sMD5FilePath || "";
        options.langs = item.langs || {};
        options.depends = item.depends || [];
        options.folder = item.folder;
        
        if (cc.sys.isNative) {
            options.md5 = null;
        }
        
        cc.log("_loadGame",bundleName+","+sceneName+","+item.isLive+","+options.md5+","+options.langs)
        window.logTimestamp("NotifyHandler.js '" + bundleName + "' _loadGame start ");

        //是否启用服务器版本检测
        if(!app.config.ENABLE_SERVER_VERSION){
            options.md5 = null;
            options.langs = {};
        }

        options.version = item.sVersion || "";
        options.sGamePath = sceneName;
        let url_remote = app.config.ISDEVELOP ? app.game.getURL() : null;
        let sURL = item.sURL || url_remote;
        if(sURL && sURL[sURL.length-1]!="/"){
            sURL += "/";
        }
        options.url = sURL ? (sURL + bundleName) : null;
        let onComplete = function (error, wrapper) {
            app.hideLoading();
            window.logTimestamp("NotifyHandler.js '" + bundleName + "' _loadGame complete ");
            
            if(error){
                QYLogs.error("NotifyHandler", "加载子游戏失败，通知当前场景进入大厅");
                //清空所有block
                my.ui.clearAllBlock();
                // target.emit(event.HALL_ENTER_START);
                app.game.exitToHall();
                app.manager.clearHandlingGameID();
                app.postMessage(AppBridge.EVENT.GAME_ERROR, {
                    error: AppBridge.errorID(110),
                });
                return;
            }
            else{
                if(options.onComplete){
                    options.onComplete(error, wrapper);
                }
                
                //替换地址栏 URL，去掉 gameid 参数，避免刷新后重复加载子游戏
                const replaceUrl = window.location.origin + window.location.pathname
                window.history.replaceState({}, "", replaceUrl);
            }
        }
        // --- 兼容补丁：处理 live-shortTexas 依赖 live-Texas ---
        if (options.bundleName === "live-shortTexas") {
            // 检查是否已有 depends
            if (!options.depends) {
                options.depends = [];
            }
            // 强制补充依赖 live-Texas
            if (options.depends.indexOf("live-Texas") === -1) {
                options.depends.push("live-Texas");
            }
            cc.log("[_loadGame Patch] live-shortTexas 依赖 live-Texas 已注入");
        }

        if(!options.autoPreload){
            this._updateSubgamePlayInfo(bundleName);
            app.showLoading();
        }
        app.res.loadGame(bundleName, options, onComplete);
    }

    preloadGame(gameid, onComplete){
        let options = {
            nGameId: gameid,
            autoPreload: true,
            autoStart: false,
            onComplete,
        }
        this._loadGame(options);
    }

    _getSubgamePlayInfoAll(){
        let item = app.storage.getItem(SUBBUNDLE_PLAY_INFO);
        if(!item || typeof item!='object'){
            item = {};
        }
        return item; 
    }
    _getSubgamePlayInfo(bundleName){
        let item = this._getSubgamePlayInfoAll();
        let subitem = item[bundleName];
        return subitem;
    }
    _updateSubgamePlayInfo(bundleName){
        let subitem = this._getSubgamePlayInfo(bundleName) || {};
        let playcount = subitem.playcount || 0;
        let info = {
            timestamp: Date.now(),      //时间戳，最近玩的优先加载
            playcount: playcount+1,     //玩的次数，次数多的优先加载
        }
        this._setSubgamePlayInfo(bundleName, info);
    }
    _setSubgamePlayInfo(bundleName, info){
        let item = this._getSubgamePlayInfoAll();
        let subitem = item[bundleName];
        if(!subitem){
            subitem = item[bundleName] = {};
        }
        subitem.playcount = info.playcount;
        subitem.timestamp = info.timestamp;
        app.storage.setItem(SUBBUNDLE_PLAY_INFO, item);
    }

    //无效的启动方式（缺少accout/guest/token等登录类型参数）
    GAME_LAUNCH_INVALID(data){
        let text = i18n.t("COMMON.TOKEN_FAIL");
        this._showBlockText(text);    
    }

    /**
     * 启动成功，加载登录包
     * @param {*} options = {
     *      onLaunched: function(empty, scene),
     *      onProgress: function(completedCount, totalCount, item),
     *      onLoaded: function(error),
     *  }
     */
    GAME_LAUNCH_SUCCESS(options){
        app.res.loadLogin(function onComplete(error, wrapper) {
            if(error){
                cc.error("SceneLaunch", error, wrapper);
                return;
            }
        }, options);
    }

    //登录失败
    SERVER_LOGIN_FAIL(data){
        if(!data) return;

        let key = "LOGIN_ERROR." + data.nError;
        let text = i18n.t(key);
        QYLogs.error("LoginController", "登录失败: " + text, data);

        if (app.config.IS_CLUB_ONLY){
            //俱乐部直接弹提示
            app.ui.showTips(text);
            return;
        }

        this._showBlockText(text);
        
        app.postMessage(app.bridge.EVENT.GAME_ERROR, {
            error: app.bridge.errorID(103)
        });
    }

    //注册失败
    SERVER_REGIST_FAIL(data){
        if(!data) return;

        let key = "REGISTER_ERROR." + data.nError;
        app.ui.showTips(i18n.t(key));
    }

    //登录成功，加载大厅包
    SERVER_LOGIN_SUCCESS(data){
        let options = {
            autoLoginHall: true,
        }
        app.res.loadHall(function onComplete(error, wrapper) {
            if(error){
                cc.error("SceneLaunch", error, wrapper);
                return;
            }
        }, options);
    }

    //大厅登录成功，处理重连信息(NotifyHall已处理)
    HALL_LOGIN_SUCCESS(data){
    }
    HALL_LOGIN_FINISH(data){
        this._hideBlockText();

        if(!CC_BUILD) return;
        if(!app.config.ENABLE_AUTO_PRELOAD) return;
        //直播项目不预加载
        if(app.config.IS_LIVE_ONLY) return;
    
        if(LOGIN_HANDLED){
            return;
        }
        LOGIN_HANDLED = true;

        // url 指定 gameid 时，只预加载该子游戏
        let gameid = app.url.get("gameid");
        if(gameid){
            let item = app.game.getGameItem(gameid);
            if(item){
                let options = {
                    nGameId: gameid,
                    autoPreload: true,
                    autoStart: false,
                }
                this._loadGame(options);
            }
            return;
        }

    }
    //大厅界面预加载子游戏
    HALL_PRELOAD_SUBGAME(data){
        if(!CC_BUILD) return;
        if(!app.config.ENABLE_AUTO_PRELOAD) return;
        //直播项目不预加载
        if(app.config.IS_LIVE_ONLY && !app.config.IS_CLUB_ONLY) return;
    
        if(PRELOAD_HANDLED){
            return;
        }
        PRELOAD_HANDLED = true;

        let list = app.game.getGameList();
        let items = JSON.parse(JSON.stringify(list));
        let array = [];
        for (let index = 0; index < items.length; index++) {
            let item = items[index];
            item.bundleName = app.util.getBundleNameByGamePath(item.sGamePath);
            if(array.findIndex(e=>e.bundleName==item.bundleName) < 0){
                array.push(item);
            }
        }
        let infos = this._getSubgamePlayInfoAll();
        array = array.sort(function (a, b) {
            let info1 = infos[a.bundleName];
            let info2 = infos[b.bundleName];
            if(info1 && info2){
                //按最近一次使用排序
                return info2.timestamp - info1.timestamp;
            }
            else if(info1){
                return -1;
            }
            else if(info2){
                return 1;
            }
            else{
                //按列表顺序预加载
                return (a.nGameOrder - b.nGameOrder)
            }
        })
        //最多预加载个数
        let maxPreload = array.length;
        if(app.config.PRELOAD_SUBGAME_MAX_COUNT > 0){
            maxPreload = Math.min(array.length, app.config.PRELOAD_SUBGAME_MAX_COUNT);
        }
        for (let index = 0; index < maxPreload; index++) {
            const item = array[index];
            let options = {
                nGameId: item.nGameId,
                autoPreload: true,
                autoStart: false,
            }
            this._loadGame(options);
        }
    }

    //登录大厅成功，非大厅场景则进入大厅场景
    HALL_ENTER_START(data){
        app.util.setOrientation(false);

        // let index = app.ui.showLoading();
        app.res.loadScene(my.wrapper.HALL, {
            onLaunched: function (params) {
                // app.ui.hideLoading(index);
            }
        });
    }

    //进入子游戏房间
    SUBGAME_ENTER_ROOM(data, onLaunched){
        let options = {
            // isRoomView: true,
            nGameId: data.nGameId,
            nRoomId: -2,
            sTableId: 0,
            fromHall: data.fromHall,
            onLaunched: onLaunched,
        }

        this._loadGame(options);
    }
    SUBGAME_START(data, onLaunched){
        let options = {
            // isRoomView: false,
            nGameId: data.nGameId,
            nRoomId: data.nRoomId,
            sTableId: data.sTableId,
            onLaunched: onLaunched,
        }
        this._loadGame(options);
    }
    SUBGAME_RESTART(data, onLaunched){
        let options = {
            // isRoomView: data.isRoomView,
            nGameId: data.nGameId,
            nRoomId: data.nRoomId,
            sTableId: data.sTableId,
            onLaunched: onLaunched,
        }

        this._loadGame(options);
    }

    //游戏维护中
    SERVER_GAME_WEI_HU_ZHONG(data, onLaunched){
        if(!app.config.IS_LIVE_ONLY){
            let params = {};
            params.showType = UIDialog.EShowType.OK;
            params.text = i18n.t("COMMON.YOU_XI_WEI_HU_ZHONG") + "" + app.util.timestampToTime(data.sTimeStart) + " ~ " + app.util.timestampToTime(data.sTimeEnd) + "";
            params.callback = function (isOK) {
               
            }.bind(this);
            MsgManager.fire(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, params);
            return
        }

        let path = "popup/weihu/weihu";
        let wrapper = app.LiveAssets;
        let component = "weihu";

        if(app.config.IS_CLUB_ONLY){
            wrapper = app.ClubAssets;
            path = "popup/weihu/weihu_club";
            component = "weihu_club";
        }
        
        path = wrapper.path(path,null,"main-common/resources/");
        let count = 0;
        let loadRes = function () {
            wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
                if (error) {
                    count++;
                    if(count<=3){
                        cc.error("UIFrame", "维护中", "加载资源失败，正在重新加载：count=" + count);
                        loadRes();
                    }
                    else{
                        cc.error("UIFrame", "维护中", "加载资源失败：error=" + error);
                    }
                    return;
                }

                if(app.node){
                    let weihuPrompt = app.node.getChildByName("weihuPrompt")
                    if(weihuPrompt){
                        weihuPrompt.destroy();
                    }
                }
                
                let node = cc.instantiate(prefab);
                app.node.addChild(node, cc.macro.MAX_ZINDEX-10);
                node.position = cc.Vec2.ZERO;
                node.name = "weihuPrompt"
                data.isReturnHall = true;
                node.getComponent(component).init(data);
            });
        }

        loadRes();
    }

    //子游戏维护中
    SERVER_SUBGAME_WEI_HU_ZHONG(data, onLaunched){

        if(!app.config.IS_LIVE_ONLY){
            let params = {};
            params.showType = UIDialog.EShowType.OK;
            params.text = i18n.t("COMMON.YOU_XI_WEI_HU_ZHONG") + "" + app.util.timestampToTime(data.sTimeStart) + " ~ " + app.util.timestampToTime(data.sTimeEnd) + "";
            params.callback = function (isOK) {
                if(app.user.isLogin()){

                    if(app.config.IS_CLUB_ONLY){

                        LocalStorage.setAutoLoginState(false);

                        //断开游戏连接
                        if (app.net.isConnect()) {
                            app.net.disConnect(true);
                            app.net.release();
                        }
                    }
                    
                    MsgManager.fire("logout");

                    //退出登录，返回到登录界面
                    app.res.loadLogin(function onComplete(params) {
                                    
                    })
                }
            }.bind(this);
            MsgManager.fire(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, params);
            return
        }

        let path = "popup/weihu/weihu";
        let component = "weihu";
        let wrapper = app.LiveAssets;
        if(app.config.IS_CLUB_ONLY){
            wrapper = app.ClubAssets;
            path = "popup/weihu/weihu_club";
            component = "weihu_club";
        }
        path = wrapper.path(path,null,"main-common/resources/");
        let count = 0;
        let loadRes = function () {
            wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
                if (error) {
                    count++;
                    if(count<=3){
                        cc.error("UIFrame", "维护中", "加载资源失败，正在重新加载：count=" + count);
                        loadRes();
                    }
                    else{
                        cc.error("UIFrame", "维护中", "加载资源失败：error=" + error);
                    }
                    return;
                }

                if(app.node){
                    let weihuPrompt = app.node.getChildByName("weihuPrompt")
                    if(weihuPrompt){
                        weihuPrompt.destroy();
                    }
                }

                let node = cc.instantiate(prefab);
                app.node.addChild(node, cc.macro.MAX_ZINDEX-10);
                node.position = cc.Vec2.ZERO;
                node.name = "weihuPrompt"
                node.getComponent(component).init({isReturnHall:true});
            });
        }
        
        loadRes();

       

    }

    //账号重复登录
    SERVER_RELOGIN(data){
        //断开游戏连接
        if (app.net.isConnect()) {
            app.net.disConnect(true);
            app.net.release();
        }
        
        if(app.config.IS_CLUB_ONLY){
            let text = i18n.t("COMMON.CHONG_XIN_DENG_LU");

            let path = "popup/dialog/UIDialog";
            app.ui.loadPopup(path, function (component) {
                UIFrame.clearAllBlock();

                this.node.addChild(component.node, 1024);
                component.setShowType(UIDialog.EShowType.OK);
                component.show(text, function (isOK) {
                    app.game.clearData();
                    app.game.setGameID(-1);
                    //主动断开，不重连
                    // app.net.disConnect(true);
                    app.net.release();

                    if(!App.isInLoginScene){

                        LocalStorage.setAutoLoginState(false);
                        MsgManager.fire("logout");
                        
                        app.res.loadLogin();
                    }
                }.bind(this));
                component.node.position = cc.Vec2.ZERO;
            }.bind(this), {
                loader: my.wrapper.COMMON,
            });
            return;
        }

        app.postMessage(AppBridge.EVENT.GAME_ERROR, {
            error: AppBridge.errorID(106)
        });
        let text = i18n.t("COMMON.CHONG_XIN_DENG_LU");
        this._showBlockText(text);
    }

    //与服务器版本号不一致
    SERVER_VERSION_ERROR(data){
        let version = data.sVersions || 0;
        app.postMessage(AppBridge.EVENT.GAME_ERROR, {
            error: AppBridge.errorID(200),
            value: {
                version: version,
            }
        });

        let text = i18n.t("COMMON.BAN_BEN_BU_YI_ZHI") + `(${version})`;
        // this._showBlockText(text);
        cc.warn("[ERROR] ", text, data.sVersions);

        let path = "popup/dialog/UIDialog";
        app.ui.loadPopup(path, function (component) {
            UIFrame.clearAllBlock();

            this.node.addChild(component.node, 1024);
            component.setShowType(UIDialog.EShowType.OK);
            component.show(text, function (isOK) {
                // if (isOK) {
                // }

                this._showBlockText(i18n.t("COMMON.JIA_ZAI_ZHONG"));
                
                if(!my.url.get("live")){
                    return;
                }

                if(version){
                    app.util.loadByVersion(version);
                    return;
                }
            }.bind(this));
            component.node.position = cc.Vec2.ZERO;
        }.bind(this), {
            loader: my.wrapper.COMMON,
        });
    }

    //跑马灯
    SERVER_GATEWAY_NOTICE(data){

        if(app.config.IS_LIVE_ONLY){
            return
        }
        
        if(data != null){
            cc.log("SERVER_GATEWAY_NOTICE");
            cc.log("data.nScope,data.sChannel,data.sDetails:",data.nScope,data.sChannel,data.sDetails);
            UINoticeData.pushData(data);
        }
        
        if(!UINoticeData.isEmpty() && !UIFrame.isPopupByName("NoticePrefabs")){
            let path = "popup/notice/NoticePrefabs";
            app.SetAssets.ui.loadPopup(path, function (component) {
                let scene = cc.director.getScene()
                let canvas = scene ? scene.getChildByName("Canvas"):null;
                if(cc.isValid(scene) && scene.name != "main-login" && cc.isValid(canvas)){
                    canvas.addChild(component.node, 1024)
                }else{
                    UIFrame.removePopup("NoticePrefabs")
                }
            }.bind(this),{ path_resources: "main-common/resources/",isShowLoading:true});
        }
    }

    SERVER_KICKOUT_ROOM(data){

        let tip = data.sTips;
        let text = i18n.t("COMMON.WEI_HU_TI_REN.1");
        if(Number(tip)){
            text = i18n.t("COMMON.WEI_HU_TI_REN." + tip);
            if(text=="COMMON.WEI_HU_TI_REN." + tip){
                text = i18n.t("COMMON.WEI_HU_TI_REN.1");
            }

            if (tip == 8){
                //在牌桌坐下，被后台强制站起
                text = i18n.t("COMMON.STANDUP_FROM_TABLE");
            }else if (tip == 9){
                //在牌桌坐下，被后台强制踢出牌桌
                text = i18n.t("COMMON.KICKOUT_FROM_TABLE");
            }
        }

        let params = {};
        params.showType = UIDialog.EShowType.OK;
        params.text = text;
        params.callback = function (isOK) {
            if (isOK) {
                let info = UserInfo.getInfo();
                //1:踢回到大厅 其它:踢回到登陆界面
                if(data.nToWhere==1){
                    //如果用户没登录，就不提示了
                    if(info.nUserID!==0){
                        app.game.exitToHall();
                    }
                }else if (data.nToWhere == 2){
                    
                }
                else{
                    if(app.config.IS_LIVE_ONLY){
                        app.game.exitToHall();
                    }else{
                        app.game.clearData();
                        app.game.setGameID(-1);
                        //主动断开，不重连
                        // app.net.disConnect(true);
                        app.net.release();

                        if(!App.isInLoginScene){
                            if(app.config.IS_CLUB_ONLY){
                                LocalStorage.setAutoLoginState(false);
                            }
                            MsgManager.fire("logout");
                            app.res.loadLogin();
                        }
                    }
                }
            }
        }.bind(this);
        MsgManager.fire(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, params);
    }
}

module.exports = NotifyHandler;