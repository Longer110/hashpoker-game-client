// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部未处理申请
let i18n = require("i18n");
let TAG = "club_untreated";
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let HallClubLogic = require("HallClubLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        apply: cc.Prefab, //俱乐部申请
        menuList: {
            default: [],
            type: cc.Node,
        },

        labelList: {
            default: [],
            type: cc.Label,
        }
    },
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.register();
        this.updateUntreatedCount();
        this.initUI();
    },

    register(){
        MsgManager.on(MSG.NOTIFY.ClubSSceneChangeNotify_ui, this._onSceneChangeNotify, this);
    },

    unRegister(){
        MsgManager.un(this._onSceneChangeNotify);
    },

    // update (dt) {},

    onDestroy() {
        this.unRegister();
    },

    onClickClose(){
        this.node.destroy();
    },

    initUI(){
        if (!HallClubLogic.isCanManageMember()){
            this.menuList[2].active = false;
        }else{
            this.menuList[2].active = true;
        }

        if (!HallClubLogic.isCanManageMoney()){
            this.menuList[0].active = false;
            this.menuList[1].active = false;
        }else{
            this.menuList[0].active = true;
            this.menuList[1].active = true;
        }
    },

    updateUntreatedCount(){
        for (let i = 0; i < this.labelList.length; i++) {
            if (this.labelList[i]){
                let count = HallClubLogic.getUnTreatedApplyCount(i+1);
                this.labelList[i].string = count;
                if (count > 99){
                    this.labelList[i].string = "99+";
                }
                if (count == 0){
                    this.labelList[i].node.parent.active = false;
                }else{
                    this.labelList[i].node.parent.active = true;
                }
            }
            
        }
    },

    onClickItem(event, data){
        let num = Number(data);
        this.addPrefab(num);
    },

    addPrefab(index){
        let applyNode = this.node.getChildByName("apply")
        if (applyNode){
            return;
        }
        
        let node = cc.instantiate(this.apply);
        this.node.addChild(node, 0, "apply");
        let component = node.getComponent("HallClubApply");
        if (component){
            component.init(index);
        }
    },

    _onSceneChangeNotify(){
        this.updateUntreatedCount();
        this.initUI();
    }

});
