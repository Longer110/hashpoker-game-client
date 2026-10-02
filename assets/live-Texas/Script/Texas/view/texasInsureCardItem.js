// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let UserInfo = require("UserInfo");
let Utils = require("Utils");
let Base64 = require("base64");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        nIcon: cc.Node,//icon

        _insureMode: 1,//1:传统保险 2:低水保险

        _card: 0,//牌
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    _createInsureCardItem:function(control,data,cardItem,pokerBack){
        this.control = control;

        this._insureMode = data.nInsureMode;

        this._card = cardItem;

        this.node.color = new cc.Color(255, 255, 255);

        TexasUtils._getCardType(this.node,cardItem);
        this.nIcon.active = true;
    },

    //获得icon
    _getIcon() {
        return this.nIcon.active;
    },

    //获得牌
    _getCard() {
        return this._card;
    },

    onClickBtnIcon() {
        if (this._insureMode==2) return;

        if (this.control) {
            let control = this.control;
            if (control._isMustBuy) return;

            if (this._getIcon() && control._getCount()<=1) return;

            this.nIcon.active = !this.nIcon.active;
            
            this.node.color = this.nIcon.active?new cc.Color(255, 255, 255):new cc.Color(100, 100, 100);

            control._setOutOdds();
        }
    },

});
