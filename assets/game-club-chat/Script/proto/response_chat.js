let CMD = require('protocol_chat');
let MSG = require('msg_chat');
let protobufPack = require("proto_chat");
let baseResponse = require("response");
let Response = baseResponse.getResponse();

let MapGame = new Map;
Response.set(CMD.CHAT.value, MapGame);

//协议返回处理
!function () {
    let Handle = function (protoKey, protoObject) {
        if (!protoObject) {
            QYLogs.error("protocol_chat", "解析体不存在" + protoKey);
        }
        MapGame.set(CMD.CHAT[protoKey], function (buffer) {
            //空协议体，表示只接受通知，不需要解析
            //空buffer也不需要解析
            let msg = MSG.CHAT[protoKey];
            if (!buffer || !protoObject) {
                return { data: {}, msg: msg };
            }
            let data = protoObject.decode(buffer);
            return { data: data, msg: msg };
        })
    }
    
    //登陆回复
    Handle("ChatLogonRsp_CMD", protobufPack.ChatLogonRsp);
    //聊天请求返回
    Handle("ChatChangeRsp_CMD", protobufPack.ChatChangeRsp);
    //俱乐部聊天 APPkey 返回
    Handle("ClubChatAppKeyRsp_CMD", protobufPack.ClubChatAppKeyRsp);

    //语言聊天token
    Handle("ChatVedioLogonRsp_CMD", protobufPack.ChatVedioLogonRsp);

    //同桌聊天广播（服务端主动推）
    Handle("ChatNotify_CMD", protobufPack.ChatNotify);

    //历史消息返回
    Handle("ChatHistoryRsp_CMD", protobufPack.ChatHistoryRsp);
}();



module.exports = {
    map: Response,

    release: function () {
        delete Response[CMD.CHAT.value];
    },
};