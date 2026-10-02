// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;
let i18n = require("i18n");
let Utils = require("Utils");
let MttCacheData = require("MttCacheData");
let Base64 = require("base64");
let MSG = require("Msg_club");
let MsgManager = require("MsgManager");

cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            default: null,
            type: cc.Node,
        },
        rulePanel: {
            default: null,
            type: cc.Node,
        },
        listView: {
            default: null,
            type: cc.ScrollView,
        },

        playerPanel: {
            default: null,
            type: cc.Node,
        },

        playerItem: {
            default: null,
            type: cc.Node,
        },

        awardItem: {
            default: null,
            type: cc.Node,
        },
        awardPanel: {
            default: null,
            type: cc.Node,
        },

        
        blindbetItem: {
            default: null,
            type: cc.Node,
        },
        blindbetPanel: {
            default: null,
            type: cc.Node,
        },

        blindbetList: {
            default: null,
            type: cc.Node,
        },


        _data:null,
    },
    start () {

    },

    init(data){
        this._data = data;
        cc.log("MttRule:init",data)

        if(this.title){
            this.title.getComponent(cc.Label).string = data.sName;
        }
        this.initRule();
    },


    //场景显示
    onEnable(){
        cc.log("MttRule:onEnable")
        target.on(event.RESIZE, this._onResized, this);
        MsgManager.on(MSG.NOTIFY.MTT_PLAYERLIST_REFRESH, this.updatePlayers, this);
        MsgManager.on(MSG.NOTIFY.MTT_AWARDLIST_REFRESH, this.updateAwards, this);
        this._onResized();
    },
    //场景隐藏
    onDisable(){
        cc.log("MttRule:onDisable")
        target.targetOff(this);
        MsgManager.un(this.updatePlayers,this);
        MsgManager.un(this.updateAwards,this);
    },
    _onResized() {
    },
    onMenuCallback(event, customEventData){
        cc.log("MttRule:onMenuCallback",event.name)

        if(event && event.name == "btn_rule<Toggle>"){
            this.initRule();
        }else if(event && event.name == "btn_player<Toggle>"){
            this.initPlayer();
        }else if(event && event.name == "btn_award<Toggle>"){
            this.initAward();
        }else if(event && event.name == "btn_blindbet<Toggle>"){
            this.initBlindbet();
        }
    },

    onClose(){
        this.node.destroy();
    },


    updatePlayers(){
        this.createPlayer();
    },

    updateAwards(){
        this.createAward();
    },


    reset(){
        if(this.rulePanel){
            this.rulePanel.active = false;
        }
        if(this.playerPanel){
            this.playerPanel.active = false;
        }
        if(this.awardPanel){
            this.awardPanel.active = false;
        }
        if(this.blindbetPanel){
            this.blindbetPanel.active = false;
        }
    },

    update(dt){
        this.updateRule();
    },
    
    updateRule(){
        if(this.rulePanel && this.rulePanel.active){
            this.initBattleinfo(this.rulePanel.getChildByName("battleinfo"));
            this.initStartbattleinfo(this.rulePanel.getChildByName("startbattleinfo"));
        }
    },

    initRule(){
        this.reset();
        if(!this._data){
            return
        }

        if(this.rulePanel){
            this.rulePanel.active = true;
            this.rulePanel.opacity = 0;

            this.rulePanel.runAction(cc.fadeIn(0.1))

            this.initChargeInfo(this.rulePanel.getChildByName("chargeInfo"));
            this.initServiceInfo(this.rulePanel.getChildByName("serviceInfo"));
            this.initInitialscoringInfo(this.rulePanel.getChildByName("initialscoringInfo"));
            this.initMinpeopleinfo(this.rulePanel.getChildByName("minpeopleinfo"));
            this.initTablepeopleinfo(this.rulePanel.getChildByName("tablepeopleinfo"));
            this.initRepurchaseinfo(this.rulePanel.getChildByName("repurchaseinfo"));
            this.initBattleinfo(this.rulePanel.getChildByName("battleinfo"));
            this.initStartbattleinfo(this.rulePanel.getChildByName("startbattleinfo"));
        }
        if(this.listView){
            this.listView.scrollToTop();
        }
    },

    initPlayer(){
        this.reset();
        if(!this._data){
            return
        }

        if(clubMtt){
            clubMtt.getUsers(this._data.nEventId);
        }
        if(this.playerPanel){
            this.playerPanel.active = true;
            this.playerPanel.opacity = 0;
            this.playerPanel.runAction(cc.fadeIn(0.1))

            this.createPlayer();
        }
        
        if(this.listView){
            this.listView.scrollToTop();
        }
    },

    //创建玩家
    createPlayer(){


        var tag = 250;
        this.playerPanel.stopActionByTag(tag);
        var players = MttCacheData.getPlayers();
        var num = 0;

        var createItem = ()=>{
            //刷新现有的
            if(players.length == num){
                this.playerPanel.stopActionByTag(tag);
                return;
            }
            var sum = this.playerPanel.children.length;
            if(num < sum){
                let node = this.playerPanel.children[num]
                if(cc.isValid(node)){
                    node.active = true;
                    this.initPlayerItem(node,players[num]);
                    num = num + 1;
                    return;
                }
            }
            let item = cc.instantiate(this.playerItem);
            this.playerPanel.addChild(item);
            item.active = true;
            this.initPlayerItem(item,players[num]);
            num = num + 1;
        }

        let action = cc.repeatForever(cc.sequence(cc.delayTime(0),cc.callFunc(()=>{
            createItem();
        })))
        action.setTag(tag);
        this.playerPanel.runAction(action)
        createItem();


    },

    initPlayerItem(node,data){

        let head_img = node.getChildByName("head_img");
        let name = node.getChildByName("name");
        let chip = node.getChildByName("chip");

        let txt = i18n.t("CLUB_MTT.Rule.32")
        txt = txt.replace(/\[chip]/g, data.nChip);

        Utils.changeUserHead(head_img.getComponent(cc.Sprite),data.sFaceId);
        name.getComponent(cc.Label).string = Base64.decode(data.sName);
        if(data.nChip < 0){//未开赛
            chip.active = false;
        }else{
            chip.active = true;
            chip.getComponent(cc.Label).string = txt;
        }

    },


    initAward(){
        this.reset();
        if(!this._data){
            return
        }

        if(clubMtt){
            clubMtt.getAwards(this._data.nEventId);
        }
        if(this.awardPanel){
            this.awardPanel.active = true;
            this.awardPanel.opacity = 0;
            this.awardPanel.runAction(cc.fadeIn(0.1))
            this.createAward();
        }
        if(this.listView){
            this.listView.scrollToTop();
        }
    },

    //创建奖励列表
    createAward(){
        var tag = 250;
        this.awardPanel.stopActionByTag(tag);
        var awards = MttCacheData.getAwards();
        var num = 0;
        var createItem = ()=>{
            //刷新现有的
            if(awards.length == num){
                this.awardPanel.stopActionByTag(tag);
                return;
            }
            var sum = this.awardPanel.children.length;
            if(num < sum){
                let node = this.awardPanel.children[num]
                if(cc.isValid(node)){
                    node.active = true;
                    this.initAwardItem(node,awards[num]);
                    num = num + 1;
                    return;
                }
            }
            let item = cc.instantiate(this.awardItem);
            this.awardPanel.addChild(item);
            item.active = true;
            this.initAwardItem(item,awards[num]);
            num = num + 1;
        }

        let action = cc.repeatForever(cc.sequence(cc.delayTime(0),cc.callFunc(()=>{
            createItem();
        })))
        action.setTag(tag);
        this.awardPanel.runAction(action)
        createItem();
    },

    initAwardItem(node,data){

        let level_1 = node.getChildByName("level_1");
        let level_2 = node.getChildByName("level_2");
        let level_3 = node.getChildByName("level_3");
        let level = node.getChildByName("level");
        let gold = node.getChildByName("gold");
        
        level_1.active = false;
        level_2.active = false;
        level_3.active = false;
        level.active = false;

        if(data.nRank == 1){
            level_1.active = true;
        }else if(data.nRank == 2){
            level_2.active = true;
        }else if(data.nRank == 3){
            level_3.active = true;
        }else{
            level.active = true;
            level.getComponent(cc.Label).string = data.nRank + "";
        }
        let txt = ""
        if(data.nCoin > 0 && data.nTicket > 0){
            txt = i18n.t("CLUB_MTT.Rule.36")
            txt = txt.replace(/\[gold]/g, data.nCoin);
            txt = txt.replace(/\[num]/g, data.nTicket);
        }else if(data.nTicket > 0){
            txt = i18n.t("CLUB_MTT.Rule.35")
            txt = txt.replace(/\[num]/g, data.nTicket);
        }else{
            txt = i18n.t("CLUB_MTT.Rule.34")
            txt = txt.replace(/\[gold]/g, data.nCoin);
        }
        gold.getComponent(cc.Label).string = txt

    },


    initBlindbet(){
        this.reset();
        if(!this._data){
            return
        }
        if(this.blindbetPanel){
            this.blindbetPanel.active = true;
            this.blindbetPanel.opacity = 0;
            this.blindbetPanel.runAction(cc.fadeIn(0.1))
            this.createBlindbet();
        }
        if(this.listView){
            this.listView.scrollToTop();
        }
    },

    //创建盲注列表
    createBlindbet(){
        var tag = 250;
        this.blindbetList.stopActionByTag(tag);
        var arrLvItem = this._data.arrLvItem;
        var num = 0;
        var createItem = ()=>{
            //刷新现有的
            if(arrLvItem.length == num){
                this.blindbetList.stopActionByTag(tag);
                return;
            }
            var sum = this.blindbetList.children.length;
            if(num < sum){
                let node = this.blindbetList.children[num]
                if(cc.isValid(node)){
                    node.active = true;
                    this.initBlindbetItem(node,arrLvItem[num]);
                    num = num + 1;
                    return;
                }
            }
            let item = cc.instantiate(this.blindbetItem);
            this.blindbetList.addChild(item);
            item.active = true;
            this.initBlindbetItem(item,arrLvItem[num]);
            num = num + 1;
        }

        let action = cc.repeatForever(cc.sequence(cc.delayTime(0),cc.callFunc(()=>{
            createItem();
        })))
        action.setTag(tag);
        this.blindbetList.runAction(action)
        createItem();
    },

    initBlindbetItem(node,data){
        let level = node.getChildByName("level");
        let r = node.getChildByName("r");
        let a = node.getChildByName("a");
        let blindbet = node.getChildByName("blindbet");
        let preante = node.getChildByName("preante");
        r.active = false;
        a.active = false;
        level.getComponent(cc.Label).string = data.nLv;
        if(data.nRA == 1){
            r.active = true;
        }
        if(data.nRA == 2){
            a.active = true;
        }
        blindbet.getComponent(cc.Label).string = data.nSmallB + "/" + data.nBigB;
        if(data.hasOwnProperty("nPreAnte")){
            preante.getComponent(cc.Label).string = data.nPreAnte + "";
        }else{
            preante.getComponent(cc.Label).string = "0";
        }
    },
    
    //初始报名费信息
    initChargeInfo(node){
        if(node){
            node.active = true;
            let info = node.getChildByName("info")
            let infoTxt = info.getChildByName("info")
            let ticketsinfo = info.getChildByName("ticketsinfo")


            let offsetH = 30;
            let curHeight = 0;
            if(this._data.tFeeSignUp.nFeeType == 1){//免费
                ticketsinfo.active = false;
                infoTxt.active = true;
                infoTxt.getComponent(cc.Label).lang = "CLUB_MTT.Rule.20";
                curHeight = curHeight + infoTxt.height;

            }else if(this._data.tFeeSignUp.nFeeType == 2){//仅门票
                ticketsinfo.active = true;
                infoTxt.active = true;
                let txt = i18n.t("CLUB_MTT.Rule.19")
                txt = txt.replace(/\[TicketNeed]/g, this._data.tFeeSignUp.nTicketNeed);
                let ticketsinfoTxt = i18n.t("CLUB_MTT.Rule.31")
                ticketsinfoTxt = ticketsinfoTxt.replace(/\[num]/g, this._data.nTicketOwn);
                ticketsinfo.getComponent(cc.Label).string = ticketsinfoTxt
                infoTxt.getComponent(cc.Label).string = txt
                infoTxt.getComponent(cc.Label)._forceUpdateRenderData(true);
                ticketsinfo.getComponent(cc.Label)._forceUpdateRenderData(true);
                ticketsinfo.y = infoTxt.y - infoTxt.height;
                curHeight = curHeight + infoTxt.height;
                curHeight = curHeight + ticketsinfo.height;

            }else{
                ticketsinfo.active = true;
                infoTxt.active = true;
                let txt = i18n.t("CLUB_MTT.Rule.18")
                txt = txt.replace(/\[TicketNeed]/g, this._data.tFeeSignUp.nTicketNeed);
                txt = txt.replace(/\[gold]/g, this._data.tFeeSignUp.nFeeA);
                let ticketsinfoTxt = i18n.t("CLUB_MTT.Rule.31")
                ticketsinfoTxt = ticketsinfoTxt.replace(/\[num]/g, this._data.nTicketOwn);
                ticketsinfo.getComponent(cc.Label).string = ticketsinfoTxt
                infoTxt.getComponent(cc.Label).string = txt
                infoTxt.getComponent(cc.Label)._forceUpdateRenderData(true);
                ticketsinfo.getComponent(cc.Label)._forceUpdateRenderData(true);
                ticketsinfo.y = infoTxt.y - infoTxt.height;
                curHeight = curHeight + infoTxt.height;
                curHeight = curHeight + ticketsinfo.height;

            }

            curHeight = curHeight + offsetH;
            info.height = curHeight;
            let layout = node.getComponent(cc.Layout);
            if(layout){
                layout.updateLayout();
            }
        }
    },

    //初始化服务费信息
    initServiceInfo(node){
        if(node){
            node.active = true;
            let info = node.getChildByName("info")
            let infoTxt = info.getChildByName("info")
            let offsetH = 30;
            let curHeight = 0;
            infoTxt.active = true;
            let txt = i18n.t("CLUB_MTT.Rule.21")
            txt = txt.replace(/\[gold]/g, this._data.tFeeSignUp.nFeeB);
            infoTxt.getComponent(cc.Label).string = txt
            infoTxt.getComponent(cc.Label)._forceUpdateRenderData(true);
            curHeight = curHeight + infoTxt.height;
            curHeight = curHeight + offsetH;
            info.height = curHeight;
            let layout = node.getComponent(cc.Layout);
            if(layout){
                layout.updateLayout();
            }
        }
    },

    //初始化初始筹码
    initInitialscoringInfo(node){
        if(node){
            node.active = true;
            let info = node.getChildByName("info")
            let infoTxt = info.getChildByName("info")
            let offsetH = 30;
            let curHeight = 0;
            infoTxt.active = true;
            let txt = i18n.t("CLUB_MTT.Rule.22")
            txt = txt.replace(/\[score]/g, this._data.nTakeIn);
            txt = txt.replace(/\[num]/g, this._data.nUserCntMax);
            infoTxt.getComponent(cc.Label).string = txt
            infoTxt.getComponent(cc.Label)._forceUpdateRenderData(true);
            curHeight = curHeight + infoTxt.height;
            curHeight = curHeight + offsetH;
            info.height = curHeight;
            let layout = node.getComponent(cc.Layout);
            if(layout){
                layout.updateLayout();
            }
        }
    },

    initMinpeopleinfo(node){
        if(node){
            node.active = true;
            let info = node.getChildByName("info")
            let infoTxt = info.getChildByName("info")
            let offsetH = 30;
            let curHeight = 0;
            infoTxt.active = true;
            let txt = i18n.t("CLUB_MTT.Rule.23")
            txt = txt.replace(/\[num]/g, this._data.nCntBegin);
            txt = txt.replace(/\[time]/g, this._data.nBlindUpGap);
            infoTxt.getComponent(cc.Label).string = txt
            infoTxt.getComponent(cc.Label)._forceUpdateRenderData(true);
            curHeight = curHeight + infoTxt.height;
            curHeight = curHeight + offsetH;
            info.height = curHeight;
            let layout = node.getComponent(cc.Layout);
            if(layout){
                layout.updateLayout();
            }
        }
    },

    initTablepeopleinfo(node){
        if(node){
            node.active = true;
            let info = node.getChildByName("info")
            let infoTxt = info.getChildByName("info")
            let offsetH = 30;
            let curHeight = 0;
            infoTxt.active = true;
            let txt = i18n.t("CLUB_MTT.Rule.24")
            txt = txt.replace(/\[num]/g, this._data.nUserCntOfTable);
            infoTxt.getComponent(cc.Label).string = txt
            infoTxt.getComponent(cc.Label)._forceUpdateRenderData(true);
            curHeight = curHeight + infoTxt.height;
            curHeight = curHeight + offsetH;
            info.height = curHeight;
            let layout = node.getComponent(cc.Layout);
            if(layout){
                layout.updateLayout();
            }
        }
    },

    initRepurchaseinfo(node){
        if(node){
            node.active = true;
          

            let info1 = node.getChildByName("info1")
            if(info1){

                let offsetH = 30;
                let curHeight = 0;
                let infoTxt = info1.getChildByName("info")
                infoTxt.active = true;
                let txt = ""
                if(this._data.tFeeR.nFeeType == 1){//免费
                    txt = i18n.t("CLUB_MTT.Rule.27")
                    txt = txt.replace(/\[level]/g, this._data.tEvtTakInR.nLevel);
                    txt = txt.replace(/\[num]/g, this._data.tEvtTakInR.nCnt);
                    txt = txt.replace(/\[chip]/g, this._data.tEvtTakInR.nChip);
                }else if(this._data.tFeeR.nFeeType == 2){//仅门票
                    txt = i18n.t("CLUB_MTT.Rule.26")
                    txt = txt.replace(/\[level]/g, this._data.tEvtTakInR.nLevel);
                    txt = txt.replace(/\[num]/g, this._data.tEvtTakInR.nCnt);
                    txt = txt.replace(/\[TicketNeed]/g, this._data.tFeeR.nTicketNeed);
                    txt = txt.replace(/\[chip]/g, this._data.tEvtTakInR.nChip);
                }else{
                    txt = i18n.t("CLUB_MTT.Rule.25")
                    txt = txt.replace(/\[level]/g, this._data.tEvtTakInR.nLevel);
                    txt = txt.replace(/\[num]/g, this._data.tEvtTakInR.nCnt);
                    txt = txt.replace(/\[gold]/g, this._data.tFeeR.nFeeB);
                    txt = txt.replace(/\[TicketNeed]/g, this._data.tFeeR.nTicketNeed);
                    txt = txt.replace(/\[chip]/g, this._data.tEvtTakInR.nChip);
                }
                infoTxt.getComponent(cc.Label).string = txt
                infoTxt.getComponent(cc.Label)._forceUpdateRenderData(true);
                curHeight = curHeight + infoTxt.height;

                curHeight = curHeight + offsetH;
                info1.height = curHeight;
            }

            let info2 = node.getChildByName("info2")
            if(info2){

                let offsetH = 30;
                let curHeight = 0;

                let infoTxt = info2.getChildByName("info")
                infoTxt.active = true;
                let txt = ""
                if(this._data.tFeeA.nFeeType == 1){//免费
                    txt = i18n.t("CLUB_MTT.Rule.30")
                    txt = txt.replace(/\[level]/g, this._data.tEvtTakInA.nLevel);
                    txt = txt.replace(/\[num]/g, this._data.tEvtTakInA.nCnt);
                    txt = txt.replace(/\[chip]/g, this._data.tEvtTakInA.nChip);
                }else if(this._data.tFeeA.nFeeType == 2){//仅门票
                    txt = i18n.t("CLUB_MTT.Rule.29")
                    txt = txt.replace(/\[level]/g, this._data.tEvtTakInA.nLevel);
                    txt = txt.replace(/\[num]/g, this._data.tEvtTakInA.nCnt);
                    txt = txt.replace(/\[TicketNeed]/g, this._data.tFeeA.nTicketNeed);
                    txt = txt.replace(/\[chip]/g, this._data.tEvtTakInA.nChip);
                }else{
                    txt = i18n.t("CLUB_MTT.Rule.28")
                    txt = txt.replace(/\[level]/g, this._data.tEvtTakInA.nLevel);
                    txt = txt.replace(/\[num]/g, this._data.tEvtTakInA.nCnt);
                    txt = txt.replace(/\[gold]/g, this._data.tFeeA.nFeeB);
                    txt = txt.replace(/\[TicketNeed]/g, this._data.tFeeA.nTicketNeed);
                    txt = txt.replace(/\[chip]/g, this._data.tEvtTakInA.nChip);
                }
                infoTxt.getComponent(cc.Label).string = txt
                infoTxt.getComponent(cc.Label)._forceUpdateRenderData(true);
                curHeight = curHeight + infoTxt.height;

                curHeight = curHeight + offsetH;
                info2.height = curHeight;
            }
            let layout = node.getComponent(cc.Layout);
            if(layout){
                layout.updateLayout();
            }
        }
    },

    initBattleinfo(node){
        if(node){
            if(this.isStartGame()){
                if(!node.active){
                    node.active = true;
                }
                if(node.opacity < 255){
                    let value = node.opacity
                    value = value + 10;
                    if(value > 255){
                        value = 255;
                    }
                    node.opacity = value;
                }
                let info = node.getChildByName("info")
                let num1 = info.getChildByName("num1")
                let num2 = info.getChildByName("num2")
                let num3 = info.getChildByName("num3")
                let num4 = info.getChildByName("num4")
                let num5 = info.getChildByName("num5")

                let curDate = new Date(this._data.tSt.nBlindUpR * 1000);

                num1.getComponent(cc.Label).string = this._data.tSt.nUserCnt;
                num2.getComponent(cc.Label).string = this.format("mm:ss",curDate);
                num3.getComponent(cc.Label).string = this._data.tSt.nBlindLevel;

                
                num4.getComponent(cc.Label).string = this._data.tSt.nChipAvg;
                num5.getComponent(cc.Label).string = this._data.tSt.nLevelUpTo;
            }else{
                node.opacity = 0;
                node.active = false;
            }
        }
    },

    initStartbattleinfo(node){
        if(node){
            if(this.isStartGame()){
                node.opacity = 0;
                node.active = false;
            }else{
                if(!node.active){
                    node.active = true;
                }

                if(node.opacity < 255){
                    let value = node.opacity
                    value = value + 10;
                    if(value > 255){
                        value = 255;
                    }
                    node.opacity = value;
                }

                let info = node.getChildByName("info")
                let num = info.getChildByName("num")
                num.getComponent(cc.Label).string = this.getStartTime();
            }
        }
    },

    getStartTime(){
        let data  = this._data;
        let timeBefore = ""
        let mttData = new Date(data.nTimeStampBegin * 1000);
        let curDate = new Date();
        if(curDate.getDate() == mttData.getDate()){
            timeBefore = this.format(i18n.t("CLUB_MTT.TimeFormat3"),mttData)
        }else{
            timeBefore = this.format(i18n.t("CLUB_MTT.TimeFormat2"),mttData)
        }
        if(!this.isStartGame()){
            if(data.nTimeStampBegin > data.nTimeStampNow){
                let offsetTime = data.nTimeStampBegin - data.nTimeStampNow;
                if(this.isBeforeTime()){
                    if(offsetTime < 0){
                        offsetTime = 0
                    }
                    timeBefore = this.format(i18n.t("CLUB_MTT.TimeFormat1"),new Date(Math.floor(offsetTime * 1000)))
                }
            }
        }
        return timeBefore;
    },

    isBeforeTime(){
        let data  = this._data;
        if(!this.isStartGame()){
            if(data.nTimeStampBegin > data.nTimeStampNow){
                let offsetTime = data.nTimeStampBegin - data.nTimeStampNow;
                let beforeTime = 1 * 60 * 60;
                if(offsetTime <= beforeTime){
                    return true;
                }
            }
        }
        return false;
    },
    format(format, date) {
        let o = {
            "M+": date.getMonth() + 1,                      // month 
            "d+": date.getDate(),                           // day 
            "h+": date.getHours(),                          // hour 
            "m+": date.getMinutes(),                        // minute 
            "s+": date.getSeconds(),                        // second 
            "q+": Math.floor((date.getMonth() + 3) / 3),    // quarter 
            "S": date.getMilliseconds()                     // millisecond 
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },

    isStartGame(){
        if(this._data.nStage == 3 || this._data.nStage == 4 || this._data.nStage == 5 || this._data.nStage == 6 || this._data.nStage == 10){
            return true;
        }
        return false;
    },

});
