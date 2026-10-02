/*
    德州Mtt买入筹码
*/

let CMD = require("protocol_texas");
let TexasUtils = require("TexasUtils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        label_tip:cc.Label,
        label_buy:cc.Label,
        label_time:cc.Label,

        _time:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.initUI({nCost:1000, nCount:500, nBuyCount:5, nTime:10})
    },

    // update (dt) {},

    show(data){
        this.initUI(data);
    },

    close(){
        this.unschedule(this.showTime)
    },

    initUI(data){
        let str = TexasUtils._getText(206);
        str = Utils.replaceAll(str, "SSS", parseInt(data.nCoin) || 0);
        str = Utils.replaceAll(str, "XXX", parseInt(data.nChip) || 0);
        this.label_tip.string = str;

        let buyStr = TexasUtils._getText(207);
        buyStr = Utils.replaceAll(buyStr, "SSS", parseInt(data.nCnt) || 0);
        this.label_buy.string = buyStr;

        if (data.nLimitTime > 0){
            this._time = data.nLimitTime;
            this.label_time.string = this._time + "s";
            this.schedule(this.showTime, 1);
        }else{
            this.label_time.string = "";
        }
        
    },

    showTime(){
        if (this._time <= 0){
            this.node.active = false;
            this.unschedule(this.showTime);
            return;
        }

        this._time -= 1;
        this.label_time.string = this._time + "s"

    },

    btnBuy(){
        let nStr = "mtt比赛重构";
        let data = {

        }
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouRAReq_CMD, data);
        this.node.active = false;
    },

    btnCancel(){
        this.node.active = false;
    },

    btnClose(){
        this.node.active = false;
    }

});
