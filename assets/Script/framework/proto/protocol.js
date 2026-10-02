// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// 主命令和次命令的相关协议 ，消息头的部分，消息内容采用protobuf的协议，解析在 proto.js 文件中
let Protocol = {
    HEART_BEAT_MAIN_CMD:{
        ["value"]: 0,
        HEART_BEAT_SUB_CMD:0,
    },
  
    QYLOG_UPLOAD_MAIN_CMD:{
        ["value"]: 1300,
        LogFileCreateReq_CMD:5,
        LogFileCreateRsp_CMD:6,
        LogWriteReq_CMD:4,
        LineCheckReq_CMD:7,
        LineCheckRsp_CMD:8,
    },

    MDM_GP_STATISTICS:{
        ["value"]: 2101,
        SUB_Bur_UserInfoReq_CMD: 1,//埋点数据 请求
        SUB_Bur_UserInfoRsp_CMD: 2,//埋点数据返回
    },
};
module.exports = Protocol;