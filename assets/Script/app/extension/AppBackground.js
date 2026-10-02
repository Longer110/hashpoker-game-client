// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let my = require("my");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.view.resizeWithBrowserSize(true);
        // cc.view.setResizeCallback(function () {
        //     this._updateContentSize();
        // }.bind(this));

        // this.node.setSiblingIndex(-255);
        this.node.zIndex = -255;

        let size = cc.winSize;
        this.node.width = size.width;
        this.node.height = size.height;
        this.node.x = size.width/2;
        this.node.y = size.height/2;

        if(cc.sys.isBrowser&&!cc.sys.isMobile&&CC_BUILD){
            // this.node.color = cc.Color.BLACK;
        }

        my.target.on(my.event.RESIZE, this._updateContentSize, this);
    },
    onDestroy(){
        my.target.targetOff(this);
    },

    start () {
        this._updateContentSize();
    },

    // update (dt) {
    // },

    _updateContentSize(){
        let designSize = cc.view.getDesignResolutionSize();
        let size = cc.view.getFrameSize();
        let scaleX = size.width / designSize.width;
        let scaleY = size.height / designSize.height;
        let scale = Math.min(scaleX, scaleY);

        this.node.width = size.width/scale;
        this.node.height = size.height/scale + 200;
    },
});
