var ProtocolFun = require('protocolFun');
let CMD = require('protocol_hall');
let protobufPack = require("proto_hall");

let baseRequest = require("request");
let Request = baseRequest.getRequest();


let MapHall = new Map;


Request.set(CMD.Main_CMD.value, MapHall);

// MapHall.set(CMD.Main_CMD.LogonReq_CMD, function (data) {
//     let message = protobufPack.LogonReq.create(data);
//     let buffer = protobufPack.LogonReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.RoomListReq_CMD, function (data){
//     let message = protobufPack.RoomListReq.create(data);
//     let buffer = protobufPack.RoomListReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.TreasureReq_CMD, function (data){
//     let message = protobufPack.TreasureReq.create(data);
//     let buffer = protobufPack.TreasureReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.EnterBankReq_CMD, function (data){
//     let message = protobufPack.EnterBankReq.create(data);
//     let buffer = protobufPack.EnterBankReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.BankUnlockReq_CMD, function (data){
//     let message = protobufPack.BankUnlockReq.create(data);
//     let buffer = protobufPack.BankUnlockReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.BankAccessReq_CMD, function (data){
//     let message = protobufPack.BankAccessReq.create(data);
//     let buffer = protobufPack.BankAccessReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.BankPasswordChangeReq_CMD, function (data){
//     let message = protobufPack.BankPasswordChangeReq.create(data);
//     let buffer = protobufPack.BankPasswordChangeReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.BankAccessDetailReq_CMD, function (data){
//     let message = protobufPack.BankAccessDetailReq.create(data);
//     let buffer = protobufPack.BankAccessDetailReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.PaijuRecordReq_CMD, function (data){
//     let message = protobufPack.PaijuRecordReq.create(data);
//     let buffer = protobufPack.PaijuRecordReq.encode(message).finish();
//     return buffer;
// });

// MapHall.set(CMD.Main_CMD.BeforeLoadScenceReq_CMD, function (data){
//     let message = protobufPack.BeforeLoadScenceReq.create(data);
//     let buffer = protobufPack.BeforeLoadScenceReq.encode(message).finish();
//     return buffer;
// });


//proto 协议请求处理
!function () {
    let Handle = function (protoKey, protoObject) {
        MapHall.set(CMD.Main_CMD[protoKey], function (data) {
            let message = protoObject.create(data);
            let buffer = protoObject.encode(message).finish();

            return buffer;
        })
    }
    Handle("LogonReq_CMD", protobufPack.LogonReq);
    Handle("RoomListReq_CMD", protobufPack.RoomListReq);
    Handle("TreasureReq_CMD", protobufPack.TreasureReq);
    Handle("EnterBankReq_CMD", protobufPack.EnterBankReq);
    Handle("BankUnlockReq_CMD", protobufPack.BankUnlockReq);
    Handle("BankAccessReq_CMD", protobufPack.BankAccessReq);
    Handle("BankPasswordChangeReq_CMD", protobufPack.BankPasswordChangeReq);
    Handle("BankAccessDetailReq_CMD", protobufPack.BankAccessDetailReq);
    Handle("PaijuRecordReq_CMD", protobufPack.PaijuRecordReq);
    Handle("BeforeLoadScenceReq_CMD", protobufPack.BeforeLoadScenceReq);
    Handle("SUB_REQ_UPDATE_USERINFO", protobufPack.Update_UserInfo_Q);
    Handle("OnlinePeopleReq_CMD", protobufPack.OnlinePeopleReq);
    Handle("PaijuDetailReq_CMD", protobufPack.PaijuDetailReq);
    Handle("HelpInfoReq_CMD", protobufPack.HelpInfoReq);
    Handle("LobbyDeZhouRecordReq_CMD", protobufPack.LobbyDeZhouRecordReq);
    Handle("LobbyDeZhouRecordDetailReq_CMD", protobufPack.LobbyDeZhouRecordDetailReq);
    Handle("BrLiveGameRecordReq_CMD", protobufPack.BrLiveGameRecordReq);
    Handle("BrLiveGameDetailReq_CMD", protobufPack.BrLiveGameDetailReq);
    Handle("BlockChianListInfoReq_CMD", protobufPack.BlockChianListInfoReq);
    Handle("AccountCloseReq_CMD", protobufPack.AccountCloseReq);

    Handle("AccountPayURLReq_CMD", protobufPack.AccountPayURLReq);
    Handle("AccountPayInfoReq_CMD", protobufPack.AccountPayInfoReq);
    Handle("AccountWithdrawalReq_CMD", protobufPack.AccountWithdrawalReq);
    Handle("AccountWithdrawalViewReq_CMD", protobufPack.AccountWithdrawalViewReq);

    Handle("ClubSUserNoticeReq_CMD", protobufPack.ClubSUserNoticeReq);
    Handle("ClubSUserNoticeHandleReq_CMD", protobufPack.ClubSUserNoticeHandleReq);
}();

module.exports = {
    map: Request,

    release: function() {
        delete Request[CMD.Main_CMD];
    }
};