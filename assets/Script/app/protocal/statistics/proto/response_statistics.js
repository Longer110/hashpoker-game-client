let CMD = require('protocol_statistics');
// let MSG = require('Msg_statistics');
let protobufPack = require("proto_statistics");

let baseResponse = require("response");
let Response = baseResponse.getResponse();

let MapStatistics = new Map;



!function () {
    let Handle = function (cmd, msg, protoObject) {
        if (!protoObject) {
            QYLogs.error("proto_statistics", "解析体不存在" + protoKey);
        }
        MapStatistics.set(cmd, function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    Handle(CMD.MDM_GP_STATISTICS.SUB_Bur_UserInfoRsp_CMD, null, protobufPack.Bur_UserInfoRSP);


}();



module.exports = {
    map: Response,

    release: function(buffer) {
        delete Response[CMD.MDM_GP_STATISTICS.value];
    },
};