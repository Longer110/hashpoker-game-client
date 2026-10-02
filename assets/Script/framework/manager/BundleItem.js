// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 预加载子包对象
// ]]

let LocalStorage = require("StorageManager").default;
let EventManager = require("EventManager");
let Target = EventManager.Target;
let Event = EventManager.Event;
let wrappers = require("WrapperManager").default;
let env = require("EnvironmentManager").default;

let SHOW_LOG = false;

let ItemEvent = {
    VERSION_ERROR: "VERSION_ERROR",
    VERSION_LOADED: "VERSION_LOADED",
}

let ItemStatus = {
    NONE: "NONE",
    LOADING: "LOADING",
    FINISH: "FINISH",
    ERROR: "ERROR",
}
        
let BundleItem = function (manager) {
    this.name = "BundleItem";
    this.loadStatus = ItemStatus.NONE;
    this.preloadStatus = ItemStatus.NONE;
    this.bundle = null;
    this.wrapper = null;
    this.manager = manager;
    this.resource = manager.resource;
    this.handlers = [];
}

BundleItem.ItemStatus = ItemStatus;
BundleItem.ItemEvent = ItemEvent;

let proto = BundleItem.prototype;

proto.init = function (nameOrUrl, options, onComplete) {
    if(options && typeof options != 'object'){
        cc.error("options 必须为 object 类型");
        options = {};
    }
    if(!options){
        options = {};
    }

    let bundleName = options.bundleName || nameOrUrl;
    if(!options.sceneName){
        options.sceneName = bundleName;
    }
    if(typeof options.autoStart == 'undefined' && !options.autoPreload){
        options.autoStart = true;
    }

    this.bundleName = bundleName;

    let callback = onComplete || function (params) {
        SHOW_LOG&&console.error("BundleItem: onComplete: ", bundleName);
    };

    this.options = options;
    // this.onComplete = onComplete || function (params) {
    //     SHOW_LOG&&console.error("BundleItem: onComplete: ", bundleName);
    // };
    this.handlers.push({
        options: options,
        onComplete: callback,
    });

    if(this.loadStatus == ItemStatus.FINISH){
        if(this.wrapper && this.wrapper.getReady()){
            setTimeout(() => {
                this.onBundleLoaded(null);
            }, 0);
        }
    }
}

// proto.isReady = function (params) {
//     return this.loadStatus == ItemStatus.NONE;
// }

// proto.isLoading = function (params) {
//     return this.loadStatus == ItemStatus.LOADING;
// }

// proto.isFinish = function (params) {
//     return this.loadStatus == ItemStatus.FINISH;
// }

// proto.isError = function (params) {
//     return this.loadStatus == ItemStatus.ERROR;
// }

proto.load = function (params) {
    if(SHOW_LOG){
        console.error("BundleItem: start load: ", this.bundleName, JSON.stringify(this.options));
    }
    else{
        cc.log("BundleItem: start load: ", this.bundleName);
    }
    this.loadStatus = ItemStatus.LOADING;
    this.loadBundleWrapper(this.bundleName, this.options);
}

/**
 * 加载子包bundle
 * nameOrUrl: string,
 * options: Record<string, any>,
 * onComplete: function(err: Error, wrapper: {bundle, audio, ui})
 */
