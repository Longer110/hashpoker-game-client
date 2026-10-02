// let Request = require("request");
// let Response = require("response");
// let CMD = require('protocol');
// let CONFIG = require("config_frameworks");
// let MsgManager = require("MsgManager");
// let MSG = require("Msg");
// let ConfigGame = require("ConfigGame");
// let Utils = require("Utils");
// let LocalStorage = require("LocalStorage");


// let TAG = "UploadLogsMgr";
// let IS_UPLOAD_LOGS = true;
// let RESTOREINDEX = 0;

// let logsMsg = [];
// let tmpLogsMsg = null;//缓存最后一次发送的
// let use_chanel = false;

// let socket = null;
// let ConnectStatus = {
//     NOCONNECT:0,
//     CONNECTING:1,
//     CONNECTED:2,
// }

// let SERVER = {};
// let head = SERVER.HEAD;
// let host = SERVER.HOST;
// let port = SERVER.PORT;
// let _initServer = function (params) {
//     SERVER = LocalStorage.getDEVServer();
//     if(ConfigGame.ENABLE_CHANNEL && ConfigGame.ChannelConfig){
//         let channel = ConfigGame.ChannelConfig;
//         if(channel.SERVER_LOG instanceof Array && channel.SERVER_LOG.length>0){
//             SERVER = channel.SERVER_LOG[0];
//             use_chanel = true;
//         }
//         if(!use_chanel){
//             let msg = ConfigGame.CUSTOM.ERROR_SERVER_LOG;
//              //console.error(msg);
//             if(window && window.alert){
//                 window.alert(msg);
//             }
//         }
//     }
    
//     head = SERVER.HEAD;
//     host = SERVER.HOST;
//     port = SERVER.PORT;
    
//     if (!ConfigGame.ISDEVELOP && !use_chanel) {
//         host = "47.107.255.138";
//         if (CONFIG.QYSOCKET){
//             port = Utils.randomInt(11024, 11023);
//         }else{
//             port = Utils.randomInt(11026,11025);
//         }
//     }
// }

// let UploadLogsMgr = {

// }
// UploadLogsMgr.connect = function () {
//     _initServer();
        
//     if (UploadLogsMgr._isConnected == ConnectStatus.CONNECTED) {
//         QYLogs.log(TAG, "connect 已经连接上了的");
//         return;
//     } else if (UploadLogsMgr._isConnected == ConnectStatus.CONNECTING) {
//         QYLogs.log(TAG, "正在连接");
//         return;
//     }
//     UploadLogsMgr._isConnected = ConnectStatus.CONNECTING;
//     if (CONFIG.QYSOCKET) {//原生平台

//         // host = SERVER.SOCKET.HOST;
//         // port = SERVER.SOCKET.PORT;
//         let QYSocket = require("QYSocket");
//         socket = new QYSocket("UploadLogger");
//         socket.initSocket("UploadLogger");
//         socket.connect(host, port)
//     }
//     else {
//         let url = head + "://" + host + ":" + port;
//         QYLogs.log(TAG, "url = " + url);
//         let QYWebSocket = require("QYWebSocket");
//         socket = new QYWebSocket(url);
//         socket.binaryType = "arraybuffer";
//     }

//     socket.onconnecting = function (event) {
//         UploadLogsMgr._onConnecting(event)
//     }
//     socket.onopen = function (event) {
//         QYLogs.log(TAG, "onopen");
//         UploadLogsMgr._onOpen(event)
//     }
//     socket.onmessage = function (event) {
//         UploadLogsMgr._onResponse(event)
//     }
//     socket.onclose = function (event) {
//         UploadLogsMgr._onClose(event)
//     }
//     socket.onerror = function (event) {
//         UploadLogsMgr._onError(event)
//     }
// },
// UploadLogsMgr.reConnect = function (){
//     QYLogs.log(TAG, "reConnect");
//     UploadLogsMgr._stopReconnect();
//     if (UploadLogsMgr._isConnected == ConnectStatus.CONNECTED) {
//         QYLogs.log(TAG, "connect 已经连接上了的");
//         return;
//     } else if (UploadLogsMgr._isConnected == ConnectStatus.CONNECTING) {
//         QYLogs.log(TAG, "正在连接");
//         return;
//     }
//     UploadLogsMgr._reConnectTimes = UploadLogsMgr._reConnectTimes - 1;
//     QYLogs.log(TAG, "UploadLogsMgr._reConnectTimes = " + UploadLogsMgr._reConnectTimes);
//     if (CONFIG.QYSOCKET) {
//          //console.log("socket = ", socket);
//         if (socket) {
//             UploadLogsMgr._isConnected = ConnectStatus.CONNECTING;
//             socket.reConnect();
//         }else{
//             UploadLogsMgr.connect();
//         }
       
