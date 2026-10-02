// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 子包管理
// ]]

const SHOW_LOG = false;
const DEBUG_BUNDLE = true; // 开启详细调试日志

// 调试日志工具
const BundleDebug = {
    log: function(...args) {
        if (DEBUG_BUNDLE) {
             //console.log(`[BundleManager Debug ${new Date().toISOString()}]`, ...args);
        }
    },
    warn: function(...args) {
        if (DEBUG_BUNDLE) {
             //console.warn(`[BundleManager Warn ${new Date().toISOString()}]`, ...args);
        }
    },
    error: function(...args) {
        if (DEBUG_BUNDLE) {
             //console.error(`[BundleManager Error ${new Date().toISOString()}]`, ...args);
        }
    },
    time: function(label) {
        if (DEBUG_BUNDLE) {
             //console.time(`[BundleManager Time] ${label}`);
        }
    },
    timeEnd: function(label) {
        if (DEBUG_BUNDLE) {
             //console.timeEnd(`[BundleManager Time] ${label}`);
        }
    },
    group: function(label) {
        if (DEBUG_BUNDLE) {
             //console.group(`[BundleManager Group] ${label}`);
        }
    },
    groupEnd: function() {
        if (DEBUG_BUNDLE) {
             //console.groupEnd();
        }
    }
};

let AppWebApi = require("AppWebApi");
let LocalStorage = require("StorageManager").default;
let BundleItem = require("BundleItem");
let ItemStatus = BundleItem.ItemStatus;
let ItemEvent = BundleItem.ItemEvent;
let wrapper = require("WrapperManager").default;
let EventManager = require("EventManager");
let Target = EventManager.Target;
let Event = EventManager.Event

let bundle_buildins = ["internal", "main", "resources", "start-scene"];
// let bundle_wrappers_main = [wrapper.COMMON, wrapper.HOME, wrapper.LOGIN, wrapper.HALL];
let bundle_wrappers_main = ["app-common", "game-common", "game-live-assets", "game-live-views", "game-set-assets", "game-set-views", "game-club-assets", "game-club-views","game-club-chat"];
      
const REGEX = /^\w+:\/\/.*/;

let BundleManager = function (params) {
    BundleDebug.log("BundleManager 构造函数开始初始化");
    BundleDebug.time("BundleManager 构造耗时");
    
    this.name = "BundleManager";
    this.bundle_buildins = bundle_buildins;
    this.presets = cc.assetManager.presets;
    this.resource = null;
    this._handlers = {};
    this._bundleVers = null;
    this._bundleLangMD5 = {};
    this._loader = {
        listToLoad: [],
        listLoaded: [],
        listError: [],
    }
    this._preloader = {
        listToLoad: [],
        listLoaded: [],
        listError: [],
    }
    this._curItem = null;
    this._curPreloadItem = null;
    this._timer_loadid = 0;
    this._timer_preloadid = 0;
    this.disableBundleTimestamp = false;
    this._webBundleConfigs = [];
    this._localBundleConfigs = null;
    this._forceRequestConfig = false;
    this._mainBundleInited = false;
    this._mainBundleLangInited = false;
    this._handleBundles = [];
    
    BundleDebug.log("BundleManager 初始化完成", {
        bundle_buildins: this.bundle_buildins,
        bundle_wrappers_main: bundle_wrappers_main,
        presets: !!this.presets
    });
    BundleDebug.timeEnd("BundleManager 构造耗时");
}

let proto = BundleManager.prototype;
proto.load = function (params) {
    BundleDebug.log("BundleManager.load 开始", params);
    BundleDebug.group("BundleManager 加载流程");
    
    try {
        // 记录环境信息
        BundleDebug.log("环境检查", {
            "cc.sys.isNative": cc.sys.isNative,
            "cc.sys.isBrowser": cc.sys.isBrowser,
            "cc.sys.isMobile": cc.sys.isMobile,
            "cc.sys.platform": cc.sys.platform,
            "window._CCBundleConfig": !!window._CCBundleConfig,
            "cc.assetManager.downloader.bundleVers": !!cc.assetManager.downloader.bundleVers
        });
        
        BundleDebug.log("BundleManager.load 完成");
    } catch (error) {
        BundleDebug.error("BundleManager.load 异常", error);
        throw error;
    } finally {
        BundleDebug.groupEnd();
    }
}

proto.destroy = function (params) {
    BundleDebug.log("BundleManager.destroy 开始", params);
    BundleDebug.log("销毁前状态", {
        "_mainBundleInited": this._mainBundleInited,
        "_handleBundles.length": this._handleBundles.length,
        "loader.listToLoad.length": this._loader.listToLoad.length,
        "loader.listLoaded.length": this._loader.listLoaded.length
    });
    BundleDebug.log("BundleManager.destroy 完成");
}

proto.init = function (res) {
    BundleDebug.log("BundleManager.init 开始", {
        "resource": !!res,
        "resource.type": res ? typeof res : "undefined"
    });
    this.resource = res;
    BundleDebug.log("BundleManager.init 完成");
}

proto.isMainBundleInited = function (params) {
    let result = this._mainBundleInited;
    BundleDebug.log("isMainBundleInited 检查", {
        "result": result,
        "params": params
    });
    return result;
}

