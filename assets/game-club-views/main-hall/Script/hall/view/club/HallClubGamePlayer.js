// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部牌局参与用户
let i18n = require("i18n");
let TAG = "club_game_player";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");
let HallClubCacheData = require("HallClubCacheData");

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

        prefab: cc.Prefab,
        _tableUserList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.initList();
        this.regiester();
    },

    // update (dt) {},

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSTableUserResp_ui, this._tableUser, this);
        MsgManager.on(MSG.NOTIFY.ClubSMemberInfoReq_ui, this._onMemberInfo, this);
    },

    onDestroy() {
        MsgManager.un(this._tableUser);
        MsgManager.un(this._onMemberInfo);
    },

    onClickClose() {
        this.node.destroy();
    },

    init(tableId) {
        this._tableId = tableId;
        this.getGameUserList(0);
    },

    getGameUserList(index) {
        let data = {
            sTableId: this._tableId,
            nIdOfStart: index || 0,
            nCnt: 20,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSTableUserReq_CMD, data);
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
        this.initItem(node, data);
        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(data);
        }.bind(this))
        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr) {
        if (this._isEnd) return;
        this.getGameUserList(this._tableUserList[this._tableUserList.length - 1].nId);
    },

    initItem(node, data) {
        let label_name = node.getChildByName("head").getChildByName("label_name").getComponent(cc.Label);
        let label_contribution = node.getChildByName("label_contribution").getComponent(cc.Label);
        let label_identity = node.getChildByName("label_identity").getComponent(cc.Label);
        let label_gameNum = node.getChildByName("label_gameNum").getComponent(cc.Label);
        let label_profit = node.getChildByName("label_profit").getComponent(cc.Label);
        let head = node.getChildByName("head").getChildByName("img_head").getComponent(cc.Sprite);
        Utils.changeUserHead(head, data.sFaceId, app.ClubAssets);
        label_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        label_contribution.string = data.nContribution;
        label_identity.lang = "CLUB_HALL_IDENTITY." + data.nIdentify;
        label_gameNum.string = data.nPlayCnt;

        if (data.nWinLose == 0) {
            label_profit.string = data.nWinLose;
            let color = new cc.Color(230, 229, 242, 255);
            label_profit.node.color = color;
        } else if (data.nWinLose > 0) {
            label_profit.string = "+" + data.nWinLose;
            let color = new cc.Color(255, 30, 67, 255);
            label_profit.node.color = color;
        } else {
            label_profit.string = data.nWinLose;
            let color = new cc.Color(0, 255, 134, 255);
            label_profit.node.color = color;
        }

    },

    onClickItem(data) {
        let nClubId = HallClubCacheData.getCurLoginClub();
        let params = {
            nClubId: nClubId,
            nUserId: data.nUserId,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSMemberInfoReq_CMD, params);
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
        this._tableUserList = listData;
    },

    //向列表末端插入新的数据
    appendData(data) {
        QYLogs.log(TAG, "----------------appendData---------------", data);
        for (let i = 0; i < data.length; i++) {
            this._tableUserList.push(data[i]);
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

        //设置数据，key为item样式，data为数据
        this.scview.append_data(allData);

        // this.scview.scrollview.stopAutoScroll();
        this.scview.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },

    _tableUser(data) {
        if (data.arrUser.length == 0) {
            this._isEnd = true;
            return;
        }

        if (this._tableUserList.length == 0) {
            this.updateScrollView(data.arrUser);
        } else {
            this.appendData(data.arrUser);
        }
    },

    _onMemberInfo(data) {
        let params = {
            sName: data.tUserInfo.sName,
            nVip: data.tUserInfo.nVip,
            nUserId: data.tUserInfo.nUserId,
            nClubGold: data.tUserInfo.nClubGold,
            sFaceId: data.tUserInfo.sFaceId,
        }

        if (this.node.getChildByName("memberInfo")) {
            let infoNode = this.node.getChildByName("memberInfo");
            let component = infoNode.getComponent("HallClubMemberInfo");
            if (component) {
                component.initMemberInfo(params);
            }
            return;
        }
        let node = cc.instantiate(this.prefab);
        this.node.addChild(node, 0, "memberInfo");
        let component = node.getComponent("HallClubMemberInfo");
        if (component) {
            component.initMemberInfo(params);
        }
    }

});
