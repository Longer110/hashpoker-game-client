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
let MSG = require("Msg");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        path: "",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // MsgManager.on(MSG.ENGINE.SCREEN_SIZE_CHANGE, this._onScreenSizeChangeCallback, this);
    },
    onDestroy(){
        // MsgManager.un(this._onScreenSizeChangeCallback);
    },

    start () {
        // this._onScreenSizeChangeCallback();
        this._loadScreenImage();
    },

    // update (dt) {},

    _loadScreenImage(){
        if(!this.path || !app.url.get("zb")) return;//主播才显示

        let target = this.getComponent(cc.Sprite);
        let url = this.path;

        let wrapper = app.LiveAssets;
        let path = wrapper.path(url,null,"main-hall/resources/");

        wrapper.bundle.load(path, cc.texture,function (error, texture) {
            if(error) {
                QYLogs.error("Utils", "加载资源出错: url=" + url, error);
                // return;
            }
            else{
                if(cc.isValid(target)){
                    target.spriteFrame = new cc.SpriteFrame(texture);
                }
            }
        })
    },

    // _onScreenSizeChangeCallback(){
    //     // let designSize = cc.view.getDesignResolutionSize();
    //     let designSize = this.node.getContentSize();
    //     let winSize = cc.winSize;
    //     let scaleX = winSize.width / designSize.width;
    //     let scaleY = winSize.height / designSize.height;
    //     let scale = Math.max(scaleX, scaleY);
    //     this.node.scale = scale;
    // },
});