proto.setupAllMainBundle = function (onComplete) {
    BundleDebug.log("setupAllMainBundle 开始执行");
    BundleDebug.time("setupAllMainBundle 总耗时");
    BundleDebug.group("setupAllMainBundle 执行流程");
    
    try {
        let configs = window._CCBundleConfig;
        
        BundleDebug.log("检查 _CCBundleConfig", {
            "存在": !!configs,
            "类型": typeof configs,
            "键数量": configs ? Object.keys(configs).length : 0,
            "前10个键": configs ? Object.keys(configs).slice(0, 10) : []
        });

        if(!configs){
            BundleDebug.warn("_CCBundleConfig 不存在，跳过主包设置");
            BundleDebug.groupEnd();
            BundleDebug.timeEnd("setupAllMainBundle 总耗时");
            onComplete&&onComplete();
            return;
        };

        let array = bundle_buildins.concat(bundle_wrappers_main);
        let versions = cc.assetManager.downloader.bundleVers || {};
        
        BundleDebug.log("Bundle配置信息", {
            "bundle_buildins": bundle_buildins,
            "bundle_wrappers_main": bundle_wrappers_main,
            "合并后的array": array,
            "versions对象": versions,
            "versions键数量": Object.keys(versions).length
        });
        
        let totals = [];
        let missingConfigs = [];
        
        for (let index = 0; index < array.length; index++) {
            const bundleName = array[index];
            let md5 = versions[bundleName];
            let configKey = "config."+md5+".json";
            let config = configs[configKey];
            
            BundleDebug.log(`处理Bundle[${index}]`, {
                "bundleName": bundleName,
                "md5": md5,
                "configKey": configKey,
                "config存在": !!config
            });
            
            let options = {
                autoPreload: true,
                autoStart: false,
            }

            //扩展包管理模块
            if(bundleName=="game-common"){
                options.isExternal = true;
                BundleDebug.log(`Bundle ${bundleName} 设置为外部包`);
            }

            if(config){
                totals.push({
                    bundleName,
                    config,
                    options,
                });
                BundleDebug.log(`Bundle ${bundleName} 添加到处理列表`);
            } else {
                missingConfigs.push({bundleName, md5, configKey});
                BundleDebug.warn(`Bundle ${bundleName} 缺少配置`, {md5, configKey});
            }
        }
        
        BundleDebug.log("Bundle处理结果", {
            "总数": array.length,
            "成功": totals.length,
            "缺失": missingConfigs.length,
            "缺失列表": missingConfigs
        });

        this._handleBundles = totals;
        window.logTimestamp("BundleManager.js setupAllMainBundle start");

        let count = 0;
        let self = this;
        
        BundleDebug.log("开始创建Bundle", {
            "待处理数量": totals.length,
            "初始count": count
        });
        
        if(totals.length === 0) {
            BundleDebug.warn("没有Bundle需要处理，直接完成");
            self._mainBundleInited = true;
            self.initBundleLangs();
            self.initBundleVers();
            BundleDebug.groupEnd();
            BundleDebug.timeEnd("setupAllMainBundle 总耗时");
            onComplete&&onComplete();
            return;
        }
        
        for (let index = 0; index < totals.length; index++){
            let sub_bundle = totals[index];
            let config = sub_bundle.config;
            let bundleName = sub_bundle.bundleName;
            let options = sub_bundle.options;
            
            BundleDebug.log(`准备创建Bundle[${index}]`, {
                "bundleName": bundleName,
                "config.base": config.base,
                "options": options
            });
            
            if(!config.base){
                config.base = 'assets/' + bundleName + "/";
                BundleDebug.log(`设置config.base = ${config.base}`);
            }
            
            let callback = function (bundle) {
                count++;
                BundleDebug.log(`Bundle创建完成[${bundleName}]`, {
                    "count": count,
                    "total": totals.length,
                    "bundle存在": !!bundle,
                    "bundleName": bundleName
                });
                
                if(bundleName!="game-common" && bundle_wrappers_main.indexOf(bundleName)>=0){
                    if(!bundle){
                        BundleDebug.error(`Bundle ${bundleName} 创建失败，跳过加入loader，避免读取 null.name`);
                    } else {
                        BundleDebug.log(`添加Bundle到loader: ${bundleName}`);
                        // Target.emit(Event.BUNDLE_LOAD, bundle, options);
                        let item = new BundleItem(self);
                        item.init(bundleName, {
                            autoPreload: false,
                            autoStart: false,
                        }, ()=>{});
                        item.bundle = bundle;
                        self._loader.listToLoad.push(item);
                        item.onBundleLoaded(null);
                        BundleDebug.log(`Bundle ${bundleName} 已添加到loader，当前loader数量: ${self._loader.listToLoad.length}`);
                    }
                }
                
                if(count == totals.length){
                    BundleDebug.log("所有Bundle创建完成，开始初始化");
                    self._mainBundleInited = true;
                    window.logTimestamp("BundleManager.js setupAllMainBundle complete");

                    BundleDebug.log("开始初始化BundleLangs");
                    self.initBundleLangs();
                    BundleDebug.log("开始初始化BundleVers");
                    self.initBundleVers();
                    
                    BundleDebug.log("setupAllMainBundle 全部完成");
                    BundleDebug.groupEnd();
                    BundleDebug.timeEnd("setupAllMainBundle 总耗时");
                    onComplete&&onComplete();
                }
            }
            
            this._createBundle(bundleName, config, options, callback);
        }
        
    } catch (error) {
        BundleDebug.error("setupAllMainBundle 执行异常", error);
        BundleDebug.groupEnd();
        BundleDebug.timeEnd("setupAllMainBundle 总耗时");
        throw error;
    }
}
proto._createBundle = function (bundleName, data, options, callback) {
    BundleDebug.log(`_createBundle 开始创建: ${bundleName}`, {
        "bundleName": bundleName,
        "data存在": !!data,
        "data.base": data ? data.base : "undefined",
        "options": options,
        "callback存在": !!callback
    });
    BundleDebug.time(`_createBundle ${bundleName} 耗时`);
    
    let self = this;
    try {
        cc.assetManager.factory.create(bundleName, data, "bundle", options, function onComplete(err, bundle) {
            BundleDebug.timeEnd(`_createBundle ${bundleName} 耗时`);
            
            if(err) {
                BundleDebug.error(`_createBundle ${bundleName} 创建失败`, {
                    "error": err,
                    "error.message": err ? err.message : "undefined",
                    "error.stack": err ? err.stack : "undefined"
                });
            } else {
                let retrievedBundle = cc.assetManager.getBundle(bundleName);
                BundleDebug.log(`_createBundle ${bundleName} 创建成功`, {
                    "bundle存在": !!retrievedBundle,
                    "bundle.name": retrievedBundle ? retrievedBundle.name : "undefined",
                    "bundle.base": retrievedBundle ? retrievedBundle.base : "undefined"
                });
                callback&&callback(retrievedBundle);
                return;
            }
            
            // 错误处理
            if(callback) {
                callback(null);
            }
        });
    } catch (error) {
        BundleDebug.error(`_createBundle ${bundleName} 异常`, error);
        BundleDebug.timeEnd(`_createBundle ${bundleName} 耗时`);
        if(callback) {
            callback(null);
        }
    }
}
proto.preloadAllMainAssets = function (onComplete) {
    BundleDebug.log("preloadAllMainAssets 开始");
    BundleDebug.time("preloadAllMainAssets 总耗时");
    BundleDebug.group("preloadAllMainAssets 执行流程");
    
    //主包多语言
    this.initAllMainBundleLang((error)=>{
        if(error) {
            BundleDebug.error("initAllMainBundleLang 失败", error);
        } else {
            BundleDebug.log("initAllMainBundleLang 完成");
        }
        this._onPreloadAllMainAssets(onComplete);
    });
}

