var ProtocolFun = require('protocolFun');
let CMD = require('protocol_login');
let protobufPack = require("proto_login");
let baseRequest = require("request");
let Request = baseRequest.getRequest();


let MapLogin = new Map;
let MapGateway = new Map;//网关



Request.set(CMD.MDM_GP_LOGON.value, MapLogin);
Request.set(CMD.MDM_GP_GATEWAY.value, MapGateway);

MapLogin.set(CMD.MDM_GP_LOGON.SUB_REQ_LOGON, function (data) {
    let message = protobufPack.Ruq_Logon.create(data);
    let buffer = protobufPack.Ruq_Logon.encode(message).finish();
    return buffer;
});
MapLogin.set(CMD.MDM_GP_LOGON.SUB_REQ_LOGON_TENCENT, function (data) {
    let message = protobufPack.Ruq_Logon.create(data);
    let buffer = protobufPack.Ruq_Logon.encode(message).finish();
    return buffer;
});

MapLogin.set(CMD.MDM_GP_LOGON.SUB_REQ_REGISTER, function (data) {
    let message = protobufPack.Ruq_Regist.create(data);
    let buffer = protobufPack.Ruq_Regist.encode(message).finish();
    return buffer;
});

MapLogin.set(CMD.MDM_GP_LOGON.SUB_REQ_LOGON_CURRENTGAMEQUERRY, function (data) {
    let message = protobufPack.CurrentGameQuerryReq.create(data);
    let buffer = protobufPack.CurrentGameQuerryReq.encode(message).finish();
    return buffer;
});

MapLogin.set(CMD.MDM_GP_LOGON.SUB_REQ_LOGON_VeriCodeReq_CMD, function (data) {
    let message = protobufPack.VeriCodeReq.create(data);
    let buffer = protobufPack.VeriCodeReq.encode(message).finish();
    return buffer;
});

MapLogin.set(CMD.MDM_GP_LOGON.SUB_REP_LOGON_BindQuerryRsq_CMD, function (data) {
    let message = protobufPack.BindQuerryReq.create(data);
    let buffer = protobufPack.BindQuerryReq.encode(message).finish();
    return buffer;
});

MapLogin.set(CMD.MDM_GP_LOGON.SUB_REP_LOGON_PasswordResetReq_CMD, function (data) {
    let message = protobufPack.PasswordResetReq.create(data);
    let buffer = protobufPack.PasswordResetReq.encode(message).finish();
    return buffer;
});

MapGateway.set(CMD.MDM_GP_GATEWAY.SUB_REQ_CHECKOFFICIAL, function (data) {
    let message = protobufPack.RUQ_CheckOffical.create(data);
    let buffer = protobufPack.RUQ_CheckOffical.encode(message).finish();
    return buffer;
});

MapGateway.set(CMD.MDM_GP_GATEWAY.MiniGame_PublicRsq, function (data) {
    let message = protobufPack.MiniGame_PublicRsq.create(data);
    let buffer = protobufPack.MiniGame_PublicRsq.encode(message).finish();
    return buffer;
});

module.exports = {
    map: Request,

    release: function() {
        delete Request[CMD.MDM_GP_LOGON];
    }
};