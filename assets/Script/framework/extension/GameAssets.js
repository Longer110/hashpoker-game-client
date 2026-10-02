let TAG = "GameAssets"

let VERSION_COMPARE_RETSULT ={
    BIG_UPGRADE:2,
    LITTLE_UPGRADE:1,
    NO_UPGRADE:0,
}

let MD5 = require("md5");

cc.Class({
    extends: cc.Component,

    properties: {
        _manifestUrl: "project.data",
        _updateDirRes: "chessSetVersion",
        _manifestIndex:"",
        _storagePath: '',
        _failCount:0,
        _localManifestUrl:"",
        _romotePackageUrl:"",
        _updateComponent:null,
        _download_list:[],
        _dependModes:[],
        
    },

   


    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        QYLogs.log(TAG,'updateCb Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // failed = true;
                QYLogs.log("配置文件不存在，使用默认配置")
                this.loadCustomManifest()
                this.checkUpdate()
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION://进度
                let downBytes = event.getDownloadedBytes()/1024
                let allBytes = event.getTotalBytes()/1024
                if(!allBytes){
                    break;
                }
                let downloadInfo = ""
                if(allBytes >= 1024){
                    downloadInfo = (downBytes/1024).toFixed(2)+"M/"+(allBytes/1024).toFixed(2)+"M"
                }else{
                    downloadInfo = downBytes.toFixed(2)+"K/"+allBytes.toFixed(2)+"K"
                }
                if(this._updateComponent && this._updateComponent.updatePercent){
                    this._updateComponent.updatePercent(event.getPercent(),downloadInfo)
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST://读取配置失败
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                QYLogs.log("读取或者下**载**配置失败")
                failed = true;
                var msg = event.getMessage();
                if (msg) {
                    QYLogs.log(TAG,event.getPercent()/100 + '% : ' + msg + "id="+event.getAssetId());
                }

                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                QYLogs.log("不**需**要**更**新")
                if(this._updateComponent && this._updateComponent.enterGameLogin){
                    this._updateComponent.enterGameLogin()
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED: //更新完成
                QYLogs.log("更**新**完**成")
                this._am.setEventCallback(null);
                if (this._updateComponent && this._updateComponent.showUpdateSuccess) {
                    this.addSearchPath();
                    this._updateComponent.showUpdateSuccess()
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:   //更*新*失*败
            case jsb.EventAssetsManager.ERROR_UPDATING: //更*新*错*误
               
                QYLogs.log(TAG,"event.getAssetId()="+event.getAssetId()+"event.getMessage()"+event.getMessage())
               
                this._failCount +=1
                if(this._failCount <= 10){
                    if (this._am) {
                        this._am.downloadFailedAssets()
                    }
                }else{
                    QYLogs.log("更**新**失**败")
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS://解压错误
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND://有新资源文件
                
                let allBytess = event.getTotalBytes()/1024
                let downloadInfos = ""
                if(allBytess >= 1024){
                    downloadInfos = (allBytess/1024).toFixed(2)+"M"
                }else{
                    downloadInfos = allBytess.toFixed(2)+"K"
                }
                QYLogs.log("发*现*新*版*本",downloadInfos)
                if(this._updateComponent && this._updateComponent.showUpdateTips){
                    this._updateComponent.showUpdateTips(downloadInfos)
                }
                //this.hotUpdate()
                break;
            default:
                break;
        }
        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
            if(this._updateComponent && this._updateComponent.showUpdateFailed){
                this._updateComponent.showUpdateFailed()
            }
        }
        
    },
    addSearchPath: function () {
        var searchPaths = jsb.fileUtils.getSearchPaths();
        QYLogs.object(TAG, "addSearchPath=", searchPaths);
    },
    hotUpdate: function () {
        QYLogs.log(TAG,"hotUpdate");
        if (this._am) {
            this._failCount = 0;
            this._am.update();
        }
    },

    checkUpdate(){
        if (!cc.sys.isNative) {
            return;
        }

        if (this._am) {
            this._am.checkUpdate();
        }
    },

    show: function () {
    },
    onLoad: function () {
    },
    
    initAssets(updateComponent,dependModes){
        if (!cc.sys.isNative) {
            return;
        }
        QYLogs.log(TAG, "Enter initAssets")
        this._updateComponent = updateComponent
        this._dependModes = dependModes
        var searchPaths = jsb.fileUtils.getSearchPaths();
         //console.log(searchPaths);
        // this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this._updateDirRes);
        this._storagePath = qygameengine.GameEngine.getNewVersionSavePath();
        QYLogs.log(TAG,'Storage path for remote asset : ' + this._storagePath);
        this._am = new jsb.AssetsManager(this._manifestUrl, this._storagePath,this._manifestIndex);
        if(this._am){
            QYLogs.log(TAG,"init AssetsManager")
            this._am.setEventCallback(this.updateCb.bind(this));
            this._am.setLocalManifestUrl(this._localManifestUrl);
            this._am.setRomotePackageUrl(this._romotePackageUrl);
        }
        this._am.setMaxConcurrentTask(5);
        let self = this
        self._download_list = []

        // this._am.setVerifyCallback(function (path, asset) {
        //     // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
        //     var compressed = asset.compressed;
        //     // Retrieve the correct md5 value.
        //     var expectedMD5 = asset.md5;
        //     // asset.path is relative path and path is absolute.
        //     var relativePath = asset.path;
        //     // The size of asset file, but this value could be absent.
        //     var size = asset.size;
        //     let filePath = self._storagePath+"/"+relativePath
        //     if(jsb.fileUtils.isFileExist(filePath)){
        //         let data = jsb.fileUtils.getDataFromFile(filePath)
        //         let md5 = MD5.update(data?data:"").hex();
        //         if(expectedMD5 != md5){
        //             self._download_list.push(relativePath)
        //         }
        //         cc.log("md5 ="+md5+"asset.md5="+asset.md5+"asset.path="+asset.path)
        //     }else{
        //         self._download_list.push(relativePath)
        //     }
            
        //     return true
        // });
        
        
    },
    compareVersion(localVersion,serverVersion){
        let versions = localVersion.split(".")
        let currentVersions = serverVersion.split(".")

        if(parseInt(currentVersions[0]) < parseInt(versions[0]) || parseInt(currentVersions[1]) < parseInt(versions[1])){
            QYLogs.log(TAG, "当前是最**#新***#版本，不需要*更**新")
            return VERSION_COMPARE_RETSULT.NO_UPGRADE;
        }
        if(parseInt(currentVersions[2]) < parseInt(versions[2])){
            QYLogs.log(TAG, "当前是最**新**版**本，不需**要**更**新")
            return VERSION_COMPARE_RETSULT.NO_UPGRADE;
        }
        
        if (parseInt(currentVersions[0]) > parseInt(versions[0]) || parseInt(currentVersions[1]) > parseInt(versions[1])) {
            //大版本更新
            QYLogs.log(TAG, "大**版**本**需**要**更**新")
            return VERSION_COMPARE_RETSULT.BIG_UPGRADE;
        } else if (parseInt(currentVersions[2]) > parseInt(versions[2])) {
            //小版本更新
            
            QYLogs.log(TAG, "需**要**更***新**2")
            return VERSION_COMPARE_RETSULT.LITTLE_UPGRADE;
        } else if (parseInt(currentVersions[3]) > parseInt(versions[3])) {
            //小版本更新
            QYLogs.log(TAG, "需**要**更**新**3")
            return VERSION_COMPARE_RETSULT.LITTLE_UPGRADE;
        } else {
            //不需要更新
            QYLogs.log(TAG, "当前是**最**新**版**本，不***需**要**更***新")
            return VERSION_COMPARE_RETSULT.NO_UPGRADE;
        }
    },
    setMaifestUrl(httpDomain, configUrl,downloadUrl,manifestName){
        let dataUrl = httpDomain + configUrl;
        let resUrl = httpDomain + downloadUrl.replace(".zip", "/");
        this.setLocalManifestUrl(dataUrl);
        this.setRomotePackageUrl(resUrl);
        this.setManifestIndex(manifestName);
        this.setCurrentManifestName(manifestName+"_project.data");
    },
    
    //本地配置名称
    setCurrentManifestName(name){
        this._manifestUrl = name
    },
    //本地缓存路径
    setUpdateDirResName(name){
        this._updateDirRes = name
    },

    //线上热更配置网址（配置文件）
    setLocalManifestUrl(name){
        this._localManifestUrl = name
    },

    //线上热更资源网址（主目录）
    setRomotePackageUrl(name){
        this._romotePackageUrl = name
    },

    setManifestIndex(index){
        this._manifestIndex = index
    },

    getLocalManifestVersion(){
        if(this._am){
            return this._am.getLocalManifest() ? this._am.getLocalManifest().getVersion():"0.0.0.0"
        }else{
            return "0.0.0.0"
        }
        
    },

    loadCustomManifest() {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(JSON.stringify({
                "version" : "1.0.0.0",
                "channel" : "default",
                "platform" : "default",
                "engineVersion" : "cocoscreator v2.4.3",
                "assets" : {
                },    
                "searchPaths" : [    
                ]
            }), this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
        }
    },



    isDownloaddependModes(){
        
        let modes= {}
        for(let j=0;j<this._dependModes.length;j++){
            modes[this._dependModes[j]] = false;
        }
        
        for(let i=0;i<this._download_list.length;i++){
            let fileName = this._download_list[i]
            if(this._dependModes instanceof Array){
                for(let j=0;j<this._dependModes.length;j++){
                    let index = fileName.indexOf(this._dependModes[j]);
                    if(index >= 0){
                        cc.log("fileName="+fileName+"this._dependModes="+this._dependModes[j])
                        modes[this._dependModes[j]] = true;
                    }
                }
            }
        }
        return modes
    },

    

    onDestroy: function () {
        QYLogs.log(TAG, "onDestroy")
        if (this._am) {
            this._am.setEventCallback(null);
        }
        
    }
});