proto._onPreloadAllMainAssets = function (onComplete) {
    BundleDebug.log("_onPreloadAllMainAssets 开始");
    
    let totals = this._handleBundles;
    BundleDebug.log("预加载Bundle信息", {
        "总数": totals.length,
        "Bundle列表": totals.map(t => t.bundleName)
    });
    
    let count = 0;
    let errors = [];
    
    let callback = function (bundleName, error) {
        count++;
        BundleDebug.log(`Bundle预加载完成[${count}/${totals.length}]`, {
            "bundleName": bundleName,
            "有错误": !!error,
            "error": error
        });
        
        if(error) {
            errors.push({bundleName, error});
        }
        
        if(count == totals.length){
            BundleDebug.log("所有Bundle预加载完成", {
                "成功": count - errors.length,
                "失败": errors.length,
                "错误列表": errors
            });
            
            window.logTimestamp("BundleManager.js preloadAllMainAssets complete");
            BundleDebug.groupEnd();
            BundleDebug.timeEnd("preloadAllMainAssets 总耗时");
            onComplete&&onComplete();
        }
    }
    
    let self = this;
    let _getWrapper = function (bundle_name) {
        let wrapper_result = wrapper.get(bundle_name) || wrapper.getWrapper(bundle_name) || window[bundle_name];
        BundleDebug.log(`获取Wrapper: ${bundle_name}`, {
            "wrapper存在": !!wrapper_result,
            "wrapper类型": typeof wrapper_result,
            "有create方法": wrapper_result && typeof wrapper_result.create == 'function'
        });
        return wrapper_result;
    }
    
    window.logTimestamp("BundleManager.js preloadAllMainAssets start");

    if(totals.length === 0) {
        BundleDebug.warn("没有Bundle需要预加载");
        callback("none", null);
        return;
    }

    for (let index = 0; index < totals.length; index++){
        let config = totals[index];
        let bundleName = config.bundleName;
        let bundle = cc.assetManager.getBundle(bundleName);
        
        BundleDebug.log(`开始预加载Bundle[${index}]: ${bundleName}`, {
            "bundle存在": !!bundle
        });
        
        let wrapper_loaded = _getWrapper(bundleName);
        if(wrapper_loaded && typeof wrapper_loaded.create == 'function'){
            wrapper_loaded.create(bundle, (error)=>{
                if(!error){
                    wrapper_loaded.setReady(true);
                    window.logTimestamp("BundleManager.js preloadAllMainAssets '" + bundleName + "' finish");
                    BundleDebug.log(`Bundle ${bundleName} 预加载成功`);
                }
                else{
                    window.logTimestamp("BundleManager.js preloadAllMainAssets '" + bundleName + "' error");
                    BundleDebug.error(`Bundle ${bundleName} 预加载失败`, error);
                }
                
                callback(bundleName, error);
                
                let bundle_item = self._getLoadedItem(bundleName);
                if(bundle_item){
                    BundleDebug.log(`处理Bundle ${bundleName} 的handlers: ${bundle_item.handlers.length}`);
                    bundle_item.handlers.forEach(handler => {
                        handler.onComplete(error, wrapper_loaded);
                    });
                }
            });
        }
        else{
            BundleDebug.warn(`Bundle ${bundleName} 没有有效的wrapper或create方法`);
            callback(bundleName, null);
        }
    }
}
//主包多语言初始化
proto.initAllMainBundleLang = function (onComplete) {
    if(this._mainBundleLangInited){
        onComplete&&onComplete();
        return;
    };

    this._mainBundleLangInited = true;
    this.loadCommonBundleLang(onComplete);
}

