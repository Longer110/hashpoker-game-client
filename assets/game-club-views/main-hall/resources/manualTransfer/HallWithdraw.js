// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let Utils = require("Utils");
let UserInfo = require("UserInfo");
let LocalStorage = require("LocalStorage");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let UIFrame = require("UIFrame");
let HallClubLogic = require("HallClubLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        uiTitle: cc.Label,
        editBox_gold: cc.EditBox, 
        editBox_fullName: cc.EditBox,
        editBox_ac_ca: cc.EditBox,
        editBox_phone: cc.EditBox,
        editBox_notes: cc.EditBox,
        editBox_bankName: cc.EditBox,
        wdGold: cc.Label,
        money: cc.Label,
        audit: cc.Label,
        cnwdGold: cc.Label,
        gold: cc.Label,
        prefabRechargeRecord: cc.Prefab,
        prefabHelp: cc.Prefab,
        realMoney: cc.Label,
        goldIcon: cc.Node,
        tx_title: cc.Sprite,
        label_area: cc.Label,
        moreArea: cc.Node,
        areaContent: cc.Node,
        areaItem: cc.Node,

        _curArea: 0,
        _rate: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBox_fullName.placeholder = i18n.t("CLUB_RECHARGE.INPUT");
        this.editBox_ac_ca.placeholder = i18n.t("CLUB_RECHARGE.INPUT");
        this.editBox_phone.placeholder = i18n.t("CLUB_RECHARGE.INPUT");
        this.editBox_notes.placeholder = i18n.t("CLUB_RECHARGE.INPUT_LIMIT");
        this.editBox_bankName.placeholder = i18n.t("CLUB_RECHARGE.INPUT");
        
        this.editBox_gold.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onDestroy() {
        this.unRegiester();
    },

    unRegiester(){
        MsgManager.un(this._onRWCallback);
        MsgManager.un(this._onUserInfo);
        MsgManager.un(this._onCashInfo);
        MsgManager.un(this._onTrCallback);
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubRechargeWithdrawalRsp_ui, this._onRWCallback, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoResp_ui, this._onUserInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubSCashInfoRep_ui, this._onCashInfo, this); //用户提现信息返回
        MsgManager.on(MSG.NOTIFY.ClubTransferWayRsp_ui, this._onTrCallback, this);
    },

    _onRWCallback(data){
        //code 0：成功   1：额度不足 2：订单创建失败 3：参数错误 4：重复请求 5:接口异常  6：用户不存在 7:充值关闭（两次违规充值)
        let result = JSON.parse(data.res);
        if(!result){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.APPLY_FAILED"));
            return;
        }

        if(result.code == "0"){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.APPLY_SUCCESS"));
            this.getMyInfo();
        }else{
            if ((result.code == 500 || result.code == 4)){
                this.editBox_gold.string = "";
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.APPLY_HAS_SUBMIT"));
                this.getMyInfo();
            }else if(result.code == 1){
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.APPLY_WITHDRAW_LIMIT2"));
            }else if (result.code == 7){
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.RE_AND_WD_CLOSE"));
            }else if (result.code == 13){
                UIFrame.showTips(Utils.replaceAll(i18n.t("CLUB_RECHARGE.APPLY_WITHDRAW_LIMIT"), "SSS", this.minGold || "500"));
            }else{
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.APPLY_FAILED"));
            }
        }
        
        this._isSend = false;
    },

    _onUserInfo(data){
        this._data.userInfo = data.tUserInfo;
        this.initGoldInfo(Utils.clone(data.tUserInfo));
    },

    _onCashInfo(data){
        if (data.hasOwnProperty("nWithDrawGold")) {//可提现金币
            this.wdGold.string = Utils.convertNumberToStr2(data.nWithDrawGold, true);
            if(this._data){
                this._data.userInfo.nWithDrawGold = data.nWithDrawGold;
                if (this._rate){
                    let nCash = Math.floor(data.nWithDrawGold / this._rate, true);
                    this.money.string = Utils.convertNumberToStr2(nCash, true) + " " + this.moneyUnit;
                }
                
            }
        }

        if (data.hasOwnProperty("nNotWithDrawGold")) {//不可提现金币
            // this.cnwdGold.string = Utils.convertNumberToStr2(data.nNotWithDrawGold, true);
            if(this._data){
                this._data.userInfo.nNotWithDrawGold = data.nNotWithDrawGold;
            }
        }
    },

    // update (dt) {},
    init(data){
        this._data = data;
        this.uiTitle.lang = "CLUB_RECHARGE.WITHDRAW";

        this.unRegiester();
        this.regiester();
        
        let transferWay = HallClubLogic.getTransferWay();
        if (transferWay){
            this._onTrCallback(transferWay)
        }else{
            this.requestTransferWay()
        }
    },

    initUI(data){
        this.moneyUnit = i18n.t("CLUB_MONEYTYPE." + this._data.currency);
        this.initGoldInfo(data);
        this.cnwdGold.string = Utils.convertNumberToStr2(data.nNotWithDrawGold, true);
        this.editBox_gold.placeholder = Utils.replaceAll(i18n.t("CLUB_RECHARGE.WITHDRAWD_GOLD"), "SSS", this.minGold || "500");
        this.goldIcon.active = true;
        this.label_area.string = this._data.name || "";

        let language = LocalStorage.getSysLanguage();
        let configTx = HallClubLogic.getReConfig("ac_tx_" + language);
        let urlTx = configTx && configTx.url;
        this.loadSprite(urlTx, this.tx_title);
    },

    initGoldInfo(data){
        let nCash = Math.floor(data.nWithDrawGold/this._rate);
        this.gold.string = Utils.convertNumberToStr(data.nGold);
        this.wdGold.string = Utils.convertNumberToStr2(data.nWithDrawGold, true);
        this.money.string = Utils.convertNumberToStr2(nCash, true) + " " + this.moneyUnit;
        this.audit.string = Utils.convertNumberToStr2(data.nReviewedGold, true);
    },

    updateUI(data){
        this.moneyUnit = i18n.t("CLUB_MONEYTYPE." + this._data.currency);
        let nCash = Math.floor(data.nWithDrawGold/this._rate);
        this.money.string = Utils.convertNumberToStr2(nCash, true) + " " + this.moneyUnit;
        this.label_area.string = this._data.name || "";
        let gold = this.editBox_gold.string;
        gold = Utils.replaceAll(gold, ",", "");
        this.editBox_gold.placeholder = Utils.replaceAll(i18n.t("CLUB_RECHARGE.WITHDRAWD_GOLD"), "SSS", this.minGold || "500");
        if(gold != ""){
            this.setRealMoney(gold);
        }
    },

    initRecordUI(){
        if (this._lastRecord){
            this.editBox_gold.string = Utils.convertNumberToStr2(this._lastRecord.amount, true);
            this.editBox_fullName.string = this._lastRecord.name || "";
            this.editBox_bankName.string = this._lastRecord.bankName || "";
            this.editBox_ac_ca.string = this._lastRecord.account || "";
            this.editBox_phone.string = this._lastRecord.phoneNo || "";
            this.editBox_notes.string = this._lastRecord.remarks || "";
            this.setRealMoney(this._lastRecord.amount);
        }
    },

    initMoreArea(){
        this.areaContent.destroyAllChildren();
        if (!this._areaInfo){
            return;
        }
        for (let i = 0; i < this._areaInfo.length; i++) {
            let info = this._areaInfo[i];
            let item = cc.instantiate(this.areaItem);
            let label = item.getChildByName("areaName").getComponent(cc.Label);
            let select = item.getChildByName("select");
            label.string = info.name;
            item.active = true;
            select.active = info.id == this._curArea;
            this.areaContent.addChild(item);
            let button = item.getComponent(cc.Button);
            button.node.off(cc.Node.EventType.TOUCH_END);
            button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                this.onClickItem(info);
            }.bind(this));
        }
    },

    onClickItem(data, node){
        this._curArea = data.id;
        this.updateData()
        this.updateUI(this._data.userInfo);
        this.onClickHideArea();
    },

    loadSprite(url, targetSpr){
        if (!url || !cc.isValid(targetSpr)){
           return;
        }

        cc.assetManager.loadRemote(url, function (error, texture) { 
            if(error) {
                QYLogs.error("withdraw", "加载资源出错: url=" + url, error);
            }
            else{
                if (cc.isValid(targetSpr)){
                    let spriteFrame = new cc.SpriteFrame(texture);
                    targetSpr.spriteFrame = spriteFrame;
                }
                
            }
        }.bind(this))
    },

    setRealMoney(gold){
        let money = (gold / this._rate).toFixed(0);
        this.realMoney.string = "=" + Utils.convertNumberToStr2(money, true) + this.moneyUnit;
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickSubmitApply(){
        if (this._isSend){
            return;
        }

        let gold = this.editBox_gold.string;
        gold = Utils.replaceAll(gold, ",", "");
        
        if (gold == ""){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.INPUT_WD_GOLD"));
            return;
        }

        if (gold.indexOf(".") > -1){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.INPUT_INT_NUM"));
            return;
        }

        let fullName = this.editBox_fullName.string;
        if (fullName == ""){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.INPUT_WD_NAME"));
            return;
        }

        let bankName = this.editBox_bankName.string;
        if (bankName == ""){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.NPUT_WD_BANK_NAME"));
            return;
        }

        let account = this.editBox_ac_ca.string;
        if (account == ""){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.INPUT_WD_ACCOUNT"));
            return;
        }

        let phone = this.editBox_phone.string;
        if (phone == ""){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.INPUT_WD_PHONE"));
            return;
        }

        if (this._data.userInfo.nWithDrawGold == 0){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.APPLY_WITHDRAW_LIMIT2"));
            return;
        }

        gold = Number(gold);
        if (gold < this.minGold){
            UIFrame.showTips(Utils.replaceAll(i18n.t("CLUB_RECHARGE.APPLY_WITHDRAW_LIMIT"), "SSS", this.minGold || "500"));
            return;
        }

        if (this._data.userInfo.nWithDrawGold < gold){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.APPLY_WITHDRAW_LIMIT2"));
            return;
        }

        let remarks = this.editBox_notes.string;

        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            amount: -gold,
            payType: 2,
            channelNo: this._data.id + 6,
            name: fullName,
            account: account,
            phoneNo: phone,
            remarks: remarks,
            bankName: bankName,
            country: this._curArea + "",
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubRechargeWithdrawalV2Req_CMD, params);
        this._isSend = true;

        let record = {
            amount: gold,
            name: params.name,
            account: params.account,
            phoneNo: params.phoneNo,
            remarks: params.remarks,
            bankName: params.bankName,
            area: this._curArea
        }
        LocalStorage.setItem("CLUB_WITHDRAW_RECORD", JSON.stringify(record));
    },

    onClickApplyRecord(){
        let node = cc.instantiate(this.prefabRechargeRecord);
        this.node.addChild(node);
        let component = node.getComponent("HallRechargeRecord");
        if (component){
            component.setTitle();
        }
    },

    onClickHelp(){
        let node = cc.instantiate(this.prefabHelp);
        this.node.addChild(node);
    },

    onClickCustomerService(){
        //客服
        let userInfo = UserInfo.getInfo();
        HallClubLogic.openCustomerService(userInfo.strNickName, userInfo.nUserID);
    },

    onClickMoreArea(){
        this.initMoreArea();
        this.moreArea.active = true;
    },

    onClickHideArea(){
        this.moreArea.active = false;
    },

    onEditTextBegin(editBox) {
        let gold = this.editBox_gold.string;
        gold = Utils.replaceAll(gold, ",", "");
        editBox.string = gold;
    },

    onEditTextEnd(editBox) {
        let str = editBox.string;
        if (str == ""){
            return;
        }

        str = Utils.replaceAll(str, ",", "");
        let gold = Number(str);
        this.editBox_gold.string = Utils.convertNumberToStr2(gold, true);
    },

    onEditTextChanged(text, editbox, customEventData) {
        let gold = Number(text);
        if (gold > 0){
            this.setRealMoney(gold);
        }else{
            this.realMoney.string = "";
        }
        
    },

    getMyInfo() {
        cc.log("--------------玩家个人信息请求----------------");
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserInfoReq_CMD, params);
    },

    requestTransferWay(){
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubTransferWayReq_CMD, {nUserId: UserInfo.getInfo().nUserID});
    },

    onTouchStart(){
        let str = this.editBox_gold.string;
        str = Utils.replaceAll(str, ",", "");
        this.editBox_gold.string = str;
    },

    _onTrCallback(data){
        let info = JSON.parse(data.sInfos || "[]"); //地区信息，包括充值和提现额度、汇率、币种
        this.initInfo(info)
        let wayInfo = JSON.parse(data.nWayInfo || "[]");
        this.initData(wayInfo);

        let recordStr = LocalStorage.getItem("CLUB_WITHDRAW_RECORD", "");
        if (recordStr){
            this._lastRecord = JSON.parse(recordStr);
            if (this._lastRecord.hasOwnProperty("area")){
                this._curArea = this._lastRecord.area;
            }
        }
        this.updateData();
        this.initUI(this._data.userInfo);
        this.initRecordUI();
    },

    initInfo(info){
        this._areaInfo = [];
        for (const key in info) {
            if (info.hasOwnProperty.call(info, key) && info[key] != "") {
                let tmpArray = JSON.parse(info[key]);
                this._areaInfo.push(tmpArray); 
                
            }
        }
    },

    updateData(){
        let areaInfo = this.getDataByArea(this._curArea);
        let params = {
                userInfo: this._data.userInfo
            }

        if (areaInfo){
            let data = this.getData(this._curArea);
            params.id = data.id;
            params.currency = areaInfo.Currency;
            params.name = areaInfo.name;
            params.area = areaInfo.id;
            this._data = params;
            this._rate = areaInfo.Rate;
            this.minGold = areaInfo.MinWithdrawal;
        }else{
            let data = this.getData(this._curArea);
            params.id = data.id;
            params.currency = data.currency;
            params.rate = data.rate;
            params.name = "test";
            params.area = data.area;
            this._data = params;
            this._rate = data.rate;
            this.minGold = data.minWithdrawal;
        }
    },

    getDataByArea(area){
        for (const key in this._areaInfo) {
            if (this._areaInfo.hasOwnProperty.call(this._areaInfo, key)) {
                let info = this._areaInfo[key];
                if (info != "" && info.id == area){
                    return info;
                }
            }
        }

        return;
    },

    initData(data){
        let info = [];
        for (const key in data) {
            if (data.hasOwnProperty.call(data, key)) {
                if (data[key] != ""){
                    let tmpArray = JSON.parse(data[key]);
                    info.push(tmpArray);
                }
                
            }
        }

        this._wayInfo = [];

        for (let i = 0; i < info.length; i++) {
            this._wayInfo.push(info[i])
        }
    },

    getData(area){
        for (let i = 0; i < this._wayInfo.length; i++) {
            let array = this._wayInfo[i];
            if (array.area == area){
                return array;
            }
            
        }

        return {currency: 1, minWithdrawal: 500, rate: 0.005, id: 5, area: 0};
    },


});
