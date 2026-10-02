// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let TAG = "HashGameShowPanel";
let TexasUtils = require("TexasUtils");
let MsgManager = require("MsgManager");
let Utils = require("Utils");
let MSG = require("Msg_Texas");
let CMD = require("protocol_texas");
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
        scrollViewContent : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        this.scrollViewContent.getChildByName("selfCheckTip").getComponent(cc.Label).enabled = true;
    },

    init(data)
    {
        MsgManager.on(MSG.NOTIFY.ClubDeZhouHashCardRsp_ui, this._onGetClubDeZhouHashCard, this);

        this.scrollViewContent.getChildByName("selfCheckTip").active = true;

        // this.scrollViewContent.getChildByName("selfCheckBtn").active = true;
        this.scrollViewContent.getChildByName("verifiedCards").active = false;

        this.showScollView(false)

        this.initData = data;

        var seed = ((data.seed || "未知牌局") + "").replace(/^kk/i, "HP");
        this.scrollViewContent.getChildByName("seed").getChildByName("value").getComponent(cc.Label).string = seed
        this.scrollViewContent.getChildByName("turn").getChildByName("value").getComponent(cc.Label).string = "Hand " + data.nPlayCnt;

        this.scrollViewContent.getChildByName("shuffleTime").getChildByName("value").getComponent(cc.Label).string =  data.sTime + "";
        this.scrollViewContent.getChildByName("hashTime").getChildByName("value").getComponent(cc.Label).string =  data.sTime + "";
        this.scrollViewContent.getChildByName("sendCardsTime").getChildByName("value").getComponent(cc.Label).string =  data.fTime + "";

        this.scrollViewContent.getChildByName("cardsHash").getChildByName("value").getComponent(cc.Label).string =  data.hash + ""
        this.scrollViewContent.getChildByName("showCards").getChildByName("value").getComponent(cc.Label).string =  data.cards + ""
    },

    _onGetClubDeZhouHashCard(data){
    },

    onClickClose(){ 
        this.node.active = false;
        MsgManager.un(this._onGetClubDeZhouHashCard);
    },

    showScollView(bo){
        if(bo){
            this.scrollViewContent.height = 1740
            this.scrollViewContent.getChildByName("selfCheckTip").y = -1410
        }else{
            this.scrollViewContent.height = 1580
            this.scrollViewContent.getChildByName("selfCheckTip").y = -1260
        }
    },

    onClickVerify(){
        this.scrollViewContent.getChildByName("selfCheckTip").active = true;

        // this.scrollViewContent.getChildByName("selfCheckBtn").active = false;

        this.scrollViewContent.getChildByName("verifiedCards").active = true;
       
        this.showScollView(true)

        this.scrollViewContent.getChildByName("verifiedCards").getChildByName("value").getComponent(cc.Label).string = this.initData.hash + ""
    },  

    // update (dt) {},
});