proto.initBundleLangs = function (params) {
    BundleDebug.log("initBundleLangs 开始", params);
    BundleDebug.time("initBundleLangs 耗时");
    
    try {
        let ChessSetConfig = window.ChessSetConfig || {};
        BundleDebug.log("ChessSetConfig检查", {
            "存在": !!window.ChessSetConfig,
            "DISABLE_BUNDLE_TIMESTAMP": ChessSetConfig.DISABLE_BUNDLE_TIMESTAMP,
            "BUNDLE_LANGS存在": typeof ChessSetConfig.BUNDLE_LANGS != 'undefined'
        });
        
        if(typeof ChessSetConfig.DISABLE_BUNDLE_TIMESTAMP != 'undefined'){
            this.disableBundleTimestamp = !!ChessSetConfig.DISABLE_BUNDLE_TIMESTAMP;
            BundleDebug.log("设置disableBundleTimestamp =", this.disableBundleTimestamp);
        }

        if(typeof ChessSetConfig.BUNDLE_LANGS != 'undefined'){
            try {
                let config_lang_all = JSON.parse(ChessSetConfig.BUNDLE_LANGS);
                BundleDebug.log("解析BUNDLE_LANGS", {
                    "原始长度": ChessSetConfig.BUNDLE_LANGS.length,
                    "解析后存在": !!config_lang_all,
                    "Bundle数量": config_lang_all ? Object.keys(config_lang_all).length : 0
                });
                
                if(config_lang_all){
                    let processedCount = 0;
                    for (const bundleName in config_lang_all) {
                        let langs = config_lang_all[bundleName];
                        if (langs) {
                            this.setBundleLangMD5(bundleName, langs);
                            processedCount++;
                            BundleDebug.log(`设置Bundle语言MD5: ${bundleName}`, langs);
                        }
                    }
                    BundleDebug.log(`处理完成，设置了${processedCount}个Bundle的语言MD5`);
                } 
            } catch (error) {
                BundleDebug.error("主包多语言解析失败", error);
                cc.error("主包多语言解析失败");
            }
        }
        
        BundleDebug.timeEnd("initBundleLangs 耗时");
        BundleDebug.log("initBundleLangs 完成");
    } catch (error) {
        BundleDebug.error("initBundleLangs 异常", error);
        BundleDebug.timeEnd("initBundleLangs 耗时");
        throw error;
    }
}
proto.initBundleVers = function (params) {
    BundleDebug.log("initBundleVers 开始", params);
    BundleDebug.time("initBundleVers 耗时");
    
    try {
        let self = this;
        if(!self._bundleVers){
            let bundleVers = cc.assetManager.downloader.bundleVers || {};
            BundleDebug.log("获取bundleVers", {
                "存在": !!bundleVers,
                "键数量": Object.keys(bundleVers).length,
                "CC_BUILD": !!CC_BUILD,
                "前10个键": Object.keys(bundleVers).slice(0, 10)
            });
            
            if(!CC_BUILD){
                //复制一份
                self._bundleVers = JSON.parse(JSON.stringify(bundleVers));
                BundleDebug.log("非构建模式，直接复制bundleVers", {
                    "复制后键数量": Object.keys(self._bundleVers).length
                });
            }
            else{
                self._bundleVers = {};
                let array = bundle_buildins.concat(bundle_wrappers_main);
                let filteredCount = 0;
                
                BundleDebug.log("构建模式，过滤bundleVers", {
                    "过滤数组": array,
                    "原始bundleVers": bundleVers
                });
                
                for (let index = 0; index < array.length; index++) {
                    const key = array[index];
                    const md5 = bundleVers[key];
                    if(md5){
                        self._bundleVers[key] = md5;
                        filteredCount++;
                        BundleDebug.log(`过滤Bundle: ${key} = ${md5}`);
                    } else {
                        BundleDebug.warn(`Bundle ${key} 没有找到对应的MD5版本`);
                    }
                }
                
                BundleDebug.log("构建模式过滤完成", {
                    "过滤后数量": filteredCount,
                    "最终_bundleVers": self._bundleVers
                });
            }
        } else {
            BundleDebug.log("_bundleVers已存在，跳过初始化", {
                "现有键数量": Object.keys(self._bundleVers).length
            });
        }
        
        BundleDebug.timeEnd("initBundleVers 耗时");
        BundleDebug.log("initBundleVers 完成", {
            "最终_bundleVers键数量": self._bundleVers ? Object.keys(self._bundleVers).length : 0
        });
    } catch (error) {
        BundleDebug.error("initBundleVers 异常", error);
        BundleDebug.timeEnd("initBundleVers 耗时");
        throw error;
    }
}
/**
 * 检查是否已加载过
 * @param {*} bundleName 
 * @returns 
 */
proto._getLoadedItem = function (bundleName) {
    let target = null;
    let array = this._loader.listLoaded;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.bundleName == bundleName){
            target = item;
            break;
        }
    }
    
    BundleDebug.log(`_getLoadedItem ${bundleName}`, {
        "已找到": !!target,
        "已加载总数": array.length
    });
    
    return target;
}

/**
 * 检查是否已在加载队列
 * @param {*} bundleName 
 * @returns 
 */
proto._getToLoadItem = function (bundleName) {
    let target = null;
    let array = this._loader.listToLoad;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.bundleName == bundleName){
            target = item;
            break;
        }
    }
    
    BundleDebug.log(`_getToLoadItem ${bundleName}`, {
        "队列中已存在": !!target,
        "队列总数": array.length
    });
    
    return target;
}
proto.startLoadItem = function (bundleName, options, onComplete) {
    options = options || {};
    BundleDebug.log(`startLoadItem 开始: ${bundleName}`, {
        "options": options,
        "hasCallback": !!onComplete
    });
    SHOW_LOG&&console.error("BundleManager: startLoadItem ", bundleName, JSON.stringify(options));
    
    //检查是否已加载过
    let target = this._getLoadedItem(bundleName);
    if(!target){
        //检查是否已在加载队列
        target = this._getToLoadItem(bundleName);
    }

    if(!target){
        BundleDebug.log(`${bundleName} 未找到，创建新的加载项`);
        
        //创建并添加到加载队列
        target = this._createItem(bundleName, options, onComplete);
        
        //如果不是预加载的(即当前需要加载的)，并且不是主包，就放到数组头，优先加载
        let isPriority = !options.autoPreload && bundle_wrappers_main.indexOf(bundleName)<0 && bundle_buildins.indexOf(bundleName)<0;
        if(isPriority){
            this._loader.listToLoad.unshift(target);
            BundleDebug.log(`${bundleName} 优先加载，添加到队列头部`);
        }
        else{
            this._loader.listToLoad.push(target);
            BundleDebug.log(`${bundleName} 正常加载，添加到队列尾部`);
        }
        
        BundleDebug.log(`当前加载队列状态`, {
            "队列长度": this._loader.listToLoad.length,
            "当前加载项": this._curItem ? this._curItem.bundleName : "none"
        });

        if(!this._curItem){
            BundleDebug.log(`没有正在加载的项目，开始加载下一项`);
            this._loadNextItem();
        }
        return;
    }
    //已加载过或在队列中
    else{
        BundleDebug.log(`${bundleName} 已存在，重新初始化`, {
            "target.bundleName": target.bundleName,
            "target.loadStatus": target.loadStatus
        });
        target.init(bundleName, options, onComplete);
    }
}

