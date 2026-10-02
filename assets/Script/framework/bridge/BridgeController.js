let UrlUtil = require("UrlUtil").default;
let MsgManager = require("MsgManager");
let AppBridge = require("AppBridge");
let SDKPlatform = require("SDKPlatform");
const UNI_FLAG = 'uni';

//界面显示动作
let EState = cc.Enum({
    NONE: 0,
    LOADING: 1,
    LOADED: 2,
    STARTED: 3,
    EXITED: 4,
    ERROR: 5,
});

class BridgeController extends cc.Component {
    _onAppMessage = null;
    _inited = false;
    _uniH5 = false;
    _listEvent = [];
    _externals = {};
    _external = null;
    _bridgeInited = false;
    /*
     * bundleName: bundle_subgame,
                state: EState.LOADING,
                manager: null,
                events: [],
     */

    preinit (params) {
        if(this._inited) return;

        window.logTimestamp("BridgeController.js 'preinit'");
        
        this._inited = true;

        if(cc.sys.os==cc.sys.OS_IOS){
            this._mwgame = (window.webkit
                &&window.webkit.messageHandlers
                &&window.webkit.messageHandlers.mwgame
                &&window.webkit.messageHandlers.mwgame.postMessage) ? window.webkit.messageHandlers.mwgame : null;
        }
        else{
            this._mwgame = (window.mwgame
                &&window.mwgame.postMessage) ? window.mwgame : null;
        }
    
        let self = this;
        if(window['uni']){
            let platform = window['uni'];

            window.logTimestamp("BridgeController.js 'preinit' uniapp");

            //app环境
            if(window['plus']){
                self._uni = platform;
                self._uniPlus = true;
                window.logTimestamp("BridgeController.js 'preinit' uniapp-plus");
            }
            else{
                window.logTimestamp("BridgeController.js 'preinit' uniapp-env");

                if(typeof platform.getEnv == 'function'){
                    platform.getEnv(function (res) {
                        res = res || {};
                        self._uni = platform;
                        self._uniH5 = res.h5 ? true : false;
                        self._uniPlus = res.plus ? true : false;

                        window.logTimestamp(`BridgeController.js 'preinit' uniapp: ${JSON.stringify(res)}`);

                        // if(res.plus==true){
                        //     self._uni = platform;
                        // }
                        // else if(res.h5==true){
                        //     self._uni = platform;
                        // }
                    })
                }
            }
        }
    }
    register(){
        window.logTimestamp("BridgeController.js 'register'");
        
        this.preinit();

        //直播APP消息交互
        this._onAppMessage = this._onMessage.bind(this);

        //app集成lib sdk
        if(this.isNativeAppLib()){
            //设置原生消息交互回调
            qygameengine.MessageManager.getInstance().setGameMsgCallback(this._onAppMessage);
        }
        else{
            //app集成webview网页版
            if(UrlUtil.get(UNI_FLAG)==1 && this._uniH5){
                window.addEventListener("message", this._onAppMessage, false);
            }
            else{
                if(cc.sys.os==cc.sys.OS_IOS){
                    window.addEventListener("message", this._onAppMessage, false);
                }
                else if(cc.sys.os==cc.sys.OS_ANDROID){
                    window.document.addEventListener("message", this._onAppMessage, false);
                }
            }
        }

        //纯网页版
        MsgManager.on("message", function (event) {
                 //console.log("接收到网页消息", event);
                this._onAppMessage(event);
            }, this);

        // App.native.register();
    
    }
    unregister(){

    }

    update(dt){
        if(this._listEvent.length==0){
            return;
        }

        let event = this._listEvent.shift();
        this._handleAppBridgeEvent(event);
    }

