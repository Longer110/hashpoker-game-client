let MsgManager = require("MsgManager");
let MSG = require("msg_chat");
let CMD = require("protocol_chat");
let UserInfo = require("UserInfo");
let CHAT_MSG = require('msg_chat');
let base64 = require('base64');
let i18n = require("i18n");

let UIFrame = require('UIFrame');

let NotifyCenter = require("NotifyCenter");
let target = NotifyCenter.target;
let event = NotifyCenter.event;

let IMManage = require('IMManage');
let IMMessageManager = require('IMMessageManager');
let VideoChatManager = require('VideoChatManager');


class ChatMessageMgr {


    constructor() {
        this._isLogin = false;
        this._accid = "";
        this._token = "";
        this._videoToken = "";
        this._videoTid = "";
        this._tid = "";
        this.isAutoPlayAudio = true
        this._currentEffectVolume = 1
        this._messageMap = new Map();
        this._userInfoMap = new Map();
        this._cfgJson = []

        this._isLogoutIM = false;
        this._isRelogin = false;

        this._isStartRecorder = false;
        this._isSpeechInterval = false;//是否禁言
        this._speechRemainderTime = 10

        this._isInit = false;
        this._appkey = "";

        this._idx = 1;

        this._nim = null;
        this.init();

        this.voiceMgr = null;//音语管理器

        this.isReConnectGame = false; //重连到游戏
    }


    init() {
        let self = this
        if (IMMessageManager) {
            cc.log("IM 初始化")
            IMMessageManager.setCallback((messageJson) => {
                let data = null;
                cc.log("test --===== 获取聊天回调 ---====", messageJson)
                if (typeof messageJson == 'string', messageJson) {
                    try {
                        data = JSON.parse(messageJson);
                        if (data.message_type == "history_message") {//历史消息
                            self._history_message(data);
                        } else if (data.message_type == "game_message") {//消息
                            self._game_message(data);
                        } else if (data.message_type == "login_success") {//登陆成功
                            self._login_success(data);
                        } else if (data.message_type == "login_fail") {//登陆失败
                            self._login_fail(data);
                        } else if (data.message_type == "re_login") {//需要重新登陆
                            self._re_login(data);
                        } else if (data.message_type == "logout") {//登出
                            self._logout(data);
                        } else if (data.message_type == "game_message_send_fail") {//消息发送失败
                            self._game_message_send_fail(data);
                        } else if (data.message_type == "history_message_fail") {//获取历史消息失败
                            self._history_message_fail(data);
                        } else if (data.message_type == "player_message_start") {//开始播放语音
                            self._player_message_start(data);
                        } else if (data.message_type == "player_message_playing") {//播放语音进度
                            self._player_message_playing(data);
                        } else if (data.message_type == "player_message_end") {//播放语音结束
                            self._player_message_end(data);
                        } else if (data.message_type == "record_message_start") {//录音开始
                            self._record_message_start(data);
                        } else if (data.message_type == "record_message_end") {//录音结束
                            self._record_message_end(data);
                        } else if (data.message_type == "user_message") {//用户信息
                            self._user_message(data);
                        } else if (data.message_type == "user_message_fail") {//获取用户信息失败
                            self._user_message_fail(data);
                        } else if (data.message_type == "im_init") {//IM初始化完成
                            self._im_init(data);
                        }

                    } catch (error) {
                        cc.error("ChatMessageMgr.init " + error);
                    }
                }
            })
        }

        IMManage.setCallback((data) => {
            if (data.message_type == "history_message") {//历史消息
                self._history_message(data);
            } else if (data.message_type == "game_message") {//消息
                self._game_message(data);
            } else if (data.message_type == "login_success") {//登陆成功
                self._login_success(data);
            } else if (data.message_type == "login_fail") {//登陆失败
                self._login_fail(data);
            } else if (data.message_type == "re_login") {//需要重新登陆
                self._re_login(data);
            } else if (data.message_type == "logout") {//登出
                self._logout(data);
            } else if (data.message_type == "game_message_send_fail") {//消息发送失败
                self._game_message_send_fail(data);
            } else if (data.message_type == "history_message_fail") {//获取历史消息失败
                self._history_message_fail(data);
            } else if (data.message_type == "player_message_start") {//开始播放语音
                self._player_message_start(data);
            } else if (data.message_type == "player_message_playing") {//播放语音进度
                self._player_message_playing(data);
            } else if (data.message_type == "player_message_end") {//播放语音结束
                self._player_message_end(data);
            } else if (data.message_type == "record_message_start") {//录音开始
                self._record_message_start(data);
            } else if (data.message_type == "record_message_end") {//录音结束
                self._record_message_end(data);
            } else if (data.message_type == "user_message") {//用户信息
                self._user_message(data);
            } else if (data.message_type == "user_message_fail") {//获取用户信息失败
                self._user_message_fail(data);
            } else if (data.message_type == "im_init") {//IM初始化完成
                self._im_init(data);
            }
        })


        MsgManager.on(MSG.CHAT.ChatLogonRsp_CMD, this._onRepLogin, this);//登陆回复
        MsgManager.on(MSG.CHAT.ChatChangeRsp_CMD, this._onRepChat, this);//聊天请求返回
        MsgManager.on(MSG.CHAT.ClubChatAppKeyRsp_CMD, this._onRepAPPKey, this);//appkey返回


        MsgManager.on(MSG.CHAT.ChatVedioLogonRsp_CMD, this._onRepVideoToken, this);//token返回

        MsgManager.on("logout", this.logout, this);//登出


        if (target) {
            target.on(event.SERVER_LOGIN_SUCCESS, this._onLoginSuccess, this);
        }


    }



