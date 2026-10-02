// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部成员
let i18n = require("i18n");
let TAG = "club_member";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        scrollview1: {
            default: null,
            type: cc.ScrollView,
        }, 
        mask1: {
            default: null,
            type: cc.Node
        },
        itmeContent1: {
            default: null,
            type: cc.Node
        },
        scrollview2: {
            default: null,
            type: cc.ScrollView,
        }, 
        mask2: {
            default: null,
            type: cc.Node
        },
        itmeContent2: {
            default: null,
            type: cc.Node
        },
        item: {
            default: null,
            type: cc.Node
        },
        

        titleLabel: {
            default: null,
            type: cc.Label
        },


        editBox: cc.EditBox,
        prefab: cc.Prefab,
        transferPrefab: cc.Prefab,
        prefabBill: cc.Prefab,
        billBtn: cc.Node,

        _memberList: [],
        _searchList: [],
        _nPage: 1,
        _isEnd: false,
        _clubId: 0,
        _uiType: "",

        _viewNameIndex: 0,//0:成员，1：转账
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this.editBox.placeholder = i18n.t("CLUB_HALL.INPUT_MEMBER_NAME");
        this.editBox.node.on("text-changed", this._onEditTextChanged, this);
        this.initList();
        this._clubId = HallClubCacheData.getCurLoginClub();

        MsgManager.on(MSG.NOTIFY.ClubSMembersResp_ui, this._onMemberList, this);
        MsgManager.on(MSG.NOTIFY.ClubSMemberInfoReq_ui, this._onMemberInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubSSearchMemberResp_ui, this._onSearchMember, this);
        MsgManager.on(MSG.NOTIFY.ClubSOperateResp_ui, this._onOperate, this);
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoChangeNotify_ui, this._onUserInfoChangeNotify, this);

    },

    // update (dt) {},

    onDestroy() {
        this._uiType = "";
        this.scview1.destroy();
        this.scview2.destroy();
        MsgManager.un(this._onMemberList);
        MsgManager.un(this._onMemberInfo);
        MsgManager.un(this._onSearchMember);
        MsgManager.un(this._onOperate);
        MsgManager.un(this._onUserInfoChangeNotify);
    },

    // update (dt) {},

    init(data){
        if (data){
            this._uiType = data.uiType;
        }
        
    },

    openViewByIndex(index){
        this._viewNameIndex = index
        this.titleLabel.string = index == 0 ?  "成员" : "红包"
        this.billBtn.active = index != 0
        this.getMemberList(this._nPage);
    },

    onClickClose(){
        this.node.destroy();
    },

    getMemberList(page){
        let nClubId = this._clubId;
        let params = {
            nClubId: nClubId,
            nCnt: 100,
            nPage: page,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSMembersReq_CMD, params);
    },

    //初始化滚动列表
    initList() {
        QYLogs.log(TAG, "----------------initList---------------");

        //调用构造函数，传入构造参数
        this.scview1 = new DynamicListView({
            scrollview: this.scrollview1,
            mask: this.mask1,
            content: this.itmeContent1,
            item_templates:  [
                { key: "item1", node: cc.instantiate(this.item) },
            ],
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter1,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
            scroll_to_end_cb: this.scroll_to_end_cb1,
        });
        //调用构造函数，传入构造参数
        this.scview2 = new DynamicListView({
            scrollview: this.scrollview2,
            mask: this.mask2,
            content: this.itmeContent2,
            item_templates:  [
                { key: "item1", node: cc.instantiate(this.item) },
            ],
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter2,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
            scroll_to_end_cb: this.scroll_to_end_cb2,
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter1(node, key, data, index) {
        // let item = node.getComponent("HallGameItem");
        // item.initItem(data);
        this.initItem(node, data);

        return [node.width, node.height];
    },
    scroll_to_end_cb1(dataArr){
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getMemberList(this._nPage + 1);
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter2(node, key, data, index) {
        // let item = node.getComponent("HallGameItem");
        // item.initItem(data);
        this.initItem(node, data);

        return [node.width, node.height];
    },

    scroll_to_end_cb2(dataArr){
        if (dataArr.length <= 0 || this._isEnd) return;
        // this.getMemberList(this._nPage + 1);
    },

    initItem(node, data){
        //let label_contribution = node.getChildByName("label_contribution").getComponent(cc.Label);
        let label_identity = node.getChildByName("label_userid").getComponent(cc.Label);
        let label_createtime = node.getChildByName("label_createtime").getComponent(cc.Label);
        //let label_gameNum = node.getChildByName("label_gameNum").getComponent(cc.Label);
        //let label_balance = node.getChildByName("label_balance").getComponent(cc.Label);
        let head = node.getChildByName("head").getChildByName("img_head").getComponent(cc.Sprite);
        let label_name = node.getChildByName("label_name").getComponent(cc.Label);
        label_name.string = Base64.decode(data.sName);
        //label_contribution.string = data.nContribution;
        label_identity.string = `ID:${data.nUserId}`;
        //label_gameNum.string = data.nWeekCount;
        //label_balance.string = Utils.convertNumberToStr(data.nClubGold);

        if (data.nCreateTime && data.nCreateTime.length >= 10){
            label_createtime.string = data.nCreateTime.substring(5, 10).replace('-', '/');
           
        }
        

        Utils.changeUserHead(head, data.sFaceId, app.ClubAssets);

        //如果当前是玩家自己，隐藏转账按钮，同时名字颜色变为绿色
        if (data.nUserId == UserInfo._info.nUserID){
            label_name.node.color = new cc.Color(0, 255, 134);
            node.getChildByName("btn_transfer").active = false;
        }else{
            //转账按钮添加监听
            label_name.node.color = new cc.Color(255, 255, 255);
            node.getChildByName("btn_transfer").active = true;
            //转账按钮添加监听
            let btn = node.getChildByName("btn_transfer").getComponent(cc.Button);
            btn.node.off(cc.Node.EventType.TOUCH_END);
            btn.node.on(cc.Node.EventType.TOUCH_END, function (button) {
                this.onClickTransfer(data);
                btn.node.getComponent("UISound")._onClick()
                // UIFrame.showTips("打开转账界面");
            }.bind(this));
            node.getChildByName("btn_transfer").active  = (this._viewNameIndex == 1)
        }

      
        label_createtime.node.active = (this._viewNameIndex == 0);
        // node.off(cc.Node.EventType.TOUCH_END);

        // node.on(cc.Node.EventType.TOUCH_END, function (button) {
        //     this.onClickItem(data);
        // }.bind(this))

    },

    //点击打开转账界面
    onClickTransfer(Data){
        let node = cc.instantiate(this.transferPrefab);
        this.node.addChild(node,0,"transfer");
        let component = node.getComponent("HallClubTransfer");
        if (component){
            let params = {
                nToUserId: Data.nUserId,
                sToName: Base64.decode(Data.sName),
                sToFaceId: Data.sFaceId,
                nClubId: this._clubId,
                nMaxCount: UserInfo._info.nGold,
                nMyUserId: UserInfo._info.nUserID,
            }
            component.init(params);
        }
    },

    updateScrollView(listData, isSearch) {
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
        if (isSearch){
            this.scview2.set_data(allData);
            this._searchList = listData;
        }else{
            this.scview1.set_data(allData);
            this._memberList = listData;
        }
        
    },

    //向列表末端插入新的数据
    appendData(data, isSearch){
        QYLogs.log(TAG, "----------------appendData---------------",data);
        for (let i = 0; i < data.length; i++) {
            this._memberList.push(data[i]); 
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

        let Offset = this.scview1.scrollview.getScrollOffset();//记录之前所在的位置
        let x = Offset.x;
        let y = Offset.y;
        QYLogs.log(TAG, "----------------Offset---------------",x,y);
        
        //设置数据，key为item样式，data为数据
        this.scview1.append_data(allData);

        // this.scview.scrollview.stopAutoScroll();
        this.scview1.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },

    onClickSearch(){
        let str = this.editBox.string;
        if (str == ""){
            // UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_MEMBER_NAME"));
            return;
        }

        let params = {
            str: Base64.encode(str),
            nClubId: this._clubId,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSSearchMemberReq_CMD, params);
    },

    onClickItem(data){
        if (this._uiType && this._uiType == "admin"){
            this.showAddAdminTip(data);
            return;
        }
        let params = {
            nClubId: this._clubId,
            nUserId: data.nUserId,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSMemberInfoReq_CMD, params);
    },


    _onMemberList(data){
        this._nPage = data.nPage;
        if (data.arrUser.length == 0){
            this._isEnd = true;
            return;
        }

        if (this._uiType && this._uiType == "admin"){
            //俱乐部添加管理员不显示主席和管理员
            for (let i = data.arrUser.length - 1; i >= 0; i--) {
                if (data.arrUser[i].nIdentify == 1 || data.arrUser[i].nIdentify == 10){
                    data.arrUser.splice(i, 1)
                }
                
            }
        }

        //插入自己数据，第一个展示
    //     {
    //     "nUserId": 18000012,
    //     "sFaceId": "1",
    //     "sName": "VklQMDEyNDgxOQ==",
    //     "nSex": 0,
    //     "nClubId": 17,
    //     "sShopAcc": "abc123456",
    //     "nIdentify": 0,
    //     "nContribution": 0,
    //     "nClubGold": 0,
    //     "nWeekCount": 0,
    //     "nGoldContribution": 0,
    //     "nCreateTime": "2025-09-23 06:01:12"
    // },

        let localSelfData = {
            "nUserId": UserInfo._info.nUserID,
            "sFaceId": UserInfo._info.strHeadUrl,
            "sName": UserInfo._info.strNickNameBase64,
            "nSex": UserInfo._info.nSex,
            "nClubId": UserInfo._info.nClubId,
            "sShopAcc": "abc123456",
            "nIdentify": 0,
            "nContribution": 0,
            "nClubGold": 0,
            "nWeekCount": 0,
            "nGoldContribution": 0,
            "nCreateTime": UserInfo._info.nCreateTime
        }

        if (data.nPage == 1){
               // 先移除自己数据
                data.arrUser = data.arrUser.filter(item => item.nUserId !== localSelfData.nUserId);
                data.arrUser.unshift(localSelfData);
            this.updateScrollView(data.arrUser);
        }else{
            // 先移除自己数据
            data.arrUser = data.arrUser.filter(item => item.nUserId !== localSelfData.nUserId);
            this.appendData(data.arrUser);
        }
    },

    _onMemberInfo(data){
        this.scrollview1.node.active = true;
        this.scrollview2.node.active = false;

        if (data.nRlt != 0){
            return;
        }

        let params = {
            sName: data.tUserInfo.sName,
            nVip: data.tUserInfo.nVip,
            nUserId: data.tUserInfo.nUserId,
            nClubGold: data.tUserInfo.nClubGold,
            sFaceId: data.tUserInfo.sFaceId,
        }

        this._memberInfo = params;

        if (this.node.getChildByName("memberInfo")){
            let infoNode = this.node.getChildByName("memberInfo");
            let component = infoNode.getComponent("HallClubMemberInfo");
            if (component){
                component.initMemberInfo(params);
            }
            return;
        }
        let node = cc.instantiate(this.prefab);
        this.node.addChild(node,0,"memberInfo");
        let component = node.getComponent("HallClubMemberInfo");
        if (component){
            component.initMemberInfo(params);
        }
    },

    _onSearchMember(data){
        // if (data.arrUser.length == 0){
        //     let params = {
        //         text: i18n.t("CLUB_ERROR.NOT_MEMBER"),
        //     }
        //     MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
        //     return;
        // }

        this.scrollview1.node.active = false;
        this.scrollview2.node.active = true;
        this.updateScrollView(data.arrUser, true);
        this._isSearch = true;
    },

    showAddAdminTip(data){
        let str = Utils.replaceAll(i18n.t("CLUB_HALL.ADD_ADMIN_TIP"), "XXX", Base64.decode(data.sName)); 
        let params= {
            isOKAndCancel: true,
            callBack: function(isAccept){
                if (isAccept){
                    let params = {
                        nClubId: this._clubId,
                        nUserId: data.nUserId,
                        nOpType: 1,
                    }
            
                    app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSAdminMgrReq_CMD, params);
                }
                
            }.bind(this),
            isUseRichText: true,
            text: str,
        }

        MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
    },

    _onOperate(data){
        if (data.nRlt == 0){
            if (data.nType == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.KICK_OUT_SUCCESS"));
                for (let i = 0; i < this._memberList.length; i++) {
                    if (this._memberList[i].nUserId == data.nTUserId){
                        this._memberList.splice(i, 1);
                        break;
                    }
                    
                }

                let infoNode = this.node.getChildByName("memberInfo");
                if (infoNode){
                    infoNode.destroy();
                }
                this.updateScrollView(this._memberList);
            }else{
                UIFrame.showTips(i18n.t("CLUB_ERROR.OPRATE_SUCCESS"));
                
                if (this._memberInfo.nUserId == data.nTUserId){
                    let count = HallClubCacheData.getChangeClubCount() || 0;
                    if (data.nType == 2){
                        //回收俱乐部币   
                        count = -count;
                    }

                    for (let i = 0; i < this._memberList.length; i++) {
                        if (this._memberList[i].nUserId == data.nTUserId){
                            this._memberList[i].nClubGold = this._memberList[i].nClubGold + count;
                            if (this.scview1){
                                this.scview1.render_items();
                            }
                            break;
                        }
                        
                    }

                    this._memberInfo.nClubGold = this._memberInfo.nClubGold + count;
                    
                    if (this.node.getChildByName("memberInfo")){
                        let infoNode = this.node.getChildByName("memberInfo");
                        let component = infoNode.getComponent("HallClubMemberInfo");
                        if (component){
                            component.initMemberInfo(this._memberInfo);
                            component.removePrefab();
                        }
                        return;
                    }
                }

                HallClubCacheData.setChangeClubCount(0);
                
            }
        }else{
            HallClubCacheData.setChangeClubCount(0);

            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR1"));
            }else if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_CLUB_MEMBER2"));
            }else if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_POWER"));
            }else if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
            }else if (data.nRlt == 5){
                UIFrame.showTips(i18n.t("CLUB_ERROR.LAST_OPERAT"));
            }else if (data.nRlt == 6){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_ENOUGH_CLUB_MONEY3"));
            }else if (data.nRlt == 7){
                UIFrame.showTips(i18n.t("CLUB_ERROR.HASING_GAME"));
            }else if (data.nRlt == 8){
                UIFrame.showTips(i18n.t("CLUB_ERROR.STOCK_PSW_ERROR"));
            }else if (data.nRlt == 9){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
            }else if (data.nRlt == 10){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_POWER"));
            }else if (data.nRlt == 11){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_ENOUGH_CLUB_MONEY2"));
            }else if (data.nRlt == 12){
                UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_CLUB_MONEY"));
            }else if (data.nRlt == 13){
                UIFrame.showTips(i18n.t("CLUB_ERROR.KICK_OUT_ERROR1"));
            }else if (data.nRlt == 14){
                UIFrame.showTips(i18n.t("CLUB_ERROR.KICK_OUT_ERROR2"));
            }else if (data.nRlt == 15){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATABASE_ERROR"));
            }else if (data.nRlt == 16){
                UIFrame.showTips(i18n.t("CLUB_ERROR.KICK_OUT_ERROR3"));
            }
        }
    },

    _onUserInfoChangeNotify(data){
        for (let i = 0; i < this._memberList.length; i++) {
            if (this._memberList[i].nUserId == data.nUserId){
                if (data.hasOwnProperty("nClubGold")){
                    this._memberList[i].nClubGold = data.nClubGold;
                    if (this.node.getChildByName("memberInfo")){
                        let infoNode = this.node.getChildByName("memberInfo");
                        let component = infoNode.getComponent("HallClubMemberInfo");
                        if (component){
                            component.initMemberInfo(this._memberList[i]);
                        }
                        return;
                    }
                }

                if (data.hasOwnProperty("nWeekCount")){
                    this._memberList[i].nWeekCount = data.nWeekCount;
                }

                if (data.hasOwnProperty("nContribution")){
                    this._memberList[i].nContribution = data.nContribution;
                }

                break;
            }
            
        }

        if (this.scview1){
            this.scview1.render_items();
        }
        
    },

    //账单记录
    OnClickToRecord() {
        let prefab = this.prefabBill
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
            node.getComponent('HallMyBill').init(null, 2)
        }
    },

    
    getAddNode() {
        let scene = cc.director.getScene();
        return scene.getChildByName("Canvas").getChildByName("root").getChildByName("popup")
    },

    _onEditTextChanged(){
        let str = this.editBox.string;
        if (str == "" && this._isSearch){
            this.scrollview1.node.active = true;
            this.scrollview2.node.active = false;
            this._isSearch = false;
        }
    },

});
