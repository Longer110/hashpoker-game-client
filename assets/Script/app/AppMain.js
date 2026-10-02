let AppBase = require("AppBase");
let my = require("my");
let Utils = require("Utils");
let ConfigApp = require("ConfigApp");
let NotifyCenter = require("NotifyCenter");
let NotifyHandler = require("NotifyHandler");
let LocalStorage = require("LocalStorage");
let UserInfo = require("UserInfo");
let NetworkEvent = my.NetworkEvent;

let Base64 = require("base64");
let MsgManager = require("MsgManager");
let MSG = require("Msg");
let QYLogs = require("QYLogs");

let AppBridge = require("AppBridge");
let UserKey = require("UserKey");
let AppNative = require("AppNative");
// let AppExternalManager = require("AppExternalManager");
let BridgeController = require("BridgeController");

class AppMain extends AppBase {
    handler = null;                 //游戏消息通知处理中心
    _blockIndex = 0;

    //游戏共用图集（poker、head）
    get UIAtlas(){
         //console.warn("UIAtlas 已拆分，直播项目使用 UIAtlasLive，合集项目使用 UIAtlasSet ");
        cc.errorID(1400,  `UIAtlas`, "UIAtlasLive or UIAtlasSet");
        return app.config.IS_LIVE_ONLY ? app.UIAtlasLive : app.UIAtlasSet;
    }


    // "https://testwww.hashpoker.vip/kkpoker_web/buildKKPoker/game.html?gameid=125&lang=zh&live=1&skin=c&tableid=562%233931EB0DB1"
    //https://testwww.hashpoker.vip/test_web/game.html?tgWebAppStartParam=Z2FtZWlkPTEyNSZsYW5nPXpoJmxpdmU9MSZza2luPWMmdGFibGVpZD01NjIlMjM2OEYwQzIyMTAwMDAx
    // tg接入后加密，修改重定义参数
    localDealWindowLocation(){
        if(!cc.sys.isBrowser) return null;
        const params = new URLSearchParams(window.location.search);

        // 获取 Telegram 注入的 Base64 参数
        const base64Param = params.get("tgWebAppStartParam");
        if (!base64Param) return null; 

        try {
            const decoded = Base64.decode(base64Param);
             //console.log("解码后的参数:", decoded);
            const newParams = new URLSearchParams(decoded);
            // 构造新的 URL
            const cleanUrl =
            window.location.origin +
            window.location.pathname +
            "?" +
            newParams.toString();

            // 用 history API 替换地址，不刷新页面
            window.history.replaceState({}, "", cleanUrl);
            console.log("新 URL:", cleanUrl);

            // 关键修复：替换 URL 后，强制刷新 UrlUtil 的缓存，否则 app.url.get() 读到的仍是旧 search
            if (my.url && typeof my.url.reload === "function") {
                my.url.reload();
            } else if (my.url && typeof my.url.load === "function") {
                my.url.load();
            }

            // 同时把解码后的所有参数手动 set 到 UrlUtil，防止时序问题
            if (my.url && typeof my.url.set === "function") {
                const tmp = new URLSearchParams(decoded);
                for (const [k, v] of tmp.entries()) {
                    my.url.set(k, v);
                }
            }

            return cleanUrl
        } catch (err) {
             console.error("Base64 解析失败:", err);
              return null
        }
    }
    constructor(){
        super();
        if(CC_EDITOR) return;
        // this.localDealWindowLocation()
        //全局配置
        this.register("config", ConfigApp.game);
        this.register("server", my.server); //服务器配置管理

        //网络
        this.register("net", my.net);       //游戏服连接实例
        this.register("record", my.record); //日志记录服连接实例
        this.register("statis", my.statis); //统计服连接实例

        //全局对象
        this.register("wrapper", my.wrapper);           //子包封装 {bundle, audio, ui, path()}
        this.register("bundle", my.bundle);             //子包管理 
        this.register("res", my.res);                   //资源/场景管理
        this.register("game", my.game);                 //子游戏管理
        this.register("audio", my.audio);               //全局公共音频管理
        this.register("ui", my.ui);                     //全局公共ui管理
        this.register("ping", my.ping);         

        this.register("url", my.url);                   //window.location.search： url地址传入参数查询
        this.register("util", Utils);                   //工具类
        this.register("storage", LocalStorage);         //本地数据存储
        this.register("target", NotifyCenter.target);   //游戏消息通知对象
        this.register("event", NotifyCenter.event);     //游戏消息相关定义
        this.register("i18n", my.i18n);                 //多语言
        this.register("user", UserInfo);                //UserInfo
            
        this.register("UserKey", UserKey);
        // this.register("external", AppExternalManager);  //扩展项目管理

        //与原生app消息桥接管理
        this.register("bridge", AppBridge);
        //与原生app功能交互封装
        this.register("native", AppNative.default);
    }
    
