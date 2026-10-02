let i18n = require("i18n");
let AppBridge = require("AppBridge");
let app = require("App");
let UserInfo = require("UserInfo");

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
            this.label_time.node.y = -30
            this.label_tips.node.y = 25;
        }else{
            this.label_time.string = "";
            this.label_tips.node.y = 0;
        }
        this._isReturnHall = data&&data.isReturnHall;

        if(data.exitCallback){
            this._exitCallback = data.exitCallback
        }
    },

    setTipPosition(position){
        let bg = this.node.getChildByName("bg")
        if(bg){
            bg.setPosition(position);
        }
    },

    onClickTouch(){
        

        if(this._exitCallback){
            this._exitCallback(this.node);
            return
        }

        if(!this._isReturnHall){
            return
        }
        cc.log("weihu", "[WARN] onClickTouch");
        app.postMessage(AppBridge.EVENT.GAME_ERROR, {
            error: AppBridge.errorID(101),
        });

        if(!UserInfo.isLogin()){
            return;
        }
        
        if (app.url.get("live")) {
            app.game.exitToHall();
            this.node.destroy();
        }

    },
});
