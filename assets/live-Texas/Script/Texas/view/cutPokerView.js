
const easing = "cubicOut";
let TexasConfig = require("TexasConfig");
let TexasUtils = require("TexasUtils");
let TexasMusicPath = TexasConfig.TEXASMUSICPATH;
cc.Class({
    extends: cc.Component,

    properties: {
        cardNode: cc.Node,
        cardsParent: cc.Node,

        redCardBack: cc.Node,
        pokerHandle: cc.Node,
        allCardPile: cc.Node,
        cutTip: cc.Node,

        slider: cc.Slider,


        _control: null,

        _isReqOver: true,

        _gapIndex: 0, //选择切牌插入位置
    },

    onLoad() {
        this.cards = [];
        this.topPilePos = cc.v2(0, 570);
        this.bottomPilePos = cc.v2(0, 65);


        this.slider.node.on("slide", () => {
            let gapIndex = Math.floor(this.cards.length * this.slider.progress);
            this.layoutWithGap(gapIndex);
        });


        // this.slider.node.on(cc.Node.EventType.TOUCH_END,this.onSliderTouchEnd, this);
        // this.slider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        this.slider.handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        this.slider.handle.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
    },

    onDestroy() {


    },



    start() {
        // this.createPile();
    },


    clearCutTimer() {
        let node = this.cutTip.getChildByName("time");
        if (node._standUpTimer) {
            clearInterval(node._standUpTimer);
            node._standUpTimer = null;
        }
    },


    setCutTipTime(time) {
        let resRemainTime = time;
        this.cutTip.active = true;
        let node = this.cutTip.getChildByName("time");
        node.getComponent(cc.Label).string = "(" + resRemainTime + ")";
        if (node._standUpTimer) {
            this.clearCutTimer();
        }
        console.log(`resRemainTime22 : ` + resRemainTime);
        node._standUpTimer = setInterval(() => {
            resRemainTime--;
            if (resRemainTime <= 0) {
                if (!node || !cc.isValid(node)) return
                if (!node.getComponent(cc.Label)) return
                node.getComponent(cc.Label).string = "(0)";
                // this.hideCutPokerView();
                // this.reqCutCardOver();
                this.onSliderTouchEnd()
            } else {
                console.log(`resRemainTime 11: ` + resRemainTime);
                if (!node || !cc.isValid(node)) return
                if (!node.getComponent(cc.Label)) return
                node.getComponent(cc.Label).string = "(" + resRemainTime + ")";
            }
        }, 1000);
    },



    showCutPokerPanel(control) {
        this._isReqOver = false;
        this._control = control;
        this.node.active = true;
        this._gapIndex = 0;
        this.createPile();
    },


    //手动清理所以残留的tween动画
    clearAllTweens() {
        cc.Tween.stopAllByTarget(this.redCardBack);
        cc.Tween.stopAllByTarget(this.cardsParent);
        cc.Tween.stopAllByTarget(this.allCardPile);

        // 卡牌列表全部处理
        if (this.cards) {
            this.cards.forEach(card => cc.Tween.stopAllByTarget(card));
        }
    },


    hideCutPokerView() {
        this.clearAllTweens();
        this.clearCutTimer();
        this.node.active = false;
    },


    onSliderTouchEnd() {
        let gapIndex = Math.floor(this.cards.length * this.slider.progress);
        this.insertHandleThenCut(gapIndex);
    },





    reqCutCardOver() {
        if (this._isReqOver) {
            return;
        }
        this._isReqOver = true;
        this._control.TexasOperatePanel.reqCutCardOver(this._gapIndex);
    },


    /**
     * 平滑布局卡牌，gapIndex 后保留空位
     */
    layoutWithGap(gapIndex) {
        let mid = Math.floor(this.cards.length / 2);
        this.pokerHandle.getChildByName("num").getComponent(cc.Label).string = gapIndex.toString();
        this._gapIndex = gapIndex
        this.cards.forEach((card, i) => {
            let realIndex = i;
            let zIndex = 100 - i;
            if (i >= gapIndex) {
                realIndex++;
                zIndex = zIndex - 1
            }

            card.zIndex = zIndex;
            let offsetX = (realIndex - mid) * 15;
            cc.tween(card)
                .to(0.15, { x: offsetX, y: 0 }, { easing: easing })
                .start();
        });
    },

    initSlider() {
        this.slider.progress = 0.5;
        this.layoutWithGap(Math.floor(this.cards.length * 0.5));
    },


    initNode() {
        this.slider.node.active = false;
        this.cardsParent.active = false;
        this.pokerHandle.active = true;
        this.cardsParent.position = this.bottomPilePos;
        this.redCardBack.active = true;
        this.redCardBack.parent = this.pokerHandle
        this.redCardBack.position = cc.v2(160, 20);
    },

    /**
     * 创建牌堆
     */
    createPile() {
        this.initNode();
        this.cards = [];
        let nGameId = app.game.getGame().getSubGameID();
        // let nGameId = 125

        // 创建牌堆
        for (let i = 0; i < 52; i++) {
            let card = this.cardsParent.getChildByName(`card_${i}`);
            if (nGameId != 125 && i >= 36) {
                if (card) {
                    card.active = false;
                }
                continue;
            }
            if (!card) {
                card = cc.instantiate(this.cardNode);
            }
            card.parent = this.cardsParent;
            card.name = `card_${i}`;
            card.active = true;
            card.position = cc.v2(0, 0);
            this.cards.push(card);
        }
        this.allCardPile.position = this.topPilePos;
        this.allCardPile.active = true;
        cc.tween(this.allCardPile).to(0.4, { position: this.bottomPilePos }, { easing: easing }).call(() => {
            this.allCardPile.active = false;
            this.cardsParent.active = true;
            this.spreadCards();
        }).start();

    },


    // 横向散开牌动画
    spreadCards() {
        let mid = Math.floor(this.cards.length / 2);
        TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "cutPoker");
        this.cards.forEach((card, i) => {
            let offsetX = (i - mid) * 15; // 横向散开
            let targetPos = cc.v2(offsetX, 0);

            card.zIndex = 100 - i;
            cc.tween(card).to(0.4, { position: targetPos }, { easing: easing }).call(() => {
                if (i === this.cards.length - 1) {
                    this.slider.node.width = Math.abs(offsetX) * 2 - card.width;
                    this.slider.node.height = card.height;
                    this.slider.node.x = -100;
                    this.slider.node.y = -700;
                    this.slider.node.active = true;
                    this.initSlider();
                    cc.tween(this.slider.node).to(0.4, { y: this.cardsParent.y }, { easing: easing }).start();

                }
            }).start();

        });
        this.setCutTipTime(7);
    },


    moveFrontCards(curIndex) {
        for (let i = 0; i < curIndex; i++) {
            let card = this.cards[i];
            cc.tween(card).by(0.25, { position: cc.v2(0, 15) }).start();
        }
    },

    insertHandleThenCut(gapIndex) {
        this.pokerHandle.active = false;
        this.slider.node.active = false;
        // 找到 gap 的位置
        let mid = Math.floor(this.cards.length / 2);
        let realIndex = gapIndex;
        this._gapIndex = gapIndex;
        let offsetX = (realIndex - mid) * 15;
        let targetPos = cc.v2(offsetX, 0);
        this.redCardBack.parent = this.cardsParent;
        this.redCardBack.x = offsetX + 150;

        this.redCardBack.zIndex = 100 - gapIndex
        this.redCardBack.stopAllActions();

        // 插入动画：旋转 15° → 移动插入 → 淡出
        cc.tween(this.redCardBack).to(0.2, { angle: -15 }, { easing: "cubicOut" })
            .to(0.2, { x: targetPos.x, y: targetPos.y }, { easing: "cubicOut" })
            .to(0.1, { angle: 0 }, { easing: "cubicOut" })
            .call(() => {
                this.redCardBack.active = false;

                // 插入动画结束 → 开始切牌
                this.cutCards(gapIndex);
            })
            .start();
    },



    cutCards(gapIndex) {
        if (!this.cards || this.cards.length === 0) return;
        // if (gapIndex<= 0 || gapIndex >= this.cards.length) return;

        // 划分两叠
        let topStack = this.cards.slice(0, gapIndex);
        let bottomStack = this.cards.slice(gapIndex);

        // if (topStack.length === 0 || bottomStack.length === 0) return;

        const targetX = 0;

        let topFirstX = topStack.length === 0 ? bottomStack[bottomStack.length - 1].x : topStack[0].x;
        let bottomLastX = bottomStack.length === 0 ? topStack[0].x : bottomStack[bottomStack.length - 1].x;

        let topOffset = targetX - topFirstX;
        let bottomOffset = targetX - bottomLastX;
        topStack.forEach(c => { c.zIndex = 100; });
        const moveDuration = 0.5;
        topStack.forEach(card => {
            cc.tween(card)
                .to(moveDuration, { x: card.x + topOffset, y: 0 }, { easing })
                .start();
        });

        bottomStack.forEach(card => {
            cc.tween(card)
                .to(moveDuration, { x: card.x + bottomOffset, y: 0 }, { easing })
                .start();
        });

        this.scheduleOnce(() => {
            this.cards = bottomStack.concat(topStack);
            TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "cutPoker");
            this.cards.forEach((card, i) => {
                card.zIndex = i;
                cc.tween(card).to(0.3, { position: cc.v2(0, 0) }, { easing }).call(() => {
                    if (i === this.cards.length - 1) {
                        this.allCardPile.active = true;
                        this.cardsParent.active = false;
                        cc.tween(this.allCardPile).to(0.35, { position: this.topPilePos }, { easing }).call(() => {
                            this.reqCutCardOver();
                            this.hideCutPokerView();
                        }).start();
                    }
                }).start();
            });
        }, moveDuration + 0.02);
    }



});
