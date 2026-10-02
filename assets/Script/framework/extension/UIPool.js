// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-07-18 10:05:23
//     * @Description: UI缓存池
//     * 调用UIPool.reuse后prefab实例化过程： 
//     * instantiate --> reuse --> (外部调用初始化代码) --> (外部调用addChild) --> onLoad --> onEnable --> start
// ]]

function UIPool(bundle) {
    this._bundle = null;
    this._mapPool = new Map;
    this._mapPrefab = new Map;
    this._callbacks = new Array;
    this._eachPoolSize = 1;
    this._loadIndex = 0;
    this._loading = false;
    this._loadingInterrupt = false;
    this._timeInterval = null;
    this._timeStart = null;
    this._handleUnuse = null;
    this._config = [];
    this.init(bundle);
}

UIPool.prototype.init = function(bundle){
    this._bundle = bundle;
}

/**
 * 加载配置(可重复配置)
 * @param config 需要预加载的prefab列表 (e.g. config = ["prefab/UIFlyText", {path:"popup/UIDialog", size:2}]) 
 *               1 可直接按字符路径加载，默认size=1
 *               2 可指定path路径并指定size大小
 * @param eachPoolSize 初始创建时每种prefab类型缓存池的大小
 * @param componentName 指定加载到prefab上的组件（如果没指定，则默认加载prefab同名组件）
 * @param callback(loadCount, totalCount, success)
 */
UIPool.prototype.loadConfig = function (config, eachPoolSize, componentName, callback) {
    if(!config) return;
    
    this._eachPoolSize = (null!=eachPoolSize) ? eachPoolSize : 1;
    this._componentName = componentName;
    
    if(typeof config == "string"){
        config = [
            {path: config, size: this._eachPoolSize},
        ];
    }
    
    if(callback){
        this._callbacks.push(callback);
    }

    if(this.isLoaded()){
        this._config = config;
        this._startPreload();
    }
    else{
       // this._config = this._config.concat(config);
        for(let i=0;i<config.length;i++){
            this._config.push(config[i])
        }
        if(this._loadingInterrupt){
            this._startPreload();
        }
    }
}

/**
 * 开始预加载
 * @param callback(loadCount, totalCount)
 */
UIPool.prototype._startPreload = function () {
    let self = this;
    self._timeStart = Date.now(); 
    let interval = 1/cc.game.getFrameRate() * 1000;
    interval = Math.round(interval);
    self._stopPreload();
    if(!this._loadingInterrupt){
        this._loadIndex = 0
    }
    this._loadingInterrupt = false;
    let countReload = 0;  //加载失败后重试次数
    let countReloadMax = 3; //加载失败后最大重试次数
    self._timeInterval = setInterval(() => {
        if(self._loading) return;
        if(self._loadIndex>=self._config.length){
            self._stopPreload();
            return;
        }
        
        let now = Date.now();
        let deltaTime = now - self._timeStart;
        if(deltaTime<cc.director.getDeltaTime()*1000) return;
        
        self._timeStart = now;
        self._loading = true;
        self._loadNext(function (loadCount, totalCount, success) {
            //加载失败的情况
            if(!success){
                countReload++;
                if(countReload<=countReloadMax){
                    self._loading = false;
                    return;
                }
                else{
                    self._loadingInterrupt = true;
                    self._stopPreload();
                    self._config = new Array;
                    self._loadIndex = 0;
                }
            }
            
            for(let i=self._callbacks.length-1; i>=0; i--){
                let handler = self._callbacks[i];
                if(null!=handler){
                    handler(loadCount, totalCount, success);
                }
                //finish or interrupt
                if(loadCount == totalCount || self._loadingInterrupt){
                    self._callbacks.splice(i, 1);
                }
            }
            self._loading = false;
        });
    }, interval);
}

UIPool.prototype._stopPreload = function(){
    if(null!=this._timeInterval){
        clearInterval(this._timeInterval);
        this._timeInterval = null;
    }
}

UIPool.prototype.getAllComponentName = function() {
    let array = [];
    this._mapPrefab.forEach(function (value, key, map) {
        array.push(key);
    });
    return array;
}

