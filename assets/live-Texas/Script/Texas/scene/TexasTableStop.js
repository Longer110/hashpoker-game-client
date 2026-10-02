// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let TexasUtils = require("TexasUtils");
let TexasData = require("TexasData");
let CMD = require("protocol_texas");
let TexasPlayerController = require("TexasPlayerController");

cc.Class({
    extends: cc.Component,

    properties: {
        TexasPlayerController: TexasPlayerController,//玩家容器

        nStartTable: cc.Node,//开始牌桌节点
        nStartGame: cc.Node,//开始游戏节点
        nStopGame: cc.Node,//暂停游戏节点

        sStartTable: cc.Label,//开始牌桌
        sStartGame: cc.Label,//开始游戏
        sStopGame: cc.Label,//暂停游戏
        sContinueGame: cc.Label,//继续游戏
        sTime: cc.Label,//时间
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sStartTable.string = TexasUtils._getText(112);//开始游戏
        this.sStartGame.string = TexasUtils._getText(109);//开始游戏
        this.sStopGame.string = TexasUtils._getText(111);//暂停游戏
        this.sContinueGame.string = TexasUtils._getText(88);//继续游戏
        
        let icon = this.nStopGame.getChildByName("layout").getChildByName("icon");
        if (icon) {
            icon.active = false;
        }
    },

    start () {

    },

    // update (dt) {},

    //设置牌桌: (type 1:开始牌局 2:开始游戏 3:暂停游戏)
    _setTable(type,time) {
        this._stopUpdate();

        this.nStartTable.active = type==1?true:false;//开始牌桌节点
        this.nStartGame.active = type==2?true:false;//开始游戏节点
        this.nStopGame.active = type==3?true:false;//暂停游戏节点

        if (!type) return;
        
        if (time) {
            this._setTimeSchedule(time);
        }
    },

    _setGameStart() {
        if (!TexasUtils._getClub()) return;

        let gameStart = TexasData._getGameStart();//游戏开始状态
        let nTable = TexasData._getTable();//桌子类型 10:大厅桌子 11:俱乐部桌子 其它:未定义
        let tableStart = TexasData._getIsTableStart();//获得牌桌是否开始
        let autoStartNum = TexasData._getAutoStartNum();//获得自动开局人数
        let userData = this.TexasPlayerController._getPlayerInfo();//获得当前牌桌玩家数据
        let admin = TexasData._getIsAdmin();//获得是否权限管理者
        let gameStop = TexasData._getIsGameStop();//获得游戏是否暂停

        // if (tableStart && nTable==11 && !gameStart && userData.length>=2 && userData.length<autoStartNum && admin && !gameStop) {
        //     this._setTable(2);
        // }
    },

    //更新同一玩家冷却时间
    _setTimeSchedule(time) {
        if (time<=0) {
            this._stopUpdate();

            this.sTime.string = "00:00:00";
        }else {
            this.times = time;
            this.sTime.string = this.formatSeconds(time);

            this._startUpdate();
        }
    },

    //开始更新
    _startUpdate(){
        this._stopUpdate();

        cc.director.getScheduler().schedule(this._updateTime, this,1, false);
    },

    //暂停更新
    _stopUpdate(){
        if(cc.director.getScheduler().isScheduled(this._updateTime, this)){
            cc.director.getScheduler().unschedule(this._updateTime, this);
        }
    },

    _updateTime () {
        this.times -= 1;
        this._setTimeSchedule(this.times);
    },

    //秒转时间
    formatSeconds(value) {
        var theTime = parseInt(value);
        var theTime1 = 0;
        var theTime2 = 0;
    
        if(theTime >= 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if(theTime1 >= 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        if(theTime < 10) {
            theTime = "0" + parseInt(theTime)
        }
        var result = "" + theTime + "";
        if(theTime1 >= 0) {
            if(theTime1 < 10) {
                theTime1 = "0" + parseInt(theTime1)
            }
            result = "" + theTime1 + ":" + result;
        }
        if(theTime2 >= 0) {
            if(theTime2 < 10) {
                theTime2 = "0" + parseInt(theTime2)
            }
            result = "" + theTime2 + ":" + result;
        }

        return result;
    },

    //开始牌局
    onClickBtnStartTable() {
        let nStr = "开始牌局请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouTableStartReq_CMD, {});
        // cc.warn("-----------------------------------------------------------------------------------------德州开始牌局请求");
        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouTableStartReq_CMD, {});//"开始牌局"请求 (房主使用)
    },

    //开始游戏
    onClickBtnStartGame() {
        let nStr = "开始游戏请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouAutoNextReq_CMD, {});
        // cc.warn("-----------------------------------------------------------------------------------------德州开始游戏请求");
        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouAutoNextReq_CMD, {});//"开始游戏" 请求 (房主使用)
    },

    //继续游戏
    onClickBtnContinueGame() {
        let data = {
            isPause: false,
        }

        let nStr = "继续游戏请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouPauseReq_CMD, data);
        // cc.warn("-----------------------------------------------------------------------------------------德州继续游戏请求:",data);
        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouPauseReq_CMD, data);
    },
    

});
