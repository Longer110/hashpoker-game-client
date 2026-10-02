// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部牌局记录
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
let clubGameConfig = require("clubGameConfig");
let HallClubLogic = require("HallClubLogic");
let Base64 = require("base64");
let MAXCount = 10;
let UIListView = require("UIListView");
let TOTAL_COUNT = 50;
let AppWebApi = require("AppWebApi");

cc.Class({
    extends: cc.Component,

    properties: {
        scrollview1: {
            default: null,
            type: cc.ScrollView,
        },

        listView1: {
            default: null,
            type: UIListView,
        },

        listView2: {
            default: null,
            type: UIListView,
        },

        mask1: {
            default: null,
            type: cc.Node
        },
        itmeContent1: {
            default: null,
            type: cc.Node
        },
        scrollview2: {
            default: null,
            type: cc.ScrollView,
        },
        mask2: {
            default: null,
            type: cc.Node
        },
        itmeContent2: {
            default: null,
            type: cc.Node
        },
        item: {
            default: null,
            type: cc.Node
        },

        btn_record: cc.Node,
        btn_collection: cc.Node,
        content: cc.Node,
        moreMenu: cc.Node,
        menuBg: cc.Node,
        noRecord: cc.Node,
        sContent: cc.Node,
        btn_texas: cc.Node,
        btn_omaha: cc.Node,
        btn_shortCard: cc.Node,
        btn_niuniu: cc.Node,
        info: cc.Node,
        infoItem: cc.Node,
        inofItemBgRes: {
            default: [],
            type: cc.SpriteFrame,
        },

        sharePrefab: cc.Prefab,

        _recordList1: [],
        _recordList2: [],
        _curGameId: clubGameConfig.CLUB_GAME_CONFIG.Texas,
        _curType: 1, //类型:1:近期  2:收藏
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.listView1.init(this);
        this.listView2.init(this);
        this.initUI();
        this.getGameRecord(0, this._curType, true);
        // this.getGameRecord(0, 2);
        this.regiester();

        if (cc.sys.isMobile) {
            this._onResizedCallback = this._onResized.bind(this);
            //window.addEventListener("resize", this._onResizedCallback, false);
        }
        else {
            //cc.view.on("canvas-resize", this._onResized, this);
        }

        this._onResized();
    },

    // update (dt) {},

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSPaiPuResp_ui, this._paiPuResp, this);
        MsgManager.on(MSG.NOTIFY.ClubSOpratePaiPuResp_ui, this._opratePaiPu, this);
        MsgManager.on(MSG.NOTIFY.ClubSPlaybackDataResp_ui, this._playbackData, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetPaijuDetailRsp_ui, this._paijuDetail, this);
    },

    onDestroy() {
        MsgManager.un(this._paiPuResp);
        MsgManager.un(this._opratePaiPu);
        MsgManager.un(this._playbackData);
        MsgManager.un(this._paijuDetail);
        // this.scview1.destroy();
        // this.scview2.destroy();
    },

    _onResized() {
        // if (this.scrollview1){
        //     let widget = this.scrollview1.node.getComponent(cc.Widget);
        //     let mWidget = this.mask1.getComponent(cc.Widget);
        //     widget.updateAlignment();
        //     mWidget.updateAlignment();
        //     let contentSize = this.scrollview1.node.getContentSize();
        //     this.scview1.reset_size(contentSize.width, contentSize.height);
        // }

        // if (this.scrollview2){
        //     let widget2 = this.scrollview2.node.getComponent(cc.Widget);
        //     let mWidget2 = this.mask2.getComponent(cc.Widget);
        //     widget2.updateAlignment();
        //     mWidget2.updateAlignment();
        //     let contentSize2 = this.scrollview2.node.getContentSize();
        //     this.scview2.reset_size(contentSize2.width, contentSize2.height);
        // }
    },

    initUI() {
        this.onClickGame(null, 1);

        let openGameList = HallClubLogic.getOpenGameId();
        this.btn_texas.active = false;
        this.btn_shortCard.active = false;
        this.btn_omaha.active = false;
        this.btn_niuniu.active = false;

        if (!openGameList) {
            return;
        }


        for (let i = 0; i < openGameList.length; i++) {
            if (openGameList[i] == clubGameConfig.CLUB_GAME_CONFIG.Texas) {
                this.btn_texas.active = true;
            }
            if (openGameList[i] == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
                this.btn_shortCard.active = true;
            }
            if (openGameList[i] == clubGameConfig.CLUB_GAME_CONFIG.Omaha) {
                this.btn_omaha.active = true;
            }
            if (openGameList[i] == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
                this.btn_niuniu.active = true;
            }

        }
    },

    //nType: 1：近期 2：收藏
    getGameRecord(nIdOfStart, nType, isCleanData) {
        if (isCleanData) {
            this._recordList1 = [];
            this._recordList2 = [];
            this._isEnd1 = false;
            this._isEnd2 = false;
        }

        let data = {
            nType: nType,
            nIdOfStart: nIdOfStart,
            nCnt: MAXCount,
            nGameId: this._curGameId,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPaiPuReq_CMD, data);

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

    initItem(node, data) {
        let button = node.getComponent(cc.Button);
        button.node.off(cc.Node.EventType.TOUCH_END);
        button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onClickItem(data, node);
        }.bind(this));

        if (node.dataId && node.dataId == data.nId) {
            return;
        }

        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        let label_score = node.getChildByName("label_score").getComponent(cc.Label);
        let label_count = node.getChildByName("label_count").getComponent(cc.Label);
        let label_profit = node.getChildByName("label_profit").getComponent(cc.Label);
        let label_pot = node.getChildByName("label_pot").getComponent(cc.Label);
        let commonCard = node.getChildByName("commonCard");
        let omahaCard = node.getChildByName("omahaCard");
        let niuniuCard = node.getChildByName("niuniuCard");
        let handCard = data.handCard;
        let tableInfo = data.tableInfo;


        label_time.string = data.sTime;

        let text = i18n.t("CLUB_HALL.HAND");
        label_count.string = my.util.replaceAll(text, "XXX", data.nHand || 0);
        label_pot.string = i18n.t("CLUB_HALL.POT") + " " + Utils.convertNumberToStr((tableInfo.nPool || 0));

        if (data.nWinLose == 0) {
            label_profit.string = Utils.convertNumberToStr(data.nWinLose);
            let color = new cc.Color(230, 229, 242, 255);
            label_profit.node.color = color;
        } else if (data.nWinLose > 0) {
            label_profit.string = "+" + Utils.convertNumberToStr(data.nWinLose);
            let color = new cc.Color(255, 30, 67, 255);
            label_profit.node.color = color;
        } else {
            label_profit.string = Utils.convertNumberToStr(data.nWinLose);
            let color = new cc.Color(0, 255, 134, 255);
            label_profit.node.color = color;
        }

        if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
            commonCard.active = false;
            omahaCard.active = false;
            niuniuCard.active = true;
            label_pot.node.active = false;
            for (let i = 0; i < niuniuCard.children.length; i++) {
                if (handCard.arrCard && handCard.arrCard[i]) {
                    this.setCard(niuniuCard.children[i], handCard.arrCard[i]);
                }
            }

            label_score.string = Utils.convertNumberToStr(tableInfo.nBaseScore || 0)

        } else {
            commonCard.active = false;
            omahaCard.active = false;
            niuniuCard.active = false;
            label_pot.node.active = true;
            let cardNodeList = commonCard.children;

            if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.Omaha) {
                omahaCard.active = true;
                cardNodeList = omahaCard.children;
            } else {
                commonCard.active = true;
            }

            for (let i = 0; i < cardNodeList.length; i++) {
                if (handCard.arrCard && handCard.arrCard[i]) {
                    this.setCard(cardNodeList[i], handCard.arrCard[i]);
                }
            }

            label_score.string = (Utils.convertNumberToStr(tableInfo.nSmallBlind) || 0) + "/" + (Utils.convertNumberToStr(tableInfo.nBigBlind) || 0);
        }

        label_score._forceUpdateRenderData(true);

        // label_pot.node.x = label_score.node.x + label_score.node.width + 30;

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
        if (this.scrollview1.node.active) {
            if (data.nCollect && data.nCollect > 0) {
                label_collect.lang = "CLUB_HALL.HAS_COLLECTION";
            } else {
                label_collect.lang = "CLUB_HALL.COLLECTION";
            }

        } else {
            label_collect.lang = "CLUB_HALL.UNCOLLECTION";
        }

        let label_playback = this.moreMenu.getChildByName("btn_playback").getChildByName("label").getComponent(cc.Label);
        label_playback.lang = "CLUB_HALL.PLAYBACK";
        let btn_share = this.moreMenu.getChildByName("btn_share");
        if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
            // label_playback.lang = "CLUB_HALL_RECORD.LOOK_INFO";
            // btn_share.active  = false;
        } else {
            // label_playback.lang = "CLUB_HALL.PLAYBACK";
            // // btn_share.active = true;
        }

        this._clickData = data;
    },

    setCard(node, card) {
        let x16 = 0x10;
        let x10 = x16.toString(10);//16进制转10进制

        let point = card % x10;//点数
        let flower = parseInt(card / x10);//花色

        let frame = App.UIAtlasClub.getPokerDeZhouByDetail(point, flower);
        if (null != frame) {
            node.getComponent(cc.Sprite).spriteFrame = frame;
        }
    },

    //nType: 1:近期 2:收藏
    updateScrollView(listData, nType) {
        //设置列表item数据
        if (nType == 1) {
            this._recordList1 = Utils.clone(listData || []);
        } else {
            this._recordList2 = Utils.clone(listData || []);
        }

        let dataArr = listData;

        if (nType == 1) {
            this.listView1.resetData(dataArr);
        } else {
            this.listView2.resetData(dataArr);
        }



    },

    //向列表末端插入新的数据
    appendData(data, nType) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        if (nType == 1) {
            for (let i = 0; i < data.length; i++) {
                this._recordList1.push(data[i]);
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                this._recordList2.push(data[i]);
            }
        }

        if (nType == 2) {
            this.listView2.onLoadMoreFinish(data);
        } else {
            this.listView1.onLoadMoreFinish(data);
        }

    },

    onClickRecord() {
        this._curType = 1;
        this.setBtnStatus(1);
        this.scrollview1.node.active = true;
        this.scrollview2.node.active = false;
        if (this._recordList1.length == 0) {
            this.getGameRecord(0, 1);
        } else {
            this.noRecord.active = this._recordList1.length == 0;
        }
    },

    onClickCollection() {
        this._curType = 2;
        if (this._recordList2.length == 0) {
            this.getGameRecord(0, 2);
        } else {
            this.noRecord.active = this._recordList2.length == 0;
        }
        this.setBtnStatus(2);
        this.scrollview1.node.active = false;
        this.scrollview2.node.active = true;

    },

    setBtnStatus(index) {
        let nor1 = this.btn_record.getChildByName("nor");
        let sel1 = this.btn_record.getChildByName("sel");
        let nor2 = this.btn_collection.getChildByName("nor");
        let sel2 = this.btn_collection.getChildByName("sel");

        if (index == 1) {
            nor1.active = false;
            sel1.active = true;
            nor2.active = true;
            sel2.active = false;
        } else {
            nor1.active = true;
            sel1.active = false;
            nor2.active = false;
            sel2.active = true;
        }
    },

    setBtnGameStatus(btn, isSelect) {
        let nor = btn.getChildByName("nor");
        let sel = btn.getChildByName("sel");

        nor.active = !isSelect;
        sel.active = isSelect;
    },

    onClickPlayBack() {
        this.onClickMenuBg();

        // if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang){
        //     this.getGameDetail(this._clickData.sPaiJuID);
        //     return;
        // }

        this.info.active = false;
        this._showLoading(true);

        let data = {
            sPaiJuID: this._clickData.sPaiJuID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPlaybackDataReq_CMD, data);
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
                this._curGameId + "&paijuid=" + this._clickData.sPaiJuID + "&userid=" + UserInfo.getInfo().nUserID;
            HallShareView.init(1, url);
        }
    },

    onClickCollectGame() {
        let nType = 1;
        if (this.scrollview2.node.active) {
            nType = 2;
        } else {
            if (this._clickData.nCollect && this._clickData.nCollect > 0) {
                //已收藏
                return;
            }
        }

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
        if (data.nGameId != this._curGameId) {
            return;
        }

        for (let i = 0; i < data.arrRecords.length; i++) {
            let handCard = JSON.parse(data.arrRecords[i].sHandCards);
            let tableInfo = JSON.parse(data.arrRecords[i].sTableInfo);
            data.arrRecords[i].handCard = handCard;
            data.arrRecords[i].tableInfo = tableInfo;

        }

        this.noRecord.active = false;

        if (data.nType == 1) {
            //近期
            if (data.arrRecords.length == 0 || data.arrRecords.length < MAXCount) {
                this._isEnd1 = true;
            }

            data.arrRecords.sort(function (a, b) {
                return b.nId - a.nId;
            })

            if (this._recordList1.length == 0) {
                this.updateScrollView(data.arrRecords, data.nType);
            } else {
                this.appendData(data.arrRecords, data.nType);
            }

            if (this.scrollview1.node.active) {
                this.noRecord.active = this._recordList1.length == 0;
            }

            if (!this._isEnd1 && this._recordList1.length < TOTAL_COUNT) {
                this.getGameRecord(this._recordList1[this._recordList1.length - 1].nId, 1);
            } else if (!this._isEnd1 && this.getRecordCount1 && this.getRecordCount1 > 0) {
                this.getRecordCount1 -= MAXCount;
                this.getGameRecord(this._recordList1[this._recordList1.length - 1].nId, 1);
            }

        } else {
            //收藏
            if (data.arrRecords.length == 0 || data.arrRecords.length < MAXCount) {
                this._isEnd2 = true;
            }

            data.arrRecords.sort(function (a, b) {
                return b.nId - a.nId;
            })

            if (this._recordList2.length == 0) {
                this.updateScrollView(data.arrRecords, data.nType);
            } else {
                this.appendData(data.arrRecords, data.nType);
            }

            if (this.scrollview2.node.active) {
                this.noRecord.active = this._recordList2.length == 0;
            }

            if (!this._isEnd2 && this._recordList2.length < TOTAL_COUNT) {
                this.getGameRecord(this._recordList2[this._recordList2.length - 1].nId, 2);
            } else if (!this._isEnd2 && this.getRecordCount2 && this.getRecordCount2 > 0) {
                this.getRecordCount2 -= MAXCount;
                this.getGameRecord(this._recordList2[this._recordList2.length - 1].nId, 1);
            }
        }
    },

    _opratePaiPu(data) {
        if (data.nRlt == 0) {
            if (data.nType == 1) {
                // if (!this._isEnd2 && this._recordList1.length >= MAXCount){
                //     return;
                // }

                let record = [];
                for (let i = 0; i < this._recordList1.length; i++) {
                    if (this._recordList1[i].sPaiJuID == data.sPaiJuID) {
                        this._recordList1[i].nCollect = 1;
                        record.push(this._recordList1[i]);
                        break;
                    }
                }


                if (this._recordList2.length == 0) {
                    this.updateScrollView(record, 2);
                } else {
                    this.appendData(record, 2);
                }
            } else {
                let target = this.listView2.queryCell((cell) => {
                    if (cell.getData().sPaiJuID == data.sPaiJuID) {
                        return true;
                    }
                })

                if (target) {
                    this.listView2.removeCell(target);
                }

                for (let i = 0; i < this._recordList2.length; i++) {
                    if (this._recordList2[i].sPaiJuID == data.sPaiJuID) {
                        this._recordList2.splice(i, 1);
                        break;
                    }
                }

                for (let i = 0; i < this._recordList1.length; i++) {
                    if (this._recordList1[i].sPaiJuID == data.sPaiJuID) {
                        this._recordList1[i].nCollect = 0;
                        break;
                    }
                }

                if (this.scrollview2.node.active) {
                    this.noRecord.active = this._recordList2.length == 0;
                }
            }

        } else if (data.nRlt == 1 || data.nRlt == 2 || data.nRlt == 3) {
            if (data.nType == 1) {
                let target = this.listView1.queryCell((cell) => {
                    if (cell.getData().sPaiJuID == data.sPaiJuID) {
                        return true;
                    }
                })

                this.listView1.removeCell(target);
            } else {
                let target = this.listView2.queryCell((cell) => {
                    if (cell.getData().sPaiJuID == data.sPaiJuID) {
                        return true;
                    }
                })

                this.listView2.removeCell(target);
            }
        } else if (data.nRlt == 4) {
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

    _playbackData(data) {
        return;
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
                    if (error) {
                        QYLogs.error("HallCareerGameRecord", "资源加载失败：path=" + path, error);
                        return;
                    }

                    if (!error && cc.isValid(this)) {
                        let node = cc.instantiate(prefab);
                        node.parent = this.node;
                    }
                    else {
                    }

                }.bind(this))
            })

        }
    },

    onClickGame(event, data) {
        let index = Number(data);
        switch (index) {
            case 1:
                //德州牌桌
                this.setBtnGameStatus(this.btn_texas, true);
                this.setBtnGameStatus(this.btn_omaha, false);
                this.setBtnGameStatus(this.btn_shortCard, false);
                this.setBtnGameStatus(this.btn_niuniu, false);
                if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.Texas) {
                    return;
                }
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.Texas;

                break;
            case 2:
                //奥马哈牌桌
                this.setBtnGameStatus(this.btn_texas, false);
                this.setBtnGameStatus(this.btn_omaha, true);
                this.setBtnGameStatus(this.btn_shortCard, false);
                this.setBtnGameStatus(this.btn_niuniu, false);
                if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.Omaha) {
                    return;
                }
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.Omaha;

                break;
            case 3:
                //短牌牌桌
                this.setBtnGameStatus(this.btn_texas, false);
                this.setBtnGameStatus(this.btn_omaha, false);
                this.setBtnGameStatus(this.btn_shortCard, true);
                this.setBtnGameStatus(this.btn_niuniu, false);
                if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
                    return;
                }
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.ShortTexas;

                break;
            case 4:
                //抢庄牛牛
                this.setBtnGameStatus(this.btn_texas, false);
                this.setBtnGameStatus(this.btn_omaha, false);
                this.setBtnGameStatus(this.btn_shortCard, false);
                this.setBtnGameStatus(this.btn_niuniu, true);
                if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
                    return;
                }
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang;
                break;
        }

        this.getGameRecord(0, this._curType, true);
    },

    initInfo(data) {
        let content = this.info.getChildByName("content");
        content.destroyAllChildren();
        for (let i = 0; i < data.length; i++) {
            let item = cc.instantiate(this.infoItem);
            item.active = true;
            let head = item.getChildByName("head").getComponent(cc.Sprite);
            let label_name = head.node.getChildByName("label_name").getComponent(cc.Label);
            Utils.changeUserHead(head, data[i].sFaceID, app.ClubAssets);
            label_name.string = Utils.getShortText(Base64.decode(data[i].sName), 20);
            let cardList = item.getChildByName("cardList");
            for (let k = 0; k < cardList.children.length; k++) {
                if (data[i].arrCard && data[i].arrCard[k]) {
                    this.setCard(cardList.children[k], data[i].arrCard[k]);
                }
            }

            let cardType = item.getChildByName("cardType").getComponent(cc.Sprite);
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
            } else if (nWinLose > 0) {
                label_winorlose.string = "+" + Utils.convertNumberToStr(nWinLose);
                let color = new cc.Color(255, 30, 67, 255);
                label_winorlose.node.color = color;
            } else {
                label_winorlose.string = Utils.convertNumberToStr(nWinLose);
                let color = new cc.Color(0, 255, 134, 255);
                label_winorlose.node.color = color;
            }

            let banker = item.getChildByName("banker");
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

    onAttachCell(cell) {
        cell.node.active = true;
        this.initItem(cell.node, cell.getData())
    },

    onRefreshStart() {
    },

    onLoadMoreStart() {
        if (this.scrollview1.node.active) {
            let isGetAll = this.getRecordCount1 && this.getRecordCount1 > 0;
            if (!this._isEnd1 && this._recordList1.length >= TOTAL_COUNT && !isGetAll) {
                this.getRecordCount1 = TOTAL_COUNT;
                this.getGameRecord(this._recordList1[this._recordList1.length - 1].nId, 1);
            } else {
                this.listView1.onLoadMoreFinish();
            }

        } else if (this.scrollview2.node.active) {
            let isGetAll = this.getRecordCount2 && this.getRecordCount2 > 0
            if (!this._isEnd2 && this._recordList2.length >= TOTAL_COUNT && !isGetAll) {
                this.getRecordCount2 = TOTAL_COUNT;
                this.getGameRecord(this._recordList2[this._recordList2.length - 1].nId, 2);
            } else {
                this.listView2.onLoadMoreFinish();
            }
        }
    },
});
