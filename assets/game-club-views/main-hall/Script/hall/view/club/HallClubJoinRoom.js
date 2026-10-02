// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let HallClubCacheData = require("HallClubCacheData");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let UIFrame = require("UIFrame");
let Utils = require("Utils");
let DynamicListView = require("DynamicListView");
let TAG = "club_main";
let UserInfo = require("UserInfo");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {

        btn_bg: cc.Node,


        prefabCreateRoom: cc.Prefab,

        _prefabs: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this.init();
        this.register();
    },

    // update (dt) {},

    register(){

    },

    unRegister(){

    },

    onDestroy() {
        this.unRegister();
    },

    onClickBg(){
        this.loadPrefab(null, false);
    },

    init(){

    },


    loadPrefab(data, isAdd){
        let callBack = function(){
            let node = cc.instantiate(this.prefabCreateRoom);
            this.getAddNode().addChild(node);
            let component = node.getComponent("HallCreateGame");
            if (component && component.init){
                component.init(data, isAdd)
            }
        }.bind(this);
        callBack();
        
    },



    getAddNode(){
        return this.node.parent.parent.getChildByName("popup");
    },

    closeUI(){
        this.getAddNode().destroy();
    },







});