proto.startPreloadItem = function (targetPreload, options) {
    let bundleName = targetPreload.bundleName;
    if(SHOW_LOG){
         //console.error("BundleManager: startPreloadItem ", bundleName);
    }
    else{
        cc.log("BundleManager: startPreloadItem ", bundleName);
    }
    
    let target = null;
    //检查是否已预加载过
    let array = this._preloader.listLoaded;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.bundleName == bundleName){
            target = item;
            break;
        }
    }
    if(!target){
        //检查是否已在加载队列
        array = this._preloader.listToLoad;
        for (let index = 0; index < array.length; index++) {
            const item = array[index];
            if(item.bundleName == bundleName){
                target = item;
                break;
            }
        }
    }
    if(!target){
        //添加到加载队列
        target = targetPreload;
        // target = this._createItem(bundleName, options, onComplete);
        this._preloader.listToLoad.push(target);

        // if(!this._timer_preloadid){
        //     this._startPreloadInterval();
        // }
        if(!this._curPreloadItem){
            this._preloadNextItem();
        }
        return;
    }
}

proto._createItem = function (bundleName, options, onComplete) {
    BundleDebug.log(`_createItem 创建BundleItem: ${bundleName}`, {
        "options": options,
        "hasCallback": !!onComplete
    });
    
    try {
        let item = new BundleItem(this);
        item.init(bundleName, options, onComplete);
        
        BundleDebug.log(`BundleItem创建成功: ${bundleName}`, {
            "item.bundleName": item.bundleName,
            "item.loadStatus": item.loadStatus
        });
        
        return item;
    } catch (error) {
        BundleDebug.error(`_createItem创建失败: ${bundleName}`, error);
        throw error;
    }
}

// proto._updateLoadInterval = function (params) {
//     if(this._loader.listToLoad.length==0){
//         this._stopLoadInterval();
//         return;
//     };

//     this._loadNextItem();
// }
// proto._startLoadInterval = function (params) {
//     this._stopLoadInterval();
//     this._timer_loadid = setInterval(() => {
//         this._updateLoadInterval();
//     }, 10);
// }

// proto._stopLoadInterval = function (params) {
//     if(this._timer_loadid){
//         clearInterval(this._timer_loadid);
//         this._timer_loadid = 0;
//     }
// }

// proto._updatePreloadInterval = function (params) {
//     if(this._preloader.listToLoad.length==0){
//         this._stopPreloadInterval();
//         return;
//     };

//     this._preloadNextItem();
// }
// proto._startPreloadInterval = function (params) {
//     this._stopPreloadInterval();
//     this._timer_preloadid = setInterval(() => {
//         this._updatePreloadInterval();
//     }, 10);
// }

// proto._stopPreloadInterval = function (params) {
//     if(this._timer_preloadid){
//         clearInterval(this._timer_preloadid);
//         this._timer_preloadid = 0;
//     }
// }
proto._preloadNextItem = function (params) {
    if(this._preloader.listToLoad.length==0){
        return;
    };

    if(this._curPreloadItem && this._curPreloadItem.preloadStatus==ItemStatus.LOADING){
        return;
    }

    let target = null;
    let array = this._preloader.listToLoad;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.preloadStatus==ItemStatus.NONE){
            target = item;
            break;
        }
    }
    if(!target)return;
    
    if(SHOW_LOG){
         //console.error("BundleManager: _preloadNextItem", target.bundleName);
    }
    else{
        cc.log("BundleManager: _preloadNextItem", target.bundleName);
    }
    
    target.preloadStatus=ItemStatus.LOADING;
    this._curPreloadItem = target;
    let options = target.options || {};
    if(target.wrapper){
        target.wrapper.preload&&target.wrapper.preload(options, this.onPreloadItem.bind(this));
    }
    else{
        cc.log("[ERROR] 子包未封装. bundleName = " + target.bundleName);
        this.onPreloadItem(null, target.bundleName);
    }
}
proto._loadNextItem = function () {
    BundleDebug.log("_loadNextItem 开始检查");
    
    if(this._loader.listToLoad.length==0){
        BundleDebug.log("加载队列为空，无需加载");
        return;
    };

    if(this._curItem && this._curItem.loadStatus==ItemStatus.LOADING){
        BundleDebug.log("当前有项目正在加载，等待完成", {
            "当前项目": this._curItem.bundleName,
            "状态": this._curItem.loadStatus
        });
        return;
    }
    
    let target = null;
    let array = this._loader.listToLoad;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.loadStatus==ItemStatus.NONE){
            target = item;
            break;
        }
    }
    
    if(!target){
        BundleDebug.warn("队列中没有待加载的项目", {
            "队列长度": array.length,
            "队列状态": array.map(item => ({name: item.bundleName, status: item.loadStatus}))
        });
        return;
    }

    BundleDebug.log(`开始加载下一项: ${target.bundleName}`, {
        "队列位置": array.indexOf(target),
        "总队列长度": array.length
    });

    if(SHOW_LOG){
         //console.error("BundleManager: _loadNextItem", target.bundleName)
    }
    else{
        cc.log("BundleManager: _loadNextItem", target.bundleName)
    }

    this._curItem = target;
    target.load();
}

/**
 * 子包加载完成回调
 * @param {*} target 
 * @param {*} error 
 */
