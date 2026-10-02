// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部库存
let i18n = require("i18n");
let TAG = "club_stock";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");
let HallClubLogic = require("HallClubLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        label_money: cc.Label,
        changPsw: cc.Node,

        historyFLow: cc.Prefab,
        modifyPsw: cc.Prefab,
        recharge: cc.Prefab,
    },
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._clubData = HallClubCacheData.getCurClubData();
        let clubGold = this._clubData.nClubGold;

        if (!HallClubLogic.isClubCreator()){
               this.changPsw.active = false;
        }

        this.updateMoney({nMoney: clubGold});
        this.regiester();
    },

    // update (dt) {},

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSChangeInfoResp_ui, this._onChangeInfoCallBack, this);
    },

    onDestroy() {
        MsgManager.un(this._onChangeInfoCallBack);
    },

    updateMoney(data){
        this.label_money.string = Utils.convertNumberToStr(data.nMoney);
    },

    onClickClose(){
        this.node.destroy();
    },

    

    onClickItem(event, data){
        let num = Number(data);
        if (num == 1){
            let component = this.addPrefab(this.historyFLow, "HallClubHistoryFlow");
            if(component){

            }
        }else if (num == 2){
            let component = this.addPrefab(this.modifyPsw, "HallClubModifyStockPsw");
            if(component){
                let callBack = function (data){
                    this.changeStockPsw(data);
                }.bind(this)
                component.init(callBack);
            }
            
        }else if (num == 3){
           
        }
    },

    addPrefab(perfab, componpentName){
        let node = cc.instantiate(perfab, 0, componpentName);
        this.node.addChild(node);
        let component = node.getComponent(componpentName);
        return component;
    },

    changeStockPsw(data){
        let params = {
            nClubId: this._clubData.nClubId,
            arrItem: [
                {sKey: "sOldPassWord", sVal: Base64.encode(data.oldPsw)},
                {sKey: "sNewPassWord", sVal: Base64.encode(data.newPsw)},
            ],
        }
        
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeInfoReq_CMD, params);
    },

    _onChangeInfoCallBack(data){
        if (data.arrRlt.length > 0){
            let result = data.arrRlt[0];
            if (result.nRlt == 0){
                if (result.sKey == "sPassWord"){
                    let pswNode = this.node.getChildByName("HallClubModifyStockPsw");
                    if (pswNode){
                        pswNode.destroy();
                    }
                }
                
            }
        }
    }

});
