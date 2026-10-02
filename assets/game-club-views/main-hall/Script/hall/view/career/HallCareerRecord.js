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
let HallClubLogic = require("HallClubLogic");
let UIListView = require("UIListView");

cc.Class({
    extends: cc.Component,

    properties: {
        listView: {
            default: null,
            type: UIListView,
        },

        item: {
            default: null,
            type: cc.Node
        },
        mask: cc.Node,
        itemContent: cc.Node,

        scrollview: cc.ScrollView,
        prefab: cc.Prefab,
        noRecord: cc.Node,
        btn_gold: cc.Node,
        btn_club: cc.Node,
        btn_texas: cc.Node,
        btn_omaha: cc.Node,
        btn_shortCard: cc.Node,
        btn_niuniu: cc.Node,
        label_gameCount: cc.Label,
        label_profitAndLoss: cc.Label,
        label_totalHand: cc.Label,
        label_partakeRate: cc.Label,
        label_addBetRate: cc.Label,
        label_allinRate: cc.Label,
        btn_date1: cc.Node,
        btn_date2: cc.Node,
        btn_date3: cc.Node,

        recordInfoPrefab: cc.Prefab,

        _recordList: [],
        _recordInfo: null,
        _curGameId: 0,
        _curGoldType: 0,
        _curDay: 1, //1：当天 7： 七天 30： 30天
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.listView.init(this);
        this.initUI();
        this.initInfo({});
        this.regiester();
        this._recordList = [];
        this._recordInfo = {};
        this.onClickGame(null, 1);
    },

    // update (dt) {},

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSGetPersonTableRecordRsp_ui, this._tableRecord, this);
    },

    onDestroy() {
        MsgManager.un(this._tableRecord);
    },

    initUI() {
        this.setBtnTitle(this.btn_date1, "CLUB_HALL_RECORD.TODAY");
        this.setBtnTitle(this.btn_date2, "CLUB_HALL_RECORD.SEVEN_DAY");
        this.setBtnTitle(this.btn_date3, "CLUB_HALL_RECORD.THIRTY_DAY");

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

    onClickClose() {
        this.node.destroy();
    },

    getGameRecord(nIdOfStart, nGameId, nDay) {
        if (nIdOfStart == 0) {
            this._recordList = [];
            this._isEnd = false;
        }

        let clubId = HallClubCacheData.getCurLoginClub();
        let data = {
            nIdOfStart: nIdOfStart,
            nCnt: 10,
            nGameId: nGameId,
            nGoldType: 1,
            nClubId: clubId,
            nDay: nDay || 1,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetPersonTableRecord2Req_CMD, data);

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

    updateScrollView(listData, index) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
        this._recordList = listData;

        let dataArr = listData;
        this.listView.resetData(dataArr);
    },

    //向列表末端插入新的数据
    appendData(data, index) {
        QYLogs.log(TAG, "----------------appendData---------------", data);

        for (let i = 0; i < data.length; i++) {
            this._recordList.push(data[i]);
        }

        this.listView.onLoadMoreFinish(data);
    },

    initItem(item, data, index) {
        let node = item.getChildByName("content");
        let label_day = node.getChildByName("time").getChildByName("labelDay").getComponent(cc.Label);
        let label_month = node.getChildByName("time").getChildByName("labelMonth").getComponent(cc.Label);
        let label_roomName = node.getChildByName("label_roomName").getComponent(cc.Label);
        let label_homeName = node.getChildByName("label_homeName").getComponent(cc.Label);
        let label_gameTime = node.getChildByName("label_gameTime").getComponent(cc.Label);
        let label_score = node.getChildByName("label_score").getComponent(cc.Label);
        let label_profit = node.getChildByName("label_profit").getComponent(cc.Label);
        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        let head = node.getChildByName("head").getComponent(cc.Sprite);
        let insure = node.getChildByName("insure");
        let AOF = node.getChildByName("AOF");
        let bg = node.getChildByName("bg");
        let bgTop = node.getChildByName("bgTop");
        let bgCenter = node.getChildByName("bgCenter");
        let bgBottom = node.getChildByName("bgBottom");
        let re_line = node.getChildByName("re_line");
        let spr_time = node.getChildByName("spr_time");

        insure.active = false;
        AOF.active = false;
        re_line.active = true;

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

        label_roomName.string = Base64.decode(data.sTableName || "");
        if (data.nLiveUserID == 0) {
            label_homeName.lang = "CLUB_HALL.SYSTEM";
        } else {
            label_homeName.lang = "CLUB_HALL.SYSTEM";
        }

        let keepTime = data.nKeepTime / 60;
        if (keepTime >= 60) {
            label_gameTime.string = Utils.replaceAll(i18n.t("CLUB_HALL.DAYS"), "XXX", keepTime / 60);
        } else {
            label_gameTime.string = Utils.replaceAll(i18n.t("CLUB_HALL.MIN"), "XXX", keepTime);
        }

        spr_time.getComponent(cc.Widget).updateAlignment();
        label_gameTime._forceUpdateRenderData(true);
        label_gameTime.node.x = spr_time.x + 20;

        if (this._curGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
            label_score.string = Utils.convertNumberToStr(data.nBaseScore);
        } else {
            label_score.string = Utils.convertNumberToStr(data.nSmallBlind) + "/" + Utils.convertNumberToStr(data.nBigBlind);
        }


        this.setLabelColor(label_profit, data.nWinLose);
        label_time.string = data.time;

        if (data.sFaceId == "") {
            data.sFaceId = "1001";
        }

        Utils.changeUserHead(head, data.sFaceId, app.ClubAssets);

        bg.active = data.bg == "default";
        bgTop.active = data.bg == "top";
        bgCenter.active = data.bg == "center";
        bgBottom.active = data.bg == "bottom";

        if (data.bg == "default" || data.bg == "bottom") {
            re_line.active = false;
        }

        let button = item.getComponent(cc.Button);
        button.node.off(cc.Node.EventType.TOUCH_END);
        button.node.on(cc.Node.EventType.TOUCH_END, function (button) {
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
            data.nGameId = this._curGameId;
            com.init(data, true);
        }
    },

    _tableRecord(data) {
        if (data.nIdOfStart == 0 && data.tStatics) {
            this._recordInfo[data.nGameId] = data.tStatics;
            this.initInfo(data.tStatics);
        }

        if (data.nGameId != this._curGameId) {
            return;
        }

        this._lastId = null;
        this.noRecord.active = false;

        if (data.arrRecords.length == 0) {
            this._isEnd = true;
            if (this._recordList.length == 0) {
                this.updateScrollView([]);
                this.noRecord.active = true;
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
        let oldLastTime = "";
        if (this._recordList.length > 0) {
            lastTime = this._recordList[this._recordList.length - 1].timeArray;
            oldLastTime = lastTime;
        }

        for (let i = 0; i < data.arrRecords.length; i++) {
            let tmp = data.arrRecords[i];
            let timeArray = tmp.sTime.split(" ");
            let dateArray = timeArray[0].split("-");
            let array = timeArray[1].split(":");

            if (i == 0 && dateArray[0] == year && dateArray[1] == month && dateArray[2] == day) {
                if (this._recordList.length == 0) {
                    tmp.isToday = true;
                }
            }
            if (lastTime == timeArray[0]) {
                tmp.isShowTime = false;
            } else {
                tmp.isShowTime = true;
                if (i > 0) {
                    record.push({ isEmpty: true });
                } else {
                    if (lastTime != "") {
                        record.push({ isEmpty: true });
                    }
                }
            }
            tmp.time = array[0] + ":" + array[1];
            tmp.month = dateArray[1];
            tmp.day = dateArray[2];
            if (tmp.sExData && tmp.sExData != "") {
                let jsData = JSON.parse(tmp.sExData);
                tmp.isInsure = jsData.isInsure;
                tmp.isAOF = jsData.isAOF;
                tmp.nSmallBlind = jsData.nSB;
                tmp.nBigBlind = jsData.nBB;
                tmp.nBaseScore = jsData.nBaseScore || 0;
            } else {
                tmp.nSmallBlind = 0;
                tmp.nBigBlind = 0;
                tmp.nBaseScore = 0;
            }

            tmp.sTableName = tmp.sTableName;
            tmp.nGameId = data.nGameId;
            tmp.timeArray = timeArray[0];
            lastTime = timeArray[0];
            tmp.bg = "default";
            record.push(tmp);
        }

        let tmpLastTime = "";
        for (let i = 0; i < record.length; i++) {
            if (oldLastTime && oldLastTime == record[i].timeArray) {
                if (this._recordList[this._recordList.length - 1].bg == "default") {
                    this._recordList[this._recordList.length - 1].bg = "top";
                } else if (this._recordList[this._recordList.length - 1].bg = "bottom") {
                    this._recordList[this._recordList.length - 1].bg = "center";
                }
            }

            if (record[i + 1]) {
                if (record[i].timeArray == record[i + 1].timeArray) {
                    if (record[i].isShowTime) {
                        record[i].bg = "top";
                    } else {
                        record[i].bg = "center";
                    }
                } else {
                    record[i].bg = "bottom";
                }
            } else {
                if (oldLastTime && oldLastTime == record[i].timeArray) {
                    record[i].bg = "bottom";
                } else if (tmpLastTime == record[i].timeArray) {
                    record[i].bg = "bottom";
                }
            }

            tmpLastTime = record[i].timeArray;
        }

        if (this._recordList.length == 0) {
            this.updateScrollView(record);
        } else {
            this.appendData(record);
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
                this.setBtnStatus(this.btn_niuniu, false);
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.Texas;

                break;
            case 2:
                //奥马哈牌桌
                this.setBtnStatus(this.btn_texas, false);
                this.setBtnStatus(this.btn_omaha, true);
                this.setBtnStatus(this.btn_shortCard, false);
                this.setBtnStatus(this.btn_niuniu, false);
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.Omaha;

                break;
            case 3:
                //短牌牌桌
                this.setBtnStatus(this.btn_texas, false);
                this.setBtnStatus(this.btn_omaha, false);
                this.setBtnStatus(this.btn_shortCard, true);
                this.setBtnStatus(this.btn_niuniu, false);
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.ShortTexas;

                break;
            case 4:
                //抢庄牛牛
                this.setBtnStatus(this.btn_texas, false);
                this.setBtnStatus(this.btn_omaha, false);
                this.setBtnStatus(this.btn_shortCard, false);
                this.setBtnStatus(this.btn_niuniu, true);
                this._curGameId = clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang;
                break;
        }

        this._lastId = null;
        this.getGameRecord(0, this._curGameId, this._curDay);
        this._curIndex = index;
    },

    onClickDate(event, data) {
        let index = Number(data);
        switch (index) {
            case 1:
                this.setBtnStatus(this.btn_date1, true);
                this.setBtnStatus(this.btn_date2, false);
                this.setBtnStatus(this.btn_date3, false);
                this._curDay = 0;
                break;
            case 2:
                this.setBtnStatus(this.btn_date1, false);
                this.setBtnStatus(this.btn_date2, true);
                this.setBtnStatus(this.btn_date3, false);
                this._curDay = 7;
                break;
            case 3:
                this.setBtnStatus(this.btn_date1, false);
                this.setBtnStatus(this.btn_date2, false);
                this.setBtnStatus(this.btn_date3, true);
                this._curDay = 30;
                break;
        }

        this._lastId = null;
        this.getGameRecord(0, this._curGameId, this._curDay);
    },

    setBtnStatus(btn, isSelect) {
        let nor = btn.getChildByName("nor");
        let sel = btn.getChildByName("sel");

        nor.active = !isSelect;
        sel.active = isSelect;
    },

    setBtnTitle(btn, text) {
        let nor = btn.getChildByName("nor");
        let sel = btn.getChildByName("sel");
        let norLabel = nor.getChildByName("label").getComponent(cc.Label);
        let selLabel = sel.getChildByName("label").getComponent(cc.Label);
        norLabel.lang = text;
        selLabel.lang = text;
    },

    onAttachCell(cell) {
        cell.node.active = true;
        let data = cell.getData();
        let con = cell.node.getChildByName("content");
        if (data.isEmpty) {
            cell.node.height = 10;
            con.active = false;
        } else {
            cell.node.height = 146;
            con.active = true;
            this.initItem(cell.node, data);
        }
    },

    onLoadMoreStart() {
        if (!this._isEnd) {
            let data = this._recordList;
            let nId = data[data.length - 1].nId;
            if (this._lastId && this._lastId == nId) {
                return;
            }
            this._lastId = nId;
            this.getGameRecord(nId, this._curGameId, this._curDay);
        } else {
            this.listView.onLoadMoreFinish();
        }
    },
});
