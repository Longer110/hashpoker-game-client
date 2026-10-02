// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: H5与APP消息桥接管理
// ]]

let UrlUtil = require("UrlUtil").default;
let MsgManager = require("MsgManager");
let WrapperManager = require("WrapperManager");
// let wrapper = WrapperManager.default;
// let UtilManager = require("UtilManager");


const UNI_FLAG = 'uni';
let AppBridge = {
    CLIENT_KEY: "chessset_h5",
    LIVE_KEY: "chessset_live",
    MESSAGE: "LIVEAPP_MESSAGE",
    SUBGAME_ENTER_START: "SUBGAME_ENTER_START",
}

class BridgeBase {
    name = "BridgeBase";
    UNI_FLAG = UNI_FLAG;
    _ctrl = null;
    _inited = false;
    _loaded = false;
    _onAppMessage = null;
    _mwgame = null;
    _uni = null;
    _uniH5 = false;
    _uniPlus = false;
    _activeIndex = 0;
    _gamestarted = false;
    _langupdated = false;
    _msgCaches = [];


    constructor(ctrl) {
        this._ctrl = ctrl;
    }

    preinit (params) {
        // if(this._inited) return;

        // this._inited = true;

        // if(cc.sys.os==cc.sys.OS_IOS){
        //     this._mwgame = (window.webkit
        //         &&window.webkit.messageHandlers
        //         &&window.webkit.messageHandlers.mwgame
        //         &&window.webkit.messageHandlers.mwgame.postMessage) ? window.webkit.messageHandlers.mwgame : null;
        // }
        // else{
        //     this._mwgame = (window.mwgame
        //         &&window.mwgame.postMessage) ? window.mwgame : null;
        // }
    
        // let self = this;
        // if(window['uni']){
        //     let platform = window['uni'];
        //     //app环境
        //     if(window['plus']){
        //         self._uni = platform;
        //         self._uniPlus = true;
        //     }
        //     else{
        //         if(typeof platform.getEnv == 'function'){
        //             platform.getEnv(function (res) {
        //                 if(!res) return;
        //                 self._uni = platform;
        //                 self._uniH5 = res.h5 ? true : false;
        //                 self._uniPlus = res.plus ? true : false;
        //                 // if(res.plus==true){
        //                 //     self._uni = platform;
        //                 // }
        //                 // else if(res.h5==true){
        //                 //     self._uni = platform;
        //                 // }
        //             })
        //         }
        //     }
        // }
    }

    
    load (params) {
        // if(this._loaded){
        //     return;
        // }
        // this._loaded = true;

        // //APP版本不处理
        // if(cc.sys.isNative && !app.config.IS_NATIVE_LIB){
        //     return;
        // }

        // this.preinit();
        
        // this.register();
    }

    destroy (params) {
        this.unregister();
    }

    register(){
        // if(this._onAppMessage!=null) return;

        // //直播APP消息交互
        // this._onAppMessage = this._onMessage.bind(this);
        // if(UrlUtil.get(UNI_FLAG)==1 && this._uniH5){
        //     window.addEventListener("message", this._onAppMessage, false);
        // }
        // else{
        //     if(cc.sys.os==cc.sys.OS_IOS){
        //         window.addEventListener("message", this._onAppMessage, false);
        //     }
        //     else if(cc.sys.os==cc.sys.OS_ANDROID){
        //         window.document.addEventListener("message", this._onAppMessage, false);
        //     }
        // }
        // MsgManager.on("message", this._onAppMessage, this);
    }
    unregister(){
        // if(this._onAppMessage){
        //     if(UrlUtil.get(UNI_FLAG)==1 && this._uniH5){
        //         window.removeEventListener("message", this._onAppMessage, false);
        //     }
        //     else{
        //         if(cc.sys.os==cc.sys.OS_IOS){
        //             window.removeEventListener("message", this._onAppMessage, false);
        //         }
        //         else if(cc.sys.os==cc.sys.OS_ANDROID){
        //             window.document.removeEventListener("message", this._onAppMessage, false);
        //         }
        //     }
        //     MsgManager.un(this._onAppMessage, this);
        // }
        // this._onAppMessage = null;
    }

    update (dt) {
        // if(this._msgCaches.length==0){
        //     return;
        // }

        // let event = this._msgCaches.shift();
        // this._onMessageHandler(event);
    }


    // _isExternal(item){
    //     let isExternal = (item && item.ExternalKey && item.ExternalKey!="") ? true : false;
    //     return isExternal;
    // }

    onMessage(event){
        // this._onMessage(event);
    }

    // _onMessage (event) {
    //     // let content = event.data ? event.data : "{}";
        
    //     let data = event;
    //     // if(typeof content == 'string'){
    //     //     try {
    //     //         data = JSON.parse(content);
    //     //     } catch (error) {
    //     //         data = {};
    //     //         cc.error("App._onMessage", "Invalid event data!", event);
    //     //     }
    //     // }
    //     // else if(typeof content == 'object'){
    //     //     data = content;
    //     // }
    //     // else{
    //     //     data = {};
    //     //     cc.error("App._onMessage", "Invalid event!", event);
    //     // }
        
    //     // if(typeof data.msg != 'string'){
    //     //     cc.error("App._onMessage", "Invalid event msg!", event);
    //     // }

    //     // //非h5自己发的消息才设置appkey
    //     // if(data.key!=AppBridge.CLIENT_KEY){
    //     //     App.setAppKey(data.key);
    //     // }

    //     // if(!data.key){
    //     //     data.key = AppBridge.APP_LIVE_KEY;
    //     // }

    //     //  //console.warn("App._onMessage", data, event);
    //     cc.warn("App._onMessage", data/*, event*/); //这里好像有的浏览器环境不能直接输出event

    //     // this._msgCaches.push(data);


    //     this._onMessageHandler(data)

    // }

    postMessage (msg, data) {
        // //APP版本不处理
        // if(cc.sys.isNative){
        //     return;
        // }

        // msg = msg || AppBridge.MESSAGE;
        // if(!data && data!=0){
        //     data = "{}";
        // }
        // let object = {
        //     msg: msg,
        //     data: data,
        //     key: AppBridge.CLIENT_KEY,
        // } 
        // this._postMessage(object);
    }

    _postMessage (object) {
        // //APP版本不处理
        // if(cc.sys.isNative){
        //     return;
        // }

        // if(this._mwgame){
        //     if(cc.sys.os==cc.sys.OS_IOS){
        //         this._mwgame.postMessage(object);
        //     }
        //     else{
        //         let event = JSON.stringify(object);
        //         this._mwgame.postMessage(event);
        //     }
            
        //     cc.warn("App._postMessage", "use mwgame.postMessage", object);
        // }
        // else if(UrlUtil.get(UNI_FLAG)==1 && this._uni){
        //     this._uni.postMessage({
        //         data: object
        //     });
        //     cc.warn("App._postMessage", "use uni.postMessage", object);
        // }
        // else{
        //     let event = JSON.stringify(object);
        //     window.postMessage(event, "*");
        //     cc.warn("App._postMessage", "use window.postMessage", event);
        // }
    }

    _onMessageHandler (event) {
    }
}

module.exports = BridgeBase;