// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let UIListView = require("UIListView");
let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;

let MttCacheData = require("MttCacheData");
let MSG = require("Msg_club");
let MsgManager = require("MsgManager");


cc.Class({
    extends: cc.Component,
    properties: {
        listView: {
            default: null,
            type: UIListView,
        },
        tips: {
            default: null,
            type: cc.Node,
        },
    },
    //场景显示
    onEnable(){
        cc.log("HallMttMain:onEnable")
        if(clubMtt){
            clubMtt.openMttList();
        }
        this._onResized();
        
        target.on(event.RESIZE, this._onResized, this);

        MsgManager.on(MSG.NOTIFY.MTT_LIST_REFRESH, this.updateData, this);
        MsgManager.on(MSG.NOTIFY.MTT_CANCELSIGNUP, this.showTips, this);
    },
    //场景隐藏
    onDisable(){
        cc.log("HallMttMain:onDisable")
        if(clubMtt){
            clubMtt.closeMttList();
        }

        target.targetOff(this);
        MsgManager.un(this.updateData,this);
        MsgManager.un(this.showTips,this);
    },

    showTips(data){
        this._cancelData = data;
        if(this.tips){
            this.tips.active = true;
        }
    },

    onCancelCallback(){
        if(this.tips){
            this.tips.active = false;
        }
        this._cancelData = null;
    },
    onConfirmCallback(){
        if(this.tips){
            this.tips.active = false;
        }
        if(this._cancelData && clubMtt){
            clubMtt.cancelsignup(this._cancelData.nEventId);
        }
        this._cancelData = null;
    },



    onLoad () {
        if (!this.tableScview){
            this.listView.init(this);
            this.tableScview = true
        }
 
    },
    _onResized() {
        if (this.listView){;
            this.listView.setDirty();
        }
    },

    updateData(){
        this.listView.resetData(MttCacheData.getMttList());
    },

    init(){

    }
});
