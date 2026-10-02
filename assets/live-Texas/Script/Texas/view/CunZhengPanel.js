// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let TAG = "CunZhengPanel";
let TexasUtils = require("TexasUtils");
let MsgManager = require("MsgManager");
let Utils = require("Utils");
let MSG = require("Msg_Texas");
let CMD = require("protocol_texas");
let DynamicListView = require("DynamicListView");
let TexasData = require("TexasData");
const i18n = require('i18n');
let UIDialog = require("UIDialog");
let UIFrame = require("UIFrame");

let CMDCLUB = require("protocol_club");
let CLUBMSG = require("Msg_club");
let MSG_FRAMEWORKS = require("Msg");

let HallClubCacheData = require("HallClubCacheData")
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }    
        // },
        panel_content: cc.Node,
        viewList: [cc.Node],//界面总集，0：view1(纯洗牌界面) ， 1:view2（验证：带二维码） ， 2：view3（验证：发牌） ，3：view4（验证展示牌，牌桌牌）
        scrollviewHashList: cc.ScrollView,
        itemContentHashList: cc.Node,
        maskHashList: cc.Node,
        itemHash: cc.Node,
        emptyNode: cc.Node,
        showCardsLayout: cc.Node,
        qrCode: cc.Sprite,

        webView: {
            default: null,
            type: cc.WebView,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._hashItemList = [];//洗牌凭证列表数据
        this._isEnd = false;
        this.isOpenView5 = false;
        this.initEvn()
        this.initNode()
        this.panel_content.active = false;
        this.initList();
        app.util.addClickSoundToNode(this.node);

        this.comeType = 1; // 界面入口 1：从牌局打开， 2：从历史记录中打开
    },

    initEvn() {

    },

    initNode() {

    },

    start() {
        MsgManager.on(MSG.NOTIFY.ClubDeZhouHashListRsp_ui, this._onGetClubDeZhouHashList, this);
        MsgManager.on(MSG.NOTIFY.ClubDeZhouHashCardRsp_ui, this._onGetClubDeZhouHashCard, this);
        MsgManager.on(CLUBMSG.NOTIFY.ClubSHashCardRsp_ui, this._onGetClubHistoryDeZhouHashCard, this);
    },

    onDestroy() {
        this.scviewHashList.destroy();
        MsgManager.un(this._onGetClubDeZhouHashList);
        MsgManager.un(this._onGetClubDeZhouHashCard);
        MsgManager.un(this._onGetClubHistoryDeZhouHashCard);
    },

    _onGetClubDeZhouHashCard(data) {
        if (this.isOpenView5) return
        cc.log('test _CunZhengPanel _onGetClubDeZhouHashCard:', data);
        if (data.nRlt == 1) {
            UIFrame.showTips('不在座位上，不能查看牌局序列');
            return
        }
        if (data.nRlt == 2) {
            UIFrame.showTips('当前局不允许查看牌局序列');
            return
        }
        if (data.nRlt == 3) {
            UIFrame.showTips("余额不足，无法查看牌序列");
            return
        }
        if (data.nRlt == 4) {
            UIFrame.showTips("查看牌局序列失败");
            return
        }
        cc.log("_onGetClubDeZhouHashCard", data);
        this.totleView(3)

        this._showHashCardsPanel(data);
    },

    _onGetClubHistoryDeZhouHashCard(data) {
        if (this.isOpenView5) return
        cc.log("test _onGetClubHistoryDeZhouHashCard", data);
        if (data.nRlt == 1) {
            UIFrame.showTips('查看牌局序列失败');
            return
        }
        if (data.nRlt == 2) {
            UIFrame.showTips("余额不足，无法查看牌序列");
            return
        }
        this.totleView(3)

        this._showHashCardsPanel(data);
    },

    _onGetClubDeZhouHashList(data) {
        this.emptyNode.active = data.arrItem.length == 0 && this._hashItemList.length == 0

        if (data.arrItem.length == 0) {
            return;
        }

        if (data.arrItem.length > 0 && data.arrItem[data.arrItem.length - 1].nPlayCnt == this._nMinIdIndex) {
            this._isEnd = true;
            return;
        }

        this._nMinIdIndex = data.nMinId;

        let tableInfo = TexasData._getTableInfo();
        let isStart = TexasData._getGameStart();
        this._cursPaiJuId = tableInfo.sPaiJuId || "";
        this._cursPaiJuId = isStart ? this._cursPaiJuId : "";
        if (this._hashItemList.length == 0) {
            this.updateHashListScrollView(data.arrItem);
        } else {
            this.appendData(data.arrItem);
        }
    },

    updateHashListScrollView(listData) {
        QYLogs.log(TAG, "----------------updateHashListScrollView---------------", listData);
        //设置列表item数据
        this._hashItemList = Utils.clone(listData);

        let dataArr = listData;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "itemHash",
                data: dataArr[i]
            }
            allData.push(Data);
        }

        this.scviewHashList.clear_items();
        //设置数据，key为item样式，data为数据
        this.scviewHashList.set_data(allData);
    },

    //向列表末端插入新的数据
    appendData(data) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        for (let i = 0; i < data.length; i++) {
            this._hashItemList.push(data[i]);
        }
        //设置列表item数据
        let dataArr = data;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let newData = {
                key: "itemHash",
                data: dataArr[i]
            }
            allData.push(newData);
        }

        let Offset = this.scviewHashList.scrollview.getScrollOffset();//记录之前所在的位置
        let x = Offset.x;
        let y = Offset.y;
        QYLogs.log(TAG, "----------------Offset---------------", x, y);

        //设置数据，key为item样式，data为数据
        this.scviewHashList.append_data(allData);

        // this.scview.scrollview.stopAutoScroll();
        this.scviewHashList.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },

    //初始化滚动列表
    initList() {
        //调用构造函数，传入构造参数
        this.scviewHashList = new DynamicListView({
            scrollview: this.scrollviewHashList,
            mask: this.maskHashList,
            content: this.itemContentHashList,
            item_templates: [
                { key: "itemHash", node: cc.instantiate(this.itemHash) },
            ],
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter1,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
            scroll_to_end_cb: this.scroll_to_end_cb1,
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter1(node, key, data, index) {
        this.initItem(node, data);
        return [node.width, node.height];
    },

    scroll_to_end_cb1(dataArr) {
        if (dataArr.length <= 0 || this._isEnd) return;
        if (this._hashItemList.length <= 0) {
            this.scviewHashList.clear_items();
            return;
        }
        this.reqClubDeZhouHashList(this._hashItemList[this._hashItemList.length - 1]?.nPlayCnt || 0);
    },

    playShuffleAni() {
        let qiePaiNode = this.node.getChildByName("openBtn").getChildByName("qiepai")
        let qiePaiBg = this.node.getChildByName("openBtn").getChildByName("qiepaiBg")

        let qiePaiTipLabel = this.node.getChildByName("openBtn").getChildByName("lable")
        let spineComp = qiePaiNode.getComponent(sp.Skeleton);

        // 准备状态
        qiePaiBg.active = false;
        qiePaiTipLabel.active = true;
        qiePaiTipLabel.opacity = 0;
        let labelComp = qiePaiTipLabel.getComponent(cc.Label);
        if (labelComp) labelComp.string = "取随机源";

        // 使用 tween 淡入提示文字，淡入完成后播放龙骨/Spine 动画，动画完成后显示底图
        const showBg = () => {
            qiePaiBg.active = true;
            qiePaiBg.opacity = 0;
            cc.tween(qiePaiBg)
                .call(() => {
                    if (labelComp) labelComp.string = "生成hash";;
                })
                .delay(0.3).to(0.2, { opacity: 255 })
                .call(() => {
                    if (labelComp) labelComp.string = "可存证";
                })
                .start();
        };

        const playAnimation = () => {
            // 延迟 0.5s 后显示文本
            const showLabelDelayed = () => {
                this.scheduleOnce(() => {
                    if (labelComp) labelComp.string = "随机洗牌";
                }, 0.5);
            };

            // 回退到 Spine
            if (spineComp) {
                spineComp.setCompleteListener(() => {
                    spineComp.setCompleteListener(null);
                    showBg();
                });
                spineComp.setAnimation(0, "animation", false);
                showLabelDelayed();
                return;
            }

            // 如果没有动画组件，仍然延迟 0.5s 显示文本，并稍作延时显示底图以保持体验一致
            showLabelDelayed();
            cc.tween(this).delay(0.3).call(showBg).start();
        };

        // 先 tween 淡入文字，然后调用 playAnimation
        cc.tween(qiePaiTipLabel)
            .to(0.25, { opacity: 255 })
            .delay(0.2).call(playAnimation)
            .start();
    },

    onClickOpenContent() {
        this.panel_content.active = true;

        this.totleView(0)

        //请求俱乐部凭证数据列表
        this.reqClubDeZhouHashList();
    },

    reqClubDeZhouHashList(nMinId = 0) {
        let nStr = "洗牌凭证";
        let data = {
            nQueryCnt: 15,
            nMinId: nMinId
        }

        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouHashListReq_CMD, data);
    },

    ///请求当前局牌序列详情
    reqClubDeZhouHashCard(gameId) {
        let nStr = "局牌序列";
        let data = {
            sPaiJuId: gameId,
        }
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouHashCardReq_CMD, data);
    },

    ///请求历史当前局牌序列详情 
    reqClubHistoryDeZhouHashCard(gameId) {
        let params = {
            sPaiJuId: gameId,
            sTableId: this.selectData.sTableId,
        }

        app.net.send(CMDCLUB.GAME_CLUB.value, CMDCLUB.GAME_CLUB.ClubSHashCardReq_CMD, params);
    },

    onClickCloseContent() {
        this.panel_content.active = false;

        this.resetHashList();
    },

    resetHashList() {
        this._nMinIdIndex = 0;
        this._isEnd = false;
        this._hashItemList = [];

        this.scviewHashList.clear_items();
        this.scrollviewHashList.content.destroyAllChildren();
        this.scrollviewHashList.scrollToTop(0.1);
    },

    onClickShowView2Btn(event, customData) {
        this.selectData = customData
        this.totleView(1)
    },

    onClickNextHandSave() {
        this.totleView(1)
    },

    onClickShowView3Btn(event, customData) {
        this.selectData = customData
        this.isOpenView5 = false;
        if (this.selectData.hand == "" || this.selectData.sPaiJuId == this._cursPaiJuId) {
            this.totleView(5)
            let nextGamePanel = this.viewList[5]
            nextGamePanel.getComponent("HashNextGameShowPanel").init(this.selectData)
            return
        }
        //没有秀牌展示非秀牌界面
        if (this.selectData.show == 0) {
            this.totleView(2)
        }
        //秀牌则展示秀牌界面
        else if (this.selectData.show == 1) {
            this.totleView(6)

            let showGamePanel = this.viewList[6]
            showGamePanel.getComponent("HashGameShowPanel").init(this.selectData)
        }
    },

    showRecordHashPanel(data) {
        MsgManager.on(CLUBMSG.NOTIFY.ClubSHashCardRsp_ui, this._onGetClubHistoryDeZhouHashCard, this);
        this.panel_content.active = true;

        this.comeType = 2;
        this.selectData = data
        //没有秀牌展示非秀牌界面
        if (data.show == 0) {
            this.totleView(2)
        }
        //秀牌则展示秀牌界面
        else if (data.show == 1) {
            this.totleView(6)

            let showGamePanel = this.viewList[6]
            showGamePanel.getComponent("HashGameShowPanel").init(data)
        }
    },

    totleView(index) {
        for (let i = 0; i < this.viewList.length; i++) {
            this.viewList[i].active = index == i
        }

        if (!this.selectData) return

        this._showCurHashPanel(this.selectData)

        this._showOldHashPanel(this.selectData)
    },

    //View:-------------------------------------------++

    selectData: null,


    _showHashCardsPanel(data) {
        var self = this;
        let viewNode4 = self.viewList[3]
        var seed = (this.selectData.seed + "").replace(/^kk/i, "HP");

        viewNode4.getChildByName("kkName").getComponent(cc.Label).string = seed;
        viewNode4.getChildByName("cardsHash").getChildByName("value").getComponent(cc.Label).string = this.selectData.hash + ""

        this.showCardsLayout.removeAllChildren();
        let cardlistItem = viewNode4.getChildByName("cardlistItem")
        let cardItem = cardlistItem.getChildByName("cardItem")
        cardItem.active = false
        // 数据
        if (data.nDetail == "") return;
        let allCards = data.nCards.split(",").map(c => parseInt(c));
        let players = JSON.parse(data.nDetail);
        cc.log("----players----", players);
        cc.log("----allCards----", allCards);
        let tableCards = players.details[1] || [];
        let cutCardIndex = players.details[2] || 0;
        let cutCardValue = allCards[cutCardIndex - 1] || 0;
        let turnCardValue = players.details[4] || 0;
        let riverCardValue = players.details[5] || 0;

        let maxPerList = 12;
        let listCount = Math.ceil(allCards.length / maxPerList);

        // 建立牌的归属信息映射（方便快速查找）
        let cardBelongs = {};  // { 牌值: { type: "player" | "table", seat: number, index: number } }

        //标记玩家牌
        Object.keys(players.arrUser).forEach(playerIndex => {
            const playerData = players.arrUser[playerIndex];
            (players.details[playerData.id] || []).forEach(c => {
                cardBelongs[c] = { type: "player", seat: playerData.nSitId };
            });
        });

        // 标记桌面牌
        (tableCards || []).forEach((c, idx) => {
            cardBelongs[c] = { type: "table", index: idx + 1 }; // 第几张桌牌，从1开始
        });

        //标记转牌
        if (turnCardValue > 0) {
            cardBelongs[turnCardValue] = { type: "table", index: 4 }; // 转牌
        }

        //标记河牌
        if (riverCardValue > 0) {
            cardBelongs[riverCardValue] = { type: "table", index: 5 }; // 河牌
        }

        // 遍历创建 cardlistItem
        for (let i = 0; i < listCount; i++) {
            // 获取或克隆 cardlistItem
            let cardlistItem = viewNode4.getChildByName("cardlistItem" + i);
            if (!cardlistItem) {
                let template = viewNode4.getChildByName("cardlistItem");
                cardlistItem = cc.instantiate(template);
                cardlistItem.name = "cardlistItem" + i;
                cardlistItem.active = true
                this.showCardsLayout.addChild(cardlistItem);
            }

            // 清空旧内容
            cardlistItem.removeAllChildren();

            // 当前组的牌
            let startIndex = i * maxPerList;
            let endIndex = Math.min(startIndex + maxPerList, allCards.length);
            let groupCards = allCards.slice(startIndex, endIndex);

            // 生成卡牌节点
            for (let j = 0; j < groupCards.length; j++) {
                let cardValue = groupCards[j];
                let cardTemplate = cardlistItem.getChildByName("cardItem");

                if (!cardTemplate) {
                    let baseList = viewNode4.getChildByName("cardlistItem");
                    cardTemplate = baseList.getChildByName("cardItem");
                }

                let cardNode = cc.instantiate(cardTemplate);
                cardNode.name = "cardItem_" + cardValue;
                TexasUtils._getCardType(cardNode, cardValue);
                // 设置Y位置
                cardNode.getChildByName("block").active = cardBelongs[cardValue] ? false : true;
                cardNode.active = true
                // ==== 展示额外标识 ====
                let belongInfo = cardBelongs[cardValue];
                let showLabelNode = cardNode.getChildByName("showVe");

                if (showLabelNode) {
                    let labelComp = showLabelNode.getComponent(cc.Label);
                    if (labelComp) {
                        if (belongInfo) {
                            if (belongInfo.type === "player") {
                                labelComp.string = "" + belongInfo.seat;
                            } else if (belongInfo.type === "table") {
                                let belongInfoName = "";
                                if (belongInfo.index == 1) {
                                    belongInfoName = "翻牌";
                                }
                                else if (belongInfo.index == 4) {
                                    belongInfoName = "转牌";
                                }
                                else if (belongInfo.index == 5) {
                                    belongInfoName = "河牌";
                                }
                                labelComp.string = belongInfoName; // 桌面第几张
                            }
                        } else {
                            labelComp.string = "";
                        }

                        if (cutCardIndex > 0 && cardValue == cutCardValue) {
                            labelComp.string = "切牌 " + cutCardIndex;
                        }
                    }
                }
                let mainLabel = cardNode.getComponent(cc.Label);
                if (mainLabel) mainLabel.string = cardValue.toString();

                cardlistItem.addChild(cardNode);
            }
        }
    },

    _showOldHashPanel(data) {
        let viewNode3 = this.viewList[2]
        var seed = ((data.seed || "未知牌局") + "").replace(/^kk/i, "HP");

        viewNode3.getChildByName("selfCheckBtn").active = true;
        viewNode3.getChildByName("verifiedCards").active = false;
        viewNode3.getChildByName("New Layout").getChildByName("value").active = false;

        viewNode3.getChildByName("seed").getChildByName("value").getComponent(cc.Label).string = seed
        viewNode3.getChildByName("turn").getChildByName("value").getComponent(cc.Label).string = cc.js.formatStr("第%s手", data.nPlayCnt)

        viewNode3.getChildByName("sendCardsTime").getChildByName("value").getComponent(cc.Label).string = data.fTime + "";
        viewNode3.getChildByName("shuffleTime").getChildByName("value").getComponent(cc.Label).string = data.sTime + "";
        viewNode3.getChildByName("hashTime").getChildByName("value").getComponent(cc.Label).string = data.sTime + "";
        viewNode3.getChildByName("sendCardsTime").getChildByName("value").getComponent(cc.Label).string = data.fTime + "";

        viewNode3.getChildByName("cardsHash").getChildByName("value").getComponent(cc.Label).string = data.hash + ""

        let coinConfig = HallClubCacheData.getClubCoinConfig()
        viewNode3.getChildByName("showCards").getChildByName("showCardsHashBtn").getChildByName('text').getComponent(cc.Label).string = data.show == 1 ? '查看牌序列' : ((coinConfig.Hash ? coinConfig.Hash : 0) + ' 查看牌序列')
    },

    _showCurHashPanel(data) {
        let viewNode2 = this.viewList[1].getChildByName("bg")
        var seed = ((data.seed || "未知牌局") + "").replace(/^kk/i, "HP");

        let testData = this.testViewData().historyData[0] // test data
        viewNode2.getChildByName("kkName").getComponent(cc.Label).string = seed
        viewNode2.getChildByName("billing").getChildByName("value").getComponent(cc.Label).string = cc.js.formatStr("第%s手", data.nPlayCnt)
        viewNode2.getChildByName("shuffleTime").getChildByName("value").getComponent(cc.Label).string = data.sTime + ""
        viewNode2.getChildByName("HashTime").getChildByName("value").getComponent(cc.Label).string = data.sTime + ""
        viewNode2.getChildByName("HashFunc").getChildByName("value").getComponent(cc.Label).string = testData.hash256Value + ""
        viewNode2.getChildByName("HashValue").getChildByName("value").getComponent(cc.Label).string = data.hash + ""

        let qrcode = this.qrCode?.getComponent('HallQRCodeUI')
        if (qrcode && data.hash) qrcode.init(data.hash)
    },

    onClickSaveBtn() {
        // 截取当前面板（单个节点）并保存/分享
        const targetNode = this.viewList[1].getChildByName("bg")
        let hash = targetNode.getChildByName("HashValue").getChildByName("value").getComponent(cc.Label).string
        let txt = "Hash卡牌序列: " + hash
        targetNode.getComponent("captureNode").downloadImg(txt);
    },

    onClickHelpTipBtn(event) {//小按钮提升
        switch (event.target.name) {
            case "helpHashBtn":
                this._showDialog(i18n.t("COMMON.gameTip.215"), i18n.t("COMMON.gameTip.216"))
                break;
            case "helpPlatfromCheckBtn":
                this._showDialog(i18n.t("COMMON.gameTip.219"), i18n.t("COMMON.gameTip.220"))
                break;
            case "copyHashBtn":
                Utils.copyToClipBoard(this.selectData.hash + "");
                break;
            case "copyPublicHashBtn":
                Utils.copyToClipBoard(this.selectData.cards + "");
                break;
            case "showCardsHelpBtn":
                this._showDialog(i18n.t("COMMON.gameTip.217"), i18n.t("COMMON.gameTip.218"))
                break;
            case "selfCheckBtn"://自我验证打开h5
                break;
            default:
                break;
        }
    },

    closeDialog() {
        this.node.getChildByName("tips").active = false
    },

    _showDialog(titleText, text) {
        let tip = this.node.getChildByName("tips")
        tip.getChildByName("bg").getChildByName("title").getComponent(cc.Label).string = titleText
        tip.getChildByName("bg").getChildByName("text").getComponent(cc.Label).string = text
        tip.active = true

    },


    onClickCheckGameCards() {
        this.isOpenView5 = true;
        this.totleView(4);

        let hashGameView = this.viewList[4];
        hashGameView.getComponent("CunZhengGamePanel").init(this.selectData, this.comeType);
    },

    onClickCheckGameHash() {

    },

    onClickSelfCheckGameHash() {
        this.openWebView("https://emn178.github.io/online-tools/sha256.html")
    },

    onClickShowCardsIndex() {
        if (this.comeType == 2) {
            this.reqClubHistoryDeZhouHashCard(this.selectData.sPaiJuId)
        }
        else {
            this.reqClubDeZhouHashCard(this.selectData.sPaiJuId)
        }
    },

    onClickVerify() {

        let noShowGameView = this.viewList[2];

        noShowGameView.getChildByName("verifiedCards").active = true;
        noShowGameView.getChildByName("New Layout").getChildByName("value").active = true;
        noShowGameView.getChildByName("New Layout").getChildByName("value").getComponent(cc.Label).string = this.selectData.hash + ""
    },

    initItem(node, data) {
        if (!node) return;

        let card1 = node.getChildByName("card1");
        let card2 = node.getChildByName("card2");
        var selfCards = data.hand.toString().split(",");


        //延迟看牌
        let selfCard = TexasData._getSelfCard();
        if ((!selfCard || selfCard == {} || !selfCard.card || selfCard.card[0] == 0 || selfCard.card[1] == 0) && data.sPaiJuId == this._cursPaiJuId) {
            TexasUtils._getCardType(card1, 0);
            TexasUtils._getCardType(card2, 0);
        } else {
            TexasUtils._getCardType(card1, selfCards[0] || 0);
            TexasUtils._getCardType(card2, selfCards[1] || 0);
        }





        var curLabelStr
        var isShowDownload = false
        if (data.hand == "" && !data.sPaiJuId) {
            curLabelStr = "下手"
            isShowDownload = true
        }
        else if (data.sPaiJuId == this._cursPaiJuId) {
            curLabelStr = "当前"
            isShowDownload = true
        }
        else {
            curLabelStr = "第" + data.nPlayCnt + "手"
        }
        node.getChildByName("curIndex").getComponent(cc.Label).string = curLabelStr
        node.getChildByName("time").getComponent(cc.Label).string = data.sTime

        node.getChildByName("downloadBtn").active = isShowDownload;

        if (node.getChildByName("downloadBtn").getComponent(cc.Button)) {
            let nodeCall = node.getChildByName("downloadBtn").getComponent(cc.Button).clickEvents[0]
            if (nodeCall) {
                nodeCall.customEventData = data
            }
        }

        if (node.getChildByName("enterMoreInfoBTn").getComponent(cc.Button)) {
            let nodeCall = node.getChildByName("enterMoreInfoBTn").getComponent(cc.Button).clickEvents[0]
            if (nodeCall) {
                nodeCall.customEventData = data
            }
        }

        if (node.getComponent(cc.Button)) {
            let nodeCall = node.getComponent(cc.Button).clickEvents[0]
            if (nodeCall) {
                nodeCall.customEventData = data
            }
        }
    },

    //时间戳转换为指定格式：2025/10/15 15:15/11
    formatTimestamp(timestamp) {
        let date = new Date(timestamp);

        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');

        let hour = String(date.getHours()).padStart(2, '0');
        let minute = String(date.getMinutes()).padStart(2, '0');
        let second = String(date.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hour}:${minute}/${second}`;
    },

    openWebView(_url) {
        if (this.webView.url == _url) {
            this.webView.node.active = true
            return
        }
        this.webView.url = _url
        this.webView.node.active = true
    },

    onCloseWebView() {
        this.webView.node.active = false
    },

    // update (dt) {},

    // card：17-77
    testViewData() {
        let viewData = {
            historyData: [
                {
                    selfCards: [23, 25],
                    startGameTime: 1729234965234,//游戏开始时间（发牌时间）
                    hendIndex: 1,//第几手
                    roomName: "HP1311141285100811111",//房间名字
                    shuffleCardsTime: 1729234965834,//洗牌完成时间
                    hashShowTime: 1729234985834,//hash展示时间
                    hash256Value: "SHA256 XXX",//hash256函数值
                    hashCardsIndex: "b135f3deb1bce1be51e0c0bc7f1d0c7c3644045533d2f6818d3f241309c29fc9",//hash卡牌序列
                    showCatdsHash: "6STHTH8C6-AK1311141285100821034D7DAS4DKS5S8SQS7CJH3SADQD4S2H2DTHKH9D6D9D2D8CQHQCAC7CKHJH4H6C8H5C9HAH7S3C3DJD5C5C2S9SJSKCTD3C4S", // 披露卡牌序列
                    allCardsShow: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 38, 38, 40, 41, 42, 43, 44, 45, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
                    players: [{
                        id: 10001,
                        seat: 1,
                        name: "name1",
                        cards: [23, 25],
                    },
                    {
                        id: 10002,
                        seat: 2,
                        name: "name2",
                        cards: [24, 26],
                    },
                    ],
                    tableCards: [27, 28, 29, 31, 33],

                    qiepaiIndex: 6,
                },
                {
                    selfCards: [23, 25],
                    startGameTime: 1729234965234,//游戏开始时间（发牌时间）
                    hendIndex: 2,//第几手
                    roomName: "HP1311141285100822222",//房间名字
                    shuffleCardsTime: 1729234965834,//洗牌完成时间
                    hashShowTime: 1729234985834,//hash展示时间
                    hash256Value: "SHA256 XXXXX",//hash256函数值
                    hashCardsIndex: "b135f3deb1bce1be51e0c0bc7f1d0c7c3644045533d2f6818d3f241309c29fc9",//hash卡牌序列
                    showCatdsHash: "6STHTH8C6-AK1311141285100821034D7DAS4DKS5S8SQS7CJH3SADQD4S2H2DTHKH9D6D9D2D8CQHQCAC7CKHJH4H6C8H5C9HAH7S3C3DJD5C5C2S9SJSKCTD3C4S", // 披露卡牌序列
                    allCardsShow: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 38, 38, 40, 41, 42, 43, 44, 45, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
                    players: [{
                        id: 10001,
                        seat: 1,
                        name: "name1",
                        cards: [23, 25],
                    },
                    {
                        id: 10002,
                        seat: 2,
                        name: "name2",
                        cards: [24, 26],
                    },
                    ],
                    tableCards: [27, 28, 29, 31, 33],

                    qiepaiIndex: 6,
                },
            ]

        }
        return viewData;
    },
});
