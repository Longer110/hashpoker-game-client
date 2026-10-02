// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let i18n = require("i18n");
let UIFrame = require("UIFrame");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let HallClubLogic = require("HallClubLogic");
let LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        btnRecharge: cc.Node,
        btnReceive: cc.Node,
        hasReceive: cc.Node,

        label_tip1: cc.Label,
        label_tip2: cc.Label,

        img: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    unRegiester(){
        MsgManager.un(this._onFirstChargeReward);
    },

    regiester(){
        this.unRegiester();
        MsgManager.on(MSG.NOTIFY.ClubFirChargeRewardRsp_ui, this._onFirstChargeReward, this);
    },

    init(control, data){
        this.regiester();
        this.control = control;
        this.initUI(data);
        this._acInfo = data;
    },

    initUI(data){
        this.btnRecharge.active = data.nGetStatus != 0;
        this.btnReceive.active = data.nGetStatus == 0;
        this.hasReceive.active = data.nGetStatus == 1;
        this.btnRecharge.getChildByName("nor").active = data.nGetStatus != 0;
        this.btnRecharge.getChildByName("dis").active = data.nGetStatus == 1;

        let str = Utils.replaceAll(i18n.t("CLUB_ACTIVITY.ACTIVITY_TIP3"), "XXX", 2000);
        str = Utils.replaceAll(str, "SSS", 100);
        this.label_tip1.string = str;

        let str2 = Utils.replaceAll(i18n.t("CLUB_ACTIVITY.ACTIVITY_TIP4"), "XXX", 2000);
        str2 = Utils.replaceAll(str2, "SSS", "5%");
        this.label_tip2.string = str2;

        let language = LocalStorage.getSysLanguage();
        let config = HallClubLogic.getReConfig("ac_" + language);
        let url = config && config.url;
        if (url){
            cc.assetManager.loadRemote(url, function (error, texture) { 
                if(error) {
                    QYLogs.error("activityMain", "加载资源出错: url=" + url, error);
                }
                else{
                    if (cc.isValid(this.img)){
                        let spriteFrame = new cc.SpriteFrame(texture);
                        this.img.spriteFrame = spriteFrame;
                    }
                    
                }
            }.bind(this))
        }
        
    },

    _onFirstChargeReward(data){
        if (data.nRlt == 1){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP0"));
            if (this.control){
                this.control.getAtivityInfo(true);
            }

            this.initUI({nGetStatus: 1});
        }else if(data.nRlt == -2){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP2"));
        }else if(data.nRlt == -4){
            UIFrame.showTips(Utils.replaceAll(i18n.t("CLUB_ACTIVITY.ERROR_TIP3"), "SSS", data.nJushu));
        }else{
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP1"));
        }
    },

    receiveReward(){
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            nId: this._acInfo.nId,
            nReward: this._acInfo.nAwardCount || 0,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubFirChargeRewardReq_CMD, params);
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickRecharge(){
        if (this.btnRecharge.getChildByName("dis").active){
            return;
        }

        this.control.onClickRecharge();
    },

    onClickReceive(){
        this.receiveReward();
    }
});
