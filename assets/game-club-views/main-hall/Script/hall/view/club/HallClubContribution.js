// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部个人贡献
let i18n = require("i18n");
let TAG = "culb_contribution";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let Base64 = require("base64");
let HallClubCacheData = require("HallClubCacheData");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");

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
        label_con: cc.Label,//累计贡献值

        _contributionRecord: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        app.util.addClickSoundToNode(this.node);
    },

    start() {

    },

    // update (dt) {},

    onDestroy() {
        this.unRegiester();
        this.scview.destroy();
    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSContribRecordResp_ui, this._onContribRecord, this);
    },

    unRegiester() {
        MsgManager.un(this._onContribRecord);
    },

    getContributionRecordList(nIdOfStart) {
        let nClubId = HallClubCacheData.getCurLoginClub();
        let params = {
            nClubId: nClubId,
            nUserId: this._data.nUserId,
            nIdOfStart: nIdOfStart,
            nCnt: 30,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSContribRecordReq_CMD, params);
    },

    initInfo(data) {
        this.initList();
        this.unRegiester();
        this.regiester();
        this._data = data;
        this.getContributionRecordList(0)
    },

    onClickClose() {
        this.node.destroy();
    },

    updateContribution(data) {
        let width = this.label_con.node.parent.width;
        this.label_con.node.x = width + 50;
        this.label_con.string = Utils.convertNumberToStr(data.nTotalContrib || 0);

        this.setLabelColor(this.label_service, data.nServiceCharge || 0);
        this.setLabelColor(this.label_prop, data.nPropsIncome || 0);
        this.setLabelColor(this.label_insure, data.nInsurance || 0);
    },

    //初始化滚动列表
    initList() {
        QYLogs.log(TAG, "----------------initList---------------");
        if (this.scview) {
            return;
        }

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
        this.getContributionRecordList(this._contributionRecord[this._contributionRecord.length - 1].nId);
    },

    initItem(node, data) {
        let label_name = node.getChildByName("label_name").getComponent(cc.Label);
        let label_service = node.getChildByName("label_service").getComponent(cc.Label);
        let label_prop = node.getChildByName("label_prop").getComponent(cc.Label);
        let label_insure = node.getChildByName("label_insure").getComponent(cc.Label);
        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        label_name.lang = "HALL_CLUB_GAME_NAME." + data.nGameId;
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
            label.string = "+" + value;
            let color = new cc.Color(255, 30, 67, 255);
            label.node.color = color;
        } else {
            label.string = value;
            let color = new cc.Color(0, 255, 134, 255);
            label.node.color = color;
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
        this._contributionRecord = listData;
    },

    //向列表末端插入新的数据
    appendData(data) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        for (let i = 0; i < data.length; i++) {
            this._contributionRecord.push(data[i]);
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

    _onContribRecord(data) {
        if (data.arrRecords.length == 0) {
            this._isEnd = true;
        }

        data.arrRecords.sort(function (a, b) {
            return b.nId - a.nId;
        })

        if (this._contributionRecord.length == 0) {
            this.updateScrollView(data.arrRecords);
            this.updateContribution(data);
        } else {
            this.appendData(data.arrRecords);
        }
    },

});
