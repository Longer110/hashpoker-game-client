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

        tuoguan: cc.Node,//托管

        mike: cc.Node,//麦克风
        mikePosition: cc.Node,//麦克风位置
        mikeAnim: cc.Node,//麦克风动画
        mikeBorder: cc.Node,//麦克风边框
        micState: cc.Node,//麦状态
        
        gift: cc.Node,//打赏
        giftPosition: cc.Node,//打赏位置

        magic: cc.Node,//魔法表情
        magicPosition: cc.Node,//魔法表情位置

        cardType_self: cc.Node,//自己牌型
        cardType_other: cc.Node,//别人牌型

        nameBg: cc.Node,//信息栏

        action_self: cc.Node,//自己动作
        action_other: cc.Node,//别人动作
        actionPosition: cc.Node,//其他人动作位置

        alarmClock: cc.Node,//倒计时

        nWin_self: cc.Node,//自己胜利
        nWin_other: cc.Node,//其他胜利

        winCardType: cc.Node,//胜利牌型

        nScore_self: cc.Node,//自己分数
        nScore_other: cc.Node,//别人分数

        kickBtn: cc.Node,//踢人按钮

        Effect: cc.Node,//特效

        spriteHead: cc.Sprite,
        magicBox: cc.Sprite,

        names: cc.Label,
        gold: cc.Label,

        nType:cc.Label,
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

        itemChipPrefab:{//筹码预制
            default:null,
            type:cc.Prefab,
        },

        itemChipAnimPrefab:{//筹码粒子预制
            default:null,
            type:cc.Prefab,
        },

        atlasCardTypes: cc.SpriteAtlas,
        atlasCardType: cc.SpriteAtlas,

        pokerBack: cc.SpriteFrame,//卡背

        _Gold: 0,//金币
        _downBetCount: 0,//当前下注值
        _sShopAcc: 0,//第三方用户ID
        _isAuto: false,//是否托管
        _isPlaying: false,//是否在玩
        _cards: null,//牌
        _name:"",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.magicBox && this.magicBoxSpriteFrame) {
            this.magicBox.spriteFrame = !App.isCCLive()?this.magicBoxSpriteFrame[0]:this.magicBoxSpriteFrame[1];
        }
    },

    start () {

    },

    // update (dt) {},

    //设置玩家信息(isMang 2:大盲 3:小盲)
    setPlayerInfo(control,seat,data,isMang,isNoAddPool) {
        cc.log("setPlayerInfo seat,data,isMang:",seat,data,isMang,isNoAddPool);

        this.control = control;
        this.seat = seat;
        this.data = data;

        this.maxTime = TexasData._getMaxOperateTime();

        //玩家服务端座位，用于测试
        this.sitid.string = data.nSitId;
        this.sitid.node.active = ConfigGame.ISDEVELOP;

        this._setMike(false);
        this._setGift(false);
        this.setMicState();

        let selfIsInTable = TexasData._getSelfIsInTable();
        this._setMagic(selfIsInTable);

        this._ResetPlayer();

        this.changePlayerInfo(data);

        if (isMang) {//设置大小盲
            this._updateAction(isMang);
        }

        let canAddBet = isNoAddPool?true:false;
        this._updateDownBet(data.nBet,true,canAddBet);

        if (data.isBanker) {//是否为庄
            this.control._flyBankIcon(data.nSitId,true);
        }

        if (data.arrHoleCards && data.arrHoleCards.length>0) {//手牌(值为0的牌，显示牌背,表示还没亮牌)
            let cardArry = data.arrHoleCards;

            this._setCardSprite(Number(cardArry[0]),Number(cardArry[1]));
        }

        //牌型
        let nCardType = data.nCardType;
        cc.log("updateCardType5");
        this.updateCardType(nCardType);

        //当前状态 0:等待操作权 1:思考中 2:跟注 3:过牌 4:加注 5:AllIn 6:弃牌 7:旁观 
        let nStatus = Number(data.nStatus);
        if (nStatus>=0 && nStatus<=5) {
            this._isPlaying = true;
        }

        let action = null;
        if (nStatus==1) {
            let nOpTimeRemain = data.nOpTimeRemain;//剩余可操作(思考)时间 (思考中时有效,其它情况时为0)

            this._setAlarmSchedule(nOpTimeRemain);
        }else if (nStatus==2) {
            action = 5;
        }else if (nStatus==3) {
            action = 8;
        }else if (nStatus==4) {
            action = 6;
        }else if (nStatus==5) {
            action = 7;
        }else if (nStatus==6) {
            let card_1 = this._cards.getChildByName("card_1");
            let card_2 = this._cards.getChildByName("card_2");

            if (this.data.nUserId!=UserInfo.getInfo().nUserID) {
                card_1.active = false;
                card_2.active = false;
            }

            action = 4;
        }else if (nStatus==7) {
            this._setGrey(true);
        }

        this._updateAction(action,true);

        if (data.isAuto) {
            this._showTuoGuan(true);
        }

        let isMatchTable = TexasUtils._isMatchTable();
        let isManager = TexasData.getIsMatchTableManager();
        if (this.data.nUserId!=UserInfo.getInfo().nUserID && isMatchTable && isManager){
            if (this.kickBtn) {
                this.kickBtn.active = true;
            }
        }else{
            if (this.kickBtn) {
                this.kickBtn.active = false;
            }
        }
        
    },

    //重置玩家
    _ResetPlayer(isUpdateSeat) {
        cc.log("_ResetPlayer isUpdateSeat:",isUpdateSeat);

        let info = UserInfo.getInfo();

        if (isUpdateSeat) {
            this._updateMagicFace(isUpdateSeat);

            this.data.seat = isUpdateSeat;
            this.seat = isUpdateSeat;
        }else {
            //牌型
            this.cardType_self.active = false;
            this.cardType_other.active = false; 
            if (info.nUserID==this.data.nUserId) {
                this.cardType = this.cardType_self;
            }else {
                this._setCardsSize(1);
                this.cardType = this.cardType_other;
            }

            this.otherCards.active = false;
            this.selfCards.active = false;

            //分数
            this.nScore_self.active = false;
            this.nScore_other.active = false;
            if (info.nUserID==this.data.nUserId) {
                this.nScore = this.nScore_self;
            }else {
                this.nScore = this.nScore_other;
            }
        }

        this.setPosition(this.seat,isUpdateSeat);//位置
        this._playChipAnim();//播放筹码粒子特效

        if (!isUpdateSeat) {
            this.stopUpdate();

            //动作
            this.action_self.active = false;
            this.action_other.active = false;
            if (info.nUserID==this.data.nUserId) {
                this.action = this.action_self;
                this.action_self.active = true;
            }else {
                this.action = this.action_other;
                this.action_other.active = true;
            }

            //胜利
            this.nWin_self.active = false;
            this.nWin_other.active = false;
            if (info.nUserID==this.data.nUserId) {
                this.nWin = this.nWin_self;
            }else {
                this.nWin = this.nWin_other;
            }

            this._cards.zIndex = 2;
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
            this.nWin.zIndex = 20;
            this.winCardType.zIndex = 20;
            this.winCardType.active = false;
            this.nScore.active = false;
            this.alarmClock.active = false;

            // if (this.kickBtn) {
            //     this.kickBtn.active = false;
            //     this.kickBtn.zIndex = 20;
            // }
    
            this._downBetCount = 0;
            this._isPlaying = false;

            // this.chipList.destroyAllChildren();
        }
    },

    _setCardsSize(type) {
        let card_1 = this.otherCards.getChildByName("card_1");
        let card_2 = this.otherCards.getChildByName("card_2");
        card_1.scale = TexasUtils._getSkin(["d"])?0.35:0.4;
        card_2.scale = TexasUtils._getSkin(["d"])?0.35:0.4;

        card_1.x = type==1?39:39.435;
        card_1.y = type==1?-2:10;

        card_2.x = type==1?48.931:100.616;
        card_2.y = type==1?-2:10;

        if (this.seat==8 || this.seat==9) {
            if (type==2) {
                card_1.x = -2.213;
                card_1.y = 10;
        
                card_2.x = 58.599;
                card_2.y = 10;
            }
        }
    },

    //播放筹码粒子动画
    _playChipAnim(isShow) {
        cc.log("_playChipAnim isShow:",isShow);
        let chipAnim = this.headBox.getChildByName("chipAnim");
        if (cc.isValid(chipAnim)) {
            chipAnim.destroy();
        }

        if (isShow) {
            let itemChip = cc.instantiate(this.itemChipAnimPrefab);
            itemChip.parent = this.headBox;
            itemChip.name = "chipAnim";
            itemChip.zIndex = 22;
            itemChip.active = true;
        }
    },

    //设置麦克风
    _setMike(visible) {
        let info = UserInfo.getInfo();

        let voice = this.mike.getChildByName("voice");//音量
        let mikeUse = this.mike.getChildByName("mikeUse");//使用麦克风
        let mikeForbit = this.mike.getChildByName("mikeForbit");//禁用麦克风

        if (info.nUserID==this.data.nUserId) {
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
        cc.log("设置魔法表情:",visible);

        // if (TexasUtils._getSkin(["default","b"])) {
        //     this.magic.active = this.data.nUserId==UserInfo.getInfo().nUserID?false:visible;
        // }else if (TexasUtils._getSkin(["b"])) {
        //     this.magic.active = false;
        // }

        if (TexasUtils._getSkin(["default","b","c","d"])) {
            this.magic.active = false;
        }
    },

    //特效
    _initEffect(type) {
        let allin = this.Effect.getChildByName("allin");
        let wins = this.Effect.getChildByName("wins");
        allin.active = false;
        wins.active = false;

        if (Number(type)==1) {
            wins.active = true;
        }else if (Number(type)==2) {
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
    _setGrey(isGrey,nPos) {
        cc.log("_setGrey isGrey:",isGrey);

        if (!nPos || nPos!=this.data.nSitId) {
            // this.spriteHead.node.color = isGrey?new cc.Color(100, 100, 100):new cc.Color(255, 255, 255);
            // this.nameBg.color = isGrey?new cc.Color(100, 100, 100):new cc.Color(255, 255, 255);
            // this.names.node.color = isGrey?new cc.Color(120,133,123):new cc.Color(255, 255, 255);
            // this.gold.node.color = isGrey?new cc.Color(120,133,123):new cc.Color(255, 255, 255);

            this.spriteHead.node.opacity = isGrey?102:255;
            this.nameBg.opacity = isGrey?102:255;
            this.names.opacity = isGrey?35:255;
            this.gold.opacity = isGrey?35:255;

            let actionChild = this.action.children;
            for (let i=0; i<actionChild.length; i++) {
                let child = actionChild[i];
    
                child.color = i!=3 && isGrey?new cc.Color(100, 100, 100):new cc.Color(255, 255, 255);
            }   
        }
        
        if (isGrey) {
            this._setCardGrey(1);
            this._setCardGrey(2);
        }else {
            this._setCardGrey();
        }

    },

    //设置位置
    setPosition(seat,isUpdateSeat) {
        cc.log("setPosition seat,isUpdateSeat:",seat,isUpdateSeat);

        let info = UserInfo.getInfo();

        //头像（1:自己，其他人）
        let headStr = "other";
        if (seat==1 && this.data.nUserId!=info.nUserID) {
            headStr = "self";
        }

        this.Effect.position = this.headPosition.getChildByName(headStr).position;
        this.headBox.position = this.headPosition.getChildByName(headStr).position;

        //下注操作
        if (this.data.nUserId!=info.nUserID) {
            let actionChild = this.action_other.children;
            for (let i=0; i<actionChild.length; i++) {
                let child = actionChild[i];

                if (child.name.toString()!=1+"") {
                    let anchiorX = 0;
                    let actionStr = "right";
                    if (seat==8 || seat==9) {
                        anchiorX = 1;
                        actionStr = "left";
                    }
                    child.anchorX = anchiorX;
                    child.position = this.actionPosition.getChildByName(actionStr).position; 
                }
            }    
        }

        //飘分
        // if (TexasUtils._getSkin(["b"])) {
            if (this.data.nUserId!=info.nUserID) {
                let anchiorX = 0;
                let scoreStr = "right";
                if (seat==8 || seat==9) {
                    anchiorX = 1;
                    scoreStr = "left";
                }
                this.nScore.position = this.scorePosition.getChildByName(scoreStr).position; 

                let label_fail = this.nScore.getChildByName("label_fail");
                let label_win = this.nScore.getChildByName("label_win");
                if (label_fail && label_win) {
                    label_fail.getComponent(cc.Label).horizontalAlign = anchiorX==1?cc.Label.HorizontalAlign.RIGHT:cc.Label.HorizontalAlign.LEFT;
                    label_win.getComponent(cc.Label).horizontalAlign = anchiorX==1?cc.Label.HorizontalAlign.RIGHT:cc.Label.HorizontalAlign.LEFT;
                }

            }
        // }
        
        //下注区
        let iconChip = this.chipZone.getChildByName("iconChip");//icon
        let labels = this.chipZone.getChildByName("label");//文本
        let zoneStr = "right";
        iconChip.x = -55.34;
        labels.x = 14;
        labels.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        if (seat==8 || seat==9) {
            zoneStr = "left";
            iconChip.x = 47.335;
            labels.x = -24;
            labels.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
        }

        if (seat==1 && this.data.nUserId==info.nUserID) {
            zoneStr = "self";
        }

        this.chipZone.position = this.chipPosition.getChildByName(zoneStr).position; 

        if (this.data.nUserId!=info.nUserID) {
            this._cards = this.otherCards;
        }else {
            this._cards = this.selfCards;
        }
        
        //庄家标识
        if (TexasUtils._getSkin(["default","b","c","d"])) {
            let bankStr = "right";
           if (seat==5 || seat==8 || seat==9 || seat==2 || seat==3) {
                bankStr = "bottom";
            }else if (seat==1) {
                bankStr = "top";
            }
            this.bankIcon.position = this.bankPosition.getChildByName(bankStr).position;
        }

        //牌型（别人:1  自己:2）
        if (this.data.nUserId!=info.nUserID) {
            let typeIndex = 2;
            if (seat==8 || seat==9) {
                typeIndex = 1;
            }

            this.cardType.position = this.cardTypePosition.getChildByName("type" + typeIndex).position;
        }

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
        if (seat==1 || seat==5) {
            magicStr = "right";
            if (this.data.nUserId==info.nUserID) {
                magicStr = "self";
            }
        }
        this.magic.position = this.magicPosition.getChildByName(magicStr).position;

        if (!isUpdateSeat) {
            this.chipZone.active = false;
            this.cardType.active = false;
            
            // this.cardSize = 1;
            this._setCard();
        }else {
            if (this._cards.zIndex!=13) {
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

        if (this.data.nUserId==UserInfo.getInfo().nUserID) {
            card_1.scale = TexasUtils._getSkin(["b"])?1.1:1;
            card_2.scale = TexasUtils._getSkin(["b"])?1.1:1;
        }else {
            card_1.scale = TexasUtils._getSkin(["d"])?0.35:0.4;
            card_2.scale = TexasUtils._getSkin(["d"])?0.35:0.4;
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

        if (this.data.nUserId!=info.nUserID && this._cards.zIndex!=13) {
            let cardStr = "left";
            if (seat==8 || seat==9) {
                cardStr = "right";
            }
            this._cards.position = this.cardPosition.getChildByName(cardStr).position;
        }

    },

    //刷新魔法表情位置
    _updateMagicFace(newSeat) {
        let seat = this.seat;

        let control = this.control;

        if (control) {
            control.TexasMagicFaceController._updateMagicFacePanel(this.data.nUserId,seat,newSeat);
        }
    },

    //亮手牌
    _lightHandCard(arry,handCard) {
        for (let i=0; i<arry.length; i++) {//公共牌
            let arryItem = arry[i];
            
            let x16 = 0x10;
            let x10 = x16.toString(10);//16进制转10进制
            
            let point = arryItem%x10;//点数
            let flower = parseInt(arryItem/x10);//花色
            cc.log("赢的牌:" + point + "点" + flower + "花色");

            //手牌亮牌
            for (let j=0; j<handCard.length; j++) {
                let handCardItem = handCard[j];

                if (arryItem==handCardItem) {
                    this._setCardLight(j+1,true);

                    break;
                }

            }
        }
    },

    //设置牌光效
    _setCardLight(index,isShow) {
        let card_1 = this._cards.getChildByName("card_1");
        let light1 = card_1.getChildByName("light");
        let card_2 = this._cards.getChildByName("card_2");
        let light2 = card_2.getChildByName("light");

        if (!isShow) {
            light1.active = false;
            light2.active  = false;
        }

        if (index==1) {
            light1.active = true;
            card_1.color = new cc.Color(255, 255, 255);
        }else if (index==2){
            light2.active = true;
            card_2.color = new cc.Color(255, 255, 255);
        }
    },  

    //设置牌置灰
    _setCardGrey(index) {
        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");

        if (index==1) {
            card_1.color = new cc.Color(100, 100, 100);
        }else if (index==2) {
            card_2.color = new cc.Color(100, 100, 100);
        }else {
            card_1.color = new cc.Color(255, 255, 255);
            card_2.color = new cc.Color(255, 255, 255);
        }
    },

    _setCardSprite(card1,card2) {
        cc.log("_setCardSprite");

        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");

        if (Number(card1)>=0) {
            TexasUtils._getCardType(card_1,card1,this.pokerBack);
            card_1.active = true;
        }

        if (Number(card2)>=0) {
            TexasUtils._getCardType(card_2,card2,this.pokerBack);
            card_2.active = true;
        }
    },

    //展示手牌
    _showCard(cardArry,cardType,isWin,callback,isLiang) {
        cc.log("cardArry,cardType,isWin,isLiang:",cardArry,cardType,isWin,isLiang);

        let self = this;

        if (!cardArry || cardArry.length<=0) return;

        let card1 = cardArry[0];
        let card2 = cardArry[1];
        
        let info = UserInfo.getInfo();

        this._cards.zIndex = 13;

        let card_1 = self._cards.getChildByName("card_1");
        let card_2 = self._cards.getChildByName("card_2");
        card_1.active = true;
        card_2.active = true;
        this._cards.active = true;

        let setPokerFun = cc.callFunc(function () {
            if (Number(card1)>=0 && Number(card2)>=0) {
                TexasUtils._getCardType(card_1,card1,self.pokerBack);
                TexasUtils._getCardType(card_2,card2,self.pokerBack);
            }
        }, this)

        let setPokerCallBack = cc.callFunc(function () {
            cc.log("updateCardType6");
            self.updateCardType(cardType);

            if (callback) {
                callback();
            }

            if (isWin) {
                self._setWin(cardType);
            }
        }, this)

        self._cards.stopAllActions();

        if (info.nUserID==this.data.nUserId) {
            if (isLiang) {
                let nScale = TexasUtils._getSkin(["b"])?1.1:1;

                 //翻牌动画
                TexasUtils._getCardType(card_1,0,self.pokerBack);
                TexasUtils._getCardType(card_2,0,self.pokerBack);
                card_1.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, nScale, nScale), cc.delayTime(0.3))); 
                card_2.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, nScale, nScale), cc.delayTime(0.3),setPokerCallBack)); 
            }else {
                if (callback) {
                    callback();
                }
    
                if (isWin) {
                    self._setWin(cardType);
                }
            }
        }else {
            let cardStr = "left";
            if (this.seat==8 || this.seat==9) {
                cardStr = "right";
            }
            self._cards.position = self.cardPosition.getChildByName(cardStr).position;

            let movePosX1 = 39.435;
            let movePosY1 = 10;
            let movePosX2 = 100.616;
            let movePosY2 = 10;
            if (this.seat==8 || this.seat==9) {
                movePosX1 = -12.61;
                movePosY1 = 10;
                movePosX2 = 47.39;
                movePosY2 = 10;
            } 
    
            card_1.x = movePosX1;
            card_1.y = movePosY1;
            card_2.x = movePosX2;
            card_2.y = movePosY2;

            let nScale = TexasUtils._getSkin(["d"])?0.35:0.4;

            card_1.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, 0.7, 0.7), cc.delayTime(0.3))); 
            card_2.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, 0.7, 0.7), cc.delayTime(0.3),setPokerCallBack)); 
        }

    },

    //赢
    _setWin(cardType) {
        this._updateAction(-1);

        this._initEffect(1);//光效

        //特殊牌型不显示胜利，只显示输赢分、光圈、牌型
        let type = 0;
        if (cardType && Number(cardType)>=7) {
            type = cardType;  
        }

        this._showCardType(type);
    },

    //显示牌型特效
    _showCardType(type) {
        cc.log("_showCardType type:",type);

        if (Number(type)>=7 && Number(type)<=10) {
            let sex = "man_";
            if (this.data && this.data.nSex==1) {
                sex = "woman_";
            }

            let cardType = "hulu";
            if (Number(type)==8) {
                cardType = "jingang";
            }else if (Number(type)==9) {
                cardType = "tonghua";
            }else if (Number(type)==10) {
                cardType = "huangjia";
            }

            TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + sex + cardType,true);//音效
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
        let imgCard = type + "";
        let frame = this.atlasCardType.getSpriteFrame(imgCard);
        if(null!=frame){
            this.nWin.getComponent(cc.Sprite).spriteFrame = frame;
            this.nWin.getComponent(cc.Animation).stop('winScoreAnim');
            this.nWin.getComponent(cc.Animation).setCurrentTime(0);
            this.nWin.getComponent(cc.Animation).play("winScoreAnim");
            this.nWin.active = true;
        }else {
            QYLogs.error("_showCardType", "获取图片失败", imgCard);
        }
    },

    //显示分数
    _showScore(score) {
        cc.log("_showScore score:",score);

        let info = UserInfo.getInfo();

        score = Number(score);

        this._updateAction(-1);

        let failScore = this.nScore.getChildByName("label_fail");
        failScore.active = false;
        let winScore = this.nScore.getChildByName("label_win");
        winScore.active = false;

        // let nLabel = this.nScore.getChildByName("label").getComponent(cc.Label);
        let nScore = TexasUtils._saveTwoPoint(score);
        let nLabel = failScore.getComponent(cc.Label);
        if (score>=0) {
            nLabel = winScore.getComponent(cc.Label);
            nLabel.string = "+" + nScore;
            winScore.active = true;
        }else {
            nLabel.string = nScore;
            failScore.active = true;
        }

        nLabel.node.y = -60;
        nLabel.node.opacity = 127;
        // let scoreIndex = score<0?0:1; 
        // if (this.data.nUserId==info.nUserID) {
        //     scoreIndex = score<0?2:3; 
        // }

        // this.nScore.getComponent(cc.Sprite).spriteFrame = score<0?this.winSpriteFrame[scoreIndex]:this.winSpriteFrame[scoreIndex];
        
        this.scheduleOnce(function() {
            let gameState = TexasData._getGameState();//游戏阶段

            if (gameState!=2) return;
            
            this.nScore.active = true;

            nLabel.node.stopAllActions();

            // var scoreActionMove = cc.moveTo(0.5, -2, 38);
            // if (TexasUtils._getSkin(["b"])) {
               let scoreActionMove = cc.moveTo(0.5, -2, 0);
            // }
    
            nLabel.node.runAction(cc.sequence(scoreActionMove,cc.callFunc(function (args) {
                // if (TexasUtils._getSkin(["b"])) {
                    nLabel.node.opacity = 255;
                // }
            })));
        },0.5);
    },

    //更新牌型
    updateCardType(type) {
        cc.log("updateCardType type:",type);

        this.cardType.active = false;
        if (type && Number(type)>0) {
            let types = this.cardType.getChildByName("type");
            TexasUtils._getSpriteFrame(this.atlasCardTypes,types,type+"");

            this.cardType.active = true;
        }
    },

    //修改玩家信息
    changePlayerInfo(data) {
        cc.log("changePlayerInfo data:",data);

        let info = UserInfo.getInfo();

        if (data.sShopAcc) {
            this._sShopAcc = data.sShopAcc;//第三方用户ID
        }

        if (data.sFaceId) {
            this.scheduleOnce(()=>{
                      
                Utils.changeUserHead(this.spriteHead,data.sFaceId);//玩家头像
            },0)

           
        }

        if (data.sName) {
            this.names.string = Utils.getShortText(Base64.decode(data.sName), 10);//玩家名
            this._name = this.names.string;
        }

        if (Number(data.nBalance)>=0) {
            this._Gold = Number(data.nBalance);
            this.data.nBalance = Number(data.nBalance);

            if (this.data.nUserId==info.nUserID) {//自己金币有变化，刷新购买弹窗金币
                MsgManager.fire(MSG.NOTIFY.NOTIFY_UPDATE_BUY_GOLD);
            }

            this.gold.string = TexasUtils._saveTwoPoint(data.nBalance);
        }
    },

    //设置麦克风界面
    setMikeImg(micStatus){
        // let status = app.storage.getItem("Texas_mike", "off");
        // if (micStatus){
        //     status = micStatus;
        // }

        // let voice = this.mike.getChildByName("voice");//音量
        // let mikeUse = this.mike.getChildByName("mikeUse");//使用麦克风
        // let mikeForbit = this.mike.getChildByName("mikeForbit");//禁用麦克风

        // if (status == "on"){
        //     voice.active = true;
        //     voice.getComponent(cc.Sprite).fillRange = 0;
        //     mikeUse.active = true;
        //     mikeForbit.active = false;
        // }else{
        //     voice.active = false;
        //     mikeUse.active = false;
        //     mikeForbit.active = true;
        // }
    },

   //更新玩家麦克风音量
   _updateMicVolume(volume) {
        if (!TexasUtils._getSkin(["d"])) return;

        cc.log("更新玩家麦克风音量:",volume);

        // let info = UserInfo.getInfo();

        volume = Number(volume);
        // let voice = this.mike.getChildByName("voice");//音量
        // let voiceAnim = voice.getComponent(cc.Animation);
        // let mikeUse = this.mike.getChildByName("mikeUse");//使用麦克风
        // let mikeForbit = this.mike.getChildByName("mikeForbit");//禁用麦克风

        // voiceAnim.stop('mikeAnim');
        // voiceAnim.setCurrentTime(0);

        let anim = this.mikeAnim.getChildByName("anim").getComponent(cc.Animation);
        // anim.stop('mikeAnim');
        // anim.setCurrentTime(0);

        // voice.getComponent(cc.Sprite).fillRange = 0;
        if (!volume || volume <= 0){
            // if (this.data.nUserId!=info.nUserID) {
            //     voice.active = false;
            //     mikeUse.active = false;
            //     mikeForbit.active = false;
            // }
            this.mikeAnim.active = false;
            this.mikeBorder.active = false;
        }else{
            this.setMicState();

            // voice.active = true;
            // voiceAnim.play("mikeAnim");

            // mikeUse.active = true;
            // mikeForbit.active = false;

            // anim.play("mikeAnim");

            this.mikeAnim.active = true;
            this.mikeBorder.active = true;
        }
    },

    //更新上麦玩家麦克风状态
    _updateMicState(state) {
        cc.log("_updateMicState state:",state);

        state = state?Number(state):0;

        this.setMicState(state);

        if (state==1 || state==2 || state==3) {
            this._updateMicVolume();
        }
    },

    //设置麦状态
    setMicState(state) {
        if (!TexasUtils._getSkin(["d"])) return;

        let mic = this.micState.children;
        if (mic && mic.length>0) {
            for (let i=0; i<mic.length; i++) {
                let child = mic[i];

                if (child.name.toString()!="block") {
                    child.active = false;
                }

                if (state && child.name.toString()==state + "") {
                    child.active = true;
                }

            }
            
        }

        this.micState.active = state?true:false;
    },

    
    //更新动作(1:托管 2:大盲 3:小盲 4:弃牌 5:跟注 6:加注 7:allin 8:过牌)
    _updateAction(type,isLink) {
        cc.log("_updateAction type,isLink:",type,isLink);

        let info = UserInfo.getInfo();

        if (!isLink && Number(type)>=4 && Number(type)<=7) {
            let sex = "man_";
            if (this.data && this.data.nSex==1) {
                sex = "woman_";
            }

            let isChinese = true;

            let actionType = "call";
            if (Number(type)==4) {
                actionType = "qipai";
            }else if (Number(type)==6) {
                actionType = "add";
            }else if (Number(type)==7) {
                isChinese = false;
                actionType = "allin";
            }

            let lang = "";
            if (app.config.LANG == "vi") {
                lang = "_yn";
            }else if (app.config.LANG == "en" || app.config.LANG == "th") {
                lang = "_yy";
            }

            if (Number(type)==7) {
                TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + sex + actionType);//音效
            }else {
                TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + sex + actionType + lang);//音效
            }
        }

        let actionChild = this.action.children;
        if (actionChild && actionChild.length>0) {
            for (let i=0; i<actionChild.length; i++) {
                let child = actionChild[i];

                if (!type) {
                    child.active = false;
                }
                
                if(type==-1) {
                    if (i+1!=1) {
                        child.active = false;
                    }
                }
                
                if(type==-2) {
                    if (i+1!=1 && i+1!=4 && i+1!=7) {
                        child.active = false;
                    }
                }
                
                if(Number(type)==i+1){
                    child.active = true;

                    this.action.zIndex = 3;
                    // if (this.data.nUserId==info.nUserID) {
                        // this.action.zIndex = 1;
                    // }

                    if (type==1) {//托管
                        this._isAuto = true;
                    }else if (type==2 || type==3) {//大小盲信息显示在牌上
                        this.action.zIndex = 10;
                    }else if (type==4) {//弃牌
                        this._setGrey(true);

                        if (this.data.nUserId!=info.nUserID) {
                            this._setCardGrey();
                        }

                        this._initEffect();
                    }else if (type==6) {
                        this._initEffect(3);
                    }else if (type==7) {
                        this._initEffect(2);
                    }

                }

            }
        }
    },

    //显示托管状态
    _showTuoGuan(visible) {
        this._isAuto = visible;

        this.action.getChildByName(1 + "").active = visible;
        // this.tuoguan.active = visible;
    },

    //更新下注值 (测试: 总奖池加注)
    _updateDownBet(bet,isLink,isPoolNull) {
        cc.log("_updateDownBet bet,isLink,isPoolNull:",bet,isLink,isPoolNull);

        let self = this;

        if (bet && Number(bet)>0) {
            self._downBetCount += bet;

            if (self.control && !isPoolNull) {
                self.control.TexasRewardPool._addPond(bet,true);
            }

            if (Number(self._downBetCount)>=0) {
                if (isLink) {
                    self.chipLabel.string = TexasUtils._saveTwoPoint(self._downBetCount);//下注数目

                    self.chipZone.active = true;
                }else {
                    TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "xiazhu");//下注音效

                    let chipItem = cc.instantiate(self.itemChipPrefab);
                    chipItem.parent = self.headBox;
                    chipItem.active = true;

                    let pos = TexasUtils._getNodePos(self.chipZone,chipItem);

                    chipItem.stopAllActions();

                    var actionMove = cc.moveTo(0.2,pos.x,pos.y);

                    chipItem.runAction(cc.sequence(actionMove,cc.callFunc(function (args) {
                        if (cc.isValid(chipItem)) {
                            chipItem.destroy();
                        } 

                        self.chipLabel.string = TexasUtils._saveTwoPoint(self._downBetCount);//下注数目

                        //玩家金币
                        self._Gold -= Number(bet);
                        if (self._Gold<=0) {
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
        cc.log("playChipEffect bet, isLink:",bet, isLink);

        TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "xiazhu");//下注音效

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

            chip.parent = isLink?self.chipList:self.node;
            chip.x = 0;
            chip.y = 0;
            let texasChip = chip.getComponent("texasChip");
            texasChip._initChip(chipItem);
            chip.active = true;

            control._chipArry.push(chip);

            if (!isLink) {
                let pos = TexasUtils._getNodePos(self.chipList,chip);

                chip.stopAllActions();

                chip.runAction(cc.sequence(
                    cc.delayTime(0.02 * i),
                    cc.moveTo(0.2, pos.x, pos.y),
                    cc.callFunc(function (params) {
                        //回收金币
                        control._onChipKilled(chip);
                        if (i === count - 1) {
                            self.chipList.destroyAllChildren();

                            for (let j=0; j<data.length; j++) {
                                let itemChip = cc.instantiate(self.itemChipPrefab);
                                itemChip.parent = self.chipList;
                                itemChip.x = 0;
                                itemChip.y = 0;
                                let texasChips = itemChip.getComponent("texasChip");
                                texasChips._initChip(data[j]);
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
        cc.log("点击玩家:",this.data);  

        let info = UserInfo.getInfo();

        if (this.control) {
            let control = this.control;
            let selfSitid = control.TexasPlayerController._getSitId("nUserId",info.nUserID);

            if (selfSitid) {
                TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "click");//下注音效
            }
        }

       if (TexasUtils._getSkin(["default","b","c","d"])) {
            if (info.nUserID==this.data.nUserId) {
                this._getUserInfo();

                return;
            }

            let control = this.control;

            if (control) {
                let selfSitId = control.TexasPlayerController._getSitId("nUserId",info.nUserID);

                if (selfSitId) {
                    this.onClickBtnMagicFace();
                }else {
                    this._getUserInfo();
                }
            }
        }

        // let info = UserInfo.getInfo();

        // let isAnchor = App.getIsAnchor();
        // if (TexasData._getLiveUserId()) {
        //     isAnchor = false;
        //     if (info.nUserID==TexasData._getLiveUserId()) {
        //         isAnchor = true;
        //     }
        // }

        // cc.log("isAnchor:",isAnchor);
        // if (isAnchor && this.data.nUserId!=info.nUserID) {
        //     if (this.control) {
        //         this.control.TexasPlayerController._resetKick();
        //     }

        //     if (this.kickBtn) {
        //         this.kickBtn.active = true;
        //     }
        // }
    },

    _getUserInfo() {
        TexasUtils.toggleUserInfo(this._sShopAcc,Base64.decode(this.data.sName));
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
        TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouKickUserReq_CMD, data);
        // cc.warn("-----------------------------------------------------------------------------------------德州主播踢人请求:",data);
        // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouKickUserReq_CMD, data);
    },

    //打赏
    onClickBtnReward() {
        TexasUtils.toggleReward(this._sShopAcc,Base64.decode(this.data.sName));
    },

    //麦克风
    onClickBtnMike() {
        if (this.data.nUserId != UserInfo.getInfo().nUserID) return;

        TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "click");//点击音效

        let voice = this.mike.getChildByName("voice");//音量
        let mikeUse = this.mike.getChildByName("mikeUse");//使用麦克风
        let mikeForbit = this.mike.getChildByName("mikeForbit");//禁用麦克风

        if (mikeUse.active) {
            cc.log("当前开麦状态准备关麦");
            voice.active = false;
            mikeUse.active = false;
            mikeForbit.active = true;
            TexasUtils.micSwitch(false,this._sShopAcc);
        }else {
            cc.log("当前禁麦状态准备开麦");
            voice.active = true;
            voice.getComponent(cc.Sprite).fillRange = 0;
            mikeUse.active = true;
            mikeForbit.active = false;
            TexasUtils.micSwitch(true,this._sShopAcc);
        }
    },

    //魔法表情
    onClickBtnMagicFace() {
        cc.log("点击魔法表情:",this.data);

        let control = this.control;

        if (control) {
            control.TexasMagicFaceController._showMagicFacePanel(this.data.nUserId,this.seat);
        }
    },

/*************************************定时器***************************************************/
     //设置闹钟(10s)
     _setAlarmSchedule(time) {
        let self = this;

        let timeLight = self.alarmClock.getChildByName("timeLight");

        self.alarmClock.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[0];
        timeLight.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[2];
        if (time<=3) {
            self.alarmClock.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[1];
            timeLight.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[3];
        }

        if (time < 0) {
            self.stopUpdate();

            self.alarmClock.active = false;

            return;
        }

        if (time >= 0) {
            self.times = time;

            if (time==3) {
                TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "daojishi");//倒计时音效
            }

            let spriteRanges = time/this.maxTime;
            
            self.alarmClock.getComponent(cc.Sprite).fillRange = spriteRanges;
            if (TexasUtils._getSkin(["default"])){

            }else{
                TexasUtils._refreshParticle(self.alarmClock,timeLight,spriteRanges);
            }
            

            self.alarmClock.active = true;
            self._startUpdate(); 
        }
    },

    //开始更新时间
    _startUpdate(){
        this.stopUpdate();

        cc.director.getScheduler().schedule(this._updateAlarm, this,0.1, false);
    },

    //暂停更新时间
    stopUpdate(){
        if(cc.director.getScheduler().isScheduled(this._updateAlarm, this)){
            cc.director.getScheduler().unschedule(this._updateAlarm, this);
        }
    },

    _updateAlarm () {
        this.times -= 0.1;
        this._setAlarmSchedule(this.times);
    },



});