    _handleAppBridgeEvent (event) {
        let data = event.data || {};

        if(event.msg == AppBridge.EVENT.CACHE_START || event.msg == AppBridge.EVENT.SUBGAME_ENTER_START){
            if(event.msg == AppBridge.EVENT.CACHE_START){
                if(data.list instanceof Array){
                    let count = 0;
                    let error = null;
                    let callback = function (err) {
                        count++;
                        error = error || err;
                        if(count==data.list.length){
                            cc.warn("CACHE_START 加载完成：", data.list, error);
                            // app.postMessage(AppBridge.EVENT.CACHE_FINISH, {
                            //     list: data.list,
                            // });
                        }
                    }
                    for (let index = 0; index < data.list.length; index++) {
                        const gameid = data.list[index];
                        let item = this.getGameItem(gameid);
                        if(!item){
                            app.postMessage(AppBridge.EVENT.GAME_ERROR, {
                                error: AppBridge.errorID(201)
                            });
                            QYLogs.error("BridgeController", "未配置的游戏 gameid="+gameid);
                            return;
                        }
                        this.loadExternal(item, event, callback);
                    }
                }
            }
            else if(event.msg == AppBridge.EVENT.SUBGAME_ENTER_START){
                //根据gameid获取配置信息

                // let array = options.depends || [];
                // if(typeof array == 'string'){
                //     array = [array];
                // }
                // array.push(nameOrUrl);
                // let count = 0;
                // let callback = function () {
                //     count++;
                //     if(count==array.length){
                //         app.res.loadGame(nameOrUrl, options);
                //     }
                // }
        
                // for(let i=0;i<array.length;i++){
                //     my.checkModeVersion(array[i],function(){
                //         callback();
                //     }.bind(this));
                // }

                if(cc.sys.isNative){
                    let designSesolutionSize = cc.view.getDesignResolutionSize()
                    var isLandscape = cc.winSize.width >= cc.winSize.height;
                    if(isLandscape){
                        if(designSesolutionSize.width < designSesolutionSize.height){
                            cc.view.setDesignResolutionSize(designSesolutionSize.height,designSesolutionSize.width,cc.view.getResolutionPolicy())
                            //window.dispatchEvent(new Event("resize"));
                            cc._widgetManager.onResized();
                        }
                    }else{
                        if(designSesolutionSize.width >= designSesolutionSize.height){
                            cc.view.setDesignResolutionSize(designSesolutionSize.height,designSesolutionSize.width,cc.view.getResolutionPolicy())
                            //window.dispatchEvent(new Event("resize"));
                            cc._widgetManager.onResized();
                        }
                    }
                }

                if(!app.config.IS_CLUB_ONLY){
                    my.update.clearCheckVersion();
                    my.update.checkMainVersion(()=>{
                        my.update.checkVersionByGameID(data.gameid,(item)=>{
                            if(!item){
                                item = this.getGameItem(data.gameid);
                            }
                            if(item){
                                this.loadExternal(item, event, function (error) {
                                    cc.warn("启动完成：", data.list);
                                });
                            }
                            else{
                                app.postMessage(AppBridge.EVENT.GAME_ERROR, {
                                    error: AppBridge.errorID(201)
                                });
                                QYLogs.error("BridgeController", "未配置的游戏 gameid="+data.gameid);
                                return;
                            }
                        });
                    })
                }else{
                   
                    let item = this.getGameItem(data.gameid);
                    if(item){
                        QYLogs.log("BridgeController _handleAppBridgeEvent",item);
                        this.loadExternal(item, event, function (error) {
                            cc.warn("启动完成：", data.list);
                        });
                    }
                    else{
                        app.postMessage(AppBridge.EVENT.GAME_ERROR, {
                            error: AppBridge.errorID(201)
                        });
                        QYLogs.error("BridgeController", "未配置的游戏 gameid="+data.gameid);
                        return;
                    }
                }
            }
        }

        // if(this._isValidExternal()){
        //     cc.warn("BridgeController._onMessage", "由扩展包处理");

        //     if(typeof this._external.manager.onMessage == 'function'){
        //         this._external.manager.onMessage(data);
        //     }
        // }
    }

