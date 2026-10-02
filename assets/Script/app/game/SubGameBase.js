// [[
//     * @Author:      mygame
//     * @DateTime:    2018-05-28 10:05:23
//     * @Description: 子游戏基类，统一游戏入口
//     * 
// ]]

let my = require("my");
let UIFrame = require("UIFrame");
let i18n = require("i18n");
let UIDialog = require("UIDialog");
let MsgManager = require("MsgManager");
let MSG_FRAMEWORKS = require("Msg");
let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;
let UserInfo = require("UserInfo");

//大厅背景音乐
let MUSIC_HALL_BGM = "bgm/mainBgm";
//游戏中背景音乐
let MUSIC_SUB_GAME_BGM = "bgm/battleBgm";
//大厅背景音乐(审核)
let MUSIC_HALL_BGM_STAG = "bgm/bmg_stag";
//游戏中背景音乐(审核)
let MUSIC_SUB_GAME_BGM_STAG = "bgm/mainBgm_stag";

let MAX_CHECK_NUM = 20;
class SubGameBase extends my.WrapperBase {
    bundleName = "set-subgame";
    key = "subgame";
    _gameid = -1; //子游戏ID
    _roomid = -1; //子游戏场次ID
    _tableid = 0; //牌桌ID
    _data = null; //子游戏配置数据
    _ingameWidth = 0;  //直播项目游戏内牌桌面板 width
    _ingameHeight = 0; //直播项目游戏内牌桌面板 height
    _blockIndex = -1;
    _checkGameNum = MAX_CHECK_NUM;
    _onLaunched = null; //子游戏场景启动完成后回调
    _needChecking = false; //是否需要检测是否有未完成游戏
    _pathMusic = true; // 背景音乐路径
    intervalID = 0;

    get manager() {
        return window['game-common'];
    }

    constructor(options) {
        super(options);
    }

    load(bundle){
        super.load(bundle);
        let music = app.config.ISSTAG?MUSIC_SUB_GAME_BGM_STAG:MUSIC_SUB_GAME_BGM;
        this.setMusicPath(music);
    }
    start(options){
        //当前子游戏包含房间选择场景
        if(this.hasRoomView()){
            //尚未选择房间，进入房间界面
            if(this._roomid<0){
                this.enterRoomView();
            }
            //已选择房间，进入游戏界面
            else{
                if(app.config.IS_LIVE_ONLY){
                    this.checkInOtherGame(this._gameid, this._roomid);
                }
                else{
                    this.enterGameView();
                }
            }
        }
        //不包含房间选择场景，直接进入游戏
        else{
            if(app.config.IS_LIVE_ONLY){
                this.checkInOtherGame(this._gameid, this._roomid);
            }
            else{
                this.enterGameView();
            }
        }
    }
    init(options) {
        this.initGame(options);
        super.init(options);
    }
	preinit(data){
        super.preinit(data);
        this._data = data;
        let isRoomView = data.isRoomView;
        if(typeof data.isRoomView == 'undefined'){
            isRoomView = this.hasRoomView();
        }
        this._data.isRoomView = isRoomView;
        this._gameid = data.nGameId;
        if(typeof data.nRoomId == 'number'){
            this._roomid = data.nRoomId;
        }
        else{
            this._roomid = -1;
        }
    }
    preload(options, callback){
        if(this._preloadStarted) return;
        super.preload(options, ()=>{});

        let sceneRoom = this.getSubRoomName();
        let sceneGame = this.getSubGameName();
        let listScene = [];
        if (this.hasRoomView()) {
            listScene.push(sceneRoom);
        }
        listScene.push(sceneGame);
        let count = 0;
        let _onComplete = function (params) {
            count++;
            if(count==listScene.length){
                callback&&callback(null, this.bundleName);
            }
        }.bind(this);
        for (let index = 0; index < listScene.length; index++) {
            const sceneName = listScene[index];
            this.bundle.preloadScene (sceneName, options, function onProgress(count, total, item){
            }, function onComplete(e){
                _onComplete();
            });
        };
    }
    
