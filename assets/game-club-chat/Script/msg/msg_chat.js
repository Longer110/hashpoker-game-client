let MSG = {
    CHAT: {

    },
    NOTIFY: {
        OLD_MESSAGE_ADD: "CHAT_OLD_MESSAGE_ADD",//更早期消息插入
        MESSAGE_ADD: "CHAT_MESSAGE_ADD",//消息插入
        MESSAGE_UPDATE: "CHAT_MESSAGE_UPDATE",//更新子项消息
        AUDIO_PLAY_START: "CHAT_AUDIO_PLAY_START",//语音播放开始
        AUDIO_PLAY_END: "CHAT_AUDIO_PLAY_END",//语音播放结束
        MESSAGE_RESET: "CHAT_MESSAGE_RESET",//消息重置
        MESSAGE_USERINFO_UPDATE: "MESSAGE_USERINFO_UPDATE",//用户信息更新
        RECORD_UPATE: "RECORD_UPATE",//录音更新
        INIT_BARRAGE: "INIT_BARRAGE",//初始化弹幕类型

        VIDEO_PLAY_USERS: "VIDEO_PLAY_USERS",//正在说话的用户列表

        VIDEO_PLAY_SELF_AUDIO: "VIDEO_PLAY_SELF_AUDIO",//自己说话时间派发


        NOTIFY_SHOW_CHAT_BUBBLE: "NOTIFY_SHOW_CHAT_BUBBLE",//通知展示聊天信息
    },
}

let proto = require("proto_chat");
let Chat_Proto = proto.Chat_Proto.create();
for (const key in Chat_Proto) {
    let value = Chat_Proto[key];
    if (typeof key == 'string' && typeof value == 'number') {
        MSG.CHAT[key] = "CHAT_" + key.toUpperCase();
    }
}
Chat_Proto = null;
module.exports = MSG;