    getGameItem(gameid){
        let item = my.bundle.getWebBundleConfig(gameid);
        if(!item){
            item = app.game.getGameItem(gameid);
        }
        return item;
    }
    isNativeAppLib(){
        if((cc.sys.os==cc.sys.OS_IOS || cc.sys.os==cc.sys.OS_ANDROID) //移动平台
            && cc.sys.isNative && window['qygameengine'] && qygameengine.MessageManager){
            return true;
        }
        return false;
    }
    initAppBridge(){
        if(this._bridgeInited){
            return;
        }

        this.register();
        
        this._bridgeInited = true;
        window.logTimestamp("BridgeController.js 'initAppBridge'");

        let self = this;
        this._initWebBundleConfigs((list)=>{  
             //console.log("------初始化配置完成回调")
            app.manager.invoke(()=>{   
                window.logTimestamp("GAME_INITED => 'to app'");
                 console.log("----登录场景-------A1")

                //直接跳转到登录场景 pzh
                cc.director.loadScene("main-login");
                

                if(UrlUtil.get(UNI_FLAG)){
                     //console.log("-----------A2")
                    if(self._uni){
                         //console.log("-----------A3:", app.config.VERSION,)
                        app.postMessage(AppBridge.EVENT.GAME_INITED, {
                            version: app.config.VERSION,
                        });
                    }
                    else{
                         //console.log("-----------A4")
                        document.addEventListener("plusready", ()=>{
                            window.logTimestamp("BridgeController.js 'plusready'");
                             //console.log("-----------A5:", app.config.VERSION)
                            app.postMessage(AppBridge.EVENT.GAME_INITED, {
                                version: app.config.VERSION,
                            });
                        }, false);
                    }
                }
                else{
                     //console.log("-----------A6:", app.config.VERSION)
                    app.postMessage(AppBridge.EVENT.GAME_INITED, {
                        version: app.config.VERSION,
                    });
                }
            })
        });

    }
    _initWebBundleConfigs(callback){
        let platform = app.config.PLATFORM;
         //console.log("BridgeController", "请求Web Bundle配置", platform);
        my.bundle.requestWebBundleConfigs(platform, callback)
    }

    /**
     * 统一加载外部扩展包
     * @param {Object} item 
     * @param {Object} event 
     * @param {Function} onComplete(error) 
     */
    loadExternal(item, event, onComplete){
        // let bundle_paths = item.sGamePath.split('/');
        // if(bundle_paths.length<2){
        //     cc.error("不合理的扩展包配置", item);
        //     return;
        // }

        if(!item || !item.manager){
            let error = !item ? "子游戏未配置" : "子包未配置 manager ";
            cc.error("BridgeController", error);
            onComplete&&onComplete(error);
            return;
        }
        
        //扩展包主包名
        let bundle_manager = item.manager;
        //需要加载的子游戏包名
        let bundle_subgame = app.util.getBundleNameByGamePath(item.sGamePath, item.isLive);

        let external_manager = this._externals[bundle_manager];
        if(!external_manager){
            external_manager = this._externals[bundle_manager] = {
                bundleName: bundle_manager,
                subgames: {},
            }
        }
        let external_subgame = external_manager.subgames[bundle_subgame];
        if(!external_subgame){
            external_subgame = external_manager.subgames[bundle_subgame] = {
                bundleName: bundle_subgame,
                state: EState.NONE,
                inited: false,
                manager: null,
                onComplete: null,
                events: [],
            }
        }

        let self = this;
        //保存当前扩展包实例
        self._external = external_subgame;
        external_subgame.onComplete = onComplete || function (error) {
            cc.warn("BridgeController", "loadExternal.onComplete", error);
        };

        //缓存消息
        if(event){
            external_subgame.events.push(event);
        }
        
        //当前扩展包未加载
        if(external_subgame.state==EState.NONE || external_subgame.state==EState.ERROR){
            external_subgame.state = EState.LOADING;

            let manager = window[bundle_manager];
            let handler = function (params) {
                cc.log("BridgeController", "扩展包加载完成. bundle="+bundle_manager);

                external_subgame.manager = window[bundle_manager];
                external_subgame.state = EState.LOADED;
                external_subgame.inited = true;
                
                //扩展包启动
                self._startExternal(external_subgame);
            }
            if(manager){
                cc.log("BridgeController", "扩展包管理模块已加载. bundle="+bundle_manager);
                handler();
                return;
            }

            let config = my.bundle.getWebBundleConfigByName(bundle_manager) || {};


            let options = {
                isExternal: true,
                folder: item.folder ? item.folder : null,
                md5: config.md5 || null,
                langs: config.langs || null,
            }
            
            let onError = function (error) {
                cc.error("BridgeController", error);
                external_subgame.state = EState.ERROR;
                external_subgame.events.length = 0; //清空消息
                external_subgame.onComplete(error);
            }

            my.res.loadBundleWrapper(bundle_manager, options, function(error, bundle) {
                if(error){
                    onError(error);
                    return;
                }
    
                let manager = window[bundle_manager];
                if(!manager){
                    let error = ` window[${bundle_manager}] 未定义 `;
                    onError(error);
                    return;
                }

                handler();
            });
        }
        else{
            if(external_subgame.inited){
                self._startExternal(external_subgame);
            }
            else{
                //正在加载，无需处理
            }
        }
    }
    //是否在其它厂商的扩展包中
    checkInThirdExternal(){
        let result = false;
        if(this._external){
            let manager = this._external.manager;
            if(manager){
                if(manager.bundleName!="game-common"){
                    result = true;
                }
            }
        }
        return result;
    }
    _startExternal(external){
        let self = this;
        //重新初始化启动回调
        external.manager.init({
            onStart: function () {
                self._onStartExternal(external);

                external.onComplete(null);
            }, 
            onExit: function() {
                self._onExitExternal(external);
            }
        });

        let events = [].concat(external.events);
        external.events.length = 0; //清空消息
        external.manager.start(events);
    }
    _onStartExternal(external){
        external.state = EState.STARTED;
    }
    _onExitExternal(external){
        external.state = EState.EXITED;
        this._external = null;
    }
    _isValidExternal(){
        let valid = this._external && this._external.inited;
        return valid;
    }
    
