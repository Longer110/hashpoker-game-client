// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部邀请
let i18n = require("i18n");
let TAG = "club_invite";
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

        _userList: [],
        _nPage: 1,
        _isEnd: false,
        _clubId: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this.editBox.placeholder = i18n.t("CLUB_HALL.INPUT_MEMBER_NAME");
        this.initList();
        this._clubId = HallClubCacheData.getCurLoginClub();

        MsgManager.on(MSG.NOTIFY.ClubSInviteUserResp_ui, this._onInvite, this);
        MsgManager.on(MSG.NOTIFY.ClubSSearchUserResp_ui, this._onSearchUser, this);
    },

    // update (dt) {},

    onDestroy() {
        this.scview.destroy();
        MsgManager.un(this._onInvite);
        MsgManager.un(this._onSearchUser);
    },

    // update (dt) {},

    init(uiType){
        this._uiType = uiType;
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
        let label_name = node.getChildByName("head").getChildByName("label_name").getComponent(cc.Label);
        let label_time = node.getChildByName("label_time").getComponent(cc.Label);
        let btn_invite = node.getChildByName("btn_invite");
        let label_title = btn_invite.getChildByName("title").getComponent(cc.Label);
        let head = node.getChildByName("head").getChildByName("img_head").getComponent(cc.Sprite);
        label_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        label_time.string = Utils.replaceAll(data.sTime, " ", "\n");
        if (data.nStatus == 0){
            label_title.lang = "CLUB_HALL.INVITE";
        }else if (data.nStatus == 1){
            label_title.lang = "CLUB_HALL.HAS_INVITE";
        }else if (data.nStatus == 2){
            label_title.lang = "CLUB_HALL.APPLY_HAS_ENTER";
        }

        Utils.changeUserHead(head, data.sFaceId, app.ClubAssets);

        btn_invite.off(cc.Node.EventType.TOUCH_END);

        if (data.nStatus != 0){
            return;
        }

        btn_invite.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickInvite(data);
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
        this._userList = listData;
    },

    //向列表末端插入新的数据
    appendData(data){
        QYLogs.log(TAG, "----------------appendData---------------",data);
        for (let i = 0; i < data.length; i++) {
            this._userList.push(data[i]); 
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

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSSearchUserReq_CMD, params);
    },

    onClickInvite(data){
        let params = {
            nClubId: this._clubId,
            nUserId: data.nUserId,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSInviteUserReq_CMD, params);
    },

    _onSearchUser(data){
        if (data.arrUser.length == 0){
            let params = {
                text: i18n.t("CLUB_ERROR.NOT_MEMBER"),
            }
            MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
            return;
        }

        this.scview.clear_items();
        if (data.nPage == 1){
            this.updateScrollView(data.arrUser);
        }else{
            this.appendData(data.arrUser);
        }
        
    },

    _onInvite(data){
        if (data.nRlt == 0 || data.nRlt == 4){
            for (let i = 0; i < this._userList.length; i++) {
                if (this._userList[i].nUserId == data.nUserId){
                    this._userList[i].nStatus = 1;
                }
                
            }

            this.scview.render_items();
        }else if (data.nRlt == 5){
            for (let i = 0; i < this._userList.length; i++) {
                if (this._userList[i].nUserId == data.nUserId){
                    this._userList[i].nStatus = 2;
                }
                
            }
            this.scview.render_items();
        }
    },

   
});
