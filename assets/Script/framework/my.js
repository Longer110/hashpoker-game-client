"use strict";

let Application = require("Application");
let AudioManager = require("AudioManager");
let WrapperBase = require("WrapperBase");
let WrapperManager = require("WrapperManager");
let DownloaderManager = require("DownloaderManager");
let EnvironmentManager = require("EnvironmentManager");
let EventManager = require("EventManager");
let GameManager = require("GameManager");
let NetworkEvent = require("NetworkEvent");
let NetworkManager = require("NetworkManager");
let NetworkGame = require("NetworkGame");
let NetworkGate = require("NetworkGate");
let NetworkRecorder = require("NetworkRecorder");
let NetworkStatistics = require("NetworkStatistics");
let NetworkPing = require("NetworkPing");
let ResourceManager = require("ResourceManager");
let SceneCommon = require("SceneCommon");
let SceneManager = require("SceneManager");
let SDKManager = require("SDKManager");
let ServerBase = require("ServerBase");
let ServerManager = require("ServerManager");
let StorageManager = require("StorageManager");
let UIManager = require("UIManager");
let UIPool = require("UIPool");
let UtilManager = require("UtilManager");
let UrlUtil = require("UrlUtil");
let i18n = require("i18n");
let DevManager = require("DevManager");
let BridgeBase = require("BridgeBase");
let BundleManager = require("BundleManager");
let SDKPlatform = require("SDKPlatform");
let QYLogs = require("QYLogs");
let UpdateManager = require("UpdateManager");
let PingManager = require("PingManager");


let VERSION_COMPARE_RETSULT ={
    BIG_UPGRADE:2,
    LITTLE_UPGRADE:1,
    NO_UPGRADE:0,
}


let proto = {
    Application,
    AudioManager,
    EventManager,
    WrapperBase,
    NetworkManager,
    SceneCommon,
    ServerBase,
    StorageManager,
    UIPool,
    UIManager,
    //network
    NetworkEvent,
    NetworkGame,
    NetworkGate,
    NetworkRecorder,
    NetworkStatistics,
    NetworkPing,
    BridgeBase,
    SDKPlatform,
    UpdateManager,
    PingManager,


    _instances: [],
    _updates: [],
    _inited: false,
    initResourceBundle: function (resources_bundle, resources_wrapper) {
        if(this._inited) return;
        this._inited = true;
        let bundle = resources_bundle;
        if(!bundle){
            bundle = cc.resources;
        }
        this.audio.init(bundle, resources_wrapper);
        this.ui.init(bundle, resources_wrapper);
        this.ui.setCommon(true);
    },
    load: function (params) {
        if(CC_EDITOR) return;

        let self = this;

        //注册游戏事件
        cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {
            this.target.emit(this.event.INIT);
            // if(!CC_BUILD){
            //     ResourceManager.default.loadLogin((error, wrapper)=>{
            //         if(error){

            //         }
            //     }, {
            //         autoPreload: true,
            //         autoStart: false,
            //     })
            //     // ResourceManager.default.loadBundleDeps(this.wrapper.COMMON, {}, (error, bundle) => {
            //     //     cc.log("my game init.")
            //     // });
            // }
        });
        cc.game.on(cc.game.EVENT_SHOW, () => {
            this.target.emit(this.event.SHOW);
        });
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.target.emit(this.event.HIDE);
        });

        let onResize = this.util.debounce(()=>{
            self.target.emit(self.event.IOS_WEB_RESIZE);
            cc._widgetManager.onResized();
            cc.view._resizeEvent();
        });
        cc.view.resizeWithBrowserSize(false);
        // cc.view.resizeWithBrowserSize(true);
        cc.view.setResizeCallback(() => {
            cc.log("cc.view.setResizeCallback")
            onResize();
        });
        
        cc.director.once(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, (scene) => {
            this.target.emit(this.event.BEFORE_LAUNCH, scene);
        }),
        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, (scene) => {
        }),
    
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, (scene) => {
            this.target.emit(this.event.AFTER_LAUNCH, scene);
        })
        
        this.target.on(this.event.BUNDLE_LOAD, this._onBundleLoad, this);
    },
    destroy: function (params) {
        this.forEach(function (instance) {
            if(typeof instance.destroy == 'function'){
                instance.destroy();
            }
        })
        this.target.targetOff(this);
    },
    update: function (dt) {
        // this._updates.forEach(instance => {
        //     instance.update(dt);
        // });
    },
    forEach: function(callback) {
        this._instances.forEach(instance => {
            callback(instance);
        });
    },
    register: function (key, instance) {
        this[key] = instance;
        if(typeof instance.load == 'function'){
            instance.load();
        }
        if(typeof instance.update == 'function'){
            this._updates.push(instance);
        }
        this._instances.push(instance);
    },
    _onBundleLoad: function (bundle, options) {
        // if(!this._inited && bundle.name==this.wrapper.COMMON){
        //     this.initResourceBundle(bundle);
        // }
    },

}
//bundles 
proto.register("wrapper", WrapperManager.default);
proto.register("bundle", BundleManager.default);

//downloader
proto.register("downloader", DownloaderManager.default);

//environment
proto.register("env", EnvironmentManager.default);

//event
proto.register("target", EventManager.Target);
proto.register("event", EventManager.Event);

//manager
proto.register("audio", AudioManager.default);
proto.register("game", GameManager.default);
proto.register("scene", SceneManager.default);
proto.register("sdk", SDKManager.default);
proto.register("res", ResourceManager.default);
proto.register("ui", UIManager.default);
proto.register("ping", PingManager.default);

//util
proto.register("util", UtilManager.default);
proto.register("url", UrlUtil.default);

//server config manager
proto.register("server", ServerManager.default);

//dev
proto.register("dev", DevManager.default);

//i18n
proto.register("i18n", i18n);

//network
proto.register("net", NetworkGame.default);
proto.register("record", NetworkRecorder.default);
proto.register("statis", NetworkStatistics.default);
proto.register("update", UpdateManager.default);



var _global = "undefined" === typeof window ? global : window;
_global.my = proto;
// proto.load(); //在实际项目中调用
module.exports = proto;
