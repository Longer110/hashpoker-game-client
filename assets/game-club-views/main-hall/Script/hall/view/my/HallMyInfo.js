// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let Msg_login = require('Msg_login');
let LocalStorage = require("LocalStorage");
let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;
let HallClubLogic = require("HallClubLogic");
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
        label_name: cc.Label,
        label_ID: cc.Label,
        // label_sign: cc.Label,
        // label_redPoint_num: cc.Label,
        // vip: cc.Node,
        // noVip: cc.Node,
        // nRecharge: cc.Node,
        // nPanel: cc.Node,
        // label_gold: cc.Label,
        // label_diamond: cc.Label,
        // cashLabel: cc.Label,
        // noCashLabel: cc.Label,
        // prefabSetting: cc.Prefab,
        prefabChange: cc.Prefab,
        systemHead: cc.Prefab,
        // prefabNotice: cc.Prefab,
        // prefabShop: cc.Prefab,
        // prefabPay: cc.Prefab,
        // prefabSecurityPsw: cc.Prefab,
        // noticeRedPoint: cc.Node,
        // infoPanel: cc.Node,
        // prefabExchange: cc.Prefab,
        // prefabRechargeRecord: cc.Prefab,
        // infoTitle: cc.Node,
        // cash: cc.Label,
        // noCash: cc.Label,
        // re_label: cc.Label,
        // tx_label: cc.Label,
        // helpPanel: cc.Sprite,
        // activityRedPoint: cc.Node,

        // gold_label: cc.Label,
        // diamond_label: cc.Label,
        
        // prefabDiamondShop: cc.Prefab,
        // prefabBill: cc.Prefab,
        // prefabLanguage: cc.Prefab,
        // prefabAgree: cc.Prefab,
        // prefabRecharge: cc.Prefab,
        // prefabCustomerService: cc.Prefab,
        // prefabChannel: cc.Prefab,

        // _prefabs: [],
        // _userInfo: null,
        // _redPointData: [],
        // _clubShop: null,
        // _mySetting: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.regiester();
        this.getMyInfo();
        app.util.addClickSoundToNode(this.node);
    },

    start() {
        if (app.config.LANG == "en"){
            let label_title = this.node.getChildByName("content").getChildByName("top").getChildByName("label_title").getComponent(cc.Label);
            label_title.string = label_title.string.toUpperCase();
        }

       
    },

    init(activityIndex){
        // this.infoPanel.active = false;

        // this.initRe();
        // this._setAuditSwitch();
        this.regiester();
        this.getMyInfo();
        // this.getUserRedDot();

        // if (activityIndex){
        //     this.node.active = false;
        //     this.onClickActivity();
        // }
    },

    onDisable(){
        let node = this.node.getChildByName("popup");
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            if (child){
                child.destroy();
            }
            
        }
    },

    onDestroy() {
        this.unRegiester();
    },

    unRegiester(){
        MsgManager.un(this._onUserInfo);
        MsgManager.un(this._onUserRedDot);
        MsgManager.un(this._onSetSecurityPsw);
        MsgManager.un(this.onOpenClubPay);
        MsgManager.un(this.onUserMsgNotify);
        MsgManager.un(this.onCorrCapital);
        MsgManager.un(this._onPayInfo);
        MsgManager.un(this._onCashInfo);
        MsgManager.un(this._onClubsFileConfig);
        MsgManager.un(this._onGetValueByKey);

        target.targetOff(this);
    },

    regiester() {
        this.unRegiester();
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoResp_ui, this._onUserInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserRedDotResp_ui, this._onUserRedDot, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserMsgNotify_ui, this.onUserMsgNotify, this);
        MsgManager.on(MSG.NOTIFY.OPEN_CLUB_SHOP_PAY, this.onOpenClubPay, this);
        MsgManager.on(MSG.NOTIFY.SET_SECURITY_PSW, this._onSetSecurityPsw, this);
        MsgManager.on(Msg_login.GATEWAY.SUB_CORR_CAPITAL, this.onCorrCapital, this); //网关金币更新
        MsgManager.on(MSG.NOTIFY.ClubSPayInfoRep_ui, this._onPayInfo, this); //充值信息返回
        MsgManager.on(MSG.NOTIFY.ClubSCashInfoRep_ui, this._onCashInfo, this); //用户提现信息返回
        MsgManager.on(MSG.NOTIFY.ClubsFileConfigRsp_ui, this._onClubsFileConfig, this);
        MsgManager.on(MSG.NOTIFY.ClubGetValueByKeyRsp_ui, this._onGetValueByKey, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoChangeNotify_ui, this._onUserInfo, this);
        

        target.on(event.SHOW, this.getMyInfo, this);
    },

    getUserRedDot() {
        let params = {
            nNouse: 0,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserRedDotReq_CMD, params);
    },

    getMyInfo() {
        cc.log("--------------玩家个人信息请求----------------");
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserInfoReq_CMD, params);
    },

    getSwitch() {
        cc.log("--------------开关请求----------------");
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            sKey: "10001",
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubGetValueByKeyReq_CMD, params);
    },

    getRe(nType){
        let params = {nType: nType};
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPayInfoReq_CMD, params);
    },

    getTransferWay(){
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubTransferWayReq_CMD, {nUserId: UserInfo.getInfo().nUserID});
    },

    initUI(data) {
        this._userInfo = data
        cc.log('HallMyInfo initUI ',JSON.stringify(data))
        this.label_name.string = Base64.decode(data.sName);//Utils.getShortText(Base64.decode(data.sName), 12);
        this.label_ID.string = "" + data.nUserId;
        cc.log('HallMyInfo initUI label_name  ', this.label_name.string)
        // if (!data.nVip) {
        //     this.noVip.active = true;
        //     this.vip.active = false;
        // } else {
        //     this.noVip.active = false;
        //     this.vip.active = true;
        //     let vipLv = this.vip.getChildByName("vipLv");
        //     if (vipLv) {
        //         vipLv.string = data.nVip;
        //     }
        // }

        // this.gold_label.string = '$' + Utils.convertNumberToStr(data.nGold);
        Utils.changeUserHead(this.head, data.sFaceId, app.ClubAssets);
        // if (data.sPersonality != "") {
        //     this.label_sign.string = Utils.getShortText(Base64.decode(data.sPersonality), 200);
        // } else {
        //     this.label_sign.lang = "CLUB_HALL.SIGNATURE_tip";
        // }
        
        // this.diamond_label.string = Utils.convertNumberToStr(data.nGold);

        // this._onCashInfo(data)
    },

    initRe(){
        this._config = HallClubLogic.getReConfig(LocalStorage.getSysLanguage());
        if (this._config){
            if (this.cash){
                this.cash.string = this._config.cashGold || "";
            }

            if (this.noCash){
                this.noCash.string = this._config.noCashGold || "";
            }

            if (this.re_label){
                this.re_label.string = this._config.recharge || "";
            }

            if(this.tx_label){
                this.tx_label.string = this._config.withdrawal || "";
            }

            this._loadImg(this._config.url);
        }else{
            this.nRecharge.active = false;
            let widget = this.nPanel.getComponent(cc.Widget);
            widget.top = 537;
            widget.bottom = 143;

            widget.updateAlignment();
        }
    },

    //设置审核开关
    _setAuditSwitch() {
        let isOpen = cc.sys.isNative && app.config.IS_APPSTORE_APP;
        let isBind = HallClubLogic.isBlindPlayer();

        if (isOpen && !isBind){
            this.nRecharge.active = false;
            let widget = this.nPanel.getComponent(cc.Widget);
            widget.top = 537;
            widget.bottom = 143;
            widget.updateAlignment();
        }else{
            this.nRecharge.active = true;
            let widget = this.nPanel.getComponent(cc.Widget);
            widget.top = 779;
            widget.bottom = 143;
            widget.updateAlignment();
            this.getTransferWay();
            return;
        }
       

        if (isOpen){
            let exchange = this.nPanel.getChildByName("exchange");
            exchange.active = false;
        }
    },

    onClickChangeHead() {
        let node = cc.instantiate(this.systemHead);
        this.node.addChild(node);
        let com = node.getComponent("LoginRegSystemHead");
        if (com){
            com.init(this, this._userInfo.sFaceId);
        }


    },


    onClickChangeName() {  //修改名字
        let node = cc.instantiate(this.prefabChange);
        this.getAddNode().addChild(node, 1024);
        let component = node.getComponent("HallMyChangeData");
        this._userInfo.nFreeCount = UserInfo.getInfo().nFreeCount;
        this._userInfo.nPrice = UserInfo.getInfo().nPrice;

        if (component && this._userInfo) {
            component.initUI(this._userInfo)
        }
    },

    onClickSetting() {
        //设置
        let node = cc.instantiate(this.prefabSetting);
        this.getAddNode().addChild(node, 1024);
        let component = node.getComponent("HallMySetting");
        if (component && this._userInfo) {
            this._mySetting = component;
            component.initUI(this, this._userInfo);
        }
    },


    onClickNotice() {
        //通知
        let node = cc.instantiate(this.prefabNotice);
        this.node.getChildByName("popup").addChild(node, 1024, "HallMyNotice");

        let component = node.getComponent("HallMyNotice");
        if (component) {
            component.init(this._redPointData, this);
        }
    },

    onClickGameShop() {
        //商城
        let node = cc.instantiate(this.prefabShop);
        this.getAddNode().addChild(node, 1024);
        let component = node.getComponent("HallClubShop");
        if (component && this._userInfo) {
            this._clubShop = component;
            component.init(this._userInfo['nGold']);
        }
    },

    onClickRecharge() {
        //充值
        this._curType = 1;
        if (this._isOpenOnlineRe){
            this.getRe(this._curType);
            return;
        }
        // this.getSwitch();
    },

    onClickCash() {
        //提现
        this._curType = 3;
        if (this._isOpenOnlineRe){
            this.getRe(this._curType);
            return;
        }
        this.getSwitch();
    },

    onClickRecord() {
        //记录
       
    },

    onClickExchange(){
        //兑换码
        let node = cc.instantiate(this.prefabExchange);
        this.getAddNode().addChild(node, 1024);
    },

    onClickService(){
        //客服
        let userInfo = UserInfo.getInfo();
        HallClubLogic.openCustomerService(userInfo.strNickName, userInfo.nUserID);
    },

    onClickActivity(){
        //活动
        this.loadActivityUI("HallActivityMain");
    },

    onClickRechargeHistory(){
        let node = cc.instantiate(this.prefabRechargeRecord);
        this.getAddNode().addChild(node, 1024);
    },

    onClickIcon() {
        this.infoPanel.active = true;
        let language = LocalStorage.getSysLanguage();
        if (language != "zh" && language != "zh_tw" && language != "en"){
            if (this.infoTitle){
                this.infoTitle.active = false;
            }
        }
    },  


    
    onClickCopyID() {
        let userId = UserInfo.getInfo().nUserID;
        Utils.copyToClipBoard(userId);
    },  



    onClickBtnClose() {
        this.node.destroy();
    },  

    onClickBtnOut() {
         //console.log("=============退出登录==============")
    },  


    OnClickDiamond() {
        let prefab = this.prefabDiamondShop
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },
    
    OnClickBill() {
        // let prefab = this.prefabBill
        // if (prefab) {
        //     let node = cc.instantiate(prefab);
        //     this.getAddNode().addChild(node, 1024);
        // }

        this._curType = 1;
        this.getRe(this._curType);
    },
    
    OnClickLanguage() {
        let prefab = this.prefabLanguage
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },
    
    OnClickAgree() {
        let prefab = this.prefabAgree
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },
    
    OnClickCustomerService() {
        let prefab = this.prefabCustomerService
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },
    
    OnClickChannel() {
        let prefab = this.prefabChannel
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    OnClickRecharge() {
        let prefab = this.prefabRecharge
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
        }
    },

    getAddNode() {
        let scene = cc.director.getScene();
        return scene.getChildByName("Canvas").getChildByName("root").getChildByName("popup")
    },

    //修改手机号码
    changePhone(phone){
        this._userInfo.sPhone = phone;
    },

    //修改邮箱
    changeMailbox(mailbox){
        this._userInfo.sMail = mailbox;
    },

    _onUserInfo(data) {
        //  {"nRlt":0,"sErrStr":"sucess","tUserInfo":{"nUserId":37000015,"sFaceId":"1","sName":"cXFx","nSex":0,"nGold":199980,"sTime":"2025-05-15 15:28:08",
        //     "sPhone":"","nAllCount":0,"nMaxProfit":0,"sPersonality":"","nHandCount":0,"nMaxHandProfit":0,"nVip":0,"nExp":0,
        //     "nGloryLevel":0,"nLevelStart":0,"nOpenProtection":0,"nWithDrawGold":0,"nNotWithDrawGold":199980,"nReviewedGold":0,"nExchangeRate":1,"nTransSwitch":0,"sMail":""}}
        cc.log('HallMyInfo _onUserInfo ',JSON.stringify(data))
        if (data.nRlt == 0) {
            this._userInfo = data.tUserInfo;
            this.initUI(this._userInfo);
        }else{
            if(data.sFaceId){
                Utils.changeUserHead(this.head, data.sFaceId, app.ClubAssets); 
            }
            if(data.sName){
                this._userInfo.sName = data.sName;
                this.label_name.string = Base64.decode(data.sName);//Utils.getShortText(Base64.decode(data.sName), 12);
            }
            
            
        }
    },

    _onUserRedDot(data) {
        let bShowNoticeRedPoint = false;
        let bShowActivityRedPoint = false;
        let redPointNum = 0;
        this.resetRedPoint();

        for (let i = 0; i < data.arrRedot.length; i++) {
            if ((data.arrRedot[i].nType == 3 || data.arrRedot[i].nType == 2) && data.arrRedot[i].nCount > 0) {
                bShowNoticeRedPoint = true;
                redPointNum += data.arrRedot[i].nCount;
            }

            if (data.arrRedot[i].nType == 4 && data.arrRedot[i].nCount > 0){
                bShowActivityRedPoint = true;
            }
        }

        if (bShowNoticeRedPoint){
            this.updateRedPoint(1, bShowNoticeRedPoint, redPointNum);
            this._redPointData = data.arrRedot;

            let node = this.node.getChildByName("popup").getChildByName("HallMyNotice");
            if (node) {
                let component = node.getComponent("HallMyNotice");
                if (component) {
                    component.init(data.arrRedot, this);
                }
            }
        }
        
        if (bShowActivityRedPoint){
            this.updateRedPoint(2, bShowActivityRedPoint);
        }
    },

    //redType: 1：通知红点， 2：活动红点
    updateRedPoint(redType, bRedPoint, redPointNum) {
        if (redType == 1){
            this.noticeRedPoint.active = bRedPoint;
            this.label_redPoint_num.string = '' + redPointNum;
            if (!bRedPoint) {
                this._redPointData = [];
            }
        }else{
            this.activityRedPoint.active = bRedPoint;
        }
        
        let bShowRedPoint = false;
        if (this.noticeRedPoint.active || this.activityRedPoint.active){
            bShowRedPoint = true;
        }
        MsgManager.fire(MSG.NOTIFY.UPDATE_NOTICE_REDPOINT, bShowRedPoint);
    },

    resetRedPoint(){
        this.noticeRedPoint.active = false;
        this.activityRedPoint.active = false;
    },

    onUserMsgNotify(data) {
        if (data.arrRedot) {
            this.getUserRedDot();
        }
    },

    onOpenClubPay(data) {
        let node = cc.instantiate(this.prefabPay);
        this.getAddNode().addChild(node, 1024);
        let component = node.getComponent("HallClubShopPay");
        if (component) {
            component.initPay(data.nGoodId, this.label_name.string, data.title, data.money);
        }
    },

    _onSetSecurityPsw(data) {
        if (data) {
            const type = data.type;
            if (type == 'setSecurityPsw' || type == 'resetSecurityPsw' || type == 'secondSecurityPswConfirm') {
                let node = this.addSecurityPswPanel();
                let component = node.getComponent("HallEditSecurityPsw");
                if (component) {
                    component.initUI(type, null, data.cancelCallBack, data.sKey);
                }
            } else if (type == 'serverBack') {
                if (data.nRlt == 0) {
                    const isOpen = data['isOpen'];
                    this._userInfo && (this._userInfo['nOpenProtection'] = isOpen);
                    if(this._mySetting && this._mySetting.isValid) {
                        this._mySetting.initUI(this, this._userInfo);
                    }
                } 
            }
        }
    },

    addSecurityPswPanel() {
        let node = cc.instantiate(this.prefabSecurityPsw);
        this.getAddNode().addChild(node, 1024);
        return node;
    },

    //网关通知金币变化
    onCorrCapital(data) {
        if(!this.gold_label){
            return
        }
        this.gold_label.string = Utils.convertNumberToStr(data.nGold);
        if (this._userInfo) {
            this._userInfo.nGold = data.nGold;
        }
        if (this._clubShop && this._clubShop.node.isValid) {
            this._clubShop.init(data.nGold);
        }
    },

    _onPayInfo(data){
        // data.sUrl = "https://www.hao123.com/"
        if (data.nType == 1 || data.nType == 3) {
            if (data.sUrl){
                let url = data.sUrl;
                if (data.sUrl.indexOf("?") < 0){
                    url = url + "?sToken=" + data.sToken;
                }else{
                    url = url + "&sToken=" + data.sToken;
                }
            
                let language = app.config.LANG;
                url = url + "&langCode=" + language;

                if (this._userInfo.nTransSwitch == 0){
                    if (data.nType == 1){
                        this.loadUI("HallRCWay", {url: url, userInfo: Utils.clone(this._userInfo)});
                    }else if(data.nType == 3){
                        this.loadUI("HallWDWay", {url: url, userInfo: Utils.clone(this._userInfo)});
                    }
                }else{
                    cc.sys.openURL(url);
                }
            }else if (this._userInfo.nTransSwitch == 0){
                if (data.nType == 3){
                    this.loadUI("HallWithdraw", {nType: data.nType, userInfo: Utils.clone(this._userInfo)});
                }else{
                    // this.loadUI("HallPayType", {nType: data.nType, userInfo: Utils.clone(this._userInfo)});
                    
                    let name = 'HallMyBill'
                    let node = cc.instantiate(this.prefabBill);
                    this.getAddNode().addChild(node, 1, name);
                    let com = node.getComponent(name);
                    if (com){
                        com.init(data);
                    }
                }
            }
        }
    },

    _onCashInfo(data){
        cc.log("--------------用户提现信息返回----------------");

        if (data.hasOwnProperty("nWithDrawGold")) {//可提现金币
            this.cashLabel.string = Utils.convertNumberToStr(data.nWithDrawGold);
            if (this._userInfo){
                this._userInfo.nWithDrawGold = data.nWithDrawGold;
            }
        }

        if (data.hasOwnProperty("nNotWithDrawGold")) {//不可提现金币
            this.noCashLabel.string = Utils.convertNumberToStr(data.nNotWithDrawGold);
            if (this._userInfo){
                this._userInfo.nNotWithDrawGold = data.nNotWithDrawGold;
            }
        }
    },

    _onClubsFileConfig(data){
        this.initRe();
    },

    //在线充值和提现开关
    _onGetValueByKey(data){
        if (data && data.sValue == "0"){
            this._isOpenOnlineRe = true;
            if (this._curType) {
                this.getRe(this._curType);
                this._curType = 0;
            }
        }else{
            this._isOpenOnlineRe = false;
            if (this._userInfo.nTransSwitch == 0) {
                if (this._curType == 3){
                    this.loadUI("HallWithdraw", {nType: this._curType, userInfo: Utils.clone(this._userInfo)});
                }else{
                    this.loadUI("HallPayType", {nType: this._curType, userInfo: Utils.clone(this._userInfo)});
                }
                
            }
        }
    },

    _loadImg(url){
        if(!url){
            return;
        }
        cc.assetManager.loadRemote(url, function (error, texture) { 
            if(error) {
                QYLogs.error("HallMyInfo", "加载资源出错: url=" + url, error);
            }
            else{
                if (cc.isValid(this.helpPanel)){
                    let spriteFrame = new cc.SpriteFrame(texture);
                    this.helpPanel.spriteFrame = spriteFrame;
                }
                
            }
        }.bind(this))
    },

    loadUI(name, data){
        let wrapper = app.ClubViews;
        let path = "main-hall/resources/manualTransfer/";
        path = wrapper.path(name,null,path);
        wrapper.bundle.load(path,cc.Prefab,function(error, prefab){
            if(!error && cc.isValid(this)){
                let node = cc.instantiate(prefab);
                this.getAddNode().addChild(node, 1, name);
                let com = node.getComponent(name);
                if (com){
                    com.init(data);
                }
            }else{
                cc.error("myInfo loadui error = ", error)
            }
            
        }.bind(this))
    },

    loadActivityUI(name, data){
        let wrapper = app.ClubViews;
        let path = "main-hall/resources/activity/";
        path = wrapper.path(name,null,path);
        wrapper.bundle.load(path,cc.Prefab,function(error, prefab){
            if(!error && cc.isValid(this)){
                let node = cc.instantiate(prefab);
                this.node.parent.addChild(node, 1, name);
                let com = node.getComponent("HallActivityMain");
                if (com){
                    com.init(this);
                }

                this.node.active = true;
            
            }else{
                cc.error("myInfo loadui error = ", error)
                this.node.active = true;
            }
            
        }.bind(this))
    },

});