    // _onStart(options){
    //     if(this._data.isRoomView){
    //         this.enterRoomView();
    //     }
    //     else{
    //         let data = app.game.getData(); //重连数据
    //         if(data){
    //             this.setSubRoomID(data.nRoomId);
    //         }
    //         this.enterGameView();
    //     }
    // }
    //子游戏可重写，初始化语言包
    _initLanguage(options){
        let sGamePath = options.sGamePath;
        // let array = sGamePath.split('/');
        // if(array.length==2){
        //     sGamePath = array.length[1];
        // }
        let file = app.config.LANG + "_" + sGamePath;
        cc.warn("SubGameBase", "_initLanguage", file);
        let data = require(file);
        my.i18n.init(app.config.LANG, data);
    }
    //子游戏初始化（子类可重写）
    initGame(data) {
        cc.log("SubGameBase", "initGame: data=", data);
        this._data = data;
        this._gameid = data.nGameId;
        this._roomid = data.nRoomId;
        this._tableid = data.sTableId;
        this._ingameWidth = data.width || 750;
        this._ingameHeight = data.height || 445;
        this._checkGameNum = MAX_CHECK_NUM;
        this.setLaunchCallback(data.onLaunched);

        this.stopCheckInterval();
        app.game.setGame(this);
        app.game.setGameID(data.nGameId);


        //直播项目USE_PremultiplyAlpha = true 是会修改所有sprite的混合模式，这里区分一下
        if(app.config.IS_LIVE_ONLY){
            if(this.isLiveGame()){
                my.env.set({"USE_PremultiplyAlpha":true})
            }else{
                my.env.set({"USE_PremultiplyAlpha":false})
            }
        }
        
        
    }
    
    exitGame() {
        this.release();
        app.game.setGame(null);
        cc.log("SubGameBase","exitGame")

        if(app.config.IS_LIVE_ONLY){
            my.env.set({"USE_PremultiplyAlpha":true})
        }

    }

    //子游戏释放逻辑（子类可重写）
    release(){
        this.stopCheckInterval();
    }

    setLaunchCallback(callback){
        cc.log("SubGameBase", "setLaunchCallback");
        this._onLaunched = callback;
    }

    //子游戏场景文件名（子类可重写）
    getSubGameName(){
        let name = this._data.sceneName || this._data.sGamePath;
        return this._getSceneSkinName(name);
    }

    //子游戏房间文件名（子类可重写）
    getSubRoomName(){
        let name = this._data.sceneName || this._data.sGamePath;
        name += "_room";
        return this._getSceneSkinName(name);
    }

    _getSceneSkinName(sceneName){
        let name = sceneName;

        let skinName = name + "_" + app.config.SKIN;
        if(app.config.SKIN=="default" || app.config.SKIN==""){
            skinName = name;
        }

        let skinDefault = name + "_" + app.config.SKIN_DEFAULT;
        if(app.config.SKIN_DEFAULT=="default" || app.config.SKIN_DEFAULT==""){
            skinDefault = name;
        }
        
        if(this.bundle.getSceneInfo(skinName)){
            name = skinName;
        }
        else if(this.bundle.getSceneInfo(skinDefault)){
            name = skinDefault;
        }
        return name;
    }
    //是否直播项目进入房间列表
    isLiveEnterRoomView(){
        if (this._gameid == 133 && app.config.SKIN == "b"){
            return true;
        }else{
            return false;
        }
    }
    //是否直播项目
    isLiveGame(){
        let isLive = app.config.IS_LIVE_ONLY;
        if(typeof this._data.isLive != 'undefined'){
            isLive = !!this._data.isLive;
        }
        
        return isLive;
    }
    //是否有房间列表(子游戏重写)
    hasRoomView(){
        if(this.isLiveGame()){
            return false;
        }

        return true; 
    }
    //是否横屏游戏(子游戏重写)
    isLandscape(){
        if(this.isLiveGame()){
            return false;
        }

        return true; 
    }
    
    //进入子游戏房间
    enterRoomView(){
        //直播游戏没有房间场景，直接返回大厅
        if(this.isLiveGame() && !this.hasRoomView()){
            app.util.setOrientation(false);
            app.game.exitToHall();
            return;
        }

        let sceneName = this.getSubRoomName();
        cc.log("SubGameBase", "进入子游戏房间", sceneName);
        
        // if(!app.game.getGame()){
        //     QYLogs.warn("SubGameBase", "app.game.getGame() is null");
        //     return;
        // }

        app.game.clearData();
        
		let music = app.config.ISSTAG?MUSIC_HALL_BGM_STAG:MUSIC_HALL_BGM;

        if(!app.config.ISLIVE && !app.audio.isTheSameMusic(music)){
            app.audio.stopMusic();
            app.audio.playMusic(music);
        }

        let scene = cc.director.getScene() || {};
        if(scene.name==sceneName){
            cc.warn("SubGameBase", "当前已经在子游戏房间", sceneName);
            let isAlreadyLoaded = true;
            if(this._onLaunched){
                this._onLaunched(isAlreadyLoaded);
            }
            return;
        }

        app.res.loadScene(sceneName, {
            onLaunched: function () {
                //合集项目设置为横屏
                app.util.setOrientation(this.isLandscape());
                if(this._onLaunched){
                    this._onLaunched();
                }
            }.bind(this),
        });
    }
    //使用当前子包音效资源
    playMusic(music){
        this.audio.playMusic(music);
    }
    //默认的背景音乐文件路径.子游戏可重写并返回其它路径
    getMusicPath(){
        return this._pathMusic;
    }
    setMusicPath(path){
        this._pathMusic = path;
    }

