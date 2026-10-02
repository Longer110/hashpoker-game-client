let App = require("App");
let NotifyBase = require("NotifyBase");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;
let UIDialog = require("UIDialog");
let i18n = require("i18n");
let MsgManager = require("MsgManager");
let MSG_FRAMEWORKS = require("Msg");
// let UIFrame = require("UIFrame");

// let MsgManager = require("MsgManager");
// let MSG_NOTIFY = require("Msg_notify");
// let MSG_LOGIN = require("Msg_login");
let MSG_HALL = require("Msg_hall");
let UserInfo = require("UserInfo");
let CMD_HALL = require("protocol_hall");
let ConfigGame = require("ConfigGame");

let FIRST_LOGIN_HALL = true;

class NotifyHall extends NotifyBase {
    name = "NotifyHall";
    constructor(options) {
        super(options);
    }

    register() {
        // //登录大厅成功
        // this._on(MSG_LOGIN.NOTIFY.LOGIN_SUCCESS, this._onHallLoginSuccess);
        // //大厅相关
        // this._on(MSG_HALL.GameListNotify_CMD, this._onGameListCallback);  //游戏列表返回
        target.on(event.HALL_LOGIN_SUCCESS, this._onHallLoginSuccess, this);
        this._on(MSG_HALL.HelpInfoRsp_CMD, this._onHelpInfoRsp); //帮助界面UI类型
    }
    unregister() {
        target.targetOff(this);
    }
    //游戏列表返回(登录大厅成功后服务器会主动返回此消息，在此消息前如果有正在玩的游戏，服务器会先返回 PlayingNotify_CMD)
    _onGameListCallback(data) {
        QYLogs.warn(this.name, "游戏列表返回", JSON.stringify(data));

        data = data || {};
        let array = data.arrGameItems || [];
        array = array.filter(item => item.nGameId !== 178);//去除niuniu游戏加载
        let items = []
        let prefix_live = "live-";
        let prefix_sets = "sets-";
        for (let index = 0; index < array.length; index++) {
            const item = JSON.parse(JSON.stringify(array[index]));
            if(app.config.ENABLE_SERVER_VERSION && item.sMD5FilePath){
                try {
                    if(item.sMD5FilePath && item.sMD5FilePath.indexOf(".data")<0){
                        let md5_object = JSON.parse(item.sMD5FilePath);
                        if(md5_object && typeof md5_object == 'object'){
                            //子包文件版本号
                            item.sMD5FilePath = md5_object.bundle || item.sMD5FilePath;
                            //多语言配置文件版本号
                            item.langs = md5_object.langs || {};
                        }
                    }
                } 
                catch (error) {
                }
            }
            // if(app.config.IS_LIVE_ONLY){
                
                //扩展包主入口
                item.manager = "game-common";
                if(item.sGamePath.indexOf(prefix_live)>=0){
                    item.sGamePath = item.sGamePath.substr(prefix_live.length);
                    item.isLive = true;

                    item.depends = ["game-live-assets"]; //直播子游戏依赖直播主包资源
                }
                else{
                    item.depends = ["game-set-assets"];  //合集子游戏依赖合集主包资源
                    item.isLive = false;
                }
                
                if(item.sGamePath == "live-shortTexas" || item.sGamePath == "live-Omaha"){//添加依赖德州bundle
                    item.depends.push("live-Texas");
                }
                items.push(item);
            // }
            // else{
            //     if(item.sGamePath&&item.sGamePath.indexOf(prefix_live)<0){
            //         items.push(item);
            //     }
            // }
        }
        
        app.game.setGameList(items);
        // if(app.config.IS_LIVE_ONLY){
        //     if(app.config.ENABLE_SERVER_VERSION){
        //         app.game.setGameList(items);
        //     }
        // }
        // else{
        //     app.game.setGameList(items);
        // }
    }

    // //重连时游戏状态通知
    // _onPlayingNotify(data) {
    //     cc.warn(this.name, "登录大厅游戏状态返回：", data);

    //     //设置当前子游戏数据
    //     app.game.setData(data);
    // }

    //登录大厅成功返回
    _onHallLoginSuccess(data) {
        //cc.warn(this.name, "_onHallLoginSuccess", data);

        //获取帮助界面ui类型
        this._requestHelpUIType();

        let params = data.tGameList || {};
        this._onGameListCallback(params);

        // 已修改到 HallController.js 中实现
        // this._onPlayingNotify(data.tCurrentPlay);
        // target.emit(event.HALL_LOGIN_FINISH, data);
        return;
    }

     //获取不同分组界面UI类型
    _requestHelpUIType(){
        let data = {
            nUserID:UserInfo.getInfo().nUserID,//玩家id
            nGameID: 101 //游戏id(获取帮助界面赔率时用到)
        }
       app.net.send(CMD_HALL.Main_CMD.value, CMD_HALL.Main_CMD.HelpInfoReq_CMD, data);
    }

    //获取不同分组界面ui类型
    _onHelpInfoRsp(data){
        cc.log("_onHelpInfoRsp");
        if (data && data.sUiType != ""){
            ConfigGame.DIFF_GROUP_UI_TYPE = data.sUiType;
        }
    }
}

module.exports = NotifyHall;