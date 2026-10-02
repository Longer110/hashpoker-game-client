// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let HallClubCacheData = require("HallClubCacheData");
let Base64 = require("base64");
let UIFrame = require("UIFrame");
let i18n = require("i18n");
let UIClubDialog = require("UIClubDialog");
let Utils = require("Utils");
let CMD = require("protocol_club");
let UserInfo = require("UserInfo");
let TAG = "CLUB";
let NotifyCenter = require("NotifyCenter");
let HallClubLogic = require("HallClubLogic");
let Msg_login = require('Msg_login');
let target = NotifyCenter.target;
let event = NotifyCenter.event;
let LocalStorage = require("LocalStorage");

// 

let HallClubControl = cc.Class({
    extends: Object,

    ctor() {
        this._prefabs = [];
    },

    init(uiControl) {
        //----------------------------服务端消息-------------------------
        this.onDestroy();
        // this.uiControl = uiControl;

        //登录返回
        MsgManager.on(MSG.GAME_CLUB.ClubSLogOnResp_CMD, this._onLoginClubCallBack, this);
        //创建俱乐部返回
        MsgManager.on(MSG.GAME_CLUB.ClubSCreateResp_CMD, this._onCreateClubCallBack, this);
        //切换俱乐部返回
        MsgManager.on(MSG.GAME_CLUB.ClubSSwitchResp_CMD, this._onSwitchClubCallBack, this);
        //登录返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetUserClubListResp_CMD, this._onGetUserClubList, this);
        //搜索俱乐部返回
        MsgManager.on(MSG.GAME_CLUB.ClubSSearchResp_CMD, this._onSearchCallBack, this);
        //申请加入俱乐部回复
        MsgManager.on(MSG.GAME_CLUB.ClubSApplyResp_CMD, this._onApplyCallBack, this);
        //俱乐部申请处理返回(主席,管理员)
        MsgManager.on(MSG.GAME_CLUB.ClubSApplyHandleResp_CMD, this._onApplyHandleCallBack, this);
        //俱乐部申请列表返回
        MsgManager.on(MSG.GAME_CLUB.ClubSApplyListResp_CMD, this._onApplyListCallBack, this);
        //俱乐部成员回复
        MsgManager.on(MSG.GAME_CLUB.ClubSMembersResp_CMD, this._onMembersCallBack, this);
        //俱乐部成员信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSMemberInfoResp_CMD, this._onMemberInfoCallBack, this);
        //俱乐部成员信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSSearchMemberResp_CMD, this._onSearchMember, this);
        //修改俱乐部信息回复(主席)
        MsgManager.on(MSG.GAME_CLUB.ClubSChangeInfoResp_CMD, this._onChangInfoCallBack, this);
        //俱乐部场景信息改变通知
        MsgManager.on(MSG.GAME_CLUB.ClubSSceneChangeNotify_CMD, this._onSceneChangCallBack, this);
        //俱乐部管理员列表返回
        MsgManager.on(MSG.GAME_CLUB.ClubSAdminListResp_CMD, this._onAdminListCallBack, this);
        //俱乐部增加删除管理员返回
        MsgManager.on(MSG.GAME_CLUB.ClubSAdminMgrResp_CMD, this._onAdminMgrCallBack, this);
        //修改管理员权限返回
        MsgManager.on(MSG.GAME_CLUB.ClubSChangeAdminPowerResp_CMD, this._onChangeAdminPowerCallBack, this);
        //俱乐部黑名单回复
        MsgManager.on(MSG.GAME_CLUB.ClubSBlacklistResp_CMD, this._onBlackListCallBack, this);
        //黑名单玩家搜索返回
        MsgManager.on(MSG.GAME_CLUB.ClubSBlacklistSearchResp_CMD, this._onBlackListSearchCallBack, this);
        //黑名单管理操作返回
        MsgManager.on(MSG.GAME_CLUB.ClubSBlacklistMgrResp_CMD, this._onBalckListMgrCallBack, this);
        //管理员操作返回
        MsgManager.on(MSG.GAME_CLUB.ClubSOperateResp_CMD, this._onOprateCallBack, this);
        //个人俱乐部币增加退还回复
        MsgManager.on(MSG.GAME_CLUB.ClubSTransferClubGoldResp_CMD, this._onTransferClubGoldCallBack, this);
        //个人俱乐部币增加退还记录回复
        MsgManager.on(MSG.GAME_CLUB.ClubSTransferRecordResp_CMD, this._onTransferRecordCallBack, this);
        //俱乐部玩家信息改变通知
        MsgManager.on(MSG.GAME_CLUB.ClubSUserInfoChangeNotify_CMD, this._onUserInfoChangeNotifyCallBack, this);
        //俱乐部账户的俱乐部币流水返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGoldChangeRecordResp_CMD, this._onGoldChangeRecordCallBack, this);
        //邀请用户返回
        MsgManager.on(MSG.GAME_CLUB.ClubSInviteUserResp_CMD, this._onInviteUserCallBack, this);
        //搜索用户返回
        MsgManager.on(MSG.GAME_CLUB.ClubSSearchUserResp_CMD, this._onSearchUserCallBack, this);
        //俱乐部个人贡献返回(俱乐部收益请求)
        MsgManager.on(MSG.GAME_CLUB.ClubSContribRecordResp_CMD, this._onContribRecordCallBack, this);
        //获取后台配置返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetGameParamsResp_CMD, this._onGetgameParamsCallBack, this);
        //俱乐部开桌返回
        MsgManager.on(MSG.GAME_CLUB.ClubSOpenTableResp_CMD, this._onOpenTableCallBack, this);
        //俱乐部开桌通知
        MsgManager.on(MSG.GAME_CLUB.ClubSOpenTableNotify_CMD, this._onOpenTableNotifyCallBack, this);
        //俱乐部关桌返回
        MsgManager.on(MSG.GAME_CLUB.ClubSCloseTableResp_CMD, this._onCloseTableCallBack, this);
        //俱乐部关桌通知
        MsgManager.on(MSG.GAME_CLUB.ClubSCloseTableNotify_CMD, this._onCloseTableNotifyCallBack, this);
        //俱乐部牌桌列表返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTableListResp_CMD, this._onGetTableListCallBack, this);
        //俱乐部牌桌信息变化通知
        MsgManager.on(MSG.GAME_CLUB.ClubSTableInfoNotify_CMD, this._onTableInfoNotifyCallBack, this);
        //俱乐部关闭通知
        MsgManager.on(MSG.GAME_CLUB.ClubSCloseNotify_CMD, this._onClubCloseNotifyCallBack, this);
        //踢出俱乐部通知
        MsgManager.on(MSG.GAME_CLUB.ClubSKickOutNotify_CMD, this._onKickOutNotifyCallBack, this);
        //玩家消息通知(非俱乐部)
        MsgManager.on(MSG.GAME_CLUB.ClubSUserMsgNotify_CMD, this._onUserMsgNotifyCallBack, this);
        //俱乐部牌桌记录返回
        MsgManager.on(MSG.GAME_CLUB.ClubSTableRecordResp_CMD, this._onTableRecordCallBack, this);
        //俱乐部牌桌参与玩家返回
        MsgManager.on(MSG.GAME_CLUB.ClubSTableUserResp_CMD, this._onTableUserCallBack, this);
        //牌谱返回
        MsgManager.on(MSG.GAME_CLUB.ClubSPaiPuResp_CMD, this._onPaiPuCallBack, this);
        //操作牌谱返回
        MsgManager.on(MSG.GAME_CLUB.ClubSOpratePaiPuResp_CMD, this._onOpratePaiPuCallBack, this);
        //回放数据返回
        MsgManager.on(MSG.GAME_CLUB.ClubSPlaybackDataResp_CMD, this._onPlaybackDataCallBack, this);
        //俱乐部个人历史牌局返回
        MsgManager.on(MSG.GAME_CLUB.ClubSPaiJuRecordResp_CMD, this._onPaijuRecordCallBack, this);
        //个人通知返回
        MsgManager.on(MSG.GAME_CLUB.ClubSUserNoticeResp_CMD, this._onUserNoticeCallBack, this);
        //处理个人通知返回
        MsgManager.on(MSG.GAME_CLUB.ClubSUserNoticeHandleResp_CMD, this._onUserNoticeHandleCallBack, this);
        //玩家申请处理返回（玩家个人）
        MsgManager.on(MSG.GAME_CLUB.ClubSUserApplyOpResp_CMD, this._onUserApplyOpCallBack, this);
        //玩家俱乐部币申请记录返回（玩家个人）
        MsgManager.on(MSG.GAME_CLUB.ClubSGetApplyListResp_CMD, this._onGetApplyListCallBack, this);
        //玩家个人信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSUserInfoResp_CMD, this._onUserInfoCallBack, this);
        //修改玩家个人信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSChangeUserInfoResp_CMD, this._onChangeUserInfoCallBack, this);
        //修改登录密码返回
        MsgManager.on(MSG.GAME_CLUB.ClubSChangeLoginPassWardResp_CMD, this._onChangeLoginPswCallBack, this);
        //玩家红点信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSUserRedDotResp_CMD, this._onUserRedDotCallBack, this);
        //服务器维护通知(需要重新登录俱乐部)
        MsgManager.on(MSG.GAME_CLUB.ClubSMaintenanceNotify_CMD, this._onMaintenanceNotifyCallBack, this);
        //获取牌桌的牌局id返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTablePaiJuIdResp_CMD, this._onGetTablePaijuIdCallBack, this);
        //请求商城信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetStoreCfgRep_CMD, this._onGetStoreCfgCallBack, this);
        //购买商品返回
        MsgManager.on(MSG.GAME_CLUB.ClubSBuyGoodsRep_CMD, this._onBuyGoodsCallBack, this);
        //支付结果返回
        MsgManager.on(MSG.GAME_CLUB.ClubSPayResultRep_CMD, this._onPayResultCallBack, this);
        //安全密码返回
        MsgManager.on(MSG.GAME_CLUB.ClubSSetSafePassWardOpenResp_CMD, this._onSetSecurityPswBack, this);
	    //是否需要安全码校验返回 
        MsgManager.on(MSG.GAME_CLUB.ClubSNeedCheckSafePassWardResp_CMD, this._onNeedCheckSafePswBack, this);
        //二次安全码校验返回 
        MsgManager.on(MSG.GAME_CLUB.ClubSSafePassWardCheckResp_CMD, this._onCheckSafePswBack, this);
        //获取俱乐部相关配置返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetClubConfigResp_CMD, this._onGetClubConfigCallBack, this);
        //玩家个人信息通知
        MsgManager.on(MSG.GAME_CLUB.ClubSPersonInfoNotify_CMD, this._onPersonInfoCallBack, this);
        //获取玩家个人牌桌记录返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetPersonTableRecordRsp_CMD, this._onGetPersonTableRecord, this);
        //获取牌桌详细记录返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTableDetailRsp_CMD, this._onGetTabelDetailCallBack, this);
        //获取牌桌牌谱返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTablePaiPuRsp_CMD, this._onGetTablePaipuCallBack, this);
        //获取牌桌保险明细返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTableInsuranceRsp_CMD, this._onGetTableInsuranceCallBack, this);
        //获取牌桌玩家列表返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTableUserListRsp_CMD, this._onGetTableUserListCallBack, this);
        //输入兑换码返回
        MsgManager.on(MSG.GAME_CLUB.ClubSInputRedeemCodeRsp_CMD, this._onInputRedeemCodeCallBack, this);
        //获取玩家个人牌桌记录2返回(大厅 永久牌桌)
        MsgManager.on(MSG.GAME_CLUB.ClubSGetPersonTableRecord2Rsp_CMD, this._onGetPersonTableRecord, this);
        //获取玩家个人牌桌记录2返回(大厅 永久牌桌) new
        MsgManager.on(MSG.GAME_CLUB.ClubSGetPersonTableStaticRsp_CMD, this._onClubSGetPersonTableCallBack, this);
        //获取牌桌详细记录2返回(大厅 永久牌桌)
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTableDetail2Rsp_CMD, this._onGetTabelDetailCallBack, this);
        //获取牌桌牌谱2返回(大厅 永久牌桌)
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTablePaiPu2Rsp_CMD, this._onGetTablePaipuCallBack, this);
        //获取牌桌保险明细2返回(大厅 永久牌桌)
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTableInsurance2Rsp_CMD, this._onGetTableInsuranceCallBack, this);
        //获取牌桌玩家列表2请求
        MsgManager.on(MSG.GAME_CLUB.ClubSGetTableUserList2Rsp_CMD, this._onGetTableUserListCallBack, this);
        //牌局明细查询返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGetPaijuDetailRsp_CMD, this._onGetPaijuDetailCallBack, this);
        //re信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSPayInfoRep_CMD, this._onPayInfoCallBack, this);
        //用户tx信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSWithDrawGoldRep_CMD, this._onCashInfoCallBack, this);
        //俱乐部广告奖励金返回
        MsgManager.on(MSG.GAME_CLUB.ClubSAdvertiseMentGoldRsp_CMD, this._onAdvertiseMentGoldCallBack, this);
        MsgManager.on(MSG.GAME_CLUB.ClubSUserMWStringRsp_CMD, this._onUserMwStringCallBack, this);
        //前端用文件编码返回
        MsgManager.on(MSG.GAME_CLUB.ClubsFileConfigRsp_CMD, this._onFildeConfigCallBack, this);
        //转账方式返回
        MsgManager.on(MSG.GAME_CLUB.ClubTransferWayRsp_CMD, this._onTWCallBack, this);
        //充值或提现返回
        MsgManager.on(MSG.GAME_CLUB.ClubRechargeWithdrawalRsp_CMD, this._onRWCallBack, this);
        //福利活动返回
        MsgManager.on(MSG.GAME_CLUB.ClubActivityInfoRsp_CMD, this._onActivityInfoCallBack, this);
        //绑定手机或邮箱
        MsgManager.on(MSG.GAME_CLUB.ClubBindRsp_CMD, this._onBindCallBack, this);
        //领取首冲活动奖励回复
        MsgManager.on(MSG.GAME_CLUB.ClubFirChargeRewardRsp_CMD, this._onFirstChargeRewardCallBack, this);
        //分享奖励返回
        MsgManager.on(MSG.GAME_CLUB.ClubShareRewardRsp_CMD, this._onShareRewardCallBack, this);
        //签到界面信息返回
        MsgManager.on(MSG.GAME_CLUB.ClubSignInfoRsp_CMD, this._onSignInfoCallBack, this);
        //签到返回
        MsgManager.on(MSG.GAME_CLUB.ClubSignRsp_CMD, this._onSignCallBack, this);
        //领取活动奖励返回
        MsgManager.on(MSG.GAME_CLUB.ClubDrawActivityRewardRsp_CMD, this._onDrawActivityRewardCallBack, this);
        //领取活动奖励返回
        MsgManager.on(MSG.GAME_CLUB.ClubActivityCfgRsp_CMD, this._onActivityCfgCallBack, this);
        //根据key获取value请求 （通用于从redis拿配置）
        MsgManager.on(MSG.GAME_CLUB.ClubGetValueByKeyRsp_CMD, this._onGetValueByKeyCallBack, this);
        //领取绑定奖励
        MsgManager.on(MSG.GAME_CLUB.ClubGetBindAwardRsp_CMD, this._onGetBindAwardCallBack, this);
        ///总用户数返回
        MsgManager.on(MSG.GAME_CLUB.ClubSumUserCountRsp_CMD, this._onGetClubSumUserCountCallBack, this);

        //局内消耗数据列表
        MsgManager.on(MSG.GAME_CLUB.ClubSGetGameGoldHistoryRsp_CMD, this._onClubSGetGameGoldHistoryCallBack, this);

         //局外消耗数据列表
        MsgManager.on(MSG.GAME_CLUB.ClubSGetGoldHistoryRsp_CMD, this._onClubSGetGoldHistoryRspCallBack, this);

        //充币提币数据列表
        MsgManager.on(MSG.GAME_CLUB.ClubSGetBillRecordRsp_CMD, this._onClubSGetBillRecordRspCallBack, this);
        
        //局内消耗详情
        MsgManager.on(MSG.GAME_CLUB.ClubSGetGameGoldDetailRsp_CMD, this._onClubSGetGameGoldDetailRspCallBack, this);
        //在线用户返回
        MsgManager.on(MSG.GAME_CLUB.ClubSOnlineUserRsp_CMD, this._onClubSOnlineUserCallBack, this);
        //邀请玩家进入牌局返回
        MsgManager.on(MSG.GAME_CLUB.ClubSInvitePlayGameRsp_CMD, this._onClubSInvitePlayGameCallBack, this);
        //收到邀请通知
        MsgManager.on(MSG.GAME_CLUB.ClubSInvitedPlayGameRsp_CMD, this._onClubSInvitedPlayGameCallBack, this);
        
        //可存证hash请求返回
        MsgManager.on(MSG.GAME_CLUB.ClubSHashListRsp_CMD, this._onClubSHashListCallBack, this);
        //Hash指定局牌序列请求
        MsgManager.on(MSG.GAME_CLUB.ClubSHashCardRsp_CMD, this._onClubSHashCardCallBack, this);
        
        //内部转币返回
        MsgManager.on(MSG.GAME_CLUB.ClubSGoldTransToUserRsp_CMD, this._onClubSGoldTransToUserRspCallBack, this);

        //玩家标记回复
        MsgManager.on(MSG.GAME_CLUB.ClubSMarkUserRsp_CMD, this._onClubSMarkUserRspRspCallBack, this);

        //玩家看手牌和看公共牌返回 （历史记录偷偷看和发发看）
        MsgManager.on(MSG.GAME_CLUB.ClubSLookCardRsp_CMD, this._onClubSLookCardRspCallBack, this);

        //黑名单踢出
        MsgManager.on(MSG.GAME_CLUB.ClubSWebKickOutNotify_CMD, this._onClubSWebKickOutNotify, this)

        //改名次数通知
        MsgManager.on(MSG.GAME_CLUB.ClubSNameCountNotify_CMD, this._onClubSNameCountNotifyCallBack, this);

        target.on(event.SERVER_LOGIN_SUCCESS, this._onLoginSuccess, this);
        target.on(event.HALL_LOGIN_SUCCESS, this._onHallLoginSuccess, this);

        MsgManager.on(Msg_login.GATEWAY.SUB_CORR_CAPITAL, this._onCorrCapital, this);//网关金币更新
    },


    onDestroy() {
        MsgManager.un(this._onGetBindAwardCallBack);
        MsgManager.un(this._onGetValueByKeyCallBack);
        MsgManager.un(this._onActivityCfgCallBack);
        MsgManager.un(this._onDrawActivityRewardCallBack);
        MsgManager.un(this._onSignCallBack);
        MsgManager.un(this._onSignInfoCallBack);
        MsgManager.un(this._onShareRewardCallBack);
        MsgManager.un(this._onFirstChargeRewardCallBack);
        MsgManager.un(this._onBindCallBack);
        MsgManager.un(this._onLoginClubCallBack);
        MsgManager.un(this._onCreateClubCallBack);
        MsgManager.un(this._onGetUserClubList);
        MsgManager.un(this._onSwitchClubCallBack);
        MsgManager.un(this._onSearchCallBack);
        MsgManager.un(this._onApplyCallBack);
        MsgManager.un(this._onApplyListCallBack);
        MsgManager.un(this._onApplyHandleCallBack);
        MsgManager.un(this._onMembersCallBack);
        MsgManager.un(this._onMemberInfoCallBack);
        MsgManager.un(this._onSearchMember);
        MsgManager.un(this._onChangInfoCallBack);
        MsgManager.un(this._onSceneChangCallBack);
        MsgManager.un(this._onAdminListCallBack);
        MsgManager.un(this._onAdminMgrCallBack);
        MsgManager.un(this._onChangeAdminPowerCallBack);
        MsgManager.un(this._onBlackListCallBack);
        MsgManager.un(this._onBlackListSearchCallBack);
        MsgManager.un(this._onBalckListMgrCallBack);
        MsgManager.un(this._onOprateCallBack);
        MsgManager.un(this._onTransferClubGoldCallBack);
        MsgManager.un(this._onTransferRecordCallBack);
        MsgManager.un(this._onUserInfoChangeNotifyCallBack);
        MsgManager.un(this._onGoldChangeRecordCallBack);
        MsgManager.un(this._onInviteUserCallBack);
        MsgManager.un(this._onSearchUserCallBack);
        MsgManager.un(this._onContribRecordCallBack);
        MsgManager.un(this._onGetgameParamsCallBack);
        MsgManager.un(this._onOpenTableCallBack);
        MsgManager.un(this._onOpenTableNotifyCallBack);
        MsgManager.un(this._onCloseTableCallBack);
        MsgManager.un(this._onCloseTableNotifyCallBack);
        MsgManager.un(this._onGetTableListCallBack);
        MsgManager.un(this._onTableInfoNotifyCallBack);
        MsgManager.un(this._onClubCloseNotifyCallBack);
        MsgManager.un(this._onKickOutNotifyCallBack);
        MsgManager.un(this._onUserMsgNotifyCallBack);
        MsgManager.un(this._onTableRecordCallBack);
        MsgManager.un(this._onTableUserCallBack);
        MsgManager.un(this._onPaiPuCallBack);
        MsgManager.un(this._onOpratePaiPuCallBack);
        MsgManager.un(this._onPlaybackDataCallBack);
        MsgManager.un(this._onPaijuRecordCallBack);
        MsgManager.un(this._onUserNoticeCallBack);
        MsgManager.un(this._onUserNoticeHandleCallBack);
        MsgManager.un(this._onUserApplyOpCallBack);
        MsgManager.un(this._onGetApplyListCallBack);
        MsgManager.un(this._onUserInfoCallBack);
        MsgManager.un(this._onChangeUserInfoCallBack);
        MsgManager.un(this._onChangeLoginPswCallBack);
        MsgManager.un(this._onUserRedDotCallBack);
        MsgManager.un(this._onMaintenanceNotifyCallBack);
        MsgManager.un(this._onGetTablePaijuIdCallBack);
        MsgManager.un(this._onGetStoreCfgCallBack);
        MsgManager.un(this._onBuyGoodsCallBack);
        MsgManager.un(this._onPayResultCallBack);
        MsgManager.un(this._onSetSecurityPswBack);
	    MsgManager.un(this._onNeedCheckSafePswBack);
        MsgManager.un(this._onCheckSafePswBack);
        MsgManager.un(this._onGetClubConfigCallBack);
        MsgManager.un(this._onPersonInfoCallBack);
        MsgManager.un(this._onGetPersonTableRecord);
        MsgManager.un(this._onClubSGetPersonTableCallBack);
        MsgManager.un(this._onGetTabelDetailCallBack);
        MsgManager.un(this._onGetTablePaipuCallBack);
        MsgManager.un(this._onGetTableInsuranceCallBack);
        MsgManager.un(this._onGetTableUserListCallBack);
        MsgManager.un(this._onInputRedeemCodeCallBack);
        MsgManager.un(this._onGetPaijuDetailCallBack);
        MsgManager.un(this._onCorrCapital);
        MsgManager.un(this._onPayInfoCallBack);
        MsgManager.un(this._onCashInfoCallBack);
        MsgManager.un(this._onAdvertiseMentGoldCallBack);
        MsgManager.un(this._onUserMwStringCallBack);
        MsgManager.un(this._onFildeConfigCallBack);
        MsgManager.un(this._onTWCallBack);
        MsgManager.un(this._onRWCallBack);
        MsgManager.un(this._onActivityInfoCallBack);
        MsgManager.un(this._onGetClubSumUserCountCallBack);
        MsgManager.un(this._onClubSGetGameGoldHistoryCallBack);
        MsgManager.un(this._onClubSGetGameGoldDetailRspCallBack);
        MsgManager.un(this._onClubSOnlineUserCallBack);
        MsgManager.un(this._onClubSInvitePlayGameCallBack);
        MsgManager.un(this._onClubSInvitedPlayGameCallBack);

        MsgManager.un(this._onClubSHashListCallBack);
        MsgManager.un(this._onClubSHashCardCallBack);

        MsgManager.un(this._onClubSWebKickOutNotify);

        MsgManager.un(this._onClubSGoldTransToUserRspCallBack);

        MsgManager.un(this._onClubSNameCountNotifyCallBack);
        MsgManager.un(this._onClubSGetGoldHistoryRspCallBack);
        MsgManager.un(this._onClubSGetBillRecordRspCallBack);
        
        

        target.targetOff(this);

        this.checkPswInfoData = {};
        this.loginCallBack = null;
        this.closeTableCallBack = null;
        this.tableListCallBack = null;
    },

