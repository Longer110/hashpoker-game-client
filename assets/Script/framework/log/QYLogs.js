//自定义日志，可能会用来上传日志到服务器
let UploadLogsMgr = require("UploadLogsMgr");
let NetworkStatistics = require("NetworkStatistics");

let url = require("UrlUtil").default;

var QYLogs = cc.Class({
});

let log = function(){};

//所有日志级别
let all     = ['log', 'info', 'warn', 'debug', 'error'];
//CC_BUILD版本忽略以下级别日志在控制台的输出
// let ignore  = [];
let ignore  = ['log', 'info', 'debug']; //直播版 warn 日志也输出，方便app查看日志

let bindConsole = function (isLive) {
    // let disable_console = url.get("console")!="1";
    // if(window.ChessSetConfig&&window.ChessSetConfig.FORCE_DISABLE_CONSOLE){
    //     disable_console = true;
    // }
    
    // let iwarn= ignore.indexOf("warn");
    // if(isLive){
    //     if(iwarn>=0){
    //         //如果是浏览器发布版，并且url不指定 console=1
    //         if(cc.sys.isBrowser && CC_BUILD && disable_console){
    //         }
    //         else{
    //             ignore.splice(iwarn, 1);
    //         }
    //     }
    // }
    // else{
    //     //合集项目默认忽略warn级别日志输出
    //     if(iwarn<0){
    //         ignore.push("warn");
    //     }
    // }
    // let bind = function(key) {
    //     let findIgnore = false;
    //     for (let index = 0; index < ignore.length; index++) {
    //         const element = ignore[index];
    //         if(element==key){
    //             findIgnore = true;
    //             break;
    //         }
    //     }
    
    //     if(console && console[key] && typeof console[key] == 'function'){
    //         log[key] = cc.sys.isBrowser ? console[key].bind(console) : function () {
    //             var allArgs = QYLogs._getArguments.apply(QYLogs, arguments);
    //             console[key].apply(console, allArgs);
    //         }
    //     }

    //     if(key!='info' && typeof cc[key] == 'function'){
    //         cc[key] = function () {
    //             var allArgs = QYLogs._getArguments.apply(QYLogs, arguments);
    //             if(cc.sys.isBrowser){
    //                 if(CC_BUILD && findIgnore && disable_console){
    //                 }
    //                 else
    //                 {
    //                     console[key].apply(console, arguments);
    //                 }
    //             }
    //             else{
    //                 console[key].apply(console, allArgs);
    //             }
    //             let result = cc.js.formatStr.apply(cc, allArgs);
    //             let info = QYLogs._getCurrentTime() + " [" + key.toUpperCase() + "]" + "[cc]\t";
    //             QYLogs._write(info,  [result]);
    //         }
    //     }
    //     if(cc.sys.isBrowser){
    //         if(CC_BUILD && findIgnore && disable_console){
    //             log[key] = function(){};
    //         }
    //     }
    //     if(typeof log[key] != 'function'){
    //         log[key] = function(){};
    //     }
    // }
    
    // for (let index = 0; index < all.length; index++) {
    //     const key = all[index];
    //     bind(key);
    // }
}

// bindConsole();

QYLogs.bindConsole = function (isLive) {
    // bindConsole(isLive);
};

QYLogs.forceDubug = function (params) {
    // console.log = cc.log = QYLogs.log = QYLogs.warn;
}

