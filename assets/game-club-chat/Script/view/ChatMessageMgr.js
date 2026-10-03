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

let VideoChatManager = require('VideoChatManager');


function ChatMessageMgr() {
    this._isLogin = false;
    this._accid = "";
    this._token = "";
    this._videoToken = "";
    this._videoTid = "";
    this._tid = "";
    this.isAutoPlayAudio = true;
    this._currentEffectVolume = 1;
    this._messageMap = new Map();
    this._userInfoMap = new Map();
    this._cfgJson = [];

    this._isSpeechInterval = false;
    this._speechRemainderTime = 10;

    this._idx = 1;

    this.voiceMgr = null;

    this.isReConnectGame = false;

    this._seenMessageKeys = new Set();

    this.init();
}

ChatMessageMgr.prototype.init = function () {
    let self = this;

    MsgManager.on(MSG.CHAT.ChatLogonRsp_CMD, this._onRepLogin, this);
    MsgManager.on(MSG.CHAT.ChatChangeRsp_CMD, this._onRepChat, this);
    MsgManager.on(MSG.CHAT.ClubChatAppKeyRsp_CMD, this._onRepAPPKey, this);
    MsgManager.on(MSG.CHAT.ChatVedioLogonRsp_CMD, this._onRepVideoToken, this);

    MsgManager.on(MSG.CHAT.ChatNotify_CMD, this._onChatNotify, this);
    MsgManager.on(MSG.CHAT.ChatHistoryRsp_CMD, this._onChatHistory, this);

    MsgManager.on("logout", this.logout, this);

    if (target) {
        target.on(event.SERVER_LOGIN_SUCCESS, this._onLoginSuccess, this);
    }
};

ChatMessageMgr.prototype.setSpeechInterval = function () {
    let self = this;
    this._isSpeechInterval = true;
    var time = 10;
    var currentTime = 0;
    this._speechRemainderTime = Math.round(time - currentTime);
    var timerId = setInterval(function () {
        currentTime += 1;
        self._speechRemainderTime = Math.round(time - currentTime);
        if (currentTime >= time) {
            if (timerId > 0) {
                clearInterval(timerId);
                timerId = 0;
            }
            self._isSpeechInterval = false;
        }
    }, 1000);
};

ChatMessageMgr.prototype._onLoginSuccess = function (data) {
};

ChatMessageMgr.prototype.isRecording = function () {
    return false;
};

ChatMessageMgr.prototype.isPlayingAudio = function () {
    if (this._currentPlayAudio != null) {
        return true;
    }
    return false;
};

ChatMessageMgr.prototype.stopAudio = function () {
};

ChatMessageMgr.prototype.playAudio = function (filePath) {
};

ChatMessageMgr.prototype.autoPlayAudio = function (filePath) {
};

ChatMessageMgr.prototype.recordingCanceling = function () {
};

ChatMessageMgr.prototype.recordingComplete = function () {
};

ChatMessageMgr.prototype.startRecorder = function (type) {
    if (this._isSpeechInterval) {
        UIFrame.showTips(i18n.t("CHAT.MESSAGE_TIPS").replace(/\[XX]/g, this._speechRemainderTime));
        return;
    }
    UIFrame.showTips(i18n.t("CHAT.RECORD_FAIL_WEB"));
};

ChatMessageMgr.prototype.sendImageMessage = function (type) {
    if (this._isSpeechInterval) {
        UIFrame.showTips(i18n.t("CHAT.MESSAGE_TIPS").replace(/\[XX]/g, this._speechRemainderTime));
        return;
    }
    this.setSpeechInterval();
};

ChatMessageMgr.prototype.sendMessage = function (message, type, chatType) {
    let send = {
        nType: type,
        sStr: message,
        nChatId: chatType
    };
    app.net.send(CMD.CHAT.value, CMD.CHAT.ChatChangeReq_CMD, send);
};

ChatMessageMgr.prototype.sendMessageForNim = function (message, strHead) {
    let text = "BTTPOKER" + base64.encode(this.getMessageText(message));
    text += strHead;
    let send = {
        nType: 2,
        sStr: text,
        nChatId: 1
    };
    app.net.send(CMD.CHAT.value, CMD.CHAT.ChatChangeReq_CMD, send);
};

