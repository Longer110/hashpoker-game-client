let ProtocolFun = require('protocolFun');
let CMD = require('protocol_upgrade');
let MSG = require('Msg_upgrade');
let protobufPack = require("proto_upgrade");

let baseResponse = require("response");
let Response = baseResponse.getResponse();

let MapUpgrade = new Map;


Response.set(CMD.MDM_GP_UPGRADE.value, MapUpgrade);

!function () {
    let Handle = function (cmd, msg, protoObject) {
        if (!protoObject) {
            QYLogs.error("proto_upgrade", "解析体不存在" + protoKey);
        }
        MapUpgrade.set(cmd, function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    Handle(CMD.MDM_GP_UPGRADE.SUB_REP_VersionInfoRsp_CMD, MSG.UPDATE_VERSION, protobufPack.VersionInfoRsp);
    Handle(CMD.MDM_GP_UPGRADE.SUB_REP_MaintenanceNotify_CMD, MSG.UPDATE_MAINTENANCENOTIFY, protobufPack.MaintenanceNotify);
    Handle(CMD.MDM_GP_UPGRADE.SUB_REP_KickOutNotify_CMD, MSG.UPDATE_KICKOUTNOTIFY, protobufPack.KickOutNotify);

}();


// MapTest.set(CMD.MDM_GP_UPGRADE.SUB_REP_VersionInfoRsp_CMD, function (buffer) {
//     let data = protobufPack.VersionInfoRsp.decode(buffer);
//     let msg = MSG.UPDATE_VERSION;
//     return { data: data, msg: msg };
// })

// MapTest.set(CMD.MDM_GP_UPGRADE.SUB_REP_MaintenanceNotify_CMD, function (buffer) {
//     let data = protobufPack.MaintenanceNotify.decode(buffer);
//     let msg = MSG.UPDATE_MAINTENANCENOTIFY;
//     return { data: data, msg: msg };
// })


module.exports = {
    map: Response,

    release: function(buffer) {
        delete Response[CMD.MDM_GP_UPGRADE.value];
    },
};