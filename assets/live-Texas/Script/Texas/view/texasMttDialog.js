/*
    德州比赛提示
*/

let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
const i18n = require('i18n'); 
let TexasData = require("TexasData");
let TexasBase = require("TexasBase");
let TexasUtils = require("TexasUtils");

//对话框类型
let EShowType = cc.Enum({
    OKCANCEL: 0,    // 确认/取消
    OK: 1,          // 确认
    CANCEL: 2,      // 取消
});

cc.Class({
    extends: TexasBase,

    statics: {
        EShowType: EShowType,
    },

    properties: {
        labelText: cc.Label,
        labelTitle: cc.Label,
        label_confirm: cc.Label,
        label_cancel: cc.Label,
        btnOK: cc.Button,
        btnCancel: cc.Button,
        btnExit: cc.Button,
        left: cc.Node,
        right: cc.Node,
        center: cc.Node,
        _isOK: false,
        _callback: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.labelTitle) {
            this.labelTitle.string = TexasUtils._getText(87);
        }

        if (this.label_confirm) {
            this.label_confirm.string = TexasUtils._getText(43);
        }

        if (this.label_cancel) {
            this.label_cancel.string = TexasUtils._getText(88);
            if (TexasUtils._getClub()) {
                this.label_cancel.lang = "COMMON.CANCEL";
            }
        }

        MsgManager.on(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, this._isShowWindow, this);
    },

    onDestroy(){
        MsgManager.un(this._isShowWindow);
    },

    start () {

    },

    // update (dt) {},

    _initDialog(value,text) {
        this.initChat();

        this.showType = value;

        this.labelText.string = text;
        this.btnOK.node.active = true;
        this.btnCancel.node.active = true;
        this.btnOK.node.position = this.left.position;
        if (TexasUtils._getClub()) {
            this.btnOK.node.position = this.right.position;
        }
        this.btnCancel.node.position = this.right.position;
        if (TexasUtils._getClub()) {
            this.btnCancel.node.position = this.left.position;
        }
        switch (this.showType) {
            case EShowType.OKCANCEL:
                // this.btnOK.node.position = this.center.position;
                // this.btnCancel.node.active = false;
                break;
            case EShowType.OK:
                this.btnOK.node.position = this.center.position;
                this.btnCancel.node.active = false;
                break;
            case EShowType.CANCEL:
                this.btnCancel.node.position = this.center.position;
                this.btnOK.node.active = false;
            default:
                break;
        }

    },

    show(text, callback){
        QYLogs.log("UIDialog", "show: text=", text);
        this.labelText.node.active = true;
        this.labelText.string = text;
        this._callback = callback;
    },

    onClickBtn(event){
        if (event){
            this._isOK = event.target.name == "btnOK" ? true : false;
        }else{
            this._isOK = false;
        }
        
        TexasData._setWindowData(0);
        this.node.active = false;

        if(null!=this._callback){
            if (this.showType==EShowType.OK || this.showType==EShowType.CANCEL) {
                this._isOK = true;
            }
            this._callback(this._isOK);
        }
    },

    //是否显示弹窗
    _isShowWindow(data) {
        cc.log("是否显示帮助弹窗 data:",data);
        
        let nRlt = data.nRlt;
        if (nRlt==0) {
            this.node.active = false;
        }
    },

});
