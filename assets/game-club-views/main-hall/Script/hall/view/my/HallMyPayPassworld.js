// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");
let Base64 = require("base64");
let MsgManager = require("MsgManager");
let MSG_login = require("Msg_login");
let CMD_login = require("protocol_login");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Utils = require("Utils");
let ELoginType = UserInfo.ELoginType;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        nickName: cc.Label,
        userId: cc.Label,
        oldPassword: cc.EditBox,
        newPassword: cc.EditBox,
        newPasswordTwo: cc.EditBox,
        codeEdit: cc.EditBox,

        oldEditTips: cc.Node,
        newEditTips: cc.Node,
        new2EditTips: cc.Node,
        codeEditTips: cc.Node,
        getCodeNode: cc.Node,

        _rep_oldEdit: null,
        _rep_codeEdit: null,
        _strOldPassword: '',
        _strNewPassword: '',
        _strNewPassword2: '',
        _strCode: '',
        _timeStart: false,
        _perTime: 0,
        _time: 60,
        isGetCode: false,

        _oldEditShow: false,    //默认不显示密码
        _passEditShow: false,
        _pass2EditShow: false,
        _callback: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.regiester()
        this._rep_codeEdit = new RegExp('[0-9]{4,6}')
        // this._rep_oldEdit = new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&~_-])[A-Za-z0-9$@$!%*#?&~_-]{8,20}$')
        this._rep_oldEdit = new RegExp('[0-9]{6}')
        let info = UserInfo.getInfo()
        if(info) {
            this.nickName.string = info.strName
            this.userId.string = 'ID:' + info.nUserID
        }
        if(info.nOpenProtection == 1) {
            this.title = '修改交易密码'
            this.oldPassword.node.parent.parent.active = true
        }else {
            this.title.string = '设置交易密码'
            this.oldPassword.node.parent.parent.active = false
        }
        Utils._fixNumericEditBox2(this.oldPassword)
        Utils._fixNumericEditBox2(this.newPassword)
        Utils._fixNumericEditBox2(this.newPasswordTwo)
        Utils._fixNumericEditBox2(this.codeEdit)
    },

    setData(callback) {
        this._callback = callback
    },

    regiester(){
        MsgManager.on(MSG_login.ACCOUNT.SUB_GP_VeriCodeRep, this._onVeriCodeRep, this);
        MsgManager.on(MSG.NOTIFY.ClubSChangeUserInfoResp_ui, this._onChangeUserInfo, this);
    },

    unRegiester(){
        MsgManager.un(this._onVeriCodeRep);
        MsgManager.un(this._onChangeUserInfo);
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

    OnEditEndEvent(event, customData) {
        
        let value = event.string
        if(customData == 'old' && value) {
            if(this._rep_oldEdit.test(value)) {
                this._strOldPassword = value
                this.oldEditTips.active = false
            }else {
                this._strOldPassword = ''
                this.oldEditTips.active = true
            }

        }else if(customData == 'password' && value) {
            if(this._rep_oldEdit.test(value)) {
                this._strNewPassword = value
                this.newEditTips.active = false
            }else {
                this._strNewPassword = ''
                this.newEditTips.active = true
            }

        }else if(customData == 'password2' && value) {
            if(value == this._strNewPassword) {
                this._strNewPassword2 = value
                this.new2EditTips.active = false
            }else {
                this._strNewPassword2 = ''
                this.new2EditTips.active = true
            }

        }else if(customData == 'code' && value) {
            if(this._rep_codeEdit.test(value)) {
                this._strCode = value
                this.codeEditTips.active = false
            }else {
                this._strCode = ''
                this.codeEditTips.active = true
            }
        }
    },

    OnClickCertain() {
        cc.log('test 校验：', this._strOldPassword ,this._strNewPassword ,this._strNewPassword2 ,this._strCode)
        if(UserInfo.getInfo().nOpenProtection == 1 && !this._strOldPassword) {
            UIFrame.showTips('请输入正确的原密码！')
            return
        }
        if(!this._strNewPassword) {
            UIFrame.showTips('请输入正确的新密码！')
            return
        }
        if(!this._strNewPassword2) {
            UIFrame.showTips('2次输入的密码不同！')
            return
        }
        if(!this._strCode) {
            UIFrame.showTips('请输入正确的验证码！')
            return
        }
        let params = {
            arrChange: [],
            code: this._strCode,
            nPurpose: 2,    //验证码用途(nil或0:注册与绑定; 1:密码重置 ;2:支付密码)
        }
        params.arrChange.push({
            sKey: 'sSafePassWard',
            sVal: Base64.encode(this._strNewPassword),
        })
        if(UserInfo.getInfo().nOpenProtection == 1) {
            params.oldPass = Base64.encode(this._strOldPassword)
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeUserInfoReq_CMD, params);
    },

    //设置输入显示模式
    OnClickPassShow(event, customData) {
        if(customData == 'old') {
            this._oldEditShow = !this._oldEditShow
            if(this._oldEditShow) {
                this.oldPassword.inputFlag = cc.EditBox.InputFlag.DEFAULT
                this.oldPassword.node.parent.getChildByName('look').getChildByName('hide').active = false
                this.oldPassword.node.parent.getChildByName('look').getChildByName('show').active = true
            }else {
                this.oldPassword.inputFlag = cc.EditBox.InputFlag.PASSWORD
                this.oldPassword.node.parent.getChildByName('look').getChildByName('hide').active = true
                this.oldPassword.node.parent.getChildByName('look').getChildByName('show').active = false
            }
        }else if(customData == 'pass') {
            this._passEditShow = !this._passEditShow
            if(this._passEditShow) {
                this.newPassword.inputFlag = cc.EditBox.InputFlag.DEFAULT
                this.newPassword.node.parent.getChildByName('look').getChildByName('hide').active = false
                this.newPassword.node.parent.getChildByName('look').getChildByName('show').active = true
            }else {
                this.newPassword.inputFlag = cc.EditBox.InputFlag.PASSWORD
                this.newPassword.node.parent.getChildByName('look').getChildByName('hide').active = true
                this.newPassword.node.parent.getChildByName('look').getChildByName('show').active = false

            }

        }else if(customData == 'pass2') {
            this._pass2EditShow = !this._pass2EditShow
            if(this._pass2EditShow) {
                this.newPasswordTwo.inputFlag = cc.EditBox.InputFlag.DEFAULT
                this.newPasswordTwo.node.parent.getChildByName('look').getChildByName('hide').active = false
                this.newPasswordTwo.node.parent.getChildByName('look').getChildByName('show').active = true
            }else {
                this.newPasswordTwo.inputFlag = cc.EditBox.InputFlag.PASSWORD
                this.newPasswordTwo.node.parent.getChildByName('look').getChildByName('hide').active = true
                this.newPasswordTwo.node.parent.getChildByName('look').getChildByName('show').active = false

            }

        }
    },

    onClickGetCode(){
        if (this.isGetCode){
            return;
        }

        this.isGetCode = true;
        this.getCode();
    },

    getCode(){
        let mail = UserInfo.getInfo().sMail
        if(!mail) {
            UIFrame.showTips('请先绑定邮箱')
            return
        }
        let sendData = {
            nWay: ELoginType.MAILBOX,
            sWayAddr: mail,
            nPurpose: 2,    //验证码用途(nil或0:注册与绑定; 1:密码重置 ;2:支付密码)
        }

        app.net.send(CMD_login.MDM_GP_LOGON.value, CMD_login.MDM_GP_LOGON.SUB_REQ_LOGON_VeriCodeReq_CMD, sendData);
    },

    _onChangeUserInfo(data) {
        if(data.arrRlt[0].nRlt == 0) {
            UIFrame.showTips('设置成功！')
            UserInfo.setInfo({nOpenProtection: 1})
            if(this._callback) {
                this._callback()
            }
            this.OnClickClose()
        }else {
            if(data.arrRlt[0].nRlt == 10) {
                UIFrame.showTips('安全密码不符合要求')
            }else if(data.arrRlt[0].nRlt == 11) {
                UIFrame.showTips('没有进行安全密码校验')
            }else if(data.arrRlt[0].nRlt == 12) {
                UIFrame.showTips('安全密码校验失败')
            }else if(data.arrRlt[0].nRlt == 14) {
                UIFrame.showTips('密码错误')
            }else if(data.arrRlt[0].nRlt == 15) {
                UIFrame.showTips('验证码错误')
            }else if(data.arrRlt[0].nRlt == 16) {
                UIFrame.showTips('未绑定邮箱')
            }else if(data.arrRlt[0].nRlt == 17) {
                UIFrame.showTips('原密码错误')
            }
        }

    },

    _onVeriCodeRep(data){
        if (data.nRlt == 0){
            this.isGetCode = true;

            this._time = 60;
            UIFrame.showTips('验证码已发送')
            this.updateBtn(this.getCodeNode, true)
            this._timeStart = true;
        
        }else{
            this.isGetCode = false;
            if (data.nRlt == 8){
                
            }else if(data.nRlt == 10){
                UIFrame.showTips(i18n.t("CLUB_LOGIN.WAIT"));
            }else if(data.nRlt == 11){
                UIFrame.showTips('重复注册')
            }else{
                UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"));
            }
        }
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
            this.updateBtn(this.getCodeNode)
            return;
        }
        if (this.btn_title){
            let str = Utils.replaceAll(i18n.t("CLUB_LOGIN.REPEAT_SEND"), "XXX", this._time);
            this.btn_title.string = str;
        }
        
    },

    testEdit(value, customData) {
        
    },

    OnClickClose(){
        this.node.destroy();
    },
});
