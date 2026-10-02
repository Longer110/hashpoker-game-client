let CMD = require('protocol_texas');
let MSG = require('Msg_Texas');
let protobufPack = require("proto");
let baseResponse = require("response");
let Response = baseResponse.getResponse();

let MapGame = new Map;
let MapClubGame = new Map;
let MapGameSlave = new Map;

Response.set(CMD.Texas.value, MapGame);
Response.set(CMD.ClubTexas.value, MapClubGame);
Response.set(CMD.LiveSlave.value, MapGameSlave);

//proto 协议返回处理
!function () {
    let Handle = function (protoKey, protoObject) {
        if (!protoObject) {
            QYLogs.error("protocol_texas", "解析体不存在" + protoKey);
        }
        MapGame.set(CMD.Texas[protoKey], function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let msg = MSG.Texas[protoKey];
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    let Handle1 = function (protoKey, protoObject) {
        if (!protoObject) {
            QYLogs.error("protocol_texas", "解析体不存在" + protoKey);
        }
        MapClubGame.set(CMD.ClubTexas[protoKey], function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let msg = MSG.ClubTexas[protoKey];
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    let Handle2 = function (protoKey, protoObject) {
        if (!protoObject) {
            QYLogs.error("protocol_texas", "解析体不存在" + protoKey);
        }
        MapGameSlave.set(CMD.LiveSlave[protoKey], function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let msg = MSG.LiveSlave[protoKey];
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    //登陆回复
    Handle("DeZhouLogOnRsp_CMD", protobufPack.DeZhouLogOnRsp);
    //房间设置成功通知
    Handle("DeZhouConfigNotify_CMD", protobufPack.DeZhouConfigNotify);
    //有玩家坐下通知
    Handle("DeZhouUserSitDownNotify_CMD", protobufPack.DeZhouUserSitDownNotify);
    //有玩家从座位上站起通知
    Handle("DeZhouUserStanpUpNotify_CMD", protobufPack.DeZhouUserStanpUpNotify);
    //开局倒计时通知
    Handle("DeZhouToStartNotify_CMD", protobufPack.DeZhouToStartNotify);
    //游戏开始通知
    Handle("DeZhouStartNotify_CMD", protobufPack.DeZhouStartNotify);
    //操作权获得通知
    Handle("DeZhouOperationNotify_CMD", protobufPack.DeZhouOperationNotify);
    //有玩家操作通知
    Handle("DeZhouOpNotify_CMD", protobufPack.DeZhouOpNotify);
    //公共牌新增通知
    Handle("DeZhouDealNotify_CMD", protobufPack.DeZhouDealNotify);
    //结算通知
    Handle("DeZhouSettleNotify_CMD", protobufPack.DeZhouSettleNotify);
    //有玩家亮牌通知
    Handle("DeZhouShowCardNotify_CMD", protobufPack.DeZhouShowCardNotify);
    //预操作回复
    Handle("DeZhouPreOpRsp_CMD", protobufPack.DeZhouPreOpRsp);
    //最近牌局记录查询 返回
    Handle("DeZhouRecordRsp_CMD", protobufPack.DeZhouRecordRsp);
    //牌局记录详情查询 返回
    Handle("DeZhouRecordDetailRsp_CMD", protobufPack.DeZhouRecordDetailRsp);
    //筹码买入范围查看回复
    Handle("DeZhouTakeInRangeRsp_CMD", protobufPack.DeZhouTakeInRangeRsp);
    //筹码买入回复
    Handle("DeZhoTakeInRsp_CMD", protobufPack.DeZhoTakeInRsp);
    //有玩家取消托管通知
    Handle("DeZhouCancelAutoNotify_CMD", protobufPack.DeZhouCancelAutoNotify);
    //异常提示通知
    Handle("DeZhouFailNotify_CMD", protobufPack.DeZhouFailNotify);
    //金币变化通知
    Handle("DeZhouGoldNotify_CMD", protobufPack.DeZhouGoldNotify);
    //有玩家筹码余额发生变化通知 (主播更改配置后可能发生)
    Handle("DeZhouBalanceNotify_CMD", protobufPack.DeZhouBalanceNotify);
    //表情聊天通知
    Handle("DeZhouChatNotify_CMD", protobufPack.DeZhouChatNotify);
    //踢人回复
    Handle("DeZhouKickUserRsp_CMD", protobufPack.DeZhouKickUserRsp);
    //暂停设置 返回
    Handle("DeZhouPauseRsp_CMD", protobufPack.DeZhouPauseRsp);
    //桌子重置通知
    Handle("DeZhouTableResetNotify_CMD", protobufPack.DeZhouTableResetNotify);

    //返回大厅回复
    Handle("DeZhouBackToLobbyRsp_CMD", protobufPack.DeZhouBackToLobbyRsp);

    //登陆回复
    Handle1("ClubDeZhouLogOnRsp_CMD", protobufPack.ClubDeZhouLogOnRsp);
    //房间设置成功通知
    Handle1("ClubDeZhouConfigNotify_CMD", protobufPack.ClubDeZhouConfigNotify);
    //有玩家坐下通知
    Handle1("ClubDeZhouUserSitDownNotify_CMD", protobufPack.ClubDeZhouUserSitDownNotify);
    //有玩家从座位上站起通知
    Handle1("ClubDeZhouUserStanpUpNotify_CMD", protobufPack.ClubDeZhouUserStanpUpNotify);
    //开局倒计时通知
    Handle1("ClubDeZhouToStartNotify_CMD", protobufPack.ClubDeZhouToStartNotify);
    //游戏开始通知
    Handle1("ClubDeZhouStartNotify_CMD", protobufPack.ClubDeZhouStartNotify);
    //操作权获得通知
    Handle1("ClubDeZhouOperationNotify_CMD", protobufPack.ClubDeZhouOperationNotify);
    //有玩家操作通知
    Handle1("ClubDeZhouOpNotify_CMD", protobufPack.ClubDeZhouOpNotify);
    //公共牌新增通知
    Handle1("ClubDeZhouDealNotify_CMD", protobufPack.ClubDeZhouDealNotify);
    //结算通知
    Handle1("ClubDeZhouSettleNotify_CMD", protobufPack.ClubDeZhouSettleNotify);
    //有玩家亮牌通知
    Handle1("ClubDeZhouShowCardNotify_CMD", protobufPack.ClubDeZhouShowCardNotify);
    //预操作回复
    Handle1("ClubDeZhouPreOpRsp_CMD", protobufPack.ClubDeZhouPreOpRsp);
    //最近牌局记录查询 返回
    Handle1("ClubDeZhouRecordRsp_CMD", protobufPack.ClubDeZhouRecordRsp);
    //牌局记录详情查询 返回
    Handle1("ClubDeZhouRecordDetailRsp_CMD", protobufPack.ClubDeZhouRecordDetailRsp);
    //筹码买入范围查看回复
    Handle1("ClubDeZhouTakeInRangeRsp_CMD", protobufPack.ClubDeZhouTakeInRangeRsp);
    //筹码买入回复
    Handle1("ClubDeZhoTakeInRsp_CMD", protobufPack.ClubDeZhoTakeInRsp);
    //有玩家取消托管通知
    Handle1("ClubDeZhouCancelAutoNotify_CMD", protobufPack.ClubDeZhouCancelAutoNotify);
    //异常提示通知
    Handle1("ClubDeZhouFailNotify_CMD", protobufPack.ClubDeZhouFailNotify);
    //金币变化通知
    Handle1("ClubDeZhouGoldNotify_CMD", protobufPack.ClubDeZhouGoldNotify);
    //有玩家筹码余额发生变化通知 (主播更改配置后可能发生)
    Handle1("ClubDeZhouBalanceNotify_CMD", protobufPack.ClubDeZhouBalanceNotify);
    //表情聊天通知
    Handle1("ClubDeZhouChatNotify_CMD", protobufPack.ClubDeZhouChatNotify);
    //踢人回复
    Handle1("ClubDeZhouKickUserRsp_CMD", protobufPack.ClubDeZhouKickUserRsp);
    //暂停设置 返回
    Handle1("ClubDeZhouPauseRsp_CMD", protobufPack.ClubDeZhouPauseRsp);
    //牌桌总览返回
    Handle1("ClubDeZhouOverViewRsp_CMD", protobufPack.ClubDeZhouOverViewRsp);
    //房主点击了"开始牌局" 通知
    Handle1("ClubDeZhouTableStartNotify_CMD", protobufPack.ClubDeZhouTableStartNotify);
    //房主点击了"开始游戏" 通知
    Handle1("ClubDeZhouAutoNextNotify_CMD", protobufPack.ClubDeZhouAutoNextNotify);
    //进入保险阶段
    Handle1("InsurNotify_CMD", protobufPack.InsurNotify);
    //保险后发牌通知(同时表示最近保险阶段结束)
    Handle1("InsurDealNotify_CMD", protobufPack.InsurDealNotify);
    //保险购买回复
    Handle1("InsurBuyRsp_CMD", protobufPack.InsurBuyRsp);
    //延时回复
    Handle1("DelayRsp_CMD", protobufPack.DelayRsp);
    //有人延时成功通知
    Handle1("DelayNotify_CMD", protobufPack.DelayNotify);
    //头像信息回复
    Handle1("HeadInfoRsp_CMD", protobufPack.HeadInfoRsp);
    //筹码带出范围查看回复
    Handle1("ClubDeZhouTakeOutRangeRsp_CMD", protobufPack.ClubDeZhouTakeOutRangeRsp);
    //筹码带出回复
    Handle1("ClubDeZhoTakeOutRsp_CMD", protobufPack.ClubDeZhoTakeOutRsp);
    //'留座离桌'或'回到座位' 回复
    Handle1("ClubDeZhouRetainRsp_CMD", protobufPack.ClubDeZhouRetainRsp);
    //'留座离桌'或'回到座位' 生效通知
    Handle1("ClubDeZhouRetainNotify_CMD", protobufPack.ClubDeZhouRetainNotify);

    //桌子重置通知
    Handle1("ClubDeZhouTableResetNotify_CMD", protobufPack.ClubDeZhouTableResetNotify);
    //返回大厅回复
    Handle1("ClubDeZhouBackToLobbyRsp_CMD", protobufPack.ClubDeZhouBackToLobbyRsp);
    //通知胜率
    Handle1("WinRateNotify_CMD", protobufPack.WinRateNotify);
    //桌子计时状态变化 通知
    Handle1("ElapsedStatusNotify_CMD", protobufPack.ElapsedStatusNotify);
    //桌子剩余时间 警告
    Handle1("ElapWarnNotify_CMD", protobufPack.ElapWarnNotify);

    //请求俱乐部凭证列表 返回
    Handle1("ClubDeZhouHashListRsp_CMD", protobufPack.ClubDeZhouHashListRsp);

    //请求俱乐部局牌序列 返回
    Handle1("ClubDeZhouHashCardRsp_CMD", protobufPack.ClubDeZhouHashCardRsp);

    //牌局结算
    Handle1("ClubDeZhouUserStaticRsp_CMD", protobufPack.ClubDeZhouUserStaticRsp);


    //请求查看撤码数据 返回
    Handle1("ClubDeZhouTakeOutInfoRsp_CMD", protobufPack.ClubDeZhouTakeOutInfoRsp);

    //设置自动撤码 返回
    Handle1("ClubDeZhouTakeOutSetRsp_CMD", protobufPack.ClubDeZhouTakeOutSetRsp);

    //请求手动撤码 返回
    Handle1("ClubDeZhouTakeChipsOutRsp_CMD", protobufPack.ClubDeZhouTakeChipsOutRsp);

    //保险购买或不买通知
    Handle1("ClubDeZhouInsureNotify_CMD", protobufPack.ClubDeZhouInsureNotify);


    //翻牌回复（发发看）
    Handle1("ClubDeZhouCardOpenRsp_CMD", protobufPack.ClubDeZhouCardOpenRsp);

    //看手牌回复 (偷偷看)
    Handle1("ClubDeZhouHandCardRsp_CMD", protobufPack.ClubDeZhouHandCardRsp);


    //切牌回复 (切牌)
    Handle1("ClubDeZhouCutCardRsp_CMD", protobufPack.ClubDeZhouCutCardRsp);


    //切牌，看手牌，看公牌通知
    Handle1("ClubDeZhouCardOpNotify_CMD", protobufPack.ClubDeZhouCardOpNotify);

    //买入通知
    Handle1("ClubDeZhouTakeInNotify_CMD", protobufPack.ClubDeZhouTakeInNotify);

    //广播用户离开
    Handle1("ClubDeZhouLeaveNotify_CMD", protobufPack.ClubDeZhouLeaveNotify);
    // 广播用户加入
    Handle1("ClubDeZhouEnterNotify_CMD", protobufPack.ClubDeZhouEnterNotify);




    // //旁观猜牌 通知
    // Handle("DeZhouGuessCardNotify_CMD", protobufPack.DeZhouGuessCardNotify);


    //德州从服协议相关
    //旁观猜牌通知
    Handle2("LiveSlaveGuessCardNotify_CMD", protobufPack.LiveSlaveGuessCardNotify);
    //旁观猜牌 回复： 答对才有
    Handle2("LiveSlaveGuessCardRsp_CMD", protobufPack.LiveSlaveGuessCardRsp);

    Handle2("LiveSlaveLogOnRsp_CMD", protobufPack.LiveSlaveLogOnRsp);
    Handle2("LiveSlaveBackToLobbyRsp_CMD", protobufPack.LiveSlaveBackToLobbyRsp);

    //mtt比赛
    //比赛信息变化 通知
    Handle1("ClubDeZhouMInfoNotify_CMD", protobufPack.ClubDeZhouMInfoNotify);
    //换桌 通知  <可请求触发，或自动触发>
    Handle1("ClubDeZhouTbChangeNotify_CMD", protobufPack.ClubDeZhouTbChangeNotify);
    //排名 通知  <被淘汰或最后获胜时触发>
    Handle1("ClubDeZhouOustNotify_CMD", protobufPack.ClubDeZhouOustNotify);
    //重(增)购窗口打开 通知  <可请求打开，或自动弹出>
    Handle1("ClubDeZhouRANotify_CMD", protobufPack.ClubDeZhouRANotify);
    //重(增)购 返回
    Handle1("ClubDeZhouRARsp_CMD", protobufPack.ClubDeZhouRARsp);

}();


module.exports = {
    map: Response,

    release: function () {
        delete Response[CMD.Texas];
        delete Response[CMD.LiveSlave];
    },
};