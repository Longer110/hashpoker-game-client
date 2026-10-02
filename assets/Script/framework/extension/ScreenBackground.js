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
let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;
cc.Class({
    extends: cc.Component,

    properties: {
        path: "",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        target.on(event.RESIZE, this._onResize, this);
    },
    onDestroy(){
        target.targetOff(this);
    },

    start () {
        this._loadScreenImage();
        this._onResize();
    },

    // update (dt) {},

    _onResize(){
        // let designSize = cc.view.getDesignResolutionSize();
        let designSize = this.node.getContentSize();
        let winSize = cc.winSize;
        let scaleX = winSize.width / designSize.width;
        let scaleY = winSize.height / designSize.height;
        let scale = Math.max(scaleX, scaleY);
        this.node.scale = scale;
    },

    _loadScreenImage(){
        //直播项目才处理
        if(!my.env.get("IS_LIVE_ONLY")){
            return;
        }

        if(!this.path || !my.url.get("live") || my.url.get("zb")) return;

        if(!window.app || !window.app.hall) return;
        
        let target = this.getComponent(cc.Sprite);
        let url = this.path;
        

        let wrapper = app.LiveAssets;
        let path = wrapper.path(url,null,"main-hall/resources/");
        wrapper.bundle.load(path, function (error, texture) {
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
});
