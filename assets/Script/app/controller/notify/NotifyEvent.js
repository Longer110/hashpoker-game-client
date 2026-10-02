let NotifyEvent = {
    SERVER_LOGIN_SUCCESS: "SERVER_LOGIN_SUCCESS",                   //账号登录成功
    SERVER_LOGIN_FAIL: "SERVER_LOGIN_FAIL",                         //账号登录失败
    SERVER_REGIST_FAIL: "SERVER_REGIST_FAIL",                       //账号注册失败

    SERVER_RELOGIN: "SERVER_RELOGIN",                               //账号重复登录
    SERVER_GAME_WEI_HU_ZHONG: "SERVER_GAME_WEI_HU_ZHONG",           //游戏维护中
    SERVER_SUBGAME_WEI_HU_ZHONG: "SERVER_SUBGAME_WEI_HU_ZHONG",     //子游戏维护中
    SERVER_KICKOUT_ROOM: "SERVER_KICKOUT_ROOM",                     //踢出房间

    SERVER_GATEWAY_NOTICE: "SERVER_GATEWAY_NOTICE",                 //网关跑马灯通知
    SERVER_VERSION_ERROR: "SERVER_VERSION_ERROR",                   //服务器配置的版本号与客户端不一致

    HALL_LOGIN_SUCCESS: "HALL_LOGIN_SUCCESS",                       //登录大厅成功
    HALL_LOGIN_FAIL: "HALL_LOGIN_FAIL",                             //登录大厅失败
    HALL_LOGIN_FINISH: "HALL_LOGIN_FINISH",                         //登录大厅成功完成，避免多个地方监听HALL_LOGIN_SUCCESS导致顺序执行不可控问题
    HALL_ENTER_START: "HALL_ENTER_START",                           //开始进入大厅场景
    HALL_PRELOAD_SUBGAME: "HALL_PRELOAD_SUBGAME",                   //大厅界面预加载子游戏

    GAME_LAUNCH_SUCCESS: "GAME_LAUNCH_SUCCESS",                     //游戏启动成功
    GAME_LAUNCH_INVALID: "GAME_LAUNCH_INVALID",                     //无效的游戏启动方式（缺少accout等启动参数）
    
    SUBGAME_START: "SUBGAME_START",                                 //进入子游戏
    SUBGAME_RESTART: "SUBGAME_RESTART",                             //重新进入子游戏
    SUBGAME_ENTER_ROOM: "SUBGAME_ENTER_ROOM",                       //进入子游戏房间
}

module.exports = NotifyEvent;