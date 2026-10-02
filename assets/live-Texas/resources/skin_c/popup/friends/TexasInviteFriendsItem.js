// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let Utils = require("Utils");
let MsgManager = require("MsgManager");
let Base64 = require("base64");
let TexasData = require("TexasData");

cc.Class({
    extends: cc.Component,

    properties: {
        inviteBtn: cc.Button,
        userName: cc.Label,
        userId: cc.Label,
        headSP: cc.Sprite,
        playStatue: cc.Node,

        _callback: null,
        _itemIndex: null,
        _data: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    initItem(data, state, index, callback) {
        this._itemIndex = index
        this._callback = callback
        this._data = data
        this.userName.string = Utils.getShortText(Base64.decode(data.sName), 12);
        this.userId.string = 'ID:' + data.nUserId
        Utils.changeUserHead(this.headSP, data.sFaceId, app.ClubAssets);
        if(data.nStatus === 1) {
            this.playStatue.color = new cc.Color(0, 255, 134)
            // this.playStatue.active = true
        }else {
            this.playStatue.color = new cc.Color(101, 119, 139)
            // this.playStatue.active = false
        }
        if(state || data.nStatus == 1) {
            this.inviteBtn.enabled = false
            this.inviteBtn.node.color = new cc.Color(88,88,88,255)
        }else {
            this.inviteBtn.enabled = true
            this.inviteBtn.node.color = new cc.Color(255,255,255,255)
        }
    },

    onClickInvite() {
        let CMD = require("protocol_club");
        cc.log('test TODO：发送邀请 ', this._data)
        let gameIds = [125, 126, 175]
        let params = {
            nUserId: this._data.nUserId,//邀请用户的ID
            sTableId: String(TexasData._getCurTableId()),//桌子ID
            nGameId: gameIds[TexasData._getGame() - 1],//游戏ID
            nSmallBlind: TexasData._getSmallBlind(),
            nBigBlind: TexasData._getBigBlind(),
            nZhuaTou: TexasData._getTableInfo().nZhuaTou,
            nPreAnte: TexasData._getTableInfo().nPreAnte,
            nTakeInMin: TexasData._getTableInfo().nBuyMin,
            sTableName: TexasData._getCurTableName(),
            nIsPerson: TexasData._getTableInfo().nIsPerson,
            preAnteOdd: TexasData._getPreAnteOdd()
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSInvitePlayGameReq_CMD, params);

        if(this._callback) {
            this._callback(this._itemIndex)
            this.inviteBtn.enabled = false
            this.inviteBtn.node.color = new cc.Color(119,119,119,255)
        }
    },

    onClickCopy() {
        cc.log('test ---- copy === :', this._data.nUserId)
        Utils.copyToClipBoard(this._data.nUserId)
    },

    // update (dt) {},
});
