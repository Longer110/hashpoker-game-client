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
//     * @Author:      mygame
//     * @DateTime:    2018-07-18 10:05:23
//     * @Description: framework 场景公共基类
// ]]

let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;
let game = require("GameManager").default;
let env = require("EnvironmentManager").default;
let audio = require("AudioManager").default;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        audio.playEmpty();
        target.on(event.RESIZE, this._onResize, this);
        this._onResize();
        if(window.app){
            if(app.ui){
                app.ui.clearAllBlock();
            }
        }
        this._addRollback();
    },
    onDestroy() {
        target.targetOff(this);
        this._removeRoolback();
    },
    start() {
    },
    /**
     * 每个场景默认增加一个原生平台界面回退时的调用
     * 如果不需要，子类重写为空函数即可
     */
    _addRollback(){
        if(window.app){
            if(app.native){
                app.native.addRollback(this, this._onRollback);
            }
        }
    },
    /**
     * 移除一个原生平台界面回退时的调用
     */
    _removeRoolback(){
        if(window.app){
            if(app.native){
                app.native.removeRollback(this, this._onRollback);
            }
        }
    },
    /**
     * 原生平台界面回退时调用
     * @returns
     */
    _onRollback(){
    },

    _onResize(){
        this._updataCanvas();
    },
    _updataCanvas(){
        let designSize = cc.view.getDesignResolutionSize();
        let winSize = cc.view.getFrameSize();
        let scaleX = winSize.width / designSize.width;
        let scaleY = winSize.height / designSize.height;
        // let scale = Math.min(scaleX, scaleY);
        let canvas = this.node.getComponent(cc.Canvas);
        // cc.warn("winSize", winSize.width, winSize.height);


        let isLive = env.get("IS_LIVE_ONLY");
        if(window.app){
            let game = app.game.getGame();  
            if(game){
                isLive = game.isLiveGame();
            }
        }
        if(isLive){
            //适配canvas
            // if(canvas){
            //     canvas.fitWidth = scaleX<=scaleY ? true : false;
            //     canvas.fitHeight = scaleX>=scaleY ? true : false;
            //     // canvas.alignWithScreen();
            // }
        }
        else{
            //适配canvas
            if(canvas){
                canvas.fitWidth = scaleX<=scaleY ? true : false;
                canvas.fitHeight = scaleX>=scaleY ? true : false;
                // canvas.alignWithScreen();
            }
        }
        
    },
    
    _onSubgameStart(data, onComplete){
        let subgame = game.getGame();
        if(subgame){
            if(data && typeof data.nRoomId == 'number'){
                //nRoomId小于0并且有房间场景，则跳转到房间场景
                if(data.nRoomId < 0 && subgame.hasRoomView()){
                    subgame.enterRoomView();
                    onComplete&&onComplete();
                    return;
                }
            }
        }

        let item = game.getGameItem(data.nGameId);
        this._onGameReconnection(item);

        onComplete&&onComplete();

        //子游戏里返回true，不需要NotifyHandler作后续处理
        return true;
    },

    //data数据结构详见 Lobby.proto --> GameListNotify --> GameItem
    //data用于登录界面或大厅界面加载相应子游戏
    _onGameReconnection(data) {
        cc.error("断线重连逻辑: ", data);

        let playingGameData = app.game.getData(); //格式 {nRoomId: 2, nGameId: 101}
        if (null != playingGameData) {
            //playingGameData不为空表示正在游戏中，需要做场景还原
            //大概逻辑 发送登录相应子游戏协议，根据子游戏协议返回数据还原场景
            //TODO 场景还原
        } else {
            //playingGameData为空表示当前游戏已结束，返回房间列表或返回大厅
            //TODO 返回房间列表或返回大厅
        }
    },
});