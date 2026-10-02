/*****************************************************************************
* @Author:      mygame
* @Date:        2020-06-01 12:05:23
* @Description: 全局应用管理类
*****************************************************************************/

let QYLogs = require("QYLogs");
let AudioManager = require("AudioManager");
let EventManager = require("EventManager");
let WrapperManager = require("WrapperManager");
let target = EventManager.Target;
let event = EventManager.Event;
let audio = AudioManager.default;
let wrapper = WrapperManager.default;

let COMPONENTNAME = "[APP]";

class Application {
    node = null; //AppComponent挂载的根节点
    target = new cc.EventTarget();
    _components = []; //全局挂载组件
    _roots = []; //全局不销毁的所有节点
    _latency = 0; //网络延迟
    _listLatency = [];
    _launched = false; //启动标志

    constructor(options) {
        // this._initEnv();
        this.load();
    }

    initEnv() {
        if (!CC_BUILD) {
            QYLogs.error("Application", "子类覆盖此方法，初始化环境变量");
        }
    }
    load() {
        this._addNode(COMPONENTNAME);

        target.on(event.RESIZE, this._onResize, this);
        target.on(event.INIT, this._onAppInit, this);
        target.on(event.SHOW, this._onAppShow, this);
        target.on(event.HIDE, this._onAppHide, this);
        target.on(event.BEFORE_LAUNCH, this._beforeLaunch, this);
        target.on(event.AFTER_LAUNCH, this._afterLaunch, this);
        target.on(event.BEFORE_UPDATE, this._beforeUpdate, this);
        target.on(event.AFTER_UPDATE, this._afterUpdate, this);
        target.on(event.BUNDLE_LOAD, this._onBundleLoad, this);
    }
    destroy() {
        target.targetOff(this);
    }
    register(key, instance) {
        this[key] = instance;
        // cc.log("App.register", key, typeof instance);
    }
    // isLoaded(){
    //     return true;
    // }

    getLatency() {
        return this._latency;
    }