proto.onLoadItem = function (error, target) {
    BundleDebug.log(`onLoadItem 收到加载完成回调`, {
        "bundleName": target ? target.bundleName : "undefined",
        "有错误": !!error,
        "error": error,
        "target.loadStatus": target ? target.loadStatus : "undefined"
    });
    
    let array = this._loader.listToLoad;
    let found = false;
    
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.bundleName==target.bundleName){
            found = true;
            this._loader.listToLoad.splice(index, 1);
            cc.log("BundleManager: onLoadItem", item.bundleName, error);
            
            BundleDebug.log(`从加载队列移除: ${item.bundleName}`, {
                "移除位置": index,
                "剩余队列长度": this._loader.listToLoad.length
            });

            if(error || target.loadStatus==ItemStatus.ERROR){
                this._loader.listError.push(target);
                BundleDebug.error(`Bundle加载失败，添加到错误列表: ${item.bundleName}`, {
                    "错误列表长度": this._loader.listError.length
                });
            }
            else{
                this._loader.listLoaded.push(target);
                BundleDebug.log(`Bundle加载成功，添加到已加载列表: ${item.bundleName}`, {
                    "已加载列表长度": this._loader.listLoaded.length,
                    "需要预加载": target.options.autoPreload
                });
                
                if(target.options.autoPreload){
                    BundleDebug.log(`开始预加载: ${item.bundleName}`);
                    this.startPreloadItem(target);
                }                
            }
            this._curItem = null;
            break;
        }
    }
    
    if(!found) {
        BundleDebug.warn(`onLoadItem: 在队列中未找到目标Bundle`, {
            "target.bundleName": target ? target.bundleName : "undefined",
            "当前队列": array.map(item => item.bundleName)
        });
    }
    
    BundleDebug.log("onLoadItem完成，继续加载下一项");
    this._loadNextItem();
}

proto.onPreloadItem = function (error, bundleName) {
    let array = this._preloader.listToLoad;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.bundleName==bundleName){
            let target = item;
            this._preloader.listToLoad.splice(index, 1);
            cc.log("BundleManager: onPreloadItem", item.bundleName, error);
            if(error || target.preloadStatus==ItemStatus.ERROR){
                target.preloadStatus=ItemStatus.ERROR;
                this._preloader.listError.push(target);
            }
            else{
                target.preloadStatus=ItemStatus.FINISH;
                this._preloader.listLoaded.push(target);                
            }
            this._curPreloadItem = null;
            break;
        }
    }
    this._preloadNextItem();
}

proto.isRemoteURL = function (url) {
    return REGEX.test(url);
}

/**
 * 设置bundle版本数据
 *
 * @param {Object} data
 */
proto.setBundleVersions = function (data) {
    this._bundleVers = Object.assign(this._bundleVers, data);
}

proto.setBundleLangMD5 = function (bundleName, langs) {
    this._bundleLangMD5[bundleName] = langs;
}

proto.getBundleLangMD5 = function (bundleName, lang) {
    let langs = this._bundleLangMD5[bundleName] || {};
    return langs[lang];
}

/**
 * 获取bundle版本数据
 *
 * @param {*} params
 * @returns
 */
proto.getBundleVersions = function (params) {
    return this._bundleVers || {};
}

proto.getBundleVersion = function (bundleName) {
    let version = null;
    if(null!=this._bundleVers && typeof this._bundleVers == 'object'){
        version = this._bundleVers[bundleName];
    }
    return version;
}

proto.loadCommonBundleLang = function (onComplete) {
    let array = [];
    let items = this._loader.listLoaded;
    for (let index = 0; index < bundle_wrappers_main.length; index++) {
        const bundleName = bundle_wrappers_main[index];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if(item.bundleName == bundleName){
                array.push(bundleName);
                break;
            }
        }
    }
    if(array.length==0){
        onComplete(null);
        return;
    }
    
    let count = 0;
    let error = null;
    let callback = function (e) {
        count++;
        if(e){
            error = e;
        }
        if(count==array.length){
            onComplete&&onComplete(error);
        }
    }
    for (let index = 0; index < array.length; index++) {
        const bundleName = array[index];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if(item.bundleName == bundleName){
                item.loadBundleLangDataAsync(bundleName)
                .then(function (params) {
                    callback(null);
                })
                .catch(function (error) {
                    callback(error);
                })
                break;
            }
        }        
    }
}

proto.bundleConfigResponseHandler = function (options, error, response, callback) {
    if(error){
         //console.error("BundleManager", "getModeVersion. error=", error);
        app.postMessage(app.bridge.EVENT.GAME_ERROR, {
            error: app.bridge.errorID(201)
        });
        if (cc.sys.isNative){
            //原生平台直接调用回调
            callback && callback();
        }
        return;
    }
    
    if(response == null || response == "null" || response == ""){
         //console.error("BundleManager", "getModeVersion. response is null");
        app.postMessage(app.bridge.EVENT.GAME_ERROR, {
            error: app.bridge.errorID(201)
        });
        if (cc.sys.isNative){
            //原生平台直接调用回调
            callback && callback();
        }
        return
    }

    let prefix_live = "live-";
    let array = JSON.parse(response);
    this._webBundleConfigs.length = 0;
    for (let index = 0; index < array.length; index++) {
        const res = array[index];
        if(!res){
            continue;
        }
        
        let extendStr = res.extendjson ? res.extendjson:""
        let extendjson = null;
        extendStr = extendStr.replace(/\ +/g,"")
        extendStr = extendStr.replace(/[\r\n]/g,"")

        if(res.gameId == 178){
            continue;
        }

        let item = {
            nGameId: res.gameId,
            sGamePath: res.gameCode,
            sMD5FilePath: res.mD5FilePath,
            sZipFilePath: res.zipFilePath + "/",
            sVersion: res.version,
            rawString: JSON.stringify(res),
        };

         //console.log("BundleManager", "getModeVersion. item=", item);
        //非原生包
        if(item.sMD5FilePath && item.sMD5FilePath.indexOf(".data")<0){
            if(item.sMD5FilePath.indexOf("{") >= 0){
                try {
                    let md5Json = JSON.parse(item.sMD5FilePath);
                    item.sMD5FilePath = md5Json.bundle;
                    item.langs = md5Json.langs;
                    item.md5 = item.sMD5FilePath;
                } catch (error) {
                     //console.error("BundleManager", "sMD5FilePath 解析出错: ", item.sMD5FilePath, error);
                }
            }
        }
        if(extendStr != ""){
            try {
                extendjson = JSON.parse(extendStr);
                item.manager = extendjson.manager;
                item.depends = extendjson.depends;
                if(typeof extendjson.isLive != 'undefined'){
                    item.isLive = extendjson.isLive;
                }
            } catch (error) {
                 //console.error("BundleManager", "extendjson 解析出错: ", extendStr, error);
            }
        }else{
            item.manager = ""
            item.depends = []
        }

        //暂时用 'game-common' 区分是否内部子游戏
        if(item.manager == 'game-common'){
            if(typeof item.isLive == 'undefined'){
                if(item.sGamePath.indexOf(prefix_live)>=0){
                    item.isLive = true;
                }
                else{
                    item.isLive = false;
                }
            }
            if(extendjson && typeof extendjson.folder != 'undefined'){
                item.folder = extendjson.folder;
            }
        }
        //第三方子游戏，全部放在其公共文件夹下，配置 folder 字段
        else{
            if(extendjson && typeof extendjson.folder != 'undefined'){
                item.folder = extendjson.folder;
            }
            else{
                item.folder = item.manager;
            }
        }

        this._webBundleConfigs.push(item);
    }

    this._localBundleConfigs = {
        timestamp: options.timenow,
        version: app.config.VERSION,
        platform: options.config_platform,
        configs: this._webBundleConfigs,
        url: options.web_url,
    }
     //console.log("BundleManager", "getModeVersion. _localBundleConfigs=", JSON.stringify(this._localBundleConfigs));
    app.storage.setBundleConfig(this._localBundleConfigs);
     //console.log("BundleManager", "getModeVersion. length=", this._webBundleConfigs.length);

    //callback && callback(this._webBundleConfigs);
    if(callback)
    {
         //console.log("BundleManager", "getModeVersion. _webBundleConfigs=", this._webBundleConfigs); 
        callback(this._webBundleConfigs);
    }else{
         //console.log("BundleManager", "getModeVersion. _webBundleConfigs is null");
    }
}