    onInit(){
        super.onInit();
        window.logTimestamp("AppMain.js 'onInit'");
        
        this.preInit();
        this.initEngineEnv();
    }
    preInit(){
        if(this._preInited){
            return;
        }
        
        super.preInit();
        window.logTimestamp("AppMain.js 'preInit'");

        this.initGlobal();
        this.initEnv();
        this.initLanguage();
        this.initLog();
        this.initCommon();
        this._deprecated();
    }
    initGlobal(){
        window.logTimestamp("AppMain.js 'initGlobal'");

        let component = this.node.addComponent(NotifyHandler);
        component.register();
        this.register("handler", component);

        let bridgeController = this.node.addComponent(BridgeController);
        // bridgeController.register(); //不在这里调用，因为 uniapp环境下此时 window.plus 可能还未注入，window.plus 对象还不存在
        this.register("bridgeController", bridgeController);

        let application = this.application;
        //心跳包延迟监听
        this.net.on(NetworkEvent.HEARTBEAT, (delay)=>{
            application._onHeartbeat(delay);
            MsgManager.fire(MSG.WEBSOCKET.LATENCY);
        });
        this.net.on(NetworkEvent.CLOSE, ()=>{
            application._clearLatency();
            MsgManager.fire(MSG.WEBSOCKET.LATENCY);
        });
    }
    initLanguage(){
        // my.i18n.init(app.config.LANG, {});
        my.i18n.init(app.config.LANG); //加载全部
    }
    onPreload(){
        if(app.chat){
            app.chat._initLanguage();
        }
        if(app.ClubViews){
            app.ClubViews._initLanguage();
        }
        super.onPreload();
    }

