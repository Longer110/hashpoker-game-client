// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 游戏管理
// ]]


let GameAssets = require("GameAssets");
let AppWebApi = require("AppWebApi");
let AppBridge = require("AppBridge");
let UIFrame = require("UIFrame");
let i18n = require("i18n");

let UIDialog = require("UIDialog");
let VERSION_COMPARE_RETSULT ={
    BIG_UPGRADE:2,
    LITTLE_UPGRADE:1,
    NO_UPGRADE:0,
}


let UpdateManager = function (params) {
    this.name = "UpdateManager";
}

let proto = UpdateManager.prototype;

proto.load = function (params) {
    this._download_list = []
    this.currentDownItem = null
}
proto.destroy = function (params) {
    this._download_list = []
    this.currentDownItem = null
}

//检测主包热更
proto.checkMainVersion = function (callback) {

    if (!cc.sys.isNative || !app.config.IS_OPEN_NATIVEUPDATE) {//不是原生不需要检测更新
        if(callback){
            callback();
        }
        return
    }

    let self = this
    this.isStart = false
    let updateCallback = (updateData)=>{
        if(!updateData.isUpdate && updateData.isEnterGame){//不需要更新
            cc.log("不需要更新")
            if(self._download_list.length <= 0){
                if(callback){
                    callback();
                }
            }
            
        }else if(updateData.isUpdate && updateData.isUpdateSuccess){//更新成功

            if(self._download_list.length <= 0){
                app.audio.stopAll();
                if(jsb){
                    jsb.fileUtils.purgeCachedEntries()
                }
                cc.sys.restartVM();
                cc.game.restart();
            }
        }
    }

    this._currentPercent = 0
    this._downloadNum = 0
    app.storage.setBundleConfig(null); //获取版本信息前情况缓存版本信息

     //console.log("getWebBundleConfigByName", "main_package");
    my.bundle.requestWebBundleConfigs(app.config.PLATFORM, ()=>{
         //console.log("getWebBundleConfigByName main_package");
        let main_package = my.bundle.getWebBundleConfigByName("main_package");
        if(main_package){
             //console.log("checkMainVersion", main_package);
            let item = {
                sGamePath: main_package.sGamePath,
                sMD5FilePath: main_package.sMD5FilePath,
                sZipFilePath: main_package.sZipFilePath,
                sVersion: main_package.sVersion,
                manager: main_package.manager,
                depends: main_package.depends,
                sCallback:updateCallback,
            }
            self._addCheckVersion(item);

            if(!this.isDownloadState){
                if(this._download_list.length > 0){
                    this._checkVersion(this._download_list[0]);
                }
            }

        }else{
             //console.log("getWebBundleConfigByName main_package is null");
            if(callback){
                callback();
            }
        }
    })

},