    setLatency(value) {
        QYLogs.log("Application", "网络时延：" + value + "(ms)");
        this._latency = value;
        // MsgManager.fire(MSG.WEBSOCKET.LATENCY);
    }
    getRoot() {
        return this.node;
    }
    addRoot(node) {
        //设置该对象为不销毁
        cc.game.addPersistRootNode(node);
        this._updatePosition(node);
        this._roots.push(node);
    }
    addComponent(component, callback) {
        !CC_BUILD&&QYLogs.log("Application", "addComponent", typeof component == 'string' ? component : component.name);
        // if (!this.node) {
        //     this._components.push({
        //         component: component,
        //         callback: callback
        //     });
        //     return null;
        // }

        let com = this.node.addComponent(component);
        callback && callback(com);
        return com;
    }
    getComponent(component) {
        return this.node.getComponent(component);
    }
    removeComponent(component) {
        return this.node.removeComponent(component);
    }
    _onBundleLoad(bundle, options) {
        options = options || {};
        if(options.isExternal){//第三方扩展包
            return;
        }
        
        bundle = bundle || {};
        let rawName = bundle && bundle.name ? bundle.name : "";
        cc.warn("Application", "BUNDLE_LOAD. name=" + (rawName || "[undefined]"));
        if (!rawName) {
            QYLogs.warn("Application", "跳过一个空 bundle，避免未注册告警 name=[undefine]");
            return;
        }
        let name = rawName;
        let instance = wrapper.get(name);
        if (!instance) {
            instance = wrapper.unregister(name);
            if (!instance) {
                QYLogs.error("Application", "未注册的bundle. name="+name);
                return;
            } else {
                wrapper.set(name, instance);
                //初始化公共包资源加载管理器
                let key = instance.key;
                if (typeof key == 'string' && key != "") {
                    if (this[key]) {
                        QYLogs.error("Application", "当前bundle key已存在");
                    } else {
                        this.register(key, instance);
                        this.target.emit(event.BUNDLE_REG, key, instance);
                    }
                } else {
                    QYLogs.error("Application", "不合法的bundle key. key=" + key);
                }
                instance.load(bundle);
            }
        }

        instance.preinit(options);
        if(!options.autoPreload){
            if (options.autoStart) {
                instance.prestart(options, (error)=>{
                    instance.init(options);
                    instance.start(options);
                })
            }
            // else{
            //     instance.init(options);
            // }
        }
    }
    _updatePosition(node) {
        // QYLogs.log("Application", "_updatePosition: name="+node.name, cc.winSize);
        let size = cc.winSize;
        node.width = size.width;
        node.height = size.height;
        node.x = size.width / 2;
        node.y = size.height / 2;
    }
    _onResize() {
        QYLogs.log("Application", "WINDOW_RESIZE");

        for (let index = 0; index < this._roots.length; index++) {
            let node = this._roots[index];
            this._updatePosition(node);
        }
    }
    _onAppShow() {
        QYLogs.log("Application", "ENGINE.GAME_EVENT_SHOW");

        // // audio.resumeAll();
        // audio.resumeMusic();
        // audio.resumeAllEffects();

        if(!window.app) return;

        //埋点
        if (!cc.director.getScene()) return;
        let sceneNmae = cc.director.getScene().name;
        if(sceneNmae.charAt(sceneNmae.length - 2) === "_"){
            sceneNmae = sceneNmae.substring(0,sceneNmae.length-2);
        }        
        app.statis.upload({
            sUiPath: sceneNmae,
            sEvent: "frontground",
        });
    }
    _onAppHide() {
        QYLogs.log("Application", "ENGINE.GAME_EVENT_HIDE");

        // // audio.pauseAll();
        // audio.pauseMusic();
        // audio.pauseAllEffects();
        
        if(!window.app) return;
        
        //埋点
        if (!cc.director.getScene()) return;
        let sceneNmae = cc.director.getScene().name;
        if(sceneNmae.charAt(sceneNmae.length - 2) === "_"){
            sceneNmae = sceneNmae.substring(0,sceneNmae.length-2);
        }       
        app.statis.upload({
            sUiPath: sceneNmae,
            sEvent: "background",
        });
    }
    _onAppInit() {
        QYLogs.log("Application", "ENGINE.INIT");
        this.target.emit(event.INIT);
    }
    _beforeLaunch(scene) {
        QYLogs.warn("Application", "BEFORE_LAUNCH");

        function _initCollision() {
            // let manager = cc.director.getCollisionManager(); // 获取碰撞管理器
            // if(manager){
            //     manager.enabled = true; // 开启碰撞
            //     manager.enabledDebugDraw = true; // 允许绘制碰撞的区域
            //     // manager.enabledDrawBoundingBox = true;
            // }
        }

        function _initPhysics() {
            // let manager = cc.director.getPhysicsManager();
            // if(manager){
            //     manager.enabled = true;
            // }
        }
        _initCollision();
        _initPhysics();

        // for (let index = 0; index < this._components.length; index++) {
        //     let item = this._components[index];
        //     this.addComponent(item.component, item.callback);
        // }
        // this._components.length = 0;

        this.target.emit(event.BEFORE_LAUNCH);
    }
    _afterLaunch(scene) {
        if (!this._launched) {
            QYLogs.warn("Application", "AFTER_LAUNCH");
            this._launched = true;
            this.addRoot(this.node);
        }
        this._onResize();
        this.target.emit(event.AFTER_LAUNCH);
    }
    _beforeUpdate(){
        let deltaTime = cc.director.getDeltaTime();
        this.target.emit(event.BEFORE_UPDATE, deltaTime);
    }
    _afterUpdate(){
        let deltaTime = cc.director.getDeltaTime();
        this.target.emit(event.AFTER_UPDATE, deltaTime);
    }

    _addNode(name) {
        if (this.node) return;
        name = name || "<AppRoot>";
        let node = new cc.Node(name);
        this.node = node;
        // this.addRoot(node);
    };

    _onHeartbeat(delay) {
        this._listLatency.push(delay);
        if (this._listLatency.length > 3) {
            this._listLatency.shift();
        }

        let sum = 0;
        let average = 0;
        if (this._listLatency.length > 0) {
            let array = this._listLatency;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                sum += element;
            }

            average = Math.round((sum / array.length) / 1);
            if (average > 999) {
                QYLogs.log("Application", "网络时延当前值：" + delay + "(ms)");
                average = 999;
            }
        }
        this.setLatency(average);
    }
    _clearLatency(){
        this._listLatency.length = 0;
        this.setLatency(0);
    }
}

// Application.default = CC_EDITOR ? {} : new Application(null);
module.exports = Application;