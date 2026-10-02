var firefs = require("fire-fs");
var fsextra = require("fs-extra");
var fs = require("fs");
var path = require('path');
var crypto = require('crypto');
var child_process = require('child_process');
var shelljs = require("shelljs");

var bundle_buildins = ["internal", "main", "resources", "start-scene", "app-common", "game-common"];
var BUILD_OPTIONS = null;
let path_build = path.join(__dirname, "../build");
let file_build_options = path.join(path_build, "/build_options.json");
let file_setting = path.join(__dirname, "../panel/setting.json");

let isEditor = function (params) {
    return (typeof Editor == 'object' && Editor != null);
}
let debug = {};
debug.log = isEditor() ? Editor.log.bind(Editor) : console.log.bind(console);
debug.warn = isEditor() ? Editor.warn.bind(Editor) : console.warn.bind(console);
debug.error = isEditor() ? Editor.error.bind(Editor) : console.error.bind(console);

var bmfont2json_error = "未找到多语言打包相关插件。请先在 packages/package-copy-assets/src 目录下执行 cnpm i 安装依赖项。";
var bmfont2json = null;
try {
    bmfont2json = require('bmfont2json');
} catch (error) {
    debug.warn(bmfont2json_error);
}
let timestamps = {};
let bundle_lang_md5 = {};

