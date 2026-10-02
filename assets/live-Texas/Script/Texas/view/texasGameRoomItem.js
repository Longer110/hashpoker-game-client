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
        mangZhu: cc.Label,
        carry: cc.Label,

        spriteRoomBg: cc.Sprite,
        spriteTitle: cc.Sprite,
        spriteStar: cc.Sprite,

        roomBgs: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "标题列表",
        },

        titles: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "标题列表",
        },

        stars: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "星星列表",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    initRoomItem(control,data){
        cc.log("initRoomItem data:",data);

        this.control = control;
        this._data = data;

        let nRoomId = data.nRoomId;//房间id
        let nSmallCarry = TexasUtils._saveTwoPoint(data.nEnterFloorLimit);//最小携带
        let nBigCarry = TexasUtils._saveTwoPoint(20 * data.nEnterFloorLimit);//最大携带
        let nSmallBlinds = TexasUtils._saveTwoPoint(data.nAnte);//小盲
        let nBigBlinds = TexasUtils._saveTwoPoint(2 * data.nAnte);//大盲

        this.spriteRoomBg.spriteFrame = this.roomBgs[nRoomId];//背景
        this.spriteTitle.spriteFrame = this.titles[nRoomId];//场次标题
        this.spriteStar.spriteFrame = this.stars[nRoomId];//星星

        this.mangZhu.string = nSmallBlinds + "~" + nBigBlinds;//盲注
        this.carry.string = TexasUtils._getText(64) + nSmallCarry + "/" + nBigCarry;//携带
    },

    getRoomId(){
        return this._data.nRoomId;
    },

    onClickItem(event, data){
        this.control.onClickSubSession(this);
    },
});
