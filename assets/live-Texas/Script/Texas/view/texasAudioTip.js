/*
    下局站起确认提示
*/

let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,
    properties: {
        rechargeTip: cc.Node,
        voiceTip: cc.Node,
        ToggleTip: cc.Node,
        tipLabel: cc.Label,
    },


    start () {
        // this.initUI({nCost:1000, nCount:500, nBuyCount:5, nTime:10})
    },

    // update (dt) {},

    show(data){
    },

    close(){
        this.node.active = false;
    },

    initData(data){
        this.onConfirm = data.onConfirm;
        this.onCancel = data.onCancel;
        this.nVideoFee = data.nVideoFee;
        this.isRecharge = data.isRecharge;
        this.rechargeTip.active = data.isRecharge;
        this.voiceTip.active = !data.isRecharge;
        let isShowTip = localStorage.getItem("TEXAS_VOICE_ISSHOW_TIP") || "1";
        this.ToggleTip.getComponent(cc.Toggle).isChecked = isShowTip !== "0"
        this.tipLabel.string = "开启实时语音后，每分钟以" + (this.nVideoFee || 0.002) + "USDT的价格收费，平台将以分钟为单位从你的资产账户中扣款，余额不足时将停止实时语音服务。";
    },

    btnConfirm(event,customEventData){
        let index = parseInt(customEventData);
        if (index == 1) {
            //充币
            if (this.onConfirm && typeof this.onConfirm === 'function') {
                this.onConfirm();
            }
        } else {
            //确定
            if (this.onConfirm && typeof this.onConfirm === 'function') {
                this.onConfirm();
            }
        }
        let isChecked = this.ToggleTip.getComponent(cc.Toggle).isChecked;
        localStorage.setItem("TEXAS_VOICE_ISSHOW_TIP", isChecked ? Date.now()  : "0");
        this.node.destroy();
    },

    btnCancel(event,customEventData){
        let index = parseInt(customEventData);
        //取消
        if (this.onCancel && typeof this.onCancel === 'function') {
            this.onCancel();
        }
        let isChecked = this.ToggleTip.getComponent(cc.Toggle).isChecked;
        localStorage.setItem("TEXAS_VOICE_ISSHOW_TIP", isChecked ? Date.now() : "0");
       this.node.destroy();
    },

    btnClose(event,customEventData){
        let index = parseInt(customEventData);
        //取消
        if (this.onCancel && typeof this.onCancel === 'function') {
            this.onCancel();
        }
        let isChecked = this.ToggleTip.getComponent(cc.Toggle).isChecked;
        localStorage.setItem("TEXAS_VOICE_ISSHOW_TIP", isChecked ? Date.now() : "0");
        this.node.destroy();
    },
    onClickToggle(event, customEventData){
        let isChecked = event.isChecked;
        // localStorage.setItem("TEXAS_VOICE_ISSHOW_TIP", isChecked ? "1" : "0");
    }

});
