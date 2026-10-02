// var firefs = require("fire-fs");
var fsextra = require("fs-extra");
var fs = require("fs");
var path = require('path');

let utils = require("./utils");
let bundle_buildins = utils.getBuildins();

/**
 * 开始复制bundle资源
 * @param {Function} callback (error)
 */
function onCopyAssets(callback) {
    let options = utils.getOptions();
    if (!options) {
        callback && callback("项目未构建");
        return;
    }
    let setting = utils.getSetting();
    let strPathTarget = utils.getPathTarget();
    utils.log("path:", strPathTarget);
    if (!fsextra.pathExistsSync(strPathTarget)) {
        callback(new Error("目标目录不存在!"));
        utils.log("目标目录不存在:", strPathTarget);
        return;
    }

    //onUpdateZipAssetMd5();
    let sub_bundles = onUpdateBundleVersion();
    if (setting.isMainBundle) {
        let bundle_mains = bundle_buildins.concat(sub_bundles);
        delMainBundles(bundle_mains, function onComplete(params) {
            copyMainBundleAssets(function (params) {
                utils.warn("主包复制完成: ", strPathTarget);
                callback()
            })
        })
        return;
    } else if (sub_bundles.length > 0) {
        delSubBundles(sub_bundles, function onComplete(params) {
            copySubBundleAssets(sub_bundles, function (params) {
                utils.warn("子包复制完成: ", sub_bundles);
                callback();
            });
        })
        return;
    } else {
        utils.warn("未复制任何资源到汇总目录");
        callback();
    }
}

function onUpdateBundleVersion() {
    let setting = utils.getSetting();
    let options = utils.getOptions();
    let strPathTarget = utils.getPathTarget();
    let bundle_file_path = path.join(strPathTarget, "public");
    let bundle_file = path.join(bundle_file_path, "bundles.json");
    let modify = false;
    let bundle_content = "{}";
    // if (!fsextra.pathExistsSync(bundle_file_path)) {
    //     utils.mkdirs(bundle_file_path);
    // }
    // if (fsextra.pathExistsSync(bundle_file)) {
    //     bundle_content = fsextra.readFileSync(bundle_file, "utf8");
    // } else {
    //     modify = true;
    // }
    let bundleVers = JSON.parse(bundle_content);

    let build_bundles = options.settings.bundleVers || {};
    if(utils.isNative()){
        build_bundles = {};
        let bundles = options.bundles || [];
        for (let index = 0; index < bundles.length; index++) {
            const element = bundles[index];
            build_bundles[element.name] = ""
        }
    }

    let sub_bundles = [];
    let timestamp = utils.getTimestamp();
    let svn_version = utils.getSvnVersion();
    let project_version = utils.getProjectVersion();
    let isLiveOnly = utils.getIsLiveOnly();
    
    if(setting.isMainBundle){
        utils.updateProjectTimestamp();
    }

    let main_bundle_version = "";

    for (const key in build_bundles) {
        let sub_bundle_file_path = path.join(options.dest, "assets", key, "bundle.json");
        
        let md5_version = build_bundles[key] || "";
        let md5_langs = {};
        if(utils.isWebMobile()){
            md5_langs = utils.getBundleLangMD5(key) || {};
        }
        let md5_object = {
            bundle: md5_version,
            langs: md5_langs
        }

        let md5_json = JSON.stringify(md5_object);
        
        if(!fsextra.pathExistsSync(sub_bundle_file_path)){
            let sub_bundle_content = {
                isLive: isLiveOnly, //是否直播项目
                key: key,           //bundle name
                md5: md5_json,
                version: project_version,
                svnVersion: svn_version,
                buildVersion: timestamp,
            }
            fsextra.writeFileSync(sub_bundle_file_path, JSON.stringify(sub_bundle_content, null, 4));
            if(key=="main"){
                main_bundle_version = project_version + "." + svn_version;
            }
        }
        else{
            utils.isEditor() && utils.error("文件冲突：" + sub_bundle_file_path);
        }

        let is_buildin = false;
        for (let index = 0; index < bundle_buildins.length; index++) {
            const element = bundle_buildins[index];
            if (key == element) {
                is_buildin = true;
                break;
            }
        }
        if (!is_buildin) {
            sub_bundles.push(key);

            if (bundleVers[key] != md5_version) {
                bundleVers[key] = md5_version;
                modify = true;
            }
        }
        else{
            if(setting.isMainBundle){
                if (bundleVers[key] != md5_version) {
                    bundleVers[key] = md5_version;
                    modify = true;
                }
            }
        }
    }

    if (utils.isWebMobile()) {
        //更新主包多语言md5
        let ChessSetConfigPath = path.join(options.dest, "/public/ChessSetConfig.js");
        if (fs.existsSync(ChessSetConfigPath)) {
            let script = fs.readFileSync(ChessSetConfigPath, 'utf8');
            let all_lang_bundle = utils.getAllBundleLangMD5();
            let main_lang_bundle = ["start-scene", "app-common", "game-common", , "game-live-assets", "game-live-views", "game-set-assets", "game-set-views", "game-club-views", "game-club-assets", "game-club-chat"];
            let result_lang = {}
            for (const key in all_lang_bundle) {
                if(main_lang_bundle.indexOf(key)>=0){
                    result_lang[key] = utils.getBundleLangMD5(key) || {};
                }
            }
            if(main_bundle_version!=""){
                script += '\n' + 'ChessSetConfig.VERSION = "' + main_bundle_version + '"';
            }
            let strLangs = JSON.stringify(result_lang);
            script += '\n' + 'ChessSetConfig.BUNDLE_LANGS = \'' + strLangs + '\'';
            fs.writeFileSync(ChessSetConfigPath, script);
            utils.log('主包多语言文件配置，lang_md5：' + strLangs);
            utils.log('更新ChessSet多语言配置，文件路径：' + ChessSetConfigPath);
        }
        else {
            utils.warn('配置文件不存在：' + ChessSetConfigPath);
        }
    }

    return sub_bundles;
}

