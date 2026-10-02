let Protocol = {
    MDM_GP_LOGON: {
        ["value"]: 1,
        SUB_REQ_LOGON: 100,//帐号登录
        SUB_REQ_REGISTER: 2,//注册帐号
        SUB_REQ_LOGON_TENCENT: 3,//微信登录
        SUB_REQ_LOGON_CURRENTGAMEQUERRY:29,//查询玩家当前正在玩的游戏 请求
        SUB_REP_LOGON_RESULT: 100,//登录返回
        SUB_REP_REGISTER_RESULT: 101,//注册返回
        SUB_REP_RECONNECT: 102,//返回重连信息
        SUB_REP_LOGON_CURRENTGAMEQUERRY:30,//查询玩家当前正在玩的游戏 返回
        SUB_REQ_LOGON_VeriCodeReq_CMD: 31, //获取验证码请求
        SUB_REP_LOGON_VeriCodeRep_CMD: 32, //获取验证码返回
        SUB_REP_LOGON_BindQuerryRsq_CMD: 33, //绑定查询请求
        SUB_REP_LOGON_BindQuerryRsp_CMD: 34, //绑定查询返回
        SUB_REP_LOGON_PasswordResetReq_CMD: 35, //密码重置请求
        SUB_REP_LOGON_PasswordResetRsp_CMD: 36, //密码重置请求
        
    },
    MDM_GP_GATEWAY: {//网关
        ["value"]: 1000,
        SUB_GATEWAY_STOP_SERVER_MAINTAIN: 3,//子游戏维护通知
        SUB_GATEWAY_NOTICE: 12,//跑马灯
        SUB_CORR_CAPITAL:18,
        SUB_REP_TableSettleInfo: 19,//牌桌结算
        SUB_REQ_CHECKOFFICIAL: 20,//检查是否是官方房
        SUB_REP_CHECKOFFICIAL: 21,//返回是否是官方房
        MiniGame_PublicRsq: 24,//小游戏公共部分 请求
        MiniGame_PublicRsp: 25,//小游戏公共部分 返回
        SUB_NOTICE_MSG: 26,//消息通知
    },

    LOGIN:{

    }

};
module.exports = Protocol;