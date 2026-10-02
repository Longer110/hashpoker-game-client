// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// let Utils = require("Utils")
// let CMD = require("protocol_upgrade");
// require("request_upgrade");
// require("response_upgrade");
// let MSG_FRAMEWORKS = require("Msg");
// let Msg_upgrade = require("Msg_upgrade");
// let MsgManager = require("MsgManager");
// let ConfigFrameWorks = require("config_frameworks");
// let ConfigGame = require("ConfigGame");
// let UpgradeConfig = require("config_upgrade");
let SceneBase = require("SceneBase");
// let UIFrame = require("UIFrame");
// let LocalStorage = require("LocalStorage");
let UIDialog = require("UIDialog");
// let i18n = require("i18n");
// let TAG = "HotUpgrade"

cc.Class({
    extends: SceneBase,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        panelContent: cc.Node,
        spriteProgress: cc.Sprite,
        labelPercent: cc.Label,
        itemThumb: cc.Node,
        uiDialog: UIDialog,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("onLoad")
        this._super();

        // Utils.getNodes(this.node)
        // MsgManager.on(MSG_FRAMEWORKS.WEBSOCKET.OPEN, this._onWebsocketOpen, this);
        // MsgManager.on(Msg_upgrade.UPDATE_VERSION, this._versionInfo, this);
        // MsgManager.on(Msg_upgrade.UPDATE_MAINTENANCENOTIFY, this._maintenancenotify, this);
        
    },

    onDestroy() {
        cc.log("onDestroy")
        this._super();
        
        // MsgManager.un(this._onWebsocketOpen);
        // MsgManager.un(this._versionInfo);
    },

    _maintenancenotify(data){
        cc.log("_maintenancenotify",data)
        //由NotifyController统一处理
    },
    _versionInfo(data){
        // QYLogs.object(TAG,"_versionInfo",data)
        app.net.disConnect(true);
        if (!cc.sys.isNative) {
            return;
        }

        if(data.nResult === 0){
            let NetConfig = this._getUpgradeConfigFrom();
            let http = NetConfig.WEB;
            // let dataUrl = http + data.tVersionInfo.sConfigUrl
            // let resUrl = http + data.tVersionInfo.sDownloadurl.replace(".zip","/")
            // QYLogs.log(TAG,dataUrl,resUrl)
            this.AssetsMgr = this.node.getComponent("AssetsMgr")
            // this.AssetsMgr.setLocalManifestUrl("http://192.168.0.38:8085/project.data");
            // this.AssetsMgr.setRomotePackageUrl("http://192.168.0.38:8085/");

            this.AssetsMgr.setMaifestUrl(http, data.tVersionInfo.sConfigUrl, data.tVersionInfo.sDownloadurl, "gameHall");
            // this.AssetsMgr.setLocalManifestUrl(dataUrl);
            // this.AssetsMgr.setRomotePackageUrl(resUrl);

            // this.AssetsMgr.setManifestIndex("gameHall");
            // this.AssetsMgr.setCurrentManifestName("gameHall_project.data");
            this.AssetsMgr.initAssets(this)
            let localVersion = this.AssetsMgr.getLocalManifestVersion();
            if (!localVersion || localVersion == "") {
                localVersion = ConfigGame.VERSION;
            }


            QYLogs.log(TAG, "localVersion = " + localVersion);
            QYLogs.log(TAG, "sVersion = " + data.tVersionInfo.sVersion);

            let result = this.AssetsMgr.compareVersion(localVersion, data.tVersionInfo.sVersion)
            if (UpgradeConfig.VERSION_COMPARE_RETSULT.BIG_UPGRADE == result) {
                this.showUpdateTips();
            } else if (UpgradeConfig.VERSION_COMPARE_RETSULT.NO_UPGRADE == result){
                this.enterGameLogin();
            } else{
                this.showUpdateTips();
            }
            
            // let versions = localVersion.split(".")
            // let currentVersions = data.tVersionInfo.sVersion.split(".")
            // if(currentVersions[0] > versions[0] || currentVersions[1] > versions[1] )
            // {
            //     //大版本更新
            //     QYLogs.log(TAG,"大版本需要更新")
            //     this.showUpdateTips()
            // }else if(currentVersions[2] > versions[2]){
            //     //小版本更新
            //     this.showUpdateTips()
            //     QYLogs.log(TAG,"需要更新2")
            // }else if(currentVersions[3] > versions[3]){
            //     //小版本更新
            //     this.showUpdateTips()
            //     QYLogs.log(TAG,"需要更新3")
            // }else{
            //     //不需要更新
            //     QYLogs.log(TAG,"当前是最新版本，不需要更新")
            // }
        }
    },
    _onWebsocketOpen(data){
        if(app.net){
            let data = {
                sPlatform: ConfigGame.PLATFORM, 
                sChannel: ConfigGame.CHANNEL,
            };
            app.net.send(CMD.MDM_GP_UPGRADE.value, CMD.MDM_GP_UPGRADE.SUB_REQ_VersionInfoReq_CMD, data);
            QYLogs.log(TAG,"发送热更新协议")
        }
    },

    start () {
        cc.log("start")
        return;

        this._readConfigFile();

        if (cc.sys.isNative) {
            this.panelContent.active = true;
            this.showUpdateUI()
        }else{
            this.panelContent.active = false;
            
            //不是 CC_BUILD 版本时不检测版本更新
            // if(!CC_BUILD){
                this.enterGameLogin();
                return;
            // }

            // // Utils.loadVersion(function (error, responseText) {
            // //     if(error){
            // //         //获取远程版本出错
            // //         QYLogs.error("HotUpgrade", "获取远程版本出错", error);
            // //     }
            // //     else{
            //         let v_clients = ConfigGame.VERSION.split('.');
            //         // let ver_server = Number(responseText) || 0;
            //         let ver_server = window.APP_BUILD_VERSION || 0;
            //         let ver_client = v_clients[v_clients.length-1];
            //         if(ver_server>ver_client || ver_server==0){
            //             //服务器版本更高时刷新
            //             QYLogs.error("HotUpgrade", "本地版本过低：["+ ver_client + "] < [" + ver_server + "]");
            //             let ver_strings = LocalStorage.getClientVersion();
            //             let alert = false;
            //             let url = window.location.href;
            //             let count = 0;
            //             let step1 = 2;
            //             let step2 = 3;
            //             let step3 = 5;
            //             if(ver_strings){
            //                 let ver_s = ver_strings.split('#');
            //                 if(ver_s.length==2){
            //                     let version = ver_s[0];
            //                     count = Number(ver_s[1]);
            //                     count = count + 1;
            //                     version = ver_client;
            //                     if(count>step3){
            //                         count = 0;
            //                         alert = true; 
            //                     }
            //                     else if(count>step2){
            //                     }
            //                     else if(count>step1){
            //                         let _noCacheRex = /\?/;
            //                         let prefix = '&';
            //                         let key = '_vt_';
            //                         let value = ver_server + '_' + Date.now();
            //                         let name = key;
                                    
            //                         var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
            //                         var r = window.location.search.substr(1).match(reg); 
            //                         if (r != null){
            //                             let querystring = unescape(r[2]);
            //                             url = url.replace(querystring, value);
            //                         }
            //                         else{
            //                             if (_noCacheRex.test(url)){
            //                                 prefix = '&';
            //                             }
            //                             else{
            //                                 prefix = '?';
            //                             }
            //                             url += prefix + key + '=' + value;   
            //                         }
            //                     }
            //                     ver_s[0] = version;
            //                     ver_s[1] = count;
            //                     LocalStorage.setClientVersion(ver_s.join('#'));
            //                 }
            //             }
            //             if(alert){
            //                 let msg = i18n.t("COMMON.YOU_XI_BAN_BEN_GUO_DI");
            //                 // // if(window && window.alert){
            //                 // //     window.alert(msg);
            //                 // // }
            //                 // let showType = UIDialog.EShowType.OK;
            //                 // let component = this.uiDialog;
            //                 // component.setShowType(showType);
            //                 // component.show(msg, function (isOK) {
            //                 //     window.location.reload(true);
            //                 // }.bind(this));
            //                 // component.node.active = true;
            //                 this.showDialog(msg, function (isOK) {
            //                     window.location.reload(true);
            //                 }.bind(this));
            //                 return;
            //             }
                        
            //             if(count>step2){
            //                 window.location.reload(true);
            //             }
            //             else if(count>step1){
            //                 window.location.href = url;
            //             }
            //             else{
            //                 window.location.reload(true);
            //             }
                        
            //             return;
            //         }
            //         else if(ver_server==ver_client){
            //             let ver_s = [ver_server, 0];
            //             LocalStorage.setClientVersion(ver_s.join('#'));
            //         }
            //     // }
            //     this.enterGameLogin();
            // // }.bind(this));
        }
       
       // this.dt = 0
    },

    // update(dt){
    //     this.dt += dt
    //     this.updatePercent(this.dt)
    // },

    _connect(){
        // if (!app.net.isConnect()) {
        //     let server = app.server.get("net").SERVER;
        //     app.net.connect("", "192.168.0.221", 40704);
        // }
        cc.log("_connect")

        // let NetConfig = this._getUpgradeConfigFrom();
        // let ws = UpgradeConfig.WS;
        // let port = ConfigFrameWorks.QYSOCKET ? port = NetConfig.PORT: NetConfig.WS_PORT;
        // let ip = NetConfig.IP;
        // app.net.connect(ws, ip, port);

        let server = app.server.get("net").getDefaultItem();
        app.net.connect(server.HEAD, server.HOST, server.PORT);
    },
    _getUpgradeConfigFrom(){
        let NetConfig = ConfigGame.ISDEVELOP ? UpgradeConfig.DEVELOP : UpgradeConfig.RELEASE;
        return NetConfig;
    },
    _readConfigFile(){
        if (cc.sys.isNative) {

            this._createManifest("gameHall")
            let fileName = "res/info.json"
            let data = jsb.fileUtils.getStringFromFile(fileName);
            if (data && data.length > 8) {
                let obj = JSON.parse(data);
                ConfigGame.PLATFORM = obj.platform;
                ConfigGame.CHANNEL = obj.channel;
                ConfigGame.DEBUG = obj.debug;
                ConfigGame.VERSION = obj.version+"."+obj.revision;
                ConfigGame.SUBPACKAGE = true
          

            }else{
                QYLogs.error(TAG, "info配置文件不存在")
                ConfigGame.SUBPACKAGE = false
            }
        }
    },

    _getManifestPath(gamePath)
    {
        return qygameengine.GameEngine.getNewVersionSavePath() + "/" + gamePath + "_project.data"
    },

    _createManifest(gamePath) {
        if (cc.sys.isBrowser) {
            return;
        }
        QYLogs.log(TAG, "_createManifest");
        if(!jsb.fileUtils.isFileExist(gamePath+"_project.data")){
            let ConfigGame = require("ConfigGame");
            let path = this._getManifestPath(gamePath);
            let data = {}
            data.version = ConfigGame.VERSION;
            data.channel = ConfigGame.CHANNEL;
            data.platform = ConfigGame.PLATFORM;
            data.engineVersion = "Cocos2d-x v3.17";
            data.assets = {};
            data.searchPaths =[];
            let str = JSON.stringify(data);
            let isSave = qygameengine.GameEngine.saveManifestFile(str, path);
            QYLogs.log(TAG, isSave);
        }
    },

    updatePercent(percent,info){
        let x = this.spriteProgress.node.width * percent + 12;
        this.itemThumb.x = x;
        this.spriteProgress.fillRange = percent;
        let currentPercent = Math.ceil(percent*100);
        if(currentPercent>100){
            currentPercent = 100;
        }
        this.labelPercent.string = currentPercent;
        this.node.downloadInfo.getComponent(cc.Label).string = info

    },

    // update (dt) {},


    showUpdateTips(){
        this.node.panel1.active = false
        this.node.panel2.active = false
        this.node.panel3.active = true
    },

    showUpdateProgressUI(){
        this.node.panel1.active = true
        this.node.panel2.active = false
        this.node.panel3.active = false
        this.spriteProgress.fillRange = 0;
        this.itemThumb.x = 0
        this.labelPercent.string = "0";
        this.node.downloadInfo.getComponent(cc.Label).string = ""
    },


    showUpdateUI(){
        cc.log("showUpdateUI")

        this.node.panel1.active = false
        this.node.panel2.active = true
        this.node.panel3.active = false

        // this.AssetsMgr = this.node.getComponent("AssetsMgr")
        // this.AssetsMgr.setLocalManifestUrl("http://192.168.0.38:8085/project.data");
        // this.AssetsMgr.setRomotePackageUrl("http://192.168.0.38:8085/");
        // this.AssetsMgr.setManifestIndex("gameHall");
        // this.AssetsMgr.initAssets(this)
        // this.AssetsMgr.checkUpdate()
        this._connect()
        //192.168.0.223
    },


    showUpdateFailed(){
        QYLogs.log(TAG,"检测更新失败")
    },

    showUpdateSuccess(){
        QYLogs.log(TAG,"更新成功")
        // this.enterGameLogin();
        app.audio.stopAll();
        cc.game.restart();
    },

    enterGameLogin(){
        QYLogs.log(TAG, "跳转大厅")
        if(cc.sys.isBrowser){
            let url = ConfigGame.GATEWAY_URL;
            if(url && url!=""){
                Utils.loadGatewayList(url, function (error, responseText) {
                    let success = false;
                    if(error){
                        QYLogs.error("HotUpgrade", "获取服务器列表失败", error);
                    }
                    else{
                        if(typeof responseText == 'string' && responseText.length>0){
                            let array = JSON.parse(responseText);
                            if(array instanceof Array){
                                let list = [];
                                for (let index = 0; index < array.length; index++) {
                                    const element = array[index];
                                    let item = {};
                                    for (const key in element) {
                                        //key为大写
                                        item[key.toUpperCase()] = element[key];
                                    }
                                    list.push(item);
                                }
                                QYLogs.log("HotUpgrade", "获取服务器列表成功", list);
                                app.server.get("net").setRemoteServerList(list);
                                success = true;
                            }
                            else{
                                QYLogs.error("HotUpgrade", "获取服务器列表数据格式不正确: \"" + responseText + "\"");
                            }
                        }
                        else{
                            QYLogs.error("HotUpgrade", "获取服务器列表数据格式不正确: \"" + responseText + "\"");
                        }
                    }
                    if(success){
                        UIFrame.loadScene("login");
                    }
                    else{
                        let msg = i18n.t("COMMON.HUO_QU_FU_WU_QI_LIE_BIAO_SHI_BAI");
                        this.showDialog(msg, function (isOK) {
                            this.enterGameLogin();
                        }.bind(this));
                    }
                }.bind(this));    
            }
            else{
                UIFrame.loadScene("login");
            }
        }
        else{
            UIFrame.loadScene("login");
        }
    },
    //确认更新
    clickUpdateOk(event, customEventData){
        this.showUpdateProgressUI()
        if(this.AssetsMgr){
            this.AssetsMgr.hotUpdate()
        }
    },

    //取消更新
    clickUpdateCancel(event, customEventData){
        cc.game.end();
    },

    showDialog(text, callback){
        let showType = UIDialog.EShowType.OK;
        let component = this.uiDialog;
        component.setShowType(showType);
        component.show(text, callback);
        component.node.active = true;
    },
    hideDialog(){
        let component = this.uiDialog;
        component.node.active = false;
        component.onClose();
    },
});
