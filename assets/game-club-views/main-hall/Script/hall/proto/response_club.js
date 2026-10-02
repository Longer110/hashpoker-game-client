let CMD = require('protocol_club');
let MSG = require('Msg_club');
let protobufPack = require("proto_club");
let baseResponse = require("response");
let Response = baseResponse.getResponse();

let MapGame = new Map;
let MapMTTGame = new Map;
Response.set(CMD.GAME_CLUB.value, MapGame);
Response.set(CMD.GAME_CLUB_MTT.value, MapMTTGame);


//协议返回处理
!function () {
    let setupMap = function (map, protoKey, protoObject) {
        map.set(CMD.GAME_CLUB[protoKey], function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let msg = MSG.GAME_CLUB[protoKey];
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }
    let Handle = function (protoKey, protoObject, mainCmd) {
        if (!protoObject) {
            QYLogs.error("protocol_club", "解析体不存在" + protoKey);
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
            QYLogs.error("protocol_club", "解析体不存在" + protoKey);
        }
        MapMTTGame.set(CMD.GAME_CLUB_MTT[protoKey], function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let msg = MSG.GAME_CLUB_MTT[protoKey];
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    //返回登录结果
    Handle("ClubSLogOnResp_CMD", protobufPack.ClubSLogOnResp ,CMD.GAME_CLUB.value);
    //创建俱乐部返回
    Handle("ClubSCreateResp_CMD", protobufPack.ClubSCreateResp ,CMD.GAME_CLUB.value);
    //切换俱乐部返回
    Handle("ClubSSwitchResp_CMD", protobufPack.ClubSSwitchResp ,CMD.GAME_CLUB.value);
    //获取玩家的俱乐部列表返回
    Handle("ClubSGetUserClubListResp_CMD", protobufPack.ClubSGetUserClubListResp ,CMD.GAME_CLUB.value);
    //搜索俱乐部回复
    Handle("ClubSSearchResp_CMD", protobufPack.ClubSSearchResp ,CMD.GAME_CLUB.value);
    //申请加入俱乐部回复
    Handle("ClubSApplyResp_CMD", protobufPack.ClubSApplyResp ,CMD.GAME_CLUB.value);
    //修改俱乐部信息回复(主席)
    Handle("ClubSChangeInfoResp_CMD", protobufPack.ClubSChangeInfoResp ,CMD.GAME_CLUB.value);
    //俱乐部成员回复
    Handle("ClubSMembersResp_CMD", protobufPack.ClubSMembersResp ,CMD.GAME_CLUB.value);
    //搜索俱乐部成员返回
    Handle("ClubSSearchMemberResp_CMD", protobufPack.ClubSSearchMemberResp ,CMD.GAME_CLUB.value);
    //管理员操作返回(主席,管理员)
    Handle("ClubSOperateResp_CMD", protobufPack.ClubSOperateResp ,CMD.GAME_CLUB.value);
    //个人俱乐部币增加退还回复
    Handle("ClubSTransferClubGoldResp_CMD", protobufPack.ClubSTransferClubGoldResp ,CMD.GAME_CLUB.value);
    //个人俱乐部币增加退还记录回复
    Handle("ClubSTransferRecordResp_CMD", protobufPack.ClubSTransferRecordResp ,CMD.GAME_CLUB.value);
    //俱乐部个人历史牌局返回
    Handle("ClubSPaiJuRecordResp_CMD", protobufPack.ClubSPaiJuRecordResp ,CMD.GAME_CLUB.value);
    //俱乐部个人贡献返回(俱乐部收益请求)
    Handle("ClubSContribRecordResp_CMD", protobufPack.ClubSContribRecordResp ,CMD.GAME_CLUB.value);
    //俱乐部黑名单回复
    Handle("ClubSBlacklistResp_CMD", protobufPack.ClubSBlacklistResp ,CMD.GAME_CLUB.value);
    //黑名单管理操作返回(主席,管理员)
    Handle("ClubSBlacklistMgrResp_CMD", protobufPack.ClubSBlacklistMgrResp ,CMD.GAME_CLUB.value);
    //黑名单玩家搜索返回
    Handle("ClubSBlacklistSearchResp_CMD", protobufPack.ClubSBlacklistSearchResp ,CMD.GAME_CLUB.value);
    //俱乐部牌桌记录返回
    Handle("ClubSTableRecordResp_CMD", protobufPack.ClubSTableRecordResp ,CMD.GAME_CLUB.value);
    //俱乐部牌桌参与玩家返回
    Handle("ClubSTableUserResp_CMD", protobufPack.ClubSTableUserResp ,CMD.GAME_CLUB.value);
    //俱乐部牌桌参与玩家返回
    Handle("ClubSMemberInfoResp_CMD", protobufPack.ClubSMemberInfoResp ,CMD.GAME_CLUB.value);
    //俱乐部管理员列表返回(主席)
    Handle("ClubSAdminListResp_CMD", protobufPack.ClubSAdminListResp ,CMD.GAME_CLUB.value);
    //俱乐部增加删除管理员返回(主席)
    Handle("ClubSAdminMgrResp_CMD", protobufPack.ClubSAdminMgrResp ,CMD.GAME_CLUB.value);
    //修改管理员权限返回(主席)
    Handle("ClubSChangeAdminPowerResp_CMD", protobufPack.ClubSChangeAdminPowerResp ,CMD.GAME_CLUB.value);
    //俱乐部账户的俱乐部币流水返回
    Handle("ClubSGoldChangeRecordResp_CMD", protobufPack.ClubSGoldChangeRecordResp ,CMD.GAME_CLUB.value);
    //俱乐部申请列表返回(主席,管理员)
    Handle("ClubSApplyListResp_CMD", protobufPack.ClubSApplyListResp ,CMD.GAME_CLUB.value);
    //俱乐部申请处理返回(主席,管理员)
    Handle("ClubSApplyHandleResp_CMD", protobufPack.ClubSApplyHandleResp ,CMD.GAME_CLUB.value);
    //邀请用户返回(主席,管理员)
    Handle("ClubSInviteUserResp_CMD", protobufPack.ClubSInviteUserResp ,CMD.GAME_CLUB.value);
    //搜索用户返回
    Handle("ClubSSearchUserResp_CMD", protobufPack.ClubSSearchUserResp ,CMD.GAME_CLUB.value);
    //玩家个人信息返回
    Handle("ClubSUserInfoResp_CMD", protobufPack.ClubSUserInfoResp ,CMD.GAME_CLUB.value);
    //改玩家个人信息返回
    Handle("ClubSChangeUserInfoResp_CMD", protobufPack.ClubSChangeUserInfoResp ,CMD.GAME_CLUB.value);
    //牌谱返回
    Handle("ClubSPaiPuResp_CMD", protobufPack.ClubSPaiPuResp ,CMD.GAME_CLUB.value);
    //操作牌谱返回
    Handle("ClubSOpratePaiPuResp_CMD", protobufPack.ClubSOpratePaiPuResp ,CMD.GAME_CLUB.value);
    //回放数据返回
    Handle("ClubSPlaybackDataResp_CMD", protobufPack.ClubSPlaybackDataResp ,CMD.GAME_CLUB.value);
    //个人通知返回
    Handle("ClubSUserNoticeResp_CMD", protobufPack.ClubSUserNoticeResp ,CMD.GAME_CLUB.value);
    //处理个人通知返回
    Handle("ClubSUserNoticeHandleResp_CMD", protobufPack.ClubSUserNoticeHandleResp ,CMD.GAME_CLUB.value);
    //俱乐部玩家信息改变通知
    Handle("ClubSUserInfoChangeNotify_CMD", protobufPack.ClubSUserInfoChangeNotify ,CMD.GAME_CLUB.value);
    //俱乐部场景信息改变通知
    Handle("ClubSSceneChangeNotify_CMD", protobufPack.ClubSSceneChangeNotify ,CMD.GAME_CLUB.value);
    //获取后台配置返回
    Handle("ClubSGetGameParamsResp_CMD", protobufPack.ClubSGetGameParamsResp ,CMD.GAME_CLUB.value);
    //俱乐部开桌返回
    Handle("ClubSOpenTableResp_CMD", protobufPack.ClubSOpenTableResp ,CMD.GAME_CLUB.value);
    //俱乐部开桌通知
    Handle("ClubSOpenTableNotify_CMD", protobufPack.ClubSOpenTableNotify ,CMD.GAME_CLUB.value);
    //俱乐部关桌返回
    Handle("ClubSCloseTableResp_CMD", protobufPack.ClubSCloseTableResp ,CMD.GAME_CLUB.value);
    //俱乐部关桌通知
    Handle("ClubSCloseTableNotify_CMD", protobufPack.ClubSCloseTableNotify ,CMD.GAME_CLUB.value);
    //俱乐部牌桌列表返回
    Handle("ClubSGetTableListResp_CMD", protobufPack.ClubSGetTableListResp ,CMD.GAME_CLUB.value);
    //俱乐部牌桌信息变化通知
    Handle("ClubSTableInfoNotify_CMD", protobufPack.ClubSTableInfoNotify ,CMD.GAME_CLUB.value);
    //俱乐部关闭通知
    Handle("ClubSCloseNotify_CMD", protobufPack.ClubSCloseNotify ,CMD.GAME_CLUB.value);
    //踢出俱乐部通知
    Handle("ClubSKickOutNotify_CMD", protobufPack.ClubSKickOutNotify ,CMD.GAME_CLUB.value);
    //玩家消息通知(非俱乐部)
    Handle("ClubSUserMsgNotify_CMD", protobufPack.ClubSUserMsgNotify ,CMD.GAME_CLUB.value);
    //服务器维护通知(需要重新登录俱乐部)
    Handle("ClubSMaintenanceNotify_CMD", protobufPack.ClubSMaintenanceNotify ,CMD.GAME_CLUB.value);
    //玩家申请记录返回（玩家个人）
    Handle("ClubSGetApplyListResp_CMD", protobufPack.ClubSGetApplyListResp ,CMD.GAME_CLUB.value);
    //玩家申请处理返回（玩家个人）
    Handle("ClubSUserApplyOpResp_CMD", protobufPack.ClubSUserApplyOpResp ,CMD.GAME_CLUB.value);
    //修改登录密码返回
    Handle("ClubSChangeLoginPassWardResp_CMD", protobufPack.ClubSChangeLoginPassWardResp ,CMD.GAME_CLUB.value);
    //玩家红点信息返回
    Handle("ClubSUserRedDotResp_CMD", protobufPack.ClubSUserRedDotResp ,CMD.GAME_CLUB.value);
    //获取牌桌的牌局id返回
    Handle("ClubSGetTablePaiJuIdResp_CMD", protobufPack.ClubSGetTablePaiJuIdResp ,CMD.GAME_CLUB.value);
    //请求商城配置返回
    Handle("ClubSGetStoreCfgRep_CMD", protobufPack.ClubSGetStoreCfgRep ,CMD.GAME_CLUB.value);
    //购买商品 返回
    Handle("ClubSBuyGoodsRep_CMD", protobufPack.ClubSBuyGoodsRep ,CMD.GAME_CLUB.value);
    //支付结果 返回
    Handle("ClubSPayResultRep_CMD", protobufPack.ClubSPayResultRep ,CMD.GAME_CLUB.value);
    //设置安全密码开启关闭返回
    Handle("ClubSSetSafePassWardOpenResp_CMD", protobufPack.ClubSSetSafePassWardOpenResp ,CMD.GAME_CLUB.value);
    //安全密码校验返回 
    Handle("ClubSSafePassWardCheckResp_CMD", protobufPack.ClubSSafePassWardCheckResp ,CMD.GAME_CLUB.value);
    //是否需要安全码校验返回 
    Handle("ClubSNeedCheckSafePassWardResp_CMD", protobufPack.ClubSNeedCheckSafePassWardResp ,CMD.GAME_CLUB.value);
    //获取俱乐部相关配置返回
    Handle("ClubSGetClubConfigResp_CMD", protobufPack.ClubSGetClubConfigResp ,CMD.GAME_CLUB.value);
    //玩家个人信息通知
    Handle("ClubSPersonInfoNotify_CMD", protobufPack.ClubSPersonInfoNotify ,CMD.GAME_CLUB.value);
    //获取玩家个人牌桌记录返回
    Handle("ClubSGetPersonTableRecordRsp_CMD", protobufPack.ClubSGetPersonTableRecordRsp ,CMD.GAME_CLUB.value);
    //获取牌桌详细记录返回
    Handle("ClubSGetTableDetailRsp_CMD", protobufPack.ClubSGetTableDetailRsp ,CMD.GAME_CLUB.value);
    //获取牌桌牌谱返回
    Handle("ClubSGetTablePaiPuRsp_CMD", protobufPack.ClubSGetTablePaiPuRsp ,CMD.GAME_CLUB.value);
    //获取牌桌保险明细返回
    Handle("ClubSGetTableInsuranceRsp_CMD", protobufPack.ClubSGetTableInsuranceRsp ,CMD.GAME_CLUB.value);
    //获取牌桌玩家列表返回
    Handle("ClubSGetTableUserListRsp_CMD", protobufPack.ClubSGetTableUserListRsp ,CMD.GAME_CLUB.value);
    //输入兑换码返回
    Handle("ClubSInputRedeemCodeRsp_CMD", protobufPack.ClubSInputRedeemCodeRsp ,CMD.GAME_CLUB.value);
    //获取玩家个人牌桌记录2返回(大厅 永久牌桌)
    Handle("ClubSGetPersonTableRecord2Rsp_CMD", protobufPack.ClubSGetPersonTableRecord2Rsp ,CMD.GAME_CLUB.value);
    //获取牌桌详细记录2返回(大厅 永久牌桌)
    Handle("ClubSGetTableDetail2Rsp_CMD", protobufPack.ClubSGetTableDetail2Rsp ,CMD.GAME_CLUB.value);
    //获取牌桌牌谱2返回(大厅 永久牌桌)
    Handle("ClubSGetTablePaiPu2Rsp_CMD", protobufPack.ClubSGetTablePaiPu2Rsp ,CMD.GAME_CLUB.value);
    //获取牌桌保险明细2返回(大厅 永久牌桌)
    Handle("ClubSGetTableInsurance2Rsp_CMD", protobufPack.ClubSGetTableInsurance2Rsp ,CMD.GAME_CLUB.value);
    //获取牌桌玩家列表2返回(大厅 永久牌桌)
    Handle("ClubSGetTableUserList2Rsp_CMD", protobufPack.ClubSGetTableUserList2Rsp ,CMD.GAME_CLUB.value);
    //牌局明细查询返回
    Handle("ClubSGetPaijuDetailRsp_CMD", protobufPack.ClubSGetPaijuDetailRsp ,CMD.GAME_CLUB.value);
    //请求充&&值信息返回
    Handle("ClubSPayInfoRep_CMD", protobufPack.ClubSPayInfoRep ,CMD.GAME_CLUB.value);
    //用户提##现信息返回
    Handle("ClubSWithDrawGoldRep_CMD", protobufPack.ClubSWithDrawGoldRep ,CMD.GAME_CLUB.value);
    //俱乐部广告奖励金返回
    Handle("ClubSAdvertiseMentGoldRsp_CMD", protobufPack.ClubSAdvertiseMentGoldRsp ,CMD.GAME_CLUB.value);
    Handle("ClubSUserMWStringRsp_CMD", protobufPack.ClubSUserMWStringRsp ,CMD.GAME_CLUB.value);
    //前端用文件编码返回
    Handle("ClubsFileConfigRsp_CMD", protobufPack.ClubsFileConfigRsp ,CMD.GAME_CLUB.value);
    //转账方式返回
    Handle("ClubTransferWayRsp_CMD", protobufPack.ClubTransferWayRsp ,CMD.GAME_CLUB.value);
    //充值或提现返回
    Handle("ClubRechargeWithdrawalRsp_CMD", protobufPack.ClubRechargeWithdrawalRsp ,CMD.GAME_CLUB.value);
    //福利活动返回
    Handle("ClubActivityInfoRsp_CMD", protobufPack.ClubActivityInfoRsp ,CMD.GAME_CLUB.value);
    //绑定手机邮箱回复
    Handle("ClubBindRsp_CMD", protobufPack.ClubBindRsp ,CMD.GAME_CLUB.value);
    //领取首冲活动奖励回复
    Handle("ClubFirChargeRewardRsp_CMD", protobufPack.ClubFirChargeRewardRsp ,CMD.GAME_CLUB.value);
    //分享奖励返回
    Handle("ClubShareRewardRsp_CMD", protobufPack.ClubShareRewardRsp ,CMD.GAME_CLUB.value);
    //签到界面信息返回
    Handle("ClubSignInfoRsp_CMD", protobufPack.ClubSignInfoRsp ,CMD.GAME_CLUB.value);
    //签到返回
    Handle("ClubSignRsp_CMD", protobufPack.ClubSignRsp ,CMD.GAME_CLUB.value);
    //领取活动奖励返回
    Handle("ClubDrawActivityRewardRsp_CMD", protobufPack.ClubDrawActivityRewardRsp ,CMD.GAME_CLUB.value);
    //活动配置返回
    Handle("ClubActivityCfgRsp_CMD", protobufPack.ClubActivityCfgRsp ,CMD.GAME_CLUB.value);
    //根据key获取value请求 （通用于从redis拿配置）
    Handle("ClubGetValueByKeyRsp_CMD", protobufPack.ClubGetValueByKeyRsp ,CMD.GAME_CLUB.value);
    //领取绑定奖励 返回
    Handle("ClubGetBindAwardRsp_CMD", protobufPack.ClubGetBindAwardRsp ,CMD.GAME_CLUB.value);
    //总用户数返回
    Handle("ClubSumUserCountRsp_CMD", protobufPack.ClubSumUserCountRsp, CMD.GAME_CLUB.value);

    // 获取大厅统计信息返回(大厅 永久牌桌)
    Handle("ClubSGetPersonTableStaticRsp_CMD", protobufPack.ClubSGetPersonTableStaticRsp, CMD.GAME_CLUB.value);
    //局内消耗列表
    Handle("ClubSGetGameGoldHistoryRsp_CMD", protobufPack.ClubSGetGameGoldHistoryRsp, CMD.GAME_CLUB.value);

    //局外，账变记录消耗列表
    Handle("ClubSGetGoldHistoryRsp_CMD", protobufPack.ClubSGetGoldHistoryRsp, CMD.GAME_CLUB.value);

    //充币提币数据列表
    Handle("ClubSGetBillRecordRsp_CMD", protobufPack.ClubSGetBillRecordRsp, CMD.GAME_CLUB.value);

    

    //局内消耗详情
    Handle("ClubSGetGameGoldDetailRsp_CMD", protobufPack.ClubSGetGameGoldDetailRsp, CMD.GAME_CLUB.value);
    //在线用户返回
    Handle("ClubSOnlineUserRsp_CMD", protobufPack.ClubSOnlineUserRsp, CMD.GAME_CLUB.value);
    //邀请玩家进入牌局返回
    Handle("ClubSInvitePlayGameRsp_CMD", protobufPack.ClubSInvitePlayGameRsp, CMD.GAME_CLUB.value);

    //私人房密码校验返回
    Handle("ClubSTablePassRsp_CMD", protobufPack.ClubSTablePassRsp, CMD.GAME_CLUB.value);
    //收到邀请通知
    Handle("ClubSInvitedPlayGameRsp_CMD", protobufPack.ClubSInvitedPlayGameRsp, CMD.GAME_CLUB.value);

    //可存证hash请求返回
    Handle("ClubSHashListRsp_CMD", protobufPack.ClubSHashListRsp, CMD.GAME_CLUB.value);
    //Hash指定局牌序列请求
    Handle("ClubSHashCardRsp_CMD", protobufPack.ClubSHashCardRsp, CMD.GAME_CLUB.value);

    //内部转币返回
    Handle("ClubSGoldTransToUserRsp_CMD", protobufPack.ClubSGoldTransToUserRsp, CMD.GAME_CLUB.value);

    
    //标记玩家回复
    Handle("ClubSMarkUserRsp_CMD", protobufPack.ClubSMarkUserRsp, CMD.GAME_CLUB.value);


    //玩家看手牌和看公共牌返回 （历史记录偷偷看和发发看）
    Handle("ClubSLookCardRsp_CMD", protobufPack.ClubSLookCardRsp, CMD.GAME_CLUB.value);

    //黑名单踢出通知
    Handle("ClubSWebKickOutNotify_CMD", protobufPack.ClubSWebKickOutNotify, CMD.GAME_CLUB.value);

    //改名次数通知
    Handle("ClubSNameCountNotify_CMD", protobufPack.ClubSNameCountNotify, CMD.GAME_CLUB.value);

    //MTT
    //MTT 登录返回
    HandleMtt("TEvtLogonRsp_CMD", protobufPack.TEvtLogonRsp);
    //MTT 赛事列表返回
    HandleMtt("TEvtEventsOpenRsp_CMD", protobufPack.TEvtEventsOpenRsp);
    //MTT 报名人数变化通知
    HandleMtt("TEvtUserCntNotify_CMD", protobufPack.TEvtUserCntNotify);
    //MTT 比赛信息=>规则(动态部分)变化 通知
    HandleMtt("TEvtRuleDNotify_CMD", protobufPack.TEvtRuleDNotify);
    //MTT 比赛信息=>玩家列表 返回
    HandleMtt("TEvtUsersRsp_CMD", protobufPack.TEvtUsersRsp);
    //MTT 比赛信息=>奖励列表 返回
    HandleMtt("TEvtAwardsRsp_CMD", protobufPack.TEvtAwardsRsp);
    //MTT 报名 返回
    HandleMtt("TEvtSignUpRsp_CMD", protobufPack.TEvtSignUpRsp);
    //MTT 取消报名 返回
    HandleMtt("TEvtSignUpCancelRsp_CMD", protobufPack.TEvtSignUpCancelRsp);
    //MTT 延迟报名 返回
    HandleMtt("TEvtSignUpDRsp_CMD", protobufPack.TEvtSignUpDRsp);
    //MTT 观战 返回
    HandleMtt("TEvtWatchRsp_CMD", protobufPack.TEvtWatchRsp);
    //MTT 进入比赛 返回
    HandleMtt("TEvtEnterRsp_CMD", protobufPack.TEvtEnterRsp);
    //MTT 走马灯 比赛未达到开赛要求,被取消 通知
    HandleMtt("TEvtCancelNotify_CMD", protobufPack.TEvtCancelNotify);
    //MTT 走马灯 比赛即将开始 通知
    HandleMtt("TEvtToStartNotify_CMD", protobufPack.TEvtToStartNotify);
    //MTT 入口提示查询 返回
    HandleMtt("TEvtCheckRsp_CMD", protobufPack.TEvtCheckRsp);

    //MTT 赛事状态更新 通知
    HandleMtt("TEvtStatusNotify_CMD", protobufPack.TEvtStatusNotify);
    

}();



module.exports = {
    map: Response,

    release: function () {
        delete Response[CMD.GAME_CLUB.value];
        delete Response[CMD.GAME_CLUB_MTT.value];
    },
};