
let Utils = require("Utils");
let MSG = require("Msg_Texas");
let TexasUtils = require("TexasUtils");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let TexasData = require("TexasData");
let TexasPanelAction = require("TexasPanelAction");
let TexasRecordVideo = require("TexasRecordVideo");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let CLUBMSG = require("Msg_club");
let UIFrame = require("UIFrame");
let i18n = require("i18n");

let HallClubCacheData = require("HallClubCacheData")

let TexasConfig = require("TexasConfig");
let TexasMusicPath = TexasConfig.TEXASMUSICPATH;

let notifyInfo = [
    { notify: MSG.NOTIFY.NOTIFY_VIDEO_SCENE_RECONNECT, time: 1 },//场景重连 
    { notify: MSG.NOTIFY.NOTIFY_VIDEO_GAME_START, time: 2 },//游戏开始 
    { notify: MSG.NOTIFY.NOTIFY_VIDEO_GET_OPERATION, time: 1 },//操作权获得 
    { notify: MSG.NOTIFY.NOTIFY_VIDEO_USER_OPERATION, time: 1 },//有玩家操作通知 
    { notify: MSG.NOTIFY.NOTIFY_VIDEO_COMMON_CARDS, time: 2 },//公共牌 
    { notify: MSG.NOTIFY.NOTIFY_VIDEO_SETTLE, time: 3 },//结算  
    { notify: MSG.NOTIFY.NOTIFY_VIDEO_USER_STAND, time: 1 },//玩家站起 
]

