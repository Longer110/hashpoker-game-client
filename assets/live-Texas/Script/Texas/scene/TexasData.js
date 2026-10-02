/*
    德州数据
*/

let UserInfo = require("UserInfo");
let Utils = require("Utils");
var ConfigGame = require("ConfigGame");
let TexasUtils = require("TexasUtils");

let livePlayerSaet = [1, 2, 3, 5, 8, 9];//直播玩家客户端座位号
let setPlayerSeat = [1, 2, 3, 4, 5, 6, 7, 8, 9];//合集玩家客户端座位号

let TexasData = cc.Class({
    extends: Object,

    properties: {
        _nSmallBlind: 0,//小盲注数额
        _nBigBlind: 0,//大盲注数额
        _nPreAnte: 0,//前注数额
        _nZhouTou: 0,//抓头
        _preAnteOdd: 2,//前注模式庄家倍数
        _nUserGold: 0,//当前用户买入金额
        _maxTableSeat: 0,//牌桌最大座位数
        _maxOperateTime: 0,//操作最大时间
        _rewardPoolSum: 0,//奖池总额
        _curTableId: 0,//当前牌桌ID
        _lastTableId: 0,//上一次牌桌ID
        _bankUserId: 0,//庄家ID
        _operatingUserId: 0,//当前操作玩家ID
        _nBalance: 0, //当前玩家游戏外户余额
        _selfCard: null,//自己手牌
        _roomConfig: null,//可选的配置
        _tableInfo: null,//牌桌信息
        _magicGold: [],//表情金币
        _TableData: [],//牌桌列表
        _BlindData: [],//(大小盲)玩家下注数据
        _FailUserData: [],//失败玩家（不飞底池）
        _playerSeatArry: [],//客户端座位号
        _commonCards: [],//公共牌数据
        _settleData: [],//结算数据
        _primaryButton: null,//预选按钮
        _windowData: null,//弹窗数据
        _insureData: null,//保险数据
        _curTableName: "",//当前牌桌名
        _nLiveUserId: 0,//主播id
        _nClubId: 0,//俱乐部id
        _nCurrency: 1,//当前所用币种
        _nTable: 0,//牌桌类型
        _nGame: 1,//1:德州,2:奥马哈,3:短牌
        _autoStartNum: 0,//自动开局人数
        _finishSchedule: 0,//倒计时结束时间
        _finishTimeStamp: 0,//当前时间戳
        _saveOperate: 0,//保存操作(1:弃或过 2:让牌 3:跟 4:跟任何)
        _state: 0,//当前阶段(0:游戏未开始 1:操作阶段 2:结算阶段)
        _startFaPaiTime: 0,//发牌动画时间
        _nKeepTime: 0, //桌子时长
        _nInitCountdown: 0, //初始倒计时

        _gameStart: false,//游戏是否开始
        _isFaPaiState: false,//是否发牌阶段
        _isSelfQiPai: false,//自己是否弃牌
        _isSelfInTable: false,//自己是否在牌桌
        _isAOF: false,//是否全下/弃牌
        _isShowCard: false,//是否已显示手牌
        _isOverTime: false,//是否超时
        _nInsureDelayCost: 0,//保险延时费用 -1:不可延时 0:免费延时 >0:金币延时
        _isXiaBo: false,//是否下播
        _isShowRoomConfig: false,//是否开启房间配置
        _isAppShow: false,//是否后台到前台
        _isAdmin: false,//是否权限管理者
        _isCarry: false,//是否带出筹码
        _isGameStop: false,//是否游戏暂停
        _isTableStart: false,//牌桌是否开始
        _isNextRoundStart: false,//下局是否自动开始
        _isStandUpNextHand: false,//下局站起状态
        _isSelfParticipating: false,//自己是否参与当前牌局
        _isOnload: false,//是否onload
        __clubTransferOpen: null,//俱乐部转账配置

        chatType: 1,//聊天框位置(1:上 2:下)
    },

    ctor() {

    },
    init() {
        this._nSmallBlind = 0;
        this._nBigBlind = 0;
        this._nPreAnte = 0;
        this._maxTableSeat = 0;
        this._maxOperateTime = 0;
        this._rewardPoolSum = 0;
        this._curTableId = 0;
        this._bankUserId = 0;
        this._operatingUserId = 0;
        this._selfCard = {};
        this._roomConfig = {};
        this._tableInfo = {};
        this._magicGold = [];
        this._BlindData = [];
        this._commonCards = [];
        this._settleData = [];
        this._FailUserData = [];
        this._windowData = {};
        this._insureData = null;
        this._curTableName = "";
        this._nLiveUserId = 0;
        this._nClubId = 0;
        this._nCurrency = 1;
        this._nTable = 0;
        this._nGame = 1;
        this._autoStartNum = 0;
        this._finishSchedule = 0;
        this._finishTimeStamp = 0;
        this._saveOperate = 0;
        this._state = 0;
        this._startFaPaiTime = 0;

        this._gameStart = false;
        this._isFaPaiState = false;
        this._isSelfQiPai = false;
        this._isSelfInTable = false;
        this._isAOF = false;
        this._isShowCard = false;
        this._isOverTime = false;
        this._isXiaBo = false;
        this._isShowRoomConfig = false;
        this._isAppShow = false;
        this._isAdmin = false;
        this._isCarry = false;
        this._isGameStop = false;
        this._isTableStart = false;
        this._isNextRoundStart = false;
        this._isStandUpNextHand = false;
        this._isSelfParticipating = false;
        this._primaryButton = null;

        // 从设置中读取下局站起配置
        this._loadStandUpNextHandSetting();
    },

    gameReset() {
        this._rewardPoolSum = 0;
        this._selfCard = {};
        this._BlindData = [];
        this._commonCards = [];
        this._settleData = [];
        this._FailUserData = [];
        this._insureData = null;
        this._finishSchedule = 0;
        this._finishTimeStamp = 0;
        this._saveOperate = 0;
        this._state = 0;

        this._gameStart = false;
        this._isFaPaiState = false;
        this._isSelfQiPai = false;
        this._isSelfParticipating = false;
        this._isShowCard = false;
        this._isOverTime = false;
        this._isShowRoomConfig = false;
        this._primaryButton = null;
    },

    // update (dt) {},

    //设置玩家信息
    // data = {
    //      nUserId			 //玩家ID
    //      seat			 //玩家客户端座位号
    //      nSitId			 //玩家服务端座位号
    //      sFaceId			 //头像url
    //      sName			 //昵称
    //      nSex	         //性别 0:男 1:女
    //      nBalance		 //余额
    //      isBanker		 //是否为庄; true:是 ,false:否
    //      arrHoleCards	 //底牌(值为0的牌，显示牌背,表示还没亮牌)
    //      nCardType        //牌型
    //      nBet			 //玩家当轮当前下注数目(0时不要显示)
    //      nStatus	 	     //当前玩家状态, 0:等待操作权 1:思考中 2:跟注 3:让牌 4:加注 5:AllIn 6:弃牌 7:旁观 
    //      nOpTimeRemain	 //剩余可操作(思考)时间 (思考中时有效,其它情况时为0)
    //      isPlaying        //是否在玩
    // // }
    //服务端座位转客户端座位
    _setUserSidToSeat(data) {
        //cc.log("_setUserSidToSeat Utils.clone(data):",Utils.clone(data));
        let selfSid = null;
        let info = UserInfo.getInfo();

        let tablePeople = this._playerSeatArry;
        if (this._playerSeatArry.length <= 0) {
            tablePeople = !TexasUtils._getSkin(["c"]) ? livePlayerSaet : TexasUtils._getClubPlayerPos(this._getMaxTableSeat());
        }

        let seatCount = tablePeople.length;

        let arry = [];
        if (data && data.length > 0) {
            arry = data;

            //cc.log("_setUserSidToSeat1 info.nUserID,Utils.clone(arry):",info.nUserID,Utils.clone(arry));
            for (let i = 0; i < arry.length; i++) {//获取自己服务端座位号对应客户端座位号
                let arryItem = arry[i];
                let uId = arryItem.nUserId;

                if (uId == info.nUserID) {
                    arryItem.seat = 1;//自己客户端座位号为1
                    selfSid = arryItem.nSitId;

                    break;
                }
            }

            //cc.log("_setUserSidToSeat2 Utils.clone(selfSid):",Utils.clone(selfSid));

            if (selfSid) {
                for (let j = 0; j < arry.length; j++) {
                    let arryItem = arry[j];
                    let sid = arryItem.nSitId;

                    // let livePlayerSaet = [1,2,3,5,8,9];//直播玩家客户端座位号
                    // let setPlayerSeat = [1,2,3,4,5,6,7,8,9];//合集玩家客户端座位号

                    if (sid != selfSid) {
                        //cc.log("_setUserSidToSeat3 Utils.clone(tablePeople):",Utils.clone(tablePeople));
                        for (let h = 0; h < tablePeople.length; h++) {
                            let nextKHDSeat = tablePeople[h + 1];//客户端位置
                            let nextFWDSeat = selfSid + h + 1;//服务端位置
                            if (nextFWDSeat > seatCount) {
                                nextFWDSeat = nextFWDSeat - seatCount;
                            }

                            //cc.log("_setUserSidToSeat4 nextKHDSeat,nextFWDSeat:",nextKHDSeat,nextFWDSeat);
                            if (nextFWDSeat == sid) {//服务端位置转客户端位置
                                arryItem.seat = nextKHDSeat;

                                break;
                            }
                        }
                    }

                }
            } else {
                let absSeatArry = TexasUtils._getClubPlayerPos(this._getMaxTableSeat());

                for (let j = 0; j < arry.length; j++) {
                    let arryItem = arry[j];
                    let nSitId = arryItem.nSitId;

                    arryItem.seat = absSeatArry[nSitId - 1];
                }
            }

        }

        return arry;
    },


    //设置游戏开始状态
    _setGameStart(isStart) {
        cc.log("设置游戏开始状态:", isStart);
        if (isStart) {
            this._setIsTableStart(true)
        }
        this._gameStart = isStart;
    },

    //获得游戏开始状态
    _getGameStart() {
        //  cc.log("获得游戏开始状态:",this._gameStart);

        return this._gameStart;
    },

    //设置自己是否参与当前牌局
    _setSelfParticipating(isParticipating) {
        cc.log("设置自己是否参与当前牌局:", isParticipating);

        this._isSelfParticipating = isParticipating;
    },

    //获取自己是否参与当前牌局
    _getSelfParticipating() {
        return this._isSelfParticipating;
    },

    //设置发牌阶段
    _setIsFaPaiState(isFaPai) {
        cc.log("设置发牌阶段:", isFaPai);

        this._isFaPaiState = isFaPai;
    },

    //获得发牌阶段
    _getIsFaPaiState() {
        //   cc.log("获得发牌阶段:",this._isFaPaiState);

        return this._isFaPaiState;
    },

    //设置牌桌大小盲前注
    _setTableBlind(nSmallBlind, nBigBlind, nPreAnte) {
        cc.log("设置牌桌大小盲前注:", nSmallBlind, nBigBlind, nPreAnte);

        if (nSmallBlind && nBigBlind) {
            nSmallBlind = Number(nSmallBlind);
            nBigBlind = Number(nBigBlind);

            this._nSmallBlind = nSmallBlind;
            this._nBigBlind = nBigBlind;
        }

        if (nPreAnte) {
            nPreAnte = Number(nPreAnte);

            this._nPreAnte = nPreAnte;
        }
    },

    //获得小盲注值
    _getSmallBlind() {
        //  cc.log("获得小盲注值:",this._nSmallBlind);

        return this._nSmallBlind;
    },

    //获得大盲注值
    _getBigBlind() {
        //  cc.log("获得大盲注值:",this._nBigBlind);

        return this._nBigBlind;
    },

    //设置抓头
    _setZhuaTou(data) {
        this._nZhouTou = data
    },

    //获取抓头
    _getZhuaTou() {
        return this._nZhouTou
    },

    //设置前注倍数
    _setPreAnteOdd(data) {
        this._preAnteOdd = data
    },

    //获取前注倍数
    _getPreAnteOdd() {
        return this._preAnteOdd
    },

    //获得前注值
    _getPreAnte() {
        return this._nPreAnte;
    },

    //设置当前用户金额
    _setUserGold(data) {
        cc.log('test  ---- 设置当前用户金额 ==  ', data)
        this._nUserGold = data
    },

    //获取当前用户金额
    _getUserGold() {
        return this._nUserGold
    },

    //设置用户游戏外余额
    _setBalance(data) {
        this._nBalance = data
    },

    //获取用户游戏外余额
    _getBalance() {
        return this._nBalance
    },

    //设置牌桌最大座位数
    _setMaxTableSeat(num) {

        num = Number(num);

        this._maxTableSeat = num;
        this._playerSeatArry = !TexasUtils._getSkin(["c"]) ? livePlayerSaet : TexasUtils._getClubPlayerPos(num);//直播:6人桌; 合集:9人桌
        // this._playerSeatArry = !TexasUtils._getSkin(["c"])?livePlayerSaet:setPlayerSeat;//直播:6人桌; 合集:9人桌
    },

    //获得牌桌最大座位数
    _getMaxTableSeat() {

        let defaultSeat = TexasUtils._getSkin(["c"]) ? 9 : 6;//默认座位人数
        let maxTableSeat = this._maxTableSeat ? this._maxTableSeat : defaultSeat;

        return maxTableSeat;
    },

    //设置操作最大时间
    _setMaxOperateTime(time) {

        time = Number(time);

        this._maxOperateTime = time;
    },

    //获得操作最大时间
    _getMaxOperateTime() {
        //   cc.log("获得操作最大时间:",this._maxOperateTime);

        return this._maxOperateTime;
    },

    //设置奖池总额
    _setRewardPoolSum(sum) {

        sum = Number(sum);

        this._rewardPoolSum = sum;
    },

    //获得奖池总额
    _getRewardPoolSum() {
        //  cc.log("获得奖池总额:",this._rewardPoolSum);

        return this._rewardPoolSum;
    },

    //设置当前牌桌
    _setCurTableId(tableId) {
        cc.log("设置当前牌桌Id:", tableId);

        this._curTableId = tableId;
    },

    //获得当前牌桌
    _getCurTableId() {
        cc.log("获得当前牌桌Id:", this._curTableId);

        return this._curTableId;
    },

    //设置上一次牌桌ID
    _setLastTableID(tableId) {
        cc.log("设置上一次牌桌ID:", tableId);

        this._lastTableId = tableId;
    },

    //获得上一次牌桌ID
    _getLastTableID() {
        cc.log("获得上一次牌桌ID:", this._lastTableId);

        return this._lastTableId;
    },

    //设置庄家ID
    _setBankUserID(uid) {
        cc.log("设置庄家ID:", uid);

        this._bankUserId = uid;
    },

    //获得庄家ID
    _getBankUserID() {
        //  cc.log("获得庄家ID:",this._bankUserId);

        return this._bankUserId;
    },

    //设置当前正在操作玩家id
    _setOperatingUserID(uid) {
        cc.log("设置当前正在操作玩家id", uid);

        this._operatingUserId = uid;
    },

    //获得当前正在操作玩家id
    _getOperatingUserID() {
        // cc.log("获得当前正在操作玩家id：",this._operatingUserId);

        return this._operatingUserId;
    },

    //设置预选按钮数据
    _setPrimaryData(data) {
        cc.log("设置预选按钮数据:", data);

        this._primaryButton = data;
    },

    //获得预选按钮数据
    _getPrimaryData() {
        //   cc.log("获得预选按钮数据:",this._primaryButton);

        return this._primaryButton;
    },

    //设置列表数据
    _setTableData(data) {
        cc.log("设置列表数据:", data);

        if (this._TableData.length > 0) {
            let curTableId = this._curTableId;


        } else {
            this._TableData = [];
            this._TableData.push(data);
        }
    },

    //获得列表数据
    _getTableData() {
        return this._TableData;
    },

    //设置大小盲注玩家数据
    _setBlindData(data) {
        cc.log("设置大小盲注玩家数据:", data);

        this._BlindData = data;
    },

    //获得大小盲注玩家数据
    _getBlindData() {
        //  cc.log("获得大小盲注玩家数据:",this._BlindData);

        return this._BlindData;
    },

    //设置大小盲注玩家数据
    _setBlindData(data) {
        cc.log("设置大小盲注玩家数据:", data);

        this._BlindData = data;
    },

    //获得大小盲注玩家数据
    _getBlindData() {
        //  cc.log("获得大小盲注玩家数据:",this._BlindData);

        return this._BlindData;
    },

    //设置公共牌数据
    _setCommonData(arry) {
        if (!arry) return;

        for (let i = 0; i < arry.length; i++) {
            this._commonCards.push(arry[i]);
        }

        cc.log("设置公共牌数据:", arry, this._commonCards);
    },

    //获得公共牌数据
    _getCommonData() {
        // cc.log("获得公共牌数据:",this._commonCards);

        return this._commonCards;
    },

    //设置结算数据
    _setSettleData(data) {
        cc.log("设置结算数据:", data);

        this._settleData = data;
    },

    //获得结算数据
    _getSettleData() {
        //   cc.log("获得结算数据:",this._settleData);

        return this._settleData;
    },

    //设置失败玩家数据
    _setFailUserData(data) {
        cc.log("设置失败玩家数据", data);

        this._FailUserData = data;
    },

    //获得失败玩家数据
    _getFailUserData() {
        //  cc.log("获得失败玩家数据:",this._FailUserData);

        return this._FailUserData;
    },

    //设置自己手牌
    _setSelfCard(arrHoleCards, nCardType) {
        cc.log("设置自己手牌:", arrHoleCards, nCardType);

        this._selfCard.card = arrHoleCards;
        this._selfCard.type = nCardType;
    },

    //获得自己手牌
    _getSelfCard() {
        //  cc.log("获得自己手牌:",this._selfCard);

        return this._selfCard;
    },

    //设置可选的配置
    _setSelectConfig(config) {
        cc.log("设置可选的配置:", config);

        this._roomConfig = config;
    },

    //获得可选的配置
    _getSelectConfig() {
        cc.log("获得可选的配置:", this._roomConfig);
        return this._roomConfig;
    },

    //设置牌桌信息
    _setTableInfo(data) {
        cc.log("设置牌桌信息:", data);

        this._tableInfo = data;
    },

    //获得牌桌信息
    _getTableInfo() {
        return this._tableInfo;
    },

    //设置表情金币
    _setMagicGold(data) {
        cc.log("设置表情金币:", data);

        this._magicGold = data;
    },

    //获得表情金币
    _getMagicGold(magic) {
        let gold = 0;

        let magicGold = this._magicGold;
        for (let i = 0; i < magicGold.length; i++) {
            let magicItem = magicGold[i];
            let nChatId = magicItem.nChatId;
            let nCost = magicItem.nCost;

            if (magic == nChatId) {
                gold = nCost;

                break;
            }
        }

        cc.log("获得表情金币:", magic, gold, Utils.clone(this._magicGold));
        return gold;
    },

    //获取表情金币列表
    _getMagicGoldList() {
        return this._magicGold;
    },

    //设置弹窗数据
    _setWindowData(nRlt) {
        cc.log("设置弹窗数据:", nRlt);

        let data = {
            nRlt: nRlt,
        }

        this._windowData = data;
    },

    //获得弹窗数据
    _getWindowData() {
        //  cc.log("获得弹窗数据:",this._windowData);

        return this._windowData;
    },

    //设置保险数据
    _setInsureData(data) {
        cc.log("设置保险数据:", data);
        let insure = TexasUtils.handleInsureData(data)
        this._insureData = insure;
    },

    //获得保险数据
    _getInsureData() {
        cc.log("获得保险数据:", this._insureData);

        return this._insureData;
    },

    //设置当前牌桌名
    _setCurTableName(name) {
        cc.log("设置当前牌桌名:", name);

        this._curTableName = name;
    },

    //获得当前牌桌名
    _getCurTableName() {
        //  cc.log("获得当前牌桌名:",this._curTableName);

        return this._curTableName;
    },

    //设置主播id
    _setLiveUserId(id) {
        cc.log("设置主播id:", id);

        this._nLiveUserId = id;
    },

    //获得主播id
    _getLiveUserId() {
        //   cc.log("获得主播id:",this._nLiveUserId);

        return this._nLiveUserId;
    },

    //设置俱乐部id
    _setClubId(id) {

        this._nClubId = id;
    },

    //获得俱乐部id
    _getClubId() {
        //   cc.log("获得俱乐部id:",this._nLiveUserId);

        return this._nClubId;
    },

    //设置当前所用币种
    _setCurrency(gold) {
        cc.log("设置当前所用币种:", gold);

        this._nCurrency = gold;
    },

    //获得当前所用币种
    _getCurrency() {
        return this._nCurrency;
    },

    //设置当前牌桌
    _setTable(table) {
        cc.log("设置当前牌桌:", table);

        this._nTable = table;
    },

    //获得当前牌桌
    _getTable() {
        return Number(this._nTable);
    },

    //设置当前游戏
    _setGame(game) {
        cc.log("设置当前游戏:", game);

        this._nGame = game;
    },

    //获得当前游戏
    _getGame() {
        return Number(this._nGame);
    },

    //设置自动开局人数
    _setAutoStartNum(num) {
        cc.log("设置自动开局人数:", num);

        this._autoStartNum = num;
    },

    //获得自动开局人数
    _getAutoStartNum() {
        return this._autoStartNum;
    },

    //设置保存执行动作
    _setSaveOperate(value) {
        cc.log("设置保存执行动作:", value);

        this._saveOperate = value;
    },

    //获得保存执行动作
    _getSaveOperate() {
        //   cc.log("获得保存执行动作:",this._saveOperate);

        return this._saveOperate;
    },

    //设置游戏阶段(0:游戏未开始 1:操作阶段 2:结算阶段 -3: 重置阶段)
    _setGameState(state) {
        cc.log("设置游戏阶段:", state);

        this._state = state;
    },

    //获得游戏阶段
    _getGameState() {
        //   cc.log("获得游戏阶段:",this._state);

        return this._state;
    },

    //设置倒计时最终时间
    _setFinishScheduleTime(time) {
        let timestamp = Date.parse(new Date()) / 1000;//当前时间戳（秒）
        this._finishSchedule = timestamp + time;//结束时的时间戳

        cc.log("设置倒计时最终时间:", timestamp, time, this._finishSchedule);
    },

    //获得倒计时最终时间
    _getFinishScheduleTime() {
        //  cc.log("获得倒计时最终时间:",this._finishSchedule);

        return this._finishSchedule;
    },

    //设置桌子时长
    _setKeepTime(data) {
        this._nKeepTime = data
    },

    //获取桌子时长
    _getKeepTime() {
        return this._nKeepTime
    },

    //设置初始倒计时
    _setInitCountdown(data) {
        this._nInitCountdown = data
    },

    //获取初始倒计时
    _getInitCountdown() {
        return this._nInitCountdown
    },


    //设置自己是否已弃牌
    _setIsSelfQiPai(isQiPai) {
        cc.log("设置自己是否已弃牌:", isQiPai);

        this._isSelfQiPai = isQiPai;
    },

    //获得自己是否已弃牌
    _getIsSelfQiPai() {
        //  cc.log("获得自己是否已弃牌:",this._isSelfQiPai);

        return this._isSelfQiPai;
    },

    //设置自己是否在牌桌
    _setSelfIsInTable(isInTable) {
        cc.log("设置自己是否在牌桌:", isInTable);

        this._isSelfInTable = isInTable;

        //如果自己不在牌桌，就把自己是否参与当前牌局设置为false
        if (isInTable == false) {
            cc.log("自己不在牌桌，就把自己是否参与当前牌局设置为false");
            this._setSelfParticipating(isInTable);
        }
    },

    //获得自己是否在牌桌
    _getSelfIsInTable() {
        //  cc.log("获得自己是否在牌桌:",this._isSelfInTable);

        return this._isSelfInTable;
    },

    //设置是否全下/弃牌
    _setIsAOF(isAOF) {
        this._isAOF = isAOF;
    },

    //获得是否全下/弃牌
    _getIsAOF() {
        return this._isAOF;
    },

    //设置显示手牌
    _setIsShowCard(isShow) {
        cc.log("设置显示手牌:", isShow);

        this._isShowCard = isShow;
    },

    //获得显示手牌
    _getIsShowCard() {
        // cc.log("获得显示手牌:",this._isShowCard);

        return this._isShowCard;
    },

    //设置超时
    _setIsOverTime(isOverTime) {
        cc.log("设置超时:", isOverTime);

        this._isOverTime = isOverTime;
    },

    //获得超时
    _getIsOverTime() {
        // cc.log("获得超时:",this._isOverTime);

        return this._isOverTime;
    },

    //设置保险延时费用
    _setInsureDelayCost(cost) {
        cc.log("设置保险延时费用:", cost);

        this._nInsureDelayCost = cost;
    },

    //获得保险延时费用
    _getInsureDelayCost() {
        // cc.log("获得保险延时费用:", this._nInsureDelayCost);

        return this._nInsureDelayCost;
    },

    //设置直播间是否下播
    _setIsXiaBo(isXiaBo) {
        cc.log("设置直播间是否下播:", isXiaBo);

        this._isXiaBo = isXiaBo;
    },

    //获得直播间是否下播
    _getIsXiaBo() {
        //  cc.log("获得直播间是否下播:",this._isXiaBo);

        return this._isXiaBo;
    },

    //设置是否已开启房间配置
    _setIsShowRoomConfig(isShow) {
        cc.log("设置是否已开启房间配置:", isShow);

        this._isShowRoomConfig = isShow;
    },

    //获得是否已开启房间配置
    _getIsShowRoomConfig() {
        // cc.log("获得是否已开启房间配置:",this._isShowRoomConfig);

        return this._isShowRoomConfig;
    },

    //设置是否后台换前台
    _setIsAppShow(isAppShow) {
        cc.log("设置是否后台换前台:", isAppShow);

        this._isAppShow = isAppShow;
    },

    //获得是否后台换前台
    _getIsAppShow() {
        //  cc.log("获得是否后台换前台:",this._isAppShow);

        return this._isAppShow;
    },

    //设置是否权限管理者
    _setIsAdmin(isAdmin) {
        cc.log("设置是否权限管理者:", isAdmin);

        this._isAdmin = isAdmin;
    },

    //获得是否权限管理者
    _getIsAdmin() {
        //  cc.log("获得是否权限管理者:",this._isAdmin);

        return this._isAdmin;
    },

    //设置带出筹码
    _setIsCarry(isCarry) {
        cc.log("设置带出筹码:", isCarry);

        this._isCarry = isCarry;
    },

    //获得带出筹码
    _getIsCarry() {
        //  cc.log("获得带出筹码:",this._isCarry);

        return this._isCarry;
    },

    //设置游戏是否暂停
    _setIsGameStop(isStop) {
        cc.log("设置游戏是否暂停:", isStop);

        this._isGameStop = isStop;
    },

    //获得游戏是否暂停
    _getIsGameStop() {
        // cc.log("获得游戏是否暂停:",this._isGameStop);

        return this._isGameStop;
    },

    //设置牌桌是否开始
    _setIsTableStart(isStart) {
        cc.log("设置牌桌是否开始:", isStart);
        if (isStart) {
            this._setAutoStartNum(2);
        }
        this._isTableStart = isStart;
    },

    //获得牌桌是否开始
    _getIsTableStart() {
        // cc.log("获得牌桌是否开始:",this._isTableStart);

        return this._isTableStart;
    },

    //设置下局是否自动开始
    _setIsNextRoundStart(isStart) {
        cc.log("设置下局是否自动开始:", isStart);

        this._isNextRoundStart = isStart;
    },

    //获得下局是否自动开始
    _getIsNextRoundStart() {
        // cc.log("获得下局是否自动开始:",this._isNextRoundStart);

        return this._isNextRoundStart;
    },

    //设置是否onload
    _setIsOnload(isOnload) {
        cc.log("设置是否onload:", isOnload);

        this._isOnload = isOnload;
    },

    //获得是否onload
    _getIsOnload() {
        // cc.log("获得是否onload:",this._isOnload);

        return this._isOnload;
    },

    //设置聊天是否在上
    _setChatType(type) {
        cc.log("设置聊天是否在上:", type);

        this.chatType = type;
    },

    //获得聊天是否在上
    _getChatType() {
        // cc.log("获得聊天位置:",this.chatType);

        return this.chatType;
    },

    //存储玩家坐下站起状态
    _saveUserState(state) {
        cc.log("存储玩家坐下站起状态:", state);

        let info = UserInfo.getInfo();

        cc.sys.localStorage.setItem("Texas" + info.nUserID, state);
    },

    //获得玩家坐下站起状态
    _getUserState() {
        let info = UserInfo.getInfo();

        let isKeepStand = true;

        let userState = cc.sys.localStorage.getItem("Texas" + info.nUserID);
        if (userState == "sitDown") {
            isKeepStand = false;
        }

        //cc.log("获得玩家坐下站起状态:",userState,isKeepStand);
        return isKeepStand;
    },

    //保存记住配置
    _saveCheckRemember(config) {
        cc.log("保存记住配置:", config);

        cc.sys.localStorage.setItem("TexasRememberConfig", config);
    },

    //获得保存的记住配置
    _getCheckRemember() {
        let isCheck = false;

        let rememberTime = cc.sys.localStorage.getItem("TexasRememberTime");//记住配置的冷却时间
        cc.log("_getCheckRemember:", rememberTime);
        if (rememberTime) {
            rememberTime = Number(rememberTime);

            let dayTime = new Date().getTime();
            cc.log("_getCheckRemember dayTime,rememberTime:", dayTime, rememberTime);
            if (Number(dayTime) >= rememberTime) {//超过冷却时间
                //重置记住配置
                this._saveCheckRemember("unRemember");
            }
        } else {
            let thiryTime = new Date().getTime() + (30 * 24 * 3600 * 1000);
            cc.sys.localStorage.setItem("TexasRememberTime", thiryTime + "");
        }

        let config = cc.sys.localStorage.getItem("TexasRememberConfig");
        if (config == "remember") {
            isCheck = true;
        }

        cc.log("获得保存的记住配置:", config, isCheck);

        return isCheck;
    },

    //判断json类型
    _checkJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }

            } catch (e) {
                //console.log('error：'+str+'!!!'+e);
                return false;
            }
        }
    },

    //检测是否最终底池
    _checkIsFinalPool(data, sPos, pool) {
        cc.log("_checkIsFinalPool data,sPos,pool:", data, sPos, pool);
        let isFinal = true;

        if (data && data.length > 0) {
            for (let i = data.length - 1; i >= 0; i--) {
                let dataItem = data[i];
                let nPos = dataItem.nPos;//座位号
                let arrGoldGet = dataItem.arrGoldGet;//从各个池处中获得的金币

                cc.log("_checkIsFinalPool dataItem:", dataItem);
                if (sPos == nPos) {
                    break;
                } else {
                    if (arrGoldGet && arrGoldGet.length > 0) {
                        for (let j = 0; j < arrGoldGet.length; j++) {
                            let goldBet = arrGoldGet[j];
                            let nPotIdFrom = goldBet.nPotIdFrom;//金币来源(池ID)

                            cc.log("_checkIsFinalPool nPotIdFrom,nPos:", nPotIdFrom, nPos);
                            if (pool == nPotIdFrom) {
                                isFinal = false;

                                break;
                            }
                        }
                    }
                }

                if (!isFinal) {
                    break;
                }
            }

        }

        cc.log("检测是否最终底池 isFinal:", isFinal);
        return isFinal;
    },

    //牌桌时间暂停（0：正常， 1：暂停）
    setElapsedStatus(status) {
        this.elapsedStatus = status;
    },

    getElapsedStatus() {
        return this.elapsedStatus || 0
    },

    //设置牌桌是否是试玩
    isFreeGame(bFree) {
        this._bFreeGame = bFree;
    },

    getIsFreeGame() {
        return this._bFreeGame;
    },

    setFreeGameTableId(id) {
        this._freeGameTabelId = id;
    },

    getFreeGameTableId() {
        return this._freeGameTabelId;
    },

    //设置是否比赛桌管理员
    setIsMatchTableManager(isMatchManager) {
        this._isMatchManager = isMatchManager;
    },

    //获取是否比赛桌管理员
    getIsMatchTableManager() {
        return this._isMatchManager
    },

    //比赛桌状态,0:未开始 1:暂停 2:正常 (管理员可使用原暂停协议,控制该状态切换, 0->2<->1)
    setTableMStatus(status) {
        this._matchStatus = status;
    },

    getTableMStatus() {
        return this._matchStatus;
    },

    setMatchType(matchType) {
        this._matchType = matchType
    },

    getMatchType() {
        return this._matchType;
    },

    //是否mtt比赛
    isMTTMatch() {
        return this._nTable == 12;
    },

    //设置mtt比赛是否参赛玩家
    setIsMttUser(isMttUser) {
        this._isMttUser = isMttUser;
    },

    getIsMttUser() {
        return this._isMttUser;
    },

    //设置mtt比赛id
    setMttMatchId(id) {
        this._mttMatchId = id;
    },

    getMttMatchId() {
        return this._mttMatchId;
    },

    //设置mtt比赛已结束
    setMttMatchEnd(isEnd) {
        this._isMttMatchEnd = isEnd;
    },

    getMttMatchEnd() {
        return this._isMttMatchEnd;
    },

    //设置下局站起状态
    _setStandUpNextHand(isStandUp) {
        this._isStandUpNextHand = isStandUp;
        // 同步到LocalStorage
        cc.sys.localStorage.setItem("STAND_UP_NEXT_HAND", this._isStandUpNextHand ? "true" : "false");
    },

    //获取下局站起状态
    _getStandUpNextHand() {
        return this._isStandUpNextHand;
    },

    //设置俱乐部转账配置
    _setClubConfig(transferOpen) {
        this.__clubTransferOpen = transferOpen;
    },

    //获取俱乐部转账配置
    _getClubConfig() {
        return this.__clubTransferOpen;
    },

    /**
     * 从设置中加载下局站起配置
     */
    _loadStandUpNextHandSetting() {
        let standUpSetting = cc.sys.localStorage.getItem("STAND_UP_NEXT_HAND");
        this._isStandUpNextHand = (standUpSetting === "true");
    },

    /**
     * 重置下局站起状态（玩家手动站起时调用）
     */
    _resetStandUpNextHand() {
        this._isStandUpNextHand = false;
        cc.sys.localStorage.setItem("STAND_UP_NEXT_HAND", "false");
    },
});

let object = new TexasData();
module.exports = object;