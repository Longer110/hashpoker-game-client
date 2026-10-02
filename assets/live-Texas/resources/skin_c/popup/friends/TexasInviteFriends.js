// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UIFrame = require("UIFrame");
let Utils = require("Utils");
let DynamicListView = require("DynamicListView");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let TexasData = require("TexasData");
let MsgManager = require("MsgManager");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
        panel1: cc.Node,
        panel2: cc.Node,
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
            type: cc.Node,
        },

        editBox: cc.EditBox,

        _isEnd: true,
        _playerList: [],
        _btnStates: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._playerList = []
        this._btnStates = {}
        if(this.panel1 && this.panel2) {
            this.panel1.active = true
            this.panel2.active = false
        }
    },

    setData(type) {
        if(type == 1) {
            this.onClickToPlayerPanel()
        }
    },

    start () {
        MsgManager.on(MSG.NOTIFY.ClubSOnlineUserRsp_ui, this.onResponseUserList, this);
        this.initList();
    },

    onDestroy() {
        this.scview.destroy();
        MsgManager.un(this.onResponseUserList);
    },

    initList() {
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
    // update (dt) {},

    requestList() {
        let length = this._playerList.length
        let params = {
            nCnt: 12,
            nIdOfStart: length > 0 ? length - 1 : 0,
            str: this.editBox.string ? Base64.encode(this.editBox.string) : '',
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSOnlineUserReq_CMD, params);
    },

    onResponseUserList(data) {
        cc.log('test -=== 邀请在线玩家列表  -== ', data)
        if(data && data.arrUser && data.arrUser.length > 0) {
            if(this._playerList.length > 0) {
                this.appendData(data.arrUser)
            }else {
                this.updateScrollView(data.arrUser)
            }
        }
    },


    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        let state = this._btnStates[index]
        cc.log('test item_setter ', data.nUserId, index, state)

        node.getComponent('TexasInviteFriendsItem').initItem(data, state, index, (index) => {this.onClickItemBtn(index)});

        return [node.width, node.height];
    },


    scroll_to_end_cb(dataArr){
        cc.log('test end cb1', dataArr, this._isEnd)
        if (dataArr.length <= 0 || this._isEnd) return;
        this.requestList()
    },

    
    updateScrollView(listData) {
        QYLogs.log("----------------updateScrollView---------------",listData);
        //设置列表item数据
        this._playerList = Utils.clone(listData);
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
        this.scview.set_data(allData);
        
    },

    //向列表末端插入新的数据
    appendData(data){
        QYLogs.log("----------------appendData---------------",data);
        if(!data || data.length <= 0) {
            this._isEnd = true
            return
        }
        for (let i = 0; i < data.length; i++) {
            this._playerList.push(data[i]); 
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
        QYLogs.log("----------------Offset---------------",x,y);
        
        //设置数据，key为item样式，data为数据
        this.scview.append_data(allData);

        // this.scview.scrollview.stopAutoScroll();
        this.scview.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },

    onClickItemBtn(index) {
        cc.log('test item callback ', index)
        this._btnStates[index] = true
    },

    onClickToPlayerPanel() {
        cc.log('test click panel ')
        this.panel1.active = false
        this.panel2.active = true
        this.deleteAllItem()
        this.requestList()
    },

    //搜索
    onClickSearch() {
        this.deleteAllItem()
        cc.log('test onClickSearch panel ')
        this.requestList()

    },

    deleteAllItem() {
        for (let index = 0; index < this._playerList.length; index++) {
            this.scview.delete_item(index)
        }
        this._playerList = []
    },

    testData() {
        let list = []
        for (let index = 0; index < 50; index++) {
            list.push({name: 'fwefefw', id: index, head: '1'})
        }
        return list
    },

    onClickClose() {
        this.node.destroy();
    }

});