    initVersion(ver_version){
        // let config = app.config;
        // //app内置资源版本
        // if(config.IS_BUILDIN_APP) return;

        // if (ver_version) {
        //     ver_version = my.util.replaceAll(ver_version, "\"", "");
        //     let versions = ver_version.split('-');
        //     if (versions.length > 1) {
        //         ver_version = config.IS_LIVE_ONLY ? versions[0] : versions[1];
        //     }
        //     config.VERSION = ver_version;
        // }
    }
    //引擎相关初始化需要在onInit中处理
    initEngineEnv(){
        cc.game.setFrameRate(app.config.FPS);
        //url指定fullscreen=1时，不显示全屏手势
        if (my.url.get("fullscreen")) {
            cc.view.enableAutoFullScreen(false);
        }; 
    }
    initEnv() {
        QYLogs.warn("App", "initEnv");
        // const paramsS = new URLSearchParams(window.location.search);
        // const tgWebAppStartParam = paramsS.get("tgWebAppStartParam");
        // const tableIdParam = paramsS.get("tableid");
        // if(tgWebAppStartParam && (tableIdParam && tableIdParam == "")){
        //     this.localDealWindowLocation()
        // }

        let config = ConfigApp.game;

        //从哪里启动子游戏
        let from = my.url.get("from");
        if(from == "hall"){
            app.config.FROM = from;
        }
        else{
            app.config.FROM = app.config.FROM_DEFAULT;
        }

        //app兼容版本号
        let compatibleVersion = my.url.get("compatibleVersion");
        if(compatibleVersion){
            app.setCompatibleVersion(compatibleVersion);
        }

        //指定为单机游戏，不联网
        if(config.IS_SINGLE || my.url.get("single")=="1"){
            config.IS_SINGLE = true;
            config.NEED_WAIT_FOR_CHECKED = false;
            //禁用游戏服网络连接
            app.net.setEnabled(false);
        }

         //指定为牌局回顾
         if(my.url.get("paijuid")){
            config.IS_PLAYBACK = true;
        }

        //指定为机器人模式（表示该合集游戏进入的都是只有机器人的房间）
        if(my.url.get("robot")=="1"){
            config.IS_ROBOT = true;
        }

        let ver_version = my.url.get("v");
        this.initVersion(ver_version);
        this.setCanShowLoading(config.SHOW_LAUNCH_LOADING);

        let params = ["LANG"];
        if (!config.DISABLE_URL_SKIN) {
            params.push("SKIN");
        }

        config.LANG = config.LANG_DEFAULT;
        config.SKIN = config.SKIN_DEFAULT;
        
        for (const index in params) {
            let key = params[index];
            let value_url = my.url.get(key);
            if (value_url) {
                let value_targets = null;
                if (key == "SKIN") {
                    let value_map = {
                        transparent: "default", //透明皮肤
                        bluebottom: "a",        //蓝色底 皮肤
                        fullscreenag: "b",      //全屏AG 皮肤
                    }
                    value_url = my.util.converSkin(value_url, value_map);
                    value_targets = config.SKINALL; //SKINALL 本项目支持的所有皮肤定义
                }
                else if (key == "LANG") {
                    let value_map = config.LANGALL;
                    //将url传入的语言参数转化为框架支持的语言格式（）
                    value_url = my.util.converLanguage(value_url, value_map);
                    value_targets = config.LANGALL; //SKINALL 本项目支持的所有语言定义
                }
                if (my.util.checkValid(value_url, value_targets)) {
                    config[key] = value_url;

                    //优先使用 url 指定的皮肤
                    if(key == "SKIN"){
                        app.setAppSkin(value_url);
                    }
                }
                else {
                    QYLogs.error("App", `不支持的参数: ${key}=${value_url}`);
                }
            }
        }

        // if (app.config.IS_CLUB_ONLY){
        if (true){
            // if (cc.sys.isNative){
            if (true){
                let language = app.storage.getItem("CLUB_LANGUAGE", "");
                if (language && language != ""){
                    config.LANG = language
                }else{
                    //原生平台使用系统语言
                    let lang = cc.sys.languageCode;
                    lang = lang.toLocaleLowerCase();
                    QYLogs.warn("App", `系统语言: ${"lang"}=${lang}`);
                    if(lang.indexOf("zh-cn") != -1 || lang.indexOf("zh_cn") != -1 || lang.indexOf("hans") != -1){
                        config.LANG = "zh";
                    }else if(lang.indexOf("zh-tw") != -1 || lang.indexOf("zh_tw") != -1 || lang.indexOf("zh-hk") != -1 || 
                        lang.indexOf("zh_hk") != -1 || lang.indexOf("zh-mo") != -1 || lang.indexOf("zh_mo") != -1 || lang.indexOf("hant") != -1){
                        config.LANG = "zh_tw";
                    }else if (lang.indexOf("vi-vn") != -1 || lang.indexOf("vi_vn") != -1){
                        config.LANG = "vi";
                    }else if (lang.indexOf("th-th") != -1 || lang.indexOf("th_th") != -1){
                        
                    }else if (lang.indexOf("km-kh") != -1 || lang.indexOf("km_kh") != -1){
                        config.LANG = "kh";
                    }else if (lang.indexOf("id-ID") != -1 || lang.indexOf("id-id") != -1){
                        config.LANG = "id";
                    }

                }
            }

        }

        if (!config.DISABLE_URL_STAG) {
            if (my.url.get("stag") === "1") {
                config.ISSTAG = true;
            }
            else if (my.url.get("stag") === "0") {
                config.ISSTAG = false;
            }
        }

        //配置环境
        let wHref = window.location.href
        if (wHref.includes('testwww.hashpoker.vip') || wHref.includes('test-www.hashpoker.vip')) {
            config.DEVELOPVERSION = 1;
        } else if (wHref.includes('www.hashpoker.vip')) {
            config.DEVELOPVERSION = 2;
        } else {
            config.DEVELOPVERSION = 0;
        }

        //正式服去除日志
        if (config.DEVELOPVERSION === 2) {
            console.log = function() {};
            console.warn = function() {};
            console.error = function() {};
            console.info = function() {};

            if (cc && cc.log) {
                cc.log = function () { };
                cc.warn = function () { };
                // cc.info = function () { };
                cc.error = function () { };
            }
        }

        if(cc.sys.isNative) {
            // let fileName = "chessSetVersion/info.json"
            // let data = jsb.fileUtils.getStringFromFile(fileName);
            // if (data && data.length > 8) {
            //     let obj = JSON.parse(data);
            //     config.PLATFORM = obj.platform;
            //     config.VERSION = obj.version;
            // }
        }
        
        console.log("AppMain  initEnv before tgDeal, url.search =", window.location.search, ", my.url._search =", my.url?._search);

        // 关键修复：先处理 Telegram Base64 参数（替换 URL + 刷新 my.url），再统一读取参数
        this.localDealWindowLocation();

        let token = my.url.get("token") || "";
        let gameid = my.url.get("gameid") || "";
        let tableid = my.url.get("tableid") || "";

        console.log("AppMain  initEnv after tgDeal, token=", !!token, "gameid=", gameid, "tableid=", tableid);
        if(app.config.IS_SINGLE){
            tableid = tableid || "single";
        }

        let channel = my.url.get("channel") || null;
        let platform = my.url.get("platform") || null;
        if (channel) {
            config.CHANNEL = channel;
        }
        // let platform = Utils.getDeviceByUserAgent()
        if (platform) {
            config.PLATFORM = platform;
        }

        UserInfo.setInfo({
            token: token,
            gameid: gameid,
            tableid: tableid,
        })

        let apihost = my.url.get("apihost");
        if(apihost){
            cc.warn("App", "使用 url 指定的 apihost: " + apihost);
            config.GATEWEBAPI_URL = apihost;
            config.WEBAPI_HOST_TEST = apihost;
        }
        
        if(gameid!==""){
            if(!my.url.get("skin")){
                let skin = Utils.getSubgameSkinDefault(gameid);
                config.SKIN = skin;
            }

            Utils.updateSkinAndLangBySubgameID(gameid);
        }

        ConfigApp.env.lang = config.LANG;
        ConfigApp.env.skin = config.SKIN;
        if (window.ChessSetEnv) {
            ConfigApp.env.IS_LIVE_ONLY = window.ChessSetEnv.IS_LIVE_ONLY;
        }
        if (window.ChessSetConfig && !!window.ChessSetConfig.APPKEY) {
            config.APPKEY = window.ChessSetConfig.APPKEY;
        }
        if (config.APPKEY && config.APPKEY != "") {
            ConfigApp.env.appkey = config.APPKEY;
        }
        my.env.set(ConfigApp.env);
        LocalStorage.setSysLanguage(config.LANG);
        LocalStorage.setSkin(config.SKIN);
        if (window.SETS_CLIENT_VERSION) {
            LocalStorage.setClientVersion(window.SETS_CLIENT_VERSION);
        }

        cc.warn("EnvironmentManager", "env = " + JSON.stringify(my.env.getAll()));
    }
    _deprecated(params) {
        //暂时兼容旧代码
        let proto = this;
        Object.defineProperties(proto, {
            NetManager: {
                get(){
                    cc.errorID(1400, `${this.name}.NetManager`, "app.net");
                    return proto.net;
                }
            },
            BuriedPoint: {
                get(){
                    cc.errorID(1400, `${this.name}.BuriedPoint`, "app.statis");
                    return proto.statis;
                }
            },
            Game: {
                get(){
                    cc.errorID(1400, `${this.name}.Game`, "app.game");
                    return app.game;
                }
            },
        })
    }
    initLog(params) {
        let config = ConfigApp.game;
        QYLogs.bindConsole(config.IS_LIVE_ONLY);
            
        let date = new Date();
        let timestamp = date.getTime()+"";
        this._fingerprint = Utils.getDevicesId() + "[" + timestamp + "]";
        this._milliseconds = timestamp.slice(-5);
        QYLogs._milliseconds = this._milliseconds;
        
        
        QYLogs.dumpSysInfo();
        QYLogs.log("App", "fingerprint init", this._fingerprint);
        if(!cc.sys.isBrowser){
            return;
        }
    
        QYLogs.log("App", "Location", window.location.href);
        QYLogs.log("App", "userAgent", Utils.getUserAgent());
    }
    initCommon(){
        // my.target.emit(my.event.BUNDLE_LOAD, cc.assetManager.resources, {});
        my.res.init();
    }
    isLoaded(params) {
        let loaded = true;
        // loaded = loaded && (this.UIAtlas != null);
        return loaded;
    }
    showLoading(){
        this.hideLoading();
        let text = ""; //文字为空时，loading不会显示转圈圈
        if(!app.ui.isLoadingVisible()){
            text = app.i18n.t("COMMON.JIA_ZAI_ZHONG"); 
        }
        this._blockIndex = this.ui.showLoading(text);
        cc.warn("AppMain", "showLoading", this._blockIndex);
    }
    hideLoading(){
        if(this._blockIndex>0){
            cc.warn("AppMain", "hideLoading", this._blockIndex);
            this.ui.hideLoading(this._blockIndex);
            this._blockIndex = 0;
        }
    }
    //是否在其它厂商的扩展包中
    checkInThirdExternal(){
        return this.bridgeController.checkInThirdExternal();
    }
}

module.exports = AppMain;