let ProtocolFun = require('protocolFun');
let CMD = require('protocol');
let MSG = require('Msg');
let protobufPack = require("proto");
let Response = new Map;

// let MapTest = new Map;


// Response.set(CMD.HEART_BEAT_MAIN_CMD.value, MapTest);


// // 心跳
// MapTest.set(CMD.TEST.TESTRESP, function (buffer) {

//     let data = protobufPack.Person.decode(buffer);

//     let msg = MSG.WEBSOCKET.HEARTBEAT;
//     return { data: data, msg: msg };
// })
let QYLogUpload = new Map;
Response.set(CMD.QYLOG_UPLOAD_MAIN_CMD.value, QYLogUpload);

!function () {
    let Handle = function (cmd, msg, protoObject) {
        if (!protoObject) {
            QYLogs.error("proto", "解析体不存在" + protoKey);
        }
        QYLogUpload.set(cmd, function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    Handle(CMD.QYLOG_UPLOAD_MAIN_CMD.LogFileCreateRsp_CMD, MSG.QYLOG_UPLOAD.CREATE, protobufPack.LogFileCreateRsp);
    Handle(CMD.QYLOG_UPLOAD_MAIN_CMD.LineCheckRsp_CMD, MSG.QYLOG_UPLOAD.LineCheckRsp_CMD, protobufPack.LineCheckRsp);

}();


// QYLogUpload.set(CMD.QYLOG_UPLOAD_MAIN_CMD.LogFileCreateRsp_CMD, function (buffer) {
//     let data = protobufPack.LogFileCreateRsp.decode(buffer);
//     let msg = MSG.QYLOG_UPLOAD.CREATE;
//     return { data: data, msg: msg };
// })


module.exports = {
    map: Response,

    response: function(buffer,skipHead) {
        // QYLogs.log("response", "skipHead", skipHead);
        return ProtocolFun.setReceiveData(buffer, Response, skipHead);
    },
    getResponse:function () {
        return Response;
    }
};