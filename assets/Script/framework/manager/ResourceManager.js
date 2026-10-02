// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 资源管理
// ]]

let BundleManager = require("BundleManager").default;
let LocalStorage = require("StorageManager").default;
let EventManager = require("EventManager");
let Target = EventManager.Target;
let Event = EventManager.Event;
let wrapper = require("WrapperManager").default;
let scene = require("SceneManager").default;
let audio = require("AudioManager").default;
let ui = require("UIManager").default;
let env = require("EnvironmentManager").default;

// let bundle_buildins = ["internal", "main", "resources", "start-scene"];
// let bundle_wrappers_main = [wrapper.COMMON, wrapper.HOME, wrapper.LOGIN, wrapper.HALL];

let ResourceManager = function (params) {
    this.name = "ResourceManager";
    this._zipAssets = {};
    this._langBundleData = {};
    this._bundleVers = null;
    
    BundleManager.init(this);
}

let proto = ResourceManager.prototype;
proto.load = function (params) {
}
proto.destroy = function (params) {
}

// /**
//  * 启动游戏
//  * @param {Function} onLaunched (empty, scene)
//  */
// proto.loadApp = function (onLaunched, options) {
//     let ConfigEnv = {};
//     let dirty = false;
//     if(window.ChessSetEnv){
//         ConfigEnv.IS_LIVE_ONLY = window.ChessSetEnv.IS_LIVE_ONLY;
//         dirty = true;
//     }
//     if(window.ChessSetConfig){
//         ConfigEnv.appkey = window.ChessSetConfig.APPKEY;
//         dirty = true;
//     }
//     if(dirty){
//         env.set(ConfigEnv);
//     }
    
//     // //调用一次音效播放，是为了触发 cc.sys.__audioSupport.context
//     // audio.playEmpty(); //在场景基类 SceneCommon 中调用

//     if(env.get("IS_LIVE_ONLY")){
//         this.loadLive(onLaunched, options);
//     }
//     else{
//         this.loadSets(onLaunched, options);
//     }
// }

proto.init = function (configs) {
    // 调用一次音效播放，是为了触发 cc.sys.__audioSupport.context
    audio.playEmpty(); //在场景基类 SceneCommon 中调用
    // BundleManager.initBundle(configs);
}

// /**
//  * 启动游戏（合集）
//  * @param {Function} onLaunched (empty, scene)
//  */
// proto.loadSets = function (onLaunched, options) {
//     options = options || {};
//     // options.sceneName = "main-launch";
//     // scene.loadEmpty(function onComplete(empty, scene) {
//         this.loadLogin(onLaunched, options);
//     // }.bind(this));
// }

// /**
//  * 启动游戏（直播）
//  * @param {Function} onLaunched (empty, scene)
//  */
// proto.loadLive = function (onLaunched, options) {
//     options = options || {};
//     options.sceneName = "main-launch";
//     // scene.loadEmpty(function onComplete(empty, scene) {
//         this.loadHome(onLaunched, options);
//     // }.bind(this));
// }

/**
 * 加载首页子包
 * @param {Function} onComplete (err: Error, bundle: cc.AssetManager.Bundle)
 */
proto.loadHome = function (onComplete, options) {
    // this._loadCommon(wrapper.HOME, options, onComplete);
    app.common.loadHome(onComplete, options);
}

/**
 * 加载登录子包
 * @param {Function} onComplete (err: Error, bundle: cc.AssetManager.Bundle)
 */
proto.loadLogin = function (onComplete, options) {
    // this._loadCommon(wrapper.LOGIN, options, onComplete);
    app.common.loadLogin(onComplete, options);
}

/**
 * 加载大厅子包
 * @param {Function} onComplete (err: Error, bundle: cc.AssetManager.Bundle)
 */
proto.loadHall = function (onComplete, options) {
    // this._loadCommon(wrapper.HALL, options, onComplete);
    app.common.loadHall(onComplete, options);
}

