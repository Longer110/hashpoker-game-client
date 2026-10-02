let i18n = require("i18n");
let AppBridge = require("AppBridge");
let app = require("App");
let UserInfo = require("UserInfo");
let MsgManager = require("MsgManager");
let LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        label_tips:cc.Label,
        label_time:cc.Label,
        icon:cc.Sprite,

        _isReturnHall:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.label_tips.lang = "COMMON.YOU_XI_WEI_HU";
    },

    init(data){
        if(data&&data.sTimeStart&&data.sTimeEnd){
            this.label_time.string = app.util.timestampToTime(data.sTimeStart) + " ~ " + app.util.timestampToTime(data.sTimeEnd);
        }else{
            this.label_time.string = "";
            this.label_tips.node.y = 0;
        }

        this._isReturnHall = data&&data.isReturnHall;
    },

    onClickTouch(){
        cc.log("weihu", "[WARN] onClickTouch");
        app.postMessage(AppBridge.EVENT.GAME_ERROR, {
            error: AppBridge.errorID(101),
        });

        var scene = cc.director.getScene();
        if(scene && scene.name == "main-login"){
            this.node.destroy();
            return;
        }
        
        this._logOut();
        this.node.destroy();
    },

     //登出
     _logOut(){
        //断开游戏连接
        if (app.net.isConnect()) {
            app.net.disConnect(true);
            app.net.release();
        }

        MsgManager.fire("logout");
        LocalStorage.setAutoLoginState(false);
        
        //退出登录，返回到登录界面
        // UIFrame.loadScene("login", null, null, null, true);
        app.res.loadLogin(function onComplete(params) {
            
        })
    },
});