//     } else {
//         UploadLogsMgr.connect();
//     }   
// },
// UploadLogsMgr._onConnecting =  function (event) {
//     QYLogs.log(TAG, "_onConnecting:" + event.code);
// }
// UploadLogsMgr._onOpen = function (event) {//链接成功
//     QYLogs.log(TAG, "_onOpen:" + event.code);
//     UploadLogsMgr._isConnected = ConnectStatus.CONNECTED;
//     UploadLogsMgr._reConnectTimes = CONFIG.RECONNECT_TIMES;
//     UploadLogsMgr._startHeartBeatSchedule();
//     UploadLogsMgr._stopReconnect();
//     UploadLogsMgr._startUploadServerSchedule();
//     UploadLogsMgr._sendCreate();
// }

// UploadLogsMgr._onClose = function (event) {
//     QYLogs.log(TAG, "_onClose:" + event.code);
//     UploadLogsMgr._isConnected = ConnectStatus.NOCONNECT;
//     // UploadLogsMgr._restoreTmpLogs()
//     UploadLogsMgr._stopReconnect();
//     UploadLogsMgr._stopHeartBeatSchedule();
//     UploadLogsMgr._stopUploadServerSchedule();

//     UploadLogsMgr._startReconnect();
// }
// UploadLogsMgr._onError = function (event) {
//     QYLogs.log(TAG, "_onError:" + event.code);
//     UploadLogsMgr._isConnected = ConnectStatus.NOCONNECT;
//     UploadLogsMgr._stopReconnect();
//     UploadLogsMgr._stopHeartBeatSchedule();
//     UploadLogsMgr._stopUploadServerSchedule();

// }
// UploadLogsMgr._onResponse = function (event) {
//     let skipHead = null;

//     if (event.mainCmd >= 0 && event.subCmd >= 0) {
//         skipHead = { mainCmd: event.mainCmd, subCmd: event.subCmd }
//     }
//     let respData = Response.response(event.data, skipHead);
//     //  //console.debug(TAG, "_onResponse:" + event.code);

//     if (UploadLogsMgr._isHeartBeatRecv(respData.mainCmd, respData.subCmd)) {
//         // QYLogs.log(TAG, "mainCmd = " + respData.mainCmd);
//         UploadLogsMgr._startHeartBeatSchedule()
//         return;
//     }

//     QYLogs.object(TAG, "_onResponse=", respData);


//     if (respData.msg) {
//         MsgManager.fire(respData.msg, respData.data);
//     }
// }
// UploadLogsMgr._isHeartBeatRecv = function (mainCmd, subCmd){
//     if (mainCmd == CMD.HEART_BEAT_MAIN_CMD.value && subCmd == CMD.HEART_BEAT_MAIN_CMD.HEART_BEAT_SUB_CMD) {
//         return true;
//     }
//     return false;
// }
// UploadLogsMgr._send = function (mainCmd, subCmd, data) {
//     if (UploadLogsMgr._isConnected != ConnectStatus.CONNECTED) {
//         return
//     }
//     if (CONFIG.QYSOCKET) {
//         let buffer = Request.request(mainCmd, subCmd, data, true);
//         let request = socket.writeBuffer(mainCmd, subCmd, buffer);
//         socket.send(request);
//     } else {
//         let buffer = Request.request(mainCmd, subCmd, data);
//         //  //console.debug(TAG, "request byteLength = " + buffer.byteLength);
//         socket.send(buffer);
//     }
// }
// UploadLogsMgr._sendCreate = function (){
//     QYLogs.log(TAG, "_sendCreate");
//     let Utils = require("Utils");
//     UploadLogsMgr._send(CMD.QYLOG_UPLOAD_MAIN_CMD.value, CMD.QYLOG_UPLOAD_MAIN_CMD.LogFileCreateReq_CMD, { sFileName:Utils.getDevicesId()})
// }
// UploadLogsMgr._startReconnect = function (time) {
//     if (UploadLogsMgr._intervalReconnect) {
//         return;
//     }
//     // QYLogs.log(TAG, "_startReconnect");
//     if (!time) time = 3;
//     // QYLogs.log(TAG, "UploadLogsMgr._reConnectTimes =" + UploadLogsMgr._reConnectTimes);
//     if (UploadLogsMgr._reConnectTimes < 0) {
//         IS_UPLOAD_LOGS = false;
//          //console.log(TAG, "重连次数超了，放弃上传日志了");
//         //TODO:fire msg
        
