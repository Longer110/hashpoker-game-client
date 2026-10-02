//源语言
let language_original = 'zh';

//目标多语言
let language_dest_array = [
    'en', //英文
    'th', //泰文
    'zh_tw', //繁体
    'vi',   //越南语
    'kh', //柬埔寨语
    'id', //印尼语
];

// //源皮肤
// let skin_original = 'skin_a';
// //多皮肤  
// let skin_array = [
//     'skin_default',
//     'skin_a',
//     'skin_b',
// ]

var path = require('path');
var fs = require('fs');
var fsextra = require('fs-extra');
var async = require('async');


let utils = require("./utils");
let bundle_buildins = utils.getBuildins();

let path_build = path.join(__dirname, "../build");
let output_assets = path.join(path_build, "/output-assets.json");
let output_query_infos = path.join(path_build, "/output-query-infos.json");

let output_bundle_results = path.join(path_build, "/output_bundle_results.json");
let output_lang_results = path.join(path_build, "/output_lang_results.json");
let output_bundle_lang_assets = path.join(path_build, "/output_bundle_lang_assets.json");

let build_bundle_lang_maps = path.join(path_build, "/build_bundle_lang_maps.json");
let build_bundle_lang_paths = path.join(path_build, "/build_bundle_lang_paths.json");

//https://docs.cocos.com/creator/manual/zh/release-notes/build-extend-upgrade-guide.html
//v2.4 定制项目构建流程升级指南

//https://docs.cocos.com/creator/manual/zh/publish/custom-project-build-template.html
//定制项目构建流程

