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
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,
    properties: {
        islandscape: !0,
        _resizeTime: 0,
        _updateTime: 0,
    },
    start: function () {
        this._resizeTime = 0, CC_WECHATGAME || CC_QQPLAY || !cc.sys.isBrowser || (this.html = document.getElementsByTagName("html")[0]), this.setMyFrameSize()
    },
    onLoad: function () {
        this.setMyFrameSize(), this._changeCount = 0, cc.sys.isBrowser && (this._orientation = window.orientation, this._resizeCallback = this.setMyFrameSizeAgain.bind(this), window.addEventListener("resize", this._resizeCallback), window.addEventListener("orientationchange", this._resizeCallback), document.addEventListener("rotateScreen", this._resizeCallback), document.addEventListener("resetScreen", this._resizeCallback), 0 == this.isOpenInIosWebview() && (this.schedule(this.onCheckOrientation, .1), this.schedule(this.onChangeOrientation, .5)))
        
        MsgManager.on(MSG.ENGINE.SCREEN_SIZE_CHANGE, this.updataCanvas, this);
        this._updateTime = 0;
        this.updataCanvas();
    },
    onDestroy: function () {
        cc.sys.isBrowser && (window.removeEventListener("resize", this._resizeCallback), window.removeEventListener("orientationchange", this._resizeCallback), document.removeEventListener("rotateScreen", this._resizeCallback), document.removeEventListener("resetScreen", this._resizeCallback), this._resizeCallback = null)
        
        MsgManager.un(this.updataCanvas,this);
    },
    lateUpdate: function (dt) {
        if(cc.sys.isBrowser && this._updateTime<5){
            this.updataCanvas();
            this._updateTime += dt;
        }
    },
    availWidth: function (e) {
        return e && e !== this.html ? e.clientWidth : window.innerWidth
    },
    availHeight: function (e) {
        return e && e !== this.html ? e.clientHeight : window.innerHeight
    },
    setMyFrameSizeAgain: function () {
        // // // console.log("setMyFrameSizeAgain isFocusOnFullScreen:", window.isFocusOnFullScreen), 
        // (1 != window.isFocusOnEditBox && 1 != window.isFocusOnFullScreen || !false) && setTimeout(function () {
        //     this.setMyFrameSize()
        // }.bind(this), 50);

        // var e = 50;
        // cc.sys.browserType === cc.sys.BROWSER_TYPE_IE && (e = 0);
        // var i = this;
        
        // setTimeout(function () {
        //     var e = i.checkFull() ? 1 : 0;
        //     if (i.flag != e) {
        //         i.flag = e;
        //         var t = document.body;
        //         if(cc.sys.browserType === cc.sys.BROWSER_TYPE_IE){
        //             i.checkFull() ? t.className = "full" : t.className = "";
        //             var evt = document.createEvent('UIEvents');
        //             evt.initUIEvent('resize', true, false, window, 0);
        //             window.dispatchEvent(evt);
        //         }
        //         else{
        //             i.checkFull() ? t.className = "full2" : t.className = "";
        //             window.dispatchEvent(new Event("resize"));
        //         }
        //         i._onScreenFullChange();
        //     }
        //     i._onScreenSizeChange();
        // }.bind(this), e)
    },
    checkFull: function () {
        // var e = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        // return void 0 === e && (e = !1), e || document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width
        return UIFrame.checkFullScreen();
    },
    isOpenInIosWebview: function () {
        if (0 == cc.sys.isMobile) return !1;
        
        var e = navigator.userAgent,
            t = !(e.match(/Chrome\/([\d.]+)/) || e.match(/CriOS\/([\d.]+)/)) && e.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);
        return cc.sys.os === cc.sys.OS_IOS ? 1 == t || null != t : void 0
    },
    
    updataCanvas(){
        let scene = cc.director.getScene();
        let canvas = scene.getChildByName("Canvas");
        if(canvas){
            let scenebase = canvas.getComponent("SceneBase");
            if(scenebase && typeof scenebase._onResize == "function"){
                scenebase._onResize();
            }
        }
    },
    onCheckOrientation: function () {
        var e = parseInt(this.availWidth(cc.game.frame)),
            t = parseInt(this.availHeight(cc.game.frame)),
            i = !1;
        e == parseInt(cc.game.container.style.width) && t == parseInt(cc.game.container.style.height) || (i = !0), this._orientation != window.orientation && (this._orientation = window.orientation, i = !0), i && (/*console.log("onCheckOrientation change"),*/ this.updateOrientationChange(), this._changeCount = 8)
    },
    onChangeOrientation: function () {
        0 < this._changeCount && (this.updateOrientationChange(), this._changeCount--)
    },
    updateOrientationChange: function () {
        if (1 != window.isFocusOnEditBox && 1 != window.isFocusOnFullScreen) {
            cc.view._resizeEvent();
            var e = document.createEvent("HTMLEvents");
            e.initEvent("rotateScreen", !0, !0), document.dispatchEvent(e), window.scrollTo(1, 1), window.scrollTo(0, 0)
        }
    },
    changeOrientation: function (e) {
        this.islandscape = e, this.setMyFrameSize()
    },
    setMyFrameSize: function () {
        if (this.node && cc.sys.isBrowser) {
            var e = Date.now();
            // console.log("ScreenResolution start ", e, this._resizeTime);
            if (!(e - this._resizeTime < 500)) {
                this._resizeTime = e;

                cc.sys.isBrowser && (window.scrollTo(1, 1), window.scrollTo(0, 0));

                let self = this;
                setTimeout(() => {
                    self._onScreenFullChange();
                    self._onScreenSizeChange();
                }, 1000);//毫秒
            }
        }
    },
    _onScreenFullChange(data){
        this._updateTime = 0;
        MsgManager.fire(MSG.ENGINE.SCREEN_FULL_CHANGE);
        if(cc.sys.isMobile){
            let full = UIFrame.checkFullScreen();
            // console.error("Screen: _onScreenFullChange", full);
            if(full){
                UIFrame.hideFullScreenTip();
            }
            else{
                UIFrame.showFullScreenTip();
                // window.scrollTo(1, 1);
                window.scrollTo(0,0);
            }
        }
    },
    _onScreenSizeChange(data){
        this._updateTime = 0;
        MsgManager.fire(MSG.ENGINE.SCREEN_SIZE_CHANGE);
    },
});