//------------------------------请求服务器-------------------
    loginClub(clubId, callBack){
        this.loginCallBack = callBack;
        if (!clubId){
            clubId = UserInfo.getInfo().nClubId;
        }

        if (clubId == null){
            clubId = HallClubLogic.getCanLoginClubId();
        }

        if (clubId == null){
            //-1表示没有大厅也没有俱乐部
            clubId = -1;
        }

        let params = {
            nUserId: UserInfo.getInfo().nUserID,
            nClubId: clubId,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSLogOnReq_CMD, params);
    },

    requestClubList(){
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetUserClubListReq_CMD, params);
    },

    requestClubTableList(index, clubId, callBack){
        this.tableListCallBack = callBack;
        let params = {
            nClubId: clubId,
            nCnt: 20,
            nTableIndex: index,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetTableListReq_CMD, params);
    },

    closeTable(nClubId, sTableId, callBack){
        this.closeTableCallBack = callBack;
        let params = {
            nClubId: nClubId,
            sTableId: sTableId,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSCloseTableReq_CMD, params);
    },

    requestTalblePaiJuId(sendData, callBack){
        this.tPaiJuIdCallBack = callBack;
        let params = {
            sTableId: sendData.sTableId,
        }

        if (sendData.nCnt)
        {
            params.nCnt = sendData.nCnt
        }

        if (sendData.nPage)
        {
            params.nPage = sendData.nPage
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetTablePaiJuIdReq_CMD, params);
    },

    requestPlaybackData(sPaiJuId, callBack){
        this.playbackDataCallBack = callBack;
        let params = {
            sPaiJuID: sPaiJuId,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSPlaybackDataReq_CMD, params);
    },

    requestCheckSecurityPsw(key, value, callBack, cancelCallBack) { //1、key值 2、参数 3、需要验证（进行下一步 4 取消操作回调
        let data = {
            value: value,
            callBack: callBack,
            cancelCallBack: cancelCallBack,
        }
        this.checkPswInfoData[key] = data;

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSNeedCheckSafePassWardReq_CMD, {sKey: key});
    },

