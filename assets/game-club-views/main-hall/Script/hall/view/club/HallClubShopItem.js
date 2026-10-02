let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        item_bg: cc.Sprite,
        item_icon: cc.Sprite,
        label_title: cc.Label,
        label_detail: cc.Label,
        label_money: cc.Label,
        btn_buy: cc.Button,
        favourable_tip: cc.Node,

        _nGoodId: '',
        _money: 0,
    },

    start() {
        this.hasFavourable(false);
    },

    setNGoodId(id) {
        this._nGoodId = id;
    },

    hasFavourable(value) {
        this.favourable_tip.active = value;
    },

    onBuyClick(data) {
        let params = {
            nGoodId: this._nGoodId,
            title: this.label_title.string,
            money: this._money,
        }
        MsgManager.fire(MSG.NOTIFY.OPEN_CLUB_SHOP_PAY, params);
    },

    setItemInfo(bgFrame, iconFrame, title, detail, money) {
        // this.item_bg.spriteFrame = bgFrame;
        this.item_icon.spriteFrame = iconFrame;
        this.label_title.string = title;
        this.label_detail.string = detail;
        this.label_money.string = Utils.convertNumberToStr(money);
        this._money = money;
        this.checkLabelDetailLength();
    },

    checkLabelDetailLength() {
        let action = cc.sequence(
            cc.delayTime(0.05),
            cc.callFunc(() => {
                let width = this.label_detail.node.width;
                if (width > 316) {
                    this.runLableDatail(width);
                }
            })
        )
        // this.label_detail.node.anchorX = 0.5;
        this.label_detail.node.x = 0;
        cc.tween(this.label_detail.node).stop().then(action).start();
    },

    runLableDatail(width) {
        let action = cc.sequence(
            cc.moveBy(3, new cc.Vec2(296 - width, 0)),
            cc.moveBy(3, new cc.Vec2(width - 286, 0)),
        )
        // this.label_detail.node.anchorX = 0;
        this.label_detail.node.x = 0;
        cc.tween(this.label_detail.node).stop().then(action).repeatForever().start();
    },

});