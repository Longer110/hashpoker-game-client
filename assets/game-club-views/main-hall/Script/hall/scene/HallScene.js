// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let app = require("App");
let SceneBase = require("SceneBase");
let MsgManager = require("MsgManager");
let AppBridge = require("AppBridge");
let MSG_NOTIFY = require("Msg_notify");
let MSG = require("Msg_club");
let i18n = require("i18n");
let LocalStorage = require("LocalStorage");
let HallClubCacheData = require("HallClubCacheData");
let SDKPlatform = require("SDKPlatform");
let HallClubControl = require("HallClubControl");
let UIFrame = require("UIFrame");


cc.Class({
    extends: SceneBase,

    properties: {
        changeEnvironment: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        MsgManager.on(MSG_NOTIFY.LOGICAL.SUBGAME_ENTER_START, this._onSubgameEnterStart, this);
        
    },
    onDestroy(){
        this._super();

        MsgManager.un(this._onSubgameEnterStart,this);

    },

    start () {
        this._super();
        LocalStorage.setAutoLoginState(true);

        let ChatMessageMgr = require("ChatMessageMgr");
        if(ChatMessageMgr){
            if(!ChatMessageMgr.isLogin() && ChatMessageMgr.isInit()){
                ChatMessageMgr.loginChatServer("",0)
            }
        }
        
        //预加载子游戏
        app.target.emit(app.event.HALL_PRELOAD_SUBGAME, null);

        this.showChangeEnvironment();
        this.checkAppVersion();

    },

    _addRollback(){
        //函数体不实现，则实际会触发 AppComponent 中的 _onRollback 
    },
    _removeRoolback(){

    },

    // update (dt) {
    // },

    //进入子游戏场景（由直播app主动触发）
    _onSubgameEnterStart(data){
        this.layerView.active = false;
        this.layerWidget.active = false;
    },
    //子游戏场景退出（由直播app主动触发）
    _onSubgameExitStart(data){
        // UIFrame.loadScene("hall");
        app.game.exitGame()
        App.postMessage(AppBridge.EVENT.SUBGAME_EXIT_FINISH);

    },

    _isConnect(){
        return (app.net && app.net.isConnect()) ? true : false;
    },

    
    
    _onHallEnterStart(data){
        return true;
    },

    /**
     * 直播间上锁/开锁（由直播app主动触发）
     * @param {Boolean} locked 
     * 子游戏重写此方法，处理上锁/开锁相关功能
     */
    _onLiveRoomLocked(locked){
        return true;
    },

    /**
     * 特殊玩法/普通玩法（由直播app主动触发）
     * @param {Boolean} special 
     * 子游戏重写此方法，处理特殊玩法/普通玩法功能
     */
    _onLiveSpecialMode(special){
        
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

        cc._widgetManager.onResized();
    },

    _onShowPrompt(data){
        cc.log("SceneBase._onShowPrompt data:", data);

        let path = "popup/dialog/UIDialog";
        let parent = app.node;
        let wrapper = app.ClubAssets;
        let bundleName = wrapper?wrapper.bundleName:my.wrapper.COMMON;
        wrapper.ui.loadPopup(path, function (component) {
            parent.addChild(component.node, 1024);
            component.setShowType(data.showType);
            component.setUIBtnTitle();
            component.show(data.text, function (isOK) {
                if(data.callback){
                    data.callback(isOK);
                }
            }, data.titleText);
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)            
        , {
            path_resources: "main-common/resources/"
        });
    },

    showChangeEnvironment(){
        if (cc.sys.isNative && cc.sys.os==cc.sys.OS_ANDROID && SDKPlatform.isDebug()){
            this.changeEnvironment.active = true;
            this.changeEnvironment.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
                let touch = event.touch;
                let location = this.node.convertToNodeSpaceAR(touch.getLocation());
                this.changeEnvironment.x = location.x;
                this.changeEnvironment.y = location.y;
            })

            let envi = app.storage.getItem("CLUB_ENVIRONMENT");
            let config = {nc: "内测", fc: "封测", ty: "体验", zs: "正式"};
            let label = this.changeEnvironment.getChildByName("New Label").getComponent(cc.Label);
            if (label){
                if (!envi){
                    label.string = config.nc;
                }else{
                    label.string = config[envi];
                }
            }
        }else{
            this.changeEnvironment.active = false;
        }
    },
    
    onClickEnvironment(event, customEventData){
        let index = Number(customEventData);
        switch(index){
            case 0:
                let btnList = this.changeEnvironment.getChildByName("btnList");
                if (btnList.active){
                    btnList.active = false;
                }else{
                    btnList.active = true;
                }
                break;
            case 1:
                //内测
                app.storage.setItem("CLUB_ENVIRONMENT", "");
                this.restartGame();
                break;
            case 2:
                //封测
                app.storage.setItem("CLUB_ENVIRONMENT", "fc");
                this.restartGame();
                break;
            case 3:
                //体验
                app.storage.setItem("CLUB_ENVIRONMENT", "ty");
                this.restartGame();
                break;
            case 4:
                //正式
                app.storage.setItem("CLUB_ENVIRONMENT", "zs");
                this.restartGame();
                break;

        }
    },

    restartGame(){
        if (!cc.sys.isNative){
            return
        }

        this.scheduleOnce(() => {
            app.audio.stopAll();
            if(jsb){
                jsb.fileUtils.purgeCachedEntries()
                var writePath =  qygameengine.GameEngine.getNewVersionSavePath();
                jsb.fileUtils.removeDirectory(writePath);
            }
            cc.sys.restartVM();
            cc.game.restart();
        }, 0);
       
    },

    checkAppVersion(){
        if (!cc.sys.isNative || cc.sys.os != cc.sys.OS_IOS){
            return
        }

        if (!app.config.NEW_VERSION){
            return;
        }

        let strTab = app.config.NEW_VERSION.split(".");
        let appVersion = app.config.VERSION;
        let appStrTab = appVersion.split(".");
        let strTabLen = strTab.length;
        let appStrTabLen = appStrTab.length;
        if (strTabLen < 4 || appStrTabLen < 4){
            return;
        }

        QYLogs.warn("new version = ", app.config.NEW_VERSION);
        QYLogs.warn("old version = ", app.config.VERSION);

        let sign = 0
        for (let i = 0; i < 4; i++) {
           if(sign == 0){
                let n1 = Number(strTab[i]);
                let n2 = Number(appStrTab[i]);
                if (n1 > n2){
                    sign = 2;
                    if (i <= 2){
                        sign = 3;
                    }
                }else if (n1 < n2){
                    sign = 1;
                }
           }
        }

        if (sign == 0 || sign == 1){
            return;
        }

        let params= {
            isOKAndCancel: sign == 2,
            callBack: function(isOK){
                if (isOK){
                    cc.sys.openURL("https://apps.apple.com/us/app/btt-poker/id6444848623");
                }
                
            }.bind(this),
            isUseRichText: false,
            text: i18n.t("CLUB_HALL_TIP.NEW_VERSION_TIP"),
        }

        HallClubControl.showDialog(params);
        app.config.NEW_VERSION = "";
    }

});