const UPDATE_INTERVAL = 1000 * 60 * 10; //10分钟
proto.requestWebBundleConfigs = function (config_platform, callback) {
    //内测 http://192.168.0.215:85/API/Version?Platform=live
    //封测 http://120.79.78.20:8080/API/Version?Platform=live

    this._webBundleConfigs = {
        nGameId: 125,
        sGamePath: "live-Texas",
        sMD5FilePath: "dc201",
        sZipFilePath: "null/",
        sVersion: "1.0.0.0",
        rawString: "{\"gameId\":125,\"gameCode\":\"live-Texas\",\"mD5FilePath\":\"{\\\"bundle\\\":\\\"dc201\\\",\\\"langs\\\":{\\\"en\\\":\\\"dc201\\\",\\\"th\\\":\\\"dc201\\\",\\\"zh_tw\\\":\\\"dc201\\\",\\\"vi\\\":\\\"dc201\\\",\\\"kh\\\":\\\"dc201\\\",\\\"id\\\":\\\"dc201\\\"}}\",\"version\":\"1.0.0.0\",\"zipFilePath\":null,\"platform\":\"clubWeb\",\"extendjson\":\"{\\\"manager\\\": \\\"game-common\\\", \\\"depends\\\": [\\\"game-live-assets\\\", \\\"game-club-assets\\\"]}\"}",
        langs: {
            en: "dc201",
            th: "dc201",
            zh_tw: "dc201",
            vi: "dc201",
            kh: "dc201",
            id: "dc201",
        },
        md5: "dc201",
        manager: "game-common",
        depends: [
            "game-live-assets",
            "game-club-assets",
        ],
        isLive: true,
    }

    if(true)
    {
        callback && callback(this._webBundleConfigs);
        return
    }

     //console.log("BundleManager", "requestWebBundleConfigs", config_platform);
    let timenow = Date.now();
    let options = {
        platform: config_platform,
    }
    let web_url = AppWebApi.getModelVersionURL(options);
    let params = {
        timenow,
        config_platform,
        web_url,
    }
    const USE_LOCAL_BUNDLE_CONFIG = app.config.IS_SINGLE && window.SubBundleConfig;
    //单机版使用本地子包配置
    if(USE_LOCAL_BUNDLE_CONFIG){
        if(this._localBundleConfigs){
            let {timestamp, version, configs, platform, url} = this._localBundleConfigs;
            this._webBundleConfigs = configs;
            if(this._webBundleConfigs.length > 0){
                callback && callback(this._webBundleConfigs);
                return;
            }
        }

        this.bundleConfigResponseHandler(params, null, JSON.stringify(window.SubBundleConfig), callback);
        return;
    }
    
    //本地缓存
    if(!this._localBundleConfigs){
        this._localBundleConfigs = app.storage.getBundleConfig(); //{timestamp, version, configs}
    }
    let {timestamp, version, configs, platform, url} = this._localBundleConfigs;
    if(url != web_url){
        cc.warn("BundleManager", `requestWebBundleConfigs => ${url}!=${web_url}`);
        configs = []; //清空
    }

    let interval = timenow - timestamp;
    //不启用服务器版本号 或者 主版本相同并且在一定时间内不需要重新获取(俱乐部app都要获取版本信息)
    if (platform == config_platform && (!app.config.ENABLE_SERVER_VERSION || app.config.VERSION==version && interval < UPDATE_INTERVAL)){
        this._webBundleConfigs = configs;
        
        cc.log("BundleManager", "requestWebBundleConfigs => _webBundleConfigs.length=", this._webBundleConfigs.length);

        if(!this._forceRequestConfig && this._webBundleConfigs.length > 0){
            cc.log("BundleManager", "主版本相同，一定时间内不需要重新获取", `version=${app.config.VERSION}, interval=${interval}`);
            callback && callback(this._webBundleConfigs);
            return;
        }
    }
    
    this._forceRequestConfig = false;

    AppWebApi.getModeVersion(options, (error, response)=>{
         //console.log("BundleManager", "requestWebBundleConfigs => ", web_url, error, response);
        this.bundleConfigResponseHandler(params, error, response, callback);
    });
}

