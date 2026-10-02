let MSG = {
    ClubTexas: {

    },
    Texas: {
    },
    LiveSlave: {

    },
    //本地相关
    NOTIFY: {
        NOTIFY_CLOSE_WINDOW: "NOTIFY_CLOSE_WINDOW",//nRlt 0:关闭弹窗 1:显示帮助 2:显示设置 3:显示提示 4:购买弹窗 5:显示战绩 6:带出弹窗
        NOTIFY_SAVE_CLOSE_WINDOW: "NOTIFY_SAVE_CLOSE_WINDOW",//存储关闭弹窗
        NOTIFY_UPDATE_BUY_GOLD: "NOTIFY_UPDATE_BUY_GOLD",//刷新购买金币
        NOTIFY_SHOW_ROOM_CONFIG: "NOTIFY_SHOW_ROOM_CONFIG",//显示房间配置弹窗
        NOTIFY_GAME_REQ: "NOTIFY_GAME_REQ",//游戏请求
        NOTIFY_POKERS: "NOTIFY_POKERS",//扑克
        NOTIFY_GAME_BG: "NOTIFY_GAME_BG",//背景
        
        NOTIFY_VIDEO_INIT: "NOTIFY_VIDEO_INIT",//场景初始化
        NOTIFY_VIDEO_SCENE_RECONNECT: "NOTIFY_VIDEO_SCENE_RECONNECT",//场景重连
        NOTIFY_VIDEO_GAME_START: "NOTIFY_VIDEO_GAME_START",//游戏开始
        NOTIFY_VIDEO_USER_STAND: "NOTIFY_VIDEO_USER_STAND",//玩家站起
        NOTIFY_VIDEO_GET_OPERATION: "NOTIFY_VIDEO_GET_OPERATION",//操作权获得
        NOTIFY_VIDEO_USER_OPERATION: "NOTIFY_VIDEO_USER_OPERATION",//有玩家操作通知
        NOTIFY_VIDEO_COMMON_CARDS: "NOTIFY_VIDEO_COMMON_CARDS",//公共牌
        NOTIFY_VIDEO_SETTLE: "NOTIFY_VIDEO_SETTLE",//结算
        NOTIFY_MTT_MATCH_END: "NOTIFY_MTT_MATCH_END", //mtt比赛结束

        NOTIFY_SHOW_CHAT: "NOTIFY_SHOW_CHAT",//显示聊天室

        ClubDeZhouHashListRsp_ui : "ClubDeZhouHashListRsp_ui",//俱乐部洗牌凭证列表
        ClubDeZhouHashCardRsp_ui : "ClubDeZhouHashCardRsp_ui",//俱乐部局牌序列详情
        ClubDeZhouUserStaticRsp_ui : "ClubDeZhouUserStaticRsp_ui", //德州结算详情
    }
}

let proto = require("proto_texas");
let ClubTexasProto = proto.ClubDeZhou_Proto.create();
for (const key in ClubTexasProto) {
    let value = ClubTexasProto[key];
    if(typeof key == 'string' && typeof value == 'number'){
        MSG.ClubTexas[key] = "ClubTexas_" + key.toUpperCase();
    }
}
ClubTexasProto = null;

let TexasProto = proto.DeZhou_Proto.create();
for (const key in TexasProto) {
    let value = TexasProto[key];
    if(typeof key == 'string' && typeof value == 'number'){
        MSG.Texas[key] = "Texas_" + key.toUpperCase();
    }
}
TexasProto = null;



let LiveSlave_Proto = proto.LiveSlave_Proto.create();
for (const key in LiveSlave_Proto) {
    let value = LiveSlave_Proto[key];
    if(typeof key == 'string' && typeof value == 'number'){
        MSG.LiveSlave[key] = "LiveSlave_" + key.toUpperCase();
    }
}
LiveSlave_Proto = null;

module.exports = MSG;