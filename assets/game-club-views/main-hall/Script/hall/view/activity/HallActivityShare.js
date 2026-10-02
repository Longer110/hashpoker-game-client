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
let i18n = require("i18n");
let UserInfo = require("UserInfo");


cc.Class({
    extends: cc.Component,

    properties: {
        noUpload: cc.Node,
        uploadSp: cc.Sprite,

        btnShare: cc.Node,
        btnReceive: cc.Node,
        btnSubmit: cc.Node,

        label_tip: cc.Label,
        hasReceive: cc.Node,
        uploadSuccess: cc.Node,

        sharePrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //直播APP消息交互
        this._onAppMessage = this._onMessage.bind(this);

        //app集成lib sdk
        if(cc.sys.isNative){
            //设置原生消息交互回调
            qygameengine.MessageManager.getInstance().setOtherCallback(this._onAppMessage);
        }

        this.regiester();
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onRWCallback);
        MsgManager.un(this._onShareReward);
        MsgManager.un(this._onActivityCfg);
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubRechargeWithdrawalRsp_ui, this._onRWCallback, this);
        MsgManager.on(MSG.NOTIFY.ClubShareRewardRsp_ui, this._onShareReward, this);
        MsgManager.on(MSG.NOTIFY.ClubActivityCfgRsp_ui, this._onActivityCfg, this);
    },

    init(control, data){
        this.control = control;
        this._acInfo = data;
        this.initUI(data);
        this.getShareUrl();
    },

    initUI(data){
        if (data.nGetStatus != undefined){
            if (data.nGetStatus == 0){
                this.btnShare.active = false;
                this.btnReceive.active = true;
                this.hasReceive.active = false;
            }else{
                this.btnShare.active = true;
                this.btnReceive.active = false;
                this.hasReceive.active = true;
                this.btnShare.getChildByName("dis").active = true;
                this.btnShare.getChildByName("nor").active = false;
            }
        }else{
            this.btnShare.active = true;
            this.btnReceive.active = false;
            this.hasReceive.active = false;
        }

        this.label_tip.string = Utils.replaceAll(i18n.t("CLUB_ACTIVITY.ACTIVITY_TIP1"), "SSS", 100);
    },

    receiveReward(){
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            nId: this._acInfo.nId,
            nReward: this._acInfo.nAwardCount || 0,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubShareRewardReq_CMD, params);
    },

    getShareUrl(){
        let params = {
            nCfgType: 1,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubActivityCfgReq_CMD, params);
    },

    onClickReturn(){
        this.node.destroy();
    },

    onClickShare(){
        if (this.btnShare.getChildByName("dis").active){
            return;
        }

        let node = cc.instantiate(this.sharePrefab);
        this.node.addChild(node);
        let HallShareView = node.getComponent("HallShareView");
        if(HallShareView){
            HallShareView.init(1, this._shareUrl + UserInfo.getInfo().nUserID);
        }
    },

    onClickReceive(){
        this.receiveReward();
    },

    onClickOpenPhoto(){
        if (this.hasReceive.active){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP2"));
            return;
        }

        if (cc.sys.isNative){
            if(qygameengine.PlatformCommon.openPhoto){
                let path = jsb.fileUtils.getWritablePath()
                qygameengine.PlatformCommon.openPhoto(-1, path, "order");
            }
        }
    },
    
    onClickOpenCamera(){
        if (this.hasReceive.active){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP2"));
            return;
        }

        if (cc.sys.isNative){
            if(qygameengine.PlatformCommon.takePhoto){
                let path = jsb.fileUtils.getWritablePath()
                qygameengine.PlatformCommon.takePhoto(-1, path, "order");
            }
        }
    },


    _onRWCallback(data){
        //code 0：成功   -2: 重复提交
        let result = JSON.parse(data.res);
        if (!result){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.FAILED"));
            return;
        }

        if(result.code == 0){
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.SUCCESS"));
        }else if(result.code == -2){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP5"));
        }else{
            UIFrame.showTips(i18n.t("CLUB_RECHARGE.FAILED"));
        }

        this._isSend = false;
    },

    _onShareReward(data){
        if (data.nRlt == 1){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP0"));
            if (this.control){
                this.control.getAtivityInfo(true);
            }

            this.initUI({nGetStatus: 1});
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

    _onMessage(result){
        QYLogs.warn("ClubShareImg", "------------获取上传图片返回的图片数据----------result = " +  result);
        if (!result){
            return;
        }

        let resultData = JSON.parse(result);
        if (!resultData || resultData.key != "IMAGE_PICKER_KEY"){
            return;
        }

        let path = resultData.result;
        if (!path || !jsb || !jsb.fileUtils.isFileExist(path)){
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
                    if (xhr.status === 200 || xhr.status === 0) {
                        QYLogs.warn(tag, xhr.responseText)
                        // UIFrame.showTips(i18n.t("CLUB_RECHARGE.SUCCESS"));
                        let data = JSON.parse(xhr.responseText);
                        QYLogs.warn(tag, data)
                        if (data.msg){
                            this._uploadUrl = data.msg.completeFilePath;
                            if (cc.isValid(this.uploadSuccess)){
                                this.uploadSuccess.active = true;
                            }
                        }
                       
                        
                    }
                    else {
                        UIFrame.showTips(i18n.t("CLUB_RECHARGE.FAILED"));
                        QYLogs.warn("ClubShareImg_error", xhr.status, errInfo);
                    }
                }
            }.bind(this);
        } else {
            if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
            xhr.onload = function () {
                if(xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        QYLogs.warn(tag, xhr.responseText)
                        // UIFrame.showTips(i18n.t("CLUB_RECHARGE.SUCCESS"));
                        let data = JSON.parse(xhr.responseText);
                        QYLogs.warn(tag, data)
                        if (data.msg){
                            this._uploadUrl = data.msg.completeFilePath;
                            if (cc.isValid(this.uploadSuccess)){
                                this.uploadSuccess.active = true;
                            }
                        }
                       
                    }
                    else {
                        UIFrame.showTips(i18n.t("CLUB_RECHARGE.FAILED"));
                        QYLogs.warn("ClubShareImg_error", xhr.status, errInfo);
                    }
                }
            }.bind(this);
            xhr.onerror = function(){
                UIFrame.showTips(i18n.t("CLUB_RECHARGE.FAILED"));
            };
        }
        xhr.send(this._uplaodData);
    },

    onClickSubmit(){
        // this._uploadUrl = "https://platform.deaizhou.com/images/TransferReview/b222o47f345c42788de64f27134ce544c.png";
        if (this._isSend){
            return;
        }

        if(!this._uploadUrl){
            UIFrame.showTips(i18n.t("CLUB_ACTIVITY.ERROR_TIP4"));
            return;
        }

        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            imgHandTransfer: this._uploadUrl,
            amount: 0,
            payType: 3,
            channelNo: 0,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubRechargeWithdrawalV2Req_CMD, params);
        this._isSend = true;
    }
});
