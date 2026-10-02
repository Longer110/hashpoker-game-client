// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//创建俱乐部
let i18n = require("i18n");
let TAG = "club_search";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
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

        editBox: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBox.placeholder = i18n.t("CLUB_HALL.INPUT_CLUB_NAME2");
        this.initList();
        MsgManager.on(MSG.NOTIFY.ClubSSearchResp_ui, this._onSearchClubCallBack, this);
        MsgManager.on(MSG.NOTIFY.ClubSApplyResp_ui, this._onApplyCallBack, this);
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onSearchClubCallBack);
        MsgManager.un(this._onApplyCallBack);
    },

    onClickClose(){
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
            item_templates:  [
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
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        // let item = node.getComponent("HallGameItem");
        // item.initItem(data);
        this.initItem(node, data);

        return [node.width, node.height];
    },

    initItem(node, data){
        let label_clubName = node.getChildByName("label_clubName").getComponent(cc.Label);
        let label_clubCreator = node.getChildByName("label_clubCreator").getComponent(cc.Label);
        let label_clubNum = node.getChildByName("label_clubNum").getComponent(cc.Label);
        let btn_applyEnter = node.getChildByName("btn_applyEnter");
        let label_title = btn_applyEnter.getChildByName("title").getComponent(cc.Label);

        label_clubName.string = Utils.getShortText(Base64.decode(data.sClubName), 12);
        let text = i18n.t("CLUB_HALL.CLUB_CREATOR");
        label_clubCreator.string = Utils.replaceAll(text, "XXX", Utils.getShortText(Base64.decode(data.sMasterName), 12));//text.replace(/\[XXX]/g, Base64.decode(data.sMasterName));
        label_clubNum.string = data.nUserCnt + "/" + data.nMaxUserCnt;

        if (data.nStatus == 0){
            //未申请
            label_title.lang = "CLUB_HALL.APPLY_ENTER";
        }else if (data.nStatus == 1){
            //已申请
            label_title.lang = "CLUB_HALL.APPLY_HAS_APPLY";
        }else if (data.nStatus == 2){
            //已加入
            label_title.lang = "CLUB_HALL.APPLY_HAS_ENTER";
        }

        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(data, node);
         }.bind(this))
    },

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------",listData);
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
    },

    onClickSearch(){
        let str = this.editBox.string;
        if (str == ""){
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_CLUB_NAME2"));
            return;
        }

        this.scview.clear_items();

        let params = {
            str: Base64.encode(str),
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSSearchReq_CMD, params);
    },

    _onSearchClubCallBack(data){
        if(!data.arrItem || data.arrItem.length == 0){
            let params = {
                text: i18n.t("CLUB_ERROR.UN_SEARCH_CLUB"),
            }
            MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);

            return;
        }

        this.clubList = data.arrItem;
        this.updateScrollView(data.arrItem);
    },

    onClickItem(data, node){
        if (data.nStatus == 0){
            let params = {
                nClubId: data.nClubId,
            }
            app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSApplyReq_CMD, params);
            this.ClickItem = node;
            this.clickClubId = data.nClubId;
        }

       
    },

    _onApplyCallBack(data){
        let nStatus = 0;
        if (data.nRlt == 0){
            nStatus = 1;
            UIFrame.showTips(i18n.t("CLUB_ERROR.APPLY_SUCCESS"));
        }else if (data.nRlt == 1){
            UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
        }else if (data.nRlt == 2){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
        }else if (data.nRlt == 3){
            nStatus = 1;
            UIFrame.showTips(i18n.t("CLUB_ERROR.HAS_APPLY"));
        }else if (data.nRlt == 4){
            UIFrame.showTips(i18n.t("CLUB_ERROR.CAN_NOT_APPLY"));
        }else if (data.nRlt == 5){
            nStatus = 2;
            UIFrame.showTips(i18n.t("CLUB_ERROR.HAS_AT_CLUB"));
        }else if (data.nRlt == 6){
            UIFrame.showTips(i18n.t("CLUB_ERROR.DIFF_ARRAY"));
        }else if (data.nRlt == 7){
            UIFrame.showTips(i18n.t("CLUB_ERROR.AT_BLACKLIST"));
        }else if (data.nRlt == 8){
            UIFrame.showTips(i18n.t("CLUB_ERROR.MAX_APPLY_COUNT"));
        }else{
            UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"));
        }

        this.updateList(nStatus);
    },

    updateList(status){
        for (let i = 0; i < this.clubList.length; i++) {
            if (this.clubList[i].nClubId == this.clickClubId){
                this.clubList[i].nStatus = status;
            }
            
        }

        this.updateScrollView(this.clubList);
    }
});
