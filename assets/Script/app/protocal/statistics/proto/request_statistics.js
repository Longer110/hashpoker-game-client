let CMD = require('protocol_statistics');
let protobufPack = require("proto_statistics");

let baseRequest = require("request");
let Request = baseRequest.getRequest();


let MapStatistics = new Map;


Request.set(CMD.MDM_GP_STATISTICS.value, MapStatistics);


MapStatistics.set(CMD.MDM_GP_STATISTICS.SUB_Bur_UserInfoReq_CMD, function (data) {
    let message = protobufPack.Bur_UserInfoREQ.create(data);
    let buffer = protobufPack.Bur_UserInfoREQ.encode(message).finish();
    return buffer;
});



module.exports = {
    map: Request,

    release: function() {
        delete Request[CMD.MDM_GP_STATISTICS.value];
    }
};