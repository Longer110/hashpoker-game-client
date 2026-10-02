// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//战绩
let i18n = require("i18n");
let TAG = "club_game";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");
let clubGameConfig = require("clubGameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        item: {
            default: null,
            type: cc.Node
        },

        scrollview1: cc.ScrollView,
        scrollview2: cc.ScrollView,
        scrollview3: cc.ScrollView,
        prefab: cc.Prefab,
        noRecord: cc.Node,
        btn_gold: cc.Node,
        btn_club: cc.Node,
        btn_texas: cc.Node,
        btn_omaha: cc.Node,
        btn_shortCard: cc.Node,
        label_gameCount: cc.Label,
        label_profitAndLoss: cc.Label,
        label_totalHand: cc.Label,
        label_partakeRate: cc.Label,
        label_addBetRate: cc.Label,
        label_allinRate: cc.Label,

        recordInfoPrefab: cc.Prefab,

        _recordList: null,
        _recordInfo: null,
        _curGameId: 0,
        _curGoldType: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        app.util.addClickSoundToNode(this.node);
    },

    start() {
        this.initInfo({});
        this.regiester();
        this._recordList = {};
        this._recordInfo = {};
        this.initList();
        this.onClickGame(null, 1);
    },

    // update (dt) {},

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSGetPersonTableRecordRsp_ui, this._tableRecord, this);
    },

    onDestroy() {
        MsgManager.un(this._tableRecord);
    },

    onClickClose() {
        this.node.destroy();
    },

    getGameRecord(nIdOfStart, nGameId) {
        let clubId = HallClubCacheData.getCurLoginClub();
        let data = {
            nIdOfStart: nIdOfStart,
            nCnt: 15,
            nGameId: nGameId,
            nGoldType: 2,
            nClubId: clubId,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetPersonTableRecordReq_CMD, data);

    },

    initInfo(data) {
        this.label_gameCount.string = data.nPaiJuCnt || 0;
        this.label_profitAndLoss.string = Utils.convertNumberToStr(data.nWinLose || 0);
        this.label_totalHand.string = data.nHandCnt || 0;

        if (data.nInpoolRate) {
            this.label_partakeRate.string = Math.floor(data.nInpoolRate) + "%";
        } else {
            this.label_partakeRate.string = 0;
        }

        if (data.nBFlopRaiseRate) {
            this.label_addBetRate.string = Math.floor(data.nBFlopRaiseRate) + "%";
        } else {
            this.label_addBetRate.string = 0;
        }

        if (data.nAllInAndWinRate) {
            this.label_allinRate.string = Math.floor(data.nAllInAndWinRate) + "%";
        } else {
            this.label_allinRate.string = 0;
        }

    },

    //初始化滚动列表
    initList() {
        QYLogs.log(TAG, "----------------initList---------------");

        //调用构造函数，传入构造参数
        this.scviewTexas = this.createScview(this.scrollview1, this.scroll_to_end_cb1.bind(this));
        this.scviewOmaha = this.createScview(this.scrollview2, this.scroll_to_end_cb2.bind(this));
        this.scviewShortCard = this.createScview(this.scrollview3, this.scroll_to_end_cb3.bind(this));
    },

    createScview(scrollview, scroll_to_end_cb) {
        let mask = scrollview.node.getChildByName("view");
        let content = mask.getChildByName("content");

        //调用构造函数，传入构造参数
        let scview = new DynamicListView({
            scrollview: scrollview,
            mask: mask,
            content: content,
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
            scroll_to_end_cb: scroll_to_end_cb,
        });

        return scview;
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        this.initItem(node, data, index);

        return [node.width, node.height];
    },

    scroll_to_end_cb1(dataArr) {
        if (dataArr.length <= 0 || this._isEnd1) return;
        let gameId = clubGameConfig.CLUB_GAME_CONFIG.Texas;
        let data = this._recordList[gameId]
        this.getGameRecord(data[data.length - 1].nId, gameId);
    },

    scroll_to_end_cb2(dataArr) {
        if (dataArr.length <= 0 || this._isEnd2) return;
        let gameId = clubGameConfig.CLUB_GAME_CONFIG.Omaha;
        let data = this._recordList[gameId]
        this.getGameRecord(data[data.length - 1].nId, gameId);
    },

    scroll_to_end_cb3(dataArr) {
        if (dataArr.length <= 0 || this._isEnd3) return;
        let gameId = clubGameConfig.CLUB_GAME_CONFIG.ShortTexas;
        let data = this._recordList[gameId]
        this.getGameRecord(data[data.length - 1].nId, gameId);
    },

    updateScrollView(listData, index) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
        let scview = null;
        if (index == 1) {
            scview = this.scviewTexas;
        } else if (index == 2) {
            scview = this.scviewOmaha;
        } else if (index == 3) {
            scview = this.scviewShortCard;
        }

        this._recordList[this._curGameId] = listData;

        let dataArr = listData;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "item1",
                data: dataArr[i]
            }
            allData.push(Data);
        }
        //设置数据，key为item样式，data为数据

        scview.set_data(allData);
    },

    //向列表末端插入新的数据
    appendData(data, index) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        let scview = null;
        if (index == 1) {
            scview = this.scviewTexas;
        } else if (index == 2) {
            scview = this.scviewOmaha;
        } else if (index == 3) {
            scview = this.scviewShortCard;
        }

        for (let i = 0; i < data.length; i++) {
            this._recordList[this._curGameId].push(data[i]);
        }

        //设置列表item数据
        let dataArr = data;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let newData = {
                key: "item1",
                data: dataArr[i]
            }
            allData.push(newData);
        }

        //设置数据，key为item样式，data为数据
        scview.append_data(allData);
    },

    initItem(node, data, index) {
        let label_day = node.getChildByName("time").getChildByName("labelDay").getComponent(cc.Label);
        let label_month = node.getChildByName("time").getChildByName("labelMonth").getComponent(cc.Label);
        let label_roomName = node.getChildByName("label_roomName").getComponent(cc.Label);
        let label_gameName = node.getChildByName("label_gameName").getComponent(cc.Label);
        let label_gameTime = node.getChildByName("label_gameTime").getComponent(cc.Label);
        let label_score = node.getChildByName("label_score").getComponent(cc.Label);
        let label_profit = node.getChildByName("label_profit").getComponent(cc.Label);
        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        let head = node.getChildByName("head").getComponent(cc.Sprite);
        let insure = node.getChildByName("insure");
        let AOF = node.getChildByName("AOF");
        insure.active = false;
        AOF.active = false;

        let sExData = JSON.parse(data.sExData);
        if (sExData.isAOF) {
            AOF.active = true;
        } else if (sExData.isInsure > 0) {
            insure.active = true;
        }

        if (data.isToday) {
            label_day.lang = "CLUB_HALL_RECORD.TODAY";
            label_month.string = "";
        } else {
            if (data.isShowTime) {
                label_day.string = Utils.replaceAll(i18n.t("CLUB_HALL_RECORD.DAY"), "XXX", data.day);
                label_month.string = Utils.replaceAll(i18n.t("CLUB_HALL_RECORD.MONTH"), "XXX", data.month);
            } else {
                label_day.string = "";
                label_month.string = "";
            }

        }

        label_roomName.string = data.sTableName;
        label_gameName.lang = "HALL_CLUB_GAME_NAME." + data.nGameId;
        let keepTime = data.nKeepTime / 60;
        if (keepTime >= 60) {
            label_gameTime.string = Utils.replaceAll(i18n.t("CLUB_HALL.DAYS"), "XXX", keepTime / 60);
        } else {
            label_gameTime.string = Utils.replaceAll(i18n.t("CLUB_HALL.MIN"), "XXX", keepTime);
        }

        label_score.string = Utils.convertNumberToStr(data.nSmallBlind) + "/" + Utils.convertNumberToStr(data.nBigBlind);
        this.setLabelColor(label_profit, data.nWinLose);
        label_time.string = data.time;
        Utils.changeUserHead(head, data.sFaceId, app.ClubAssets);


        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(data);
        }.bind(this))
    },

    setLabelColor(label, value) {
        if (value == 0) {
            label.string = Utils.convertNumberToStr(value);
            let color = new cc.Color(230, 229, 242, 255);
            label.node.color = color;
        } else if (value > 0) {
            label.string = "+" + Utils.convertNumberToStr(value);
            let color = new cc.Color(255, 30, 67, 255);
            label.node.color = color;
        } else {
            label.string = Utils.convertNumberToStr(value);
            let color = new cc.Color(0, 255, 134, 255);
            label.node.color = color;
        }
    },

    onClickItem(data) {
        let node = cc.instantiate(this.recordInfoPrefab);
        this.node.addChild(node);
        let com = node.getComponent("HallClubRecordInfo");
        if (com) {
            com.init(data);
        }
    },

    _tableRecord(data) {
        if (data.nIdOfStart == 0 && data.tStatics) {
            this._recordInfo[data.nGameId] = data.tStatics;
            this.initInfo(data.tStatics);
        }

        if (data.arrRecords.length == 0) {
            if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.Texas) {
                this._isEnd1 = true;
            }
            if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.Omaha) {
                this._isEnd2 = true;
            }
            if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
                this._isEnd3 = true;
            }

            return;
        }

        data.arrRecords.sort(function (a, b) {
            return b.nId - a.nId;
        })

        var date = new Date();
        let year = date.getFullYear(); //获取完整的年份(4位)
        let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        let day = date.getDate(); //获取当前日(1-31)

        let record = [];
        let lastTime = "";
        for (let i = 0; i < data.arrRecords.length; i++) {
            let tmp = data.arrRecords[i];
            let timeArray = tmp.sTime.split(" ");
            let dateArray = timeArray[0].split("-");
            let array = timeArray[1].split(":");

            if (i == 0 && dateArray[0] == year && dateArray[1] == month && dateArray[2] == day) {
                if (!this._recordList[data.nGameId]) {
                    tmp.isToday = true;
                }
            }
            if (i > 0) {
                if (lastTime == timeArray[0]) {
                    tmp.isShowTime = false
                } else {
                    tmp.isShowTime = true;
                }

            }
            tmp.time = array[0] + ":" + array[1];
            tmp.month = dateArray[1];
            tmp.day = dateArray[2];
            let jsData = JSON.parse(tmp.sExData);
            tmp.isInsure = jsData.isInsure;
            tmp.isAOF = jsData.isAOF;
            tmp.nSmallBlind = jsData.nSB;
            tmp.nBigBlind = jsData.nBB;
            tmp.sTableName = Base64.decode(tmp.sTableName);
            tmp.nGameId = data.nGameId;
            record.push(tmp)
            lastTime = timeArray[0];
        }

        if (!this._recordList[data.nGameId]) {
            this._recordList[data.nGameId] = [];
        }

        let index = 1;
        if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.Texas) {
            index = 1;
        }
        if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.Omaha) {
            index = 2;
        }
        if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas) {
            index = 3;
        }

        if (this._recordList[data.nGameId].length == 0) {
            this.updateScrollView(record, index);
        } else {
            this.appendData(record, index);
        }

    },

    onClickTypeMenu(event, data) {
        let index = Number(data);
        if (this._curGoldType == index) {
            return;
        }

        switch (index) {
            case 1:
                //金币牌桌
                this.setBtnStatus(this.btn_gold, true);
                this.setBtnStatus(this.btn_club, false);
                this._curGoldType = 1;
                break;
            case 2:
                //俱乐部牌桌
                this.setBtnStatus(this.btn_gold, false);
                this.setBtnStatus(this.btn_club, true);
                this._curGoldType = 2;
                break;
        }
    },

    onClickGame(event, data) {
        let index = Number(data);
        switch (index) {
            case 1:
                //德州牌桌
                this.setBtnStatus(this.btn_texas, true);
                this.setBtnStatus(this.btn_omaha, false);
                this.setBtnStatus(this.btn_shortCard, false);
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.Texas;
                this.scrollview1.node.active = true;
                this.scrollview2.node.active = false;
                this.scrollview3.node.active = false;
                if (!this._recordList[this._curGameId] || this._recordList[this._curGameId].length == 0) {
                    this.getGameRecord(0, this._curGameId);
                } else {
                    this.initInfo(this._recordInfo[this._curGameId] || {})
                }

                break;
            case 2:
                //奥马哈牌桌
                this.setBtnStatus(this.btn_texas, false);
                this.setBtnStatus(this.btn_omaha, true);
                this.setBtnStatus(this.btn_shortCard, false);
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.Omaha;
                this.scrollview1.node.active = false;
                this.scrollview2.node.active = true;
                this.scrollview3.node.active = false;
                if (!this._recordList[this._curGameId] || this._recordList[this._curGameId].length == 0) {
                    this.getGameRecord(0, this._curGameId);
                } else {
                    this.initInfo(this._recordInfo[this._curGameId] || {})
                }

                break;
            case 3:
                //短牌牌桌
                this.setBtnStatus(this.btn_texas, false);
                this.setBtnStatus(this.btn_omaha, false);
                this.setBtnStatus(this.btn_shortCard, true);
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.ShortTexas;
                this.scrollview1.node.active = false;
                this.scrollview2.node.active = false;
                this.scrollview3.node.active = true;
                if (!this._recordList[this._curGameId] || this._recordList[this._curGameId].length == 0) {
                    this.getGameRecord(0, this._curGameId);
                } else {
                    this.initInfo(this._recordInfo[this._curGameId] || {})
                }

                break;
        }

        this._curIndex = index;
    },

    setBtnStatus(btn, isSelect) {
        let nor = btn.getChildByName("nor");
        let sel = btn.getChildByName("sel");

        nor.active = !isSelect;
        sel.active = isSelect;
    },
});
