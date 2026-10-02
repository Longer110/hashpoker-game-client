/*
    德州买入筹码
*/

let CMD = require("protocol_texas");
let TexasUtils = require("TexasUtils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");

cc.Class({
    extends: cc.Component,

    properties: {
        atlasChip:{//筹码
            default:null,
            type:cc.SpriteAtlas,
        },

        chipSpriteFrame: {//光圈
            default: [],
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    _initChip(data) {
        let chipIndex = 0;
        if (TexasUtils._getSkin(["d","b"])) {
            chipIndex = 1;
        }else if (TexasUtils._getSkin(["c","default"])) {
            chipIndex = 2;
        }

        this.node.getComponent(cc.Sprite).spriteFrame = this.chipSpriteFrame[chipIndex];

        if (data) {
            let imgframe = this.atlasChip.getSpriteFrame(data + "");
            if (imgframe!=null) {
                this.node.getComponent(cc.Sprite).spriteFrame = imgframe;
            }
        }
    },

});
