
let CMD = require('protocol_texas');
let protobufPack = require("proto");

let baseRequest = require("request");
let Request = baseRequest.getRequest();

let MapGame = new Map;
let MapClubGame = new Map;
let MapGameSlave = new Map;

Request.set(CMD.Texas.value, MapGame);
Request.set(CMD.ClubTexas.value, MapClubGame);
Request.set(CMD.LiveSlave.value, MapGameSlave);



//proto 协议请求处理
!function () {
    let Handle = function (protoKey, protoObject) {
        MapGame.set(CMD.Texas[protoKey], function (data) {
            let message = protoObject.create(data);
            let buffer = protoObject.encode(message).finish();

            return buffer;
        })
    }

    let Handle1 = function (protoKey, protoObject) {
        MapClubGame.set(CMD.ClubTexas[protoKey], function (data) {
            let message = protoObject.create(data);
            let buffer = protoObject.encode(message).finish();

            return buffer;
        })
    }

    let Handle2 = function (protoKey, protoObject) {
        MapGameSlave.set(CMD.LiveSlave[protoKey], function (data) {
            let message = protoObject.create(data);
            let buffer = protoObject.encode(message).finish();

            return buffer;
        })
    }

    //登陆请求
    Handle("DeZhouLogOnReq_CMD", protobufPack.DeZhouLogOnReq);
    //房间设置请求
    Handle("DeZhouCofingReq_CMD", protobufPack.DeZhouCofingReq);
    //操作请求
    Handle("DeZhouOpReq_CMD", protobufPack.DeZhouOpReq);
    //返回大厅请求
    Handle("DeZhouBackToLobbyReq_CMD", protobufPack.DeZhouBackToLobbyReq);
    //预操作请求
    Handle("DeZhouPreOpReq_CMD", protobufPack.DeZhouPreOpReq);
    //站起请求
    Handle("DeZhouStanpUpReq_CMD", protobufPack.DeZhouStanpUpReq);
    //坐下请求
    Handle("DeZhouSitDownReq_CMD", protobufPack.DeZhouSitDownReq);
    //筹码买入范围查看请求
    Handle("DeZhouTakeInRangeReq_CMD", protobufPack.DeZhouTakeInRangeReq);
    //筹码买入请求
    Handle("DeZhoTakeInReq_CMD", protobufPack.DeZhoTakeInReq);
    //取消托管请求
    Handle("DeZhouCancelAutoReq_CMD", protobufPack.DeZhouCancelAutoReq);
    //最近牌局记录查询 请求
    Handle("DeZhouRecordReq_CMD", protobufPack.DeZhouRecordReq);
    //牌局记录详情查询 请求
    Handle("DeZhouRecordDetailReq_CMD", protobufPack.DeZhouRecordDetailReq);
    //表情聊天请求
    Handle("DeZhouChatReq_CMD", protobufPack.DeZhouChatReq);
    //Gm命令请求
    Handle("DeZhouGmReq_CMD", protobufPack.DeZhouGmReq);
    //踢人请求 (给主播踢人用)
    Handle("DeZhouKickUserReq_CMD", protobufPack.DeZhouKickUserReq);
    //暂停设置 请求
    Handle("DeZhouPauseReq_CMD", protobufPack.DeZhouPauseReq);
    
    //登陆请求
    Handle1("ClubDeZhouLogOnReq_CMD", protobufPack.ClubDeZhouLogOnReq);
    //房间设置请求
    Handle1("ClubDeZhouCofingReq_CMD", protobufPack.ClubDeZhouCofingReq);
    //操作请求
    Handle1("ClubDeZhouOpReq_CMD", protobufPack.ClubDeZhouOpReq);
    //返回大厅请求
    Handle1("ClubDeZhouBackToLobbyReq_CMD", protobufPack.ClubDeZhouBackToLobbyReq);
    //预操作请求
    Handle1("ClubDeZhouPreOpReq_CMD", protobufPack.ClubDeZhouPreOpReq);
    //站起请求
    Handle1("ClubDeZhouStanpUpReq_CMD", protobufPack.ClubDeZhouStanpUpReq);
    //坐下请求
    Handle1("ClubDeZhouSitDownReq_CMD", protobufPack.ClubDeZhouSitDownReq);
    //筹码买入范围查看请求
    Handle1("ClubDeZhouTakeInRangeReq_CMD", protobufPack.ClubDeZhouTakeInRangeReq);
    //筹码买入请求
    Handle1("ClubDeZhoTakeInReq_CMD", protobufPack.ClubDeZhoTakeInReq);
    //取消托管请求
    Handle1("ClubDeZhouCancelAutoReq_CMD", protobufPack.ClubDeZhouCancelAutoReq);
    //最近牌局记录查询 请求
    Handle1("ClubDeZhouRecordReq_CMD", protobufPack.ClubDeZhouRecordReq);
    //牌局记录详情查询 请求
    Handle1("ClubDeZhouRecordDetailReq_CMD", protobufPack.ClubDeZhouRecordDetailReq);
    //表情聊天请求
    Handle1("ClubDeZhouChatReq_CMD", protobufPack.ClubDeZhouChatReq);
    //Gm命令请求
    Handle1("ClubDeZhouGmReq_CMD", protobufPack.ClubDeZhouGmReq);
    //踢人请求 (给主播踢人用)
    Handle1("ClubDeZhouKickUserReq_CMD", protobufPack.ClubDeZhouKickUserReq);
    //牌桌总览请求
    Handle1("ClubDeZhouOverViewReq_CMD", protobufPack.ClubDeZhouOverViewReq);
    //暂停设置 请求
    Handle1("ClubDeZhouPauseReq_CMD", protobufPack.ClubDeZhouPauseReq);
    //"开始牌局"请求 (房主使用)
    Handle1("ClubDeZhouTableStartReq_CMD", protobufPack.ClubDeZhouTableStartReq);
    //"开始游戏" 请求 (房主使用)
    Handle1("ClubDeZhouAutoNextReq_CMD", protobufPack.ClubDeZhouAutoNextReq);
    //保险购买请求
    Handle1("InsurBuyReq_CMD", protobufPack.InsurBuyReq);
    //延时请求
    Handle1("DelayReq_CMD", protobufPack.DelayReq);
    //筹码带出范围查看请求
    Handle1("ClubDeZhouTakeOutRangeReq_CMD", protobufPack.ClubDeZhouTakeOutRangeReq);
    //筹码带出请求
    Handle1("ClubDeZhoTakeOutReq_CMD", protobufPack.ClubDeZhoTakeOutReq);
    //'留座离桌'或'回到座位' 请求
    Handle1("ClubDeZhouRetainReq_CMD", protobufPack.ClubDeZhouRetainReq);
    

    //头像信息请求
    Handle1("HeadInfoReq_CMD", protobufPack.HeadInfoReq);

    //请求俱乐部凭证列表
    Handle1("ClubDeZhouHashListReq_CMD", protobufPack.ClubDeZhouOpReq);

    //请求俱乐部局牌序列
    Handle1("ClubDeZhouHashCardReq_CMD", protobufPack.ClubDeZhouHashCardReq);

     //请求查看撤码数据
    Handle1("ClubDeZhouTakeOutInfoReq_CMD", protobufPack.ClubDeZhouTakeOutInfoReq);
    
    //设置自动撤码 
    Handle1("ClubDeZhouTakeOutSetReq_CMD", protobufPack.ClubDeZhouTakeOutSetReq);

    
    //请求看手牌（偷偷看）
    Handle1("ClubDeZhouHandCardReq_CMD", protobufPack.ClubDeZhouHandCardReq);

    //翻牌请求 （看公共牌）（发发看）
    Handle1("ClubDeZhouCardOpenReq_CMD", protobufPack.ClubDeZhouCardOpenReq);

    //请求切牌
    Handle1("ClubDeZhouCutCardReq_CMD", protobufPack.ClubDeZhouCutCardReq);

    
    
    //请求手动撤码 返回
    Handle1("ClubDeZhouTakeChipsOutReq_CMD", protobufPack.ClubDeZhouTakeChipsOutReq);

    // //竞猜 请求
    // Handle("DeZhouGuessCardReq_CMD", protobufPack.DeZhouGuessCardReq);
    
        
    //德州从服协议相关
    //旁观猜牌 请求
    Handle2("LiveSlaveGuessCardReq_CMD", protobufPack.LiveSlaveGuessCardReq);
    Handle2("LiveSlaveLogOnReq_CMD", protobufPack.LiveSlaveLogOnReq);
    Handle2("LiveSlaveBackToLobbyReq_CMD", protobufPack.LiveSlaveBackToLobbyReq);

    //mtt比赛
    //重(增)购窗口打开 请求
    Handle1("ClubDeZhouRAWinReq_CMD", protobufPack.ClubDeZhouRAWinReq);
    //换桌旁观 请求
    Handle1("ClubDeZhouChangeWReq_CMD", protobufPack.ClubDeZhouChangeWReq);
    //重(增)购 请求
    Handle1("ClubDeZhouRAReq_CMD", protobufPack.ClubDeZhouRAReq);

}();

module.exports = {
    map: Request,

    release: function() {
        delete Request[CMD.Texas];
        delete Request[CMD.ClubTexas];
        delete Request[CMD.LiveSlave];
    }
};