//------------------------------请求服务器-------------------

    //登录大厅成功
    _onHallLoginSuccess(data){
     	if (!data) {
            // UIFrame.showTips("登录服务器失败");
            return;
        };
	
        let scene = cc.director.getScene();
        if (scene && scene.name == "main-hall"){
            MsgManager.fire(MSG.NOTIFY.LOGIN_CLUB);
        }else if (HallClubCacheData.getCurLoginClub() != null){
            this.loginClub(HallClubCacheData.getCurLoginClub());
        }
        
    },

    //登录账号成功
    _onLoginSuccess(data){
        this.requestClubList();
    },

    //登录返回
    _onLoginClubCallBack(data){
        QYLogs.warn(TAG, "--------------登录俱乐部返回----------------");
        if (data.nRlt == 0 && data.tScence){
            if (HallClubCacheData._looksLikeBase64Encoded(data.tScence.sClubName)) {
                data.tScence.sClubName = HallClubCacheData.safeDecodeBase64(data.tScence.sClubName);
            }
            HallClubCacheData.setCurClubData(data.tScence);
            HallClubCacheData.setCurLoginClub(data.tScence.nClubId);
            HallClubCacheData.setIsBlindPlayer(data.ifBinging);

        }

        MsgManager.fire(MSG.NOTIFY.ClubSLogOnResp_ui, data);

        if (this.loginCallBack){
            this.loginCallBack(data);
        }
        this.loginCallBack = null;
    },

    //创建俱乐部返回
    _onCreateClubCallBack(data){
        QYLogs.warn(TAG, "--------------创建俱乐部返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSCreateResp_ui, data);
    },

    //获取俱乐部列表
    _onGetUserClubList(data){
        QYLogs.warn(TAG, "--------------获取俱乐部列表----------------");
        for (let i = 0; i < data.arrClub.length; i++) {
            
            if (data.arrClub[i].nClubId == 0){
                data.arrClub[i].sClubName = i18n.t("CLUB_HALL.HALL");
            }else{
                if (HallClubCacheData._looksLikeBase64Encoded(data.arrClub[i].sClubName)) {
                    data.arrClub[i].sClubName = HallClubCacheData.safeDecodeBase64(data.arrClub[i].sClubName);
                }
            }
           
        }

        HallClubCacheData.setClubList(data.arrClub);
        MsgManager.fire(MSG.NOTIFY.ClubSGetUserClubListResp_ui, data);
    },

    //切换俱乐部返回(切换失败才有返回)
    _onSwitchClubCallBack(data){
        QYLogs.warn(TAG, "--------------切换俱乐部返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSSwitchResp_ui, data);
    },

    //搜索俱乐部返回
    _onSearchCallBack(data){
        QYLogs.warn(TAG, "--------------搜索俱乐部返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSSearchResp_ui, data);
    },

    //申请加入俱乐部回复
    _onApplyCallBack(data){
        QYLogs.warn(TAG, "--------------申请加入俱乐部返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSApplyResp_ui, data);
    },

    //俱乐部申请列表返回
    _onApplyListCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部申请列表返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSApplyListResp_ui, data);
    },

    //俱乐部申请处理返回
    _onApplyHandleCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部申请处理返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSApplyHandleResp_ui, data);
    },

    //俱乐部成员返回
    _onMembersCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部成员返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSMembersResp_ui, data);
    },

    //俱乐部成员信息返回
    _onMemberInfoCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部成员信息返回----------------");
        if(data.nRlt == 0){
            MsgManager.fire(MSG.NOTIFY.ClubSMemberInfoReq_ui, data);
        }else if (data.nRlt == 1){
            UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR1"));
        }else if (data.nRlt == 2){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_CLUB_MEMBER2"));
        }
        
    },

    //搜索俱乐部成员返回
    _onSearchMember(data){
        QYLogs.warn(TAG, "--------------搜索俱乐部成员返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSSearchMemberResp_ui, data);
    },

    //修改俱乐部信息回复
    _onChangInfoCallBack(data){
        QYLogs.warn(TAG, "--------------修改俱乐部信息回复----------------");
        if (data.arrRlt.length > 0){
            let result = data.arrRlt[0];
            if (result.nRlt == 0){
                if(result.sKey == "sClubName"){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_CLUB_NAME_SUCCESS"));
                }else if (result.sKey == "sPassWord"){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_CLUB_PSW_SUCCESS"));
                } else{
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_SUCCESS"));
                }
                
            }else{
                if (result.nRlt == 1){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_POWER"));
                }else if (result.nRlt == 2){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_CLUB_NAME_ERROR"));
                }else if (result.nRlt == 3){
                    if(result.sKey == "sClubName"){
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_ERROR1"));
                    }else if (result.sKey == "sPassWord"){
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_ERROR2"));
                    }
                }else if (result.nRlt == 4){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANG_CLUB_PSW_ERROR1"));
                }else if (result.nRlt == 5){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANG_CLUB_PSW_ERROR2"));
                }else if (result.nRlt == 6){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
                }else if (result.nRlt == 7){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CLUB_NAME_LEN"));
                }else if (result.nRlt == 8){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CLUB_NAME_ERROR1"));
                }else if (result.nRlt == 9){
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CLUB_NAME_ERROR2"));
                }
            }
        }
        MsgManager.fire(MSG.NOTIFY.ClubSChangeInfoResp_ui, data);
        
    },

    //俱乐部场景信息改变通知
    _onSceneChangCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部场景信息改变通知----------------");
        let params = JSON.parse(data.sChangeInfo);
        params.nClubId = data.nClubId;
        if (params.hasOwnProperty("sClubName")){
            if (HallClubCacheData._looksLikeBase64Encoded(params.sClubName)) {
                params.sClubName = HallClubCacheData.safeDecodeBase64(params.sClubName);
            }
        }
        HallClubCacheData.sceneChange(params);
        MsgManager.fire(MSG.NOTIFY.ClubSSceneChangeNotify_ui, params);
        
    },

    //俱乐部管理员列表返回
    _onAdminListCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部管理员列表返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSAdminListResp_ui, data);
        
    },

    //俱乐部增加删除管理员返回
    _onAdminMgrCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部增加删除管理员返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSAdminMgrResp_ui, data);
        
    },

    //修改管理员权限返回
    _onChangeAdminPowerCallBack(data){
        QYLogs.warn(TAG, "--------------修改管理员权限返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSChangeAdminPowerResp_ui, data);
        
    },

    //俱乐部黑名单回复
    _onBlackListCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部黑名单回复----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSBlacklistResp_ui, data);
        
    },

    //黑名单玩家搜索返回
    _onBlackListSearchCallBack(data){
        QYLogs.warn(TAG, "--------------黑名单玩家搜索返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSBlacklistSearchResp_ui, data);
        
    },

    //黑名单管理操作返回
    _onBalckListMgrCallBack(data){
        QYLogs.warn(TAG, "--------------黑名单管理操作返回----------------");
        if (data.nRlt == 0){
            if (data.nOpType == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.REMOVE_SUCCESS"));
            }
        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR1"));
            }else if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
            }else if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
            }else if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_POWER"));
            }else if (data.nRlt == 5){
                UIFrame.showTips(i18n.t("CLUB_ERROR.AT_BLACK_LIST"));
            }
        }
        MsgManager.fire(MSG.NOTIFY.ClubSBlacklistMgrResp_ui, data);
        
    },

    //管理员操作返回
    _onOprateCallBack(data){
        QYLogs.warn(TAG, "--------------管理员操作返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSOperateResp_ui, data);
        
    },
    
    //个人俱乐部币增加退还回复
    _onTransferClubGoldCallBack(data){
        QYLogs.warn(TAG, "--------------个人俱乐部币增加退还回复----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSTransferClubGoldResp_ui, data);
        
    },

    //个人俱乐部币增加退还记录回复
    _onTransferRecordCallBack(data){
        QYLogs.warn(TAG, "--------------个人俱乐部币增加退还记录回复----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSTransferRecordResp_ui, data);
        
    },

    //俱乐部玩家信息改变通知
    _onUserInfoChangeNotifyCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部玩家信息改变通知----------------");
        let params = JSON.parse(data.sChangeInfo);
        params.nClubId = data.nClubId;
        params.nUserId = data.nUserId;
        HallClubCacheData.userInfoChange(params);
        MsgManager.fire(MSG.NOTIFY.ClubSUserInfoChangeNotify_ui, params);
        
    },

    //俱乐部账户的俱乐部币流水返回
    _onGoldChangeRecordCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部账户的俱乐部币流水返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGoldChangeRecordResp_ui, data);
        
    },

    //邀请用户返回
    _onInviteUserCallBack(data){
        QYLogs.warn(TAG, "--------------邀请用户返回----------------");
        if (data.nRlt == 0){
            UIFrame.showTips(i18n.t("CLUB_ERROR.INVITE_SUCCESS"));
        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_PRIVATE_CLUB"));
            }else if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_POWER"));
            }else if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR2"));
            }else if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.HAS_INBITE"));
            }else if (data.nRlt == 5){
                UIFrame.showTips(i18n.t("CLUB_ERROR.HAS_CLUB_MEMBER"));
            }else if (data.nRlt == 6){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
            }else if (data.nRlt == 7){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_CLUB_MEMBER"));
            }
        }
        MsgManager.fire(MSG.NOTIFY.ClubSInviteUserResp_ui, data);
    },

    //搜索用户返回
    _onSearchUserCallBack(data){
        QYLogs.warn(TAG, "--------------搜索用户返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSSearchUserResp_ui, data);
        
    },

    //俱乐部个人贡献返回(俱乐部收益请求)
    _onContribRecordCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部个人贡献返回(俱乐部收益请求)----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSContribRecordResp_ui, data);
        
    },

    //获取后台配置返回
    _onGetgameParamsCallBack(data){
        QYLogs.warn(TAG, "--------------获取后台配置返回----------------");
        HallClubCacheData.setCreateGameConfig(data);
        MsgManager.fire(MSG.NOTIFY.ClubSGetGameParamsResp_ui, data);
        
    },

    //俱乐部开桌返回
    _onOpenTableCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部开桌返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSOpenTableResp_ui, data);
        
    },

    //俱乐部开桌通知
    _onOpenTableNotifyCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部开桌通知----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSOpenTableNotify_ui, data);
        
    },

    //俱乐部关桌返回
    _onCloseTableCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部关桌返回----------------");
        // MsgManager.fire(MSG.NOTIFY.ClubSContribRecordResp_ui, data);
        let text = i18n.t("CLUB_ERROR.CLOSE_TABLE_FAIL");
        let params= {
            isUseRichText: true,
            text: text,
            callBack: null,
        }

        if (data.nRlt == 0){
            return;
        }else if (data.nRlt == 1){
            params.text = i18n.t("CLUB_ERROR.DATA_ERROR");
        }else if (data.nRlt == 2){
            params.text = i18n.t("CLUB_ERROR.NOT_HAS_CLUB");
        }else if (data.nRlt == 3){
            params.text = i18n.t("CLUB_ERROR.NOT_POWER");
        }else if (data.nRlt == 4){
            params.text = i18n.t("CLUB_ERROR.NOT_HAS_TABLE");
        }else if (data.nRlt == 5){
            params.text = i18n.t("CLUB_ERROR.SERVER_CLOSE");
        }else if (data.nRlt == 6){
            params.text = i18n.t("CLUB_ERROR.NOT_MAIN_OPEN_TABLE");
        }else if (data.nRlt == 7){
            params.text = i18n.t("CLUB_ERROR.CLOSE_TABLE_ERROR1");
        }else if (data.nRlt == 8){
            params.text = i18n.t("CLUB_ERROR.CLOSE_TABLE_ERROR2");
        }else if (data.nRlt == 9){
            // params.text = i18n.t("CLUB_ERROR.CLOSE_TABLE_ERROR3");
            return;
        }

      
        this.showDialog(params);
        
    },

    //俱乐部关桌通知
    _onCloseTableNotifyCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部关桌通知----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSCloseTableNotify_ui, data);

    },

    //俱乐部牌桌列表返回
    _onGetTableListCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部牌桌列表返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetTableListResp_ui, data);

        if (this.tableListCallBack){
            this.tableListCallBack(data);
        }

        this.tableListCallBack = null;
        
    },

    //俱乐部牌桌信息变化通知
    _onTableInfoNotifyCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部牌桌信息变化通知----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSTableInfoNotify_ui, data);
        
    },

    //俱乐部关闭通知
    _onClubCloseNotifyCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部关闭通知----------------");
        // MsgManager.fire(MSG.NOTIFY.ClubSContribRecordResp_ui, data);
        
    },

    //踢出俱乐部通知
    _onKickOutNotifyCallBack(data){
        QYLogs.warn(TAG, "--------------踢出俱乐部通知----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSKickOutNotify_ui, data);
        let text = i18n.t("CLUB_HALL_TIP.KICK_OUT_CLUB");
        let str = Utils.replaceAll(text, "XXX", Base64.decode(data.sClubName || ""));
        let params= {
            isUseRichText: true,
            text: str,
        }

        this.showDialog(params);

        this.requestClubList();
    },

    //玩家消息通知(非俱乐部)
    _onUserMsgNotifyCallBack(data){
        QYLogs.warn(TAG, "--------------玩家消息通知----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSUserMsgNotify_ui, data);

        if (data.nType == 1){
            //加入俱乐部申请通过
            let text = i18n.t("CLUB_HALL_TIP.ENTER_CLUB_SUCCESS");
            if (data.tApply.nStatus == 2){
                text = i18n.t("CLUB_HALL_TIP.ENTER_CLUB_FAIL");
            }
            let str = Utils.replaceAll(text, "XXX", Base64.decode(data.tClubInfo.sClubName || ""));
            let params= {
                isUseRichText: true,
                text: str,
            }

            this.showDialog(params);
        }
        
    },

    //俱乐部牌桌记录返回
    _onTableRecordCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部牌桌记录返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSTableRecordResp_ui, data);
        
    },

    //俱乐部牌桌参与玩家返回
    _onTableUserCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部牌桌参与玩家返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSTableUserResp_ui, data);
    },

    //牌谱返回
    _onPaiPuCallBack(data){
        QYLogs.warn(TAG, "--------------牌谱返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSPaiPuResp_ui, data);
    },

    //操作牌谱返回
    _onOpratePaiPuCallBack(data){
        QYLogs.warn(TAG, "--------------操作牌谱返回----------------");

        if (data.nRlt == 0){
            if (data.nType == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.COLLECT_PAIJU_SUCCESS"));
            }else{
                UIFrame.showTips(i18n.t("CLUB_ERROR.UNCOLLECT_PAIJU_SUCCESS"));
            }
            
        }else if(data.nRlt == 1 || data.nRlt == 2 || data.nRlt == 3){
            UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_EXIST_PAIJU"));
        }else if (data.nRlt == 4){
            UIFrame.showTips(i18n.t("CLUB_ERROR.HAS_COLLECT_PAIJU"));
        }
        MsgManager.fire(MSG.NOTIFY.ClubSOpratePaiPuResp_ui, data);
    },

    //回放数据返回
    _onPlaybackDataCallBack(data){
        QYLogs.warn(TAG, "--------------回放数据返回----------------");
        if (this.playbackDataCallBack){
            this.playbackDataCallBack(data);
            this.playbackDataCallBack = null;
            return;
        }
        HallClubCacheData.savePlayBackData(data);
        MsgManager.fire(MSG.NOTIFY.ClubSPlaybackDataResp_ui, data);
    },

    //回放数据返回
    _onPaijuRecordCallBack(data){
        QYLogs.warn(TAG, "--------------俱乐部个人历史牌局返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSPaiJuRecordResp_ui, data);
    },

    //个人通知返回
    _onUserNoticeCallBack(data){
        QYLogs.warn(TAG, "--------------个人通知返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSUserNoticeResp_ui, data);
    },

    //处理个人通知返回
    _onUserNoticeHandleCallBack(data){
        QYLogs.warn(TAG, "--------------处理个人通知返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSUserNoticeHandleResp_ui, data);
        if(data.nRlt == 0 && data.nOpType == 1){
            this.requestClubList();
        }
    },

    //玩家申请处理返回（玩家个人）
    _onUserApplyOpCallBack(data){
        QYLogs.warn(TAG, "--------------玩家申请处理返回（玩家个人）----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSUserApplyOpResp_ui, data);
    },

    //玩家俱乐部币申请记录返回（玩家个人）
    _onGetApplyListCallBack(data){
        QYLogs.warn(TAG, "--------------玩家俱乐部币申请记录返回（玩家个人）----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetApplyListResp_ui, data);
    },

    //玩家个人信息返回
    _onUserInfoCallBack(data){
        QYLogs.warn(TAG, "--------------玩家个人信息返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSUserInfoResp_ui, data);

        UserInfo.setInfo({
            nFreeCount: data.tUserInfo.nFreeCount || 0,
            nPrice: data.tUserInfo.nPrice || 0,
        });

        //首次完成返回俱乐部弹出修改昵称界面
        let isFirstRechargeChangeName = LocalStorage.getItem("first_recharge_changename", false);
        if (isFirstRechargeChangeName)
        {
            data.tUserInfo.isRecharge = true
            MsgManager.fire(MSG.NOTIFY.ClubSNameCountNotify_ui, data.tUserInfo);
            LocalStorage.setItem("first_recharge_changename", false)
        }
    },

    //修改玩家个人信息返回
    _onChangeUserInfoCallBack(data){
        QYLogs.warn(TAG, "--------------修改玩家个人信息返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSChangeUserInfoResp_ui, data);
    },

    //修改登录密码返回
    _onChangeLoginPswCallBack(data){
        QYLogs.warn(TAG, "--------------修改登录密码返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSChangeLoginPassWardResp_ui, data);
    },

    //玩家红点信息返回
    _onUserRedDotCallBack(data){
        QYLogs.warn(TAG, "--------------玩家红点信息返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSUserRedDotResp_ui, data);
    },

    //服务器维护通知(需要重新登录俱乐部)
    _onMaintenanceNotifyCallBack(data){
        QYLogs.warn(TAG, "--------------服务器维护通知(需要重新登录俱乐部)----------------");
        let clubId = HallClubCacheData.getCurLoginClub();
        if (clubId == null){
            clubId = HallClubLogic.getCanLoginClubId();
        }
        if (clubId == null){
            clubId = -1
        }

        this.loginClub(clubId);
    },

    //获取牌桌的牌局id返回
    _onGetTablePaijuIdCallBack(data){
        QYLogs.warn(TAG, "--------------获取牌桌的牌局id返回----------------");
        if (this.tPaiJuIdCallBack){
            this.tPaiJuIdCallBack(data);
        }

        if(data.nNowPage == data.nAllPage){
            this.tPaiJuIdCallBack = null;
        }
    },

     //获取商城信息返回
     _onGetStoreCfgCallBack(data){
        QYLogs.warn(TAG, "--------------获取****商####城****信息返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSStoreCfgRep_ui, data);
    },

    //获取购买商品返回
    _onBuyGoodsCallBack(data){
        QYLogs.warn(TAG, "--------------获取****购####买****商####品返回----------------");
        MsgManager.fire(MSG.NOTIFY.CLIB_PAY_RETURN, data);
    },
    
    //支付信息返回
    _onPayResultCallBack(data){
        QYLogs.warn(TAG, "--------------支####付****信息返回----------------");
        MsgManager.fire(MSG.NOTIFY.CLIB_PAY_FINISH, data);
        if (data.nRlt == 0){
            UIFrame.showTips(i18n.t("CLUB_HALL.PAY_SUCCESS"));
        }else{
            UIFrame.showTips(i18n.t("CLUB_HALL.PAY_FAILD"));
        }
    },

     //安全密码开关
     _onSetSecurityPswBack(data){
        QYLogs.warn(TAG, "--------------安全密码开关----------------");
        data['type'] = 'serverBack';
        MsgManager.fire(MSG.NOTIFY.SET_SECURITY_PSW, data);
    },

    //安全密码开关
    _onNeedCheckSafePswBack(data){
        QYLogs.warn(TAG, "--------------是否需要二次验证----------------");
        let isNeedCheck = data.isNeedCheck;
        let key = data.sKey;
        let params = this.checkPswInfoData[key];
        if(isNeedCheck) {
            MsgManager.fire(MSG.NOTIFY.SET_SECURITY_PSW, {type: 'secondSecurityPswConfirm', sKey: key , cancelCallBack: params['cancelCallBack']});
        } else {
            if(params.callBack) {
                params.callBack(params.value);
            }
        }
    },

    //二次验证安全密码返回
    _onCheckSafePswBack(data){
        QYLogs.warn(TAG, "--------------二次验证安全密码返回----------------");
        let key = data.sKey;
        let params = this.checkPswInfoData[key];
        if (data.nRlt == 0){
            // UIFrame.showTips(i18n.t("CLUB_HALL.PAS_CHECK_SUCCESS"));
            
            if(params && params.callBack) {
                params.callBack(params.value);
                this.checkPswInfoData[key] = null;
            }
        } else {
            UIFrame.showTips(i18n.t("CLUB_HALL.PAS_CHECK_FAILD"));
            if(params && params.cancelCallBack) {
                params.cancelCallBack();
                this.checkPswInfoData[key] = null;
            }
        }
    },
    //获取俱乐部相关配置返回
    _onGetClubConfigCallBack(data){
        QYLogs.warn(TAG, "--------------获取俱乐部相关配置返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetClubConfigResp_ui, data);
    },

    _onPersonInfoCallBack(data){
        QYLogs.warn(TAG, "--------------玩家个人信息通知----------------");
        if(data.nUserId == UserInfo.getInfo().nUserID){
            let info = JSON.parse(data.sChangeInfo);
            if (info && info.sFaceId){
                UserInfo.setInfo({
                    strHeadUrl: info.sFaceId,
                    nOpenProtection: info.nOpenProtection,
                    sMail: info.sMail,
                })
                HallClubCacheData.changeHead(info.sFaceId)
            }
            
        }
    },

    //获取玩家个人牌桌记录返回
    _onGetPersonTableRecord(data){
        QYLogs.warn(TAG, "--------------获取玩家个人牌桌记录返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetPersonTableRecordRsp_ui, data);
    },

    
    _onClubSGetPersonTableCallBack(data){
        QYLogs.warn(TAG, "--------------大厅我的牌局信息数据----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetPersonTableStaticRsp_ui, data);
    },

    //获取牌桌详细记录返回
    _onGetTabelDetailCallBack(data){
        QYLogs.warn(TAG, "--------------获取牌桌详细记录返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetTableDetailRsp_ui, data);
    },
    
    //获取牌桌牌谱返回
    _onGetTablePaipuCallBack(data){
        QYLogs.warn(TAG, "--------------获取牌桌牌谱返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetTablePaiPuRsp_ui, data);
    },

    //获取牌桌保险明细返回
    _onGetTableInsuranceCallBack(data){
        QYLogs.warn(TAG, "--------------获取牌桌保险明细返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetTableInsuranceRsp_ui, data);
    },
    
    //获取牌桌玩家列表返回
    _onGetTableUserListCallBack(data){
        QYLogs.warn(TAG, "--------------获取牌桌玩家列表返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetTableUserListRsp_ui, data);
    },

    _onGetPaijuDetailCallBack(data){
        QYLogs.warn(TAG, "--------------获取牌谱详情----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetPaijuDetailRsp_ui, data);
    },

    //re信息返回
    _onPayInfoCallBack(data){
        QYLogs.warn(TAG, "--------------re信息返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSPayInfoRep_ui, data);
    },

    //用户tx信息返回
    _onCashInfoCallBack(data){
        QYLogs.warn(TAG, "--------------用户tx信息返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSCashInfoRep_ui, data);
    },

    //俱乐部广告奖励金返回
    _onAdvertiseMentGoldCallBack(data){
        QYLogs.warn(TAG, "--------------激励广告奖励返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSAdvertiseMentGoldRsp_ui, data);
    },

    _onUserMwStringCallBack(data){
        QYLogs.warn(TAG, "--------------onUserMwStringCallBack----------------");
        if (data.nRlt == 0){
            LocalStorage.setItem("CLUB_MW_STRING" + UserInfo.getInfo().nUserID, 1);
        }
    },

    _onFildeConfigCallBack(data){
        QYLogs.warn(TAG, "--------------_onFildeConfigCallBack----------------");
        HallClubCacheData.setReConfig(data.nConfigCode);
        MsgManager.fire(MSG.NOTIFY.ClubsFileConfigRsp_ui, data);
    },

    _onCorrCapital(data){
        if (!data){
            return;
        }

        if (data.nGold != undefined){
            let params = {};
            params.nClubId = HallClubCacheData.getPlayerData().nClubId;
            params.nGold = data.nGold;
            HallClubCacheData.userInfoChange(params);
            MsgManager.fire(MSG.NOTIFY.ClubSSceneChangeNotify_ui, params);
        }
    },
    
    //输入兑换码返回
    _onInputRedeemCodeCallBack(data){
        QYLogs.warn(TAG, "--------------输入兑换码返回----------------");
        if(data.nRlt == 0 && data.sExData){
            let exData = JSON.parse(data.sExData);
            if (exData){
                if (exData.nItemId == 1){
                    //金币
                    data.nGold = exData.nCount;
                    HallClubCacheData.playerGoldChange(data.nGold);
                }
            }
        }
        MsgManager.fire(MSG.NOTIFY.ClubSInputRedeemCodeRsp_ui, data);
    },

    _onTWCallBack(data){
        HallClubCacheData.setTransferWay(data);
        MsgManager.fire(MSG.NOTIFY.ClubTransferWayRsp_ui, data);
    },

    _onRWCallBack(data){
        MsgManager.fire(MSG.NOTIFY.ClubRechargeWithdrawalRsp_ui, data);
    },

    _onActivityInfoCallBack(data){
        QYLogs.warn(TAG, "--------------活动信息返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubActivityInfoRsp_ui, data);
    },

    _onBindCallBack(data){
        QYLogs.warn(TAG, "--------------绑定手机或邮箱返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubBindRsp_ui, data);
    },

    _onFirstChargeRewardCallBack(data){
        QYLogs.warn(TAG, "--------------领取首冲活动奖励回复----------------");
        MsgManager.fire(MSG.NOTIFY.ClubFirChargeRewardRsp_ui, data);
    },

    _onShareRewardCallBack(data){
        QYLogs.warn(TAG, "--------------分享奖励返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubShareRewardRsp_ui, data);
    },

    _onSignInfoCallBack(data){
        QYLogs.warn(TAG, "--------------签到界面信息----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSignInfoRsp_ui, data);
    },

    _onSignCallBack(data){
        QYLogs.warn(TAG, "--------------签到返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSignRsp_ui, data);
    },

    _onDrawActivityRewardCallBack(data){
        QYLogs.warn(TAG, "--------------领取活动奖励返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubDrawActivityRewardRsp_ui, data);
    },

    _onActivityCfgCallBack(data){
        QYLogs.warn(TAG, "--------------活动配置返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubActivityCfgRsp_ui, data);
    },

    _onGetValueByKeyCallBack(data){
        QYLogs.warn(TAG, "--------------开关----------------");
        MsgManager.fire(MSG.NOTIFY.ClubGetValueByKeyRsp_ui, data);
    },

    _onGetBindAwardCallBack(data){
        QYLogs.warn(TAG, "--------------领取绑定奖励----------------");
        MsgManager.fire(MSG.NOTIFY.ClubGetBindAwardRsp_ui, data);
    },
    
    _onGetClubSumUserCountCallBack(data){
        QYLogs.warn(TAG, "--------------获取俱乐部总人数----------------");
        MsgManager.fire(MSG.NOTIFY.ClubGetClubSumUserCountRsp_ui, data);
    },

    _onClubSGetGameGoldHistoryCallBack(data) {
        QYLogs.warn(TAG, "--------------局内消耗列表----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetGameGoldHistoryRsp_ui, data);
    },

    _onClubSGetGoldHistoryRspCallBack(data) {
        QYLogs.warn(TAG, "--------------其他消耗，转币记录----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetGoldHistoryRsp_ui, data);
    },

    _onClubSGetBillRecordRspCallBack(data) {
        QYLogs.warn(TAG, "--------------充币提币记录----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetBillRecordRsp_ui, data);
    },

    

    _onClubSGetGameGoldDetailRspCallBack(data) {
        QYLogs.warn(TAG, "--------------局内消耗详情----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGetGameGoldDetailRsp_ui, data);
    },

    _onClubSOnlineUserCallBack(data) {
        QYLogs.warn(TAG, "--------------在线用户返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSOnlineUserRsp_ui, data);
    },
    _onClubSInvitePlayGameCallBack(data) {
        QYLogs.warn(TAG, "--------------邀请玩家进入牌局返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSInvitePlayGameRsp_ui, data);
    },
    _onClubSInvitedPlayGameCallBack(data) {
        QYLogs.warn(TAG, "--------------收到邀请返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSInvitedPlayGameRsp_ui, data);
    },

    _onClubSHashListCallBack(data) {
        QYLogs.warn(TAG, "--------------可存证hash请求返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSHashListRsp_ui, data);
    },
    
    _onClubSHashCardCallBack(data) {
        QYLogs.warn(TAG, "--------------Hash指定局牌序列请求返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSHashCardRsp_ui, data);
    },

    _onClubSGoldTransToUserRspCallBack(data) {
        QYLogs.warn(TAG, "--------------内部转币返回----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSGoldTransToUserRsp_ui, data);
    },

    _onClubSMarkUserRspRspCallBack(data) {
        QYLogs.warn(TAG, "--------------玩家标记返回----------------");
        
    },


    _onClubSLookCardRspCallBack(data) {
        QYLogs.warn(TAG, "--------------历史记录偷偷看和发发看----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSLookCardRsp_ui, data);
        
    },

    _onClubSWebKickOutNotify(data) {
        QYLogs.warn(TAG, "--------------黑名单踢出----------------");
        MsgManager.fire(MSG.NOTIFY.ClubSWebKickOutNotify_ui, data);
    },

    _onClubSNameCountNotifyCallBack(notifyData) {
        QYLogs.warn(TAG, "--------------改名次数通知返回----------------");
        
        let data  = 
        {
            isRecharge: notifyData.isRecharge || false,
            nFreeCount: notifyData.nCount || 0,
            nPrice : notifyData.nCost || 0,
            sName : UserInfo.getInfo().strNickName || "",
        }

        UserInfo.setInfo({
            nFreeCount: notifyData.nCount || 0,
            nPrice: notifyData.nCost || 0,
        });

        let isInGame = app.game.getGameID() > 0; //是否在游戏中
        if (data.isRecharge && !isInGame){
            let text = i18n.t("HALL_CHANGE_NAME.1");
            let params = {
                text: text,
                isOKAndCancel: true,
                callBack: function(isOK){
                    if (isOK){
                        if (data.isRecharge){
                            MsgManager.fire(MSG.NOTIFY.ClubSNameCountNotify_ui, data);
                            return;
                        }
                    }
                },
                uiData: { 
                    sureTitle: i18n.t("HALL_CHANGE_NAME.2"),
                    cancelTitle: i18n.t("HALL_CHANGE_NAME.3"),
                },
            }
            this.showDialog(params);
        }
        else
        {
            MsgManager.fire(MSG.NOTIFY.ClubSNameCountNotify_ui, data);
        }
    },


    showDialog(data){
        let path = "popup/dialog/UIDialog";
        app.ClubAssets.ui.loadPopup(path, function (component) {
            cc.director.getScene().addChild(component.node, 1024);

            if (data.isOKAndCancel){
                component.setShowType(UIClubDialog.EShowType.OKCANCEL);
            }else{
                component.setShowType(UIClubDialog.EShowType.OK);
            }

            component.setUIBtnTitle(data.uiData);
            component.show(data.text, function (isOK) {   
                if (data.callBack){
                    data.callBack(isOK);
                }
            }.bind(this), data.isUseRichText);
            component.node.position = cc.Vec2.ZERO;
        }.bind(this), {
            path_resources: "main-common/resources/"
        });
    },



        
            
});


let object = new HallClubControl();
module.exports = object;
