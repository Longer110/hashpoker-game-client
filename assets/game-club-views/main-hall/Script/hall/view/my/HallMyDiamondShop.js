
let Base64 = require("base64");
let i18n = require("i18n");
let Utils = require("Utils");
let clubGameConfig = require("clubGameConfig");
const UIListCell = require("UIListCell");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");

cc.Class({
    extends: cc.Component,
    properties: {
        diamondExchangePrefab: cc.Prefab
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    
    OnClickUSDT() {

    },

    OnClickDiamondExchange() {
        let node = cc.instantiate(this.diamondExchangePrefab);
        this.node.addChild(node);
        let component = node.getComponent("HallMyDiamondExchange");
        if (component) {
            component.init(this, 2);
        }
    },

    OnClickClose(){
        this.node.destroy();
    },

});
