// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let AppWebApi = require("AppWebApi");
let Utils = require("Utils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let UIFrame = require("UIFrame");
let LocalStorage = require("LocalStorage");
let clubGameConfig = require("clubGameConfig");
let i18n = require("i18n");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let HallClubLogic = require("HallClubLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        headPos: cc.Node,
        headItem: cc.Node,

        lab_hasRec: cc.Label,
        lab_notRec: cc.Label,
        goldList: {
            default: [],
            type: cc.Label,
        },

        help: cc.Node,
        btn_receive: cc.Node,
        sharePrefab: cc.Prefab,
        panel1: cc.Node,
        panel2: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
        // this.initUI();
        // this.initHeadList([]);
    },

    // update (dt) {},

    unRegiester(){
        MsgManager.un(this._onDrawActivityReward);
        MsgManager.un(this._onActivityCfg);
    },

    regiester(){
        this.unRegiester();
        MsgManager.on(MSG.NOTIFY.ClubDrawActivityRewardRsp_ui, this._onDrawActivityReward, this);
        MsgManager.on(MSG.NOTIFY.ClubActivityCfgRsp_ui, this._onActivityCfg, this);
    },

    _onDrawActivityReward(data){
        if (data.nRlt == 1){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP0"));
            if (this.control){
                this.control.getAtivityInfo(true);
            }

            this._acInfo.nHasAwardCount = this._acInfo.nHasAwardCount + this._acInfo.nAwardCount;
            this._acInfo.nAwardCount = 0;
            this._acInfo.nGetStatus = 1;
            this.initUI();
        }else if(data.nRlt == -2){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP2"));
        }else if(data.nRlt == -4){
            UIFrame.showTips(Utils.replaceAll(i18n.t("CLUB_ACTIVITY.ERROR_TIP3"), "SSS", data.nJushu));
        }else{
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP1"));
        }
    },

    _onActivityCfg(data){
        this._shareUrl = data.sRecommendShareUrl;
    },

    init(control, data){
        this.regiester();
        this.control = control;
        this._acInfo = data;
        this.initUI();
        this.getShareUrl();
    },

    initUI(){
        this.initGold();
        this.initHeadList(this._acInfo.userList);
        this.setBtnStatus();
        this.initBg();
    },

    initBg(){
        let language = LocalStorage.getSysLanguage();
        let config = HallClubLogic.getReConfig("bg1_t_" + language);
        let url1 = config && config.url;
        config = HallClubLogic.getReConfig("bg2_t_" + language);
        let url2 = config && config.url;

        if (url1){
            this.loadImg(this.panel1, url1);
        }

        if (url2){
            this.loadImg(this.panel2, url2);
        }

       if (language == "kh" || language == "id"){
            this.lab_hasRec.node.parent.x = -118;
            this.lab_notRec.node.parent.x = -118;
       }else if(language == "zh" || language == "zh_tw"){
                this.lab_hasRec.node.parent.x = -230;
                this.lab_notRec.node.parent.x = -230;
       }else{
            this.lab_hasRec.node.parent.x = -190;
            this.lab_notRec.node.parent.x = -190;
       }
    },

    loadImg(bg, url){
        cc.assetManager.loadRemote(url, function (error, texture) { 
            if(error) {
                QYLogs.error("activityMain", "加载资源出错: url=" + url, error);
            }
            else{
                if (cc.isValid(bg)){
                    let spriteFrame = new cc.SpriteFrame(texture);
                    bg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
                
            }
        }.bind(this))
    },

    initGold(){
        this.config_gold = clubGameConfig.CLUB_RECOMMEND_REWARD;
        let totalGold = clubGameConfig.CLUB_RECOMMEND_TOTALGOLD;
        for (let i = 0; i < this.goldList.length; i++) {
            this.goldList[i].string = this.config_gold[i];
        }

        let notRecGold = this._acInfo.nAwardCount || 0;
        let hasRecGold = this._acInfo.nHasAwardCount || 0;

        this.lab_hasRec.string = hasRecGold + "/" + totalGold;
        this.lab_notRec.string = notRecGold;
    },

    initHeadList(data){
        if (!data || data.length == 0){
            return;
        }
        let list = this.headPos.children;
        for (let i = 0; i < data.length; i++) {
            let child = list[i];
            if (child){
                let item = cc.instantiate(this.headItem);
                let sName = item.getChildByName("sName").getComponent(cc.Label);
                Utils.changeUserHead(item.getComponent(cc.Sprite), data[i].sFaceId, app.ClubAssets);
                sName.string = Base64.decode(data[i].sName);
                child.addChild(item);
            }
           
        }
    },

    setBtnStatus(){
        let nor = this.btn_receive.getChildByName("nor");
        let dis = this.btn_receive.getChildByName("dis");
        nor.active = this._acInfo.nGetStatus == 0;
        dis.active = this._acInfo.nGetStatus != 0;
    },

    drawReward(){
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            nActivityType: this._acInfo.nActivityType || 0,
            nRewardId: 0,
            
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubDrawActivityRewardReq_CMD, params);
    },

    getShareUrl(){
        let params = {
            nCfgType: 1,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubActivityCfgReq_CMD, params);
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickShare(){
        let node = cc.instantiate(this.sharePrefab);
        this.node.addChild(node);
        let HallShareView = node.getComponent("HallShareView");
        if(HallShareView){
            HallShareView.init(1, this._shareUrl + UserInfo.getInfo().nUserID);
        }
    },

    onClickRec(){
        let dis = this.btn_receive.getChildByName("dis");
        if (dis.active){
            return;
        }
        this.drawReward();
    },

    onClickDescribe(){
        this.showHelp(true);
    },

    showHelp(isShow){
        this.help.active = isShow;
    },

    onClickCloseHelp(){
        this.showHelp(false);
    },
});
