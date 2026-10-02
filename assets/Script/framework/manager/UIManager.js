// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: UI界面管理
// ]]
let EventManager = require("EventManager");
let Target = EventManager.Target;
let Event = EventManager.Event;

let wrappers = require("WrapperManager").default;
let scene = require("SceneManager").default;
let UIPool = require("UIPool");
let MsgManager = require("MsgManager");
let Msg = require("Msg");
let UIManager = function (bundle, wrapper) {
    this.name = "UIManager";
    this._wrapper = null;
    this._bundle = null;
    this._uiPool = null;
    this._isCommon = false; //是否公共UI
    this._listPopup = {};
    this._initUIPool();
    this.init(bundle, wrapper);
}

let proto = UIManager.prototype;
proto.init = function (bundle, wrapper) {
    this._bundle = bundle;
    this._wrapper = wrapper
    if(this._uiPool){
        this._uiPool.init(bundle);
    }
    MsgManager.un(this.clearScenePool, this);
    MsgManager.on(Msg.UIMANAGER.CLEAR_UIMANAGE_RES, this.clearScenePool, this);
}
proto.load = function (params) {
}
proto.destroy = function (params) {
    MsgManager.un(this.clearScenePool, this);
}
proto.setCommon = function (value) {
    this._isCommon = value;
}
proto.isCommon = function () {
    return this._isCommon;
}
proto._initUIPool = function () {
    this._uiPool = new UIPool();
    this._uiPool.setHandleUnuse(function (node) {
        this._deletePopup(node.name);
    }.bind(this));
}
proto.getUIPool = function (params) {
    return this._uiPool;
}

proto.clearScenePool = function(){
    if(!this._listPopup) return;
    if(!this._uiPool) return;

    if(this.isCommon()){
        return;
    }

    this.removePopup();
    this._uiPool.clear();
}

/**
 * 加载通用弹窗
 * componentPath：预制体全路径
 * callback： 加载完成回调
 * options = {
 *      owner: 当前弹窗放在哪个子包里 (bundleName)
 *      loader: 当前弹窗由哪个子包加载 (bundleName)
 *      params: 预制体传入参数
 *      ... 其它参数
 *  } 
 */
proto.loadPopup = function(componentPath, callback, options){
    if(!componentPath) return;
    if(typeof callback == 'object'){
        options = callback;
        callback = options.callback;
    }
    
    let self = this;
    let pool = self._uiPool;
    options = options || {};
    if(this._wrapper){
        options.owner = this._wrapper.bundleName;
    }
    else{
        options.owner = null!=this._bundle ? this._bundle.name : wrappers.HALL;
    }
    if(!options.loader){
        options.loader = wrappers.HALL;
    }

    let instance = wrappers.get(options.owner);
    if(instance){
        componentPath = instance.path(componentPath, null, options.path_resources);
    }
    else{
        cc.warn("UIManager", "未找到对应bundle wrappers");
    }
    cc.log(self.name, "loadPopup", componentPath);

    let index = componentPath.lastIndexOf('/');
    if(index<0) return;
    let componentName = componentPath.substr(index+1);

    let sceneindex = scene.getIndex();
    if(!options.isShowLoading){

        Target.emit(Event.LOAD_POPUP_START, {
            popupName: componentName,
        })
    }

    let _loadComponent = function () {
        self.removePopup(componentName);
        
        let component = pool.reuse(componentName, options.params);
        if(!component){
            return false;
        }

        if(sceneindex != scene.getIndex()){
            cc.warn(self.name, "场景已切换，不显示该弹窗", componentPath);
            return true;
        }

        cc.log(self.name, "_loadComponent", componentName);
        let uibase = component.getComponent("UIBase");
        if(uibase){
            uibase.setOwner(options.owner);
            uibase.setLoader(options.loader);
        }
        self._addPopup(component.node.name, component);
        callback&&callback(component);

        if(!options.isShowLoading){
            Target.emit(Event.LOAD_POPUP_END, {
                popupName: componentName,
                success: true,
            })
        }
        return true; 
    }
    if(_loadComponent()){
    }
    else{
        pool.loadConfig(componentPath, null, null, function (loadCount, totalCount, success) {
            if(success){
                if(_loadComponent()){
                }
                else{
                    cc.warn(self.name, "_loadComponent", "加载失败");
                    Target.emit(Event.LOAD_POPUP_END, {
                        popupName: componentName,
                        success: false,
                    })

                    //埋点
                    let sceneName = cc.director.getScene().name;
                    if(sceneName.charAt(sceneName.length - 2) === "_"){
                        sceneName = sceneName.substring(0,sceneName.length-2);
                    }                      
                    app.statis.upload({
                        sUiPath: sceneName,
                        sEvent: "timeout",
                        sReason: componentName,
                    });
                }
            }
            else{
                cc.warn(self.name, "loadConfig", "加载失败");
                Target.emit(Event.LOAD_POPUP_END, {
                    popupName: componentName,
                    success: false,
                })
            }
        })
    }
}

proto.removePopup = function(componentName){
    let self = this;
    let _removeOne = function (name) {
        let component = self._listPopup[name];
        cc.log(self.name, "_removePopup", name)
        if(!component){
            return;
        }
        if(cc.isValid(component)){
            let uibase = component.getComponent("UIBase");
            if(uibase){
                uibase.closeImmediate(true);
            }
        }
        else{
            cc.log(self.name, "_removePopup", "当前移除的节点已经释放");
        }
        self._deletePopup(name);

    }
    if(componentName){
        _removeOne(componentName);
    }
    else{
        cc.log(self.name, "移除所有弹窗");
        for(let component in self._listPopup){
            _removeOne(component);
        }
    }
}

proto._addPopup = function (name, component) {
    this._listPopup[name] = component;
}

proto._deletePopup = function (name) {
    // delete this._listPopup[name];
    this._listPopup[name] = undefined;
}

proto.preloadPopup = function (path,type) {
    
    if(!this._bundle){
        cc.warn("UIManager", "当前项目assets目录下不存在resources目录");
        return;
    }

    if(!path) return;
    options = options || {};
    if(this._wrapper){
        options.owner = this._wrapper.bundleName;
    }
    else{
        options.owner = null!=this._bundle ? this._bundle.name : wrappers.HALL;
    }
    if(!options.loader){
        options.loader = wrappers.HALL;
    }
    let instance = wrappers.get(options.owner);
    if(instance){
        path = instance.path(path);
    }
    else{
        cc.warn("UIManager", "未找到对应bundle wrappers");
    }
    this._bundle.preload(path, type ? type:cc.Prefab, function (error, prefab) {
        if (error) {
            cc.warn("UIManager", "预制体预加载错误="+error);
            return;
        }
    });

}



UIManager.default = new UIManager(null);
module.exports = UIManager;