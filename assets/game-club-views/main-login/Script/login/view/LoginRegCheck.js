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

cc.Class({
    extends: cc.Component,

    properties: {
        editbox: cc.EditBox,
        btn_title: cc.Label,
        mailboxTip: cc.Label,
        phoneTip: cc.Label,
        mailbox: cc.Label,
        phone: cc.Label,

        _time: 60,
        _perTime: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editbox.placeholder = i18n.t("CLUB_LOGIN.INPUT_CODE");
    },

    update (dt) {
        this._perTime += dt;
        if (this._perTime >= 1){
            this._time -= 1;
            this.setBtnTitle();
            this._perTime = 0;
        }
    },

    init(control, data){
        this.control = control;
        this._data = data;
        if (data.regType == 1){
            //手机注册
            this.phoneTip.string = Utils.replaceAll(i18n.t("CLUB_LOGIN.SEND_PHONE_TIP"), "XXX", data.phone);
            this.phone.string = data.phone;
            
        }else if (data.regType == 2){
            //邮箱注册
            this.mailboxTip.string = Utils.replaceAll(i18n.t("CLUB_LOGIN.SEND_MAILBOX_TIP"), "XXX", data.mailbox);
            this.mailbox.string = data.mailbox;
            
        }

        this.mailboxTip.node.active = data.regType == 2;
        this.phoneTip.node.active = data.regType == 1;
        this.mailbox.node.active = data.regType == 2;
        this.phone.node.active = data.regType == 1;

        this.setBtnTitle();
    },

    setBtnTitle(){
        if (this._time <= 0){
            this.btn_title.lang = "CLUB_LOGIN.GET_CHECK_CODE";
            return;
        }
        let str = Utils.replaceAll(i18n.t("CLUB_LOGIN.REPEAT_SEND"), "XXX", this._time);
        this.btn_title.string = str;
    },

    onBtnClose(){
        this.node.destroy();
    },

    checkInput(){
        let str = this.editbox.string;
        if (str == "" || str.length < 6){
            return false;
        }

        return true;
    },

    onBtnSend(){
        if (this._time > 0){
            return;
        }
        if (this.control){
            this.control.getVeriCode();
        }
    },

    onBtnSubmit(){
        if (!this.checkInput()){
            return;
        }

        if (this.control){
            if(this._data.regType == 2){
                let params = {
                    strName: this._data.mailbox,
                    strPWD: this._data.mailboxPsw,
                    nRegistWay: this._data.nRegistWay,
                    sVeriCode: this.editbox.string,
                }
                this.control.registerAccount(params);
            }else{
                let params = {
                    strName: this._data.phone,
                    strPWD: this._data.phonePsw,
                    nRegistWay: this._data.nRegistWay,
                    sVeriCode: this.editbox.string,
                }
                this.control.registerAccount(params);
            }
           
        }
    },

    
});
