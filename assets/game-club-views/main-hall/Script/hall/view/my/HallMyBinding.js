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
        countryCode: cc.Label,
        editboxPhone: cc.EditBox,
        editboxPhoneCode: cc.EditBox,
        btn_phoneGetCode: cc.Node,
        editboxMailbox: cc.EditBox,
        editboxMailboxCode: cc.EditBox,
        btn_mailboxGetCode: cc.Node,
        phone_error: cc.Node,
        mailbox_error: cc.Node,
        code_error:{
            default: [],
            type: cc.Node,
        },

        _time: -1,
        _perTime: 0,
        _isToPassworld: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let data = this.getCountry();
        this.setContryCode(data);

        this.editboxPhone.placeholder = i18n.t("CLUB_BINDING.INPUT_BIND_PHONE");
        this.editboxPhoneCode.placeholder = i18n.t("CLUB_LOGIN.INPUT_CODE");
        this.editboxMailbox.placeholder = i18n.t("CLUB_BINDING.INPUT_BIND_MAIXBOX");
        this.editboxMailboxCode.placeholder = i18n.t("CLUB_LOGIN.INPUT_CODE");
        Utils._fixNumericEditBox2(this.editboxMailboxCode)
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

    init(control, type, isToPassworld){
        this.regiester();
        this.control = control;
        this._isToPassworld = isToPassworld
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
            UserInfo.setInfo({sMail: this.editboxMailbox.string}); //缓存邮箱
            if (this.control){
                if (this.bindType == 1){
                    this.control.changePhone(this._countryData.code + "-" + this.editboxPhone.string);
                }else{
                    this.control.changeMailbox(this.editboxMailbox.string, this._isToPassworld);
                }   
            }

            this.onClickClose();
        }else{
            if (data.nRlt == 20){
                if (this.bindType == 1){
                    this.code_error[0].active = true;
                }else{
                    this.code_error[1].active = true;
                }
            }else if(data.nRlt == 5) {
                UIFrame.showTips('此邮箱已经绑定过了！')
            }
        }
    },

    _onVeriCodeRep(data){
        if (data.nRlt == 0){
            this._time = 60;
            UIFrame.showTips('验证码已发送')
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
                    this.mailbox_error.active = true;
                }else{
                    this.phone_error.active  = true;
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

    onCodeEditingDidBegin(){
        if (this.bindType == 1){
            this.code_error[0].active = false;
        }else{
            this.code_error[1].active = false;
        }
    },

    onEditingDidBegin(){
        this.phone_error.active = false;
        this.mailbox_error.active = false;
    },

    onClickSelectAreaPhone(){
        let node = cc.instantiate(this.LoginAreaPhone);
        this.node.addChild(node);
        let com = node.getComponent("LoginAreaPhone");
        if (com){
            com.init(this);
        }
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

        this.isGetCode = true;
        this.getCode();
    },

    onClickBind(){
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

    _checkPhoneDataValid(isGetCode) {
        let strName = this.editboxPhone.string;
        if (!strName){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_PHONE"));
            return false;
        }

        if (isGetCode){
            return true;
        }

        let code = this.editboxPhoneCode.string;
        if (!code){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_CODE"));
            return false;
        }

        return true;
    },

    _checkMailboxDataValid(isGetCode) {
        let strName = this.editboxMailbox.string;
        if (!strName){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_MAILBOX"));
            return false;
        }

        if (isGetCode){
            return true;
        }
        
        let code = this.editboxMailboxCode.string;
        if (!code){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_CODE"));
            return false;
        }

        return true;
    },

    updateBtn(node, hasGet){
        let nor = node.getChildByName("nor");
        let dis = node.getChildByName("dis");
        if (hasGet){
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

    setContryCode(data){
        this.countryCode.overflow = 0;
        this.countryCode.string = data.name + "+" + data.code;
        this.countryCode._forceUpdateRenderData(true);

        if (this.countryCode.node.width > 150){
            this.countryCode.overflow = 2;
            this.countryCode.node.width = 150;
            this.countryCode.enableWrapText = true;
            this.countryCode._forceUpdateRenderData(true);
        }
        this._countryData = data;
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
            nPurpose: 0,    //验证码用途(nil或0:注册与绑定; 1:密码重置 ;2:支付密码)
            sWayAddr: this.editboxMailbox.string, 
        }

        if (this.bindType == 1){
            sendData = {
                nWay: ELoginType.PHONE,
                nPurpose: 0,
                sWayAddr: this._countryData.code + "-" + this.editboxPhone.string,
            }
        }

        app.net.send(CMD_login.MDM_GP_LOGON.value, CMD_login.MDM_GP_LOGON.SUB_REQ_LOGON_VeriCodeReq_CMD, sendData);
    },

    bindReq(){
        let sendData = {
            nWay: ELoginType.MAILBOX,
            sAddrNew: this.editboxMailbox.string,
            sVeriCode: this.editboxMailboxCode.string,
            nPurpose: 0,
        }

        if (this.bindType == 1){
            sendData = {
                nWay: ELoginType.PHONE,
                sAddrNew: this._countryData.code + "-" + this.editboxPhone.string,
                sVeriCode: this.editboxPhoneCode.string,
                nPurpose: 0,
            }
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubBindReq_CMD, sendData);
    }
});
