// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//创建俱乐部
let i18n = require("i18n");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");

cc.Class({
    extends: cc.Component,

    properties: {
        max_number: cc.Label,
        clubTax: cc.Label,
        hallTax: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onClickClose(){
        this.node.destroy();
    },

    init(data){
        if (!data){
            data = HallClubCacheData.getCurClubData();
        }

        this.max_number.string = Utils.replaceAll(i18n.t("CLUB_HALL.USER_COUNT"), "XXX", data.nMaxUserCnt || 999);
        this.clubTax.string = data.nClubTax/1000*100 + "%";
        if(data.nHallTax){
            this.hallTax.string = data.nHallTax/1000*100 + "%";
        }else{
            this.hallTax.string = "100%";
        }
        
    },

});
