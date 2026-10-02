// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let SceneBase = require("SceneBase");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

cc.Class({
    extends: SceneBase,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
    },
    onDestroy(){
        this._super();
    },

    start () {
        this._super();
        // target.emit(event.GAME_LAUNCH_SUCCESS);
    },

    // update (dt) {},

    _onSubgameStart(data){
        return false; //返回false，由NotifyHandler作默认处理
    },
});
