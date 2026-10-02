// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let TexasUtils = require("TexasUtils");
let TexasData = require("TexasData");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
        box: cc.Node,//选择框
        tableLabel: cc.Label,//牌桌信息
        _table: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onDisable(){
        this.tableLabel.node.stopAllActions();
    },

    // update (dt) {},

    //构建牌桌item
    _createTableItem(control,table) {
        this.control = control;

        this._table = table;

        // this._tableId = tableId;

        let tableId = table.sTableId;
        let sTableName = table.sTableName;

        let curTable = TexasData._getCurTableId();//获得当前牌桌
        this.box.active = tableId==curTable?true:false;
        this.tableLabel.string = Base64.decode(sTableName);

        let color16 = tableId==curTable?"#f8d592":"#9a94ad";

        var color = cc.Color.BLACK;
        let curColor = color.fromHEX(color16);
        this.tableLabel.node.color = new cc.Color(curColor.r,curColor.g,curColor.b);

        this.tableLabel._forceUpdateRenderData();
        let len = this.tableLabel.node.width;
        let width = this.node.width;

        if (len<=117.41) {
            this.tableLabel.node.stopAllActions();
            this.tableLabel.node.anchorX = 0.5;
            this.tableLabel.node.x = 0;
        }else {
            this._setLabel(-width/2,len);
        }
    },

    _setLabel(width,len) {
        let self = this;

        this.tableLabel.node.stopAllActions();

        this.tableLabel.node.anchorX = 0;
        this.tableLabel.node.x = width;

        let speed = parseInt(len/60);
        let labelMove = cc.moveTo(speed, -len - this.node.width, this.tableLabel.node.y);
        
        this.tableLabel.node.runAction(cc.sequence(labelMove,cc.callFunc(function (args) {
            let width = self.node.width;
            self._setLabel(width/2,len);
        })));
    },

    _getTable() {
        return this._table;
    },

    _getTableId() {
        return this._table.sTableId;
    },

    //点击item
    onClickBtnItem() {
        let curTable = TexasData._getCurTableId();//获得当前牌桌

        if (curTable==this._getTableId()) return;

        if (this.control) {
            this.control._onClickBtnChangeTable(this._getTableId());
        }
    },

});
