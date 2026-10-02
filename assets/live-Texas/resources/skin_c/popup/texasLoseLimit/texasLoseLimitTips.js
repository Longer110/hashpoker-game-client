// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let TexasData = require("TexasData");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        textTips: cc.Label,
        textLimit: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(limit){
        this.textTips.string = TexasUtils._getText(221, limit);
        let bb = TexasData._getBigBlind() ? TexasData._getBigBlind() : TexasData._getTableInfo().nPreAnte;
        let count = Math.round(Math.floor(limit / bb * 10000) / 1000) / 10;
        this.textLimit.string = `${count}BB = ${limit}`;
    },

    onClickClose(){
        this.node.destroy();
    }

    // update (dt) {},
});
