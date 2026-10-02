// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Utils = require("Utils");
let ConfigGame = require("ConfigGame");
let TexasUtils = require("TexasUtils");
let UserInfo = require("UserInfo");
const i18n = require('i18n');
let UIFrame = require("UIFrame"); 
let ListSubGame = require("list_subgame");

cc.Class({
    extends: cc.Component,

    properties: {
        gou: cc.Node,
        box: cc.Node,

        _nConfigId: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    //创建配置item
    _createConfigItem(control,nConfigIdDefault,data) {
        this.control = control;

        if (data) {
            this._nConfigId = data.nConfigId;//配置id
            let nSmallBlind = TexasUtils._saveTwoPoint(data.nSmallBlind);//小盲
            let nBigBlind = TexasUtils._saveTwoPoint(data.nBigBlind);//大盲
            let nTakeInMin = TexasUtils._saveTwoPoint(data.nTakeInMin);//最低带入
            let nTakeInMax = TexasUtils._saveTwoPoint(data.nTakeInMax);//最高带入

            this._setSelected(false);
            if(nConfigIdDefault==this._nConfigId)
            {
                this._setSelected(true);
            }
    
            let num1 = this.box.getChildByName("num1").getComponent(cc.Label);
            let num2 = this.box.getChildByName("num2").getComponent(cc.Label);

            num1.string = nSmallBlind + "/" + nBigBlind;
            num2.string = nTakeInMin + "/" + nTakeInMax;
        }
    },

    //设置选中
    _setSelected(isSelected) {
        this.gou.active = isSelected;
        let color16 = isSelected?"#e9c04d":"#b8b8bf";
        if (TexasUtils._getSkin(["default"])){
            color16 = isSelected?"#e9c04d":"#ffffff";
        }
        var color = cc.Color.BLACK;
        let curColor = color.fromHEX(color16);
        this.box.getChildByName("num1").color = new cc.Color(curColor.r,curColor.g,curColor.b);
        this.box.getChildByName("num2").color = new cc.Color(curColor.r,curColor.g,curColor.b);
    },

    //点击
    onClickConfigItem() {
        if (this.control) {
            this.control._clickToggle(this._nConfigId);
        }

    },


    
});
