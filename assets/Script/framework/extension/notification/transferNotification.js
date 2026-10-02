// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let TopNotificationItem = require("TopNotificationItem");

cc.Class({
    extends: TopNotificationItem,

    properties: {
        infoLabel: cc.RichText,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.content) {
            this.content.active = false;
        }
        
        this._data = null;
        this._schedule = null;
        this._remainTime = 0;
        this._totalTime = 10;  // 默认显示时间 10 秒
        this._isShowing = false;
        this._callback = null;
        this._manager = null;
        this.nameColor = '#FAA537';
        this.usdtColor = '#00FF86';
    },

    //nType转账充币提币按顺序类型1，2，3吧
    _initUI() {
        if (!this._data) return;
        if(this.infoLabel){
            // `已成功提取 <color=#00FF86>${Amount}USDT</color>,请核对`;
            // `已成功充值 <color=#00FF86>${Amount}USDT</color>,请核对`;
            // `已收到<color=#FAA537>${this._data.fromUser}</color>红包 <color=#00FF86>${this._data.toUser}USDT</color>,请核对`
            // this.infoLabel.string = `已收到<color=${this.nameColor}>${this._data.fromUser}</color>红包 <color=${this.usdtColor}>${this._data.toUser}USDT</color>,请核对`;
            this.infoLabel.string = this._data.nMsg//`已收到<color=#FAA537>${this._data.fromUser}</color>红包 <color=#00FF86>${this._data.toUser}USDT</color>,请核对`
        }
    },

    start () {

    },

    // update (dt) {},
});
