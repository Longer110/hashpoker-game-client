// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部黑名单
let i18n = require("i18n");
let TAG = "club_blacklist";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");
let UserInfo = require("UserInfo");

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

        editBox: cc.EditBox,
        _blackList: [],
        _searchBlackList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this.editBox.placeholder = i18n.t("CLUB_HALL.INPUT_MEMBER_NAME");
        this.editBox.node.on("text-changed", this._onEditTextChanged, this);
        this._clubId = HallClubCacheData.getCurLoginClub();
        this.regiester();
        this.initList();
        this.getBlackList(0);
    },

    // update (dt) {},

    onDestroy() {
       this.unRegiester();
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSBlacklistResp_ui, this._onBlackList, this);
        MsgManager.on(MSG.NOTIFY.ClubSBlacklistSearchResp_ui, this._onBlackListSearch, this);
        MsgManager.on(MSG.NOTIFY.ClubSBlacklistMgrResp_ui, this._onBlackListMgr, this);
    },

    unRegiester(){
        this.scview.destroy();
        MsgManager.un(this._onBlackList);
        MsgManager.un(this._onBlackListSearch);
        MsgManager.un(this._onBlackListMgr);
    },

    onClickClose(){
        this.node.destroy();
    },

    _onEditTextChanged(){
        let str = this.editBox.string;
        if (str == "" && this._isSearch){
            this.scrollview.node.active = true;
            this.scrollview2.node.active = false;
            this.updateScrollView(this._blackList);
            this._isSearch = false;
        }
    },

    getBlackList(startIndex){
        let params = {
            nClubId: this._clubId,
            nIdOfStart: startIndex,
            nCnt: 20,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSBlacklistReq_CMD, params);
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
    item_setter(node, key, data, index) {
        // let item = node.getComponent("HallGameItem");
        // item.initItem(data);
        this.initItem(node, data);

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr){
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getBlackList(this._blackList[this._blackList.length - 1].nId);
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter2(node, key, data, index) {
        // let item = node.getComponent("HallGameItem");
        // item.initItem(data);
        this.initItem(node, data);

        return [node.width, node.height];
    },

    scroll_to_end_cb2(dataArr){
    },

    initItem(node, data){
        let label_name = node.getChildByName("head").getChildByName("label_name").getComponent(cc.Label);
        let label_addTime = node.getChildByName("label_addTime").getComponent(cc.Label);
        let label_operate = node.getChildByName("label_operate").getComponent(cc.Label);
        let img_head = node.getChildByName("head").getChildByName("img_head").getComponent(cc.Sprite);
        Utils.changeUserHead(img_head, data.sFaceId, app.ClubAssets);
        label_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        label_addTime.string = data.sTime;
        label_operate.lang = "CLUB_HALL.REMOVE";

        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(data);
         }.bind(this))

    },

    updateScrollView(listData, isSearch) {
        QYLogs.log(TAG, "----------------updateScrollView---------------",listData);
        //设置列表item数据
        if (!isSearch){
            this._blackList = listData;
            this.sortBlackList()
        }
        
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

    //向列表末端插入新的数据
    appendData(data, isSearch){
        QYLogs.log(TAG, "----------------appendData---------------",data);
        if (!isSearch){
            for (let i = 0; i < data.length; i++) {
                this._blackList.push(data[i]); 
            }

            this.sortBlackList()
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
        QYLogs.log(TAG, "----------------Offset---------------",x,y);
        
        //设置数据，key为item样式，data为数据
        this.scview.append_data(allData);

        // this.scview.scrollview.stopAutoScroll();
        this.scview.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },

    updateScrollView2(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------",listData);
        //设置列表item数据
        this._searchBlackList = listData;
        
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
     
        this.scview2.set_data(allData);
    },

    //向列表末端插入新的数据
    appendData2(data){
        QYLogs.log(TAG, "----------------appendData---------------",data);
        for (let i = 0; i < data.length; i++) {
            this._searchBlackList.push(data[i]); 
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

        let Offset = this.scview2.scrollview.getScrollOffset();//记录之前所在的位置
        let x = Offset.x;
        let y = Offset.y;
        QYLogs.log(TAG, "----------------Offset---------------",x,y);
        
        //设置数据，key为item样式，data为数据
        this.scview2.append_data(allData);

        // this.scview.scrollview.stopAutoScroll();
        this.scview2.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },

    onClickSearch(){
        let str = this.editBox.string;
        if (str == ""){
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_MEMBER_NAME"));
            return;
        }

        let params = {
            str: Base64.encode(str),
            nClubId: this._clubId,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSBlacklistSearchReq_CMD, params);

        this._isSearch = true;
    },

    _onBlackList(data){
        if (data.arrBlacklist.length == 0){
            this._isEnd = true;
            return;
        }

        if (this._blackList.length == 0){
            this.updateScrollView(data.arrBlacklist);
        }else{
            this.appendData(data.arrBlacklist);
        }
    },

    //黑名单搜索返回
    _onBlackListSearch(data){
        if (data.arrBlacklist.length == 0){
            let params = {
                text: i18n.t("CLUB_ERROR.NOT_MEMBER"),
            }
            MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
            return;
        }
        this.scrollview.node.active = false;
        this.scrollview2.node.active = true;
        if (data.nPage == 1){
            this.updateScrollView2(data.arrBlacklist);
        }else{
            this.appendData2(data.arrBlacklist);
        }
        
    },

    //黑名单操作返回（添加和删除)
    _onBlackListMgr(data){
        if (data.nRlt == 0){
            if (data.nOpType == 2){
                for (let i = 0; i < this._blackList.length; i++) {
                    if (data.nUserId == this._blackList[i].nUserId){
                        this._blackList.splice(i, 1);
                        break;
                    }
                    
                }
                for (let i = 0; i < this._searchBlackList.length; i++) {
                    if (data.nUserId == this._searchBlackList[i].nUserId){
                        this._searchBlackList.splice(i, 1);
                        break;
                    }
                    
                }

                if (this.scrollview.node.active){
                    this.updateScrollView(this._blackList);
                }else{
                    this.updateScrollView2(this._searchBlackList);
                }
            }
        }
    },

    onClickItem(data){
        let str = i18n.t("CLUB_HALL.REMOVE_FROM_BLACKLIST");
        let nClubId = HallClubCacheData.getCurLoginClub();
        let params= {
            isOKAndCancel: true,
            callBack: function(isAccept){
                if (isAccept){
                    let params = {
                        nClubId: nClubId,
                        nUserId: data.nUserId,
                        nOpType: 2,
                    }
            
                    app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSBlacklistMgrReq_CMD, params);
                }   
              
            }.bind(this),
            text: str,
        }

        MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
    },

    sortBlackList(){
        this._blackList.sort(function(a, b){
            return a.nId - b.nId;
        })
    }
});
