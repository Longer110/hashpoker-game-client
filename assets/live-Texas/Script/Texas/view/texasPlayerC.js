/*
    德州玩家
*/

let Utils = require("Utils");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let TexasConfig = require("TexasConfig");
const i18n = require('i18n');
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let CMD = require("protocol_texas");
let TexasUtils = require("TexasUtils");
var ConfigGame = require("ConfigGame");
let TexasData = require("TexasData");

let TexasMusicPath = TexasConfig.TEXASMUSICPATH;

cc.Class({
    extends: cc.Component,

    properties: {
        headBox: cc.Node,//头像
        headPosition: cc.Node,//头像位置

        otherCards: cc.Node,//其他牌
        selfCards: cc.Node,//自己牌
        cardPosition: cc.Node,//牌位置

        chipZone: cc.Node,//下注区
        chipList: cc.Node,//筹码列表
        bankIcon: cc.Node,//庄家标识
        bankPosition: cc.Node,//庄家位置
        chipPosition: cc.Node,//下注区位置
        cardTypePosition: cc.Node,//牌型位置
        scorePosition: cc.Node,//分数位置

        goldPosition: cc.Node,//金币位置

        tuoguan: cc.Node,//托管

        nBank: cc.Node,//庄家

        mike: cc.Node,//麦克风
        mikePosition: cc.Node,//麦克风位置
        mikeAnim: cc.Node,//麦克风动画
        mikeBorder: cc.Node,//麦克风边框
        micState: cc.Node,//麦状态

        mikeC: cc.Node,//麦克风

        gift: cc.Node,//打赏
        giftPosition: cc.Node,//打赏位置

        magic: cc.Node,//魔法表情
        magicPosition: cc.Node,//魔法表情位置

        cardType_self: cc.Node,//自己牌型
        cardType_other: cc.Node,//别人牌型

        nameBg: cc.Node,//信息栏

        otherNameBgPosition: cc.Node, //其他人信息栏位置
        selfNameBgPosition: cc.Node, //自己信息栏位置

        action_self: cc.Node,//自己动作
        action_other: cc.Node,//别人动作
        actionPosition: cc.Node,//其他人动作位置

        timeBlock: cc.Node,//倒计时背景

        alarmClock: cc.Node,//倒计时
        // 自定义倒计时（独立于 alarmClock 的新时钟）
        countdownClock: cc.Node,

        nWin_self: cc.Node,//自己胜利
        nWin_other: cc.Node,//其他胜利

        winCardType: cc.Node,//胜利牌型

        nScore_self: cc.Node,//自己分数
        nScore_other: cc.Node,//别人分数

        kickBtn: cc.Node,//踢人按钮

        occupy: cc.Node,//留座中

        Effect: cc.Node,//特效

        spriteHead: cc.Sprite,
        magicBox: cc.Sprite,

        names: cc.Label,
        gold: cc.Label,

        nType: cc.Label,
        chipLabel: cc.Label,//下注值

        sitid: cc.Label,

        magicBoxSpriteFrame: {//麦克风边框
            default: [],
            type: cc.SpriteFrame
        },

        timeSpriteFrame: {//时间
            default: [],
            type: cc.SpriteFrame
        },

        winSpriteFrame: {//输赢
            default: [],
            type: cc.SpriteFrame
        },

        lightSpriteFrame: {//光圈
            default: [],
            type: cc.SpriteFrame
        },

        chipSpriteFrame: {//筹码
            default: [],
            type: cc.SpriteFrame
        },

        slSpriteFrame: {//胜率
            default: [],
            type: cc.SpriteFrame
        },

        itemChipPrefab: {//筹码预制
            default: null,
            type: cc.Prefab,
        },

        itemChipAnimPrefab: {//筹码粒子预制
            default: null,
            type: cc.Prefab,
        },

        atlasCardTypes: cc.SpriteAtlas,
        atlasCardType: cc.SpriteAtlas,

        pokerBack: cc.SpriteFrame,//卡背

        chatVoiceNode: cc.Node,
        insureTimeNode: cc.Node,    //投保倒计时
        insureAmountNode: cc.Node,  //已投保

        _Gold: 0,//金币
        _downBetCount: 0,//当前下注值
        _sShopAcc: 0,//第三方用户ID
        _name: "",//名字
        _nCard: [],//手牌
        _isAuto: false,//是否托管
        _isPlaying: false,//是否在玩
        _isRecordHead: false,//是否回放头像
        _cards: null,//牌

        _overShowCards: false,//是否预操作亮牌
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._isRecordHead = false;

        if (this.magicBox && this.magicBoxSpriteFrame) {
            this.magicBox.spriteFrame = !App.isCCLive() ? this.magicBoxSpriteFrame[0] : this.magicBoxSpriteFrame[1];
        }
    },

    onDestroy() {
        this._setStopDaoJiShi();
    },

    start() {

    },

    // update (dt) {},

    //设置玩家信息(isMang 2:大盲 3:小盲)
    setPlayerInfo(control, seat, data, isMang, isNoAddPool) {

        this.control = control;
        this.seat = seat;
        this.data = data;

        this._nCard = [0, 0];

        let delayTime = 0;
        if (data.hasOwnProperty("nDelay")) {//是否有延时,0:没延时 >0:延时后的总时间
            let nDelay = Number(data.nDelay);

            if (nDelay > 0) {
                delayTime += nDelay;
            }
        }

        this.maxTime = TexasData._getMaxOperateTime() + delayTime;

        //玩家服务端座位，用于测试
        this.sitid.string = data.nSitId;
        this.sitid.node.active = false;

        this._setMike(false);
        this._setGift(false);
        this.setMicState();

        let selfIsInTable = TexasData._getSelfIsInTable();
        this._setMagic(selfIsInTable);

        this._stopOccupyUpdate();

        this.occupy.active = false;

        this._ResetPlayer();

        this.changePlayerInfo(data);

        if (delayTime > 0) {
            // this.names.string = TexasUtils._getText(150);//延时
            // TexasUtils._setColor(this.names.node,"#ffad0f");
            this._updateAction(9);

            // if (this.data.nUserId==UserInfo.getInfo().nUserID) {
            //     this.names.node.active = false;
            // }
        }

        if (isMang) {//设置大小盲
            this._updateAction(isMang);
        }

        // if (data.hasOwnProperty("nWinRate")) {//胜率(值100即为100%, <=0:无意义)
        //     let nWinRate = data.nWinRate;

        //     if (Number(nWinRate)>0) {
        //         this._updateAction(-8,false,nWinRate);
        //     }
        // }

        let canAddBet = isNoAddPool ? true : false;
        this._updateDownBet(data.nBet, true, canAddBet);

        if (data.isBanker) {//是否为庄
            this.control._flyBankIcon(data.nSitId, true);
        }

        if (data.arrHoleCards && data.arrHoleCards.length > 0) {//手牌(值为0的牌，显示牌背,表示还没亮牌)
            let cardArry = data.arrHoleCards;
            if (UserInfo.getInfo().nUserID != this.data.nUserId) {
                if (Number(cardArry[0]) > 0 && Number(cardArry[1]) > 0) {
                    this._showCard(cardArry, data.nCardType, false, function () { }, false, true)
                } else {
                    this._setCardSprite(Number(cardArry[0]), Number(cardArry[1]));
                }
            } else {
                this._setCardSprite(Number(cardArry[0]), Number(cardArry[1]));
            }

        }
        //单独调整非自己玩家位置
        if (seat == 1 && UserInfo.getInfo().nUserID != this.data.nUserId) {
            this.node.y = this.node.y - 40;
        }
        //牌型
        let nCardType = data.nCardType;
        this.updateCardType(nCardType);

        //当前状态 0:等待操作权 1:思考中 2:跟注 3:让牌 4:加注 5:AllIn 6:弃牌 7:旁观 
        if (this.seat == 1) {
            //console.log("data.nStatus =",data.nStatus);
        }
        let nStatus = Number(data.nStatus);
        if (nStatus >= 0 && nStatus <= 5) {
            this._isPlaying = true;
        }

        let action = null;
        if (nStatus == 1) {
            let nOpTimeRemain = data.nOpTimeRemain;//剩余可操作(思考)时间 (思考中时有效,其它情况时为0)

            this._setAlarmSchedule(nOpTimeRemain, "default");
        } else if (nStatus == 2) {
            action = 5;
        } else if (nStatus == 3) {
            action = 8;
        } else if (nStatus == 4) {
            action = 6;
        } else if (nStatus == 5) {
            action = 7;
        } else if (nStatus == 6) {
            let card_1 = this._cards.getChildByName("card_1");
            let card_2 = this._cards.getChildByName("card_2");

            if (this.data.nUserId != UserInfo.getInfo().nUserID) {
                card_1.active = false;
                card_2.active = false;
                this.setOtherCardsBack(false, false)
            }

            action = 4;
        } else if (nStatus == 7) {
            this._setGrey(true);
        }

        this._updateAction(action, true);

        if (data.isAuto) {
            this._showTuoGuan(true);
        }
    },

    //重置玩家
    _ResetPlayer(isUpdateSeat) {
        this._overShowCards = false;
        let info = UserInfo.getInfo();
        this._showHead(true);

        if (isUpdateSeat) {
            this._updateMagicFace(isUpdateSeat);

            this.data.seat = isUpdateSeat;
            this.seat = isUpdateSeat;
        } else {
            this._nCard = [0, 0];

            //牌型
            this.cardType_self.active = false;
            this.cardType_other.active = false;
            if (info.nUserID == this.data.nUserId) {
                this.cardType = this.cardType_self;
            } else {
                this._setCardsSize(1);
                this.cardType = this.cardType_other;
            }

            //this.otherCards.scale = 1.3;
            this.otherCards.scale = 0.9;
            this.otherCards.active = false;

            this.setOtherCardsBack(false, false)
            this.selfCards.active = false;

            //分数
            this.nScore_self.active = false;
            this.nScore_other.active = false;
            if (info.nUserID == this.data.nUserId) {
                this.nScore = this.nScore_self;
            } else {
                this.nScore = this.nScore_other;
            }
        }

        this.setPosition(this.seat, isUpdateSeat);//位置
        this._playChipAnim();//播放筹码粒子特效
        if (!isUpdateSeat) {
            this.stopUpdate();

            this.stopUpdateInsure();

            //动作
            this.action_self.active = false;
            this.action_other.active = false;
            if (info.nUserID == this.data.nUserId) {
                this.action = this.action_self;
                this.action_self.active = true;
            } else {
                this.action = this.action_other;
                this.action_other.active = true;
            }

            //胜利
            this.nWin_self.active = false;
            this.nWin_other.active = false;
            if (info.nUserID == this.data.nUserId) {
                this.nWin = this.nWin_other;
                this.nameBg.position = this.selfNameBgPosition.position;
            } else {
                this.nWin = this.nWin_other;
                this.nameBg.position = this.otherNameBgPosition.position;
            }

            this._cards.zIndex = 2;
            let card_1 = this._cards.getChildByName("card_1");
            let card_2 = this._cards.getChildByName("card_2")
            if (card_1.getChildByName("eye") && card_2.getChildByName("eye")) {
                card_1.getChildByName("eye").active = false;
                card_2.getChildByName("eye").active = false;
            }
            this.cardType.zIndex = 14;
            this.nScore.zIndex = 14;
            // this.nameBg.zIndex = 14;
            // if (info.nUserID!=this.data.nUserId) {
            this.action.zIndex = 10;
            //     this.nameBg.zIndex = 12;
            // }

            this._initEffect();//光圈特效
            this._setGrey();//置灰

            this._updateAction();//更新动作(1:托管 2:大盲 3:小盲 4:弃牌 5:跟注 6:加注 7:allin)

            this.nWin.active = false;
            // this.nWin.zIndex = -20;
            this.winCardType.zIndex = 20;
            this.winCardType.active = false;
            this.nScore.active = false;
            this.timeBlock.active = false;
            this.alarmClock.active = false;
            if (this.kickBtn) {
                this.kickBtn.active = false;
                this.kickBtn.zIndex = 20;
            }

            this._downBetCount = 0;
            this._isPlaying = false;

            // this.chipList.destroyAllChildren();
        }
    },


    _setCardsSize(type) {
        let card_1 = this.otherCards.getChildByName("card_1");
        let card_2 = this.otherCards.getChildByName("card_2");
        card_1.stopAllActions();
        card_2.stopAllActions();
        card_1.scale = TexasUtils._getSkin(["d"]) ? 0.35 : 0.32;
        card_2.scale = TexasUtils._getSkin(["d"]) ? 0.35 : 0.32;
        card_1.opacity = 255
        card_2.opacity = 255

        card_1.x = type == 1 ? 45 : 19.435;
        card_1.y = type == 1 ? -32 : 10;

        card_2.x = type == 1 ? 65 : 80.616;
        card_2.y = type == 1 ? -32 : 10;
        this.setOtherCardsBack(true, false)


        // if (this.seat==8 || this.seat==9) {
        //     if (type==2) {
        //         card_1.x = -2.213;
        //         card_1.y = 10;

        //         card_2.x = 58.599;
        //         card_2.y = 10;
        //     }
        // }
    },

    //播放筹码粒子动画
    _playChipAnim(isShow) {
        let chipAnim = this.headBox.getChildByName("chipAnim");
        if (cc.isValid(chipAnim)) {
            chipAnim.destroy();
        }

        // if (isShow) {
        //     let itemChip = cc.instantiate(this.itemChipAnimPrefab);
        //     itemChip.parent = this.headBox;
        //     itemChip.name = "chipAnim";
        //     itemChip.zIndex = 22;
        //     itemChip.active = true;
        // }
    },

    //设置麦克风
    _setMike(visible) {
        let info = UserInfo.getInfo();

        let voice = this.mike.getChildByName("voice");//音量
        let mikeUse = this.mike.getChildByName("mikeUse");//使用麦克风
        let mikeForbit = this.mike.getChildByName("mikeForbit");//禁用麦克风

        if (info.nUserID == this.data.nUserId) {
            visible = true;
        }

        voice.active = visible;
        mikeUse.active = visible;
        mikeForbit.active = visible;

        this.mike.active = false;
    },

    //设置打赏
    _setGift(visible) {
        this.gift.active = visible;
    },

    //设置魔法表情
    _setMagic(visible) {

        // if (TexasUtils._getSkin(["default","b"])) {
        //     this.magic.active = this.data.nUserId==UserInfo.getInfo().nUserID?false:visible;
        // }else if (TexasUtils._getSkin(["b"])) {
        //     this.magic.active = false;
        // }

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this.magic.active = false;
        }
    },

    //设置留座
    _setOccupied(times) {
        if (!this.occupy) return;

        let info = UserInfo.getInfo();

        let label = this.occupy.getChildByName("label").getComponent(cc.Label);//留座中
        let time = this.occupy.getChildByName("time").getComponent(cc.Label);//时间
        label.string = TexasUtils._getText(169);

        time.string = times + "s";

        this.OccupyTimes = times;

        this.occupy.active = true;

        if (times <= 0) {//留座时间结束
            this._stopOccupyUpdate();

            this.occupy.active = false;

            if (this.control && info.nUserID == this.data.nUserId) {
                let control = this.control;
                control.occupyBtn.active = true;
            }
        } else {
            this._startOccupyUpdate();
        }
    },

    //特效
    _initEffect(type) {
        let allin = this.Effect.getChildByName("allin");
        let wins = this.Effect.getChildByName("wins");
        allin.active = false;
        wins.active = false;

        if (Number(type) == 1) {
            wins.active = true;
        } else if (Number(type) == 2) {
            allin.active = true;
        }

        // win1.getComponent(cc.Sprite).spriteFrame = this.lightSpriteFrame[lightIndex];
        // win2.getComponent(cc.Sprite).spriteFrame = this.lightSpriteFrame[lightIndex];
        // win3.getComponent(cc.Sprite).spriteFrame = this.lightSpriteFrame[lightIndex];

        // if (Number(type)==1 || Number(type)==2) {
        //     win.active = true;
        // }
        this.Effect.active = true;
    },

    //设置置灰
    _setGrey(isGrey, nPos) {

        if (!nPos || nPos != this.data.nSitId) {
            // this.spriteHead.node.color = isGrey?new cc.Color(60, 60, 60):new cc.Color(255, 255, 255);
            // this.nameBg.color = isGrey?new cc.Color(60, 60, 60):new cc.Color(255, 255, 255);
            // this.names.node.color = isGrey?new cc.Color(120,133,123):new cc.Color(255, 255, 255);
            // this.gold.node.color = isGrey?new cc.Color(120,133,123):new cc.Color(255, 255, 255);

            this.spriteHead.node.opacity = isGrey ? 102 : 255;
            this.nameBg.opacity = isGrey ? 102 : 255;
            this.names.node.opacity = isGrey ? 254 : 255;
            this.gold.node.opacity = isGrey ? 254 : 255;
            // this.names.opacity = isGrey?35:255;
            // this.gold.opacity = isGrey?35:255;
            // this.names._forceUpdateRenderData();

            // let actionChild = this.action.children;
            // for (let i = 0; i < actionChild.length; i++) {
            //     let child = actionChild[i];

            //     child.color = i != 3 && isGrey ? new cc.Color(60, 60, 60) : new cc.Color(255, 255, 255);
            // }
            if (isGrey && this.nWin) {//保险赔付，分池返回不算赢
                this.nWin.active = false
                this.Effect.getChildByName("wins").active = false;
            }

        }

        if (isGrey) {
            this._setCardGrey(1);
            this._setCardGrey(2);
        } else {
            this._setCardGrey();
        }

    },

    //设置位置
    setPosition(seat, isUpdateSeat) {

        let info = UserInfo.getInfo();

        //头像（1:自己，其他人）
        let headStr = "other";
        if (seat == 1) {
            if (this.data.nUserId != info.nUserID) {
                headStr = "self";
            } else {
                headStr = "own";

            }
        }

        if (headStr == "own" && this.control && this.control.nGenZhu) {
            // let control = this.control;

            // let nGenZhu = control.nGenZhu;

            // let pos = TexasUtils._getNodePos(nGenZhu,this.headBox);
            // this.Effect.x = pos.x;
            // this.Effect.y = pos.y;
            //this.headBox.x = pos.x;
            //this.headBox.y = pos.y;

            this.Effect.position = this.headPosition.getChildByName(headStr).position;
            this.headBox.position = this.headPosition.getChildByName(headStr).position;
        } else {
            this.Effect.position = this.headPosition.getChildByName(headStr).position;
            this.headBox.position = this.headPosition.getChildByName(headStr).position;
        }

        //下注操作
        if (this.data.nUserId != info.nUserID) {
            let actionChild = this.action_other.children;
            for (let i = 0; i < actionChild.length; i++) {
                let child = actionChild[i];

                if (child.name.toString()) {
                    // let anchiorX = 0;
                    // let actionStr = "right";
                    // if (this.node.x > 0) {
                    //     anchiorX = 1;
                    //     actionStr = "left";
                    // }
                    // child.anchorX = anchiorX;
                    // child.position = this.actionPosition.getChildByName(actionStr).position; 

                    // if (child.name.toString()==-6+"" || child.name.toString()==-7+"" || child.name.toString()==-8+"") {
                    //     let label = child.getChildByName("label");
                    //     if (child.name.toString()==-8+"") {
                    //         child.y -= 70; 
                    //         // label.x = child.width * (0.5 - child.anchorX)
                    //     }else{
                    //         // label.anchorX = anchiorX;
                    //     }
                    // }

                    if (seat == 6) {
                        //console.log("seat = 6");
                    }
                    let actionStr = "left";
                    let child_label = child.getChildByName("label");
                    child.scaleX = 1;
                    child_label.scaleX = 1;
                    let posX = -60
                    if (seat == 1 || seat == 2 || seat == 3 || seat == 4 || seat == 5) {
                        posX = 50
                        actionStr = "right";
                        child.scaleX = -1;
                        child_label.scaleX = -1;
                    }
                    this.action_other.x = posX

                    child.position.x = this.actionPosition.getChildByName(actionStr).position.x;
                }
            }
        }

        //飘分
        // if (TexasUtils._getSkin(["b"])) {
        // if (this.data.nUserId!=info.nUserID) {
        //     let anchiorX = 0;
        //     let scoreStr = "right";
        //     if (seat==5 || seat==7 || seat==8 || seat==9) {
        //         anchiorX = 1;
        //         scoreStr = "left";
        //     }
        //     this.nScore.position = this.scorePosition.getChildByName(scoreStr).position; 

        // let label_fail = this.nScore.getChildByName("label_fail");
        // let label_win = this.nScore.getChildByName("label_win");
        // if (label_fail && label_win) {
        //     label_fail.getComponent(cc.Label).horizontalAlign = anchiorX==1?cc.Label.HorizontalAlign.RIGHT:cc.Label.HorizontalAlign.LEFT;
        //     label_win.getComponent(cc.Label).horizontalAlign = anchiorX==1?cc.Label.HorizontalAlign.RIGHT:cc.Label.HorizontalAlign.LEFT;
        // }

        // }else {
        //     let pos = TexasUtils._getNodePos(this.names.node,this.nScore);

        //     this.nScore.position = pos; 
        // }
        // }

        //下注区
        let iconChip = this.chipZone.getChildByName("iconChip");//icon
        let labels = this.chipZone.getChildByName("label");//文本
        let zoneStr = "right";
        let bankStr = "right";
        if (seat != 1 && this.data.nUserId != info.nUserID) {
            //iconChip.x = -55.34;
            // labels.x = -55.547;
            // labels.y = -32.264;
        }
        let maxSeat = TexasData._getMaxTableSeat()
        // labels.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;

        if ((
            (maxSeat == 4 || maxSeat == 6 || maxSeat == 8) && seat == 5) ||
            (maxSeat == 2 && seat == 3)
        ) {
            //单个顶部位置
            zoneStr = "bottom";
            bankStr = "bottomLeft"
        } else if ((maxSeat == 7 || maxSeat == 9) && seat == 5) {
            //2个顶部位置
            zoneStr = "bottomRight";
            bankStr = "bottomRight";
        } else if ((maxSeat == 7 || maxSeat == 9) && seat == 6) {
            //2个顶部位置
            zoneStr = "bottomLeft";
            bankStr = "bottomLeft";
        } else if (seat > 5) {
            zoneStr = "left";
            bankStr = "left";
        }

        if (seat == 1 && this.data.nUserId == info.nUserID) {
            zoneStr = "self";
            bankStr = "self";
        }

        if (seat == 1 && this.data.nUserId != info.nUserID) {
            zoneStr = "top";
            bankStr = "top";
        }
        this.chipZone.position = this.chipPosition.getChildByName(zoneStr).position;

        if (this.data.nUserId != info.nUserID) {
            this._cards = this.otherCards;
        } else {
            this._cards = this.selfCards;
        }

        this.bankIcon.position = this.bankPosition.getChildByName(bankStr).position;

        //牌型（别人:1  自己:2）
        let typeIndex = 1;
        let typeScale = 0.9
        if (this.data.nUserId == info.nUserID) {
            typeIndex = 2;
            typeScale = 1.2
        }
        // this.cardType.scale = typeScale
        this.cardType.position = this.cardTypePosition.getChildByName("type" + typeIndex).position;

        // //麦克风
        // let mikeStr = "top";
        // if (seat==1 || seat==5) {
        //     mikeStr = "left";
        // }
        // this.mike.position = this.mikePosition.getChildByName(mikeStr).position;

        // //打赏
        // let anchorId = TexasData._getLiveUserId();//获得主播id
        // cc.log("打赏 anchorId:",anchorId);
        // let giftStr = "right";
        // if (seat==8 || seat==9) {
        //     giftStr = "left";
        // }

        // if (this.data.nUserId==info.nUserID) {
        //     giftStr = "self";
        // }
        // this.gift.position = this.giftPosition.getChildByName(giftStr).position;
        // this.gift.active = this.data.nUserId==anchorId?true:false;

        //魔法表情
        let magicStr = "bottom";
        if (seat == 1 || seat == 5) {
            magicStr = "right";
            if (this.data.nUserId == info.nUserID) {
                magicStr = "self";
            }
        }
        this.magic.position = this.magicPosition.getChildByName(magicStr).position;

        if (!isUpdateSeat) {
            this.chipZone.active = false;
            this.cardType.active = false;

            // this.cardSize = 1;
            this._setCard();
        } else {
            if (this._cards.zIndex != 13) {
                this._setCardSize();
            }
        }

    },

    /*************************************手牌***************************************************/

    //牌
    _setCard() {
        this._setCardSize();

        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");

        card_1.stopAllActions();
        card_2.stopAllActions();

        if (this.data.nUserId == UserInfo.getInfo().nUserID) {
            card_1.scale = 0.9;
            card_2.scale = 0.9;
        } else {
            card_1.scale = TexasUtils._getSkin(["d"]) ? 0.35 : 0.32;
            card_2.scale = TexasUtils._getSkin(["d"]) ? 0.35 : 0.32;


            this.setOtherCardsBack(false, false)
        }

        card_1.active = false;
        card_2.active = false;
        this._setCardLight();
        this._setCardGrey();

        // this._setCardSprite(0,0);

        this._cards.active = true;
    },

    //设置手牌尺寸
    _setCardSize() {
        let seat = this.seat;

        let info = UserInfo.getInfo();

        if (this.data.nUserId != info.nUserID && this._cards.zIndex != 13) {
            // let cardStr = "left";
            // if (seat==6) {
            let cardStr = "right";
            // }
            this._cards.position = this.cardPosition.getChildByName(cardStr).position;
            this._setCardsSize(1);
        }

    },

    getCardNode(index) {
        if (this.data.nUserId == UserInfo.getInfo().nUserID) {
            return this._cards.getChildByName("card_" + index);
        }
        return this._cards.getChildByName("card_1");
    },

    //刷新魔法表情位置
    _updateMagicFace(newSeat) {
        let seat = this.seat;

        let control = this.control;

        if (control) {
            control.TexasMagicFaceController._updateMagicFacePanel(this.data.nUserId, seat, newSeat);
        }
    },


    //直接复制
    _showLightTypePoker(array, type) {
        let returnIndex = [[], []];                    // [手牌下标, 公牌下标]
        let selfCard = TexasData._getSelfCard();        // 手牌
        if (!selfCard || !selfCard.card || selfCard.card.length <= 0) {
            return returnIndex;
        }
        let handCards = [selfCard.card[0], selfCard.card[1]];
        let publicCards = TexasData._getCommonData(); // 公牌
        if (!publicCards) {
            return returnIndex;
        }

        console.log(`手牌 : `, handCards);
        console.log(`公牌 : `, publicCards);
        // 牌值工具函数
        const getVal = (card) => {
            let val = card % 16;
            return val === 1 ? 14 : val; // A 当作最大牌
        };

        // 构建所有牌的下标映射
        let allCards = handCards.concat(publicCards);
        let countMap = {};
        allCards.forEach((c, idx) => {
            let val = getVal(c);
            if (!countMap[val]) countMap[val] = [];
            countMap[val].push(idx);
        });

        let selectedIndices = [];

        switch (type) {
            case 1: // 高牌
                // 高牌最大规则：如果有 A(1)，A 当作最大牌
                // 1️⃣ 找到最优牌中最大的牌值
                let values = array.map(getVal);
                let maxVal = Math.max(...values);

                // 2️⃣ 遍历最优牌，将最大牌拆分到手牌/公牌下标
                array.forEach((c, idx) => {
                    if (getVal(c) === maxVal) {
                        if (handCards.includes(c)) {
                            returnIndex[0].push(handCards.indexOf(c));
                        } else if (publicCards.includes(c)) {
                            returnIndex[1].push(publicCards.indexOf(c));
                        }
                    }
                });
                break;

            case 2: // 对子
                for (let val in countMap) {
                    if (countMap[val].length === 2) {
                        selectedIndices = countMap[val];
                        break;
                    }
                }
                break;

            case 3: // 两对
                let pairs = Object.keys(countMap)
                    .filter(v => countMap[v].length === 2)
                    .map(v => Number(v))
                    .sort((a, b) => b - a);
                pairs.slice(0, 2).forEach(v => selectedIndices.push(...countMap[v]));
                break;

            case 4: // 三条
                for (let val in countMap) {
                    if (countMap[val].length === 3) {
                        selectedIndices = countMap[val];
                        break;
                    }
                }
                break;

            default:
                break;
        }

        // 拆分手牌和公牌下标
        selectedIndices.forEach(idx => {
            if (idx < 2) returnIndex[0].push(idx);      // 手牌下标
            else returnIndex[1].push(idx - 2);          // 公牌下标
        });

        console.log(`returnIndex : `, returnIndex);
        return returnIndex;
    },


    //发光选中手牌
    _lightHandCard(arry, handCard) {
        let card_1 = this._cards.getChildByName("card_1");
        let grey1 = card_1.getChildByName("grey");
        grey1.active = true
        let card_2 = this._cards.getChildByName("card_2");
        let grey2 = card_2.getChildByName("grey");
        grey2.active = true

        for (let i = 0; i < arry.length; i++) {//公共牌
            let arryItem = arry[i];

            let x16 = 0x10;
            let x10 = x16.toString(10);//16进制转10进制

            let point = arryItem % x10;//点数
            let flower = parseInt(arryItem / x10);//花色

            //手牌亮牌
            if (!handCard) {
                handCard = Utils.clone(this._nCard);
            }

            for (let j = 0; j < handCard.length; j++) {
                let handCardItem = handCard[j];

                if (arryItem == handCardItem) {
                    this._setCardLight(j + 1, true);

                    break;
                }

            }
        }
        if (this.data.nCardType < 5) {
            let headCardsLightList = this._showLightTypePoker(arry, this.data.nCardType)
            let list = headCardsLightList[0]
            for (let i = 0; i < 2; i++) {
                this._setCardLight(i + 1, false)
            }
            for (let idx = 0; idx < list.length; idx++) {
                const hIdx = list[idx];
                this._setCardLight(hIdx + 1, true)
            }

        }

    },


    //设置牌光效
    _setCardLight(index, isShow) {
        let card_1 = this._cards.getChildByName("card_1");
        let light1 = card_1.getChildByName("light");
        let card_2 = this._cards.getChildByName("card_2");
        let light2 = card_2.getChildByName("light");

        if (!isShow) {
            light1.active = false;
            light2.active = false;
            return
        }

        var card = null
        if (index == 1) {
            light1.active = true;
            card_1.color = new cc.Color(255, 255, 255);
            card = card_1
        } else if (index == 2) {
            light2.active = true;
            card_2.color = new cc.Color(255, 255, 255);
            card = card_2
        }

        if (isShow && card) {
            card.getChildByName("grey").active = false
        }
    },

    //设置牌置灰
    _setCardGrey(index) {
        cc.log("_setCardGrey index=", index)
        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");

        if (index == 1) {
            card_1.color = new cc.Color(100, 100, 100);
            card_1.getChildByName("grey").active = true
        } else if (index == 2) {
            card_2.color = new cc.Color(100, 100, 100);
            card_2.getChildByName("grey").active = true
        } else {
            card_1.color = new cc.Color(255, 255, 255);
            card_2.color = new cc.Color(255, 255, 255);
            card_1.getChildByName("grey").active = false
            card_2.getChildByName("grey").active = false
        }
    },

    //其他人发牌结束的动画
    _otherPlayerCardsAni() {
        let info = UserInfo.getInfo();
        if (info.nUserID != this.data.nUserId) {
            let card_1 = this._cards.getChildByName("card_1");
            let card_2 = this._cards.getChildByName("card_2");
            card_1.angle = 0
            card_1.angle = 0
            card_1.x = 55
            card_2.x = 55
            this.setOtherCardsBack(true, true)
            cc.tween(card_1).to(0.2, { angle: 5, x: 45 }, { easing: "cubicOut" }).start();
            cc.tween(card_2).to(0.2, { angle: -5, x: 65 }, { easing: "cubicOut" }).start();
        }


    },



    //其他人发牌结束的动画新加一个牌背动画
    setOtherCardsBack(isShow, isAni) {
        let card_1 = this.otherCards.getChildByName("card_1");
        let card_2 = this.otherCards.getChildByName("card_2");
        let card1_back = this.otherCards.getChildByName("card1_back");
        let card2_back = this.otherCards.getChildByName("card2_back");
        card1_back.x = card_1.x
        card1_back.y = card_1.y
        card2_back.x = card_2.x
        card2_back.y = card_2.y
        card1_back.opacity = (isShow && card_1.active) ? 255 : card1_back.opacity
        card2_back.opacity = (isShow && card_2.active) ? 255 : card2_back.opacity
        card1_back.active = isShow && card_1.active
        card2_back.active = isShow && card_2.active
        if (isAni) {
            card1_back.opacity = 255
            card2_back.opacity = 255
            cc.tween(card1_back).to(0.2, { angle: 5, x: 45 }, { easing: "cubicOut" }).start();
            cc.tween(card2_back).to(0.2, { angle: -5, x: 65 }, { easing: "cubicOut" }).start();
        }
    },


    _setCardSprite(card1, card2, isAni = false) {
        if (this._nCard && this._nCard[0] > 0 && this._nCard[1] > 0) {
            //已经显示手牌了
            return;
        }
        if (!this._cards) return;

        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");
        card_1.stopAllActions();
        card_2.stopAllActions();

        if (Number(card1) >= 0) {
            this._nCard[0] = card1;
            TexasUtils._getCardType(card_1, card1);
            card_1.active = true;
        }

        if (Number(card2) >= 0) {
            this._nCard[1] = card2;
            TexasUtils._getCardType(card_2, card2);
            card_2.active = true;
        }

    },

    //展示手牌
    _showCard(cardArry, cardType, isWin, callback, isLiang, isLink) {

        if (!cardArry || cardArry.length <= 0) return;

        let card1 = cardArry[0];
        let card2 = cardArry[1];

        this._nCard = Utils.clone(cardArry);

        let self = this;

        let info = UserInfo.getInfo();

        this._cards.zIndex = 13;

        let card_1 = self._cards.getChildByName("card_1");
        let card_2 = self._cards.getChildByName("card_2");

        card_1.stopAllActions();
        card_2.stopAllActions();

        card_1.active = true;
        card_2.active = true;
        console.log("手牌展示1111111111111");

        this._cards.active = true;

        let setPokerFun = cc.callFunc(function () {
            if (Number(card1) >= 0 && Number(card2) >= 0) {
                TexasUtils._getCardType(card_1, card1);
                TexasUtils._getCardType(card_2, card2);
            }
        }, this)

        let setPokerCallBack = cc.callFunc(function () {
            self.updateCardType(cardType);

            if (callback) {
                callback();
            }

            if (isWin) {
                self._setWin(cardType);
            }
        }, this)

        if (info.nUserID == this.data.nUserId) {
            if (isLink) {
                card_1.scale = 0.9;
                card_2.scale = 0.9;

                if (Number(card1) >= 0 && Number(card2) >= 0) {
                    TexasUtils._getCardType(card_1, card1);
                    TexasUtils._getCardType(card_2, card2);
                }
                self.updateCardType(cardType);

                if (callback) {
                    callback();
                }

                if (isWin) {
                    self._setWin(cardType);
                }
            } else {
                if (isLiang) {
                    let nScale = 0.9;

                    //翻牌动画
                    TexasUtils._getCardType(card_1, 0);
                    TexasUtils._getCardType(card_2, 0);
                    card_1.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, nScale, nScale), cc.delayTime(0.3)));
                    card_2.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, nScale, nScale), cc.delayTime(0.3), setPokerCallBack));
                } else {
                    self.updateCardType(cardType);

                    if (callback) {
                        callback();
                    }

                    if (isWin) {
                        self._setWin(cardType);
                    }
                }
            }
        } else {
            // let cardStr = "left";
            // if (this.seat==6) {
            let cardStr = "right";
            // }
            self._cards.position = self.cardPosition.getChildByName(cardStr).position;

            // let movePosX1 = 48.222;
            // let movePosY1 = 10;
            // let movePosX2 = 91.243;
            // let movePosY2 = 10;
            // if (this.seat==6) {
            let movePosX1 = -30;
            let movePosY1 = 10;
            let movePosX2 = 30;
            let movePosY2 = 10;
            // } 

            card_1.x = movePosX1;
            card_1.y = movePosY1;
            card_2.x = movePosX2;
            card_2.y = movePosY2;

            let nScale = TexasUtils._getSkin(["d"]) ? 0.35 : 0.256;

            if (isLink) {
                card_1.scale = 0.7;
                card_2.scale = 0.7;
                if (Number(card1) >= 0 && Number(card2) >= 0) {
                    TexasUtils._getCardType(card_1, card1);
                    TexasUtils._getCardType(card_2, card2);
                }
                self.updateCardType(cardType);

                if (callback) {
                    callback();
                }

                if (isWin) {
                    self._setWin(cardType);
                }
            } else {
                this.setOtherCardsBack(false, false)
                card_1.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, 0.7, 0.7), cc.delayTime(0.3)));
                card_2.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, 0.7, 0.7), cc.delayTime(0.3), setPokerCallBack));
            }

        }

        //清除所有action 

        if (this.action) {
            for (let i = 0; i < this.action.children.length; i++) {
                this.action.children[i].active = false;
            }
        }

    },

    //赢
    _setWin(cardType) {
        this._updateAction(-1);

        this._initEffect(1);//光效

        let nGame = TexasData._getGame();
        if (nGame == 3 && !TexasData.isMTTMatch()) {//短牌 同花>葫芦
            if (Number(cardType) == 6 || Number(cardType) == 7) {
                cardType = Number(cardType) == 6 ? 7 : 6;
            }
        }
        this.nWin.active = true;
        let anim = this.nWin.getComponent(cc.Animation)
        if (anim) anim.play()

        // //特殊牌型不显示胜利，只显示输赢分、光圈、牌型
        // let type = 0;
        // let num = nGame==3?8:7;
        // if (cardType && Number(cardType)>=num) {
        //     type = cardType;  
        // }

        // this._showCardType(type);
    },

    //显示牌型特效
    _showCardType(type) {

        let num = TexasData._getGame() == 3 ? 8 : 7;

        if (Number(type) >= num && Number(type) <= 10) {
            let sex = "man_";
            if (this.data && this.data.nSex == 1) {
                sex = "woman_";
            }

            let cardType = "";
            if (Number(type) == 7) {
                cardType = "hulu";
            } else if (Number(type) == 8) {
                cardType = "jingang";
            } else if (Number(type) == 9) {
                cardType = "tonghua";
            } else if (Number(type) == 10) {
                cardType = "huangjia";
            }

            // if (cardType!="") {
            //     TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + sex + cardType,true);//音效
            // }
        }

        this._showWinSprite(type);

        // let imgCard = type + "";
        // let frame = this.atlasCardType.getSpriteFrame(imgCard);
        // if(null!=frame){
        //     this.nWin.getComponent(cc.Sprite).spriteFrame = frame;
        //     this.nWin.getComponent(cc.Animation).stop('winScoreAnim');
        //     this.nWin.getComponent(cc.Animation).setCurrentTime(0);
        //     this.nWin.getComponent(cc.Animation).play("winScoreAnim");
        //     this.nWin.active = true;
        // }else {
        //     QYLogs.error("_showCardType", "获取图片失败", imgCard);
        // }
    },

    _showWinSprite(type) {
        // let imgCard = type + "";
        // let frame = this.atlasCardType.getSpriteFrame(imgCard);
        // if(null!=frame){
        //     this.nWin.getComponent(cc.Sprite).spriteFrame = frame;
        //     this.nWin.getComponent(cc.Animation).stop('winScoreAnim');
        //     this.nWin.getComponent(cc.Animation).setCurrentTime(0);
        //     this.nWin.getComponent(cc.Animation).play("winScoreAnim");
        //     this.nWin.active = true;
        // }else {
        //     QYLogs.error("_showCardType", "获取图片失败", imgCard);
        // }
    },

    //显示分数
    _showScore(score) {

        let info = UserInfo.getInfo();

        score = Number(score);

        this._updateAction(-1);

        let failScore = this.nScore.getChildByName("lose");
        failScore.active = false;
        let winScore = this.nScore.getChildByName("win");
        winScore.active = false;

        // let nLabel = this.nScore.getChildByName("label").getComponent(cc.Label);
        let nScore = TexasUtils._saveTwoPoint(score);

        console.log(`显示分数 ***** score ：` + score);
        if (score >= 0) {
            let nLabel = winScore.getChildByName("label_win").getComponent(cc.Label);
            nLabel.string = "+" + nScore;
            winScore.active = true;
        } else {
            let nLabel = failScore.getChildByName("label_fail").getComponent(cc.Label);
            nLabel.string = nScore;
            failScore.active = true;
        }

        // nLabel.node.y = -60;
        // nLabel.node.opacity = 255;
        // let scoreIndex = score<0?0:1; 
        // if (this.data.nUserId==info.nUserID) {
        //     scoreIndex = score<0?2:3; 
        // }

        // this.nScore.getComponent(cc.Sprite).spriteFrame = score<0?this.winSpriteFrame[scoreIndex]:this.winSpriteFrame[scoreIndex];

        // this.scheduleOnce(function() {
        //     let gameState = TexasData._getGameState();//游戏阶段

        //     if (gameState!=2) return;

        this.nScore.active = true;

        //     nLabel.node.stopAllActions();

        //     // var scoreActionMove = cc.moveTo(0.5, -2, 38);
        //     // if (TexasUtils._getSkin(["b"])) {
        //        let scoreActionMove = cc.moveTo(0.5, -2, 0);
        //     // }

        //     nLabel.node.runAction(cc.sequence(scoreActionMove,cc.callFunc(function (args) {
        //         // if (TexasUtils._getSkin(["b"])) {
        //             nLabel.node.opacity = 255;
        //         // }
        //     })));
        // },0.5);
    },

    //更新牌型
    updateCardType(type) {

        let nGame = TexasData._getGame();
        if (nGame == 3 && !TexasData.isMTTMatch()) {//短牌 同花>葫芦
            if (Number(type) == 6 || Number(type) == 7) {
                type = Number(type) == 6 ? 7 : 6;
            }
        }

        console.log("更新牌型：" + type);
        this.data.nCardType = type
        this.cardType.active = false;
        if (type && Number(type) > 0) {
            // let types = this.cardType.getChildByName("type");
            // TexasUtils._getSpriteFrame(this.atlasCardTypes,types,type+"");

            let label = this.cardType.getChildByName("label").getComponent(cc.Label);
            label.lang = "cardType." + type;

            this.cardType.active = true;
        }
    },

    //修改玩家信息
    changePlayerInfo(data) {
        let info = UserInfo.getInfo();
        // let isSelf = this.data.nUserId === info.nUserID;
        // if (isSelf && !this._isPlaying) {
        //     this.nameBg.active = false;           // 未开局先隐藏
        // } else if (isSelf && this._isPlaying) {
        //     this.nameBg.active = true;            // 已开局时显示
        // }

        if (data.sShopAcc) {
            this._sShopAcc = data.sShopAcc;//第三方用户ID
        }

        if (data.sFaceId) {
            let playBackData = TexasUtils._getClubReback();
            if (playBackData) {//回放牌桌
                if (this._isRecordHead) {

                } else {
                    this._isRecordHead = true;
                    this.scheduleOnce(() => {
                        Utils.changeUserHead(this.spriteHead, data.sFaceId);//玩家头像
                    }, 0)
                }
            } else {
                this.scheduleOnce(() => {
                    Utils.changeUserHead(this.spriteHead, data.sFaceId);//玩家头像
                }, 0)
            }
        }
        if (data.sName) {
            this.names.node.active = true;
            if (this.mikeC) {
                this.mikeC.active = false;
            }

            this._name = this.getShortText(Base64.decode(data.sName));
            this.names.string = this._name;//玩家名
            // TexasUtils._setColor(this.names.node);

            // if (this.data.nUserId==UserInfo.getInfo().nUserID) {
            //     this.names.node.active = false;
            // }
        }
        if (this._name) {
            this.names.node.active = true;
            this.names.string = this._name;
        }

        if (data.nBalance != undefined) {
            if (Number(data.nBalance) >= 0) {
                this._Gold = Number(data.nBalance);
                this.data.nBalance = Number(data.nBalance);

                if (this.data.nUserId == info.nUserID) {//自己金币有变化，刷新购买弹窗金币
                    TexasData._setUserGold(data.nBalance)
                    MsgManager.fire(MSG.NOTIFY.NOTIFY_UPDATE_BUY_GOLD);
                }

                this.gold.string = TexasUtils._saveTwoPoint(data.nBalance);
            }
        }

    },


    //全中文：前 5 个 + ".",全英文：前 7 个 + ".",混合：取前最大 7 个字节（中文=2，英文=1）
    getShortText(text) {
        if (!text) return '';

        const chars = text.split('');
        const isChinese = c => /[^\x00-\xff]/.test(c);
        const isAllChinese = chars.slice(0, 7).every(isChinese);
        const isAllEnglish = chars.slice(0, 7).every(c => !isChinese(c));

        // 全中文：前5个+“.”
        if (isAllChinese) {
            if (text.length > 5) {
                return text.slice(0, 5) + '.';
            }
            return text; // 不超过，原样返回
        }

        // 全英文：前7个+“.”
        if (isAllEnglish) {
            if (text.length > 7) {
                return text.slice(0, 7) + '.';
            }
            return text; // 不超过，原样返回
        }

        // 混合：按字节数取前最大7个字节
        let byteLen = 0;
        let result = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charBytes = isChinese(char) ? 2 : 1;

            if (byteLen + charBytes > 7) break; // 超过 7 字节就停止
            result += char;
            byteLen += charBytes;
        }
        return result.length < text.length ? result + '.' : text;
    },

    //设置麦克风界面
    setMikeImg(micStatus) {
        let status = app.storage.getItem("Texas_mike", "off");
        if (micStatus) {
            status = micStatus;
        }

        let voice = this.mike.getChildByName("voice");//音量
        let mikeUse = this.mike.getChildByName("mikeUse");//使用麦克风
        let mikeForbit = this.mike.getChildByName("mikeForbit");//禁用麦克风

        if (status == "on") {
            voice.active = true;
            voice.getComponent(cc.Sprite).fillRange = 0;
            mikeUse.active = true;
            mikeForbit.active = false;
        } else {
            voice.active = false;
            mikeUse.active = false;
            mikeForbit.active = true;
        }
    },

    _updateMic(volume) {
        //this.names.node.active = !volume;
        if (this.mikeC) {
            this.mikeC.active = volume;
        }


        // if (this.data.nUserId==UserInfo.getInfo().nUserID) {
        //     this.names.node.active = false;
        // }
    },

    //更新玩家麦克风音量
    _updateMicVolume(volume) {

        let info = UserInfo.getInfo();

        volume = Number(volume);
        let voice = this.mike.getChildByName("voice");//音量
        let voiceAnim = voice.getComponent(cc.Animation);
        let mikeUse = this.mike.getChildByName("mikeUse");//使用麦克风
        let mikeForbit = this.mike.getChildByName("mikeForbit");//禁用麦克风

        voiceAnim.stop('mikeAnim');
        voiceAnim.setCurrentTime(0);

        let anim = this.mikeAnim.getChildByName("anim").getComponent(cc.Animation);
        anim.stop('mikeAnim');
        anim.setCurrentTime(0);

        voice.getComponent(cc.Sprite).fillRange = 0;
        if (!volume || volume <= 0) {
            if (this.data.nUserId != info.nUserID) {
                voice.active = false;
                mikeUse.active = false;
                mikeForbit.active = false;
            }
            this.mikeAnim.active = false;
            this.mikeBorder.active = false;
        } else {
            this.setMicState();

            voice.active = true;
            voiceAnim.play("mikeAnim");

            mikeUse.active = true;
            mikeForbit.active = false;

            anim.play("mikeAnim");

            this.mikeAnim.active = true;
            this.mikeBorder.active = true;
        }
    },

    //更新上麦玩家麦克风状态
    _updateMicState(state) {

        state = state ? Number(state) : 0;

        this.setMicState(state);

        if (state == 1 || state == 2 || state == 3) {
            this._updateMicVolume();
        }
    },

    //设置麦状态
    setMicState(state) {
        if (!TexasUtils._getSkin(["default", "d"])) return;

        let mic = this.micState.children;
        if (mic && mic.length > 0) {
            for (let i = 0; i < mic.length; i++) {
                let child = mic[i];

                if (child.name.toString() != "block") {
                    child.active = false;
                }

                if (state && child.name.toString() == state + "") {
                    child.active = true;
                }

            }

        }

        this.micState.active = state ? true : false;
    },

    showZhuaTouAction() {
        this._updateAction(10)
    },

    //更新动作(-5:不保 -6:投保 -7:购买 -8:胜率 1:托管 2:大盲 3:小盲 4:弃牌 5:跟注 6:加注 7:allin 8:让牌 9:延时 10:抓头 11:下注)
    _updateAction(type, isLink, num) {

        let info = UserInfo.getInfo();

        let iconChip = this.chipZone.getChildByName("iconChip");//icon
        // if (type==2 || type==3) {
        //     iconChip.getComponent(cc.Sprite).spriteFrame = this.chipSpriteFrame[type-1];
        // }else if (type==5 || type==6 || type==7) {
        //     iconChip.getComponent(cc.Sprite).spriteFrame = this.chipSpriteFrame[0];
        // }
        this.insureTimeNode.active = false
        this.insureAmountNode.active = false
        if (type == 7) {
            iconChip.getComponent(cc.Sprite).spriteFrame = this.chipSpriteFrame[1];
        } else {
            iconChip.getComponent(cc.Sprite).spriteFrame = this.chipSpriteFrame[0];
        }

        if (!isLink && ((Number(type) >= 4 && Number(type) <= 8) || Number(type) == 11)) {//弃牌、让牌、加注、allin、下注 播放音效
            let sex = "man_";
            if (this.data && this.data.nSex == 1) {
                sex = "woman_";
            }

            let isChinese = true;

            let actionType = "call";
            if (Number(type) == 4) {
                actionType = "qipai";
            } else if (Number(type) == 6 || Number(type) == 11) {
                actionType = "add";
            } else if (Number(type) == 7) {
                isChinese = false;
                actionType = "allin";
            }

            let lang = "";
            if (app.config.LANG == "vi") {
                lang = "_yn";
            } else if (app.config.LANG == "en" || app.config.LANG == "th") {
                lang = "_yy";
            }

            if (TexasUtils._getSkin(["default"]) && (app.config.LANG == "zh" || app.config.LANG == "zh_tw")) {
                if (Number(type) == 7) {
                    TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + sex + actionType);//音效
                } else if (Number(type) == 8) {

                } else {
                    TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + sex + actionType + lang);//音效
                }
            } else {
                if (Number(type) == 4) {
                    TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "qipai");//弃牌音效
                } else if (Number(type) == 8) {
                    TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "guopai");//过牌音效
                }
            }

        }
        let actionChild = this.action.children;
        if (actionChild && actionChild.length > 0) {
            for (let i = 0; i < actionChild.length; i++) {
                let child = actionChild[i];

                let name = Number(child.name);

                if (!type) {
                    child.active = false;
                }

                if (type == -1) {
                    if (i + 1 != 1) {
                        child.active = false;
                    }
                }

                if (type == -2) {
                    if (i + 1 != 1 && i + 1 != 4 && i + 1 != 7 && name != -8) {
                        child.active = false;
                    }
                }

                if (type >= -7 && type <= -5) {
                    if (name != -8 && type != name) {
                        child.active = false;
                    }
                }

                if (type == name) {
                    child.active = true;

                    this.action.zIndex = 3;
                    if (type == -6) {//购买
                        this.insureTimeNode.active = true
                        this.insureTimeNode.getChildByName('label').getComponent(cc.Label).string = TexasUtils._getText(183);
                        // let time = num?num:0;
                        // this._setInsure(time);
                    } else if (type == -7) {//投保
                        this.insureAmountNode.active = true
                        let label = this.insureAmountNode.getChildByName('label');
                        num = num ? num : 0;
                        label.getComponent(cc.Label).string = TexasUtils._getText(184, num);
                    } else if (type == -8) {//胜率
                        let label = child.getChildByName("label");
                        num = num ? num : 0;
                        label.getComponent(cc.Label).string = num + "%";
                    }
                    else if (type == -5) {//不保
                        child.active = false;
                        this.insureAmountNode.active = true
                        let label = this.insureAmountNode.getChildByName('label');
                        label.getComponent(cc.Label).string = "未投保";
                    }
                }

                if (Number(type) == i + 1) {
                    child.active = true;

                    this.action.zIndex = 3;
                    // if (this.data.nUserId==info.nUserID) {
                    // this.action.zIndex = 1;
                    // }

                    if (type == 1) {//托管
                        this._isAuto = true;
                    } else if (type == 2 || type == 3) {//大小盲信息显示在牌上
                        this.action.zIndex = 10;
                        child.active = false;
                    } else if (type == 4) {//弃牌
                        this._setGrey(true);

                        if (this.data.nUserId != info.nUserID) {
                            this._setCardGrey();
                        } else {
                            this._setCardLight();
                        }

                        this._initEffect();
                    } else if (type == 6) {
                        this._initEffect(3);
                    } else if (type == 7) {
                        this._initEffect(2);
                    }

                }

            }
        }
    },

    //胜率
    _setWinRateBg(index) {
        // let winRateBg = this.action.getChildByName("-8");
        // winRateBg.getComponent(cc.Sprite).spriteFrame = this.slSpriteFrame[index];
    },

    //保险
    _setInsure(time) {
        cc.log('test 保险 time = ', time);
        this.insureTime = time;

        let insure = this.insureTimeNode
        if (time >= 0) {
            this._startUpdateInsure();

            let label = insure.getChildByName("label");
            label.getComponent(cc.Label).string = TexasUtils._getText(183, time);
            insure.active = true;
        } else {
            this.stopUpdateInsure();
            insure.active = false;
        }
    },

    //显示托管状态
    _showTuoGuan(visible) {
        this._isAuto = visible;

        this.action.getChildByName(1 + "").active = visible;
        // this.tuoguan.active = visible;
    },

    //更新下注值 (测试: 总奖池加注)
    _updateDownBet(bet, isLink, isPoolNull) {

        let self = this;

        if (bet && Number(bet) > 0) {
            self._downBetCount += bet;

            if (self.control && !isPoolNull) {
                self.control.TexasRewardPool._addPond(bet, true);
            }

            //更新当前轮下注数据
            if (self.control) {
                self.control.TexasRewardPool._updateTurnBetData(bet);
            }

            if (Number(self._downBetCount) >= 0) {
                if (isLink) {
                    self.chipLabel.string = TexasUtils._saveTwoPoint(self._downBetCount);//下注数目

                    self.chipZone.active = true;
                } else {
                    TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "xiazhuClub");//下注音效

                    let chipItem = cc.instantiate(self.itemChipPrefab);
                    chipItem.parent = self.headBox;
                    chipItem.active = true;

                    let iconChip = self.chipZone.getChildByName("iconChip");
                    let pos = TexasUtils._getNodePos(iconChip, chipItem);

                    chipItem.stopAllActions();

                    var actionMove = cc.moveTo(0.3, pos.x, pos.y).easing(cc.easeOut(5));

                    chipItem.runAction(cc.sequence(actionMove, cc.callFunc(function (args) {
                        if (cc.isValid(chipItem)) {
                            chipItem.destroy();
                        }

                        self.chipLabel.string = TexasUtils._saveTwoPoint(self._downBetCount);//下注数目

                        //玩家金币
                        self._Gold -= Number(bet);
                        if (self._Gold <= 0) {
                            self._Gold = 0;
                        }

                        let nData = {
                            nBalance: self._Gold,
                        }

                        self.changePlayerInfo(nData);

                        self.chipZone.active = true;
                    })));

                }
            }

        }
    },

    //飞筹码特效
    playChipEffect(bet, isLink, callback) {

        TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "flyingChips");//飞筹码音效

        let self = this;

        let control = self.control;

        if (isLink) {
            self.chipList.destroyAllChildren();
        }

        let data = TexasUtils._changeChipByConfig(bet);//筹码数组

        //金币数目
        let count = data.length;
        for (let i = 0; i < count; i++) {
            let chipItem = data[i];

            let chip = null;
            //当前对象池中的可用对象数量
            if (control.chipPool.size() > 0) {
                //从对象池中获取对象
                chip = control.chipPool.get();
            } else {
                //若没有空闲的对象，也就是对象不够用时，就克隆节点
                chip = cc.instantiate(self.itemChipPrefab);
            }

            chip.parent = isLink ? self.chipList : self.node;
            chip.x = 0;
            chip.y = 0;
            // let texasChip = chip.getComponent("texasChip");
            // texasChip._initChip(chipItem);
            chip.active = true;

            control._chipArry.push(chip);

            if (!isLink) {
                let pos = TexasUtils._getNodePos(self.chipList, chip);

                chip.stopAllActions();

                chip.runAction(cc.sequence(
                    cc.delayTime(0.02 * i),
                    cc.moveTo(0.1, pos.x, pos.y).easing(cc.easeExponentialOut()),
                    cc.callFunc(function (params) {
                        //回收金币
                        control._onChipKilled(chip);
                        if (i === count - 1) {
                            self.chipList.destroyAllChildren();

                            for (let j = 0; j < data.length; j++) {
                                let itemChip = cc.instantiate(self.itemChipPrefab);
                                itemChip.parent = self.chipList;
                                itemChip.x = 0;
                                itemChip.y = 0;
                                // let texasChips = itemChip.getComponent("texasChip");
                                // texasChips._initChip(data[j]);
                                itemChip.active = true;
                            }

                            self.chipZone.active = true;

                            if (callback) {
                                callback();
                            }
                        }
                    }, this)
                ))
            }

        }
    },

    //玩家
    onClickBtnHead() {

        let info = UserInfo.getInfo();

        let playBackData = TexasUtils._getClubReback();
        if (TexasUtils._getSkin(["c"]) && playBackData) {
            return;
        }

        if (this.control) {
            let control = this.control;
            let selfSitid = control.TexasPlayerController._getSitId("nUserId", info.nUserID);

            if (selfSitid) {
                TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "click");//下注音效
            }
        }

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            // if (info.nUserID==this.data.nUserId) {//自己
            //     // this._getUserInfo();

            //     this.onClickBtnSelfHead();
            //     return;
            // }

            let control = this.control;

            if (control) {
                let selfSitId = control.TexasPlayerController._getSitId("nUserId", this.data.nUserId);

                if (selfSitId) {
                    this.onClickBtnMagicFace();
                } else {
                    this._getUserInfo();
                }
            }
        }
    },

    _getUserInfo() {
        TexasUtils.toggleUserInfo(this._sShopAcc, Base64.decode(this.data.sName));
    },

    //踢人
    onClickBtnKick() {
        if (this.kickBtn) {
            this.kickBtn.active = false;
        }

        let data = {
            nPos: this.data.nSitId,
        }

        let nStr = "主播踢人请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州主播踢人请求:",data);
        if (TexasUtils._getClub()) {
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouKickUserReq_CMD, data);
            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouKickUserReq_CMD, data);
        } else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouKickUserReq_CMD, data);
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouKickUserReq_CMD, data);
        }
    },

    showHeadCutPokerTip(isShow) {
        let infoTipNode = this.headBox.getChildByName("infoTip");
        if (!infoTipNode) {
            return;
        }
        infoTipNode.getChildByName("label").getComponent(cc.Label).string = "切牌";
        infoTipNode.position = cc.v2(this.nameBg.position.x, this.nameBg.position.y - 15);
        infoTipNode.active = isShow;

    },


    //预操作，结束后亮牌
    onClickOverShowCardsBtn() {
        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");
        let eyeImg1 = card_1.getChildByName("eye");
        let eyeImg2 = card_2.getChildByName("eye");
        if (eyeImg1 && eyeImg2) {
            this._overShowCards = !eyeImg1.active;
        }
        eyeImg1.active = this._overShowCards;
        eyeImg2.active = this._overShowCards;
        let nData = {
            nOpId: -23,
            isOn: this._overShowCards,
        }

        let nStr = "预操作结束后亮牌";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouPreOpReq_CMD, nData);
    },

    //打赏
    onClickBtnReward() {
        TexasUtils.toggleReward(this._sShopAcc, Base64.decode(this.data.sName));
    },

    //麦克风
    onClickBtnMike() {
        if (this.data.nUserId != UserInfo.getInfo().nUserID) return;

        // TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "click");//点击音效

        let voice = this.mike.getChildByName("voice");//音量
        let mikeUse = this.mike.getChildByName("mikeUse");//使用麦克风
        let mikeForbit = this.mike.getChildByName("mikeForbit");//禁用麦克风

        if (mikeUse.active) {
            voice.active = false;
            mikeUse.active = false;
            mikeForbit.active = true;
            TexasUtils.micSwitch(false, this._sShopAcc);
        } else {
            voice.active = true;
            voice.getComponent(cc.Sprite).fillRange = 0;
            mikeUse.active = true;
            mikeForbit.active = false;
            TexasUtils.micSwitch(true, this._sShopAcc);
        }
    },

    //自己的动作表情
    onClickBtnSelfHead() {


    },

    //魔法表情
    onClickBtnMagicFace() {
        if (TexasUtils._getSkin(["c"])) {
            let data = {
                nPos: this.data.nSitId,
            }

            let nStr = "头像信息请求";
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.HeadInfoReq_CMD, data);
        } else if (TexasUtils._getSkin(["default"])) {
            let control = this.control;

            if (control) {
                control.TexasMagicFaceController._showMagicFacePanel(this.data.nUserId, this.seat);
            }
        }

        // cc.warn("-----------------------------------------------------------------------------------------德州头像信息请求:",data);
        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.HeadInfoReq_CMD, data);

        // let control = this.control;

        // if (control) {
        //     control.TexasMagicFaceController._showMagicFacePanel(this.data.nUserId,this.seat);
        // }
    },

    /*************************************定时器***************************************************/
    //设置闹钟(10s)
    _setAlarmSchedule(time, defaults) {
        let self = this;

        let timeStamp = new Date().getTime();
        if (!this._timeStamp || time == this.maxTime) {
            this._timeStamp = timeStamp;
        }

        if (defaults) {
            this._setStopDaoJiShi();

            this.playDJS = null;
        }

        let timeLight = self.alarmClock.getChildByName("timeLight");

        //显示倒计时label
        let label_time = self.alarmClock.getChildByName("label_time");
        if (!label_time) {
            let node = new cc.Node();
            let label = node.addComponent(cc.Label);
            label.fontSize = 60;
            label.enableBold = true;
            label.verticalAlign = 1;
            label.horizontalAlign = 1;
            self.alarmClock.addChild(node, 0, "label_time");
            label_time = label;
        } else {
            label_time = label_time.getComponent(cc.Label);
        }


        let reduceRotation = 90 / 0.25;

        // self.alarmClock.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[0];
        // timeLight.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[2];
        // if (time<=3) {
        //     self.alarmClock.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[1];
        //     timeLight.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[3];
        // }

        if (this.control) {
            let control = this.control;

            control.TexasOperatePanel._setAlarmSchedule(time, this.maxTime);
        }

        if (time < 0) {
            self.stopUpdate();

            this._setStopDaoJiShi();

            self.timeBlock.active = false;

            self.alarmClock.active = false;

            return;
        }

        if (time >= 0) {
            self.times = time;
            label_time.string = Math.ceil(time);

            if (!this.playDJS && self.times <= 8 && this.data.nUserId == UserInfo.getInfo().nUserID) {
                let audio = TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "daojishi8");
                this.playDJS = audio.id;
            }

            let spriteRanges = time / this.maxTime;

            self.alarmClock.getComponent(cc.Sprite).fillRange = spriteRanges;

            timeLight.angle = spriteRanges * reduceRotation;

            // TexasUtils._refreshParticle(self.alarmClock,timeLight,spriteRanges);

            // self.timeBlock.zIndex = 30;

            // self.timeBlock.active = true;

            // self.alarmClock.zIndex = 30;
            self.alarmClock.active = this.data.nUserId != UserInfo.getInfo().nUserID ? true : false;
            // self.timeBlock.active = this.data.nUserId!=UserInfo.getInfo().nUserID?true:false;;
            let playBackData = TexasUtils._getClubReback();
            if (playBackData) {
                self.alarmClock.active = true;
            }
            self._startUpdate();
        }
    },

    //设置头像
    _setHead(visible) {
        if (this.data.nUserId != UserInfo.getInfo().nUserID) return;

        this.Effect.active = visible;
        // this.spriteHead.node.active = visible;
    },

    //延时操作时间
    _delayedOperate(time, nTime) {
        this.maxTime += time;

        if (nTime) {
            this.stopUpdate();
            this._setAlarmSchedule(nTime, "default");
        } else {
            this.times += time;
            this._setStopDaoJiShi();
            this.playDJS = null;
        }

        // this.names.string = TexasUtils._getText(150);//延时
        // TexasUtils._setColor(this.names.node,"#ffad0f");
        this._updateAction(9);

        // if (this.data.nUserId==UserInfo.getInfo().nUserID) {
        //     this.names.node.active = false;
        // }
    },

    //扑克
    _pokers() {
        let cards = Utils.clone(this._nCard);
        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");
        TexasUtils._getCardType(card_1, cards[0]);
        TexasUtils._getCardType(card_2, cards[1]);
    },

    //设置倒计时
    _setStopDaoJiShi() {
        if (this.playDJS) {
            app.texas.audio.stopEffect(this.playDJS);
        }
    },

    //开始更新时间
    _startUpdate() {
        this.stopUpdate();

        cc.director.getScheduler().schedule(this._updateAlarm, this, 1 / 60, false);
    },

    //暂停更新时间
    stopUpdate() {
        if (cc.director.getScheduler().isScheduled(this._updateAlarm, this)) {
            cc.director.getScheduler().unschedule(this._updateAlarm, this);
        }
    },

    //开始更新留座时间
    _startOccupyUpdate() {
        this._stopOccupyUpdate();

        cc.director.getScheduler().schedule(this._updateOccupyTime, this, 1, false);
    },

    //暂停更新留座时间
    _stopOccupyUpdate() {
        if (cc.director.getScheduler().isScheduled(this._updateOccupyTime, this)) {
            cc.director.getScheduler().unschedule(this._updateOccupyTime, this);
        }
    },

    //开始更新保险时间
    _startUpdateInsure() {
        this.stopUpdateInsure();

        cc.director.getScheduler().schedule(this._updateInsure, this, 1, false);
    },

    //暂停更新保险时间
    stopUpdateInsure() {
        if (cc.director.getScheduler().isScheduled(this._updateInsure, this)) {
            cc.director.getScheduler().unschedule(this._updateInsure, this);
        }
    },

    //显示头像语音播放动画
    showChatVoiceAnim(value) {
        this.chatVoiceNode.active = value
        if (value){
            let anim = this.chatVoiceNode.getComponent(cc.Animation)
            if (anim) anim.play()
        }

    },

    _updateOccupyTime() {
        this.OccupyTimes -= 1;
        this._setOccupied(this.OccupyTimes);
    },

    _updateAlarm() {
        // this.times -= 0.1;
        let timeStamp = new Date().getTime();
        if (!this._timeStamp) {
            this.times -= 0.1;
        } else {
            this.times -= (timeStamp - this._timeStamp) / 1000;
        }
        this._timeStamp = timeStamp;

        this._setAlarmSchedule(this.times);
    },

    _updateInsure() {
        this.insureTime -= 1;
        this._setInsure(this.insureTime);
    },

    setCountdownClockPosition(type, data, seat) {
        this.countdownType = type;
        let sTime = data.nRemain
        let initSeconds = TexasData._getInitCountdown();
        //暂停之前的倒计时
        if (type == 'paijiu') {
            if (!initSeconds || initSeconds == 0) {
                initSeconds = data.resRemain;
                TexasData._setInitCountdown(initSeconds);
            }
            sTime = Math.round(data.nRemain - initSeconds);
            this.countdownTimesMax = Math.ceil(sTime / data.nSeconds) * data.nSeconds;
            this.stopUpdate();
        } else {
            this.countdownTimesMax = data.nRemain;
            this.stopClockUpdate();
        }
        cc.log('test --== 延时 开始 --=== ', type, sTime, initSeconds, ' data::', data)
        if (this.countdownClock) {
            let maxSeat = TexasData._getMaxTableSeat()
            let info = UserInfo.getInfo();
            let bankStr = 'right';
            if ((
                (maxSeat == 4 || maxSeat == 6 || maxSeat == 8) && seat == 5) ||
                (maxSeat == 2 && seat == 3)
            ) {
                //单个顶部位置
                bankStr = "bottomLeft"
            } else if ((maxSeat == 7 || maxSeat == 9) && seat == 5) {
                //2个顶部位置
                bankStr = "bottomRight";
            } else if ((maxSeat == 7 || maxSeat == 9) && seat == 6) {
                //2个顶部位置
                bankStr = "bottomLeft";
            } else if (seat > 5) {
                bankStr = "left";
            }

            if (seat == 1 && this.data.nUserId == info.nUserID) {
                bankStr = "self";
            }

            if (seat == 1 && this.data.nUserId != info.nUserID) {
                bankStr = "top";
            }
            // let pos = this.countdownClock.getChildByName('posLeft').position;
            // if (seat == 1){
            //     pos = this.countdownClock.getChildByName('posTop').position;
            // }else if (seat <= 5){
            //     pos = this.countdownClock.getChildByName('posRight').position;
            // }
            let bankPos = this.bankPosition.getChildByName(bankStr);
            let pos = TexasUtils._getNodePos(bankPos, this.countdownClock.getChildByName("clock"))
            this.countdownClock.getChildByName("clock").setPosition(pos.x, pos.y + 6);
        }
        this._setClockSchedule(sTime);
    },

    /**
     * 新增：独立的时钟倒计时功能 (不影响 alarmClock)
     */
    // 设置自定义倒计时 (seconds)
    _setClockSchedule(time) {

        if (time < 1) {
            TexasData._setInitCountdown(0);
            this.stopClockUpdate();
            //继续之前的牌局倒计时
            if (this.countdownType == 'paijiu') {
                this._timeStamp = new Date().getTime();
                this._setAlarmSchedule(this.times);
            }
            if (this.control) {
                this.control.TexasOperatePanel._setClockUI(-1);
            }
            if (this.countdownClock) this.countdownClock.getChildByName("clock").active = false;
            this.countdownType = null;
            this.countdownTimesMax = 0;
            return;
        }

        if (time > 0) {
            this.countdownTimes = time;
            let s = Math.min(time / this.countdownTimesMax, 1);

            if (this.data.nUserId == UserInfo.getInfo().nUserID && this.control) {
                this.control.TexasOperatePanel._setClockUI(time, s)
            } else if (this.countdownClock) {
                //显示倒计时label
                let clock = this.countdownClock.getChildByName("clock");
                if (clock) {
                    clock.getChildByName("time").getComponent(cc.Label).string = time;
                    clock.getChildByName("filled").getComponent(cc.Sprite).fillRange = s;
                }
                clock.active = true;
            }

            // 若需要提示音或其他行为，可以在这里添加
            // if (this.countdownTimes <= 8 && this.data.nUserId == UserInfo.getInfo().nUserID) {
            //     // 示例：播放提示音（可配置）
            //     let audio = TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "daojishi8");
            //     this.playClock = audio.id;
            // }

            this._startClockUpdate();
        }
    },

    // 停止并清理自定义倒计时提示
    _setStopClock() {
        this.stopClockUpdate();
        this.stopUpdate();
        this.countdownType = null;
        this.countdownTimesMax = 0;
        if (this.control) {
            this.control.TexasOperatePanel._setClockUI(-1);
        }
        if (this.countdownClock) this.countdownClock.getChildByName("clock").active = false;
    },

    // 开始更新时间（自定义倒计时）
    _startClockUpdate() {
        this.stopClockUpdate();

        cc.director.getScheduler().schedule(this._updateClock, this, 1, false);
    },

    // 暂停更新时间（自定义倒计时）
    stopClockUpdate() {
        if (cc.director.getScheduler().isScheduled(this._updateClock, this)) {
            cc.director.getScheduler().unschedule(this._updateClock, this);
        }
    },

    // 自定义倒计时每帧更新函数
    _updateClock() {
        this.countdownTimes -= 1;

        // 复用 _setClockSchedule 来更新显示/停止逻辑
        this._setClockSchedule(this.countdownTimes);
    },

    _showHead(isShow) {
        this.spriteHead.node.parent.active = isShow;
    },

});