//检测模块热更
proto.checkVersionByGameID = function (gameid,callback) {

    if (!cc.sys.isNative || !app.config.IS_OPEN_NATIVEUPDATE ) {//不是原生不需要检测更新
        let data = app.game.getGameItem(gameid);
        if(callback){
            callback(data);
        }
        return
    }

    let self = this;
    this._currentPercent = 0
    this._downloadNum = 0
    this.isStart = false
    let updateCallback = (updateData)=>{
        if(!updateData.isUpdate && updateData.isEnterGame){//不需要更新
            if(self._download_list.length <= 0){
                if(callback){
                    let data = my.bundle.getWebBundleConfig(gameid)
                    callback(data);
                }
            }
        }else if(updateData.isUpdate && updateData.isUpdateSuccess){//更新成功

            let gameData = null
            if(updateData.item){
                let bundleName = my.util.getBundleNameByGamePath(updateData.item.sGamePath, updateData.item.isLive) || "";
                if(cc.assetManager.getBundle(bundleName)){
                    self.isLoad = true
                    cc.log("cc.assetManager.getBundle = true"+bundleName)
                }
                gameData = updateData.item
            }else{
                QYLogs.error("正常应该不会进这里");
                
                gameData = app.game.getGameItem(gameid);
                let bundleName = my.util.getBundleNameByGamePath(gameData.sGamePath, gameData.isLive) || "";
                if(cc.assetManager.getBundle(bundleName)){
                    cc.log("cc.assetManager.getBundle = true"+bundleName)
                    self.isLoad = true
                }
            }

            if(cc.assetManager.getBundle(gameData.manager)){
                if(gameData.isDownloadDepends[gameData.manager]){
                    self.isLoad = true
                    cc.log("cc.assetManager.getBundle = true"+gameData.manager)
                }
            }
            for(let i=0;i<gameData.depends.length;i++){
                if(cc.assetManager.getBundle(gameData.depends[i])){
                    if(gameData.isDownloadDepends[gameData.depends[i]]){
                        self.isLoad = true
                        cc.log("cc.assetManager.getBundle = true"+gameData.depends[i])
                    }
                }
            }

            if(self._download_list.length <= 0){
                if(self.isLoad){
                    app.audio.stopAll();
                    if(jsb){
                        jsb.fileUtils.purgeCachedEntries()
                    }
                    cc.sys.restartVM();
                    cc.game.restart();
                }else{
                    if(callback){
                        let data = my.bundle.getWebBundleConfig(gameid)
                        callback(data);
                    }
                }
            }

        }
    }

    this.isLoad = false
     //console.log("getWebBundleConfigByName1", gameid);
    my.bundle.requestWebBundleConfigs(app.config.PLATFORM, ()=>{
         //console.log("getWebBundleConfig1", gameid);
        let data = my.bundle.getWebBundleConfig(gameid)
        if(data){
             //console.log("checkVersionByGameID", data);
            let managerData = my.bundle.getWebBundleConfigByName(data.manager)
            if(managerData){
                item = {
                    sGamePath: managerData.sGamePath,
                    sMD5FilePath: managerData.sMD5FilePath,
                    sZipFilePath: managerData.sZipFilePath,
                    sVersion: managerData.sVersion,
                    manager: managerData.manager,
                    depends: managerData.depends,
                    sCallback:updateCallback,
                   
                }
                self._addCheckVersion(item);
            }
            if(data.depends){
                for(let i=0;i<data.depends.length;i++){
                    let dependData = my.bundle.getWebBundleConfigByName(data.depends[i])
                    if(dependData){
                        item = {
                            sGamePath: dependData.sGamePath,
                            sMD5FilePath: dependData.sMD5FilePath,
                            sZipFilePath: dependData.sZipFilePath,
                            sVersion: dependData.sVersion,
                            manager: dependData.manager,
                            depends: dependData.depends,
                            sCallback:updateCallback,
                           
                        }
                        self._addCheckVersion(item);
                    }
                }
            }

            let item = {
                sGamePath: data.sGamePath,
                sMD5FilePath: data.sMD5FilePath,
                sZipFilePath: data.sZipFilePath,
                sVersion: data.sVersion,
                manager: data.manager,
                depends: data.depends,
                sCallback:updateCallback,
            }
            self._addCheckVersion(item);

            if(!this.isDownloadState){
                if(this._download_list.length > 0){
                    this._checkVersion(this._download_list[0]);
                }
            }

        }else{
             //console.log("getWebBundleConfig2", gameid);
            data = app.game.getGameItem(gameid);
            if(callback){
                callback(data);
            }
        }
    })
    
},


proto.clearCheckVersion = function () {
    this._download_list = [];
    this._currentPercent = 0
    this._downloadNum = 0
    this.isStart = false
    this.isDownloadState = false;
},


proto._addCheckVersion = function (data) {
    this._download_list.push(data);
    let filePath =  data.sGamePath+"_project.data";
    if(jsb.fileUtils.isFileExist(filePath)){
        let manifest = new jsb.Manifest();
        manifest.parseFile(filePath)
        if (manifest.isLoaded()){
            let versions = data.sVersion.split(".")
            let currentVersions = manifest.getVersion().split(".")
            let isUpdate = false;
            for(let i=0;i<4;i++){
                if(parseInt(currentVersions[i]) < (versions[i])){
                    isUpdate = true
                }
            }
            if(isUpdate){
                this._downloadNum = this._downloadNum + 1
            }
        }
        cc.log("filePath  _downloadNum=",filePath,this._downloadNum)
    }else{
        this._downloadNum = this._downloadNum + 1
        cc.log("filePath is not _downloadNum=",filePath,this._downloadNum)
    }
    cc.log("_download_list=",this._download_list)
},

proto._removeCheckVersion = function (data) {

    if(this._download_list.length > 0){
        for(let i=(this._download_list.length-1);i>=0;i--){
            let item = this._download_list[i]
            if(item.sGamePath == data.sGamePath){
                this._download_list.splice(i,1)
                cc.log("_removeCheckVersion=",data.sGamePath)
            }
        }
    }

    cc.log("_download_list=",this._download_list)
},

