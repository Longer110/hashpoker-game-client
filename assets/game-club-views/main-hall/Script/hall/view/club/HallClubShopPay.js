let i18n = require("i18n");
let Utils = require("Utils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let HallClubControl = require('HallClubControl');
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        label_pay_detail: cc.RichText,
        small_tip: cc.Node,
        btn_aliPlay: cc.Button,
        btn_usdtPay: cc.Button,

        _nGoodId: '',
        _choosedPayType: -1,
    },

    start() {
        this.regiester();
        this.setBtnIntractable(this.btn_aliPlay, true);
        this.setBtnIntractable(this.btn_usdtPay, true);
        this.hasFavourable(true);
    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.CLIB_PAY_RETURN, this.onPayReturn, this);
        MsgManager.on(MSG.NOTIFY.CLIB_PAY_FINISH, this.onPayFinish, this);
    },

    onDestroy() {
        this.unscheduleAllCallbacks();
        MsgManager.un(this.onPayReturn);
        MsgManager.un(this.onPayFinish);
    },

    onPayReturn(data) {
        if (data.nRlt == 0 && this._choosedPayType != -1) {
            //TODO 调起充值付费接口
            cc.log("购买请求成功");
            this.setBtnIntractable(this.btn_aliPlay, true);
            this.setBtnIntractable(this.btn_usdtPay, true);
        }

        if (data.nRlt == 0){
            if (data.tUSTInfo && data.tUSTInfo.sNavurl){
                cc.sys.openURL(data.tUSTInfo.sNavurl);
            }
        }else{
            UIFrame.showTips(i18n.t("CLUB_ERROR.BUY_GOOD_FAILED"));
        }
    },

    onPayFinish(data) {
        if (data.nRlt == 0) {
            this.onClickClose();
        }
    },

    onClickClose() {
        this.node.destroy();
    },

    setBtnIntractable(target, value) {
        target.interactable = value;
    },

    onClickPayAli() {
        if (this.btn_aliPlay.interactable) {
            this.setBtnIntractable(this.btn_aliPlay, false);
            this.setBtnIntractable(this.btn_usdtPay, false);
            HallClubControl.requestCheckSecurityPsw('pay', 1, this.sendPay.bind(this), null);
            this.scheduleOnce(() => {
                this.setBtnIntractable(this.btn_aliPlay, true);
                this.setBtnIntractable(this.btn_usdtPay, true);
            }, 0.2);
        }
    },

    onClickPayUdts() {
        if (this.btn_usdtPay.interactable) {
            this.setBtnIntractable(this.btn_aliPlay, false);
            this.setBtnIntractable(this.btn_usdtPay, false);
            HallClubControl.requestCheckSecurityPsw('pay', 2, this.sendPay.bind(this), null);
            this.scheduleOnce(() => {
                this.setBtnIntractable(this.btn_aliPlay, true);
                this.setBtnIntractable(this.btn_usdtPay, true);
            }, 0.2);
        }
    },

    sendPay(type) {
        this._choosedPayType = type;
        let params = {
            nGoodId: this._nGoodId, //商品id
            nPayType: type //支付渠道: 1:支付宝，2:UST
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSBuyGoodsReq_CMD, params);
    },

    initPay(nGoodId, userName, orderTitle, money) {
        this._nGoodId = nGoodId;
        let text = i18n.t("CLUB_HALL.CLUB_PAY_DETAIL");
        text = Utils.replaceAll(text, "XXX", userName);
        text = Utils.replaceAll(text, "SSS", orderTitle);
        text = Utils.replaceAll(text, "AAA", orderTitle);

        this.label_pay_detail.string = text; // Utils.convertNumberToStr(money)
    },

    hasFavourable(value) {
        this.small_tip.active = value;
    },

});