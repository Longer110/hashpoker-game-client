// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部申请(1、退回俱乐部币申请；2、增加俱乐部币申请；3、加入俱乐部申请)
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
        titleList: {
            default: [],
            type: cc.Node
        },
        panelList: {
            default: [],
            type: cc.Node
        },

        noRecord: cc.Node,

        _index: 1,
        _applyList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onApplyListCallBacks);
        MsgManager.un(this._onApplyHandleCallBacks);
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSApplyListResp_ui, this._onApplyListCallBacks, this);
        MsgManager.on(MSG.NOTIFY.ClubSApplyHandleResp_ui, this._onApplyHandleCallBacks, this);
    },

    // update (dt) {},

    init(index){
        this.regiester();
        this._index = index;
        this.initUI();
        this.initList();
        this.getApplyList(0, index);
    },

    //type (1、退回俱乐部币申请；2、增加俱乐部币申请；3、加入俱乐部申请)
    getApplyList(nIdOfStart, type){
        let nClubId = HallClubCacheData.getCurLoginClub();

        let params = {
            nClubId: nClubId,
            nType: type,
            nIdOfStart: nIdOfStart,
            nCnt: 50,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSApplyListReq_CMD, params);
    },

    initUI(){
        for (let i = 0; i < this.titleList.length; i++) {
           this.titleList[i].active = this._index == (i + 1);
        }

        for (let i = 0; i < this.panelList.length; i++) {
            this.panelList[i].active = this._index == (i + 1);
        }
        
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
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getApplyList(this._applyList[this._applyList.length - 1].nId, this._index);
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
        label_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        if (data.nType == 1 || data.nType == 2){
            //俱乐部币
            label_value.string = Utils.convertNumberToStr(data.nChange || 0);
        }else if (data.nType == 3){
            //俱乐部申请
            label_value.lang = "CLUB_HALL.APPLY_STATUS";
        }
        

        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(data, index);
         }.bind(this))
    },

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------",listData);
        //设置列表item数据
        this._applyList = Utils.clone(listData);
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
    appendData(data){
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
            str = Utils.replaceAll(i18n.t("CLUB_HALL.APPLY_TIP2"), "SSS", Base64.decode(data.sName)); 
            str = Utils.replaceAll(str, "XXX", data.nChange || 0);
        }else if (data.nType == 2){
            str = Utils.replaceAll(i18n.t("CLUB_HALL.APPLY_TIP1"), "SSS", Base64.decode(data.sName)); 
            str = Utils.replaceAll(str, "XXX", data.nChange || 0);
        }else if (data.nType == 3){
            str = Utils.replaceAll(i18n.t("CLUB_HALL.APPLY_TIP3"), "SSS", Base64.decode(data.sName)); 
        }

        let nClubId = HallClubCacheData.getCurLoginClub();
        let params= {
            uiData: {sureTitle: i18n.t("CLUB_HALL.ACCEPT"), cancelTitle: i18n.t("CLUB_HALL.REFUSE")},
            isOKAndCancel: true,
            callBack: function(isAccept){
                let params = {
                    nClubId: nClubId,
                    nId: data.nId,
                    nType: data.nType,
                    nOpType: isAccept?1:2,
                }
        
                if (data.nType == 1 || data.nType == 2){
                    let callback = function(password){
                        params.sPassWord = Base64.encode(password);
                        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSApplyHandleReq_CMD, params); 
                    }

                    let tmp = {
                        callBack: callback,
                        title: data.nType == 1?i18n.t("CLUB_HALL.ADD_MONEY"):i18n.t("CLUB_HALL.RECYCLE_MONEY"),
                    }
                    MsgManager.fire(MSG.NOTIFY.INPUT_PASSWORD, tmp);
                }else{
                    app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSApplyHandleReq_CMD, params);
                }
                
            }.bind(this),
            isUseRichText: true,
            text: str,
        }

        this._curIndex = index;
        MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
    },

    _onApplyListCallBacks(data){
        if (data.arrApplyList.length == 0){
            this._isEnd = true;
        }

        data.arrApplyList.sort(function(a, b){
            return b.nId - a.nId;
        })

        if (this._applyList.length == 0){
            this.updateScrollView(data.arrApplyList);
        }else{
            this.appendData(data.arrApplyList);
        }
       
        this.noRecord.active = this._applyList.length == 0;
    },

    _onApplyHandleCallBacks(data){
        if (data.nRlt == 0){
            this.scview.delete_item(this._curIndex);
        }else if (data.nRlt == 1){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_CLUB_MEMBER"));
        }else if (data.nRlt == 2){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_POWER"));
        }else if (data.nRlt == 3){
      
        }else if (data.nRlt == 4){
            UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
        }else if (data.nRlt == 5){
            this.scview.delete_item(this._curIndex);
            UIFrame.showTips(i18n.t("CLUB_ERROR.HAS_HANDLE"));
        }else if (data.nRlt == 6){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_ENOUGH_CLUB_MONEY"));
        }else if (data.nRlt == 7){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_ENOUGH_CLUB_MONEY2"));
        }else if (data.nRlt == 8){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_CLUB_MEMBER"));
        }else if (data.nRlt == 9){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_THIS_APPLY"));
        }else if (data.nRlt == 10){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_CLUB_MEMBER2"));
        }else if (data.nRlt == 11){
            UIFrame.showTips(i18n.t("CLUB_ERROR.STOCK_PSW_ERROR"));
        }else if (data.nRlt == 12){
            UIFrame.showTips(i18n.t("CLUB_ERROR.APPLY_ERROR1"));
        }else if (data.nRlt == 13){
            UIFrame.showTips(i18n.t("CLUB_ERROR.APPLY_ERROR2"));
        }else if (data.nRlt == 14){
            UIFrame.showTips(i18n.t("CLUB_ERROR.APPLY_ERROR3"));
        }else if (data.nRlt == 15){
            UIFrame.showTips(i18n.t("CLUB_ERROR.DATABASE_ERROR"));
        }else if (data.nRlt == 16){
            UIFrame.showTips(i18n.t("CLUB_ERROR.CLUB_NUM_FULL"));
        }
    },
});
