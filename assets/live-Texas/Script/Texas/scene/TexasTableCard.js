/*
    德州牌桌公共牌
*/

let TexasUtils = require("TexasUtils");
let UserInfo = require("UserInfo");
let TexasData = require("TexasData");
let MsgManager = require("MsgManager");
let TexasConfig = require("TexasConfig");
let MSG = require("Msg_Texas");

let TexasOperatePanel = require("TexasOperatePanel");
let TexasPlayerController = require("TexasPlayerController");

let TexasMusicPath = TexasConfig.TEXASMUSICPATH;

cc.Class({
    extends: cc.Component,

    properties: {
        TexasOperatePanel: TexasOperatePanel,//操作按钮
        TexasPlayerController: TexasPlayerController,//玩家容器

        action: cc.Node,//动画

        stars: cc.Node,//星星
        cards: cc.Node,//牌

        cardsBg: cc.Node,//牌背景

        bigCard: cc.Node,
        smallCard: cc.Node,

        commonCard: cc.Node,//公共牌发牌位置

        pokerAtlas: cc.SpriteAtlas,

        actionPrefabArry: {
            default: [],
            type: cc.Prefab
        },

        itemFaPaiPrefab: {//发牌预制
            default: null,
            type: cc.Prefab
        },

        pokerBackPrefab: {//牌预制
            default: null,
            type: cc.Prefab
        },

        pokerBack: cc.SpriteFrame,//卡背

        _cardValue: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        MsgManager.on(MSG.NOTIFY.NOTIFY_POKERS, this._onRepPokers, this);
    },

    onDestroy() {
        MsgManager.un(this._onRepPokers);
    },

    start() {

    },

    // update (dt) {},

    _initTableCard() {
        if (this.pokerAtlas) {
            TexasUtils.setPokerAtlas(this.pokerAtlas)
        }

        this._initAction(-1);

        this.stars.active = false;
        this.cards.active = true;

        this._isRunAction = false;
        this._isRunAction2 = false;

        if (this.cardsBg) {
            this.cardsBg.active = false;
            let label = this.cardsBg.getChildByName("label").getComponent(cc.Label);
            label.string = TexasUtils._getText(177);
        }


        this._initCard();

        this._cardValue = [];
    },

    //初始化牌型动画(type  0:皇家同花顺  1:葫芦  2:金刚  3:同花顺)
    _initAction(type) {
        type = Number(type);

        this.action.active = false;

        if (TexasUtils._getSkin(["c"])) return;

        let actionChild = this.action.children;
        if (actionChild && actionChild.length > 0) {
            for (let i = 0; i < actionChild.length; i++) {
                let child = actionChild[i];

                let cardAction = child.getChildByName("action");
                if (cc.isValid(cardAction)) {
                    cardAction.destroy();
                }

                if (type >= 0 && type == i) {
                    let animName = "";
                    if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                        let nType = type;

                        let typeStr = "hjths";
                        type = 15;
                        if (nType == 1) {
                            type = 16;
                            typeStr = "hl";
                        } else if (nType == 2) {
                            type = 17;
                            typeStr = "jg";
                        } else if (nType == 3) {
                            type = 18;
                            typeStr = "ths";
                        }

                        animName = typeStr + "_Ch";
                        if (app.config.LANG == "zh_tw") {
                            animName = typeStr + "_Ft";
                        }
                        if (app.config.LANG == "en") {
                            animName = typeStr + "_En";
                        }
                        if (app.config.LANG == "th") {
                            animName = typeStr + "_Th";
                        }
                        if (app.config.LANG == "vi") {
                            animName = typeStr + "_Yn";
                        }

                        // if (typeStr!="") {
                        //     this.winEffects.getChildByName("winAnim").getComponent(sp.Skeleton).setAnimation(0, animName, false);
                        // }
                    } else {
                        if (app.config.LANG == "vi") {
                            if (type == 0) {
                                type = 4;
                            } else if (type == 2) {
                                type = 5;
                            } else if (type == 3) {
                                type = 6;
                            }
                        } else if (app.config.LANG == "en") {
                            if (type == 0) {
                                type = 7;
                            } else if (type == 1) {
                                type = 8;
                            } else if (type == 2) {
                                type = 9;
                            } else if (type == 3) {
                                type = 10;
                            }
                        } else if (app.config.LANG == "th") {
                            if (type == 0) {
                                type = 11;
                            } else if (type == 1) {
                                type = 12;
                            } else if (type == 2) {
                                type = 13;
                            } else if (type == 3) {
                                type = 14;
                            }
                        }
                    }

                    let prefabEffect = cc.instantiate(this.actionPrefabArry[type]);
                    prefabEffect.parent = child;
                    prefabEffect.name = "action";

                    if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                        prefabEffect.active = false;
                        if (prefabEffect.getComponent(sp.Skeleton)) {
                            prefabEffect.getComponent(sp.Skeleton).animation = animName;
                            prefabEffect.getComponent(sp.Skeleton).setAnimation(0, animName, false);
                            prefabEffect.active = true;
                        }
                    } else {
                        let animation = prefabEffect.getComponent(cc.Animation);

                        animation.on('finished', function (type, state) {

                        }.bind(this));

                        let animateClips = animation.getClips();
                        if (animateClips && animateClips.length > 0) {
                            animation.play(animateClips[0].name);
                        }
                        prefabEffect.active = true;
                    }

                    this.action.active = true;
                }

            }
        }

    },

    //发牌动作
    _initFlyCardsAction() {
        this._scheduleTime(this._updateFlyCommonCards);

        for (let i = 1; i <= 5; i++) {
            let FlyPoker = this.cards.getChildByName("FlyPoker_" + i);
            if (FlyPoker) {
                FlyPoker.stopAllActions();
                FlyPoker.destroy();
            }
        }
    },

    //初始化公共牌(-1:不显示 0:牌背)
    _initCard() {
        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            // this.commonCard.destroyAllChildren();

            this._initFlyCardsAction();
        }

        let cardChild = this.cards.children;

        if (cardChild && cardChild.length > 0) {
            for (let i = 0; i < cardChild.length; i++) {
                let child = cardChild[i];

                child.stopAllActions();

                if (TexasUtils._getSkin(["b"])) {
                    child.scale = 1.1;
                } else if (TexasUtils._getSkin(["c"])) {
                    child.scale = 1.05;
                } else {
                    child.scale = 1;
                }

                TexasUtils._getCardType(child);

                if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                    child.width = this.smallCard.width;
                    child.height = this.smallCard.height;
                }

                if (child.getChildByName("light")) {
                    child.getChildByName("light").active = false;
                }

                if (child.getChildByName("spot")) {
                    child.getChildByName("spot").active = false;
                }

                if (child.getChildByName("grey")) {
                    child.getChildByName("grey").active = false;
                }

                child.color = new cc.Color(255, 255, 255);
                child.opacity = 0;
                child.active = true;
            }
        }
    },

    _getLightPoker(arry, type, isEnd = false) {
        cc.log("_getLightPoker arry this._cardValue", arry, this._cardValue)

        let lightArry = [];
        if (arry && arry.length) {
            for (let i = 0; i < arry.length; i++) {
                let arryItem = arry[i];

                for (let j = 0; j < this._cardValue.length; j++) {
                    let value = this._cardValue[j];

                    if (arryItem == value) {
                        lightArry.push(j + 1);

                        break;
                    }

                }

            }

        }
        this._showSettlePoker(lightArry, type, isEnd);

        if (type < 5) {//1高牌 2对子 3两对 4三条
            let tableCardsList = this._showLightTypePoker(arry, type)

            let list = tableCardsList[1]

            for (let i = 1; i <= 5; i++) {
                let poker = this.cards.getChildByName(i + "");
                poker.getChildByName("light").active = false;
                for (let index = 0; index < list.length; index++) {
                    if ((list[index] + 1) == i) {
                        poker.getChildByName("light").active = true;
                    }
                }
            }
            return
        }
    },

    _showLightTypePoker(array, type) {

        let returnIndex = [[], []];
        let selfCard = TexasData._getSelfCard();        // 手牌
        if (!selfCard || !selfCard.card || selfCard.card.length <= 0) {
            return returnIndex;
        }
        let handCards = [selfCard.card[0], selfCard.card[1]];
        let publicCards = TexasData._getCommonData(); // 公牌
        if (!publicCards) {
            return returnIndex;
        }                 // [手牌下标, 公牌下标]

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







    //结算显示牌
    _showSettlePoker(arry, type, isEnd = false) {
        cc.log("_showSettlePoker arry,type:", arry, type);

        if (arry.length <= 0) return;

        type = Number(type);

        let nGame = TexasData._getGame();
        if (nGame == 3 && !TexasData.isMTTMatch()) {//短牌 同花>葫芦
            if (type == 6 || type == 7) {
                type = type == 6 ? 7 : 6;
            }
        }

        if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this.stars.active = type >= 7 && type <= 10 ? true : false;
        }

        //凑牌
        let useSet = new Set(arry);

        for (let i = 1; i <= 5; i++) {
            const poker = this.cards.getChildByName("" + i);
            if (!poker) continue;

            const grey = poker.getChildByName("grey");
            const light = poker.getChildByName("light");
            const spot = poker.getChildByName("spot");

            poker.y = 0;
            grey.active = false;
            light.active = false;
            spot.active = false;

            const isSame = useSet.has(i);

            if (isSame) {
                poker.color = cc.Color.WHITE;
                light.active = true;
                spot.active = true;

                if (isEnd) {
                    poker.stopAllActions();
                    cc.tween(poker).by(0.15, { y: 30 }).start();
                }
            } else {
                poker.color = new cc.Color(100, 100, 100);
                grey.active = poker.active && (poker.opacity != 0);

            }
        }

        let num = nGame == 3 ? 8 : 7;

        if (type >= num && type <= 10) {
            let cardType = 0;
            if (type == 7) {//葫芦
                cardType = 1;
            } else if (type == 8) {//金刚
                cardType = 2;
            } else if (type == 9) {//同花顺
                cardType = 3;
            }

            this._initAction(cardType);
        }
    },

    //初始公共牌
    _InitCommonCards() {
        for (let i = 1; i <= 5; i++) {
            let poker = this.cards.getChildByName(i + "");

            if (poker) {
                poker.color = new cc.Color(255, 255, 255);
                poker.getChildByName("light").active = false;
                poker.getChildByName("spot").active = false;
                poker.getChildByName("shandian").active = false;
            }
        }
    },



    //发送公共牌渐变创建动画
    _openCardsOpacityAni(posTarget, callBack) {
        let opacityCard = this.cards.getChildByName("opacityCard")
        if (!opacityCard) {
            opacityCard = cc.instantiate(this.cards.getChildByName("1"));
        }
        opacityCard.getChildByName("front").active = false
        opacityCard.getChildByName("point").active = false
        opacityCard.getChildByName("bigFlower").active = false


        opacityCard.parent = this.cards;
        opacityCard.name = "opacityCard"
        opacityCard.x = posTarget.x
        opacityCard.y = posTarget.y + 120
        opacityCard.active = true
        opacityCard.opacity = 0
        // opacityCard.scale = posTarget.scale

        opacityCard.stopAllActions();
        cc.tween(opacityCard).to(0.1, { y: posTarget.y, opacity: 255 }).delay(0.2).call(() => {
            if (callBack) {
                callBack()
            }
        }).start();

    },


    //开牌
    // 开公共牌动画 ,翻牌3张
    _openCard(arry, data, callback) {
        let self = this;

        // 获取游戏状态（1: pre-flop, 2: flop 等）
        let gameState = TexasData._getGameState();
        if (gameState != 1 && gameState != 2) return;

        // 播放翻牌音效
        TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "fanpai");
        // self._isRunAction = true;

        // 逐张创建并播放动画
        for (let i = 0; i < arry.length; i++) {
            let cardValue = arry[i];
            let poker = self.cards.getChildByName((i + 1) + "");
            // 初始位置（pos1）
            let posPoker = self.cards.getChildByName("pos1");
            let posTarget = TexasUtils._getNodePos(posPoker, poker);
            poker.x = posTarget.x;
            poker.y = posTarget.y;
            poker.scale = 1;
            poker.opacity = 255;
            poker.active = true;
            let opacityCard = this.cards.getChildByName("opacityCard")
            if (opacityCard) {
                opacityCard.active = false
            }
            // TexasUtils._getCardType(poker); // 初始化显示牌背

            let minTime = 0.05
            // 翻面动作
            let flipIn = cc.scaleTo(0.05, 0, 1);
            let setFront = cc.callFunc(() => { //赋值然后移动
                TexasUtils._getCardType(poker, cardValue);
                if (i === arry.length - 1) {
                    // 所有牌翻完后执行移动到对应pos
                    self._arrangeOpenCards(arry.length, data, callback);
                }
            });
            let flipOut = cc.scaleTo(0.1, 1, 1);

            // 执行动画序列
            poker.runAction(cc.sequence(
                flipIn,
                setFront,
                flipOut,
            ));
        }
    },

    // 将公共牌移至目标位置并更新牌型
    _arrangeOpenCards(cardCount, data, callback) {
        let self = this;

        for (let i = 1; i <= cardCount; i++) {
            let flyPoker = self.cards.getChildByName("" + i);
            let posPoker = self.cards.getChildByName("pos" + i);

            if (!flyPoker || !posPoker) continue;

            let posTarget = TexasUtils._getNodePos(posPoker, flyPoker);
            let move = cc.moveTo(0.05 * i, posTarget.x, posTarget.y);

            // 最后一张移动完成后更新牌型和回调
            if (i === cardCount) {
                flyPoker.runAction(cc.sequence(move, cc.callFunc(() => {
                    // 显示所有翻开的牌
                    for (let j = 1; j <= cardCount; j++) {
                        let poker = self.cards.getChildByName(j + "");
                        if (poker) {
                            // poker.stopAllActions();
                            // poker.opacity = 255;
                        }
                    }

                    TexasUtils._setDzFrameRate(30);
                    self._updateCardType(data, 0);
                    self._isRunAction = false;
                    // self._initFlyCardsAction();

                    if (callback) callback();
                })));
            } else {
                flyPoker.runAction(move);
            }
        }
    },



    //新增公共牌
    _addOpenSinglePoker(arry, callback, data) {
        cc.log("新增公共牌 arry,data:", arry, data);

        let self = this;

        let pokerArry = self._cardValue;
        let pokerLen = pokerArry.length;
        this.index = pokerLen <= 0 ? 1 : pokerLen + 1;

        if (arry && arry.length > 0) {
            let addCardLen = arry.length;

            if (addCardLen == 5) {
                for (let index = 0; index < arry.length; index++) {
                    let poker = this.cards.getChildByName((index + 1) + "");
                    poker.scale = 1
                    poker.color = new cc.Color(255, 255, 255);
                    poker.opacity = 255
                    poker.stopAllActions();
                    console.log(`设置牌数值 `, arry);
                    TexasUtils._getCardType(poker, arry[index]);
                    poker.active = true;
                }
            } else if (addCardLen == 3) {
                //不想改了，直接添加
                this._cardValue.push(arry[0]);
                this._cardValue.push(arry[1]);
                this._cardValue.push(arry[2]);

                let posTarget = this.cards.getChildByName("pos1")
                this._openCardsOpacityAni(posTarget, () => {
                    this._openCard(arry, data, callback);
                })
            } else if (addCardLen == 2) {
                for (let index = 0; index < arry.length; index++) {
                    let poker = this.cards.getChildByName((index + 4) + "");
                    poker.scale = 1
                    poker.opacity = 255
                    poker.color = new cc.Color(255, 255, 255);
                    poker.stopAllActions();
                    TexasUtils._getCardType(poker, arry[index]);
                    poker.active = true;
                }
            } else if (addCardLen == 1) {
                if (callback) {

                    self.openSinglePoker(self.index, arry[0], false, function () {
                        self._updateCardType(data, 2);
                        if (callback) {
                            callback();
                        }
                    });


                } else {
                    let poker = this.cards.getChildByName("5");
                    poker.scale = 1
                    poker.opacity = 255
                    poker.color = new cc.Color(255, 255, 255);
                    poker.stopAllActions();
                    TexasUtils._getCardType(poker, arry[0]);
                    poker.active = true;
                }

            }

        }
    },

    //开始发牌
    _startFaPai(time) {
        cc.log("开始发牌:", time);

        let self = this;

        time = time ? time : 0;

        self.commonCard.destroyAllChildren();

        let fapaiPrefab = cc.instantiate(self.itemFaPaiPrefab);
        fapaiPrefab.parent = self.commonCard;
        fapaiPrefab.active = true;

        let animation = fapaiPrefab.getComponent(cc.Animation);

        animation.on('finished', function (type, state) {
            for (let i = 1; i <= 5; i++) {
                let poker = self.cards.getChildByName(i + "");
                poker.stopAllActions();

                if (TexasUtils._getSkin(["b"])) {
                    poker.scale = 1.1;
                } else if (TexasUtils._getSkin(["c"])) {
                    poker.scale = 1;
                } else {
                    poker.scale = 1;
                }

                TexasUtils._getCardType(poker);
                poker.color = new cc.Color(255, 255, 255);
                poker.opacity = 255;
                poker.active = true;
            }

            fapaiPrefab.destroy();
        }.bind(this));

        if (animation) {
            animation.setCurrentTime(time);

            animation.play("flyCardAnim");
        }
    },

    //定时器
    _scheduleTime(callback, isStart, time) {
        if (cc.director.getScheduler().isScheduled(callback, this)) {
            cc.director.getScheduler().unschedule(callback, this);
        }

        if (isStart) {
            cc.director.getScheduler().schedule(callback, this, time, false);
        }
    },

    //更新飞公共牌
    _updateFlyCommonCards() {
        this.index += 1;//座位

        this.commonCardsSchedule(this.index);
    },

    //公共牌
    commonCardsSchedule(index) {
        let gameState = TexasData._getGameState();//游戏阶段
        if (gameState != 1) return;

        let self = this;

        self.index = index;

        if (index <= 5) {
            let poker = cc.instantiate(self.pokerBackPrefab);
            poker.parent = self.cards;
            poker.name = "FlyPoker_" + index;

            // let poker = self.cards.getChildByName(index + "");
            let posPoker = self.cards.getChildByName("pos1");

            poker.stopAllActions();

            if (TexasUtils._getSkin(["b"])) {
                poker.scale = 1.1;
            } else if (TexasUtils._getSkin(["c"])) {
                poker.scale = 1;
            } else {
                poker.scale = 1;
            }

            let posStart = TexasUtils._getNodePos(self.commonCard, poker);
            let posTarget = TexasUtils._getNodePos(posPoker, poker);
            poker.x = posStart.x;
            poker.y = posStart.y;
            TexasUtils._getCardType(poker);
            poker.color = new cc.Color(255, 255, 255);
            poker.opacity = 255;
            poker.active = true;

            var actionMove = cc.moveTo(0.1, posTarget.x, posTarget.y);

            TexasUtils._setDzFrameRate(60);
            poker.runAction(cc.sequence(actionMove, cc.delayTime(0.4), cc.callFunc(function (args) {
                if (index == 5) {
                    self._moveCard(2, 5);
                }
            })));

            self._scheduleTime(self._updateFlyCommonCards, true, 0.1);
        } else {
            self._scheduleTime(self._updateFlyCommonCards);

            return;
        }
    },

    //展开派发每张牌
    _moveCard(index, maxIndex) {
        if (index > maxIndex) {
            // let tPreOpOption = TexasData._getPrimaryData();

            // if (tPreOpOption) {
            //     this.TexasOperatePanel._initOperatePanel(tPreOpOption,2);
            // }

            TexasUtils._setDzFrameRate(30);

            for (let i = 1; i <= 5; i++) {
                let poker = this.cards.getChildByName(i + "");
                poker.stopAllActions();

                if (TexasUtils._getSkin(["b"])) {
                    poker.scale = 1.1;
                } else if (TexasUtils._getSkin(["c"])) {
                    poker.scale = 1;
                } else {
                    poker.scale = 1;
                }

                TexasUtils._getCardType(poker);
                poker.color = new cc.Color(255, 255, 255);
                poker.opacity = 255;
                poker.active = true;
            }

            this._initFlyCardsAction();

            return;
        }

        let self = this;

        self.moveIndex = index;
        self.moveMaxIndex = maxIndex;

        for (let i = self.moveIndex; i <= self.moveMaxIndex; i++) {
            // let pokerItem = self.cards.getChildByName(i + "");

            let pokerItem = self.cards.getChildByName("FlyPoker_" + i);
            if (pokerItem) {
                let posPokerItem = self.cards.getChildByName("pos" + self.moveIndex);

                let posPokerItemTarget = TexasUtils._getNodePos(posPokerItem, pokerItem);
                var actionMoves = cc.moveTo(0.1, posPokerItemTarget.x, posPokerItemTarget.y);

                pokerItem.stopAllActions();
                pokerItem.runAction(cc.sequence(actionMoves, cc.callFunc(function (args) {
                    if (i == self.moveMaxIndex) {
                        self.moveIndex++;

                        self._moveCard(self.moveIndex, self.moveMaxIndex);
                    }
                })));
            }

        }
    },

    //刷新牌型
    _updateCardType(data, index) {
        let info = UserInfo.getInfo();

        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let dataItem = data[i];
                let nPos = dataItem.nPos;
                let arrCardType = dataItem.arrCardType;

                let nSeat = this.TexasPlayerController._getSeat("nSitId", nPos);
                let texasPlayer = this.TexasPlayerController._getTexasPlayer(nSeat);

                if (texasPlayer && arrCardType && arrCardType[index]) {
                    cc.log("新增公共牌 arrCardType,index:", arrCardType, index);
                    cc.log("updateCardType4");
                    texasPlayer.updateCardType(arrCardType[index]);
                }

            }


        }
    },

    //翻开单张牌
    openSinglePoker(index, cardValue, isLink, callback) {
        cc.log("翻开单张牌 index, cardValue, isLink:", index, cardValue, isLink);


        let poker = this.cards.getChildByName(index + "");

        if (poker) {
            if (cardValue != 0) {
                this._cardValue.push(cardValue);
            }


            if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                poker.width = this.smallCard.width;
                poker.height = this.smallCard.height;
                poker.skewX = 0;
            }

            poker.color = new cc.Color(255, 255, 255);

            poker.opacity = isLink === 1 ? 0 : 255;

            poker.stopAllActions();

            if (isLink) {
                if (TexasUtils._getSkin(["b"])) {
                    poker.scale = 1.1;
                } else if (TexasUtils._getSkin(["c"])) {
                    poker.scale = 1;
                } else {
                    poker.scale = 1;
                }

                TexasUtils._getCardType(poker, cardValue);
            } else {
                let nScale = 1;
                if (TexasUtils._getSkin(["b"])) {
                    nScale = 1.1;
                } else if (TexasUtils._getSkin(["c"])) {
                    nScale = 1;
                }

                let setPokerFun = cc.callFunc(function () {
                    TexasUtils._getCardType(poker, cardValue);
                }, this)

                let setPokerCallBack = cc.callFunc(function () {
                    if (callback) {
                        callback();
                    }
                }, this)

                if (TexasUtils._getClub()) {
                    let time = 0.5;
                    poker.scale = 0;
                    if (this._isRunAction || this._isRunAction2) {
                        time = 0.9;
                    }
                    let delay = cc.delayTime(time);
                    let setPokerFunScale = cc.callFunc(function () {
                        console.log("setPokerFunScale ");

                        this._isRunAction2 = false;
                        poker.scale = 1;
                        poker.opacity = 255
                        poker.y = 0
                        let opacityCard = this.cards.getChildByName("opacityCard")
                        if (opacityCard) {
                            opacityCard.active = false
                        }
                    }, this)
                    this._isRunAction2 = true;

                    let showOpacityCard = cc.callFunc(() => {
                        this._openCardsOpacityAni(poker);
                    }, this);
                    poker.runAction(cc.sequence(delay, showOpacityCard, cc.delayTime(0.2), setPokerFunScale, cc.scaleTo(0.1, 0, nScale), setPokerFun, cc.scaleTo(0.05, nScale, nScale), cc.delayTime(0.2), setPokerCallBack));
                    return;
                }

                poker.runAction(cc.sequence(cc.delayTime(0.3), cc.scaleTo(0.1, 0, nScale), setPokerFun, cc.scaleTo(0.05, nScale, nScale), cc.delayTime(0.1), setPokerCallBack));
            }


        }
    },

    //显示保险赢特效
    _showCardInsureWinEffect(index) {
        if (!index || index <= 0) return;
        let poker = this.cards.getChildByName(index + "");
        let insureWinNode = poker.getChildByName("shandian");

        if (insureWinNode) {
            TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "insureWin");//播放闪电音效
            insureWinNode.active = true;
            let anim = insureWinNode.getComponent(sp.Skeleton);
            if (anim) {
                anim.setAnimation(0, "in", false);
            }
        }
    },

    //扑克
    _onRepPokers() {
        let value = this._getValue();

        for (let i = 1; i <= 5; i++) {
            let poker = this.cards.getChildByName(i + "");

            let cardItem = 0;
            for (let j = 0; j < value.length; j++) {
                if (i - 1 == j) {
                    cardItem = value[j];

                    break;
                }
            }

            TexasUtils._getCardType(poker, cardItem);
        }

        let cardsChild = this.cards.children;
        if (cardsChild && cardsChild.length > 0) {
            for (let i = 0; i < cardsChild.length; i++) {
                let child = cardsChild[i];
                let name = child.name.toString();

                if (name.indexOf("FlyPoker_") != -1) {//包含字符串
                    TexasUtils._getCardType(child);
                }
            }
        }
    },

    //获得当前已有牌值
    _getValue() {
        return this._cardValue;
    },

});