proto.loadBundleWrapper = function (nameOrUrl, options) {
    // // if(typeof options == 'function'){
    // //     onComplete = options;
    // //     options = {};
    // // }
    // if(options && typeof options != 'object'){
    //     cc.error("options 必须为 object 类型");
    //     options = {};
    // }
    // if(!options){
    //     options = {};
    // }

    let bundleName = options.bundleName || nameOrUrl;
    // if(!options.sceneName){
    //     options.sceneName = bundleName;
    // }
    // if(typeof options.autoStart == 'undefined' && !options.autoPreload){
    //     options.autoStart = true;
    // }

    window.logTimestamp("BundleItem.js loadBundleWrapper '" + bundleName + "' start");

    let self = this;
    let manager = this.manager;
    
    if(!options.autoPreload && !options.isDepend){
        Target.emit(Event.LOAD_WRAPPER_START, {
            bundleName: nameOrUrl,
        })
    }
    options.url = options.url || nameOrUrl;
    
    //版本获取
    let promise = self._loadBundleVersionsAsync(bundleName, nameOrUrl, options);
    promise
    // .then(function (lang_data) {
    //     if(!options.md5){
    //         let md5 = manager.getBundleVersion(bundleName);
    //         if(md5){
    //             options.md5 = md5;
    //         }
    //     }
        
    //     //版本获取成功，检查并更新子包
    //     return self._checkAndUpdateBundleAsync(nameOrUrl, options);
    // })
    // .then(function (success) {
    //     if(!options.md5){
    //         let md5 = manager.getBundleVersion(bundleName);
    //         if(md5){
    //             options.md5 = md5;
    //         }
    //     }
    //     return self._loadBundleZipAssetAsync(bundleName, options);
    // })
    .then(function (asset) {
        window.logTimestamp("BundleItem.js loadBundleWrapper '" + bundleName + "' _loadBundleVersionsAsync");

        if(!options.md5){
            let md5 = manager.getBundleVersion(bundleName);
            if(md5){
                options.md5 = md5;
            }
        }
        //更新成功，加载bundle
        let remote_bundle = options.url || nameOrUrl;
        return self._loadBundleWrapperAsync(remote_bundle, options)
    })
    .then( function (bundle) {
        window.logTimestamp("BundleItem.js loadBundleWrapper '" + bundleName + "' _loadBundleWrapperAsync");

        self.bundle = bundle;
        //加载bundle成功，加载多语言配置
        return self.loadBundleLangDataAsync(bundleName, options);
    })
    .then(function(lang_data){
        window.logTimestamp("BundleItem.js loadBundleWrapper '" + bundleName + "' loadBundleLangDataAsync");

        return self._onWrapperReady();
    })
    .then(function (success) {
        window.logTimestamp("BundleItem.js loadBundleWrapper '" + bundleName + "' _onWrapperReady");

        self.onBundleLoaded(null);
    })
    .catch(function (error) {
        // if(!options.isDepend){
        //     Target.emit(Event.LOAD_WRAPPER_END, {
        //         bundleName: bundleName,
        //         success: false,
        //     })
        // }

        if(error.type == "version_error"){
            cc.error("子包版本获取失败：", error.msg);
        }
        else if(error.type == "update_error"){
            cc.error("子包更新失败：", error.msg);
        }
        else if(error.type == "load_error"){
            cc.error("子包加载失败：", error.msg);
        }
        else if(error.type == "run_error"){
            cc.error("场景启动失败：", error.msg);
        }
        else if(error.type == "ready_error"){
            cc.error("子包资源初始化失败：", error.msg);
        }
        else{
            cc.error("ResourceManager", "未知错误：", error);
        }

        window.logTimestamp("BundleItem.js loadBundleWrapper '" + bundleName + "' catch error");

        self.onBundleLoaded(error);
    });
}

proto.onBundleLoaded = function (error) {
    let self = this;
    // let options = this.options;
    let bundleName = this.bundleName;
    let bundle = this.bundle;
    let success = !error ? true : false;

    if(SHOW_LOG){
        console.error("BundleItem onComplete: ", this.bundleName, JSON.stringify(this.options));
    }
    else{
        cc.log("BundleItem onComplete: ", this.bundleName);
    }

    this.handlers.forEach(item => {
        let options = item.options;
        if(!options.autoPreload && !options.isDepend){
            Target.emit(Event.LOAD_WRAPPER_END, {
                bundleName: bundleName,
                success: success,
            })
        }
    });
    
    let wrapper_loaded = null;//bundle_wrapper;
    if(!error){
        if(!bundle){
            cc.error(`BundleItem.onBundleLoaded 缺少 bundle 对象，无法读取 name. bundleName=${bundleName}`);
            error = {
                type: "ready_error",
                msg: `子包资源对象缺失: ${bundleName}`,
            };
        } else {
            //加载bundle成功
            this.handlers.forEach(item => {
                Target.emit(Event.BUNDLE_LOAD, self.bundle, item.options);
            });
            
            let instance = this._getWrapper(bundle.name);
            wrapper_loaded = instance;//bundle_wrapper;
            this.wrapper = instance;
        }
    }
    
    this.loadStatus = error ? ItemStatus.ERROR : ItemStatus.FINISH;
    this.manager.onLoadItem(error, this);
    
    // this.onComplete(error, wrapper_loaded);
    this.handlers.forEach(item => {
        item.onComplete(error, wrapper_loaded);
    });
    this.handlers.length = 0;
}

proto._getWrapper = function (bundle_name) {
    return wrappers.get(bundle_name) || wrappers.getWrapper(bundle_name) || window[bundle_name];    
}

