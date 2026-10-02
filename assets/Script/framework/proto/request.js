var ProtocolFun = require('protocolFun');
let CMD = require('protocol');
let protobufPack = require("proto");

let Request = new Map;
let MapTest = new Map;


Request.set(CMD.HEART_BEAT_MAIN_CMD.value, MapTest);
// MapTest.set(CMD.TEST.TEST, function (data) {
//     let message = protobufPack.Person.create(data);
//     let buffer = protobufPack.Person.encode(message).finish();
//     return buffer;
// });

let QYLogUpload = new Map;

Request.set(CMD.QYLOG_UPLOAD_MAIN_CMD.value, QYLogUpload);
QYLogUpload.set(CMD.QYLOG_UPLOAD_MAIN_CMD.LogFileCreateReq_CMD,function (data) {
    let message = protobufPack.LogFileCreateReq.create(data);
    let buffer = protobufPack.LogFileCreateReq.encode(message).finish();
    return buffer;
});
QYLogUpload.set(CMD.QYLOG_UPLOAD_MAIN_CMD.LogWriteReq_CMD, function (data) {
    let message = protobufPack.LogWriteReq.create(data);
    let buffer = protobufPack.LogWriteReq.encode(message).finish();
    return buffer;
});

QYLogUpload.set(CMD.QYLOG_UPLOAD_MAIN_CMD.LineCheckReq_CMD, function (data) {
    let message = protobufPack.LineCheckReq.create(data);
    let buffer = protobufPack.LineCheckReq.encode(message).finish();
    return buffer;
});


module.exports = {
    map: Request,

    request: function(mainCmd, subCmd, data,qySocket) {
        if ((mainCmd == 0 && subCmd == 0) || mainCmd == CMD.QYLOG_UPLOAD_MAIN_CMD.value){
            // console.debug("Request", "mainCmd=" + mainCmd);
            // console.debug("Request", "subCmd =" + subCmd);
        }
        else{
            QYLogs.log("Request", "mainCmd=" + mainCmd);
            QYLogs.log("Request", "subCmd =" + subCmd);
            QYLogs.object("Request","data = ", data)
        }
        let buffer = null;
        let main = Request.get(mainCmd);
        if (main){
            let sub = main.get(subCmd);
            if (sub) {
                buffer = sub(data);
                // console.log("Request", "buffer length=" + buffer.length);
                // console.debug("Request", "buffer =" + buffer);
            }
            else{
                if(mainCmd!=0 && subCmd!=0){
                    QYLogs.error("Request", "not found Sub CMD  subCmd =" + subCmd);
                }
            }
        }else{
            QYLogs.error("Request", "not found Main CMD  mainCmd =" + mainCmd);
        }
        return ProtocolFun.setSendData(buffer, mainCmd, subCmd, qySocket);
    },
    getRequest:function () {
        return Request;
    }
};