/**
 * 加载通用主包
 * @param {*} nameOrUrl 
 * @param {*} options 
 * @param {*} onComplete 
 */
proto._loadCommon = function (nameOrUrl, options, onComplete) {
    let self = this;
    //加载公共依赖包 main-common 
    let options_deps = Object.assign({}, options);
    self.loadBundleDeps("app-common", options_deps, function (error, bundle_wrapper) {
        if(error){
            onComplete(error, null);
            return;
        }
        self.loadBundleWrapper(nameOrUrl, options, onComplete);
    })
}

/**
 * 加载公共依赖包 main-common 
 * @param {Function} onComplete (error, bundle)
 */
proto.loadBundleDeps = function (nameOrUrl, options, onComplete) {
    let bundle_dep = cc.assetManager.getBundle(nameOrUrl);
    if(!bundle_dep){
        if(!options){
            options = {};
        }
        options = Object.assign(options, {
            autoStart: false,
            isDepend: true
        });
        this.loadBundleWrapper(nameOrUrl, options, onComplete);
    }
    else{
        onComplete(null, bundle_dep);
    }
}

/**
 * 加载游戏子包
 * @param {*} nameOrUrl 
 * @param {*} options 
 * @param {*} onComplete 
 */
proto.loadGame = function (nameOrUrl, options, onComplete) {
    cc.log('ResourceManager loadGame',nameOrUrl,JSON.stringify(options))
    let array = options.depends || [];
    if(typeof array == 'string'){
        cc.log('ResourceManager loadGame array')
        array = [array];
    }
    let depends = [];
    for (let index = 0; index < array.length; index++) {
        const bundleName = array[index];
        if(!cc.assetManager.getBundle(bundleName)){
            depends.push(bundleName);
        }
        else{
            let target = wrapper.get(bundleName);
            if(target && !target.getReady()){
                depends.push(bundleName);
            }
        }
    }
    
    let self = this;
    let callback = function () {
        self.loadBundleWrapper(nameOrUrl, options, onComplete);
    }

    cc.log('ResourceManager loadGame2',depends.length)

    if(depends.length>0){
        cc.log("ResourceManager", "加载依赖包：", depends);
        this.loadPackages(depends, {autoStart: false, isDepend: true, folder: options.folder}, callback)
    }
    else{
        callback();
    }
}


/**
 * 运行指定场景
 * @param {String} sceneName 
 * @param {Object} options = {
 *    onLaunched: function(empty, scene),
 *    onProgress: function(completedCount, totalCount, item),
 *    onLoaded: function(error),
 } 
 */
proto.loadScene = function (sceneName, options) {
    scene.loadScene(sceneName, options);
}

/**
 * 加载子包
 * @param {String|Array} nameOrUrl 子包名称或数组
 * @param {Object} options 加载选项，最后会传到wrapper子类的load、init、start等周期函数内
 * @param {Function} onComplete (error, instance)
 */
proto.loadPackages = function (nameOrUrl, options, onComplete) {
    let array = nameOrUrl;
    if(typeof array == 'string'){
        array = [nameOrUrl];
    }

    let count = 0;
    let callback = function () {
        count++;
        if(count==array.length){
            onComplete&&onComplete.apply(null, arguments);
        }
    }
    for (let index = 0; index < array.length; index++) {
        const bundleName = array[index];
        let opt = Object.assign({}, options);
        this.loadBundleWrapper(bundleName, opt, callback);
    }
}

/**
 * 加载子包bundle
 * nameOrUrl: string,
 * options: Record<string, any>,
 * onComplete: function(err: Error, bundle: cc.AssetManager.Bundle)
 */
