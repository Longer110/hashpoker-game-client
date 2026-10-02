let CMD = require('protocol_upgrade');
let protobufPack = require("proto_upgrade");

let baseRequest = require("request");
let Request = baseRequest.getRequest();


let MapUpgrade = new Map;


Request.set(CMD.MDM_GP_UPGRADE.value, MapUpgrade);

MapUpgrade.set(CMD.MDM_GP_UPGRADE.SUB_REQ_VersionInfoReq_CMD, function (data) {
    let message = protobufPack.VersionInfoReq.create(data);
    let buffer = protobufPack.VersionInfoReq.encode(message).finish();
    return buffer;
});


MapUpgrade.set(CMD.MDM_GP_UPGRADE.SUB_REQ_LogWriteReq_CMD, function (data) {
    let message = protobufPack.LogWriteReq.create(data);
    let buffer = protobufPack.LogWriteReq.encode(message).finish();
    return buffer;
});


module.exports = {
    map: Request,

    release: function() {
        delete Request[CMD.MDM_GP_UPGRADE.value];
    }
};