let bundler = {
    packBundleAssets(resolve, reject) {
        let self = this;
        let cache_bundle_results = null;
        let cache_lang_results = null;
        let cache_bundle_lang_results = null;
        let task = self.asyncQueryAssets();
        task.then(function (assets) {
                // Editor.error(`-----------------------步骤1---------------`);
                return self.asyncGenerateAllBundleAssets(assets);
            })
            .then(function (bundle_results) {
                // Editor.error(`-----------------------步骤2---------------`);
                cache_bundle_results = bundle_results;
                return self.asyncGenerateLangAssets();
            })
            .then(function (lang_results) {
                // Editor.error(`-----------------------步骤3---------------`);
                cache_lang_results = lang_results;
                return self.asyncGenerateAllBundleLangAssets(cache_bundle_results, cache_lang_results);
            })
            .then(function (all_bundle_lang_assets) {
                // Editor.error(`-----------------------步骤4---------------`);
                cache_bundle_lang_results = all_bundle_lang_assets;
                return self.asyncGenerateBundleLangMaps(cache_bundle_lang_results);
            })
            .then(function (params) {
                if(resolve){
                    // Editor.error(`-----------------------步骤5---------------`);
                    resolve(params);
                }
            })
            .catch(function (error) {
                utils.error("bundler queryBundles error: ", error);
                if(reject){
                    reject(error);
                }
            })
        return task;
    },

    //复制子包多语言资源
    asyncCopyLangAssets(bundle_lang_paths){
        if(!bundle_lang_paths){
            if(fsextra.pathExistsSync(build_bundle_lang_paths)){
                bundle_lang_paths = require(build_bundle_lang_paths);
            }
        }
        
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(typeof bundle_lang_paths != 'object'){
                    return reject({
                        task: "copy_bundle_lang_maps",
                        msg: "参数不能为空, 请先构建项目",
                    });
                }

                let options = utils.getOptions();
                let path_project = options.project; // xxx
                let path_build = options.buildPath; // xxx/build
                let path_dest = options.dest;       // xxx/build/web-mobile

                for (const bundle_name in bundle_lang_paths) {
                    let bundle_paths = bundle_lang_paths[bundle_name];
                    let dest_lang_path = path.join(path_dest, "assets", bundle_name, "lang");
                    for (const url_key in bundle_paths) {
                        let bundle_item = bundle_paths[url_key];
                        let src_file_path = path.join(bundle_item.src_lang_folder, url_key);
                        let dest_file_path = path.join(dest_lang_path, bundle_item.dest);
                        fsextra.copySync(src_file_path, dest_file_path);
                        // utils.log("copy:", bundle_name, url_key);
                        // utils.log("to", src_file_path, dest_file_path);
                    }
                }

                resolve();
            })
        })

        return promise;
    },

    //生成分包资源map信息
    asyncGenerateBundleLangMaps(all_bundle_lang_assets){
        if(!all_bundle_lang_assets){
            if(fsextra.pathExistsSync(output_bundle_lang_assets)){
                all_bundle_lang_assets = require(output_bundle_lang_assets);
            }
        }
        
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(typeof all_bundle_lang_assets != 'object'){
                    return reject({
                        task: "generate_bundle_lang_maps",
                        msg: "参数不能为空, 请先构建项目",
                    });
                }

                
                let options = utils.getOptions();
                let path_project = options.project; // xxx
                let path_build = options.buildPath; // xxx/build
                let path_dest = options.dest;       // xxx/build/web-mobile
                let bundleVers = options.settings.bundleVers;
                if(!bundleVers){
                    bundleVers = {};
                    if(utils.isWebMobile()){
                        utils.error("bundleVers未导出。是否构建 web-mobile 时未勾选md5?");
                    }
                }
                let bundle_lang_maps = {};
                let bundle_lang_paths = {};

                for (const bundle_name in all_bundle_lang_assets) {
                    let bundle_map = bundle_lang_maps[bundle_name] = {};
                    let bundle_path = bundle_lang_paths[bundle_name] = {};

                    let bundle_item_array = all_bundle_lang_assets[bundle_name];
                    // 处理多语言目录
                    for(let j=0; j<language_dest_array.length; j++){
                        let language_target = language_dest_array[j];
                        let lang_maps = bundle_map[language_target] = {
                            jsons: {},
                            fnts: {},
                        };
                        for (const url_key in bundle_item_array) {
                            let item = bundle_item_array[url_key];
                            let info = item.target_lang_info[language_target];
                            if(!info){
                                // utils.error(`缺少语言包：[${language_target}] --> ${item.url_assets}`);
                                continue;
                            }
                            let map_item = lang_maps[url_key] = {};
                            map_item.uuid = item.uuidDepend;
                            map_item.dest = info.path_build;
                            if(info.json){
                                map_item.json = 1;
                                lang_maps.jsons[map_item.dest] = info.json;
                            }
                            if(info.fnt){
                                // map_item.fnt = info.fnt;
                                map_item.fnt = item.uuid;
                                lang_maps.fnts[item.uuid] = info.fnt;
                            }

                            let path_item = {
                                src_lang_folder: item.target_lang_folder,
                                dest: info.path_build,
                            }
                            bundle_path[info.path] = path_item;
                        }
                        //分语言包输出到构建后的子包lang目录
                        let lang_target_folder = path.join(path_dest, "assets", bundle_name, "lang");
                        // let version = bundleVers[bundle_name] || "";
                        let version = "";
                        let lang_target_path = path.join(lang_target_folder, `lang_${language_target}`+(version!=""?`.${version}`:"")+`.json`);
                        if(!fsextra.pathExistsSync(lang_target_folder)){
                            utils.mkdirs(lang_target_folder);
                        }
                        fs.writeFileSync(lang_target_path, JSON.stringify(lang_maps), 'utf8');
                        
                        if(utils.isWebMobile()){
                            let lang_file_md5 = utils.getFileMD5(lang_target_path);
                            let lang_target_path_md5 = utils.appendFileMD5(lang_target_path, lang_file_md5);
                            if(!fsextra.pathExistsSync(lang_target_path_md5)){
                                fsextra.moveSync(lang_target_path, lang_target_path_md5);
                            }
                            utils.setBundleLangMD5(bundle_name, language_target, lang_file_md5);
                        }
                        // utils.log(`输出语言包： ${bundle_name} - ${language_target} --> ${lang_target_path}`);
                    }
                }
                //保存全部map文件
                fs.writeFileSync(build_bundle_lang_maps, JSON.stringify(bundle_lang_maps, null, 4), 'utf8');
                //保存全部path文件
                fs.writeFileSync(build_bundle_lang_paths, JSON.stringify(bundle_lang_paths, null, 4), 'utf8')
                resolve({
                    bundle_lang_maps,
                    bundle_lang_paths,
                });
            });
        });
        return promise;
    },
    
    //生成所有bundle、所有多语言的最终关联信息
    asyncGenerateAllBundleLangAssets(bundle_results, lang_results){
        //
        if(!bundle_results){
            if(fsextra.pathExistsSync(output_bundle_results)){
                bundle_results = require(output_bundle_results);
            }
        }
        if(!lang_results){
            if(fsextra.pathExistsSync(output_lang_results)){
                lang_results = require(output_lang_results);
            }
        }

        let all_bundle_lang_assets = {};

        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(typeof bundle_results != 'object' || typeof lang_results != 'object'){
                    return reject({
                        task: "generate_all_bundle_lang_assets",
                        msg: "参数不能为空, 请先构建项目",
                    });
                }

                let options = utils.getOptions();
                let path_project = options.project; // xxx
                let path_build = options.buildPath; // xxx/build
                let path_dest = options.dest;       // xxx/build/web-mobile
                let bundle_mains = utils.getBuildins();
                let is_live_only = utils.getIsLiveOnly();
                // Editor.error(`-------------bundle_results.len: ${bundle_results.length}`);

                for (const bundle_name in bundle_results) {
                    let bundle_assets = all_bundle_lang_assets[bundle_name] = {};
                    let bundle_item_array = bundle_results[bundle_name];
                    // Editor.info(`-------------bundle_item_array.len: ${bundle_item_array.length}`);

                    for(let i=0; i<bundle_item_array.length; i++){
                        let item = bundle_item_array[i];
                        let url = item.url;
                        let url_splits = url.split("/");
                        // let db_path = `db:/${url_splits[1]}/`;
                        let db_path = `db:/${url_splits[2]}/`; //pzh 
                        //去掉db:/头
                        // url = url.substring(db_path.length);
                        url = url.substring(`db:/assets/${url_splits[2]}/`);//pzh 

                        let is_auto_atlas = false;
                        let is_plist = false;
                        let plist_file_name = "";
                        let sprite_file_name = "";
                        //引擎自动图集
                        if(item.uuidDepend.length==9){
                            is_auto_atlas = true;
                            sprite_file_name = url_splits[url_splits.length-2];
                            sprite_name = url_splits[url_splits.length-1];
                            url = url.substring(0, url.length-sprite_name.length-1);
                            // utils.log("---------- 自动图集url: ", item.url);
                        }
                        //texture packer 打包 plist
                        else{
                            let pos_plist = url.indexOf(".plist/");
                            if(pos_plist>0){
                                is_plist = true;
                                sprite_file_name = url_splits[url_splits.length-1];
                                plist_file_name = url_splits[url_splits.length-2];
                                url = url.replace(plist_file_name+"/", "");
                                // utils.log("------------ is_plist: ", item.url);
                            }
                        }
                        
                        let need_atlas = is_auto_atlas || is_plist;
                        
                        if(!need_atlas){
                            sprite_file_name = url_splits[url_splits.length-2];
                            sprite_name = url_splits[url_splits.length-1];
                            url = url.substring(0, url.length-sprite_name.length-1);
                            // utils.log("+++++++++++++ is_single_sprite: ", item.url);
                        }
                        
                        let ext = utils.getExtName(url);
                        if(ext=='.fnt'){
                            continue;
                        }

                        // 放在 /zh/ 文件夹下的资源才处理
                        let language_src = `/${language_original}/`;
                        let pos1 = -1;
                        let pos2 = -1;
                        pos1 = url.indexOf(language_src);

                        if(pos1>0){
                            // Editor.info(`-------------url: ${url}, pos1 : ${pos1} , language_src: ${language_src}`);
                            // Editor.info(`-------------db_path: ${db_path}`);
                            let prefix_src = url.substring(0, pos1);
                            prefix_src = prefix_src.substring(`db:/assets/`.length); //pzh

                            let suffix_src = url.substring(pos1 + language_src.length);
                            
                            // let package = lang_results[db_path]
                            let package = lang_results[db_path] || lang_results[db_path.toLocaleLowerCase()]; //pzh

                            // if(!package){
                            //     let keys = Object.keys(lang_results);
                            //     for (const key in keys) {
                            //         let value = keys[key];
                            //         if(value.toLocaleLowerCase()==db_path){
                            //             package = lang_results[value];
                            //         }
                            //     }
                            // }
                            if(!package){
                                utils.warn("未找到对应扩展包信息：package="+db_path);
                            }
                            else{
                                let package_path = package.package_path;
                                let lang_folder_path = utils.replaceAll(path.join(package_path, package.lang_folder));
                                // let build_bundle_assets_path_prefix = utils.replaceAll(path.join(path_dest, package.assets_path, bundle_name));
                                let build_bundle_assets_path_prefix = utils.replaceAll(path.join(path_dest, package.assets_path));//pzh
                                let file_src = utils.replaceAll(path.join(package_path, package.assets_path, url));
                                let lang_files = package.lang_datas.files;
                                let lang_jsons = package.lang_datas.jsons;
                                let lang_md5s = package.lang_datas.md5s;
                                let lang_fnts = package.lang_datas.fnts;
                            

                                // 处理多语言目录
                                for(let j=0; j<language_dest_array.length; j++){
                                    let language_target = language_dest_array[j];
                                    let language_dest = `/${language_target}/`;

                                    let handled = false;   
                                    let atlas_path = null;
                                    let file_path = null;
                                    // Editor.info(`-------------lang_files.len: ${lang_files.length}`);
                                    for (let index = 0; index < lang_files.length; index++) {
                                        file_path = lang_files[index];
                                        pos2 = file_path.indexOf(language_dest);
                                        // Editor.info(`-------------pos2: ${pos2}`);
                                        if(pos2>0){
                                            let prefix_dest = file_path.substring(0, pos2);
                                            let suffix_dest = file_path.substring(pos2 + language_dest.length);
                                            // Editor.info(`-------------suffix_src: ${suffix_src}, suffix_dest: ${suffix_dest}, prefix_src: ${prefix_src},  prefix_dest: ${prefix_dest}`);
                                            
                                            //找到多语言文件
                                            if(prefix_src==prefix_dest){
                                                if(suffix_src!=suffix_dest){
                                                    //兼容多层子目录key
                                                    suffix_dest = suffix_dest.replace(/\//g, '-');
                                                }
                                                if(suffix_src==suffix_dest){
                                                    handled = true;
                                                    
                                                    let atlas_path_temp = prefix_dest + language_dest + "plist/output.png";
                                                    if(need_atlas && lang_jsons[atlas_path_temp]){
                                                        atlas_path = atlas_path_temp;
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    if(handled){
                                        let url_remote = item.buildPath.substring(build_bundle_assets_path_prefix.length + 1);
                                        url_remote = url_remote.substring(`assets/${bundle_name}/`.length); //pzh 在native路径下的文件
                                        // Editor.info(`-------------url_remote: ${url_remote}`)
                                        let item_output = bundle_assets[url_remote];
                                        if(!item_output){
                                            item_output = bundle_assets[url_remote] = {
                                                uuid: item.uuid,
                                                uuidDepend: item.uuidDepend,
                                                url_md5: item.md5,
                                                url_remote: url_remote,
                                                url_build: item.buildPath,
                                                // url_assets: file_src, // pzh 没有用到 url_assets 
                                                target_lang_folder: lang_folder_path,
                                                target_lang_info: {},
                                            }
                                        }
                                        let target_path = atlas_path ? atlas_path : file_path;
                                        let target_lang_info = {
                                            path: target_path,
                                            path_build: "",
                                            md5: lang_md5s[target_path],
                                            json: lang_jsons[target_path],
                                            fnt: lang_fnts[target_path],
                                        }
                                        if(utils.isMd5Cache()){
                                            target_lang_info.path_build = utils.appendFileMD5(target_path, target_lang_info.md5);
                                        }
                                        else{
                                            target_lang_info.path_build = target_path;
                                        }
                                        item_output.target_lang_info[language_target] = target_lang_info;
                                        //使用图集
                                        if(atlas_path){
                                            //检查图集中是否包含当前碎图
                                            let posFileFilter = '/';
                                            let posFileName = item.url.lastIndexOf(posFileFilter);
                                            if(posFileName>0){
                                                let filekey = item.url.substring(posFileName+posFileFilter.length);
                                                let find = false;
                                                let jsonData = JSON.parse(target_lang_info.json);
                                                for (const frame_key in jsonData) {
                                                    if(filekey==frame_key || filekey==frame_key+'.png'){
                                                        find = true;
                                                        break;
                                                    }
                                                }
                                                // Editor.info(`--------- 图集路径: ${atlas_path}, find = ${find}`)

                                                if(!find){
                                                    utils.error("[" + language_target + "] " + 'lang/' + file_path + '<=' + filekey +"（图集中找不到该资源）" )
                                                }
                                            }
                                        }
                                        else{
                                            // Editor.info(`--------- 图集路径为空: ${atlas_path}, need_atlas = ${need_atlas}`)
                                            if(need_atlas){
                                                utils.warn(`未找到对应语言图集文件：[${language_target}] --> ${file_src}`);
                                            }
                                        }
                                    }
                                    else{
                                        let func = utils.warn;
                                        //主包
                                        if(bundle_mains.indexOf(bundle_name)>=0){
                                            //直播项目主包未做多语言
                                            if(is_live_only){
                                                // func = utils.log;
                                                func = null; //不打印了
                                            }
                                        }
                                        func&&func.call(utils, `未找到对应语言文件：[${language_target}] --> ${file_src}`);
                                    }
                                }
                            }
                        }
                    };
                }
                fs.writeFileSync(output_bundle_lang_assets, JSON.stringify(all_bundle_lang_assets, null, 4), 'utf8');
                resolve(all_bundle_lang_assets);
            }, 0 );
        });
        return promise;
    },

    //关联图集json信息
    generateJsonData(lang_path, language_target, prefix_path, suffix_path){
        let data = null;
        let output_png_file = path.join(prefix_path, language_target, "plist/output.png");
        let output_json_file = path.join(prefix_path, language_target, "plist/output.json");
        let output_png_path = path.join(lang_path, output_png_file);
        let output_json_path = path.join(lang_path, output_json_file);
        
        if(fsextra.pathExistsSync(output_png_path) && fsextra.pathExistsSync(output_json_path)){
            let content = fs.readFileSync(output_json_path, 'utf8');
            let plistData = JSON.parse(content);
            let jsonData = utils.toCocosCreatorData(plistData.frames);
            // jsonData = JSON.stringify(jsonData);
            data = {
                md5: utils.getFileMD5(output_png_path),
                jsonData: jsonData,
            };

            //检查图集中是否包含该资源碎图
            let filekey = suffix_path;
            let find = false;
            for (const key in jsonData) {
                if(filekey==key || filekey==key+'.png'){
                    find = true;
                    break;
                }
            }
            if(!find){
                utils.error("[" + language_target + "] " + 'lang/' + output_png_path + '<=' + filekey +"（图集中找不到该资源）" )
            }
        }
        return data;
    },

    //查询并生成项目所有资源信息
    asyncQueryAssets() {
        //输出所有资源信息
        let tasks = [
            "folder",
            "texture",
            "sprite-frame",
            "asset", "particle", "prefab", "scene",
            "javascript", "animation-clip", "sprite-atlas",
            "dragonbones-atlas", "dragonbones", "tiled-map",
            "auto-atlas", "audio-clip", "bitmap-font", "ttf-font",
            "label-atlas", "spine",
            "markdown",
            "text",
            "json"
        ];

        //只处理这些资源
        let filter = [
            'sprite-frame',
            'label-atlas',
            'bitmap-font',
            'ttf-font',
        ];

        let promise = new Promise((resolve, reject) => {
            let self = this;
            let options = self.getOptions();
            if (!options) {
                return reject({
                    task: 'query_info',
                    msg: "构建信息不存在，请构建后执行此操作！",
                });
            }
            
            let query_items = {};
            if (!self.isEditor()) {
                try {
                    query_items = require(output_query_infos);
                } 
                catch (error) {
                    query_items = {};
                }
            }

            let check_handle = function (item) {
                let handle = false;
                for (let index = 0; index < filter.length; index++) {
                    const key = filter[index];
                    if (item == key) {
                        handle = true;
                        break;
                    }
                }
                return handle;
            }
            
            async.mapSeries(tasks, (item, cb) => {
                if (self.isEditor()) {
                    Editor.assetdb.queryAssets('db://**/*', item, (err, assetsInfos) => {
                        query_items[item] = assetsInfos;
                        cb(null, null);
                    });
                } else {
                    cb(null, null);
                }
            }, (error, series_result) => {
                if (error) {
                    reject(error);
                    return;
                }

                let assets = {};
                for (const key in query_items) {
                    if(check_handle(key)){
                        assets[key] = query_items[key];
                    }
                }
                
                let output_assets_string = JSON.stringify(assets, null, 4);
                output_assets_string = utils.replaceAll(output_assets_string);
                assets = JSON.parse(output_assets_string);
                fs.writeFileSync(output_assets, output_assets_string, 'utf8');
                if (self.isEditor()) {
                    fs.writeFileSync(output_query_infos, JSON.stringify(query_items, null, 4), 'utf8');
                }
                resolve(assets);
            })
        })

        return promise;
    },

    //生成所有bundle资源包
    asyncGenerateAllBundleAssets(all_assets){
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                let uuid_assets = {};
                for (const type_key in all_assets) {
                    let type_assets = all_assets[type_key];
                    type_assets.forEach(asset_item => {
                        uuid_assets[asset_item.uuid] = asset_item;
                    });
                }
                let options = this.getOptions();
                let bundles = options.bundles;
                let bundle_results = {};
                for (let index = 0; index < bundles.length; index++) {
                    let bundle = bundles[index];
                    let bundle_name = bundle.name;

                    let bundle_result = this.asyncGenerateOneBundleAssets(bundle, uuid_assets);
                    bundle_results[bundle_name] = bundle_result;
                }
                fsextra.writeFileSync(output_bundle_results, JSON.stringify(bundle_results, null, 4), 'utf8');
                resolve(bundle_results);
            }, 0);
        });

        return promise;
    },
    //生成单个bundle资源包
    asyncGenerateOneBundleAssets(bundle, uuid_assets){
        let options = this.getOptions();
        let buildResults = bundle.buildResults;
        let _buildAssets = buildResults._buildAssets;
        let _nativeMd5Map = buildResults._nativeMd5Map;
        let _md5Map = buildResults._md5Map;
        
        let getDependUUID = function (uuid, depend_uuid, item) {
            if(!depend_uuid){
                depend_uuid = 0;
            }
            if(!item){
                item = {};
            }
            let build_item = _buildAssets[uuid];
            if(build_item.dependUuids){
                depend_uuid = build_item.dependUuids[0]; //图片类型依赖uuid只有一项，有多项依赖的不是图片类型
                if(!item[depend_uuid]){
                    item[depend_uuid] = 1;
                    return getDependUUID(depend_uuid, depend_uuid, item);
                }
                else{
                    return 0;
                }
            }
            else{
                return depend_uuid;
            }
        }

        let bundle_result = [];
        for (let uuid in _buildAssets) {
            let uuidDepend = getDependUUID(uuid);
            let asset_uuid = uuidDepend ? uuidDepend : uuid;
            let build_item = _buildAssets[asset_uuid];
            let asset_item = uuid_assets[uuid];
            let md5string = options.md5Cache ? (_nativeMd5Map[asset_uuid] || _md5Map[asset_uuid] || 0) : 0;
            if(asset_item && build_item.nativePath){
                let nativePath = build_item.nativePath;
                let dirs = nativePath.split('.');
                if(md5string && dirs.length==2){
                    dirs[2] = dirs[1];
                    dirs[1] = md5string;
                    nativePath = dirs.join('.');
                }
                if(uuid.length==36){
                    if(this.isEditor()){
                        uuid = Editor.Utils.UuidUtils.compressUuid(uuid, true);
                    }
                }
                if(uuidDepend && uuidDepend.length==36){
                    if(this.isEditor()){
                        uuidDepend = Editor.Utils.UuidUtils.compressUuid(uuidDepend, true);
                    }
                }
                bundle_item = {
                    uuid: uuid,
                    uuidDepend: uuidDepend,
                    url: asset_item.url,
                    path: asset_item.path,
                    buildPath: nativePath,
                    md5: md5string,
                }
                bundle_result.push(bundle_item);
            }
        }
        return bundle_result;
    },

    //生成多语言资源包
    asyncGenerateLangAssets(){
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                let packages = this.getAllPackagePath();
                let lang_results = {};
                for (let index = 0; index < packages.length; index++) {
                    let package = packages[index];
                    let lang_file_datas = {
                        files: [],
                        jsons: {},
                        md5s: {},
                        fnts: {},
                    };
                    let folder = "lang";
                    let lang_path = path.join(package.project_path, folder); // package_path: 'D:/workspace/club-dz/project-app-club/languages/bundle-club-chat'
                    this.getDirFilesSync(lang_path, null, lang_file_datas);  // lang_path : 'D:/workspace/club-dz/project-app-club/languages/bundle-club-chat/lang'
                    // lang_results[package.db_path.toLocaleLowerCase()] = {
                    lang_results[package.db_path] = {               //pzh
                        package_name: package.package_name,
                        assets_path: package.assets_path,
                        db_path: package.db_path,
                        package_path: package.project_path,
                        lang_folder: folder,
                        lang_datas: lang_file_datas,
                    };
                }
                fsextra.writeFileSync(output_lang_results, JSON.stringify(lang_results, null, 4), 'utf8');
                // Editor.info(lang_results);
                resolve(lang_results);
            }, 0);
        });

        return promise;
        
    },

    //获取所有资源依赖包目录
    getAllPackagePath(){
        let options = this.getOptions();
        let project_path = options.project;
        // let package_path = path.join(project_path, "packages");
        let package_path = path.join(project_path, "languages");
        let files = fs.readdirSync(package_path);
        let packages = [];

        //当前项目根目录
        // let main_item = {
        //     package_name: options.projectName,
        //     assets_path: "assets",
        //     db_path: "db:/assets/",
        //     project_path: options.project,
        // }
        // packages.push(main_item);
        
        //当前项目子目录packages下的所有资源依赖包
        files.forEach(function (file, index) {
            let sub_path = path.join(package_path, file);
            var info = fs.statSync(sub_path)
            if(info.isDirectory()){
                let package_json_file = path.join(sub_path, "package.json");
                if(fsextra.pathExistsSync(package_json_file)){
                    let content = fs.readFileSync(package_json_file, "utf8");
                    let object = JSON.parse(content);
                    let resource = object["runtime-resource"];
                    if(resource){
                        // let db_path = `db:/${object.name}-${resource.name}/`; //pzh
                        let db_path = `db:/${object.name}/`;
                        let item = {
                            package_name: object.name,
                            // assets_path: resource.path,
                            assets_path: "", //pzh
                            db_path: db_path,
                            project_path: utils.replaceAll(sub_path),
                        }
                        packages.push(item);
                    }
                }
            }
        })
        return packages;
    },

    //获取指定路径下的所有文件
    getDirFilesSync(root, file_path, result){
        if(!file_path){
            file_path = "";
        }
        let file_fullpath = path.join(root, file_path);
        if(fsextra.pathExistsSync(file_fullpath)){
            var pa = fs.readdirSync(file_fullpath);
            pa.forEach(function(file, index){
                let next_file_path = path.join(file_path, file);
                let next_file_fullpath = path.join(root, next_file_path);
                var info = fs.statSync(next_file_fullpath)
                if(info.isDirectory()){
                    this.getDirFilesSync(root, next_file_path, result);
                }else{
                    next_file_path = utils.replaceAll(next_file_path);
                    let ext = utils.getExtName(next_file_path);
                    if(ext=='.tps'){
                        //不用处理
                    }
                    else if(ext=='.plist'){
                        utils.error("不支持plist，请将图集导出为 .json 格式");
                    }
                    else if(ext=='.json'){
                        let content = fs.readFileSync(next_file_fullpath, 'utf8');
                        let plistData = JSON.parse(content);
                        let jsonData = utils.toCocosCreatorData(plistData.frames);
                        jsonData = JSON.stringify(jsonData);
                        let key = next_file_path.substring(0, next_file_path.length-ext.length);
                        key = key + ".png";
                        result.jsons[key] = jsonData;
                    }
                    else if(ext=='.fnt'){
                        let fntData = utils.getFntData(next_file_fullpath);
                        
                        let key = next_file_path.substring(0, next_file_path.length-ext.length);
                        key = key + ".png";
                        result.fnts[key] = fntData;
                    }
                    else{// png 图片
                        result.files.push(next_file_path);
                        // let output_name = "/plist/output.";
                        // let pos = next_file_path.indexOf(output_name);
                        // if(pos>0){
                            let md5string = utils.getFileMD5(next_file_fullpath);
                            result.md5s[next_file_path] = md5string;
                        // } 
                    }
                }	
            }.bind(this));
        }
    },

    //项目build optoins
    getOptions(){
        let options = utils.getOptions();
        if (!options) {
            if (this.isEditor()) {
                Editor.Dialog.messageBox({
                    type: 'error',
                    message: '请构建后执行此操作！'
                });
                return;
            } else {
                utils.error("请构建后执行此操作！");
            }
            return null;
        }
        return options;
    },
    getSettings() {
        let options = utils.getOptions();
        this._settings = this._settings || {
            root: utils.replaceAll(path.join(options.project, 'temp', 'build')),
            dest: utils.replaceAll(path.join(options.project, 'temp', 'build', options.actualPlatform)),
            output: utils.replaceAll(path.join(options.project, 'temp', 'build', options.actualPlatform, "output")),
            lang: utils.replaceAll(path.join(options.project, 'lang')),
        }
        return this._settings;
    },
    isEditor() {
        return (typeof Editor == 'object') ? true : false;
    }
}

module.exports = bundler;