proto.loadBundleWrapper = function (nameOrUrl, options, onComplete) {
    // if(typeof options == 'function'){
    //     onComplete = options;
    //     options = {};
    // }
    // if(options && typeof options != 'object'){
    //     cc.error("options 必须为 object 类型");
    //     options = {};
    // }
    // if(!options){
    //     options = {};
    // }

    // let bundleName = options.bundleName || nameOrUrl;
    // if(!options.sceneName){
    //     options.sceneName = bundleName;
    // }
    // if(typeof options.autoStart == 'undefined' && !options.autoPreload){
    //     options.autoStart = true;
    // }

    // // options.url = nameOrUrl;

    cc.log('loadBundleWrapper ', nameOrUrl, JSON.stringify(options))
    BundleManager.startLoadItem(nameOrUrl, options, onComplete);
    
    return;
}

/**
 * nameOrUrl: string,
 * options: Record<string, any>,
 * onComplete: function(err: Error, bundle: cc.AssetManager.Bundle)
 */
proto.loadBundle = function (nameOrUrl, options, onComplete) {
    cc.assetManager.loadBundle(nameOrUrl, options, onComplete);
}

proto.getBundle = function (name) {
    return cc.assetManager.getBundle(name);
}

/**
 * 设置bundle版本数据
 *
 * @param {Object} data
 */
proto.setBundleVersions = function (data) {
    this._bundleVers = Object.assign(this._bundleVers, data);
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
    let md5 = null;
    if(null!=this._bundleVers && typeof this._bundleVers == 'object'){
        md5 = this._bundleVers[bundleName];
    }
    return md5;
}


/**
 * 异步加载子包压缩包资源
 * @param {String} bundleName 
 * @param {Object} options 
 */
proto.loadBundleZipAssetAsync = function (bundleName, options) {
    let self = this;
    if(!options) options = {};

    let promise = new Promise((resolve, reject) => {
        let asset = self._getZipAsset(bundleName);
        let isExternal = !!options.folder; //第三方包
        if(isExternal || asset || cc.sys.isNative){//APP版本不需要加载
            setTimeout(() => {
                resolve(asset);
            }, 0);
            return;
        }

        let md5 = options.md5 ? "."+options.md5 : "";
        let res_type_import = "import";
        let res_type_native = "native";
        let host = "assets/" + bundleName; //"http://192.168.0.187:7456/build/assets/main-hall";
        if(options.url&&BundleManager.isRemoteURL(options.url)){
            host = options.url;
        }
        var url_import = host + `/res-zip/${res_type_import}${md5}.json`;
        var url_native = host + `/res-zip/${res_type_native}${md5}.png`;

        self._initZipAsset(bundleName);
                 
        let callback = function (error, asset) {
            if(error){
                //返回成功，避免加载流程中止
                resolve(null);
                return;
            }
            resolve(self._getZipAsset(bundleName));
        }
        let ZipLoader = window.ZipLoader;
        if(ZipLoader){
            let array = [];
            // array.push(url_import); //bundle 已启用 json 合并，不需要再另外加载压缩包
            array.push(url_native);

            ZipLoader.download(array, function progress(zip_path, zip) {
                self._loadZipAssetData(zip, {
                    bundleName: bundleName
                });
              }, 
              function complete(...zips) {
                if(zips.length==0){
                   //console.error("download error!");
                  callback("download error!");
                }
                else{
                    callback(null);
                }
              }
            )
        }
        else{
            resolve(null);
            return;
        }
    });

    return promise;
}

proto.loadCommonBundleLang = function (onComplete) {
    BundleManager.loadCommonBundleLang(onComplete);
}

/**
 * 获取多语言关联数据
 *
 * @param {*} params
 * @returns
 */
proto.getLangData = function (params) {
    let lang = env.get("lang");
    let datas = this._langBundleData[lang];
    if(!datas){
        datas = this._langBundleData[lang] = {};
    }
    return datas;
}

proto.setBundleLangData = function (bundleName, data) {
    let datas = this.getLangData(); 
    datas[bundleName] = data;
}

proto.getBundleLangData = function (bundleName) {
    if(!CC_BUILD || env.get("lang")=='zh'){
        return {};
    }

    let data = this.getLangData()[bundleName];
    return data;
}

/**
 * 获取图片json信息
 * @param {String} uuid 
 * @param {String} name 
 */
