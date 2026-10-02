// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let Utils = require("Utils");
let UserInfo = require("UserInfo");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let UIFrame = require("UIFrame");
let LocalStorage = require("LocalStorage");
let HallClubLogic = require("HallClubLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        uiTitle: cc.Label,
        editBox_gold: cc.EditBox,
        editBox_notes: cc.EditBox,
        label_ID: cc.Label,
        label_name: cc.Label,
        label_account: cc.Label,
        uploadSp: cc.Sprite,
        noUpload: cc.Node,
        uploadSuccess: cc.Node,
        realGold: cc.Label,
        limit_tip: cc.Node,
        moneyType: cc.Label,
        panel_layout: cc.Layout,
        re_title: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBox_notes.placeholder = i18n.t("CLUB_RECHARGE.INPUT_LIMIT");

        //直播APP消息交互
        this._onAppMessage = this._onMessage.bind(this);

        //app集成lib sdk
        if(cc.sys.isNative){
            //设置原生消息交互回调
            qygameengine.MessageManager.getInstance().setOtherCallback(this._onAppMessage);
        }

        this.regiester();

        this.editBox_gold.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    },

    onDestroy() {
        MsgManager.un(this._onRWCallback);
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubRechargeWithdrawalRsp_ui, this._onRWCallback, this);
    },

    _onRWCallback(data){
        //code 0：成功   1：额度不足 2：订单创建失败 3：参数错误 4：重复请求 5:接口异常  6：用户不存在 7:充值关闭（两次违规充值)
        let result = JSON.parse(data.res);
        if (!result){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.FAILED"));
            return;
        }

        if(result.code == 0){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.SUCCESS"));
            this.onCloseAllPopupUI();
        }else if (result.code == 13){
            let text = Utils.replaceAll(i18n.t("CLUB_RECHARGE.WITHDRAWD_GOLD"), "SSS", this._data.minRecharge || 500);
            UIFrame.showTips(text + this.moneyUnit);
        }else{
            if ((result.code == 500 || result.code == 4)){
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.APPLY_HAS_SUBMIT"));
            }else if (result.code == 7){
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.RE_AND_WD_CLOSE"));
                
            }else{
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.FAILED"));
            }
            
        }

        this._isSend = false;
    },


    // update (dt) {},
    init(data){
        this._data = data;
        this._rate = this._data.rate;
        this.uiTitle.string = data.titleStr || "";
        this.label_ID.string = data.userInfo.nUserId;
        this.label_name.string = data.name;
        this.label_account.string = data.account;
        this.moneyUnit = i18n.t("CLUB_MONEYTYPE." + this._data.currency);
        let text = Utils.replaceAll(i18n.t("CLUB_RECHARGE.WITHDRAWD_GOLD"), "SSS", data.minRecharge || 500);
        this.editBox_gold.placeholder = text + this.moneyUnit;

        let recordStr = LocalStorage.getItem("CLUB_RCPay_RECORD","");
        if (recordStr){
            let record = JSON.parse(recordStr);
            this.editBox_gold.string = Utils.convertNumberToStr2(record.amount, true);
            this.moneyType.string = this.moneyUnit;
            this.editBox_notes.string = record.remarks || "";
            let gold = (record.amount * this._rate).toFixed(0);
            this.realGold.string = "=" + Utils.convertNumberToStr2(gold, true) + i18n.t("CLUB_HALL_RECORD.GOLD");
        }

        let language = LocalStorage.getSysLanguage();
        let configRe = HallClubLogic.getReConfig("ac_re_" + language);
        let urlRe = configRe&& configRe.url;
        this.loadSprite(urlRe, this.re_title);
    },

    loadSprite(url, targetSpr){
        if (!url || !cc.isValid(targetSpr)){
           return;
        }

        cc.assetManager.loadRemote(url, function (error, texture) { 
            if(error) {
                QYLogs.error("rcpay", "加载资源出错: url=" + url, error);
            }
            else{
                if (cc.isValid(targetSpr)){
                    let spriteFrame = new cc.SpriteFrame(texture);
                    targetSpr.spriteFrame = spriteFrame;
                }
                
            }
        }.bind(this))
    },

    onCloseAllPopupUI(){
        if(!cc.isValid(this.node)){
            return;
        }
        let scene = cc.director.getScene();
        if (scene){
            scene.getChildByName("Canvas").getChildByName("root").getChildByName("popup").destroyAllChildren();
        }
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickCloseTip(){
        this.limit_tip.active = false;
    },

    onClickSure(){
        this.onClickCloseTip();
    },

    onClickHasPay(){
        // this._uploadUrl = "https://platform.deaizhou.com/images/TransferReview/b242o27f3421e52788de64f32222ce544c.png";
        if (this._isSend){
            return;
        }

        if(!this._uploadUrl){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.UPLOAD_PLEASE"));
            return;
        }

        let gold = this.editBox_gold.string;
        gold = Utils.replaceAll(gold, ",", "");

        if (gold == "" || gold == "0"){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.INPUT_RE_GOLD"));
            return;
        }

        if (gold.indexOf(".") > -1){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.INPUT_INT_NUM"));
            return;
        }

        if (Number(gold) < this._data.minRecharge ){
            let text = Utils.replaceAll(i18n.t("CLUB_RECHARGE.WITHDRAWD_GOLD"), "SSS", this._data.minRecharge || 500);
            UIFrame.showTips(text + this.moneyUnit);
            return;
        }

        let remarks = this.editBox_notes.string;

        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            imgHandTransfer: this._uploadUrl,
            amount: Number(gold),
            payType: 1,
            channelNo: this._data.id + 6,
            remarks: remarks,
            country: this._data.area + "",
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubRechargeWithdrawalV2Req_CMD, params);
        this._isSend = true;

        let record = {
            amount: params.amount,
            remarks: params.remarks,
        }
        LocalStorage.setItem("CLUB_RCPay_RECORD", JSON.stringify(record));
    },

    onClickOpenPhoto(){
        if (cc.sys.isNative){
            if(qygameengine.PlatformCommon.openPhoto){
                let path = jsb.fileUtils.getWritablePath()
                qygameengine.PlatformCommon.openPhoto(-1, path, "order");
            }
        }
    },
    
    onClickOpenCamera(){
        if (cc.sys.isNative){
            if(qygameengine.PlatformCommon.takePhoto){
                let path = jsb.fileUtils.getWritablePath()
                qygameengine.PlatformCommon.takePhoto(-1, path, "order");
            }
        }
    },

    _upLoadImg(){
        if (!cc.sys.isNative){
            return;
        }

        if (!this._uplaodData){
            return;
        }

        let url = "https://platform.deaizhou.com/api/ImageFileManage/UploadImage" + "?UserID=" + UserInfo.getInfo().nUserID;
        if(window.ChannelConfig.SERVER_UPLOAD_HEAD && window.ChannelConfig.SERVER_UPLOAD_HEAD.length > 0){
            let item = window.ChannelConfig.SERVER_UPLOAD_HEAD[0];
            url = item.HEAD+"://"+item.HOST + "?UserID=" + UserInfo.getInfo().nUserID;
        }

        url = url.replace("UploadImage", "AppUploadImage")
        let tag = "ClubUpload";
        QYLogs.warn("tag URL= ", url)

        let method = "post";
        var xhr = cc.loader.getXMLHttpRequest(),
            errInfo = 'Load ' + url + ' failed!',
            navigator = window.navigator;
        xhr.open(method, url, true);
        
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "application/octet-stream;charset=UTF-8");
        }
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');

        if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4) {
                    if ((xhr.status === 200 || xhr.status === 0)) {
                        QYLogs.warn(tag, xhr.responseText)
                        UIFrame.showTips(i18n.t("CLUB_RECHARGE.UPLOAD_SUCCESS"));
                        let data = JSON.parse(xhr.responseText);
                        QYLogs.warn(tag, data);
                        if(data.msg){
                            this._uploadUrl = data.msg.completeFilePath;
                            if (cc.isValid(this.uploadSuccess)){
                                this.uploadSuccess.active = true;
                            }
                            
                        }else{
                            UIFrame.showTips(i18n.t("CLUB_RECHARGE.UPLOAD_FAILED"));
                            QYLogs.warn("ClubHead_error", xhr.status, errInfo);
                        }
                       
                       
                    }
                    else {
                        UIFrame.showTips(i18n.t("CLUB_RECHARGE.UPLOAD_FAILED"));
                        QYLogs.warn("ClubHead_error", xhr.status, errInfo);
                    }
                }
            }.bind(this);
        } else {
            if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
            xhr.onload = function () {
                if(xhr.readyState === 4) {
                    if ((xhr.status === 200 || xhr.status === 0)) {
                        QYLogs.warn(tag, xhr.responseText)
                        UIFrame.showTips(i18n.t("CLUB_RECHARGE.UPLOAD_SUCCESS"));
                        let data = JSON.parse(xhr.responseText);
                        QYLogs.warn(tag, data)
                        if(data.msg){
                            this._uploadUrl = data.msg.completeFilePath;
                            if (cc.isValid(this.uploadSuccess)){
                                this.uploadSuccess.active = true;
                            }
                        }else{
                            UIFrame.showTips(i18n.t("CLUB_RECHARGE.UPLOAD_FAILED"));
                            QYLogs.warn("ClubHead_error", xhr.status, errInfo);
                        }
                    }
                    else {
                        UIFrame.showTips(i18n.t("CLUB_RECHARGE.UPLOAD_FAILED"));
                        QYLogs.warn("ClubHead_error", xhr.status, errInfo);
                    }
                }
            }.bind(this);
            xhr.onerror = function(){
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.UPLOAD_FAILED"));
            };
        }
        xhr.send(this._uplaodData);
    },

    onClickCopy(event, customEventData){
        let idx = Number(customEventData);
        let result = false;
        switch(idx){
            case 1: 
                //复制金额
                let gold = this.editBox_gold.string;
                gold = Utils.replaceAll(gold, ",", "");
                result = Utils.copyToClipBoard(gold);
                break;
            case 2: 
                //复制ID
                result = Utils.copyToClipBoard(this.label_ID.string);
                break;
            case 3: 
                //复制名称
                result = Utils.copyToClipBoard(this.label_name.string);
                break;

            case 4: 
                //复制账号
                result = Utils.copyToClipBoard(this.label_account.string);
                break;
        }

        // if(result || cc.sys.isNative){
        //     UIFrame.showTips(i18n.t("CLUB_HALL_TIP.COPY_LINK_SUCCESS"));
        // }else{
        //     UIFrame.showTips(i18n.t("CLUB_HALL_TIP.COPY_LINK_FAIL"));
        // }   
        
    },

    _onMessage(result){
        QYLogs.warn("ClubHead", "------------获取上re截图返回的图片数据----------result = " +  result);
        if (!result){
            return;
        }

        let resultData = JSON.parse(result);
        if (!resultData || resultData.key != "IMAGE_PICKER_KEY"){
            if (cc.isValid(this.limit_tip)){
                this.limit_tip.active = true;
            }
            
            return;
        }

        let path = resultData.result;
        if (!path || !jsb || !jsb.fileUtils.isFileExist(path)){
            if (cc.isValid(this.limit_tip)){
                this.limit_tip.active = true;
            }
            return;
        }

        let self = this;
        cc.loader.release(path);
        cc.loader.load(path, (err, res) =>
        {
            if (err){
                cc.error("load img error, path = ", path);
                return;
            }
            
            let sprite = new cc.SpriteFrame();
            sprite.setTexture(res);
            if (cc.isValid(self.uploadSp)){
                self.uploadSp.spriteFrame = sprite;
                self.uploadSp.node.active = true;
            }
          
            if (cc.isValid(self.noUpload)){
                self.noUpload.active = false;
            }
            
        })
        
        let data = jsb.fileUtils.getDataFromFile(path);
        this._uplaodData = data;
        this._upLoadImg();
    },

    onEditTextEnd(editbox) {
        let str = editbox.string;
        if (str == ""){
            return;
        }

        str = Utils.replaceAll(str, ",", "");
        let gold = Number(str);
        this.editBox_gold.string = Utils.convertNumberToStr2(gold, true);
    },

    onEditTextBegin(editbox) {
        let str = this.editBox_gold.string;
        str = Utils.replaceAll(str, ",", "");
        editbox.string = str;
    },

    onTouchStart(){
        let str = this.editBox_gold.string;
        str = Utils.replaceAll(str, ",", "");
        this.editBox_gold.string = str;
    },

    onEditTextChanged(text, editbox, customEventData) {
        let money = Number(text);
        if (money > 0){
            let gold = (money * this._rate).toFixed(0);
            this.realGold.string = "=" + Utils.convertNumberToStr2(gold, true) + i18n.t("CLUB_HALL_RECORD.GOLD");
            this.moneyType.string = this.moneyUnit;
            this.panel_layout.spacingX = 6;
        }else{
            this.realGold.string = "";
            this.moneyType.string = "";
            this.moneyType._forceUpdateRenderData(true);
            this.panel_layout.spacingX = 0;
        }
        
    },

    onClickMoneyType(){
        this.onTouchStart();
        this.editBox_gold.focus();
    }

});