    setSpeechInterval() {

        this._isSpeechInterval = true
        var time = 10;
        var currentTime = 0;
        this._speechRemainderTime = Math.round(time - currentTime)
        var timerId = setInterval(() => {
            currentTime += 1;
            this._speechRemainderTime = Math.round(time - currentTime)
            if (currentTime >= time) {
                if (timerId > 0) {
                    clearInterval(timerId);
                    timerId = 0
                }
                this._isSpeechInterval = false
            }
        }, 1000)

    }


    _onLoginSuccess(data) {

        if (app.net && !this._isInit) {
            this.requestAppkey();
        }

    }

    //IM获取语音长度
    getAudioDuration(filePath) {

        let time = 0
        // if( IMMessageManager) {
        //     return IMMessageManager.getDuration(filePath);
        // }
        return time
    }

    //IM现在是否在录音
    isRecording() {

        if (IMMessageManager) {
            return IMMessageManager.isRecording();
        }
        return false
    }

    //IM现在是否有语音在播放
    isPlayingAudio() {

        if (this._currentPlayAudio != null) {
            return true;
        }


        return false
    }

    //IM停止播放语音
    stopAudio() {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (IMMessageManager) {
            IMMessageManager.stopAudio();
        } else {
            IMManage.stopAudio()
        }
    }

    //IM播放语音
    playAudio(filePath) {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (IMMessageManager) {
            IMMessageManager.playAudio(filePath);
        } else {
            IMManage.playAudio(filePath)
        }
    }

    //自动播放语音
    autoPlayAudio(filePath) {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (IMMessageManager) {
            IMMessageManager.playAudio(filePath);
        } else {
            IMManage.playAudio(filePath)
        }

    }

    //IM 取消录音
    recordingCanceling() {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (!this._isStartRecorder) {
            return
        }
        this._isStartRecorder = false
        if (IMMessageManager) {
            if (!this._isLogin) {
                cc.log("IM未登陆")
                return
            }
            IMMessageManager.recordingCanceling();
        } else {
            UIFrame.showTips(i18n.t("CHAT.RECORD_FAIL_WEB"))
            //this._record_message_end()
        }
    }

