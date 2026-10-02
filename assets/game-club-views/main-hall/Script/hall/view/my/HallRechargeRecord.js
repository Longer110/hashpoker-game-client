// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//充 值 记录
let i18n = require("i18n");
let TAG = "recharge_record";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let HallClubCacheData = require("HallClubCacheData");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");
let LocalStorage = require("LocalStorage");
let HallClubLogic = require("HallClubLogic");

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
        infoPanel: {
            default: null,
            type: cc.Node
        },

        noRecord: cc.Node,
        itemBgRes: {
            default: [],
            type: cc.SpriteFrame,
        },

        title1: cc.Node,
        title2: cc.Node,

        _recordList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.init();
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onPayInfo);
        MsgManager.un(this._onTrCallback);
    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSPayInfoRep_ui, this._onPayInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubTransferWayRsp_ui, this._onTrCallback, this);
    },

    // update (dt) {},

    init() {
        this.regiester();
        this.initUI();
        this.initList();
        this.getRecordList();
        this.getTransferway();
    },

    setTitle() {
        this.title1.active = false;
        this.title2.active = true;
    },

    //
    getRecordList() {
        let params = {
            nType: 2,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPayInfoReq_CMD, params);
    },

    getTransferway() {
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubTransferWayReq_CMD, { nUserId: UserInfo.getInfo().nUserID });
    },

    initUI() {
        this.infoPanel.active = false;
        this._config = HallClubLogic.getReConfig(LocalStorage.getSysLanguage()) || {};
    },

    onClickClose() {
        this.node.destroy();
    },

    //初始化滚动列表
    initList() {
        QYLogs.log(TAG, "----------------initList---------------");

        let widget = this.scrollview.node.getComponent(cc.Widget);
        let mWidget = this.mask.getComponent(cc.Widget);
        widget.updateAlignment();
        mWidget.updateAlignment();

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
    },

    //
    initItem(node, data, index) {
        let HallRechargeRecordItem = node.getComponent("HallRechargeRecordItem");

        HallRechargeRecordItem._setData(data);

        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        let label_oprate = node.getChildByName("label_oprate").getComponent(cc.Label);
        let label_type = node.getChildByName("label_type").getComponent(cc.Label);
        let label_moneyType = node.getChildByName("label_moneyType").getComponent(cc.Label);
        let label_count = node.getChildByName("label_count").getComponent(cc.Label);
        let label_change = node.getChildByName("label_change").getComponent(cc.Label);
        let label_canUse = node.getChildByName("label_canUse").getComponent(cc.Label);
        let label_state = node.getChildByName("label_state").getComponent(cc.Label);
        let btn = node.getChildByName("btn");
        let line = node.getChildByName("line")

        let sTime = data.sCreateTime.split(" ");
        sTime[0] = Utils.replaceAll(sTime[0], "-", "/")
        label_time.string = sTime[0] + "\n" + sTime[1];

        if (data.nPayType == 1) {
            //充******值
            label_oprate.string = this._config.recharge || "";
            let color = new cc.Color(239, 67, 67, 255);
            label_oprate.node.color = color;
        } else {
            //提******现
            label_oprate.string = this._config.withdrawal || "";
            let color = new cc.Color(0, 255, 134, 255);
            label_oprate.node.color = color;
        }

        if (data.nChannelType != undefined) {
            label_type.lang = "CLUB_CHANNELTYPE." + data.nChannelType;
        }

        if (data.nGoldType != undefined) {
            label_moneyType.lang = "CLUB_MONEYTYPE." + data.nGoldType;
        }

        label_count.string = data.nCount || 0;
        this.setLabelColor(label_change, data.nGoldChange || 0);
        label_canUse.string = data.nBalance;

        if (data.nPayType == 1) {
            if (data.nState == 1) {
                //成功
                label_state.lang = "CLUB_HALL.APPLY_PASSED";
                let color = new cc.Color(237, 196, 142, 255);
                label_state.node.color = color;
            } else {
                //待处理
                if (data.nAuditStatus == 2 || data.nAuditStatus == 4) {
                    label_state.lang = "CLUB_HALL.APPLY_UNPASSED";
                } else {
                    label_state.lang = "CLUB_HALL.APPLY_STATUS";
                }

                let color = new cc.Color(255, 255, 255, 255);
                label_state.node.color = color;
            }
        }

        if (data.nPayType == 2) {
            if (data.nAuditStatus == 0) {
                //待审核
                label_state.lang = "CLUB_HALL.APPLY_AUDITED";
                let color = new cc.Color(255, 255, 255, 255);
                label_state.node.color = color;
            } else if (data.nAuditStatus == 1) {
                //已通过
                label_state.lang = "CLUB_HALL.APPLY_PASSED";
                let color = new cc.Color(237, 196, 142, 255);
                label_state.node.color = color;
            } else {
                //已拒绝
                label_state.string = i18n.t("CLUB_HALL.APPLY_UNPASSED");
                let color = new cc.Color(255, 255, 255, 255);
                label_state.node.color = color;
            }

        }


        line.active = true;

        if (index == 0) {
            node.getComponent(cc.Sprite).spriteFrame = this.itemBgRes[0];
        } else if (index == this._recordList.length - 1) {
            node.getComponent(cc.Sprite).spriteFrame = this.itemBgRes[2];
            line.active = false;
        } else {
            node.getComponent(cc.Sprite).spriteFrame = this.itemBgRes[1];
        }
    },

    onClickBtnLook(event, data) {
        cc.log("onClickBtnLook");

        let target = event.target;

        let HallRechargeRecordItem = target.parent.getComponent("HallRechargeRecordItem");

        let customEventData = HallRechargeRecordItem._getData();

        let bg = this.infoPanel.getChildByName("bg");

        for (let i = 1; i <= 9; i++) {
            let info = bg.getChildByName("info" + i);

            let label = info.getChildByName("label").getComponent(cc.Label);

            if (i == 7) {//金币变化
                this.setLabelColor(label, customEventData.nGoldChange || 0);
            } else {
                let nCount = customEventData.nCount || 0;

                let nStr = "";
                if (i == 1) {//操作
                    if (customEventData.nPayType == 1) {
                        nStr = this._config.recharge || "";
                    } else {
                        nStr = this._config.withdrawal || "";
                    }
                } else if (i == 2) {//银行账号
                    nStr = customEventData.sBankAccount;
                } else if (i == 3) {//类型
                    if (customEventData.nChannelType >= 6) {
                        nStr = this.getChannelName(customEventData.nChannelType)
                    } else {
                        nStr = i18n.t("CLUB_CHANNELTYPE." + customEventData.nChannelType);
                    }

                } else if (i == 4) {//币种
                    nStr = i18n.t("CLUB_MONEYTYPE." + customEventData.nGoldType);
                } else if (i == 5) {//数量
                    nStr = nCount;
                } else if (i == 6) {//汇率
                    let nExchangeRate = customEventData.nExchangeRate;

                    if (nExchangeRate >= 1) {
                        nStr = "1" + i18n.t("CLUB_MONEYTYPE." + customEventData.nGoldType) + " = " + nExchangeRate + i18n.t("CLUB_HALL_RECORD.GOLD");
                    } else {
                        nStr = 1 / nExchangeRate + i18n.t("CLUB_MONEYTYPE." + customEventData.nGoldType) + " = 1" + i18n.t("CLUB_HALL_RECORD.GOLD");
                    }
                } else if (i == 8) {//申请时间
                    let sTime = customEventData.sCreateTime.split(" ");
                    sTime[0] = Utils.replaceAll(sTime[0], "-", "/")
                    nStr = sTime[0] + " " + sTime[1];
                } else if (i == 9) {//状态
                    if (customEventData.nPayType == 1) {//充值
                        if (customEventData.nState == 1) {
                            //成功
                            nStr = i18n.t("CLUB_HALL.APPLY_PASSED");
                        } else {
                            //待处理
                            if (customEventData.nAuditStatus == 2 || customEventData.nAuditStatus == 4) {
                                nStr = i18n.t("CLUB_HALL.APPLY_UNPASSED");
                            } else {
                                nStr = i18n.t("CLUB_HALL.APPLY_STATUS");
                            }

                        }
                    } else {//提现
                        if (customEventData.nAuditStatus == 0) {
                            //待审核
                            nStr = i18n.t("CLUB_HALL.APPLY_AUDITED");
                        } else if (customEventData.nAuditStatus == 1) {
                            //已通过
                            nStr = i18n.t("CLUB_HALL.APPLY_PASSED");
                        } else {
                            //已拒绝
                            nStr = i18n.t("CLUB_HALL.APPLY_UNPASSED");
                        }

                    }
                }

                label.string = nStr;
            }

        }

        this.infoPanel.active = true;
    },

    setLabelColor(label, value) {
        if (value == 0) {
            label.string = Utils.convertNumberToStr(value);
            let color = new cc.Color(230, 229, 242, 255);
            label.node.color = color;
        } else if (value > 0) {
            label.string = "+" + Utils.convertNumberToStr(value);
            let color = new cc.Color(239, 67, 67, 255);
            label.node.color = color;
        } else {
            label.string = Utils.convertNumberToStr(value);
            let color = new cc.Color(0, 255, 134, 255);
            label.node.color = color;
        }
    },

    onClickBtnBlock() {
        this.infoPanel.active = false;
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

        //设置数据，key为item样式，data为数据
        this.scview.append_data(allData);
        this.scview.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },


    _onPayInfo(data) {
        if (!data || data.nType != 2) {
            return;
        }

        if (this._recordList.length == 0) {
            this.updateScrollView(data.arrPayRecord);
        } else {
            this.appendData(data.arrPayRecord);
        }

        this.noRecord.active = this._recordList.length == 0;
    },

    _onTrCallback(data) {
        if (!data || data == "" || !data.nWayInfo || data.nWayInfo == "") {
            return;
        }

        this.transferConfig = [];
        let wayInfo = JSON.parse(data.nWayInfo);
        for (let i = 0; i < wayInfo.length; i++) {
            if (wayInfo[i]) {
                let tab = JSON.parse(wayInfo[i]);
                this.transferConfig.push(tab);
            }

        }

    },

    getChannelName(id) {
        for (let i = 0; i < this.transferConfig.length; i++) {
            if (this.transferConfig[i]) {
                let array = this.transferConfig[i];
                if ((array.id + 6) === id) {
                    return array.channelName
                }
            }

        }

        return id;
    }


});
