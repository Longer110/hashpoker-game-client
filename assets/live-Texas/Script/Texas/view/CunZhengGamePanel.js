// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let TAG = "CunZhengGamePanel";
let TexasUtils = require("TexasUtils");
let MsgManager = require("MsgManager");
let Utils = require("Utils");
let MSG = require("Msg_Texas");
let CMD = require("protocol_texas");
let UIFrame = require("UIFrame");

let CMDCLUB = require("protocol_club");
let CLUBMSG = require("Msg_club");

let HallClubCacheData = require("HallClubCacheData")
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        playerPos:cc.Node,
        nameLabel:cc.Label,
        bg:cc.Node,
        publicCardNode:cc.Node,
        defaultHeadSprite:cc.SpriteFrame,
        showCardsHashBtn:cc.Node,
        cardhashLabel:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    onDestroy() {
        MsgManager.un(this._onGetClubDeZhouHashCard);
        MsgManager.un(this._onGetClubHistoryDeZhouHashCard);
    },

    init(data, comeType = 1)
    {
        MsgManager.on(MSG.NOTIFY.ClubDeZhouHashCardRsp_ui, this._onGetClubDeZhouHashCard, this);
        MsgManager.on(CLUBMSG.NOTIFY.ClubSHashCardRsp_ui, this._onGetClubHistoryDeZhouHashCard, this);
        

        this.initData = data;
        this.nameLabel.string = data.seed || "未知牌局";
        this.cardhashLabel.string = data.cards + ""
        this._resetPanel();

        this.comeType = comeType;
    },

    _onGetClubDeZhouHashCard(data)
    {
        if(data.nRlt == 1){
            UIFrame.showTips('不在座位上，不能查看牌局序列');
            return
        }
        if(data.nRlt == 2){
            UIFrame.showTips('当前局不允许查看牌序列');
            return
        }
        if(data.nRlt == 3){
            UIFrame.showTips("余额不足，无法查看牌序列");
            return
        }
        if(data.nRlt == 4){
            UIFrame.showTips("查看牌局序列失败");
            return
        }
        cc.log("_onGetClubDeZhouHashCard", data);
        this.showCardsHashBtn.active = false
        this.cardhashLabel.node.active = true
        this._showHashGamePanel(data);
    },

    _onGetClubHistoryDeZhouHashCard(data)
    {
        cc.log("_onGetClubHistoryDeZhouHashCard", data);
        if(data.nRlt == 1){
            UIFrame.showTips('查看牌局序列失败');
            return
        }
        if(data.nRlt == 2){
            UIFrame.showTips("余额不足，无法查看牌序列");
            return
        }

        this.showCardsHashBtn.active = false
        this.cardhashLabel.node.active = true
        this._showHashGamePanel(data);
    },
    
    ///请求当前局牌序列详情
    reqClubDeZhouHashCard(gameId)
    {
        let nStr = "局牌序列";
        let data = {
            sPaiJuId: gameId,
        }
        
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouHashCardReq_CMD, data);
    },

     ///请求历史当前局牌序列详情 
    reqClubHistoryDeZhouHashCard(gameId)
    {
        let params = {
            sPaiJuId: gameId,
            sTableId: this.initData.sTableId,
        }
        
        app.net.send(CMDCLUB.GAME_CLUB.value, CMDCLUB.GAME_CLUB.ClubSHashCardReq_CMD, params);
    },

    //俱乐部牌桌玩家位置
    getClubPlayerPos(num) 
    {
        let arry = [1,2,3,4,5,6,7,8,9];
        if (num==1) {
            arry = [1];
        }else if (num==2) {
            arry = [1,3];
        }else if (num==3) {
            arry = [1,4,7];
        }else if (num==4) {
            arry = [1,3,5,8];
        }else if (num==5) {
            arry = [1,3,5,6,8];
        }else if (num==6) {
            arry = [1,2,4,10,7,9];
        }else if (num==7) {
            arry = [1,2,4,5,6,7,9];
        }else if (num==8) {
            arry = [1,2,3,4,5,7,8,9];
        }
        return arry;
    },

    _showHashGamePanel(data)
    {
        if (data.nDetail == "") return;
        this.bg.getChildByName("verifyText").active = true;
        let players = JSON.parse(data.nDetail);
        cc.log("_showHashGamePanel nDetail", players)

        let playerNum = players.details[3]; //牌局人数
        let bankSeatId = players.details[6] || 0; //庄家座位号
        if (!playerNum || playerNum <= 0) return;

        var playerSeatArry = this.getClubPlayerPos(playerNum);//直播:6人桌; 合集:9人桌
        (playerSeatArry || []).forEach((seatIndex) => {
            this.bg.getChildByName("player_" + seatIndex).active = true;
        });
     
        Object.keys(players.arrUser).forEach(k => {
            const playerData = players.arrUser[k];
            let sitId = playerData.nSitId
            let seatIndex = playerSeatArry[sitId - 1];
            let playerNode = this.bg.getChildByName("player_" + seatIndex);
            playerNode.active = true;
            let defaultHead = playerNode.getChildByName("defaultHead").getComponent(cc.Sprite);
            let seatLabel = playerNode.getChildByName("label").getComponent(cc.Label);
            seatLabel.node.active = true;
            seatLabel.string = sitId + "";
            Utils.changeUserHead(defaultHead, playerData.sFaceId);//玩家头像

            //显示庄家
            if (bankSeatId == sitId) {
                playerNode.getChildByName("bank").active = true;
            }

            if (players.details[playerData.id]) {
                playerNode.getChildByName("card1").active = true;
                playerNode.getChildByName("card2").active = true;
                let card1 = playerNode.getChildByName("card1");
                let card2 = playerNode.getChildByName("card2");
                let cardIds = players.details[playerData.id];
                TexasUtils._getCardType(card1, cardIds[0] || 0 );
                TexasUtils._getCardType(card2, cardIds[1] || 0);
            }
        });

        //显示公共牌
        let publicCardList = players.details[1] || [];
        publicCardList.push(players.details[4] || 0); //补齐转牌
        publicCardList.push(players.details[5] || 0); //补齐河牌
      
        this.publicCardNode.active = true;
        for (let i = 0; i < publicCardList.length; i++) {
            let cardNode = this.publicCardNode.getChildByName("card" + (i + 1));
            cardNode.active = true;
            TexasUtils._getCardType(cardNode, publicCardList[i] || 0);
        }
    },

    _resetPanel()
    {
        for (let i = 1; i <= 10; i++) {
            let playerNode = this.bg.getChildByName("player_" + i);
            playerNode.active = false
            playerNode.getChildByName("label").active = false;
            playerNode.getChildByName("bank").active = false;
            playerNode.getChildByName("defaultHead").getComponent(cc.Sprite).spriteFrame = this.defaultHeadSprite;
            playerNode.getChildByName("card1").active = false;
            playerNode.getChildByName("card2").active = false;
        }
        this.publicCardNode.active = false;
        for (let i = 1; i <= 5; i++) {
            let cardNode = this.publicCardNode.getChildByName("card" + i);
            cardNode.active = false;
        }
        this.bg.getChildByName("verifyText").active = false;
        this.showCardsHashBtn.active = true
        this.cardhashLabel.node.active = false

        
        let coinConfig = HallClubCacheData.getClubCoinConfig()
        this.showCardsHashBtn.getChildByName('text').getComponent(cc.Label).string = this.initData.show == 1 ? '查看牌序列' : ((coinConfig.Hash ? coinConfig.Hash : 0) + ' 查看牌序列')
    },

    onClickCheckGameCards(){
        if (this.comeType == 2)
        {
            this.reqClubHistoryDeZhouHashCard(this.initData.sPaiJuId)
        }
        else
        {
            this.reqClubDeZhouHashCard(this.initData.sPaiJuId);
        }
        
    },

    onClickClose(){ 
        this.node.active = false;
        this.showCardsHashBtn.active = true
        this.cardhashLabel.node.active = false
        MsgManager.un(this._onGetClubDeZhouHashCard);
        MsgManager.un(this._onGetClubHistoryDeZhouHashCard);
    }

    // update (dt) {},
});
