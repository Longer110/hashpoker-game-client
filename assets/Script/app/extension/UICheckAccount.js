// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let UIBase = require("UIBase");
let AppBridge = require("AppBridge");
let Utils = require("Utils");
let MsgManager = require("MsgManager");
let UserInfo = require("UserInfo");
let LocalStorage = require("LocalStorage");
let i18n = require("i18n");

cc.Class({
    extends: UIBase,

    properties: {
        labelLogin: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._super();
        this.labelLogin.lang = "COMMON.LOGIN";
        let color16 = app.isCCLive()?"#EB0707":"#A400FF";
        var color = cc.Color.BLACK;
        let curColor = color.fromHEX(color16);
        this.labelLogin.node.color = new cc.Color(curColor.r,curColor.g,curColor.b);
    },

    // update (dt) {},

    onClickLogin(){
        this.close();
        App.postMessage(AppBridge.EVENT.GAME_ACTION, {
            key: AppBridge.ACTION.GAME_ACTION_LOGIN,
            value: "",
        })
        if(app.url.get("live")){
            App.showUIPanel();
        }
    },
    onClickBlock(){
        this.close();
    },
});
