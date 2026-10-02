// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let object = {
    WEBSOCKET:{
        HEARTBEAT:  "HEARTBEAT",

        CONNECTING: "WEBSOCKET_CONNECTING",
        OPEN:       "WEBSOCKET_OPEN",
        CLOSE:      "WEBSOCKET_CLOSE",
        MESSAGE:    "WEBSOCKET_MESSAGE",
        ERROR:      "WEBSOCKET_ERROR",
        TIMEOUT:    "WEBSOCKET_TIMEOUT",
        LATENCY:    "WEBSOCKET_LATENCY", //网络时延
    },

    ENGINE: {
        GAME_EVENT_HIDE: "ENGINE_GAME_EVENT_HIDE",
        GAME_EVENT_SHOW: "ENGINE_GAME_EVENT_SHOW",
        WX_EVENT_HIDE:   "ENGINE_WX_EVENT_HIDE",
        WX_EVENT_SHOW:   "ENGINE_WX_EVENT_SHOW",
        APP_LOADED:      "ENGINE_APP_LOADED",     //全局APP资源加载完成
        SCREEN_SIZE_CHANGE: "ENGINE_SCREEN_SIZE_CHANGE", //屏幕大小发生变化（浏览器下）
        SCREEN_FULL_CHANGE: "ENGINE_SCREEN_FULL_CHANGE", //屏幕全屏/窗口发生变化（浏览器下）
    },


    TOUCH: {
        START:      "TOUCH_START",
        MOVE:       "TOUCH_MOVE",
        END:        "TOUCH_END",
        CANCEL:     "CANCEL",
    },

    WX: {
        LAUNCH: "WX_LAUNCH",    //微信启动
    },
    
    USERINFO: {
        MODIFY:     "USERINFO_MODIFY",
    },
    
    MAGICEXPRESSION: {
        MAGIC_FACE_INFO_CHANGE: "MAGIC_FACE_INFO_CHANGE",   //魔法表情信息修改
        MAGIC_FACE_USE: "MAGIC_FACE_USE",    //使用魔法表情
        MAGIC_FACE_RESULT: "MAGIC_FACE_RESULT", //使用魔法表情结果
        CLOSE_TABLEINFO: "CLOSE_TABLEINFO",//关闭牌桌弹窗
    },


    //声音预加载
    SOUNDINFO:{
        SOUNDINFO_START: "SUNDINFO_START",//声音预加载开始
    },
  
    //财富
    WEALTH: {
        SUB_REP_LEVEL_GATEF:        "WEALTH_SUB_REP_LEVEL_GATEF",    //通关统计返回
        SUB_REP_GET_CAR_LIST:       "WEALTH_SUB_REP_GET_CAR_LIST",  //返回财富列表
        SUB_REP_BUY_CAR:            "WEALTH_SUB_REP_BUY_CAR",       //车辆解锁返回
        SUB_REP_GET_WORLD_TOP:      "WEALTH_SUB_REP_GET_WORLD_TOP", // 返回世界排行榜
        SUB_REP_GET_GATE_NUM_RECORD:"WEALTH_SUB_REP_GET_GATE_NUM_RECORD", //返回关卡记录
        SUB_REP_GET_CUR_USER_INFO:  "WEALTH_SUB_REP_GET_CUR_USER_INFO", //返回某关卡通关用时最短全球记录玩家信息
        SUB_REP_HELP_GATE:          "WEALTH_SUB_REP_HELP_GATE",        //协助好友通关
    },
    GATEWAY: {
        SUB__GATEWAY_TC_GUANGBO:    "GATEWAY_SUB__GATEWAY_TC_GUANGBO", //破记录广播 
    },

    SUB_GAME_UPGRADE:{
        START:"SUB_GAME_UPGRADE_START",
        PROGRESS:"SUB_GAME_UPGRADE_PROGRESS",
        SUCCESS:"SUB_GAME_UPGRADE_SUCCESS",
        FAILED:"SUB_GAME_UPGRADE_FAILED",
    },
    QYLOG_UPLOAD:{
        CREATE:"QYLOG_UPLOAD_CREATE",
        LineCheckRsp_CMD:"SUB_LineCheckRsp_CMD",
    },

    NOTIFY:{
        NOTIFY_SHOW_PROMPT: "NOTIFY_SHOW_PROMPT",       //显示提示窗
    },
    UIMANAGER:{
        CLEAR_UIMANAGE_RES:"CLEAR_UIMANAGE_RES",
    },

    PING:{
        PING_TIME_SERVER:"PING_TIME_SERVER",
    }
    
};

module.exports = object;
