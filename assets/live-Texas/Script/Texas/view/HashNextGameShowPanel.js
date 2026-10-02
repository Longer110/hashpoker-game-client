// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let TAG = "HashNextGameShowPanel";
let TexasUtils = require("TexasUtils");
let MsgManager = require("MsgManager");
let Utils = require("Utils");
let MSG = require("Msg_Texas");
let CMD = require("protocol_texas");
let TexasData = require("TexasData");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(data)
    {
        MsgManager.on(MSG.NOTIFY.ClubDeZhouHashCardRsp_ui, this._onGetClubDeZhouHashCard, this);
        this.initData = data;
        let tableInfo = TexasData._getTableInfo();
        var curLabelStr = "";
        this.node.getChildByName("sendCardsTime").getChildByName("value").active = true
        if (data.hand == "")
        {
            curLabelStr = "下手"
            this.node.getChildByName("sendCardsTime").getChildByName("value").active = false
        }
        else if (data.sPaiJuId == tableInfo.sPaiJuId)
        {
            curLabelStr = "当前"
        }
        var seed = ((data.seed || "未知牌局") + "").replace(/^kk/i, "HP");
        this.node.getChildByName("seed").getChildByName("value").getComponent(cc.Label).string = seed
        this.node.getChildByName("turn").getChildByName("value").getComponent(cc.Label).string = curLabelStr;

        this.node.getChildByName("shuffleTime").getChildByName("value").getComponent(cc.Label).string =  data.sTime + "";
        this.node.getChildByName("hashTime").getChildByName("value").getComponent(cc.Label).string =  data.sTime + "";
        this.node.getChildByName("sendCardsTime").getChildByName("value").getComponent(cc.Label).string =  data.fTime + "";

        this.node.getChildByName("cardsHash").getChildByName("value").getComponent(cc.Label).string =  data.hash + ""
    },
    
    _onGetClubDeZhouHashCard(data){
    },


    onClickClose(){ 
        this.node.active = false;
        MsgManager.un(this._onGetClubDeZhouHashCard);
    },

    onClickSave(){

    },


    // update (dt) {},
});
