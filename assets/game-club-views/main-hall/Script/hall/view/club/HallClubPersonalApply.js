// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部个人申请(1、退回俱乐部币申请；2、增加俱乐部币申请；3、加入俱乐部申请)
let i18n = require("i18n");
let TAG = "club_personal_apply";
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
        _index: 1,
        _applyList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this.initList();
        this.regiester();
        this.getApplyList(0);
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onApplyListCallBacks);
        MsgManager.un(this._onApplyOpCallBacks);
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSGetApplyListResp_ui, this._onApplyListCallBacks, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserApplyOpResp_ui, this._onApplyOpCallBacks, this);
    },

    // update (dt) {},

    getApplyList(nIdOfStart){
        let nClubId = HallClubCacheData.getCurLoginClub();

        let params = {
            nType: 1,
            nIdOfStart: nIdOfStart,
            nCnt: 50,
            nClubId: nClubId,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetApplyListReq_CMD, params);
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
            scroll_to_end_cb: this.scroll_to_end_cb,
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        // let item = node.getComponent("HallGameItem");
        // item.initItem(data);
        this.initItem(node, data, index);

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr){
        if (dataArr.length <= 0 || this.isEnd) return;
        this.getApplyList(this._applyList[this._applyList.length - 1].nId);
    },

    //data.nType: 1：增加俱乐部币 2：退还俱乐部币 3：申请加入俱乐部
    initItem(node, data, index){
        let label_time1 = node.getChildByName("label_time1").getComponent(cc.Label);
        let label_time2 = node.getChildByName("label_time2").getComponent(cc.Label);
        let label_name = node.getChildByName("label_name").getComponent(cc.Label);
        let label_value = node.getChildByName("label_value").getComponent(cc.Label);
        let array = data.sTime.split(" ");
        label_time1.string = array[0];
        label_time2.string = array[1];
        if (data.nType == 1){
            label_name.lang = "CLUB_HALL.ADD_MONEY";
        }else{
            label_name.lang = "CLUB_HALL.RECYCLE_MONEY";
        }
        
        //俱乐部币
        label_value.string = data.nChange || 0;
        

        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(data, index);
         }.bind(this))
    },

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------",listData);
        //设置列表item数据
        this._applyList = listData;
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
    appendData(data, isSearch){
        QYLogs.log(TAG, "----------------appendData---------------",data);
        for (let i = 0; i < data.length; i++) {
            this._applyList.push(data[i]); 
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

    onClickItem(data, index){
        let str = "";
        if (data.nType == 1){
            str = i18n.t("CLUB_HALL_TIP.CANCEL_ADD_MONEY");
        }else if (data.nType == 2){
            str = i18n.t("CLUB_HALL_TIP.CANCEL_RECYCLE_MONEY");
        }

        let params = {
            text: str,
            callBack: function(isOk){
                if (isOk){
                    let params = {
                        nId: data.nId,
                        nOpType: 1,
                        nType: data.nType,
                    }
            
                    app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserApplyOpReq_CMD, params);
                }
               
            }.bind(this),
            isOKAndCancel: true,
            uiData: {sureTitle: i18n.t("CLUB_HALL.CANCEL"), cancelTitle: i18n.t("CLUB_HALL.CLOSE")}
        }
        MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
    },

    _onApplyListCallBacks(data){
        if(data.arrApplyList.length == 0){
            this.isEnd = true;
            return;
        }
        if (this._applyList.length == 0){
            this.updateScrollView(data.arrApplyList);
        }else{
            this.appendData(data.arrApplyList);
        }
        
    },

    _onApplyOpCallBacks(data){
        if (data.nRlt == 0){
            for (let i = 0; i < this._applyList.length; i++) {
                if (this._applyList[i].nId == data.nId){
                    this.scview.delete_item(i);
                }
            }
            
        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_THIS_APPLY"));
            }
            if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NO_HANDLE"));
            }

            if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.HAS_HANDLE"));
            }

            if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
            }
        }
    },
});
