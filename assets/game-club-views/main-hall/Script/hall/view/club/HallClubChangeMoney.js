// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//修改俱乐部币
let i18n = require("i18n");
let TAG = "club_changeMoney";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let Base64 = require("base64");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let UIFrame = require("UIFrame");
let CMD = require("protocol_club");
let HallClubCacheData = require("HallClubCacheData");
let HallClubControl = require("HallClubControl");

cc.Class({
    extends: cc.Component,

    properties: {

        editBox: cc.EditBox,
        con_head: cc.Sprite,
        label_vip: cc.Label,
        con_name: cc.Label,
        head: cc.Sprite,
        myName: cc.Label,
        my_money: cc.Label,

        title: {
            default: [],
            type: cc.Node
        },
        arrow: {
            default: [],
            type: cc.Node
        },
        tip: {
            default: [],
            type: cc.Node
        },

        _isAdd: true,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBox.placeholder = i18n.t("CLUB_HALL.INPUT_GOLD_COUNT");
        this.regiester();
    },

    // update (dt) {},

    onDestroy() {
        this.unRegiester();
     },

    init(data, isAdd, isManager){
        this._clubId = HallClubCacheData.getCurLoginClub();
        this._data = data;
        this._isAdd = isAdd;
        this.isManager = isManager;
        this.initUI();
        this.initLabel(data)
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSTransferClubGoldResp_ui, this._onTransferClubGold, this);
    },

    unRegiester(){
        MsgManager.un(this._onTransferClubGold);
    },

    onClickClose(){
        this.node.destroy();
    },

    initLabel(data){
        this.label_vip.string = data.nVip || 0;
        this.con_name.string =  Utils.getShortText(Base64.decode(data.sConName) || "主席", 12);
        this.myName.string = Utils.getShortText(Base64.decode(data.sName), 12);
        this.my_money.string = Utils.convertNumberToStr(data.nClubGold);
        Utils.changeUserHead(this.head, data.sFaceId, app.ClubAssets);
        Utils.changeUserHead(this.con_head, data.sConFaceId, app.ClubAssets);
        this._data = data;

    },

    initUI(){
        for (let i = 0; i < this.title.length; i++) {
            if (this._isAdd){
                if (i == 0){
                    this.title[i].active = true;
                }else{
                    this.title[i].active = false;
                }
            }else{
                if (i == 0){
                    this.title[i].active = false;
                }else{
                    this.title[i].active = true;
                }
            }
            
        }

        for (let i = 0; i < this.arrow.length; i++) {
            if (this._isAdd){
                if (i%2==0){
                    this.arrow[i].active = true;
                }else{
                    this.arrow[i].active = false;
                }
            }else{
                if (i%2==0){
                    this.arrow[i].active = false;
                }else{
                    this.arrow[i].active = true;
                }
            }
            
        }

        for (let i = 0; i < this.tip.length; i++) {
            if (this._isAdd){
                if (i == 0){
                    this.tip[i].active = true;
                }else{
                    this.tip[i].active = false;
                }
            }else{
                if (i == 0){
                    this.tip[i].active = false;
                }else{
                    this.tip[i].active = true;
                }
            }
            
        }
    },

    onClickSure(){
        let str = this.editBox.string;
        if (str == ""){
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_GOLD_COUNT"));
            return;
        }

        let count = Number(str);
        if (!count){
            return;
        }

        if (this.isManager){
            //管理员操作
            let params = {
                nClubId: this._clubId,
                nTUserId: this._data.nUserId,
                nChange: count,
                nType: this._isAdd?1:2,
                // sPassWord: Base64.encode("12345678"),
            }

            let callback = function(password){
                params.sPassWord = Base64.encode(password);
                HallClubCacheData.setChangeClubCount(count);
                app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSOperateReq_CMD, params);
            }

            let tmp = {
                callBack: callback,
                title: this._isAdd?i18n.t("CLUB_HALL.ADD_MONEY"):i18n.t("CLUB_HALL.RECYCLE_MONEY"),
            }
            MsgManager.fire(MSG.NOTIFY.INPUT_PASSWORD, tmp);
            return;
        }

        let params = {
            nClubId: this._clubId,
            nChange: count,
            nType: this._isAdd?1:2,
        }

        let callBack = function(data){
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSTransferClubGoldReq_CMD, data);
        }.bind(this)
        

        HallClubControl.requestCheckSecurityPsw('changeClubGold', params, callBack);
    },

    _onTransferClubGold(data){
        if (data.nRlt == 0){
            UIFrame.showTips(i18n.t("CLUB_ERROR.APPLY_SUCCESS"));
            this.node.destroy();
        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
            }else if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
            }else if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR1"));
            }else if (data.nRlt == 4){
                if (data.nType == 1){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_ENOUGH_CLUB_MONEY2"));
                }else{
                    UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_ENOUGH_CLUB_MONEY"));
                }   
            }else if (data.nRlt == 5){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_CLUB_MEMBER"));
            }else if (data.nRlt == 6){
                UIFrame.showTips(i18n.t("CLUB_ERROR.MAX_APPLY_COUNT"));
            }else if (data.nRlt == 7){
                UIFrame.showTips(i18n.t("CLUB_ERROR.SECURITY_CODE_ERROR1"));
            }else if (data.nRlt == 8){
                UIFrame.showTips(i18n.t("CLUB_ERROR.SECURITY_CODE_ERROR2"));
            }
        }
    }
    
});