UIPool.prototype.isLoaded = function () {
    let finish = this._loadIndex>=this._config.length ? true : false;
    return finish;
}

UIPool.prototype.setHandleUnuse = function (handle) {
    this._handleUnuse = handle
}

UIPool.prototype.add = function (prefab, count) {
    let self = this;
    let component = prefab.name;
    let pool = self._getPool(component);
    let istart = pool.size();
    let size = count || istart+1;
    for (let index = istart; index < size; index++) {
        let node = self._instantiate(prefab);
        pool.put(node);
    }
    self._mapPrefab.set(component, prefab);
}

UIPool.prototype.reuse = function (component, args) {
    if(!this.isLoaded()){
        cc.warn("预加载尚未结束", component);
        return null;
    } 

    if(!component){
        cc.error("Component can not be null string");
        return null;
    }

    let pool = this._getPool(component);
    if(pool.size()==0){
        let prefab = this._mapPrefab.get(component);
        let node = this._instantiate(prefab);
        if(null==node){
            //  //console.debug("null [name]", component);
        }
        else{
            pool.put(node);
        }
    }
    if(pool.size()>0){
        let node = pool.get(args);
    
        let componentName = this._componentName ? this._componentName : component;
        let comp = node.getComponent(componentName);
        if(!comp){
            cc.error("UIPool", "未找到组件：componet="+componentName);
        }
        return comp;
    }
    
    return null;
}

UIPool.prototype.unuse = function (node) {
    let pool = this._mapPool.get(node.name);
    if(null!=pool){
        if(this._handleUnuse){
            this._handleUnuse(node);
        }
        // node.stopAllActions();
        node.cleanup();
        pool.put(node);
    }
}

UIPool.prototype.clear = function(componentName){
    this._mapPool.forEach((pool, key, map) => {
        if(null!=componentName){
            if(key==componentName){
                pool.clear();
            }
        }
        else{
            pool.clear();
        }
        map.delete(key);
    });
    this._mapPool = new Map;
}

UIPool.prototype._loadNext = function (callback) {
    let self = this;
    let array = self._config;
    if(self._loadIndex>=array.length) return;

    const element = array[self._loadIndex];
    let size = self._eachPoolSize;
    let path = element;
    if(typeof element == "object"){
        path = element.path;
        if(element.size){
            size = element.size;
        }
    }

    self._loadPrefab(path, size, function (prefab) {
        if(prefab){
            self._loadIndex++;
        }
        else{
            //加载失败
        }
        if(null!=callback){
            callback(self._loadIndex, array.length, !!prefab);
        }
    })

}

/**
 * @param path 为相对 resources 的路径
 */
UIPool.prototype._loadPrefab = function(path, size, callback){
    let self = this;
    if(!this._bundle){
        this._bundle = cc.resources;
        if(!this._bundle){
            cc.warn("UIPool", "当前项目assets目录下不存在resources目录");
            return;
        }
    }
    this._bundle.load(path, cc.Prefab, function (error, prefab) {
        if (error) {
            if(null!=callback){
                callback(null);
            }
             //console.error(error);
            cc.warn(error);
            return;
        }

        self.add(prefab, size);
        
        if(null!=callback){
            callback(prefab);
        }
    });
}

UIPool.prototype._instantiate = function(prefab){
    if(!prefab){
         //console.debug("prefab未预加载");
        return null;
    }
    
    let node = cc.instantiate(prefab);
    let componentName = this._componentName ? this._componentName : node.name;
    if(this._componentName && !node.getComponent(componentName)){
        node.addComponent(componentName);
    }
    
    let handler = componentName ? node.getComponent(componentName) : null;
    if (handler && handler._setUIPool) {
        handler._setUIPool.call(handler, this);
    }
    return node;
}

UIPool.prototype._getPool = function (component) {
    if(!component){
        cc.error("component can not be null string");
        return component;
    }

    let pool = this._mapPool.get(component);
    if(!pool){
        let componentName = this._componentName ? this._componentName : component;
        pool = new cc.NodePool(componentName);
        this._mapPool.set(component, pool);
    }
    return pool;
}

module.exports = UIPool;
