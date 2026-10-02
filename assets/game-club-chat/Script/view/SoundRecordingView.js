// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


let MsgManager = require("MsgManager");
let CHAT_MSG = require('msg_chat');

let i18n = require("i18n");


cc.Class({
    extends: cc.Component,

    properties: {

        tips: {
            default: null,
            type: cc.Label
        },

        record_icon: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad () {

        if(this.tips){
            this.tips.lang = "CHAT.RECORD_TIPS";
        }
        if(!this._isFrist){
            MsgManager.on(CHAT_MSG.NOTIFY.RECORD_UPATE, this.updateSoundRecordingTime, this);//早期消息插入
            this._isFrist = true
        }
    },

    //销毁场景
    onDestroy(){
        
        if(this._isFrist){
            this._isFrist = false
            MsgManager.un(this.updateSoundRecordingTime,this);
        }
    },

    // onLoad () {},

    start () {
        this.updateSoundRecordingTime({time:0})
    },

    updateSoundRecordingTime(data){
        
        if(this.record_icon){
            let text = this.record_icon.getChildByName("text")
            if(text){
                let textLabel = text.getComponent(cc.Label)
                if(textLabel){
                    textLabel.string = Math.round(data.time/1000) +'"';
                }
            }
        }
    },

    // update (dt) {},
});
