// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


let ChatMessageMgr = require("ChatMessageMgr");

let LocalStorage = require("LocalStorage")
cc.Class({
    extends: cc.Component,

    properties: {
        text:cc.Node,
        btn_send:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },



    init(data){
        this._data = data;
        if(this.text){
            this.text.getComponent(cc.Label).string = data.text
            this.text.getComponent(cc.Label)._forceUpdateRenderData()
        }

        if(this.btn_send){
            this.btn_send.width = this.text.width
        }
    },


    onClickRarrage(event,custom){
        cc.log("onClickRarrage",this._data)
        if(this.text){
            this.text.color = cc.Color.BLACK.fromHEX("#FFFFFF")
        }

        let type = LocalStorage.getItem("barrage_type","barrage_type_1")
        ChatMessageMgr.sendMessage(this._data.langStr+"#@type"+type,type)
    },

    onEnable(){

        //发弹幕栏按钮
        if(this.btn_send){
            this.btn_send.on(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_send.on(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
            this.btn_send.on(cc.Node.EventType.TOUCH_END,this.ontTouchEndCallback,this);
        }

    },
    onDisable(){

        //发弹幕栏按钮
        if(this.btn_send){
            this.btn_send.off(cc.Node.EventType.TOUCH_START,this.ontTouchStartCallback,this);
            this.btn_send.off(cc.Node.EventType.TOUCH_CANCEL,this.ontTouchCancelCallback,this);
            this.btn_send.off(cc.Node.EventType.TOUCH_END,this.ontTouchEndCallback,this);
        }
    },

    ontTouchStartCallback(event){
        if(this.text){
            this.text.color = cc.Color.BLACK.fromHEX("#CFC58B")
        }
    },

    ontTouchCancelCallback(event){
        if(this.text){
            this.text.color = cc.Color.BLACK.fromHEX("#FFFFFF")
        }
    },

    ontTouchEndCallback(event){

        if(this.text){
            this.text.color = cc.Color.BLACK.fromHEX("#FFFFFF")
        }
    },



    // update (dt) {},
});
