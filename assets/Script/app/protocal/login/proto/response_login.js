let ProtocolFun = require('protocolFun');
let CMD = require('protocol_login');
let MSG = require('Msg_login');
let protobufPack = require("proto");

let baseResponse = require("response");
let Response = baseResponse.getResponse();

let MapLogin = new Map;
let MapGateway = new Map;//网关

Response.set(CMD.MDM_GP_LOGON.value, MapLogin);
Response.set(CMD.MDM_GP_GATEWAY.value, MapGateway);

!function () {
    let Handle = function (cmd,msg, protoObject) {
        if (!protoObject) {
            QYLogs.error("protocol_login", "解析体不存在" + protoKey);
        }
        MapLogin.set(cmd, function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }


    let GatewayHandle = function (cmd,msg, protoObject) {
        if (!protoObject) {
        }
        MapGateway.set(cmd, function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }



    Handle(CMD.MDM_GP_LOGON.SUB_REP_LOGON_RESULT, MSG.ACCOUNT.SUB_GP_LOGON_SUCCESS, protobufPack.Rup_Logon);
    Handle(CMD.MDM_GP_LOGON.SUB_REP_REGISTER_RESULT, MSG.ACCOUNT.SUB_GP_REGISTER_RESULT, protobufPack.Rup_Regist);
    Handle(CMD.MDM_GP_LOGON.SUB_REP_LOGON_CURRENTGAMEQUERRY, MSG.ACCOUNT.SUB_GP_CURRENTGAMEQUERRY, protobufPack.CurrentGameQuerryRsp);
    Handle(CMD.MDM_GP_LOGON.SUB_REP_LOGON_VeriCodeRep_CMD, MSG.ACCOUNT.SUB_GP_VeriCodeRep, protobufPack.VeriCodeRsp);
    Handle(CMD.MDM_GP_LOGON.SUB_REP_LOGON_BindQuerryRsp_CMD, MSG.ACCOUNT.SUB_GP_BindQuerryRsp, protobufPack.BindQuerryRsp);
    Handle(CMD.MDM_GP_LOGON.SUB_REP_LOGON_PasswordResetRsp_CMD, MSG.ACCOUNT.SUB_GP_PasswordResetRsp, protobufPack.PasswordResetRsp);
    GatewayHandle(CMD.MDM_GP_GATEWAY.SUB_GATEWAY_STOP_SERVER_MAINTAIN, MSG.GATEWAY.SUB_GATEWAY_STOP_SERVER_MAINTAIN, protobufPack.RUP_STOP_Server);
    GatewayHandle(CMD.MDM_GP_GATEWAY.SUB_GATEWAY_NOTICE, MSG.GATEWAY.SUB_GATEWAY_NOTICE, protobufPack.AdNoticeNoteRep);
    GatewayHandle(CMD.MDM_GP_GATEWAY.SUB_CORR_CAPITAL, MSG.GATEWAY.SUB_CORR_CAPITAL, protobufPack.CorrCapital);
    GatewayHandle(CMD.MDM_GP_GATEWAY.SUB_REP_TableSettleInfo, MSG.GATEWAY.SUB_REP_TableSettleInfo, protobufPack.TableSettleInfo);
    GatewayHandle(CMD.MDM_GP_GATEWAY.SUB_REP_CHECKOFFICIAL, MSG.GATEWAY.SUB_REP_CHECKOFFICIAL, protobufPack.RUP_CheckOffical);
    GatewayHandle(CMD.MDM_GP_GATEWAY.MiniGame_PublicRsp, MSG.GATEWAY.MiniGame_PublicRsp, protobufPack.MiniGame_PublicRsp);
    GatewayHandle(CMD.MDM_GP_GATEWAY.SUB_NOTICE_MSG, MSG.GATEWAY.SUB_NOTICE_MSG, protobufPack.NoticeMsg);
    
}();


// MapLogin.set(CMD.MDM_GP_LOGON.SUB_REP_LOGON_RESULT, function (buffer) {

    
//     let data = protobufPack.Rup_Logon.decode(buffer);

//     let msg = MSG.ACCOUNT.SUB_GP_LOGON_SUCCESS;
//     return { data: data, msg: msg };
// })

// MapLogin.set(CMD.MDM_GP_LOGON.SUB_REP_REGISTER_RESULT, function (buffer) {

//     QYLogs.log("Response", "Register buffer length=" + buffer.byteLength);
//     let data = protobufPack.Rup_Regist.decode(buffer);

//     let msg = MSG.ACCOUNT.SUB_GP_REGISTER_RESULT;
//     return { data: data, msg: msg };
// })

module.exports = {
    map: Response,

    release: function(buffer) {
        delete Response[CMD.MDM_GP_LOGON.value];
        delete Response[CMD.MDM_GP_GATEWAY.value];
    },
};