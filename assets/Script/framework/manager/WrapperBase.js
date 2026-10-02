// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 游戏子包基类
// ]]

let AudioManager = require("AudioManager");
let UIManager = require("UIManager");
let ResourceManager = require("ResourceManager");
let WrapperManager = require("WrapperManager");
let wrapper = WrapperManager.default;

class WrapperBase {
    bundleName = "bundle-name";   //bundle加载后向my.wrapper注册当前wrapper引用的bundleName，可使用my.wrapper.get("bundleName")访问该wrapper
    key = null;             //简化版的name，bundle加载后向app注册当前wrapper引用的key，可使用app[key]访问该wrapper
    bundle = null;
    audio = null;
    ui = null;
    version = "1.0.0";
    _preloadStarted = false;
    _wrapperInited = false;
    _wrapperReady = false;
    _langInited = false;
    constructor(options) {
        QYLogs.log("WrapperBase.constructor", this.constructor.name);
    }
    
    _initWrapper(bundle){
        if(this._wrapperInited) return;
        this._wrapperInited = true;

        this.bundle = bundle;
        this._initAudio(bundle);
        this._initUIManager(bundle);
    }

    setReady(ready){
        this._wrapperReady = ready;
    }
    getReady(){
        return this._wrapperReady;
    }

    /**
     * 
     * @param {*} bundle 
     * @param {*} callback (error)=>void
     */
    create(bundle, callback){
        this._initWrapper(bundle);
        this.onCreate(callback);
    }

    /**
     * 当前wrapper加载后进行一些资源加载操作
     * @param {Function} callback 
     */
    onCreate(callback){
        //模拟资源异步下载
        setTimeout(() => {
            // cc.log("模拟资源异步下载");
            callback&&callback();
        }, 0);
    }

    _initLanguage(){
        cc.error(this.bundleName, "子类覆盖此方法，初始化多语言数据");
    }
    
    /**
     * bundle第一次加载完成会调用load方法（仅调用一次）
     * @param {Bundle} bundle 
     */
    load(bundle) {
        QYLogs.log(this.bundleName, "load to --> app." + this.key, typeof app[this.key]);
        this.bundle = bundle;
        this._initAudio(bundle);
        this._initUIManager(bundle);
    }
    _initAudio(bundle){
        if(this.audio) return;

        this.audio = new AudioManager(bundle, this);
    }
    _initUIManager(bundle){
        if(this.ui) return;
        
        this.ui = new UIManager(bundle, this);
    }
    
    /**
     * bundle每次加载完成都会调用init方法
     * @param {Object} options
     */
    init(options) {
        this._initLanguage(options);
    }

    destroy() {}

    /**
     * bundle每次加载完成都会调用start方法
     * @param {Object} options 
     */
    start(options) {
        //cc.warn(this.bundleName, "start", options);
         //console.log("场景即将加载2");
        options = options || {};
        let sceneName = options.sceneName || this.bundle.name;
        ResourceManager.default.loadScene(sceneName, options);
    }
    preinit(options){
        if(options){
            this.setVersion(options.version);
        }
    }
    /**
     * 预加载
     * @param {Object} options 
     */
    preload(options, callback){
        if(this._preloadStarted) return;
        this._preloadStarted = true;
        callback&&callback(null, this.bundleName);
    }
    
    prestart(options, callback){
        callback&&callback(null);
    }
    /**
     * 多语言路径适配，获取当前皮肤对应的资源路径
     * @param {String} url 
     * @param {String|null} skin_value_in 默认使用 app.config.SKIN
     * @param {String|null} path_resources 资源相对路径，以'/'结尾，默认 'resources/'
     * @returns `${pathResources}skin_${skin_value_in}/${url}`
     * @description  示例参数 url="prefab/MyPanel" 
     * @description  示例参数 skin_value_in="a"
     * @description  示例参数 pathResources='resources/'
     * @description  按优先级依次匹配以下路径
     * @description  resources/skin_`${app.config.SKIN}`/prefab/MyPanel
     * @description  resources/skin_`${app.config.SKIN_DEFAULT}`/prefab/MyPanel
     * @description  resources/skin_default/prefab/MyPanel
     * @description  resources/skin/prefab/MyPanel
     * @description  resources/prefab/MyPanel
     */
    path(url, skin_value_in, path_resources) {
        url = url || "";
        if(url.indexOf("/")==0){
            url = url.substring(1);
        }
        skin_value_in = skin_value_in || app.config.SKIN;
        if(path_resources!==""){
            path_resources = path_resources || "resources/";
            if(path_resources.lastIndexOf("/")!=path_resources.length-1){
                path_resources += "/";
            }
        }
        
        let skin_default = app.config.SKIN_DEFAULT || "default";
        //按优先级依次匹配以下路径
        let target_paths = [
            `${path_resources}skin_${skin_value_in}/${url}`,
            `${path_resources}skin_${skin_default}/${url}`,
            `${path_resources}skin_default/${url}`,
            `${path_resources}skin/${url}`,
            `${path_resources}${url}`,
        ]
        let temp = {};
        for (let index = 0; index < target_paths.length; index++) {
            url = target_paths[index];
            if(temp[url]){
                continue;
            }
            temp[url] = true;
            if(this.bundle.getInfoWithPath(url)){
                break;
            }
        }
        
        return url;
    }
    getVersion(){
        return this.version;
    }
    setVersion(version){
        if(!version) return;
        cc.log(`游戏版本号: bundle ${this.bundleName} = ${version}`)
        this.version = version;
    }
}

// let instance = new WrapperBase();
// wrapper.register(instance.name, instance);

module.exports = WrapperBase;