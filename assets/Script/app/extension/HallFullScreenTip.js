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
let i18n = require("i18n");

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        cancelBtn: cc.Node,
        labelTip: cc.Label,
        labelCancel: cc.Label,
        _blockIndex: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        this.labelTip.lang = "COMMON.FULL_SCREEN_TIPS";
        this.labelCancel.lang = "COMMON.CANCEL";
    },
    init(ctrl){
        this._ctrl = ctrl;
    },
    onEnable: function () {
        if(cc.sys.isBrowser){
            (window.isFocusOnFullScreen = !0, this._fullListener = this.fullgameEvent.bind(this), window.addEventListener("clickFullGameDiv", this._fullListener), this._scrollListener = this.scrollEvent.bind(this), window.addEventListener("scroll", this._scrollListener));

            this.content.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
            this.content.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
            this.content.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
            this.content.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
        }
    },
    
    onDisable: function () {
        if(cc.sys.isBrowser){
            (window.isFocusOnFullScreen = !1, window.removeEventListener("clickFullGameDiv", this._fullListener), window.removeEventListener("scroll", this._scrollListener));

            this.content.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
            this.content.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
            this.content.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
            this.content.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
        }
    },
    fullgameEvent: function (e) {
         //console.log("clickFullGameDiv:", e),  //console.log("cc.visibleRect:", cc.visibleRect),  //console.log("cc.director.getWinSize():", cc.director.getWinSize());
        var t = document.getElementById("Cocos2dGameContainer"),
            i = t.style.width || t.clientWidth || t.offsetWidth || t.scrollWidth,
            n = t.style.height || t.clientHeight || t.offsetHeight || t.scrollHeight;
        i = parseFloat(i), n = parseFloat(n);
        var a = cc.visibleRect.width / 1334,
            o = cc.visibleRect.height / 750,
            r = 1334 / i,
            s = 750 / n,
            c = new cc.Vec2(e.x * r * a, (n - e.y) * s * o);
         //console.log("clickFullGameDiv point:", c, this.cancelBtn.getBoundingBoxToWorld());
        var rect = this.cancelBtn.getBoundingBoxToWorld();
        var l = rect.contains(c);
         //console.log("clickFullGameDiv w,h:", i, n), l && this.onClickCancel()
    },
    scrollEvent: function (e) {
        !(document.body.offsetHeight <= Math.round(1.01 * window.innerHeight)) || 90 != window.orientation && -90 != window.orientation || ( console.log("scrollEvent destroy"), this.onClickCancel())
    },
    onClickContent: function () {
        if(cc.sys.browserType == cc.sys.BROWSER_TYPE_SAFARI){
        }
        else{
            cc.screen.requestFullScreen();
        }
    },

    onClickCancel: function () {
        this.hide();
        MsgManager.fire(MSG.ENGINE.SCREEN_SIZE_CHANGE);
    },
    show(){
        //url指定fullscreen=1时，不显示全屏手势
        if(app.url.get("fullscreen")){
            return;
        };

        //  //console.error("HallFullScreenTip: show");
        if (cc.sys.isMobile) {
            if(cc.sys.browserType == cc.sys.BROWSER_TYPE_SAFARI){
                var e = document.getElementById("fullgame");
                if (e) {
                    e.style.display = "block";
                }
            }
            else{
            }
            this.node.active = true;

            this.showBlock(-1);
        } 
    },
    hide(){
        //  //console.error("HallFullScreenTip: hide");
        if (cc.sys.isMobile) {
            var e = document.getElementById("fullgame");
            if (e) {
                e.style.display = "none";
            }
            
            this.node.active = false;

            let self = this;
            if(self._blockIndex>0){
                //延迟隐藏block，防止点击穿透
                setTimeout(() => {
                    self.hideBlock();
                }, 1*1000);
            }
        }
    },
    showBlock(duration){
        if(App.isLoaded()){
            this.hideBlock();
            this._blockIndex = UIFrame.showBlockText("", false, null, duration);
        }
    },
    hideBlock(){
        if(this._blockIndex!=0){
            UIFrame.hideBlockText(this._blockIndex);
            this._blockIndex = 0;
        }
    },
    // touch event handler
    _onTouchBegan (event) {
        let touch = event.touch;
        this._touchBeganLocation = touch.getLocation();
    },

    _onTouchMove (event) {
    },

    _onTouchEnded (event) {
        if(!this._touchBeganLocation){
            return;
        }
        let touch = event.touch;
        let location = touch.getLocation();
        let offset = location.sub(this._touchBeganLocation);
        if(Math.abs(offset.y)>50){
            this.onClickContent();
        }
        else{
            this.onClickCancel();
        }
        this._touchBeganLocation = null;
    },

    _onTouchCancel () {
    },
});
