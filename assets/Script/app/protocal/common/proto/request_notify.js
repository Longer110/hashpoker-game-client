let CMD = require('protocol_notify');
let protobufPack = require("proto");
let baseRequest = require("request");
let Request = baseRequest.getRequest();

let MapGame = new Map;

Request.set(CMD.NOTIFY.value, MapGame);

//proto 协议请求处理
!function () {
    let Handle = function (protoKey, protoObject) {
        MapGame.set(CMD.NOTIFY[protoKey], function (data) {
            let message = protoObject.create(data);
            let buffer = protoObject.encode(message).finish();

            return buffer;
        })
    }
    //游戏登录协议请求
    // Handle("SUB_REQ_LOGIN", protobufPack.LoginGame_Q);
}();

module.exports = {
    map: Request,

    release: function() {
        delete Request[CMD.NOTIFY];
    }
};