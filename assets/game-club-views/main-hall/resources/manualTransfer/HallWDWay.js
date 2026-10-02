// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");
let LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        HallPayType: cc.Prefab,
        handWithdraw: cc.Node,
        line: cc.Node,
        HallWithdraw: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    // update (dt) {},

    onDestroy() {
    },

    init(data){
        this._data = data;
        //提现开关
        if(data.userInfo.nTransSwitch == 0){
            this.handWithdraw.active = true;
            this.line.active = true;
        }else{
            this.handWithdraw.active = false;
            this.line.active = false;
        }
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickOnlineWithdraw(){
        //在线
        cc.sys.openURL(this._data.url);
    },

    onClickHandWithdraw(){
        //手动
        let params = {
            userInfo: this._data.userInfo
        }

        let node = cc.instantiate(this.HallWithdraw);
        this.node.addChild(node);
        let com = node.getComponent("HallWithdraw");
        if (com){
            com.init(params);
        }

    }
});
