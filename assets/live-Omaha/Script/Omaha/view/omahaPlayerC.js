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

let texasPlayerC = require("texasPlayerC");

cc.Class({
    extends: texasPlayerC,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
    },

    start () {

    },

    // update (dt) {},

    //设置玩家信息(isMang 2:大盲 3:小盲)
    setPlayerInfo(control,seat,data,isMang,isNoAddPool) {
        this._super(control,seat,data,isMang,isNoAddPool);

        this._nCard = [0,0,0,0];

        if (data.arrHoleCards && data.arrHoleCards.length>0) {//手牌(值为0的牌，显示牌背,表示还没亮牌)
            let cardArry = data.arrHoleCards;
            if (UserInfo.getInfo().nUserID != this.data.nUserId){
                if (Number(cardArry[0]) > 0 && Number(cardArry[1]) > 0){
                    this._showCard(cardArry, data.nCardType, false, function(){}, false, true)
                }else{
                    this._setCardSprite(Number(cardArry[0]),Number(cardArry[1]), Number(cardArry[2]), Number(cardArry[3]));
                }
            }else{
                this._setCardSprite(Number(cardArry[0]),Number(cardArry[1]), Number(cardArry[2]), Number(cardArry[3]));
            }
        }

        let nStatus = Number(data.nStatus);
        if (nStatus==6) {
            let card_1 = this._cards.getChildByName("card_1");
            let card_2 = this._cards.getChildByName("card_2");
            let card_3 = this._cards.getChildByName("card_3");
            let card_4 = this._cards.getChildByName("card_4");

            if (data.nUserId!=UserInfo.getInfo().nUserID) {
                card_1.active = false;
                card_2.active = false;
                card_3.active = false;
                card_4.active = false;
            }
        }
    },

    //重置玩家
    _ResetPlayer(isUpdateSeat) {
        this._super(isUpdateSeat);
        if (isUpdateSeat) {
        }else {
            this._nCard = [0,0,0,0];
        }
        this.otherCards.scale = 1;
    },

    _setGrey(isGrey,nPos){
        this._super(isGrey,nPos);
        if (isGrey) {
            this._setCardGrey(1);
            this._setCardGrey(2);
            this._setCardGrey(3);
            this._setCardGrey(4);
        }else {
            this._setCardGrey();
        }
    },

    _setCardsSize(type) {
        let card_1 = this.otherCards.getChildByName("card_1");
        let card_2 = this.otherCards.getChildByName("card_2");
        let card_3 = this.otherCards.getChildByName("card_3");
        let card_4 = this.otherCards.getChildByName("card_4");

        card_1.stopAllActions();
        card_2.stopAllActions();
        card_3.stopAllActions();
        card_4.stopAllActions();

        card_1.scale = TexasUtils._getSkin(["default"])?0.35:0.3;
        card_2.scale = TexasUtils._getSkin(["default"])?0.35:0.3;
        card_3.scale = TexasUtils._getSkin(["default"])?0.35:0.3;
        card_3.scale = TexasUtils._getSkin(["default"])?0.35:0.4;

        card_1.x = type==1?10:-10;
        card_1.y = type==1?-8:10;

        card_2.x = type==1?20:15;
        card_2.y = type==1?-8:10;

        card_3.x = type==1?30:40;
        card_3.y = type==1?-8:10;

        card_4.x = type==1?40:65;
        card_4.y = type==1?-8:10;

        // if (this.seat==8 || this.seat==9) {
        //     if (type==2) {
        //         card_1.x = -2.213;
        //         card_1.y = 10;
        
        //         card_2.x = 58.599;
        //         card_2.y = 10;
        //     }
        // }
    },

    //牌
    _setCard() {
        this._setCardSize();

        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");
        let card_3 = this._cards.getChildByName("card_3");
        let card_4 = this._cards.getChildByName("card_4");
        
        card_1.stopAllActions();
        card_2.stopAllActions();
        card_3.stopAllActions();
        card_4.stopAllActions();

        if (this.data.nUserId==UserInfo.getInfo().nUserID) {
            card_1.scale = TexasUtils._getSkin(["b","c"])?0.9:1;
            card_2.scale = TexasUtils._getSkin(["b","c"])?0.9:1;
            card_3.scale = TexasUtils._getSkin(["b","c"])?0.9:1;
            card_4.scale = TexasUtils._getSkin(["b","c"])?0.9:1;
        }else {
            card_1.scale = TexasUtils._getSkin(["default"])?0.35:0.4;
            card_2.scale = TexasUtils._getSkin(["default"])?0.35:0.4;
            card_3.scale = TexasUtils._getSkin(["default"])?0.35:0.4;
            card_4.scale = TexasUtils._getSkin(["default"])?0.35:0.4;
        }

        card_1.active = false;
        card_2.active = false;
        card_3.active = false;
        card_4.active = false;


        this._setCardLight();
        this._setCardGrey();

        // this._setCardSprite(0,0);
        
        this._cards.active = true;
    },


    //设置牌光效
    _setCardLight(index,isShow) {
        let card_1 = this._cards.getChildByName("card_1");
        let light1 = card_1.getChildByName("light");
        let card_2 = this._cards.getChildByName("card_2");
        let light2 = card_2.getChildByName("light");
        let card_3 = this._cards.getChildByName("card_3");
        let light3 = card_3.getChildByName("light");
        let card_4 = this._cards.getChildByName("card_4");
        let light4 = card_4.getChildByName("light");

        if (!isShow) {
            light1.active = false;
            light2.active  = false;
            light3.active = false;
            light4.active  = false;
        }

        if (index==1) {
            light1.active = true;
            card_1.color = new cc.Color(255, 255, 255);
        }else if (index==2){
            light2.active = true;
            card_2.color = new cc.Color(255, 255, 255);
        }else if (index==3){
            light3.active = true;
            card_3.color = new cc.Color(255, 255, 255);
        }else if (index==4){
            light4.active = true;
            card_4.color = new cc.Color(255, 255, 255);
        }
    },  

    //设置牌置灰
    _setCardGrey(index) {
        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");
        let card_3 = this._cards.getChildByName("card_3");
        let card_4 = this._cards.getChildByName("card_4");

        if (index==1) {
            card_1.color = new cc.Color(100, 100, 100);
        }else if (index==2) {
            card_2.color = new cc.Color(100, 100, 100);
        }else if (index==3) {
            card_3.color = new cc.Color(100, 100, 100);
        }else if (index==4) {
            card_4.color = new cc.Color(100, 100, 100);
        }else {
            card_1.color = new cc.Color(255, 255, 255);
            card_2.color = new cc.Color(255, 255, 255);
            card_3.color = new cc.Color(255, 255, 255);
            card_4.color = new cc.Color(255, 255, 255);
        }
    },

    _setCardSprite(card1, card2, card3, card4) {
        cc.log("_setCardSprite");

        if (this._nCard && this._nCard[0] > 0 && this._nCard[1] > 0 && this._nCard[2] > 0 && this._nCard[3] > 0){
            //已经显示手牌了
            return;
        }

        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");
        let card_3 = this._cards.getChildByName("card_3");
        let card_4 = this._cards.getChildByName("card_4");
        card_1.stopAllActions();
        card_2.stopAllActions();
        card_3.stopAllActions();
        card_4.stopAllActions();

        if (Number(card1)>=0) {
            this._nCard[0] = card1;
            TexasUtils._getCardType(card_1,card1);
            card_1.active = true;
        }

        if (Number(card2)>=0) {
            this._nCard[1] = card2;
            TexasUtils._getCardType(card_2,card2);
            card_2.active = true;
        }

        if (Number(card3)>=0) {
            this._nCard[2] = card3;
            TexasUtils._getCardType(card_3,card3);
            card_3.active = true;
        }

        if (Number(card4)>=0) {
            this._nCard[3] = card4;
            TexasUtils._getCardType(card_4,card4);
            card_4.active = true;
        }
    },

     //扑克
     _pokers() {
        let cards = Utils.clone(this._nCard);
        let card_1 = this._cards.getChildByName("card_1");
        let card_2 = this._cards.getChildByName("card_2");
        let card_3 = this._cards.getChildByName("card_3");
        let card_4 = this._cards.getChildByName("card_4");
        TexasUtils._getCardType(card_1,cards[0]);
        TexasUtils._getCardType(card_2,cards[1]);
        TexasUtils._getCardType(card_3,cards[2]);
        TexasUtils._getCardType(card_4,cards[3]);
    },

    //展示手牌
    _showCard(cardArry,cardType,isWin,callback,isLiang,isLink) {
        cc.log("cardArry,cardType,isWin,isLiang:",cardArry,cardType,isWin,isLiang,isLink);

        if (!cardArry || cardArry.length<=0) return;

        let card1 = cardArry[0];
        let card2 = cardArry[1];
        let card3 = cardArry[2];
        let card4 = cardArry[3];

        this._nCard = Utils.clone(cardArry);

        let self = this;

        let info = UserInfo.getInfo();

        this._cards.zIndex = 13;

        let card_1 = self._cards.getChildByName("card_1");
        let card_2 = self._cards.getChildByName("card_2");
        let card_3= self._cards.getChildByName("card_3");
        let card_4 = self._cards.getChildByName("card_4");
        card_1.active = true;
        card_2.active = true;
        card_3.active = true;
        card_4.active = true;
        card_1.stopAllActions();
        card_2.stopAllActions();
        card_3.stopAllActions();
        card_4.stopAllActions();
        this._cards.active = true;

        let setPokerFun = cc.callFunc(function () {
            if (Number(card1)>=0 && Number(card2)>=0) {
                TexasUtils._getCardType(card_1,card1,self.pokerBack);
                TexasUtils._getCardType(card_2,card2,self.pokerBack);
            }
            if (Number(card3)>=0 && Number(card4)>=0) {
                TexasUtils._getCardType(card_3,card3,self.pokerBack);
                TexasUtils._getCardType(card_4,card4,self.pokerBack);
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

        if (info.nUserID==this.data.nUserId) {
            if (isLink) {
                card_1.scale = TexasUtils._getSkin(["b","c"])?0.9:1; 
                if (Number(card1)>=0 && Number(card2)>=0) {
                    TexasUtils._getCardType(card_1,card1,self.pokerBack);
                    TexasUtils._getCardType(card_2,card2,self.pokerBack);
                }
                if (Number(card3)>=0 && Number(card4)>=0) {
                    TexasUtils._getCardType(card_3,card3,self.pokerBack);
                    TexasUtils._getCardType(card_4,card4,self.pokerBack);
                }
                self.updateCardType(cardType);

                if (callback) {
                    callback();
                }

                if (isWin) {
                    self._setWin(cardType);
                }
            }else {
                if (isLiang) {
                    let nScale = TexasUtils._getSkin(["b","c"])?0.9:1;
    
                    //翻牌动画
                    TexasUtils._getCardType(card_1,0,self.pokerBack);
                    TexasUtils._getCardType(card_2,0,self.pokerBack);
                    TexasUtils._getCardType(card_3,0,self.pokerBack);
                    TexasUtils._getCardType(card_4,0,self.pokerBack);
                    card_1.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, nScale, nScale), cc.delayTime(0.3))); 
                    card_2.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, nScale, nScale), cc.delayTime(0.3))); 
                    card_3.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, nScale, nScale), cc.delayTime(0.3))); 
                    card_4.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, nScale, nScale), cc.delayTime(0.3),setPokerCallBack)); 
                }else {
                    if (callback) {
                        callback();
                    }
        
                    if (isWin) {
                        self._setWin(cardType);
                    }
                }
            }
        }else {
            let cardStr = "right";
            self._cards.position = self.cardPosition.getChildByName(cardStr).position;
            let movePosY = 10;

            let movePosX1 = -4;
            let movePosX2 = 19;
            let movePosX3 = 42;
            let movePosX4 = 65;

            if (this.seat > 6){
                movePosX1 = -30;
                movePosX2 = -7;
                movePosX3 = 16;
                movePosX4 = 39;
            }
    
            card_1.x = movePosX1;
            card_1.y = movePosY;
            card_2.x = movePosX2;
            card_2.y = movePosY;
            card_3.x = movePosX3;
            card_3.y = movePosY;
            card_4.x = movePosX4;
            card_4.y = movePosY;

            let nScale = TexasUtils._getSkin(["default"])?0.35:0.4;

            if (isLink) {
                card_1.scale = 0.7;
                card_2.scale = 0.7;
                card_3.scale = 0.7;
                card_4.scale = 0.7;
                if (Number(card1)>=0 && Number(card2)>=0) {
                    TexasUtils._getCardType(card_1,card1,self.pokerBack);
                    TexasUtils._getCardType(card_2,card2,self.pokerBack);
                }
                if (Number(card3)>=0 && Number(card4)>=0) {
                    TexasUtils._getCardType(card_3,card3,self.pokerBack);
                    TexasUtils._getCardType(card_4,card4,self.pokerBack);
                }
                self.updateCardType(cardType);

                if (callback) {
                    callback();
                }

                if (isWin) {
                    self._setWin(cardType);
                }
            }else {
                card_1.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, 0.7, 0.7), cc.delayTime(0.3))); 
                card_2.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, 0.7, 0.7), cc.delayTime(0.3))); 
                card_3.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, 0.7, 0.7), cc.delayTime(0.3))); 
                card_4.runAction(cc.sequence(cc.scaleTo(0.15, 0, nScale), setPokerFun, cc.scaleTo(0.15, 0.7, 0.7), cc.delayTime(0.3),setPokerCallBack)); 
            }

        }

    },

});
