// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-05-28 10:05:23
//     * @Description: 子游戏房间列表基类
//     * 
// ]]

let MsgManager = require("MsgManager");
let CMD = require("protocol_hall");
let MSG = require("Msg_hall");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let ConfigGame = require("ConfigGame");
let Msg_login = require('Msg_login');

let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

cc.Class({
    extends: cc.Component,

    properties: {
        scroll: cc.ScrollView, //子游戏场次列表容器
        template: cc.Prefab, //子游戏场次预制体
        atlas: cc.SpriteAtlas, //场次资源图集
        atlasRoomType: cc.SpriteAtlas, //场景类型文本图集

        layerTitle: cc.Node, //标题父节点
        spriteHead: cc.Sprite, //玩家头像

        labelPeople: cc.Label,//在线人数
        labelID: cc.Label, //玩家ID
        labelName: cc.Label, //玩家名字
        labelGold: cc.Label, //金币数量

        _preloaded: false, //子游戏场景是否已预加载完成
        _clicked: false, //是否点击进入房间
        _blockIndex: -1,
        _itemCount: 0,
        _wrapper: null, //子包封装类
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
        target.on(event.SUBGAME_START, this._onSubgameStart, this);
        MsgManager.on(MSG.TreasureRsp_CMD, this._onRepUserTreasure, this);
        MsgManager.on(MSG.NoticeOnlinePeople_CMD, this._onGamePeopleOnline, this);  //在线人数列表
        MsgManager.on(MSG.RoomListRsp_CMD, this._onRepGetRoomList, this);
        MsgManager.on(Msg_login.GATEWAY.SUB_CORR_CAPITAL, this._onCorrCapital, this);//网关金币更新
    },
    onDestroy(){
        target.targetOff(this);
        this._stopUpdateOnlinePeople();

        MsgManager.un(this._onRepUserTreasure,this);
        MsgManager.un(this._onGamePeopleOnline,this);
        MsgManager.un(this._onRepGetRoomList,this);
        MsgManager.un(this._onCorrCapital,this);
    },

    start () {
        this._initRoomList();
    },

    // update (dt) {},

    init(){
        this._wrapper = app.game.getGame() || {};
        
        this._onGamePeopleOnline(app.game.getGameList());
        this._startUpdateOnlinePeople();
        this._initUserInfo();
        this._initTitle();
        this._initContent();
        this._reqUserTreasure();
    },
    
    //断线重连时刷新房间列表
    _onSubgameStart(data){
        this.init();
        this._initRoomList();
        return true; //返回false，由NotifyHandler作默认处理
    },

    _initRoomList(){
        if(app.game.getGame()){
            let data = app.game.getGame().getSubGameData();
            let nGameId = data.nGameId;
            app.hall.ctrl.reqRoomList(nGameId);
        }
        else{
            cc.error("SubRoomBase", "start", "app.game.getGame() is null");
        }
    },

    //子游戏场次初始化
    _initContent(array){
        this._initLayout();
        if(!array){
            // array = app.game.getRoomList() || [];
            return;
        }

        this._itemCount = array.length;
        let skin = app.config.SKIN;
        let content = this.scroll.content;
        for (let index = 0; index < array.length; index++) {
            let config = array[index];
            let prefab = cc.instantiate(this.template);
            prefab.x = 0, prefab.y = 0;
            let subSession = prefab.getComponent("GameRoomItem");
            subSession.init(config, this);

            // if(skin=='a'){
                this._layoutItem(prefab, index, array.length);
            // }
            // else{
            //     prefab.parent = content;
            // }
        }
        this._updateLayout();
    },
    
    _initLayout(){
        let skin = app.config.SKIN;
        let content = this.scroll.content;
        content.destroyAllChildren();
        let layout = content.getComponent(cc.Layout);
        if(layout
            //  && skin=='a'
             ){
            layout.type = cc.Layout.Type.VERTICAL;
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            layout.spacingY = 0;
        }
    },

    _updateLayout(){
        let skin = app.config.SKIN;
        let content = this.scroll.content;
        let layout = content.getComponent(cc.Layout);
        if(layout 
            // && skin=='a'
            ){
            if(this._itemCount==5){
                layout.spacingY = 0;
            }
        }
    },

    _layoutItem(item, index, total){
        let nGameId = app.game.getGame().getSubGameData().nGameId;
        let content = this.scroll.content;
        let _createCell = function () {
            let cell = new cc.Node("cell");
            cell.width = item.width;
            cell.height = item.height;
            let layout = cell.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.HORIZONTAL;
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            if(nGameId==104){//百人牛牛
                if(total==4){
                    layout.spacingX = 70;
                }
            }
            content.addChild(cell);
            return cell;
        }

        //每行有多少列
        let col = 3;
        if(total==4){
            col = 2;
        }

        //如果是百家乐相关游戏，布局为：2-1-2
        // if(nGameId == 107 || nGameId == 109 || nGameId == 110){
        //     col = 2;

        //     if(total != 4 && index == 3){
        //         col = 1;
        //     }
        // }

        let row = Math.floor(index/col); //当前是第几行
        let cell = null;
        if(content.children.length<=row){
            cell = _createCell();
        }
        else{
            cell = content.children[row];
        }
        cell.addChild(item);
    },
    
    //房间游戏标题
    _initTitle(){
        if(app.game.getGame()){
            let data = app.game.getGame().getSubGameData();
            let nGameId = data.nGameId;
            let array = this.layerTitle.children;
            for (let index = 0; index < array.length; index++) {
                let child = array[index];
                let visible = child.name == nGameId.toString() ? true : false;
                child.active = visible;
            }
        }
        else{
            QYLogs.error("SubRoomBase", "_initTitle", "app.game.getGame() is null");
        }
    },

    //玩家数据
    _initUserInfo() {
        let info = UserInfo.getInfo();
        this.labelID.string = info.nUserID;
        this.labelName.string = Utils.getShortText(info.strNickName, 16);

        if(ConfigGame.ISLIVE){
            this.labelGold.string = Utils.convertNumberToStr2(info.nGold);
        }else{
            this.labelGold.string = Utils.convertNumberToStr(info.nGold);
        }


        //头像
        Utils.changeUserHead(this.spriteHead,info.strHeadUrl);
    },
    //请求财富数据
    _reqUserTreasure() {
        let data = {
            nNoUse: 0,
        }

        app.net.send(CMD.Main_CMD.value, CMD.Main_CMD.TreasureReq_CMD, data);
    },
    //返回财富数据
    _onRepUserTreasure(data) {
        UserInfo.setInfo({
            nGold: data.nGold,
        });
        let gold = data.nGold || 0;
        if(ConfigGame.ISLIVE){
            this.labelGold.string = Utils.convertNumberToStr2(gold);
        }else{
            this.labelGold.string = Utils.convertNumberToStr(gold);
        }
    },
    //开始更新在线人数
    _startUpdateOnlinePeople() {
        this._stopUpdateOnlinePeople();
        let time = Utils.randomInt(30, 10);//随机刷新时间10~30s
        cc.director.getScheduler().schedule(this._updateOnlinePeople, this,time, false);
    },
    //暂停更新在线人数
    _stopUpdateOnlinePeople(){
        if(cc.director.getScheduler().isScheduled(this._updateOnlinePeople, this)){
            cc.director.getScheduler().unschedule(this._updateOnlinePeople, this);
        }
    },
    _updateOnlinePeople() {
        this._startUpdateOnlinePeople();
        
        let info = UserInfo.getInfo();

        let data = {
            nUserID: info.nUserID,
        }

        app.net.send(CMD.Main_CMD.value, CMD.Main_CMD.OnlinePeopleReq_CMD, data);
    },
    //在线人数列表
    _onGamePeopleOnline(data) {
        cc.log("_onGamePeopleOnline data:",data);
        let game = app.game.getGame();

        if (game && game.getSubGameData()) {
            let gameId = game.getSubGameData().nGameId;

            let count = -1;
    
            let arrPeople = data.arrPeople?data.arrPeople:data;
            if (arrPeople && arrPeople.length>0) {
                for (let i=0; i<arrPeople.length; i++) {
                    let arrItem = arrPeople[i];
                    let nGameID = arrPeople[i].nGameId?arrPeople[i].nGameId:arrPeople[i].nGameID;//游戏id
                    let nPeople = arrPeople[i].nPeople;//在线人数
                    
                    app.game.setOnlinePeople(nGameID,nPeople);//修改大厅数据在线人数
    
                    if (gameId==nGameID && Number(nPeople)>=0) {
                        count = nPeople;
    
                        break;
                    }
    
                }

                // if (this.labelPeople && Number(count)>=0) {
                //     this.labelPeople.string = count;
                //     this.labelPeople.node.parent.active = app.config.ISSTAG?false:true;
                // }
                if(this.labelPeople){
                    this.labelPeople.node.parent.active = false
                }
            }
        }
    },
    //房间列表返回
    _onRepGetRoomList(data) {
        //出现异常
        if (data.sErrStr) {
            return;
        }

        // let robotRoom = [];
        // for (let index = 0; index < data.arrRoomItems.length; index++) {
        //     const element = data.arrRoomItems[index];
        //     //机器人模式
        //     if(app.config.IS_ROBOT){
        //         if(element.nRoomId >= 50){
        //             robotRoom.push(element);
        //         }
        //     }
        //     else{
        //         if(element.nRoomId < 50){
        //             robotRoom.push(element);
        //         }
        //     }
        // }
        // this._initContent(robotRoom);
        this._initContent(data.arrRoomItems);
    },

    //网关金币变化
    _onCorrCapital(data){
        if (!data){
            return;
        }

        if (data.nGold != undefined){
            this._onRepUserTreasure(data);
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
            // app.target.emit(app.event.SUBGAME_RESTART, {
            //     nGameId: game.getSubGameData().nGameId,
            //     nRoomId: roomid,
            // });
        }
        else{
            QYLogs.error("SubRoomBase", "onClickSubSession", "app.game.getGame() is null");
        }
    },

    onClickMenu(event, data){
        let target = event.target;
        switch(target.name){
            case "menu_back_hall":
                this._showHall();
                break;
            case "menu_zhanji":
                this._showRecord();
                break;
            case "menu_shezhi":
                this._showSetting(data);
                break;
            case "menu_bangzhu":
                this._showHelpPanel();
                break;
            case "item_head":
                //如果当前是直播环境，则不响应点击事件
                if(my.env.get("IS_LIVE_ONLY")) return;
                
                this._showPersonalInfo();
                break;
            default:
                cc.log("unhandle:", target.name)
                break;
        }
    },

    //大厅
    _showHall(){
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

    //设置玩家数据
    _setUserData() {
        let info = UserInfo.getInfo();

        this._updateHead();
        this.labelID.string = info.nUserID;
        this.labelName.string = Utils.getShortText(info.strNickName, 16);
        if(ConfigGame.ISLIVE){
            this.labelGold.string = Utils.convertNumberToStr2(info.nGold) || "0";
        }else{
            this.labelGold.string = Utils.convertNumberToStr(info.nGold) || "0";
        }
        
    },    

    //更新玩家头像
    _updateHead() {
        let self = this;

        let info = UserInfo.getInfo();
        //头像
        let headSprite = self.spriteHead.getComponent(cc.Sprite);
        Utils.changeUserHead(headSprite,info.strHeadUrl);
    },

    //战绩
    _showRecord() {
        let path = "popup/record/RecordPanel_set";
        app.game.getGame().ui.loadPopup(path, function (component) {
            this.node.addChild(component.node, 1024);
            component._initBecordList(this);
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)
        , {
            loader: this._wrapper.bundleName
        });
    },
    //设置界面
    _showSetting(data){
        let isLanguage = data?{isLanguage:true}:null;
        cc.log("data,isLanguage:",data,isLanguage);
        let path = "popup/setting/SettingPanel";

        app.game.getGame().ui.loadPopup(path, function (component) {
            this.node.addChild(component.node, 1024);
            component.initUI(isLanguage);
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)
        , {
            loader: this._wrapper.bundleName
        });
    },
    //显示个人信息面板
    _showPersonalInfo() {
        let path = "popup/personalInfo/PersonalInfoPanel";
        app.game.getGame().ui.loadPopup(path, function (component) {
            this.node.addChild(component.node, 1024);
            component.setHallControl(this);
            component._initPanel();
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)
        , {
            loader: this._wrapper.bundleName
        });
    },
    //帮助（子游戏重写，设置帮助文本）
    _showHelpPanel(){
        let path = "popup/help/HelpPanel";
        app.game.getGame().ui.loadPopup(path, function (component) {
            this.node.addChild(component.node, 1024);
            // let text = i18n.t("NIUNIU.HELP_DATA");
            // let json = JSON.parse(text);
            let json = {//帮助数据
                playIntroduce: [//玩法介绍
                ],
                pokerExplain: [//牌型说明
                ],
                pokerSize: [//牌型大小
                ],
                settle: [//结算
                ],
            }
            component.setData(json);
            component.node.position = cc.Vec2.ZERO;
        }.bind(this)
        , {
            loader: this._wrapper.bundleName
        });
    },
});