    _onMessage(event){
        if(event && typeof event=='object'){
            if(typeof event.isTrusted == 'boolean' && !event.isTrusted){
                window.logTimestamp("BridgeController.js _onMessage not isTrusted");
                try {
                    cc.warn("BridgeManager. event.isTrusted=false", event.msg, event);
                } catch (error) {
                    cc.warn("BridgeManager. event.isTrusted=false catch: ", event.msg);
                }
                // return;
            }
        }
        
        if(!this._bridgeInited){
            cc.warn("[ERROR] BridgeController", "游戏脚本环境尚未初始化完成", event);
            app.postMessage(AppBridge.EVENT.GAME_ERROR, {
                error: AppBridge.errorID(100)
            });
            return;
        }
        
        let content = null;
        if(typeof event == 'string'){
            content = event;
        }
        else{
            content = event.data ? event.data : "{}";
        }
        
        let data = null;
        let errorMsg = null;
        if(typeof content == 'string'){
            try {
                data = JSON.parse(content);
            } catch (error) {
                data = {};
                errorMsg = "Invalid event data!";
            }
        }
        else if(typeof content == 'object'){
            data = content;
        }
        else{
            data = {};
            errorMsg = "Invalid event!";
        }
        
        if(typeof data.msg != 'string'){
            errorMsg = "Invalid event msg!";
        }

        //非h5自己发的消息才设置appkey
        if(data.key!=AppBridge.CLIENT_KEY){
            App.setAppKey(data.key);
        }

        if(!data.key){
            data.key = AppBridge.APP_LIVE_KEY;
        }

        if(errorMsg){
            let errorEvent = "";
            try {
                errorEvent = JSON.stringify(event);
            } catch (error) {
                errorEvent = "catch: " + error;
            }
            cc.error("BridgeController._onMessage " + errorEvent);
            window.logTimestamp("BridgeController._onMessage" + errorEvent);
        }
        else{
            //  //console.warn("App._onMessage", data, event);
            cc.warn("BridgeController._onMessage：", data/*, event*/); //这里好像有的浏览器环境不能直接输出event
            window.logTimestamp("BridgeController._onMessage" + JSON.stringify(data));
        }
        
        //主包只处理 CACHE_START，SUBGAME_ENTER_START，用于拉起扩展包，其它消息由扩展包处理
        if(data.msg == AppBridge.EVENT.CACHE_START || data.msg == AppBridge.EVENT.SUBGAME_ENTER_START){
            if(!window._handleAppBridgeEventOnGlobal){
                window.logTimestamp(data.msg + " 'from app' handled by 'BridgeController.js' ");

                this._handleAppBridgeEvent(data);
                // if(data.msg == AppBridge.EVENT.CACHE_START){
                //     window.logTimestamp("CACHE_START <= 'from app'");
                //     app.postMessage(AppBridge.EVENT.CACHE_FINISH, {
                //         list: data.list,
                //     });
                // }
                // else{
                //     this._listEvent.push(data);
                // }
            }
            else{
                //由app-utils.js中注册事件处理，用于app内置游戏在game.html加载后立即监听事件，提升速度
                window.logTimestamp("BridgeController.js " + data.msg + "'ignore'");
            }
        }
        else{
            if(this._isValidExternal()){
                cc.warn("BridgeController._onMessage", "由扩展包处理");
    
                if(typeof this._external.manager.onMessage == 'function'){
                    this._external.manager.onMessage(data);
                }
            }    
            else{
            }
        }
    }