proto._checkDownloadVaild = function (data) {

    if(this._download_list.length > 0){
        for(let i=0;i<this._download_list.length;i++){
            let item = this._download_list[i]
            if(item.sGamePath == data.sGamePath){
                cc.log("_checkDownloadVaild= true")
                return true
            }
        }
    }
    cc.log("_checkDownloadVaild= false")
    return false;
},

proto._resetDownload = function (item) {
    this.isDownloadState = false;
    this.currentDownItem = null
    this._removeCheckVersion(item);
    if(!this.isDownloadState){
        if(this._download_list.length > 0){
            this._checkVersion(this._download_list[0]);
        }
    }
},

proto._checkVersion = function(item){

    var isBigVersion = false;
    if (!cc.sys.isNative || !CC_BUILD) {//不是原生不需要检测更新

        if(this._checkDownloadVaild(item) && item.sCallback){
            this._resetDownload(item);
            item.sCallback({isUpdate:false,isEnterGame:true});
        }
        return
    }

    if(!app.config.IS_OPEN_NATIVEUPDATE){
        cc.log("不支持热更新，不需要更新")
        
        if(this._checkDownloadVaild(item) && item.sCallback){
            this._resetDownload(item);
            item.sCallback({isUpdate:false,isEnterGame:true});
        }
        return
    }
    
    let self = this;
    self.isDownloadState = true;

    self.checkUpdate(item);

},



proto.checkUpdate = function(item){

    let self = this;
    QYLogs.log(self.name, "sMD5FilePath = " + item.sMD5FilePath+"item.sZipFilePath="+item.sZipFilePath);
    if(item.sMD5FilePath == "" || item.sMD5FilePath.indexOf(".data") < 0){

        if(self._checkDownloadVaild(item) && item.sCallback){
            self._resetDownload(item);
            item.sCallback({isUpdate:false,isEnterGame:true});
        }
        return
    }
    if(item.sZipFilePath == ""){

        if(self._checkDownloadVaild(item) && item.sCallback){
            self._resetDownload(item);
            item.sCallback({isUpdate:false,isEnterGame:true});
        }
        
        return
    }

    if(self.currentDownItem && self._checkDownloadVaild(self.currentDownItem)){
        if(!self.isStart){
            self.isStart = true
            my.target.emit(my.event.LOAD_DOWNLOAD_SHOW, {
                percent: 0,
            })
        }
        return
    }
    
    
    let AssetsMgr = app.application.getComponent(GameAssets)
    if(!AssetsMgr){
        AssetsMgr = app.application.addComponent(GameAssets);
    }
    let http = this.getUpgradeConfigFrom();
    let object = {}
    let currentPercent = 0
    object.updatePercent = function(percent,info){
        percent = percent/self._downloadNum
        if(percent){
            if(currentPercent < percent){
                currentPercent = percent
                self._currentPercent = (1 - (self._download_list.length/self._downloadNum)) + currentPercent
                cc.log("updatePercent=",self._currentPercent)
                my.target.emit(my.event.LOAD_DOWNLOAD_PERCENT, {
                    percent: self._currentPercent,
                })
                if(self._checkDownloadVaild(item) && item.sCallback){
                    item.sCallback({isUpdate:true,isPercent:true,percent:self._currentPercent,info:info});
                }
            }
        }
    }.bind(this)
    object.showUpdateSuccess = function(){
        cc.log("showUpdateSuccess")

        item.isDownloadDepends = AssetsMgr.isDownloaddependModes()
        if(self._checkDownloadVaild(item) && item.sCallback){

            self._resetDownload(item);
            item.sCallback({isUpdate:true,isUpdateSuccess:true,item:item});
        }

        if(self._download_list.length <= 0){
            self.isStart = false
            my.target.emit(my.event.LOAD_DOWNLOAD_HIDE, {
            })
        }

    }.bind(this)
    object.showUpdateTips = function(downloadInfo){
        AssetsMgr.hotUpdate()

        if(!self.isStart){
            self.isStart = true
            my.target.emit(my.event.LOAD_DOWNLOAD_SHOW, {
                percent: 0,
            })
        }

        self.currentDownItem = item
        
        if(self._checkDownloadVaild(item) && item.sCallback){
            item.sCallback({isUpdate:true,isStartUpdate:true});
        }
        cc.log("showUpdateTips")
    }.bind(this)
    object.showUpdateFailed = function(){
        cc.log("版本更新失败")
       

        if(self._checkDownloadVaild(item) && item.sCallback){
            item.sCallback({isUpdate:true,isUpdateFailed:true,item:item});
        }

        if(self._download_list.length <= 0){
            self.isStart = false
            my.target.emit(my.event.LOAD_DOWNLOAD_HIDE, {
            })
        }

        self.showDialog(i18n.t("COMMON.WEI_HU_TI_REN.3"));
    }.bind(this)
    object.enterGameLogin = function(){
        cc.log("enterGameLogin")
        //self._downloadNum = self._downloadNum - 1
        if(self._checkDownloadVaild(item) && item.sCallback){
            self._resetDownload(item);
            item.sCallback({isUpdate:false,isEnterGame:true,item:item});
        }
        if(self._download_list.length <= 0){
            self.isStart = false
            my.target.emit(my.event.LOAD_DOWNLOAD_HIDE, {
            })
        }

    }.bind(this)
    

    //依赖模块（不属于子游戏，是公共模块）
    let dependModes = []
    if(item.manager && item.manager != ""){
        dependModes.push(item.manager)
    }
    if(item.depends){
        for(let i=0;i<item.depends.length;i++){
            dependModes.push(item.depends[i])
        }
    }

    AssetsMgr.setMaifestUrl(http, item.sMD5FilePath, item.sZipFilePath, item.sGamePath);
    AssetsMgr.initAssets(object,dependModes)
    let localVersion = AssetsMgr.getLocalManifestVersion();
    if (!localVersion || localVersion == "") {
        localVersion = "0.0.0.0";
    }
    QYLogs.log(self.name, "localVersion = " + localVersion);
    QYLogs.log(self.name, "sVersion = " + item.sVersion);

    let result = AssetsMgr.compareVersion(localVersion, item.sVersion)
    if (VERSION_COMPARE_RETSULT.BIG_UPGRADE == result) {
        if(AssetsMgr){
            AssetsMgr.checkUpdate()
        }
    } else if (VERSION_COMPARE_RETSULT.NO_UPGRADE == result){
        
        if(object){
            object.enterGameLogin()
        }
    } else{
        if(AssetsMgr){
            AssetsMgr.checkUpdate()
        }
    }
}





