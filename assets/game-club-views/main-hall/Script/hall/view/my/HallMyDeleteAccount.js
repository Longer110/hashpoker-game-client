// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//注销账号
let i18n = require("i18n");
let TAG = "my_deleteAccount";
let Utils = require("Utils");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let UIFrame = require("UIFrame");
let MD5 = require("md5");
let LocalStorage = require("LocalStorage");
let HallClubControl = require("HallClubControl");
let UserInfo = require("UserInfo");
let HALL_CMD = require("protocol_hall");
let HALL_MSG = require("Msg_hall");

cc.Class({
    extends: cc.Component,

    properties: {
        editBox1: cc.EditBox,//输入账号
        editBox2: cc.EditBox,//输入密码
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBox1.placeholder = i18n.t("LOGIN.ACCOUNT_REG");
        this.editBox2.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.regiester();
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onDeleteAccount);
    },

    regiester(){
        MsgManager.on(HALL_MSG.AccountCloseRsp_CMD, this._onDeleteAccount, this);
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickComplete(){
        let account = this.editBox1.string;
        let psw = this.editBox2.string;

        if (account == "" || psw == ""){
            UIFrame.showTips(i18n.t("LOGIN_TIPS.2"));
            return;
        }

        let params = {
            sAccounts: account,
            sPassword: MD5.hex(psw),
        }

        // let changeFunc = function(){
        //     app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeLoginPassWardReq_CMD, params);
        // }

        // HallClubControl.requestCheckSecurityPsw('changePsw', {}, changeFunc, function(){});

        // this._newPsw = newPsw1;
        

        let tipData = {
            text: i18n.t("CLUB_HALL_TIP.DELETE_ACCOUNT_TIP"),
            callBack: function(isOk){
                if (isOk){
                    app.net.send(HALL_CMD.Main_CMD.value, HALL_CMD.Main_CMD.AccountCloseReq_CMD, params);
                }
                
            }.bind(this),
            isOKAndCancel: true,
        }
        MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, tipData);
        
    },

    _onDeleteAccount(data){
        if (data.nCode == 0){
            UIFrame.showTips(i18n.t("CLUB_HALL_TIP.DELETE_ACCOUNT_SUCCESS"));
            LocalStorage.setAutoLoginState(false);
            LocalStorage.setLoginName("");
            LocalStorage.setLoginPWD("");
            this._logOut();
        }else{
            UIFrame.showTips(i18n.t("CLUB_HALL_TIP.DELETE_ACCOUNT_FAIL"));
        }
    },

    //登出
    _logOut(){
        //断开游戏连接
        if (app.net.isConnect()) {
            app.net.disConnect(true);
            app.net.release();
        }

        MsgManager.fire("logout");
        
        //退出登录，返回到登录界面
        // UIFrame.loadScene("login", null, null, null, true);
        app.res.loadLogin(function onComplete(params) {
            
        })
    },
});
