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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
  
    },

    onDestroy(){
       // MsgManager.un(this._isShowWindow);
    },

    start () {

    },

    show(data){

        if(!this.node) return

        this.node.active = true;

        let content = this.node.getChildByName("content")
        if(content){
            content.active = true
            content.stopAllActions()
            content.opacity = 255
            content.x = 0
            content.y = 0
            this._data = data
            if(this.labelText){
                this.labelText.node.active = true;
                this._text = "<size=24><color=#ffffff>"+ i18n.t("gameTip.72") + "</color>" + "<color=#ffcc00>"+ i18n.t("gameTip.73") + data.nAwardGold + i18n.t("gameTip.74") + "</color>"
                this.labelText.string = this._text;
            }
            
            this.runMoveAction();
        }
    },

    runMoveAction(){

        let self =this
        let content = this.node.getChildByName("content")
        if(content){
            let action = cc.sequence(cc.moveBy(0.25,cc.v2(0,120)),cc.delayTime(1.0),cc.fadeOut(0.5),cc.callFunc(function(){
                self.hide()
            }));
            content.runAction(action);
        }
    },


    hide(){
        this.node.active = false;
    },

});
