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
let UIListView = require("UIListView");

cc.Class({
    extends: cc.Component,

    properties: {
        item: {
            default: null,
            type: cc.Node
        },

        listView: {
            default: null,
            type: UIListView,
        },

        scrollview: cc.ScrollView,
        title: cc.Label,
        playerHead: cc.Sprite,
        label_totalHand: cc.Label,
        label_bring: cc.Label,
        //label_totalTrunover: cc.Label,
        label_totalBet: cc.Label,
        label_maxBet: cc.Label,
        label_game: cc.Label,
        label_time: cc.Label,
        label_blind: cc.Label,
        label_gameTime: cc.Label,
        panel_tuHao: cc.Node,
        panel_mvp: cc.Node,
        panel_dayu: cc.Node,
        label_insure: cc.Label,
        headBg: cc.Node,
        itemBg: cc.Node,
        panel_insure: cc.Node,
        totalBring: cc.Node,
        maxBet: cc.Node,
        totalTrunover: cc.Node,

        paipuPrefab: cc.Prefab,
        insurePrefab: cc.Prefab,
        _playerList: [],
        _curPage: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        app.util.addClickSoundToNode(this.node);
    },

    start() {

    },

    // update (dt) {},

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSGetTableDetailRsp_ui, this._getTabelDetail, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetTableUserListRsp_ui, this._getTableUserList, this);
    },

    unRegister() {
        MsgManager.un(this._getTabelDetail);
        MsgManager.un(this._getTableUserList);
    },

    onDestroy() {
        this.unRegister();
    },

    init(data, isHall) {
        this._tableData = data;
        this._isHall = isHall;
        this.unRegister();
        this.regiester();
        this.initList();
        this.getRecordInfo(data);
        this.getPlayerList(0);
    },

    onClickClose() {
        this.node.destroy();
    },

    getRecordInfo(data) {
        let params = {
            nGameId: data.nGameId,
        }

        params.sTableId = data.sTableId;
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetTableDetailReq_CMD, params);

    },

    getPlayerList(nPage) {
        let params = {
            nGameId: this._tableData.nGameId,
            nPage: nPage,
            nCnt: 20
        }

        params.sTableId = this._tableData.sTableId
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetTableUserListReq_CMD, params);
    },

    updateInfo(data) {
        if (data.tLiver.sFaceId == "") {
            data.tLiver.sFaceId = "1001";
        }
        Utils.changeUserHead(this.playerHead, data.tLiver.sFaceId || 0, app.ClubAssets);
        this.label_totalHand.string = data.nHandCnt || 0;
        this.label_bring.string = Utils.convertNumberToStr(data.nTakeIn || 0);
        //this.label_totalTrunover.string = data.nJournalAccount || 0;
        this.label_totalBet.string = Utils.convertNumberToStr(data.nSumBet || 0);
        this.label_maxBet.string = data.nMaxPool || 0;
        this.label_game.lang = "HALL_CLUB_GAME_NAME." + data.nGameId;
        let time = data.sTime;
        let tmpTime = time.split(" ")
        let tmpTime2 = tmpTime[0].split("-");
        let sTime = tmpTime2[1] + "-" + tmpTime2[2] + " " + tmpTime[1];
        this.label_time.string = sTime || "";
        if (data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
            this.label_blind.string = Utils.convertNumberToStr(data.nBaseScore);
        } else {
            let mangzhuStr = Utils.showClubTableInfo('', data.nSmallBlind, data.nBigBlind, data.nZhuaTou, data.nPreAnte, data.preAnteOdd, this._tableData.nGameId)

            this.label_blind.string = mangzhuStr;
        }

        let keepTime = 0;
        if (data.nKeepTime == -1) {
            keepTime = 120;
        } else {
            keepTime = data.nKeepTime / 60;
        }
        if (keepTime >= 60) {
            this.label_gameTime.string = Utils.replaceAll(i18n.t("CLUB_HALL.DAYS"), "XXX", keepTime / 60);
        } else {
            this.label_gameTime.string = Utils.replaceAll(i18n.t("CLUB_HALL.MIN"), "XXX", keepTime);
        }
        this.label_insure.string = Utils.replaceAll(i18n.t("CLUB_HALL_RECORD.INSURE_BET"), "XXX", Utils.convertNumberToStr(data.nInsurancePool));
        this.title.string = Base64.decode(data.sTableName);

        // this.initPlayer(this.panel_tuHao, data.tTHUser);
        // this.initPlayer(this.panel_mvp, data.tMVPUser, true);
        // this.initPlayer(this.panel_dayu, data.tDYUser);

        // if (this._tableData.nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang){
        //     this.label_bring.node.active = false;
        //     this.label_maxBet.node.active = false;
        //     this.totalBring.active = false;
        //     this.maxBet.active = false;
        //     let bWidget = this.totalBring.getComponent(cc.Widget);
        //     let tWidget = this.totalTrunover.getComponent(cc.Widget);
        //     let tLWidget = this.label_totalTrunover.node.getComponent(cc.Widget);
        //     tWidget.left = bWidget.left;
        //     tWidget.right = bWidget.right;
        //     tLWidget.left = bWidget.left;
        //     tLWidget.right = bWidget.right;

        //     tWidget.updateAlignment();
        //     tLWidget.updateAlignment();
        // }
    },

    initPlayer(node, data, isMvp) {
        if (data.sFaceId == "") {
            data.sFaceId = "1";
        }
        let head = node.getChildByName("head").getComponent(cc.Sprite);
        let label_name = node.getChildByName("name").getComponent(cc.Label);
        if (isMvp) {
            let callBack = function () {
                let headBg = node.getChildByName("headBg");
                let headAndimation = head.node.getComponent(cc.Animation);
                let animation = headBg.getComponent(cc.Animation);
                headBg.active = true;
                headAndimation.play();
                animation.play();
            }
            Utils.changeUserHead(head, data.sFaceId || 0, app.ClubAssets, callBack);
        } else {
            Utils.changeUserHead(head, data.sFaceId || 0, app.ClubAssets);
        }

        label_name.string = Base64.decode(data.sName);

    },

    //初始化滚动列表
    initList() {
        if (this.isInitList) {
            return;
        }

        this.listView.init(this);
        this.isInitList = true;
    },


    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        this.initItem(node, data, index);

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr) {
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getPlayerList(this._curPage + 1);
    },

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
        this._playerList = Utils.clone(listData);
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

        // let scHeight = this.scrollview.node.height;
        // let tmpHeight = listData.length * this.item.height;
        // let height = Math.min(tmpHeight, scHeight);
        // this.itemBg.height = height + 20;

        // if (tmpHeight < scHeight){
        //     this.scrollview.vertical = false;
        // }else{
        //     this.scrollview.vertical = true;
        // }
        this.listView.resetData(dataArr);
    },

    //向列表末端插入新的数据
    appendData(data) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        for (let i = 0; i < data.length; i++) {
            this._playerList.push(data[i]);
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

        // //设置数据，key为item样式，data为数据
        // this.scview.append_data(allData);
        this.listView.onLoadMoreFinish(data);
    },

    initItem(node, data, index) {
        if (data.sFaceId == "") {
            data.sFaceId = "1";
        }

        let line = node.getChildByName("line");
        let head = node.getChildByName("head");
        let label_name = head.getChildByName("label_name").getComponent(cc.Label);
        let label_id = head.getChildByName("label_id").getComponent(cc.Label);
        let rank1 = node.getChildByName("rank1");
        let rank2 = node.getChildByName("rank2");
        let rank3 = node.getChildByName("rank3");
        let rank4 = node.getChildByName("rank4");
        let label_rank = rank4.getChildByName("label_rank").getComponent(cc.Label);
        let label_bring = node.getChildByName("label_bring").getComponent(cc.Label);
        let label_hand = node.getChildByName("label_hand").getComponent(cc.Label);
        let label_enterRate = node.getChildByName("label_enterRate").getComponent(cc.Label);
        let btn_copy = node.getChildByName("head").getChildByName("label_id").getChildByName("btn_copy");
        btn_copy.off(cc.Node.EventType.TOUCH_END);
        btn_copy.on(cc.Node.EventType.TOUCH_END, () => {
            if (data.nUserId && data.nUserId > 0) {
                Utils.copyToClipBoard(data.nUserId.toString());
            }
        });
        let profit = node.getChildByName("profit").getComponent(cc.Label);
        rank1.active = false;
        rank2.active = false;
        rank3.active = false;
        rank4.active = false;

        if (this._tableData.nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang) {
            label_bring.node.active = false;
            label_enterRate.node.active = false;
        }

        if ((index + 1) == this._playerList.length) {
            line.active = false;
        } else {
            line.active = true;
        }
        let headSp = head.getChildByName('headMask').getChildByName('icon').getComponent(cc.Sprite)
        Utils.changeUserHead(headSp, data.sFaceId, app.ClubAssets);
        label_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        label_id.string = `ID:${data.nUserId}`;
        // if (data.nRank == 1){
        //     rank1.active = true;
        // }else if (data.nRank == 2){
        //     rank2.active = true;
        // }else if (data.nRank == 2){
        //     rank3.active = true;
        // }else{
        //     rank4.active = true;
        //     label_rank.string = data.nRank;
        // }

        label_bring.string = Utils.convertNumberToStr(data.nTakeIn)
        label_hand.string = data.nPlayCnt;
        // if (data.nInpoolRate > 0){
        //     label_enterRate.string = Utils.replaceAll(i18n.t("CLUB_HALL_RECORD.ENTER_RATE_TIP"), "XXX", Math.floor(data.nInpoolRate * 100) + "%");
        // }else{
        //     label_enterRate.string = Utils.replaceAll(i18n.t("CLUB_HALL_RECORD.ENTER_RATE_TIP"), "XXX", data.nInpoolRate);
        // }

        this.setLabelColor(profit, data.nWinLose)
    },

    setLabelColor(label, value) {
        if (value == 0) {
            label.string = Utils.convertNumberToStr(value);
            let color = new cc.Color(230, 229, 242, 255);
            label.node.color = color;
        } else if (value < 0) {
            label.string = Utils.convertNumberToStr(value);
            let color = new cc.Color(255, 30, 67, 255);
            label.node.color = color;
        } else {
            label.string = "+" + Utils.convertNumberToStr(value);
            let color = new cc.Color(0, 255, 134, 255);
            label.node.color = color;
        }
    },

    onClickItem(data) {
        // let node = cc.instantiate(this.prefab);
        // this.node.addChild(node);
        // let com = node.getComponent("HallClubGamePlayer");
        // if (com){
        //     com.init(data.sTableId);
        // }
    },

    onClickPaiPu() {
        let node = cc.instantiate(this.paipuPrefab);
        this.node.addChild(node);
        let com = node.getComponent("HallClubRecordPaipu");
        if (com) {
            com.init(this._tableData, this._isHall);
        }
    },

    onClickInsure() {
        let node = cc.instantiate(this.insurePrefab);
        this.node.addChild(node);
        let com = node.getComponent("HallClubRecordInsure");
        if (com) {
            com.init(this._tableData, this._isHall);
        }
    },

    _getTabelDetail(data) {
        this.updateInfo(data.tTexas);
    },

    _getTableUserList(data) {
        if (data.arrUserDetail.length == 0) {
            this._isEnd = true;
            return;
        }

        data.arrUserDetail.sort(function (a, b) {
            return a.nRank - b.nRank;
        })

        if (this._playerList.length == 0) {
            this.updateScrollView(data.arrUserDetail);
        } else {
            this.appendData(data.arrUserDetail);
        }

        this._curPage = data.nPage;
    },

    onAttachCell(cell) {
        let data = cell.getData();
        this.initItem(cell.node, data, cell.getIndex());
    },

    onLoadMoreStart() {
        if (!this._isEnd) {
            this.getPlayerList(this._curPage + 1);
        } else {
            this.listView.onLoadMoreFinish();
        }
    },

});
