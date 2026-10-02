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
let app = require("App");
let UIBase = require("UIBase");
let MsgManager = require("MsgManager");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let AppBridge = require("AppBridge");
let UserInfo = require("UserInfo");
let LocalStorage = require("LocalStorage");
// let MSG_NOTIFY = require("Msg_notify");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

cc.Class({
    extends: UIBase,

    properties: {
        panelTop: cc.Node,
        panelBottom: cc.Node,
        labelNetStatus: cc.Label,

        labelToken: cc.Label,
        labelAccount: cc.Label,
        labelViewer: cc.Label,

        labelSkinDefault: cc.Label,
        labelSkinA: cc.Label,
        labelSkinB: cc.Label,

        labelLock: cc.Label,
        labelUnLock: cc.Label,

        labelPaiJu: cc.Label,
        labelPaiZhuoTitle: cc.Label,
        labelPaiZhuo: cc.Label,
        labelGold: cc.Label,
        
        labelSpecial: cc.Label,
        labelNormal: cc.Label,

        _txtCurr: "(当前)",
        _isRoomLocked: false,
        _isSpecialMode: false,
        _inited: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //websock监听
        this._listHandler = [];
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this._onBeforeSceneLaunch, this);
        my.net.on(my.NetworkEvent.OPEN, this._onWebsocketOpen, this);
        my.net.on(my.NetworkEvent.CLOSE, this._onWebsocketClose, this);
        target.on(event.SERVER_LOGIN_SUCCESS, this._onLoginSuccess, this);

        app.native.on(app.bridge.ACTION.APP_ACTION_ROOM_LOCK, this._setRoomLock, this);
        app.native.on(app.bridge.ACTION.APP_ACTION_TOGGLE_FULLSCREEN, this._setSpecialMode, this);
        

        this._isRoomLocked = App.getRoomLocked();
        this._isSpecialMode = App.getSpecialMode();
    },
    onDestroy(){
        cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this._onBeforeSceneLaunch, this);
        my.net.targetOff(this);
        target.targetOff(this);
        app.native.targetOff(this);
        
        this._un();
    },
    init(){
        if(this._inited) return;
        this._inited = true;
        this._initPanel();
        this._initMenu();
        this.showMenu(false, true);
    },
    start () {
        this._super();
        this.init();
    },
    _on(msg, handler) {
        MsgManager.on(msg, handler, this);
        this._listHandler.push(handler);
    },
    _un(handler) {
        if(handler){
            for (let index = 0; index < this._listHandler.length; index++) {
                let callback = this._listHandler[index];
                if(handler==callback){
                    MsgManager.un(callback, this);
                    this._listHandler.splice(index, 1);
                    break;
                }
            }
        }
        else if(this._listHandler){
            for (let index = 0; index < this._listHandler.length; index++) {
                let callback = this._listHandler[index];
                MsgManager.un(callback, this);
            }
            this._listHandler = [];
        }
    },
    _onBeforeSceneLaunch(){
        this._setSpecialMode(false);
    },
    _onLoginSuccess(data){
        //登录失败
        if (!data) {
            // UIFrame.showTips("登录服务器失败");
            return;
        };

        this._updateLoginStatus();
    },
    //Websocket状态监听
    _onWebsocketOpen(data){
        this._updateNetStatus(true);
    },
    _onWebsocketClose(data){
        this._updateNetStatus(false);
    },
    _updateNetStatus(connect){
        let text = connect ? "网络已连接" : "网络已断开";
        this.labelNetStatus.string = text;
    },
    _updateLoginStatus(){
        let txtToken = "令牌登录";
        let txtAccount = "账号登录";
        let txtViewer = "观众登录";
        if(UserInfo.isViewer()){
            txtViewer += this._txtCurr;
        }
        else if(UserInfo.isAccount()){
            txtAccount += this._txtCurr;
        }
        else{
            txtToken += this._txtCurr;
        }
        this.labelToken.string = txtToken;
        this.labelAccount.string = txtAccount;
        this.labelViewer.string = txtViewer;
    },
    _initPanel(){
        this.content.getComponent(cc.Widget).enabled = false;
        this.content.width = cc.winSize.width;
        this.content.height = cc.winSize.height;
    },
    // update (dt) {},
    _initMenu(){
        this._updateLoginStatus();
        this._updateSkinLabel();
        this._setRoomLock(this._isRoomLocked);
        this._setSpecialMode(this._isSpecialMode);
        this._updateNetStatus(app.net.isConnect());

        let buttomHandler = function (panel) {
            for (let index = 0; index < panel.children.length; index++) {
                let child = panel.children[index];
                let button = child.getComponent(cc.Button);
                var eventHandler = new cc.Component.EventHandler();
                eventHandler.target = this.node;
                eventHandler.component = "UIAppPanel";
                eventHandler.handler = "_onClickMenu";
                // eventHandler.customEventData = "";
                button.clickEvents.push(eventHandler);
            }
        }.bind(this);
        buttomHandler(this.panelTop);
        buttomHandler(this.panelBottom);
    },
    showMenu(visible, force){
        let panel = this.panelBottom.parent;
        let widget = panel.getComponent(cc.Widget);
        if(widget){
            widget.enabled = false;
        }
        let width = panel.width;
        let height = panel.height;
        let duration = 0.5;
        let x = 0;
        let y = 0;
        let preCall = null;
        let callback = null;
        if(visible){
            panel.y = -height;
            preCall = cc.callFunc(function () {
                this.block.node.active = visible;
            }, this);
            callback = cc.callFunc(function () {
                
            }, this);
        }
        else{
            y = -height;
            preCall = cc.callFunc(function () {
            }, this);
            callback = cc.callFunc(function () {
                this.block.node.active = visible;
            }, this);
        }
        let seq = cc.sequence(
            preCall,
            cc.moveTo(this._duration, x, y).easing(visible?cc.easeBackOut():cc.easeBackIn()),
            callback
        );
        if(!visible&&force){
            panel.y = -height;
            this.block.node.active = false;
            return;
        }
        panel.runAction(seq);
    },
    onClickBlockContent(){
        this.showMenu(false);
    },
    _onClickMenu(event, data){
        let target = event.target;
        let auto_hide = true;
        switch (target.name) {
            case "menu_menu":
                this._onToggleMenu();
                auto_hide = false;
                break;
            case "menu_net":
                this._onClickNet();
                auto_hide = false;
                break;
            case "menu_log":
                this._onClickLog();
                break;
            case "menu_home":
                let scene = cc.director.getScene();
                if(scene.name=="main-hall"){
                     //console.warn("当前已是首页");
                }
                else{
                    UserInfo.setInfo({
                        gameid: 0,
                        tableid: "",
                    })
                    app.net.release();
                    app.net.reConnect();
                    app.game.exitGame();
                    app.res.loadHall();
                    UIFrame.clearAllBlock();
                }
                break;
            case "menu_close_room":
                let appkey = app.url.get("appkey");
                if(!appkey){
                    appkey = AppBridge.CLIENT_KEY;
                }
                let params = {
                    msg: AppBridge.EVENT.ROOM_CLOSE,
                    key: appkey,
                    data: {},
                }
                MsgManager.fire("message", {data: JSON.stringify(params)});
                break;
            case "menu_token":
                this._loginServerToken();
                break;
            case "menu_viewer":
                this._loginServerViewer();
                break;
            case "menu_account":
                this._loginServerAccount();
                break;
            case "menu_skin_default":
                this._updateSkin("default");
                break;
            case "menu_skin_a":
                this._updateSkin("a");
                break;
            case "menu_skin_b":
                this._updateSkin("b");
                break;
            case "menu_skin_c":
                this._updateSkin("c");
                break;
            case "menu_skin_d":
                this._updateSkin("d");
                break;
            case "menu_room_lock":
                this._setRoomLock(true);
                break;
            case "menu_room_unlock":
                this._setRoomLock(false);
                break;
            case "menu_play_normal":
                this._setSpecialMode(false);
                break;
            case "menu_play_special":
                this._setSpecialMode(true);
                break;
            default:
                break;
        }
        if(auto_hide){
            this.showMenu(false);
        }
    },
    _onToggleMenu(){
        let visible = this.block.node.active;
        this.showMenu(!visible);
    },
    // 网络连接/断开测试
    _onClickNet(){
        if(app.net.isConnect()){
            app.net.release();
            //禁用网络，避免切后台返回时重连
            app.net.setEnabled(false);
        }
        else{
            //启用网络
            app.net.setEnabled(true);
            app.net.reConnect();
        }
    },
    //日志下载
    _onClickLog(){
        if(app.config.ENABLE_CHANNEL){
            if(!app.config.CUSTOM.ENABLE_DOWNLOAD_LOG && app.url.get("debug")!='1'){
                return;
            }
        }
        
        QYLogs.save();
    },
    _loginServerToken(){
        if(UserInfo.isToken()){
            UIFrame.showTips("当前已是令牌登录");
            return;
        }

        App.AppManager.getAccountToken(function (error, token) {
            if(error){
                UIFrame.showTips("获取token失败");
                return;
            }

            let viewer = 0;
            let lang = app.url.get("lang");
            lang = Utils.converLanguage(lang, app.config.LANGALL);
            let loginType = UserInfo.getLoginType();
            let skin = app.config.SKIN;
            let info = UserInfo.getInfo();
            let params = {
                msg: AppBridge.EVENT.SUBGAME_ENTER_START,
                data: {
                    token: info.token,
                    gameid: info.gameid,
                    tableid: info.tableid,
                    lang: lang,
                    skin: skin,
                    viewer: viewer,

                    loginType: loginType, //网页版才有，指定登录方式，避免账号登录无效
                }
            }
            MsgManager.fire("message", {data: JSON.stringify(params)});
            cc.warn("UIAppPanel", "网页版测试切换登录");
        })
    },
    _loginServerAccount(){
        if(UserInfo.isAccount()){
            UIFrame.showTips("当前已是账号登录");
            return;
        }
        app.game.exitGame();
        //先登录，登录完成再进入游戏
        cc.warn("UIAppPanel", "开始登录账号模式");
        LocalStorage.setLastLoginWay("ACCOUNT");
        app.res.loadLogin();
    },
    _loginServerViewer(){
        if(UserInfo.isViewer()){
            UIFrame.showTips("当前已是观众登录");
            return;
        }
        UserInfo.setInfo({
            token: "",
        })
        cc.warn("UIAppPanel", "开始登录观众模式");
        
        let MSG_LOGIN = require("Msg_login");
        MsgManager.fire(MSG_LOGIN.NOTIFY.LOGIN_VIEWER);
    },
    _updateSkin(skin){
        app.config.SKIN = skin;
        LocalStorage.setSkin(skin);
        cc.warn("UIAppPanel", "切换皮肤: skin="+skin);
        this._updateSkinLabel();
    },
    _updateSkinLabel(){
        let skin = app.config.SKIN;
        let txtDefault = "皮肤透明";
        let txtSkinA = "皮肤a";
        let txtSkinB = "皮肤b";
        if(skin=="" || skin=="default"){
            txtDefault += this._txtCurr;
        }
        else if(skin=="a"){
            txtSkinA += this._txtCurr;
        }
        else if(skin=="b"){
            txtSkinB += this._txtCurr;
        }
        this.labelSkinDefault.string = txtDefault;
        this.labelSkinA.string = txtSkinA;
        this.labelSkinB.string = txtSkinB;
    },
    _setRoomLock(lock){
        let txtLock = "房间上锁";
        let txtUnLock = "房间解锁";
        if(lock){
            txtLock += this._txtCurr;
        }
        else{
            txtUnLock += this._txtCurr;
        }
        this.labelLock.string = txtLock;
        this.labelUnLock.string = txtUnLock;

        if(this._isRoomLocked==lock){
            return;
        }
        this._isRoomLocked = lock;
        App.setRoomLocked(lock);
    },
    _setSpecialMode(special){
        let txtNormal = "普通玩法";
        let txtSpecial = "特殊玩法";
        if(special){
            txtSpecial += this._txtCurr;
        }
        else{
            txtNormal += this._txtCurr;
        }
        this.labelNormal.string = txtNormal;
        this.labelSpecial.string = txtSpecial;

        if(this._isSpecialMode==special){
            return;
        }
        
        this._isSpecialMode = special;
        App.setSpecialMode(special);
    },
    setPlayInfo(data){
        this.labelPaiJu.string = data.play_serial;
        let pai_zhuo = "桌号";
        this.labelPaiZhuoTitle.string = pai_zhuo;
        this.labelPaiZhuo.string = data.table_serial;
        this.labelGold.string = data.gold;
    },
});
