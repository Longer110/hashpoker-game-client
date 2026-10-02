// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部管理员权限管理
let i18n = require("i18n");
let TAG = "club_adminManage";
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let Base64 = require("base64");
let CMD = require("protocol_club");

cc.Class({
    extends: cc.Component,

    properties: {
        admin_name: cc.Label,//管理员昵称
        toggleList: {
            default: [],
            type: cc.Toggle
        }
        //toggle1: cc.Toggle, //管理牌局
        //toggle2: cc.Toggle, //管理俱乐部币
        //toggle3: cc.Toggle, //管理成员
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
    },

    // update (dt) {},

    init(data){
        this.admin_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        this._clubId = HallClubCacheData.getCurLoginClub();
        this._data = data;
        this.initUI();
    },

    //nPowerType权限类型:1:成员管理权限 2:俱乐部币管理权限 3:开桌管理权限.
    initUI(){
        for (let i = 0; i < this._data.powerList.length; i++) {
            let tmp = this._data.powerList[i];
            let toggle = this.toggleList[tmp.nPowerType - 1];
            let sp_select = toggle.node.getChildByName("sp_select");
            if (tmp.isOpen){
                if (toggle){
                    toggle.isChecked = true;
                    
                    if (sp_select){
                        sp_select.x = 23;
                    }
                }

            }else{
                if (toggle){
                    toggle.isChecked = false;
                }

                if (sp_select){
                    sp_select.x = -23;
                }
            }
            
        }

    },

    onClickClose(){
        this.node.destroy();
    },

    //取消管理员
    onClickCancelAdmin(){
        let params = {
            nClubId: this._clubId,
            nUserId: this._data.nUserId,
            nOpType: 2,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSAdminMgrReq_CMD, params);
    },

    //修改管理员权限
    saveAdminAuthority(){
        let params = {
            nClubId: this._clubId,
            nUserId: this._data.nUserId,
            arrPower: [
                {
                    nPowerType:1,
                    isOpen: this.toggleList[0].isChecked,
                },
                {
                    nPowerType:2,
                    isOpen: this.toggleList[1].isChecked,
                },
                {
                    nPowerType:3,
                    isOpen: this.toggleList[2].isChecked,
                },
            ],
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeAdminPowerReq_CMD, params);
    },

    onClickToggle(event, data){
        let node = event.node;
        let sp_select = node.getChildByName("sp_select");
        if (event.isChecked){
            sp_select.x = 23;
        }else{
            sp_select.x = -23;
        }
    },
});
