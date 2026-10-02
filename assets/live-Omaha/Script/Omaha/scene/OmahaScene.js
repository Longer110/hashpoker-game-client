/*
    德州场景逻辑
*/

let SceneBase = require("SceneBase");
let CMD = require("protocol_texas");
let Utils = require("Utils");
const i18n = require('i18n'); 
let UserInfo = require("UserInfo");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let TexasConfig = require("TexasConfig");
let TexasUtils = require("TexasUtils");
let UIDialog = require("UIDialog");
let TexasData = require("TexasData");
let AppBridge = require("AppBridge");
var ConfigGame = require("ConfigGame");
let LocalStorage = require("LocalStorage");
let GameInstance = require("init_game");
let UIFrame = require("UIFrame");
let Base64 = require("base64");

let texasSpine = require("texasSpine");
let TexasPaoMa = require("texasPaoMa");
let TexasBuyTip = require("texasBuyTip");
let TexasTableCard = require("TexasTableCard");
let TexasOperatePanel = require("TexasOperatePanel");
let TexasRewardPool = require("TexasRewardPool");
let TexasSettingPanel = require("TexasSettingPanel");
let TexasHelpPanel = require("TexasHelpPanel");
let TexasPlayerController = require("TexasPlayerController");
let TexasMagicFaceController = require("TexasMagicFaceController");
let TexasDialog = require("texasDialog");
let TexasRecordPanel = require("TexasRecordPanel");
let texasMenuDefault = require("texasMenuDefault");
let TexasCardType = require("TexasCardType");
let TexasProcess = require("TexasProcess");
let TexasGameReview = require("TexasGameReview");
let TexasTableStop = require("TexasTableStop");
let TexasInsurePanel = require("TexasInsurePanel");
let TexasTableInfo = require("TexasTableInfo");
let TexasRecordVideo = require("TexasRecordVideo");
let TexasRoomConfigPanel = require("TexasRoomConfigPanel");
let TexasScene = require("TexasScene");

let TexasMusicPath = TexasConfig.TEXASMUSICPATH;
let TexasSpine = TexasConfig.TEXASSPINE;

cc.Class({
    extends: TexasScene,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        this._super();
    },
    onDestroy(){
        this._super();
    },
    
    start () {
        this._super();
    },

    
    onEnable(){
        this._super();
    },
    onDisable(){
        this._super();
    },

    //设置公共牌
    _setCommonCards(arry) {
        if (!arry) return;

        let info = UserInfo.getInfo();


        let seat = this.TexasPlayerController._getSeat("nUserId",info.nUserID);
        let texasPlayer = this.TexasPlayerController._getTexasPlayer(seat);

        if (seat) {
            this.TexasTableCard._InitCommonCards([]);//置灰牌桌公共牌
            
            if (texasPlayer) {
                texasPlayer._setCardGrey(1);
                texasPlayer._setCardGrey(2);
                texasPlayer._setCardGrey(3);
                texasPlayer._setCardGrey(4);

                texasPlayer._setCardLight();

                if (texasPlayer._isPlaying) {
                    this.TexasTableCard._getLightPoker(arry);//牌桌公共牌
                    
                    texasPlayer._lightHandCard(arry);
                }
            }
        }
    },

});