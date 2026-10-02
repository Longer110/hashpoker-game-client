/*
    下局站起确认提示
*/

let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        onConfirm: null,  // 确认回调函数
        onCancel: null,   // 取消回调函数
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

    btnConfirm(){
        //确认下局站起
        if (this.onConfirm && typeof this.onConfirm === 'function') {
            this.onConfirm();
        }
        this.node.active = false;
    },

    btnCancel(){
        //取消下局站起
        if (this.onCancel && typeof this.onCancel === 'function') {
            this.onCancel();
        }
        this.node.active = false;
    },

    btnClose(){
        // 关闭按钮等同于取消
        if (this.onCancel && typeof this.onCancel === 'function') {
            this.onCancel();
        }
        this.node.active = false;
    }

});