QYLogs._getCurrentTime = function(){
    // var date = new Date();
    // var y = date.getFullYear();
    // var m = date.getMonth() + 1;
    // m = m < 10 ? ('0' + m) : m;
    // var d = date.getDate();
    // d = d < 10 ? ('0' + d) : d;
    // var h = date.getHours();
    // h = h < 10 ? ('0' + h) : h;
    // var minute = date.getMinutes();
    // var second = date.getSeconds();
    // var millise = date.getMilliseconds();
    // minute = minute < 10 ? ('0' + minute) : minute;
    // second = second < 10 ? ('0' + second) : second;
    // millise = millise < 100 ? ( millise < 10 ? ('00' + millise) : ('0' + millise)) : millise;
    
    // let timestamp =  /*y + '-' + */m + '-' + d + ' ' + h + ':' + minute + ':' + second + '.' + millise;
    // let _milliseconds = QYLogs._milliseconds || "00000";
    // timestamp = timestamp + "." + _milliseconds;
    // return timestamp;
};
QYLogs.debug = function (tag, msg, ...subst) {
    // tag = QYLogs._checkValidString(tag);
    // msg = QYLogs._checkValidString(msg);
    // let timestamp = QYLogs._getCurrentTime();
    // let s = timestamp + "[" + tag + "]" + msg;
    // if(typeof log.debug != "function"){
    //     console.debug(s, subst);
    // }
    // else{
    //     log.debug(s,subst);
    // }

    // let info = timestamp + " [DEBUG] " + "[" + tag + "]" + msg;
    // QYLogs._write(info, subst);
};

QYLogs.log = function (tag, msg, ...subst) {
    // tag = QYLogs._checkValidString(tag);
    // msg = QYLogs._checkValidString(msg);
    // let timestamp = QYLogs._getCurrentTime();
    // let s = timestamp + "[" + tag + "]" + msg;
    // log.log(s, subst);

    // let info = timestamp + " [LOG]   " + "[" + tag + "]" + msg;
    // QYLogs._write(info, subst);
    console.log(tag, msg);
    
};

QYLogs.warn = function (tag, msg, ...subst) {
    // tag = QYLogs._checkValidString(tag);
    // msg = QYLogs._checkValidString(msg);
    // let timestamp = QYLogs._getCurrentTime();
    // let s = timestamp + "[" + tag + "]" + msg;
    // log.warn(s, subst);

    // let info = timestamp + " [WARN]  " + "[" + tag + "]" + msg;
    // QYLogs._write(info, subst);
    console.warn(tag, msg);
};

QYLogs.error = function (tag, msg, ...subst) {
     console.error(tag, msg);
    // tag = QYLogs._checkValidString(tag);
    // msg = QYLogs._checkValidString(msg);
    // let timestamp = QYLogs._getCurrentTime();
    // let s = timestamp + "[" + tag + "]" + msg;
    // log.error(s, subst);

    // let info = timestamp + " [ERROR] " + "[" + tag + "]" + msg;
    // QYLogs._write(info, subst);

    // //埋点
    // let scene = cc.director.getScene();
    // if(scene){//有可能进入首个场景前报错
    //     let sceneName = scene.name;
    //     if(sceneName.charAt(sceneName.length - 2) === "_"){
    //         sceneName = sceneName.substring(0,sceneName.length-2);
    //     }  
    //     NetworkStatistics.default.upload({
    //         sUiPath: sceneName,
    //         sEvent: "error",
    //         ldTime: timestamp,
    //         sReason: info,
    //     });    
    // }
    
    // //for debug
    // if(tag=="NetManager" && Number(msg)==2){
    //     let error = new Error();
    //     let temp = "";
    //     if (error && error.stack) {
    //         temp = "e1 " + error.stack.toString();
    //     } 
    //     else{
    //         let caller = null;
    //         try {
    //             caller = (arguments.callee && arguments.callee.caller) ? arguments.callee.caller : null;
    //         } catch (e) {
    //             caller = null;
    //         }
    //         if(caller){
    //             var ext = [];
    //             var fn = caller;
    //             var floor = 5; //这里只拿5层堆栈信息
    //             while (fn && (--floor > 0)) {
    //                 ext.push(fn.toString());
    //                 if (fn === fn.caller) {
    //                     break; //如果有环
    //                 }
    //                 fn = fn.caller;
    //             }
    //             ext = ext.join(",");
    //             temp = "e2 " + ext;
    //         }
    //     }
    //     QYLogs.log("QYLogs", "调用堆栈", temp);
    // }
};