function onUpdateZipAssetMd5(params) {
    let options = utils.getOptions();
    
    let build_bundles = options.settings.bundleVers;
    
    for (const key in build_bundles) {
        let version = build_bundles[key];
        
        let sub_bundle_import_path = path.join(options.dest, "assets", key, "res-zip", "import.json");
        let sub_bundle_import_md5_path = path.join(options.dest, "assets", key, "res-zip", `import.${version}.json`);
        let sub_bundle_native_path = path.join(options.dest, "assets", key, "res-zip", "native.png");
        let sub_bundle_native_md5_path = path.join(options.dest, "assets", key, "res-zip", `native.${version}.png`);

        let zip_empty_path = path.join(options.dest, "public", "empty.zbin");
        let exist_zip_empty = fs.existsSync(zip_empty_path);

        let is_buildin = false;
        var bundle_buildins_default = ["internal", "main", "resources", "start-scene"];
        for (let index = 0; index < bundle_buildins_default.length; index++) {
            const element = bundle_buildins_default[index];
            if (key == element) {
                is_buildin = true;
                break;
            }
        }

        //import.json 添加 md5
        if(fsextra.pathExistsSync(sub_bundle_import_path)){
            fsextra.moveSync(sub_bundle_import_path, sub_bundle_import_md5_path);
        }
        else{
            if(!is_buildin && exist_zip_empty){
                // utils.warn("import.json 文件不存在：" + sub_bundle_import_path);
                fsextra.copySync(zip_empty_path, sub_bundle_import_md5_path);
            }
        }
        //native.png 添加 md5
        if(fsextra.pathExistsSync(sub_bundle_native_path)){
            fsextra.moveSync(sub_bundle_native_path, sub_bundle_native_md5_path);
        }
        else{
            if(!is_buildin && exist_zip_empty){
                // utils.warn("native.png 文件不存在：" + sub_bundle_native_path);
                fsextra.copySync(zip_empty_path, sub_bundle_native_md5_path);
            }
        }
    }
}

function copyMainBundleAssets(callback) {
    let options = utils.getOptions();
    let strPathTarget = utils.getPathTarget();
    let source_asset_path = path.join(options.dest);
    let target_asset_path = path.join(strPathTarget);

    let ignore_paths = [
        path.join(strPathTarget, "public/bundles.json"),
        path.join(strPathTarget, "frameworks"),
    ]
    let check_ignore = function (dir_path) {
        let ignore = false;
        for (const key in ignore_paths) {
            if (ignore_paths[key] == dir_path) {
                ignore = true;
                break;
            }
        }
        return ignore;
    }
    fsextra.copySync(source_asset_path, target_asset_path, {
        filter: function (src, dest) {
            return !check_ignore(dest);
        }
    });
    callback && callback();
}