proto._onWrapperReady = function () {
    let bundle = this.bundle;
    let wrapper = this._getWrapper(bundle.name);
    let promise = new Promise((resolve, reject) => {
        if(wrapper && typeof wrapper.create == 'function'){
            wrapper.create(bundle, (error)=>{
                if(!error){
                    wrapper.setReady(true);
                    resolve(true);
                }
                else{
                    reject({
                        type: "ready_error",
                        msg: "子包资源初始化失败"
                    });
                }
            });
        }
        else{
            resolve(true);
        }
    });

    return promise;
}
/**
 * 异步加载bundles版本相关信息
 *
 * @param {Function} onComplete
 */
proto._loadBundleVersionsAsync = function (bundleName, url, options) {
    let self = this;
    let manager = this.manager;
    // manager.initBundleVers();

    if(options.md5){
        manager.setBundleVersions({
            [bundleName]: options.md5,
        })
    }
    if(options.langs){
        manager.setBundleLangMD5(bundleName, options.langs);
    }

    let folder = options.folder;
    let promise = new Promise((resolve, reject) => {
        if(manager.getBundleVersion(bundleName) || (!CC_BUILD && !manager.isRemoteURL(url))){
            setTimeout(() => {
                resolve({
                    json: manager.getBundleVersions(),
                })
            }, 0);
        }
        else{
            let options = {
                bundleName: bundleName,
                url: url,
                folder: folder,
            }
            self._loadBundleVersions(options, resolve, reject);
        }
    });

    return promise;
}

proto._loadBundleVersions = function (options, resolve, reject) {
    if(cc.sys.isNative || window.IS_NATIVE_LIB || window.IS_BUILDIN_APP){
        cc.log("Native平台，不需要获取MD5");
        return resolve({
            json: {},
        });
    }
    

    let self = this;
    let manager = this.manager;


    
    var version_file = "bundle.json";
    var url = "";
    if(options.folder){
        url = options.folder + "/";
    }
    url += options.bundleName + "/" + version_file;
    if(typeof options.url == 'string' && manager.isRemoteURL(options.url)){
        let space = "";
        if(options.url[options.url.length-1]!='/'){
            space = '/';
        }
        url = options.url + space + version_file;
    }
    else{
        url = "assets/" + url;
    }

    if(url.includes("live-niuniu") ){//没有牛牛
        return
    }

    let key = "SUBBUNDLE_VERSION";
    let item = LocalStorage.getItem(key);
    if(!item || typeof item!='object'){
        item = {};
    }
    if(!item.main_version){
        item.main_version = window.REMOTE_CLIENT_VERSION || 0;
    }
    if(window.REMOTE_CLIENT_VERSION){
        //如果主包版本不一致，认为是大版本更新，子版本号重置
        if(item.main_version!=window.REMOTE_CLIENT_VERSION){
            item.main_version = window.REMOTE_CLIENT_VERSION
            item.sub_versions = {};
        }
    }

    if(!item.sub_versions){
        item.sub_versions = {};
    }
    let bundle_version = item.sub_versions[options.bundleName];
    if(!bundle_version || typeof bundle_version!='object'){
        bundle_version = item.sub_versions[options.bundleName] = {
            timestamp: 0,
            version: 0,
            md5: 0,
        };
    }

    var ver_local = {
        version: 0,
        timestamp: 0,
        interval: 1000*60*10, //10分钟
    };
    if(typeof window._getClientVersion=='function'){
        ver_local = window._getClientVersion();
        ver_local.interval = ver_local.interval || 0;
    }
    let timenow = Date.now();
    let timestamp = bundle_version.timestamp;

    if(timestamp == 0){
        timestamp = timenow;
    }
    else{
        if((timenow - timestamp) >= ver_local.interval){
            timestamp = timenow;
        }
    }
    
    if(!cc.sys.isNative && !window.IS_NATIVE_LIB && !window.IS_BUILDIN_APP){
        url += '?_v=' + app.config.VERSION;
        if(!manager.disableBundleTimestamp){
            url += '&_t=' + timestamp;
        }
    }
    
    cc.log("BundleItem", "_loadBundleVersions", url);
    
    cc.assetManager.loadRemote(url, function(error, asset) {
        if(error){
            cc.error(self.name, error);
            reject({
                type: "version_error",
                msg: error,
            });
        }
        else{
            let content = asset.json || {};
            if(!content.md5){
                content.md5 = content.version;
            }
            if(content.md5){
                try {
                    let md5_object = JSON.parse(content.md5);
                    if(md5_object && typeof md5_object=='object'){
                        content.md5 = md5_object.bundle;
                        content.langs = md5_object.langs;
                    }
                }
                catch (error) {
                    
                }
                let sub_version = {};
                sub_version[options.bundleName] = content.md5;
                manager.setBundleVersions(sub_version);
                content.langs = content.langs || {};
                manager.setBundleLangMD5(options.bundleName, content.langs);

                bundle_version.md5 = content.md5;
                bundle_version.version = content.version;
                if(content.svnVersion){
                    bundle_version.version = `${content.version}.${content.svnVersion}`;
                    self.options.version = bundle_version.version;
                    manager.updateBundleItemVersion(options.bundleName, bundle_version.version);
                }
                bundle_version.langs = content.langs;
            }
            bundle_version.timestamp = timestamp;
            LocalStorage.setItem(key, item);
            
            resolve({
                json: manager.getBundleVersions(),
            });
        }
    });
}

