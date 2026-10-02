// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// let GoogleAdController = require("GoogleAdController");
let i18n = require("i18n");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        title_tip: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let str = Utils.replaceAll(i18n.t("CLUB_HALL_TIP.SHOW_AD_TIP"), "XXX", 10);
        this.title_tip.string = str;

        //加载激励广告
        // GoogleAdController.loadRewardAd();
    },

    // update (dt) {},

    onClickOpenAd(){
        //加载激励广告
        // GoogleAdController.showRewardeAd();
        this.onClickClose();
    },

    onClickClose(){
        this.node.destroy();
    }
});