    postMessage(msg, data){
        if(msg==AppBridge.EVENT.SUBGAME_ENTER_FINISH){
            //开放显示loading
            app.setCanShowLoading(true);
            
            if(data && typeof data.error!='undefined'){
                if(data.error!=AppBridge.errorID(0)){
                    //显示loading上的三角按钮
                    app.ui.setBtnHideVisible(true);
                }
            }
        }
        else if(msg==AppBridge.EVENT.GAME_ERROR){
            //开放显示loading
            app.setCanShowLoading(true);
            //显示loading上的三角按钮
            app.ui.setBtnHideVisible(true);
        }

        //扩展包消息处理
        if(this._isValidExternal()){
            if(typeof this._external.manager.postMessage == 'function'){
                this._external.manager.postMessage(msg, data);
            }
        }

        //app集成lib sdk
        if(this.isNativeAppLib()){
            //原生消息交互
            this._postToNative(msg, data);
        }
        else{
            //app集成webview网页版
            this._postToWebview(msg, data);
        }
    }
    _postToWebview(msg, data){
        msg = msg || AppBridge.MESSAGE;
        if(!data && data!=0){
            data = "{}";
        }
        let object = {
            msg: msg,
            data: data,
            key: AppBridge.CLIENT_KEY,
        } 

        //app集成webview网页版
        if(this._mwgame){
             //console.log("BridgeController._postMessage1", "use mwgame.postMessage", JSON.stringify(object));
            if(cc.sys.os==cc.sys.OS_IOS){
                this._mwgame.postMessage(object);
            }
            else{
                let event = JSON.stringify(object);
                this._mwgame.postMessage(event);
            }
        }
        else if(UrlUtil.get(UNI_FLAG)==1 && this._uni){
             //console.log("BridgeController._postMessage2", "use uni.postMessage", JSON.stringify(object));
            this._uni.postMessage({
                data: object
            });
        }
        //纯网页版
        else{
            let event = JSON.stringify(object);
            if(cc.sys.os==cc.sys.OS_IOS || cc.sys.os==cc.sys.OS_ANDROID){
                window.postMessage(event, "*");
            }
            else{
                 //console.log("发送网页消息", "use MsgManager.fire", event);
                MsgManager.fire("message", {data: event});
                //MessageManager.fire("message", {data: event});
            }
        }
    }
    _postToNative(msg, data){
        msg = msg || AppBridge.MESSAGE;
        if(!data && data!=0){
            data = "{}";
        }
        let event = {
            msg: msg,
            data: data,
            key: AppBridge.CLIENT_KEY,
        } 
        let eventString = JSON.stringify(event);
        qygameengine.MessageManager.getInstance().gameAction(eventString);
    }
}

module.exports = BridgeController;