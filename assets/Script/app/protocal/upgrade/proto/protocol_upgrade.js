let Protocol = {
    TEST: {
        ["value"]: 88,
        TEST: 88,
        TESTRESP: 89,
    },
    MDM_GP_UPGRADE:{
        ["value"]: 1200,
        SUB_REQ_VersionInfoReq_CMD: 1,//当前版本信息 请求
        SUB_REQ_LogWriteReq_CMD: 4,//写日志 请求
        SUB_REP_VersionInfoRsp_CMD:2,//当前版本信息 回复
        SUB_REP_MaintenanceNotify_CMD:3,//维护 通知
        SUB_REP_KickOutNotify_CMD: 5, //请离 通知
    }

};
module.exports = Protocol;