let BridgeManager = require("BridgeManager");

//第三方游戏厂商主入口包名（与编辑器内设置的 bundle name 相同）
const THIRD_PARTY_MAIN_BUNDLE_NAME = "game-common";

class WrapperGameCommon {
    bundleName = THIRD_PARTY_MAIN_BUNDLE_NAME;

    bundle = null;
    _wrapperReady = false;
    _bridgeManager = null;
    _onStart = null;
    _onExit = null;

    constructor() {
        this._bridgeManager = new BridgeManager(this);
    }

    /**
     * 扩展包创建（由主包调用）
     * @param {cc.AssetManager.Bundle} bundle 
     * @param {Function} callback 
     */
    create(bundle, callback){
        this.bundle = bundle;
        this.onCreate(callback);
    }


    /**
     * 扩展包实现初始化逻辑
     * @param {Function} callback 
     */
    onCreate(callback){
        //TODO 模拟资源异步下载
        setTimeout(() => {
            //加载完成后回调
            callback&&callback();
        }, 0);
    }

    setReady(ready){
        this._wrapperReady = ready;
    }
    getReady(){
        return this._wrapperReady;
    }

    /**
     * 扩展包加载初始化（由主包调用）
     * @param {Object} options
     * @description {Function} options.onStart 扩展包初始化后回调
     * @description {Function} options.onExit 扩展包退出后回调
     */
    init(options){
        this._onStart = options.onStart;
        this._onExit = options.onExit;
    }

    /**
     * 扩展包启动（由主包调用）
     * @param {Array[event]} event_array 扩展包启动时带入的消息
     */
    start(event_array){
        this._onStart&&this._onStart();

        for (let index = 0; index < event_array.length; index++) {
            let event = event_array[index];
            this.onMessage(event);
        }
    }

    /**
     * 扩展包退出，返回主包大厅（扩展包自己控制）
     */
    exit(){
        this._onExit&&this._onExit();
    }

    /**
     * 消息接收
     * @param {Object} event = {
     *  msg: string, //AppBridge.EVENT.XXX
     *  key: string, //AppBridge.APPKEY.XXX
     *  data: object
     * }
     */
    onMessage(event){
        this._bridgeManager.onMessage(event);
    }

    /**
     * 消息发送
     * @param {String} msg 
     * @param {Object} data 
     */
    postMessage(msg, data){
        this._bridgeManager.postMessage(msg, data);
    }

    /**
     * 更新语言包配置
     *
     * @param {string} lang
     */
     updateLanguage(lang, onComplete){
        this._bridgeManager.updateLanguage(lang, onComplete);
     }
}

let instance = new WrapperGameCommon();
//定义为全局唯一对象
window[THIRD_PARTY_MAIN_BUNDLE_NAME] = instance;
        
module.exports = instance;