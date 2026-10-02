// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils = require("Utils");
let Base64 = require("base64");
const i18n = require('i18n');
let UserInfo = require("UserInfo");
let TexasUtils = require("TexasUtils");
let TexasData = require("TexasData");

cc.Class({
    extends: cc.Component,

    properties: {
        // spriteHead: cc.Sprite,//头像

        card: cc.Node,//牌
        box: cc.Node,//框
        layout: cc.Node,
        qpBox: cc.Node,//弃牌框
        qiPai: cc.Node,//弃牌
        commonCards: cc.Node,//公共牌
        //icon: cc.Node,//icon
        texasPoker: cc.Node,//扑克节点
        // sBank: cc.Node,//icon

        sName: cc.Label,//姓名
        sOperate: cc.Label,//操作
        sScore: cc.Label,//分数
        sInsureBuy: cc.Label, //保险购买
        sInsureWin: cc.Label, //保险赔付
        sSeat: cc.Sprite,//座位

        itemCardItemPrefab: {//牌预制
            default: null,
            type: cc.Prefab,
        },

        atlasPoker: {
            default: null,
            type: cc.SpriteAtlas,
        },

        atlasPoints:
        {
            default: null,
            type: cc.SpriteAtlas,
        },

        atlasFlowers: {
            default: null,
            type: cc.SpriteAtlas,
        },

        iconSpriteFrame: {
            default: [],
            type: cc.SpriteFrame
        },

        pokerBack: cc.SpriteFrame,//卡背
        winBg: cc.Sprite,
        _operate: 0,


        _data: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },



    showAllCommunityCards(data) {
        let commonCards = this.commonCards.children;
        for (let index = 0; index < 5; index++) {
            const card = commonCards[index];
            if (!commonCards[index]) {
                card = cc.instantiate(this.texasPoker);
                card.parent = this.commonCards;
            }
            let block = card.getChildByName("block");
            block.active = false
            let point_sprite = card.getChildByName("point").getComponent(cc.Sprite);
            let flower_sprite = card.getChildByName("flower").getComponent(cc.Sprite);
            let allCommunityCards = data.allCommunityCards[index];
            let x16 = 0x10;
            let x10 = x16.toString(10);//16进制转10进制
            let point = allCommunityCards % x10;//点数
            let flower = parseInt(allCommunityCards / x10);//花色
            let pointType = (flower == 2 || flower == 4) ? 1 : 2;
            let imgpoint = this.atlasPoints.getSpriteFrame(`point_${pointType}_${point}`);
            let imgflower = this.atlasFlowers.getSpriteFrame("flower_" + flower);
            card.active = false;
            if (imgpoint != null && imgflower != null) {
                point_sprite.spriteFrame = imgpoint;
                flower_sprite.spriteFrame = imgflower;
                card.active = true;
            }
        }
    },


    showAllPlayerCards(data) {
        if (!data.arrHoleCards || data.arrHoleCards.length == 0) {
            return
        }
        let len = data.arrHoleCards.length;
        for (let i = 0; i < len; i++) {//牌
            let card = this.layout.getChildByName("card" + (i + 1));
            let point_sprite = card.getChildByName("point").getComponent(cc.Sprite);
            let flower_sprite = card.getChildByName("flower").getComponent(cc.Sprite);
            let block = card.getChildByName("block");
            block.active = false
            let arrHoleCards = data.arrHoleCards[i];
            let x16 = 0x10;
            let x10 = x16.toString(10);//16进制转10进制
            let point = arrHoleCards % x10;//点数
            let flower = parseInt(arrHoleCards / x10);//花色
            let pointType = (flower == 2 || flower == 4) ? 1 : 2;
            let imgpoint = this.atlasPoints.getSpriteFrame(`point_${pointType}_${point}`);
            let imgflower = this.atlasFlowers.getSpriteFrame("flower_" + flower);
            card.active = false;
            if (imgpoint != null && imgflower != null) {
                point_sprite.spriteFrame = imgpoint;
                flower_sprite.spriteFrame = imgflower;
                card.active = true;
            }
            let nullCard = this.layout.getChildByName("nullCard");
            nullCard.active = false;
        }

    },

    // update (dt) {},

    createReviewItem: function (data, noQiPaiNum, lookData, gameid) {
        cc.log("createReviewItem data:", data, gameid);
        let info = UserInfo.getInfo();

        this._data = data;
        // let nGame = TexasData._getGame();
        // if (nGame==3 && !TexasData.isMTTMatch()) {
        //     let nCardType = data.nCardType;
        //     if (nCardType==6 || nCardType==7) {
        //         data.nCardType = nCardType==6?7:6;
        //     }
        // }

        let nullBox = this.layout.getChildByName("nullCard");

        // this.sBank.active = data.isBanker;//庄家标识
        this.sName.string = Utils.getShortText(Base64.decode(data.sName), 6);//玩家名
        let color = "#E8DFD1";
        if (info.nUserID == data.nUserId) {
            color = "#86b5f6"
        }

        //玩家保险购买金额
        this.sInsureBuy.node.active = true
        if (data.nInsureBuy) {
            this.sInsureBuy.string = "-" + TexasUtils._saveTwoPoint(data.nInsureBuy);
        } else {
            this.sInsureBuy.string = "";
        }

        //玩家保险赔付金额
        this.sInsureWin.node.active = true
        if (data.nInsureWin) {
            let colorInsure = "#F9D354";
            if (data.nInsureWin < 0) {
                colorInsure = "#ef4343";
            }
            if (data.nInsureWin > 0) {
                this.sInsureWin.string = "+" + TexasUtils._saveTwoPoint(data.nInsureWin);
                TexasUtils._setColor(this.sInsureWin.node, colorInsure);
            } else {
                this.sInsureWin.string = TexasUtils._saveTwoPoint(data.nInsureWin);
                TexasUtils._setColor(this.sInsureWin.node, colorInsure);
            }
        } else {
            this.sInsureWin.string = "";
        }

        //let niming = this.node.getChildByName("niming");
        TexasUtils._setColor(this.sName.node, color);
        //TexasUtils._setColor(niming,color);
        //niming.active = false;
        this.sName.node.active = true;
        this._setScore(data.nTotolWin);//分数 拆分为剪掉保险
        this.winBg.node.active = data.nTotolWin > 0;
        let isQiPai = false;
        let operate = data.operate;//操作
        for (let i = 0; i < operate.length; i++) {
            let nOperate = operate[i].nOperate;

            if (nOperate == -5) {
                isQiPai = true;

                break;
            }
        }

        if (!Utils.clone(data.arrCombinedCards) && !Utils.clone(data.arrHoleCards)) {
            isQiPai = true;
        }

        let commonCard = Utils.clone(data.arrCombinedCards);

        for (let i = 1; i <= 4; i++) {//牌
            let card = this.layout.getChildByName("card" + i);
            card.active = false;
        }

        if (data.arrHoleCards) {
            if (info.nUserID == data.nUserId) {

                let commcardsLen = Utils.clone(data.arrCommunityCards).length;

                let len = data.arrHoleCards.length;

                for (let i = 0; i < len; i++) {//牌
                    let card = this.layout.getChildByName("card" + (i + 1));
                    let block = card.getChildByName("block");
                    let point_sprite = card.getChildByName("point").getComponent(cc.Sprite);
                    let flower_sprite = card.getChildByName("flower").getComponent(cc.Sprite);

                    let arrHoleCards = data.arrHoleCards[i];

                    let x16 = 0x10;
                    let x10 = x16.toString(10);//16进制转10进制
                    let point = arrHoleCards % x10;//点数
                    let flower = parseInt(arrHoleCards / x10);//花色
                    // let imgframe = this.atlasPoker.getSpriteFrame("texas_" + point + "_" + flower);

                    // card.active = false;
                    // if (imgframe!=null) {
                    //     card.getComponent(cc.Sprite).spriteFrame = imgframe;
                    //     card.active = true;
                    // }

                    let pointType = (flower == 2 || flower == 4) ? 1 : 2;
                    let imgpoint = this.atlasPoints.getSpriteFrame(`point_${pointType}_${point}`);
                    let imgflower = this.atlasFlowers.getSpriteFrame("flower_" + flower);
                    card.active = false;
                    if (imgpoint != null && imgflower != null) {
                        point_sprite.spriteFrame = imgpoint;
                        flower_sprite.spriteFrame = imgflower;
                        card.active = true;
                    }

                    // TexasUtils._getCardType(card,arrHoleCards);

                    block.active = isQiPai;
                    if (!isQiPai && commonCard) {
                        block.active = true;
                        for (let j = 0; j < commonCard.length; j++) {
                            let cardItem = commonCard[j];

                            if (Number(arrHoleCards) == Number(cardItem) && commcardsLen >= 3) {
                                block.active = false;

                                break;
                            }

                        }
                    }

                    let nullCard = this.layout.getChildByName("nullCard");
                    nullCard.active = !card.active;

                    this.layout.getComponent(cc.Layout).spacingX = len == 2 ? 3 : -10;
                }
            } else {

                let commcardsLen = Utils.clone(data.arrCommunityCards).length;
                cc.log("data.arrCommunityCards:", Utils.clone(data.arrCommunityCards));
                let openCard = false;
                if (commcardsLen == 5) {
                    openCard = true;
                }
                if (noQiPaiNum == 1) {
                    openCard = false;
                }
                if (!isQiPai && openCard) {
                    let len = data.arrHoleCards.length;
                    for (let i = 0; i < len; i++) {//牌
                        let card = this.layout.getChildByName("card" + (i + 1));
                        let block = card.getChildByName("block");
                        let point_sprite = card.getChildByName("point").getComponent(cc.Sprite);
                        let flower_sprite = card.getChildByName("flower").getComponent(cc.Sprite);

                        let arrHoleCards = data.arrHoleCards[i];

                        let x16 = 0x10;
                        let x10 = x16.toString(10);//16进制转10进制
                        let point = arrHoleCards % x10;//点数
                        let flower = parseInt(arrHoleCards / x10);//花色
                        // let imgframe = this.atlasPoker.getSpriteFrame("texas_" + point + "_" + flower);

                        // card.active = false;
                        // if (imgframe!=null) {
                        //     card.getComponent(cc.Sprite).spriteFrame = imgframe;
                        //     card.active = true;
                        // }
                        // TexasUtils._getCardType(card,arrHoleCards);

                        let pointType = (flower == 2 || flower == 4) ? 1 : 2;
                        let imgpoint = this.atlasPoints.getSpriteFrame(`point_${pointType}_${point}`);
                        let imgflower = this.atlasFlowers.getSpriteFrame("flower_" + flower);
                        card.active = false;
                        if (imgpoint != null && imgflower != null) {
                            point_sprite.spriteFrame = imgpoint;
                            flower_sprite.spriteFrame = imgflower;
                            card.active = true;
                        }

                        block.active = isQiPai;
                        if (!isQiPai && commonCard) {
                            block.active = true;
                            for (let j = 0; j < commonCard.length; j++) {
                                let cardItem = commonCard[j];

                                if (Number(arrHoleCards) == Number(cardItem) && card.active) {
                                    block.active = false;

                                    break;
                                }

                            }
                        }

                        let nullCard = this.layout.getChildByName("nullCard");
                        nullCard.active = !card.active;

                        this.layout.getComponent(cc.Layout).spacingX = len == 2 ? 3 : -10;
                    }
                } else {
                    let nullCard = this.layout.getChildByName("nullCard");
                    nullCard.active = true;
                }
            }
        } else {
            let nullCard = this.layout.getChildByName("nullCard");
            nullCard.active = true;
        }

        // let qp = this.qpBox.getChildByName("qp");//弃牌
        // qp.getComponent(cc.Label).string = TexasUtils._getText(21);
        let label = this.node.getChildByName("layout").getChildByName("label_paixing");

        if (isQiPai) {
            // if (data.isShowCardWhenEnd && Number(data.nCardType)>0) {
            //     label.getComponent(cc.Label).lang = "cardType." + data.nCardType;
            // }else {
            label.getComponent(cc.Label).lang = "弃牌";
            // }
        } else {
            let clubGameConfig = require("clubGameConfig");

            if (noQiPaiNum == 1 && info.nUserID != data.nUserId) {
                label.getComponent(cc.Label).lang = "";
                label.active = false
            } else {
                let cardTypeList = {
                    1: "高牌",
                    2: "一对",
                    3: "两对",
                    4: "三条",
                    5: "顺子",
                    6: "同花",
                    7: "葫芦",
                    8: "四条",
                    9: "同花顺",
                    10: "皇家同花顺"
                }
                if (gameid == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) { //短牌德州
                    cardTypeList = {
                        1: "高牌",
                        2: "一对",
                        3: "两对",
                        4: "三条",
                        5: "顺子",
                        6: "葫芦",
                        7: "同花",
                        8: "四条",
                        9: "同花顺",
                        10: "皇家同花顺"
                    }
                }
                label.getComponent(cc.Label).lang = cardTypeList[data.nCardType] || "";
            }

        }

        // this.box.active = !isQiPai;//框
        // this.qpBox.active = isQiPai;//弃牌框

        // this._operate = 0;
        // this.sOperate.active = false;
        // this._setOperate(Utils.clone(data.operate),this.sOperate);

        this.commonCards.destroyAllChildren();
        let arrCommunityCards = Utils.clone(data.arrCommunityCards);
        for (let i = 0; i < arrCommunityCards.length; i++) {
            let card = arrCommunityCards[i];

            let block = true;
            if (commonCard) {
                for (let j = 0; j < commonCard.length; j++) {//能组成最大牌型的5个牌
                    let cardItem = commonCard[j];

                    if (nullBox.active) {
                        if (!isQiPai) {
                            block = false;
                        }
                    } else {
                        if (Number(card) == Number(cardItem)) {
                            if (!isQiPai) {
                                block = false;
                            }

                            break;
                        }
                    }

                    // if (isQiPai) {
                    //     if (this._operate<data.operate.length) {
                    //        this._setCommonCards(data,cardItem);
                    //     }
                    // }else {
                    //     this._setCommonCards(data,cardItem);
                    // }
                }
            } else {
                block = false;
            }

            this._setCards(this.commonCards, card, block);
        }


        // this.scheduleOnce(()=>{
        //     Utils.changeUserHead(this.spriteHead,data.sFaceId);//玩家头像
        // },0)


        // lookData =  [{"nUserId": 111,"nType":1},{"nUserId": 111,"nType":2}]; //ttest
        this.updateShowCards(data, lookData);
    },



    //更新偷偷看，发发看，打开牌展示
    updateShowCards(data, lookData) {
        let isShowAllCommunityCards = false //是否展示全部公牌
        let isShowAllPlayerCards = false //是否展示全部玩家手牌
        let info = UserInfo.getInfo();
        for (let i = 0; i < lookData.length; i++) {
            if (lookData[i].nType == 1 && lookData[i].nUserId == info.nUserID) {
                isShowAllCommunityCards = true
            } else if (lookData[i].nType == 2 && lookData[i].nUserId == info.nUserID) {
                isShowAllPlayerCards = true
            }
        }
        for (let index = 0; index < data.length; index++) {
            const element = array[index];
            
        }
        if (isShowAllCommunityCards) {
            this.showAllCommunityCards(data);
        }
        if (isShowAllPlayerCards) {
            this.showAllPlayerCards(data);
        }

    },



    _setSeatIcon(iconStr, isGrey, iconSpriteFrame) {
        let index = 0;
        if (iconStr === "BTN") {
            index = !isGrey ? 0 : 9;
        } else if (iconStr === "SB") {
            index = !isGrey ? 1 : 10;
        } else if (iconStr === "BB") {
            index = !isGrey ? 2 : 11;
        } else if (iconStr === "UTG") {
            index = !isGrey ? 3 : 12;
        } else if (iconStr === "UTG1") {
            index = !isGrey ? 4 : 13;
        } else if (iconStr === "UTG2") {
            index = !isGrey ? 5 : 14;
        } else if (iconStr === "MP") {
            index = !isGrey ? 6 : 15;
        } else if (iconStr === "HJ") {
            index = !isGrey ? 7 : 16;
        } else if (iconStr === "CO") {
            index = !isGrey ? 8 : 17;
        } else {
            // 未知位置，隐藏
            if (this.sSeat && this.sSeat.node) this.sSeat.node.active = false;
            return;
        }

        if (iconSpriteFrame[index]) {
            this.sSeat.spriteFrame = iconSpriteFrame[index];
            this.sSeat.node.active = true;
        } else {
            // 资源未配置则隐藏
            this.sSeat.node.active = false;
        }
    },

    _setCards(node, cardItem, isQiPai) {
        let pokerItem = cc.instantiate(this.texasPoker);
        pokerItem.parent = node;
        let point_sprite = pokerItem.getChildByName("point").getComponent(cc.Sprite);
        let flower_sprite = pokerItem.getChildByName("flower").getComponent(cc.Sprite);
        let x16 = 0x10;
        let x10 = x16.toString(10);//16进制转10进制
        let point = cardItem % x10;//点数
        let flower = parseInt(cardItem / x10);//花色
        // let imgframe = this.atlasPoker.getSpriteFrame("texas_" + point + "_" + flower);
        // if (imgframe!=null) {
        //     pokerItem.getComponent(cc.Sprite).spriteFrame = imgframe;
        // }

        let pointType = (flower == 2 || flower == 4) ? 1 : 2;
        let imgpoint = this.atlasPoints.getSpriteFrame(`point_${pointType}_${point}`);
        if (imgpoint != null) {
            point_sprite.spriteFrame = imgpoint;
        }

        let imgflower = this.atlasFlowers.getSpriteFrame("flower_" + flower);
        if (imgflower != null) {
            flower_sprite.spriteFrame = imgflower;
        }

        let block = pokerItem.getChildByName("block");
        block.active = isQiPai;
        pokerItem.active = true;
    },

    _setCommonCards(data, cardItem) {
        let reviewItem = cc.instantiate(this.itemCardItemPrefab);
        reviewItem.parent = this.commonCards;

        let cardChild = reviewItem.children;
        for (let j = 0; j < cardChild.length; j++) {
            let card = cardChild[j];
            card.active = false;

            for (let k = 0; k < cardItem.length; k++) {
                let nCard = cardItem[k];
                if (j == k) {
                    let nCardItem = card.getChildByName("cardItem");
                    let bet = card.getChildByName("bet");
                    bet.active = false;

                    TexasUtils._getCardType(nCardItem, nCard);

                    if (j == 0) {
                        this._setOperate(Utils.clone(data.operate), bet.getComponent(cc.Label));
                    }

                    card.active = true;
                    break;
                }
            }

        }
        reviewItem.active = true;
    },

    _setScore(nProfit) {
        this.sScore.string = Number(nProfit) > 0 ? "+" + TexasUtils._saveTwoPoint(nProfit) : TexasUtils._saveTwoPoint(nProfit);

        let color16 = "#50ea7f";
        if (Number(nProfit) < 0) {
            color16 = "#ef4343";
        }
        TexasUtils._setColor(this.sScore.node, color16);
    },

    _setOperate(operate, label) {
        if (operate[this._operate] && operate.length > 0) {
            let nOperate = operate[this._operate].nOperate;
            let nBet = operate[this._operate].nBet;

            //  -5:弃牌,  -1:AllIn, -2:让牌, -3:加注 -6:跟注
            let bet = nBet ? TexasUtils._saveTwoPoint(nBet) : "";
            let text = TexasUtils._getText(54) + bet;

            let color = "#e8dfd1";
            if (nOperate == -1) {
                text = "AllIn" + bet;
                color = "#ff1e43";
            } else if (nOperate == -2) {
                text = TexasUtils._getText(22) + bet;
            } else if (nOperate == -3) {
                text = TexasUtils._getText(19) + bet;
                color = "#faa537";
            } else if (nOperate == -5) {
                text = TexasUtils._getText(21) + bet;
                color = "#65778b";
            } else if (nOperate == -6) {
                text = TexasUtils._getText(23) + bet;
                color = "#00ff86";
            }

            this._operate++;
            label.string = text;
            label.node.active = true;
            TexasUtils._setColor(label.node, color);
        }

    },

    showLine() {
        cc.log("showLine11111111111111")
        if (this.node.getChildByName("line")) {
            this.node.getChildByName("line").active = true
        }
    },

});
