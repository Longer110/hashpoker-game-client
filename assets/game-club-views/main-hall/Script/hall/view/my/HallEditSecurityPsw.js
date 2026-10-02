let i18n = require("i18n");
let Base64 = require("base64");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        label_title: cc.Label,
        label_tip1: cc.Label,
        label_tip2: cc.Label,
        btn_finish: cc.Button,

        pswEdits: {
            default: [],
            type: cc.Node
        },

        _currentPsw: '',
        _lastPass: '', //保存第一次输入的密码
        _currentType: '', //面板类型
        _passSKey: '',
        _needSecondConfirm: true, //是否需要二次输入确认
        _isSecondConfirm: false, //是否已进入第二次输入确认  
        _callback: null,
        _cancelCallback: null,
    },


    start() {
        this.regiester();
        this.resetEdits();
    },

    onDestroy() {
        this.editBox = null;
        this.unscheduleAllCallbacks();
        MsgManager.un(this._onChangeUserInfo);
    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSChangeUserInfoResp_ui, this._onChangeUserInfo, this);
    },

    onClickEditbox() {
        this.editBox.focus();
        let str = this.editBox.string;
        let len = str.length;
        this.playNodeEditing(len);
    },

    playNodeEditing(index) { //正在输入
        let node = this.pswEdits[index];
        if (!node) return;
        let point = node.getChildByName('point');
        let line = node.getChildByName('line');
        point.active = false;
        line.active = true;
        line.opacity = 255;
        let action = cc.sequence(
            cc.fadeOut(1),
            cc.fadeIn(1)
        )
        cc.tween(line).stop().then(action).repeatForever().start();
    },

    playNodeEditEnd(index) { //输入结束
        let node = this.pswEdits[index];
        if (!node) return;
        let point = node.getChildByName('point');
        let line = node.getChildByName('line');
        line.stopAllActions();
        point.active = true;
        line.active = false;
    },

    playNodeEditDeleted(index) { //删除
        let node = this.pswEdits[index];
        if (!node) return;
        let point = node.getChildByName('point');
        let line = node.getChildByName('line');
        line.stopAllActions();
        point.active = false;
        line.active = false;
    },

    initUI(type, callback, cancelCallback, sKey) {
        this._currentPsw = '';
        this._isSecondConfirm = false;
        this._lastPass = [];
        this._currentType = type;
        this._callback = callback;
        this._cancelCallback = cancelCallback;
        this.checkEditPswFinish();
        if (type == 'setSecurityPsw') { //设置安全密码
            this._needSecondConfirm = true;
            this.label_title.lang = "CLUB_HALL.INPUT_SECURITY_PSW";
            this.label_tip1.lang = "CLUB_HALL.INPUT_SECURITY_PSW1";
        } else if (type == 'resetSecurityPsw') { //修改安全密码
            this._needSecondConfirm = true;
            this.label_title.lang = "CLUB_HALL.RESET_SECURITY_PSW";
            this.label_tip1.lang = "CLUB_HALL.INPUT_SECURITY_PSW2";
        } else if (type == 'secondSecurityPswConfirm') { //二次确认密码
            this._needSecondConfirm = false;
            if (sKey != undefined) {
                this._passSKey = sKey;
            }
            this.label_title.lang = "CLUB_HALL.CHECK_SECURITY_PSW";
            this.label_tip1.lang = "CLUB_HALL.INPUT_SECURITY_PSW2";
        }
    },

    _onChangeUserInfo(data) {
        let nRltArr = data.arrRlt;
        for (let i = 0, len = nRltArr.length; i < len; i++) {
            if (nRltArr[i].sKey == 'sSafePassWard') {
                const tmpCode = nRltArr[i].nRlt;
                if (tmpCode == 0) {
                    this.showTips(i18n.t("CLUB_HALL.EDIT_SECURITY_CODE_SUCCESS"));
                    this.onClickClose();
                } else {
                    this.resetEdits();
                    this.showChangeUserInfoError(tmpCode)
                }
                break;
            }
        }
    },

    showChangeUserInfoError(code) {
        let str = '';
        let resetPanel = true; //重新设置提示
        switch (code) {
            case 4:
                str = 'LOGIN_PSW_ERROR2';
                break;
            case 10:
                str = 'SECURITY_CODE_ERROR';
                resetPanel = false;
                break;
            case 11:
                str = 'SECURITY_CODE_ERROR1';
                break;
            case 12:
                str = 'SECURITY_CODE_ERROR2';
                break;
        }
        if (resetPanel) {
            this.initUI(this._currentType, this._callback)
        }
        if (str.length > 1) {
            this.showTips(i18n.t('CLUB_ERROR.' + str));
        }
    },

    onClickEditArea() {
        if (!this.editBox.isFocused()) {
            this.editBox.focus();
            let str = this.editBox.string;
            let len = str.length;
            this.playNodeEditing(len);
        }
    },

    onClickClose(event) {
        if (this._currentType == 'setSecurityPsw' && event && event.type == 'touchend') {
            MsgManager.fire(MSG.NOTIFY.SET_SECURITY_PSW, {  type: 'editCancel' }); //用户没有修改信息
           
        }else if (event && event.type == 'touchend'){
            if(this._cancelCallback) {
                this._cancelCallback();
            }
        }
       
        this.node.destroy();
    },

    onEditTextChanged(text, editbox, customEventData) {
        let str = text;
        let len = str.length;
        this._currentPsw = str;
        this.playNodeEditing(len);
        this.playNodeEditEnd(len - 1);
        this.playNodeEditDeleted(len + 1);
        if (len == 6) {
            this.checkEditPswFinish();
        }
    },

    onClickFinish() {
        if (this.btn_finish.interactable) {
            this.sendSecurityPsw();
        }
    },

    onEditDidReturn() {
        cc.log("onEditDidReturn ")
    },


    onEditDidEnd() {
        let str = this.editBox.string;
        let len = str.length;
        this.playNodeEditDeleted(len);
    },

    checkEditPswFinish() {
        let isFinish = this._currentPsw.length == 6;
        if (isFinish && this._needSecondConfirm && !this._isSecondConfirm) {
            this._isSecondConfirm = true;
            this._lastPass = this._currentPsw.concat();
            this.scheduleOnce(() => {
                if (this && this.enterSecondConfirm){
                    this.enterSecondConfirm();
                }
            }, 0.5);
        } else {
            if (isFinish && this._needSecondConfirm) {
                const pswSame = String(this._currentPsw) == String(this._lastPass);
                isFinish = pswSame;
                if (!pswSame) {
                    this.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW6")); //密码不一致
                    this.scheduleOnce(() => {
                        if (this && this.resetEdits){
                            this.resetEdits();
                        }
                        
                    }, 0.5);
                }
            }
            this.btn_finish.node.getComponent('UISound').forceTouchEnabled(isFinish);
            this.btn_finish.interactable = isFinish;
        }
    },

    sendSecurityPsw() {
        let pass = '';
        for (let i = 0, len = this._currentPsw.length; i < len; i++) {
            pass += this._currentPsw[i];
        }
        if (this._needSecondConfirm) {
            const arrChange = [];
            const data = {
                sKey: "sSafePassWard",
                sVal: Base64.encode(pass),
            }
            arrChange.push(data);
            const sendData = {};
            sendData.arrChange = arrChange;
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeUserInfoReq_CMD, sendData);
        } else {
            const data = {
                sKey: this._passSKey != undefined ? this._passSKey : 'NAN',
                sSafePassWard: Base64.encode(pass),
            }
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSSafePassWardCheckReq_CMD, data);
            this.onClickClose();
        }
    },

    enterSecondConfirm() {
        this.resetEdits();
        this.label_tip1.lang = "CLUB_HALL.INPUT_SECURITY_PSW3";
    },

    resetEdits() {
        for (let i = 0, len = this.pswEdits.length; i < len; i++) {
            this.pswEdits[i].getChildByName('point').active = false;
            this.pswEdits[i].getChildByName('line').active = false;
        }
        this.editBox.string = '';
        this.onClickEditbox();
        this._currentPsw = '';
    },

    showTips(str) {
        UIFrame.showTips(str);
    },
});