/**
 * 异步加载子包压缩包资源
 * @param {String} bundleName 
 * @param {Object} options 
 */
proto._loadBundleZipAssetAsync = function (bundleName, options) {
    let promise = this.resource.loadBundleZipAssetAsync(bundleName, options);
    return promise;
}

/**
 * 异步检查子包并更新
 *
 * @param {String} nameOrUrl
 * @param {Object} options
 */
proto._checkAndUpdateBundleAsync = function (nameOrUrl, options) {
    let update_success = true;
    let promise = new Promise((resolve, reject) => {
        //TODO update
        setTimeout(() => {
            if(update_success){
                resolve(update_success);
            }
            else{
                reject({
                    type: "update_error",
                    msg: "子包更新失败"
                });
            }
        }, 0);
    });

    return promise;
}

/**
 * 异步加载子包
 *
 * @param {String} nameOrUrl
 * @param {Object} options
 */
proto._loadBundleWrapperAsync = function (nameOrUrl, options) {
    let self = this;
    let resource = this.resource;

    let promise = new Promise((resolve, reject) => {
        // let config = Object.assign({}, options);
        let config = {
            version: options.md5 ? options.md5 : options.version
        }
        if(!CC_BUILD || cc.sys.isNative || window.IS_NATIVE_LIB || window.IS_BUILDIN_APP){
            config = {};
        }
        if(options.folder){
            config.folder = options.folder;
        }
        resource.loadBundle(nameOrUrl, config, function (error, bundle) {
            if(error){
                reject({
                    type: "load_error",
                    msg: error,
                });
            }
            else{
                resolve(bundle);
            }
        })
    });

    return promise;
}

/**
 * 加载多语言资源相关信息
 *
 * @param {String} lang
 * @param {Object} options
 */
proto.loadBundleLangDataAsync = function (bundleName, options) {
    let self = this;
    let manager = this.manager;
    let resource = this.resource;

    if(!options) options = {};
    if(!options.md5){
        let versions = manager.getBundleVersions();
        options.md5 = versions[bundleName];
    }
    let promise = new Promise((resolve, reject) => {
        let isExternal = !!options.folder; //第三方包
        let data = resource.getBundleLangData(bundleName);
        if(isExternal || data){
            setTimeout(() => {
                resolve(data);
            }, 0);
            return;
        }

        let lang = env.get("lang");
        let lang_md5 = manager.getBundleLangMD5(bundleName, lang);
        if(!lang_md5){
            lang_md5 = options.md5;
        }
        var url = "";
        
        if(!window.IS_BUILDIN_APP && !window.IS_NATIVE_LIB && lang_md5){
            url = `assets/${bundleName}/lang/lang_${lang}.${lang_md5}.json`;
        }
        else{
            url = `assets/${bundleName}/lang/lang_${lang}.json`;
        }

        let _onComplete = function (error, asset) {
            if(error){
                // reject({
                //     type: "lang_error",
                //     msg: bundleName+"语言包下载失败",
                // });

                //返回成功，避免加载流程中止
                resolve({msg: "load lang data error"});
            }
            else{
                let items = asset.json;
                let results = {
                    bundleName: bundleName,
                };
                for (const key in items) {
                    let value = items[key];
                    if(key=='jsons' || key=='fnts'){
                        results[key] = value;
                    }
                    else{
                        let key_assets = `assets/${bundleName}/${key}`;
                        results[key_assets] = value;
                    }
                }
                resource.setBundleLangData(bundleName, results);
                resolve(asset);
            }
        }
        cc.assetManager.loadRemote(url, _onComplete);
    });

    return promise;
}

module.exports = BundleItem;