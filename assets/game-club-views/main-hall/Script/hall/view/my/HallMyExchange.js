// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let Msg_login = require('Msg_login');
let HEAD_SIZE = 118;
let HallClubControl = require("HallClubControl");

cc.Class({
    extends: cc.Component,     

    properties: {
        editBox: cc.EditBox,//输入玩家昵称
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.regiester();
       
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._inputRedeemCode);
       
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSInputRedeemCodeRsp_ui, this._inputRedeemCode, this);
    },

    onClickExchange(){
        let str = this.editBox.string;
        if (str == ""){
            UIFrame.showTips(i18n.t("CLUB_HALL_TIP.INPUT_EXCHANGE"));
            return;
        }

        let params = {
            sRedeemCode: str
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSInputRedeemCodeReq_CMD, params);
    },

    onClickCancel(){
        this.editBox.string = "";
    },

    onClickClose(){
        this.node.destroy();
    },

    _inputRedeemCode(data){
        if (data.nRlt == 0){
            if(data.nGold){
                let str = Utils.replaceAll(i18n.t("CLUB_HALL_TIP.EXCHANGE_TIP"), "XXX", data.nGold);
                UIFrame.showTips(str);
            }
            
        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.EXCHANGE_ERROR1"));
            }else  if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.EXCHANGE_ERROR2"));
            }else  if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.EXCHANGE_ERROR3"));
            }else  if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.EXCHANGE_ERROR4"));
            }else  if (data.nRlt == 5){
                UIFrame.showTips(i18n.t("CLUB_ERROR.EXCHANGE_ERROR5"));
            }else{
                UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"));
            }
        }
    }

});
