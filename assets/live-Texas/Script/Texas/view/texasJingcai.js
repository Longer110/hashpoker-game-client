/*
    德州买入筹码
*/

let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let TexasData = require("TexasData");
let CMD = require("protocol_texas");
let i18n = require("i18n");
let Base64 = require("base64");
let TexasBase = require("TexasBase");
let Utils = require("Utils");

cc.Class({
    extends: TexasBase,

    properties: {
        labelText: cc.RichText,

        head: cc.Sprite,
        playerName: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //MsgManager.on(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, this._isShowWindow, this);
    },

    onDestroy(){
       // MsgManager.un(this._isShowWindow);
    },

    start () {

    },

    update (dt) {

        if(this._data){
            if(this._data.nTime > 0){
                this._data.nTime = this._data.nTime - dt
                // if(this.labelText){
                //     this.labelText.string = this._text + "<size=18><color=#ff0000>"+ i18n.t("gameTip.68")+ Math.ceil(this._data.nTime) + i18n.t("gameTip.69") + "</color>"
                // }
            }else{
                this._data.nTime = 0
                this._data = null
                this.hide();
            }
        }
    },
    show(data){
        this._data = data
        this.labelText.node.active = true;
       
        this._text = "<size=26><color=#000000>"+ i18n.t("gameTip.67") + "</color>" + "<color=#a400ff>"+ i18n.t("cardType."+data.nCardType) + "</color>" + "<color=#000000>? </color>"
        this.labelText.string = this._text;
        this.node.active = true;

        if(this.head){
            Utils.changeUserHead(this.head,data.sFaceId);//玩家头像
        }
        if(this.playerName){
            this.playerName.string = Utils.getShortText(Base64.decode(data.sName),10)
        }

    },

    hide(){
        //TexasData._setWindowData(0);
        this.node.active = false;
    },

    onClickBtn(event){
        this._isOK = event.target.name == "btnOK" ? true : false;

        
        let data = {}
        if(this._isOK){//对
            data.isWhether = true
        }else{//错
            data.isWhether = false
        }
        app.net.send(CMD.LiveSlave.value, CMD.LiveSlave.LiveSlaveGuessCardReq_CMD, data);
        this.hide()

        app.common.audio.playEffect("button/click");
    },

    //是否显示弹窗
    _isShowWindow(data) {
        cc.log("是否显示竞猜弹窗 data:",data);
        
        let nRlt = data.nRlt;
        if (nRlt==0) {
            this.node.active = false;
        }
    },

});
