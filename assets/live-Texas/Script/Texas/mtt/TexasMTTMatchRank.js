let TexasUtils = require("TexasUtils");
let Base64 = require("base64");
let Utils = require("Utils");
const i18n = require('i18n');
let TexasData = require("TexasData");
let CMD = require("protocol_texas");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");

cc.Class({
    extends: cc.Component,

    properties: {
        rank:cc.Node, //有排名界面
        noRank:cc.Node, //没有排名界面

        label_rank:cc.Label, //排名
        label_noRank: cc.Label,//没有排名名次

        reward1: cc.Node,
        reward2: cc.Node,

        btn_return: cc.Node,
        btn_backLookOn: cc.Node,

    },

    onLoad() {
    },

    start () {
        
    },

    onDestroy() {

    },

    onEnable(){
        MsgManager.on(MSG.NOTIFY.NOTIFY_MTT_MATCH_END, this.setBtn, this);
    },

    onDisable(){
        MsgManager.un(this.setBtn);
    },

    update(dt){
        
    },

    init(data, callBack){
        this.callBack = callBack;
        this.rank.active = false;
        this.noRank.active = false;

        if (data.isAward){
            this.rank.active = true;
            this.initRank(data);
        }else{
            this.noRank.active = true;
            this.initNoRank(data);
        }

        this.setBtn();
    },

    initRank(data){
        this.label_rank.string = data.nRank;
        this.reward1.active = false;
        this.reward2.active = false;

        if (data.nCoin){
            this.reward1.active = true;
            let label_name = this.reward1.getChildByName("label_name").getComponent(cc.Label);
            let label_count = this.reward1.getChildByName("label_count").getComponent(cc.Label);
            label_name.string = TexasUtils._getText(74);
            label_count.string = "X" + data.nCoin;
        }

        if(data.nTicket){
            this.reward2.active = true;
            let label_name = this.reward1.getChildByName("label_name").getComponent(cc.Label);
            let label_count = this.reward1.getChildByName("label_count").getComponent(cc.Label);
            label_name.string = TexasUtils._getText(211);
            label_count.string = "X" + data.nCoin;
        }

        let title = this.rank.getChildByName("title").getComponent(cc.Label);
        if (title){
            title.string = Base64.decode(TexasData._getCurTableName());
        }

        
    },

    initNoRank(data){
        this.label_noRank.string = data.nRank;
        let title = this.noRank.getChildByName("title").getComponent(cc.Label);
        if (title){
            title.string = Base64.decode(TexasData._getCurTableName());
        }
    },

    setBtn(){
        if (TexasData.getMttMatchEnd()){
            this.btn_return.active = true;
            this.btn_return.x = 0;
            this.btn_backLookOn.active = false;
        }else{
            this.btn_return.active = true;
            this.btn_backLookOn.active = true;
            this.btn_return.x = -156;
        }
    },

   
    btnReturn(){
        if(this.callBack){
            this.callBack();
        }
        this.node.active = false;
    },

    btnBackLookOn(){
        TexasData.setIsMttUser(false);
        this.node.active = false;
    },

    btnShare(){

    }

    
});