proto.getModeVersion = function(data,callback){
     //console.log("getModeVersionaaaa", data);
    AppWebApi.getModeVersion(data,callback);
},

proto.getUpgradeConfigFrom = function(){
    return app.config.UPDATE_URL
    // let UpgradeConfig = require("config_upgrade");
    // let NetConfig = app.config.ISDEVELOP ? UpgradeConfig.DEVELOP : UpgradeConfig.RELEASE;
    // return NetConfig;
}



proto.showDialog = function(text){

    cc.warn("[ERROR] ", text);
    let self = this;
    let path = "popup/dialog/UIDialog";
    let gameWrapper = app.game.getGame()
    let wrapper = app.common;
    if(gameWrapper){
        wrapper = gameWrapper
    }
    let bundleName = wrapper?wrapper.bundleName:my.wrapper.COMMON;
    wrapper.ui.loadPopup(path, function (component) {
        cc.log("showDialog loadPopup =",component)
        app.node.addChild(component.node, 1024);
        component.setShowType(UIDialog.EShowType.OK);
        component.show(text, function (isOK) {
            cc.log("showDialog is ok=",isOK)
            if (isOK) {
                self.isDownloadState = false;
                if(self._download_list.length > 0){
                    self._checkVersion(self._download_list[0]);
                }
            }
        });
        component.node.position = cc.Vec2.ZERO;
    }.bind(this)            
    , {
        loader: bundleName
    });

}


proto.showBlockText = function(strText,callback){
    this.hideBlockText();
    let dotAnimation = true;
    let timeout = 60*10; //10分钟
    this._blockIndex = UIFrame.showBlockText(strText, dotAnimation, callback, timeout);
    UIFrame.setLoadingCancelCallback(this._blockIndex,callback);
},
proto.hideBlockText = function(){
    if(this._blockIndex>0){
        UIFrame.hideBlockText(this._blockIndex);
        this._blockIndex = 0;
    }
},

UpdateManager.default = new UpdateManager(null);
module.exports = UpdateManager;