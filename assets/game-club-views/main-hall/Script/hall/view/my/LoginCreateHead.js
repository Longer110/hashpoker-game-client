// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UIFrame = require("UIFrame");
let Utils = require("Utils");

let Base64 = require("base64");
let CMD = require("protocol_club");
let UserInfo = require("UserInfo");
cc.Class({
    extends: cc.Component,

    properties: {
        atlasUserHead: cc.SpriteAtlas,
        item: cc.Node,
        spHead: cc.Sprite,
        _head: "1",
        _sName: "",

        nameEditText: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    init(name, head){
        this._sName = name;
        this._head = head;
        // this.spHead = control.head
        this.nameEditText.string = this._sName
        this.initCloneHeadItem(head)
        Utils.changeUserHead(this.spHead, this._head);
    },


    initCloneHeadItem(faceId){
        let array = this.atlasUserHead.getSpriteFrames();
       
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
        this._head = event.target.name;
        let itemParent = this.item.parent.children
        for (let i = 0; i < itemParent.length; i++) {
            itemParent[i].getChildByName("select").active = false
        }
        event.target.getChildByName("select").active = true
        
        Utils.changeUserHead(this.spHead, this._head);
    },


    onLoadMoreStart(){
        this.listView.onLoadMoreFinish();
    },


    onClickClose(){
        this.node.destroy();
    },


    changeUserInfo(data){
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeUserInfoReq_CMD, data);
    },

    changeFace(sFaceId,strName){
        let params = {arrChange: []};

        if(strName){
            let tmp1 = {}
            tmp1.sKey = "sName";
            tmp1.sVal = Base64.encode(strName);
            params.arrChange.push(tmp1);
        }
       
        if(sFaceId){
            let tmp = {}
            tmp.sKey = "sFaceId";
            tmp.sVal = sFaceId;
            params.arrChange.push(tmp);
        }

        this.changeUserInfo(params)
        UserInfo.setInfo({
            strHeadUrl: sFaceId,
            strNickName: strName,
        })
    },
    

    onClickSave(){
        let  _newName = this.nameEditText.string
        if(_newName.length == 0){
            UIFrame.showTips("请输入昵称");
            return
        }
        this.changeFace(this._head,_newName)
        this.onClickClose();
    },

    selectPhonePic(){
        UIFrame.showTips("待接入")
    }
});
