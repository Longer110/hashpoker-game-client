let ProtocolFun = require('protocolFun');
let CMD = require('protocol_hall');
let MSG = require('Msg_hall');
let protobufPack = require("proto");

let baseResponse = require("response");
let Response = baseResponse.getResponse();

let MapHall = new Map;


Response.set(CMD.Main_CMD.value, MapHall);


// MapHall.set(CMD.Main_CMD.LogonRsp_CMD, function (buffer) {
   
//     let data = protobufPack.LogonRsp.decode(buffer);

//     let msg = MSG.LogonRsp_CMD;
//     return { data: data, msg: msg };
// })


// MapHall.set(CMD.Main_CMD.GameListNotify_CMD, function (buffer) {

//     let data = protobufPack.GameListNotify.decode(buffer);

//     let msg = MSG.GameListNotify_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.RoomListRsp_CMD, function (buffer) {
//     let data = protobufPack.RoomListRsp.decode(buffer);
//     let msg = MSG.RoomListRsp_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.TreasureRsp_CMD, function (buffer) {
//     let data = protobufPack.TreasureRsp.decode(buffer);
//     let msg = MSG.TreasureRsp_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.EnterBankRsp_CMD, function (buffer) {
//     let data = protobufPack.EnterBankRsp.decode(buffer);
//     let msg = MSG.EnterBankRsp_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.BankUnlockRsp_CMD, function (buffer) {
//     let data = protobufPack.BankUnlockRsp.decode(buffer);
//     let msg = MSG.BankUnlockRsp_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.BankAccessRsp_CMD, function (buffer) {
//     let data = protobufPack.BankAccessRsp.decode(buffer);
//     let msg = MSG.BankAccessRsp_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.BankPasswordChangeRsp_CMD, function (buffer) {
//     let data = protobufPack.BankPasswordChangeRsp.decode(buffer);
//     let msg = MSG.BankPasswordChangeRsp_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.BankAccessDetailRsp_CMD, function (buffer) {
//     let data = protobufPack.BankAccessDetailRsp.decode(buffer);
//     let msg = MSG.BankAccessDetailRsp_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.PaijuRecordRsp_CMD, function (buffer) {
//     let data = protobufPack.PaijuRecordRsp.decode(buffer);
//     let msg = MSG.PaijuRecordRsp_CMD;
//     return { data: data, msg: msg };
// })

// MapHall.set(CMD.Main_CMD.BeforeLoadScenceRsp_CMD, function (buffer) {
//     let data = protobufPack.BeforeLoadScenceRsp.decode(buffer);
//     let msg = MSG.BeforeLoadScenceRsp_CMD;
//     return { data: data, msg: msg };
// })


//proto 协议返回处理
!function () {
    let Handle = function (protoKey, protoObject) {
        if (!protoObject) {
            QYLogs.error("protocol_hall", "解析体不存在" + protoKey);
        }
        MapHall.set(CMD.Main_CMD[protoKey], function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let msg = MSG[protoKey];
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    Handle("LogonRsp_CMD", protobufPack.LogonRsp);
    Handle("GameListNotify_CMD", protobufPack.GameListNotify);
    Handle("RoomListRsp_CMD", protobufPack.RoomListRsp);
    Handle("TreasureRsp_CMD", protobufPack.TreasureRsp);
    Handle("EnterBankRsp_CMD", protobufPack.EnterBankRsp);

    Handle("BankUnlockRsp_CMD", protobufPack.BankUnlockRsp);
    Handle("BankAccessRsp_CMD", protobufPack.BankAccessRsp);
    Handle("BankPasswordChangeRsp_CMD", protobufPack.BankPasswordChangeRsp);
    Handle("BankAccessDetailRsp_CMD", protobufPack.BankAccessDetailRsp);

    Handle("PaijuRecordRsp_CMD", protobufPack.PaijuRecordRsp);
    Handle("BeforeLoadScenceRsp_CMD", protobufPack.BeforeLoadScenceRsp);
    Handle("SUB_REP_UPDATE_USERINFO", protobufPack.Update_UserInfo_P);
    Handle("NoticeOnlinePeople_CMD", protobufPack.NoticeOnlinePeople);

    Handle("PaijuDetailRsp_CMD", protobufPack.PaijuDetailRsp);
    Handle("HelpInfoRsp_CMD", protobufPack.HelpInfoRsp);

    Handle("LobbyDeZhouRecordRsp_CMD", protobufPack.LobbyDeZhouRecordRsp);
    Handle("LobbyDeZhouRecordDetailRsp_CMD", protobufPack.LobbyDeZhouRecordDetailRsp);

    Handle("BrLiveGameRecordRsp_CMD", protobufPack.BrLiveGameRecordRsp);
    Handle("BrLiveGameDetailRsp_CMD", protobufPack.BrLiveGameDetailRsp);

    Handle("UserGoldLessStandardNotify_CMD", protobufPack.UserGoldLessStandardNotify);

    Handle("BlockChianListInfoRep_CMD", protobufPack.BlockChianListInfoRep);

    Handle("AccountCloseRsp_CMD", protobufPack.AccountCloseRsp);


    Handle("AccountPayURLRsp_CMD", protobufPack.AccountPayURLRsp);
    Handle("AccountPayInfoRsp_CMD", protobufPack.AccountPayInfoRsp);
    Handle("AccountWithdrawalRsp_CMD", protobufPack.AccountWithdrawalRsp);
    Handle("AccountWithdrawalViewRsp_CMD", protobufPack.AccountWithdrawalViewRsp);



    Handle("ClubSUserNoticeResp_CMD", protobufPack.ClubSUserNoticeResp);
    Handle("ClubSUserNoticeHandleResp_CMD", protobufPack.ClubSUserNoticeHandleResp);
}();

module.exports = {
    map: Response,

    release: function() {
        delete Response[CMD.Main_CMD];
    },
};