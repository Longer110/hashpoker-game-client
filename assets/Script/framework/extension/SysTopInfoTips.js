// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let Base64 = require("base64");
let Utils = require("Utils");
let UserInfo = require("UserInfo");
let AppBridge = require("AppBridge");
let LocalStorage = require("LocalStorage");
let MsgManager = require("MsgManager");
let UIFrame = require("UIFrame")

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        showTime: cc.Label,
        title: cc.RichText,
        _data: null,
        _schedule: null,

        time: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.content.active = false
        this.nameColor = '#FAD553'
        this.tipsColor = '#65778B'
    },

    start () {

    },

    setData(data) {
        if(data) this._data = data
        
        this._initUI()
    },

    show() {
        this.node.active = true
        this.content.setPosition(0, 300)
        this.content.active = true
        this._invoke()
    },

    hide() {
        this.content.active = false
        this.node.active = false
    },

    _initUI() {
        let sName = Utils.getShortText(Base64.decode(this._data.sName), 12);

        let text = ""
        
        //1收到转币 2充币成功 3提币成功
        if(this._data.nType == 1) {
            text = `<color=#E8DFD1>已收到</c><color=#0fffff>${sName}</color><color=#E8DFD1>红包</c><color=#0fffff>1USDT</color><color=#E8DFD1>,请核对</c>`
        } else if(this._data.nType == 2) {
            text =  `<color=#E8DFD1>已成功充值</c><color=#0fffff>${sName}USDT</c>`
        } else if(this._data.nType == 3) {
            text = `<color=#E8DFD1>已成功提取</c><color=#0fffff>${sName}USDT</c>`
        }
        this.title.string = text
    },

    //确认邀请
    onClickConfirm() {
        this.hide()

    },

    //取消
    onClickCancel() {

        this.hide()
    },

    _invoke() {

        let callback = cc.callFunc(function () {
            
        }, this);

        this.content.stopAllActions();
        let offset = new cc.Vec2(0, -15);
        let seq = cc.sequence(
            cc.moveTo(0.2, offset),
            callback
        );
        
        this.content.runAction(seq);
        this.timeCountdown();
    },

    timeCountdown() {
        if(this._data) {
            this.time = 10
            this.showTime.string = this.time + 'S'
            if(this._schedule) this.unschedule(this._schedule)
            this._schedule = () => {
                this.time --
                this.showTime.string = this.time + 'S'
                if(this.time < 0) {
                    this.unschedule(this._schedule)
                    this._schedule = null
                    this.time = 10
                    this.hide()
                }
            }
            this.schedule(this._schedule, 1)
        }
    },

});