QYLogs.object = function (tag, msg, ...subst) {
    // tag = QYLogs._checkValidString(tag);
    // msg = QYLogs._checkValidString(msg);
    // let timestamp = QYLogs._getCurrentTime();
    // let s = timestamp + "[" + tag + "]" + msg;
    // log.log(s);

    // if (typeof subst === "object") {
    //     for (let index = 0; index < subst.length; index++) {
    //         const element = subst[index];
    //         QYLogs._object(element, "")
    //     }
    // }

    // let result = [];
    // let info = timestamp + " [OBJECT]" + "[" + tag + "]" + msg;
    // if (typeof subst === "object") {
    //     for (let index = 0; index < subst.length; index++) {
    //         const element = subst[index];
    //         result.push(QYLogs._json(element));
    //     }
    // }
    // QYLogs._write(info, result.join(','));
};
QYLogs._object = function (obj,depth) {
    // let cs = depth + "...."
    // log.log(depth+"{")
    // for (const key in obj) {
    //     if (obj.hasOwnProperty(key)) {
    //         const element = obj[key];
    //         if (typeof element === "object") {
    //             log.log(depth+key," = ")
    //             if (element.length > 0) {
    //                 log.log(depth + " [ ")
    //                 for (let index = 0; index < element.length; index++) {
    //                     const elementSub = element[index];
    //                     if(typeof elementSub != "object"){
    //                         log.log(depth,elementSub)
    //                     }else{
    //                         QYLogs._object(elementSub, cs)   
    //                     }
                        
    //                 }
    //                 log.log(depth + " ] ")
    //             }else{
    //                 QYLogs._object(element, cs)
    //             }
    //         }
    //         else
    //         {
    //             log.log(depth+key," = ", element)
    //         }
    //     }
    // }
    // log.log(depth+"}")
}
QYLogs._json = function (object) {
    // var json = null;
    // try {
    //     json = JSON.stringify(object, null, "\t");
    // } catch (error) {
    //     if(typeof object.toString == 'function'){
    //         json = object.toString();
    //         if(typeof json != 'string'){
    //             json = "[object object]";
    //         }
    //     }
    //     else if(typeof object.valueOf == 'function'){
    //         json = object.valueOf();
    //         if(typeof json != 'string'){
    //             json = "[object object]";
    //         }
    //     }
    //     else{
    //         json = "[object object]";
    //     }
    //     console.warn("[QYLogs]._json:", error);
    // }
    
    // return json;
};
QYLogs._checkValidString = function (object) {
    // let result = object;
    // if (object instanceof Object || typeof object == 'object') {
    //     result = QYLogs._json(object);
    // }
    // return result;
};
QYLogs._getArguments = function () {
    // var allArgs = Array.prototype.slice.call(arguments);
    // for (const key in allArgs) {
    //     let value = allArgs[key];
    //     if (value && (value instanceof Object || typeof value == 'object')) {
    //         allArgs[key] = QYLogs._json(value);
    //     }
    // }
    // return allArgs;
}
QYLogs._write = function (timestamp, args) {
    // if(!(args instanceof Array)){
    //     args = [args];
    // }
    // let allArgs = QYLogs._getArguments.apply(QYLogs, args);
    // let format = timestamp + " " + cc.js.formatStr.apply(cc, allArgs);
    // if(false || !CC_EDITOR && CC_BUILD){
    //     UploadLogsMgr.upload(format);
    // }
   
    // let debugout = window["debugout"];
    // if(!debugout){
    //     console.warn("can not find module [debugout]!");
    //     return;
    // }
    // debugout.log(format);
    
    // // if(CC_DEBUG && cc.sys.isBrowser && !cc.sys.isMobile){
    // //     try {
    // //         let e = new Error();
    // //         let deep = 3;
    // //         let lines = e.stack.split("\n");
    // //         let file = lines[deep];
    // //         console.debug("%c%s","color:blue;font-style:italic; padding:0px", file);
    // //     } catch (error) {
    // //     }
    // // }
}


QYLogs.save = function () {
    // let debugout = window["debugout"];
    // if(!debugout){
    //     console.warn("can not find module [debugout]!");
    //     return;
    // }
    // debugout.save();
}

