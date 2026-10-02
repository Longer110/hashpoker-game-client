// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//输入密码
let i18n = require("i18n");
let TAG = "club_inputPassword";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let HallClubCacheData = require("HallClubCacheData");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        lineList: {
            default: [],
            type: cc.Sprite
        },
        labelList: {
            default: [],
            type: cc.Label
        },

        lineSprite: {
            default: [],
            type: cc.SpriteFrame
        },
        label_title: cc.Label,
        
        cursor: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editBox.placeholder = "";
        this.onClickEditbox();
    },

    // update (dt) {},

    onDestroy() {
    },

    // update (dt) {},

    init(data){
        this._data = data;
        if (data.title){
            this.label_title.string = data.title;
        }
    },

    onEditTextChanged(text, editbox, customEventData){
        let str = this.editBox.string;
        let len = str.length;
        for (let i = 0; i < this.labelList.length; i++) {
            let label = this.labelList[i];
            if (label){
                if (str[i]){
                    label.string = str[i];
                }else{
                    label.string = "";
                }
                
            }

            if (i == len){
                this.cursor.x = label.node.x;
                this.cursor.active = true;
                this.lineList[i].spriteFrame = this.lineSprite[1];
            }else{
                this.lineList[i].spriteFrame = this.lineSprite[0];
            }

            if (this.labelList.length == len){
                this.cursor.active = false;
                this.lineList[i].spriteFrame = this.lineSprite[0];
            }
            
        }
    },

    onEditingDidBegin(){

    },

    onEditDidReturn(){
        this.cursor.active = false;
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickEditbox(){
        this.editBox.focus();
        let str = this.editBox.string;
        let len = str.length;

        if (len != 6){
            this.cursor.active = true;
        }

        this.lineList[len].spriteFrame = this.lineSprite[1];
    },

    onClickSure(){
        let str = this.editBox.string;
        if (str == "" || str.length != 6 || !Number(str)){
            UIFrame.showTips(i18n.t("CLUB_HALL_TIP.STOCK_PSW"));
            return;
        }

        if (this._data && this._data.callBack){
            this._data.callBack(str);
        }

        this.onClickClose();
    }

    
});
