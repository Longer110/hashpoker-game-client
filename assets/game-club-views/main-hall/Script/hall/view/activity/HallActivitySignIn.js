// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let clubGameConfig = require("clubGameConfig");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let i18n = require("i18n");
let UIFrame = require("UIFrame");
let UserInfo = require("UserInfo");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        dayList: {
            default: [],
            type: cc.Node,
        },

        btnSign: cc.Node,
        help: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.config_gold = clubGameConfig.CLUB_SIGNIN_REWARD;
    },

    // update (dt) {},  

    unRegiester(){
        MsgManager.un(this._onSignInfo);
        MsgManager.un(this._onSign);
    },

    regiester(){
        this.unRegiester();
        MsgManager.on(MSG.NOTIFY.ClubSignInfoRsp_ui, this._onSignInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubSignRsp_ui, this._onSign, this);
    },
    

    init(control, data){
        this.control = control;
        this.regiester();
        this.getSignInfo();
    },

    getSignInfo(){
        let params = {
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSignInfoReq_CMD, params);
    },

    _onSignInfo(data){
        this.initUI(data);
    },

    _onSign(data){
        if (data.nRlt == 0){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP6"));
            this.signData.isSign = true;
            this.initUI(this.signData);

            if (this.control){
                this.control.getAtivityInfo(true);
            }

        }else{
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP7"));
        }
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickSignIn(){
        let dis = this.btnSign.getChildByName("dis");
        if(dis.active){
            return;
        }

        let params = {
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSignReq_CMD, params);
    },

    onClickDescribe(){
        this.showHelp(true);
    },

    showHelp(isShow){
        this.help.active = isShow;
    },

    onClickCloseHelp(){
        this.showHelp(false);
    },

    initUI(data){
        this.signData = data;
        this.initGold(data.arrAwards, data.nPlayCntMax);

        for (let i = 0; i < this.dayList.length; i++) {
            let dayNode = this.dayList[i];
            let day = i + 1;
            let isCurDay = data.nDaysCur == day;
            let hasReceived = data.nDaysCur >= day;
            let isSeven = day == 7;
            if (day == 7){
                if (data.nDaysCur > 7){
                    isCurDay = true;
                }
            }

            this.updateDay(data, dayNode, isCurDay, hasReceived, isSeven);
        }

        let nor = this.btnSign.getChildByName("nor");
        let dis = this.btnSign.getChildByName("dis");
        if (!data.isSign && data.nPlayCntCur == data.nPlayCntMax){
            nor.active = true;
            dis.active = false;
        }else{
            nor.active = false;
            dis.active = true;
        }
    },

    initGold(data, maxCount){
        let str = i18n.t("CLUB_SIGNIN_INFO.CONTENT2");
        for (let i = 0; i < data.length; i++) {
            let dayNode = this.dayList[data[i].nDays-1];
            let received = dayNode.getChildByName("received");
            let notReceive = dayNode.getChildByName("notReceive");
            let notGold = notReceive.getChildByName("gold").getComponent(cc.Label);
            let gold = received.getChildByName("gold").getComponent(cc.Label);
            gold.string = "+" + data[i].nAward;
            notGold.string = "+" + data[i].nAward;
            str = Utils.replaceAll(str, "SSS" + data[i].nDays, data[i].nAward)
        }

        str = Utils.replaceAll(str, "XXX", maxCount || 30);
        
        this.help.getChildByName("content2").getComponent(cc.Label).string = str;
    },

    updateDay(data, node, isCurDay, hasReceived, isSeven){
        let received = node.getChildByName("received");
        let notReceive = node.getChildByName("notReceive");
        let canReceive = notReceive.getChildByName("can_receive");
        let toDay = notReceive.getChildByName("today");
        let lab_count = toDay.getChildByName("lab_count").getComponent(cc.Label);
        let countStr = data.nPlayCntCur + "/" + data.nPlayCntMax;
        let isCanRec = data.nPlayCntCur == data.nPlayCntMax;

        if (isSeven){
            if (isCurDay){
                toDay.active = true;
                received.active = false;
                notReceive.active = true;

                if (isCanRec && !data.isSign){
                    canReceive.active = true;
                }else{
                    canReceive.active = false;
                }

                if (data.isSign){
                    received.active = true;
                    notReceive.active = false;
                    toDay.active = false;
                }
            }else{
                toDay.active = false;
                received.active = false;
                notReceive.active = true;
            }
            
            lab_count.string = countStr;
        }else{
            if (isCurDay && !data.isSign){
                received.active = false;
                notReceive.active = true;
                toDay.active = true;
                canReceive.active = false;
                lab_count.string = countStr;

                if (isCanRec){
                    canReceive.active = true;
                }
            }else{
                if(hasReceived){
                    received.active = true;
                    notReceive.active = false;
                }else{
                    received.active = false;
                    notReceive.active = true;
                    toDay.active = false;
                    canReceive.active = false;
                }
            }
        }
    }

});
