/*****************************************************************************
* @Author:      mygame
* @Date:        2020-06-01 12:05:23
* @Description: 全局应用委托
*****************************************************************************/

let my = require("my");
let SceneBase = require("SceneBase");
let EventManager = my.EventManager;
let Event = EventManager.Event;

class AppDelegate{
    name = "AppDelegate";
    node = null;
    application = null;

    /**
     * 获取当前场景 cc.Canvas (浏览器控制台调试)
     */
    get canvas(){
        let canvas = cc.director.getScene()?.getChildByName('Canvas')?.getComponent(cc.Canvas);
        return canvas;
    }

    /**
     * 获取当前场景基类 SceneBase (浏览器控制台调试)
     */
    get scene(){
        let scene = this.canvas?.getComponent(SceneBase);
        return scene;
    }

    /**
     * 框架准备就绪
     */
    get _isReady(){
        return this._launched && this._loaded;
    }
    
    _preInited = false;
    _preloaded = false;
    _loaded = false;
    _launched = false;
    _started = false;

    constructor(){
        if(CC_EDITOR) return;

        let application = this.application = new my.Application(this);
        this.node = application.node;
        this.load(application.target);
        this.setup();
    }
    
    /**
     * 框架初始化
     */
    setup(){
        window.my.load();
    }
    register(key, instance) {
        this[key] = instance;
    }
    load(target){
        target.on(Event.INIT, this.onInit, this);
        target.on(Event.BEFORE_LAUNCH, this.onBeforeLaunch, this);
        target.on(Event.AFTER_LAUNCH, this.onAfterLaunch, this);
        target.on(Event.BEFORE_UPDATE, this.onUpdate, this);
        target.on(Event.AFTER_UPDATE, this.onLateUpdate, this);
        target.on(Event.BUNDLE_REG, this.onBundleReg, this);
    }
    invoke(){
        if(this._started) return;
        if(this._isReady){
            this._started = true;
            this.onStart();
        }
    }
    run(onLoad, onLaunch){
        my.scene.loadEmpty(onLoad, onLaunch);
    }
    
    addComponent(component){
        return this.node.addComponent(component);
    }
    getComponent(component){
        return this.node.getComponent(component);
    }
    removeComponent(component) {
        return this.node.removeComponent(component);
    }
    getLatency() {
        return this.application.getLatency();
    }
    setLatency(value) {
        return this.application.setLatency(value);
    }
    getRoot() {
        return this.application.node;
    }
    addRoot(node) {
        this.application.addRoot(node);
    }

    /**
     * 由引擎 cc.Director.EVENT_BEFORE_SCENE_LAUNCH 事件触发
     */
    onBeforeLaunch(){
        if(this._preloaded) return;
        this._preloaded = true;

        this.onPreload();
    }

    /**
     * 由引擎 cc.Director.EVENT_AFTER_SCENE_LAUNCH 事件触发
     */
    onAfterLaunch(){
        if(this._launched) return;
        this._launched = true;

        this.onLaunch();

        this.invoke();
    }
    onBundleReg(key, instance){
        this.register(key, instance);
    }
    /**
     * 引擎初始化前手动调用
     */
    preInit(){
        if(this._preInited){
            return;
        }
        this._preInited = true;
    }

    /**
     * 由引擎 cc.game.EVENT_ENGINE_INITED 事件触发
     * 子类重写此方法，初始化环境变量等
     */
    onInit(){
    }
    /**
     * 场景启动前触发（只触发一次）
     * 全局 ui 控件加载
     */
    onPreload(){
        // cc.warn(this.name, "子类覆盖此方法，初始化需要跟node节点相关的组件等");
        
        let self = this;
        //TODO 项目预加载全局资源
        setTimeout(() => {
            self._loaded = true;
            self.invoke();
        }, 0);
    }

    /**
     * 场景启动后触发（只触发一次）
     */
    onLaunch(){
        // cc.warn(this.name, "子类覆盖此方法，开始启动逻辑");
    }
    
    /**
     * 首场景启动后，并且全局ui控件加载完成后调用（只触发一次）
     */
    onStart(){
        // cc.warn(this.name, "子类覆盖此方法，开始游戏逻辑等");
    }

    /**
     * 场景每帧调用
     * @param dt 
     */
    onUpdate(dt){
        //cc.warn(this.name, "子类覆盖此方法，自定义update逻辑");
    }

    /**
     * 场景每帧调用
     * @param dt 
     */
    onLateUpdate(dt){
        //cc.warn(this.name, "子类覆盖此方法，自定义lateUpdate逻辑");
    }
}

module.exports = AppDelegate;