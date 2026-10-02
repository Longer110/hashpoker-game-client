// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部历史流水
let i18n = require("i18n");
let TAG = "club_historyFlow";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");

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

        _recordList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        app.util.addClickSoundToNode(this.node);
    },

    start() {
        this.initList();
        this._clubId = HallClubCacheData.getCurLoginClub();
        this.regiester();
        this.getRecordList(0);
    },

    // update (dt) {},

    onDestroy() {
        this.unRegiester();
    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSGoldChangeRecordResp_ui, this._onGoldChangeRecord, this);
    },

    unRegiester() {
        this.scview.destroy();
        MsgManager.un(this._onGoldChangeRecord);
    },

    init(Data) {
    },

    onClickClose() {
        this.node.destroy();
    },

    getRecordList(nIdOfStart) {
        let nClubId = this._clubId;
        let params = {
            nClubId: nClubId,
            nIdOfStart: nIdOfStart,
            nCnt: 50,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGoldChangeRecordReq_CMD, params);
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
        // let item = node.getComponent("HallGameItem");
        // item.initItem(data);
        this.initItem(node, data);

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr) {
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getRecordList(this._recordList[this._recordList.length - 1].nId);
    },

    initItem(node, data) {
        let label_time1 = node.getChildByName("label_time1").getComponent(cc.Label);
        let label_time2 = node.getChildByName("label_time2").getComponent(cc.Label);
        let label_name = node.getChildByName("label_name").getComponent(cc.Label);
        let label_value = node.getChildByName("label_value").getComponent(cc.Label);
        let array = data.sTime.split(" ");
        label_time1.string = array[0];
        label_time2.string = array[1];
        if (!data.sName) {
            label_name.lang = "CLUB_HALL.SYSTEM";
        } else {
            label_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        }


        if (data.nChange == 0) {
            label_value.string = Utils.convertNumberToStr(data.nChange);
            let color = new cc.Color(230, 229, 242, 255);
            label_value.node.color = color;
        } else if (data.nChange > 0) {
            label_value.string = "+" + Utils.convertNumberToStr(data.nChange);
            let color = new cc.Color(255, 30, 67, 255);
            label_value.node.color = color;
        } else {
            label_value.string = Utils.convertNumberToStr(data.nChange);
            let color = new cc.Color(0, 255, 134, 255);
            label_value.node.color = color;
        }
    },

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
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
        this._recordList = listData;
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

    _onGoldChangeRecord(data) {
        if (!data.arrRecords || data.arrRecords.length == 0) {
            this._isEnd = true;
        }

        data.arrRecords.sort(function (a, b) {
            return b.nId - a.nId;
        })

        if (this._recordList.length == 0) {
            this.updateScrollView(data.arrRecords);
        } else {
            this.appendData(data.arrRecords);
        }

        this.noRecord.active = this._recordList.length == 0;
    },
});
