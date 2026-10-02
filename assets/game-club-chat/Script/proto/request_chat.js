let CMD = require('protocol_chat');
let protobufPack = require("proto_chat");
let baseRequest = require("request");


let Request = baseRequest.getRequest();

let MapGame = new Map;
Request.set(CMD.CHAT.value, MapGame);

//协议请求处理
!function () {
    let Handle = function (protoKey, protoObject) {
        MapGame.set(CMD.CHAT[protoKey], function (data) {
            let message = protoObject.create(data);
            let buffer = protoObject.encode(message).finish();

            return buffer;
        })
    }
    //登陆请求
    Handle("ChatLogonReq_CMD", protobufPack.ChatLogonReq);
    //返回大厅
    Handle("ChatBackToLobbyReq_CMD", protobufPack.ChatBackToLobbyReq);
    //聊天请求
    Handle("ChatChangeReq_CMD", protobufPack.ChatChangeReq);
    //俱乐部聊天 APPkey 请求
    Handle("ClubChatAppKeyReq_CMD", protobufPack.ClubChatAppKeyReq);

    // 俱乐部语音聊天聊天 APPkey 请求
    Handle("ChatVedioLogonReq_CMD", protobufPack.ChatVedioLogonReq);

    
}();

module.exports = {
    map: Request,
    release: function () {
        delete Request[CMD.CHAT.value];
    }
};