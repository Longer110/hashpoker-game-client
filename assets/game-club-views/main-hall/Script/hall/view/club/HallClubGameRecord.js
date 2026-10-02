// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部牌局记录
let i18n = require("i18n");
let TAG = "club_record";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let UIFrame = require("UIFrame");
let HallClubCacheData = require("HallClubCacheData");
let MAXCount = 15

cc.Class({
    extends: cc.Component,

    properties: {
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

        noRecord: cc.Node,
        itemBg: cc.Node,

        _recordList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        app.util.addClickSoundToNode(this.node);
    },

    start() {

    },

    // update (dt) {},

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSPaiJuRecordResp_ui, this._paiJuRecord, this);
    },

    unRegiester() {
        MsgManager.un(this._paiJuRecord);
    },

    onDestroy() {
        this.unRegiester();
        this.scview.destroy();

    },

    onClickClose() {
        this.node.destroy();
    },

    init(data) {
        if (!this.scview) {
            this.initList();
        }

        this._nUserId = data.nUserId;
        this.unRegiester();
        this.regiester();
        this.getGameRecord(0);
    },


    getGameRecord(nIdOfStart) {
        let curLoginClubId = HallClubCacheData.getCurLoginClub();
        let data = {
            nClubId: curLoginClubId,
            nIdOfStart: nIdOfStart,
            nCnt: MAXCount,
            nUserId: this._nUserId,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPaiJuRecordReq_CMD, data);

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
        if (!node.tmpId || node.tmpId != data.nId) {
            this.initItem(node, data, index);
        }

        node.tmpId = data.nId;

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr) {
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getGameRecord(this._recordList[this._recordList.length - 1].nId);
    },

    initItem(node, data, index) {
        let line = node.getChildByName("co_line");
        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        let label_score = node.getChildByName("game_icon_score").getChildByName("label_score").getComponent(cc.Label);
        let label_count = node.getChildByName("label_count").getComponent(cc.Label);
        let label_profit = node.getChildByName("label_profit").getComponent(cc.Label);
        let label_pot = label_score.node.getChildByName("label_pot").getComponent(cc.Label);
        let card1 = node.getChildByName("card1")
        let card2 = card1.getChildByName("card2")
        let handCard = JSON.parse(data.sHandCards);
        let tableInfo = JSON.parse(data.sTableInfo);

        if ((index + 1) == this._recordList.length) {
            line.active = false;
        } else {
            line.active = true;
        }

        label_time.string = data.sTime;
        label_score.string = (tableInfo.nTakeInMin || 0) + "/" + (tableInfo.nTakeInMax || 0);
        let text = i18n.t("CLUB_HALL.HAND");
        label_count.string = my.util.replaceAll(text, "XXX", data.nHand || 0);
        label_pot.string = i18n.t("CLUB_HALL.POT") + " " + (tableInfo.nBigBlind || 0);

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

        if (handCard.arrCard && handCard.arrCard[0]) {
            this.setCard(card1, handCard.arrCard[0]);
        }

        if (handCard.arrCard && handCard.arrCard[1]) {
            this.setCard(card2, handCard.arrCard[1]);
        }

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

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
        this._recordList = Utils.clone(listData);
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

        this.scview.set_data(allData);

        let scHeight = this.scrollview.node.height;
        let tmpHeight = listData.length * this.item.height;
        let height = Math.min(tmpHeight, scHeight);
        this.itemBg.height = height + 20;
        if (tmpHeight < scHeight) {
            this.scrollview.vertical = false;
        } else {
            this.scrollview.vertical = true;
        }
    },

    //向列表末端插入新的数据
    appendData(data) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        for (let i = 0; i < data.length; i++) {
            this._recordList.push(data[i]);
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

        let Offset = this.scview.scrollview.getScrollOffset();//记录之前所在的位置
        let x = Offset.x;
        let y = Offset.y;
        QYLogs.log(TAG, "----------------Offset---------------", x, y);

        //设置数据，key为item样式，data为数据
        this.scview.append_data(allData);

        // this.scview.scrollview.stopAutoScroll();
        this.scview.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },

    _paiJuRecord(data) {
        if (data.arrRecords.length == 0 || data.arrRecords.length < MAXCount) {
            this._isEnd = true;
        }

        data.arrRecords.sort(function (a, b) {
            return b.nId - a.nId;
        })

        if (data.arrRecords.length > 0) {
            if (this._recordList.length == 0) {
                this.updateScrollView(data.arrRecords);
            } else {
                this.appendData(data.arrRecords);
            }
        }

        if (this._recordList.length == 0) {
            this.noRecord.active = true;
        } else {
            this.noRecord.active = false;
        }
    },
});
