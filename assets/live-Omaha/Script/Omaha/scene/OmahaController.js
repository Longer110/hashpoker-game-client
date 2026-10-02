// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/*
    德州场景控制
*/

let MsgManager = require("MsgManager");
let UserInfo = require("UserInfo");
let MSG = require("Msg_Texas");
let MSG_COMMON = require("Msg");
let CMD = require("protocol_texas");
var ConfigGame = require("ConfigGame");
let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;
let i18n = require("i18n");
let UIFrame = require("UIFrame");
let GameInstance = require("init_game");
let TexasConfig = require("TexasConfig");
let UIDialog = require("UIDialog");
let Utils = require("Utils");
let AppBridge = require("AppBridge");
let TexasUtils = require("TexasUtils");
let TexasData = require("TexasData");
let MSG_HALL = require("Msg_hall");

let TexasSpine = TexasConfig.TEXASSPINE;
let TexasController = require("TexasController");

cc.Class({
    extends: TexasController,

    properties: {
       
        
    },

    onLoad() {
        this._super();
        
    },

    onDestroy() {
        this._super();
    },

    start() {
        this._super();
        
    },

    // update (dt) {},

    onReloadView(){
        this._super();
    },

    //操作权获得通知
    _onRepOperation(data) {
        this._super(data);

        let info = UserInfo.getInfo();
        if (data.hasOwnProperty("tHandCard")) {//自己的手牌(由于延迟看牌原因,可能现在才开底牌)
            let tHandCard = data.tHandCard;
            let arrHoleCards = tHandCard.arrHoleCards;//底牌(2张)
            let nCardType = tHandCard.nCardType;//牌型
            
            TexasData._setSelfCard(arrHoleCards,nCardType);//存储自己手牌、牌型
            
            let selfSeat = this._scene.TexasPlayerController._getSeat("nUserId",info.nUserID);
            if (selfSeat) {
                let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(selfSeat);

                if (texasPlayer) {
                    let cardNum1 = arrHoleCards[0]?arrHoleCards[0]:0;
                    let cardNum2 = arrHoleCards[1]?arrHoleCards[1]:0;
                    let cardNum3 = arrHoleCards[0]?arrHoleCards[2]:0;
                    let cardNum4 = arrHoleCards[1]?arrHoleCards[3]:0;
                    texasPlayer._setCardSprite(cardNum1,cardNum2, cardNum3, cardNum4);
                    texasPlayer.updateCardType(nCardType);
                }
            }
        }

    },

});