
let TAG = "HallMyBill";
let i18n = require("i18n");
let Utils = require("Utils");
let clubGameConfig = require("clubGameConfig");
const UIListCell = require("UIListCell");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let DynamicListView = require("DynamicListView");
let LocalStorage = require("LocalStorage");
let HallClubLogic = require("HallClubLogic");
let UserInfo = require("UserInfo");

let BillTypeEnum = {
    RECHARGE: 0,
    WITHDRAW: 1,
    TRANSFER: 2,
    CONSUME: 3,
}

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
        items: [cc.Prefab],

        noRecord: {
            default: null,
            type: cc.Node    
        },

        _recordList: null,//缓存页面数据对像，0充币，1提币，2转币，3局内消耗，4额外消耗
        _isEnd: null, //结束更多加载,
        _nIdOfStarts: null,//记录页码,

        toggleList: {
            default: [],
            type: cc.Node
        },

        toggle: 0, // 0:充币，1：提币，2：转币，3：局内消耗 , 4:额外消耗

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._recordList = {'0': [], '1': [], '2': [], '3': [] , '4' : []}
        this._nIdOfStarts = {}
        this._isEnd = {}
        this.initList();
    },

    start () {
        this.regiester();
        this.noRecord.active = true
        // this.getRecordList();

        // this.test()
        // this.getBillRecordList(0)
    },

    onDestroy() {
        MsgManager.un(this._onPayInfo);
        MsgManager.un(this._onGoldHistory);
        // MsgManager.un(this._onTrCallback);
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSPayInfoRep_ui, this._onPayInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetGameGoldHistoryRsp_ui, this._onGoldHistory, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetGoldHistoryRsp_ui, this._onGoldHistory, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetBillRecordRsp_ui, this._onGoldHistory, this);

        
        
        // MsgManager.on(MSG.NOTIFY.ClubTransferWayRsp_ui, this._onTrCallback, this);


    },

    initUI(){
        this._config = HallClubLogic.getReConfig(LocalStorage.getSysLanguage()) || {};
    },

    //
    init(data, type) {
        if(type) {
            this.toggle = type
        }
        let pageToggle = this.toggleList[this.toggle]
        if(pageToggle) {
            this.onClickToggle({target: pageToggle})
        }
        if(data) {
            this._onPayInfo(data)
        }else {
            
        }
        
    },

    getRecordList(){
        let params = {
            nType: 2,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPayInfoReq_CMD, params);
    },


    //局内消耗请求
    getRecordConsumeList() {
        let params = {
            nIdOfStart: this._nIdOfStarts['3'] ?  this._nIdOfStarts['3'] : 0,
            nCnt : 12,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetGameGoldHistoryReq_CMD, params);
    }, 



    // 额外消耗
    getOtherRecordList(type) {
        let startIdx = type == 1 ? "4" : "2" 
        
        let params = {
            nIdOfStart: this._nIdOfStarts[startIdx] ? Math.floor(this._nIdOfStarts[startIdx] / 15) : 0,
            nCnt : 15,
            nType : type,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetGoldHistoryReq_CMD, params);
    }, 



    
