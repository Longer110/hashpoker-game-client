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
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,

        nName: cc.Label,//昵称
        nRound: cc.Label,//局数
        nPool: cc.Label,//入池
        nCarry: cc.Label,//带入
        nProfit: cc.Label,//盈亏

        _nUserId: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    createProcessItem:function(data){

        if(data.isInsure) {
            let insureNode = this.node.getChildByName('instureInfo')
            this.node.getChildByName('processInfo').active = false
            insureNode.active = true
            insureNode.getChildByName('carry').getComponent(cc.Label).string = data.nInsur
            insureNode.getChildByName('profit').getComponent(cc.Label).string = data.nInsurGot
            let color16 = "#E8DFD1";
            if(Number(data.nInsurGot) > 0) {
                color16 = "#00FF86";
            }else if (Number(data.nInsurGot) < 0) {
                color16 = "#EC3856";
            }
            var color = cc.Color.BLACK;
            let curColor = color.fromHEX(color16);
            insureNode.getChildByName('profit').color = new cc.Color(curColor.r,curColor.g,curColor.b);
            return
        }
        this.node.getChildByName('processInfo').active = true
        this.node.getChildByName('instureInfo').active = false
        let info = UserInfo.getInfo();
        
        this._nUserId = data.nUserId;

        this.nName.string = Utils.getShortText(Base64.decode(data.sName), 8);
        this.nRound.string = TexasUtils._saveTwoPoint(data.nPlayCnt);//局数
        this.nPool.string = TexasUtils._saveTwoPoint(data.nPayRate) + "%";//入池
        this.nCarry.string = TexasUtils._saveTwoPoint(data.nTakeIn);//带入
        let bOwner = data.nUserId==info.nUserID;

        this._setScore(data.nProfitSum, data.nStatus);

        this._setGrey(data.nStatus);

        // this.bg.active = bOwner;
    },
    
    _setScore(nProfit, nStatus) {
        this.nProfit.string = Number(nProfit)>0?"+" + TexasUtils._saveTwoPoint(nProfit):TexasUtils._saveTwoPoint(nProfit);

        let color16 = nStatus == 0 ? "#E8DFD1" : "#5A5B5A";
        if(Number(nProfit) > 0) {
            color16 = nStatus == 0 ? "#00FF86" : "#126442";
        }else if (Number(nProfit)<0) {
            color16 = nStatus == 0 ? "#EC3856" : "#5C202E";
        }

        var color = cc.Color.BLACK;
        let curColor = color.fromHEX(color16);
        this.nProfit.node.color = new cc.Color(curColor.r,curColor.g,curColor.b);
    },
    
    _setGrey(nStatus) {
        let w = new cc.Color(232, 223, 209)
        let g = new cc.Color(90, 91, 90)
        if (nStatus == 0){
            this.nName.node.color = w
            this.nRound.node.color = w
            this.nPool.node.color = w
            this.nCarry.node.color = w

        }else{
            this.nName.node.color = g
            this.nRound.node.color = g
            this.nPool.node.color = g
            this.nCarry.node.color = g
        }
    },
    
});
