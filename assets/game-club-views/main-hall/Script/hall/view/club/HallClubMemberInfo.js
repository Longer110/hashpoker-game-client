// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部成员详细资料
let i18n = require("i18n");
let TAG = "club_memberInfo";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let Base64 = require("base64");
let HallClubCacheData = require("HallClubCacheData");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let UserInfo = require("UserInfo");
let MSG = require("Msg_club");
let HallClubLogic = require("HallClubLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
        label_name: cc.Label,
        label_vip: cc.Label,
        label_ID: cc.Label,
        label_money: cc.Label,
        addCoin: cc.Node,
        recycleCoin: cc.Node,
        kickClub: cc.Node,
        menuPanel: cc.Node,

        record: cc.Prefab,
        contribution: cc.Prefab,
        changeMoney: cc.Prefab,
    },
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        
    },

    // update (dt) {},
    initMemberInfo(data){
        this.label_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        this.label_vip.string = data.nVip || 0;
        this.label_ID.string = "ID:" + data.nUserId;
        this.label_money.string = Utils.convertNumberToStr(data.nClubGold);
        Utils.changeUserHead(this.head, data.sFaceId, app.ClubAssets);
        this._data = data;
        this._clubData = HallClubCacheData.getCurClubData()

        if (data.nUserId == UserInfo.getInfo().nUserID){
            this.kickClub.active = false;
        }

        this.menuPanel.active = true;
        if (HallClubLogic.isClubCreator()){
            return;
        }

        if (HallClubLogic.isClubManager()){
            if (!HallClubLogic.isCanManageMoney()){
                this.addCoin.active = false;
                this.recycleCoin.active = false;
            }
            if (!HallClubLogic.isCanManageMember()){
                this.kickClub.active = false;
            }
        }else{
            this.addCoin.active = false;
            this.recycleCoin.active = false;
            this.kickClub.active = false;
        }

        if(!this.recycleCoin.active && !this.kickClub.active){
            this.menuPanel.active = false;
        }

    },

    onClickClose(){
        this.node.destroy();
    },

    

    onClickItem(event, data){
        let num = Number(data);
        if (num == 1){
            let component = this.addPrefab(this.record, "HallClubGameRecord");
            if(component){
                component.init(this._data);
            }
        }else if (num == 2){
            let component = this.addPrefab(this.contribution, "HallClubContribution");
            if(component){
                component.initInfo(this._data);
            }
        }else if (num == 3){
            let component = this.addPrefab(this.changeMoney, "HallClubChangeMoney");
            if(component){
                let params = {
                    sName: this._data.sName,
                    nVip: this._data.nVip,
                    sConName: this._clubData.tMasterInfo.sName,
                    nClubGold: this._data.nClubGold,
                    sFaceId: this._data.sFaceId,
                    nUserId: this._data.nUserId,
                    sConFaceId: this._clubData.tMasterInfo.sFaceId,
                }
                component.init(params, true, true);
            }
        }else if (num == 4){
            let component = this.addPrefab(this.changeMoney, "HallClubChangeMoney");
            if(component){
                let params = {
                    sName: this._data.sName,
                    nVip: this._data.nVip,
                    sConName:  this._clubData.tMasterInfo.sName,
                    nClubGold: this._data.nClubGold,
                    sFaceId: this._data.sFaceId,
                    nUserId: this._data.nUserId,
                    sConFaceId: this._clubData.tMasterInfo.sFaceId,
        
                }
                component.init(params, false, true);
            }
        }else if (num == 5){
            let str = i18n.t("CLUB_HALL.KICK_OUT");
            let nClubId = HallClubCacheData.getCurLoginClub();
            let params= {
                isOKAndCancel: true,
                callBack: function(isAccept){
                    if (isAccept){
                        let params = {
                            nClubId: nClubId,
                            nTUserId: this._data.nUserId,
                            nType: 3,
                        }
                
                        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSOperateReq_CMD, params);
                    }   
                
                }.bind(this),
                text: str,
            }

            MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
        }
    },

    addPrefab(perfab, componpentName){
        let node = cc.instantiate(perfab);
        this.node.addChild(node, 0, "addChildPrefb");
        let component = node.getComponent(componpentName);
        return component;
    },


    removePrefab(){
        let prefabNode = this.node.getChildByName("addChildPrefb");
        if (prefabNode){
            prefabNode.destroy();
        }
    }

});