cc.Class({
    extends: TexasPanelAction,

    properties: {
        TexasRecordVideo: TexasRecordVideo,

        list: cc.Node,//列表
        nInfo: cc.Node,//牌桌信息
        sliderBlock: cc.Node,//滑动禁用
        texasPoker: cc.Node,//扑克节点
        gameInfoItem: cc.Node,//游戏信息节点
        gameUserItem: cc.Node,//游戏玩家节点
        gameCardPuItem: cc.Node,//游戏牌谱节点
        insurePrefab: cc.Node,//游戏保险节点

        hashcardPrefab: cc.Node,//洗牌凭证
        replayNode: cc.Node, //回放

        sliderPage: cc.Slider,//滑动条

        nTableName: cc.Label,//牌桌名称
        nRecordNum: cc.Label,//牌局编号
        nNiMing: cc.Label,//匿名
        nTime: cc.Label,//时间
        nPool: cc.Label,//底池
        nPoolNum: cc.Label,//底池数
        nInsure: cc.Label,//保险
        nPage: cc.Label,//页数
        sliderNode: cc.Node,
        review: cc.Label,//数据

        itemReviewPrefab: {//牌局记录预制
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

        reviewTotal: cc.Node,

        _page: 0,
        _sumPage: 0,
        _nId: 0,
        _sliderProgress: 0,//滑动值
        _user: [],
        _sumData: null,

        _pageNum: 30,



        _allCommunityCards: null,//记录所有公牌（包括未展示牌）
        _userArrHoleCards: null,//记录玩家数据

        _gameId: 0,//游戏id

    },

    onLoad() {
        this.hide();
        this._offsetX = this.panelPosition.x;
    },

    start() {
        MsgManager.on(CLUBMSG.NOTIFY.ClubSHashListRsp_ui, this._onClubSHashList, this);
        MsgManager.on(CLUBMSG.NOTIFY.ClubSPlaybackDataResp_ui, this._onPlaybackData1, this);
    },

    onDestroy() {
        MsgManager.un(this._onClubSHashList);
        MsgManager.un(this._onPlaybackData1);
    },

    onEnable() {
        this.sliderPage.handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchCancel, this);
        this.sliderPage.handle.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        this.sliderPage.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchCancel, this);
        this.sliderPage.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
    },

    onDisable() {
        this.sliderPage.handle.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchCancel, this);
        this.sliderPage.handle.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        this.sliderPage.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchCancel, this);
        this.sliderPage.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        if (HallClubCacheData) {
            HallClubCacheData.savePlayBackData({});
        }
        cc.log('test TexasGameReview onDisable');
    },

    _setData(data) {
        cc.log("_setData:", data, data.arrPaiJuID);
        // this._sliderProgress = 0
        if (!this._sumData || typeof this._sumData !== 'object') {
            this._sumData = {};
        }

        if (Array.isArray(data.arrPaiJuID)) {
            data.arrPaiJuID.forEach((paiData, index) => {
                var sumDataIndex = (data.nNowPage - 1) * this._pageNum + index
                cc.log("sumDataIndex=", sumDataIndex)
                this._sumData[sumDataIndex] = paiData
            });
        } else {
            cc.warn("_setData: data.arrPaiJuID is not an array", data.arrPaiJuID);
        }

        this.review.string = TexasUtils._getText(108);
        this.review.node.active = false;
        this.sliderBlock.active = false;

        this.nNiMing.string = TexasUtils._getText(185);

        let nAllCnt = data.nAllCnt;//总数目
        this._sumPage = nAllCnt > 0 ? nAllCnt : 1;
        this.onSlidered({ progress: 0 });

        let minPage = this.sliderNode.getChildByName("minPage")
        let maxPage = this.sliderNode.getChildByName("maxPage")
        if (minPage) {
            minPage.getComponent(cc.Label).string = "1"
        }
        if (maxPage) {
            maxPage.getComponent(cc.Label).string = "" + this._sumPage
        }

        // if (this._sumData && this._sumData.length>0) {
        //     this.onSliderTouchEnd();
        // }else {
        //     this._page = 1;
        //     this.nPage.string = 1 +"";
        //     this._setDataByPage(1);
        // }
        // this.sliderNode.getChildByName('slider').getComponent(cc.Slider).progress = 0
        this._page = 1;
        this.nPage.string = 1 + "";
        this._setDataByPage(1);
    },

    _setDataByPage(page) {
        let self = this;
        if (Object.keys(self._sumData).length > 0) {
            let pageData = self._sumData[page - 1];

            if (!pageData) {
                this._showLoading();
                let tableId = TexasData._getCurTableId();
                let sendData = {}
                sendData.sTableId = tableId;
                sendData.nCnt = this._pageNum
                sendData.nPage = Math.ceil(page / this._pageNum)
                app.club.getTalblePaiJuIdList(sendData, (data) => {
                    this._hideLoading();
                    this._setData(data);
                });//获取牌桌牌局id列表
                return;
            }

            self._nId = pageData.nId;
            let sPaiJuID = pageData.sPaiJuID;

            if (TexasUtils._getClub()) {
                app.club.getPlayBackData(sPaiJuID, function (nData) {
                    self._freshData(nData);
                });
            }
        } else {
            self.sliderBlock.active = true;
            self.review.node.active = true;
            //self.nInfo.active = false;

            self.show();
        }
    },

    //显示loading
    _showLoading(isShow) {
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
        }

        if (isShow) {
            this._blockIndex = UIFrame.showLoading(i18n.t("COMMON.JIA_ZAI_ZHONG"), true, function (params) {
                this._blockIndex = 0;
            }.bind(this), 30);
        }
    },

    //隐藏loading
    _hideLoading() {
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
        }
    },

    _freshData(nData) {
        if (nData.nGameId) {
            this._gameId = nData.nGameId;
        }
        MsgManager.un(this._onClubSHashList);
        MsgManager.on(CLUBMSG.NOTIFY.ClubSHashListRsp_ui, this._onClubSHashList, this);

        MsgManager.un(this._onClubSLookCard);
        MsgManager.on(CLUBMSG.NOTIFY.ClubSLookCardRsp_ui, this._onClubSLookCard, this);
        this._setText(nData);

        if (nData && nData.hasOwnProperty("sJson")) {
            let clubReback = nData.sJson;
            this._setGameReview(clubReback);

            this.show();
        }
    },

    _setText(data) {
        if (data.nRlt == 0) {
            // if(TexasData.getIsFreeGame()){
            //     this.nTableName.string = TexasUtils._getText(191);
            // }else{
            //     this.nTableName.string = Base64.decode(data.sTableName);//牌桌名称
            // }

            this.nRecordNum.string = data.sPaiJuID;//牌局编号
            this.nTime.string = data.sTime;//时间
            this.nPool.string = TexasUtils._getText(98) + ":";//底池
            this.sTableId = data.sTableId;
            this.sPaiJuID = data.sPaiJuID
            //this.nInfo.active = true;
        }
    },

    _setNiMing(openNiMing, noClick) {
        cc.log("_setNiMing:", openNiMing, noClick);

        let closeBtn = this.nNiMing.node.getChildByName("closeBtn");
        let openBtn = this.nNiMing.node.getChildByName("openBtn");
        closeBtn.active = !openNiMing;
        openBtn.active = openNiMing;

        if (noClick) return;

        let listChild = this.list.children;
        if (listChild.length > 0) {
            for (let i = 0; i < listChild.length; i++) {
                let child = listChild[i];
                let name = child.name.toString();

                if (name == "NiMing") {
                    let niming = child.getChildByName("niming");
                    niming.active = openBtn.active;
                    let name = child.getChildByName("name");
                    name.active = !openBtn.active;
                }
            }
        }
    },

    _setGameReview(data) {
        let info = UserInfo.getInfo();

        let users = [];

        this.list.destroyAllChildren();

        this._setNiMing(false, 1);
        if (this.TexasRecordVideo == null) {
            this.TexasRecordVideo = req
        }

        let TexasRecordVideo = this.TexasRecordVideo;

        TexasRecordVideo._recordData = null;

        TexasRecordVideo._sumPool = 0;
        TexasRecordVideo._setRecordData(data);
        let stepData = Utils.clone(TexasRecordVideo._recordData);//阶段数据
        let sumData = TexasRecordVideo._getSceneData(stepData.length - 1);//总数据

        if (stepData && sumData) {
            cc.log("stepData,sumData:", Utils.clone(stepData), Utils.clone(sumData));

            let nSmallBlind = sumData.nSmallBlind;//小盲
            let nBigBlind = sumData.nBigBlind;//大盲
            let nPreAnte = TexasRecordVideo._nPreAnte;//前注

            // this.nPoolNum.string = TexasUtils._saveTwoPoint(TexasRecordVideo._sumPool);//底池数

            let nStr = TexasUtils._saveTwoPoint(nSmallBlind) + "/" + TexasUtils._saveTwoPoint(nBigBlind);
            if (nPreAnte > 0) {
                nStr = nStr + "(" + TexasUtils._saveTwoPoint(nPreAnte) + ")";
            }

            this.nPoolNum.string = nStr;//底池数

            //牌谱标题
            // let cardPuItem = cc.instantiate(this.gameCardPuItem);
            // cardPuItem.parent = this.list;
            // let paiPu = cardPuItem.getChildByName("paiPu").getComponent(cc.Label);
            // paiPu.string = TexasUtils._getText(186);
            // let nPeopleNum = cardPuItem.getChildByName("iconChip").getChildByName("nIcon").getChildByName("num").getComponent(cc.Label);
            // let nChipNum = cardPuItem.getChildByName("iconChip").getChildByName("nChip").getChildByName("num").getComponent(cc.Label);
            // let commonCardsList = cardPuItem.getChildByName("layout");
            // commonCardsList.destroyAllChildren();
            //公共牌
            let arrCommunityCards = Utils.clone(sumData).arrCommunityCards;
            let allCommunityCards = arrCommunityCards;//所有的5张公共牌（包括未发送的公共牌）

            for (let i = 0; i < stepData.length; i++) {
                let step = stepData[i];
                if (step.noSendCommunityCards) {
                    allCommunityCards = allCommunityCards.concat(step.noSendCommunityCards);
                    break;
                }
            }
            this._allCommunityCards = allCommunityCards
            console.log("所有的5张公共牌 : ", allCommunityCards);

            // for (let i=0; i<arrCommunityCards.length; i++) {
            //     let card = arrCommunityCards[i];

            //     this._cloneNode("",this.texasPoker,commonCardsList,card,false);
            // }

            //人数
            // let peopleNum = Utils.clone(sumData).arrUsers.length;
            // nPeopleNum.string = peopleNum;

            //奖池
            //let nPot = 0;
            // let commonCard = [];
            // for (let i=0; i<Utils.clone(stepData).length; i++) {
            //     let step = Utils.clone(stepData)[i];
            //     let notifyStr = step.notifyStr;

            //     if (notifyStr=="NOTIFY_VIDEO_SETTLE") {
            //         let arrPot = step.arrPot;
            //         for (let j=0; j<arrPot.length; j++) {
            //             nPot = nPot + arrPot[j];
            //         }
            //     }

            //     if (notifyStr=="NOTIFY_VIDEO_COMMON_CARDS") {
            //         let arrCards = step.arrCards;
            //         if (arrCards.length>0) {
            //             commonCard.push(arrCards);
            //         }
            //     }
            // }
            // nChipNum.string = TexasUtils._saveTwoPoint(nPot);
            // cardPuItem.active = true;

            this.nInsure.string = TexasUtils._getText(99) + TexasUtils._saveTwoPoint(sumData.nInsur);//保险

            let arrUsers = [];//牌桌玩家
            if (sumData.hasOwnProperty("arrUsers")) {
                arrUsers = Utils.clone(sumData.arrUsers);
            }

            let arrUsersWin = Utils.clone(sumData.arrUsersWin);
            for (let j = 0; j < arrUsers.length; j++) {
                let nSitId = arrUsers[j].nSitId;

                let user = Utils.clone(this._setUser(arrUsers[j], stepData));
                if (user.nUserId != info.nUserID) {//展示自己的牌
                    user.arrHoleCards = this._getUserByKey(arrUsersWin, "nPos", nSitId, "arrHoleCards");//手牌
                }
                user.nCardType = this._getUserByKey(arrUsersWin, "nPos", nSitId, "nCardType");//牌型
                user.nProfit = this._getUserByKey(arrUsersWin, "nPos", nSitId, "nProfit");//盈利
                user.nTotolWin = this._getUserByKey(arrUsersWin, "nPos", nSitId, "nTotolWin");//总输赢
                user.nInsureBuy = this._getUserByKey(arrUsersWin, "nPos", nSitId, "nInsureBuy");//保险总买入
                user.nInsureWin = this._getUserByKey(arrUsersWin, "nPos", nSitId, "nInsureWin");//保险总赔付
                user.isShowCardWhenEnd = this._getUserByKey(arrUsersWin, "nPos", nSitId, "isShowCardWhenEnd");//是否亮牌
                user.arrCombinedCards = this._getUserByKey(arrUsersWin, "nPos", nSitId, "arrCombinedCards");//能组成最大牌型的5个牌
                user.allCommunityCards = allCommunityCards
                if (sumData.arrLookOnkSettle) {
                    //中途站起旁观的玩家输赢显示
                    for (let index = 0; index < sumData.arrLookOnkSettle.length; index++) {
                        let lookOnSettle = sumData.arrLookOnkSettle[index];
                        if (lookOnSettle.nPos == nSitId) {
                            user.nProfit = lookOnSettle.nProfit;//盈利
                            user.isStandUp = true;
                            break;
                        }

                    }
                }
                users.push(user);
            }


            users.sort(function (a, b) {//从小到大排列
                return a.nSitId - b.nSitId;
            });

            this._userArrHoleCards = arrUsersWin

            let bankIndex = 0;
            let nNiMing = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
            cc.log("users:", Utils.clone(users));
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let isBanker = user.isBanker;

                if (isBanker) {
                    bankIndex = i;
                }

                users[i].nNiMing = nNiMing[i];
            }

            this._user = Utils.clone(users);

            let userLen = users.length;
            let icon = ["BTN", "SB", "BB", "UTG", "UTG1", "UTG2", "MP", "HJ", "CO"];
            if (userLen == 1) {
                icon = ["BTN"];
            } else if (userLen == 2) {
                icon = ["BTN", "SB"];
            } else if (userLen == 3) {
                icon = ["BTN", "SB", "BB"];
            } else if (userLen == 4) {
                icon = ["BTN", "SB", "BB", "UTG"];
            } else if (userLen == 5) {
                icon = ["BTN", "SB", "BB", "UTG", "CO"];
            } else if (userLen == 6) {
                icon = ["BTN", "SB", "BB", "UTG", "CO", "HJ"];
            } else if (userLen == 7) {
                icon = ["BTN", "SB", "BB", "UTG", "CO", "HJ", "MP"];
            } else if (userLen == 8) {
                icon = ["BTN", "SB", "BB", "UTG", "CO", "HJ", "MP", "UTG1"];
            }

            let noQiPaiNum = 0;//不弃牌人数(牌桌只有一个非自己玩家不弃牌时不显示手牌)
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let operate = user.operate;//操作

                let isQiPai = false;

                if (!Utils.clone(user.arrCombinedCards) && !Utils.clone(user.arrHoleCards)) {//玩家站起
                    isQiPai = true;
                } else {//非站起玩家弃牌
                    for (let j = 0; j < operate.length; j++) {
                        let nOperate = operate[j].nOperate;

                        if (nOperate == -5) {
                            isQiPai = true;

                            break;
                        }
                    }
                }

                if (!isQiPai) {
                    noQiPaiNum++;
                }
            }

            let isShowLookCardsHand = true //是否展示偷偷看按钮
            let isShowAllPlayerCards = true //是否展示发发看按钮
            for (let i = 0; i < users.length; i++) {
                let user = users[bankIndex];
                let operate = user.operate;//操作
                let iconItem = icon[i];

                let isQiPai = false;

                for (let j = 0; j < operate.length; j++) {
                    let nOperate = operate[j].nOperate;

                    if (nOperate == -5) {
                        isQiPai = true;

                        break;
                    }
                }
                users[bankIndex].iconStr = iconItem;
                user.arrCommunityCards = arrCommunityCards;

                let reviewItem = this._cloneNode("NiMing", this.itemReviewPrefab, this.list, null, null);
                let iconNode = reviewItem.getChildByName("seat");
                this._setIcon(iconNode, iconItem, isQiPai);
                // let niming = reviewItem.getChildByName("niming").getComponent(cc.Label);
                // niming.string = user.nNiMing;
                // niming.node.active = false;
                let texasReviewItem = reviewItem.getComponent("texasReviewItem");
                texasReviewItem.createReviewItem(user, noQiPaiNum, sumData.lookData, this._gameId);
                reviewItem.active = true;
                bankIndex++;
                if (bankIndex > users.length - 1) {
                    bankIndex = 0;
                }

                if (isShowLookCardsHand && !users.isShowCardWhenEnd){
                    isShowLookCardsHand = false
                }

                isShowAllPlayerCards = (user.commonCard.length != 3)

                
            }






            //显示查看牌按钮
            // let lookCardsNode = this.panel.getChildByName("lookCards");

            // lookCardsNode = this._setLookCardsBtn(lookCardsNode);
            // // "lookData" = [{"nUserId": 111,"nType":1},{"nUserId": 111,"nType":1}]
            // let lookData = sumData.lookData;
            // lookCardsNode.active = false
            // // if (lookData.length != 2) {
            // lookCardsNode.active = true;
            // let coinConfig = sumData.nTableCost;
            // if (coinConfig.length == 0 || (coinConfig[0].open == 0 && coinConfig[1].open == 0)) {
            //     lookCardsNode.active = false
            // } else {
            //     lookCardsNode.getChildByName("common").active = coinConfig[0].open && coinConfig[0].open == 1;
            //     lookCardsNode.getChildByName("common").getChildByName('layout').getChildByName("num").getComponent(cc.Label).string = coinConfig[0].nCost == 0 ? "" : coinConfig[0].nCost
            //     lookCardsNode.getChildByName("hand").active = coinConfig[1].open && coinConfig[1].open == 1;
            //     lookCardsNode.getChildByName("hand").getChildByName('layout').getChildByName("num").getComponent(cc.Label).string = coinConfig[1].nCost == 0 ? "" : coinConfig[1].nCost
            //     if (lookData.length == 0) {
            //         if (!isShowAllPlayerCards) {
            //             lookCardsNode.getChildByName("common").active = false
            //         }
            //         if (!isShowLookCardsHand) {
            //             lookCardsNode.getChildByName("hand").active = false
            //         }
            //     }else{
            //         for (let i = 0; i < lookData.length; i++) {
            //             if (lookData[i].nType == 1 && lookData[i].nUserId == info.nUserID) {
            //                 lookCardsNode.getChildByName("common").active = false
            //                 if (!isShowAllPlayerCards) {
            //                     lookCardsNode.getChildByName("common").active = false
            //                 }
            //             } else if ((lookData[i].nType == 2 || coinConfig[0].open == 0) && lookData[i].nUserId == info.nUserID) {
            //                 lookCardsNode.getChildByName("hand").active = false
            //                 if (!isShowLookCardsHand){
            //                     lookCardsNode.getChildByName("hand").active = false
            //                 }
            //             }
            //         }
            //     }
            // }

          
            // if (!lookCardsNode.getChildByName("common").active && !lookCardsNode.getChildByName("hand").active) {
            //     lookCardsNode.active = false
            // }




            // }

            if (sumData.nTotalInsur != null) {
                //设置保险池
                this._setInsure(sumData.nTotalInsur)
            }

            //设置洗牌验证
            this._setHashCard();

            //设置回放
            this._setGameReplayInfo(data)

            cc.log("users0:", Utils.clone(users));
            let listData = [];
            let maxOperate = 0;//最大操作(3B、4B、5B...)
            let cSitId = null;//玩家座位
            for (let j = 0; j < users.length; j++) {
                let user = users[j];
                let nSitId = user.nSitId;
                let nUserId = user.nUserId;

                if (info.nUserID == nUserId) {
                    cSitId = nSitId;

                    break;
                }
            }
            let isSBOrBB = false;//玩家是否大小盲
            let gameStateIndex = 0;
            let gameState = ["翻前", "翻牌", "转牌", "河牌", "摊牌"];
            let startData = this._setNotify(Utils.clone(stepData), "NOTIFY_VIDEO_GAME_START");//开始游戏数据
            let arrUsersBet = startData.arrUsersBet;
            let arrUserPartIn = Utils.clone(startData.arrUserPartIn);
            cc.log("step arrUsersBet,arrUserPartIn:", arrUsersBet, arrUserPartIn);
            let cPeople = arrUserPartIn.length;

            let userObj = {
                nBP: 0,//余额、底池
                cCard: null,//公共牌
                cPeople: 0,
                cCardStr: gameState[gameStateIndex],
            }

            listData.push(userObj);

            gameStateIndex++;

            if (arrUserPartIn && arrUserPartIn.length > 0) {
                //处理前注，arrUserPartIn数据格式为{{nTakeIn: 3289,nBet: 1,nPos: 1,nInsurScore: 0,nPreAnte: 1}}
                for (let j = 0; j < arrUserPartIn.length; j++) {
                    let userPartIn = arrUserPartIn[j];
                    let nPos = userPartIn.nPos;
                    let preante = userPartIn.nPreAnte;
                    let isPreanteModel = userPartIn.isPreanteModel;//是否庄位模式

                    //位置名称
                    let iconStr = "";
                    let cName = "";
                    for (let j = 0; j < users.length; j++) {
                        let user = users[j];
                        let sName = user.sName;
                        let nSitId = user.nSitId;
                        let nIconStr = user.iconStr;

                        if (nPos == nSitId) {
                            cName = sName;
                            iconStr = nIconStr;

                            break;
                        }
                    }

                    //前注
                    if (preante > 0) {
                        let userObj = {
                            nPos: nPos,
                            nIconStr: iconStr,//位置名称
                            nOperateStr: isPreanteModel ? "BP" : "P",//操作名称
                            nBet: preante,//下注
                            nBP: userPartIn.nTakeIn,//余额、底池
                            nQiPai: false,//弃牌
                            cGold: true,//是否余额
                            cCard: null,//公共牌
                            nQiPaiNum: 0,//弃牌人数
                            cCardStr: "",
                            cName: cName,
                            cPeople: 0,
                        }
                        listData.push(userObj);
                    }
                }
            }

            if (arrUsersBet && arrUsersBet.length > 0) {
                for (let i = 0; i < arrUsersBet.length; i++) {
                    let userBet = arrUsersBet[i];
                    let nPos = userBet.nPos;//座位
                    let nBet = userBet.nBet;//下注

                    //位置名称
                    let iconStr = "";
                    let cName = "";
                    for (let j = 0; j < users.length; j++) {
                        let user = users[j];
                        let sName = user.sName;
                        let nSitId = user.nSitId;
                        let nIconStr = user.iconStr;

                        if (nPos == nSitId) {
                            cName = sName;
                            iconStr = nIconStr;

                            break;
                        }
                    }

                    //操作名称
                    let operateStr = Number(nBigBlind) == Number(nBet) ? "BB" : "SB";
                    if (Number(nBet) / 2 == Number(nBigBlind)) {//强盲
                        operateStr = "S";
                    }

                    if (operateStr == "SB" || operateStr == "BB") {
                        if (cSitId == nPos) {
                            isSBOrBB = true;
                        }
                    }

                    if (operateStr == "S" || operateStr == "B" || operateStr == "R") {
                        if (maxOperate == 0) {
                            maxOperate = 3;
                        } else {
                            operateStr = maxOperate + "B";
                            maxOperate += 1;
                        }
                    }

                    //余额
                    let nBP = 0;
                    for (let j = 0; j < arrUserPartIn.length; j++) {
                        let userPartInc = arrUserPartIn[j];
                        let cPos = userPartInc.nPos;
                        let nTakeIn = userPartInc.nTakeIn;

                        if (nPos == cPos) {
                            nBP = nTakeIn;

                            break;
                        }
                    }

                    let userObj = {
                        nPos: nPos,//座位号
                        nIconStr: iconStr,//位置名称
                        nOperateStr: operateStr,//操作名称
                        nBet: nBet,//下注
                        nBP: nBP,//余额、底池
                        nQiPai: false,//弃牌
                        cGold: true,//是否余额
                        cCard: null,//公共牌
                        nQiPaiNum: 0,//弃牌人数
                        cCardStr: "",
                        cName: cName,
                        cPeople: 0,
                    }

                    listData.push(userObj);
                }
            }

            let cGold = true;
            let commonCards = false;
            let cNextCards = false;
            let cQiPai = 0;
            let curPoolSum = 0;//底池
            let nCommonCard = [];//公共牌
            for (let i = 0; i < Utils.clone(stepData).length; i++) {
                let step = Utils.clone(stepData)[i];
                let notifyStr = step.notifyStr;

                if (notifyStr == "NOTIFY_VIDEO_USER_OPERATION") {//操作
                    let nPos = step.nPos;//座位号
                    let nBet = step.nBet;//跟注或加注或 AllIn时有效，表示具体的跟注\加注数值(>0)
                    let nOp = step.nOp;//-5:弃牌,  -1:AllIn, -2:让牌, -6:跟注, -3:加注

                    cNextCards = false;

                    //位置名称
                    let iconStr = "";
                    let cName = "";
                    for (let j = 0; j < users.length; j++) {
                        let user = users[j];
                        let sName = user.sName;
                        let nSitId = user.nSitId;
                        let nIconStr = user.iconStr;

                        if (nPos == nSitId) {
                            cName = sName;
                            iconStr = nIconStr;

                            break;
                        }
                    }

                    //console.log("玩家当前操作阶段，操作索引:",nOp);
                    //操作名称
                    let operateStr = "";
                    if (nOp == -5) {//弃牌
                        operateStr = "F";
                        nBet = 0;
                        cPeople--;
                    } else if (nOp == -1) {//ALLIN
                        operateStr = "A";
                    } else if (nOp == -2) {//让牌
                        operateStr = "X";
                        nBet = 0;
                    } else if (nOp == -6) {//跟注
                        operateStr = "C";
                    } else if (nOp == -3) {//加注
                        operateStr = "B";
                    } else if (nOp == -13) {//前注
                        operateStr = "P";
                    }

                    if (operateStr == "B") {
                        if (cSitId == nPos && isSBOrBB) {
                            // operateStr = "R";
                            isSBOrBB = false;
                        } else {
                            if (maxOperate == 0) {
                                maxOperate = 3;
                            } else {
                                // operateStr = maxOperate + "B";
                                maxOperate += 1;
                            }
                        }

                    }

                    //余额、底池
                    let nBP = 0;
                    if (cGold) {
                        for (let j = 0; j < arrUserPartIn.length; j++) {
                            let userPartInc = arrUserPartIn[j];
                            let cPos = userPartInc.nPos;
                            let nTakeIn = userPartInc.nTakeIn;

                            if (nPos == cPos) {
                                nBP = nTakeIn - nBet;
                                arrUserPartIn[j].nTakeIn = nBP;

                                break;
                            }
                        }
                    } else {
                        nBP = curPoolSum + nBet;
                        curPoolSum = nBP;
                    }

                    //弃牌
                    let nQiPai = nOp == -5 ? true : false;

                    let userObj = {
                        nPos: nPos,//座位号
                        nIconStr: iconStr,//位置名称
                        nOperateStr: operateStr,//操作名称
                        nBet: nBet,//下注
                        nBP: nBP,//余额、底池
                        nQiPai: nQiPai,//弃牌
                        nQiPaiNum: 0,//弃牌人数
                        cGold: cGold,//是否余额
                        cCard: null,//公共牌
                        cCardStr: "",
                        cName: cName,
                        cPeople: 0,
                    }

                    if (nQiPai) {
                        cQiPai++;
                        // userObj.nQiPaiNum = cQiPai;
                        // if (cQiPai > 1) {
                        //     if (listData.length > 0 && listData[listData.length - 1].cCardStr == "" && listData[listData.length - 1].nQiPaiNum > 0) {
                        //         listData.pop();
                        //     }
                        // }
                    } else {
                        cQiPai = 0;
                    }

                    listData.push(userObj);
                }

                if (notifyStr == "NOTIFY_VIDEO_COMMON_CARDS") {//公共牌
                    commonCards = true;
                    maxOperate = 0;
                    cQiPai = 0;

                    let arrCards = step.arrCards;//新增的公共牌
                    let nPotSum = step.nPotSum;//底池总额(已押筹码总额)

                    if (nCommonCard.length <= 0) {
                        nCommonCard = Utils.clone(arrCards);
                    } else {
                        for (let j = 0; j < arrCards.length; j++) {
                            nCommonCard.push(arrCards[j]);
                        }
                    }

                    if (cGold) {//发牌底池
                        listData[0].nBP = nPotSum;
                        cGold = false;
                    }

                    curPoolSum = nPotSum;

                    let userObj = {
                        nBP: nPotSum,//余额、底池
                        cCard: Utils.clone(nCommonCard),//公共牌
                        cPeople: cPeople,
                        cCardStr: gameState[gameStateIndex],
                    }

                    if (cNextCards) {
                        let len = listData.length;
                        if (len && listData[len - 1] && !listData[len - 1].nOperateStr) {
                            listData.pop();
                        }

                    } else {
                        listData.push(userObj);

                        gameStateIndex++;
                    }

                    cNextCards = true;
                }

                if (notifyStr == "NOTIFY_VIDEO_SETTLE") {//结算
                    cQiPai = 0;

                    let arrPot = step.arrPot;//底池总额(已押筹码总额)

                    let nSum = 0;
                    for (let j = 0; j < arrPot.length; j++) {
                        nSum += arrPot[j];
                    }

                    if (!commonCards) {
                        listData[0].nBP = nSum;
                    }

                    cGold = false;

                    let userObj = {
                        nBP: nSum,//余额、底池
                        cCard: arrCommunityCards,//公共牌
                        cPeople: cPeople,
                        cCardStr: gameState[4],
                    }

                    listData.push(userObj);
                }
            }

            cc.log("step listData:", Utils.clone(listData));

            let nTitle = true;
            // let objTotal = cc.instantiate() 
            // objTotal.active = true
            // this.list.addChild(objTotal)
            let countInfo = 0
            let strName = ''
            let review = cc.instantiate(this.reviewTotal)
            for (let i = 0; i < listData.length; i++) {
                let nList = listData[i];
                let nextList = listData[i + 1];
                let nBP = nList.nBP;//余额、底池
                let cCard = nList.cCard;//公共牌
                let cPeople = nList.cPeople;//玩家
                let cCardStr = nList.cCardStr;//游戏阶段

                let nPrefab = cCardStr == "" ? this.gameUserItem : this.gameInfoItem;
                let node = null

                if (cCardStr == "") {

                    //let niming = node.getChildByName("niming").getComponent(cc.Label);

                    let nPos = nList.nPos;//座位号
                    let nIconStr = nList.nIconStr;//位置名称
                    let nOperateStr = nList.nOperateStr;//操作名称
                    let nBet = nList.nBet;//下注
                    let nQiPai = nList.nQiPai;//弃牌
                    let nQiPaiNum = nList.nQiPaiNum;//弃牌人数
                    let cName = nList.cName;//玩家名
                    let cGold = nList.cGold;//是否余额

                    // for (let j=0; j<this._user.length; j++) {
                    //     let userData = this._user[j];
                    //     let nSitId = userData.nSitId;
                    //     let nNiMing = userData.nNiMing;

                    //     if (Number(nPos)==Number(nSitId)) {
                    //         niming.string = nNiMing;

                    //         break;
                    //     }
                    // }
                    if (nOperateStr == "SB" || nOperateStr == "BB" || nOperateStr == "P" || nOperateStr == "S" || nOperateStr == "BP") {
                        countInfo += nBet
                        if (nOperateStr == "SB") strName += '小盲/'
                        if (nOperateStr == "BB") strName += '大盲/'
                        if (nOperateStr == "P" && strName.indexOf('前注') === -1) strName += '前注/'
                        if (nOperateStr == "BP") strName += '庄家/'
                        if (nOperateStr == "S") strName += '强抓/'
                        continue
                    }

                    node = cc.instantiate(nPrefab);
                    node.parent = this.list;
                    node.name = "NiMing";

                    if (nextList && nextList.cCardStr != "") {
                        if (node.getChildByName("line")) {
                            node.getChildByName("line").active = true
                        }
                    }

                    let isBlue = false;
                    for (let j = 0; j < users.length; j++) {
                        let user = users[j];
                        let nSitId = user.nSitId;
                        let nUserId = user.nUserId;

                        if (info.nUserID == nUserId && Number(nPos) == Number(nSitId)) {
                            isBlue = true;

                            break;
                        }
                    }

                    let color = nQiPai ? "#65778B" : "#E8DFD1";

                    let qpLabel = node.getChildByName("qpLabel");
                    //qpLabel.getComponent(cc.Label).string = nQiPaiNum + "folds";
                    qpLabel.active = nQiPaiNum > 1 ? true : false;

                    //位置
                    let iconNode = node.getChildByName("icon");
                    this._setIcon(iconNode, nIconStr, nQiPai);
                    // iconNode.active = !qpLabel.active;
                    //玩家名
                    let name = node.getChildByName("name").getComponent(cc.Label);
                    name.string = Utils.getShortText(Base64.decode(cName), 8);
                    if (isBlue) {
                        // color = "#65778B"
                    }
                    TexasUtils._setColor(name.node, color);
                    //TexasUtils._setColor(niming.node,color);
                    //niming.node.active = false;
                    //name.node.active = !qpLabel.active;

                    //操作
                    let cOperate = node.getChildByName("operate");
                    // let iconBg = "RED";
                    // if (nOperateStr=="SB" || nOperateStr=="BB" || nOperateStr=="C" || nOperateStr=="X") {
                    //     iconBg = "GREEN";
                    // }else if (nOperateStr=="F") {
                    //     iconBg = "GREY";
                    // }
                    // this._setIcon(cOperate,iconBg);

                    //操作名称
                    let operateColor = "#e8dfd1";
                    let operateName = "";
                    if (nOperateStr == "SB") {
                        operateName = "小盲";
                    } else if (nOperateStr == "BB") {
                        operateName = "大盲";
                    } else if (nOperateStr == "C") {
                        operateName = "跟注";
                        operateColor = "#00FF86";
                    } else if (nOperateStr == "A") {
                        operateName = "All-in";
                        operateColor = "#FF1E43";
                    } else if (nOperateStr == "X") {
                        operateName = "让牌";
                        // }else if (nOperateStr=="B" || nOperateStr=="R" || nOperateStr=="3B" || nOperateStr=="4B" || nOperateStr=="5B" || nOperateStr=="6B" || nOperateStr=="7B") {
                    } else if (nOperateStr == "B") {
                        operateName = "加注";
                        operateColor = "#FAD553";
                    } else if (nOperateStr == "F") {
                        operateName = "弃牌";
                        operateColor = "#65778b";
                    } else if (nOperateStr == "P") {
                        // operateName = "前注";
                        // operateColor = "#00ff86";
                    } else if (nOperateStr == "S") {
                        // operateName = "抓头";
                        // operateColor = "#00ff86";
                    }

                    let operateLabel = cOperate.getChildByName("operateLabel").getComponent(cc.Label);
                    operateLabel.string = operateName;
                    TexasUtils._setColor(operateLabel.node, operateColor);
                    let label = cOperate.getChildByName("label").getComponent(cc.Label);
                    if (nBet >= 0) {
                        label.string = TexasUtils._saveTwoPoint(nBet);
                    }
                    TexasUtils._setColor(label.node, color);
                    cOperate.active = !qpLabel.active;
                    //底池
                    let betLabel = node.getChildByName("label").getComponent(cc.Label);
                    betLabel.string = cGold ? TexasUtils._saveTwoPoint(nBP) : TexasUtils._saveTwoPoint(nBP);
                    TexasUtils._setColor(betLabel.node, color);
                    betLabel.node.active = true;
                    if (cGold) {
                        for (let j = 0; j < i; j++) {
                            let cList = listData[j];
                            let cardStr = cList.cCardStr;//游戏阶段

                            if (cardStr == "") {
                                let cPos = cList.nPos;//座位号

                                if (nPos == cPos) {
                                    betLabel.node.active = false;

                                    break;
                                }

                            }
                        }
                    }
                    betLabel.node.active = !qpLabel.active;
                    // qpLabel.active = false
                } else {
                    node = cc.instantiate(nPrefab);
                    node.parent = this.list;
                    //详细过程
                    //let title = node.getChildByName("title").getComponent(cc.Label);
                    //title.string = TexasUtils._getText(187);
                    //title.node.active = nTitle?true:false;
                    review.parent = this.list
                    review.active = true
                    nTitle = false;

                    let sum = node.getChildByName("sum");

                    //游戏阶段
                    let label = sum.getChildByName("labelNode").getChildByName("label").getComponent(cc.Label);
                    label.string = cCardStr;
                    //手牌
                    let holdCards = node.getChildByName("sum").getChildByName("holdCards");
                    //空手牌
                    let nullCard = holdCards.getChildByName("nullCard");
                    // let nGame = TexasData._getGame();
                    // nullCard.getComponent(cc.Sprite).spriteFrame = this.iconSpriteFrame[35];
                    // if (nGame==2) {
                    //     nullCard.getComponent(cc.Sprite).spriteFrame = this.iconSpriteFrame[36];
                    // }
                    // nullCard.opacity = !cCard?255:0;

                    if (nullCard) {
                        nullCard.active = false
                    }

                    //玩家人数
                    sum.getChildByName("layout").getChildByName("nIcon").active = false
                    // sum.getChildByName("layout").getChildByName("nChip").active = false

                    let icon = sum.getChildByName("layout").getChildByName("nIcon").getChildByName("icon");
                    let iconNum = sum.getChildByName("layout").getChildByName("nIcon").getChildByName("num").getComponent(cc.Label);
                    iconNum.string = cPeople;
                    icon.active = cPeople > 0 ? true : false;
                    iconNum.node.active = cPeople > 0 ? true : false;
                    //底池数
                    let num = sum.getChildByName("layout").getChildByName("nChip").getChildByName("num").getComponent(cc.Label);
                    num.string = TexasUtils._saveTwoPoint(nBP);
                    //公共牌
                    let card = holdCards.getChildByName("card");
                    card.destroyAllChildren();
                    holdCards.active = false;
                    if (cCard && cCard.length > 0) {
                        holdCards.active = true;
                        for (let j = 0; j < cCard.length; j++) {
                            let cardNum = cCard[j];

                            this._cloneNode("", this.texasPoker, card, cardNum, false);
                        }
                    }
                    node.active = true;
                }
                node.x = 0;
                node.y = 0;
                node.active = true;
            }
            strName = strName.slice(0, -1)
            countInfo = Math.round(Math.floor(countInfo * 10000) / 1000) / 10
            review.getChildByName('value').getComponent(cc.Label).string = TexasUtils._saveTwoPoint(countInfo)
            review.getChildByName('title').getComponent(cc.Label).string = strName

            var playNum = 0
            var activeNotFoldCount = users.filter(u => u && !u.isStandUp && !(u.operate || []).some(op => Number(op.nOperate) === -5)).length;

            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let operate = user.operate;//操作
                let nIconStr = user.iconStr;
                let nNiMing = user.nNiMing;

                let isQiPai = false;

                for (let j = 0; j < operate.length; j++) {
                    let nOperate = operate[j].nOperate;

                    if (nOperate == -5) {
                        isQiPai = true;

                        break;
                    }
                }

                if (user.isStandUp) {
                    break;
                }
                if (!isQiPai) {
                    playNum += 1;
                    let reviewItem = this._cloneNode("NiMing", this.itemReviewPrefab, this.list, null, null);
                    let iconNode = reviewItem.getChildByName("seat");
                    this._setIcon(iconNode, nIconStr, isQiPai);
                    // let niming = reviewItem.getChildByName("niming").getComponent(cc.Label);
                    // niming.string = nNiMing;
                    // niming.node.active = false;
                    let texasReviewItem = reviewItem.getComponent("texasReviewItem");
                    texasReviewItem.createReviewItem(user, noQiPaiNum, sumData.lookData, this._gameId);
                    if (playNum == activeNotFoldCount) {
                        texasReviewItem.showLine();
                    }
                }
            }

            // if(sumData.nTotalInsur){
            //     //设置保险池
            //     this._setInsure(sumData.nTotalInsur)
            // }

        }

    },

    onClickLookCards(event) {
        let type = 1;
        let cost = 0;
        let lookCardsNode = this.panel.getChildByName("lookCards");
        let eventName = event.target.name;
        if (eventName == "common") {//看公共牌
            type = 1;
            let commonCost = lookCardsNode.getChildByName("common").getChildByName('layout').getChildByName("num").getComponent(cc.Label).string
            cost = (commonCost == "") ? 0 : Number(commonCost)
        } else if (eventName == "hand") { //看手牌
            type = 2;
            let headCost = lookCardsNode.getChildByName("hand").getChildByName('layout').getChildByName("num").getComponent(cc.Label).string
            cost = (headCost == "") ? 0 : Number(headCost)
        }
        let params = {
            nType: type,
            sPaiJuID: this.sPaiJuID,
            nCost: cost
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSLookCardReq_CMD, params);
    },




    // message ClubSLookCardRsp {
    //     required int32 nRlt = 1;      // 0成功 1失败 2金币不做 3参数错误
    //     required int32 nType = 2;      //1 看公牌 2看手牌
    // }

    _onClubSLookCard(data) {
        cc.log("--------------历史记录看公共牌和手牌回复----------------", data);
        if (data.nRlt == 0) {
            let type = data.nType;
            let lookData = [];
            let lookCardsNode = this.list.getChildByName("lookCards")
            let commonNode = lookCardsNode.getChildByName("common")
            let handNode = lookCardsNode.getChildByName("hand")
            let info = UserInfo.getInfo();
            if (type == 1) {
                lookData.push({ "nUserId": info.nUserID, "nType": 1 })
                commonNode.active = false
            } else if (type == 2) {
                lookData.push({ "nUserId": info.nUserID, "nType": 2 })
                handNode.active = false
            }
            if (!commonNode.active && !handNode.active) {
                lookCardsNode.active = false
            }

            let niMingNode = this.list.children
            for (let i = 0; i < niMingNode.length; i++) {
                const item = niMingNode[i];
                let texasReviewItem = item.getComponent("texasReviewItem")
                if (item.name == "NiMing" && texasReviewItem) {
                    texasReviewItem.updateShowCards(texasReviewItem._data, lookData)
                }
            }
        } else if (data.nRlt == 2) {
            TexasUtils._showTip("余额不足，无法查看手牌");
        } else {
            TexasUtils._showTip("查看失败");
        }

    },



    _cloneNode(cName, prefab, parentNode, card, visible) {
        let node = cc.instantiate(prefab);
        node.parent = parentNode;

        if (cName != "") {
            node.name = cName;
        }

        if (card != null) {
            let point_sprite = node.getChildByName("point").getComponent(cc.Sprite);
            let flower_sprite = node.getChildByName("flower").getComponent(cc.Sprite);
            let x16 = 0x10;
            let x10 = x16.toString(10);//16进制转10进制
            let point = card % x10;//点数
            let flower = parseInt(card / x10);//花色
            // let imgframe = this.atlasPoker.getSpriteFrame("texas_" + point + "_" + flower);
            // if (imgframe!=null) {
            //     node.getComponent(cc.Sprite).spriteFrame = imgframe;
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

            let block = node.getChildByName("block");
            block.active = visible;
        }

        node.active = true;
        node.position.y = 0
        return node;
    },

    _setNotify(stepData, notify) {
        let data = Utils.clone(stepData);

        let obj = {};
        for (let i = 0; i < data.length; i++) {
            let step = data[i];
            let notifyStr = step.notifyStr;

            if (notifyStr == notify) {
                obj = Utils.clone(step);

                break;
            }
        }

        return obj;
    },

    _setIcon(node, str, isGrey) {
        let index = 0;
        if (str == "BTN") {
            // index = !isGrey?0:9;
            index = 0;
        } else if (str == "SB") {
            // index = !isGrey?1:10;
            index = 1;
        } else if (str == "BB") {
            // index = !isGrey?2:11;
            index = 2;
        } else if (str == "UTG") {
            // index = !isGrey?3:12;
            index = 3;
        } else if (str == "UTG1") {
            // index = !isGrey?4:13;
            index = 4;
        } else if (str == "UTG2") {
            // index = !isGrey?5:14;
            index = 5;
        } else if (str == "MP") {
            // index = !isGrey?6:15;
            index = 6;
        } else if (str == "HJ") {
            // index = !isGrey?7:16;
            index = 7;
        } else if (str == "CO") {
            // index = !isGrey?8:17;
            index = 8;
        } else if (str == "RED") {
            index = 32;
        } else if (str == "GREY") {
            index = 33;
        } else if (str == "GREEN") {
            index = 34;
        }

        node.getComponent(cc.Sprite).spriteFrame = this.iconSpriteFrame[index];
    },

    //设置玩家
    _setUser(user, data) {
        if (!user || !data) return;

        let userList = [];
        let commonCard = [];
        let nSitId = user.nSitId;

        let nOperate = 0;
        let nBet = 0;
        for (let i = 0; i < data.length; i++) {
            let dataItem = data[i];

            if (dataItem.notifyStr == notifyInfo[1].notify) {
                let arrUsersBet = dataItem.arrUsersBet ? dataItem.arrUsersBet : [];
                for (let j = 0; j < arrUsersBet.length; j++) {
                    let nPos = arrUsersBet[j].nPos;
                    let nBets = arrUsersBet[j].nBet;

                    if (nPos == nSitId) {
                        nBet = nBets;

                        break;
                    }
                }

                let arrUserPartIn = dataItem.arrUserPartIn;
                for (let j = 0; j < arrUserPartIn.length; j++) {
                    let nPos = arrUserPartIn[j].nPos;

                    if (nPos == nSitId && arrUserPartIn[j].nPreAnte) {
                        let nPreAnte = arrUserPartIn[j].nPreAnte;
                        nBet += nPreAnte;

                        break;
                    }
                }
            }

            if (dataItem.notifyStr == notifyInfo[3].notify && nSitId == dataItem.nPos) {//玩家操作
                nOperate = dataItem.nOp;//操作
                nBet = dataItem.nBet ? nBet + dataItem.nBet : nBet;//下注
            }

            if (dataItem.notifyStr == notifyInfo[4].notify || dataItem.notifyStr == notifyInfo[5].notify) {//公共牌、结算
                if (dataItem.hasOwnProperty("arrCards")) {
                    let nCard = Utils.clone(dataItem.arrCards);//公共牌
                    commonCard.push(nCard);
                }

                if (nOperate == 0 && nBet == 0) {
                } else {
                    userList.push(
                        {
                            nOperate: nOperate,
                            nBet: nBet,
                        }
                    );
                }

                nOperate = 0;
                nBet = 0;
            }
        }

        user.commonCard = commonCard;
        user.operate = userList;

        return Utils.clone(user);
    },

    _setUserByKey(data, key, value, newKey, newValue) {
        for (let i = 0; i < data.length; i++) {
            let users = data[i];

            if (users[key] && users[key] == value) {
                data[i][newKey] = newValue;

                break;
            }
        }
    },

    _getUserByKey(data, key, value, newKey) {
        let newValue = null;

        for (let i = 0; i < data.length; i++) {
            let users = data[i];

            if (users[key] == value) {
                newValue = users[newKey];

                break;
            }
        }

        return newValue;
    },

    //滑动
    onSlidered: function (slider) {
        let progress = slider.progress;
        this._sliderProgress = progress;

        let page = this._getMaxPageByProgress(this._sliderProgress);//通过滑动值获得当前最大步数
        if (page == this._sumPage) {//总数据1页
            progress = 1;
        }

        if (this._sumPage == 0 && page == 0) {//无数据
            progress = 1;
        }

        if (page <= 1 && this._sumPage > 1) {//超过1页数据
            progress = 0;
        }

        this.nPage.string = Math.max(1, page) + "";
        this._setSliderBar(progress);
        this._setPageLabel(page);
    },

    onSliderTouchEnd() {
        cc.warn("onSliderTouchEnd");
        TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "slide_huadong");
        if (!this._sumData || Object.keys(this._sumData).length < 1) return;

        let page = this._getMaxPageByProgress(this._sliderProgress);//通过滑动值获得当前最大步数
        if (page <= 1) {
            page = 1;
        }


        this._setPage(page);
    },

    onSliderTouchCancel() {
        cc.warn("onSliderTouchCancel");

        if (!this._sumData || Object.keys(this._sumData).length < 1) return;

        let page = this._getMaxPageByProgress(this._sliderProgress);//通过滑动值获得当前最大步数
        if (page <= 1) {
            page = 1;
        }

        this._setPage(page);
    },

    _setPageLabel(page) {
        if (page < 0 || page > this._sumPage) return;

        this._page = page;
        this.nPage.string = Math.max(1, page) + "";
    },

    //设置页数
    _setPage(page) {
        this._setPageLabel(page)
        this._setDataByPage(page);
    },

    //设置滑动条
    _setSliderBar(progress) {
        let videoWidth = this.sliderPage.node.width * progress;
        this.sliderPage.node.getComponent(cc.Slider).progress = progress;
        this.sliderPage.node.getChildByName("progress").width = videoWidth;
    },

    //通过滑动值获得当前最大页数
    _getMaxPageByProgress(progress) {
        let page = 0;

        if (this._sumPage == 0) return page;

        for (let i = 1; i <= this._sumPage; i++) {
            let sliderPos = i * 1 / this._sumPage;//当前页数对应滑动条位置

            if (sliderPos <= progress) {
                page = i;
            }
        }
        return page;
    },


    //看牌按钮
    _setLookCardsBtn(lookNode) {
        let node = cc.instantiate(lookNode);
        node.active = true;
        node.parent = this.list;
        return node
    },
    //保险池
    _setInsure(insure) {
        let nPrefab = this.insurePrefab;
        let node = cc.instantiate(nPrefab);
        let sInsure = node.getChildByName("insure").getComponent(cc.Label);
        if (insure > 0) {
            sInsure.string = "-" + TexasUtils._saveTwoPoint(insure);
        } else {
            sInsure.string = "+" + TexasUtils._saveTwoPoint(Math.abs(insure));
        }

        node.active = true;
        node.parent = this.list;
    },

    //洗牌验证
    _setHashCard() {
        if (!this.hashcardPrefab) return;
        let nPrefab = this.hashcardPrefab;
        let node = cc.instantiate(nPrefab);
        node.active = true;
        node.parent = this.list;
    },


    //点击洗牌凭证
    onClickHashCard() {
        let params = {
            sTableId: this.sTableId,
            sPaiJuId: this.sPaiJuID
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSHashListReq_CMD, params);
    },

    _onClubSHashList(data) {
        var self = this
        cc.log("--------------可存证hash请求返回 _onClubSHashList----------------", data);

        let layer = self.node.getChildByName("CunZhengPanel");

        if (layer) {
            layer.active = true
            var hashcardLayer = layer.getComponent("CunZhengPanel");
            let gameData = Utils.clone(data.item)
            gameData.sTableId = this.sTableId
            hashcardLayer.showRecordHashPanel(gameData)
        }
    },


    //牌局回放
    _setGameReplayInfo(data) {
        if (!this.replayNode) return;
        data = JSON.parse(data);
        cc.log("_setGameReplayInfo data", data);
        let nPrefab = this.replayNode;
        let node = cc.instantiate(nPrefab);
       // let gameNameLabel = node.getChildByName("replayNode").getChildByName("value").getComponent(cc.Label);

        let gameNameLabel = node.getChildByName("replayNode").getChildByName("replaylayout").getChildByName("value").getComponent(cc.Label);

        gameNameLabel.string = data["sPaijuId"] || "";

        let replayBtn = node.getChildByName("replayButton");
        if (replayBtn) {
            replayBtn.active = true;
        }

        node.active = true;
        node.parent = this.list;
    },

    //点击牌局回放按钮
    onClickGameReplay(event) {
        var target = event.target
        var tableId = target.parent.getChildByName("replayNode").getChildByName("replaylayout").getChildByName("value").getComponent(cc.Label).string || "";
        cc.log("onClickGameReplay tableId", tableId)

        // 隐藏存证面板
        let cunZhengPanel = this.node.getChildByName("CunZhengPanel");
        cc.warn("=== onClickGameReplay 隐藏存证面板 ===");
        cc.warn("cunZhengPanel:", cunZhengPanel, "active:", cunZhengPanel ? cunZhengPanel.active : "N/A");
        if (cunZhengPanel) {
            cunZhengPanel.active = false;
            cc.warn("已设置 cunZhengPanel.active = false");
        }

        if (TexasUtils._getClub()) {
            cc.warn("onClickGameReplay tableId:", tableId);
            app.club.getPlayBackData(tableId, function (nData) {
                // 可以将数据传递给视频回放组件
                if (this.TexasRecordVideo && this.TexasRecordVideo._setRecordData) {
                    this.TexasRecordVideo._setRecordData(nData.sJson);
                }
            }.bind(this));
        }

        // 防重复点击
        if (this._loadingPlayback) {
            return;
        }
        this._loadingPlayback = true;

        if (TexasUtils._getClub()) {
            cc.warn("onClickGameReplay send request:", tableId);

            // 显示 loading
            this._showLoading(true);

            // 设置全局标记，告诉 HallClubRecordPaipu 这是来自 TexasGameReview 的请求
            if (HallClubCacheData) {
                HallClubCacheData._playbackFromGameReview = true;
                // 保存牌局ID，用于显示
                HallClubCacheData._currentPaiJuId = tableId;
            }

            // 发送网络请求获取回放数据
            let params = {
                sPaiJuID: tableId,
            }

            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPlaybackDataReq_CMD, params);
        }
    },


    // 处理回放数据响应（由 HallClubRecordPaipu._playbackData1 处理，这里不需要实现）
    _onPlaybackData1(data) {
        // 这个方法只是为了注册监听器，实际处理在 HallClubRecordPaipu._playbackData1
        cc.log("_onPlaybackData1 received:", data);
        this._loadingPlayback = false;
        this._hideLoading();
    },

    //点击牌局回放复制按钮
    onClickGameReplayCopy(event) {
        var target = event.target
        if (!target.parent) return;
        var gameName = target.parent.getChildByName("value").getComponent(cc.Label).string;
        Utils.copyToClipBoard(gameName + "");
    },

    //匿名
    onClickNiMing() {
        let openBtn = this.nNiMing.node.getChildByName("openBtn");
        this._setNiMing(!openBtn.active);
    },

    //上一页
    onClickLastPage() {
        let page = this._page - 1;

        if (page > 0) {
            if (this._sumPage > 1 && page <= 1) {
                this._setSliderBar(0);
            } else {
                this._setSliderBar(page * 1 / this._sumPage);
            }

            this._setPage(page);
        }
    },

    //下一页
    onClickNextPage() {
        let page = this._page + 1;

        if (page <= this._sumPage) {
            if (this._sumPage > 1 && page == this._sumPage) {
                this._setSliderBar(1);
            } else {
                this._setSliderBar(page * 1 / this._sumPage);
            }

            this._setPage(page);
        }
    },

    close(str) {
        this._super();

        if (str != "init" && HallClubCacheData) {
            HallClubCacheData.savePlayBackData({});
        }
    },

});