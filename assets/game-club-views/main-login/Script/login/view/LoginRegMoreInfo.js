// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let HEAD_SIZE = 118;
let MsgManager = require("MsgManager");
let CMD = require("protocol_club");
let MSG = require("Msg_club");
let UserInfo = require("UserInfo");
let i18n = require('i18n');
let LocalStorage = require("LocalStorage");
let UIFrame = require("UIFrame");
let Utils = require("Utils");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
        editbox: cc.EditBox,
        panel_menu: cc.Node,
        btn_man: cc.Node,
        btn_woman: cc.Node,

        systemHead: cc.Prefab,
        spHead: cc.Sprite,

        _sex: "0", //0:男 1：女
        _head: "1",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editbox.placeholder = i18n.t("CLUB_HALL.INPUT_NAME");

        //直播APP消息交互
        this._onAppMessage = this._onMessage.bind(this);
        //app集成lib sdk
        if(cc.sys.isNative){
            //设置原生消息交互回调
            qygameengine.MessageManager.getInstance().setOtherCallback(this._onAppMessage);
        }

        MsgManager.on(MSG.NOTIFY.ClubSChangeUserInfoResp_ui, this._onChangeUserInfo, this);

    },

    // update (dt) {},

    onDestroy() {
        if(cc.sys.isNative && qygameengine && qygameengine.MessageManager.getInstance().clearOtherCallback){
            //设置原生消息交互回调
            qygameengine.MessageManager.getInstance().clearOtherCallback();
        }

        MsgManager.un(this._onChangeUserInfo);
    },

    init(control, data){
        this._control = control;
        this._data = data;
        this.setSpHead(this._head);
    },

    setSpHead(head){
        this._head = head;
        if (cc.isValid(this.spHead)){
            Utils.changeUserHead(this.spHead, this._head, app.ClubAssets);
        }
        
    },

    onBtnClose(){
        this.node.destroy();
    },

    onBtnSex(event, customEventData){
        let idx = Number(customEventData);
        this._sex = idx.toString();

        let manNor = this.btn_man.getChildByName("nor");
        let manSel = this.btn_man.getChildByName("sel");
        let womanNor = this.btn_woman.getChildByName("nor");
        let womanSel = this.btn_woman.getChildByName("sel");

        if (idx == 0){
            manNor.active = false;
            manSel.active = true;
            womanNor.active = true;
            womanSel.active = false;
        }else{
            manNor.active = true;
            manSel.active = false;
            womanNor.active = false;
            womanSel.active = true;
        }
    },

    onBtnNext(){
        let strName = this.editbox.string;
        if (strName == ""){
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_NAME"));
            return;
        }

        if (strName != "" && (strName.length < 2) || strName.length > 20){
            UIFrame.showTips(i18n.t("CLUB_ERROR.USER_NAME_LEN"));
            return;
        }

        let params = {arrChange: []};
        let tmp = {}
        tmp.sKey = "sName";
        tmp.sVal = Base64.encode(strName);
        params.arrChange.push(tmp);

        if (this._sex != 0){
            let tmp = {}
            tmp.sKey = "nSex";
            tmp.sVal = this._sex + '';
            params.arrChange.push(tmp);
        }
       
        if (this._head != "1"){
            let tmp = {}
            tmp.sKey = "sFaceId";
            tmp.sVal = this._head;
            params.arrChange.push(tmp);
        }

        UserInfo.setInfo({
            strHeadUrl: this._head,
        })

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeUserInfoReq_CMD, params);
    },

    onBtnHead(){
        this.panel_menu.active = true;
    },

    onCloseMenu(){
        this.panel_menu.active = false;
    },

    onClickOpenPhoto(){
        if (cc.sys.isNative){
            if(qygameengine.PlatformCommon.openPhoto){
                let path = jsb.fileUtils.getWritablePath()
                qygameengine.PlatformCommon.openPhoto(HEAD_SIZE, path, "head");
            }
        }
    },

    onClickTakePhoto(){
        if (cc.sys.isNative){
            if(qygameengine.PlatformCommon.takePhoto){
                let path = jsb.fileUtils.getWritablePath()
                qygameengine.PlatformCommon.takePhoto(HEAD_SIZE, path, "head");
            }
        }
    },

    onClickSystemPhoto(){
        let node = cc.instantiate(this.systemHead);
        this.node.addChild(node);
        let com = node.getComponent("LoginRegSystemHead");
        if (com){
            com.init(this, this._head);
        }

        this.onCloseMenu();
    },

    _onMessage(result){
        QYLogs.warn("moreInfo", "------------获取上传头像返回的图片数据----------result = " +  result);
        
        if (cc.isValid(this.panel_menu)){
            this.panel_menu.active = false;
        }

        
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
        
        let data = jsb.fileUtils.getDataFromFile(path);
        let url = "https://platform.deaizhou.com/api/ImageFileManage/UploadImage" + "?UserID=" + UserInfo.getInfo().nUserID;
        
        if(window.ChannelConfig.SERVER_UPLOAD_HEAD && window.ChannelConfig.SERVER_UPLOAD_HEAD.length > 0){
            let item = window.ChannelConfig.SERVER_UPLOAD_HEAD[0];
            url = item.HEAD+"://"+item.HOST + "?UserID=" + UserInfo.getInfo().nUserID;
        }

        QYLogs.warn("moreInfo URL= ", url)

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
                        QYLogs.warn("moreInfo", xhr.responseText)
                        let data = JSON.parse(xhr.responseText);
                        if (data.msg){
                            // UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_SUCCESS"));
                            this.setSpHead(data.msg.completeFilePath);
                        }
                        
                    }
                    else {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_FAILED"));
                        QYLogs.warn("moreInfo_error", xhr.status, errInfo);
                    }
                }
            }.bind(this);
        } else {
            if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
            xhr.onload = function () {
                if(xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        QYLogs.warn("moreInfo", xhr.responseText)
                        let data = JSON.parse(xhr.responseText);
                        if (data.msg){
                            // UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_SUCCESS"));
                            this.setSpHead(data.msg.completeFilePath);
                        }
                    }
                    else {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_FAILED"));
                        QYLogs.warn("moreInfo_error", xhr.status, errInfo);
                    }
                }
            }.bind(this);
            xhr.onerror = function(){
                UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_FAILED"));
            };
        }
        xhr.send(data);
    },

    _onChangeUserInfo(data){
        if (data.nRlt == 0){
            this.onBtnClose();
            
        }else{
            for (let i = 0; i < data.arrRlt.length; i++) {
                if (data.arrRlt[i].nRlt == 1){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
                    break;
                }else if (data.arrRlt[i].nRlt == 2){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO1"));
                    break;
                }else if (data.arrRlt[i].nRlt == 3){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO2"));
                    break;
                }else if (data.arrRlt[i].nRlt == 4){
                    if (data.arrRlt[i].sKey == "sPersonality"){
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO8"));
                    }else if (data.arrRlt[i].sKey == "sName"){
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO7"));
                    }else{
                        UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW_ERROR2"));
                    }
                    
                    break;
                }else if (data.arrRlt[i].nRlt == 5){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.USER_NAME_LEN"));
                    break;
                }else if (data.arrRlt[i].nRlt == 6){
                    if (data.arrRlt[i].sKey == "sPersonality"){
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO5"));
                    }else{
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO3"));
                    }
                    
                    break;
                }else if (data.arrRlt[i].nRlt == 7){
                    if (data.arrRlt[i].sKey == "sPersonality"){
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO6"));
                    }else{
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO4"));
                    }
                    
                    break;
                }else if (data.arrRlt[i].nRlt == 8){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO4"));
                    break;
                }else if (data.arrRlt[i].nRlt == 9){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_NAME_ERROR1"));
                    break;
                }else if (data.arrRlt[i].nRlt == 10){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.SECURITY_CODE_ERROR"));
                    break;
                }else if (data.arrRlt[i].nRlt == 11){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.SECURITY_CODE_ERROR1"));
                    break;
                }else if (data.arrRlt[i].nRlt == 12){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.SECURITY_CODE_ERROR2"));
                    break;
                }
            }
            
        }
    },
});