//         return;
//     } else if (UploadLogsMgr._reConnectTimes < CONFIG.RECONNECT_TIMES) {//第二次重连时间设长些
//         time = 6;
//     }

//     if (!UploadLogsMgr._intervalReconnect){
//         UploadLogsMgr._intervalReconnect = setInterval(function () {
//             UploadLogsMgr._stopReconnect();
//             UploadLogsMgr.reConnect();
//         }, time * 1000);
//     }
//     // QYLogs.log(TAG, "UploadLogsMgr._intervalReconnect =" + UploadLogsMgr._intervalReconnect);
//     // cc.director.getScheduler().schedule(UploadLogsMgr.reConnect, UploadLogsMgr, time, false);
// },

// UploadLogsMgr._stopReconnect = function () {
//     // if (cc.director.getScheduler().isScheduled(UploadLogsMgr.reConnect, UploadLogsMgr)) {
//     //     QYLogs.log(TAG, "_stopReconnect");
//     //     cc.director.getScheduler().unschedule(UploadLogsMgr.reConnect, UploadLogsMgr);
//     // }
//     if (UploadLogsMgr._intervalReconnect){
//         clearInterval(UploadLogsMgr._intervalReconnect);
//         UploadLogsMgr._intervalReconnect = null;
//     }
// }
// UploadLogsMgr._startHeartBeatSchedule = function (time){
//     // if (!cc.director.getScheduler().isScheduled(UploadLogsMgr._heartBeatSend, UploadLogsMgr)) {
//     //     if (!time) time = 29;
//     //     cc.director.getScheduler().schedule(UploadLogsMgr._heartBeatSend, UploadLogsMgr, time, false);
//     // }
//     if (!time) time = 29;
//     UploadLogsMgr._intervalHeartBeat = setInterval(function () {
//         UploadLogsMgr._heartBeatSend();
//     }, time * 1000);
// }
// UploadLogsMgr._heartBeatSend = function(){
//     //  //console.debug(this.TAG, "_heartBeatSend:");
//     UploadLogsMgr._send(CMD.HEART_BEAT_MAIN_CMD.value, CMD.HEART_BEAT_MAIN_CMD.HEART_BEAT_SUB_CMD);
//     UploadLogsMgr._stopHeartBeatSchedule();
// }
// UploadLogsMgr._stopHeartBeatSchedule = function (){
//     // if (cc.director.getScheduler().isScheduled(UploadLogsMgr._heartBeatSend, UploadLogsMgr)) {
//     //     cc.director.getScheduler().unschedule(UploadLogsMgr._heartBeatSend, UploadLogsMgr);
//     // }
//     if (UploadLogsMgr._intervalHeartBeat) {
//         clearInterval(UploadLogsMgr._intervalHeartBeat);
//         UploadLogsMgr._intervalHeartBeat = null;
//     }
// }

// UploadLogsMgr._startUploadServerSchedule = function (time) {
//     // if (!cc.director.getScheduler().isScheduled(UploadLogsMgr._uploadSend, UploadLogsMgr)) {
//     //     if (!time) time = 29;
//     //     cc.director.getScheduler().schedule(UploadLogsMgr._uploadSend, UploadLogsMgr, time, false);
//     // }

//     if (!time) time = 1;
//     UploadLogsMgr._intervalUpload = setInterval(function () {
//         UploadLogsMgr._uploadSend();
//     }, time * 1000);
// }
// UploadLogsMgr._uploadSend = function () {
//     if (UploadLogsMgr._isConnected != ConnectStatus.CONNECTED) {
//         return
//     }
//     if (logsMsg.length > 0) {

//         let str = UploadLogsMgr._getLogStr();
//         // let str = logsMsg.join("\n");
//         //  //console.log("str length = ", str.length);z
        