    //IM 录音完成
    recordingComplete() {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }
        if (!this._isStartRecorder) {
            return
        }
        this._isStartRecorder = false

        if (IMMessageManager) {
            if (!this._isLogin) {
                cc.log("IM未登陆")
                return
            }
            IMMessageManager.recordingComplete();
        } else {
            // IMManage.testRecordComplete()
            UIFrame.showTips(i18n.t("CHAT.RECORD_FAIL_WEB"))
            this._record_message_end()
        }
    }

    //IM 录音开始(type 回话类型)
    startRecorder(type) {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (this._isSpeechInterval) {
            UIFrame.showTips(i18n.t("CHAT.MESSAGE_TIPS").replace(/\[XX]/g, this._speechRemainderTime))
            return
        }
        this._isStartRecorder = true
        if (IMMessageManager) {
            if (!this._isLogin) {
                cc.log("IM未登陆")
                return
            }
            if (!this._tid || this._tid == "") {
                cc.log("没有群ID")
                return
            }
            IMMessageManager.startRecorder(this._tid, type, 60);
        }
    }

    //IM 发送图片( sessionId 回话目标 ，type 回话类型)
    sendImageMessage(type) {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (!this._isLogin) {
            cc.log("IM未登陆")
            return
        }

        if (!this._tid || this._tid == "") {
            cc.log("没有群ID")
            return
        }


        if (this._isSpeechInterval) {
            UIFrame.showTips(i18n.t("CHAT.MESSAGE_TIPS").replace(/\[XX]/g, this._speechRemainderTime))
            return
        }


        // if( IMMessageManager) {
        //     IMMessageManager.sendImageMessage(this._tid,type);
        // }
        this.setSpeechInterval();
    }

    //IM 发消息（文本消息）( sessionId 回话目标,message 文本内容，type 消息类型, chatType 回话类型)
    sendMessage(message, type, chatType) {

        // cc.log('test -=-= === sendMessage ---=== ---=', message, type, chatType)
        // if(this._isSpeechInterval){
        //     UIFrame.showTips(i18n.t("CHAT.MESSAGE_TIPS").replace(/\[XX]/g,this._speechRemainderTime))
        //     return
        // }

        // let id = 0;
        // if(chatType == "barrage_type_1"){
        //     if(this._cfgJson.length >= 1){
        //         id = this._cfgJson[0].nChatId
        //     }
        // }else if(chatType == "barrage_type_2"){
        //     if(this._cfgJson.length >= 2){
        //         id = this._cfgJson[1].nChatId
        //     }
        // }else if(chatType == "barrage_type_3"){
        //     if(this._cfgJson.length >= 3){
        //         id = this._cfgJson[2].nChatId
        //     }
        // }

        // let text = "BTTPOKER" + base64.encode(this.getMessageText(message))
        let send = {
            nType: type,
            sStr: message,
            nChatId: chatType
        }
        app.net.send(CMD.CHAT.value, CMD.CHAT.ChatChangeReq_CMD, send);

        //模拟消息
        // let info = UserInfo.getInfo();
        // let myMessage = {}
        // myMessage.message = text
        // myMessage.type = "audio"
        // myMessage.name = info.strNickName
        // myMessage.isMyMessage = true;
        // myMessage.uuid = this._idx
        // MsgManager.fire(CHAT_MSG.NOTIFY.MESSAGE_ADD,[myMessage]);
        // this._idx = this._idx + 1;

    }

    sendMessageForNim(message, strHead) {
        let text = "BTTPOKER" + base64.encode(this.getMessageText(message))
        text += strHead
        if (!this._isLogin) {
            cc.log("IM未登陆")
            return
        }
        if (!this._tid || this._tid == "") {
            cc.log("没有群ID")
            return
        }

        IMManage.sendTextMessage(this._tid, text);
        this.sendMessage(text, 2, 1)

        if (cc.sys.isBrowser) {


        } else {

            if (IMMessageManager) {
                IMMessageManager.sendMessage(this._tid, data.sStr, 1);
            }
        }
    }

    //IM 获取历史消息(回话id,开始时间，结束时间，数量,type 回话类型)
    getHistoryMessage(startTime, endTime, num, type) {
        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (!this._isLogin) {
            cc.log("IM未登陆")
            return
        }

        if (!this._tid || this._tid == "") {
            cc.log("没有群ID")
            return
        }

        cc.log("getHistoryMessage", startTime, endTime)
        // if( IMMessageManager) {
        //     // IMMessageManager.getHistoryMessage(this._tid,startTime,endTime,num,type);
        // }else{
        IMManage.getHistoryMessage(this._tid, startTime, endTime, num, type);
        // }
    }

    //IM 获取用户信息
    getUserInfo(account) {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (!this._isLogin) {
            cc.log("IM未登陆")
            return
        }
        if (!this._tid || this._tid == "") {
            cc.log("没有群ID")
            return
        }
        // if( IMMessageManager) {
        //     IMMessageManager.getUserInfo(account);
        // }else{
        IMManage.getUser(account);
        // }

    }

    //IM 登出
    logout() {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (!this._isLogin) {
            cc.log("IM未登陆，不需要登出")
            return
        }
        if (IMMessageManager) {
            IMMessageManager.logout();
            this._isLogoutIM = true
        } else {
            IMManage.logout();
        }
        //this.exitChat();
    }

    //IM 登陆
    login(account, token) {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (this._isLogin) {
            cc.log("IM已经登陆，不需要再次登陆")
            return
        }

        if (IMMessageManager) {
            IMMessageManager.login(account, token);
        }
        // else{
        //     IMManage.login(this._appkey,account,token);
        // }
    }

    //清除游戏消息
    clearMessage() {
        if (this._messageMap) {
            this._messageMap.clear();
        }

        if (this._userInfoMap) {
            this._userInfoMap.clear();
        }

        this._cfgJson = []

    }


    isLogin() {
        return this._isLogin
    }


    //自动播放下一条语音
    playNextAudio() {

        let messages = this.getMessages();

        let currentMessage = null
        for (let i = 0; i < messages.length; i++) {
            let message = messages[i]
            if (message.type == "audio" && !message.isRead) {
                currentMessage = message;
            }
        }

        if (currentMessage) {
            if (currentMessage.isMyMessage) {
                currentMessage.isRead = true
                this.playNextAudio();
            } else {
                if (currentMessage.path && currentMessage.path != "") {
                    //currentMessage.isRead = true
                    this.autoPlayAudio(currentMessage.path)
                }
            }
        }

    }


    exitChat() {
        let info = UserInfo.getInfo();
        let send = {
            nUserId: info.nUserID,
        }
        app.net.send(CMD.CHAT.value, CMD.CHAT.ChatBackToLobbyReq_CMD, send);

    }

    //获取APPKEY
    requestAppkey() {
        let info = UserInfo.getInfo();
        let sendData = {
            nUserId: info.nUserID,
        }
        app.net.send(CMD.CHAT.value, CMD.CHAT.ClubChatAppKeyReq_CMD, sendData);
        cc.log("获取APPKEY")
    }



    loginChatServer(sTableId, type) {
        if (!sTableId || sTableId.length == 0) {
            return
        }
        this._tabeid = sTableId
        this._type = type
        if (!this._isLogoutIM) {
            let info = UserInfo.getInfo();
            let send = {
                nChatType: type,
                sTableId: sTableId,
                nUserId: info.nUserID,
            }
            app.net.send(CMD.CHAT.value, CMD.CHAT.ChatLogonReq_CMD, send);

        } else {
            this._isRelogin = true;
        }
    }

    //返回登录
    _onRepLogin(data) {
        cc.warn("----------------------返回登录------------------:", data);
        if (data.nRlt == 0) {//登陆成功
            this._accid = data.accid;
            this._token = data.token;
            this._tid = data.tid;

            if (data.hasOwnProperty("sCfg")) { //弹幕配置
                let sCfg = data.sCfg.replace(/\ +/g, "")
                sCfg = sCfg.replace(/[\r\n]/g, "")
                try {
                    this._cfgJson = JSON.parse(sCfg);
                    cc.log("this._cfgJson = ", this._cfgJson)
                } catch (error) {
                    this._cfgJson = []
                }
            } else {
                this._cfgJson = []
            }
            MsgManager.fire(CHAT_MSG.NOTIFY.INIT_BARRAGE);

            if (this.isLogin()) {
                let time = new Date().getTime();
                if (String(time).length < 13) {
                    time = time * 1000
                }
                this.getHistoryMessage(time, 0, 10, 1);
            } else {
                this.login(this._accid, this._token)
            }
            // if(data.tid && data.tid != ""){
            //     if(this._videoToken.length > 0 && this._videoTid.length > 0){
            //         // this.initVideoMgr()
            //     }else{

            //     }
            // }

            if (this._videoToken == "" || this._videoTid == "") {
                if (this.isReConnectGame) {
                    this._reqVideoToken()
                }
            }

        } else if (data.nRlt == 1) {//注册失败
            this._tid = "";
            this._cfgJson = []
        }
    }



    //音语实时聊天初始化
    initVideoMgr() {
        let splist = this._accid.split("_")
        let accid = Number(splist[splist.length - 1])
        let options = { uid: accid, roomId: this._videoTid, token: this._videoToken, appKey: this._appkey, chatContent: this };
        //异步运行，保证初始化完成
        (async () => {
            this.voiceMgr = new VideoChatManager();
            await this.voiceMgr.init(options);
        })();
    }



    //获取语聊token
    _onRepVideoToken(data) {
        if (data.nRlt == 0) {
            this._videoToken = data.token
            this._videoTid = data.vTid
            // if(this._accid.length  > 0){
            this.initVideoMgr()
            // }
        }
    }


    _reqVideoToken(isReConnect) {
        this.isReConnectGame = isReConnect
        if (!this._tabeid || this._tabeid == "") {
            return
        }
        let info = UserInfo.getInfo();
        let send = {
            nChatType: 0,
            sTableId: this._tabeid,
            nUserId: info.nUserID,
        }

        app.net.send(CMD.CHAT.value, CMD.CHAT.ChatVedioLogonReq_CMD, send);
    }

    _onRepAPPKey(data) {

        if (this._isInit) return;

        if (data.sAppKey && data.sAppKey != "") {
            this._isInit = true;
            this._appkey = data.sAppKey
            if (IMMessageManager) {
                IMMessageManager.init(this._appkey)
            }

            if (!this.isLogin()) {
                this.loginChatServer("", 0)
            }
            cc.log("APPKEY = " + this._appkey)
        }


    }

    _onRepChat(data) {

        if (data.nRlt == 0) {
            if (!this._isLogin) {
                cc.log("IM未登陆")
                return
            }
            if (!this._tid || this._tid == "") {
                cc.log("没有群ID")
                return
            }

            if (cc.sys.isBrowser) {

                IMManage.sendTextMessage(this._tid, data.sStr);
            } else {

                if (IMMessageManager) {
                    IMMessageManager.sendMessage(this._tid, data.sStr, 1);
                }
            }

            this.setSpeechInterval();
        } else {
            if (data.nRlt == 1) {//余额不足
                UIFrame.showTips(i18n.t("CHAT.GOLD_FAIL"))
            } else {
                UIFrame.showTips(i18n.t("CHAT.ERROR"))
            }
        }

    }

    _message(data, isHistory) {

        let values = []
        if (data.message_values) {
            values = data.message_values
        }
        values.sort(function (a, b) { return a.time - b.time })

        let messages = []
        let isPush = true

        let accountMap = new Map();



        for (let i = 0; i < values.length; i++) {
            let message = values[i]

            if (isHistory) {
                message.isRead = true
            } else {
                message.isRead = false
                if (!this._userInfoMap.has(message.fromAccount)) {
                    if (!accountMap.has(message.fromAccount)) {
                        accountMap.set(message.fromAccount, message.fromAccount)
                    }
                } else {
                    message.userInfo = this._userInfoMap.get(message.fromAccount)
                }
            }

            if (message.name == null) {
                if (this._userInfoMap.has(message.fromAccount)) {
                    message.name = this._userInfoMap.get(message.fromAccount).name
                } else {
                    message.name = ""
                }
            }

            if (this._messageMap.has(message.sessionid)) {
                let map = this._messageMap.get(message.sessionid)
                if (map.has(message.uuid)) {
                    let myMessage = map.get(message.uuid)
                    if (myMessage) {
                        myMessage.message = message.message
                        myMessage.path = message.path
                        myMessage.ext = message.ext
                        myMessage.duration = message.duration
                        myMessage.userInfo = message.userInfo
                        myMessage.name = message.name

                    }
                    isPush = false
                    MsgManager.fire(CHAT_MSG.NOTIFY.MESSAGE_UPDATE, myMessage);
                }
                if (isPush) {
                    map.set(message.uuid, message)
                }
            } else {
                let map = new Map()
                map.set(message.uuid, message)
                this._messageMap.set(message.sessionid, map);
            }

            if (message.sessionid == this._tid) {
                if (isPush) {
                    messages.push(message)
                }
            }
            isPush = true
        }

        //获取用户信息
        for (let item of accountMap.values()) {
            this.getUserInfo(item)
        }
        accountMap.clear();


        if (isHistory) {
            MsgManager.fire(CHAT_MSG.NOTIFY.OLD_MESSAGE_ADD, messages);
        } else {
            MsgManager.fire(CHAT_MSG.NOTIFY.MESSAGE_ADD, messages);
            MsgManager.fire(CHAT_MSG.NOTIFY.NOTIFY_SHOW_CHAT_BUBBLE, messages)
        }
        //自己没坐下不播语音
        if (this.isAutoPlayAudio && !this.isPlayingAudio() && !this.isRecording()) {
            this.playNextAudio()
        }

    }




    //历史消息返回
    _history_message(data) {
        this._message(data, true)
    }


    //消息返回
    _game_message(data) {
        this._message(data, false)
    }


    getTeamId() {
        return this._tid
    }


    getMessages() {

        if (!this._isInit) {
            cc.log("IM 未初始化")
            return
        }

        if (!this._isLogin) {
            cc.log("IM没有登陆，获取失败")
            return []
        }

        if (!this._tid || this._tid == "") {
            cc.log("没有群ID")
            return []
        }



        let messages = []
        if (this._messageMap.has(this._tid)) {
            let messageMap = this._messageMap.get(this._tid);
            for (let item of messageMap.values()) {
                messages.push(item)
            }

            messages.sort(function (a, b) { return a.time - b.time })
            return messages
        }

        return messages;

    }

    //登陆成功
    _login_success(data) {
        this._isLogin = true;
        cc.log("登陆成功", data)

        MsgManager.fire(CHAT_MSG.NOTIFY.MESSAGE_RESET);
    }

    //登陆失败
    _login_fail(data) {
        this._isLogin = false
        cc.log("登陆失败", data)
    }

    //需要重登
    _re_login(data) {
        this._isLogin = false
        this._isRelogin = false
        cc.log("需要重登", data)
        this.clearMessage();

        if (this._tabeid != null && this._type != null) {
            this.loginChatServer(this._tabeid, this._type)
        }

    }

    //登出
    _logout(data) {
        this._isLogin = false
        cc.log("登出", data)
        this._isLogoutIM = false;

        if (this._isRelogin) {
            this._re_login();
        } else {
            this.clearMessage();
        }

    }

    //消息发送失败
    _game_message_send_fail(data) {
        cc.log("消息发送失败", data)
    }

    //历史消息获取失败
    _history_message_fail(data) {
        cc.log("历史消息获取失败", data)
    }

    //开始播放语音
    _player_message_start(data) {
        cc.log("开始播放语音,刷新界面通知 ", data.message_value.data)
        //头像展示语音图片通话
        MsgManager.fire(CHAT_MSG.NOTIFY.AUDIO_PLAY_START, data.message_value.data);


        // if(data.message_value && data.message_value.filePath){
        //     let path = data.message_value.filePath
        //     let messages = this.getMessages();
        //     for(let i=0;i<messages.length;i++){
        //         let message = messages[i]
        //         if(message.type == "audio" && message.path == path){
        //             message.isRead = true
        //             message.isChatVoice = true
        //             MsgManager.fire(CHAT_MSG.NOTIFY.AUDIO_PLAY_START,message);
        //             break
        //         }
        //     }
        // }

    }

    //播放语音进度
    _player_message_playing(data) {
        cc.log("播放语音进度", data)
    }

    //语音播放结束
    _player_message_end(data) {
        cc.log("语音播放结束,刷新界面通知", data.message_value.data)
        //隐藏头像下语音播放动画
        MsgManager.fire(CHAT_MSG.NOTIFY.AUDIO_PLAY_END, data.message_value.data);
        // if(data.message_value && data.message_value.filePath){
        //     let path = data.message_value.filePath
        //     let messages = this.getMessages();
        //     for(let i=0;i<messages.length;i++){
        //         let message = messages[i]
        //         if(message.type == "audio" && message.path == path){
        //             message.isRead = true
        //             MsgManager.fire(CHAT_MSG.NOTIFY.AUDIO_PLAY_END,message);

        //             if(this.isAutoPlayAudio && !this.isPlayingAudio() && !this.isRecording()){
        //                 this.playNextAudio()
        //             }
        //             break
        //         }
        //     }
        // }

    }


    _record_message_start(data) {
        cc.log("开始录音", data)

        if (app.storage) {
            this._currentEffectVolume = app.storage.getEffectVolume();
            app.storage.setEffectVolume(0.05);
        }

        let time = 200
        this._startRecordTime = 0
        let self = this
        this._record_interval_id = setInterval(() => {
            self._startRecordTime = self._startRecordTime + time
            MsgManager.fire(CHAT_MSG.NOTIFY.RECORD_UPATE, { time: self._startRecordTime });
        }, time)

        // let prefabName = "sound_recording";
        // let path = app.chat.path("prefab/"+prefabName);
        // app.chat.bundle.load(path,cc.Prefab,function (error, prefab){
        //     cc.log("app.chat.bundle.load error = "+error)
        //     if(!error){
        //         let prefNode = cc.instantiate(prefab);
        //         let scene = cc.director.getScene()
        //         let canvas = scene ? scene.getChildByName("Canvas"):null;
        //         if(cc.isValid(scene) && cc.isValid(canvas)){
        //             if(this._record_interval_id >0){
        //                 canvas.addChild(prefNode, 1024,prefabName)
        //                 prefNode.active = true;
        //             }
        //         }

        //     }
        // }.bind(this))
    }

    _record_message_end(data) {
        cc.log("录音结束", data)

        if (app.storage) {
            app.storage.setEffectVolume(this._currentEffectVolume);
        }



        let time = this._startRecordTime

        this._startRecordTime = 0
        if (this._record_interval_id > 0) {
            clearInterval(this._record_interval_id);
            this._record_interval_id = 0
        }
        let prefabName = "sound_recording";
        let scene = cc.director.getScene()
        let canvas = scene ? scene.getChildByName("Canvas") : null;
        if (cc.isValid(scene) && cc.isValid(canvas)) {
            let sound_recording = canvas.getChildByName(prefabName)
            if (sound_recording) {
                sound_recording.destroy();
            }
        }
        this._isStartRecorder = false
        if (time >= 450) {
            this.setSpeechInterval();
        }

    }

    //用户信息
    _user_message(data) {
        cc.log("用户信息", data)

        let values = []
        if (data.message_values) {
            values = data.message_values
        }
        for (let i = 0; i < values.length; i++) {
            let userInfo = values[i]
            if (this._userInfoMap.has(userInfo.account)) {
                let info = this._userInfoMap.get(userInfo.account)
                if (info) {
                    info.avatar = userInfo.avatar;
                    info.name = userInfo.name
                    info.extension = userInfo.extension
                }
            } else {
                this._userInfoMap.set(userInfo.account, userInfo)
            }
            MsgManager.fire(CHAT_MSG.NOTIFY.MESSAGE_USERINFO_UPDATE, this._userInfoMap.get(userInfo.account));
        }
    }

    //获取用户信息失败
    _user_message_fail(data) {
        cc.log("获取用户信息失败", data)
    }

    //IM初始化完成
    _im_init(data) {
        // cc.log("IM初始化完成",data)
        // if(!this.isLogin()){
        //     this.loginChatServer("",0)
        // }
    }

    getMessageText(text) {
        // let key = "f"
        // let value = ""
        // for(let i=0;i<text.length;i++){
        //     let v = text.charCodeAt(i) ^ key.charCodeAt(0) ^ (i%100)
        //     value = value + String.fromCharCode(v)
        // }
        let value = text
        return value
    }

    isInit() {
        return this._isInit
    }

    getCfgjson() {
        return this._cfgJson
    }



    //------------------------------------------音语实时聊天调用方法------------------------------------------------------
    checkIsReconned() {
        if (!this.voiceMgr || !this.voiceMgr.client || !this.voiceMgr.localStream || !this.voiceMgr.onSpeakingUpdate) {
            return true
        }

        return false
    }

    async _checkAudioPermission() {
        if (this.voiceMgr && this.voiceMgr != null) {
            await this.voiceMgr._checkAudioPermission();
        }
    }

    getAudioPermission() {
        if (this.voiceMgr && this.voiceMgr != null) {
            return this.voiceMgr.getAudioPermission();
        }
        return false
    }

    getSelfAudioStatus() {
        if (this.voiceMgr && this.voiceMgr != null) {
            return this.voiceMgr.getMuteSelf();
        }
        return false
    }
    // 自己麦克风开关   isOpen:true 闭麦，false 开麦
    setSelfAudioStatus(isClose) {
        if (this.voiceMgr && this.voiceMgr != null) {
            this.voiceMgr.setMuteSelf(isClose);  // 静音自己
        }
    }


    // 获取其他玩家麦克风开关
    getOtherPlayerVideo(uid) {
        if (this.voiceMgr && this.voiceMgr != null) {
            return this.voiceMgr.getRemoteMuteState(uid);
        }
        return true
    }

    // 设置其他玩家麦克风开关
    setOtherPlayerVideo(uid, isOpen) {
        if (this.voiceMgr && this.voiceMgr != null) {
            this.voiceMgr.setMuteRemote(uid, isOpen);
        }
    }

    setAudioPermission(bo) {
        if (this.voiceMgr && this.voiceMgr != null) {
            this.voiceMgr.setAudioPermission(bo);
        }
    }


    // 离开房间
    leaveRoom() {
        (async () => {
            if (this.voiceMgr && this.voiceMgr != null) {
                await this.voiceMgr.leaveRoom();
            }
        })();
        this._videoToken = ""
        this._videoTid = ""
        this.isReConnectGame = false
    }

    async reconnect() {
        // if (this.voiceMgr && this.voiceMgr != null) {
        //     await this.voiceMgr.reconnect();
        //     // await this.voiceMgr.joinClientRoom();

        // }
        this.initVideoMgr()
    }


}

var chatMgr = new ChatMessageMgr();
module.exports = chatMgr;