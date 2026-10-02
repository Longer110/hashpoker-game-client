// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//创建俱乐部
let i18n = require("i18n");
let TAG = "my_notice";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let UIFrame = require("UIFrame");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let HALL_MSG = require("Msg_hall");

cc.Class({
    extends: cc.Component,

    properties: {
        scrollviewList: {
            default: [],
            type: cc.ScrollView,
        }, 
        maskList: {
            default: [],
            type: cc.Node
        },
        itmeContentList: {
            default: [],
            type: cc.Node
        },
        item: {
            default: null,
            type: cc.Node
        },

        menuList: {
            default: [],
            type: cc.Node
        },

        itemSys: {
            default: null,
            type: cc.Node
        },

        menuBar: cc.Node,

        t_redPoint: cc.Node,  //标题红点

        redPoint: {
            default: [],
            type: cc.Node
        }, //标题栏红点

        noData: cc.Node,
        billPrefab: cc.Prefab,

        _applyList: [],
        _inviteList: [],
        _systemList: [],
        _inviteRedpointCount: 0,
        _curType: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initList();
        MsgManager.on(HALL_MSG.ClubSUserNoticeResp_CMD, this._userNotice, this);
        MsgManager.on(HALL_MSG.ClubSUserNoticeHandleResp_CMD, this._userNoticeHandle, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserNoticeResp_ui, this._userNotice, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserNoticeHandleResp_ui, this._userNoticeHandle, this);
        // MsgManager.on(MSG.NOTIFY.ClubSUserApplyOpResp_ui, this._userApplyOp, this);
        this.onClickMenubar(null, 0);
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._userNotice);
        MsgManager.un(this._userNoticeHandle);
        MsgManager.un(this._userApplyOp);
    },

    onClickClose(){
        this.node.destroy();
    },

    init(data, ctl){
        // for (let i = 0; i < data.length; i++) {
        //     if (data[i].nType == 3){
        //         this._systemRedpointCount = data[i].nCount;
        //     }else if (data[i].nType == 2){
        //         this._inviteRedpointCount = data[i].nCount;
        //     }
            
        // }

        this._contrl = ctl;
        // this.updateRedPoint()



        //
        this.updateRedPoint()

    },

    //nType 通知的类型 1:系统通知 2:俱乐部邀请通知 3:个人加入俱乐部申请
    getNoticeList(nIdOfStart, nType){
        this._curType = nType;
        let params = {
            nIdOfStart: nIdOfStart,
            nCnt: 20,
            nType: nType
        }

        
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserNoticeReq_CMD, params);
    },

    updateRedPoint(){
        if (this._inviteRedpointCount > 0 || this._systemRedpointCount > 0){
            this.t_redPoint.active = true;
        }else{
            this.t_redPoint.active = false;
        }

        if (this._inviteRedpointCount > 0){
            //邀请红点
            this.redPoint[1].active = true;
        }else{
            this.redPoint[1].active = false;
        }
        
        if (this._systemRedpointCount > 0){
            //系统红点
            this.redPoint[0].active = true;
        }else{
            this.redPoint[0].active = false;
        }

        if (this._contrl){
            let count = this._inviteRedpointCount + this._systemRedpointCount;
            this._contrl.updateRedPoint(1, this.t_redPoint.active, count);
        }

    },

    //初始化滚动列表
    initList() {
        QYLogs.log(TAG, "----------------initList---------------");

        //调用构造函数，传入构造参数
        this.scview1 = new DynamicListView({
            scrollview: this.scrollviewList[0],
            mask: this.maskList[0],
            content: this.itmeContentList[0],
            item_templates:  [
                { key: "item1", node: cc.instantiate(this.itemSys) },
            ],
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setterSys,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
            scroll_to_end_cb: this.scroll_to_end_cb,
        });
        //调用构造函数，传入构造参数
        this.scview2 = new DynamicListView({
            scrollview: this.scrollviewList[1],
            mask: this.maskList[1],
            content: this.itmeContentList[1],
            item_templates:  [
                { key: "item1", node: cc.instantiate(this.item) },
            ],
            cb_host: this,
            //设置item的回调方法
            item_setter: this.itemSys_setter,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
            scroll_to_end_cb: this.scroll_to_end_cb,
        });

        //调用构造函数，传入构造参数
        this.scview3 = new DynamicListView({
            scrollview: this.scrollviewList[2],
            mask: this.maskList[2],
            content: this.itmeContentList[2],
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
    item_setter(node, key, data, index, isPackItem) {
        if ((node.tmpId && node.tmpId == data.nId) || isPackItem){
            return [node.width, node.height];
        }
        
        this.initItem(node, data);
        node.tmpId = data.nId;
        return [node.width, node.height];
    },
        //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setterSys(node, key, data, index, isPackItem) {
        if ((node.tmpId && node.tmpId == data.nId) || isPackItem){
            return [node.width, node.height];
        }
        
        this.initItemSys(node, data);
        node.tmpId = data.nId;
        return [node.width, node.height];
    },

    initItemSys(node, data){
        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        let label_tip = node.getChildByName("label_tip").getComponent(cc.RichText);
        let btn_go = node.getChildByName("btn_go");
        let btnText = btn_go.getChildByName("label").getComponent(cc.Label);
        if (data.sData){
            let sData = JSON.parse(data.sData);
            label_tip.string = sData.sMsg || "";
            label_time.string = data.sTime;

            btn_go.off(cc.Node.EventType.TOUCH_END);
            if (sData.nType){
                btn_go.on(cc.Node.EventType.TOUCH_END, function (button) {
                    this.OnClickToRecord(sData.nType - 21);
                }.bind(this))
            }

        }
    },

        //账单记录
    OnClickToRecord(nType) {
        nType = nType>0 ? nType : 0;
        let prefab = this.billPrefab
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.node.addChild(node, 1024);
            node.getComponent('HallMyBill').init(null, nType || 0)
        }
    },


    scroll_to_end_cb(dataArr){
        if (dataArr.length <= 0) return;
        if (this.scrollviewList[0].node.active){
            if (!this._isEnd1){
                this.getNoticeList(this._systemList[this._systemList.length - 1].nId, 1);
            }
        }else if (this.scrollviewList[1].node.active){
            if (!this._isEnd2){
                this.getNoticeList(this._inviteList[this._inviteList.length - 1].nId, 2);
            }

        }else if (this.scrollviewList[2].node.active){
            if (!this._isEnd3){
                this.getNoticeList(this._applyList[this._applyList.length - 1].nId, 3);
            }
        }
    },

    initItem(node, data){
        let img_head = node.getChildByName("head").getChildByName("img_head").getComponent(cc.Sprite);
        let label_name = node.getChildByName("head").getChildByName("label_name").getComponent(cc.Label);
        let label_tip = node.getChildByName("label_tip").getComponent(cc.Label);
        let btn_check = node.getChildByName("btn_check");
        let btn_accept = node.getChildByName("btn_accept");
        let btn_refuse = node.getChildByName("btn_refuse");
        let redPoint = node.getChildByName("redPoint");
        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        label_tip.node.height = this.item.getChildByName("label_tip").height;
        label_tip.node.y = this.item.getChildByName("label_tip").y;

        if (data.sData){
            let userInfo = JSON.parse(data.sData);
            Utils.changeUserHead(img_head, userInfo.sFaceId || "1001", app.ClubAssets);
            if (userInfo.sUserName){
                label_name.string = Utils.getShortText(Base64.decode(userInfo.sUserName), 12);
            }else{
                label_name.string = Utils.getShortText(i18n.t("CLUB_HALL.SYSTEM"), 12);
            }
            
            let str = i18n.t("CLUB_HALL_TIP.INVITE_CLUB");
            if (data.nType == 1){
                label_tip.node.width = 450;
                if (userInfo.nOpType == 1){
                    //增加俱乐部币
                    str = i18n.t("CLUB_HALL_TIP.ADD_CLUB_MONEY");
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                    str = Utils.replaceAll(str, "SSS", userInfo.nChange); 
                }else if (userInfo.nOpType == 2){
                    //回收俱乐部币
                    str = i18n.t("CLUB_HALL_TIP.RECYCLE_CLUB_MONEY");
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                    str = Utils.replaceAll(str, "SSS", userInfo.nChange); 
                }else if (userInfo.nOpType == 3){
                    //提升管理员
                    str = i18n.t("CLUB_HALL_TIP.BECOME_ADMIN1");
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                }else if (userInfo.nOpType == 4){
                    //变成普通成员
                    str = i18n.t("CLUB_HALL_TIP.BECOME_MEMBER");
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                }else if (userInfo.nOpType == 5){
                    //踢出俱乐部
                    str = i18n.t("CLUB_HALL_TIP.KICK_OUT_CLUB");
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                }else if (userInfo.nOpType == 6){
                    //改变管理权限
                    str = i18n.t("CLUB_HALL_TIP.CHANGE_ADMIN_RIGHTS");
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                    let str2 = ""
                    for (let i = 0; i < userInfo.arrChangePower.length; i++) {
                        if (str2 == ""){
                            str2 += i18n.t("CLUB_AUTHORITY_DES." + userInfo.arrChangePower[i].nPowerType);
                        }else{
                            str2 += "、";
                            str2 += i18n.t("CLUB_AUTHORITY_DES." + userInfo.arrChangePower[i].nPowerType);
                        }
                        
                    }

                    str = Utils.replaceAll(str, "SSS", str2); 
                }else if (userInfo.nOpType == 7){
                    //申请加入俱乐部
                    if(userInfo.isAgree == 1){
                        //同意
                        str = i18n.t("CLUB_HALL_TIP.ENTER_CLUB_TIP1");
                    }else{
                        //拒绝
                        str = i18n.t("CLUB_HALL_TIP.ENTER_CLUB_TIP2");
                    }
                    
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                }else if (userInfo.nOpType == 8){
                    //增加俱乐部币
                    if(userInfo.isAgree == 1){
                        //同意
                        str = i18n.t("CLUB_HALL_TIP.ADD_CLUB_MONEY_TIP1");
                    }else{
                        //拒绝
                        str = i18n.t("CLUB_HALL_TIP.ADD_CLUB_MONEY_TIP2");
                    }
                    
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                    str = Utils.replaceAll(str, "SSS", userInfo.nChange); 
                }else if (userInfo.nOpType == 9){
                    //退还俱乐部币
                    if(userInfo.isAgree == 1){
                        //同意
                        str = i18n.t("CLUB_HALL_TIP.RECYCLE_CLUB_MONEY_TIP1");
                    }else{
                        //拒绝
                        str = i18n.t("CLUB_HALL_TIP.RECYCLE_CLUB_MONEY_TIP2");
                    }
                    
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                    str = Utils.replaceAll(str, "SSS", userInfo.nChange); 
                }else if (userInfo.resType){
                    str = i18n.t("CLUB_RECHARGE.SYSTEM_MASSAGE" + userInfo.resType);
                    label_time.node.active = true;
                    label_time.string = data.sTime || "";
                    label_tip.node.height = label_tip.node.height - label_time.node.height/2;
                    // label_tip.node.y = label_tip.node.y - label_time.node.height/2;
                }       
            }else if (data.nType == 4){
                //mtt比赛结束通知
                if(userInfo.nGold > 0){
                    str = i18n.t("CLUB_MTT.Notice2");
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sName)); 
                    str = Utils.replaceAll(str, "SSS", userInfo.nRank);
                    str = Utils.replaceAll(str, "AAA", userInfo.nGold);
                }else{
                    str = i18n.t("CLUB_MTT.Notice1");
                    str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sName)); 
                    str = Utils.replaceAll(str, "SSS", userInfo.nRank);
                    
                }
            }else if (data.nType == 5){
                //mtt比赛取消
                str = i18n.t("CLUB_MTT.CancelMttTip");
                str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sName)); 
            }else{
                str = Utils.replaceAll(str, "XXX", Base64.decode(userInfo.sClubName)); 
                
            }

            label_tip.string = str;   
        }else{
            Utils.changeUserHead(img_head, UserInfo.getInfo().strHeadUrl || "1", app.ClubAssets);
            label_name.string = Utils.getShortText(UserInfo.getInfo().strNickName, 12);
            let str = i18n.t("CLUB_HALL_TIP.APPLY_CLUB");
            str = Utils.replaceAll(str, "XXX", Base64.decode(data.sClubName)); 
            label_tip.string = str;
        }

        redPoint.active = false;
        if(data.nType == 1 && data.hasOwnProperty("nHadRead")){
            //系统消息有已读和未读 nHadRead：0： 未读；1： 已读
            redPoint.active = data.nHadRead == 0;
        }
        

        node.off(cc.Node.EventType.TOUCH_END);

        if(data.nStatus == 0){
            btn_check.active = true;
            btn_accept.active = false;
            btn_refuse.active = false;
            let label = btn_check.getChildByName("label").getComponent(cc.Label);
            label.lang = "CLUB_HALL.CHECK";
            node.on(cc.Node.EventType.TOUCH_END, function (button) {
                this.onClickCheck(data);
            }.bind(this))
        }else if(data.nStatus == 1){
            btn_check.active = false;
            btn_accept.active = true;
            btn_refuse.active = false;
            let label = btn_accept.getChildByName("label").getComponent(cc.Label);
            label.lang = "CLUB_HALL.HAS_ACCEPT";
        }else if(data.nStatus == 2){
            btn_check.active = false;
            btn_accept.active = false;
            btn_refuse.active = true;
            let label = btn_refuse.getChildByName("label").getComponent(cc.Label);
            label.lang = "CLUB_HALL.HAS_REFUSE";
        }else if(data.nStatus == 4){
            btn_check.active = false;
            btn_accept.active = false;
            btn_refuse.active = true;
            let label = btn_refuse.getChildByName("label").getComponent(cc.Label);
            label.lang = "CLUB_HALL.HAS_CANCEL";
        }else{
            btn_check.active = false;
            btn_accept.active = false;
            btn_refuse.active = false;
        }
    },

    updateScrollView(listData, index) {
        QYLogs.log(TAG, "----------------updateScrollView---------------",listData);
        //设置列表item数据
        let scview = this.scview3;
        if (index == 3){
            this._applyList = listData;
        }else if (index == 2){
            this._inviteList = listData;
            scview = this.scview2;
        }else if (index == 1){
            this._systemList = listData;
            scview = this.scview1;
        }

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
     
        scview.set_data(allData);
        // scview.scrollview.scrollToTop();
    },

    //向列表末端插入新的数据
    appendData(data,index){
        QYLogs.log(TAG, "----------------appendData---------------",data);
        let scview = this.scview3;
        if (index == 3){
            for (let i = 0; i < data.length; i++) {
                this._applyList.push(data[i]); 
            }
        }else if (index == 2){
            for (let i = 0; i < data.length; i++) {
                this._inviteList.push(data[i]); 
            }
            scview = this.scview2;
        }else if (index == 1){
            for (let i = 0; i < data.length; i++) {
                this._systemList.push(data[i]); 
            }
            scview = this.scview1;
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
        scview.append_data(allData);
    },

    onClickCheck(data){
        // if (data.nType == 2){
        //     this.operateInviteNotice(data);   
        // }
        // if (data.nType == 3){
        //     this.operateApplyNotice(data);
        // }
    },



    
     //打开界面全部显示为已读
    _reqAllReadedNotice(){
        let params = {
            nId: 0,
            nOpType: 1,
        }
        
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserNoticeHandleReq_CMD, params);
    },

    
   
    onClickMenubar(event, customEventData){
        //2: 申请 1: 邀请 0: 系统
        let num = Number(customEventData);
        let widget = this.menuBar.getComponent(cc.Widget);
        if (widget){
            widget.updateAlignment();
        }

        if (this._curIndex != undefined && this._curIndex == num){
            return;
        }

        this._curIndex = num;
        this.noData.active = false;

        for (let i = 0; i < this.menuList.length; i++) {
            let node = this.menuList[i];
            let sel = node.getChildByName("sel");
            let label = node.getChildByName("label").getComponent(cc.Label);
            let color = new cc.Color(0, 255, 134, 255); 

            if (i == num){
                sel.active = true;
                this.scrollviewList[i].node.active = true;
            }else{
                sel.active = false;
                color = new cc.Color(232, 223, 209, 255);
                this.scrollviewList[i].node.active = false;
            }
            // sel.width = this.menuBar.width/3;

            let str = "";
            if (i == 2){
                str = i18n.t("CLUB_HALL.APPLY");
                if (sel.active){
                    this._applyList = [];
                    this._isEnd3 = false;
                    this.getNoticeList(0, 3);
                }
                
            }else if (i == 1){
                str = i18n.t("CLUB_HALL.INVITE");
                if (sel.active){
                    this._inviteList = [];
                    this._isEnd2 = false;
                    this.getNoticeList(0, 2);
                }
                
            }else if (i == 0){
                str = i18n.t("CLUB_HALL.SYSTEM");
                if (sel.active){
                    this._systemList = [];
                    this._isEnd1 = false;
                    this.getNoticeList(0, 1);
                }
                
            }

            label.string = str;
            label.node.color = color;
        }
    },

    _userNotice(data){
        if (data.nType != this._curType){
            return;
        }

        if(data.nType == 1){
            this._systemRedpointCount = 0;
            this.updateRedPoint();
        }

        this.noData.active = false;
        let len = data.arrNotices.length;

        if (len == 0 ){
            if (data.nType == 1){
                this.noData.active = this._systemList.length == 0;
            }

            if (data.nType == 2){
                this.noData.active = this._inviteList.length == 0;
            }
            
            if (data.nType == 3){
                if (data.arrApplyList.length == 0){
                    this.noData.active = this._applyList.length == 0;
                }
            }
            
        }

        if (data.arrNotices.length == 0 && data.nType == 1){
            this._isEnd1 = true;
            return;
        }

        if (data.arrNotices.length == 0 && data.nType == 2){
            this._isEnd2 = true;
            return;
        }

        if (data.arrApplyList.length == 0 && data.nType == 3){
            this._isEnd3 = true;
            return;
        }

        let isAppend = false;
        let index = 3;
        let tmpData = data.arrNotices;
        if (data.nType == 1 || data.nType == 4 || data.nType == 5){
            //系统
            index = 1
            tmpData = data.arrNotices;
            isAppend = this._systemList.length == 0;
        }else if (data.nType == 2){
            //邀请
            index = 2
            isAppend = this._inviteList.length == 0;
        }else{
            //申请
            isAppend = this._applyList.length == 0;
            tmpData = data.arrApplyList;
        }

        if (isAppend){
            this.updateScrollView(tmpData, index);
        }else{
            this.appendData(tmpData, index);
        }
    },

    _userApplyOp(data){
        if (data.nRlt == 0){
            for (let i = 0; i < this._applyList.length; i++) {
                if (this._applyList[i].nId == data.nId){
                    this._applyList[i].nStatus = 4;
                }
            }
            this.scview1.render_items();
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

    _userNoticeHandle(data){
        if (data.nRlt == 0){
            for (let i = 0; i < this._inviteList.length; i++) {
                if (this._inviteList[i].nId == data.nId){
                    this._inviteList[i].nStatus = data.nOpType;
                }
            }
            this.scview2.render_items();
            this._inviteRedpointCount -= 1;
            this.updateRedPoint();
        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
            }
            if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NO_HANDLE"));
            }

            if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.HAS_HANDLE"));
            }

            if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
            }

            if (data.nRlt == 5){
                UIFrame.showTips(i18n.t("CLUB_ERROR.CLUB_NUM_FULL"));
            }

            if (data.nRlt == 6){
                UIFrame.showTips(i18n.t("CLUB_ERROR.INVITE_LOSE"));
            }

            if (data.nRlt == 7 || data.nRlt == 8 || data.nRlt == 9){
                UIFrame.showTips(i18n.t("CLUB_ERROR.UNKNOW_ERROR"));
            }

            if (data.nRlt == 10){
                UIFrame.showTips(i18n.t("CLUB_ERROR.YOU_HAS_CLUB_MEMBER"));
            }

            if (data.nRlt == 99){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATABASE_ERROR"));
            }
        }
    }
});
