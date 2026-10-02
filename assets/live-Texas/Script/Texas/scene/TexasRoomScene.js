let SceneBase = require("SceneBase");

cc.Class({
    extends: SceneBase,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
        this._updataCanvas();
    },
    onDestroy() {
        this._super();
    },

    start() {
        this._super();
    },

    //断线重连成功后跳转子游戏
    _onGameReconnection(data) {
        // this._super(data);

        // 不处理，停留在房间列表
    },

    _updataCanvas(){
        let designSize = cc.view.getDesignResolutionSize();
        let winSize = cc.view.getFrameSize();
        let scaleX = winSize.width / designSize.width;
        let scaleY = winSize.height / designSize.height;
        let canvas = this.node.getComponent(cc.Canvas);

        if(canvas){
            canvas.fitWidth = scaleX<=scaleY ? true : false;
            canvas.fitHeight = scaleX>=scaleY ? true : false;
        }
    },

    //子游戏场景退出（由直播app主动触发）
    _onSubgameExitStart(data) {
        QYLogs.warn("FXQRoomScene", "----------------子游戏场景退出---------------", data);
        app.game.exitToHall();
    },
});