function copySubBundleAssets(sub_bundles, callback) {
    let options = utils.getOptions();
    let strPathTarget = utils.getPathTarget();
    for (let index = 0; index < sub_bundles.length; index++) {
        const bundle_key = sub_bundles[index];
        let bundle_path = path.join(options.dest, "assets", bundle_key);
        let target_path = path.join(strPathTarget, "assets", bundle_key);
        fsextra.copySync(bundle_path, target_path);
    }
    callback && callback();
}

function delMainBundles(bundles, callback) {
    let strPathTarget = utils.getPathTarget();
    let ignore_paths = [
        path.join(strPathTarget, "更新日志.md"),
        path.join(strPathTarget, "assets"),
        path.join(strPathTarget, "frameworks"),
        path.join(strPathTarget, "public/bundles.json"),
    ]
    if(utils.isNative()){
        ignore_paths.push(path.join(strPathTarget, "frameworks"));
    }
    delBundles(bundles, function onComplete(params) {
        removePromise(strPathTarget, ignore_paths).then(function (params) {
            callback(true);
        });
    });
}

function delSubBundles(bundles, callback) {
    delBundles(bundles, callback);
}

function delBundles(bundles, callback) {
    let options = utils.getOptions();
    let setting = utils.getSetting();
    let strPathTarget = utils.getPathTarget();

    if (!fsextra.pathExistsSync(strPathTarget)) {
        // let msg = "目录不存在：" + strPathTarget;
        // utils.warn(msg);
        callback(true);
        return;
    }

    let target_asset_path = path.join(strPathTarget, "assets");
    let bundle_paths = [];
    for (let index = 0; index < bundles.length; index++) {
        const bundle_key = bundles[index];
        let bundle_path = path.join(target_asset_path, bundle_key);
        if (fsextra.pathExistsSync(bundle_path)) {
            bundle_paths.push(bundle_path);
        }
    }
    let count = 0;

    function completes(bundle_path) {
        utils.log("bundle删除完成：" + bundle_path);
        count++;
        if (count == bundle_paths.length) {
            callback(true);
        }
    }
    if (bundle_paths.length > 0) {
        for (let index = 0; index < bundle_paths.length; index++) {
            const bundle_path = bundle_paths[index];
            utils.log("bundle删除开始：" + bundle_path);
            removePromise(bundle_path).then(function () {
                completes(bundle_path);
            })
        }
    } else {
        callback(true);
    }
}

// function removeDirSync(dir) {
//   let files = fs.readdirSync(dir)
//   for(var i=0;i<files.length;i++){
//     let newPath = path.join(dir,files[i]);
//     let stat = fs.statSync(newPath)
//     if(stat.isDirectory()){
//       //如果是文件夹就递归下去
//       removeDir(newPath);
//     }else {
//      //删除文件
//       fs.unlinkSync(newPath);
//     }
//   }
//   fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
// }
// // removeDirSync('a');


function removePromise(dir, ignore_paths) {
    if (!ignore_paths) {
        ignore_paths = [];
    }
    if (typeof ignore_paths == 'string') {
        ignore_paths = [ignore_paths];
    }
    let check_ignore = function (dir_path) {
        let ignore = false;
        for (const key in ignore_paths) {
            if (ignore_paths[key] == dir_path) {
                ignore = true;
                break;
            }
        }
        return ignore;
    }
    return new Promise(function (resolve, reject) {
        //先读文件夹
        fs.stat(dir, function (err, stat) {
            if (stat.isDirectory()) {
                fs.readdir(dir, function (err, files) {
                    files = files.map(file => path.join(dir, file)); // a/b  a/m
                    files = files.filter(function (file) {
                        return !check_ignore(file);
                    })
                    let promise = files.map(file => removePromise(file, ignore_paths)); //这时候变成了promise
                    Promise.all(promise).then(function () {
                        fs.rmdir(dir, resolve);
                    })
                })
            } else {
                if (check_ignore(dir)) {
                    resolve();
                } else {
                    fs.unlink(dir, resolve);
                }
            }
        })
    })
}
// removePromise('a').then(function () {
//   console.log('删除成功')
// })

module.exports = {
    copyBundleAssets: onCopyAssets,
}