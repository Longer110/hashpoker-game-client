let Base64 = require("base64");
let i18n = require("i18n");
let Utils = require("Utils");
let clubGameConfig = require("clubGameConfig");
const UIListCell = require("UIListCell");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");

cc.Class({
    extends: UIListCell,

    properties: {
        label_mangzhu: cc.Label, //盲注等分数
        gameName: cc.Label, //牌桌游戏名称
        tableName: cc.Label, //牌桌名称
        playerNum: cc.Label, //游戏人数
        label_time: cc.Label, //剩余游戏时间   
        //最小买入
        label_minBuyIn: cc.Label,
        label_type: cc.Label,
        itemBg: cc.Sprite,
        gameIcon: cc.Sprite,
        conditionList: cc.Node,
        inGame: cc.Node,

        playerProgress: cc.ProgressBar,

        playerNumRes: {
            default: [],
            type: cc.SpriteFrame,
        },
        costTypeList: {
            default: [],
            type: cc.Node,
        },

        resource: {
            default: [],
            type: cc.SpriteFrame,
        },

        iconResource: {
            default: [],
            type: cc.SpriteFrame,
        },

        _countdown: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    onInit(data, isUpdateUserNum){
        //{"nOpentime":1748177588,"isAOF":false,"nClubId":17,"nGoldType":1,"isGPSLimit":false,"isOnlyPlayByIOS":false,"nNowCnt":0,"nGameId":125,
        // "nSittedList":{},"nKeepTime":3600,"nBigBlind":2,"nInsureMode":0,"sTableName":"eew","nUseTime":0,"nTableIndex":2,"sTableId":"562#683312B400002",
        // "nLiveUserID":31000020,"isForceBlind":false,"nSmallBlind":1,"isGameing":0,"nTableStatus":1,"nCapacity":2,"nPreAnte":0,"isIPLimit":false}
        // cc.log('HallGameItem ',isUpdateUserNum, JSON.stringify(data))
        data.nNowCnt = 0;
        data.nUseTime = 0;
        if (isUpdateUserNum){
            this.playerNum.string = data.nNowCnt + "/" + data.nCapacity;
            this.playerProgress.progress = data.nNowCnt / data.nCapacity;
            return;
        }

        
        // this.gameName.lang = "HALL_CLUB_GAME_NAME." + data.nGameId;
        let oldTableName = this.tableName.string;
        let gameNameStr = i18n.t("HALL_CLUB_GAME_NAME." + data.nGameId);
        this.tableName.string = ((data.sTableName &&  Base64.decode(data.sTableName)) || "") + "(" + gameNameStr + ")";
        this.playerNum.string = data.nNowCnt + "/" + data.nCapacity;
        this.label_minBuyIn.string = Utils.convertNumberToStr(data.nMinTabkeInBB * (data.nBigBlind || 2*data.nPreAnte));

        this.playerProgress.progress = data.nNowCnt / data.nCapacity;

        if (data.nKeepTime == -1){
            this.label_time.lang = "CLUB_HALL.FOREVER";
        }else{
            let diffTime = data.nKeepTime - data.nUseTime;
            if (diffTime < 0){
                diffTime = 0;
            }
            this.label_time.string = Utils.formatTimeOnlyHMS2(diffTime);
            // if(!isUpdateUserNum && data.nTableStatus != 1) {
            //     this.timeCountdown(diffTime)
            // }else{
            //     if(oldTableName != this.tableName.string) {
            //         if (data.nTableStatus != 1) {
            //             this.timeCountdown(diffTime)
            //         }else{
            //              if (this._countdown) {
            //                 this.unschedule(this._countdown);
            //                 this._countdown = null; // 清空引用
            //             }
            //         }
            //     }
            // }
        }
        let nZhuaTou = 0;
        let zhuaTouStr = "";
        let mangzhuStr = data.nSmallBlind+"/"+ data.nBigBlind;//Utils.showClubTableInfo('', data.nSmallBlind, data.nBigBlind,nZhuaTou, data.nPreAnte, data.preAnteOdd)
        if (data.isForceBlind){
            nZhuaTou = 2*data.nBigBlind; //德州强制盲注
            zhuaTouStr = "/" + nZhuaTou;
        }
        if (data.nPreAnte && data.nPreAnte > 0){
            mangzhuStr = data.nPreAnte+"/"+ 2*data.nPreAnte + zhuaTouStr;
            if(data.nGameId ==clubGameConfig.CLUB_GAME_CONFIG.Texas){
                mangzhuStr = data.nSmallBlind+"/"+ data.nBigBlind + zhuaTouStr + "(" + data.nPreAnte + ")";
            }
        }else{
            mangzhuStr = data.nSmallBlind+"/"+ data.nBigBlind + zhuaTouStr;
        }

        // let mangzhuStr = Utils.showClubTableInfo('', data.nSmallBlind, data.nBigBlind,nZhuaTou, data.nPreAnte, data.preAnteOdd)
        // 根据nZhuaTou和nPreAnte的值构建显示字符串

        this.label_mangzhu.string = mangzhuStr;

        let statusNode = this.itemBg.node.getChildByName("statusNode");
        let insureNode = statusNode.getChildByName("insureNode");
        insureNode.active = data.nInsureMode == 1;
        let privateNode = statusNode.getChildByName("privateNode");
        privateNode.active = data.nIsPerson == 1;
        let gpsNode = statusNode.getChildByName("gpsNode");
        gpsNode.active = data.isGPSLimit;
        
        // app.util.placeLabelsAfterNode(this.label_mangzhu.node, [this.label_time.node], 20);
    },

    setItemSpriteFrame(nGameId){
        // if (nGameId == clubGameConfig.CLUB_GAME_CONFIG.Texas){
        //     this.itemBg.spriteFrame = this.resource[0];
        //     // this.gameIcon.spriteFrame = this.iconResource[0];
        // }
        // if (nGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas){
        //     this.itemBg.spriteFrame = this.resource[1];
        //     // this.gameIcon.spriteFrame = this.iconResource[1];
        // }
        // if (nGameId == clubGameConfig.CLUB_GAME_CONFIG.Omaha){
        //     this.itemBg.spriteFrame = this.resource[2];
        //     // this.gameIcon.spriteFrame = this.iconResource[2];
        // }
        // if (nGameId == clubGameConfig.CLUB_GAME_CONFIG.NiuNiu_QiangZhuang){
        //     this.itemBg.spriteFrame = this.resource[3];
        //     // this.gameIcon.spriteFrame = this.iconResource[3];
        // }
    },

    timeCountdown(time) {
        // if(this._countdown) this.unschedule(this._countdown)
        if (this._countdown) {
            this.unschedule(this._countdown);
            this._countdown = null; // 清空引用
        }

        let count = time
        this._countdown = () => {
            this.label_time.string = Utils.formatTimeOnlyHMS2(count);
            count --
            if(count <= 0){
                this.unschedule(this._countdown)
                this._countdown = null;
            } 
        }
    
        this.schedule(this._countdown, 1)
    },

    setGameCondition(data){
        let AOF = this.conditionList.getChildByName("AOF");
        let IOS = this.conditionList.getChildByName("IOS");
        let Straddle = this.conditionList.getChildByName("Straddle");
        let IP = this.conditionList.getChildByName("IP");
        let GPS = this.conditionList.getChildByName("GPS");

        AOF.active = data.isAOF;
        IOS.active = data.isOnlyPlayByIOS;
        Straddle.active = data.isForceBlind;
        IP.active = data.isIPLimit;
        GPS.active = data.isGPSLimit;
    },

    onRefresh(){
        this.onInit(this.getData(), true);
    },

    onClick(){
        MsgManager.fire(MSG.NOTIFY.CLUB_ENTER_GAME, this.getData());
    },

});
