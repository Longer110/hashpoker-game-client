let CMD = require('protocol_notify');
let MSG = require('Msg_notify');
let protobufPack = require("proto");
let baseResponse = require("response");
let Response = baseResponse.getResponse();

let MapGame = new Map;

Response.set(CMD.NOTIFY.value, MapGame);

//proto 协议返回处理
!function () {
    let Handle = function (protoKey, protoObject) {
        if (!protoObject) {
            QYLogs.error("protocol_notify", "解析体不存在" + protoKey);
        }
        MapGame.set(CMD.NOTIFY[protoKey], function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let msg = MSG.NOTIFY[protoKey];
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }

    //游戏登录返回结果
    Handle("RepeatLogonNotify_CMD", protobufPack.RepeatLogonNotify);
    //需要重连通知 (具体的场景信息，到对应游戏服取)
    Handle("PlayingNotify_CMD", protobufPack.PlayingNotify);
}();

module.exports = {
    map: Response,

    release: function() {
        delete Response[CMD.NOTIFY];
    },
};