QYLogs.dumpSysInfo = function () {
    // QYLogs.log("QYLogs", "设备信息");
    // cc.sys.dump();
}

QYLogs._handleError = function(){
    // let ERRORCOUNT = 0;
    // let timestart = 0;
    // let handleError = function (...args) {
    //     ERRORCOUNT++;
    //     if(timestart==0){
    //         timestart = Date.now();
    //     }
    //     if(ERRORCOUNT>3){
    //         let now = Date.now();
    //         if(now-timestart>1000*5){//5秒
    //             ERRORCOUNT = 0;
    //             timestart = now;
    //         }
    //         else{
    //             return;
    //         }
    //     }
    //     let msg = '游戏报错: ' + (cc.sys.isNative ? '原生平台' : '浏览器');
    //     QYLogs.error(msg, ...args);
    //     QYLogs.dumpSysInfo();
    // }

    // if (cc.sys.isNative) {
    //     let __handler
    //     if (window['__errorHandler']) {
    //         __handler = window['__errorHandler']
    //     }
    //     window['__errorHandler'] = function (...args) {
    //         handleError(...args)
    //         if (__handler) {
    //             __handler(...args)
    //         }
    //     }.bind(QYLogs);
    // }
    
    // if (cc.sys.isBrowser) {
    //     let __handler;
    //     if (window.onerror) {
    //         __handler = window.onerror
    //     }
    //     window.onerror = function (msg, url, line, col, error) {
    //         //采用异步的方式,避免阻塞
    //         setTimeout(function () {
    //             col = col || (window.event && window.event.errorCharacter) || 0;
    
    //             let data = {
    //                 url: url,
    //                 line: line,
    //                 col: col,
    //                 msg: msg,
    //             }
    
    //             if (error && error.stack) {
    //                 data.msg = error.stack.toString();
    //             } 
    //             else if (cc.sys.browserType !== cc.sys.BROWSER_TYPE_IE) {
    //                 let caller = null;
    //                 try {
    //                     caller = (arguments.callee && arguments.callee.caller) ? arguments.callee.caller : null;
    //                 } catch (error) {
    //                     caller = null;
    //                 }
    //                 if(caller){
    //                     var ext = [];
    //                     var fn = caller;
    //                     var floor = 3; //这里只拿三层堆栈信息
    //                     while (fn && (--floor > 0)) {
    //                         ext.push(fn.toString());
    //                         if (fn === fn.caller) {
    //                             break; //如果有环
    //                         }
    //                         fn = fn.caller;
    //                     }
    //                     ext = ext.join(",");
    //                     data.msg = ext;
    //                 }
    //             }
    //             var reportData = extendObj({}, data);
    //             handleError(formatParams(reportData));
    //             if (__handler) {
    //                 __handler(reportData)
    //             }
    //         }, 0);
    
    //         return false;
    //     };

    //     function cloneObj(oldObj) { //复制对象方法
    //         if (typeof (oldObj) != 'object') return oldObj;
    //         if (oldObj == null) return oldObj;
    //         var newObj = new Object();
    //         for (var prop in oldObj)
    //             newObj[prop] = oldObj[prop];
    //         return newObj;
    //     };
    //     function extendObj() { //扩展对象
    //         var args = arguments;
    //         if (args.length < 2) {
    //             return;
    //         }
    //         var temp = cloneObj(args[0]); //调用复制对象方法
    //         for (var n = 1, len = args.length; n < len; n++) {
    //             for (var index in args[n]) {
    //                 temp[index] = args[n][index];
    //             }
    //         }
    //         return temp;
    //     }
    //     function formatParams(data) {
    //         var arr = [];
    //         for (var name in data) {
    //             arr.push(name + "=" + data[name]);
    //         }
    //         return arr.join("&");
    //     }
    // }
};
//非编辑器环境下才处理
if(!CC_EDITOR){
    QYLogs._handleError();
}

window['QYLogs'] = QYLogs;
