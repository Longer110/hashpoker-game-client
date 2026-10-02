let CMD = require('protocol_club');
let MSG = require('Msg_club');
let protobufPack = require("proto_club");
let baseRequest = require("request");
let Request = baseRequest.getRequest();

let MapGame = new Map;
let MapMTTGame = new Map;
Request.set(CMD.GAME_CLUB.value, MapGame);
Request.set(CMD.GAME_CLUB_MTT.value, MapMTTGame);

//协议请求处理
!function () {
    let setupMap = function (map, protoKey, protoObject) {
        map.set(CMD.GAME_CLUB[protoKey], function (data) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let message = protoObject.create(data);
            let buffer = protoObject.encode(message).finish();
            return buffer;
        })
    }

    let Handle = function (protoKey, protoObject, mainCmd) {
        if (!protoObject) {
            QYLogs.error("protocol_club,解析体不存在" + protoKey);
        }
        
        if(mainCmd==CMD.GAME_CLUB.value){
            setupMap(MapGame, protoKey, protoObject);
        }
        else{
            setupMap(MapGame, protoKey, protoObject);
        }
    }

    let HandleMtt = function (protoKey, protoObject) {
        if (!protoObject) {
            QYLogs.error("protocol_club,解析体不存在" + protoKey);
        }
        MapMTTGame.set(CMD.GAME_CLUB_MTT[protoKey], function (data) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let message = protoObject.create(data);
            let buffer = protoObject.encode(message).finish();
            return buffer;
        })
    }

    //登陆请求
    Handle("ClubSLogOnReq_CMD", protobufPack.ClubSLogOnReq, CMD.GAME_CLUB.value);
    //切换俱乐部请求
    Handle("ClubSSwitchReq_CMD", protobufPack.ClubSSwitchReq, CMD.GAME_CLUB.value);
    //创建俱乐部请求
    Handle("ClubSCreateReq_CMD", protobufPack.ClubSCreateReq, CMD.GAME_CLUB.value);
    //搜索俱乐部请求
    Handle("ClubSSearchReq_CMD", protobufPack.ClubSSearchReq, CMD.GAME_CLUB.value);
    //申请加入俱乐部请求
    Handle("ClubSApplyReq_CMD", protobufPack.ClubSApplyReq, CMD.GAME_CLUB.value);
    //修改俱乐部信息请求(主席)
    Handle("ClubSChangeInfoReq_CMD", protobufPack.ClubSChangeInfoReq, CMD.GAME_CLUB.value);
    //俱乐部成员请求
    Handle("ClubSMembersReq_CMD", protobufPack.ClubSMembersReq, CMD.GAME_CLUB.value);
    //搜索俱乐部成员请求
    Handle("ClubSSearchMemberReq_CMD", protobufPack.ClubSSearchMemberReq, CMD.GAME_CLUB.value);
    //管理员操作请求(主席,管理员)
    Handle("ClubSOperateReq_CMD", protobufPack.ClubSOperateReq, CMD.GAME_CLUB.value);
    //个人俱乐部币增加退还请求
    Handle("ClubSTransferClubGoldReq_CMD", protobufPack.ClubSTransferClubGoldReq, CMD.GAME_CLUB.value);
    //个人俱乐部币增加退还记录请求
    Handle("ClubSTransferRecordReq_CMD", protobufPack.ClubSTransferRecordReq, CMD.GAME_CLUB.value);
    //俱乐部个人历史牌局请求
    Handle("ClubSPaiJuRecordReq_CMD", protobufPack.ClubSPaiJuRecordReq, CMD.GAME_CLUB.value);
    //俱乐部个人贡献请求(俱乐部收益请求)
    Handle("ClubSContribRecordReq_CMD", protobufPack.ClubSContribRecordReq, CMD.GAME_CLUB.value);
    //俱乐部黑名单请求
    Handle("ClubSBlacklistReq_CMD", protobufPack.ClubSBlacklistReq, CMD.GAME_CLUB.value);
    //黑名单管理操作请求(主席,管理员)
    Handle("ClubSBlacklistMgrReq_CMD", protobufPack.ClubSBlacklistMgrReq, CMD.GAME_CLUB.value);
    //黑名单玩家搜索请求
    Handle("ClubSBlacklistSearchReq_CMD", protobufPack.ClubSBlacklistSearchReq, CMD.GAME_CLUB.value);
    //俱乐部牌桌记录请求
    Handle("ClubSTableRecordReq_CMD", protobufPack.ClubSTableRecordReq, CMD.GAME_CLUB.value);
    //俱乐部牌桌参与玩家请求
    Handle("ClubSTableUserReq_CMD", protobufPack.ClubSTableUserReq, CMD.GAME_CLUB.value);
    //俱乐部成员信息请求
    Handle("ClubSMemberInfoReq_CMD", protobufPack.ClubSMemberInfoReq, CMD.GAME_CLUB.value);
    //俱乐部管理员列表请求(主席)
    Handle("ClubSAdminListReq_CMD", protobufPack.ClubSAdminListReq, CMD.GAME_CLUB.value);
    //俱乐部增加删除管理员请求(主席)
    Handle("ClubSAdminMgrReq_CMD", protobufPack.ClubSAdminMgrReq, CMD.GAME_CLUB.value);
    //修改管理员权限请求(主席)
    Handle("ClubSChangeAdminPowerReq_CMD", protobufPack.ClubSChangeAdminPowerReq, CMD.GAME_CLUB.value);
    //俱乐部账户的俱乐部币流水请求
    Handle("ClubSGoldChangeRecordReq_CMD", protobufPack.ClubSGoldChangeRecordReq, CMD.GAME_CLUB.value);
    //俱乐部申请列表请求(主席,管理员)
    Handle("ClubSApplyListReq_CMD", protobufPack.ClubSApplyListReq, CMD.GAME_CLUB.value);
    //俱乐部申请处理请求(主席,管理员)
    Handle("ClubSApplyHandleReq_CMD", protobufPack.ClubSApplyHandleReq, CMD.GAME_CLUB.value);
    //邀请用户请求(主席,管理员)
    Handle("ClubSInviteUserReq_CMD", protobufPack.ClubSInviteUserReq, CMD.GAME_CLUB.value);
    //搜索用户请求(在所有注册玩家里搜索)
    Handle("ClubSSearchUserReq_CMD", protobufPack.ClubSSearchUserReq, CMD.GAME_CLUB.value);
    //玩家个人信息请求
    Handle("ClubSUserInfoReq_CMD", protobufPack.ClubSUserInfoReq, CMD.GAME_CLUB.value);
    //修改玩家个人信息请求
    Handle("ClubSChangeUserInfoReq_CMD", protobufPack.ClubSChangeUserInfoReq, CMD.GAME_CLUB.value);
    //牌谱请求
    Handle("ClubSPaiPuReq_CMD", protobufPack.ClubSPaiPuReq, CMD.GAME_CLUB.value);
    //操作牌谱请求
    Handle("ClubSOpratePaiPuReq_CMD", protobufPack.ClubSOpratePaiPuReq, CMD.GAME_CLUB.value);
    //回放数据请求
    Handle("ClubSPlaybackDataReq_CMD", protobufPack.ClubSPlaybackDataReq, CMD.GAME_CLUB.value);
    //个人通知请求
    Handle("ClubSUserNoticeReq_CMD", protobufPack.ClubSUserNoticeReq, CMD.GAME_CLUB.value);
    //处理个人通知请求
    Handle("ClubSUserNoticeHandleReq_CMD", protobufPack.ClubSUserNoticeHandleReq, CMD.GAME_CLUB.value);
    //获取玩家的俱乐部列表请求
    Handle("ClubSGetUserClubListReq_CMD", protobufPack.ClubSGetUserClubListReq, CMD.GAME_CLUB.value);
    //获取后台配置请求
    Handle("ClubSGetGameParamsReq_CMD", protobufPack.ClubSGetGameParamsReq, CMD.GAME_CLUB.value);
    //俱乐部开桌请求
    Handle("ClubSOpenTableReq_CMD", protobufPack.ClubSOpenTableReq, CMD.GAME_CLUB.value);
    //俱乐部关桌请求
    Handle("ClubSCloseTableReq_CMD", protobufPack.ClubSCloseTableReq, CMD.GAME_CLUB.value);
    //俱乐部牌桌列表请求
    Handle("ClubSGetTableListReq_CMD", protobufPack.ClubSGetTableListReq, CMD.GAME_CLUB.value);
    //玩家申请记录请求（玩家个人）
    Handle("ClubSGetApplyListReq_CMD", protobufPack.ClubSGetApplyListReq, CMD.GAME_CLUB.value);
    //玩家申请处理请求（玩家个人）
    Handle("ClubSUserApplyOpReq_CMD", protobufPack.ClubSUserApplyOpReq, CMD.GAME_CLUB.value);
    //修改登录密码请求
    Handle("ClubSChangeLoginPassWardReq_CMD", protobufPack.ClubSChangeLoginPassWardReq, CMD.GAME_CLUB.value);
    //玩家红点数据请求
    Handle("ClubSUserRedDotReq_CMD", protobufPack.ClubSUserRedDotReq, CMD.GAME_CLUB.value);
    //获取牌桌的牌局id请求
    Handle("ClubSGetTablePaiJuIdReq_CMD", protobufPack.ClubSGetTablePaiJuIdReq, CMD.GAME_CLUB.value);
    //请求商&&城配置
    Handle("ClubSGetStoreCfgReq_CMD", protobufPack.ClubSGetStoreCfgReq, CMD.GAME_CLUB.value);
    //请求购##买商品
    Handle("ClubSBuyGoodsReq_CMD", protobufPack.ClubSBuyGoodsReq, CMD.GAME_CLUB.value);
    //设置安全密码开启关闭请求
    Handle("ClubSSetSafePassWardOpenReq_CMD", protobufPack.ClubSSetSafePassWardOpenReq, CMD.GAME_CLUB.value);
    //是否需要安全码校验请求
    Handle("ClubSNeedCheckSafePassWardReq_CMD", protobufPack.ClubSNeedCheckSafePassWardReq, CMD.GAME_CLUB.value);
    //安全密码校验请求
    Handle("ClubSSafePassWardCheckReq_CMD", protobufPack.ClubSSafePassWardCheckReq, CMD.GAME_CLUB.value);
    //获取俱乐部相关配置请求
    Handle("ClubSGetClubConfigReq_CMD", protobufPack.ClubSGetClubConfigReq, CMD.GAME_CLUB.value);
    //获取玩家个人牌桌记录请求
    Handle("ClubSGetPersonTableRecordReq_CMD", protobufPack.ClubSGetPersonTableRecordReq, CMD.GAME_CLUB.value);
    //获取牌桌详细记录请求
    Handle("ClubSGetTableDetailReq_CMD", protobufPack.ClubSGetTableDetailReq, CMD.GAME_CLUB.value);
    //获取牌桌牌谱请求
    Handle("ClubSGetTablePaiPuReq_CMD", protobufPack.ClubSGetTablePaiPuReq, CMD.GAME_CLUB.value);
    //获取牌桌保险明细请求
    Handle("ClubSGetTableInsuranceReq_CMD", protobufPack.ClubSGetTableInsuranceReq, CMD.GAME_CLUB.value);
    //获取牌桌玩家列表请求
    Handle("ClubSGetTableUserListReq_CMD", protobufPack.ClubSGetTableUserListReq, CMD.GAME_CLUB.value);
    //输入兑换码请求
    Handle("ClubSInputRedeemCodeReq_CMD", protobufPack.ClubSInputRedeemCodeReq, CMD.GAME_CLUB.value);
    //获取玩家个人牌桌记录2请求
    Handle("ClubSGetPersonTableRecord2Req_CMD", protobufPack.ClubSGetPersonTableRecord2Req, CMD.GAME_CLUB.value);
    //获取牌桌详细记录请求(永久牌桌)
    Handle("ClubSGetTableDetail2Req_CMD", protobufPack.ClubSGetTableDetail2Req, CMD.GAME_CLUB.value);
    //获取牌桌牌谱2请求
    Handle("ClubSGetTablePaiPu2Req_CMD", protobufPack.ClubSGetTablePaiPu2Req, CMD.GAME_CLUB.value);
    //获取牌桌保险明细2请求
    Handle("ClubSGetTableInsurance2Req_CMD", protobufPack.ClubSGetTableInsurance2Req, CMD.GAME_CLUB.value);
    //获取牌桌玩家列表2请求
    Handle("ClubSGetTableUserList2Req_CMD", protobufPack.ClubSGetTableUserList2Req, CMD.GAME_CLUB.value);
    //牌局明细查询请求
    Handle("ClubSGetPaijuDetailReq_CMD", protobufPack.ClubSGetPaijuDetailReq, CMD.GAME_CLUB.value);
    //请求充#&&值信息
    Handle("ClubSPayInfoReq_CMD", protobufPack.ClubSPayInfoReq, CMD.GAME_CLUB.value);
    //俱乐部广告奖励金请求
    Handle("ClubSAdvertiseMentGoldRep_CMD", protobufPack.ClubSAdvertiseMentGoldRep, CMD.GAME_CLUB.value);

    Handle("ClubSUserMWStringReq_CMD", protobufPack.ClubSUserMWStringReq, CMD.GAME_CLUB.value);
    //前端用文件编码请求
    Handle("ClubsFileConfigReq_CMD", protobufPack.ClubsFileConfigReq, CMD.GAME_CLUB.value);
    //转账方式请求
    Handle("ClubTransferWayReq_CMD", protobufPack.ClubTransferWayReq, CMD.GAME_CLUB.value);
    //充值或提现请求
    Handle("ClubRechargeWithdrawalReq_CMD", protobufPack.ClubRechargeWithdrawalReq, CMD.GAME_CLUB.value);
    //福利活动请求
    Handle("ClubActivityInfoReq_CMD", protobufPack.ClubActivityInfoReq, CMD.GAME_CLUB.value);
    //推荐关系
    Handle("ClubRecommendUserReq_CMD", protobufPack.ClubRecommendUserReq, CMD.GAME_CLUB.value);
    //绑定手机邮箱请求
    Handle("ClubBindReq_CMD", protobufPack.ClubBindReq, CMD.GAME_CLUB.value);
    //领取首冲活动奖励请求
    Handle("ClubFirChargeRewardReq_CMD", protobufPack.ClubFirChargeRewardReq, CMD.GAME_CLUB.value);
    //签到界面信息请求
    Handle("ClubSignInfoReq_CMD", protobufPack.ClubSignInfoReq, CMD.GAME_CLUB.value);
    //签到请求
    Handle("ClubSignReq_CMD", protobufPack.ClubSignReq, CMD.GAME_CLUB.value);
    //分享奖励请求
    Handle("ClubShareRewardReq_CMD", protobufPack.ClubShareRewardReq, CMD.GAME_CLUB.value);
    //领取活动奖励请求
    Handle("ClubDrawActivityRewardReq_CMD", protobufPack.ClubDrawActivityRewardReq, CMD.GAME_CLUB.value);
    //活动配置请求
    Handle("ClubActivityCfgReq_CMD", protobufPack.ClubActivityCfgReq, CMD.GAME_CLUB.value);
    //根据key获取value请求 （通用于从redis拿配置）
    Handle("ClubGetValueByKeyReq_CMD", protobufPack.ClubGetValueByKeyReq, CMD.GAME_CLUB.value);
    //领取绑定奖励 请求
    Handle("ClubGetBindAwardReq_CMD", protobufPack.ClubGetBindAwardReq, CMD.GAME_CLUB.value);
    //充值或提现请求
    Handle("ClubRechargeWithdrawalV2Req_CMD", protobufPack.ClubRechargeWithdrawalV2Req, CMD.GAME_CLUB.value);
    //总用户数请求
    Handle("ClubSumUserCountReq_CMD", protobufPack.ClubSumUserCountReq, CMD.GAME_CLUB.value);

    //获取大厅统计信息请求(大厅 永久牌桌)
    Handle("ClubSGetPersonTableStaticReq_CMD", protobufPack.ClubSGetPersonTableStaticReq, CMD.GAME_CLUB.value);
    //局内消耗列表
    Handle("ClubSGetGameGoldHistoryReq_CMD", protobufPack.ClubSGetGameGoldHistoryReq, CMD.GAME_CLUB.value);
    
    //局外消耗记录
    Handle("ClubSGetGoldHistoryReq_CMD", protobufPack.ClubSGetGoldHistoryReq, CMD.GAME_CLUB.value);


    //充币提币请求记录列表
    Handle("ClubSGetBillRecordReq_CMD", protobufPack.ClubSGetBillRecordReq, CMD.GAME_CLUB.value);

    
    //局内消耗详情
    Handle("ClubSGetGameGoldDetailReq_CMD", protobufPack.ClubSGetGameGoldDetailReq, CMD.GAME_CLUB.value);
    //在线用户请求
    Handle("ClubSOnlineUserReq_CMD", protobufPack.ClubSOnlineUserReq, CMD.GAME_CLUB.value);
    //邀请玩家进入牌局请求
    Handle("ClubSInvitePlayGameReq_CMD", protobufPack.ClubSInvitePlayGameReq, CMD.GAME_CLUB.value);

    //私人房密码校验请求
    Handle("ClubSTablePassReq_CMD", protobufPack.ClubSTablePassReq, CMD.GAME_CLUB.value);
    
    //收到邀请回复
    Handle("ClubSInvitedPlayGameReq_CMD", protobufPack.ClubSInvitedPlayGameReq, CMD.GAME_CLUB.value);

    //可存证hash请求
    Handle("ClubSHashListReq_CMD", protobufPack.ClubSHashListReq, CMD.GAME_CLUB.value);
    //Hash指定局牌序列请求
    Handle("ClubSHashCardReq_CMD", protobufPack.ClubSHashCardReq, CMD.GAME_CLUB.value);
    
    //内部转币请求
    Handle("ClubSGoldTransToUserReq_CMD", protobufPack.ClubSGoldTransToUserReq, CMD.GAME_CLUB.value);

    //标记玩家请求
    Handle("ClubSMarkUserReq_CMD", protobufPack.ClubSMarkUserReq, CMD.GAME_CLUB.value);


    //玩家看手牌和看公共牌请求 (历史记录偷偷看和发发看)
    Handle("ClubSLookCardReq_CMD", protobufPack.ClubSLookCardReq, CMD.GAME_CLUB.value);

    
    
    //MTT 
    //比赛服登陆 请求 
    HandleMtt("TEvtLogonReq_CMD", protobufPack.TEvtLogonReq)
    //赛事列表 请求
    HandleMtt("TEvtEventsOpenReq_CMD", protobufPack.TEvtEventsOpenReq)
    //赛事列表关闭 请求
    HandleMtt("TEvtEventsCloseReq_CMD", protobufPack.TEvtEventsCloseReq)
    //比赛信息=>玩家列表 请求
    HandleMtt("TEvtUsersReq_CMD", protobufPack.TEvtUsersReq)
    //比赛信息=>奖励列表 请求
    HandleMtt("TEvtAwardsReq_CMD", protobufPack.TEvtAwardsReq)
    //报名 请求
    HandleMtt("TEvtSignUpReq_CMD", protobufPack.TEvtSignUpReq)
    //取消报名 请求
    HandleMtt("TEvtSignUpCancelReq_CMD", protobufPack.TEvtSignUpCancelReq)
    //延迟报名 请求
    HandleMtt("TEvtSignUpDReq_CMD", protobufPack.TEvtSignUpDReq)
    //观战 请求
    HandleMtt("TEvtWatchReq_CMD", protobufPack.TEvtWatchReq)
    //进入比赛 请求 (调用后分两情况:1进入倒计时等待,倒计时完后,前端重新调用该请求 2直接进入比赛桌子)
    HandleMtt("TEvtEnterReq_CMD", protobufPack.TEvtEnterReq)
    //入口提示查询 请求
    HandleMtt("TEvtCheckReq_CMD", protobufPack.TEvtCheckReq)
    //退出比赛(弹窗里的;不再进行离线托管) 请求
    HandleMtt("TEvtQuitReq_CMD", protobufPack.TEvtQuitReq)

}();

module.exports = {
    map: Request,

    release: function () {
        delete Request[CMD.GAME_CLUB.value];
        delete Request[CMD.GAME_CLUB_MTT.value];
    }
};