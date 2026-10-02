module.exports = {
    //protocol
    ACCOUNT: {
        SUB_GP_LOGON_SUCCESS: "login_login_return_success",         //登录返回
        SUB_GP_REGISTER_RESULT: "login_register_return_success",	    //注册返回

        SUB_WX_LOGON_RESULT: "ACCOUNT_SUB_WX_LOGON_RESULT",  //微信登录返回
        SUB_WX_REGISTER_RESULT: "ACCOUNT_SUB_WX_REGISTER_RESULT",//微信注册返回
        SUB_GP_WEIXIN_KEY: "ACCOUNT_SUB_GP_WEIXIN_KEY",   	//微信登录返回的key,用于断线重登
        SUB_GP_WEIXIN_ERROR: "ACCOUNT_SUB_GP_WEIXIN_ERROR",	//微信登录  错误返回
        SUB_GP_RECONNECT: "ACCOUNT_SUB_GP_RECONNECT",     //返回重连信息
        SUB_GP_CURRENTGAMEQUERRY: "SUB_GP_CURRENTGAMEQUERRY",     //查询玩家当前正在玩的游戏 回复
        SUB_GP_VeriCodeRep: "SUB_GP_VeriCodeRep",     //获取验证码返回
        SUB_GP_BindQuerryRsp: "SUB_GP_BindQuerryRsp",     //绑定查询返回
        SUB_GP_PasswordResetRsp: "SUB_GP_PasswordResetRsp", //重置密码返回
    },
    //大厅
    LOBBY: {
    },
    //通知
    NOTIFY: {
        NOTIFY_TOGGLE: "NOTIFY_NOTIFY_TOGGLE",     //首页破记录通知开关
        SHOW_TIPS_PANEL: "NOTIFY_SHOW_TIPS_PANEL",   //从好友求助链接打开时，显示tips面板

        LOGIN_START: "NOTIFY_LOGIN_START",       //登录
        LOGIN_WX_START: "NOTIFY_LOGIN_WX_START",    //微信登录
        LOGIN_SUCCESS: "NOTIFY_LOGIN_SUCCESS",      //登录账号成功通知
        LOGOUT_SUCCESS: "NOTIFY_LOGIN_SUCCESS",     //退出登录成功通知(多账号登录)
        LOGIN_GUEST :"NOTIFY_LOGIN_GUEST",          //游客登录
        LOGIN_TOKEN:"NOTIFY_LOGIN_TOKEN",           //令牌登录
        LOGIN_VIEWER: "NOTIFY_LOGIN_VIEWER",        //观众登录
        LOGIN_INVALID: "NOTIFY_LOGIN_INVALID",      //无效登录
        LOGIN_INIT: "NOTIFY_LOGIN_INIT",            //初始化登录界面
        LOGIN_SHOW_PANEL: "NOTIFY_LOGIN_SHOW_PANEL",//登录界面显示那个组件

        REGISTER_START: "NOTIFY_REGISTER_START",    //注册
        REGISTER_SUCCESS: "NOTIFY_REGISTER_SUCCESS",  //注册成功通知

        
    },

    //网关
    GATEWAY:{
        SUB_GATEWAY_STOP_SERVER_MAINTAIN:"SUB_GATEWAY_STOP_SERVER_MAINTAIN",//子游戏维护通知
        SUB_GATEWAY_NOTICE:"NOTIFY_GATEWAY_NOTICE",//跑马灯通知
        SUB_CORR_CAPITAL:"SUB_CORR_CAPITAL",//金币更新
        SUB_REP_TableSettleInfo: "SUB_REP_TableSettleInfo",//牌桌结算
        SUB_REP_CHECKOFFICIAL: "SUB_REP_CHECKOFFICIAL",
        MiniGame_PublicRsp:"SUB_GATEWAY_MiniGame_PublicRsp",
        SUB_NOTICE_MSG: "SUB_NOTICE_MSG",//消息通知

    },

}