//         // logsMsg = []
//         // let size = 2048;
//         // if (str.length > CONFIG.MAX_BUFFER_LENGTH - size) {
//         //      //console.log("logs str than max length");
            
//         //     let tmp = str.substr(0, CONFIG.MAX_BUFFER_LENGTH - size);
//         //     //  //console.log("tmp str length = ", tmp.length);
//         //     let tmp2 = str.substr(CONFIG.MAX_BUFFER_LENGTH - size, str.length - CONFIG.MAX_BUFFER_LENGTH + size -1 );
//         //     //  //console.log("tmp2 str length = ", tmp2.length);
//         //     str = tmp;
//         //     logsMsg.push(tmp2);
//         // }
//         //  //console.log("str22 length = ", str.length);
//         // UploadLogsMgr._cacheTmpLogs(str);
//         UploadLogsMgr._send(CMD.QYLOG_UPLOAD_MAIN_CMD.value, CMD.QYLOG_UPLOAD_MAIN_CMD.LogWriteReq_CMD, { sText:str});
//     }
// }
// UploadLogsMgr._getLogStr = function () {
//     let str = ""
//     while (logsMsg.length > 0) {
//         let temp = logsMsg[0];
//         let maxLength = UploadLogsMgr._uploadMaxLength();
//         if(temp.length > maxLength-16){
//             temp = temp.substr(0,maxLength-16);
//             temp = temp+"***MAXLENGTH"
//         }
//         if (str.length + temp.length > maxLength) {
//             break;
//         }
//         logsMsg.shift();
//         str = str + temp + "\n";
//     }
//     return str;
// }
// UploadLogsMgr._uploadMaxLength = function () {
//     let size = 1536;
//     let maxLength = CONFIG.MAX_BUFFER_LENGTH - size;
//     return maxLength;
// }
// // UploadLogsMgr._cacheTmpLogs = function (logsMsg) {
// //     tmpLogsMsg = logsMsg;
// // }
// // UploadLogsMgr._restoreTmpLogs = function() {
// //     if (tmpLogsMsg) {
// //          //console.log("_restoreTmpLogs")
// //         logsMsg.unshift(tmpLogsMsg);
// //         tmpLogsMsg = null;
// //     }
// // }
// UploadLogsMgr._stopUploadServerSchedule = function () {
//     // if (cc.director.getScheduler().isScheduled(this._uploadSend, this)) {
//     //     cc.director.getScheduler().unschedule(this._uploadSend, this);
//     // }
//     if (UploadLogsMgr._intervalUpload) {
//         clearInterval(UploadLogsMgr._intervalUpload);
//         UploadLogsMgr._intervalUpload = null;
//     }
// }
// UploadLogsMgr.upload = function (msg) {
//     if (!IS_UPLOAD_LOGS) {
//         return
//     }

//     if (!UploadLogsMgr._isConnected || UploadLogsMgr._isConnected == ConnectStatus.NOCONNECT) {
//         UploadLogsMgr._startReconnect();
//     }
//     let maxLength = UploadLogsMgr._uploadMaxLength();
//     if(msg.length > maxLength-16){
//         let tmp = msg.substr(0,maxLength-16);
//         let tmp2 = msg.substring(tmp.length,msg.length);
//         logsMsg.push(tmp);
//         logsMsg.push(tmp2);
//     }else{
//         logsMsg.push(msg);
//     }
    
// }
// UploadLogsMgr._onGameWebSocketOpen = function (data) {
//     UploadLogsMgr._initData();
// }
// UploadLogsMgr._initData = function () {
//     IS_UPLOAD_LOGS = true;
//     UploadLogsMgr._reConnectTimes = CONFIG.RECONNECT_TIMES;
//     if(ConfigGame.ENABLE_CHANNEL){
//         IS_UPLOAD_LOGS = !!ConfigGame.CUSTOM.ENABLE_UPLOAD_LOG;
//     }
// }
// MsgManager.on(MSG.WEBSOCKET.OPEN, UploadLogsMgr._onGameWebSocketOpen, UploadLogsMgr);
// UploadLogsMgr._initData();

// module.exports = UploadLogsMgr;

// let UploadLogsMgr = {
//     upload: function (params) {
//         // cc.warn("TODO", "UploadLogsMgr.upload");
//     }
// }

let NetworkRecorder = require("NetworkRecorder");
let UploadLogsMgr = NetworkRecorder.default;

module.exports = UploadLogsMgr;