// message ClubSGetBillRecordReq{
//     optional int32 nIdOfStart=1; //开始查询的id (查询少于该id的记录),第一页查询填0,第二页查询填上一页的最小id
// 	optional int32 nCnt=2;//本页的记录数目 （一次不要超过15条）
//     required int32 nType = 3; // 0 充值 1提现
// }


    // 充币提币请求   // 0 充值 1提现
    getBillRecordList(type) {
        let startIdx = type == 0 ? "0" : "1" 
        let params = {
            nIdOfStart: this._nIdOfStarts[startIdx] ?  this._nIdOfStarts[startIdx] : 0,
            nCnt : 12,
            nType : type,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetBillRecordReq_CMD, params);
    }, 



    _onGoldHistory(data) {
        let arr = data && data.arrRecord ? data.arrRecord : []
        this._setInfo(arr)
    },

    _onPayInfo(data) {
        let arr = data && data.arrPayRecord ? data.arrPayRecord : []
        this._setInfo(arr)
        
    },


    _setInfo(data){
        cc.log(" ---- ====- 充提信息返回  === -- ", data)
        if(this._recordList[this.toggle].length == 0 && data.length == 0){
            this.noRecord.active = true
        }else {
            this.noRecord.active = false
        }
        if (this._recordList[this.toggle].length == 0){
            this.updateScrollView(data);
        }else{
            this.appendData(data);
        }
       
        // this.noRecord.active = this._recordList.length == 0;
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
            item_templates:  [
                { key: "item0", node: cc.instantiate(this.items[0]) },
                { key: "item1", node: cc.instantiate(this.items[0]) },
                { key: "item2", node: cc.instantiate(this.items[1]) },
                { key: "item3", node: cc.instantiate(this.items[3]) },
                { key: "item4", node: cc.instantiate(this.items[1]) },
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

    scroll_to_end_cb(dataArr){
        cc.log('test 滑动到底 ', dataArr)
        if (dataArr.length <= 0 || this._isEnd[this.toggle]) return;
        if(this.toggle == 0) {
            this.getBillRecordList(0)
        }else if(this.toggle == 1) {
            this.getBillRecordList(1)
        }else if(this.toggle == 2) {
            this.getOtherRecordList(0)
        }else if(this.toggle == 3) {
            this.getRecordConsumeList()
        }else if(this.toggle == 4) {
            this.getOtherRecordList(1)
        }

        
        //加载下一页
    },

    initItem(node, data, index){
        let HallMyBillItem = node.getComponent("HallMyBillItem");
        console.log("初始化item ");
        
        HallMyBillItem._setData(data, this.toggle);
    },

    onClickToggle(event){
        this.toggle = Number(event.target.name.slice(-1))
        this._nIdOfStarts[this.toggle] = 0
        for (let index = 0; index < this.toggleList.length; index++) {
            let ativeBo = event.target.name == this.toggleList[index].name
            this.toggleList[index].getChildByName("normal").active = !ativeBo
            this.toggleList[index].getChildByName("checkmark").active = ativeBo
        }
        this.scview.delete_item()
        this.scview.on_scroll_to_top()
        //TODO : 请求数据刷新
        this._recordList[this.toggle] = []
        // this.test(this.toggle + 1)
        if(this.toggle == 0) {
            this.getBillRecordList(0)
        }else if(this.toggle == 1) {
            this.getBillRecordList(1)
        }else if(this.toggle == 2) {
            this.getOtherRecordList(0)
        }else if(this.toggle == 3) {
            this.getRecordConsumeList()
        }else if(this.toggle == 4) {
            this.getOtherRecordList(1)
        }
    },  


    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------", listData);
    
        //设置列表item数据
        this._recordList[this.toggle] = Utils.clone(listData);
        this._nIdOfStarts[this.toggle] = listData[listData.length - 1] ? listData[listData.length - 1].nId : 0
        let dataArr = listData;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: 'item' + String(this.toggle),
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
        if(data.length == 0) {
            //没有更多数据了
            this._isEnd[this.toggle] = true
            return
        }
        for (let i = 0; i < data.length; i++) {
            this._recordList[this.toggle].push(data[i]); 
        }
        let listData = this._recordList[this.toggle]
        this._nIdOfStarts[this.toggle] = listData[listData.length - 1] ? listData[listData.length - 1].nId : 0
        //设置列表item数据
        let dataArr = data;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let newData = {
                key: 'item' + this.toggle,
                data: dataArr[i]
            }
            allData.push(newData);
        }

        let Offset = this.scview.scrollview.getScrollOffset();//记录之前所在的位置
        let x = Offset.x;
        let y = Offset.y;
        
        //设置数据，key为item样式，data为数据
        this.scview.append_data(allData);
        // this.scview.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },


    OnClickClose(){
        this.node.destroy();
    },

    test(nType = 1) {
        let data = {
            nType: nType,
            arrPayRecord: [
                {nPayType:nType,sCreateTime:'20201001 083000',nGoldChange:10030,nAuditStatus:0}
            ]
        }
        let arrPayRecordItem = {nPayType:nType,sCreateTime: '20201001 083000',nGoldChange:10030,nAuditStatus:0}

        for (let index = 0; index < 20; index++) {
            arrPayRecordItem.sCreateTime =  new Date().getTime() + " 09261355";
            data.arrPayRecord.push(arrPayRecordItem)
            
        }


        this._onPayInfo(data)

        
    }
});