ChatMessageMgr.prototype.getHistoryMessage = function (startTime, endTime, num, type) {
    if (!this._tid || this._tid == "") {
        cc.log("没有群ID，不请求历史消息");
        return;
    }
    cc.log("ChatMessageMgr.getHistoryMessage: send ChatHistoryReq, nCount=" + (num || 20));
    app.net.send(CMD.CHAT.value, CMD.CHAT.ChatHistoryReq_CMD, { nCount: num || 20 });
};

ChatMessageMgr.prototype.getUserInfo = function (account) {
};

ChatMessageMgr.prototype.logout = function () {
    if (!this._isLogin) {
        cc.log("聊天未登录，不需要登出");
        return;
    }
    this._isLogin = false;
    this.clearMessage();
};

ChatMessageMgr.prototype.login = function (account, token) {
};

ChatMessageMgr.prototype.clearMessage = function () {
    if (this._messageMap) {
        this._messageMap.clear();
    }
    if (this._userInfoMap) {
        this._userInfoMap.clear();
    }
    this._cfgJson = [];
    this._seenMessageKeys.clear();
};

ChatMessageMgr.prototype.isLogin = function () {
    return this._isLogin;
};

ChatMessageMgr.prototype.playNextAudio = function () {
};

ChatMessageMgr.prototype.exitChat = function () {
    let info = UserInfo.getInfo();
    let send = {
        nUserId: info.nUserID,
    };
    app.net.send(CMD.CHAT.value, CMD.CHAT.ChatBackToLobbyReq_CMD, send);
};

ChatMessageMgr.prototype.requestAppkey = function () {
};

ChatMessageMgr.prototype.loginChatServer = function (sTableId, type) {
    if (!sTableId || sTableId.length == 0) {
        return;
    }
    this._tabeid = sTableId;
    this._type = type;
    let info = UserInfo.getInfo();
    let send = {
        nChatType: type,
        sTableId: sTableId,
        nUserId: info.nUserID,
    };
    app.net.send(CMD.CHAT.value, CMD.CHAT.ChatLogonReq_CMD, send);
    cc.log("ChatMessageMgr.loginChatServer: send ChatLogonReq, sTableId=" + sTableId + " nChatType=" + type);
};

ChatMessageMgr.prototype._onRepLogin = function (data) {
    cc.warn("----------------------返回登录------------------:", data);
    if (data.nRlt == 0) {
        this._accid = data.accid;
        this._token = data.token;
        this._tid = data.tid || "";

        if (data.hasOwnProperty("sCfg")) {
            let sCfg = data.sCfg.replace(/\ +/g, "");
            sCfg = sCfg.replace(/[\r\n]/g, "");
            try {
                this._cfgJson = JSON.parse(sCfg);
                cc.log("this._cfgJson = ", this._cfgJson);
            } catch (error) {
                this._cfgJson = [];
            }
        } else {
            this._cfgJson = [];
        }
        MsgManager.fire(CHAT_MSG.NOTIFY.INIT_BARRAGE);

        this._isLogin = true;
        cc.log("聊天已登录(ChatLogonRsp成功), tid=" + this._tid);
        MsgManager.fire(CHAT_MSG.NOTIFY.MESSAGE_RESET);

        let self = this;
        this.scheduleOnce(function () {
            self.getHistoryMessage(0, 0, 20, 1);
        }, 0);

        if (this._videoToken == "" || this._videoTid == "") {
            if (this.isReConnectGame) {
                this._reqVideoToken();
            }
        }

    } else if (data.nRlt == 1) {
        this._tid = "";
        this._cfgJson = [];
        this._isLogin = false;
    }
};

ChatMessageMgr.prototype.scheduleOnce = function (callback, delay) {
    let scheduler = cc.director.getScheduler();
    scheduler.scheduleOnce(callback, this, delay || 0);
};

ChatMessageMgr.prototype.initVideoMgr = function () {
    let self = this;
    let splist = this._accid.split("_");
    let accid = Number(splist[splist.length - 1]);
    let options = { uid: accid, roomId: this._videoTid, token: this._videoToken, appKey: this._appkey, chatContent: this };
    (function () {
        this.voiceMgr = new VideoChatManager();
        this.voiceMgr.init(options);
    }).call(this);
};

ChatMessageMgr.prototype._onRepVideoToken = function (data) {
    if (data.nRlt == 0) {
        this._videoToken = data.token;
        this._videoTid = data.vTid;
        this.initVideoMgr();
    }
};

