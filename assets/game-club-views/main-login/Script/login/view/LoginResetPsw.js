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
let MD5 = require("md5");

cc.Class({
    extends: cc.Component,

    properties: {
        editCode: cc.EditBox,               //验证码
        editPsw: cc.EditBox,                //密码

        label_number: cc.Label,
        codeTip: cc.Label,
        btn_title: cc.Label,

        dialog: cc.Node,
        showPswPanel: cc.Node,

        _time: 60,
        _perTime: 0,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editCode.placeholder = i18n.t("CLUB_LOGIN.INPUT_CODE");
        this.editPsw.placeholder = i18n.t("LOGIN.PASSWORD_REG");
    },

    update (dt) {
        this._perTime += dt;
        if (this._perTime >= 1){
            this._time -= 1;
            this.setBtnTitle();
            this._perTime = 0;
        }
    },

    onDestroy(){
        this.unRegister();
    },

    register(){
        MsgManager.on(MSG.ACCOUNT.SUB_GP_PasswordResetRsp, this._onPasswordReset, this);
    },

    unRegister(){
        MsgManager.un(this._onPasswordReset);
    },

    /*
        初始化
        @param control 父节点this
        @param {number: string, area: string} data 数据
        number: 手机或者邮箱号码
        area: 手机区号
    */
    init(control, data){
        this._time = 60;
        this._perTime = 0;
        this._data = data;
        this.unRegister();
        this.register();
        this.control = control;
        this.initUI();
    },

    //初始化ui
    initUI(){
        if(this._data.area){
            this.label_number.string = "+" + this._data.area + " " + this._data.number;
        }else{
            this.label_number.string = this._data.number;
        }

        this.codeTip.lang = "CLUB_LOGIN.SEND_CODE_TIP";

        this.setBtnTitle();
    },

    //设置重发按钮标题
    setBtnTitle(){
        if (this._time <= 0){
            this.btn_title.lang = "CLUB_LOGIN.GET_CHECK_CODE";
            return;
        }
        let str = Utils.replaceAll(i18n.t("CLUB_LOGIN.REPEAT_SEND"), "XXX", this._time);
        this.btn_title.string = str;
    },

    //点击获取验证码
    onBtnGetCode(){
        if (this._time > 0){
            return;
        }

        if (this.control){
            this.control.getVeriCode();
        }
    },
    

    //检测验证码和密码输入是否合规
    _checkDataValid(strName, strPWD) {
        if (!strName){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.INPUT_CODE"));
            return false;
        }

        if (strPWD.length < 6 ) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW_ERROR3"));
            return false;
        }

        if (!strPWD) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW"));
            return false;
        }

        if (Utils.hasBlankCharacter(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW2"));
            return false;
        }
    

        if (Utils.judgePasswordCharacters(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW4"));
            return false;
        }        

        if (Utils.hasEmojiCharacter(strPWD)) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW5"));
            return false;
        }

        return true;
    },

    //点击提交按钮
    onBtnSubmit(){
        if (this._checkDataValid(this.editCode.string, this.editPsw.string)){
            this.resetPsw();
        }
    },

    //关闭界面
    onBtnClose(){
        this.node.destroy();
    },

    //显示弹框
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

    //重置密码返回
    _onPasswordReset(data){
        if (data.nRlt == 0){
            UIFrame.showTips(i18n.t("CLUB_LOGIN.RESET_TIP1"));
            if(this._data.loginType == 1){
                LocalStorage.setItem("CLUB_PHONE_LOGINPSW", "");
            }else if (this._data.loginType == 2){
                LocalStorage.setItem("CLUB_MAILBOX_LOGINPSW", "");
            }else{
                LocalStorage.setLoginPWD("");
            }

            if (this.control){
                this.control.cleanLoginPsw(this._data.loginType);
                this.control.onBtnClose();
            }
        }else{
            UIFrame.showTips(i18n.t("CLUB_BINDING.ERROR_TIP3"));
        }
    },

    resetPsw(){
        let sendFunc = function(){
            let sendData = {
                nWay: ELoginType.MAILBOX,
                sAddrNew: this._data.number,
                sVeriCode: this.editCode.string,
                sPasswordNew: MD5.hex(this.editPsw.string),
            }

            if (this._data.type == 1){
                sendData.nWay = ELoginType.PHONE;
                sendData.sAddrNew = this._data.area + "-" + this._data.number;
            }

            app.net.send(CMD.MDM_GP_LOGON.value, CMD.MDM_GP_LOGON.SUB_REP_LOGON_PasswordResetReq_CMD, sendData);
        }.bind(this);

        if(!app.net.isConnect()){
            if (this.control){
                this.control.connectServer(sendFunc);
            }
            return;
        }

        sendFunc();
        
    },

    onClickShowPassword(){
        let open_eye = this.showPswPanel.getChildByName("open_eye");
        let close_eye = this.showPswPanel.getChildByName("close_eye");
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

        this.editPsw.inputFlag = inputFlag;

        this._isShowPassword = !this._isShowPassword;
    },
});
