// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部币变化记录
let i18n = require("i18n");
let TAG = "club_moneyRecord";
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

        noRecord: cc.Node,
        itemBg: cc.Node,

        _recordList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        app.util.addClickSoundToNode(this.node);
    },

    start() {
        this.clubData = HallClubCacheData.getCurClubData();
        this.initList();
        this.regiester();
        this.getRecordList(0);
    },

    // update (dt) {},

    onDestroy() {
        this.unRegiester();
    },


    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSTransferRecordResp_ui, this._onTransferRecord, this);
    },

    unRegiester() {
        this.scview.destroy();
        MsgManager.un(this._onTransferRecord);
    },

    onClickClose() {
        this.node.destroy();
    },

    getRecordList(nIdOfStart) {
        let params = {
            nClubId: this.clubData.nClubId,
            nIdOfStart: nIdOfStart,
            nCnt: 50,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSTransferRecordReq_CMD, params);
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
        this.getRecordList(this._recordList[this._recordList.length - 1].nId);
    },

    initItem(node, data, index) {
        let line = node.getChildByName("line");
        let label_time1 = node.getChildByName("label_time1").getComponent(cc.Label);
        let label_time2 = node.getChildByName("label_time2").getComponent(cc.Label);
        let label_total = node.getChildByName("label_total").getComponent(cc.Label);
        let label_change = node.getChildByName("label_change").getComponent(cc.Label);
        let label_tip = node.getChildByName("label_tip").getComponent(cc.Label);
        let array = data.sTime.split(" ");
        label_time1.string = array[0];
        label_time2.string = array[1];
        label_total.string = Utils.convertNumberToStr(data.nClubGold);

        if ((index + 1) == this._recordList.length) {
            line.active = false;
        } else {
            line.active = true;
        }

        if (data.nChange == 0) {
            label_change.string = Utils.convertNumberToStr(data.nChange);
            let color = new cc.Color(230, 229, 242, 255);
            label_change.node.color = color;
        } else if (data.nChange > 0) {
            label_change.string = "+" + Utils.convertNumberToStr(data.nChange);
            let color = new cc.Color(255, 30, 67, 255);
            label_change.node.color = color;
        } else if (data.nChange < 0) {
            label_change.string = Utils.convertNumberToStr(data.nChange);
            let color = new cc.Color(0, 255, 134, 255);
            label_change.node.color = color;
        }

        if (data.nSourceType == 12301) {
            //被踢退还
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.1";
        } else if (data.nSourceType == 12302) {
            //主动退出退还
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.2";
        } else if (data.nSourceType == 12303) {
            //管理员增加
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.3";
        } else if (data.nSourceType == 12304) {
            //管理员回收
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.4";
        } else if (data.nSourceType == 12305) {
            //玩家申请增加
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.5";
        } else if (data.nSourceType == 12306) {
            //玩家申请回收
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.6";
        } else if (data.nSourceType == 125) {
            //德州扑克游戏输赢
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.7";
        } else if (data.nSourceType == 126) {
            //奥马哈游戏输赢
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.9";
        } else if (data.nSourceType == 175) {
            //短牌德州游戏输赢
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.10";
        } else {
            //其他游戏
            label_tip.lang = "CLUB_MOMEY_CHANGE_REASON.8";
        }

    },

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
        //设置列表item数据
        this._recordList = listData;
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

    _onTransferRecord(data) {
        if (!data.arrRecords || data.arrRecords.length == 0) {
            this._isEnd = true;
            if (this._recordList.length == 0) {
                this.noRecord.active = true;
            } else {
                this.noRecord.active = false;
            }
            return;
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
