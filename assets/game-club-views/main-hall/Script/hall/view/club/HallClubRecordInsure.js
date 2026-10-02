// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//战绩保险明细
let i18n = require("i18n");
let TAG = "club_apply";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let HallClubCacheData = require("HallClubCacheData");
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

        _insureList: [],
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
    },

    unRegiester() {
        MsgManager.un(this._getTalbeInsureList);
    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSGetTableInsuranceRsp_ui, this._getTalbeInsureList, this);
    },

    // update (dt) {},

    init(data, isHall) {
        this._data = data;
        this._isHall = isHall;
        this.unRegiester();
        this.regiester();
        this.initList();
        this.getInsureList(0);
    },

    getInsureList(nPage) {
        let params = {
            nPage: nPage,
            nCnt: 20,
        }

        params.sTableId = this._data.sTableId;
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetTableInsuranceReq_CMD, params);


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
        this.initItem(node, data, index);

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr) {
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getInsureList(this._curPage + 1);
    },

    //data.nType: 1：增加俱乐部币 2：退还俱乐部币 3：申请加入俱乐部
    initItem(node, data, index) {
        let head = node.getChildByName("headBg").getChildByName("head").getComponent(cc.Sprite);
        let label_name = node.getChildByName("label_name").getComponent(cc.Label);
        let label_profit = node.getChildByName("label_profit").getComponent(cc.Label);
        Utils.changeUserHead(head, data.sFaceId, app.ClubAssets);
        label_name.string = Base64.decode(data.sName);

        this.setLabelColor(label_profit, data.nInsurance);
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

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
        this._insureList = Utils.clone(listData);
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
    },

    //向列表末端插入新的数据
    appendData(data) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        for (let i = 0; i < data.length; i++) {
            this._insureList.push(data[i]);
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
        this.scview.append_data(allData);
    },

    _getTalbeInsureList(data) {
        if (data.arrUserDetail.length == 0) {
            this._isEnd = true;
            return;
        }

        data.arrUserDetail.sort(function (a, b) {
            return b.nId - a.nId;
        })

        if (this._insureList.length == 0) {
            this.updateScrollView(data.arrUserDetail);
        } else {
            this.appendData(data.arrUserDetail);
        }

        this._curPage = data.nPage;
    },
});
