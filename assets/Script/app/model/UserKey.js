// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let prefix = "";
let UserKey = {
    COMMON: {
        VOLUME_MUSIC: prefix+"VOLUME_MUSIC", //背景音乐大小
        VOLUME_EFFECT: prefix+"VOLUME_EFFECT",//音效大小

        LANGUAGE_EFFECT: prefix+"LANGUAGE_EFFECT",//语音语言

        SHAKE: prefix+"SHAKE",     //设置-震动
        NOTICE: prefix+"NOTICE",   //设置-通知

        LOGINNAME: prefix+"LOGINNAME", //登录-用户名
        LOGINPWD: prefix+"LOGINPWD",   //登录-用户密码
        GUEST_ID: prefix+"GUEST_ID",    //游客登录机器码
        TEMP_TOKEN: prefix+"TEMP_TOKEN",//临时令牌
        FIRST_TOKEN: prefix+"FIRST_TOKEN",//首次令牌
        
        LAST_LOGIN_WAY: prefix+"LAST_LOGIN_WAY",//上一次登录方式："GUEST"游客方式，"ACCOUNT"账号方式

        REMEMBERSTATE: prefix+"REMEMBERSTATE",   //是否记住密码
        AUTOLOGINSTATE: prefix+"AUTOLOGINSTATE", //是否自动登录

        DEVSERVER: prefix+"DEVSERVER", //开发版服务器选择
        CLIENT_VERSION: prefix+"CLIENT_VERSION", //客户端版本

        SYSTEM_LANGUAGE: prefix+"SYSTEM_LANGUAGE", //设置游戏中英文版本
        APP_USERID: prefix+"APP_USERID", //直播App注册用户

        GATEWAY_LIST: prefix+"GATEWAY_LIST", //获取网关的url
        SKIN: prefix+"SKIN", //皮肤

        USER_DEVICESID: prefix+"USER_DEVICESID", //用户设备ID
        SUBBUNDLE_VERSION: prefix+"SUBBUNDLE_VERSION", //子包版本号

        LOADING_POSITION: prefix+"LOADING_POSITION", //loading面板位置（居中、或者 靠底部 等）
        BUNDLE_CONFIG: prefix+"BUNDLE_CONFIG", //子包配置
        BUNDLE_CONFIG_URL: prefix+"BUNDLE_CONFIG_URL", //子包配置URL
    },

    PRIVATE: {
        SCORE: "SCORE", //
    }
};

module.exports = UserKey;
