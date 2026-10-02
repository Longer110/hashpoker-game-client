// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


let MsgManager = require("MsgManager");

cc.Class({
    extends: cc.Component,

    properties: {
        minScaleXBegin: {
            default: 1,
            type: cc.Float,
            tooltip: "横向比例小于该值时开始缩放"
        },
        minScaleYBegin: {
            default: 1,
            type: cc.Float,
            tooltip: "纵向比例小于该值时开始缩放"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._onResized();
        let MSG_NOTIFY = require("Msg_notify");
        MsgManager.on(MSG_NOTIFY.LOGICAL.FIT_LAYOUT_SCALE, this._onResized, this);
    },
    onDestroy: function () {
        MsgManager.un(this._onResized,this);
    },
    start () {
    },

    // update (dt) {},

    _onResized(){
        // let fitScale = App.getFitScale();
        // let scaleX = fitScale.scaleX;
        // let scaleY = fitScale.scaleY;

        // let scale = Math.min(scaleX, scaleY);
        // if(scale<this.minScaleXBegin || scale<this.minScaleYBegin){
        // }
        // else{
        //     scale = 1;
        // }
        // scale = Math.max(scale, 0.1);
        // this.node.scale = scale;
    },
});
