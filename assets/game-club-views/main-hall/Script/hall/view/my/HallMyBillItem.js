// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let Utils = require("Utils");
let i18n = require("i18n");
let Base64 = require("base64")

let UIDialog = require("UIDialog");
let UserInfo = require("UserInfo");
cc.Class({
    extends: cc.Component,

    properties: {

        detailsPrefab: cc.Prefab,

        _data: null,
        _nPayType: 0,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    _setData(data, nPayType) {
        console.log("账单消耗 setData : ", data);
        
        this._data = data;
        this._nPayType = nPayType
        this.initUI(this._data, nPayType);
    },


    
    initUI(data, nPayType) {
        // let sTime = data.sCreateTime.split(" ");
        // sTime[0] = Utils.replaceAll(sTime[0], "-", "/")
        // this.payTime.string = sTime[0] + "   " + sTime[1];
        if(nPayType == 0) this.setPage1UI(this.node)
        else if(nPayType == 1) this.setPage2UI(this.node)
        else if(nPayType == 2 || nPayType == 4 ) this.setPage3UI(this.node)
        else if(nPayType == 3) this.setPage4UI(this.node)
    },

    _getData() {
        return this._data;
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

    //充币
    setPage1UI(target) {
        let bg = target.getChildByName('bg')
        let statusStr = this._data.nStatus == 0 ? "成功" : "处理中";
        let color16 =  this._data.nStatus == 0 ? "#00FF86" : "#65778B";
        this.setLabelColor(bg.getChildByName('goldChange').getComponent(cc.Label),this._data.nAmount,color16)
        this.setLabelColor(bg.getChildByName('payState').getComponent(cc.Label),statusStr,color16)

        let curColor = cc.Color.BLACK.fromHEX(color16);

        bg.getChildByName('payState').getChildByName("point").getChildByName("icon").color = new cc.Color(curColor.r,curColor.g,curColor.b);
        bg.getChildByName('payTime').getComponent(cc.Label).string =  this._data.nCreatetime
    },

    //提币
    setPage2UI(target) {
        this.setPage1UI(target)
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

    // 转币（红包），其他消耗
    setPage3UI(target) {
        let bg = target.getChildByName('bg')
        bg.getChildByName('goldChange').getComponent(cc.Label).string = this._data.nChange
        bg.getChildByName('payState').getComponent(cc.Label).string = this._data.nSourceType == 100008 ? "失败" : "成功"
        let sourceType = {
            1: "注册赠送",
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

        let title = sourceType[this._data.nSourceType]
        bg.getChildByName('payTitle').getComponent(cc.Label).string = title
        bg.getChildByName('payTime').getComponent(cc.Label).string = this._data.sTime
        const nExDataReplace = this._data.nExData.replace(/^"|"$/g, "");
        if (nExDataReplace == ""){
            bg.getChildByName('payHash').getComponent(cc.Label).string = ""
        }else{
            let nExData = JSON.parse(nExDataReplace)
            let zzInfo = this._data.nChange > 0 ?  (nExData.nName + "->" + UserInfo.getInfo().strNickName)  :(UserInfo.getInfo().strNickName + "->" +  nExData.nName)
            bg.getChildByName('payHash').getComponent(cc.Label).string = zzInfo
        }

        bg.getChildByName('copyIcon').active = false
        bg.getChildByName('payHash').active = this._nPayType == 2

    },


    onClickCopyBtn(){
        if(this._data.nExData.length > 0){
            Utils.copyToClipBoard(this._data.nExData)
        }
    },


    // {
    //     "data": {
    //         "arrRecord": [
    //             {
    //                 "nId": 16667,
    //                 "nChange": 30,
    //                 "sTableId": "572#5BB47A25E8",
    //                 "sTableName": "MuS6uuaIvw==",
    //                 "sTime": "2026-01-05 20:53:40",
    //                 "nGameId": 125,
    //                 "nGoldType": 1,
    //                 "sPaiJuId": ""
    //             },
    //             {
    //                 "nId": 16665,
    //                 "nChange": 30,
    //                 "sTableId": "572#5BB47A25E8",
    //                 "sTableName": "MuS6uuaIvw==",
    //                 "sTime": "2026-01-05 20:53:09",
    //                 "nGameId": 125,
    //                 "nGoldType": 1,
    //                 "sPaiJuId": ""
    //             }
    //         ],
    //         "nIdOfStart": 0,
    //         "nAllCnt": 0,
    //         "nStartTime": "",
    //         "nEndTime": ""
    //     },
    //     "msg": "GAME_CLUBCLUBSGETGAMEGOLDHISTORYRSP_CMD",
    //     "mainCmd": 263,
    //     "subCmd": 285,
    //     "packetSize": 162
    // }


//     message GameGoldDetails
// {
//         required int32 nSourceType = 1;        //类型
//         required double nChange = 2;          //变化数额
//         required string sTime = 3;     //记录时间
//     }

    // repeated GameGoldDetails arrDetails=9;   // 牌局消耗明细
    // repeated GameGoldDetails arrFeeDetails=10;   // 增值费消耗名下


    //     {
    //         nSettle =1,     --结算
    //     nFaceChat = 7, --表情聊天
    //     nOpDelay = 8, --延时操作
    //     nLookCard = 9, --看牌操作
    //     nTableTax = 2, --按桌抽水
    //     nHashCheck = 10, --牌局Hash检测
    //     nCall = 11, --跟注
    //     nRaise = 12, --加注
    //     nAllIn = 13, --AllIn
    //     nPreBet = 14, --前注
    //     nSmallBlind = 15, --小盲注
    //     nBigBlind = 16, --大盲注
    //     nZhuaTou = 17, --抓头注
    //     nPoolIn = 18, --底池收入
    //     nInsurBuy = 19, --购买保险花费
    //     nInsurWin = 20, --保险赔付
    //     nLookHands = 21, --看手牌
    //     nCutCard = 22, --切牌
    // }  

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
    setAllDataDeal(list1Data, list2Data){

        let allTotalData = {
            buyValue: 0,
            insureValue: 0,
            settleValue: 0,
            position: "游戏大厅",
            toutoukan: 0,
            fafakan: 0,
            qiepai: 0,
            biaoqing: 0,
            kanpaiyanchi: 0,
            baoxianyanchi: 0,
            haxiyanzheng: 0,

            //额外数据
            exist: {
                buyValue: false,
                insureValue: false,
                settleValue: false,
                toutoukan: false,
                fafakan: false,
                qiepai: false,
                biaoqing: false,
                kanpaiyanchi: false,
                haxiyanzheng: false,
                baoxianyanchi:false
            }
        }
       
        let list2 = Utils.clone(list2Data);
        let list1 = Utils.clone(list1Data).concat(list2);
       
        for (let index = 0; index < list1.length; index++) {
            const item = list1[index];
            if (item.nSourceType == 10000){//买入
                allTotalData.buyValue = Number((allTotalData.buyValue + item.nChange).toFixed(2))
                allTotalData.exist.buyValue = true
            } else if (item.nSourceType == 19 || item.nSourceType == 27519 || item.nSourceType == 20 || item.nSourceType == 22519) { //保险
                allTotalData.insureValue = Number((allTotalData.insureValue + item.nChange).toFixed(2))
                allTotalData.exist.insureValue = true
            } else if (item.nSourceType == 1 || item.nSourceType == 22501 || item.nSourceType == 27501) { //结算
                allTotalData.settleValue = Number((allTotalData.settleValue + item.nChange).toFixed(2))
                allTotalData.exist.settleValue = true
            } else if (item.nSourceType == 21 || item.nSourceType == 22521 || item.nSourceType == 27521) { //偷偷看
                allTotalData.toutoukan = Number((allTotalData.toutoukan + item.nChange).toFixed(2))
                allTotalData.exist.toutoukan = true
            } else if (item.nSourceType == 9 || item.nSourceType == 22509 || item.nSourceType == 27509) {//发发看
                allTotalData.fafakan = Number((allTotalData.fafakan + item.nChange).toFixed(2))
                allTotalData.exist.fafakan = true
            } else if (item.nSourceType == 22 || item.nSourceType == 22522 || item.nSourceType == 27522) {//切牌
                allTotalData.qiepai = Number((allTotalData.qiepai + item.nChange).toFixed(2))
                allTotalData.exist.qiepai = true
            } else if (item.nSourceType == 7 || item.nSourceType == 22507 || item.nSourceType == 27507 || item.nSourceType == 99) {//表情
                allTotalData.biaoqing = Number((allTotalData.biaoqing + item.nChange).toFixed(2))
                allTotalData.exist.biaoqing = true
            } else if (item.nSourceType == 8 || item.nSourceType == 22508 || item.nSourceType == 27508) { //延迟看牌
                allTotalData.kanpaiyanchi = Number((allTotalData.kanpaiyanchi + item.nChange).toFixed(2))
                allTotalData.exist.kanpaiyanchi = true
                // } else if (item.nSourceType == 3) { //保险延迟
                //     allTotalData.baoxianyanchi += item.nChange
            } else if (item.nSourceType == 100009) {//哈希验证
                allTotalData.haxiyanzheng = Number((allTotalData.haxiyanzheng + item.nChange).toFixed(2))
                allTotalData.exist.haxiyanzheng = true
            }
        }
        this._data.allTotalData = allTotalData
        return allTotalData;

    },



    onClickkInsureBtn() {
        let path = "popup/dialog/UIDialog";
        let text = "保险 = 赔偿金-保费\n保险赔偿金是报保险后支付给玩家的,保费是玩家购买保险的支出"
        app.ui.loadPopup(path, function (component) {
            let parent = cc.director.getScene().getChildByName('Canvas')
            parent.addChild(component.node, 1024);
            component.setBtnText(UIDialog.EShowType.OK, '确定');
            component.show(text, () => { }, "提示");
        }.bind(this));
    },


    setLabel4Color(node,value){
        value = Math.floor(value * 100) / 100
        node.getComponent(cc.Label).string = value > 0 ?( "+" + value) : value
        if (value != 0) {
            node.color = value < 0 ? new cc.Color(255, 30, 67) : new cc.Color(3, 255, 133)
        }
    },

    //局内消耗
    setPage4UI(target) {
        console.log("消耗新修改： " , this._data);
        let bg = target.getChildByName('bg')
        let top = bg.getChildByName('top')
        let allData = this.setAllDataDeal(this._data.arrDetails, this._data.arrFeeDetails)
        top.getChildByName('layout').getChildByName('mangzhu').getComponent(cc.Label).string = Utils.showClubTableInfo('', this._data.nSmallBlind, this._data.nBigBlind, this._data.nZhuaTou, this._data.nPreAnte, this._data.preAnteOdd)
        top.getChildByName('layout').getChildByName('gameType').getChildByName('label').getComponent(cc.Label).string = this._data.nGameId == 125 ? "长牌" : "短牌"
        // top.getChildByName('goldChange').color = this._data.nChange < 0 ? new cc.Color(255, 30, 67) : new cc.Color(3, 255, 133) // #FF1E43 #03FF85
        // top.getChildByName('goldChange').getComponent(cc.Label).string = this._data.nChange
        this.setLabel4Color(top.getChildByName('goldChange'), this._data.nChange)

        bg.getChildByName('buyCoin').getChildByName('value').getComponent(cc.Label).string = ("-" + Math.floor(allData.buyValue * 100) / 100)
        bg.getChildByName('insure').getChildByName('value').getComponent(cc.Label).string = allData.insureValue > 0 ? ("+" + Math.floor(allData.insureValue * 100) / 100) : Math.floor(allData.insureValue * 100) / 100 
        let settleValue = allData.settleValue = this._data.nChange + (Number(Math.floor(allData.buyValue * 100).toFixed(2)) / 100) // 结算数据 = 结果-买入
        bg.getChildByName('settle').getChildByName('value').getComponent(cc.Label).string = Math.floor(settleValue * 100) / 100 // settleValue > 0 ? ("+" + Math.floor(settleValue * 100) / 100) : Math.floor(settleValue * 100) / 100
        bg.getChildByName('position').getChildByName('value').getComponent(cc.Label).string = "游戏大厅"
        bg.getChildByName('roomId').getChildByName('value').getComponent(cc.Label).string = this._data.sTableId
        bg.getChildByName('time').getComponent(cc.Label).string = this._data.sTime


        let other = bg.getChildByName('other')
        let otherChange = other.getChildByName("top").getChildByName('goldChange')
        let otherChangeValue = (allData.haxiyanzheng + allData.baoxianyanchi + allData.kanpaiyanchi + allData.biaoqing + allData.qiepai + allData.fafakan + allData.toutoukan)
       
        otherChange.getComponent(cc.Label).string = otherChangeValue


        let otherTTK = other.getChildByName('toutoukan').getChildByName('value')
        otherTTK.parent.active = allData.exist.toutoukan
        otherTTK.getComponent(cc.Label).string = allData.toutoukan

        let otherFFK = other.getChildByName('fafakan').getChildByName('value')
        otherFFK.parent.active = allData.exist.fafakan
        otherFFK.getComponent(cc.Label).string = allData.fafakan

        let otherQP = other.getChildByName('qiepai').getChildByName('value')
        otherQP.parent.active = allData.exist.qiepai
        otherQP.getComponent(cc.Label).string = allData.qiepai

        let otherBQ = other.getChildByName('biaoqing').getChildByName('value')
        otherBQ.parent.active = allData.exist.biaoqing
        otherBQ.getComponent(cc.Label).string = allData.biaoqing


        let otherKPYC = other.getChildByName('kanpaiyanchi').getChildByName('value')
        otherKPYC.parent.active = allData.exist.kanpaiyanchi
        otherKPYC.getComponent(cc.Label).string = allData.kanpaiyanchi 

        let otherBXYC = other.getChildByName('baoxianyanchi').getChildByName('value')
        otherBXYC.parent.active = allData.exist.baoxianyanchi
        otherBXYC.getComponent(cc.Label).string = allData.baoxianyanchi

        let otherHXYZ= other.getChildByName('haxiyanzheng').getChildByName('value')
        otherHXYZ.parent.active = allData.exist.haxiyanzheng
        otherHXYZ.getComponent(cc.Label).string = allData.haxiyanzheng

        other.active = (allData.exist.haxiyanzheng ||
            allData.exist.baoxianyanchi ||
            allData.exist.kanpaiyanchi || 
            allData.exist.biaoqing ||
            allData.exist.qiepai || 
            allData.exist.fafakan || 
            allData.exist.toutoukan)

        let otherLayout = other.getComponent(cc.Layout);
        if (otherLayout) {
            otherLayout.updateLayout();
        }

        let bgLayout = bg.getComponent(cc.Layout);
        if (bgLayout) {
            bgLayout.updateLayout();
        }
        this.node.height = bg.height //同步宽高
        bg.y = bg.height/2

    },



    OnClickItem() {
        if(this._nPayType == 4 ){
            return
        }
        let scene = cc.director.getScene()
        let popup = scene.getChildByName("Canvas").getChildByName("root").getChildByName("popup")
        // 创建详情弹窗
        let node = cc.instantiate(this.detailsPrefab);
        popup.addChild(node, 1024);
        node.getComponent('HallMyBillDetails')?.setData(this._data, this._nPayType)
    },

    setStateView() {
        if(data.nAuditStatus == 0) {

        }
    }
});