ChatMessageMgr.prototype._reqVideoToken = function (isReConnect) {
    this.isReConnectGame = isReConnect;
    if (!this._tabeid || this._tabeid == "") {
        return;
    }
    let info = UserInfo.getInfo();
    let send = {
        nChatType: 0,
        sTableId: this._tabeid,
        nUserId: info.nUserID,
    };
    app.net.send(CMD.CHAT.value, CMD.CHAT.ChatVedioLogonReq_CMD, send);
};

ChatMessageMgr.prototype._onRepAPPKey = function (data) {
};

ChatMessageMgr.prototype._onRepChat = function (data) {
    if (data.nRlt == 0) {
        this.setSpeechInterval();
    } else {
        if (data.nRlt == 1) {
            UIFrame.showTips(i18n.t("CHAT.GOLD_FAIL"));
        } else {
            UIFrame.showTips(i18n.t("CHAT.ERROR"));
        }
    }
};

ChatMessageMgr.prototype._chatMatterToMessage = function (chatMatter) {
    if (!chatMatter) return null;

    let info = UserInfo.getInfo();
    let isMyMessage = (chatMatter.nUserId && chatMatter.nUserId === info.nUserID);

    let rawSstr = chatMatter.sStr || "";
    let avatarStr = chatMatter.sFaceId || "";

    let compatibleMessage = rawSstr;
    if (rawSstr.indexOf("&avatar=") < 0) {
        compatibleMessage = rawSstr + "&avatar=" + (avatarStr || "");
    }

    let name = chatMatter.sName || "";
    try {
        if (name && name.indexOf("BTTPOKER") !== 0) {
            name = base64.decode(name);
        }
    } catch (e) {
    }

    let message = {
        nUserId: chatMatter.nUserId,
        name: name,
        avatar: avatarStr,
        fromAccount: chatMatter.nUserId ? ("game_accid_" + chatMatter.nUserId) : "",
        message: compatibleMessage,
        type: chatMatter.nType === 1 ? "barrage" : "text",
        nType: chatMatter.nType || 2,
        isMyMessage: isMyMessage,
        uuid: "cm_" + (chatMatter.nUserId || 0) + "_" + Date.now() + "_" + this._idx++,
        time: Date.now(),
        sessionid: this._tid || "",
        isRead: true,
    };
    return message;
};

ChatMessageMgr.prototype._makeDedupKey = function (chatMatter) {
    return (chatMatter.nUserId || 0) + "|" + (chatMatter.sStr || "") + "|" + (chatMatter.nType || 0);
};

ChatMessageMgr.prototype._onChatNotify = function (data) {
    cc.log("ChatMessageMgr._onChatNotify: ", data);
    if (!data || !data.tChatMatter) {
        return;
    }
    let chatMatter = data.tChatMatter;
    let dedupKey = this._makeDedupKey(chatMatter);
    if (this._seenMessageKeys.has(dedupKey)) {
        cc.log("_onChatNotify: skip duplicate message: " + dedupKey);
        return;
    }
    this._seenMessageKeys.add(dedupKey);
    if (this._seenMessageKeys.size > 500) {
        let keys = Array.from(this._seenMessageKeys);
        this._seenMessageKeys = new Set(keys.slice(250));
    }

    let message = this._chatMatterToMessage(chatMatter);
    if (!message) return;

    this._cacheMessage(message);

    let messages = [message];
    MsgManager.fire(CHAT_MSG.NOTIFY.MESSAGE_ADD, messages);
    MsgManager.fire(CHAT_MSG.NOTIFY.NOTIFY_SHOW_CHAT_BUBBLE, messages);
};

