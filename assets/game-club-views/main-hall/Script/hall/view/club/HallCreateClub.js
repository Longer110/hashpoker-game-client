// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//创建俱乐部
let i18n = require("i18n");
let CMD = require("protocol_club");
let UIFrame = require("UIFrame");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
        editBoxClubName: cc.EditBox,
        editBoxPsw: cc.EditBox,
        toggleContainer1: cc.ToggleContainer,
        toggleContainer2: cc.ToggleContainer,
        rightsPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBoxClubName.placeholder = i18n.t("CLUB_HALL.INPUT_CLUB_NAME");
        this.editBoxPsw.placeholder = i18n.t("CLUB_HALL.INPUT_CLUB_PSW");
    },

    // update (dt) {},

    onClickYes(event, data){
        let num = Number(data);
        if (num == 1){
            this.setToggleLabelColor(this.toggleContainer1.node, 0);
        }else{
            this.setToggleLabelColor(this.toggleContainer2.node, 0);
        }
        
    },

    onClickNo(event, data){
        let num = Number(data);
        if (num == 1){
            this.setToggleLabelColor(this.toggleContainer1.node, 1);
        }else{
            this.setToggleLabelColor(this.toggleContainer2.node, 1);
        }
    },

    onClickCreate(){
        let clubName = this.editBoxClubName.string;
        if (clubName == ""){
            UIFrame.showTips(i18n.t("CLUB_HALL_TIP.CREATE_CLUB_TIP"));
            return;
        }

        if (clubName.length < 2 || clubName.length > 10){
            UIFrame.showTips(i18n.t("CLUB_ERROR.CLUB_NAME_LEN"));
            return;
        }


        let stockPsw = this.editBoxPsw.string;
        if (stockPsw == "" || stockPsw.length < 6){
            UIFrame.showTips(i18n.t("CLUB_HALL_TIP.STOCK_PSW"));
            return;
        }

        //否允许搜索 0:允许 1:不允许
        let canSearch = this.toggleContainer1.toggleItems[0].isChecked;
        //是否允许申请加入 0:允许 1:不允许
        let canApply = this.toggleContainer2.toggleItems[0].isChecked;

        let params = {
            sClubName: Base64.encode(clubName),
            nCanSearch: canSearch?0:1,
            nCanApply: canApply?0:1,
            sPassWord: Base64.encode(stockPsw),
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSCreateReq_CMD, params);
    },

    onClickSee(){
        let node = cc.instantiate(this.rightsPrefab);
        this.node.addChild(node);
        let component = node.getComponent("HallClubRights");
        if (component){
            component.init();
        }
    },

    onClickClose(){
        this.node.destroy();
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
    }
});