proto.getSpriteData = function (uuid, name) {
    var datas = this.getLangData();
    var result = null;
    if(!uuid) return result;

    for (var bundleName in datas) {
        let data = datas[bundleName];

        for(let key in data){
            var item = data[key];
            if(item.uuid==uuid){
                result = Object.assign({}, item);
                if(item && !!item.json){
                    if(typeof item.json != 'object'){
                        var jsonString = data.jsons[item.dest] || "{}";
                        item.json = JSON.parse(jsonString);
                    }
                    
                    var jsonData = item.json;
                    for (var k in jsonData) {
                        if(k==name){
                            var subdata = jsonData[k];
                            result.jsonData = subdata;
                            break;
                        }
                    }
                    if(!result.jsonData){
                        var msg = "name="+name + ", src="+key + ", dest="+"res/lang/"+item.dest;
                        if(window["QYLogs"]){
                            window["QYLogs"].error("App", "图集中未找到对应资源", msg);
                        }
                        else{
                             //console.error("图集中未找到对应资源", msg);
                        }
                    }
                }
                
                break;
            }
            else if(item.fnt==uuid){
                result = Object.assign({}, item);
            }
        }
        if(result){
            break;
        }
    }
    return result;
}

/**
 * 根据传入的url获取多语言对应的图片url
 * @param {String} url 
 */
proto.getSpriteLangUrl = function (url) {
    // cc.warn("warn: ", url);
    let datas = this.getLangData();

    let item = null;
    let data = null;
    for (let bundleName in datas) {
        data = datas[bundleName];
        item = data[url]; 
        if(item){
            break;
        }
    }
    if(!item) return url;

    let target = item;
    if(target){
        if(target.dest && target.dest!=""){
            url = target.dest;
            url = `assets/${data.bundleName}/lang/` + url;
        }
        // cc.error("sprite url:", url, target);
    }             

    return url;
}

proto.getLangItemByUrl = function (url) {
    let datas = this.getLangData();
    let item = null;
    let data = null;
    for (let bundleName in datas) {
        data = datas[bundleName];
        item = data[url];   
        if(item){
            break;
        }
    }
    return item;
}

proto.getLangItemByUUID = function (uuid) {
    let datas = this.getLangData();
    let item = null;
    let data = null;
    for (let bundleName in datas) {
        data = datas[bundleName];
        for (const key in data) {
            if(data[key].uuid == uuid){
                item = data[key];
                break;
            }
        }
        if(item){
            break;
        }
    }
    return item;
}

proto.getLangFontDataByUUID = function (uuid) {
    var datas = this.getLangData();
    var result = null;
    for (var bundleName in datas) {
        let data = datas[bundleName];

        let fnts = data.fnts || {};
        result = fnts[uuid];
        if(result!=null&&result!=undefined){
            if(typeof result=='object'){
                result = JSON.stringify(result);
            }
            break;
        }
    }
    return result;
}
// proto.getLangFontByUUID = function (uuid) {
//     let datas = this.getLangData();
//     let item = null;
//     let data = null;
//     for (let bundleName in datas) {
//         data = datas[bundleName];
//         for (const key in data) {
//             if(data[key].fnt == uuid){
//                 item = data[key];
//                 break;
//             }
//         }
//         if(item){
//             item = this.getLangFontDataByUUID(uuid);
//             break;
//         }
//     }
//     return item;
// }

proto._loadZipAssetData = function (zip_data, options) {
    let ZipLoader = window.ZipLoader;
    if(!zip_data || !ZipLoader || !JSZip){
        return;
    }

    let self = this;
    let _zipAssets = this._getZipAsset(options.bundleName);
    options.progress = function(result/*{type:'json'|'image', name:zip_file_name, content:zip_file_content}*/) {
        if(result){
            let asset_type = result.type == 'json' ? 'import' : 'native';
            let key = `assets/${options.bundleName}/${asset_type}/` + result.name;
            _zipAssets[result.type][key] = result.content;
        }
    }
    options.complete = function (...zip_file_content) {
    }
    self._parseZipAssetData(zip_data, options);
    // let promise = JSZip.loadAsync(zip_data);
    // promise.then(function (zip_content) {
    //     self._parseZipAssetData(zip_content, options);
    // })
}

