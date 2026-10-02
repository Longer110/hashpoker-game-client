// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let MsgManager = require("MsgManager");
let MSG = require("Msg_login");
let UserInfo = require("UserInfo");
let i18n = require('i18n');
let LocalStorage = require("LocalStorage");
let UIFrame = require("UIFrame");
let Utils = require("Utils");
let Base64 = require("base64");
let CMD = require("protocol_login");

let ELoginType = UserInfo.ELoginType;

cc.Class({
    extends: cc.Component,

    properties: {
        regType: cc.Node,
        regTypeList:{
            default: [],
            type: cc.Node
        },
        showPsw:{
            default: [],
            type: cc.Node
        },

        editRegPhone:cc.EditBox,              //手机号
        editRegPhonePsw: cc.EditBox,          //手机登录密码
        editRegMailbox: cc.EditBox,           //邮箱
        editRegMailboxPsw: cc.EditBox,        //邮箱登录密码
        editRegAccount: cc.EditBox,           //账号
        editRegAccountPsw: cc.EditBox,        //账号登录密码
        editRegCode: cc.EditBox,              //邀请码
        label_area: cc.Label,
        dialog: cc.Node,

        checkPrefab: cc.Prefab,
        _regType: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._initLabel();
    },

    // update (dt) {},

    onDestroy(){
        this.unRegister();
    },

    register(){
        MsgManager.on(MSG.ACCOUNT.SUB_GP_VeriCodeRep, this._onVeriCodeRep, this);
        my.net.on(my.NetworkEvent.OPEN, this._onWebsocketOpen, this);
    },

    unRegister(){
        MsgManager.un(this._onVeriCodeRep);
        MsgManager.un(this._onWebsocketOpen);
    },

    init(control){
        this.unRegister();
        this.register();
        this.control = control;
        let data = this.control.getCountry();
        this.setContryCode(data);
    },

    _initLabel(){
        this.editRegAccount.placeholder = i18n.t("CLUB_LOGIN.ACCOUNT_REG");
        this.editRegAccountPsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.editRegPhone.placeholder = i18n.t("CLUB_LOGIN.INPUT_PHONE");
        this.editRegPhonePsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.editRegMailbox.placeholder = i18n.t("CLUB_LOGIN.INPUT_MAILBOX");
        this.editRegMailboxPsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.editRegCode.placeholder = i18n.t("LOGIN.INVITECODE_REG") + i18n.t("CLUB_LOGIN.CAN_NOT_INPUT");
        if (cc.sys.isNative && app.config.IS_APPSTORE_APP){
            this.editRegCode.node.parent.active = false;
        }
    },

    onBtnClose(){
        this.node.destroy();
    },

    onPhoneEditingReturn(){
        let params = {}
        params.titleStr = i18n.t("CLUB_LOGIN.CONFIRM_PHONE");
        params.contentStr = i18n.t("CLUB_LOGIN.SEND_CODE_TO_PHONE");
        params.isShowCancel = true;
        params.callBack = function(){
            this.getVeriCode();
            
        }.bind(this);
        this.showDialog(true, params);
    },

    onMailboxEditingReturn(){
        let params = {}
        params.titleStr = i18n.t("CLUB_LOGIN.CONFIRM_MAILBOX");
        params.contentStr = i18n.t("CLUB_LOGIN.SEND_CODE_TO_MAILBOX");
        params.isShowCancel = true;
        params.callBack = function(){
            this.getVeriCode();
            
        }.bind(this);
        this.showDialog(true, params);
    },

    onBtnReg(){
        if (this._regType == 1){
            if(!this._checkPhoneDataValid()) return;
            this.onPhoneEditingReturn();
        }else if (this._regType == 2){
            if(!this._checkMailboxDataValid()) return;
            this.onMailboxEditingReturn();
            
        }else{
            if (!this._checkAccountDataValid()) return;
            let strName = this.editRegAccount.string;
            let strPWD = this.editRegAccountPsw.string;
            this.registerAccount({strName: strName, strPWD: strPWD})
        }
        
    },

    openRegCheck(data){
        let node = cc.instantiate(this.checkPrefab);
        this.node.addChild(node, 0, "LoginRegCheck");
        let com = node.getComponent("LoginRegCheck");
        if (com){
            com.init(this, data);
        }
    },

    registerAccount(data){
        app.game.setGameID(-1);
        LocalStorage.setAutoLoginState(true);
        let strModel = this.editRegCode.string;

        if (this._regType == 1 || this._regType == 2){
            // if(this._regType == 1){
            //     data.strName = this._countryData.code + "-" + this.editRegPhone.string;
            // }

            let params = {
                strName: data.strName,
                strPWD: data.strPWD,
                Models: strModel,
                // sFaceID: data.sFaceID,
                // NickName: Base64.encode(data.nickName),
                // Sex: data.nSex,
                nRegistWay: data.nRegistWay,
                sVeriCode: data.sVeriCode,
            };
            
            MsgManager.fire(MSG.NOTIFY.REGISTER_START, params);
        }else{
            let params = {
                strName: data.strName,
                strPWD: data.strPWD,
                Models: strModel,
                // sFaceID: data.sFaceID,
                // NickName: Base64.encode(data.nickName),
                // Sex: data.nSex
            };
            
            MsgManager.fire(MSG.NOTIFY.REGISTER_START, params);
        }

        
    },

    onClickSelectAreaPhone(){
        let node = cc.instantiate(this.control.LoginAreaPhone);
        this.node.addChild(node);
        let com = node.getComponent("LoginAreaPhone");
        if (com){
            com.init(this);
        }
    },

    onClickRegType(event, customEventData){
        if (this._regType == 1){
            this._phoneCode = this.editRegCode.string;
        }else if (this._regType == 2){
            this._mailboxCode = this.editRegCode.string;
        }else{
            this._accountCode = this.editRegCode.string;
        }
        
        this.editRegCode.string = "";
        let idx = Number(customEventData);
        this.updateRegType(idx);
        this._regType = idx;
    },

    updateRegType(idx){
        let children = this.regType.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let nor = child.getChildByName("nor");
            let sel = child.getChildByName("sel");
            if (i + 1 == idx){
                nor.active = false;
                sel.active = true;
            }else{
                nor.active = true;
                sel.active = false;
            }
        }

        for (let i = 0; i < this.regTypeList.length; i++) {
            if (i + 1 == idx){
                this.regTypeList[i].active = true;
            }else{
                this.regTypeList[i].active = false;
            }   
            
        }

        if (idx == 1){
            this.editRegCode.string = this._phoneCode || "";
        }else if (idx == 2){
            this.editRegCode.string = this._mailboxCode || "";
        }else{
            this.editRegCode.string = this._accountCode || "";
        }
    },

    onClickShowPassword(){
        let open_eye = this.showPsw[this._regType - 1].getChildByName("open_eye");
        let close_eye = this.showPsw[this._regType - 1].getChildByName("close_eye");
        let inputFlag = cc.EditBox.InputFlag.SENSITIVE;
        if (this._isShowPassword){
            open_eye.active = true;
            close_eye.active = false;
            inputFlag = cc.EditBox.InputFlag.SENSITIVE;
        }else{
            open_eye.active = false;
            close_eye.active = true;
            inputFlag = cc.EditBox.InputFlag.PASSWORD;
        }

        if (this._regType == 1){
            this.editRegPhonePsw.inputFlag = inputFlag;
        }else if (this._regType == 2){
            this.editRegMailboxPsw.inputFlag = inputFlag;
        }else{
            this.editRegAccountPsw.inputFlag = inputFlag;
        }

        this._isShowPassword = !this._isShowPassword;
    },

    _checkPhoneDataValid(){
        let strName = this.editRegPhone.string;
        let strPWD = this.editRegPhonePsw.string;
        return this.control._checkPhoneDataValid(strName, strPWD);
    },

    _checkMailboxDataValid(){
        let strName = this.editRegMailbox.string;
        let strPWD = this.editRegMailboxPsw.string;
        return this.control._checkMailboxDataValid(strName, strPWD);
    },

    _checkAccountDataValid() {
        let strName = this.editRegAccount.string;
        let strPWD = this.editRegAccountPsw.string;
        return this.control._checkAccountDataValid(strName, strPWD);
    },

    setContryCode(data){
        this.label_area.overflow = 0;
        this.label_area.string = data.name + "+" + data.code;
        this.label_area._forceUpdateRenderData(true);
        
        if (this.label_area.node.width > 250){
            this.label_area.overflow = 2;
            this.label_area.node.width = 250;
            this.label_area._forceUpdateRenderData(true);
        }
        this._countryData = data;
        if (this.control){
            this.control.setContryCode(data);
        }
    },

    _onVeriCodeRep(data){
        if (data.nRlt == 0){
            if(this._regType == 2){
                let params = {
                    regType: this._regType, 
                    mailbox: this.editRegMailbox.string,
                    mailboxPsw: this.editRegMailboxPsw.string,
                    nRegistWay: ELoginType.MAILBOX,
                }
                this.openRegCheck(params);
            }else{
                let params = {
                    regType: this._regType, 
                    phone: this._countryData.code + "-" + this.editRegPhone.string,
                    phonePsw: this.editRegPhonePsw.string,
                    nRegistWay: ELoginType.PHONE,
                }
                this.openRegCheck(params);
            }
        }else{
            if (data.nRlt == 8){
                if(this._regType == 2){
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.MAILBOX_FORMAT_ERROR"));
                }else{
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.PHONE_FORMAT_ERROR"));
                }
            }else if(data.nRlt == 10){
                UIFrame.showTips(i18n.t("CLUB_LOGIN.WAIT"));
            }else if(data.nRlt == 11){
                if(this._regType == 2){
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.MAILBOX_HAS_REG"));
                }else{
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.PHONE_HAS_REG"));
                }
            }else{
                UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"));
            }
        }
    },

    showDialog(isShow, data){
        this.dialog.active = isShow;
        if (!isShow){
            return;
        }

        let title = this.dialog.getChildByName("dialog_title").getComponent(cc.Label);
        let content = this.dialog.getChildByName("dialog_content").getComponent(cc.Label);
        let line = this.dialog.getChildByName("line");
        let btn_sure = this.dialog.getChildByName("btn_sure");
        let btn_cancel = this.dialog.getChildByName("btn_cancel");

        title.string = data.titleStr;
        content.string = data.contentStr;

        if (data.isShowCancel){
            line.active = true;
            btn_sure.active = true;
            btn_cancel.active = true;
            btn_sure.x = 125;
        }else{
            line.active = false;
            btn_sure.active = true;
            btn_cancel.active = false;
            btn_sure.x = 0;
        }

        this._dialogCallBack = data.callBack;
    },

    onBtnSure(){
        if (this._dialogCallBack){
            this._dialogCallBack();
            this._dialogCallBack = null;
        }
        this.dialog.active = false;
    },

    onBtnCancel(){
        this.dialog.active = false;
    },

    connectServer(){
        let controller = app.getComponent("LoginController");
        if(controller){
            if(!app.net.isConnect()){
                controller._connect();
            }
        }
    },

    _onWebsocketOpen(){
        if (this._isNotGet){
            this.getVeriCode();
            this._isNotGet = false;
        }

        let controller = app.getComponent("LoginController");
        if(controller && this.node.getChildByName("LoginRegCheck")){
            if (controller._blockIndex > 0){
                UIFrame.hideBlock(controller._blockIndex);
                controller._blockIndex = 0;
            }
            
        }
        
    },

    getVeriCode(){
        if(!app.net.isConnect()){
            this._isNotGet = true;
            this.connectServer();
            return;
        }

        let sendData = {
            nWay: ELoginType.MAILBOX,
            sWayAddr: this.editRegMailbox.string,
        }

        if (this._regType == 1){
            sendData = {
                nWay: ELoginType.PHONE,
                sWayAddr: this._countryData.code + "-" + this.editRegPhone.string,
                // sWayAddr: this.editRegPhone.string ,
            }
        }

        app.net.send(CMD.MDM_GP_LOGON.value, CMD.MDM_GP_LOGON.SUB_REQ_LOGON_VeriCodeReq_CMD, sendData);
    }

});
