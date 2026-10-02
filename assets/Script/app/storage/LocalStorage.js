// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let my = require("my");

//TODO
let WXSDK = require("WXSDK");
let UserKey = require("UserKey");
let KEY = UserKey.COMMON;
// let ConfigFrameWorks = require("config_frameworks");
// let ConfigGame = require("ConfigGame");
let Base64 = require("base64");

let ConfigAudioPool = {
    bgmVolume: 0.5,
    sfxVolume: 1,
}

let ConfigLanguage = {
    language_1: 1,//普通话
    language_2: 2,//粤语
    language_3: 3,//潮汕话
}


let LocalStorage = cc.Class({
    extends: my.StorageManager,

    properties: {
    },

    ctor() {
        // cc.sys.language = this.getSysLanguage();
        
        //TODO
        // let music = this.getMusicVolume();
        // app.audio.setMusicVolume(music)
        // let effect = this.getEffectVolume();
        // app.audio.setEffectsVolume(effect)

        // let shake = this.getShake();
        // let isChecked = shake == 0 ? true : false;
        // WXSDK.setShakeEnabled(!isChecked);
    },

    //////////////////////////////////////常用本地属性//////////////////////////////////////


    //语音语言
    getLanguageEffect(){
        let value = this.getItem(KEY.LANGUAGE_EFFECT, ConfigLanguage.language_1);
        return value;
    },

    setLanguageEffect(value){
        this.setItem(KEY.LANGUAGE_EFFECT, value);
    },

    //设置系统中英文版本
    getSysLanguage(){
        let value = this.getItem(KEY.SYSTEM_LANGUAGE, 'zh');
        return value;
    },
    setSysLanguage(value){
        cc.sys.language = value;
        this.setItem(KEY.SYSTEM_LANGUAGE, value);
    },

    //背景音乐
    getMusicVolume() {
        let value = this.getItem(KEY.VOLUME_MUSIC, ConfigAudioPool.bgmVolume);
        return value;
    },
    setMusicVolume(value) {
        app.audio.setMusicVolume(value);
        this.setItem(KEY.VOLUME_MUSIC, value);
    },
    //音效
    getEffectVolume() {
        let value = this.getItem(KEY.VOLUME_EFFECT, ConfigAudioPool.sfxVolume);
        return value;
    },
    setEffectVolume(value) {
        app.audio.setEffectsVolume(value);
        this.setItem(KEY.VOLUME_EFFECT, value);
    },
    //账号登录用户名
    getLoginName() {
        let value = this.getItem(KEY.LOGINNAME, "");
        return value;
    },
    setLoginName(value) {
        this.setItem(KEY.LOGINNAME, value);
    },
    //游客登录机器码
    getGuestID() {
        let value = this.getItem(KEY.GUEST_ID, "");
        return value;
    },
    setGuestID(value) {
        this.setItem(KEY.GUEST_ID, value);
    },
    //直播APP用户ID
    getAppUserID(){
        let value = this.getItem(KEY.APP_USERID, "");
        return value;
    },
    setAppUserID(value){
        this.setItem(KEY.APP_USERID, value);
    },
    //登录密码
    getLoginPWD() {
        let value = this.getItem(KEY.LOGINPWD, "");
        let decodeValue = value;
        if(value&&value!=""){//IE
            try{
                decodeValue = Base64.decode(value);
            }catch(error){
                decodeValue = value;
            }
        }

        return decodeValue;
    },
    setLoginPWD(value) {
        this.setItem(KEY.LOGINPWD, Base64.encode(value));
    },
    //首次令牌
    getFirstToken(key) {        
        let data = this.getItem(KEY.FIRST_TOKEN, {});
        
        if(data.hasOwnProperty(key))
        {
            return data[key].token;
        }
        else{
            return "";
        }
    },
    setFirstToken(key,value) {
        let tokenData = this.getItem(KEY.FIRST_TOKEN, {});
        //当前时间戳
        let time = Date.now();
        //删除超过3天的令牌
        for( let i in tokenData){
            let intervalTime = time - tokenData[i].time;
            if(Math.floor(intervalTime / 86400) > 3){
                delete tokenData[i];
            }
        }
        let data = {};
        data.time = time;
        data.token = value;
        tokenData[key] = data;
        
        this.setItem(KEY.FIRST_TOKEN, tokenData);
    },
    //临时令牌
    getToken(key) {
        let data = this.getItem(KEY.TEMP_TOKEN, {});
        
        if(data.hasOwnProperty(key))
        {
            return data[key].token;
        }
        else{
            return "";
        }
    },
    setToken(key,value) {
        let tokenData = this.getItem(KEY.TEMP_TOKEN, {});
        //当前时间戳
        let time = Date.now();
        //删除超过3天的令牌
        for( let i in tokenData){
            let intervalTime = time - tokenData[i].time;
            if(Math.floor(intervalTime / 86400) > 3){
                delete tokenData[i];
            }
        }
        let data = {};
        data.time = time;
        data.token = value;
        tokenData[key] = data;
        
        this.setItem(KEY.TEMP_TOKEN, tokenData);
    },
    //上一次登录方式
    getLastLoginWay() {
        let value = this.getItem(KEY.LAST_LOGIN_WAY, "");
        return value;
    },
    setLastLoginWay(value) {
        this.setItem(KEY.LAST_LOGIN_WAY, value);
    },
    getGatewayList(){
        let value = this.getItem(KEY.GATEWAY_LIST, "");
        return value;
    },
    setGatewayList(value){
        this.setItem(KEY.GATEWAY_LIST, value);
    },
    //手机震动
    getShake() {
        let value = this.getItem(KEY.SHAKE, 1);
        return value;
    },
    setShake(value) {
        WXSDK.setShakeEnabled(value);
        this.setItem(KEY.SHAKE, value);
    },
    //全服广播通知
    getNotice() {
        let value = this.getItem(KEY.NOTICE, 1);
        return value;
    },
    setNotice(value) {
        this.setItem(KEY.NOTICE, value);
    },
    //是否记住密码
    getRememberState() {
        let value = this.getItem(KEY.REMEMBERSTATE, false);
        return value;
    },
    setRememberState(value) {
        this.setItem(KEY.REMEMBERSTATE, value);
    },
    //是否自动登录
    getAutoLoginState() {
        let value = this.getItem(KEY.AUTOLOGINSTATE, false);
        return value;
    },
    setAutoLoginState(value) {
        this.setItem(KEY.AUTOLOGINSTATE, value);
    },
    //客户端版本
    getClientVersion() {
        let value = this.getItem(KEY.CLIENT_VERSION, "{}");//{"version":2005120954,"config":0,"interval":600000,"timestamp":1589248500197}版本号,配置号,版本刷新间隔(ms),时间戳(ms)
        return value;
    },
    setClientVersion(value) {
        this.setItem(KEY.CLIENT_VERSION, value);
    },
    getSkin(){
        let value = this.getItem(KEY.SKIN, "");
        return value;
    },
    setSkin(value){
        this.setItem(KEY.SKIN, value);
    },
    //默认服务器选择
    getDEVServer() {
        let value = this.getItem(KEY.DEVSERVER, null);
        if (value && typeof value === "object" && typeof value.HOST === "string") {
            let replaced = false;
            let host = value.HOST;
            if (host === "test-ws.kkpoker.life") {
                host = "game-api.hashpoker.vip";
                replaced = true;
            } else if (host.endsWith(".kkpoker.life")) {
                host = host.replace(/\.kkpoker\.life$/, ".hashpoker.vip");
                replaced = true;
            } else if (host === "kkpoker.life") {
                host = "hashpoker.vip";
                replaced = true;
            }
            if (replaced) {
                value.HOST = host;
                try {
                    this.setItem(KEY.DEVSERVER, value);
                } catch (e) {}
            }
        }
        return value;
    },
    setDEVServer(value) {
        this.setItem(KEY.DEVSERVER, value);
    },
    //web端返回的子包配置
    getBundleConfig(){
        let value = this.getItem(KEY.BUNDLE_CONFIG, {timestamp:0, version:"", platform: "", configs:[], url:""});
        return value;
    },
    setBundleConfig(value){
        this.setItem(KEY.BUNDLE_CONFIG, value);
    },
    getBundleConfigURL(){
        let value = this.getItem(KEY.BUNDLE_CONFIG_URL, "");
        return value;
    },
    setBundleConfigURL(value){
        this.setItem(KEY.BUNDLE_CONFIG_URL, value);
    },
    ////////////////////////////////////////////////////////////////////////////
});

let storage = new LocalStorage();
my.register("storage", storage);
module.exports = storage;