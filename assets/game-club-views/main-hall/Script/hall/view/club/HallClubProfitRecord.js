// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部收益
let i18n = require("i18n");
let TAG = "club_profit";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");

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

        label_service: cc.Label,//服务费
        label_prop: cc.Label,//道具
        label_insure: cc.Label,//保险
        label_profit: cc.Label,//累计贡献值

        _recordList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.initList();
        this.initInfo({});
        this.regiester();
        this.getClubProfit(0);
    },

    // update (dt) {},

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSContribRecordResp_ui, this._onProfitRecord, this);
    },

    onDestroy() {
        MsgManager.un(this._onProfitRecord);
    },

    initInfo(data) {
        let width = this.label_profit.node.parent.width;
        this.label_profit.string = Utils.convertNumberToStr(data.nTotalContrib);
        this.label_profit.node.x = width + 50;
        this.setLabelColor(this.label_service, data.nServiceCharge || 0);
        this.setLabelColor(this.label_prop, data.nPropsIncome || 0);
        this.setLabelColor(this.label_insure, data.nInsurance || 0);
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
        // let item = node.getComponent("HallGameItem");
        // item.initItem(data);
        this.initItem(node, data);

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr) {
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getClubProfit(this._recordList[this._recordList.length - 1].nId);
    },

    initItem(node, data) {
        let label_name = node.getChildByName("label_name").getComponent(cc.Label);
        let label_service = node.getChildByName("label_service").getComponent(cc.Label);
        let label_prop = node.getChildByName("label_prop").getComponent(cc.Label);
        let label_insure = node.getChildByName("label_insure").getComponent(cc.Label);
        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        label_name.lang = "HALL_CLUB_GAME_NAME." + data.nGameId;
        label_service.string = data.nContrib;
        label_prop.string = data.nProp || 0;
        label_insure.string = data.nInsure || 0;
        label_time.string = data.sTime;

        this.setLabelColor(label_service, 0);
        this.setLabelColor(label_prop, 0);
        this.setLabelColor(label_insure, 0);

        if (data.nType == 1) {
            this.setLabelColor(label_service, data.nContrib || 0);
        } else if (data.nType == 2) {
            this.setLabelColor(label_prop, data.nContrib || 0);
        } else {
            this.setLabelColor(label_insure, data.nContrib || 0);
        }
    },


    setLabelColor(label, value) {
        if (value == 0) {
            label.string = value;
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

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
        this.list = Utils.clone(listData);
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
        this.scview.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },

    getClubProfit(nIdOfStart) {
        let clubId = HallClubCacheData.getCurLoginClub();
        let data = {
            nClubId: clubId,
            nUserId: 0,
            nIdOfStart: nIdOfStart,
            nCnt: 20,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSContribRecordReq_CMD, data);

    },

    _onProfitRecord(data) {
        if (data.arrRecords.length == 0) {
            this._isEnd = true;
        }

        data.arrRecords.sort(function (a, b) {
            return b.nId - a.nId;
        })

        if (this._recordList.length == 0) {
            this.updateScrollView(data.arrRecords);
            this.initInfo(data);
        } else {
            this.appendData(data.arrRecords);
        }
    }

});
