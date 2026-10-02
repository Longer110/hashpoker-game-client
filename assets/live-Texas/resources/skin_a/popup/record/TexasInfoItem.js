// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let UserInfo = require("UserInfo");
let Utils = require("Utils");
let Base64 = require("base64");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        sIcon: cc.Node,//icon
        sName: cc.Label,//姓名
        sPokers: cc.Node,//扑克
        sBet: cc.Label,//下注
        sProfit: cc.Label,//派彩

        itemPokerPrefab:{//扑克预制
            default: null,
            type: cc.Prefab
        },

        atlasPoker: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    createInfoItem:function(control,data){
        cc.log("createInfoItem data:",data);

        let info = UserInfo.getInfo();

        if (data) {
            this.sName.string = data.sName?Utils.getShortText(Base64.decode(data.sName), 12):"";//昵称

            let color16 = "#e1e2e6";

            if (this.sIcon && TexasUtils._getSkin(["default","b","c","d"])) {
                this.sIcon.active = false;
            }
           
            if (data.nUserId==info.nUserID) {
                color16 = "#d9ba42";

                if (this.sIcon && TexasUtils._getSkin(["default","b","c","d"])) {
                    this.sIcon.active = true;
                }
            }

            var color = cc.Color.BLACK;
            let curColor = color.fromHEX(color16);
            this.sName.node.color = new cc.Color(curColor.r,curColor.g,curColor.b);

            if (data.nBet==null && data.nWin==null) {
                this.sBet.string = "";
                this.sProfit.string = "";
            }else {
                if (control) {
                    control._setConverNumber(this.sBet,data.nBet);//下注
                    control._setConverNumber(this.sProfit,data.nWin,true);//派彩
                }
            }

            this.sPokers.destroyAllChildren();

            let sPokers = data.arrHoleCards;//扑克
            if (sPokers && sPokers.length>0) {
                for (let i=0; i<sPokers.length; i++) {
                    let poker = sPokers[i];

                    let imgCard = TexasUtils._getSkin(["b","c","d"])?"dezhou_back":"dzRecord_Back";
                    if (TexasUtils._getSkin(["default"])){
                        imgCard = "dzRecord_Back"
                    }
                    if (Number(poker)>0) {
                        let x16 = 0x10;
                        let x10 = x16.toString(10);//16进制转10进制
                
                        let point = poker%x10;//点数
                        let flower = parseInt(poker/x10);//花色
    
                        imgCard = TexasUtils._getSkin(["b","c","d"])?"dezhou_" + point + "_" + flower:"dzRecord_" + point + "_" + flower;
                        if (TexasUtils._getSkin(["default"])){
                            imgCard = "dzRecord_" + point + "_" + flower;
                        }
                    
                    }

                    let prefab = cc.instantiate(this.itemPokerPrefab);
                    let imgframe = this.atlasPoker.getSpriteFrame(imgCard);
                    if (imgframe!=null) {
                        prefab.getComponent(cc.Sprite).spriteFrame = imgframe;
                    }

                    this.sPokers.addChild(prefab);
                    prefab.active = true;
                }

            }

        }
        
    },
});
