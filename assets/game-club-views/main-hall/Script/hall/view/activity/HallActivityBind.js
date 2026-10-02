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
        btnBind: cc.Node,
        btnReceive: cc.Node,
        hasReceive: cc.Node,

        bindPrefab: cc.Prefab,

        label_tip1: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    unRegiester(){
        MsgManager.un(this._onGetBindAward);
    },

    regiester(){
        this.unRegiester();
        MsgManager.on(MSG.NOTIFY.ClubGetBindAwardRsp_ui, this._onGetBindAward, this);
    },

    init(control, data){
        this.regiester();
        this.control = control;
        this.initUI(data);
        this._acInfo = data;
    },

    initUI(data){
        this.btnBind.active = data.nGetStatus != 0;
        this.btnReceive.active = data.nGetStatus == 0;
        this.hasReceive.active = data.nGetStatus == 1;
        this.btnBind.getChildByName("nor").active = data.nGetStatus != 0;
        this.btnBind.getChildByName("dis").active = data.nGetStatus == 1;

        let str = Utils.replaceAll(i18n.t("CLUB_ACTIVITY.ACTIVITY_TIP5"), "SSS", 200);
        this.label_tip1.string = str;
    },

    _onGetBindAward(data){
        if (data.nRlt == 0){
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
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubGetBindAwardReq_CMD, params);
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickBind(){
        if (this.btnBind.getChildByName("dis").active){
            return;
        }

        let name = "HallMyBinding";
        let node = cc.instantiate(this.bindPrefab);
        this.node.addChild(node, 0, name);
        let recommendCom = node.getComponent(name);
        if(recommendCom){
            recommendCom.init(this, 1);
        }

    },

    onClickReceive(){
        this.receiveReward();
    },

    changePhone(){
        if (this.control){
            this.control.getAtivityInfo(true);
        }

        if(this._acInfo){
            this._acInfo.nGetStatus = 0;
        }

        this.initUI(this._acInfo);
    }
});