    //控制子游戏是否可以播放背景音乐.直播项目子游戏默认不播放背景音乐，如果需要播放，子游戏重写并返回ture
    canPlayMusic(){
        return this.getMusicPath() && !app.config.IS_LIVE_ONLY;
    }

    //进入子游戏场景
    enterGameView(){
        let sceneName = this.getSubGameName();
        cc.log("SubGameBase", "进入子游戏场景", sceneName);
    
        // if(!app.game.getGame()){
        //     QYLogs.warn("SubGameBase", "app.game.getGame() is null");
        //     return;
        // }

		let music = this.getMusicPath();
        if(this.canPlayMusic() && !app.audio.isTheSameMusic(music)){
            app.audio.stopMusic();
            app.audio.playMusic(music);
        }
    
        let scene = cc.director.getScene() || {};
        if(scene.name==sceneName){
            cc.warn("SubGameBase", "当前已经在子游戏场景", sceneName);
            let isAlreadyLoaded = true;
            if(this._onLaunched){
                this._onLaunched(isAlreadyLoaded);
            }
            return;
        }

        app.res.loadScene(sceneName, {
            onLaunched: function () {
                app.util.setOrientation(this.isLandscape());
                if(this._onLaunched){
                    this._onLaunched();
                }
            }.bind(this),
        });
    }

    //判断是否在游戏场景
    isRunGameScene(){
        let sceneName = this.getSubGameName();
        let scene = cc.director.getScene() || {};
        cc.warn("isRunGameScene:",sceneName,scene.name)
        if(scene.name==sceneName){
            return true
        }else{
            return false
        }
    }
    toggleChecking(){
        QYLogs.warn("SubGameBase", `toggleChecking: gameid=${this._gameid}`, this._needChecking);
        if(this._needChecking){
            this.checkInOtherGame(this._gameid, this._roomid);
        }
    }
    //检查是否在其它游戏中
    checkInOtherGame(nGameId, nRoomId){
        if(!app.config.NEED_WAIT_FOR_CHECKED){
            //直接返回
            this.onCheckInOtherGame({});
            return;
        }

        
        //用户未登录
        if(!app.user.isLogin()){
            cc.log("检测是否在其它游戏中. 用户未登录 => wait=", app.config.NEED_WAIT_FOR_CHECKED);
            this._needChecking = app.config.NEED_WAIT_FOR_CHECKED;
            return;
        }

        cc.log("检测是否在其它游戏中", this._checkGameNum);
        this._checkGameNum = this._checkGameNum - 1;
        this.stopCheckInterval();
        if (app.config.IS_CLUB_ONLY && this._tableid && this._tableid == "#9999"){
            //俱乐部牌局回放牌桌id
            this.onCheckInOtherGame({});
            return;
        }

        if(this._checkGameNum > 0){
            this.intervalID = setInterval(function(){
                this.checkInOtherGame(nGameId, nRoomId);
            }.bind(this),5000)
        }

        app.hall.ctrl.checkInOtherGame(nGameId, nRoomId);
    }

    //是否可进入子游戏回调 data 详见：Lobby.proto--->BeforeLoadScenceRsp
    onCheckInOtherGame(data) {
        let success = false;
        this._needChecking = false;
      
        if(!data.sTableId || !this._tableid || data.sTableId == this._tableid){
            success = true;
        }
        else if (this.hasRoomView() && data.nGameId && data.nGameId == this._gameid){
            success = true;
        }
        else{
            this.stopCheckInterval();
        }

        if (this._gameid == Number(data.nGameId) && data.sTableId){
            this._data.sTableId = data.sTableId;
            this._tableid = data.sTableId;
            UserInfo.setInfo({tableid: data.sTableId});
            let config =  app.game.getData();
            if (config){
                config.sTableId = data.sTableId;
                app.game.setData(config);
            }
        }

    
        //成功后进入子游戏
        if(success){
            this.stopCheckInterval();
            // if(this.isLiveGame() && !this.hasRoomView()){
            //     this.enterGameView();
            // }
            // else{
            //     if(this._data.isRoomView){
            //         this.enterRoomView();
            //     }
            //     else{
                    this.enterGameView();
            //     }
            // }
        }else{
            if(this._checkGameNum <= 0){//进入游戏失败
                app.postMessage(app.bridge.EVENT.GAME_ERROR,{error: app.bridge.errorID(102)});
            }else{
                app.postMessage(app.bridge.EVENT.GAME_ERROR,{
                    error: app.bridge.errorID(104),
                    value: {
                        gameid: data.nGameId,
                        tableid: data.sTableId,
                    }
                });
            }
        }
    }

