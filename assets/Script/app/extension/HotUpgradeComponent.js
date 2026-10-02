

let MsgManager = require("MsgManager");
let my = require("my");
let TAG = "HotUpgradeScene"

let SceneCommon = require("SceneCommon");


cc.Class({
    extends: SceneCommon,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("onLoad")
        this._super();

        if(!this.AssetsMgr){
            let AssetsMgrCom = require("AssetsMgr");
            this.AssetsMgr = this.node.addComponent(AssetsMgrCom);
        }
        
        my.net.on(my.NetworkEvent.OPEN, this._onWebsocketOpen, this);
        let Msg_upgrade = require("Msg_upgrade");
        my.net.on(my.NetworkEvent.OPEN, this._onWebsocketOpen, this);

        MsgManager.on(Msg_upgrade.UPDATE_VERSION, this._versionInfo, this);
        this.connect();
    },

    onDestroy() {
        cc.log("onDestroy")
        my.net.targetOff(this);
        MsgManager.un(this._versionInfo,this);
    },

    _versionInfo(data){

        if (!cc.sys.isNative) {
            return;
        }
        let UpgradeConfig = require("config_upgrade");
        if(data.nResult === 0){
            QYLogs.log(TAG, "data.nResult=" + data.nResult,"data.tVersionInfo.sConfigUrl=" + data.tVersionInfo.sConfigUrl,"data.tVersionInfo.sDownloadurl=" + data.tVersionInfo.sDownloadurl);
            QYLogs.log(TAG, "data.tVersionInfo.sVersion=" + data.tVersionInfo.sVersion)
            let NetConfig = this._getUpgradeConfigFrom();
            let http = NetConfig.WEB;
            if(!this.AssetsMgr){
                let AssetsMgrCom = require("AssetsMgr");
                this.AssetsMgr = this.node.addComponent(AssetsMgrCom);
            }
            this.AssetsMgr.setMaifestUrl(http, data.tVersionInfo.sConfigUrl, data.tVersionInfo.sDownloadurl, "pilotgame");
            this.AssetsMgr.initAssets(this)
            let localVersion = this.AssetsMgr.getLocalManifestVersion();
            if (!localVersion || localVersion == "") {
                localVersion = app.config.VERSION;
            }
            QYLogs.log(TAG, "localVersion = " + localVersion);
            QYLogs.log(TAG, "sVersion = " + data.tVersionInfo.sVersion);
            this._newVersion = data.tVersionInfo.sVersion
            let result = this.AssetsMgr.compareVersion(localVersion, data.tVersionInfo.sVersion)
            if (UpgradeConfig.VERSION_COMPARE_RETSULT.BIG_UPGRADE == result) {
                if(this.AssetsMgr){
                    this.AssetsMgr.checkUpdate()
                }
            } else if (UpgradeConfig.VERSION_COMPARE_RETSULT.NO_UPGRADE == result){
                this.enterGameLogin();
            } else{
                if(this.AssetsMgr){
                    this.AssetsMgr.checkUpdate()
                }
            }
        }else{
            this.enterGameLogin();
        }
    },

    _onWebsocketOpen(data){

        if(app.net){
            let CMD = require("protocol_upgrade");
            let data = {
                sPlatform:app.config.PLATFORM, 
                sChannel:app.config.CHANNEL,
            };
            app.net.send(CMD.MDM_GP_UPGRADE.value, CMD.MDM_GP_UPGRADE.SUB_REQ_VersionInfoReq_CMD, data);
            QYLogs.log(TAG,"发送热更新协议")
        }
    },

    connect(){
        let ServerNet = app.server.get("net");
        QYLogs.log("服务器信息",app,app.server,ServerNet)
        let server = null;
        let develop = app.config.ISDEVELOP;
        let connected = false;
        if(develop){
            server = app.storage.getDEVServer();
            if(!ServerNet.checkValid(server)){
                server = ServerNet.getDevDefaultItem("飞行棋版署内测");
                app.storage.setDEVServer(server);
            }
        }
        else{
            connected = app.net.isConnect();
            if(connected){
                server = ServerNet.getServer();
            }
            else{
                server = ServerNet.getDefaultItem(develop);
            }
        }

        if (!app.net.isConnect()) {
            app.net.connect(server);
        }else{
            let CMD = require("protocol_upgrade");
            let data = {
                sPlatform:app.config.PLATFORM, 
                sChannel:app.config.CHANNEL,
            };
            app.net.send(CMD.MDM_GP_UPGRADE.value, CMD.MDM_GP_UPGRADE.SUB_REQ_VersionInfoReq_CMD, data);
            QYLogs.log(TAG,"发送热更新协议")
        }

    },

    _getUpgradeConfigFrom(){
        let UpgradeConfig = require("config_upgrade");
        let NetConfig = app.config.ISDEVELOP ? UpgradeConfig.DEVELOP : UpgradeConfig.RELEASE;
        return NetConfig;
    },
    //更新进度
    updatePercent(percent,info){
        if(!percent){
            percent = 0;
        }
    },

    //更新确定
    showUpdateTips(downloadInfo){
        //需要更新
        // let localVersion = this.AssetsMgr.getLocalManifestVersion();
        // if (!localVersion || localVersion == "") {
        //     localVersion = app.config.VERSION;
        // }
        //确定更新
        if(this.AssetsMgr){
            this.AssetsMgr.hotUpdate()
        }
    },

    showUpdateFailed(){
        QYLogs.log(TAG,"检测更新失败")
    },
    showUpdateSuccess(){
        QYLogs.log(TAG,"更新成功")
        app.audio.stopAll();
        if(jsb){
            jsb.fileUtils.purgeCachedEntries()
        }
        cc.sys.restartVM();
        cc.game.restart();
    },

    enterGameLogin(){
        QYLogs.log(TAG, "跳转大厅")
    },

});
