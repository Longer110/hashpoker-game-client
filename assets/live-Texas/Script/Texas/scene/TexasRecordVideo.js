// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let MSG = require("Msg_Texas");
let TexasData = require("TexasData");
let MsgManager = require("MsgManager");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
const i18n = require('i18n'); 

let notifyInfo = [
    {notify: MSG.NOTIFY.NOTIFY_VIDEO_SCENE_RECONNECT, time:1},//场景重连 
    {notify: MSG.NOTIFY.NOTIFY_VIDEO_GAME_START, time:2},//游戏开始 
    {notify: MSG.NOTIFY.NOTIFY_VIDEO_GET_OPERATION, time:1},//操作权获得 
    {notify: MSG.NOTIFY.NOTIFY_VIDEO_USER_OPERATION, time:1},//有玩家操作通知 
    {notify: MSG.NOTIFY.NOTIFY_VIDEO_COMMON_CARDS, time:2},//公共牌 
    {notify: MSG.NOTIFY.NOTIFY_VIDEO_SETTLE, time:3},//结算  
    {notify: MSG.NOTIFY.NOTIFY_VIDEO_USER_STAND, time:1},//玩家站起 
]

cc.Class({
    extends: cc.Component,

    properties: {

        sliderVideo: cc.Node,
        nStop: cc.Sprite,//暂停/开始

        slider: cc.Slider,

        videoSpriteFrame: {
            default: [],
            type: cc.SpriteFrame
        },

        videoTimeLabel: cc.Label,//录屏时间显示

        _sliderProgress: 0,//滑动值
        _perStepTime: 0,//每一步时间
        _step: 0,//步数
        _nPreAnte: 0,//前注
        _sumPool: 0,//底池总额
        _isStop: true,//是否暂停
        _stepData: [],//步数数据
        _userData: null,//玩家数据
        _recordData: null,//战绩数据
        _nData: null,//回放数据

        _playScale: 1, //播放速率
        _isExpanded: true, //是否展开
        _autoHideTimer: null, //自动隐藏定时器
        _autoHideDelay: 5, //自动隐藏延迟时间（秒）
        _totalTime: 0, //录屏总时长（秒）
        _videoBgSprite: null, //videoBg 背景精灵
        _videoBgOriginalFrame: null, //videoBg 原始 spriteFrame
    },
     
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable(){
        this.slider.handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        this.slider.handle.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        this.slider.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        this.slider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);

        this._playScale = 1
        TimeScale.setTimeScale(this._playScale);

        // 动态加载播放/暂停图标
        this._loadVideoIcons();

        // 启动自动隐藏定时器
        this._startAutoHideTimer();
    },

    onDisable(){
        this.slider.handle.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        this.slider.handle.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        this.slider.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        this.slider.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        this._playScale = 1
        TimeScale.setTimeScale(this._playScale);

        // 清除自动隐藏定时器
        this._clearAutoHideTimer();
    },

    // update (dt) {},

    //开始播放
    _startPlay(data) {

        this._scheduleTime();

        MsgManager.fire(MSG.NOTIFY.NOTIFY_VIDEO_INIT);//场景初始化

        this._step = 0;

        if (data) {
            this._nPreAnte = 0;
            this._sumPool = 0;
        }

        this._sliderProgress = 0;
        this._perStepTime = 0;
        this._isStop = true;

        this._setRecordData(data);

        if (!this._recordData) {
            return;
        }

        this._createSliderTime();
        this._startScene();

        this.node.active = this._recordData?true:false;
    },

    _setRecordData(data) {
        if (data && !this._recordData) {
            this._createData(data);
            this._createStepData();
        }
    },


    //构造回放数据
    _createData(data) {
        let info = UserInfo.getInfo();

        let json = TexasData._checkJSON(data);

        if (json) {
            this._recordData = [];
            this.nData = JSON.parse(data);

            let nInsur = 0;
            let totalInsur = 0;

            if (this.nData.hasOwnProperty("arrUserPartIn")) {
                let arrUserPartIn = this.nData.arrUserPartIn;
                
                for (let i=0; i<arrUserPartIn.length; i++) {
                    let arrItem = arrUserPartIn[i];
                    let nUserId = arrItem[0];
                    let insur = arrItem[7];

                    if (nUserId==info.nUserID && insur) {
                        nInsur = insur;
                    }

                    if(insur){
                        totalInsur += insur;
                    }
                }
            }
            
            //默认数据
            let arrUsers = Utils.clone(this._createUsers("arrUsers"));
            let defaultData = {
                nSmallBlind: this.nData.nSmallBlind,//小盲注数额
                nBigBlind: this.nData.nBigBlind,//大盲注数额(通常等于:小盲注x2)
                nCapacity: this.nData.nCapacity,//桌子座位数(6或9)
                lookData: this.nData.lookData || [],//查看公共牌和玩家手牌数据
                nOperateTime: 10,//操作最大时间,单位:秒 (通常为10)
                nPotSum: 0,//底池总额(已押筹码总额)
                arrPot: [],//已收归的各底池数额(池数量:>=0)
                arrCommunityCards: [],//公共牌(最多5个牌)
                arrUsers: arrUsers,//座位上的玩家
                arrUsersWin: [],//所有玩家牌型与输赢情况(弃牌玩家除外)
                nStage: 0,//当前游戏状态 0:未开始(等待游戏开始) 1:游戏中 2:结算阶段
                isConfigNotSet: false,//本桌子是否需要配置后才能开始 true:是 其它:否
                isPause: false,//当前桌子暂停状态(主播有用) true:已设置为暂停 其它:非暂停
                nInsur: nInsur,//保险
                nTotalInsur: totalInsur,//总保险(系统保险输赢：正数为输，负数为赢）
                nTableCost : this.nData.nTableCost || [], //偷偷看，发发看金额
                notifyStr: notifyInfo[0].notify,
            }
            this._recordData.push(defaultData);

            //开始数据
            let arrUserPartIn = [];
            let arrUsersBet = Utils.clone(this._createOperate(-11));
            let arrPreAnte = Utils.clone(this._createOperate(-13));
            for (let i=0; i<this._userData.length; i++) {
                let user = this._userData[i];
                let nSitId = user.nSitId;
                let nBalance = user.nBalance;
                let nBet = user.nBet;
                let nInsur = user.nInsurScore;

                let obj = {nTakeIn: nBalance, nBet: nBet, nPos:nSitId, nInsurScore: nInsur};
                if (arrPreAnte) {
                    for (let j=0; j<arrPreAnte.length; j++) {
                        let preAnte = arrPreAnte[j];
                        let sPos = preAnte.nPos;
                        let sBet = preAnte.nBet;
                        
                        if (nSitId==sPos) {
                            //庄位模式
                            if(preAnte.isPreanteModel) obj.isPreanteModel = preAnte.isPreanteModel;
                            this._nPreAnte = sBet;
                            obj.nPreAnte = sBet;
                            
                            break;
                        }
                    }
                }

                arrUserPartIn.push(obj);
            }

            let nBanker = this._createOperate(-10);
            let bankerIndex = 0;
            for (let i=0; i<arrUserPartIn.length; i++) {
                let user = arrUserPartIn[i];
                if (user.nPos==nBanker) {
                    bankerIndex = i;
                    break;
                }
            }
            // 庄家的下一位开始发牌
            let nextIndex = (bankerIndex + 1) % arrUserPartIn.length;
            if (nextIndex > 0) {
                arrUserPartIn = arrUserPartIn.slice(nextIndex).concat(arrUserPartIn.slice(0, nextIndex));
            }

            // arrUserPartIn.sort(function(a,b){//排序位置
            //     return a.nPos - b.nPos;
            // });
            // [{nTakeIn: 990, nBet: 10, nPos: 2},{nTakeIn: 970, nBet: 20, nPos: 1}]

            let startData = {
                nStage: 1,//当前游戏状态 0:未开始(等待游戏开始) 1:游戏中 2:结算阶段
                arrPosPartIn: this._createUsers("arrPosPartIn"),//参与本局游戏的玩家座位号
                nBankerPos: this._createOperate(-10),//庄家座位号
                arrUsersBet: arrUsersBet,//(大小盲)玩家下注
                arrHoleCards: this._createOperate(-12),//自己的底牌(2张)
                nCardType: this._createOperate(-12,1),//自己当前牌型
                arrUserPartIn: arrUserPartIn,//参与本局游戏的玩家信息(发牌顺序按数组顺序)
                notifyStr: notifyInfo[1].notify,
            }
            this._recordData.push(startData);

            let isAllIn = false;
            let allInStep = 0;
            if (this.nData.hasOwnProperty("arrEvent")) {
                let arrEvent = this.nData.arrEvent;
                for (let i=0; i<arrEvent.length; i++) {
                    let event1 = arrEvent[i];
                    let event2 = arrEvent[i+1];
                    let event3 = arrEvent[i+2];

                    if (event1 && event1[0] == -9){
                        if ((event2 && event2[0] == -9) && (event3 && event3[0] == -9)){
                            isAllIn = true;
                            allInStep = 1;
                            break;
                        }else if((event2 && event2[0] == -9) && (!event3)){
                            allInStep = 2;
                            isAllIn = true;
                            break;
                        }else if(!event2){
                            allInStep = 3;
                            isAllIn = true;
                            break;
                        }
                        
                    }
                    
                }
            }

            //操作数据
            let allUserData = [];
            if (this.nData.hasOwnProperty("arrEvent")) {
                let arrEvent = this.nData.arrEvent;
    
                let curStep = 1;
                for (let i=0; i<arrEvent.length; i++) {
                    let event = arrEvent[i];
                    let event2 = arrEvent[i+1];
                    
                    for (let j=0; j<event.length; j++) {
                        let operate = event[j];

                        if (operate==-5) {//弃牌
                            this._setOperate(event[1],operate,null,notifyInfo[3].notify);
                            break;
                        }else if (operate==-1) {//ALLIn
                            this._setOperate(event[1],operate,event[2],notifyInfo[3].notify);
                            if (isAllIn && curStep >= allInStep){
                                //所有玩家allin
                                let uData = this._getUserByKey("nSitId",event[1]);
                                allUserData.push(uData);
                            }
                            break;
                        }else if (operate==-2) {//让牌
                            this._setOperate(event[1],operate,null,notifyInfo[3].notify);

                            break;
                        }else if (operate==-6) {//跟注
                            this._setOperate(event[1],operate,event[2],notifyInfo[3].notify);
                            if (isAllIn && curStep >= allInStep){
                                //所有玩家allin
                                let uData = this._getUserByKey("nSitId",event[1]);
                                allUserData.push(uData);
                            }

                            break;
                        }else if (operate==-3) {//加注
                            this._setOperate(event[1],operate,event[2],notifyInfo[3].notify);
                            if (isAllIn && curStep >= allInStep){
                                //所有玩家allin
                                let uData = this._getUserByKey("nSitId",event[1]);
                                allUserData.push(uData);
                            }

                            break;
                        }else if (operate==-8) {//站起
                            this._recordData.push({
                                nSitId: event[1],//站起玩家的座位号
                                notifyStr: notifyInfo[6].notify,
                            });

                            break;
                        }else if (operate==-9) {//发牌
                            let userCards = event[2];
                            curStep += 1;
                            
                            let selfCard = 0;
                            let selfPos = this._getUserByKey("nUserId",info.nUserID,"nSitId");
                            if (userCards[selfPos-1]) {
                                selfCard = userCards[selfPos-1];
                            }

                            this._setUserByKey("nSitId",selfPos,"nCardType",selfCard);//牌型

                            let tmpUserData = Utils.clone(allUserData);
                            if (isAllIn && curStep >= allInStep){
                                //所有玩家allin
                                for (let k = 0; k < userCards.length; k++) {
                                    for (let j = 0; j < tmpUserData.length; j++) {
                                        if (tmpUserData[j].nPos == k + 1){
                                            tmpUserData[j].nCardType = userCards[k];
                                        }
                                        
                                    }
                                }
                            }
                            let paramsData = {
                                nPotSum: this._sumPool,//底池总额(已押筹码总额)
                                arrPot: event[3],//收归的各底池数额(池数量:>0),数组索引代表池ID,索引从1开始
                                arrUsersHoleCard: [],//各玩家的底牌(某些情况下非空数组);
                                arrCards: event[1],//新增的公共牌
                                nCardType: selfCard,//新增公共牌后，自己的牌型
                                notifyStr: notifyInfo[4].notify,
                            }

                            if (isAllIn && curStep >= allInStep){
                                //所有玩家allin
                                paramsData.arrUsersHoleCard = tmpUserData;
                            }

                            this._recordData.push(paramsData);

                            break;
                        }else if (operate==-15) {  //未发完的牌

                            let paramsData = {
                                noSendCommunityCards: event[1],//未发完的公共牌
                            }
                            console.log("this._recordData 000: " , this._recordData);
                            

                            this._recordData.push(paramsData);
                        }
                    }
                }
            }

            //结算
            let arrUsersWin = [];
            let arrUserSettle = this.nData.arrUserSettle;//参与本局结算的玩家
            this._createOperate(-16);//保险详情
            for (let i=0; i<arrUserSettle.length; i++) {
                let settle = arrUserSettle[i];
                console.log("settle == ", settle);
                let obj = {};
                // for (let j=0; j<settle.length; j++) {
                    let pos = settle[0];
                    let goldPool = settle[3];

                    let arrGoldGet = [];
                    for (let k=0; k<goldPool.length; k++) {
                        let pool = goldPool[k];
                        let nPotIdFrom = pool[0];
                        let nGold = pool[1];

                        let objPool = {
                            nGold: nGold,
                            nPotIdFrom: nPotIdFrom,
                        };

                        arrGoldGet.push(objPool);
                    }

                    let card = this._getUserByKey("nSitId",pos,"arrHoleCards");
                    let nInsureBuy = this._getUserByKey("nSitId",pos,"nInsureBuy");
                    let nInsureWin = this._getUserByKey("nSitId",pos,"nInsureWin");
           
                    obj.nPos = settle[0],//座位号
                    obj.arrHoleCards = card,//底牌
                    obj.arrCombinedCards = settle[1],//能组成最大牌型的5个牌
                    obj.nCardType = settle[2],//牌型
                    obj.arrGoldGet = arrGoldGet,//从各个池处中获得的金币
                    obj.isWin = settle[4],//true时高亮牌型
                    obj.nProfit = settle[5],//盈利.>0时显示"胜利"
                    obj.nCmpValue = settle[6],//牌型相同时,由该字段决定大小
                    obj.isShowCardWhenEnd = settle[7],//是否亮牌,true:是 其它:否
                    obj.nCurGold = settle[8],//玩家当前筹码值(结算后)
                    obj.nTotolWin = settle[11] || 0;//本局总盈利
                    obj.nInsureBuy = nInsureBuy || 0;//保险总买入
                    obj.nInsureWin = nInsureWin || 0;//保险总赔付
                    arrUsersWin.push(obj);
                // }
            }

            //处理中途站起玩家结算
            let arrLookOnkSettle = null;
            let arrBreakSettle = this.nData.arrBreakSettle;
            if (arrBreakSettle){
                arrLookOnkSettle = [];
                for (let i=0; i<arrBreakSettle.length; i++) {
                    let settle = arrBreakSettle[i];
                    let obj = {};
                    obj.nPos = settle[0];
                    obj.nProfit = settle[1];
                    arrLookOnkSettle.push(obj);
                }

            }


            let settle = {
                nStage:2,//当前游戏状态 0:未开始(等待游戏开始) 1:游戏中 2:结算阶段
                arrUsersWin: arrUsersWin,//所有玩家牌型与输赢情况(弃牌玩家除外)
                arrPot: this.nData.arrPool,//收归的各底池数额(池数量:>0),数组索引代表池ID,索引从1开始
                notifyStr: notifyInfo[5].notify,
                arrLookOnkSettle: arrLookOnkSettle,
                lookData : this.nData.lookData,
            }

            this._recordData.push(settle);
        }

        console.log("this._recordData 111111: " , this._recordData);
    },
    
    //构造步数数据
    _createStepData() {
        if (!this._recordData) return;

        this._stepData = [];

        let data = Utils.clone(this._recordData[0]);//获得默认场景数据
        this._stepData.push(Utils.clone(data));
        for (let step=1; step<=this._recordData.length; step++) {
            data = this._getAllDataByStep(data,step);
            this._stepData.push(Utils.clone(data));
        }
    },

    //构造玩家数据
    _createUsers(key) {
        let value = [];

        if (this.nData.hasOwnProperty("arrUserPartIn")) {
            let arrUserPartIn = this.nData.arrUserPartIn;//参与本局游戏的玩家
            for (let i=0; i<arrUserPartIn.length; i++) {
                let user = arrUserPartIn[i];//[nUserId,nSitId,sFaceId,sName,nSex,sShopAcc,nTakeIn]
                
                let userObj = {nUserId:0, nSitId:1,sFaceId:"1",sName:"",nSex:1,nBalance:0,isBanker:false,arrHoleCards:[],nCardType:0,nBet:0,nStatus:7,sShopAcc:"", nInsureBuy:0, nInsureWin:0};//玩家对象
                
                if (user.length>=7) {
                    userObj.nUserId = user[0];//玩家id
                    userObj.nSitId = user[1];//玩家座位号
                    userObj.sFaceId = user[2];//玩家头像
                    userObj.sName = user[3];//玩家名
                    userObj.nSex = user[4];//玩家性别
                    userObj.sShopAcc = user[5];//玩家店账户名
                    userObj.nBalance = user[6];//玩家金币
                    userObj.nInsurScore = user[7];//玩家保险
                }
    
                if (key=="arrUsers") {
                    value.push(userObj);
                }else {
                    value.push(userObj.nSitId);
                }
            }
        }

        if (key=="arrUsers") {
            this._userData = Utils.clone(value);
        }else {
            value.sort(function(a,b){//排序位置
                return a - b;
            });
        }
        
        return Utils.clone(value);
    },

    _setUserByKey(key,value,newKey,newValue) {
        for (let i=0; i<this._userData.length; i++) {
            let users = this._userData[i];

            if (users[key] && users[key]==value) {
                this._userData[i][newKey] = newValue;

                break;
            }
        }
    },

    _getUserByKey(key,value,newKey) {
        let user = {};
        let newValue = null;
        
        for (let i=0; i<this._userData.length; i++) {
            let users = this._userData[i];

            if (users[key]==value) {
                user = Utils.clone(users);
                newValue = users[newKey];

                break;
            }
        }
        
        if (newKey) {
            return newValue;
        }else {
            return user;
        }
    },

    //构造
    _createOperate(key,card) {
        let value = null;

        let info = UserInfo.getInfo();
        let preAnteOdd = this.nData.preAnteOdd
        if (this.nData.hasOwnProperty("arrEvent")) {
            let arrEvent = this.nData.arrEvent;

            for (let i=0; i<arrEvent.length; i++) {
                let event = arrEvent[i];

                for (let j=0; j<event.length; j++) {
                    if (event[j]==key) {
                        if (key==-10) {//定庄
                            value = event[1];
                            
                            //定庄
                            this._setUserByKey("nSitId",value,"isBanker",true);
                        }else if (key==-11 || key==-13) {//大小盲下注、前注
                            value = [];
                            let min = 0;
                            let count = 0;

                            for (let k=0; k<event.length; k++) {
                                if (event[k]!=key) {
                                    let nPos = event[k][0];
                                    let nBet = event[k][1];

                                    this._sumPool += nBet;

                                    //下注
                                    let curBet = this._getUserByKey("nSitId",nPos,"nBet") + nBet;
                                    this._setUserByKey("nSitId",nPos,"nBet",curBet);

                                    //金币
                                    let curGold = this._getUserByKey("nSitId",nPos,"nBalance") - nBet;
                                    this._setUserByKey("nSitId",nPos,"nBalance",curGold);

                                    let obj = {nBet:nBet, nPos: nPos};
                                    value.push(obj);
                                    
                                    if(preAnteOdd) {
                                        if(min != 0) {
                                            if(min > nBet && value[count - 1]) {
                                                min = nBet;
                                                value[count - 1].isPreanteModel = true;
                                            }else if(nBet > min && value[count]) {
                                                min = nBet;
                                                value[count].isPreanteModel = true;
                                            }
                                        }else {
                                            min = nBet;
                                        }
                                    }
                                    count++;
                                }
                            }
                        }else if (key==-12) {//发底牌
                            for (let k=0; k<event.length; k++) {
                                if (event[k]!=key) {
                                    // let cardInfo = event[k];

                                    // for (let f=0; f<cardInfo.length; f++) {
                                        let nPos = event[k][0];//座位号
                                        let arrHoleCards = event[k][1];//牌
                                        let nCardType = event[k][2];//牌型

                                        this._setUserByKey("nSitId",nPos,"arrHoleCards",arrHoleCards);//牌
                                        this._setUserByKey("nSitId",nPos,"nCardType",nCardType);//牌型
                                        this._setUserByKey("nSitId",nPos,"nPos",nPos);//座位

                                        let selfPos = this._getUserByKey("nUserId",info.nUserID,"nSitId");
                                        
                                        if (nPos==selfPos) {
                                            value = Utils.clone(arrHoleCards);

                                            if (card) {
                                                value = nCardType;
                                            }
                                        }
                                    // }
                                }
                            }
                        }else if (key==-16) {//保险详情 购买金额， 赔付金额
                            value = {};
                            for (let k=0; k<event.length; k++) {
                                if (event[k]!=key) {
                                    console.log("event[k] === ", event[k]);
                                    let nPos = event[k][0];//座位号
                                    let nInsureBuy = event[k][2];
                                    let nInsureWin = event[k][3];

                                    //购买金额
                                    let curInsureBuy = this._getUserByKey("nSitId",nPos,"nInsureBuy") + nInsureBuy;
                                    this._setUserByKey("nSitId",nPos,"nInsureBuy",curInsureBuy);

                                    //赔付金额
                                    let curInsureWin = this._getUserByKey("nSitId",nPos,"nInsureWin") + nInsureWin;
                                    this._setUserByKey("nSitId",nPos,"nInsureWin",curInsureWin);

                                    let obj = {nInsureBuy: curInsureBuy, nInsureWin: curInsureWin};

                                    value = obj;
                                }
                            }
                        }

                        break;
                    }
                }

            }
        }

        return value;
    },

    _setOperate(nPos,nOp,nBet,notifyStr) {
        let obj = {};

        if (nPos) {
            obj.nPos = nPos;
        }

        if (nOp) {
            obj.nOp = nOp;
        }

        if (nBet) {
            this._sumPool += nBet;
            obj.nBet = nBet;
        }

        if (notifyStr) {
            obj.notifyStr = notifyStr;
        }

        this._recordData.push({
            nPos: nPos,
            notifyStr: notifyInfo[2].notify,
        });

        this._recordData.push(obj);
    },

    //构造滑动条上每一步时间
    _createSliderTime() {
        if (!this._recordData) return;

        let nSumTime = 0;
        for (let i=0; i<this._recordData.length; i++) {
            let data = this._recordData[i];
            let notifyStr = data.notifyStr;//消息
            let nTime = this._getTimeByNotify(notifyStr);

            nSumTime += nTime;
        }

        this._perStepTime = 1/nSumTime;//每1秒在滑动条上的时间
        this._totalTime = nSumTime; // 保存总时长（秒）

        // 初始化时间显示
        this._updateTimeDisplay(0);
    },

    //获得消息时间
    _getTimeByNotify(notifyStr) {
        let time = 0;

        for (let i=0; i<notifyInfo.length; i++) {
            let info = notifyInfo[i];
            let notify = info.notify;
            let nTime = info.time;

            if (notifyStr==notify) {
                time = nTime;

                break;
            }
        }

        return time;
    },

    //获得到某一步时总时间
    _getSumTimeByStep(step) {
        let time = 0;

        if (!this._recordData) return time;

        for (let i=0; i<this._recordData.length; i++) {
            let data = this._recordData[i];
            let notifyStr = data.notifyStr;//消息 
            let nTime = this._getTimeByNotify(notifyStr);

            if (step>=i) {
                time += nTime;
            }
        }

        return time;
    },

    //通过滑动值获得当前最大步数
    _getMaxStepByProgress(progress) {
        let step = 0;

        if (!this._recordData) return step;

        for (let i=0; i<this._recordData.length; i++) {
            let sliderPos = this._getSumTimeByStep(i) * this._perStepTime;//当前步对应滑动条位置

            if (sliderPos<=progress) {
                step = i;
            }
        }

        return step;
    },
    
    //显示loading
    _showLoading(isShow) {
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
        }

        if (isShow) {
            this._blockIndex = UIFrame.showBlock(i18n.t("HALL.REQUESTDATA"), true, function (params) {
                UIFrame.showTips(i18n.t("HALL.REQUESTTIMEOUT"));
            }, 5);
        }
    },

    /****************************************播放器****************************************/

    //开始场景
    _startScene(isLink) {
        console.log("战绩场景回放开始场景");
        
        if (!this._recordData) return;

        this._showLoading(false);

        let len = this._recordData.length;
        if (this._step>=0 && this._step<=len-1) {
            let step = this._step;
            let data = this._recordData[step];
            let notifyStr = data.notifyStr;//消息

            this.nTime = this._getSumTimeByStep(step) * this._perStepTime;//当前步对应滑动条位置
            if (step==len-1) {//最后一步位置为1
                this.nTime = 1;
            }

            this.nNotify = notifyStr;
            if (!isLink) {//非重连
                MsgManager.fire(notifyStr,data);
            }
            this._updateScene();
        }
    }, 

    //更新场景
    _updateScene() {
        let self = this;

        if (this._sliderProgress >= 1) {//超出滑动条最大滑动值暂停
            self._scheduleTime();

            this._isStop = true;
            this._sliderProgress = 1;
            if (this.videoSpriteFrame && this.videoSpriteFrame.length >= 1) {
                this.nStop.spriteFrame = this.videoSpriteFrame[0];
            }

            this._setSliderBar(this._sliderProgress);

            return;
        }

        if (this._sliderProgress >= this.nTime) {//当前执行的步骤结束
            self._scheduleTime();

            let len = this._recordData.length;
            if (this._isStop || this._step>len-1) return;

            this._step++;
            this._startScene();

            return;
        }
        
        if (this._sliderProgress < this.nTime) {//当前步骤执行中
            this._sliderProgress += this._perStepTime;
            if (this._sliderProgress>=1) {//超出滑动条最大值
                this._sliderProgress = 1;
            }else if (this._sliderProgress>=this.nTime) {//超出当前步骤滑动值
                this._sliderProgress = this.nTime;
            }
            
            this._setSliderBar(this._sliderProgress);

            this._isStop = false;
            if (this.videoSpriteFrame && this.videoSpriteFrame.length >= 2) {
                this.nStop.spriteFrame = this.videoSpriteFrame[1];
            }

            for (let i=0; i<notifyInfo.length; i++) {
                let info = notifyInfo[i];
                let notify = info.notify;
                let time = info.time; 

                if (notify==this.nNotify) {
                    self._scheduleTime(true,time); 
                }
            }
        }
    }, 

    //设置滑动条
    _setSliderBar(progress) {
        let videoWidth = this.sliderVideo.width * progress;
        this.sliderVideo.getComponent(cc.Slider).progress = progress;
        this.sliderVideo.getChildByName("progress").width = videoWidth;

        // 更新时间显示
        this._updateTimeDisplay(progress);
    },

    //定时器
    _scheduleTime(isStart,time) {
        if(cc.director.getScheduler().isScheduled(this._updateScene, this)){
            cc.director.getScheduler().unschedule(this._updateScene, this);
        }

        if (isStart) {
            cc.director.getScheduler().schedule(this._updateScene, this,1, false);
        }
    },

    //重新暂停，播放，倍速增加  X1、X1.5、X2.0、X2.5、X3.0
    onClickSetPlayScale(){
        let oldScale = this._playScale

        cc.warn("=== onClickSetPlayScale 被调用 ===");
        cc.warn("当前倍速:", oldScale);

        switch (this._playScale) {
            case 1:
                this._playScale = 1.5
                break;
            case 1.5:
                this._playScale = 2
                break;
            case 2:
                this._playScale = 2.5
                break;
            case 2.5:
                this._playScale = 3
                break;
            case 3:
                this._playScale = 1
                break;
            default:
                break;
        }

        cc.warn("新倍速:", this._playScale);

        // 更新倍速显示 
        let videoBg = this.node.getChildByName("videoBg");
        if (videoBg) {
            let scaleNode = videoBg.getChildByName("scale");
            if (scaleNode) {
                let labelNode = scaleNode.getChildByName("label");
                if (labelNode) {
                    let label = labelNode.getComponent(cc.Label);
                    if (label) {
                        label.string = "X" + this._playScale;
                    }
                }
            }
        }

        if(oldScale != 0){
            TimeScale.setTimeScale(this._playScale);
        }
    },

    //暂停、继续
    onClickStop() {
        this._scheduleTime();

        this._isStop = !this._isStop;

        // 设置播放/暂停图标，如果 videoSpriteFrame 为空则不设置
        if (this.videoSpriteFrame && this.videoSpriteFrame.length >= 2) {
            this.nStop.spriteFrame = this._isStop ? this.videoSpriteFrame[0] : this.videoSpriteFrame[1];
        } else {
            console.warn("videoSpriteFrame 未配置或数量不足，请检查预制体配置");
        }

        if (!this._isStop) {
            if (this._sliderProgress>=1) {//播放到最大滑动值时暂停又启动时，重启定时器
                this._startPlay();
            }else {//中间暂停又启动，继续当前定时器
                this._updateScene();
                TimeScale.setTimeScale(this._playScale);
            }
        }else{
            TimeScale.setTimeScale(0);
        }

        // 重置自动隐藏定时器
        this._resetAutoHideTimer();
    },
    
    //滑动
    onSlidered: function (slider) {
        this._scheduleTime();

        this._showLoading(true);

        let progress = slider.progress;
        this._sliderProgress = progress;
        this._setSliderBar(progress);

        // 拖动开始：清除自动隐藏定时器，避免拖动时自动隐藏
        this._clearAutoHideTimer();

        // 拖动开始：隐藏 videoBg 背景、scale 和 btn_collapse
        this._hideVideoBgElements();
    },

    onSliderTouchEnd() {
        // TexasUtils._playEffect( TexasMusicPath.TEXAS_MUSIC_PATH  + "slide_huadong");
        if (!this._recordData || this._recordData.length<1) return;

        let step = this._getMaxStepByProgress(this._sliderProgress);//通过滑动值获得当前最大步数
        this._refreshSceneByStep(step);

        this._step = step;

        // this.scheduleOnce(function() {
            this._startScene(true);
        // },0.5);

        // 拖动结束：恢复 videoBg 背景、scale 和 btn_collapse
        this._showVideoBgElements();

        // 重置自动隐藏定时器
        this._resetAutoHideTimer();
    },

    // //播放上一帧
    // onClickLate() {
    //     this._scheduleTime();

    //     if (this._isStop) return;

    //     this._showLoading(true);

    //     if (!this._recordData || this._recordData.length<1) return;

    //     let step = this._step - 2;
    //     if (step<=0) {
    //         step = 0;
    //     }
    //     this._step = step;

    //     this._refreshSceneByStep(step,true);
    //     this.scheduleOnce(function() {
    //         this._startScene(true);
    //     },1);
    // },

    // //播放下一帧
    // onClickNext() {
    //     this._scheduleTime();

    //     if (this._isStop) return;

    //     this._showLoading(true);

    //     if (!this._recordData || this._recordData.length<1) return;

    //     let len = this._recordData.length;

    //     let step = this._step + 2;
    //     if (step>=len-1) {
    //         step = len-1;
    //     }

    //     this._refreshSceneByStep(step,true);
    //     this.scheduleOnce(function() {
    //         this._startScene(true);
    //     },1);
    // },

    //根据某一步刷新当前场景
    _refreshSceneByStep(step,isAuto) {
        if (!this._recordData) return;

        if (this._recordData.length>0) {
            let len = this._recordData.length;
            step = step>=0 && step<=len-1?step:0;

            if (isAuto) {
                let nSlider = this._getSumTimeByStep(step) * this._perStepTime;//当前步对应滑动条位置
                if (step<=0) {
                    nSlider = 0;
                }
    
                this._sliderProgress = nSlider;
                this._setSliderBar(nSlider);
            }
            
            let data = this._getSceneData(step);

            // if (this._stepData.length>0 && this._stepData[step]) {
            //     data = Utils.clone(this._stepData[step]);
            // }else {
            //     data = Utils.clone(this._recordData[0]);//获得默认场景数据
            //     if (step!=0) {
            //         for (let i=1; i<=step; i++) {
            //             data = this._getAllDataByStep(data,i);
            //         }
            //     }
            // }
            
            if (data) {
                MsgManager.fire(MSG.NOTIFY.NOTIFY_VIDEO_SCENE_RECONNECT,data);//场景重连
            }
        }
    },

    _getSceneData(step) {
        let data = null;

        if (this._stepData.length>0 && this._stepData[step]) {
            data = Utils.clone(this._stepData[step]);
        }else {
            data = Utils.clone(this._recordData[0]);//获得默认场景数据
            if (step!=0) {
                for (let i=1; i<=step; i++) {
                    data = this._getAllDataByStep(data,i);
                }
            }
        }

        return data;
    },

    //获得当前步数之前的总数据集合（data:上一次数据 step:下一步）
    _getAllDataByStep(data,step) {;
        if (!data || !this._recordData[step]) return;

        let info = UserInfo.getInfo();

        let stepData = Utils.clone(this._recordData[step]);//下一步数据

        if (stepData.hasOwnProperty("nPotSum")) {//底池总额(已押筹码总额)
            data.nPotSum = stepData.nPotSum;
        }

        if (stepData.hasOwnProperty("arrPot")) {//已收归的各底池数额(池数量:>=0)
            data.arrPot = stepData.arrPot;
        }

        if (data.hasOwnProperty("arrCommunityCards") && stepData.hasOwnProperty("arrCards")) {//公共牌(最多5个牌)
            let arrCards = stepData.arrCards;//下一步数据的公共牌

            for (let i=0; i<arrCards.length; i++) {
                data.arrCommunityCards.push(arrCards[i]);
            }
        }

        if (data.hasOwnProperty("nStage") && stepData.hasOwnProperty("nStage")) {//当前游戏状态 0:未开始(等待游戏开始) 1:游戏中 2:结算阶段
            data.nStage = stepData.nStage;

            if (data.hasOwnProperty("arrUsers")) {//初始化玩家下注数据
                let arrUsers = data.arrUsers;
                for (let i=0; i<arrUsers.length; i++) {
                    let user = arrUsers[i];
                    let nStatus = user.nStatus;
                    
                    data.arrUsers[i].nBet = 0;
                    if (nStatus!=5 || nStatus!=6 || nStatus!=7) {//allin、弃牌、旁观玩家不修改状态
                        data.arrUsers[i].nStatus = 0;
                    }
                }
            }
        }

        if (data.hasOwnProperty("notifyStr") && stepData.hasOwnProperty("notifyStr")) {//消息
            data.notifyStr = stepData.notifyStr;
        }

        if (data.hasOwnProperty("arrUsers") && stepData.hasOwnProperty("arrPosPartIn")) {//参与本局游戏的玩家座位号
            let arrUsers = data.arrUsers;
            let arrPosPartIn = stepData.arrPosPartIn;
            for (let i=0; i<arrUsers.length; i++) {
                let user = arrUsers[i];
                let nSitId = user.nSitId;

                for (let j=0; j<arrPosPartIn.length; j++) {
                    let pos = arrPosPartIn[j];

                    if (nSitId==pos) {
                        data.arrUsers[i].nStatus = 0;//游戏开始，设置玩家状态为等待操作权中

                        break;
                    }
                }
            }
        }

        if (data.hasOwnProperty("arrUsers") && stepData.hasOwnProperty("nBankerPos")) {//庄家座位号
            let arrUsers = data.arrUsers;
            let nBankerPos = stepData.nBankerPos;

            for (let i=0; i<arrUsers.length; i++) {
                let user = arrUsers[i];
                let nSitId = user.nSitId;

                data.arrUsers[i].isBanker = false;//是否庄家
                if (nBankerPos==nSitId) {
                    data.arrUsers[i].isBanker = true;
                }
            }
        }

        if (data.hasOwnProperty("arrUsers") && stepData.hasOwnProperty("arrUserPartIn")) {//(大小盲)玩家下注
            let arrUsers = data.arrUsers;
            let arrUserPartIn = stepData.arrUserPartIn;

            let nSumBet = 0;//总下注
            for (let i=0; i<arrUserPartIn.length; i++) {
                let info = arrUserPartIn[i];
                let nPos = info.nPos;//玩家座位
                let nBet = info.nBet;//玩家下注(大小盲)
                let nTakeIn = info.nTakeIn;//玩家余额

                nSumBet += nBet;
                for (let j=0; j<arrUsers.length; j++) {
                    let user = arrUsers[j];
                    let nSitId = user.nSitId;

                    if (nPos==nSitId) {
                        data.arrUsers[j].nBet = nBet;
                        data.arrUsers[j].nBalance = nTakeIn;

                        break;
                    }
                }
            }

            this._addPotSum(data,nSumBet);//底池总额(已押筹码总额)
            this._addArrPot(data,nSumBet);//已收归的各底池数额(池数量:>=0)
        }

        if (data.hasOwnProperty("arrUsers") && stepData.hasOwnProperty("arrHoleCards")) {//自己的底牌
            let arrUsers = data.arrUsers;
            for (let i=0; i<arrUsers.length; i++) {
                let user = arrUsers[i];
                let nUserId = user.nUserId;

                data.arrUsers[i].arrHoleCards = [0,0];
                if (info.nUserID==nUserId) {
                    data.arrUsers[i].arrHoleCards = stepData.arrHoleCards;

                    break;
                }
            }
        }

        if (data.hasOwnProperty("arrUsers") && stepData.hasOwnProperty("nCardType")) {//自己当前牌型
            let arrUsers = data.arrUsers;
            for (let i=0; i<arrUsers.length; i++) {
                let user = arrUsers[i];
                let nUserId = user.nUserId;

                if (info.nUserID==nUserId) {
                    data.arrUsers[i].nCardType = stepData.nCardType;

                    break;
                }
            }
        }

        if (data.hasOwnProperty("arrUsers") && stepData.hasOwnProperty("nPos")) {
            let nPos = stepData.nPos;

            let arrUsers = data.arrUsers;
            for (let i=0; i<arrUsers.length; i++) {
                let user = arrUsers[i];
                let nSitId = user.nSitId;
                let nStatus = user.nStatus;

                if (nStatus!=5 || nStatus!=6 || nStatus!=7) {//allin、弃牌、旁观玩家不修改状态
                    data.arrUsers[i].nStatus = 0;
                }
                if (nPos==nSitId) {//0:等待操作权中 1:思考中 2:跟注 3:让牌 4:加注 5:AllIn 6:弃牌 7:旁观 
                    if (stepData.hasOwnProperty("nOp")) {//玩家操作
                        let nOp = stepData.nOp;//-5:弃牌,  -1:AllIn, -2:让牌, -6:跟注, -3:加注

                        let nBet = 0;//跟注或加注或 AllIn时有效，表示具体的跟注\加注数值(>0)
                        if (stepData.hasOwnProperty("nBet")) {
                            nBet = stepData.nBet;
                        }

                        let nOperation = 3
                        if (nOp==-5) {
                            nOperation = 6;
                        }else if (nOp==-1) {
                            nOperation = 5;
                        }else if (nOp==-6) {
                            nOperation = 2;
                        }else if (nOp==-3) {
                            nOperation = 4;
                        }

                        data.arrUsers[i].nStatus = nOperation;
                        if (nBet!=0) {
                            this._addPotSum(data,nBet);//底池总额(已押筹码总额)
                            this._addArrPot(data,nBet);//已收归的各底池数额(池数量:>=0)

                            data.arrUsers[i].nBet += nBet;
                            data.arrUsers[i].nBalance -= nBet;
                        }
                    }else {//操作权获得
                        data.arrUsers[i].nStatus = 1;
                    }

                    break;
                }
            }
        }

        if (data.hasOwnProperty("arrUsers") && stepData.hasOwnProperty("arrUsersHoleCard")) {//各玩家的底牌(某些情况下非空数组)
            let arrUsers = data.arrUsers;
            let arrUsersHoleCard = stepData.arrUsersHoleCard;

            if (arrUsersHoleCard.length>0) {
                for (let i=0; i<arrUsersHoleCard.length; i++) {
                    let usersHoleCard = [i];
                    let nPos = usersHoleCard.nPos;//座位号
                    let arrHoleCards = usersHoleCard.arrHoleCards;//底牌(2张)
                    let nCardType = usersHoleCard.nCardType;//牌型 (本次新增公共牌前 的牌型)
                    let arrCardType = usersHoleCard.arrCardType;//三个元素: 分别为与前3、前4、前5个公共牌组合成的牌型

                    for (let j=0; j<arrUsers.length; j++) {
                        let user = arrUsers[j];
                        let nSitId = user.nSitId;

                        if (nPos==nSitId) {
                            data.arrUsers[j].arrHoleCards = arrHoleCards;

                            if (arrCardType.length>0) {//取最后一个牌型
                                let cardTypeLen = arrCardType.length;
                                data.arrUsers[j].nCardType = arrCardType[cardTypeLen-1];
                            }else {
                                data.arrUsers[j].nCardType = nCardType;
                            }

                            break;
                        }
                    }
                }
            }
        }

        if (data.hasOwnProperty("arrUsers") && stepData.hasOwnProperty("arrUsersWin")) {//所有玩家牌型与输赢情况(弃牌玩家除外)
            let arrUsers = data.arrUsers;
            let arrUsersWin = data.arrUsersWin;

            if (data.hasOwnProperty("nPotSum")) {//底池总额(已押筹码总额)
                data.nPotSum = 0;
            }

            if (data.hasOwnProperty("arrPot")) {//已收归的各底池数额(池数量:>=0)
                data.arrPot = [];
            }

            if (data.hasOwnProperty("arrUsersWin")) {
                data.arrUsersWin = stepData.arrUsersWin;
            }

            if (stepData.hasOwnProperty("arrLookOnkSettle")) {
                data.arrLookOnkSettle = stepData.arrLookOnkSettle;
            }

            for (let i=0; i<arrUsersWin.length; i++) {
                let usersWin = arrUsersWin[i];
                let nPos = usersWin.nPos;//座位号
                let arrHoleCards = usersWin.arrHoleCards;//底牌
                let nCardType = usersWin.nCardType;//牌型
                let nCurGold = usersWin.nCurGold;//玩家当前筹码值(结算后)
                
                for (let j=0; j<arrUsers.length; j++) {
                    let user = arrUsers[j];
                    let nSitId = user.nSitId;

                    if (nPos==nSitId) {
                        data.arrUsers[j].arrHoleCards = arrHoleCards;
                        data.arrUsers[j].nCardType = nCardType;
                        data.arrUsers[j].nBalance = nCurGold;

                        break;
                    }
                }
            }
        }

        return data;
    },

    //增加底池总额
    _addPotSum(data,nBet) {
        if (data.hasOwnProperty("nPotSum")) {
            data.nPotSum += nBet;
        }
    },

    //增加已收归的各底池数额
    _addArrPot(data,nBet) {
        if (data.hasOwnProperty("arrPot")) {//已收归的各底池数额(池数量:>=0)
            let arrPot = data.arrPot;
            let len = arrPot.length;
            if (len>0) {
                data.arrPot[len-1] += nBet;
            }else {
                data.arrPot = [nBet];
            }
        }
    },

    //点击跳转翻牌、转牌、河牌
    onClickJumpCard(event) {
        this._scheduleTime();

        // 重置自动隐藏定时器
        this._resetAutoHideTimer();

        if (!this._recordData || this._recordData.length < 1) return;

        let target = event.target;
        let cardType = target.name;//flop、turn、river
        cc.warn("=== 点击跳转按钮 === cardType:", cardType);

        //查找包含arrCards字段的步骤（新增公共牌）
        let targetStep = 0;
        let cardCount = 0;

        for (let i = 0; i < this._recordData.length; i++) {
            let stepData = this._recordData[i];

            if (stepData.hasOwnProperty("arrCards")) {
                let arrCards = stepData.arrCards;

                if (arrCards && arrCards.length > 0) {
                    let cardsLen = arrCards.length;

                    cc.warn("步骤" + i + " arrCards.length:", cardsLen, "cardCount:", cardCount);

                    //翻牌：一次发3张
                    if (cardsLen === 3 && cardCount === 0 && cardType === "flop") {
                        targetStep = i;
                        cc.warn("找到翻牌步骤:", i);
                        break;
                    }
                    //转牌：第4张牌
                    else if (cardsLen === 1 && cardCount === 3 && cardType === "turn") {
                        targetStep = i;
                        cc.warn("找到转牌步骤:", i);
                        break;
                    }
                    //河牌：第5张牌
                    else if (cardsLen === 1 && cardCount === 4 && cardType === "river") {
                        targetStep = i;
                        cc.warn("找到河牌步骤:", i);
                        break;
                    }

                    //更新已发牌数
                    if (cardsLen === 3) {
                        cardCount = 3;
                    } else if (cardsLen === 1) {
                        cardCount += 1;
                    }
                }
            }
        }

        cc.warn("targetStep:", targetStep);
        if (targetStep > 0) {
            this._step = targetStep;
            this._isStop = false;//确保播放状态为非暂停
            if (this.videoSpriteFrame && this.videoSpriteFrame.length >= 2) {
                this.nStop.spriteFrame = this.videoSpriteFrame[1];//更新播放按钮图标
            }
            this._refreshSceneByStep(this._step, true);//传入true，自动更新进度条
            this._startScene(true);
        } else {
            //未找到对应时间点，说明本局没有发公共牌
            let cardTypeName = cardType === "flop" ? "翻牌" : (cardType === "turn" ? "转牌" : "河牌");
            UIFrame.showTips("本局未发" + cardTypeName);
        }
    },

    // 加载录像控制图标
    _loadVideoIcons() {
        let bundle = cc.assetManager.getBundle("live-Texas");

        // 加载播放/停止图标
        if (!this.videoSpriteFrame || this.videoSpriteFrame.length < 2) {
            bundle.load('Texture/skinc/table/ui/videoPlay', cc.SpriteFrame, (err, playSprite) => {
                if (err) {
                    console.error("加载 videoPlay 失败:", err);
                    return;
                }

                bundle.load('Texture/skinc/table/ui/videoStopBtn', cc.SpriteFrame, (err, stopSprite) => {
                    if (err) {
                        console.error("加载 videoStopBtn 失败:", err);
                        this.videoSpriteFrame = [playSprite];
                        this._updateStopIcon(playSprite);
                        return;
                    }

                    this.videoSpriteFrame = [playSprite, stopSprite];
                    this._updateStopIcon(playSprite);
                });
            });
        }

        // 加载收起/展开按钮图标
        bundle.load('Texture/skinc/table/ui/insure_menuDown', cc.SpriteFrame, (err, downSprite) => {
            if (err) {
                console.error("加载 insure_menuDown 失败:", err);
                return;
            }

            bundle.load('Texture/skinc/table/ui/insure_menuUp', cc.SpriteFrame, (err, upSprite) => {
                if (err) {
                    console.error("加载 insure_menuUp 失败:", err);
                    return;
                }

                // 存储图标
                this.collapseSpriteFrame = [downSprite, upSprite];

                // 获取 btn_collapse 节点并设置初始图标（btn_collapse 与 videoBg 同级）
                let btnCollapse = this.node.getChildByName("btn_collapse");
                if (btnCollapse) {
                    this.btnCollapse = btnCollapse.getComponent(cc.Sprite);
                    if (this.btnCollapse) {
                        this.btnCollapse.spriteFrame = downSprite;
                        console.log("收起/展开按钮图标加载成功");
                    }
                }
            });
        });
    },

    // 更新停止按钮图标
    _updateStopIcon(spriteFrame) {
        if (this.nStop && spriteFrame) {
            this.nStop.spriteFrame = spriteFrame;
        }
    },

    // 切换进度条展开/收起状态（挂载到 btn_collapse 按钮的点击事件）
    onToggleVideoControls() {
        let videoBg = this.node.getChildByName("videoBg");
        if (videoBg) {
            // 切换展开/收起状态
            this._isExpanded = !this._isExpanded;
            videoBg.active = this._isExpanded;

            // 切换按钮图标
            if (this.btnCollapse && this.collapseSpriteFrame && this.collapseSpriteFrame.length >= 2) {
                this.btnCollapse.spriteFrame = this._isExpanded ? this.collapseSpriteFrame[0] : this.collapseSpriteFrame[1];
            } else {
                console.warn("collapseSpriteFrame 未配置或数量不足");
            }

            // 如果是展开状态，重置自动隐藏定时器
            if (this._isExpanded) {
                this._resetAutoHideTimer();
            }
        }
    },

    // 启动自动隐藏定时器
    _startAutoHideTimer() {
        this._resetAutoHideTimer();
    },

    // 重置自动隐藏定时器
    _resetAutoHideTimer() {
        // 清除旧定时器
        this._clearAutoHideTimer();

        // 创建新定时器
        this._autoHideTimer = setTimeout(() => {
            this._autoHideVideoBg();
        }, this._autoHideDelay * 1000);
    },

    // 清除自动隐藏定时器
    _clearAutoHideTimer() {
        if (this._autoHideTimer) {
            clearTimeout(this._autoHideTimer);
            this._autoHideTimer = null;
        }
    },

    // 自动隐藏 videoBg
    _autoHideVideoBg() {
        let videoBg = this.node.getChildByName("videoBg");
        if (videoBg && videoBg.active) {
            this._isExpanded = false;
            videoBg.active = false;

            // 切换按钮图标
            if (this.btnCollapse && this.collapseSpriteFrame && this.collapseSpriteFrame.length >= 2) {
                this.btnCollapse.spriteFrame = this.collapseSpriteFrame[1];
            }
        }
    },

    // 更新时间显示
    _updateTimeDisplay(progress) {
        if (!this.videoTimeLabel) return;

        // 计算当前时间（秒）
        let currentTime = progress * this._totalTime;

        // 格式化时间为 MM:SS 格式
        let currentTimeStr = this._formatTime(currentTime);
        let totalTimeStr = this._formatTime(this._totalTime);

        // 更新 label 显示
        this.videoTimeLabel.string = `${currentTimeStr} / ${totalTimeStr}`;
    },

    // 格式化时间（秒 -> MM:SS）
    _formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);

        // 补零
        let minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        let secsStr = secs < 10 ? `0${secs}` : `${secs}`;

        return `${minutesStr}:${secsStr}`;
    },

    // 隐藏 videoBg 元素（拖动进度条时）
    _hideVideoBgElements() {
        let videoBg = this.node.getChildByName("videoBg");
        if (!videoBg) return;

        // 隐藏背景精灵
        this._videoBgSprite = videoBg.getComponent(cc.Sprite);
        if (this._videoBgSprite) {
            if (!this._videoBgOriginalFrame) {
                this._videoBgOriginalFrame = this._videoBgSprite.spriteFrame;
            }
            this._videoBgSprite.spriteFrame = null;
        }

        // 隐藏控制按钮节点（btn_collapse 在 videoBg 外面）
        let btnCollapse = this.node.getChildByName("btn_collapse");
        if (btnCollapse) btnCollapse.active = false;

        // 隐藏 videoBg 内的控制按钮
        this._setControlButtonsVisible(videoBg, false);

        // 时间显示放大2倍
        if (this.videoTimeLabel && this.videoTimeLabel.node) {
            this.videoTimeLabel.node.scale = 2;
        }
    },

    // 显示 videoBg 元素（拖动结束时）
    _showVideoBgElements() {
        let videoBg = this.node.getChildByName("videoBg");
        if (!videoBg) return;

        if (!videoBg.active) videoBg.active = true;

        // 恢复背景精灵
        this._videoBgSprite = videoBg.getComponent(cc.Sprite);
        if (this._videoBgSprite && this._videoBgOriginalFrame) {
            this._videoBgSprite.spriteFrame = this._videoBgOriginalFrame;
        }

        // 显示控制按钮
        let btnCollapse = this.node.getChildByName("btn_collapse");
        if (btnCollapse) btnCollapse.active = true;

        this._setControlButtonsVisible(videoBg, true);

        // 时间显示恢复原始大小
        if (this.videoTimeLabel && this.videoTimeLabel.node) {
            this.videoTimeLabel.node.scale = 1;
        }
    },

    // 设置控制按钮的可见性
    _setControlButtonsVisible(videoBg, visible) {
        ['scale', 'stop', 'flop', 'turn', 'river'].forEach(name => {
            let node = videoBg.getChildByName(name);
            if (node) node.active = visible;
        });
    },
});
