// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部战绩牌局记录
let i18n = require("i18n");
let TAG = "career_record";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let UIFrame = require("UIFrame");
let LocalStorage = require("LocalStorage");
let AppBridge = require("AppBridge");
let UserInfo = require("UserInfo");
let Base64 = require("base64");
let clubGameConfig = require("clubGameConfig");
let MAXCount = 10;
let UIListView = require("UIListView");
let TOTAL_COUNT = 40;
let AppWebApi = require("AppWebApi");
let HallClubCacheData = require("HallClubCacheData");
//let TexasGameReview = require("TexasGameReview");

cc.Class({
    extends: cc.Component,

    properties: {
        //TexasGameReview: TexasGameReview,//牌局回顾
        listView: {
            default: null,
            type: UIListView,
        },

        scrollview: {
            default: null,
            type: cc.ScrollView,
        },
        mask: {
            default: null,
            type: cc.Node
        },
        itmeContent: {
            default: null,
            type: cc.Node
        },

        item: {
            default: null,
            type: cc.Node
        },

        content: cc.Node,
        moreMenu: cc.Node,
        menuBg: cc.Node,
        noRecord: cc.Node,
        sContent: cc.Node,
        info: cc.Node,
        infoItem: cc.Node,
        //texasGameReview: cc.Node,
        inofItemBgRes: {
            default: [],
            type: cc.SpriteFrame,
        },

        sharePrefab: cc.Prefab,

        _recordList: [],
        _curPage: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        app.util.addClickSoundToNode(this.node);
    },

    start() {
        this._reviewPrefabCache = {};   // { [gameId]: cc.Prefab }
        this._loadingPlayback = false;  // 防重复加载
        this._reviewNode = null;        // 当前回放面板节点引用
        this._blockIndex = 0;           // Loading 索引，确保关闭时能隐藏
        

    },

    // update (dt) {},

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSGetTablePaiPuRsp_ui, this._paiPuResp, this);
        MsgManager.on(MSG.NOTIFY.ClubSOpratePaiPuResp_ui, this._opratePaiPu, this);
        MsgManager.on(MSG.NOTIFY.ClubSPlaybackDataResp_ui, this._playbackData, this);
        MsgManager.on(MSG.NOTIFY.ClubSPlaybackDataResp_ui, this._playbackData1, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetPaijuDetailRsp_ui, this._paijuDetail, this);
    },

    unRegiester() {
        MsgManager.un(this._paiPuResp);
        MsgManager.un(this._opratePaiPu);
        MsgManager.un(this._playbackData);
        MsgManager.un(this._playbackData1);
        MsgManager.un(this._paijuDetail);
    },

    onDisable() {
        this.unRegiester();
    },

    onDestroy() {
        this.unRegiester();
        // 关闭 Loading
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
        }

        // 销毁回放节点，断开引用，避免悬挂
        if (this._reviewNode && cc.isValid(this._reviewNode)) {
            this._reviewNode.destroy();
        }
        this._reviewNode = null;

        // 如需释放 Prefab 缓存可在此处清理引用（通常可复用，不强制释放）
        this._reviewPrefabCache = {};
    },

    init(data, isHall) {
        this._isHall = isHall;
        this.listView.init(this);
        // this.initList();
        this.unRegiester();
        this.regiester();
        this._tableData = data;
        this.getGameRecord(0);
    },

    getGameRecord(nPage) {
        let data = {
            nGameId: this._tableData.nGameId,
            nPage: nPage,
            nCnt: MAXCount,
        }

        data.sTableId = this._tableData.sTableId,
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetTablePaiPuReq_CMD, data);
    },

    getGameDetail(sPaiJuID) {
        let data = {
            sPaiJuID: sPaiJuID,
            nUserId: UserInfo.getInfo().nUserID,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetPaijuDetailReq_CMD, data);
    },

    onClickClose() {
        this.node.destroy();
    },

    //初始化滚动列表
    initList() {
        QYLogs.log(TAG, "----------------initList---------------");

        //调用构造函数，传入构造参数
        this.scview = new DynamicListView({
            scrollview: this.scrollview,
            mask: this.mask,
            content: this.itmeContent,
            item_templates: [
                { key: "item1", node: cc.instantiate(this.item) },
            ],
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
            scroll_to_end_cb: this.scroll_to_end_cb,
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        this.initItem(node, data);

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr) {
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getGameRecord(this._curPage + 1);
    },

    initItem(node, data) {
        // node.off(cc.Node.EventType.TOUCH_END);

        // node.on(cc.Node.EventType.TOUCH_END, function (button) {
        //     this.onClickItem(data, node);
        // }.bind(this))

        if (node.dataId && node.dataId == data.nId) {
            return;
        }

        let label_content = node.getChildByName("label_content").getComponent(cc.Label);
        let label_paijuId = node.getChildByName("label_paijuId").getComponent(cc.Label);
        let label_score = node.getChildByName("label_score").getComponent(cc.Label);
        let label_count = node.getChildByName("label_count").getComponent(cc.Label);
        let label_profit = node.getChildByName("label_profit").getComponent(cc.Label);
        let game_icon_score = node.getChildByName("game_icon_score");
        //let label_pot = node.getChildByName("label_pot").getComponent(cc.Label);
        let card1 = node.getChildByName("card1");
        let card2 = node.getChildByName("card2");
        // let card3 = node.getChildByName("card3");
        // let card4 = node.getChildByName("card4");
        let niuniuCard = node.getChildByName("niuniuCard");
        let label_totalbet = node.getChildByName("label_totalbet").getComponent(cc.Label);
        let label_start = node.getChildByName("label_start").getComponent(cc.Label);
        let handCard = data.handCard;
        let tableInfo = data.tableInfo;

        // if (this._tableData.nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang){
        //     label_paijuId.node.active = false;
        //     label_content.node.active = false;
        //     game_icon_score.active = false;
        //     label_score.node.active = false;
        //     label_pot.node.active = false;
        // }

        label_paijuId.string = `ID: ${data.sPaiJuID}`;
        label_score.string = (Utils.convertNumberToStr(tableInfo.nSmallBlind) || 0) + "/" + (Utils.convertNumberToStr(tableInfo.nBigBlind) || 0);
        let text = i18n.t("CLUB_HALL.HAND");

        if (data.nJuShu == 1) {
            label_count.string = `${data.nJuShu || 0}st`;
        } else if (data.nJuShu == 2) {
            label_count.string = `${data.nJuShu || 0}nd`;
        } else if (data.nJuShu == 3) {
            label_count.string = `${data.nJuShu || 0}rd`;
        } else {
            label_count.string = `${data.nJuShu || 0}th`;//my.util.replaceAll(text, "XXX", data.nJuShu || 0);
        }
        //label_pot.string = i18n.t("CLUB_HALL.POT") + " " + Utils.convertNumberToStr((tableInfo.nPool || 0));
        label_score._forceUpdateRenderData(true);
        //label_pot.x = label_score.width + 20;

        let btn_playback = node.getChildByName("btn_playback");
        // btn_playback.off(cc.Node.EventType.TOUCH_END);
        // btn_playback.on(cc.Node.EventType.TOUCH_END, function () {
        //     this.onClickPlayBack(data);
        // }.bind(this));

        let playbackCall = btn_playback.getComponent(cc.Button).clickEvents[0]
        if (playbackCall) {
            playbackCall.customEventData = data
        }

        let parsedTableInfo = JSON.parse(data.sTableInfo);
        let createTime = parsedTableInfo.nCreateTime;
        if (createTime && typeof createTime === 'string') {
            let timePart = createTime.split(' ')[1]; // Get time part after space
            if (timePart) {
                let timeComponents = timePart.split(':');
                label_start.string = timeComponents[0] + ':' + timeComponents[1]; // HH:mm format
            } else {
                label_start.string = '';
            }
        }
        label_totalbet.string = Utils.convertNumberToStr(data.nUserBet || 0);

        if (data.nWinLose == 0) {
            label_profit.string = Utils.convertNumberToStr(data.nWinLose);
            let color = new cc.Color(230, 229, 242, 255);
            label_profit.node.color = color;
        } else if (data.nWinLose < 0) {
            label_profit.string = Utils.convertNumberToStr(data.nWinLose);
            let color = new cc.Color(255, 30, 67, 255);
            label_profit.node.color = color;
        } else {
            label_profit.string = "+" + Utils.convertNumberToStr(data.nWinLose);
            let color = new cc.Color(0, 255, 134, 255);
            label_profit.node.color = color;
        }

        if (this._tableData.nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
            card1.active = false;
            niuniuCard.active = true;
            for (let i = 0; i < niuniuCard.children.length; i++) {
                if (handCard.arrCard && handCard.arrCard[i]) {
                    this.setCard(niuniuCard.children[i], handCard.arrCard[i]);
                }
            }
        } else {
            card1.active = true;
            niuniuCard.active = false;
            let cardNodeList = [];
            cardNodeList.push(card1);

            // if (this._tableData.nGameId == clubGameConfig.CLUB_GAME_CONFIG.Omaha){
            //     card3.active = true;
            //     card4.active = true;
            //     cardNodeList.push(card3);
            //     cardNodeList.push(card4);
            // }else{
            //     card3.active = false;
            //     card4.active = false;
            // }
            cardNodeList.push(card2);

            for (let i = 0; i < cardNodeList.length; i++) {
                if (handCard.arrCard && handCard.arrCard[i]) {
                    this.setCard(cardNodeList[i], handCard.arrCard[i]);
                }
            }

            let winInfo = JSON.parse(data.sWinInfo);
            let str = "";
            if (winInfo.isWinByGiveup) {
                // 弃牌
                str = `${Base64.decode(winInfo.sName || "")}/ /+${winInfo.sWin || 0}`;
            } else if (winInfo.isPingJu) {
                // 平局
                str = `${Base64.decode(winInfo.sName || "")}/ /0`;
            } else {
                str = `${Base64.decode(winInfo.sName || "")}/${i18n.t("CLUB_GAME_CARDTYPE." + (winInfo.nCardType || 0))}/+${winInfo.sWin || 0}`;
            }
            label_content.string = str;
        }

        node.dataId = data.nId;
    },

    onClickItem(data, node) {
        let pos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        pos = this.content.convertToNodeSpaceAR(pos);
        if (pos.y < -(cc.winSize.height / 2 - node.height * 2)) {
            this.moreMenu.anchorY = 0.2;
        } else {
            this.moreMenu.anchorY = 0.8;
        }
        this.moreMenu.y = pos.y;
        this.menuBg.active = true;
        this.moreMenu.active = true;

        let label_collect = this.moreMenu.getChildByName("btn_collect").getChildByName("label").getComponent(cc.Label);
        if (data.nCollect && data.nCollect > 0) {
            label_collect.lang = "CLUB_HALL.HAS_COLLECTION";
        } else {
            label_collect.lang = "CLUB_HALL.COLLECTION";
        }

        let label_playback = this.moreMenu.getChildByName("btn_playback").getChildByName("label").getComponent(cc.Label);
        let btn_share = this.moreMenu.getChildByName("btn_share");
        label_playback.lang = "CLUB_HALL.PLAYBACK";

        this._clickData = data;
    },

    setCard(node, card) {
        if (card) {
            let backNode = node.getChildByName("back");
            if (backNode) {
                backNode.active = false;
            }
            let x16 = 0x10;
            let x10 = x16.toString(10);//16进制转10进制

            let point = card % x10;//点数
            let flower = parseInt(card / x10);//花色
            let pokerSpriteData = App.UIAtlasClub.getPokerByDetail(point, flower);
            let pointNode = node.getChildByName("point");
            if (pointNode && pokerSpriteData) {
                pointNode.getComponent(cc.Sprite).spriteFrame = pokerSpriteData.point;
            }

            let smallFlowerNode = node.getChildByName("smallFlower");
            if (smallFlowerNode && pokerSpriteData) {
                smallFlowerNode.getComponent(cc.Sprite).spriteFrame = pokerSpriteData.flower;
            }

            let bigFlowerNode = node.getChildByName("bigFlower");
            if (bigFlowerNode && pokerSpriteData) {
                bigFlowerNode.getComponent(cc.Sprite).spriteFrame = pokerSpriteData.flower;
            }
        } else {
            let backNode = node.getChildByName("back");
            if (backNode) {
                backNode.active = true;
            }
        }
    },

    //nType: 1:近期 2:收藏
    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
        this._recordList = listData;


        let dataArr = listData;
        // let allData = [];
        // //对数据进行包装
        // for (let i = 0; i < dataArr.length; i++) {
        //     let Data = {
        //         key: "item1",
        //         data: dataArr[i]
        //     }
        //     allData.push(Data);
        // }
        // //设置数据，key为item样式，data为数据

        // this.scview.set_data(allData);
        this.listView.resetData(dataArr);
    },

    //向列表末端插入新的数据
    appendData(data) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        for (let i = 0; i < data.length; i++) {
            this._recordList.push(data[i]);
        }

        //设置列表item数据
        let dataArr = data;
        // let allData = [];
        // //对数据进行包装
        // for (let i = 0; i < dataArr.length; i++) {
        //     let newData = {
        //         key: "item1",
        //         data: dataArr[i]
        //     }
        //     allData.push(newData);
        // }

        // let tmpScview = this.scview;

        // //设置数据，key为item样式，data为数据
        // tmpScview.append_data(allData);
        this.listView.onLoadMoreFinish(data);
    },

    onClickPlayBack(event, data) {
        // 防重复点击触发多次预加载/请求
        if (this._loadingPlayback) {
            return;
        }
        this._loadingPlayback = true;

        this._clickData = data
        this.onClickMenuBg();

        if (this._tableData.nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
            this.getGameDetail(this._clickData.sPaiJuID);
            this._loadingPlayback = false; // 同步路径，立即复位
            return;
        }

        this.info.active = false;
        this._showLoading(true);

        let params = {
            sPaiJuID: this._clickData.sPaiJuID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPlaybackDataReq_CMD, params);
    },

    onClickShare() {
        this.onClickMenuBg();
        let node = cc.instantiate(this.sharePrefab);
        this.node.addChild(node);
        let HallShareView = node.getComponent("HallShareView");
        if (HallShareView) {
            let url = AppWebApi.getShareGameURL();
            let language = LocalStorage.getSysLanguage();
            url = url + "?live=1" + "&lang=" + language + "&skin=c&single=1" + "&gameid=" +
                this._tableData.nGameId + "&paijuid=" + this._clickData.sPaiJuID + "&userid=" + UserInfo.getInfo().nUserID;
            HallShareView.init(1, url);
        }
    },

    onClickCollectGame() {
        if (this._clickData.nCollect && this._clickData.nCollect > 0) {
            //已收藏
            return;
        }

        let nType = 1;
        let data = {
            nType: nType,
            sPaiJuID: this._clickData.sPaiJuID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSOpratePaiPuReq_CMD, data);
        this.onClickMenuBg();
    },



    onClickMenuBg() {
        this.menuBg.active = false;
        this.moreMenu.active = false;
        this.info.active = false;
    },

    _paiPuResp(data) {
        for (let i = 0; i < data.arrPaiJu.length; i++) {
            let handCard = JSON.parse(data.arrPaiJu[i].sHandCards);
            let tableInfo = JSON.parse(data.arrPaiJu[i].sTableInfo);
            data.arrPaiJu[i].handCard = handCard;
            data.arrPaiJu[i].tableInfo = tableInfo;

        }

        if (data.arrPaiJu.length == 0 || data.arrPaiJu.length < MAXCount) {
            this._isEnd = true;
        }

        data.arrPaiJu.sort(function (a, b) {
            return a.nId - b.nId;
        })

        if (this._recordList.length == 0) {
            this.updateScrollView(data.arrPaiJu);
        } else {
            this.appendData(data.arrPaiJu);
        }

        this.noRecord.active = this._recordList.length == 0;

        this._curPage = data.nPage;

        if (!this._isEnd && this._recordList.length < TOTAL_COUNT) {
            this.getGameRecord(this._curPage + 1);
        } else if (!this._isEnd && this.getRecordCount && this.getRecordCount > 0) {
            this.getRecordCount -= MAXCount;
            this.getGameRecord(this._curPage + 1);
        }
    },

    //显示loading
    _showLoading(isShow) {
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
        }

        if (isShow) {
            this._blockIndex = UIFrame.showLoading(i18n.t("COMMON.JIA_ZAI_ZHONG"), true, function (params) {
                this._blockIndex = 0;
            }.bind(this), 30);
        }
    },

    _playbackData1(data) {
        // 只处理来自 TexasGameReview 的请求（通过全局标记判断）
        if (!HallClubCacheData._playbackFromGameReview) {
            return;
        }

        // 重置标记
        HallClubCacheData._playbackFromGameReview = false;

        if (data.nRlt == 0) {
            let nGameId = data.nGameId;

            let item = my.bundle.getWebBundleConfig(nGameId);
            if (!item) {
                item = app.game.getGameItem(nGameId);
            }

            if (!item) {
                App.postMessage(AppBridge.EVENT.GAME_ERROR, {
                    error: AppBridge.errorID(201)
                });
                QYLogs.error("AppManager", "未配置的游戏 gameid=" + nGameId);
                return;
            }

            //加载子游戏
            // NotifyHandler.js
            app.handler.preloadGame(nGameId, (error, wrapper) => {
                //console.log("on PreloadGame: ", error, wrapper);

                let path = "TexasRecordBack";
                if (nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
                    path = "NiuNiuRecordBack";
                }
                path = wrapper.path(path, null, "resources/prefab/");
                //console.warn("path: ", path)

                wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
                    this._showLoading(false);
                    this._loadingPlayback = false;
                    if (error) {
                        QYLogs.error("HallCareerGameRecord", "资源加载失败：path=" + path, error);
                        return;
                    }


                    if (!error && cc.isValid(this)) {
                        let node = cc.instantiate(prefab);
                        node.parent = this.node;

                        // 激活 LayerWidget 以显示 TexasRecordVideo
                        let layerWidget = node.getChildByName("LayerWidget");
                        if (layerWidget) {
                            layerWidget.active = true;
                            cc.warn("HallClubRecordPaipu: 已激活 LayerWidget");
                        }

                        // 显示牌局ID
                        let paijuId = HallClubCacheData._currentPaiJuId || "";
                        if (paijuId) {
                            let panel_top = node.getChildByName("LayerView").getChildByName("content").getChildByName("panel_top");
                            if (panel_top) {
                                let paijuIdNode = panel_top.getChildByName("paijuId");
                                if (paijuIdNode) {
                                    let numNode = paijuIdNode.getChildByName("num");
                                    if (numNode) {
                                        let label = numNode.getComponent(cc.Label);
                                        if (label) {
                                            label.string = paijuId;
                                            cc.warn("HallClubRecordPaipu: 已设置牌局ID =", paijuId);
                                        }
                                    }
                                }
                            }
                        }

                        // 清理临时保存的牌局ID
                        HallClubCacheData._currentPaiJuId = null;
                    }
                    else {
                    }

                }.bind(this))
            })

        }
    },

    _playbackData(data) {
        // 如果是来自 TexasGameReview 的请求，跳过处理，让 _playbackData1 处理
        if (HallClubCacheData._playbackFromGameReview) {
            return;
        }

        const done = () => {
            this._loadingPlayback = false;
            this._showLoading(false);
        };

        if (data.nRlt != 0) {
            done();
            return;
        }

        let nGameId = data.nGameId;

        let item = my.bundle.getWebBundleConfig(nGameId);
        if (!item) {
            item = app.game.getGameItem(nGameId);
        }

        if (!item) {
            App.postMessage(AppBridge.EVENT.GAME_ERROR, {
                error: AppBridge.errorID(201)
            });
            QYLogs.error("AppManager", "未配置的游戏 gameid=" + nGameId);
            done();
            return;
        }

        // 如果有缓存的回放 Prefab，直接用，避免重复加载
        const cached = this._reviewPrefabCache[nGameId];
        if (cached) {
            this._createReviewFromPrefab(cached, data);
            done();
            return;
        }

        // 使用项目现有的游戏预加载机制
        app.handler.preloadGame(nGameId, (error, wrapper) => {
            if (error) {
                //console.error("Failed to preload game:", error);
                UIFrame.showTips("加载游戏模块失败");
                done();
                return;
            }

            let path = "TexasGameRecord";
            path = wrapper.path(path, null, "resources/prefab/");

            wrapper.bundle.load(path, cc.Prefab, (err, prefab) => {
                if (err) {
                    //console.error("Failed to load TexasGameReview prefab:", err);
                    UIFrame.showTips("回放预制体加载失败");
                    done();
                    return;
                }
                if (!cc.isValid(this.node)) {
                    // 容器已销毁，直接结束
                    done();
                    return;
                }

                // 缓存 Prefab，避免重复加载
                this._reviewPrefabCache[nGameId] = prefab;

                this._createReviewFromPrefab(prefab, data);
                done();
            });
        });
    },

    _createReviewFromPrefab(prefab, data) {
        // 若已有旧的回放节点，先销毁，避免堆积
        if (this._reviewNode && cc.isValid(this._reviewNode)) {
            this._reviewNode.destroy();
            this._reviewNode = null;
        }

        let reviewNode = cc.instantiate(prefab);
        this.node.addChild(reviewNode);
        this._reviewNode = reviewNode;

        // 回放界面销毁时，清理引用，避免悬挂
        reviewNode.once('destroy', () => {
            if (this._reviewNode === reviewNode) {
                this._reviewNode = null;
            }
        });

        // 取实际组件并下发数据
        let reviewComponent = null;
        // 兼容不同层级命名
        let layer = reviewNode.getChildByName("LayerGameReview");
        if (layer) {
            reviewComponent = layer.getComponent("TexasGameReview");
        } else {
            reviewComponent = reviewNode.getComponent("TexasGameReview");
        }

        if (reviewComponent && typeof reviewComponent._freshData === 'function') {
            data.sTableId = this._tableData.sTableId
            reviewComponent._freshData(data);
        } else {
            //console.error("TexasGameReview component or method not found");
            UIFrame.showTips("回放组件加载失败");
            // 创建失败即销毁，避免占用
            reviewNode.destroy();
        }
    },

    initInfo(data) {
        let content = this.info.getChildByName("content");
        content.destroyAllChildren();
        content.width = 0;
        for (let i = 0; i < data.length; i++) {
            let item = cc.instantiate(this.infoItem);
            item.active = true;
            let headNode = item.getChildByName("headNode");
            let widget = headNode.getComponent(cc.Widget);
            widget.updateAlignment();
            let head = item.getChildByName("headNode").getChildByName("head").getComponent(cc.Sprite);
            let label_name = head.node.getChildByName("label_name").getComponent(cc.Label);
            Utils.changeUserHead(head, data[i].sFaceID, app.ClubAssets);
            label_name.string = Utils.getShortText(Base64.decode(data[i].sName), 12);
            let cardList = item.getChildByName("cardList");
            for (let k = 0; k < cardList.children.length; k++) {
                if (data[i].arrCard && data[i].arrCard[k]) {
                    this.setCard(cardList.children[k], data[i].arrCard[k]);
                }
            }

            let cardType = item.getChildByName("cardTypeNode").getChildByName("cardType").getComponent(cc.Sprite);
            let label_cardType = cardType.node.getChildByName("label_cardType").getComponent(cc.Label);
            if (data[i].cardType == 0) {
                label_cardType.lang = "CLUB_GAME_NIUNIU.0";
                cardType.spriteFrame = this.inofItemBgRes[0];
            } else if (data[i].cardType >= 1 && data[i].cardType <= 9) {
                label_cardType.lang = "CLUB_GAME_NIUNIU." + data[i].cardType;
                cardType.spriteFrame = this.inofItemBgRes[1];
            } else {
                label_cardType.lang = "CLUB_GAME_NIUNIU." + data[i].cardType;
                cardType.spriteFrame = this.inofItemBgRes[2];
            }

            let label_baseScore = item.getChildByName("label_baseScore").getComponent(cc.Label);
            label_baseScore.string = Utils.convertNumberToStr(data[i].nBaseScore);

            let label_winorlose = item.getChildByName("label_winorlose").getComponent(cc.Label);
            let nWinLose = data[i].nProfit;
            if (nWinLose == 0) {
                label_winorlose.string = Utils.convertNumberToStr(nWinLose);
                let color = new cc.Color(230, 229, 242, 255);
                label_winorlose.node.color = color;
            } else if (nWinLose < 0) {
                label_winorlose.string = Utils.convertNumberToStr(nWinLose);
                let color = new cc.Color(255, 30, 67, 255);
                label_winorlose.node.color = color;
            } else {
                label_winorlose.string = "+" + Utils.convertNumberToStr(nWinLose);
                let color = new cc.Color(0, 255, 134, 255);
                label_winorlose.node.color = color;
            }

            let banker = head.node.getChildByName("banker");
            banker.active = data[i].isBanker;

            content.addChild(item);
        }

        this.info.active = true;
        this.menuBg.active = true;
    },

    _paijuDetail(data) {
        let detailData = [];
        let playerList = JSON.parse(data.tUsersInfo);
        let cardList = JSON.parse(data.tDealCardInfo);
        for (let i = 0; i < playerList.length; i++) {
            let tmpData = playerList[i];
            if (tmpData.nSitId == data.nZhuang) {
                tmpData.isBanker = true;
            } else {
                tmpData.isBanker = false;
            }

            tmpData.nBaseScore = data.nAnte;

            for (let k = 0; k < cardList.length; k++) {
                if (cardList[k].nSitId == tmpData.nSitId) {
                    tmpData.arrCard = cardList[k].arrCard;
                    tmpData.cardType = cardList[k].nCardType;
                    tmpData.nNiuTimes = cardList[k].nNiuTimes;
                    break;
                }
            }

            detailData.push(tmpData);

        }

        detailData.sort(function (a, b) {
            return a.nSitId - b.nSitId;
        })

        this.initInfo(detailData);

    },

    _opratePaiPu(data) {
        if (data.nRlt == 0) {
            if (data.nType == 1) {
                for (let i = 0; i < this._recordList.length; i++) {
                    if (this._recordList[i].sPaiJuID == data.sPaiJuID) {
                        this._recordList[i].nCollect = 1;
                        break;
                    }
                }

                if (this.scview) {
                    this.scview.render_items();
                }
            }

        }
    },

    onAttachCell(cell) {
        cell.node.active = true;
        this.initItem(cell.node, cell.getData())
    },

    onLoadMoreStart() {
        let isGetAll = this.getRecordCount && this.getRecordCount > 0;
        if (!this._isEnd && this._recordList.length >= TOTAL_COUNT && !isGetAll) {
            this.getRecordCount = TOTAL_COUNT;
            this.getGameRecord(this._curPage + 1);
        } else {
            this.listView.onLoadMoreFinish();
        }
    },
});
