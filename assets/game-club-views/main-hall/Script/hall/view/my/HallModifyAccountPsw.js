// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//修改密码
let i18n = require("i18n");
let TAG = "my_modifyAccountPsw";
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

cc.Class({
    extends: cc.Component,

    properties: {
        editBox1: cc.EditBox,//输入当前密码
        editBox2: cc.EditBox,//输入新密码
        editBox3: cc.EditBox,//再次输入新密码
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBox1.placeholder = i18n.t("CLUB_HALL.INPUT_CUR_PSW");
        this.editBox2.placeholder = i18n.t("CLUB_HALL.INPUT_NEW_PSW");
        this.editBox3.placeholder = i18n.t("CLUB_HALL.INPUT_NEW_PSW2");
        this.regiester();
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onChangeLoginPsw);
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSChangeLoginPassWardResp_ui, this._onChangeLoginPsw, this);
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickComplete(){
        let oldPsw = this.editBox1.string;
        let newPsw1 = this.editBox2.string;
        let newPsw2 = this.editBox3.string;

        if (oldPsw == "" || newPsw1 == "" || newPsw2 == ""){
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW"));
            return;
        }

        if (oldPsw.length < 6 || newPsw1.length < 6 ||newPsw2.length < 6){
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW1"));
            return;
        }

        if (Utils.hasBlankCharacter(oldPsw) || Utils.hasBlankCharacter(newPsw1) || Utils.hasBlankCharacter(newPsw2)){
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW2"));
            return;
        }

        if (Utils.judgePasswordCharacters(oldPsw) || Utils.judgePasswordCharacters(newPsw1) || Utils.judgePasswordCharacters(newPsw2)){
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW4"));
            return;
        }

        if (Utils.hasEmojiCharacter(oldPsw) || Utils.hasEmojiCharacter(newPsw1) || Utils.hasEmojiCharacter(newPsw2)){
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW5"));
            return;
        }


        if (newPsw1 != newPsw2){
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW3"));
            return;
        }

        let params = {
            sOldPassWord: MD5.hex(oldPsw),
            sNewPassWord: MD5.hex(newPsw1),
        }

        let changeFunc = function(){
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeLoginPassWardReq_CMD, params);
        }

        HallClubControl.requestCheckSecurityPsw('changePsw', {}, changeFunc, function(){});

        this._newPsw = newPsw1;
        
    },

    _onChangeLoginPsw(data){
        if (data.nRlt == 0){
            if(this._newPsw){
                LocalStorage.setLoginPWD(this._newPsw);
                let LoginController = App.getComponent("LoginController");
                if (LoginController){
                    LoginController.changeLoginPsw(MD5.hex(this._newPsw));
                }

                let userId = UserInfo.getInfo().nUserID;
                let str = LocalStorage.getLoginPWD();
                if (str){
                    let params = {
                        nUserId: userId,
                        mwString: Base64.encode(str),
                    }
                    app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserMWStringReq_CMD, params);
                }
            }
            
            UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_SUCCESS"));
        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
            }
            if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW_ERROR1"));
            }
            if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW_ERROR2"));
            }
            if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW_ERROR3"));
            }
        }
    }
});