proto._parseZipAssetData = function (zip, options) {
    let promises = [];
    let files = zip.files;
    let self = this;
    var progress = options.progress || function (zip_file_name, zip_file_content) {
    }
    var complete = options.complete || function (...zip_file_contents) {
    }
    for (var zip_file_name in files) {
        if (!files[zip_file_name].dir) {
            promises.push(
                new JSZip.external.Promise(function(resolve, reject){
                    var _resolve = function (result/*{type:'json'|'image', name:zip_file_name, content:zip_file_content}*/) {
                        progress(result);
                        return resolve(result);
                    }
                    self._parserZipAssetFile(options.bundleName, zip, zip_file_name, _resolve, reject);
                })
            );
        }
    }
    JSZip.external.Promise.all(promises).then(function(...zip_file_contents){
        complete(...zip_file_contents);
    }).catch(function (...errors) {
        complete(...errors);
    });
},

proto._parserZipAssetFile = function (bundleName, zip, name, resolve, reject) {
    var self = this;
    var splits = name.split(".");
    var prefix = splits[0];
    var content = null;
    var type = null;
    var suffix = splits[splits.length - 1];
    var in_array = function (value, array) {
        for(var i in array){
            if(array[i]==value){
                return true;
            }
        }
        return false;
    }
    var callback = function () {
        return resolve({
            type,
            name,
            content,
        });
    }
    
    if (in_array(suffix, ['png', 'jpg'])) {
        let url = `assets/${bundleName}/native/${name}`;
        type = 'image';
        content = self.getImageAsset(url);
        if(content){
            return callback();
        }
        return zip.file(name).async('base64').then(function(res){
            content = `data:image/${suffix};base64,${res}`;
            return callback();
        });
    } else if (in_array(suffix, ['json', 'txt'])) {
        let url = `assets/${bundleName}/import/${name}`;
        type = 'json';
        content = self.getJsonAsset(url);
        if(content){
            return callback();
        }
        return zip.file(name).async('string').then(function(res){
            content = res;
            return callback();
        });
    } else {
        return resolve(null);
    }
}

proto._getZipAsset = function (bundleName) {
    if(!CC_BUILD){
        return {};
    }

    return this._zipAssets[bundleName];
}

/**
 * 
 * @param {String} asset_type 'json' | 'image'
 * @param {String} url 
 */
proto._getTypeAsset = function (asset_type, url) {
    for (const key in this._zipAssets) {
        let bundle_asset = this._getZipAsset(key);
        let assets = bundle_asset[asset_type] || {};
        if(assets[url]){
            return assets[url];
        }
    }
    return null;
}

proto.getImageAsset = function (url) {
    return this._getTypeAsset('image', url);
}

proto.getJsonAsset = function (url) {
    if(url.indexOf("assets/internal/import/")>=0){
        let data = null;
        if(window._CCInternalImport){
            data = window._CCInternalImport[url];
            if(data){
                return data;
            }
        }
    }
    return this._getTypeAsset('json', url);
}

proto.setZipAsset = function (url, content) {
    let array = url.split('/');
    let str_asset = array[0];
    let str_bundleName = array[1];
    let str_type = array[2];
    
    this._initZipAsset(str_bundleName);
    let asset = this._getZipAsset(bundleName);
    let result = str_type == "import" ? asset.json : asset.image;
    result[url] = content;
}

proto._initZipAsset = function (bundleName) {
    if(this._getZipAsset(bundleName)){

    }
    else{
        this._zipAssets[bundleName] = {
            json: {},
            image: {},
        }
    }
    return this._getZipAsset(bundleName);
}

ResourceManager.default = new ResourceManager(null);
module.exports = ResourceManager;