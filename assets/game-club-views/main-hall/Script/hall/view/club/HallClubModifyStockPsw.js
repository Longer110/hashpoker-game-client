// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//修改库存密码
let i18n = require("i18n");
let TAG = "club_modifyStockPsw";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
        editBox1: cc.EditBox,//输入当前密码
        editBox2: cc.EditBox,//输入新密码
        editBox3: cc.EditBox,//再次输入新密码
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBox1.placeholder = i18n.t("CLUB_HALL.INPUT_CUR_PSW");
        this.editBox2.placeholder = i18n.t("CLUB_HALL.INPUT_NEW_PSW");
        this.editBox3.placeholder = i18n.t("CLUB_HALL.INPUT_NEW_PSW2");
    },

    // update (dt) {},

    onClickClose(){
        this.node.destroy();
    },

    init(callback){
        this._callBack = callback;
    },

    onClickComplete(){
        let oldPsw = this.editBox1.string;
        let newPsw1 = this.editBox2.string;
        let newPsw2 = this.editBox3.string;

        if (oldPsw == ""){
            UIFrame.showTips(i18n.t("CLUB_ERROR.OLD_PSW"));
            return;
        }

        if (newPsw1 == ""){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NEW_PSW1"));
            return;
        }

        if (newPsw2 == ""){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NEW_PSW2"));
            return;
        }

        if (newPsw1 != newPsw2){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NEW_PSW3"));
            return;
        }

        let params = {
            oldPsw: oldPsw,
            newPsw: newPsw1,
        }

        if (this._callBack){
            this._callBack(params);
        }
    }
});
