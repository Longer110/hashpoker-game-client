// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部管理
let i18n = require("i18n");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
        editBoxClubName: cc.EditBox,
        editBoxPsw: cc.EditBox,
        toggleContainer1: cc.ToggleContainer,
        toggleContainer2: cc.ToggleContainer,
        rightsPrefab: cc.Prefab,
        adminPrefab: cc.Prefab,
        modifyPswPrefab: cc.Prefab,

        _clubData: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBoxClubName.placeholder = i18n.t("CLUB_HALL.INPUT_CLUB_NAME");
        this.editBoxPsw.placeholder = i18n.t("CLUB_HALL.INPUT_CLUB_PSW");

        this.initUI();
        this.regiester();
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSChangeInfoResp_ui, this._onChangeInfoCallBack, this);
        MsgManager.on(MSG.NOTIFY.ClubSSceneChangeNotify_ui, this._onSceneChangeNotify, this);
    },

    onDestroy() {
        MsgManager.un(this._onChangeInfoCallBack);
        MsgManager.un(this._onSceneChangeNotify);
    },

    // update (dt) {},

    initUI(){
        this._clubData = HallClubCacheData.getCurClubData();
        if (this._clubData){
            this.editBoxClubName.string = this._clubData.sClubName;
            if (this._clubData.nCanSearch == 1){
                this.toggleContainer1.toggleItems[0].isChecked = false;
                this.toggleContainer1.toggleItems[1].isChecked = true;
                this.setToggleLabelColor(this.toggleContainer1.node, 1);
            }else{
                this.toggleContainer1.toggleItems[0].isChecked = true;
                this.toggleContainer1.toggleItems[1].isChecked = false;
                this.setToggleLabelColor(this.toggleContainer1.node, 0)
            }
            if (this._clubData.nCanApply == 1){
                this.toggleContainer2.toggleItems[0].isChecked = false;
                this.toggleContainer2.toggleItems[1].isChecked = true;
                this.setToggleLabelColor(this.toggleContainer2.node, 1);
            }else{
                this.toggleContainer2.toggleItems[0].isChecked = true;
                this.toggleContainer2.toggleItems[1].isChecked = false;
                this.setToggleLabelColor(this.toggleContainer2.node, 0)
            }
        }
    },

    onClickYes(event, data){
        let num = Number(data);
        if (num == 1){
            this.setToggleLabelColor(this.toggleContainer1.node, 0);
            if (this._clubData.nCanSearch == 1){
                let params = {
                    nClubId: this._clubData.nClubId,
                    arrItem: [
                        {sKey: "nCanSearch", sVal: "0"}
                    ],
                }
    
                this.changeClubInfo(params);
            }
        }else{
            this.setToggleLabelColor(this.toggleContainer2.node, 0);
            if (this._clubData.nCanApply == 1){
                let params = {
                    nClubId: this._clubData.nClubId,
                    arrItem: [
                        {sKey: "nCanApply", sVal: "0"}
                    ],
                }
        
                this.changeClubInfo(params);
            }
        }

        
        
       
    },

    onClickNo(event, data){
        let num = Number(data);
        if (num == 1){
            this.setToggleLabelColor(this.toggleContainer1.node, 1);
            if (this._clubData.nCanSearch == 0){
                let params = {
                    nClubId: this._clubData.nClubId,
                    arrItem: [
                        {sKey: "nCanSearch", sVal: "1"}
                    ],
                }
        
                this.changeClubInfo(params);
            }
        }else{
            this.setToggleLabelColor(this.toggleContainer2.node, 1);
            if (this._clubData.nCanApply == 0){
                let params = {
                    nClubId: this._clubData.nClubId,
                    arrItem: [
                        {sKey: "nCanApply", sVal: "1"}
                    ],
                }
        
                this.changeClubInfo(params);
            }
        }
    },

    onClickCreate(){

    },

    onClickSee(){
        let node = cc.instantiate(this.rightsPrefab);
        this.node.addChild(node);

        let component = node.getComponent("HallClubRights");
        if (component){
            component.init(this._clubData);
        }
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickChange(){
        let str = this.editBoxClubName.string;
        if (str == ""){
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_CLUB_NAME"));
            return;
        }

        if (str == this._clubData.sClubName){
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_CLUB_NAME3"));
            return;
        }

        let params = {
            nClubId: this._clubData.nClubId,
            arrItem: [
                {sKey: "sClubName", sVal: Base64.encode(str)}
            ],
        }

        this.changeClubInfo(params);
    },

    onClickChangePsw(){
        let node = cc.instantiate(this.modifyPswPrefab);
        this.node.addChild(node, 0, "pswPrefab");
        let component = node.getComponent("HallClubModifyStockPsw");
        if (component){
            let callBack = function (data){
                this.changeStockPsw(data);
            }.bind(this)
            component.init(callBack);
        }
    },

    onClickAdmin(){
        let node = cc.instantiate(this.adminPrefab);
        this.node.addChild(node);
       
    },

    setToggleLabelColor(node, index){
        let list = node.children;
        for (let i = 0; i < list.length; i++) {
            let child = list[i];
            let label = child.getChildByName("label");
            if (label){
                if(index == i){
                    let color = new cc.Color(226, 199, 162, 255);
                    label.color = color;
                }else{
                    let color = new cc.Color(230, 229, 242, 255);
                    label.color = color;
                }
                
            }
            
        }
    },

    changeClubInfo(data){
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeInfoReq_CMD, data);
    },

    changeStockPsw(data){
        let params = {
            nClubId: this._clubData.nClubId,
            arrItem: [
                {sKey: "sOldPassWord", sVal: Base64.encode(data.oldPsw)},
                {sKey: "sNewPassWord", sVal: Base64.encode(data.newPsw)},
            ],
        }
        
        this.changeClubInfo(params);
    },

    _onChangeInfoCallBack(data){
        if (data.arrRlt.length > 0){
            let result = data.arrRlt[0];
            if (result.nRlt == 0){
                if (result.sKey == "sPassWord"){
                    let pswNode = this.node.getChildByName("pswPrefab");
                    if (pswNode){
                        pswNode.destroy();
                    }
                }
                
            }else{
                this.initUI();
            }
        }
    },

    _onSceneChangeNotify(){
        this.initUI();
    }
});