    //检查是否可进入子游戏
    checkEnterSubGame(nGameId, nRoomId){
        // if(!app.config.NEED_WAIT_FOR_CHECKED){
        //     //直接返回
        //     this.onCheckEnterSubGame({
        //         nResult: 0,
        //     });
        //     return;
        // }

        //用户未登录
        if(!app.user.isLogin()){
            cc.log("检测是否有未完成游戏. 用户未登录 => wait=", app.config.NEED_WAIT_FOR_CHECKED);
            this._needChecking = app.config.NEED_WAIT_FOR_CHECKED;
            return;
        }

        cc.log("检测是否有未完成游戏", this._checkGameNum);
        this._checkGameNum = this._checkGameNum - 1;
        this.stopCheckInterval();
        if(this._checkGameNum > 0){
            this.intervalID = setInterval(function(){
                this.checkEnterSubGame(nGameId, nRoomId);
            }.bind(this),5000)
        }

        app.hall.ctrl.checkEnterSubGame(nGameId, nRoomId);
    }
    stopCheckInterval(){
        if(this.intervalID){
            clearInterval(this.intervalID)
            this.intervalID = 0;
        }
        this._needChecking = false;
    }

    //是否可进入子游戏回调 data 详见：Lobby.proto--->BeforeLoadScenceRsp
    onCheckEnterSubGame(data) {
        let success = false;
        this._needChecking = false;
        this.stopCheckInterval();
        //合集判断

        //0:成功(可以加载场景) 101:金币不足 200:在其他游戏玩(或同游戏不同房间) 201:游戏已经结束 其它：未定义错误
        if(data.nResult===0){
            success = true;
        }
        else if(data.nResult===101){
            let result = app.native.invokeFunction("toggleRecharge", -1);
            if(result.data){
                this.enterRoomView();
                return;
            }
            let text = i18n.t("COMMON.JIN_BI_BU_ZU");
            this._showDialog(text, function (isOK) {
                this.enterRoomView();
            }.bind(this),UIDialog.EShowType.TIPS);
        }

        //在其它游戏中
        else if(data.nResult===200){
            let nGameId = data.nGameId;
            let nRoomId = data.nRoomId;
            let text = i18n.t("COMMON.FAN_HUI_PAI_JU");
            this._showDialog(text, function (isOK) {
                if (isOK) {
                    target.emit(event.SUBGAME_RESTART, {
                        nGameId: nGameId,
                        nRoomId: nRoomId,
                    })
                }
                else{
                    this.enterRoomView();
                }
            }.bind(this), UIDialog.EShowType.OKCANCEL)
        }
        //游戏已关闭
        else if(data.nResult===300){
            let text = i18n.t("COMMON.YOU_XI_CLOSE");
            this._showDialog(text, function (isOK) {
                this.enterRoomView();
            }.bind(this));
        }
        else{
            QYLogs.warn("SubGameBase", "onCheckEnterSubGameCallback error: code = ", data.nResult);
        
            let text = i18n.t("COMMON.ENTER_ROOM_ERROR") + "nResult=" + data.nResult;
            this._showDialog(text, function (isOK) {
                this.enterRoomView();
            }.bind(this));
        }
       
        //成功后进入子游戏
        if(success){
            this.stopCheckInterval();
            this.enterGameView();
        }
    }
    //显示弹窗
    _showDialog(text, callback, showType){
        if(typeof showType != 'number'){
            showType = UIDialog.EShowType.OK;
        }

        let params = {};
        params.showType = showType;
        params.text = text;
        params.callback = function (isOK) {
            if(callback){
                callback(isOK);
            }
        }.bind(this);
        MsgManager.fire(MSG_FRAMEWORKS.NOTIFY.NOTIFY_SHOW_PROMPT, params);
    }


    //获取子游戏配置数据
    getSubGameData(){
        return this._data;
    }
    //获取子游戏ID
    getSubGameID(){
        return this._gameid;
    }
    //获取子游戏场次ID
    getSubRoomID(){
        return this._roomid;
    }
    //设置子游戏场次ID
    setSubRoomID(roomid){
        this._roomid = roomid;
    }
    //设置牌桌ID
    setSubGameTableID(tableid){
        this._tableid = tableid;
    }
    //获取牌桌ID
    getSubGameTableID(){
        return this._tableid;
    }
    getIngameWidth(){
        return this._ingameWidth;
    }
    setIngameWidth(width){
        this._ingameWidth = width;
    }
    getIngameHeight(){
        return this._ingameHeight;
    }
    setIngameHeight(height){
        this._ingameHeight = height;
    }
}

module.exports = SubGameBase;