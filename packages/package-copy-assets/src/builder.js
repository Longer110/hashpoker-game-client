let utils = require("./utils");
let packer = require("./packer");
let bundler = require("./bundler");
var path = require('path')
var fsextra = require("fs-extra");

let builder = {
    runTaskAll() {
        let self = this;
        let task_name = "run_task_all";
        utils.timeStart(task_name);
        let task = new Promise((resolve, reject)=>{
            setTimeout(() => {
                resolve();
            }, 0);
        })
            // .then(function (params) {
            //     return utils.run("empty_test", {
            //         hello: "world",
            //         // debug: true,
            //     });
            // })

            .then(function (res) {
                // if(utils.isWebMobile()){
                    return self.buildBunleLangAssets();
                // }
                // else{
                //     return Promise.resolve(res);
                // }
            })
            .then(function (params) {
                params = params || {};
                let bundle_lang_paths = params.bundle_lang_paths || null;
                // if(utils.isWebMobile()){
                    return self.copyLangAssets(bundle_lang_paths);
                // }
                // else{
                //     return Promise.resolve(params);
                // }
            })
            .then(function (params) {
                return self.buildMainBundleLangFile();  
            })
            .then(function(){
                return utils.run("gulp_all", {
                });
            })
            // .then(function (params) {
            //     // if(utils.isWebMobile()){
            //         //图片资源压缩
            //         return utils.run("imagemin", {
            //             // hello: "world",
            //             // debug: true,
            //         });
            //     // }
            //     // else{
            //     //     return Promise.resolve(params);
            //     // }
            // })
            // .then(function (params) {
            //     // if(utils.isWebMobile()){
            //         //分子包将小图、小的json文件打成压缩包
            //         return utils.run("bundle_zip", {
            //             // hello: "world",
            //             // debug: true,
            //         });
            //     // }
            //     // else{
            //     //     return Promise.resolve(params);
            //     // }
            // })
            // .then(function (params) {
            //     // if(utils.isWebMobile()){
            //         //合并主包index.js、config.json
            //         return utils.run("bundle_main", {
            //             // hello: "world",
            //             // debug: true,
            //         });
            //     // }
            //     // else{
            //     //     return Promise.resolve(params);
            //     // }
            // })
            .then(function (res) {
                //复制子包资源
                return self.copyBundleAssets();
            })
            .then(function (params) {
                utils.timeEnd(task_name);
                return Promise.resolve(params);
            })
            .catch(function (error) {
                utils.log("task error: ", error);
                if (error.task == 'empty') {

                } else if (error.task == "") {

                } else {

                }
                return Promise.reject(error);
            })
        return task;
    },
    //复制子包资源
    copyBundleAssets() {
        // Editor.error(`-------------步骤 copyBundleAssets --------------------`);
        let task_name = "copy_bundle_assets";
        utils.timeStart(task_name);
        let task = new Promise((resolve, reject) => {
            packer.copyBundleAssets(function (error) {
                utils.timeEnd(task_name);
                if (error) {
                    reject(error);
                } else {
                    resolve(null);
                }
            })
        })
        return task;
    },
    //复制语言包资源
    copyLangAssets(bundle_lang_paths){
        // Editor.error(`-------------步骤 copyLangAssets --------------------`);
        let task_name = "copy_lang_assets";
        utils.timeStart(task_name);
        let task = new Promise((resolve, reject) => {
            return resolve();
        })
        .then(function (params) {
            return bundler.asyncCopyLangAssets(bundle_lang_paths);
        })
        .then(function (params) {
            utils.timeEnd(task_name);
        })
        return task;
    },
    //生成子包多语言资源关系映射
    buildBunleLangAssets() {
        // Editor.error(`-------------步骤 buildBunleLangAssets --------------------`);
        let task_name = "build_bundle_lang_assets";
        utils.timeStart(task_name);
        let task = new Promise((resolve, reject) => {
            return bundler.packBundleAssets(resolve, reject);
        })
        .then(function (bundle_lang_maps) {
            utils.timeEnd(task_name);
            return Promise.resolve(bundle_lang_maps);
        });
    
        return task;
    },
    //生成主包多语言配置文件版本号
    buildMainBundleLangFile(){
        // Editor.error(`-------------步骤 buildMainBundleLangFile --------------------`);
        let task_name = "build_main_bundle_lang_file";
        utils.timeStart(task_name);
        let task = new Promise((resolve, reject) => {
            let options = utils.getOptions();
            let build_bundles = options.settings.bundleVers || {};
            let bundle_buildins = utils.getBuildins();
            let config_lang_all_md5 = {}
            for (const key in build_bundles) {
                if(bundle_buildins.indexOf(key)>=0){
                    // let md5_version = build_bundles[key] || "";
                    let md5_langs = {};
                    if(utils.isWebMobile()){
                        md5_langs = utils.getBundleLangMD5(key) || {};
                    }
                    config_lang_all_md5[key] = md5_langs;
                }
            }
            let main_bundle_config_lang_path = path.join(options.dest, "assets", "main", "config.lang.json");
            fsextra.writeFileSync(main_bundle_config_lang_path, JSON.stringify(config_lang_all_md5, null, 4));
            return resolve();
        })
        .then(function (params) {
            utils.timeEnd(task_name);
        })
        return task;
    },
}

module.exports = builder;