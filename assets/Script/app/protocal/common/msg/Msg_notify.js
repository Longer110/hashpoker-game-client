

let MSG = {
    NOTIFY: {
    },
    LOGICAL: {
    },
}

let proto = require("proto_notify");
let NotifyCli_Proto = proto.NotifyCli_Proto.create();
for (const key in NotifyCli_Proto) {
    let value = NotifyCli_Proto[key];
    if(typeof key == 'string' && typeof value == 'number'){
        MSG.NOTIFY[key] = "NOTIFY_" + key//.toUpperCase();
    }
}

let LOGICAL = [
    "GAME_RECONNECTION",    //场景重连
    "LOAD_SCENE_PERCENT",   //场景加载进度
    "FIT_LAYOUT_SCALE",     //layout全局适配

    "SUBGAME_ENTER_START",  //进入子游戏场景
    // "SUBGAME_EXIT_START",   //退出子游戏场景
    // "LIVE_ROOM_CLOSE",      //直播间已关闭
    // "LIVE_ROOM_LOCK",     //直播间是否有锁
    // "LIVE_SPECIAL_MODE",    //是否特殊玩法
];
LOGICAL.forEach(value => {
    MSG.LOGICAL[value] = "NOTIFY_LOGICAL_" + value;
});

NotifyCli_Proto = null;

module.exports = MSG;