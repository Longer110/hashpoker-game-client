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
let AppWebApi = require("AppWebApi");
let Base64 = require("base64");
let LocalStorage = require("LocalStorage");
let ChatMessageMgr = require("ChatMessageMgr");

let HallClubCacheData = require("HallClubCacheData");
let Msg_login = require('Msg_login');
let TopNotificationManager = require("TopNotificationManager");

let TexasSpine = TexasConfig.TEXASSPINE;
let TexasMusicPath = TexasConfig.TEXASMUSICPATH;

cc.Class({
    extends: cc.Component,

    properties: {

        texasDialog: cc.Node,
        TexasRecord: cc.Node,
        TexasSetting: cc.Node,
        TexasHelp: cc.Node,
        TexasRoomConfig: cc.Node,
        texasBuyTip: cc.Node, // 更改为 TexasGameBottomTip  
        texasJingcai: cc.Node,
        texasJingcaiTip: cc.Node,
        _scene: null,
        _blockIndex: 0,
        _chatBubbles: null,
    },

    onLoad() {
        this._chatBubbles = {}
        this._scene = this.getComponent("TexasScene");

        this._setNode();

        let info = UserInfo.getInfo();

        let Msg_club = TexasUtils._getClub() ? require("Msg_club") : null;



        //回放删除，暂时不用。（大厅历史记录，断网重连大厅会导致点游戏进入回放，bug记录）
        let playBackData = TexasUtils._getClubReback();
        if (playBackData || app.config.IS_PLAYBACK) {
            this._isPlayBack = true;
            if (this._scene.panel_bottom) {
                this._scene.panel_bottom.active = false;
            }

            if (TexasUtils._getSkin(["c"]) && this._scene.meunBtn) {
                this._scene.meunBtn.active = false;
            }

            let paijuid = app.url.get("paijuid");
            if (paijuid){
                let userid = app.url.get("userid");
                UserInfo.setInfo({nUserID: userid});
                AppWebApi.getGamePlayBackData({paijuid: paijuid}, function(error,result){
                    let params = JSON.parse(result);
                    if (!error && result){
                        TexasUtils._setClubReback(params.data);
                        this._scene.TexasRecordVideo._startPlay(params.data);
                    }
                }.bind(this))
            }
        }else {
            if (TexasUtils._getSkin(["c"]) && this._scene.backNode) {
                this._scene.backNode.parent.active = false;
            }

            let subData = app.game.getData();

            if(null!=subData){
                let isKeepStand = TexasData._getUserState();
                let data = {
                    nUserId: info.nUserID,//ID
                    sTableId: "",//桌子ID
                    isKeepStand: isKeepStand,//是否保持站立状态 true:是 其它:否
                }

                if (TexasUtils._getSkin(["b"])) {
                    data.nRoomId = subData.nRoomId;
                }else {
                    data.sTableId = subData.sTableId
                }

                this.saveData = data;
            }
            else{
                let data = {
                    nUserId: info.nUserID,//ID
                    sTableId: "",//桌子ID
                    isKeepStand: true,//进房间默认不坐下
                }

                if (TexasUtils._getSkin(["b"])) {
                    data.nRoomId = app.game.getGame().getSubRoomID();
                }else {
                    data.sTableId = GameInstance.getGame().getSubGameTableID();
                }

                this.saveData = data;
            }

            if (this.saveData.sTableId == ""){
                TexasData.isFreeGame(true);
            }
        }

        /****************************************服务器消息****************************************/

        if (Msg_club) {
            MsgManager.on(Msg_club.NOTIFY.ClubSCloseTableNotify_ui, this._onCloseTable, this);//俱乐部关闭牌桌
        }

        let MSG_CHAT = TexasUtils._getClub() ? require("msg_chat") : null;

        MsgManager.on(MSG.Texas.DeZhouLogOnRsp_CMD, this._onRepLogin, this);//登陆回复
        MsgManager.on(MSG.Texas.DeZhouConfigNotify_CMD, this._onRepRoomSetting, this);//房间设置成功通知
        MsgManager.on(MSG.Texas.DeZhouFailNotify_CMD, this._onRepErrorTip, this);//异常提示通知
        MsgManager.on(MSG.Texas.DeZhouGoldNotify_CMD, this._onRepGoldNotify, this);//金币变化通知
        MsgManager.on(MSG.Texas.DeZhouBalanceNotify_CMD, this._onRepUserGoldNotify, this);//有玩家筹码余额发生变化通知
        MsgManager.on(MSG.Texas.DeZhouChatNotify_CMD, this._onRepMagicFace, this);//魔法表情通知
        MsgManager.on(MSG.Texas.DeZhouKickUserRsp_CMD, this._onRepKickOut, this);//踢人回复
        MsgManager.on(MSG.Texas.DeZhouUserSitDownNotify_CMD, this._onRepUserSitDown, this);//有玩家坐下通知
        MsgManager.on(MSG.Texas.DeZhouUserStanpUpNotify_CMD, this._onRepUserStandUp, this);//有玩家从座位上站起通知
        MsgManager.on(MSG.Texas.DeZhouToStartNotify_CMD, this._onRepStartCountDown, this);//开局倒计时通知
        MsgManager.on(MSG.Texas.DeZhouStartNotify_CMD, this._onRepGameStart, this);//游戏开始通知
        MsgManager.on(MSG.Texas.DeZhouOperationNotify_CMD, this._onRepOperation, this);//操作权获得通知
        MsgManager.on(MSG.Texas.DeZhouOpNotify_CMD, this._onRepUserOperate, this);//有玩家操作通知
        MsgManager.on(MSG.Texas.DeZhouPreOpRsp_CMD, this._onRepUserNoOperate, this);//预操作回复
        MsgManager.on(MSG.Texas.DeZhouTakeInRangeRsp_CMD, this._onRepBuyChipLimits, this);//筹码买入范围查看回复
        MsgManager.on(MSG.Texas.DeZhoTakeInRsp_CMD, this._onRepBuyChip, this);//筹码买入回复
        MsgManager.on(MSG.Texas.DeZhouCancelAutoNotify_CMD, this._onRepCancelAuto, this);//有玩家取消托管 通知
        MsgManager.on(MSG.Texas.DeZhouShowCardNotify_CMD, this._onRepUserLightCard, this);//有玩家亮牌通知
        MsgManager.on(MSG.Texas.DeZhouPauseRsp_CMD, this._onRepPause, this);//暂停设置返回
        MsgManager.on(MSG.Texas.DeZhouDealNotify_CMD, this._onRepDealCard, this);//公共牌新增通知
        MsgManager.on(MSG.Texas.DeZhouSettleNotify_CMD, this._onRepSettle, this);//结算通知
        MsgManager.on(MSG.Texas.DeZhouTableResetNotify_CMD, this._onRepReset, this);//桌子重置通知
        MsgManager.on(MSG.Texas.DeZhouBackToLobbyRsp_CMD, this._onBackToLobbyRsp, this);//返回大厅回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouLogOnRsp_CMD, this._onRepLogin, this);//登陆回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouConfigNotify_CMD, this._onRepRoomSetting, this);//房间设置成功通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouUserSitDownNotify_CMD, this._onRepUserSitDown, this);//有玩家坐下通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouUserStanpUpNotify_CMD, this._onRepUserStandUp, this);//有玩家从座位上站起通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouToStartNotify_CMD, this._onRepStartCountDown, this);//开局倒计时通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouStartNotify_CMD, this._onRepGameStart, this);//游戏开始通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouOperationNotify_CMD, this._onRepOperation, this);//操作权获得通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouOpNotify_CMD, this._onRepUserOperate, this);//有玩家操作通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouDealNotify_CMD, this._onRepDealCard, this);//公共牌新增通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouSettleNotify_CMD, this._onRepSettle, this);//结算通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouShowCardNotify_CMD, this._onRepUserLightCard, this);//有玩家亮牌通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouPreOpRsp_CMD, this._onRepUserNoOperate, this);//预操作回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouTakeInRangeRsp_CMD, this._onRepBuyChipLimits, this);//筹码买入范围查看回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhoTakeInRsp_CMD, this._onRepBuyChip, this);//筹码买入回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouCancelAutoNotify_CMD, this._onRepCancelAuto, this);//有玩家取消托管通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouFailNotify_CMD, this._onRepErrorTip, this);//异常提示通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouGoldNotify_CMD, this._onRepGoldNotify, this);//金币变化通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouBalanceNotify_CMD, this._onRepUserGoldNotify, this);//有玩家筹码余额发生变化通知 (主播更改配置后可能发生)
        MsgManager.on(MSG.ClubTexas.ClubDeZhouChatNotify_CMD, this._onRepMagicFace, this);//表情聊天通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouKickUserRsp_CMD, this._onRepKickOut, this);//踢人回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouPauseRsp_CMD, this._onRepPause, this);//暂停设置 返回
        MsgManager.on(MSG.ClubTexas.ClubDeZhouOverViewRsp_CMD, this._onRepProcess, this);//牌桌总览返回
        MsgManager.on(MSG.ClubTexas.ClubDeZhouTableStartNotify_CMD, this._onRepStartGame, this);//房主点击了"开始牌局" 通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouAutoNextNotify_CMD, this._onRepContinueGame, this);//房主点击了"开始游戏" 通知
        MsgManager.on(MSG.ClubTexas.InsurNotify_CMD, this._onRepEnterInsureState, this);//进入保险阶段通知
        MsgManager.on(MSG.ClubTexas.InsurDealNotify_CMD, this._onRepInsureFaPai, this);//保险后发牌通知
        MsgManager.on(MSG.ClubTexas.InsurBuyRsp_CMD, this._onRepInsureBuy, this);//保险购买回复
        MsgManager.on(MSG.ClubTexas.DelayRsp_CMD, this._onRepDelayed, this);//延时回复
        MsgManager.on(MSG.ClubTexas.DelayNotify_CMD, this._onRepUserDelayed, this);//有人延时成功通知
        MsgManager.on(MSG.ClubTexas.HeadInfoRsp_CMD, this._onRepUserInfo, this);//头像信息回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouChatNotify_CMD, this._onRepMagicFace, this);//表情聊天通知

        // MsgManager.on(MSG.ClubTexas.ClubDeZhouTakeOutRangeRsp_CMD, this._onRepCarryChipLimits, this);//筹码带出范围查看回复
        // MsgManager.on(MSG.ClubTexas.ClubDeZhoTakeOutRsp_CMD, this._onRepCarryChip, this);//筹码带出回复

        MsgManager.on(MSG.ClubTexas.ClubDeZhouRetainRsp_CMD, this._onRepOccupiedOrBackSeat, this);//'留座离桌'或'回到座位' 回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouRetainNotify_CMD, this._onRepOccupiedOrBackSeatNotify, this);//'留座离桌'或'回到座位' 生效通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouTableResetNotify_CMD, this._onRepReset, this);//桌子重置通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouBackToLobbyRsp_CMD, this._onBackToLobbyRsp, this);//返回大厅回复
        MsgManager.on(MSG.ClubTexas.WinRateNotify_CMD, this._onWinRateNotify, this);//通知胜率
        MsgManager.on(MSG.ClubTexas.ElapsedStatusNotify_CMD, this._onElapsedStatusNotify, this);//桌子计时状态变化 通知
        MsgManager.on(MSG.ClubTexas.ElapWarnNotify_CMD, this._onElapWarnNotify, this);//桌子剩余时间 警告
        MsgManager.on(MSG.ClubTexas.ClubDeZhouHashListRsp_CMD, this._onClubDeZhouHashListRsp, this);//俱乐部洗牌凭证列表
        MsgManager.on(MSG.ClubTexas.ClubDeZhouHashCardRsp_CMD, this._onClubDeZhouHashCardRsp, this);//俱乐部局牌序列详情
        MsgManager.on(MSG.ClubTexas.ClubDeZhouUserStaticRsp_CMD, this._onClubDeZhouUserStaticRsp, this);//牌局结算结果

        //mtt比赛
        MsgManager.on(MSG.ClubTexas.ClubDeZhouMInfoNotify_CMD, this._onMInfoNotify, this);//比赛信息变化 通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouTbChangeNotify_CMD, this._onTbChangeNotify, this);//换桌 通知  <可请求触发，或自动触发>
        MsgManager.on(MSG.ClubTexas.ClubDeZhouOustNotify_CMD, this._onOutsNotify, this);//排名 通知  <被淘汰或最后获胜时触发>
        MsgManager.on(MSG.ClubTexas.ClubDeZhouRANotify_CMD, this._onRANotify, this);//重(增)购窗口打开 通知  <可请求打开，或自动弹出>
        MsgManager.on(MSG.ClubTexas.ClubDeZhouRARsp_CMD, this._onRABuyChip, this);//重(增)购 返回
        MsgManager.on("MTT_STARTNOTIFY", this._onMttMatchWaitStartNotify, this);//俱乐部大厅通知Mtt比赛即将开始

        //MsgManager.on(MSG.Texas.DeZhouGuessCardNotify_CMD, this._onGuessCardNotify, this);//旁观猜牌 通知

        // //从服登陆返回
        MsgManager.on(MSG.LiveSlave.LiveSlaveLogOnRsp_CMD, this._onSlaveLogOnRsp, this);//从服登陆返回
        // MsgManager.on(MSG.LiveSlave.LiveSlaveLogoutRsp_CMD, this._onSlaveLogoutOnRsp, this);//从服离开返回
        MsgManager.on(MSG.LiveSlave.LiveSlaveGuessCardNotify_CMD, this._onGuessCardNotify, this);//旁观猜牌 通知
        MsgManager.on(MSG.LiveSlave.LiveSlaveGuessCardRsp_CMD, this._onGuessCardRsp, this);//旁观猜牌 回复  答对才有

        /****************************************本地消息****************************************/
        MsgManager.on(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, this._onRepWindow, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW, this._onRepSaveWindow, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_SHOW_ROOM_CONFIG, this._onRepShowRoomConfig, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_GAME_REQ, this._onRepGameReq, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_POKERS, this._onRepPokers, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_GAME_BG, this._onRepGameBg, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_VIDEO_INIT, this._onRepSceneInit, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_VIDEO_SCENE_RECONNECT, this._onRepSceneConnect, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_VIDEO_GAME_START, this._onRepGameStart, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_VIDEO_USER_STAND, this._onRepUserStandUp, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_VIDEO_GET_OPERATION, this._onRepOperation, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_VIDEO_USER_OPERATION, this._onRepUserOperate, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_VIDEO_COMMON_CARDS, this._onRepDealCard, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_VIDEO_SETTLE, this._onRepSettle, this);
        MsgManager.on(MSG.NOTIFY.NOTIFY_SHOW_CHAT, this._onShowChat, this); //外部显示聊天室

        MsgManager.on(Msg_login.GATEWAY.SUB_CORR_CAPITAL, this._onCorrCapital, this);//网关金币更新

        MsgManager.on(MSG_CHAT.NOTIFY.NOTIFY_SHOW_CHAT_BUBBLE, this.setChatBubbles, this); //显示聊天气泡
        MsgManager.on(MSG_CHAT.NOTIFY.AUDIO_PLAY_START, this._onRepPlayVoice, this);
        MsgManager.on(MSG_CHAT.NOTIFY.AUDIO_PLAY_END, this._onRepStopVoice, this);


        MsgManager.on(MSG_CHAT.NOTIFY.VIDEO_PLAY_USERS, this._onVideoPlayUsers, this);//正在说话的人员列表
        MsgManager.on(MSG_CHAT.NOTIFY.VIDEO_PLAY_SELF_AUDIO, this._onVideoSelfAudio, this);//更新自己聊天说话音量


        MsgManager.on(MSG.ClubTexas.ClubDeZhouTakeOutInfoRsp_CMD, this._onRepCarryChipLimits, this);//查看撤码范围结果
        MsgManager.on(MSG.ClubTexas.ClubDeZhouTakeOutSetRsp_CMD, this._onRepSetAutoCarryChip, this);//设置自动撤码回复
        MsgManager.on(MSG.ClubTexas.ClubDeZhouTakeChipsOutRsp_CMD, this._onRepCarryChip, this);//手动撤码回复

        MsgManager.on(MSG.ClubTexas.ClubDeZhouInsureNotify_CMD, this._onRepInsureUserBuy, this);//保险购买或不买通知


        MsgManager.on(MSG.ClubTexas.ClubDeZhouCardOpenRsp_CMD, this._onRepLookCommonCards, this);//翻牌回复（发发看）
        MsgManager.on(MSG.ClubTexas.ClubDeZhouHandCardRsp_CMD, this._onRepLookOtherPlayreCards, this);//看手牌回复（偷偷看）
        MsgManager.on(MSG.ClubTexas.ClubDeZhouCutCardRsp_CMD, this._onRepCutCards, this);//切牌回复

        MsgManager.on(MSG.ClubTexas.ClubDeZhouCardOpNotify_CMD, this._onRepLookOrCurOpNotify, this);//切牌，发发看，偷偷看 通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouTakeInNotify_CMD, this._onBuyNotify, this);//买入通知
        MsgManager.on(MSG.ClubTexas.ClubDeZhouLeaveNotify_CMD, this._onLeaveNotify, this);//广播用户离开
        MsgManager.on(MSG.ClubTexas.ClubDeZhouEnterNotify_CMD, this._onEnterNotify, this);//广播用户进入


        target.on(event.SHOW, this._onAppShow, this);
        target.on(event.HIDE, this._onAppHide, this);

        /****************************************app消息****************************************/
        app.native.on(app.bridge.ACTION.APP_ACTION_ONLINE_PLAYER_INFO, this._onRepOnlinePeople, this);//通知更新在线人数
        app.native.on(app.bridge.ACTION.APP_ACTION_APP_CONFIG, this._onRepAppConfig, this);//获取app配置
        app.native.on(app.bridge.ACTION.APP_ACTION_MIC_STATUS, this._onRepMicStatus, this);//房间玩家麦克风的状态
        app.native.on(app.bridge.ACTION.APP_ACTION_GET_GAME_STATUS, this._onRepGameState, this);//app获取游戏的状态
        app.native.on(app.bridge.ACTION.APP_ACTION_APPLY_LIST_NEWS, this._onRepRedDot, this);//app通知申请列表红点
        app.native.on(app.bridge.ACTION.APP_ACTION_MIC_VOLUME, this._onRepMicVolume, this);//app发送mic音量消息
        app.native.on(app.bridge.ACTION.APP_ACTION_MENU_EVENT, this._onRepMenuEvent, this);//app发送菜单消息
        app.native.on(app.bridge.ACTION.APP_ACTION_MIC_USER_LIST, this._onRepMicUserList, this);//app通知h5主播上麦列表
        const MSGclub = require("Msg_club");
        MsgManager.on(MSGclub.NOTIFY.ClubSInvitedPlayGameRsp_ui, this._onShowTopFriend, this);//收到邀请好友
        MsgManager.on(MSGclub.NOTIFY.ClubSInvitePlayGameRsp_ui, this.onResponseInvite, this); //主动邀请好友后的回复提示
        MsgManager.on(MSGclub.NOTIFY.ClubSWebKickOutNotify_ui, this._onUserKickOut, this); //黑名单踢出
        MsgManager.on(MSGclub.NOTIFY.ClubSNameCountNotify_ui, this._onClubSNameCountNotify, this); //改名次数通知
        MsgManager.on(MSGclub.NOTIFY.ClubSGetClubConfigResp_ui, this._onRspClubConfig, this); //俱乐部配置返回



        if (playBackData) {
            console.log("进入游戏回访数据" , playBackData);
            this._scene.TexasRecordVideo._startPlay(playBackData);
        }
    },

    onDestroy() {
        MsgManager.un(this._onRepLookOrCurOpNotify);
        MsgManager.un(this._onRepLookOtherPlayreCards);
        MsgManager.un(this._onRepCutCards);
        MsgManager.un(this._onCloseTable);
        MsgManager.un(this._onRepLogin);
        MsgManager.un(this._onRepRoomSetting);
        MsgManager.un(this._onRepErrorTip);
        MsgManager.un(this._onRepGoldNotify);
        MsgManager.un(this._onRepUserGoldNotify);
        MsgManager.un(this._onRepMagicFace);
        MsgManager.un(this._onRepKickOut);
        MsgManager.un(this._onRepUserSitDown);
        MsgManager.un(this._onRepUserStandUp);
        MsgManager.un(this._onRepStartCountDown);
        MsgManager.un(this._onRepGameStart);
        MsgManager.un(this._onRepOperation);
        MsgManager.un(this._onRepUserOperate);
        MsgManager.un(this._onRepUserNoOperate);
        MsgManager.un(this._onRepBuyChipLimits);
        MsgManager.un(this._onRepBuyChip);
        MsgManager.un(this._onRepCancelAuto);
        MsgManager.un(this._onRepUserLightCard);
        MsgManager.un(this._onRepPause);
        MsgManager.un(this._onRepProcess);
        MsgManager.un(this._onRepStartGame);
        MsgManager.un(this._onRepContinueGame);
        MsgManager.un(this._onRepEnterInsureState);
        MsgManager.un(this._onRepInsureFaPai);
        MsgManager.un(this._onRepInsureBuy);
        MsgManager.un(this._onRepDelayed);
        MsgManager.un(this._onRepUserDelayed);
        MsgManager.un(this._onRepUserInfo);
        MsgManager.un(this._onRepCarryChipLimits);
        MsgManager.un(this._onRepSetAutoCarryChip);
        MsgManager.un(this._onRepCarryChip);
        MsgManager.un(this._onRepLookCommonCards);
        MsgManager.un(this._onRepOccupiedOrBackSeat);
        MsgManager.un(this._onRepOccupiedOrBackSeatNotify);
        MsgManager.un(this._onRepDealCard);
        MsgManager.un(this._onRepSettle);
        MsgManager.un(this._onRepPlayVoice);
        MsgManager.un(this._onRepStopVoice);
        MsgManager.un(this._onRepReset);
        MsgManager.un(this._onBackToLobbyRsp);
        MsgManager.un(this._onWinRateNotify);
        MsgManager.un(this._onElapsedStatusNotify);
        MsgManager.un(this._onElapWarnNotify);
        MsgManager.un(this._onClubDeZhouHashListRsp);
        MsgManager.un(this._onClubDeZhouHashCardRsp);
        MsgManager.un(this._onClubDeZhouUserStaticRsp)

        MsgManager.un(this._onMInfoNotify);
        MsgManager.un(this._onTbChangeNotify);
        MsgManager.un(this._onOutsNotify);
        MsgManager.un(this._onRANotify);
        MsgManager.un(this._onRABuyChip);
        MsgManager.un(this._onMttMatchWaitStartNotify);

        MsgManager.un(this._onGuessCardNotify);
        MsgManager.un(this._onGuessCardRsp);
        MsgManager.un(this._onSlaveLogOnRsp);
        MsgManager.un(this._onVideoPlayUsers);
        MsgManager.un(this._onVideoSelfAudio);


        // MsgManager.un(this._onSlaveLogoutOnRsp);

        MsgManager.un(this._onRepWindow);
        MsgManager.un(this._onRepSaveWindow);
        MsgManager.un(this._onRepShowRoomConfig);
        MsgManager.un(this._onRepGameReq);
        MsgManager.un(this._onRepPokers);
        MsgManager.un(this._onRepGameBg);
        MsgManager.un(this._onRepSceneInit);
        MsgManager.un(this._onRepSceneConnect);
        MsgManager.un(this._onCorrCapital);
        MsgManager.un(this._onUserKickOut);
        MsgManager.un(this._onClubSNameCountNotify);

        MsgManager.un(this._onRepInsureUserBuy);

        MsgManager.un(this._onShowTopFriend);
        MsgManager.un(this._onShowChat);
        MsgManager.un(this.onResponseInvite);
        MsgManager.un(this.setChatBubbles);
        MsgManager.un(this._onRspClubConfig);
        MsgManager.un(this._onBuyNotify);
        MsgManager.un(this._onLeaveNotify);
        MsgManager.un(this._onEnterNotify);
        target.targetOff(this);

        app.native.targetOff(this);
    },

    start() {
        if (this._isPlayBack) {
            return;
        }

        let subData = app.game.getData();
        if (null != subData) {
            this.onReloadView();
        }
        else {
            let info = UserInfo.getInfo();
            let isKeepStand = App.getIsAdminUser();
            if (!TexasUtils._checkAccount()) {//非账号登录app
                isKeepStand = true;
            }

            let data = {
                nUserId: info.nUserID,//ID
                sTableId: "",//桌子ID
                isKeepStand: true,//进房间默认不坐下
                //isLookerSrv: true,
                // isKeepStand: isKeepStand,//管理员默认站起
            }

            if (TexasUtils._getSkin(["b"])) {
                data.nRoomId = app.game.getGame().getSubRoomID();
            } else {
                data.sTableId = GameInstance.getGame().getSubGameTableID();
            }

            cc.log("App.getIsAdminUser(),isKeepStand:", App.getIsAdminUser(), isKeepStand);

            this.scheduleOnce(function () {
                this._reqEnterGame(data);
            }, 0.1);

        }

        this._onMInfoNotify({ tMInfo: { nRank: 10, nCnt: 100, nBlindUpR: 100, nChipAv: 100 } })
    },

    // update (dt) {},

    onReloadView() {
        if (this._isPlayBack) {
            return;
        }
        let subData = app.game.getData();

        if (null != subData) {
            let info = UserInfo.getInfo();
            let isKeepStand = TexasData._getUserState();
            let data = {
                nUserId: info.nUserID,//ID
                sTableId: "",//桌子ID
                isKeepStand: isKeepStand,//是否保持站立状态 true:是 其它:否
                nPass: (subData.nPass && subData.nPass !== "") ? Base64.encode(subData.nPass) : "",//密码
                //isLookerSrv: true,
            }
            cc.warn("[密码房] 进桌权威校验 sTableId:", subData.sTableId, "|明文nPass:", subData.nPass, "|Base64后nPass:", (subData.nPass && subData.nPass !== "") ? Base64.encode(subData.nPass) : "");

            if (TexasUtils._getSkin(["b"])) {
                data.nRoomId = subData.nRoomId;
            } else {
                data.sTableId = subData.sTableId;
                if (TexasData.isMTTMatch() && this.saveData) {
                    data.sTableId = this.saveData.sTableId;
                }
            }

            this._reqEnterGame(data);
        }
        else {
            //跳到大厅场景
            app.game.exitToHall();
            //离开语聊房间
            ChatMessageMgr.leaveRoom();
        }
        app.game.clearData();
    },

    //进入房间场景
    enterRoomView() {
        // app.game.getGame().enterRoomView();

        // this._scene._clearPool();
    },

    //请求进入游戏房间
    enterSubGame(roomItem) {

    },

    _setNode() {
        if (!this.TexasRecord) {
            this.TexasRecord = this._scene.panelContent.getChildByName("LayerRecord");
        }

        if (!this.TexasSetting) {
            this.TexasSetting = this._scene.panelContent.getChildByName("LayerSetting");
        }

        if (!this.TexasRoomConfig) {
            this.TexasRoomConfig = this._scene.panelContent.getChildByName("LayerRoomConfig");
        }

        if (!this.texasBuyTip) {
            this.texasBuyTip = this._scene.panelContent.getChildByName("TexasGameBottomTip");
        }

        if (!this.texasJingcai) {
            this.texasJingcai = this._scene.panelContent.getChildByName("LayerJingcai");
        }

        if (!this.texasJingcaiTip) {
            this.texasJingcaiTip = this._scene.panelContent.getChildByName("LayerJingcaiTip");
        }
    },

    //请求登陆
    _reqEnterGame(data) {
        if (UserInfo.isLogin()) {
            if (!data && this.saveData) {
                data = this.saveData;
            }

            this.saveData = data;

            // cc.warn("---------------------------------" + this._getGameName() + "游戏设置:",data);

            let nStr = "游戏设置";
            if (TexasUtils._getClub()) {
                TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouLogOnReq_CMD, data);
                // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouLogOnReq_CMD, data);
            } else {
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouLogOnReq_CMD, data);
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouLogOnReq_CMD, data);
            }
        } else {
            cc.log("账号未登录，游戏不登陆")
        }
    },

    _reqEnterLiveSlave() {

        if (TexasUtils._getSkin(["a", "b", "c"])) {//自由匹配房
            return
        }

        let info = UserInfo.getInfo();
        let sTableId = this.saveData ? this.saveData.sTableId : GameInstance.getGame().getSubGameTableID();//桌子id
        let LoginData = {
            nUserId: info.nUserID,//ID
            sTableId: "",//桌子ID
        }
        if (TexasUtils._getSkin(["b"])) {
            LoginData.nRoomId = this.saveData ? this.saveData.nRoomId : app.game.getGame().getSubRoomID();
        } else {
            LoginData.sTableId = sTableId;
        }
        app.net.send(CMD.LiveSlave.value, CMD.LiveSlave.LiveSlaveLogOnReq_CMD, LoginData);
    },

    /****************************************服务器消息****************************************/

    //返回登录
    _onRepLogin(data) {
        cc.warn("-----------------------------" + this._getGameName() + "游戏设置返回:");

        this._scene = this.getComponent("TexasScene");

        let result = data.nRlt;

        this._scene._init();


        // if (this.dealCardSchedule){
        //     this.unschedule(this.dealCardSchedule);
        //     this.dealCardSchedule = null;
        // }

        if (this.settleSchedule) {
            this.unschedule(this.settleSchedule);
            this.settleSchedule = null;
        }

        // this._scene.texasMenuDefault._setButton();

        let sTableId = this.saveData ? this.saveData.sTableId : GameInstance.getGame().getSubGameTableID();
        TexasData._setCurTableId(sTableId);

        if (result == 0) {//成功
            if (TexasData.getIsFreeGame()) {
                TexasData.setFreeGameTableId(data.sTableId);
            }
            if (!this._checkTexasScene()) return;

            this._reqEnterLiveSlave();

            this._scene.TexasOperatePanel.hideCutPokerNode(true);
            if (data.tScence) {
                let tScence = data.tScence;

                //牌桌时间暂停（0：正常， 1：暂停）
                TexasData.setElapsedStatus(tScence.nElapsedStatus || 0);

                this._scene._returnSceneInfo(tScence);
                if (this._scene) {
                    let table = {
                        sTableId: sTableId,
                        sTableName: TexasData._getCurTableName(),
                    }

                    this._scene._setMenuLayout(table);
                }

                App.postMessage(AppBridge.EVENT.SUBGAME_ENTER_FINISH, {
                    gameid: 123,
                    width: app.game.getGame().getIngameWidth(),
                    height: app.game.getGame().getIngameHeight(),
                    error: AppBridge.errorID(0)
                });
            }


            //if (app.url.get("live")) return;
            if (!TexasUtils._getClub() || TexasUtils._getClubReback()) {
                return
            }

            if (ChatMessageMgr) {
                ChatMessageMgr.loginChatServer(sTableId, 1)
            }



        } else {
            App.postMessage(AppBridge.EVENT.SUBGAME_ENTER_FINISH, {
                gameid: 123,
                width: app.game.getGame().getIngameWidth(),
                height: app.game.getGame().getIngameHeight(),
                error: AppBridge.errorID(105)
            });

            this._scene.tipBlock.active = false;
            let tipsStr = i18n.t("COMMON.YOU_XI_CLOSE");
            if (result == 16) {
                tipsStr = i18n.t("COMMON.FAN_HUI_PAI_JU_1");
            } else if (result == 15) {//当天试玩场次数已用尽
                tipsStr = TexasUtils._getText(66);
                this._scene._showDialog(tipsStr, UIDialog.EShowType.OK, function () {
                    app.game.exitToHall();
                });

                return;
            } else if (result == 22) {
                //被后台踢出牌桌
                tipsStr = i18n.t("COMMON.KICKOUT_FROM_TABLE");
                this._scene._showDialog(tipsStr, UIDialog.EShowType.OK, function () {
                    app.game.exitToHall();
                });

                return;
            } else if (result == 26) {
                tipsStr = "房间密码不正确";
            }

            if (TexasUtils._getSkin(["c"])) {
                this._scene._showDialog(tipsStr, UIDialog.EShowType.OK, function () {
                    app.game.exitToHall();
                });
            } else {
                UIFrame.showBlockText(tipsStr, function () {
                    app.game.exitToHall();
                });
            }
        }

    },

    //网关金币更新,更新变化金额
    _onCorrCapital(data) {
        cc.warn("----------------------------- 网关金币更新:", data);
        if (!data) {
            return;
        }
        if (data.nChange) {
            this._scene._setSelfGoldChange(data.nChange);
        }
    },


    //俱乐部关闭牌桌
    _onCloseTable(data) {
        let sTableIds = data.sTableId;

        if (this._scene) {
            this._scene._deleTable(sTableIds);
        }
    },

    //房间设置成功通知
    _onRepRoomSetting(data) {
        cc.warn("-----------------------------" + this._getGameName() + "房间设置成功通知:", data);

        let info = UserInfo.getInfo();

        let tConfigItem = data.tConfigItem;//盲注配置
        let nCapacity = data.nCapacity;//人数配置

        TexasData._setTableBlind(tConfigItem.nSmallBlind, tConfigItem.nBigBlind);//存储大小盲注值
        this._scene._setTableInfo(tConfigItem.nSmallBlind, tConfigItem.nBigBlind);
        TexasData._setMaxTableSeat(nCapacity);//设置牌桌最大座位数

        //获得是否与上一次配置一致
        let isSameConfig = this._scene.TexasRoomConfigPanel._getIsSameConfig();
        if (!isSameConfig) {
            let thiryTime = new Date().getTime() + (31 * 24 * 3600 * 1000);
            cc.sys.localStorage.setItem("TexasRememberTime", thiryTime + "");
        }

        if (info.nUserID != TexasData._getLiveUserId() && !isSameConfig) {//房主不提示
            UIFrame.showTips(TexasUtils._getText(76));
        }

        this._scene.TexasPlayerController._showDefaultSeat();
    },

    //异常提示通知
    _onRepErrorTip(data) {
        cc.warn("-----------------------------" + this._getGameName() + "异常提示通知:", data);

        /*
            11:金币不足(登陆游戏成功, 但坐下失败时) 
            12:金币不足('坐下'请求失败时) 
            13:金币不足(被请离座位后) 

            14:座位不足('坐下'请求失败时)
            15:重复坐下(已在座位上,'坐下'请求失败时)
            16:重复站起(当前不在座位上,'站起'请求失败)
            17:超时站起 (因超时被踢出座位后)
            18:桌子解散
            19:主播未配置房间(坐下失败)
            20:被强制站起 (被管理员或主播)
            21:被强制站起（后台管理员）
            22:被管理员请离该牌桌（返回大厅）
            23:被封禁，跳转登录不能进游戏
            24:被站起，以便换去其它桌继续比赛
            25:金额不足购买保险
            30:输钱限制到达(服务器强制站起)
            31:缺少gps信息，坐下失败
            32:存在距离过近的玩家,坐下失败
            33:缺少IP信息，坐下失败
            34:存在相同IP的玩家,坐下失败
            35:入池率过低,坐下失败
            36:金币不足,魔法表情使用失败
            40:输钱限制到达(主动点击坐下返回)
            41:手数限制
        */

        let info = UserInfo.getInfo();

        let nCode = data.nCode;
        if(nCode == 16) {
            UIFrame.showTips('站起失败 [' + nCode + "]");
        }else if (nCode == 17) {//超时
            TexasData._setIsOverTime(true); 

            let selfSitid = this._scene.TexasPlayerController._getSitId("nUserId", info.nUserID);

            let gameStart = TexasData._getGameStart();  
            let isSelfPlaying = this._scene.TexasPlayerController._getIsPlaying(info.nUserID);
            if (!isSelfPlaying) {//自己不在玩或者不在牌桌
                TexasData._setIsOverTime(false);

                if (selfSitid) {//自己在牌桌,直接站起
                    let nData = {
                        nSitId: selfSitid,
                    }

                    this._onRepUserStandUp(nData);
                }
            } else {//自己在玩
                let selfSeat = this._scene.TexasPlayerController._getSeat("nUserId", info.nUserID);
                if (gameStart) {//游戏开始显示托管
                    TexasData._setIsOverTime(true);

                    let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(selfSeat);
                    if (texasPlayer) {
                        texasPlayer._showTuoGuan(true);
                    }

                    this._scene.TexasOperatePanel._initOperatePanel([1], 3);
                }
            }

            let text = TexasUtils._getText(14);
            this._scene._showDialog(text, UIDialog.EShowType.OK);
        } else if (nCode == 18) {//桌子解散
            this._scene.tipBlock.active = false;
            if (TexasUtils._getSkin(["c"])) {
                if (TexasData.isMTTMatch()) {
                    TexasData.setMttMatchEnd(true);
                    MsgManager.fire(MSG.NOTIFY.NOTIFY_MTT_MATCH_END)
                    let isMttUser = TexasData.getIsMttUser();
                    if (!isMttUser) {
                        this._scene._showDialog(TexasUtils._getText(209), UIDialog.EShowType.OK, function () {
                            app.game.exitToHall();
                        });
                    }

                } else {
                    this._scene._showDialog(i18n.t("COMMON.YOU_XI_CLOSE"), UIDialog.EShowType.OK, function () {
                        app.game.exitToHall();
                    });
                }

            } else {
                UIFrame.showBlockText(i18n.t("COMMON.YOU_XI_CLOSE"), function () {
                    app.game.exitToHall();
                    // TexasUtils.toggleExitGame();
                });
            }
            App.postMessage(AppBridge.EVENT.GAME_ERROR, {
                error: AppBridge.errorID(107),
            });
        } else if (nCode == 19) {//主播未配置房间(坐下失败)
            let text = TexasUtils._getText(30);
            UIFrame.showTips(text);
        } else if (nCode == 20) {//被强制站起 (被管理员或主播)
            let text = TexasUtils._getText(45);
            this._scene._showDialog(text, UIDialog.EShowType.OK);
        } else if (nCode == 21) {//被强制站起（后台管理员）
            let text = i18n.t("COMMON.STANDUP_FROM_TABLE");
            this._scene._showDialog(text, UIDialog.EShowType.OK);
        } else if (nCode == 22) {//被管理员请离该牌桌（返回大厅）
            let text = i18n.t("COMMON.KICKOUT_FROM_TABLE");
            let okCallBack = () => {
                // cc.sys.openURL(HallClubCacheData.getClubTGServerConfig())
                Utils.openTelegramLink(HallClubCacheData.getClubTGServerConfig());
                app.game.exitToHall();
            }
            let closeCallBack = () => {
                app.game.exitToHall();
            }
            this.showNewDialog(text, "联系客服", okCallBack, closeCallBack)
        } else if (nCode == 23) {
            this._onUserKickOut()
        } else if (nCode == 24) {

        } else if (nCode == 25) {
            UIFrame.showTips('您的余额不够购买保险！')
        } else if (nCode == 30) {
            let text = TexasUtils._getText(221, data.nLoseMaxAmount);
            UIFrame.showTips(text);
        } else if (nCode == 31) {
            if (TexasUtils._getSkin(["c"])) {
                //缺少gps信息，坐下失败
                let text = TexasUtils._getText(126);
                UIFrame.showTips(text);
            } else {
                //已超过参赛时间，无法入座
                let text = TexasUtils._getText(192);
                UIFrame.showTips(text);
            }

        } else if (nCode == 32) {
            if (TexasUtils._getSkin(["c"])) {
                //存在距离过近的玩家,坐下失败
                let text = TexasUtils._getText(127);
                UIFrame.showTips(text);
            } else {
                //:被请离座位后，一定时间内不能再入座
                let text = TexasUtils._getText(193);
                UIFrame.showTips(text);
            }

        } else if (nCode == 33) {//缺少IP信息，坐下失败
            let text = TexasUtils._getText(128);
            UIFrame.showTips(text);
        } else if (nCode == 34) {//存在相同IP的玩家,坐下失败
            let text = TexasUtils._getText(129);
            UIFrame.showTips(text);
        } else if (nCode == 35) {//入池率过低,坐下失败
            let text = TexasUtils._getText(157);
            UIFrame.showTips(text);
        } else if (nCode == 36) {//金币不足,魔法表情使用失败
            let text = TexasUtils._getText(158);
            UIFrame.showTips(text);
        } else if (nCode == 40) {//金币不足,魔法表情使用失败
            this._scene.onShowLoseLimitTip(data.nLoseMaxAmount);
        } else if (nCode == 41) {//手数限制，无法坐下
            let text = TexasUtils._getText(222);
            UIFrame.showTips(text);
        }
        // else if () {//需求 筹码大于指定值被迫离座
        //     let text = TexasUtils._getText(95);
        //     this._scene._showDialog(text,UIDialog.EShowType.OK);
        // }
        // else if () {//需求 入池率限制能否入座
        //     let text = TexasUtils._getText(96);
        //     this._scene._showDialog(text,UIDialog.EShowType.OK);
        // }
        else {
            if (nCode != 14 && nCode != 15) {
                let nGold = -1;

                let type = 49;
                if (nCode == 14) {
                    type = 16;
                }

                if (type = 49) {
                    if (data.tRsp) {
                        let tRsp = data.tRsp;//最小最大带入(金币不足时有)
                        nGold = tRsp.nMin;//最低带入
                    } else {
                        type = 11;
                    }
                }

                if (nCode != 11 && nCode != 13) {
                    if (type == 49) {
                        let tryGame = this._getRoomId() == 0 ? true : false;

                        TexasUtils.toggleRecharge(function () {
                            let text = TexasUtils._getText(type, nGold);
                            UIFrame.showTips(text);
                        }, tryGame);
                    } else {
                        let text = TexasUtils._getText(type, nGold);
                        UIFrame.showTips(text);
                    }
                }
            }

            if (nCode == 14) {
                let text = TexasUtils._getText(16);
                UIFrame.showTips(text);
            }

            if (nCode != 15) {
                let selfSeat = this._scene.TexasPlayerController._getSeat("nUserId", info.nUserID);
                let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(selfSeat);
                if (texasPlayer && texasPlayer._sShopAcc) {
                    TexasUtils.tableUserStandup(texasPlayer._sShopAcc);
                    TexasUtils.updateUserStatus("idle");

                }
            }
        }

    },

    //金币变化通知
    _onRepGoldNotify(data) {
        cc.warn("-----------------------------" + this._getGameName() + "金币变化通知:", data);

        let nGold = data.nGold;

        this._scene._setSelfAllGold(nGold);
    },

    //有玩家筹码余额发生变化通知
    _onRepUserGoldNotify(data) {
        cc.warn("-----------------------------" + this._getGameName() + "有玩家筹码余额发生变化通知:", data);

        let info = UserInfo.getInfo();

        let nPos = data.nPos;//座位号
        let nBalance = data.nBalance;//对应玩家的当前筹码余额

        let selfSitId = this._scene.TexasPlayerController._getSitId("nUserId", info.nUserID);
        if (nPos == selfSitId) {//玩家
            this._scene._setPaoMa(true, nBalance, true);
        } else {
            let seat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
            let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);

            let nData = {
                nBalance: nBalance,
            }
            texasPlayer.changePlayerInfo(nData);
        }
    },

    //魔法表情通知
    _onRepMagicFace(data) {
        cc.warn("-----------------------------" + this._getGameName() + "魔法表情化通知:", data);

        if (TexasUtils._getSkin(["default", "b", "c", "d"]) && this._scene.TexasMagicFaceController) {

            let nUserId = this._scene.TexasPlayerController._getUserId("nSitId", data.nSpeaker);
            if (nUserId == data.nTarget) {//发送和接收是一个人，是表情
                this._scene.TexasMagicFaceController._playerMagicFace(data);

            } else {
                this._scene.TexasMagicFaceController._flyMagicFace(data);
            }
        }
    },


    //踢人回复
    _onRepKickOut(data) {
        cc.warn("-----------------------------" + this._getGameName() + "踢人回复:", data);

        let nRlt = data.nRlt;//0:踢出成功 1:本局结束后踢出 其它:失败

        if (nRlt == 0 || nRlt == 1) {
            let text = TexasUtils._getText(62);
            if (nRlt == 1) {
                text = TexasUtils._getText(63);
            }

            UIFrame.showTips(text);
        }
    },

    //有玩家坐下通知
    _onRepUserSitDown(data) {
        cc.warn("-----------------------------" + this._getGameName() + "有玩家坐下通知:", data);

        let info = UserInfo.getInfo();

        let tUser = data.tUser;//新坐下的玩家
        let nUserId = tUser.nUserId;

        let isPlaying = tUser.nStatus == 6 || tUser.nStatus == 7 ? "idle" : "playing";
        TexasUtils.tableUserSitdown(tUser.sShopAcc);

        if (tUser.nUserId == info.nUserID) {//自己坐下,显示买入按钮、跑马灯、坐下换站起
            TexasUtils.updateUserStatus(isPlaying);
            this._scene.TexasOperatePanel.hideCutPokerNode(true);
            let isCarry = TexasData._getIsCarry();
            if (isCarry) {
                this._scene.texasMenuDefault._setCarry(true);
            }

            TexasData._setSelfIsInTable(true);
            this._scene.TexasPlayerController._setMagicFace(true);

            this._scene.TexasOperatePanel._showOperateBtn();

            let isMatchTable = TexasUtils._isMatchTable();
            // if (TexasUtils._getSkin(["default","d"]) && isMatchTable){
            //     //直播比赛场隐藏购买按钮
            //     this._scene.buyBtn.active = false;
            // }else{
            //     this._scene.buyBtn.active = TexasUtils._getSkin(["c"])?false:true;
            // }

            this._scene._setPaoMa(true, tUser.nBalance, true);

            this._scene.TexasOperatePanel.otherBtn.active = false;

            if (this._scene.infoBg) {
                this._scene.showInsureBgOrInfoBg(0)
            }

            //加入语聊房间

            let tableInfo = TexasData._getTableInfo();//牌桌信息
            if (tableInfo.isVideoFee) {
                ChatMessageMgr._reqVideoToken(false);
            }

        }

        //坐下玩家为原来站起庄家，隐藏庄家标识
        let bankUserId = TexasData._getBankUserID();
        if (tUser.nUserId == bankUserId) {
            this._scene.bankIcon.x = 0;
            this._scene.bankIcon.y = 165.526;
            this._scene.bankIcon.active = false;
        }

        let isSameUser = this._scene.TexasPlayerController._checkIsSameUser(tUser);//检测牌桌是否有一样的玩家
        cc.log("坐下玩家是否已在牌桌:", isSameUser);

        let userData = this._scene.TexasPlayerController._getPlayerInfo();//获得当前牌桌玩家数据
        let oldUserData = Utils.clone(userData);

        //牌桌存在相同玩家，隐藏托管
        if (isSameUser) {
            let seat = this._scene.TexasPlayerController._getSeat("nUserId", nUserId);
            let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);
            if (texasPlayer) {
                texasPlayer._showTuoGuan(false);
            }
        } else {
            userData.push(tUser);
            let newUserData = TexasData._setUserSidToSeat(userData);
            this._scene._updateUserPosition(oldUserData, newUserData);
        }

        let gameStart = TexasData._getGameStart();//游戏开始状态
        let isCanStart = this._scene.TexasPlayerController._checkGameCanStart(gameStart);//检测游戏可开始
        if (isCanStart) {
            this._scene.tipBlock.active = false;
        }


        if (this._scene.TexasTableStop) {
            this._scene.TexasTableStop._setGameStart();
        }

        // this._clubShowTipBlock();

        let isMatchTable = TexasUtils._isMatchTable();
        if (isMatchTable) {
            this._scene.setMatchBtn();
        }

        // 玩家坐下后更新下局站起按钮状态
        if (this._scene && this._scene._updateStandUpNextRoundButtons) {
            this._scene._updateStandUpNextRoundButtons();
        }
        this._scene._setIsStandUp();
        this._scene._showWaitingForGameStartTip();
    },

    //有玩家从座位上站起通知
    _onRepUserStandUp(data) {
        cc.warn("-------------------------------" + this._getGameName() + "有玩家从座位上站起通知:", data);

        let info = UserInfo.getInfo();

        let nSitId = data.nSitId;//站起玩家的座位号

        let sShopAcc = null;
        let seat = this._scene.TexasPlayerController._getSeat("nSitId", nSitId);
        let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);
        if (texasPlayer && texasPlayer._sShopAcc) {
            sShopAcc = texasPlayer._sShopAcc;
        }


        TexasUtils.tableUserStandup(sShopAcc);


        let operatingId = TexasData._getOperatingUserID();
        let nUserId = this._scene.TexasPlayerController._getUserId("nSitId", nSitId);
        if (nUserId == operatingId) {
            this._scene.TexasPlayerController._setLight();
        }

        let bankUserId = TexasData._getBankUserID();//获得庄家id
        if (bankUserId == nUserId) {//站起玩家为庄家
            this._scene.bankIcon.active = false;
            this._scene.bankIcon.x = 0;
            this._scene.bankIcon.y = 165.526;
        }

        this._scene.TexasPlayerController._clearPlayer(nSitId);

        if (nUserId == info.nUserID) {
            //站起是自己，清除操作
            this._scene.TexasOperatePanel._showOperateBtn()
            this._scene.TexasOperatePanel.hideCutPokerNode(true);
            TexasUtils.updateUserStatus("idle");


            this._scene.texasMenuDefault._setCarry(false);
            this._scene.tipBlock.active = false
            this._scene.showInsureBgOrInfoBg(0)
            this._scene._setDelayCost({}); //清除延时按钮
            TexasData._setSelfIsInTable(false);
            //离开语聊房间
            ChatMessageMgr.leaveRoom();
            TexasData._setUserGold(0);//清除玩家金币

            this._scene._setBackSeat(null, 0);//清除留座按钮

            if (this.texasBuyTip) {
                this.texasBuyTip.active = false;
            }
        }

        let selfSitId = this._scene.TexasPlayerController._getSitId("nUserId", info.nUserID);
        if (!selfSitId) {//玩家不在牌桌
            TexasData._setSelfIsInTable(false);
            this._scene.TexasPlayerController._setMagicFace(false);
            this._scene.TexasOperatePanel.hideCutPokerNode(true);
            if (TexasUtils._getSkin(["default", "b", "c", "d"]) && this._scene.TexasMagicFaceController) {
                this._scene.TexasMagicFaceController._stopUpdate();
                this._scene.TexasMagicFaceController._initMagicFace();
            }

            TexasData._setWindowData(0);//清理缓存弹窗

            this._scene.TexasOperatePanel._showOperateBtn();
            // this._scene.buyBtn.active = false;


            // 玩家手动站起时重置下局站起状态
            if (TexasData._resetStandUpNextHand) {
                TexasData._resetStandUpNextHand();
            }

            if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                this._scene.TexasOperatePanel._initOperatePanel([2], 3);//坐下按钮
            }

            // 更新下局站起按钮显示状态
            if (this._scene._updateStandUpNextHandBtn) {
                this._scene._updateStandUpNextHandBtn();
            }
        }

        let gameStart = TexasData._getGameStart();//游戏开始状态
        let isCanStart = this._scene.TexasPlayerController._checkGameCanStart(gameStart);//检测游戏可开始
        if (!isCanStart) {

            this._scene.bankIcon.x = 0;
            this._scene.bankIcon.y = 165.526;
            this._scene.bankIcon.active = false;

            if (TexasUtils._getSkin(["b", "c"])) {
                this._scene._setTimeAnim();
            } else {
                let isGameStop = TexasData._getIsGameStop();

                if (!isGameStop) {
                    this._scene._setTimeAnim();
                }
            }

            if (TexasUtils._getClub()) {
                let tableStart = TexasData._getIsTableStart();

                if (tableStart) {
                    if (TexasData._getIsAdmin() && this._scene.TexasTableStop) {
                        this._scene.TexasTableStop.nStartGame.active = false;
                    }
                }
            }

            if (selfSitId) {
                let isXiaBo = TexasData._getIsXiaBo();//获得直播间是否下播
                let text = TexasUtils._getText(5);
                this._scene.tipBlock.getChildByName("label").getComponent(cc.Label).string = text;
                this._scene.tipBlock.active = isXiaBo ? false : true;

                if (TexasUtils._getClub()) {
                    // this._clubShowTipBlock();
                }
            } else {
                this._scene.tipBlock.active = false;
            }
            //牌桌没玩家，清空奖池金额,隐藏总奖池,隐藏筹码池
            TexasData._setRewardPoolSum(0);
            this._scene.TexasRewardPool._updateTotalPoolText();
            this._scene.TexasRewardPool._updateSumPool();
        }

        let isMatchTable = TexasUtils._isMatchTable();
        if (isMatchTable) {
            this._scene.setMatchBtn();
        }

        this._scene._showWaitingForGameStartTip();

        // 玩家站起后更新下局站起按钮状态
        if (this._scene && this._scene._updateStandUpNextRoundButtons) {
            this._scene._updateStandUpNextRoundButtons();
        }
        this._scene._setIsStandUp();

    },

    //开局倒计时通知
    _onRepStartCountDown(data) {
        cc.warn("-------------------------------" + this._getGameName() + "开局倒计时通知:", data);

        let info = UserInfo.getInfo();
        let liveId = TexasData._getLiveUserId();//主播id

        this._scene._setTimeAnim();

        let nMSeconds = data.nMSeconds;//倒计时时间(毫秒), 0时表示取消倒计时,-1:进入无限等待状态(因为主播设置了暂停)
        if (Number(nMSeconds) > 0) {
            TexasData._setIsGameStop(false);
            if (info.nUserID == liveId && TexasUtils._getSkin(["default", "c", "d"])) {
                this._scene._setStopGame(false);
            }

            nMSeconds = Number(nMSeconds) / 1000;
            this._scene._setTimeAnim(nMSeconds);
        } else if (nMSeconds == 0) {
            TexasData._setIsGameStop(false);
            if (this._scene.TexasTableStop) {
                this._scene.TexasTableStop._setTable();
                this._scene.TexasTableStop._setGameStart();
            }
        } else if (Number(nMSeconds) == -1) {
            TexasData._setIsGameStop(true);
            if (TexasUtils._getClub()) {
                if (!TexasData._getIsAdmin()) {
                    let text = TexasUtils._getText(113);
                    UIFrame.showTips(text);
                }
            } else {
                if (info.nUserID != liveId) {//不为主播
                    let text = TexasUtils._getText(65);
                    UIFrame.showTips(text);
                }
            }
            this._scene._setZanTing();

            if (data.hasOwnProperty("nPauseRemain")) {//>0:正在暂停倒计时(秒); 其他:无意义
                let nPauseRemain = Number(data.nPauseRemain);

                if (TexasData._getTable() == 11 && nPauseRemain > 0 && TexasData._getIsAdmin() && this._scene.TexasTableStop) {
                    this._scene.TexasTableStop._setTable(3, nPauseRemain);
                }
            }
        }


    },

    //游戏开始通知
    _onRepGameStart(data) {
        cc.warn("-------------------------------" + this._getGameName() + "游戏开始通知:", data);

        if (!this._isConnect() && !this._isPlayBack) {
            return;
        }
        this._scene.showInsureBgOrInfoBg(data.nInsureStatus)

        this._scene.TexasOperatePanel.hideCutPokerNode(true);
        TexasData._setIsFaPaiState(true);
        this._scene.showCutPokerView(false);
        // TexasData._setFinishTimeStamp(data.arrPosPartIn);

        this._scene.TexasOperatePanel.showlookOrCutView(false);
        TexasData.setElapsedStatus(0);
        if (this._scene.TexasProcess) {
            this._scene.TexasProcess.stopTabelTime(0);
        }

        //牌桌开始播放洗牌动画
        if (this._scene.CunZhengPanel) {
            this._scene.CunZhengPanel.playShuffleAni()
        }

        TexasData._setGameState(1);

        let info = UserInfo.getInfo();

        TexasData._setGameStart(true);

        if (this._scene.TexasTableStop) {
            this._scene.TexasTableStop._setTable();
        }

        if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this._scene._spinePlayAnim(TexasSpine.TEXAS_SPINE_QIAOZHUO, false);
        }

        this._scene._setTimeAnim();

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this._scene.label_pool.active = true;
        }

        if (this._scene.test_roomConfig && ConfigGame.ISDEVELOP && this._scene.TexasRoomConfigPanel) {
            TexasData._setIsShowRoomConfig(false);
            this._scene.test_roomConfig.active = false;//房间配置测试
            this._scene.TexasRoomConfigPanel.node.active = false;
        }

        this._scene.tipBlock.active = false;

        let arrPosPartIn = data.arrPosPartIn;//参与本局游戏的玩家座位号(每人发两个底牌,只能自己看到自己的底牌是啥)
        let nBankerPos = data.nBankerPos;//庄家座位号
        let arrUsersBet = data.arrUsersBet;//(大盲-小盲-抓头)玩家下注
        let arrHoleCards = data.arrHoleCards;//自己的底牌
        let nCardType = data.nCardType;//自己当前牌型
        // let nTakeIn = data.nTakeIn;//初始筹码带入(为玩家自身金币)
        let arrUserPartIn = data.arrUserPartIn;//参与本局游戏的玩家信息(发牌顺序按数组顺序)

        //购买筹码提示
        if (data.nChipBuy) {
            let nChipBuy = data.nChipBuy;
            this._scene._setPaoMa(true, nChipBuy, false, true);
        }

        //牌局id
        if (data.hasOwnProperty("sPaiJuId")) {
            let sPaiJuId = data.sPaiJuId;
            let tableInfo = TexasData._getTableInfo();
            tableInfo.sPaiJuId = sPaiJuId;
            this._scene._setClubTableInfo(tableInfo);
        }

        if (data.hasOwnProperty("arrChat")) {//表情价格列表
            let arrChat = data.arrChat;
            TexasData._setMagicGold(arrChat);
        }

        if (data.hasOwnProperty("nSmallBlind") && data.hasOwnProperty("nBigBlind")) {
            //俱乐部mtt比赛升盲
            if (data.nSmallBlind > 0 && data.nBigBlind > 0) {
                let tableInfo = TexasData._getTableInfo();
                tableInfo.nBigBlind = data.nBigBlind;
                tableInfo.nSmallBlind = data.nSmallBlind;
                if (data.nPreAnte) {
                    tableInfo.nPreAnte = data.nPreAnte;
                }

                this._scene._setClubTableInfo(tableInfo);
            }

            if (data.hasOwnProperty("nBlindUpR")) {
                //mtt比赛升盲倒计时
                if (data.nBlindUpR > 0) {
                    this._scene.showMttTabelInfo(data);
                }
            }

        }

        TexasData._setSelfCard(arrHoleCards, nCardType);//存储自己手牌、牌型
        TexasData._setBlindData(arrUsersBet);//存储大小盲玩家下注数据
        let zhuatouBet = (arrUsersBet && arrUsersBet.length > 2) ? arrUsersBet[2] : {}
        //设置玩家在玩状态
        let userData = this._scene.TexasPlayerController._getPlayerInfo();//获得牌桌玩家信息
        if (userData && userData.length > 0) {
            let poolCount = 0;
            let isPoolNull = this._scene.TexasRewardPool._checkIsPoolNull();
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let nUserId = user.nUserId;
                let nSitId = user.nSitId;

                let nSeat = this._scene.TexasPlayerController._getSeat("nUserId", nUserId);
                let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);

                if (texasPlayer) {
                    texasPlayer._isPlaying = false;
                    texasPlayer.showHeadCutPokerTip(false);
                    for (let j = 0; j < arrUserPartIn.length; j++) {
                        let arrUser = arrUserPartIn[j];
                        let nPos = arrUser.nPos;//玩家服务端座位
                        let nTakeIn = arrUser.nTakeIn;//玩家余额

                        if (nSitId == nPos) {
                            let nBet = 0;
                            if (arrUser.nBet) {//玩家下注(大小盲)
                                nBet = arrUser.nBet;
                            }

                            let nPreAnte = null;
                            if (arrUser.hasOwnProperty("nPreAnte")) {//前注
                                nPreAnte = arrUser.nPreAnte;
                                poolCount += nPreAnte;
                                nBet += nPreAnte;
                            }
                            //显示抓头
                            if (zhuatouBet && zhuatouBet.nBet && texasPlayer.data.nSitId == zhuatouBet.nPos) {
                                texasPlayer.showZhuaTouAction()
                            }

                            texasPlayer._setGrey();
                            texasPlayer._isPlaying = true;

                            if (Number(nTakeIn) >= 0) {
                                let nData = {
                                    nBalance: nTakeIn + nBet,//加上盲注值用于下注时扣除
                                }
                                texasPlayer.changePlayerInfo(nData);
                            }

                            if (nPreAnte) {
                                texasPlayer._updateDownBet(nPreAnte, false, isPoolNull);
                            }

                            break;
                        }
                    }
                }

            }

            this._scene.TexasRewardPool._addPond(poolCount, isPoolNull, true);
        }

        let selfSitId = this._scene.TexasPlayerController._getSitId("nUserId", info.nUserID);
        if (selfSitId) {//判断自己是不是在牌桌，显示买入筹码按钮
            // let isMatchTable = TexasUtils._isMatchTable();
            // if (TexasUtils._getSkin(["default","d"]) && isMatchTable){
            //     //直播比赛场隐藏购买按钮
            //     this._scene.buyBtn.active = false;
            // }else{
            //     this._scene.buyBtn.active = TexasUtils._getSkin(["c"])?false:true;
            // }


            if (arrPosPartIn && arrPosPartIn.length > 0) {
                let isPlaying = false;
                for (let i = 0; i < arrPosPartIn.length; i++) {
                    if (selfSitId == arrPosPartIn[i]) {
                        isPlaying = true;

                        break;
                    }
                }

                // 设置自己是否参与当前牌局
                TexasData._setSelfParticipating(isPlaying);

                if (isPlaying) {
                    TexasUtils.updateUserStatus("playing");
                }
            } else {
                // 如果没有参与玩家数据，设置为不参与
                TexasData._setSelfParticipating(false);
            }
        }

        //发牌
        if (TexasUtils._getClub()) {
            this._scene._flyAllCards(arrPosPartIn);
        } else {
            this._scene._flyCards(0, 1, arrPosPartIn);
        }

        //定庄
        this._scene._flyBankIcon(nBankerPos);

        //自己当前可预操作选项
        // TexasData._setPrimaryData(data.tPreOpOption);
        if (data.tPreOpOption) {
            let tPreOpOption = data.tPreOpOption;
            this._scene.TexasOperatePanel._initOperatePanel(tPreOpOption, 2);
        }

        if (!TexasUtils._getClub()) {
            return;
        }

        let cSum = 0;
        for (let i = 0; i < arrUserPartIn.length; i++) {
            let posPartc = arrUserPartIn[i];
            let nBet = posPartc.nBet;
            let nPreAnte = posPartc.nPreAnte;

            cSum += nBet;
            cSum += nPreAnte;
        }
        this._scene.TexasRewardPool._updateSumPool(cSum);

        // 游戏开始时更新下局站起按钮状态
        if (this._scene._updateStandUpNextRoundButtons) {
            this._scene._updateStandUpNextRoundButtons();
        }
    },

    //操作权获得通知
    _onRepOperation(data) {
        cc.warn("-------------------------------" + this._getGameName() + "操作权获得通知:", data);

        if (!this._isConnect() && !this._isPlayBack) {
            return;
        }
        TexasData._setInitCountdown(0);//重置初始倒计时
        let info = UserInfo.getInfo();

        let time = TexasData._getMaxOperateTime();//获得操作最大时间

        let nPos = data.nPos;//获得操作权的座位号
        let userId = this._scene.TexasPlayerController._getUserId("nSitId", nPos);
        let sSeat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
        this._scene._setDelayCost({});
        if (info.nUserID == userId) {//自己获得操作权，有弹窗关闭弹窗
            if (TexasUtils._getSkin(["c"])) {
                TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "lundao");//音效
            }

            TexasData._setPrimaryData(null);
            MsgManager.fire(MSG.NOTIFY.NOTIFY_CLOSE_WINDOW, { nRlt: 0 });

            this._scene._setDelayCost(data);
        }

        let lightSeat = sSeat;
        if (sSeat == 1 && userId == info.nUserID) {
            lightSeat = 10;
        }
        TexasData._setOperatingUserID(userId);
        this._scene.TexasPlayerController._setLight(lightSeat);

        let userData = this._scene.TexasPlayerController._getPlayerInfo();
        if (userData.length > 0) {
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let nSeat = user.seat;
                let nUserId = user.nUserId;

                //停止定时器
                let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);
                if (texasPlayer) {

                    if (texasPlayer._setStopClock) {
                        texasPlayer._setStopClock();
                    }

                    if (texasPlayer.timeBlock) {
                        texasPlayer.timeBlock.active = false;
                    }
                    texasPlayer.alarmClock.active = false;

                    //获得操作权者执行定时器及操作
                    if (userId == nUserId) {
                        texasPlayer._updateAction(-1);
                        texasPlayer._initEffect();
                        texasPlayer._setAlarmSchedule(time, "default");

                        if (info.nUserID == nUserId && data.tOperation) {
                            let tOperation = data.tOperation;
                            if (tOperation.hasOwnProperty("nInsureDelayCost")) {//保险延时费用
                                TexasData._setInsureDelayCost(tOperation.nInsureDelayCost);
                            }
                            let func = function () {
                                // if (texasPlayer && texasPlayer._showHead) {
                                //     texasPlayer._showHead(false);
                                // }
                            }
                            this._scene.TexasOperatePanel._initOperatePanel(tOperation, 1, false, func);
                        }
                    }
                }
            }
        }

        if (data.hasOwnProperty("tHandCard")) {//自己的手牌(由于延迟看牌原因,可能现在才开底牌)
            let tHandCard = data.tHandCard;
            let arrHoleCards = tHandCard.arrHoleCards;//底牌(2张)
            let nCardType = tHandCard.nCardType;//牌型

            TexasData._setSelfCard(arrHoleCards, nCardType);//存储自己手牌、牌型

            let selfSeat = this._scene.TexasPlayerController._getSeat("nUserId", info.nUserID);
            if (selfSeat) {
                let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(selfSeat);

                if (texasPlayer) {
                    let cardNum1 = arrHoleCards[0] ? arrHoleCards[0] : 0;
                    let cardNum2 = arrHoleCards[1] ? arrHoleCards[1] : 0;
                    texasPlayer._setCardSprite(cardNum1, cardNum2);
                    texasPlayer.updateCardType(nCardType);
                }
            }
        }

    },

    //有玩家操作通知
    _onRepUserOperate(data) {
        cc.warn("-------------------------------" + this._getGameName() + "有玩家操作通知:", data);
        if (!this._isConnect() && !this._isPlayBack) {
            return;
        }

        let info = UserInfo.getInfo();

        let nPos = data.nPos;//座位号
        let nOp = data.nOp;//-5:弃牌,  -1:AllIn, -2:看牌, -6:跟注, -3:加注

        let isVideo = false;
        if (data.hasOwnProperty("notifyStr")) {
            isVideo = true;
        }

        if (TexasUtils._getClub()) {
            this._scene.TexasPlayerController._setHead(true);
        }

        let nUserId = this._scene.TexasPlayerController._getUserId("nSitId", nPos);

        if (info.nUserID == nUserId) {//自己操作情况,重置预选按钮
            TexasData._setSaveOperate(0);

            if (this._scene.delayedBtn) {
                this._scene.delayedBtn.active = false;
            }
        }

        this._scene.TexasOperatePanel._showOperateJiaZhu(false);
        this._scene.TexasOperatePanel._showOperateStateBtn(false);

        let seat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
        let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);
        if (texasPlayer) {
            // texasPlayer._initEffect();
            texasPlayer.stopUpdate();
            if (texasPlayer._setStopDaoJiShi) {
                texasPlayer._setStopDaoJiShi();
            }
            if (this._scene.delayedBtn) {
                texasPlayer.names.string = texasPlayer._name;
                TexasUtils._setColor(texasPlayer.names.node);

                // if (texasPlayer.data.nUserId==UserInfo.getInfo().nUserID) {
                //     texasPlayer.names.node.active = false;
                // }
                texasPlayer.maxTime = TexasData._getMaxOperateTime();
            }

            if (texasPlayer.timeBlock) {
                texasPlayer.timeBlock.active = false;
            }

            texasPlayer.alarmClock.active = false;

            // if (nOp!=-2) {
            let action = 7;
            if (nOp == -5) {
                action = 4;

                this._scene._disCards(seat);

                if (info.nUserID == nUserId) {
                    TexasData._setIsSelfQiPai(true);

                    let nData = {
                        arrOption: [
                            { nOpId: -23, isOn: false }
                        ]
                    }

                    this._scene._setCommonCards([]);

                    if (!isVideo) {
                        this._scene.TexasOperatePanel._initOperatePanel(nData, 2);
                    }
                }
            } else if (nOp == -6) {
                action = 5;
            } else if (nOp == -3) {
                action = 6;
            } else if (nOp == -7) {
                action = 11;//新增下注
            } else if (nOp == -2) {
                action = 8;
            }
            texasPlayer._updateAction(-1);
            texasPlayer._updateAction(action);//(1:托管 2:大盲 3:小盲 4:弃牌 5:跟注 6:加注 7:allin 8:让牌 9:延时 10:抓头 11:下注)
            // }

            if (data.nBet) {
                let nBet = data.nBet;//跟注、加注或ALLIN时有效，表示具体的跟注\加注\ALLIN数值(>0)
                texasPlayer._updateDownBet(nBet);
            }
        }

        if (data.hasOwnProperty("isAuto") && data.isAuto) {
            let isAuto = data.isAuto;//操作的玩家是否进入了托管状态

            if (texasPlayer) {
                texasPlayer._showTuoGuan(isAuto);
            }

            if (isAuto && info.nUserID == nUserId) {
                this._scene.TexasOperatePanel._initOperatePanel([1], 3);
            }
        }

        this._scene.TexasOperatePanel.initUnStateBtn();
        if (data.tPreOpOption) {//自己当前可预操作选项
            let tPreOpOption = data.tPreOpOption;
            this._scene.TexasOperatePanel._initOperatePanel(tPreOpOption, 2);
        }

        if (info.nUserID == nUserId) {//自己操作玩家,操作前有弹窗显示弹窗
            let selfSitId = this._scene.TexasPlayerController._getSitId("nUserId", info.nUserID);
            let windowData = TexasData._getWindowData();
            let nRlt = windowData.nRlt;

            if (nRlt == 1) {//显示帮助
                if (TexasUtils._getSkin(["default", "b", "d"]) && this.TexasHelp) {
                    this.TexasHelp.active = true;
                } else {
                    this._scene._onClickBtnHelp();
                }
            } else if (nRlt == 2) {//显示设置
                // this._scene._onClickBtnSetting();
                if (TexasUtils._getSkin(["default", "b", "d"]) && this.TexasSetting) {
                    this.TexasSetting.active = true;
                } else {
                    this._scene._showSettingPanel();
                }
            } else if (nRlt == 3) {//显示提示
                this._scene._showDialogPanel();
                // this.texasDialog.active = true;
            } else if (nRlt == 4) {//显示购买弹窗
                if (selfSitId) {//未被踢起显示购买弹窗
                    this._scene._onClickBtnBuy();
                } else {//被踢起，重置购买弹窗
                    TexasData._setWindowData(0);
                }
            } else if (nRlt == 5) {//显示战绩
                if (this.TexasRecord) {
                    this.TexasRecord.active = true;
                }
            } else if (nRlt == 6) {//带出弹窗
                if (selfSitId) {//未被踢起显示购买弹窗
                    this._scene._onClickBtnCarry();
                } else {//被踢起，重置购买弹窗
                    TexasData._setWindowData(0);
                }
            }

            if (texasPlayer && texasPlayer._showHead) {
                texasPlayer._showHead(true);
            }
        }
        if (data.hasOwnProperty("arrWinRate") && data.arrWinRate.length > 0) {
            this._scene.setWinRate(data.arrWinRate, true);
        }
    },

    //预操作回复(1:弃或过 2:让牌 3:跟 4:跟任何注 5:亮牌 6:结束后亮牌)
    _onRepUserNoOperate(data) {
        cc.warn("-------------------------------" + this._getGameName() + "预操作回复:", data);

        let nRlt = data.nRlt;//0:成功 其它:错误码

        if (nRlt == 0) {
            // let nOpId = Number(data.nOpId);//请求的操作
            // let isOn = data.isOn;//操作状态 true:选中成功 false:取消成功

            // if (nOpId==-20) {//弃或过
            //     nOpId = 1;
            // }else if (nOpId==-21) {//让牌
            //     nOpId = 2;
            // }else if (nOpId==-22) {//跟任何注
            //     nOpId = 4;
            // }else if (nOpId==-23) {//结束后亮牌
            //     nOpId = 6;
            // }else if (nOpId==-24) {//亮牌
            //     nOpId = 5;
            // }else if (nOpId>0) {//跟xx
            //     nOpId = 3;
            // }

            // if (isOn) {
            //     this._scene.TexasOperatePanel.initUnStateButton(nOpId);
            // }else {
            //     this._scene.TexasOperatePanel.initUnStateButton();
            //     TexasData._setSaveOperate(0);
            // }
        } else {
            // let sErr = data.sErr;//失败提示
            // UIFrame.showTips(sErr);
        }
    },

    //筹码买入范围查看回复
    _onRepBuyChipLimits(data) {
        cc.warn("-------------------------------" + this._getGameName() + "筹码买入范围查看回复:", data);

        let info = UserInfo.getInfo();

        let nGold = data.nGold;//当前身上金币

        let selfGold = this._scene.TexasPlayerController._getGold("nUserId", info.nUserID);//获得自己金币

        // if (selfGold!=null && Number(selfGold)<=Number(nGold)) {
        // this._scene._setBuyTip(true,data,Number(nGold)-Number(selfGold));
        // } 

        if (TexasUtils._getClub() && TexasData.isMTTMatch()) {
            //俱乐部mtt比赛不显示购买筹码弹框，购买筹码通过新协议通知
            return;
        }

        this._scene._setBuyTip(true, data, Number(nGold), selfGold);
    },

    //筹码买入回复
    _onRepBuyChip(data) {
        cc.warn("-------------------------------" + this._getGameName() + "筹码买入回复:", data);

        let nRlt = data.nRlt;//0:成功(下局开始时生效) 1:金币不足 其它:其它错误码

        let type = nRlt == 0 ? 7 : 6;

        if (nRlt == 0) {
            this._scene._setBuyTip(false);

            if (data.hasOwnProperty("nBalance")) {
                if (parseInt(data.nBalance) == -1) {
                    let text = TexasUtils._getText(type);
                    UIFrame.showTips(text);
                } else {
                    let nSeat = this._scene.TexasPlayerController._getSeat("nUserId", UserInfo.getInfo().nUserID);
                    let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);

                    if (texasPlayer) {
                        let nData = {
                            nBalance: parseInt(data.nBalance),
                        }
                        texasPlayer.changePlayerInfo(nData);
                    }
                }
            } else {
                let text = TexasUtils._getText(type);
                UIFrame.showTips(text);
            }

        } else if (nRlt == 3) {
            let text = "补码超出限制";
            UIFrame.showTips(text);
        } else {
            let tryGame = this._getRoomId() == 0 ? true : false;
            TexasUtils.toggleRecharge(function () {
                let text = TexasUtils._getText(type);
                UIFrame.showTips(text);
            }, tryGame);

        }

    },

    //撤码范围信息查看回复
    _onRepCarryChipLimits(data) {
        cc.warn("-------------------------------" + this._getGameName() + "筹码带出范围查看回复:", data);
        this._scene._showCarryPanel(data);
    },


    //设置自动撤码回复
    _onRepSetAutoCarryChip(data) {
        cc.warn("-------------------------------" + this._getGameName() + "设置自动撤码回复:", data);

        if (data.nRlt == 0) {
            if (this.texasBuyTip) {
                if (this.texasBuyTip) {
                    let TexasCarryTipJs = this.texasBuyTip.getComponent("TexasGameBottomTip").contemtList[1].getComponent("TexasCarryTip")
                    TexasCarryTipJs._isAutoCarry = data.isAutoTabkeOut
                    TexasCarryTipJs.updateAutoSelectView()
                }
            }
        } else {
            UIFrame.showTips("请先坐下");
        }

    },


    // message ClubDeZhouSCTakeChipsOutRsp {
    //     required int32 nRlt=1;              //返回值 0成功 1不在座位上 2牌桌撤码未开启 3可撤码金币不足 4参数错误
    //     optional double nTempChips=2;        //暂存区数值
    //     optional double nCanOutChips=3;        //剩余可撤码数值
    //     optional double nBalance=4;        //当前金币
    // }


    //手册撤码回复
    _onRepCarryChip(data) {
        cc.warn("-------------------------------" + this._getGameName() + "筹码带出回复:", data);

        let nRlt = data.nRlt;//返回值 0成功 1不在座位上 2牌桌撤码未开启 3可撤码金币不足 4参数错误

        let type = nRlt == 0 ? 162 : 161;
        let text = TexasUtils._getText(type);

        if (nRlt == 0) {
            this._scene._hideCarryPanel();
        } else if (nRlt == 1) {
            text = "撤码失败，请先坐下";
        } else if (nRlt == 2) {
            text = "牌桌未开启撤码功能";
        } else if (nRlt == 3) {
            text = "可撤码筹码不足";
        } else if (nRlt == 4) {

        }


        UIFrame.showTips(text);
    },



    // message ClubDeZhouCardOpNotify {
    //     required int32 nOpId = 1;           //操作类型 1看公牌 2看手牌 3切牌
    //     optional int32 nRemain = 2;         //0  请求切牌通知   1 开始游戏切牌通知 > 1  结束切牌通知
    //     optional int32 nIndex = 3;          //切牌位置
    //     optional int32 nUserId = 4;
    //     optional string nName = 5;
    // }
    //（发发看）（偷偷看） 切牌 通知
    _onRepLookOrCurOpNotify(data) {
        cc.warn("-------------------------------" + this._getGameName() + "发发看）（偷偷看） 切牌 通知:", data);
        let info = UserInfo.getInfo();
        if (data.nOpId == 3) {//切牌
            if (data.nRemain == 0) {//请求切牌通知,立刻回复，用来清除其他人切牌按钮
                this._scene.TexasOperatePanel.hideCutPokerNode(false);
            } else if (data.nRemain == 1) { //开始游戏切牌通知 
                let seat = this._scene.TexasPlayerController._getSeat("nUserId", data.nUserId);
                if (seat) {
                    let texasPlayers = this._scene.TexasPlayerController._getTexasPlayer(seat);
                    if (texasPlayers) {
                        texasPlayers.showHeadCutPokerTip(true);
                    }
                }
                if (data.nUserId == info.nUserID) {
                    this._scene.showCutPokerView(true)
                }

            } else {//结束切牌通知
                let nName = Base64.decode(data.nName);
                if (data.nUserId == info.nUserID) {
                    nName = "你";
                }
                UIFrame.showTips(nName + "已切牌" + data.nIndex + "张");
                let seat = this._scene.TexasPlayerController._getSeat("nUserId", data.nUserId);
                if (seat) {
                    let texasPlayers = this._scene.TexasPlayerController._getTexasPlayer(seat);
                    if (texasPlayers) {
                        texasPlayers.showHeadCutPokerTip(false);
                    }
                }
            }
        } else if (data.nOpId == 1) {//发发看
            let nName = Base64.decode(data.nName);
            if (data.nUserId == info.nUserID) {
                nName = "你";
            }
            UIFrame.showTips(nName + "查看了公牌");
        } else if (data.nOpId == 2) {//偷偷看
            let nName = Base64.decode(data.nName);
            if (data.nUserId == info.nUserID) {
                nName = "你";
            }
            UIFrame.showTips(nName + "查看了手牌");
        }

    },


    //切牌回复
    _onRepCutCards(data) {
        cc.warn("-------------------------------" + this._getGameName() + "切牌回复:", data);
        let nRlt = data.nRlt;//0:成功 1:金币不足 其它:失败

        if (nRlt == 0) {
            // this._scene.showCutPokerView(true);//桌子重置时显示，使用切牌通知
        } else if (nRlt == 1) {
            UIFrame.showTips("请先坐下");
        } else if (nRlt == 2) {
            UIFrame.showTips(TexasUtils._getText(11));
        }
    },

    //看公共牌（发发看）
    _onRepLookCommonCards(data) {
        cc.warn("-------------------------------" + this._getGameName() + "看公共牌 （发发看）回复:", data);

        let gameState = TexasData._getGameState();//游戏阶段
        if (gameState != 2) return;

        let nRlt = data.nRlt;//0:成功 1:金币不足 其它:失败
        let arrCards = data.arrCards;//翻牌 或转牌 或河牌 (成功时有效)

        if (nRlt == 0) {
            if (arrCards.length > 0) {
                // this._scene.TexasTableCard.cardsBg.active = true;
                this._scene.TexasTableCard._addOpenSinglePoker(arrCards);
            }
        } else {
            let text = nRlt == 2 ? TexasUtils._getText(11) : TexasUtils._getText(173);
            UIFrame.showTips(text);
        }
    },

    //看手牌（偷偷看）
    _onRepLookOtherPlayreCards(data) {
        cc.warn("-------------------------------" + this._getGameName() + "看手牌（偷偷看）回复:", data);

        console.log(`this._scene`, this._scene);
        let gameState = TexasData._getGameState();//游戏阶段
        if (gameState != 2) return;

        let nRlt = data.nRlt;//0:成功 1:不在座位上 2:金币不足
        let arrCards = data.nHands;//手牌数据
        if (nRlt == 0) {
            if (arrCards.length > 0) {
                for (let i = 0; i < arrCards.length; i++) {
                    let handInfo = arrCards[i];
                    // let nUserId = handInfo.nUserId;//玩家id
                    let arrHoleCards = handInfo.arrHoleCards;//底牌
                    let nPos = handInfo.nPos;//座位号
                    let nSeat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
                    let userID = this._scene.TexasPlayerController._getUserId("nSitId", nPos);
                    if (userID == UserInfo.getInfo().nUserID) {
                        this._scene.TexasOperatePanel.initUnStateBtn();
                        continue;
                    }
                    let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);
                    texasPlayer._showCard(arrHoleCards, 0, false, null, true);
                }
            }
        } else if (nRlt == 1) {
            UIFrame.showTips("请先坐下");
        } else if (nRlt == 2) {
            UIFrame.showTips(TexasUtils._getText(11));
        }
    },



    //'留座离桌'或'回到座位' 回复
    _onRepOccupiedOrBackSeat(data) {
        cc.warn("-------------------------------" + this._getGameName() + "'留座离桌'或'回到座位' 回复:", data);

        let nRlt = data.nRlt;//0:成功 1:本手结束后生效 其它:失败
        let nOp = data.nOp;//0:留座离桌 1:回到座位

        if (nRlt == 0) {//成功
            // this._scene.occupyBtn.active = nOp==1?true:false;
        } else if (nRlt = 1) {//本手结束后生效
            if (nOp == 0) {//留座离桌
                this._scene.occupyBtn.active = false;
                let text = TexasUtils._getText(174);

                this._scene.tipBlock.getChildByName("label").getComponent(cc.Label).string = text;
                this._scene.tipBlock.active = true;
                this.scheduleOnce(function () {
                    this._scene.tipBlock.active = false;
                }, 1);

                // UIFrame.showTips(text);
            }
        } else {//失败
            let text = TexasUtils._getText(175);
            UIFrame.showTips(text);
        }
    },

    //'留座离桌'或'回到座位' 生效通知
    _onRepOccupiedOrBackSeatNotify(data) {
        cc.warn("-------------------------------" + this._getGameName() + "'留座离桌'或'回到座位' 生效通知:", data);

        // let info = UserInfo.getInfo();

        let nPos = data.nPos;//座位号
        let nOp = data.nOp;//0:留座离桌 1:回到座位
        let nSeconds = data.nSeconds;//留座离桌剩余时间 秒 (nOp为0时有效)

        // let userID = this._scene.TexasPlayerController._getUserId("nSitId",nPos);
        // if (userID==info.nUserID) {
        //     this._scene.occupyBtn.active = nOp==1?true:false;
        // }

        if (nOp == 0) {//留座离桌
            this._scene.TexasOperatePanel._showOperateBtn();
            this._scene._setBackSeat(nPos, nSeconds);
            this._scene._showWaitingForGameStartTip();

        } else {//回到座位
            this._scene._setBackSeat(nPos, 0);
            this._scene._showWaitingForGameStartTip();
        }
    },

    //有玩家取消托管通知
    _onRepCancelAuto(data) {
        cc.warn("-------------------------------" + this._getGameName() + "有玩家取消托管通知:", data);

        let info = UserInfo.getInfo();

        let nPos = data.nPos;//座位号

        let userID = this._scene.TexasPlayerController._getUserId("nSitId", nPos);
        if (userID == info.nUserID) {
            this._scene.TexasOperatePanel._showOperateBtn();
        }

        let nSeat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
        let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);
        texasPlayer._showTuoGuan(false);
    },

    //有玩家亮牌通知 (结算阶段且弃牌玩家才会亮牌)
    _onRepUserLightCard(data) {
        cc.warn("-------------------------------" + this._getGameName() + "有玩家亮牌通知:", data);

        let nPos = data.nPos;//亮牌玩家座位号

        let settleData = TexasData._getSettleData();

        if (settleData && settleData.length > 0) {
            for (let i = 0; i < settleData.length; i++) {
                let userPokerData = settleData[i];
                let sPos = userPokerData.nPos;//座位号
                let arrHoleCards = userPokerData.arrHoleCards;//底牌
                let nCardType = userPokerData.nCardType;//牌型

                if (nPos == sPos) {
                    let nSeat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
                    let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);
                    texasPlayer._showCard(arrHoleCards, nCardType, false, null, true);

                    break;
                }

            }
        }


        let userID = this._scene.TexasPlayerController._getUserId("nSitId", nPos);
        if (userID == UserInfo.getInfo().nUserID) {
            this._scene.TexasOperatePanel.initUnStateBtn();
        }
    },




    //暂停设置返回
    _onRepPause(data) {
        cc.warn("-------------------------------" + this._getGameName() + "暂停设置返回:", data);

        let isPause = data.isPause;//当前桌子暂停状态
        this._scene._setStopGame(isPause);

        let isMatchTable = TexasUtils._isMatchTable();
        if (isMatchTable) {
            TexasData.setTableMStatus(data.nMStatus);
            this._scene.setMatchBtn();
        }

        if (!TexasUtils._getClub()) return;

        TexasData._setIsGameStop(isPause);
        let gameStart = TexasData._getGameStart();
        if (this._scene.TexasTableStop) {
            this._scene.TexasTableStop._setTable();
        }


        if (isPause) {
            if (TexasData._getIsAdmin()) {
                if (gameStart) {
                    let text = TexasUtils._getText(114);
                    UIFrame.showTips(text);
                }
            } else {
                let text = TexasUtils._getText(113);
                UIFrame.showTips(text);
            }
        } else {
            if (this._scene.TexasTableStop) {
                this._scene.TexasTableStop._setGameStart();
            }
        }
    },

    //牌桌总览返回
    _onRepProcess(data) {
        cc.warn("-------------------------------" + this._getGameName() + "牌桌总览返回:", data);

        if (this._scene.TexasProcess) {
            this._scene.TexasProcess._setProcess(data);
            this._scene.TexasProcess.show();
        }
    },

    //房主点击了"开始牌局" 通知
    _onRepStartGame(data) {
        cc.warn("-------------------------------" + this._getGameName() + "房主点击了开始牌局通知:", data);

        let isTableStart = data.isTableStart;
        TexasData._setIsTableStart(isTableStart);
        if (isTableStart) {
            if (this._scene.TexasTableStop) {
                this._scene.TexasTableStop._setTable();
            }

            if (this._scene.stopBtn && TexasData._getTable() == 11) {
                this._scene.stopBtn.active = TexasData._getIsAdmin();
            }

            if (this._scene.TexasTableStop) {
                this._scene.TexasTableStop._setGameStart();
            }
        }
    },

    //房主点击了"开始游戏" 通知
    _onRepContinueGame(data) {
        cc.warn("-------------------------------" + this._getGameName() + "房主点击了开始游戏通知:", data);

        // let isAutoNext = data.isAutoNext;
        // TexasData._setIsNextRoundStart(isAutoNext);
        if (this._scene.TexasTableStop) {
            this._scene.TexasTableStop._setTable();
        }
    },

    //进入保险阶段通知
    _onRepEnterInsureState(data) {
        cc.warn("-------------------------------" + this._getGameName() + "进入保险阶段通知:", data);
        if (!this._isConnect() && !this._isPlayBack) {
            return;
        }
        //显示保险盾
        this._scene.showInsureBgOrInfoBg(data.nInsureStatus)
        let info = UserInfo.getInfo();

        //在玩时新一轮下注重置预选按钮
        let isSelfPlaying = this._scene.TexasPlayerController._getIsPlaying(info.nUserID);
        if (isSelfPlaying) {
            TexasData._setSaveOperate(0);
        }

        this._scene.TexasOperatePanel.initUnStateBtn();

        let tShowCard = null;
        if (data.hasOwnProperty("tShowCard")) {//亮牌
            tShowCard = data.tShowCard;
        }

        let arrPot = null;
        if (data.hasOwnProperty("tPoolChange")) {//底池变化
            let tPoolChange = data.tPoolChange;
            arrPot = tPoolChange.arrPot;
        }

        let tInsurPanelData = data.tInsurPanelData;//保险面板
        TexasData._setInsureData(tInsurPanelData);

        if (tShowCard) {
            let isShowCard = TexasData._getIsShowCard();
            if (!isShowCard) {
                TexasData._setIsShowCard(true);
            }

            let arrHoleCard = tShowCard.arrHoleCard;

            for (let i = 0; i < arrHoleCard.length; i++) {
                let UserHoleCard = arrHoleCard[i];
                let nPos = UserHoleCard.nPos;//座位号
                let arrHoleCards = UserHoleCard.arrHoleCards;//底牌(2张)
                let nCardTypes = UserHoleCard.nCardType;//牌型

                let seat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
                let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);
                if (texasPlayer) {
                    // texasPlayer._showCard(arrHoleCards,nCardTypes,false,function () {});
                    if (isShowCard) {
                        texasPlayer._showCard(arrHoleCards, nCardTypes, false, function () { }, false, 1);
                    } else {
                        texasPlayer._showCard(arrHoleCards, nCardTypes, false, function () { });
                    }
                }

                if (i == arrHoleCard.length - 1 && TexasData._getInsureData()) {
                    this._scene._setInsurePanel();
                }

            }
        }

        //胜率
        if (TexasUtils._getClub() && data.arrWinRate) {
            let arrWinRate = data.arrWinRate;

            arrWinRate.sort(function (a, b) {//从大到小排列
                return b.nWinRate - a.nWinRate;
            });

            for (let i = 0; i < arrWinRate.length; i++) {
                let winRate = arrWinRate[i];
                let nPos = winRate.nPos;//座位号
                let nWinRate = winRate.nWinRate;//胜率 (值100即为100%, <=0:无意义)

                let nSeat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
                let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);
                if (texasPlayer) {
                    if (Number(nWinRate) > 0) {
                        // texasPlayer._updateAction(-8,false,nWinRate);
                        let index = 0;
                        if (i == 0 || nWinRate == 100) {
                            index = 1;
                        }
                        texasPlayer._setWinRateBg(index);
                    }
                }
            }
        }

        //奖池
        if (arrPot && arrPot.length > 0) {
            let count = 0;
            for (let i = 0; i < arrPot.length; i++) {
                count += arrPot[i];
            }

            // TexasData._setRewardPoolSum(count);
            this._scene._setRewardPool(arrPot);
        }

        if (!tShowCard && !arrPot) {
            this._scene._setInsurePanel();
        }
    },

    //保险后发牌通知
    _onRepInsureFaPai(data) {
        cc.warn("-------------------------------" + this._getGameName() + "保险后发牌通知:", data);

        if (!this._isConnect() && !this._isPlayBack) {
            return;
        }

        let self = this;

        let info = UserInfo.getInfo();

        let nCard = data.nCard;//转牌或河牌
        TexasData._setCommonData([nCard]);
        let arrUsersCardType = data.arrUsersCardType;//发牌后，各玩家的牌型变化
        //结束保险金盾
        this._scene._showBuyInsureAni(true)

        let userData = self._scene.TexasPlayerController._getPlayerInfo();
        for (let i = 0; i < userData.length; i++) {
            let user = userData[i];
            let seat = user.seat;

            let texasPlayer = self._scene.TexasPlayerController._getTexasPlayer(seat);
            if (texasPlayer) {
                texasPlayer.stopUpdateInsure();
            }
        }

        //在玩时新一轮下注重置预选按钮
        let isSelfPlaying = self._scene.TexasPlayerController._getIsPlaying(info.nUserID);
        if (isSelfPlaying) {
            TexasData._setSaveOperate(0);
        }

        self._scene.TexasOperatePanel.initUnStateBtn();

        //重置玩家动作
        self._scene._setUserNameInsure(1);

        if (data.hasOwnProperty("tChoice")) {//投保玩家投保数额

            let tChoice = data.tChoice;
            if (Array.isArray(tChoice)) {
                let tChoiceList = tChoice;
                for (let i = 0; i < tChoiceList.length; i++) {
                    const tChoice = tChoiceList[i];
                    let nPos = tChoice.nPos;//投保玩家座位号
                    let nChoice = Number(tChoice.nChoice);//>0:投保xx ,其它:不投保

                    let nSeat = self._scene.TexasPlayerController._getSeat("nSitId", nPos);
                    let texasPlayer = self._scene.TexasPlayerController._getTexasPlayer(nSeat);
                    if (texasPlayer) {
                        if (nChoice > 0) {
                            texasPlayer._updateAction(-7, false, nChoice);

                        } else {
                            texasPlayer._updateAction(-5);
                        }
                    }
                }
            } else {
                let nSeat = self._scene.TexasPlayerController._getSeat("nSitId", tChoice.nPos);
                let texasPlayer = self._scene.TexasPlayerController._getTexasPlayer(nSeat);
                if (texasPlayer) {
                    if (tChoice.nChoice > 0) {
                        texasPlayer._updateAction(-7, false, tChoice.nChoice);
                    } else {
                        texasPlayer._updateAction(-5);
                    }
                }
            }

        }

        TexasData._setIsShowCard(true);

        let nSeat = this._scene.TexasPlayerController._getSeat("nUserId", info.nUserID);

        self._scene.TexasTableCard._addOpenSinglePoker([nCard], function () {
            for (let i = 0; i < arrUsersCardType.length; i++) {
                let cardInfo = arrUsersCardType[i];
                let nPos = cardInfo.nPos;//座位号
                let nCardType = cardInfo.nCardType;//牌型
                let arrCombinedCards = cardInfo.arrCombinedCards;//能组成最大牌型的5个牌

                let seat = self._scene.TexasPlayerController._getSeat("nSitId", nPos);
                let texasPlayer = self._scene.TexasPlayerController._getTexasPlayer(seat);
                if (texasPlayer) {
                    //停止倒计时
                    texasPlayer._setStopClock()
                    if (nSeat == seat) {
                        self._scene._setCommonCards(arrCombinedCards);
                    }

                    //播放保险赢特效
                    if (data.nHit > 0) {
                        self._scene.TexasTableCard._showCardInsureWinEffect(data.nHit);
                    }

                    texasPlayer.updateCardType(nCardType);
                }
            }
        });

        if (this.scheduleWinRate) {
            this.unschedule(this.scheduleWinRate);
            this.scheduleWinRate = null;
        }

        this.scheduleWinRate = function () {
            if (data.hasOwnProperty("arrWinRate")) {//牌桌胜率
                if (data.arrWinRate.length > 0) {
                    this._scene.setWinRate(data.arrWinRate);
                }
            }
            this.scheduleWinRate = null;
        }.bind(this);

        this.scheduleOnce(this.scheduleWinRate, 0.5);
    },

    //保险购买回复
    _onRepInsureBuy(data) {
        cc.warn("-------------------------------" + this._getGameName() + "保险购买回复:", data);

        let nCode = data.nCode;
        let nPlanId = Number(data.nPlanId);

        if (nCode == 0) {
            if (nPlanId != -1) {
                // let publicCards = TexasData._getCommonData();

                // let tipText = ""
                // if (publicCards.length == 3) {
                //     tipText = "购买转牌保险成功"
                // } else if (publicCards.length == 4) {
                //     tipText = "购买河牌保险成功"
                // }
                // UIFrame.showTips(tipText);
            }
            this._scene._hideInsurePanel();
            // this._scene.TexasInsurePanel.node.active = false;
        } else {
            UIFrame.showTips(TexasUtils._getText(152));
        }
    },

    //保险购买或不买通知
    _onRepInsureUserBuy(data) {
        cc.warn("-------------------------------" + this._getGameName() + "保险购买或不买通知:", data);

        let nPos = data.nPos;//投保玩家座位号
        let nCost = Number(data.nCost);//>0:投保xx ,0:不投保

        let nSeat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
        let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);
        let publicCards = TexasData._getCommonData();
        if (texasPlayer) {
            texasPlayer._setStopClock();
            let tipText = ""
            if (publicCards.length == 3) {
                tipText = "转牌保险"
            } else if (publicCards.length == 4) {
                tipText = "河牌保险"
            }
            let pName = Base64.decode(texasPlayer.data.sName)
            if (texasPlayer.data.nUserId == UserInfo.getInfo().nUserID) {
                pName = "你"
            }
            if (nCost > 0) {
                UIFrame.showTips(pName + "购买" + tipText + nCost);
                texasPlayer._updateAction(-7, false, nCost);
            } else {
                texasPlayer._updateAction(-5);
                UIFrame.showTips(pName + "未购买" + tipText);
            }
        }
    },


    //延时回复
    _onRepDelayed(data) {
        cc.warn("-------------------------------" + this._getGameName() + "延时回复:", data);

        let nRlt = data.nRlt;//0:成功 1:金币不足 其它:未定义
        let nDelayCost = data.nDelayCost;//下次再延时的花费, -1:不能延时,0:免费 ,>0:金币数
        if (nRlt == 0 && data.isInsure) {
            this._scene._updateInsureRlt(data)
        }
        if (nRlt == 0 && !data.isInsure) {
            if (nDelayCost != null && nDelayCost != undefined && nDelayCost >= 0) {
                this._scene._setDelayGold(nDelayCost);
            } else {
                this._scene.delayedBtn.active = false;
            }
        }
        if (nRlt == 1) {
            UIFrame.showTips(TexasUtils._getText(11));
        }
    },

    //有人延时成功通知
    _onRepUserDelayed(data) {
        cc.warn("-------------------------------" + this._getGameName() + "有人延时成功通知:", data);
        let nRemain = 0;
        if (data.hasOwnProperty("nRemain")) {//本桌子使用的币种 1:金币 >1:俱乐部币
            nRemain = data.nRemain;
        }
        let nPos = data.nPos;//延时玩家座位号
        let nSeconds = data.nSeconds;//延时后，增加的时间
        let initSeconds = TexasData._getInitCountdown();//初始倒计时
        if (!initSeconds || initSeconds == 0) {
            initSeconds = data.resRemain
            TexasData._setInitCountdown(initSeconds)
        }

        let seat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
        let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);

        if (texasPlayer) {
            if (data.isInsure) {
                if (seat && texasPlayer) {//购买保险中
                    texasPlayer._updateAction(-6, false, Number(data.nRemain));
                    texasPlayer.setCountdownClockPosition('insure', data, seat)
                    // UIFrame.showTips( Base64.decode(texasPlayer.data.sName) +" 正在购买保险")
                    if (texasPlayer.data.nUserId == UserInfo.getInfo().nUserID) {
                        texasPlayer.names.node.active = false;
                    } else {
                        UIFrame.showTips(Base64.decode(texasPlayer.data.sName) + " 购买保险延时")
                    }
                }
                return;
            }

            texasPlayer.setCountdownClockPosition('paijiu', data, seat)

        }

    },

    //头像信息回复
    _onRepUserInfo(data) {
        cc.warn("-------------------------------" + this._getGameName() + "头像信息回复:", data);

        let nUserId = data.nUserId;
        let nSeat = this._scene.TexasPlayerController._getSeat("nUserId", nUserId);
        this._scene.TexasMagicFaceController._showMagicFacePanel(nUserId, nSeat, data);
    },

    //公共牌新增通知
    _onRepDealCard(data) {
        cc.warn("-------------------------------" + this._getGameName() + "公共牌新增通知:", data);

        if (!this._isConnect() && !this._isPlayBack) {
            return;
        }

        let self = this;
        if (TexasUtils._getClub()) {
            this._scene.TexasRewardPool._updateSumPool(data.nPotSum);
        }
        this._scene.TexasOperatePanel.initUnStateBtn();
        if (data.tPreOpOption) {
            let tPreOpOption = data.tPreOpOption;
            this._scene.TexasOperatePanel._initOperatePanel(tPreOpOption, 2);
        }
        //显示保险盾
        this._scene.showInsureBgOrInfoBg(data.nInsureStatus)

        let isSameCard = false;
        let nArrCards = data.arrCards;//新增的公共牌
        let hasCard = Utils.clone(self._scene.TexasTableCard._getValue());
        if (hasCard instanceof Array && hasCard.length > 0) {
            for (let i = 0; i < hasCard.length; i++) {
                let cardItem = hasCard[i];

                for (let j = 0; j < nArrCards.length; j++) {
                    let nCards = nArrCards[j];

                    if (cardItem == nCards) {
                        isSameCard = true;

                        break;
                    }
                }
            }
        }

        if (isSameCard) return;

        TexasData._setIsFaPaiState(false);

        let info = UserInfo.getInfo();

        //在玩时新一轮下注重置预选按钮
        let isSelfPlaying = this._scene.TexasPlayerController._getIsPlaying(info.nUserID);
        if (isSelfPlaying) {
            TexasData._setSaveOperate(0);
        }

        if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
            self._scene._spinePlayAnim(TexasSpine.TEXAS_SPINE_QIAOZHUO, false);
        }


        //重置玩家动作
        let userData = self._scene.TexasPlayerController._getPlayerInfo();
        if (userData.length > 0) {
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let nSeat = user.seat;

                let texasPlayer = self._scene.TexasPlayerController._getTexasPlayer(nSeat);
                if (texasPlayer) {
                    // texasPlayer._initEffect();
                    texasPlayer._updateAction(-2);
                }
            }

        }

        let nPotSum = data.nPotSum;//底池总额(已押筹码总额)
        let arrPot = data.arrPot;//收归的各底池数额(池数量:>0),数组索引代表池ID,索引从1开始
        let arrUsersHoleCard = data.arrUsersHoleCard;//各玩家的底牌(某些情况下非空数组);不包含自己的底牌
        let arrCards = data.arrCards;//新增的公共牌
        let nCardType = data.nCardType;//新增公共牌后，自己的牌型
        let arrCombinedCards = data.arrCombinedCards;//能组成最大牌型的5个牌

        TexasData._setCommonData(arrCards);
        TexasData._setRewardPoolSum(nPotSum);

        //奖池
        if (arrPot && arrPot.length > 0) {
            self._scene._setRewardPool(arrPot);
        }

        //清除本轮下注筹码
        self._scene.TexasRewardPool._clearTurnBetData();

        ///刷新总底池文本
        self._scene.TexasRewardPool._updateTotalPoolText();

        //玩家底牌
        if (!arrUsersHoleCard) {//开公共牌,结算协议下发开手牌
            TexasData._setIsShowCard(false);
            self._scene.TexasTableCard._addOpenSinglePoker(arrCards, function () {
                let selfSeat = self._scene.TexasPlayerController._getSeat("nUserId", info.nUserID);
                let isSelfPlaying = self._scene.TexasPlayerController._getIsPlaying(info.nUserID);

                if (selfSeat) {
                    let texasPlayers = self._scene.TexasPlayerController._getTexasPlayer(selfSeat);
                    if (texasPlayers) {
                        texasPlayers.updateCardType(nCardType);
                    }
                }

                self._scene._setCommonCards(arrCombinedCards);
            });
        } else {
            if (arrUsersHoleCard.length > 0) {//先显示手牌，再开公共牌
                let isShowCard = TexasData._getIsShowCard();
                if (!isShowCard) {
                    TexasData._setIsShowCard(true);
                }

                for (let i = 0; i < arrUsersHoleCard.length; i++) {
                    let UserHoleCard = arrUsersHoleCard[i];
                    let nPos = UserHoleCard.nPos;//座位号
                    let arrHoleCards = UserHoleCard.arrHoleCards;//底牌(2张)
                    let nCardTypes = UserHoleCard.nCardType;//牌型

                    let seat = self._scene.TexasPlayerController._getSeat("nSitId", nPos);
                    let texasPlayer = self._scene.TexasPlayerController._getTexasPlayer(seat);
                    if (texasPlayer) {
                        if (isShowCard) {
                            texasPlayer._showCard(arrHoleCards, nCardTypes, false, function () { }, false, 1);
                        } else {
                            texasPlayer._showCard(arrHoleCards, nCardTypes, false, function () { });
                        }
                    }

                    if (i == arrUsersHoleCard.length - 1) {
                        self._scene.TexasTableCard._addOpenSinglePoker(arrCards, function () {
                            self._scene._setCommonCards(arrCombinedCards);
                        }, arrUsersHoleCard);
                    }
                }
            } else {//开公共牌,结算协议下发开手牌
                TexasData._setIsShowCard(false);
                self._scene.TexasTableCard._addOpenSinglePoker(arrCards, function () {
                    let selfSeat = self._scene.TexasPlayerController._getSeat("nUserId", info.nUserID);
                    let isSelfPlaying = self._scene.TexasPlayerController._getIsPlaying(info.nUserID);

                    if (selfSeat) {
                        let texasPlayers = self._scene.TexasPlayerController._getTexasPlayer(selfSeat);
                        if (texasPlayers) {
                            texasPlayers.updateCardType(nCardType);
                        }
                    }

                    self._scene._setCommonCards(arrCombinedCards);
                });
            }
        }

        if (!TexasUtils._getClub()) {
            return;
        }

        if (this.scheduleWinRate2) {
            this.unschedule(this.scheduleWinRate2);
            this.scheduleWinRate2 = null;
        }

        this.scheduleWinRate2 = function () {
            if (data.hasOwnProperty("arrWinRate")) {//牌桌胜率
                if (data.arrWinRate.length > 0) {
                    this._scene.setWinRate(data.arrWinRate);
                }
            }
            this.scheduleWinRate = null;
        }.bind(this);

        this.scheduleOnce(this.scheduleWinRate2, 0.5);
    },

    //结算通知
    _onRepSettle(data) {
        cc.warn("-------------------------------" + this._getGameName() + "结算通知:", data);
        if (!this._isConnect() && !this._isPlayBack) {
            return;
        }

        TexasData._setGameState(2);
        TexasData._setInitCountdown(0);//重置初始倒计时
        this._scene._setDelayCost({}); //清除延时按钮

        //关闭保险面板
        this._scene._onCloseInsurePanel();

        let info = UserInfo.getInfo();

        // if (TexasUtils._getClub()){
        // }
        this._scene.TexasRewardPool._updateSumPool();

        //清除本轮下注筹码
        this._scene.TexasRewardPool._clearTurnBetData();

        ///刷新总底池文本
        this._scene.TexasRewardPool._updateTotalPoolText();

        this._scene.showInsureBgOrInfoBg(0)

        let isVideo = false;
        if (data.hasOwnProperty("notifyStr")) {
            isVideo = true;
        }

        TexasData._setOperatingUserID(0);
        this._scene.TexasPlayerController._setLight();

        this._scene.TexasOperatePanel.initUnStateBtn();
        this._scene.TexasOperatePanel.initPoolButton();//防其它玩家强行站起，重置快捷下注按钮状态

        if (data.tPreOpOption) {
            let tPreOpOption = data.tPreOpOption;
            this._scene.TexasOperatePanel._initOperatePanel(tPreOpOption, 2);
        }
        if (TexasUtils._getClub()) {
            this._scene._setUserNameInsure();
        }

        let arrPot = data.arrPot;
        if (arrPot && arrPot.length > 0) {
            this._scene._setRewardPool(arrPot);
        }

        let arrUsersWins = data.arrUsersWin;
        TexasData._setSettleData(arrUsersWins);

        let selfPos = this._scene.TexasPlayerController._getSitId("nUserId", info.nUserID);
        if (selfPos) {
            let selfSeat = this._scene.TexasPlayerController._getSeat("nSitId", selfPos);
            let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(selfSeat);

            if (texasPlayer) {
                let isShowLiang = false;

                if (arrUsersWins && arrUsersWins.length > 0) {
                    let isHideLookOtherBtn = true;
                    for (let i = 0; i < arrUsersWins.length; i++) {
                        let userWinData = arrUsersWins[i];

                        let seat = this._scene.TexasPlayerController._getSeat("nSitId", userWinData.nPos);
                        let player = this._scene.TexasPlayerController._getTexasPlayer(seat);
                        let id = this._scene.TexasPlayerController._getUserId("nSitId", userWinData.nPos);
                        if (info.nUserID != id) {
                            player._updateAction(-1)
                        } else {
                            //自动撤码通知
                            if (userWinData.nDrawChips != undefined) {
                                let drawTipText = ""
                                if (userWinData.nDrawChips > 0) {
                                    UIFrame.showTips("已经自动撤码：" + userWinData.nDrawChips)
                                } else if (userWinData.nDrawChips < 0) {
                                    UIFrame.showTips("剩余筹码低于可撤码的最低要求，撤码操作未成功")
                                }
                            }
                        }
                        let nPos = userWinData.nPos;//座位号
                        let isShowCardWhenEnd = userWinData.isShowCardWhenEnd;//是否设置了结束后亮牌
                        //结算显示切牌，偷偷看，发发看
                        if(!isVideo){
                            this._scene.TexasOperatePanel.showlookOrCutView(!isVideo);
                        }
                        if (!isShowCardWhenEnd) {
                            //设置是否隐藏结算后'偷偷看'按钮，所有玩家都设置了结束后亮牌，则隐藏该按钮
                            isHideLookOtherBtn = false;
                            break;
                        }

                        if (selfPos == nPos && texasPlayer._overShowCards) {
                            isShowLiang = true;//亮牌

                            break;
                        }

                    }
                    let gameStart = TexasData._getGameStart();//游戏开始状态
                    let isCanStart = this._scene.TexasPlayerController._checkGameCanStart(gameStart);//检测游戏可开始
                    if (isCanStart) {
                        let cutState = TexasData._getStandUpNextHand();   //下局是否站起
                        let arrCommunityCards = TexasData._getCommonData();
                        let stateObj = {
                            isHideCutBtn: cutState,
                            isHideLookCommonBtn: arrCommunityCards.length == 5 ? true : false,
                            isHideLookOtherBtn: isHideLookOtherBtn,
                        };
                        // cc.log("test --= 结算显示切牌，偷偷看，发发看状态： --==",stateObj);
                        //结算显示切牌，偷偷看，发发看
                        if(!this._isPlayBack){

                            this._scene.TexasOperatePanel.showlookOrCutView(true, stateObj);
                            this._scene.TexasOperatePanel._clearAllOperateBtn();
                        }

                    }
                }


                if (isShowLiang && !isVideo) {
                    // let nData = {
                    //     arrOption: [
                    //         {nOpId: -24, isOn: false}
                    //     ]
                    // }

                    // this._scene.TexasOperatePanel._initOperatePanel(nData,2);
                    this._scene.TexasOperatePanel.onClickBtnUnStateBtn(null, 5);//临时功能结束手动预操作亮牌，后续删除重做
                }
            }
        }

        if (this.settleSchedule) {
            this.unschedule(this.settleSchedule);
            this.settleSchedule = null;
        }

        this.settleSchedule = function () {
            let gameState = TexasData._getGameState();//游戏阶段
            if (gameState != 2) return;

            let gameStart = TexasData._getGameStart();
            if (gameStart) {
                TexasData._setGameStart(false);

                let isShowCard = TexasData._getIsShowCard();

                let arrUsersWin = data.arrUsersWin;//所有玩家牌型与输赢情况(弃牌玩家除外)
                //console.log("所有玩家牌型与输赢情况 :",arrUsersWin);
                if (arrUsersWin && arrUsersWin.length > 0) {
                    let failUserData = [];
                    TexasData._setFailUserData(failUserData);
                    let poolArry = [];
                    TexasData._composeCards = [];
                    for (let i = 0; i < arrUsersWin.length; i++) {
                        let user = arrUsersWin[i];

                        let nPos = user.nPos;//座位号
                        let arrHoleCards = user.arrHoleCards;//底牌(该玩家可能在公共牌阶段已亮过牌,前端看重复亮牌会不会有问题)
                        let arrCombinedCards = user.arrCombinedCards;//能组成最大牌型的5个牌
                        let nCardType = user.nCardType;//牌型
                        let arrGoldGet = user.arrGoldGet;//从各个池处中获得的金币
                        let isWin = user.isWin;//是否为赢, true时需要播放WIN特效(高亮牌型等等).
                        let nProfit = user.nProfit;//盈利
                        let isShowCardWhenEnd = user.isShowCardWhenEnd;//是否设置了结束后亮牌(只有弃牌玩家可以设置),true:是 其它:否

                        //分奖池、显示输赢分
                        let userID = this._scene.TexasPlayerController._getUserId("nSitId", nPos);

                        //1.收筹码到牌桌>2.分池>3.开公共牌>4.各玩家开牌>5.牌桌手牌组合牌亮牌>6.玩家头像显示胜利动画>7.分奖池>8.显示输赢分
                        let seat = this._scene.TexasPlayerController._getSeat("nSitId", nPos);
                        let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);
                        if (texasPlayer) {
                            texasPlayer._updateAction(-1);
                            texasPlayer._initEffect();
                            //停止倒计时
                            texasPlayer._setStopClock();
                            if (isShowCard) {//已显示手牌
                                if (texasPlayer._isPlaying) {//在玩玩家显示牌型
                                    texasPlayer.updateCardType(nCardType);
                                }

                                if (Number(nProfit) > 0) {
                                    texasPlayer._setWin(nCardType);
                                }

                                if (!texasPlayer._isPlaying && isShowCardWhenEnd) {
                                    let wins = Number(nProfit) > 0 ? true : false;
                                    texasPlayer._showCard(arrHoleCards, nCardType, wins);
                                }

                                if (userID == info.nUserID && !texasPlayer._isPlaying) {
                                    texasPlayer.updateCardType(nCardType);
                                }
                            } else {
                                if (texasPlayer._isPlaying) {
                                    let wins = Number(nProfit) > 0 ? true : false;
                                    if (isShowCardWhenEnd) {
                                        texasPlayer._showCard(arrHoleCards, nCardType, wins);
                                    } else {
                                        if (wins && TexasUtils._getSkin(["default", "b", "c", "d"])) {
                                            texasPlayer._showWinSprite(0);
                                        }

                                        if (userID == info.nUserID) {
                                            texasPlayer.updateCardType(nCardType);
                                        }
                                    }
                                } else {
                                    if (isShowCardWhenEnd) {
                                        let wins = Number(nProfit) > 0 ? true : false;
                                        texasPlayer._showCard(arrHoleCards, nCardType, wins);
                                    } else {
                                        if (userID == info.nUserID) {
                                            texasPlayer.updateCardType(nCardType);
                                        }
                                    }
                                }

                            }
                        }

                        if (this._scene.youWin && userID == info.nUserID && isWin) {
                            // this._scene.youWin.opacity = 255;
                        }

                        if (isWin && userID == info.nUserID && !TexasUtils._getSkin(["default", "b", "c", "d"])) {
                            this._scene._spinePlayAnim(TexasSpine.TEXAS_SPINE_FEIWEN, false);
                        }

                        if (arrGoldGet && arrGoldGet.length > 0) {
                            poolArry.push(user);
                        } else {
                            failUserData.push(user);
                        }

                        if (i == arrUsersWin.length - 1 && poolArry.length > 0) {
                            TexasData._setFailUserData(failUserData);

                            poolArry.sort(function (a, b) {//根据牌型大到小顺序排列数据(牌型一致比较arrGoldGet长度从小到大排列)
                                if (a.nCardType != b.nCardType) {
                                    return b.nCardType - a.nCardType;
                                } else {
                                    if (a.nCmpValue && b.nCmpValue) {
                                        //牌型相同时,由该字段决定大小
                                        let nCmpValue_a = a.nCmpValue;
                                        let nCmpValue_b = b.nCmpValue;
                                        return nCmpValue_b - nCmpValue_a;
                                    } else {
                                        return a.arrGoldGet.length - b.arrGoldGet.length;
                                    }
                                }
                            });

                            cc.log("poolArry:", poolArry);
                            this._scene.poolToUserSchedule(0, poolArry);
                        }


                    }

                }
            }
        }.bind(this);

        let self = this;
        this.scheduleOnce(function () {
            if (self.settleSchedule) {
                self.settleSchedule()
                self.settleSchedule = null;
            }

        }, 1);

        this.scheduleOnce(function () {
            // 检查下局站起状态，如果设置了下局站起则执行自动站起
            if (this._scene && this._scene._executeStandUpNextHand) {
                this._scene._executeStandUpNextHand(true);
            }
        }, 4);
    },

    //桌子重置通知
    _onRepReset(data) {
        cc.warn("-------------------------------" + this._getGameName() + "桌子重置通知:", data);
        TexasData._setGameState(-3);

        if (data.hasOwnProperty("nSmallBlind") && data.hasOwnProperty("nBigBlind")) {
            //比赛升盲
            if (data.nSmallBlind > 0 && data.nBigBlind > 0) {
                TexasData._setTableBlind(data.nSmallBlind, data.nBigBlind);//存储大小盲注值
                this._scene._setTableInfo(data.nSmallBlind, data.nBigBlind);//牌桌信息
            }

        }


        TexasData._setSelfCard(null, null);
        this._scene.TexasOperatePanel.hideCutPokerNode(true);
        this._scene._gameReset();

        TexasUtils.updateGameStatus("idle");

        // // 检查下局站起状态，如果设置了下局站起则执行自动站起

        // console.log("设置自动站起 00000000000 ");
        // if (this._scene && this._scene._executeStandUpNextHand) {
        //      console.log("设置自动站起 1111111111111111 ");
        //     this._scene._executeStandUpNextHand();
        // }

        // 桌子重置后更新下局站起按钮状态（玩家重新入座后应显示按钮）
        if (this._scene && this._scene._updateStandUpNextRoundButtons) {
            this._scene._updateStandUpNextRoundButtons();
        }

        // if (data.hasOwnProperty("isAutoNext")) {//下局是否自动开始 true:是, false:房主点击 "开始游戏"才能开始(前端判断>=2人时才给房主显示该按钮)
        //     let isAutoNext = data.isAutoNext;
        //     TexasData._setIsNextRoundStart(isAutoNext);

        if (this._scene.TexasTableStop) {
            this._scene.TexasTableStop._setGameStart();
        }
        // }

        let isXiaBo = TexasData._getIsXiaBo();//获得直播间是否下播
        if (isXiaBo) {
            // cc.warn("-----------------------------------" + this._getGameName() + "返回大厅请求");

            let nStr = "返回大厅请求";
            if (TexasUtils._getClub()) {
                TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
                // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouBackToLobbyReq_CMD, {});
            } else {
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouBackToLobbyReq_CMD, {});
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouBackToLobbyReq_CMD, {});
            }
            app.net.send(CMD.LiveSlave.value, CMD.LiveSlave.LiveSlaveBackToLobbyReq_CMD, {});

            //关闭牌桌
            this._scene.tipBlock.active = false;
            if (TexasUtils._getSkin(["c"])) {
                this._scene._showDialog(i18n.t("COMMON.YOU_XI_CLOSE"), UIDialog.EShowType.OK, function () {
                    app.game.exitToHall();
                });
            } else {
                UIFrame.showBlockText(i18n.t("COMMON.YOU_XI_CLOSE"), function () {
                    app.game.exitToHall();
                    // TexasUtils.toggleExitGame();
                });
            }

            App.postMessage(AppBridge.EVENT.GAME_ERROR, {
                error: AppBridge.errorID(107),
            });
        }

        // this._clubShowTipBlock();
    },

    //金币不足
    _onRepGoldNoEnough(data) {
        cc.warn("-------------------------------" + this._getGameName() + "金币不足:", data);

        let self = this;

        let info = UserInfo.getInfo();

        TexasData._setIsOverTime(false);

        let nSitId = self._scene.TexasPlayerController._getSitId("nUserId", info.nUserID);

        let nData = {
            nSitId: nSitId,
        }
        self._onRepUserStandUp(nData);

        let tryGame = this._getRoomId() == 0 ? true : false;
        TexasUtils.toggleRecharge(function () {
            let text = TexasUtils._getText(11);
            self._scene._showDialog(text, UIDialog.EShowType.OK);
        }, tryGame);
    },

    /****************************************本地消息****************************************/

    //弹窗
    _onRepWindow(data) {
        cc.warn("-------------------------------" + this._getGameName() + "弹窗通知:", data);

        let nRlt = data.nRlt;

        if (nRlt == 0) {
            if (this.texasBuyTip) {
                this.texasBuyTip.active = false;
            }

            this._scene._hideCarryPanel();

            this._scene._hideHelpPanel();

            this._scene._hideSettingPanel();
        }
    },

    //设置聊天气泡
    setChatBubbles(data) {
        // cc.log('test 聊天气泡 ', data)
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let str = element.message.replace("BTTPOKER", "")
            let message = Base64.decode(str.split('&avatar=')[0])
            message = this.getMessageText(message)
            let account = element.fromAccount.split('_')
            let userId = account[2]
            let seat = this._scene.TexasPlayerController._getSeat("nUserId", userId);
            let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);
            let chatNode = this._scene.panelContent.getChildByName('chatBubblesNode')
            let pos = null
            if (texasPlayer) {
                let posWorld = texasPlayer.node.parent.convertToWorldSpaceAR(texasPlayer.node.position);
                pos = chatNode.convertToNodeSpaceAR(posWorld);
            }
            let dis = this.getCahtBubblesPos(seat)
            // cc.log('test 聊天 ', seat, pos, dis, this._chatBubbles[seat])
            if (this._chatBubbles[seat]) {
                this._chatBubbles[seat].getComponent('texasChatBubbles').setData(message, dis, pos)
                return
            }
            let path = "popup/texasChatBubbles";
            app.texas.ui.loadPopup(path, function (component) {
                chatNode.addChild(component.node, 1024);
                this._chatBubbles[seat] = component.node
                component.setData(message, dis, pos)
            }.bind(this));

        }

    },

    getMessageText(text) {
        // let key = "f"
        // let value = ""
        // for(let i=0;i<text.length;i++){
        //     let v = text.charCodeAt(i) ^ key.charCodeAt(0) ^ (i%100)
        //     value = value + String.fromCharCode(v)
        // }

        let value = text
        return value
    },

    getCahtBubblesPos(seat) {
        let maxSeat = TexasData._getMaxTableSeat()
        if (seat == 1) {
            return 'bottom'
        } else if (maxSeat == 2 && seat == 3) {
            return 'topLeft'
        } else if ((maxSeat == 7 || maxSeat == 9 || maxSeat == 4 || maxSeat == 6 || maxSeat == 8) && seat == 5) {
            return 'topLeft'
        } else if ((maxSeat == 7 || maxSeat == 9) && seat == 6) {
            return 'topRight'
        } else if (seat <= 5) {//左边
            return 'left'
        } else if (seat >= 6) {
            return 'right'
        }
    },


    //存储关闭弹窗
    _onRepSaveWindow() {
        cc.warn("-------------------------------" + this._getGameName() + "存储关闭弹窗通知");

        TexasData._setWindowData(0);
    },

    //显示房间配置弹窗
    _onRepShowRoomConfig() {
        cc.warn("-------------------------------" + this._getGameName() + "显示房间配置弹窗");

        if (!TexasUtils._getSkin(["default", "d"])) return;

        let isShowRoomConfig = TexasData._getIsShowRoomConfig();
        if (isShowRoomConfig && this.TexasRoomConfig) {
            this.TexasRoomConfig.active = true;
        }
    },

    //游戏请求
    _onRepGameReq(data) {
        if (!data) return;

        let str = data.str;
        let value = data.value;
        let treaty = data.treaty;
        let nData = data.nData;

        cc.warn("-------------------------------" + this._getGameName() + "" + str + ":", nData);
        app.net.send(value, treaty, nData);
    },

    //扑克
    _onRepPokers() {
        let userData = this._scene.TexasPlayerController._getPlayerInfo();
        if (userData.length > 0) {
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let nSeat = user.seat;

                let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(nSeat);
                if (texasPlayer) {
                    texasPlayer._pokers();
                }
            }
        }
    },

    //背景 1、2、3对应bg2  ，  4对应bg1
    _onRepGameBg(data) {

        let isBg1Bo = data.bg == 4 ? true : false;
        this.node.getChildByName("bg1").active = data.bg == 4
        this.node.getChildByName("bg2").active = data.bg != 4

    },

    //场景初始化
    _onRepSceneInit() {
        cc.warn("-------------------------------" + this._getGameName() + "战绩回放 场景初始化");

        this._scene._init();
    },

    //场景重连
    _onRepSceneConnect(data) {
        cc.warn("-------------------------------" + this._getGameName() + "战绩回放 场景重连:", data);

        this._onRepSceneInit();
        this._scene._returnSceneInfo(data, true);
    },


    //游戏且后台
    _onAppHide() {

    },

    //游戏切换到前台
    _onAppShow() {
        cc.log("-------------------------------" + this._getGameName() + "更新数据");

        // let isFaPai = TexasData._getIsFaPaiState();

        // if (isFaPai) {
        //     let timestamp = new Date().getTime();//当前时间戳（毫秒）
        //     let finishTimeStamp = TexasData._getFinishTimeStamp();//获得结束时间戳
        //     cc.log("游戏切换到前台 timestamp,finishTimeStamp:",timestamp,finishTimeStamp);

        //     if (finishTimeStamp!=0) {//游戏已开始
        //         this._scene.TexasTableCard.commonCard.destroyAllChildren();

        //         if (finishTimeStamp>timestamp) {//发牌中
        //             let playTime = (finishTimeStamp - timestamp)/1000;
        //             this._scene.TexasTableCard._startFaPai(playTime);
        //         }else {//发牌结束
        //             let arrCommunityCards = TexasData._getCommonData();
        //             for (let i=1; i<=5; i++) {
        //                 this._scene.TexasTableCard.openSinglePoker(i,0,true);
        //             }
        //             if (arrCommunityCards && arrCommunityCards.length>0) {
        //                 for (let i=0; i<arrCommunityCards.length; i++) {
        //                     let card = arrCommunityCards[i];

        //                     this._scene.TexasTableCard.openSinglePoker(i+1,card,true);
        //                 }
        //             }
        //         }
        //     }
        // }else {

        if (this._isPlayBack) {
            return;
        }

        let info = UserInfo.getInfo();

        let sTableId = this.saveData ? this.saveData.sTableId : GameInstance.getGame().getSubGameTableID();//桌子id

        let isKeepStand = TexasData._getUserState();

        let data = {
            nUserId: info.nUserID,//ID
            sTableId: "",//桌子ID
            isKeepStand: isKeepStand,//是否保持站立状态 true:是 其它:否
            //isLookerSrv: true,
        }

        if (TexasUtils._getSkin(["b"])) {
            data.nRoomId = this.saveData ? this.saveData.nRoomId : app.game.getGame().getSubRoomID();
        } else {
            data.sTableId = sTableId;
        }

        TexasData._setIsAppShow(true);
        if (this._isConnect()) {
            let tableInfo = TexasData._getTableInfo();//牌桌信息
            if (ChatMessageMgr.checkIsReconned() && tableInfo.isVideoFee) {
                ChatMessageMgr.initVideoMgr();
            }
            return;
        }
        this._reqEnterGame(data);
        // }
    },

    _isConnect() {
        return (app.net && app.net.isConnect()) ? true : false;
    },

    //通知播放音效
    _onRepPlayVoice(data) {
        cc.warn("-------------------------------" + this._getGameName() + "通知播放音效", data);

        if (data && data.fromAccount) {
            data.volume = true;
            this._scene.TexasPlayerController._updateMicVolume(data);
        }
    },

    //通知停止音效
    _onRepStopVoice(data) {
        cc.warn("-------------------------------" + this._getGameName() + "通知停止音效", data);

        if (data && data.fromAccount) {
            data.volume = false;
            this._scene.TexasPlayerController._updateMicVolume(data);
        }
    },


    _onVideoSelfAudio(data) {
        this._scene.updateSelfVoice(data);
    },

    //正在说话的人员
    _onVideoPlayUsers(data) {
        cc.warn("-------------------------------" + this._getGameName() + "正在说话的人员", data);
        this._scene.TexasPlayerController._updateAllPlayerMicState(data);
    },

    /****************************************app消息****************************************/

    //通知更新在线人数
    _onRepOnlinePeople(data) {
        cc.warn("-------------------------------app 通知更新在线人数", data);

        // this._scene._setPeopleAndGold(data.number,-1);
    },

    //获取app配置
    _onRepAppConfig(data) {
        cc.warn("-------------------------------app 获取app配置", data);

        if (data.mic) {//麦克风开关，取值 {"on", "off"}
            app.storage.setItem("Texas_mike", data.mic);
            this._scene.TexasPlayerController._updatePlayerMike(data.mic);
        }
        if (data.gift_effect) {//礼物动效开关，取值 {"on", "off"} 
            app.storage.setItem("Texas_gift_effect", data.gift_effect);
            this._scene.texasMenuDefault.updateRoomGift();
        }

        if (data.room_voice) {//菜单房间语音开关，取值 {"on", "off"}
            app.storage.setItem("Texas_room_voice", data.room_voice);
            this._scene.texasMenuDefault.updateRoomVoice();
        }

        if (data.system_voice) {//开启/关闭系统设置里的语音，取值 {"on", "off"} 
            app.storage.setItem("Texas_system_voice", data.system_voice);
        }
    },

    //房间玩家麦克风的状态
    _onRepMicStatus(data) {
        cc.warn("-------------------------------app 房间玩家麦克风的状态", data);

        if (!data) {
            return;
        }

        for (let i = 0; i < data.length; i++) {
            this._scene.TexasPlayerController._updatePlayerMike(data[i].status, data[i].userid);
        }
    },

    //app获取游戏的状态
    _onRepGameState(data) {
        let gameStart = TexasData._getGameStart();

        let state = "idle";
        if (gameStart) {
            state = "playing";
        }
        cc.warn("-------------------------------app 获取游戏的状态data,state", data, state);
        TexasUtils.updateGameStatus(state);
    },

    //app通知申请列表红点
    _onRepRedDot(data) {
        cc.warn("-------------------------------app 通知申请列表红点", data);

        this._scene.texasMenuDefault._setRedPoint(true);
    },

    //app发送mic音量消息
    _onRepMicVolume(data) {
        cc.warn("-------------------------------app 发送mic音量消息", data);

        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                this._scene.TexasPlayerController._updateMicVolume(data[i]);
            }

        }
    },
    //打开聊天室
    _onShowChat() {
        this._scene._onClickBtnChat()
    },

    //app发送菜单消息
    _onRepMenuEvent(data) {
        cc.warn("-------------------------------app 发送菜单消息", data);

        if (!TexasUtils._getSkin(["default", "d"])) return;

        let key = data.event_key;
        let userid = data.event_data && data.event_data.userid;

        if (key === "game_rule" || key === "game_record" || key === "game_system_setting") {
            MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);

            this.texasDialog.active = false;
            if (this.TexasRecord) {
                this.TexasRecord.active = false;
            }

            if (this.TexasSetting) {
                this.TexasSetting.active = false;
            }

            if (this.TexasHelp) {
                this.TexasHelp.active = false;
            }
            this.TexasRoomConfig.active = false;

            if (this.texasBuyTip) {
                this.texasBuyTip.active = false;
            }
        }

        if (key === "game_rule") {//帮助
            this._scene._onClickBtnHelp();
        } else if (key === "game_record") {//战绩
            this._scene._onClickBtnRecord();
        } else if (key === "game_setting") {//房间配置设置
            this._scene._onClickBtnRoomConfig();
        } else if (key === "game_system_setting") {//系统设置
            this._scene._onClickBtnSetting();
        } else if (key === "game_standup") {//站起
            let isSelfStand = this._scene.TexasPlayerController._getIsSelfStand(userid);
            if (isSelfStand) {
                this._scene._onClickBtnStand();
            }
        } else if (key === "game_kickout") {//踢人
            this._scene.TexasPlayerController._kickOutUser(userid);
        } else if (key === "game_pause") {//游戏暂停
            this._scene._onClickBtnStopGame();
        } else if (key === "game_resume") {//游戏开始
            this._scene._onClickBtnContinueGame();
        }
    },

    //app通知h5主播上麦列表
    _onRepMicUserList(data) {
        cc.warn("-------------------------------app 通知h5主播上麦列表", data);

        if (!TexasUtils._getSkin(["default", "d"])) return;

        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                this._scene.TexasPlayerController._updateMicState(data[i]);
            }
        }
    },

    //获得游戏名
    _getGameName() {
        return "德州";
    },

    //获得房间场次
    _getRoomId() {
        let nRoomId = 1;
        if (TexasUtils._getSkin(["b"])) {
            nRoomId = this.saveData ? this.saveData.nRoomId : app.game.getGame().getSubRoomID();
        }

        return nRoomId;
    },

    //检测TexasSceneScene存在
    _checkTexasScene() {
        let exist = true;

        if (!this._scene) {
            UIFrame.showTips(i18n.t("game is no exist!"));
            exist = false;
        }

        return exist;
    },

    //邀请玩家后回复
    onResponseInvite(data) {
        if (data) {
            if (data.nRlt == 0) {
                UIFrame.showTips('邀请成功！')
            } else if (data.nRlt == 1) {
                UIFrame.showTips('玩家拒绝您的邀请！')
            } else if (data.nRlt == 2) {
                UIFrame.showTips('玩家正在游戏中')
            } else if (data.nRlt == 2) {
                UIFrame.showTips('玩家不在线！')
            }
        }
    },


    //返回大厅返回
    _onBackToLobbyRsp(data) {
        cc.warn("-------------------------------" + this._getGameName() + "返回大厅返回", data);
        // if(data.nRlt == 0 && !this._exitGame){
        //     this._exitGame = true
        //     if(data.isLookerSrv){
        //         this.isSlaveLogin = false
        //         this._reqEnterGameLog()
        //     }else{
        //         this.isGameLogin = false
        //         this._reqEnterSlaveLog()
        //     }
        // }
    },

    //旁观竞猜登陆返回
    _onSlaveLogOnRsp(data) {
        cc.warn("-------------------------------旁观竞猜登陆返回", data);
    },


    //旁观竞猜通知
    _onGuessCardNotify(data) {
        cc.warn("-------------------------------旁观竞猜通知", data);

        if (this.texasJingcai && data) {
            this.texasJingcai.getComponent("texasJingcai").show(data)
        }
    },

    //旁观竞猜回复
    _onGuessCardRsp(data) {
        cc.warn("-------------------------------旁观竞猜回复", data);
        if (this.texasJingcaiTip && data) {
            this.texasJingcaiTip.getComponent("texasJingcaiTip").show(data)
        }
    },

    //通知胜率
    _onWinRateNotify(data) {
        if (data && data.arrWinRate) {
            this._scene.setWinRate(data.arrWinRate);
        }
    },

    //桌子计时状态变化 通知 牌桌时间暂停（0：正常， 1：暂停）
    _onElapsedStatusNotify(data) {
        if (data && data.nElapsedStatus) {
            TexasData.setElapsedStatus(data.nElapsedStatus);
            this._scene.TexasProcess.stopTabelTime(data.nElapsedStatus);
        }
    },

    //桌子剩余时间 警告
    _onElapWarnNotify(data) {
        if (data && data.nRemainTime) {
            let text = TexasUtils._getText(190);
            text = Utils.replaceAll(text, "XXX", parseInt(data.nRemainTime / 60) || 0);
            UIFrame.showTips(text);
        }
    },

    //玩家封禁消息
    _onUserKickOut() {
        let text = "你的账号已被封禁，无法登录\n请联系KKpoker客服处理"
        let okCallBack = () => {
            Utils.openTelegramLink(HallClubCacheData.getClubTGServerConfig());
            // cc.sys.openURL(HallClubCacheData.getClubTGServerConfig())
            this._onLoginScene()
        }
        let closeCallBack = () => {
            this._onLoginScene()
        }
        this.showNewDialog(text, "联系客服", okCallBack, closeCallBack)
    },

    showNewDialog(text, okText, okCallBack, closeCallBack) {
        let path = "popup/dialog/UIDialog";
        // let text = "你的账号已被封禁，无法登录\n请联系KKpoker客服处理"
        app.ui.loadPopup(path, function (component) {
            UIFrame.clearAllBlock();
            this.node.addChild(component.node, 1024);
            component.setBtnText(UIDialog.EShowType.OKCANCEL, okText);
            component.show(text, function (isOK) {
                if (isOK) {
                    if (okCallBack) okCallBack()
                } else {
                    if (closeCallBack) closeCallBack()
                }
            }.bind(this));
        }.bind(this));
    },

    //改名次数通知
    _onClubSNameCountNotify(data) {
        cc.warn("------------------------------游戏中改名次数通知", data);
        if (data.isRecharge) {
            LocalStorage.setItem("first_recharge_changename", true)
        }
    },

    //返回登录页
    _onLoginScene() {
        app.net.setEnabled(false)
        app.net.disConnect(true);
        app.res.loadLogin(function onComplete(error, wrapper) {
            if (error) {
                cc.error("SceneLaunch", error, wrapper);
                return;
            }
        }, { isFail: true });
    },

    //俱乐部洗牌凭证列表
    _onClubDeZhouHashListRsp(data) {
        cc.warn("------------------------------俱乐部洗牌凭证列表", data);
        MsgManager.fire(MSG.NOTIFY.ClubDeZhouHashListRsp_ui, data);
    },

    _onClubDeZhouHashCardRsp(data) {
        cc.warn("------------------------------俱乐部局牌序列信息", data);
        MsgManager.fire(MSG.NOTIFY.ClubDeZhouHashCardRsp_ui, data);
    },

    //牌局结算信息
    _onClubDeZhouUserStaticRsp(data) {
        cc.warn("------------------------------牌局结算数据信息", data);
        if (this._scene && this._scene.showGameOverPanel) {
            this._scene.showGameOverPanel(data);
        }
    },

    _clubShowTipBlock() {
        if (!TexasUtils._getClub()) {
            return;
        }

        let gameStart = TexasData._getGameStart();//游戏开始状态
        let isCanStart = this._scene.TexasPlayerController._checkGameCanStart(gameStart);//检测游戏可开始
        let info = UserInfo.getInfo();
        let selfSitId = this._scene.TexasPlayerController._getSitId("nUserId", info.nUserID);

        if (!isCanStart && !gameStart) {
            // this._scene.clubTableInfo.string = ""
            if (selfSitId) {
                // let text = TexasUtils._getText(5);
                // this._scene.tipBlock.getChildByName("label").getComponent(cc.Label).string = text;
                if (this._scene.TexasTableStop.nStartGame.active) {
                    this._scene.tipBlock.active = false;
                } else {
                    this._scene.tipBlock.active = true;
                }
            } else {
                this._scene.tipBlock.active = false;
            }
        } else {

            this._scene.tipBlock.active = false;
        }
    },

    //比赛信息变化 通知
    _onMInfoNotify(data) {
        cc.warn("比赛信息变化 ", data)
        this._scene.showMttTabelInfo(data.tMInfo);
    },

    //换桌 通知  <可请求触发，或自动触发>
    _onTbChangeNotify(data) {
        cc.warn("换桌 通知 ", data)
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            sTableId: data.sTableId,
        }
        this._reqEnterGame(params)
    },

    //排名 通知  <被淘汰或最后获胜时触发>
    _onOutsNotify(data) {
        cc.warn("排名 通知", data)
        this._scene.showMttRank(true, data);
    },

    //重(增)购窗口打开 通知  <可请求打开，或自动弹出>
    _onRANotify(data) {
        cc.warn("重(增)购窗口打开", data)
        this._scene.showMttBuyChipPanel(true, data)
    },

    //重(增)购 返回
    _onRABuyChip(data) {
        cc.warn("重(增)购 返回", data)
        let str = ""
        if (data.nRlt == 0) {
            str = TexasUtils._getText(210);
            str = Utils.replaceAll(str, "SSS", data.nChip);
            this._scene.showMttTopTip({ isShow: true, tag: 2, content: str })
        } else {

            if (data.nRlt == 1) {
                str = TexasUtils._getText(205);
            } else if (data.nRlt == 2) {
                str = TexasUtils._getText(204);
            } else if (data.nRlt == 3) {
                str = TexasUtils._getText(203);
            } else {
                str = TexasUtils._getText(212);
            }

            this._scene.showMttCenterTip({ text: str })
        }

    },

    _onShowTopFriend(data) {
        if (data) {
            UIFrame.showTopNotification(TopNotificationManager.NotificationTypeEnum.INVITE_FRIEND, data, { duration: 10 })
        }
    },

    _onMttMatchWaitStartNotify(data) {
        cc.warn("mtt比赛准备开始通知", data);
        let str = Utils.replaceAll(data.detail, "XXX", data.sName);
        this._scene.showMttTopTip({ isShow: true, tag: 1, content: data.sName, nRemainT: data.nRemainT, nEventId: data.nEventId })
    },


    reqCutOrLookCards(name) {
        switch (name) {
            case "btnCutCards"://切牌
                TexasUtils._gameReqNotify("切牌请求", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCutCardReq_CMD, { nIndex: 2, nIsStart: true });
                break;
            case "btnLookCommonCards"://发发看
                TexasUtils._gameReqNotify("发发看请求", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCardOpenReq_CMD, {});
                break;
            case "btnLookOtherCards"://偷偷看
                TexasUtils._gameReqNotify("偷偷看请求", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouHandCardReq_CMD, {});
                break;
            default:
                break;
        }
    },

    _onRspClubConfig(data) {
        if (data && data.sClubConfig && data.sClubConfig != "") {
            let config = JSON.parse(data.sClubConfig);
            TexasData._setClubConfig(config.transferOpen);
        }
    },

    _onBuyNotify(data) {
        cc.log("俱乐部购买通知 ", data);
        let npos = data.nPos;
        let seat = this._scene.TexasPlayerController._getSeat("nSitId", npos);
        let texasPlayer = this._scene.TexasPlayerController._getTexasPlayer(seat);
        if (texasPlayer) {
            texasPlayer.changePlayerInfo({
                nBalance: data.nBalance,
            });
        }
    },

    _onLeaveNotify(data) {
        cc.log("用户离开房间通知", data);
        let nName = Base64.decode(data.nName);
        UIFrame.showTips(nName + "离开房间");
    },

    _onEnterNotify(data) {
        let nName = Base64.decode(data.nName);
        cc.log("用户进入房间通知", data);
        UIFrame.showTips(nName + "进入房间");
    },

    reqCutCardsOver(index) {
        TexasUtils._gameReqNotify("切牌结束请求", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCutCardReq_CMD, { nIndex: index, nIsStart: false });
    }
});