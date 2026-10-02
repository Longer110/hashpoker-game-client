// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let TexasUtils = require("TexasUtils");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
        nMz: cc.Label,//盲注
        nPeople: cc.Label,//人数
        nGameName: cc.Label,//游戏名
        nTime: cc.Label,//时间
        nTableId: cc.Label,//牌桌id

        _data: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    createTableInfoItem(control,data) {
        this.control = control;

        this._data = data;

        let nSmallBlind = data.nSmallBlind;//小盲
        let nBigBlind = data.nBigBlind;//大盲
        let nNowCnt = data.nNowCnt;//目前人数
        let nCapacity = data.nCapacity;//最大人数

        this.nMz.string = nSmallBlind + "/" + nBigBlind;//盲注
        this.nPeople.string = nNowCnt + "/" + nCapacity;//人数
        this.nGameName.string = TexasUtils._getText(86);//游戏名
        this.nTime.string = Math.floor(data.nUseTime/60) + "m/" + Math.floor(data.nKeepTime/60) + "m";//时间
        this.nTableId.string = Base64.decode(data.sTableName);//牌桌
    },

    _getTableId() {
        return this._data.sTableId;
    },

    onClickBtnList() {
        if (this.control) {
            let table = {
                sTableId: this._getTableId(),
                sTableName: this._data.sTableName,
            }

            this.control._setMenuLayout(table);
        }
    },

});
