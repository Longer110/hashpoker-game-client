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
        editPhone:cc.EditBox,              //手机号
        editMailbox: cc.EditBox,           //邮箱

        label_area: cc.Label,

        panel_phone: cc.Node,
        panel_mailbox: cc.Node,

        dialog: cc.Node,

        LoginResetPsw: cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editPhone.placeholder = i18n.t("CLUB_LOGIN.INPUT_PHONE");
        this.editMailbox.placeholder = i18n.t("CLUB_LOGIN.INPUT_MAILBOX");
    },

    // update (dt) {},

    onDestroy(){
        this.unRegister();
    },

    register(){
        MsgManager.on(MSG.ACCOUNT.SUB_GP_VeriCodeRep, this._onVeriCodeRep, this);
    },

    unRegister(){
        MsgManager.un(this._onVeriCodeRep);
    },

    /*
        初始化
        @param {type: string} data 数据
        data.type: 1: 手机 2：邮箱
        data.account: 玩家登录账号
    */
    init(control, data){
        this._data = data;
        this.unRegister();
        this.register();
        this.control = control;
        let conData = this.control.getCountry();
        this.setContryCode(conData);
        this.initUI();
    },

    initUI(){
        this.panel_phone.active = this._data.type == 1;
        this.panel_mailbox.active = this._data.type == 2;
    },
    
    //设置国家区号
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
    },

    _checkPhoneDataValid(strName) {
        if (!strName){
            // UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_PHONE"));
            return false;
        }

        return true;
    },

    _checkMailboxDataValid(strName) {
        if (!strName){
            // UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_MAILBOX"));
            return false;
        }

        var retEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!retEmail.test(strName)){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.MAILBOX_FORMAT_ERROR"));
            return false;
        }

        return true;
    },

    onEditReturn(){
        if (this._data.type == 1){
            if (this._checkPhoneDataValid(this.editPhone.string)){
                this.getPhoneCode();
            }
        }else{
            if (this._checkMailboxDataValid(this.editMailbox.string)){
                this.getMailboxCode();
            }
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

    onBtnClose(){
        this.node.destroy();
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

    getPhoneCode(){
        let params = {}
        params.titleStr = i18n.t("CLUB_LOGIN.CONFIRM_PHONE");
        params.contentStr = i18n.t("CLUB_LOGIN.SEND_CODE_TO_PHONE");
        params.isShowCancel = true;
        params.callBack = function(){
            this.getVeriCode();
        }.bind(this);
        this.showDialog(true, params);
    },

    getMailboxCode(){
        let params = {}
        params.titleStr = i18n.t("CLUB_LOGIN.CONFIRM_MAILBOX");
        params.contentStr = i18n.t("CLUB_LOGIN.SEND_CODE_TO_MAILBOX");
        params.isShowCancel = true;
        params.callBack = function(){
            this.getVeriCode();
            
        }.bind(this);
        this.showDialog(true, params);
    },

    connectServer(callBack){
        if(this.control){
            this.control.connectServer(callBack);
        }
    },

    getVeriCode(){
        let sendFunc = function(){
            let sendData = {
                nWay: ELoginType.MAILBOX,
                sWayAddr: this.editMailbox.string,
                nPurpose: 1,
            }
    
            if (this._data.type == 1){
                sendData = {
                    nWay: ELoginType.PHONE,
                    sWayAddr: this._countryData.code + "-" + this.editPhone.string,
                    nPurpose: 1,
                }
            }

            if (this._data.account){
                sendData.sAcc = this._data.account;
            }
    
            app.net.send(CMD.MDM_GP_LOGON.value, CMD.MDM_GP_LOGON.SUB_REQ_LOGON_VeriCodeReq_CMD, sendData);
        }.bind(this);

        if(!app.net.isConnect()){
            this._isNotGet = true;
            this.connectServer(sendFunc);
            return;
        }

        sendFunc();
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

    _onVeriCodeRep(data){
        if (data.nRlt == 0){
            if(this._data.type == 2){
                let params = {
                    number: this.editMailbox.string,
                    type: 2,
                    loginType: this._data.loginType,
                }
                this.openResetPsw(params);
            }else{
                let params = {
                    number: this.editPhone.string,
                    area: this._countryData.code,
                    type: 1,
                    loginType: this._data.loginType,
                }
                this.openResetPsw(params);
            }
        }else{
            if (data.nRlt == 8){
                if(this._data.type == 2){
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.MAILBOX_FORMAT_ERROR"));
                }else{
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.PHONE_FORMAT_ERROR"));
                }
            }else if(data.nRlt == 10){
                UIFrame.showTips(i18n.t("CLUB_LOGIN.WAIT"));
            }else if(data.nRlt == 11){
                if(this._data.type == 2){
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.MAILBOX_HAS_REG"));
                }else{
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.PHONE_HAS_REG"));
                }
            }else if (data.nRlt == 12){
                if(this._data.type == 2){
                    UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP4"));
                }else{
                    UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP1"));
                }   
                
            }else{
                UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"));
            }
        }
    },

    _onBindQuerry(data){
        if (data.nRlt == 2){
            //玩家绑定了邮箱
            this._data.type = 2;
        }else{
            this._data.type = 1;
        }

        this.initUI();
    },

    openResetPsw(data){
        let child = this.node.getChildByName("LoginResetPsw")
        if (child){
            let com = child.getComponent("LoginResetPsw");
            if (com){
                com.init(this, data);
            }
            return;
        }

        let node = cc.instantiate(this.LoginResetPsw);
        this.node.addChild(node, 0, "LoginResetPsw");
        let com = node.getComponent("LoginResetPsw");
        if (com){
            com.init(this, data);
        }
    },

    cleanLoginPsw(loginType){
        if (this._data && this._data.CallBack){
            this._data.CallBack(loginType);
        }
    }
});
