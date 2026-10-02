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
let TexasUtils = require("TexasUtils");
var ConfigGame = require("ConfigGame");
let TexasData = require("TexasData");

let TexasMusicPath = TexasConfig.TEXASMUSICPATH;

cc.Class({
    extends: cc.Component,

    properties: {
        cards: cc.Node,//牌
        cardPosition: cc.Node,//牌位置

        chipZone: cc.Node,//下注区
        chipList: cc.Node,//筹码列表
        bankIcon: cc.Node,//庄家标识
        chipPosition: cc.Node,//下注区位置

        tuoguan: cc.Node,//托管

        cardType: cc.Node,//牌型
        nameBg: cc.Node,//信息栏

        action: cc.Node,//动作

        alarmClock: cc.Node,//倒计时

        nWin: cc.Node,//胜利
        winCardType: cc.Node,//胜利牌型
        nScore: cc.Node,//分数
        Effect: cc.Node,//特效

        spriteHead: cc.Sprite,
        names: cc.Label,
        gold: cc.Label,

        nType:cc.Label,
        chipLabel: cc.Label,//下注值

        sitid: cc.Label,

        timeSpriteFrame: {//时间
            default: [],
            type: cc.SpriteFrame
        },

        winSpriteFrame: {//输赢
            default: [],
            type: cc.SpriteFrame
        },

        itemChipPrefab:{//筹码预制
            default:null,
            type:cc.Prefab,
        },

        pokerBack: cc.SpriteFrame,//卡背

        _Gold: 0,//金币
        _downBetCount: 0,//当前下注值
        _sShopAcc: 0,//第三方用户ID
        _isAuto: false,//是否托管
        _isPlaying: false,//是否在玩
        _name:"",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    //设置玩家信息(isMang 2:大盲 3:小盲)
    setPlayerInfo(control,seat,data,isMang) {
        cc.log("setPlayerInfo seat,data,isMang:",seat,data,isMang);

        this.control = control;
        this.seat = seat;
        this.data = data;

        this.maxTime = TexasData._getMaxOperateTime();

        //玩家服务端座位，用于测试
        this.sitid.string = data.nSitId;
        this.sitid.node.active = ConfigGame.ISDEVELOP;

        this._ResetPlayer();

        this.changePlayerInfo(data);

        if (isMang) {//设置大小盲
            this._updateAction(isMang);
        }

        this._updateDownBet(data.nBet,true);

        if (data.isBanker) {//是否为庄
            this.control._flyBankIcon(data.nSitId,true);
        }

        if (data.arrHoleCards && data.arrHoleCards.length>0) {//手牌(值为0的牌，显示牌背,表示还没亮牌)
            let cardArry = data.arrHoleCards;

            this._setCardSprite(Number(cardArry[0]),Number(cardArry[1]));
        }

        //牌型
        let nCardType = data.nCardType;
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
        }else if (nStatus==4) {
            action = 6;
        }else if (nStatus==5) {
            action = 7;
        }else if (nStatus==6) {
            let card_1 = this.cards.getChildByName("card_1");
            let card_2 = this.cards.getChildByName("card_2");
            card_1.active = false;
            card_2.active = false;

            action = 4;
        }else if (nStatus==7) {
            this._setGrey(true);
        }

        this._updateAction(action);

        if (data.isAuto) {
            this._showTuoGuan(true);
        }
    },

    //重置玩家
    _ResetPlayer(isUpdateSeat) {
        cc.log("_ResetPlayer isUpdateSeat:",isUpdateSeat);

        let info = UserInfo.getInfo();

        if (isUpdateSeat) {
            this.data.seat = isUpdateSeat;
            this.seat = isUpdateSeat;
        }

        this.setPosition(this.seat,isUpdateSeat);//位置

        if (!isUpdateSeat) {
            this.stopUpdate();

            this.cards.zIndex = 2;
            this.nScore.zIndex = 14;
            this.nameBg.zIndex = 14;
            if (info.nUserID!=this.data.nUserId) {
                this.action.zIndex = 10;
                this.nameBg.zIndex = 12;
            }

            this._initEffect();//光圈特效
            this._setGrey();//置灰
    
            this._updateAction();//更新动作(1:托管 2:大盲 3:小盲 4:弃牌 5:跟注 6:加注 7:allin)
    
            this.nWin.active = false;
            this.nWin.zIndex = 20;
            this.winCardType.zIndex = 20;
            this.winCardType.active = false;
            this.nScore.active = false;
            this.alarmClock.active = false;
    
            this._downBetCount = 0;
            this._isPlaying = false;

            this.chipList.destroyAllChildren();
        }
    },

    //特效
    _initEffect(type) {
        let win = this.Effect.getChildByName("win");
        let allin = this.Effect.getChildByName("allin");
        let addBet = this.Effect.getChildByName("addBet");
        win.active = false;
        allin.active = false;
        addBet.active = false;

        if (Number(type)==1) {
            win.active = true;
        }else if (Number(type)==2) {
            allin.active = true;
        }else if (Number(type)==3) {
            addBet.active = true;
        }
    },

    //设置置灰
    _setGrey(isGrey,nPos) {
        cc.log("_setGrey isGrey:",isGrey);

        if (!nPos || nPos!=this.data.nSitId) {
            this.spriteHead.node.color = isGrey?new cc.Color(60, 60, 60):new cc.Color(255, 255, 255);
            this.nameBg.color = isGrey?new cc.Color(60, 60, 60):new cc.Color(255, 255, 255);
    
            let actionChild = this.action.children;
            for (let i=0; i<actionChild.length; i++) {
                let child = actionChild[i];
    
                child.color = i!=3 && isGrey?new cc.Color(60, 60, 60):new cc.Color(255, 255, 255);
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

        //下注区（1/2:上下 3/4:左下/上 5-6:右下/上）（seat: 1/2/9:上 5/6:下 3:右上 4:右下 7:左下 8:左上）
        let zoneIndex = 1;
        if (seat==5 || seat==6) {
            zoneIndex = 2;
        }else if (seat==7) {
            zoneIndex = 3;
        }else if (seat==8) {
            zoneIndex = 4;
        }else if (seat==4) {
            zoneIndex = 5;
        }else if (seat==3) {
            zoneIndex = 6;
        }

        this.chipZone.position = this.chipPosition.getChildByName("chip" + zoneIndex).position;  
        
        //左:1/2/5/6  右:3/4
        let bank = this.chipZone.getChildByName("bank");
        bank.x = zoneIndex==3 || zoneIndex==4?76.84:-76.84;

        //牌型(1-2:左右) (seat: 7/8:左  1-6、9:右)
        let typeIndex = 2;
        if (seat==7 || seat==8) {
            typeIndex = 1;
        }

        this.cardType.position = this.nameBg.getChildByName("type" + typeIndex).position;  

        if (!isUpdateSeat) {
            this.chipZone.active = false;
            this.cardType.active = false;
            
            this.cardSize = 1;
            this._setCard(1);
        }else {
            this._setCardSize(false,isUpdateSeat);
        }

    },

/*************************************手牌***************************************************/

    //牌
    _setCard(cardSize,card1,card2) {
        cc.log("_setCard cardSize,card1,card2:",cardSize,card1,card2);

        this._setCardSize(cardSize);

        let card_1 = this.cards.getChildByName("card_1");
        let card_2 = this.cards.getChildByName("card_2");
        card_1.active = false;
        card_2.active = false;

        this._setCardLight();
        this._setCardGrey();

        this._setCardSprite(card1,card2);
        
        this.cards.active = true;
    },

    //设置手牌尺寸(1:小牌 2:中牌 3:大牌)
    _setCardSize(cardSize,isUpdateSeat) {
        let seat = this.seat;

        let info = UserInfo.getInfo();

        let left = this.cardPosition.getChildByName("left");
        let left2 = this.cardPosition.getChildByName("left2");
        let right = this.cardPosition.getChildByName("right");
        let right2 = this.cardPosition.getChildByName("right2");
        let right3 = this.cardPosition.getChildByName("right3");

        if (!cardSize && isUpdateSeat) {
            //位置
            let cardsType = this.cardSize==1?left:left2;
            if (seat!=7 && seat!=8) {//7、8玩家使用左位置牌,其他玩家使用右位置牌
                cardsType = this.cardSize==1?right:right2;

                if (this.data.nUserId==info.nUserID) {
                    // if (this.cardSize==1) {
                    //     cardsType = right2;
                    // }else {
                        cardsType = right3;
                    // }
                }
            }
            
            this.cards.position = cardsType.position;

            return;
        }

        //位置
        let cardsType = cardSize==1?left:left2;
        if (seat!=7 && seat!=8) {//7、8玩家使用左位置牌,其他玩家使用右位置牌
            cardsType = cardSize==1?right:right2;

            if (this.data.nUserId==info.nUserID) {
                // if (cardSize==1) {
                //     cardsType = right2;
                // }else {
                    cardsType = right3;
                // }
            }
        }

        //缩放
        // this.cards.scale = 1;
        // if (this.data.nUserId==info.nUserID) {
        //     if (cardSize==1) {
        //         this.cards.scale = 1.6;
        //     }else {
        //         this.cards.scale = 2.4;
        //     }
        // }else {
        //     if (cardSize!=1) {
        //         this.cards.scale = 1.6;
        //     }

        //     // if (cardSize==2) {
        //     //     this.cards.scale = 1.6;
        //     // }else if (cardSize==3) {
        //     //     this.cards.scale = 2.4;
        //     // }
        // }

        //设置牌尺寸
        this.cards.scale = 1;
        if (this.data.nUserId==info.nUserID) {
            // if (cardSize==1) {
            //     this.cards.scale = 1.6;
            // }else {
                this.cards.scale = 2.4;
            // }
        }else {
            if (cardSize!=1) {
                this.cards.scale = 1.6;
            }
        }

        for (let i=1; i<=2; i++) {
            let cardIndex = this.cards.getChildByName("card_"+i);
            let mouldCard = cardsType.getChildByName(""+i);

            cardIndex.scale = mouldCard.scale;//缩放
            cardIndex.angle = mouldCard.angle;//旋转
            cardIndex.position = mouldCard.position;//大小
        }

        this.cards.position = cardsType.position;
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
        let card_1 = this.cards.getChildByName("card_1");
        let light1 = card_1.getChildByName("light");
        let card_2 = this.cards.getChildByName("card_2");
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
        let card_1 = this.cards.getChildByName("card_1");
        let card_2 = this.cards.getChildByName("card_2");

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

        let card_1 = this.cards.getChildByName("card_1");
        let card_2 = this.cards.getChildByName("card_2");

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
    _showCard(cardArry,cardType,isWin,callback) {
        let self = this;

        if (!cardArry || cardArry.length<=0) return;

        let card1 = cardArry[0];
        let card2 = cardArry[1];
        
        let info = UserInfo.getInfo();

        if (info.nUserID==this.data.nUserId) {
            this.cards.zIndex = 13;
        }

        let initScaleY = this.data.nUserId==info.nUserID?1.6:1;

        let nScaleX = 1.6;
        let nScaleY = 1.6;
        if (this.data.nUserId==info.nUserID) {
            nScaleX = 2.4;
            nScaleY = 2.4;
        }

        let action = cc.scaleTo(0.1,0,initScaleY);

        let actions = cc.scaleTo(0.2,nScaleX,nScaleY);

        let card_1 = self.cards.getChildByName("card_1");
        let card_2 = self.cards.getChildByName("card_2");
        card_1.active = true;
        card_2.active = true;
        this.cards.active = true;
        // this._setCardGrey();

        self.cards.stopAllActions();

        let sequence = cc.sequence(
            action,

            cc.callFunc(function () {
                self.cardSize = 2;

                self.cards.scaleY = 2.4;

                let left2 = self.cardPosition.getChildByName("left2");
                let right2 = self.cardPosition.getChildByName("right2");
                let right3 = self.cardPosition.getChildByName("right3");

                //位置
                let cardsType = left2;
                if (self.seat!=7 && self.seat!=8) {//7、8玩家使用左位置牌,其他玩家使用右位置牌
                    cardsType = right2;

                    if (self.data.nUserId==info.nUserID) {
                        cardsType = right3;
                    }
                }

                self.cards.position = cardsType.position;

                if (Number(card1)>=0 && Number(card2)>=0) {
                    TexasUtils._getCardType(card_1,card1,self.pokerBack);
                    TexasUtils._getCardType(card_2,card2,self.pokerBack);
                }
            }),

            actions,

            cc.callFunc(function () {
                self.updateCardType(cardType);

                if (callback) {
                    callback();
                }

                if (isWin) {
                    self._setWin(cardType);
                }
                
            }),

        );

        self.cards.runAction(sequence);
    },

    //赢
    _setWin(cardType) {
        this._updateAction(-1);

        this._initEffect(1);//光效

        //特殊牌型不显示胜利，只显示输赢分、光圈、牌型
        if (cardType && Number(cardType)>=7) {
            this._showCardType(cardType);
        }else {
            this.nWin.active = true;
        }
    },

    //显示牌型特效
    _showCardType(type) {
        cc.log("_showCardType type:",type);

        let typeChild = this.winCardType.children;
        if (typeChild && typeChild.length>0) {
            for (let i=0; i<typeChild.length; i++) {
                let child = typeChild[i];

                child.active = false;
                if (child.name.toString()==type+"") {
                    child.active = true;
                }
            }
        }

        this.winCardType.active = true;
    },

    //显示分数
    _showScore(score) {
        cc.log("_showScore score:",score);

        score = Number(score);

        this._updateAction(-1);

        let nLabel = this.nScore.getChildByName("label").getComponent(cc.Label);
        let nScore = TexasUtils._saveTwoPoint(score);
        if (score>=0) {
            nLabel.string = "+" + nScore;
        }else {
            nLabel.string = nScore;
        }
        nLabel.node.color = cc.color(255,255,255);

        this.nScore.getComponent(cc.Sprite).spriteFrame = score<0?this.winSpriteFrame[0]:this.winSpriteFrame[1];
        this.nScore.active = true;
    },

    //更新牌型
    updateCardType(type) {
        cc.log("updateCardType type:",type);

        this.cardType.active = false;
        if (type && Number(type)>0) {
            this.nType.lang = "cardType." + type;

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

    //更新动作(1:托管 2:大盲 3:小盲 4:弃牌 5:跟注 6:加注 7:allin)
    _updateAction(type) {
        cc.log("_updateAction type:",type);

        let info = UserInfo.getInfo();

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
                    if (this.data.nUserId==info.nUserID) {
                        this.action.zIndex = 1;
                    }

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

        this.tuoguan.active = visible;
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
                    this.playChipEffect(self._downBetCount, true);

                    self.chipLabel.string = TexasUtils._saveTwoPoint(self._downBetCount);//下注数目

                    self.chipZone.active = true;
                }else {
                    this.playChipEffect(self._downBetCount, false, function () {
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
    
                        // self.chipZone.active = true;
                    });

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

        TexasUtils.toggleUserInfo(this._sShopAcc);
    },

/*************************************定时器***************************************************/

     //设置闹钟(10s)
     _setAlarmSchedule(time) {
        let self = this;

        self.alarmClock.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[0];
        if (time<=3) {
            self.alarmClock.getComponent(cc.Sprite).spriteFrame = this.timeSpriteFrame[1];
        }

        let timeLight = self.alarmClock.getChildByName("timeLight");
        let reduceRotation = 90/0.25;

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

            timeLight.angle = spriteRanges * reduceRotation;

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