proto.getWebBundleConfigAll = function () {
    return this._webBundleConfigs;
}

//重新获取一次
proto.refreshWebBundleConfig = function (callback) {
    //cc.log("BundleManager", "refreshWebBundleConfig");

    let empty_configs = {timestamp:0, version:"", platform: "", configs:[], url:""};
    let {timestamp, version, configs, platform} = this._localBundleConfigs ? this._localBundleConfigs : empty_configs;

    let timenow = Date.now();
    let interval = timenow - timestamp;

    let success = true;
    // //在一定时间内不需要重新获取
    // if( platform==app.config.PLATFORM && interval < UPDATE_INTERVAL){
    //     //cc.log("BundleManager", "refreshWebBundleConfig", "在一定时间内不需要重新获取");
    //     success = false;
    //     callback && callback(success);
    // }
    // else{
        this._forceRequestConfig = true;
        //cc.log("BundleManager", "refreshWebBundleConfig", "强制重新获取");

        //重新获取
         //console.log("BundleManager", "refreshWebBundleConfig", "强制重新获取");
        this.requestWebBundleConfigs(app.config.PLATFORM, () => {
             //console.log("BundleManager", "refreshWebBundleConfig", "重新获取完成");
            callback && callback(success)
        })
    // }
}

proto.getWebBundleConfig = function (nGameId) {
    //cc.log("BundleManager", "getWebBundleConfig. gameid="+nGameId, "_webBundleConfigs.length="+this._webBundleConfigs.length);
    
    let config = null;
    if(!nGameId){
        cc.warn("[ERROR] BundleManager", "getWebBundleConfig", "gameid 为空");
        return config;
    }

    let array = this._webBundleConfigs;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.nGameId==nGameId){
            config = item;
            break;
        }
    }
    if(!config){
        let num = Number(nGameId);
        if(typeof num != 'number'){
            cc.log("BundleManager", "getWebBundleConfig. 按名称获取 => name=", num);
            config = this.getWebBundleConfigByName(num);
        }
        else{
            cc.warn("BundleManager", "getWebBundleConfig. old_web_url => ", app.storage.getBundleConfigURL());
            this.refreshWebBundleConfig((success)=>{
            })
        }
    }
    else{
        this.updateBundleItemConfig(config);
    }

    return config;
}

proto.getWebBundleConfigByName = function (name) {
    //cc.log("BundleManager", "getWebBundleConfigByName. name="+name, "_webBundleConfigs.length="+this._webBundleConfigs.length);

    let array = this._webBundleConfigs;
    let config = null;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.sGamePath==name){
            config = item;
            break;
        }
    }
    if(config){
        this.updateBundleItemConfig(config);
    }
    else{
        //主包管理模块版本配置打包时引擎自动生成在src/setting.js里了，不需要重新获取
        if(name!="game-common"){
            this.refreshWebBundleConfig((success)=>{
            })
        }
    }
    return config;
}

proto.updateBundleItemConfig = function (config) {
    //不判断服务器版本
    if(!app.config.ENABLE_SERVER_VERSION){
        return;
    }

    if(!config || !config.md5){
        return;
    }

    let bundleName = config.sGamePath;
    if(!this.getBundleVersion(bundleName)){
        this.setBundleVersions({
            [bundleName]: config.md5,
        })
    }
    if(config.langs && !this._bundleLangMD5[bundleName]){
        this.setBundleLangMD5(bundleName, config.langs);
    }
}

proto.updateBundleItemVersion = function (bundleName, version) {
    if(!bundleName || !version){
        return;
    }

    let array = this._webBundleConfigs || [];
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.sGamePath==bundleName){
            item.version = version;
            break;
        }
    }
}

/**
 * 调试方法：获取当前BundleManager的完整状态
 */
proto.getDebugStatus = function() {
    let status = {
        "基本状态": {
            "_mainBundleInited": this._mainBundleInited,
            "_mainBundleLangInited": this._mainBundleLangInited,
            "disableBundleTimestamp": this.disableBundleTimestamp
        },
        "加载器状态": {
            "listToLoad.length": this._loader.listToLoad.length,
            "listLoaded.length": this._loader.listLoaded.length,
            "listError.length": this._loader.listError.length,
            "当前加载项": this._curItem ? this._curItem.bundleName : "none"
        },
        "预加载器状态": {
            "listToLoad.length": this._preloader.listToLoad.length,
            "listLoaded.length": this._preloader.listLoaded.length,
            "listError.length": this._preloader.listError.length,
            "当前预加载项": this._curPreloadItem ? this._curPreloadItem.bundleName : "none"
        },
        "Bundle配置": {
            "_handleBundles.length": this._handleBundles.length,
            "_bundleVers键数量": this._bundleVers ? Object.keys(this._bundleVers).length : 0,
            "_bundleLangMD5键数量": Object.keys(this._bundleLangMD5).length,
            "_webBundleConfigs.length": this._webBundleConfigs.length
        },
        "环境检查": {
            "window._CCBundleConfig": !!window._CCBundleConfig,
            "cc.assetManager.downloader.bundleVers": !!cc.assetManager.downloader.bundleVers,
            "CC_BUILD": !!window.CC_BUILD
        }
    };
    
    BundleDebug.log("BundleManager 调试状态", status);
    return status;
}

/**
 * 全局调试接口
 */
if (typeof window !== 'undefined') {
    window.BundleManagerDebug = {
        getStatus: function() {
            return BundleManager.default.getDebugStatus();
        },
        toggleDebug: function(enable) {
            window.DEBUG_BUNDLE = enable !== false;
             //console.log("BundleManager 调试模式:", window.DEBUG_BUNDLE ? "开启" : "关闭");
        },
        log: BundleDebug.log,
        warn: BundleDebug.warn,
        error: BundleDebug.error
    };
}

BundleManager.default = new BundleManager();
module.exports = BundleManager;