let utils = {
    _timestamp: 0,
    resetTask: function (params) {
      timestamps = {};  
    },
    //执行指定名称的 gulp 任务
    run: function (gulp_task, options) {
        if (typeof options != 'object') {
            options = {};
        }
        options.platform = utils.isWebMobile()?'web-mobile':'native';

        let self = this;
        let promise = new Promise((resolve, reject) => {
            var params = [];
            var base = __dirname;
            var file = base + '/run.js';
            file = self.replaceAll(file);
            var path = base;
            params.push(file);
            params.push(gulp_task);
            params.push('--cwd');
            params.push(path);
            for (const key in options) {
                let args = '--' + key;
                let value = options[key];
                params.push(args);
                params.push(value);
            }
            self.timeStart(gulp_task);
            var process = //child_process.execFile('node', params);
                child_process.execFile('node', params, function (error, stdout, stderr) {
                    self.warn("stdout", stdout);
                    self.timeEnd(gulp_task);
                    if (error) {
                        self.error('gulp task error: ', gulp_task, stderr, error);
                        return reject({
                            task: gulp_task,
                            msg: error,
                        })
                        // throw error;
                    } else {
                        return resolve({
                            task: gulp_task,
                        })
                    }
                });
            if (options.debug) {
                process.stdout.on('data', function (data) {
                    self.log('stdout: ', data);
                });
                process.stderr.on('data', function (data) {
                    self.warn('stderr: ', data);
                });
            }
        });
        return promise;
    },
    getBuildins(){
        return bundle_buildins;
    }, 
    setTimestamp(value){
        this._timestamp = value;
    },
    getTimestamp(){
        return this._timestamp;
    },
    isMd5Cache(){
        let options = utils.getOptions();
        if(options && options.md5Cache){
            return true;
        }
        return false;
    },
    isEditor(){
        return isEditor();
    },
    getOptions() {
        if (!BUILD_OPTIONS) {
            if (fsextra.pathExistsSync(file_build_options)) {
                let content = fs.readFileSync(file_build_options, "utf8");
                BUILD_OPTIONS = JSON.parse(content);
            }
        }
        return BUILD_OPTIONS;
    },
    setOptions(options) {
        if (!fsextra.pathExistsSync(path_build)) {
            this.mkdirs(path_build);
        }
        let build_options_string = JSON.stringify(options, null, 4);
        build_options_string = this.replaceAll(build_options_string);
        BUILD_OPTIONS = JSON.parse(build_options_string);
        fsextra.writeFileSync(file_build_options, build_options_string);
    },
    isNative(){
        return !this.isWebMobile();
    },
    isWebMobile(){
        let options = this.getOptions();
        return !options || options.actualPlatform === 'web-mobile';
    },
    getSetting() {
        let options = utils.getOptions();
        let project_name = "";
        let is_main_bundle = false;
        if(options){
            project_name = path.basename(options.project);
        }
        else if(isEditor()){
            project_name = path.basename(Editor.Project.path);
        }

        let strPathPrefix = "../../";
        if(project_name.indexOf("main") >= 0){
            strPathPrefix = "../../../";
            is_main_bundle = true;
        }
        if (project_name == 'project-sets') {
            strPathPrefix = "../";            
            is_main_bundle = true;
        } 
        else if (project_name == 'project-live') {
            strPathPrefix = "../";            
            is_main_bundle = true;
        } 
        else if(project_name == 'project-app') {
            strPathPrefix = "../";            
            is_main_bundle = true;
        }
        else if(project_name == 'project-lib') {
            strPathPrefix = "../";
            is_main_bundle = true;
        }else if(project_name == 'project-app-club') {
            strPathPrefix = "../";
            is_main_bundle = true;
        }else if(project_name == 'game_client') {
            strPathPrefix = "../";
            is_main_bundle = true;
        }
      

        let target_path = "build-sets";
        if(project_name.substr(-5) == '-live' || project_name.substr(0, 5)=="live-"){
            target_path = "build-live";
        }
        else if(project_name.substr(-4) == '-app' || project_name.substr(0, 4)=="app-"){
            target_path = "build-app";
        }

        if(firefs.existsSync(file_setting)){
            let content = firefs.readFileSync(file_setting, "utf8");
            let settingJson = JSON.parse(content);
            if(settingJson.curBuildTarget){
                target_path = settingJson.curBuildTarget;
            }
        }
        
        let full_path = "";
        if(this.isWebMobile()){
            full_path = `${strPathPrefix}${target_path}/web-mobile`;
        }
        else{
            full_path = `${strPathPrefix}${target_path}/build/jsb-link`;
        }
        
        let setting = {
            isMainBundle: is_main_bundle,
            isAutoCopy: true,
            strPathTarget: full_path,
            name: project_name,
            curBuildTarget: target_path,
        }

        return setting;
    },    
    getPathTarget() {
        let options = this.getOptions();
        let setting = this.getSetting();
        let strPathTarget = setting.strPathTarget;
        if (strPathTarget.startsWith(".")) {
            strPathTarget = path.join(options.project, setting.strPathTarget);
        }
        return strPathTarget;
    },

    getBundles(){
        let bundles = [];
        let options = this.getOptions();
        if(options){
            bundles = options.bundles;
        }
        return bundles;
    },
    getIsLiveOnly(){
        let options = utils.getOptions();
        let project_name = "";
        if(options){
            project_name = path.basename(options.project);
        }
        else if(isEditor()){
            project_name = path.basename(Editor.Project.path);
        }

        let is_live_only = false;
        if (project_name == 'project-sets') {
        } 
        else if (project_name.indexOf("-sets") >= 0) {
        }
        else if (project_name.indexOf("set-") >= 0) {
        } 
        else if (project_name == 'project-live') {
            is_live_only = true;
        } 
        else if (project_name.indexOf("-live") >= 0) {
            is_live_only = true;
        } 
        else if (project_name.indexOf("live-") >= 0) {
            is_live_only = true;
        }
        else if (project_name == 'project-app-club') {
            is_live_only = true;
        }  

        is_live_only = true;
        return is_live_only;
    },
    mkdirs(dirpath) {
        if (!fs.existsSync(path.dirname(dirpath))) {
            this.mkdirs(path.dirname(dirpath));
        }
        fs.mkdirSync(dirpath);
    },
    timeStart(task) {
        if (!timestamps[task]) {
            timestamps[task] = {};
        }
        else{
            this.error("任务名重复：task="+task);
        }
        timestamps[task].start = Date.now();
        debug.warn(`[${task}] start.`);
    },
    timeEnd(task) {
        let item = timestamps[task];
        if (!item) {
            debug.warn("时间戳未记录：task=" + task);
        } else {
            item.end = Date.now();
            item.duration = ((item.end - item.start) / 1000).toFixed(2);
            debug.warn(`[${task}] complete in ${item.duration} (s)`);
            delete timestamps[task];
        }
    },
    replaceAll(input){
        if(!input){
            input = "";
        }
        return input.replace(/\\/g, '/').replace(/\/\//g, '/');
    },
    //获取文件扩展名
    getExtName(file_path){
        let str = "."
        let dirs = file_path.split(str);
        return str+dirs[dirs.length-1];
    },
    _getRect(object) {
        let item = object["frame"];
        return [item.x, item.y, item.w, item.h];
    },
    _getSize(object) {
        let item = object["sourceSize"];
        return [item.w, item.h];
    },
    _getRotated(object){
        let rotated = object["rotated"];
        return rotated ? 1 : 0;
    },
    _getOffset(object){
        let item = object["spriteSourceSize"];
        let offset = [item.x, item.y];
        return offset;
    },
    _getInsets(object){
        let insets = [0, 0, 0, 0];
        return insets;
    },
    _getPlistData(item) {
        let data = {};
        
        data.rect = this._getRect(item);
        data.originalSize = this._getSize(item);
        data.rotated = this._getRotated(item);
        data.offset = this._getOffset(item);
        data.capInsets = this._getInsets(item);
        
        return data;
    },
    toCocosCreatorData(plistData){
        let result = {};
        for (let index = 0; index < plistData.length; index++) {
            const item = plistData[index];
            let data = this._getPlistData(item);
            let key = item.filename.replace('.png', '');
            //兼容多层子目录key
            key = key.replace(/\//g, '-');
            result[key] = data;
        }
        return result;
    },
    getFileMD5(file){
        let md5sum = crypto.createHash('md5');
        let fileData = fsextra.readFileSync(file);
        let str = md5sum.update(fileData).digest('hex');
        // debug.log("md5:", str,  file);
        return str.substr(0, 5);
    },
    getFntData(file){
        if(!bmfont2json){
            debug.error(bmfont2json_error);
            return JSON.stringify({});
        }

        let content = fs.readFileSync(file, 'utf8');
        let fntJson = bmfont2json(content);
        let fontDefDictionary = {};
        let chars = fntJson.chars || [];
        for (let index = 0; index < chars.length; index++) {
            const el = chars[index];
            let eitem = {};
            eitem.rect = {x:el.x, y:el.y, width:el.width, height:el.height};
            eitem.xOffset = el.xoffset;
            eitem.yOffset = el.yoffset;
            eitem.xAdvance = el.xadvance;
            fontDefDictionary[String(el.id)] = eitem;
        }
        let info = fntJson.info;
        let common = fntJson.common;
        let fntConfig = {
            width: common.scaleW,
            height: common.scaleH,
            commonHeight: common.lineHeight,
            fontSize: info.size,
            fontDefDictionary: fontDefDictionary,
            kerningDict: {},
        };
        fntConfig = JSON.stringify(fntConfig);
        return fntConfig;
    },
    appendFileMD5(filename, md5string){
        let temps = filename.split('.');
        let ext = `.${temps[temps.length-1]}`;
        let pos = filename.lastIndexOf(ext);
        let filedest = filename;
        if(pos>0){
            filedest = filename.substring(0, pos) + "." + md5string + ext;
        }
        else{
            this.error("无效的文件名: ", filename);
        }
        
        return filedest;
    },
    getProjectVersionFile(){
        let file_version = "";
        if(isEditor()){
            file_version = path.join(Editor.Project.path, "version.json");
        }
        else{
            let options = utils.getOptions();
            if(options){
                file_version = path.join(options.project, "version.json");
            }
        }
        return file_version;
    },
    getProjectVersion(){
        let file_version = this.getProjectVersionFile();
        let version = "1.0.0";
        if (fsextra.pathExistsSync(file_version)) {
            let content = fsextra.readFileSync(file_version, "utf8");
            let data = JSON.parse(content);
            
            if(data.version){
                version = data.version;
            }
        }
        else{
            this.setProjectVersion(version);
        }
        return version;
    },
    setProjectVersion(version){
        let file_version = this.getProjectVersionFile();
        let content = "";
        let data = {};
        if (fsextra.pathExistsSync(file_version)) {
            content = fsextra.readFileSync(file_version, "utf8");
            data = JSON.parse(content);
        }
        data.version = version;
        content = JSON.stringify(data, null, 4);

        this.log("版本已保存："+file_version);
        this.log("version = ", content);

        fsextra.writeFileSync(file_version, content);
    },
    updateProjectTimestamp(){
        let file_version = this.getProjectVersionFile();
        let content = "";
        let data = {};
        if (fsextra.pathExistsSync(file_version)) {
            content = fsextra.readFileSync(file_version, "utf8");
            data = JSON.parse(content);
        }
        data.timestamp = Date.now();
        content = JSON.stringify(data, null, 4);

        this.log("版本时间戳已保存："+file_version);
        this.log("content = ", content);

        fsextra.writeFileSync(file_version, content);
    },
    getSvnVersionByUrl(svn_url){
        let result = null;
        let version = 0;
        
        try {
            if(isEditor()){
                // svn_url = Editor.Project.path;
                result = child_process.execSync(`svn info ${svn_url}`).toString();
            }
            else{
                result = shelljs.exec(`svn info ${svn_url}`);
            }
            if(result){
                let array = result.split('\n');
                let content = array.find(item=>item.indexOf("Last Changed Rev:")>=0);
                if(!content){
                    content = array.find(item=>item.indexOf("最后修改的版本:")>=0);
                }
                version = content.match(/\d+/ig)[0];
            }
        } catch (error) {
            utils.error("Error getSvnVersion: ", error);
        }
        
        return version;
    },
    getSvnVersion() {
        // svn_url = "https://192.168.0.200/svn/qyqp/%E5%AE%A2%E6%88%B7%E7%AB%AF/sets/trunk";
        
        return '1.0.0';

        let svn_url = ".";
        if(isEditor()){
            svn_url = Editor.Project.path;
        }

        let version = this.getSvnVersionByUrl(svn_url);

        let setting = this.getSetting();
        if(setting.isMainBundle){
            let svn_url_fw = path.join(svn_url, "packages", "package-frameworks");
            if(fsextra.pathExistsSync(svn_url_fw)){
                let version_fw = this.getSvnVersionByUrl(svn_url_fw);
                version = Math.max(version, version_fw);
            }
        }
        
        return version + "";
    },
    setBundleLangMD5(bundle, lang, md5){
        if(!bundle_lang_md5[bundle]){
            bundle_lang_md5[bundle] = {};
        }
        bundle_lang_md5[bundle][lang] = md5;
    },
    getBundleLangMD5(bundle, lang){
        let bundle_lang = bundle_lang_md5[bundle];
        if(!bundle_lang){
            this.error(`未找到bundle. bundleName=${bundle}`);
            return null;
        }
        if(!lang){
            return bundle_lang;
        }
        
        let md5 = bundle_lang[lang];
        if(!md5){
            this.error(`未找到md5. bundleName=${bundle}, lang=${lang}`);
            return null;
        }

        return md5;
    },
    getAllBundleLangMD5(){
        return bundle_lang_md5;
    },

    log: debug.log,
    warn: debug.warn,
    error: debug.error,
}

module.exports = utils;