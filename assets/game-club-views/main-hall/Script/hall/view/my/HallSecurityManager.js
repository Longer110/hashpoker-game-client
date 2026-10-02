let i18n = require("i18n");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        btn_seleted: cc.Toggle,
        mask_btn_reset_psw: cc.Node,

        prefabModufyPsw: cc.Prefab,

        _openProtection: 0,
    },


    start() {
        this.regiester();
    },

    onDestroy() {
        MsgManager.un(this._onSetSecurityPsw);
    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.SET_SECURITY_PSW, this._onSetSecurityPsw, this);
    },

    initUI(openProtection) {
        let checked = openProtection != 0;
        this.btn_seleted.isChecked = checked;
        this.mask_btn_reset_psw.active = !checked;
        this.setBtnSelectedIsChecked(checked);
    },

    setBtnSelectedIsChecked(checked) {
        let sp_select = this.btn_seleted.node.getChildByName("sp_select");
        if (checked) {
            sp_select.x = 23;
        } else {
            sp_select.x = -23;
        }
    },

    _onSetSecurityPsw(data) {
        if (data['type'] == 'serverBack') {
            if (data.nRlt == 0) {
                const isNeedSet = data.isNeedSet;
                this.mask_btn_reset_psw.active = !data.isOpen;
                if (isNeedSet) {
                    MsgManager.fire(MSG.NOTIFY.SET_SECURITY_PSW, { type: 'setSecurityPsw' });
                } 
            } else {
                UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"))
            }
        } else if (data.type == 'editCancel') {
            let checked = !this.btn_seleted.isChecked;
            this.btn_seleted.isChecked = checked;
            this.mask_btn_reset_psw.active = !checked;
            this.setBtnSelectedIsChecked(checked);
        }
    },

    onClickClose() {
        this.node.destroy();
    },

    onClickToggle(event, data) {
        this.setBtnSelectedIsChecked(event.isChecked);
        this.sendCheckOpenNeedSecourityPsw(event.isChecked);
    },

    onClickResetSecurityPsw() {
        MsgManager.fire(MSG.NOTIFY.SET_SECURITY_PSW, { type: 'resetSecurityPsw' });
    },

    onClickResetPsw() {
        this.node.addChild(cc.instantiate(this.prefabModufyPsw));
    },

    sendCheckOpenNeedSecourityPsw(isOpen) {
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSSetSafePassWardOpenReq_CMD, { isOpen: isOpen });
    }

});