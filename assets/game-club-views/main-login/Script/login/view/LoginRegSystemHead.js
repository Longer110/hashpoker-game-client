// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UIFrame = require("UIFrame");
let Utils = require("Utils");

let CMD = require("protocol_club");

let UserInfo = require("UserInfo");
cc.Class({
    extends: cc.Component,

    properties: {
        item: cc.Node,
        spHead: cc.Sprite,
        _head: "1",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    init(control, head){
        this._control = control;
        this._head = head;
        // this.spHead = control.head
        this.initCloneHeadItem(head)
        Utils.changeUserHead(this.spHead, this._head);
    },


    initCloneHeadItem(faceId){
        let array = app.UIAtlasClub.atlasUserHead.getSpriteFrames();
       
        array.forEach(element => {
            let clone = cc.instantiate(this.item)
            clone.getComponent(cc.Sprite).spriteFrame = element   
            clone.getChildByName("select").active = (element.name == faceId)
            clone.active = true
            clone.name = element.name
            clone.parent = this.item.parent
            clone.on(cc.Node.EventType.TOUCH_END,this.onClickItem,this);
        });

    },
    
    onClickItem(event,data){
        this._newHead = event.target.name;
        let itemParent = this.item.parent.children
        for (let i = 0; i < itemParent.length; i++) {
            itemParent[i].getChildByName("select").active = false
        }
        event.target.getChildByName("select").active = true
        
        Utils.changeUserHead(this.spHead, this._newHead);
    },

    onLoadMoreStart(){
        this.listView.onLoadMoreFinish();
    },


    onClickClose(){
        this.node.destroy();
    },


    changeUserInfo(data){
        this.changeInfo = data.arrChange;
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeUserInfoReq_CMD, data);
    },

    changeFace(sFaceId){
        let params = {arrChange: []};
        let tmp = {}
        tmp.sKey = "sFaceId";
        tmp.sVal = sFaceId;
        params.arrChange.push(tmp);
        this.changeUserInfo(params)
        UserInfo.setInfo({
            strHeadUrl: sFaceId,
        })
    },
    

    onClickSave(){
        if (this._newHead){
            this.changeFace(this._newHead)
        }
       
        this.onClickClose();
    },

    selectPhonePic(){
        UIFrame.showTips("待接入")
    }
});
