// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 游戏管理
// ]]

let ResourceManager = require("ResourceManager");
let EventManager = require("EventManager");
let Target = EventManager.Target;
let Event = EventManager.Event;
let NotifyCenter = require("NotifyCenter");
    
const offset_top = 0;
const offset_bottom = 0;

let GameManager = function (params) {
    this.name = "GameManager";
    this._game = null;
    this._data = null;
    this._gameid = -1;
    this._url = null; //bundle 子包远程服务器地址
    this._listRoom = [];
    this._listGame = [];
    this._listExtendGame = [];

    this._viewInfo = {
        status_bar_height: 0,                   //手机状态栏高度（如果除了状态栏，app还有其它内容要游戏作顶部偏移，也加入这个值传给游戏）
        top: offset_top,                        //webview 与手机屏幕顶部距离（或者是类似iphoneX刘海屏状态栏的偏移量）
        bottom: offset_bottom,                  //webview 与手机屏幕底部距离（或者是类似iphoneX底部浮动条的偏移量）
        width: 750,                             //webview 宽
        height: 1334-offset_top-offset_bottom,  //webview 高
        bottom_left_offset: 0,                  //全面屏底部左侧偏移量
        bottom_right_offset: 0,                 //全面屏底部右侧偏移量
    }
}

let proto = GameManager.prototype;
proto.load = function (params) {
}
proto.destroy = function (params) {
}

/**
 * 启动单个子游戏
 *
 * nameOrUrl: string,
 * options: Record<string, any>,
 * onComplete: function(err: Error, bundle: cc.AssetManager.Bundle)
 */
proto.startGame = function (nameOrUrl, options, onComplete) {
    ResourceManager.default.loadGame(nameOrUrl, options, onComplete);
}

/**
 * 重新启动单个子游戏
 * @param {String} gameid 
 * @param {String} roomid 
 */
proto.restartGame = function (gameid, roomid) {
    NotifyCenter.target.emit(NotifyCenter.event.SUBGAME_RESTART, {
        nGameId: gameid,
        nRoomId: roomid,
    })
}

/**
 * 退出当前子游戏
 *
 */
proto.exitGame = function () {
    if(!this._game){
        return;
    }

    this._game.exitGame();
    Target.emit(Event.SUBGAME_EXIT_FINISH, {
        gameid: this._gameid,
    })
    this._game = null;
    this._gameid = -1;
}

/**
 * 退出当前子游戏并返回大厅
 *
 */
proto.exitToHall = function (params) {
    this.exitGame();
    ResourceManager.default.loadHall();
}

proto.getGame = function () {
    return this._game;
}
proto.setGame = function (game) {
    this._game = game;
}

/**
 * 设置重连需要还原的场景信息
 *
 * @param {Object} data{
 *  nGameId, 
 *  nRoomId, 
 *  sTableId, //直播项目才有
 * }
 */
proto.setData = function (data) {
    this._data = data;
}

proto.getData = function () {
    return this._data;
}

proto.clearData = function () {
    this._data = null;
}

proto.getGameID = function(){
    return this._gameid;
}
proto.setGameID = function(gameid){
    this._gameid = gameid;
}
//房间列表
proto.getRoomList = function(){
    return this._listRoom;
}
proto.setRoomList = function(list){
    this._listRoom = list;
}
//子游戏列表
proto.getGameList = function(){
    let list = this._listGame;
    if(this._listExtendGame.length>0){
        list = list.concat(this._listExtendGame);
    }
    return list;
}
proto.setGameList = function(list){
    this._listGame = list || [];
}
proto.getExtendGameList = function (list) {
    return this._listExtendGame;
}
proto.setExtendGameList = function (list) {
    this._listExtendGame = list || [];
    this._listExtendGame.map(item=>item.isExtend = true);
}
//根据id获取子游戏配置
proto.getGameItem = function(nGameId){
    let array = this.getGameList();
    let gameItem = null;
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.nGameId==nGameId){
            gameItem = item;
            break;
        }
    }
    return gameItem;
}

//根据id修改子游戏列表数据在线人数
proto.setOnlinePeople = function(gameId,count){
    let array = this.getGameList() || [];
    
    if (array) {
        for (let i=0; i<array.length; i++) {
            let data = array[i];
            let nGameId = data.nGameId;

            if (nGameId==gameId && Number(data.nPeople)>=0) {
                
                data.nPeople = count;

                break;
            }
        }

    }
}
proto.isRunGameScene = function(){
    if(!this.getGame()){
        return false;
    }

    return this.getGame().isRunGameScene();
}
proto.getViewInfo = function () {
    return this._viewInfo;
}
proto.setViewInfo = function (info) {
    if(!info || typeof info != 'object') return;

    let data = this.getViewInfo();
    for (const key in data) {
        if(typeof info[key]=='number'){
            data[key] = info[key];
        }
    }
    cc.log("setViewInfo:", info);
}

/**
 * 设置远程bundle子包地址
 * @param {*} url 
 * 如果 url 为 undefined 则默认使用内测包地址，如果 url 为 null 则清空远程地址
 */
proto.setURL = function (url) {
    if(url===undefined){
        this._url = "https://platform.deaizhou.com/skina/assets/";
    }
    else{
        this._url = url;
    }
}
proto.setLiveURL = function (url) {
    if(url===undefined){
        this._url = "https://platform.deaizhou.com/live/assets/";
    }
    else{
        this._url = url;
    }
}
/**
 * 获取远程bundle子包地址
 * @param {*} params 
 */
proto.getURL = function (params) {
    return this._url;
}

GameManager.default = new GameManager(null);
module.exports = GameManager;