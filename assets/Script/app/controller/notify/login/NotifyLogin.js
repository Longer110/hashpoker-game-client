let App = require("App");
let NotifyBase = require("NotifyBase");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

let MSG_NOTIFY = require("Msg_notify");
let MSG_LOGIN = require("Msg_login");
let Msg_upgrade = require("Msg_upgrade");

let i18n = require("i18n");

class NotifyLogin extends NotifyBase {
    name = "NotifyLogin";
    constructor(options) {
        super(options);
    }

    register(){
        // //登录大厅成功
        // this._on(MSG_LOGIN.NOTIFY.LOGIN_SUCCESS, this._onHallLoginSuccess);

        //重复登陆,连接失效并即将关闭通知  (账号在另一地方登陆)
        this._on(MSG_NOTIFY.NOTIFY.RepeatLogonNotify_CMD, this._onRepeatLogonNotify);

        //游戏维护协议下发
        this._on(Msg_upgrade.UPDATE_MAINTENANCENOTIFY, this._maintenancenotify);
        this._on(Msg_upgrade.UPDATE_KICKOUTNOTIFY, this._onKickoutNotify);
    }
    unregister(){
    }

    //重复登录返回
    _onRepeatLogonNotify(data){
        cc.warn(this.name, "_onRepeatLogonNotify", data);
        //主动断开，不重连
        // app.net.disConnect(true);
        app.net.release();

        cc.warn(this.name, "账号重复登录, 返回登录界面");
        target.emit(event.SERVER_RELOGIN);
    }
    //游戏维护中协议下发
    _maintenancenotify(data){
        //清空当前子游戏数据
        app.game.clearData();
        app.game.setGameID(-1);
        //主动断开，不重连
        // app.net.disConnect(true);
        app.net.release();
        //清空所有block
        my.ui.clearAllBlock();

        cc.warn(this.name, "游戏维护中, 返回登录界面", data);
        target.emit(event.SERVER_GAME_WEI_HU_ZHONG, data);
    }
    //在房间中，踢房返回协议
    _onKickoutNotify(data){
        // //1:踢回到大厅 其它:踢回到登陆界面
        // if(data.nToWhere==1){
        //     // //如果用户没登录，就不提示了
        //     // if(info.nUserID!==0){
        //     //     UIFrame.loadScene("hall");
        //     // }
        //     cc.warn("TODO", "踢回到大厅");
        // }
        // else{
        //     //清空当前子游戏数据
        //     app.game.clearData();
        //     app.game.setGameID(-1);
        //     //主动断开，不重连
        //     // app.net.disConnect(true);
        //     app.net.release();

        //     // if(!App.isInLoginScene){
        //     //     UIFrame.loadScene("login");
        //     // }
        //     cc.warn("TODO", "踢回到登录界面");
        // }

        // let tip = data.sTips;
        // let text = i18n.t("COMMON.WEI_HU_TI_REN.1");
        // if(Number(tip)){
        //     text = i18n.t("COMMON.WEI_HU_TI_REN." + tip);
        //     if(text=="COMMON.WEI_HU_TI_REN." + tip){
        //         text = i18n.t("COMMON.WEI_HU_TI_REN.1");
        //     }
        // }

        // cc.warn(this.name, "在房间中，踢房返回协议", data);
        target.emit(event.SERVER_KICKOUT_ROOM, data);
    }
}

module.exports = NotifyLogin;