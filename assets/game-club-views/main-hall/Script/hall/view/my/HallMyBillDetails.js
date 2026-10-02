// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let Utils = require("Utils");
let i18n = require("i18n");
let DynamicListView = require("DynamicListView");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64")

let UserInfo = require("UserInfo");
cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,    //标题
        pageItems: [cc.Node],   //详情信息页节点
        paijuItem: cc.Node, //局内消息子节点
        paijuScroll: cc.ScrollView,   
        maskNode: cc.Node,
        contentNode: cc.Node,

        tronscanWebView: {
            default: null,
            type: cc.WebView,
        },
        

        _data: null,
        _scview: null,
        _nPayType: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._data = {}
        this.regiester()
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSGetGameGoldDetailRsp_ui, this.setGoldDetail, this);

    },

    onDestroy() {
        MsgManager.un(this.setGoldDetail);
        // MsgManager.un(this._onTrCallback);
    },

    start () {
        this.tronscanWebView.node.active = false

    },

    initList() {
        //调用构造函数，传入构造参数
         //console.log('test initlist ')
        this._scview = new DynamicListView({
            scrollview: this.paijuScroll,
            mask: this.maskNode,
            content: this.contentNode,
            item_templates:  [
                { key: "item1", node: cc.instantiate(this.paijuItem) },
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

    setData(data, nPayType) {
        cc.log('---==== BillDetails === --- ', data)
        if(!data) return

        this._data = data
        this._nPayType = nPayType

        for (let index = 0; index < this.pageItems.length; index++) {
            const element = this.pageItems[index]; 
            if(nPayType == index) {
                element.active = true
                if(index == 0) this.setPage1UI(element)
                else if(index == 1) this.setPage2UI(element)   
                else if(index == 2) this.setPage3UI(element)
                else if(index == 3) this.setPage4UI(element)
            }else {
                element.active = false
            }
        }
    },


    item_setter(node, key, data, index) {
        this.initPage4Item(node, data, index);

        return [node.width, node.height];
    },

    scroll_to_end_cb() {

    },
    
    //局内消耗详情
    getGameGoldDetail() {
        let params = {
            sTableId: this._data.sTableId,
            sPaiJuId: this._data.sPaiJuId,
            nStartTime: this._data.sTime,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetGameGoldDetailReq_CMD, params);
    }, 

    OnClickClose(){
        if(this.tronscanWebView.node.active){
            this.tronscanWebView.node.active = false
        }else{
            this.node.destroy();
        }
    },


    OnClickCopyBtn(event){
        let text = event.target.parent.getComponent(cc.Label).string 
        Utils.copyToClipBoard(text)
    },





        
// message OrderItem
// {
//     required int32 nId = 1;				//记录id(自增全游戏记录唯一id)
//     optional string nOrderId = 2;       //订单号
//     optional string nAmount = 3;        //金额
//     optional string nRealAmount = 4;        //实际金额
//     optional string nFromAddr = 5; 		//付款地址
//     optional string nToAddr = 6;		 //收款地址
//     optional int32 nStatus = 7;        //状态
//     optional string nTxHash = 8;        //哈希
//     optional string fee = 9;            //手续费
//     optional string contract = 10;        //合同
//     optional string nCreatetime = 11;        //创建时间
//     optional string nUpdatetime = 12;        //更新时间
//     optional string nRemark = 13;        //备注
// }
    //充币详情数据
    setPage1UI(target) {
        this.title.string =  '充币详情'
         this.paijuScroll.node.active = false
        let page = this.pageItems[0]
        let amout = page.getChildByName("amount_lb").getComponent(cc.Label)
        let state = page.getChildByName("state_lb").getComponent(cc.Label)
        let  stateStr = this._data.nStatus  == 0 ? "成功" : "处理中"
        let color16 =  this._data.nStatus == 0 ? "#00FF86" : "#65778B";
        this.setLabelColor(state,stateStr,color16)
        this.setLabelColor(amout,this._data.nAmount,color16)
        page.getChildByName('success').active = this._data.nStatus == 0
        page.getChildByName('dealing').active = this._data.nStatus != 0
        page.getChildByName('value2_lb').getComponent(cc.Label).string = "链上充币"
        page.getChildByName('value3_lb').getComponent(cc.Label).string = stateStr
        page.getChildByName('value4_lb').getComponent(cc.Label).string = this._data.nFromAddr

        page.getChildByName('value5_lb').getComponent(cc.Label).string = this._data.nTxHash
        page.getChildByName('value6_lb').getComponent(cc.Label).string = this._data.nCreatetime
        page.getChildByName('value7_lb').getComponent(cc.Label).string =  "-" + this._data.fee
        
    },

    //提币详情数据
    setPage2UI(target) {
        this.title.string = '提币详情'
        this.paijuScroll.node.active = false
        let page = this.pageItems[1]
        let amout = page.getChildByName("amount_lb").getComponent(cc.Label)
        let state = page.getChildByName("value4_lb").getComponent(cc.Label)
        let  stateStr = this._data.nStatus  == 0 ? "成功" : "处理中"
        let color16 =  this._data.nStatus == 0 ? "#00FF86" : "#65778B";
        this.setLabelColor(amout,this._data.nAmount,color16)
        this.setLabelColor(state,stateStr,color16)
        page.getChildByName('success').active = this._data.nStatus == 0
        page.getChildByName('dealing').active = this._data.nStatus != 0
        page.getChildByName('value1_lb').getComponent(cc.Label).string = this._data.nCreatetime
        page.getChildByName('value5_lb').getComponent(cc.Label).string = this._data.nToAddr
        page.getChildByName('value6_lb').getComponent(cc.Label).string = this._data.fee == 0 ? "0" : "-" + this._data.fee
    },

    //转币详情数据
    setPage3UI(target) {
        let sourceType = {
            100004: "人工扣除金币",
            100005: "人工增加金币",
            100009: "区块链验证",
            100010: "充值",
            100011: "提现",
            33006: "俱乐部主动退还",
            33007: "修改昵称",
            33009: "牌局历史发发看",
            33010: "牌局历史偷偷看",
            200001: "兑换码奖励",
            99:     "魔法表情消耗",
            100: "语音收费",
            10095: "活动奖励",
            //德州
            22501: "德州长牌总结算",
            22502: "德州长牌按桌抽水",
            22507: "德州长牌发送表情",
            22508: "德州长牌延时操作",
            22509: "德州长牌发发看",
            22519: "德州长牌购买保险",
            22521: "德州长牌偷偷看",
            22522: "德州长牌切牌",
            //德州短牌
            27501: "德州短牌总结算",
            27502: "德州短牌按桌抽水",
            27507: "德州短牌发送表情",
            27508: "德州短牌延时操作",
            27509: "德州短牌",
            27519: "德州短牌购买保险",
            27521: "德州短牌偷偷看",
            27522: "德州短牌切牌",
            100006 : "红包",
            100007 : "收到玩家转币",
            100008 : "红包"
        }
        this.title.string = '红包详情'
        this.paijuScroll.node.active = false
        let page = this.pageItems[2]

        let isSuccess = this._data.nSourceType == 100008 ? false : true
        page.getChildByName('state_lb').getComponent(cc.Label).string = isSuccess ? "成功" : "失败"
        page.getChildByName('value2_lb').getComponent(cc.Label).string = isSuccess ? "成功" : "失败"
        page.getChildByName("stateIcon").color = isSuccess ? cc.Color.BLACK.fromHEX("#03FF85") : cc.Color.BLACK.fromHEX("#65778B");
        page.getChildByName("state_lb").color = isSuccess ? cc.Color.BLACK.fromHEX("#03FF85") : cc.Color.BLACK.fromHEX("#65778B");

        page.getChildByName("amount_lb").getComponent(cc.Label).string = this._data.nChange
        page.getChildByName("value1_lb").getComponent(cc.Label).string = sourceType[this._data.nSourceType]
        const nExDataReplace = this._data.nExData.replace(/^"|"$/g, "");
        let nExData = {nUserId: ""}
         if (nExDataReplace == ""){
            
        }else{
            nExData = JSON.parse(nExDataReplace)
        }

        let selfUserId = UserInfo.getInfo().nUserID
        let fasongName = this._data.nChange > 0 ? nExData.nUserId : selfUserId
        let jieshouName = this._data.nChange > 0 ?  selfUserId :  nExData.nUserId 
        page.getChildByName("value3_lb").getComponent(cc.Label).string =  fasongName  //发送方
        page.getChildByName("value4_lb").getComponent(cc.Label).string =  jieshouName  //接收方
        page.getChildByName("value7_lb").getComponent(cc.Label).string =  this._data.sTime  //时间
        
    },

    setLabelColor(label, value,color16){
        let curColor = cc.Color.BLACK.fromHEX(color16);
        let color = new cc.Color(curColor.r,curColor.g,curColor.b);
        if(typeof value == "number"){
            if(value == 0){
                label.string = value;
                label.node.color = color;
            }else if (value < 0){
                label.string = value;
                label.node.color = color;
            }else{
                label.string = "+" + value;
                label.node.color = color;
            }
        }else{
            label.node.color = color;
            label.string = value;
        }
        
    },





    setLabel4Color(node, value) {
        value = Math.floor(value * 100) / 100
        node.getComponent(cc.Label).string = value > 0 ? ("+" + value) : value

        if (value != 0){
            node.color = value < 0 ? new cc.Color(255, 30, 67) : new cc.Color(3, 255, 133)
        }
    },
    //局内消耗详情数据
    setPage4UI(target) {
        this.title.string = '消耗'
        
        this.paijuScroll.node.active = true
        let page = this.pageItems[3]
        page.getChildByName("room").getComponent(cc.Label).string = Utils.getShortText(Base64.decode(this._data.sTableName), 20)
        page.getChildByName("roomId").getComponent(cc.Label).string = this._data.sTableId
        page.getChildByName("paiju").getComponent(cc.Label).string = this._data.sPaiJuId
        page.active = true
        
        this.paijuItem.active = false
        let allTotalData = this.groupArrDetails()
        
        console.log("消耗整合数据 ：", allTotalData);
        for (let index = 0; index < allTotalData.length; index++) {
            const itemData = allTotalData[index];
            let itemNode = cc.instantiate(this.paijuItem)
            itemNode.parent = this.contentNode
            itemNode.x = 0
            itemNode.active = true
            
            this.setLabel4Color(itemNode.getChildByName("top").getChildByName("value1_lb"), itemData.allChange)
            // itemNode.getChildByName("top").getChildByName("value1_lb").getComponent(cc.Label).string = itemData.allChange
            itemNode.getChildByName("bottom").getChildByName("time_lb").getComponent(cc.Label).string = itemData.list[0].sTime
            itemNode.getChildByName("bottom").getChildByName("state_lb").getComponent(cc.Label).string = itemData.sourceName
            itemNode.getChildByName("content").active = false

            if (itemData.nSourceType == 1) {
                this.setLabel4Color(itemNode.getChildByName("top").getChildByName("value1_lb"), this._data.allTotalData.settleValue)
                itemNode.getChildByName("top").getChildByName("jt").active = false
                continue
            }
            for (let j = 0; j < itemData.list.length; j++) {
                const listItem = itemData.list[j];
                let timeItem = cc.instantiate(this.paijuItem.getChildByName("timeItem"))
                timeItem.parent = itemNode.getChildByName("content")
                timeItem.x = 0
                timeItem.active = true
                timeItem.getChildByName("time").getComponent(cc.Label).string = listItem.sTime
                // timeItem.getChildByName("value").getComponent(cc.Label).string = listItem.nChange
                this.setLabel4Color(timeItem.getChildByName("value"), listItem.nChange)
            }
            itemNode.on(cc.Node.EventType.TOUCH_END, () => {
                let open = itemNode.getChildByName("content").active
                itemNode.getChildByName("content").active = !open
                itemNode.getChildByName("top").getChildByName("jt").angle = open ? 180 : 0
            })
        }
        // this.initList()
        // this.getGameGoldDetail()

        // this.paijuScroll.node.active = false

    },


    //[
    //   {
    //         "nSourceType": 15,
    //         "sourceName": "小盲注",
    //         "allChange": -1,
    //         "list": [
    //             { "nSourceType": 15, "nChange": -1, "sTime": "2026-01-05 20:52:49" },
    //             { "nSourceType": 15, "nChange": -1, "sTime": "2026-01-05 20:53:19" }
    //         ]
    //     },
    // ]
    // let sourceType = {
    //     100004: "人工扣除金币",
    //     100005: "人工增加金币",
    //     100009: "区块链验证",
    //     100010: "充值",
    //     100011: "提现",
    //     33006: "俱乐部主动退还",
    //     33007: "修改昵称",
    //     33009: "牌局历史发发看",
    //     33010: "牌局历史偷偷看",
    //     200001: "兑换码奖励",
    //     99: "魔法表情消耗",
    //     100: "语音收费",
    //     10095: "活动奖励",
    //     //德州
    //     22501: "德州长牌总结算",
    //     22502: "德州长牌按桌抽水",
    //     22507: "德州长牌发送表情",
    //     22508: "德州长牌延时操作",
    //     22509: "德州长牌发发看",
    //     22519: "德州长牌购买保险",
    //     22521: "德州长牌偷偷看",
    //     22522: "德州长牌切牌",
    //     //德州短牌
    //     27501: "德州短牌总结算",
    //     27502: "德州短牌按桌抽水",
    //     27507: "德州短牌发送表情",
    //     27508: "德州短牌延时操作",
    //     27509: "德州短牌",
    //     27519: "德州短牌购买保险",
    //     27521: "德州短牌偷偷看",
    //     27522: "德州短牌切牌",
    //     100006: "红包",
    //     100007: "收到玩家转币",
    //     100008: "红包"
    // }
    groupArrDetails() {
        const sourceTypeMap = {
            1: "结算",
            7: "发表情",
            8: "延时操作",
            9: "发发看",
            10: "哈希验证",
            // 18: "底池收入",
            19: "保险",     // 19保险  20保险赔付 合并
            21: "偷偷看",
            22: "切牌",
            10000: "买入"
        };
        
        //排序优先级
        const sourceTypeOrder = {
            10000: 1, // 买入
            19: 2,    // 保险
            1: 3      // 结算
        };

        const map = {};
        let arrDetails = this._data.arrDetails.concat(this._data.arrFeeDetails)
        for (const item of arrDetails) {
            let { nSourceType, nChange } = item;

            // 类型归一化
            nSourceType = (nSourceType == 22501 || nSourceType == 27501) ? 1 : nSourceType;
            nSourceType = (nSourceType == 22507 || nSourceType == 27507 || nSourceType == 99) ? 7 : nSourceType;
            nSourceType = (nSourceType == 22508 || nSourceType == 27508) ? 8 : nSourceType;
            nSourceType = (nSourceType == 22509 || nSourceType == 27509) ? 9 : nSourceType;
            nSourceType = (nSourceType == 100009) ? 10 : nSourceType;
            nSourceType = (nSourceType == 20 || nSourceType == 22519 || nSourceType == 27519) ? 19 : nSourceType;
            nSourceType = (nSourceType == 22521 || nSourceType == 27521) ? 21 : nSourceType;
            nSourceType = (nSourceType == 22522 || nSourceType == 27522) ? 22 : nSourceType;


            // 过滤非展示类型
            if (!sourceTypeMap[nSourceType]) continue;

            if (!map[nSourceType]) {
                map[nSourceType] = {
                    nSourceType,
                    sourceName: sourceTypeMap[nSourceType],
                    allChange: 0,   
                    list: [],
                };
            }

            if (nSourceType == 10000){
                map[nSourceType].allChange -= nChange;
            }else{
                map[nSourceType].allChange += nChange;
            }
            map[nSourceType].allChange = Number(map[nSourceType].allChange.toFixed(2)) 
            map[nSourceType].list.push({
                ...item,
                nSourceType,
            });
        }
        for (const key in map) {
            map[key].list.sort(
                (a, b) => new Date(b.sTime) - new Date(a.sTime)
            );
        }

        return Object.values(map).sort((a, b) => {
            const orderA = sourceTypeOrder[a.nSourceType] ?? 99;
            const orderB = sourceTypeOrder[b.nSourceType] ?? 99;

            // ① 先按指定类型排序
            if (orderA !== orderB) {
                return orderA - orderB;
            }

            // ② 其他类型（或相同类型）按时间排序
            return new Date(a.list[0].sTime) - new Date(b.list[0].sTime);
        });
    },



    setGoldDetail(data) {
        if(!data || !data.arrRecord) {
            return
        }
        let dataArr = data.arrRecord;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "item1",
                data: dataArr[i]
            }
            allData.push(Data);
        }
        this._scview.set_data(allData);
    },

    openWebView(_url) {
        if(this.tronscanWebView.url == _url){
            this.tronscanWebView.node.active = true
            return
        }
        this.tronscanWebView.url = _url
        this.tronscanWebView.node.active = true
    },  
    //链上查看
    OnClickToChain() {
        let _url =  "https://tronscan.org/#/transaction/" + this._data.nTxHash
        this.openWebView(_url)
    },
    


    // OnClickCopyText(customData) { 
    //     //transfer 转币，receive 收币，address 地址(充币，提币)，code 编号，hash 交易哈希
    //     if(!customData) return
    //     if(customData == 'transfer') this.copyInfo(this._data.n)
    //     else if(customData == 'receive') this.copyInfo(this._data.n)
    //     else if(customData == 'address') this.copyInfo(this._data.n)
    //     else if(customData == 'code') this.copyInfo(this._data.n)
    //     else if(customData == 'hash') this.copyInfo(this._data.n)
    // },

    // copyInfo(value) {
    //     if(!value) return
    //     Utils.copyToClipBoard(value)
    // },

    setPaijuItem(data) {

    },

    initPage4Item(node, data, index) {
        node.getChildByName('value1_lb').getComponent(cc.Label).string = data.nChange
        node.getChildByName('time_lb').getComponent(cc.Label).string = data.sTime
        node.getChildByName('state_lb').getComponent(cc.Label).string = i18n.t('CLUB_GOLD_CREASON.' + data.nSourceType)
        node.getChildByName('value1_lb').color = data.nChange < 0 ? new cc.Color(255, 30, 67) : new cc.Color(3, 255, 133) // #FF1E43 #03FF85
    },


    // update (dt) {},
});
