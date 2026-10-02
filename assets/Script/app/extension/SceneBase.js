// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-07-18 10:05:23
//     * @Description: 场景基类
// ]]
let Msg_login = require("Msg_login");
let MsgManager = require("MsgManager");
// let MSG_NOTIFY = require("Msg_notify");
let MSG_FRAMEWORKS = require("Msg");
// let UIFrame = require("UIFrame");
// let UINoticeData = require("UINoticeData");
// let GameInstance = require("init_game");
let TopNotificationManager = require("TopNotificationManager");

require("debugout");
require("QYLogs");
require("my");

let SceneAltas = require("SceneAltas");
// let app = App = require("App");
let LoadingBlock = require("LoadingBlock");
let UIFrame = require("UIFrame");
let UINoticeData = require("UINoticeData");
let HALL_MSG = require("Msg_hall");


cc.Class({
    extends: my.SceneCommon,

    properties: {
        //适配面板
        panelAdapter: {
            default: null,
            type: cc.Node,
            tooltip: '适配面板，用于界面适配',
        },
        altas: {
            default: null,
            type: SceneAltas,
            tooltip: '场景加载公用弹窗时用到的图集类',
            visible: false,
            serializable: false,
        },
        widthIngame: {
            default: 750,
            type: cc.Integer,
            tooltip: '直播项目游戏内牌桌面板 width (app用于调整聊天区域宽度)',
        },
        heightIngame: {
            default: 490,
            type: cc.Integer,
            tooltip: '直播项目游戏内牌桌面板 height (app用于调整聊天区域高度)',
        },

        _backgroundColor: "", //场景控制document.body使用的背景色，""使用透明色
    },
    editor: CC_EDITOR && {
        // requireComponent: SceneAltas,
    },

    // LIFE-CYCLE CALLBACKS:

    _onResize(){
        this._super();
        
        LoadingBlock.updateContent();
        
    },


    onLoad() {
        this._super();
        MsgManager.on(HALL_MSG.AccountPayInfoRsp_CMD, this._noticePayInfoTip, this);
        this._initBodyColor();

        this.altas = this.getComponent(SceneAltas);
        if(!this.altas){
            // cc.error("TODO", cc.director.getScene().name, "场景需要挂载 SceneAltas 组件");
        }
        app.handler.setHandler(this);

        window.isFocusOnEditBox = false;
        // MsgManager.on(MSG_NOTIFY.LOGICAL.GAME_RECONNECTION, this._onGameReconnection, this);
        this._initBaseData();


        if(!app.config.IS_LIVE_ONLY){//跑马灯
            if(!UINoticeData.isEmpty() && !UIFrame.isPopupByName("NoticePrefabs")){
                let path = "popup/notice/NoticePrefabs";
                app.SetAssets.ui.loadPopup(path, function (component) {
                    let scene = cc.director.getScene()
                    let canvas = scene ? scene.getChildByName("Canvas"):null;
                    if(cc.isValid(scene) && scene.name != "main-login" && cc.isValid(canvas)){
                        canvas.addChild(component.node, 1024)
                    }else{
                        UIFrame.removePopup("NoticePrefabs")
                    }
                }.bind(this),{ path_resources: "main-common/resources/",isShowLoading:true});
            }
        }


        let game = app.game.getGame();
        if(game){
            game.setIngameWidth(this.widthIngame);
            game.setIngameHeight(this.heightIngame);
        }

        MsgManager.on(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, this._onShowPrompt, this);


        app.native.on(app.bridge.EVENT.SUBGAME_EXIT_START, this._onSubgameExitStart, this);
        app.native.on(app.bridge.EVENT.ROOM_CLOSE, this._onLiveRoomClose, this);
        app.native.on(app.bridge.ACTION.APP_ACTION_ROOM_LOCK, this._onLiveRoomLocked, this);
        app.native.on(app.bridge.ACTION.APP_ACTION_TOGGLE_FULLSCREEN, this._onLiveSpecialMode, this);
        //app通知游戏在哪里处理退出弹窗
        app.native.on(app.bridge.ACTION.APP_ACTION_SHOW_EXIT_DIALOG, this._onShowExitDialog, this);
        MsgManager.on(Msg_login.GATEWAY.SUB_NOTICE_MSG, this.onNoticeMsg, this);//消息通知
        
		if(app.game.getGame()){
            this._gameID = app.game.getGame().getSubGameData().nGameId;
        }     

        if(app.game.getGame() && !app.game.isRunGameScene()){//在房间列表场景            
            this._currentScene = "inRoomScene";

            //埋点
            app.statis.upload({
                sUiPath: "hall/" + this._gameID + "/roomlist",
                sEvent: "openView",
            });
        }
        
        if(app.game.isRunGameScene()){//在游戏场景
            this._currentScene = "inGameScene";
            
            //埋点
            app.statis.upload({
                sUiPath: "hall/" + this._gameID + "/roomlist/game",
                sEvent: "openView",
            });
        }
    },

    onDestroy() {
        this._super();
        MsgManager.un(this._noticePayInfoTip,this);
        App.handler.setHandler(null);
        MsgManager.un(this._onShowPrompt, this);
        MsgManager.un(this.onNoticeMsg, this);

        if(this._currentScene === "inRoomScene"){
            //埋点
            app.statis.upload({
                sUiPath: "hall/" + this._gameID + "/roomlist",
                sEvent: "closeView",
            });
        }
        if(this._currentScene === "inGameScene"){
            //埋点
            app.statis.upload({
                sUiPath: "hall/" + this._gameID + "/roomlist/game",
                sEvent: "closeView",
            });
        }
    },
    //消息通知
    onNoticeMsg(msg){
        cc.log("SceneBase onNoticeMsg:", msg);
        if(!msg){
            return;
        }
        let noticeType = msg.nType || 0;
         UIFrame.showTopNotification(TopNotificationManager.NotificationTypeEnum.TRANSFER ,msg, {duration: 10} );

    },

    _noticePayInfoTip(msg){
        // if (msg.nCode == 0) {
        //     UIFrame.showTips("充值成功到账");
        // } else {
        //     UIFrame.showTips("充值失败");
        // }
    },

    start() {
        this._super();
     },

    _initBaseData() {
    },

    _initBodyColor(){
        if(!CC_BUILD || !cc.sys.isBrowser){
            return;
        } 

        if(!!this._backgroundColor){
            this.scheduleOnce(function (params) {
                if(!cc.isValid(this)){
                    return;
                }
                //b皮肤指定背景色
                document.body.style.backgroundColor=this._backgroundColor;
            
            }.bind(this), 0.5);
        }
        else{
            //默认webview透明背景
            if(app.config.IS_LIVE_ONLY){
                if(app.game.getGame()){
                    if(app.game.getGame().isLiveGame()){
                        document.body.style.backgroundColor="transparent";
                    }else{//当前游戏是合集游戏
                        document.body.style.backgroundColor="black";
                    }
                }else{
                    document.body.style.backgroundColor="transparent";
                }
            }else{
                document.body.style.backgroundColor="black";
            }
            
        }
        
    },

    _onShowPrompt(data){
        cc.log("SceneBase._onShowPrompt data:", data);

        let path = "popup/dialog/UIDialog";
        let parent = app.node;
        let gameWrapper = app.game.getGame()
        let wrapper = app.common;
        if(gameWrapper){
            let url = gameWrapper.path(path);
            if(gameWrapper.bundle.getInfoWithPath(url)){
                wrapper = gameWrapper;
            }
        }
        let bundleName = wrapper?wrapper.bundleName:my.wrapper.COMMON;
        wrapper.ui.loadPopup(path, function (component) {
            parent.addChild(component.node, 1024);
            component.setShowType(data.showType);
            component.showTitle(data.titleText);
            component.show(data.text, function (isOK) {
                if(data.callback){
                    data.callback(isOK);
                }
            }, data.titleText);
          
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)            
        , {
            loader: bundleName
        });
    },

    /**
     * 子游戏场景退出（由直播app主动触发）
     * @param {Object} data 
     * 子游戏重写此方法，实现退出牌桌/退出子游戏场景逻辑
     */
    _onSubgameExitStart(data){
        cc.warn("[ERROR]: 子游戏场景退出（由直播app主动触发）: ", data);
        // if(app.config.IS_NATIVE_LIB){
            let game = app.game.getGame();
            if(game){
                app.util.setOrientation(game.isLandscape());
                app.game.exitToHall();
            }
        // }
    },

    /**
     * 直播间下播，子游戏退出服务器（由直播app主动触发）
     * @param {Object} data 
     * 子游戏重写此方法，实现退出子游戏服务器逻辑
     */
    _onLiveRoomClose(data){
        cc.warn("[ERROR]: 直播间下播，子游戏退出服务器（由直播app主动触发）", data);
    },

    /**
     * 直播间上锁/开锁（由直播app主动触发）
     * @param {Boolean} locked 
     * 子游戏重写此方法，处理上锁/开锁相关功能
     */
    _onLiveRoomLocked(locked){
        cc.warn("SceneBase", "直播间上锁状态：locked="+locked);
    },

    /**
     * 特殊玩法/普通玩法（由直播app主动触发）
     * @param {Boolean} special 
     * 子游戏重写此方法，处理特殊玩法/普通玩法功能
     */
    _onLiveSpecialMode(special){
        cc.warn("SceneBase", "特殊玩法/普通玩法：special="+special);
    },


    /**
     * app通知h5游戏退出弹窗在哪里处理 APP_ACTION_SHOW_EXIT_DIALOG
     * @param {string} value 
     */
    _onShowExitDialog(value){
        //需要游戏中处理
        if(value == "game"){
            //默认直接退出游戏
            app.game.exitToHall();
        }
    },

    //充值弹窗
    createGameRechargeView(parent) {
        //加载GameRechargeView预制体，并创建GameRechargeView
        let addRechargeView = () => {
            parent = parent || this.panelContent;
            if (!parent) {
                cc.warn("createGameRechargeView 获取父节点失败");
                return;
            }
            let node = cc.instantiate(this._gameRechargePrefab);
            parent.addChild(node, 1024);
        };
        if (this._gameRechargePrefab) {
            addRechargeView();
            return;
        }
        if (this._isLoadingRechargeView) {
            return;
        }
        let wrapper = app.ClubViews;
        if (!wrapper || !wrapper.bundle) {
            cc.warn("createGameRechargeView ClubViews bundle 未就绪");
            return;
        }
        this._isLoadingRechargeView = true;
        let path = "main-hall/Script/hall/view/game/GameRechargeView";
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            this._isLoadingRechargeView = false;
            if (error) {
                cc.error("createGameRechargeView 加载预制体失败", error);
                return;
            }
            this._gameRechargePrefab = prefab;
            if (!cc.isValid(this.node)) {
                return;
            }
            addRechargeView();
        }.bind(this));
    },


    //私人房密码输入
    showInputRoomPassword(parent,data) {
        //加载InputRoomPassword预制体，并创建InputRoomPassword
        let addRView = () => {
            parent = parent || this.panelContent;
            if (!parent) {
                cc.warn("InputRoomPassword 获取父节点失败");
                return;
            }
            let node = cc.instantiate(this._inputRoomPassPrefab);
            parent.addChild(node, 1024);
            node.getComponent("InputRoomPassword").init(data);
        };
        if (this._inputRoomPassPrefab) {
            addRView();
            return;
        }
        if (this._isLoadingInputRoomPassView) {
            return;
        }
        let wrapper = app.ClubViews;
        if (!wrapper || !wrapper.bundle) {
            cc.warn("InputRoomPassword ClubViews bundle 未就绪");
            return;
        }
        this._isLoadingInputRoomPassView = true;
        let path = "main-hall/Script/hall/view/my/InputRoomPassword";
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            this._isLoadingInputRoomPassView = false;
            if (error) {
                cc.error("InputRoomPassword 加载预制体失败", error);
                return;
            }
            this._inputRoomPassPrefab = prefab;
            if (!cc.isValid(this.node)) {
                return;
            }
            addRView();
        }.bind(this));
    },
    
});