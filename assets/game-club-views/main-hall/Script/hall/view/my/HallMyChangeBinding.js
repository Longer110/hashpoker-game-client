// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let i18n = require("i18n");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let LocalStorage = require("LocalStorage");
let UIFrame = require("UIFrame");
let Utils = require("Utils");
let MSG_login = require("Msg_login");
let CMD_login = require("protocol_login");
let CMD = require("protocol_club");
let MD5 = require("md5");
let UserInfo = require("UserInfo");
let ELoginType = UserInfo.ELoginType;

cc.Class({
    extends: cc.Component,

    properties: {
        phone_title: cc.Node,
        mailbox_title: cc.Node,
        panel_phone: cc.Node,
        panel_mailbox: cc.Node,
        LoginAreaPhone: cc.Prefab,
        countryCodeOld: cc.Label,
        countryCodeNew: cc.Label,
        editboxPhoneOld: cc.EditBox,
        editboxPhoneNew: cc.EditBox,
        editboxPhonePsw: cc.EditBox,
        editboxPhoneCode: cc.EditBox,
        btn_phoneGetCode: cc.Node,
        editboxMailboxOld: cc.EditBox,
        editboxMailboxNew: cc.EditBox,
        editboxMailboxPsw: cc.EditBox,
        editboxMailboxCode: cc.EditBox,
        btn_mailboxGetCode: cc.Node,
        phone_errorList: {
            default: [],
            type: cc.Node,
        },
        mailbox_error: {
            default: [],
            type: cc.Node,
        },

        _time: -1,
        _perTime: 0,
        _countryCodeIndex: 1, //1:旧手机国家区号 2： 新手机国家区号
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let data = this.getCountry();
        this.setContryCode(data, true);

        this.editboxPhoneOld.placeholder = i18n.t("CLUB_BINDING.INPUT_BIND_PHONE");
        this.editboxPhoneNew.placeholder = i18n.t("CLUB_BINDING.INPUT_BIND_PHONE");
        this.editboxPhonePsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.editboxPhoneCode.placeholder = i18n.t("CLUB_LOGIN.INPUT_CODE");
        this.editboxMailboxOld.placeholder = i18n.t("CLUB_BINDING.INPUT_BIND_MAIXBOX");
        this.editboxMailboxNew.placeholder = i18n.t("CLUB_BINDING.INPUT_BIND_MAIXBOX");
        this.editboxMailboxPsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
        this.editboxMailboxCode.placeholder = i18n.t("CLUB_LOGIN.INPUT_CODE");
    },

    regiester(){
        this.unRegiester();
        MsgManager.on(MSG.NOTIFY.ClubBindRsp_ui, this._onBind, this);
        MsgManager.on(MSG_login.ACCOUNT.SUB_GP_VeriCodeRep, this._onVeriCodeRep, this);
    },

    unRegiester(){
        MsgManager.un(this._onBind);
        MsgManager.un(this._onVeriCodeRep);
    },

    onDestroy(){
        this.unRegiester();
    },


    update (dt) {
        if (!this._timeStart){
            return;
        }

        this._perTime += dt;
        if (this._perTime >= 1){
            this._time -= 1;
            this.setBtnTitle();
            this._perTime = 0;
        }
    },

    //bindType: 1: 手机 2：邮箱
    init(control, type){
        this.control = control;
        this.regiester();
        this.bindType = type;
        if (type == 1){
            this.phone_title.active = true;
            this.panel_phone.active = true;
            this.mailbox_title.active = false;
            this.panel_mailbox.active = false;
        }else{
            this.phone_title.active = false;
            this.panel_phone.active = false;
            this.mailbox_title.active = true;
            this.panel_mailbox.active = true;
        }
    },

    _onBind(data){
        if (data.nRlt == 0){
            UIFrame.showTips(i18n.t("CLUB_BINDING.BIND_SUCCESS"));
            
            if (this.bindType == 1){
                let phone = this._bindData.sAddrNew;
                if (UserInfo.getLoginType() == ELoginType.PHONE){
                    let LoginController = App.getComponent("LoginController");
                    if (LoginController){
                        LoginController.changeLoginAccount(phone);

                        let array = phone.split("-");
                        LocalStorage.setItem("CLUB_COUNTRY_CODE", array[0]);
                        LocalStorage.setItem("CLUB_PHONE_LOGINNAME", array[1]);
                    }
                }
                if (this.control){
                    this.control.changePhone(phone);
                }
                
            }else{
                let mailbox = this._bindData.sAddrNew;
                if (UserInfo.getLoginType() == ELoginType.MAILBOX){
                    let LoginController = App.getComponent("LoginController");
                    if (LoginController){
                        LoginController.changeLoginAccount(mailbox);
                        LocalStorage.setItem("CLUB_MAILBOX_LOGINNAME", mailbox);
                    }
                }

                if (this.control){
                    this.control.changeMailbox(mailbox);
                }
                
            }   

            this.onClickClose();
        }else{
            if (data.nRlt == 20){
                if (this.bindType == 1){
                    this.phone_errorList[3].active = true;
                }else{
                    this.mailbox_error[3].active = true;
                }
            }
        }
    },

    _onVeriCodeRep(data){
        if (data.nRlt == 0){
            this._time = 60;
            if (this.bindType == 1){
                this.updateBtn(this.btn_phoneGetCode, true)
            }else{
                this.updateBtn(this.btn_mailboxGetCode, true)
            }

            this._timeStart = true;
        
        }else{
            this.isGetCode = false;
            if (data.nRlt == 8){
                if(this.bindType == 2){
                    this.mailbox_error[2].active = true;
                }else{
                    this.phone_errorList[2].active  = true;
                }
            }else if(data.nRlt == 10){
                UIFrame.showTips(i18n.t("CLUB_LOGIN.WAIT"));
            }else if(data.nRlt == 11){
                if(this.bindType == 2){
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.MAILBOX_HAS_REG"));
                }else{
                    UIFrame.showTips(i18n.t("CLUB_LOGIN.PHONE_HAS_REG"));
                }
            }else{
                UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"));
            }
        }
    },

    onClickClose(){
        this.node.destroy();
    },

    onPhoneEditingDidBegin(event, customEventData){
        let index = Number(customEventData);
        this.phone_errorList[index].active = false;
    },

    onMailboxEditingDidBegin(event, customEventData){
        let index = Number(customEventData);
        this.mailbox_error[index].active = false;
    },

    onClickSelectAreaPhone(event, customEventData){
        let node = cc.instantiate(this.LoginAreaPhone);
        this.node.addChild(node);
        let com = node.getComponent("LoginAreaPhone");
        if (com){
            com.init(this);                
            
        }

        this._countryCodeIndex = Number(customEventData);
    },

    onClickGetCode(){
        if (this.bindType == 1){
            if (!this._checkPhoneDataValid(true)){
                return;
            }
        }else{
            if (!this._checkMailboxDataValid(true)){
                return;
            }
        }

        if (this.isGetCode){
            return;
        }

        this.getCode();
        this.isGetCode = true;
    },

    onClickChange(){
        if (this.bindType == 1){
            if (!this._checkPhoneDataValid()){
                return;
            }
        }else{
            if (!this._checkMailboxDataValid()){
                return;
            }
        }

        this.bindReq();
    },

    updateBtn(node, isGet){
        let nor = node.getChildByName("nor");
        let dis = node.getChildByName("dis");
        if (isGet){
            nor.active = false;
            dis.active = true;
            
        }else{
            nor.active = true;
            dis.active = false;
        }

        this.btn_title = dis.getChildByName("lab_time").getComponent(cc.Label);
        let str = Utils.replaceAll(i18n.t("CLUB_LOGIN.REPEAT_SEND"), "XXX", this._time);
        this.btn_title.string = str;
    },

    setBtnTitle(){
        if (this._time <= 0){
            this._timeStart = false;
            this.isGetCode = false;
            if (this.bindType == 1){
                this.updateBtn(this.btn_phoneGetCode)
            }else{
                this.updateBtn(this.btn_mailboxGetCode)
            }
            return;
        }
        if (this.btn_title){
            let str = Utils.replaceAll(i18n.t("CLUB_LOGIN.REPEAT_SEND"), "XXX", this._time);
            this.btn_title.string = str;
        }
       
    },

    setContryCode(data, isAll){
        if (isAll){
            this.setOldCountryCode(data);
            this.setNewCountryCode(data);
        }else{
            if (this._countryCodeIndex == 1){
                this.setOldCountryCode(data);
            }else{
                this.setNewCountryCode(data);
            }
        }
    },

    setNewCountryCode(data){
        this.countryCodeNew.overflow = 0;
        this.countryCodeNew.string = data.name + "+" + data.code;
        this.countryCodeNew._forceUpdateRenderData(true);

        if (this.countryCodeNew.node.width > 150){
            this.countryCodeNew.overflow = 2;
            this.countryCodeNew.node.width = 150;
            this.countryCodeNew.enableWrapText = true;
            this.countryCodeNew._forceUpdateRenderData(true);
        }
        this._newCountryData = data;
    },

    setOldCountryCode(data){
        this.countryCodeOld.overflow = 0;
        this.countryCodeOld.string = data.name + "+" + data.code;
        this.countryCodeOld._forceUpdateRenderData(true);

        if (this.countryCodeOld.node.width > 150){
            this.countryCodeOld.overflow = 2;
            this.countryCodeOld.node.width = 150;
            this.countryCodeOld.enableWrapText = true;
            this.countryCodeOld._forceUpdateRenderData(true);
        }
        this._oldCountryData = data;
    },

    _checkPhoneDataValid(isGetCode) {
        if (isGetCode){
            let strName = this.editboxPhoneNew.string;
            if (!strName){
                UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP9"));
                return false;
            }
            return true;
        }

        let strName2 = this.editboxPhoneOld.string;
        if (!strName2){
            UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP8"));
            return false;
        }

        let psw = this.editboxPhonePsw.string;
        if (!psw){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.ERROR_TIP7"));
            return false;
        }

        let strName = this.editboxPhoneNew.string;
        if (!strName){
            UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP9"));
            return false;
        }

        let code = this.editboxPhoneCode.string;
        if (!code){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_CODE"));
            return false;
        }

        return true;
    },

    _checkMailboxDataValid(isGetCode) {
        if (isGetCode){
            let strName = this.editboxMailboxNew.string;
            if (!strName){
                UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP6"));
                return false;
            }
            return true;
        }

        let strName2 = this.editboxMailboxOld.string;
        if (!strName2){
            UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP5"));
            return false;
        }

        let strName = this.editboxMailboxNew.string;
        if (!strName){
            UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP6"));
            return false;
        }

        let psw = this.editboxMailboxPsw.string;
        if (!psw){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.ERROR_TIP7"));
            return false;
        }
        
        let code = this.editboxMailboxCode.string;
        if (!code){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_CODE"));
            return false;
        }

        return true;
    },

    getCountry(){
        let text = i18n.t("CLUB_AREA_PHONE");
        let data = JSON.parse(text);
        let code = LocalStorage.getItem("CLUB_COUNTRY_CODE2", "");
        if(code == ""){
            let language = LocalStorage.getSysLanguage();
            let lang = cc.sys.languageCode;
            lang = lang.toLocaleLowerCase();

            if (language == "zh"){
                return data[0];
            }else if (language == "zh_tw"){
                if (lang.indexOf("zh-hk") != -1 || lang.indexOf("zh_hk") != -1){
                    return data[1];
                }

                return data[2];
            }else if (language == "vi"){
                return data[3];
            }else if (language == "kh"){
                return data[4];
            }

            return data[0];
           
        }else{
            for (let i = 0; i < data.length; i++) {
                if (data[i].code == Number(code)){
                    return data[i];
                }
                
            }

            return data[0];
        }
    },

    getCode(){
        let sendData = {
            nWay: ELoginType.MAILBOX,
            sWayAddr: this.editboxMailboxNew.string,
        }

        if (this.bindType == 1){
            sendData = {
                nWay: ELoginType.PHONE,
                sWayAddr: this._newCountryData.code + "-" + this.editboxPhoneNew.string,
            }
        }

        app.net.send(CMD_login.MDM_GP_LOGON.value, CMD_login.MDM_GP_LOGON._VeriCodeReq_CMD, sendData);
    },

    bindReq(){
        let sendData = {
            nWay: ELoginType.MAILBOX,
            sAddrNew: this.editboxMailboxNew.string,
            sVeriCode: this.editboxMailboxCode.string,
            sAddrOld: this.editboxMailboxOld.string,
            sPassWord: MD5.hex(this.editboxMailboxPsw.string),
        }

        if (this.bindType == 1){
            sendData = {
                nWay: ELoginType.PHONE,
                sAddrNew: this._newCountryData.code + "-" + this.editboxPhoneNew.string,
                sVeriCode: this.editboxPhoneCode.string,
                sAddrOld: this._oldCountryData.code + "-" + this.editboxPhoneOld.string,
                sPassWord: MD5.hex(this.editboxPhonePsw.string),
            }
        }

        this._bindData = sendData;
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubBindReq_CMD, sendData);
    }
});
