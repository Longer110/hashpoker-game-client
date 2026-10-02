// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
let MsgManager = require("MsgManager");
let CMD = require("protocol_hall");
let MSG = require("Msg_hall");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let ConfigGame = require("ConfigGame");
let i18n = require("i18n");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;
let MSG_FRAMEWORKS = require("Msg");

cc.Class({
    extends: cc.Component,

    properties: {
        scroll: cc.ScrollView, //子游戏场次列表容器
        template: cc.Prefab, //子游戏场次预制体

        _preloaded: false, //子游戏场景是否已预加载完成
        _clicked: false, //是否点击进入房间
        _blockIndex: -1,
        _itemCount: 0,
        _wrapper: null, //子包封装类
        // _prefabs: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
        MsgManager.on(MSG.RoomListRsp_CMD, this._onRepGetRoomList, this);
        target.on(event.SUBGAME_START, this._onSubgameStart, this);
        // MsgManager.on(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, this._onShowPrompt, this);
    },
    onDestroy(){
        target.targetOff(this);
        MsgManager.un(this._onRepGetRoomList);
        // MsgManager.un(this._onShowPrompt);
    },

    start () {
        if(app.game.getGame()){
            let data = app.game.getGame().getSubGameData();
            let nGameId = data.nGameId;
            app.hall.ctrl.reqRoomList(nGameId);
        }
        else{
            cc.warn("SubRoomBase", "start", "app.game.getGame() is null");
        }
    },

    // update (dt) {},

    init(){
        this._wrapper = app.game.getGame() || {};
        this._initContent();
    },
    
    //子游戏场次初始化
    _initContent(array){
        if(!array){
            array = app.game.getRoomList() || [];
        }

        let content = this.scroll.content;
        content.destroyAllChildren(false);

        cc.log("_initContent array:",array);
        for (let index = 0; index < array.length; index++) {
            let config = array[index];
            let prefab = cc.instantiate(this.template);
            prefab.parent = content;
            let texasGameRoomItem = prefab.getComponent("texasGameRoomItem");
            texasGameRoomItem.initRoomItem(this,config);
            prefab.active = true;
        }
    },

    //房间列表返回
    _onRepGetRoomList(data) {
        //出现异常
        if (data.sErrStr) {
            return;
        }

        this._initContent(data.arrRoomItems);
    },

    _onSubgameStart(){
        cc.log("_onSubgameStart");
        if(app.game.getGame()){
            let data = app.game.getGame().getSubGameData();
            let nGameId = data.nGameId;
            app.hall.ctrl.reqRoomList(nGameId);
        }
        else{
            cc.warn("SubRoomBase", "start", "app.game.getGame() is null");
        }
    },

    //点击子场次-->进入游戏
    onClickSubSession(subSession){
        this._clicked = true;

        let game = app.game.getGame();
        if(game){
            let roomid = subSession.getRoomId();
            game.setSubRoomID(roomid);
            
            game.checkEnterSubGame(game.getSubGameID(), game.getSubRoomID());
        }
        else{
            QYLogs.error("SubRoomBase", "onClickSubSession", "app.game.getGame() is null");
        }
    },

    onClickMenu(event, data){
        let target = event.target;
        switch(target.name){
            case "roomBackBtn":
                this._showHall();
                break;
            default:
                cc.log("unhandle:", target.name)
                break;
        }
    },

    //大厅
    _showHall(){
        // let data = app.game.getGame().getSubGameData();
        // let gameId = data.nGameId || 0;
        // app.native.toggleExitGame(gameId);

        let result = app.native.invokeFunction("toggleExitDialog");
        //接口内未处理，继续原来的逻辑
        if(!result.data){
            app.game.exitToHall();
        }
        //接口内已处理（表示已发询问消息到app，app内响应在哪里处理退出弹窗）
        else{
            //app内发送回 APP_ACTION_SHOW_EXIT_DIALOG，此消息已在场景基类SceneBase中处理
        }
    },    

    reqBackToLobby(){
        let data = app.game.getGame().getSubGameData();
        let gameId = data.nGameId || 0;
        app.native.toggleExitGame(gameId);
    },

     //检查是否可进入子游戏
     checkEnterFXQame(nGameId, nRoomId) {
        let data = {
            nGameId: nGameId,
            nRoomId: nRoomId,
        }
        app.net.send(CMD.Main_CMD.value, CMD.Main_CMD.BeforeLoadScenceReq_CMD, data);
    },

   _onShowPrompt (data){
        let self = this;

        let callback = data.callback;

        let path = "popup/dialog/texasDialog";
        app.texas.ui.loadPopup(path, function (component) {
            self.node.addChild(component.node, 1024);
            component._initDialog(data.showType,data.text);
            component.show(data.text, function (isOK) {
                if (isOK && callback) {
                    callback();
                }
            }.bind(this));
            component.node.position = cc.Vec2.ZERO;
        }.bind(this));
    }
});