ChatMessageMgr.prototype._onChatHistory = function (data) {
    cc.log("ChatMessageMgr._onChatHistory: nRlt=" + data.nRlt + " count=" + (data.arrChatRecord ? data.arrChatRecord.length : 0));
    if (data.nRlt !== 0) {
        if (data.nRlt === 1) {
            cc.log("_onChatHistory: 不在牌桌/群未就绪，忽略");
        } else if (data.nRlt === 2) {
            cc.log("_onChatHistory: 拉取失败，忽略");
        }
        return;
    }
    if (!data.arrChatRecord || !data.arrChatRecord.length) {
        return;
    }
    let arr = data.arrChatRecord;
    let resultMessages = [];
    for (let i = 0; i < arr.length; i++) {
        let chatMatter = arr[i];
        let dedupKey = this._makeDedupKey(chatMatter);
        this._seenMessageKeys.add(dedupKey);
        let msg = this._chatMatterToMessage(chatMatter);
        if (msg) {
            msg.isRead = true;
            this._cacheMessage(msg);
            resultMessages.push(msg);
        }
    }
    if (resultMessages.length > 0) {
        MsgManager.fire(CHAT_MSG.NOTIFY.OLD_MESSAGE_ADD, resultMessages);
    }
};

ChatMessageMgr.prototype._cacheMessage = function (message) {
    let sid = message.sessionid || this._tid || "";
    if (!this._messageMap.has(sid)) {
        this._messageMap.set(sid, new Map());
    }
    let map = this._messageMap.get(sid);
    if (message.uuid) {
        map.set(message.uuid, message);
    }
    let info = UserInfo.getInfo();
    if (message.nUserId && message.nUserId === info.nUserID) {
        message.isMyMessage = true;
    }
};

ChatMessageMgr.prototype.getTeamId = function () {
    return this._tid;
};

ChatMessageMgr.prototype.getMessages = function () {
    if (!this._isLogin) {
        return [];
    }
    if (!this._tid || this._tid == "") {
        return [];
    }
    let messages = [];
    if (this._messageMap.has(this._tid)) {
        let messageMap = this._messageMap.get(this._tid);
        let iter = messageMap.values();
        for (let item = iter.next(); !item.done; item = iter.next()) {
            messages.push(item.value);
        }
        messages.sort(function (a, b) { return a.time - b.time; });
        return messages;
    }
    return messages;
};

ChatMessageMgr.prototype.getMessageText = function (text) {
    let value = text;
    return value;
};

ChatMessageMgr.prototype.isInit = function () {
    return true;
};

ChatMessageMgr.prototype.getCfgjson = function () {
    return this._cfgJson;
};

ChatMessageMgr.prototype.checkIsReconned = function () {
    if (!this.voiceMgr || !this.voiceMgr.client || !this.voiceMgr.localStream || !this.voiceMgr.onSpeakingUpdate) {
        return true;
    }
    return false;
};

ChatMessageMgr.prototype._checkAudioPermission = function () {
    if (this.voiceMgr && this.voiceMgr != null) {
        return this.voiceMgr._checkAudioPermission();
    }
};

ChatMessageMgr.prototype.getAudioPermission = function () {
    if (this.voiceMgr && this.voiceMgr != null) {
        return this.voiceMgr.getAudioPermission();
    }
    return false;
};

ChatMessageMgr.prototype.getSelfAudioStatus = function () {
    if (this.voiceMgr && this.voiceMgr != null) {
        return this.voiceMgr.getMuteSelf();
    }
    return false;
};
ChatMessageMgr.prototype.setSelfAudioStatus = function (isClose) {
    if (this.voiceMgr && this.voiceMgr != null) {
        this.voiceMgr.setMuteSelf(isClose);
    }
};

ChatMessageMgr.prototype.getOtherPlayerVideo = function (uid) {
    if (this.voiceMgr && this.voiceMgr != null) {
        return this.voiceMgr.getRemoteMuteState(uid);
    }
    return true;
};

ChatMessageMgr.prototype.setOtherPlayerVideo = function (uid, isOpen) {
    if (this.voiceMgr && this.voiceMgr != null) {
        this.voiceMgr.setMuteRemote(uid, isOpen);
    }
};

ChatMessageMgr.prototype.setAudioPermission = function (bo) {
    if (this.voiceMgr && this.voiceMgr != null) {
        this.voiceMgr.setAudioPermission(bo);
    }
};

ChatMessageMgr.prototype.leaveRoom = function () {
    (function () {
        if (this.voiceMgr && this.voiceMgr != null) {
            this.voiceMgr.leaveRoom();
        }
    }).call(this);
    this._videoToken = "";
    this._videoTid = "";
    this.isReConnectGame = false;
    this._isLogin = false;
};

ChatMessageMgr.prototype.reconnect = function () {
    this.initVideoMgr();
};

var chatMgr = new ChatMessageMgr();
module.exports = chatMgr;
